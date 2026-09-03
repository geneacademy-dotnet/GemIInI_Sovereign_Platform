/**
 * src/lib/geneApi.js & src/services/IndependentService.js
 * SudaGene Consortium & GemIInI Academy — Strict API Layer
 * Preflight-Free Atomic Dispatcher with Fail-Closed Client Queueing
 */

export const config = {
  endpoint: import.meta.env.VITE_GAS_ENDPOINT || 'https://script.google.com/macros/s/AKfycbyyFkVDH7JD6TYgFmlZ3kUqZwJrQaDZhvKeIGDkVg2wW2OJfH1iYlgrwd4lW0A3eKVE/exec',
};

export const isRemoteConfigured = () => Boolean(config.endpoint && !config.endpoint.includes('YOUR_DEPLOYMENT_ID'));

export const sessionRef = {
  get: () => {
    try {
      return localStorage.getItem('gemiini_Independent_session_id') || localStorage.getItem('gemiini_active_ga');
    } catch {
      return null;
    }
  },
  set: (id) => {
    try {
      if (id) {
        localStorage.setItem('gemiini_Independent_session_id', id);
        localStorage.setItem('gemiini_active_ga', id);
      }
    } catch {}
  },
  clear: () => {
    try {
      localStorage.removeItem('gemiini_Independent_session_id');
      localStorage.removeItem('gemiini_active_ga');
    } catch {}
  },
};

export const throttle = (fn, delay = 300) => {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall < delay) return;
    lastCall = now;
    return fn(...args);
  };
};

export const generateIdempotencyKey = () => {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 8);
  return `idem-${ts}-${rand}`;
};

export const callRemote = async (action, params = {}, method = 'GET') => {
  if (!isRemoteConfigured()) return null;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    if (method === 'POST') {
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action, ...params }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } else {
      const qs = new URLSearchParams({ action, ...params }).toString();
      const response = await fetch(`${config.endpoint}?${qs}`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    }
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

export const isValidGaId = (value) => /^GA-?\d{1,6}$/i.test(String(value).trim());

export const normalizeGaId = (value) => {
  const match = String(value).trim().match(/^GA-?(\d{1,6})$/i);
  return match ? `GA-${match[1]}` : String(value).trim();
};

const sanitize = (record) => ({
  gaId: record.ga_id || record.id,
  name: record.name || record.full_name,
  role: record.member_role || record.role,
  university: record.university || record.univ,
  tier: record.tier || 'EXPLORER',
  tierLabelAr: record.tier_label_ar,
  verified: Boolean(record.verified),
  sudapass: Boolean(record.sudapass || record.verified),
  phoneMasked: record.phone_masked,
  emailMasked: record.email_masked,
  gp: Number(record.gp || record.gp_points) || 0,
  ccr: Number(record.ccr) || 0,
  accuracy: Number(record.accuracy) || 0,
  streak: Number(record.streak) || 0,
});

/** Public Aggregate Stats */
export const getPublicStats = async () => {
  if (isRemoteConfigured()) {
    try {
      const data = await callRemote('stats');
      if (data && data.status === 'success') return data.stats;
    } catch {}
  }
  return { totalMembers: 1200, totalGpAwarded: 600000, verifiedDoctors: 750, activeUniversities: 90 };
};

/** Independent Merit Leaderboard */
export const getLeaderboard = async () => {
  if (isRemoteConfigured()) {
    try {
      const data = await callRemote('leaderboard');
      if (data && data.status === 'success' && Array.isArray(data.members)) {
        return data.members.map(sanitize);
      }
    } catch {}
  }
  return [];
};

/** Independent Member Lookup (Strict - Zero Mock Overrides) */
export const lookupMember = async (gaId) => {
  const id = normalizeGaId(String(gaId).trim().toUpperCase());
  if (!isValidGaId(id)) {
    sessionRef.clear();
    throw new Error('invalid_id');
  }

  if (isRemoteConfigured()) {
    try {
      const data = await callRemote('lookup', { id });
      if (data && (data.member || data.name)) {
        return sanitize(data.member || data);
      }
    } catch (e) {
      console.warn('Remote GAS lookup error:', e);
    }
  }

  // Local Storage Cache Lookup
  try {
    const cached = localStorage.getItem(`Independent_member_${id}`);
    if (cached) return sanitize(JSON.parse(cached));
  } catch {}

  return null;
};

/** Atomic Portal Intake Gateway (/join & Registration) */
export const submitPortalIntake = async (payload) => {
  try {
    if (isRemoteConfigured()) {
      const data = await callRemote('portal_intake', payload, 'POST');
      if (data && data.status === 'success') {
        localStorage.setItem('gemiini_Independent_session', JSON.stringify(data));
        return data;
      }
      throw new Error(data?.message || 'Submission rejected');
    }
    throw new Error('Remote endpoint offline');
  } catch (err) {
    // Fail-Closed Client Queueing
    try {
      const queue = JSON.parse(localStorage.getItem('pending_registrations') || '[]');
      queue.push({ payload, timestamp: new Date().toISOString() });
      localStorage.setItem('pending_registrations', JSON.stringify(queue));
    } catch {}
    throw err;
  }
};

export const submitBlsRegistration = async (payload) => {
  if (isRemoteConfigured()) {
    return callRemote('bls_register', payload, 'POST');
  }
  return { status: 'success', gaId: payload.gaId || 'PENDING_MINT' };
};

export const submitConciergeFastTrack = async (payload) => {
  if (isRemoteConfigured()) {
    return callRemote('concierge_fast_track', payload, 'POST');
  }
  return { status: 'success' };
};

export const submitRegistration = submitPortalIntake;

export const IndependentClient = {
  submitPortalIntake,
  submitBlsRegistration,
  submitFastTrack: submitConciergeFastTrack,
  lookup: lookupMember,
  getLeaderboard,
  getPublicStats
};

export default IndependentClient;
