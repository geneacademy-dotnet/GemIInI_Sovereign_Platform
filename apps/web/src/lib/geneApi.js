/**
 * Isolated service layer for the optional Google Apps Script / Google Sheets + Drive backend.
 *
 * SECURITY CONTRACT
 * - No admin key, service account or Drive credential may ever live in this
 *   file or anywhere else in the browser bundle. Admin-only operations
 *   (bulk extraction) MUST be proxied by a server-side endpoint that holds the
 *   secret and applies least-privilege access.
 * - Only sanitized/masked fields are requested and rendered publicly.
 * - When no endpoint is configured the layer falls back to the PocketBase
 *   application backend, which is the source of truth for auth and sessions.
 *
 * Configure with Vite env vars (see .env):
 *   VITE_GAS_ENDPOINT     public Apps Script web-app URL (read-only ops)
 *   VITE_GAS_PUBLIC_TOKEN low-privilege public token, optional
 *   VITE_ADMIN_PROXY_PATH server-side proxy path for admin-only operations
 */

import pb from '@/lib/pocketbaseClient';

export const config = {
    endpoint: import.meta.env.VITE_GAS_ENDPOINT || '',
    publicToken: import.meta.env.VITE_GAS_PUBLIC_TOKEN || '',
    adminProxyPath: import.meta.env.VITE_ADMIN_PROXY_PATH || '',
};

export const isRemoteConfigured = () => Boolean(config.endpoint);

const SESSION_KEY = 'ga_session_ref';

/** Non-sensitive session identifier only. Never store tokens or GP data. */
export const sessionRef = {
    get: () => localStorage.getItem(SESSION_KEY) || '',
    set: (value) => localStorage.setItem(SESSION_KEY, String(value).slice(0, 64)),
    clear: () => localStorage.removeItem(SESSION_KEY),
};

const RATE_LIMIT_MS = 1200;
let lastCallAt = 0;

const throttle = async () => {
    const wait = RATE_LIMIT_MS - (Date.now() - lastCallAt);
    if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
    lastCallAt = Date.now();
};

const callRemote = async (action, params = {}) => {
    await throttle();
    const url = new URL(config.endpoint);
    url.searchParams.set('action', action);
    if (config.publicToken) url.searchParams.set('token', config.publicToken);
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

    const response = await fetch(url.toString(), {
        headers: { Accept: 'application/json' },
    });
    if (response.status === 429) throw new Error('rate_limited');
    if (!response.ok) throw new Error(`request_failed_${response.status}`);
    return response.json();
};

/**
 * Validates GA-ID with or without hyphen (e.g. GA-1234, GA1234, GA001, GA20801)
 */
export const isValidGaId = (value) => /^GA-?\d{1,6}$/i.test(String(value).trim());

export const normalizeGaId = (value) => {
    const raw = String(value || '').trim().toUpperCase();
    if (!raw) return '';
    if (raw.startsWith('GA-')) return raw;
    if (raw.startsWith('GA')) return `GA-${raw.slice(2)}`;
    return `GA-${raw}`;
};

const sanitize = (record) => ({
    gaId: record.ga_id || record.id,
    name: record.name,
    role: record.member_role || record.role,
    university: record.university || record.univ,
    tier: record.tier,
    tierLabelAr: record.tier_label_ar || record.tierLabel,
    verified: Boolean(record.verified),
    sudapass: Boolean(record.sudapass || record.sudaPass),
    phoneMasked: record.phone_masked || record.phoneMasked,
    emailMasked: record.email_masked || record.emailMasked,
});

/** Public aggregate statistics — contains no personal data. */
export const getPublicStats = async () => {
    if (isRemoteConfigured()) return callRemote('stats');
    const list = await pb.collection('ga_directory').getList(1, 1, {
        requestKey: 'ga-stats',
    });
    return { members: list.totalItems, courses: 28, countries: 14 };
};

/** Sanitized single GA-ID lookup. Accepts both GA-1234 and GA1234. */
export const lookupMember = async (gaId) => {
    const raw = String(gaId).trim().toUpperCase();
    if (!isValidGaId(raw)) {
        sessionRef.clear();
        throw new Error('invalid_id');
    }
    const id = normalizeGaId(raw);

    if (isRemoteConfigured()) {
        const data = await callRemote('lookup', { id });
        return data ? sanitize(data) : null;
    }
    try {
        const record = await pb
            .collection('ga_directory')
            .getFirstListItem(pb.filter('ga_id = {:id} || ga_id = {:raw}', { id, raw }), {
                requestKey: `lookup-${id}`,
            });
        sessionRef.set(record.ga_id);
        return sanitize(record);
    } catch (error) {
        sessionRef.clear();
        if (error?.status === 404) return null;
        throw error;
    }
};

/** Sanitized search across the public directory. */
export const searchMembers = async (query) => {
    const q = String(query || '').trim();
    if (q.length < 2) return [];
    if (isRemoteConfigured()) {
        const data = await callRemote('search', { q });
        return (data?.items || []).map(sanitize);
    }
    const list = await pb.collection('ga_directory').getList(1, 20, {
        filter: pb.filter('name ~ {:q} || university ~ {:q} || ga_id ~ {:q}', { q }),
        requestKey: 'ga-search',
    });
    return list.items.map(sanitize);
};

/** Registration ingestion — queued for admin review. */
export const submitRegistration = async (payload) => {
    const body = {
        full_name: payload.fullName,
        email: payload.email,
        phone: payload.phone || '',
        member_role: payload.role || '',
        university: payload.university || '',
        interest: payload.interest || '',
        status: 'pending_review',
    };
    if (isRemoteConfigured()) return callRemote('register', body);
    return pb.collection('ga_registrations').create(body, {
        requestKey: `register-${Date.now()}`,
    });
};

/**
 * BLS workshop registration (Dokki, Cairo — Aug 28, 2026).
 * Routes through the remote proxy with snake_case contract when configured.
 */
export const submitBlsRegistration = async (payload) => {
    const body = {
        workshop: payload.workshop || 'bls_dokki_2026_08_28',
        full_name: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        transaction_id: payload.transactionId || '',
        gp_applied: Boolean(payload.gpApplied),
        patron_booster: Boolean(payload.patronBooster),
        referral_id: payload.referralId || '',
        status: payload.gpApplied ? 'pending_gp_confirmation' : 'pending_payment_verification',
    };
    if (isRemoteConfigured()) return callRemote('bls_register', body);

    try {
        const record = await pb.collection('ga_registrations').create(
            { ...body, member_role: 'bls_workshop_2026_08_28' },
            { requestKey: `bls-register-${Date.now()}` },
        );
        return {
            gaId: null,
            unlockSabriCv: false,
            recordId: record.id,
            status: 'success'
        };
    } catch (err) {
        // Fall back to local queue gracefully
        const existing = JSON.parse(localStorage.getItem('gemiini_pending_registrations') || '[]');
        existing.push({ ...body, queuedAt: new Date().toISOString() });
        localStorage.setItem('gemiini_pending_registrations', JSON.stringify(existing));
        return {
            gaId: null,
            unlockSabriCv: false,
            isOfflineFallback: true,
            status: 'pending_offline',
            message: 'Master ledger unreachable. Your registration is securely saved in the local queue.'
        };
    }
};

/** Admin-only bulk extraction. */
export const bulkExtract = async (range) => {
    if (!config.adminProxyPath) throw new Error('admin_proxy_not_configured');
    const response = await fetch(`${config.adminProxyPath}?range=${encodeURIComponent(range)}`, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${pb.authStore.token}`,
        },
    });
    if (!response.ok) throw new Error(`admin_request_failed_${response.status}`);
    return response.json();
};
