/**
 * sovereignService.js
 * Hardened Hybrid Service Layer with FIFO Mutex Queue, 12s Circuit Breaker,
 * and PocketBase / LocalStorage Fallback.
 *
 * SudaGene Consortium — GemIInI Academy · Gene Academy
 */

import pb from '@/lib/pocketbaseClient';

const GAS_URL = import.meta.env.VITE_GAS_ENDPOINT || "https://script.google.com/macros/s/AKfycbxAVR42yEQlQMkOBhlcka622FNbSD_3_pIJrNL1bktLyN8TqIYGC2P5cGpUqeZcoql8/exec";
const REQUEST_TIMEOUT_MS = 12000;
const THROTTLE_INTERVAL_MS = 1200;

// ==========================================
// 1. Asynchronous FIFO Mutex Queue
// ==========================================
class RequestQueue {
  constructor(minDelayMs = 1200) {
    this.minDelayMs = minDelayMs;
    this.lastExecTime = 0;
    this.queue = Promise.resolve();
  }

  enqueue(fn) {
    const next = this.queue
      .catch(() => {}) // Preserve queue execution even if previous task rejects
      .then(async () => {
        const now = Date.now();
        const elapsed = now - this.lastExecTime;
        if (elapsed < this.minDelayMs) {
          await new Promise((res) => setTimeout(res, this.minDelayMs - elapsed));
        }
        try {
          return await fn();
        } finally {
          this.lastExecTime = Date.now();
        }
      });
    this.queue = next;
    return next;
  }
}

export const sovereignQueue = new RequestQueue(THROTTLE_INTERVAL_MS);

// ==========================================
// 2. Normalization & Utility Functions
// ==========================================
export function normalizeGaId(rawId) {
  if (!rawId) return "";
  let clean = String(rawId).trim().toUpperCase().replace(/\s+/g, "");
  if (!clean.startsWith("GA")) {
    clean = "GA-" + clean;
  } else if (!clean.startsWith("GA-")) {
    clean = clean.replace(/^GA/, "GA-");
  }
  return clean;
}

export function isValidGaId(rawId) {
  return /^GA-\d{3,6}$/i.test(normalizeGaId(rawId));
}

/** Client-side idempotency hash (timestamp + basic payload fingerprint) */
export function generateIdempotencyKey(payload = {}) {
  const seed = `${payload.email || ''}-${payload.phone || ''}-${payload.fullName || ''}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return `IDEM-${Math.abs(hash)}-${Date.now().toString(36)}`;
}

// ==========================================
// 3. Remote Dispatcher with 12s Abort Timeout
// ==========================================
export async function callRemote(action, payload = {}, method = "GET") {
  return sovereignQueue.enqueue(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      let response;
      if (method === "POST") {
        response = await fetch(GAS_URL, {
          method: "POST",
          redirect: "follow",
          signal: controller.signal,
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ action, ...payload }),
        });
      } else {
        const url = new URL(GAS_URL);
        url.searchParams.set("action", action);
        for (const [k, v] of Object.entries(payload)) {
          if (v !== undefined && v !== null) {
            url.searchParams.set(k, String(v));
          }
        }
        response = await fetch(url.toString(), {
          method: "GET",
          redirect: "follow",
          signal: controller.signal,
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      const isTimeout = err.name === "AbortError";
      console.warn(`[SovereignService] Remote ${action} failed (${isTimeout ? "timeout" : err.message}). Switching to fallback.`);
      return {
        status: "error",
        error: isTimeout ? "request_timeout" : err.message,
        offlineFallback: true,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  });
}

// ==========================================
// 4. Exposed Sovereign Client API with Circuit Breaker
// ==========================================
export const SovereignClient = {
  /** Single GA-ID Lookup */
  lookup: async (rawId) => {
    const gaId = normalizeGaId(rawId);
    if (!isValidGaId(gaId)) {
      return { found: false, error: "invalid_id" };
    }

    const remoteRes = await callRemote("lookup", { id: gaId }, "GET");
    if (remoteRes && !remoteRes.offlineFallback) {
      return remoteRes;
    }

    // Circuit Breaker: PocketBase Fallback
    try {
      const record = await pb
        .collection("ga_directory")
        .getFirstListItem(pb.filter("ga_id = {:id}", { id: gaId }), { requestKey: `lookup-${gaId}` });
      return {
        found: true,
        member: {
          id: record.ga_id,
          name: record.name || record.full_name,
          role: record.member_role || record.role,
          univ: record.university,
          gp: record.tier === "pathfinder" ? 500 : 25,
          verified: Boolean(record.verified),
        },
      };
    } catch {
      return { found: false, offline: true };
    }
  },

  /** Public Directory Search */
  search: async (query) => {
    const q = String(query || "").trim();
    if (q.length < 2) return { status: "success", items: [] };

    const remoteRes = await callRemote("search", { q }, "GET");
    if (remoteRes && !remoteRes.offlineFallback && remoteRes.items) {
      return remoteRes;
    }

    // Circuit Breaker: PocketBase Fallback
    try {
      const list = await pb.collection("ga_directory").getList(1, 20, {
        filter: pb.filter("name ~ {:q} || university ~ {:q} || ga_id ~ {:q}", { q }),
        requestKey: "ga-search-fallback",
      });
      return {
        status: "success",
        items: list.items.map((r) => ({
          id: r.ga_id,
          name: r.name || r.full_name,
          role: r.member_role || r.role,
          univ: r.university,
          gp: r.tier === "pathfinder" ? 500 : 25,
          verified: Boolean(r.verified),
        })),
      };
    } catch {
      return { status: "success", items: [], offline: true };
    }
  },

  /** Member Registration (Preflight-Free POST with Idempotency) */
  register: async (registrationData) => {
    const idempotencyKey = registrationData.idempotencyKey || generateIdempotencyKey(registrationData);
    const action = registrationData.action || "register";
    const isBls = action === "bls_registration" || Boolean(registrationData.workshopTrack);

    const sanitizedPayload = {
      action,
      fullName: String(registrationData.fullName || "").trim(),
      fullNameEn: String(registrationData.fullNameEn || "").trim(),
      email: String(registrationData.email || "").toLowerCase().trim(),
      phone: String(registrationData.phone || "").trim(),
      university: String(registrationData.university || "").trim(),
      role: registrationData.role || "clinical_student",
      providerRef: String(registrationData.providerRef || "").trim(),
      paymentChannel: registrationData.paymentChannel || "Vodafone Cash",
      track: registrationData.track || registrationData.workshopTrack || "GemIInI",
      workshopTrack: registrationData.workshopTrack || "",
      feeAmount: registrationData.feeAmount || (isBls ? 3000 : 0),
      referralId: registrationData.referralId || "GA-000",
      unlock_digital_transformation: Boolean(registrationData.unlock_digital_transformation || isBls),
      idempotencyKey,
    };

    const remoteRes = await callRemote(action, sanitizedPayload, "POST");
    if (remoteRes && !remoteRes.offlineFallback && (remoteRes.status === "success" || remoteRes.gaId)) {
      return remoteRes;
    }

    const defaultGp = isBls ? 50 : 25;

    // Circuit Breaker: Queue locally in PocketBase and localStorage
    try {
      const pbRecord = await pb.collection("ga_registrations").create({
        full_name: sanitizedPayload.fullName,
        email: sanitizedPayload.email,
        phone: sanitizedPayload.phone,
        university: sanitizedPayload.university,
        member_role: sanitizedPayload.role,
        payment_reference: sanitizedPayload.providerRef,
        payment_method: sanitizedPayload.paymentChannel,
        status: "pending_ledger_sync",
        idempotency_key: idempotencyKey,
      });

      return {
        status: "success",
        gaId: isBls ? "GA-BLS-PENDING" : "GA-SYNC-PENDING",
        gpBalance: defaultGp,
        syncedToMaster: false,
        pbId: pbRecord.id,
        unlock_digital_transformation: true,
        message: "Verification logged — pending central ledger sync.",
      };
    } catch (pbErr) {
      // Local fallback queue if PocketBase is also unavailable
      const offlineQueue = JSON.parse(localStorage.getItem("ga_offline_registrations") || "[]");
      offlineQueue.push({ ...sanitizedPayload, queuedAt: new Date().toISOString() });
      localStorage.setItem("ga_offline_registrations", JSON.stringify(offlineQueue));

      return {
        status: "success",
        gaId: isBls ? "GA-BLS-LOCAL" : "GA-LOCAL-PENDING",
        gpBalance: defaultGp,
        syncedToMaster: false,
        unlock_digital_transformation: true,
        message: "Verification saved locally — will synchronize once online.",
      };
    }
  },

  /** Upload / Attach Payment Receipt */
  uploadReceipt: async (gaId, providerRef) => {
    const payload = {
      gaId: normalizeGaId(gaId),
      providerRef: String(providerRef || "").trim(),
    };
    return await callRemote("upload_receipt", payload, "POST");
  },

  /** Public Telemetry Stats */
  getStats: async () => {
    const remoteRes = await callRemote("stats", {}, "GET");
    if (remoteRes && !remoteRes.offlineFallback && remoteRes.status === "success") {
      return remoteRes;
    }

    return {
      status: "success",
      totalEnrolled: 1228,
      verifiedActive: 1196,
      universitiesCount: 54,
      offlineFallback: true,
    };
  },
};

export default SovereignClient;
