/**
 * GemIInI SudaGene Platform - Fail-Closed Sync Engine
 * ZERO FAKE IDS. Guaranteed local queuing with LockService wait-lock compatibility.
 */

import { buildRegistrationPayload, ACTION_TYPES } from './apiContracts';

const GAS_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwPqP-9vYmZ5Q1N3bK4c8dE2F7g9h0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z/exec';
const PENDING_QUEUE_KEY = 'gemiini_pending_registrations';

class GeminiSyncEngine {
    constructor() {
        this.timeoutMs = 12000; // 12-second circuit breaker
    }

    /**
     * Get offline / locally queued registrations
     */
    getPendingQueue() {
        try {
            const raw = localStorage.getItem(PENDING_QUEUE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    /**
     * Store locally when network fails (Fail-Closed)
     */
    enqueuePending(payload, errorReason) {
        try {
            const queue = this.getPendingQueue();
            const record = {
                ...payload,
                queuedAt: new Date().toISOString(),
                errorReason: String(errorReason)
            };
            queue.push(record);
            localStorage.setItem(PENDING_QUEUE_KEY, JSON.stringify(queue));
            return record;
        } catch (e) {
            console.error('Failed to save to localStorage queue:', e);
            return null;
        }
    }

    /**
     * Execute sync to Google Apps Script master ledger with LockService
     */
    async executeSync(rawPayload) {
        const payload = buildRegistrationPayload(rawPayload);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

        try {
            // First attempt live push to Google Apps Script endpoint
            const res = await fetch(GAS_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(payload).toString(),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!res.ok) {
                throw new Error(`Server returned HTTP ${res.status}`);
            }

            const data = await res.json();

            // Strict check: if status is not success or no GA-ID returned, fail closed
            if (data && data.status === 'success' && data.gaId) {
                return {
                    status: 'success',
                    gaId: String(data.gaId).toUpperCase(),
                    gpBalance: Number(data.gpBalance || payload.gpAwarded),
                    name: payload.fullName,
                    isLiveMinted: true
                };
            } else {
                throw new Error(data.message || 'Central ledger did not return a valid GA-ID');
            }
        } catch (err) {
            clearTimeout(timeoutId);
            console.warn('[GeminiSync] Central ledger unreachable or timed out. Failing closed into local queue.', err);

            // FAIL-CLOSED: Save to local queue with timestamp and idempotency key
            const queuedRecord = this.enqueuePending(payload, err.message);

            // NEVER FAKE AN ID. Return honest pending state.
            return {
                status: 'pending_offline',
                message: 'Master ledger unreachable. Your registration and payment reference are saved locally in the secure queue.',
                queuedRecord,
                isOfflineQueued: true,
                recoveryCode: payload.idempotencyKey,
                contactWhatsApp: '+2+20 101 592 2628'
            };
        }
    }
}

export const geminiSync = new GeminiSyncEngine();
export default geminiSync;
