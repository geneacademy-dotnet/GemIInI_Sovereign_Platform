/**
 * Isolated service layer for the optional Google Apps Script / Google Sheets +
 * Drive backend.
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
 *   VITE_GAS_ENDPOINT        public Apps Script web-app URL (read-only ops)
 *   VITE_GAS_PUBLIC_TOKEN    low-privilege public token, optional
 *   VITE_ADMIN_PROXY_PATH    server-side proxy path for admin-only operations
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

    const response = await fetch(url.toString(), { headers: { Accept: 'application/json' } });
    if (response.status === 429) throw new Error('rate_limited');
    if (!response.ok) throw new Error(`request_failed_${response.status}`);
    return response.json();
};

export const isValidGaId = (value) => /^GA-\d{3,6}$/i.test(String(value).trim());

const sanitize = (record) => ({
    gaId: record.ga_id,
    name: record.name,
    role: record.member_role,
    university: record.university,
    tier: record.tier,
    tierLabelAr: record.tier_label_ar,
    verified: Boolean(record.verified),
    sudapass: Boolean(record.sudapass),
    phoneMasked: record.phone_masked,
    emailMasked: record.email_masked,
});

/** Public aggregate statistics — contains no personal data. */
export const getPublicStats = async () => {
    if (isRemoteConfigured()) return callRemote('stats');
    const list = await pb.collection('ga_directory').getList(1, 1, { requestKey: 'ga-stats' });
    return { members: list.totalItems, courses: 28, countries: 14 };
};

/** Sanitized single GA-ID lookup. */
export const lookupMember = async (gaId) => {
    const id = String(gaId).trim().toUpperCase();
    if (!isValidGaId(id)) {
        sessionRef.clear();
        throw new Error('invalid_id');
    }
    if (isRemoteConfigured()) {
        const data = await callRemote('lookup', { id });
        return data ? sanitize(data) : null;
    }
    try {
        const record = await pb
            .collection('ga_directory')
            .getFirstListItem(pb.filter('ga_id = {:id}', { id }), { requestKey: `lookup-${id}` });
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
        full_name_en: payload.fullNameEn || '',
        email: payload.email,
        phone: payload.phone || '',
        member_role: payload.role || (payload.track === 'gemiini' ? 'clinical_vanguard' : payload.track === 'gene' ? 'molecular_fellow' : 'student'),
        university: payload.university || '',
        track: payload.track || 'gemiini',
        tier: payload.tier || 'explorer',
        interest: payload.interest || payload.track || '',
        payment_method: payload.paymentMethod || 'bankak',
        payment_reference: payload.paymentReference || '',
        status: 'pending_review',
        submitted_at: new Date().toISOString(),
    };
    if (isRemoteConfigured()) return callRemote('register', body);
    return pb.collection('ga_registrations').create(body, { requestKey: `register-${Date.now()}` });
};

/**
 * Admin-only bulk extraction. Never call the Apps Script admin endpoint
 * directly from the browser — this always routes through a server-side proxy
 * that holds the admin key.
 */
export const bulkExtract = async (range) => {
    if (!config.adminProxyPath) throw new Error('admin_proxy_not_configured');
    const response = await fetch(`${config.adminProxyPath}?range=${encodeURIComponent(range)}`, {
        headers: { Accept: 'application/json', Authorization: `Bearer ${pb.authStore.token}` },
    });
    if (!response.ok) throw new Error(`admin_request_failed_${response.status}`);
    return response.json();
};
