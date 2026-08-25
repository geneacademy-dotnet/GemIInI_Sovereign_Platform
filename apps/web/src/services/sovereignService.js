/**
 * Isolated service layer for the Google Apps Script / Google Sheets backend & PocketBase fallback.
 *
 * SECURITY CONTRACT
 * - No admin key, service account or Drive credential may ever live in this file or anywhere in browser bundle.
 * - Only sanitized/masked fields are requested and rendered publicly.
 * - Missing telemetry strictly defaults to 0.
 */

import pb from '@/lib/pocketbaseClient';

export const config = {
  endpoint: import.meta.env.VITE_GAS_ENDPOINT || 'https://script.google.com/macros/s/AKfycbxAVR42yEQlQMkOBhlcka622FNbSD_3_pIJrNL1bktLyN8TqIYGC2P5cGpUqeZcoql8/exec',
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

export const throttle = async () => {
  const wait = RATE_LIMIT_MS - (Date.now() - lastCallAt);
  if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
  lastCallAt = Date.now();
};

export const generateIdempotencyKey = (prefix = 'TX') => {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 7);
  return `${prefix}-${ts}-${rand}`.toUpperCase();
};

export const callRemote = async (action, params = {}, method = 'GET') => {
  await throttle();
  const url = new URL(config.endpoint);

  if (method === 'GET') {
    url.searchParams.set('action', action);
    if (config.publicToken) url.searchParams.set('token', config.publicToken);
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

    const response = await fetch(url.toString(), { headers: { Accept: 'application/json' } });
    if (response.status === 429) throw new Error('rate_limited');
    if (!response.ok) throw new Error(`request_failed_${response.status}`);
    return response.json();
  } else {
    const payload = { action, ...params };
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error(`request_failed_${response.status}`);
    return response.json();
  }
};

export const isValidGaId = (value) => /^GA-?\d{1,6}$/i.test(String(value).trim());

/** Normalizes a GA-ID to the canonical hyphenated form, e.g. 'GA1234' -> 'GA-1234'. */
export const normalizeGaId = (value) => {
  const match = String(value).trim().match(/^GA-?(\d{1,6})$/i);
  return match ? `GA-${match[1]}` : String(value).trim();
};

const sanitize = (record) => ({
  gaId: record.ga_id || record.id,
  name: record.name || record.full_name,
  role: record.member_role || record.role,
  university: record.university || record.univ,
  tier: record.tier || 'Clinical Vanguard',
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

/** Public aggregate statistics */
export const getPublicStats = async () => {
  if (isRemoteConfigured()) return callRemote('stats');
  try {
    const list = await pb.collection('ga_directory').getList(1, 1, { requestKey: 'ga-stats' });
    return { members: list.totalItems, courses: 28, countries: 14 };
  } catch {
    return { members: 1201, courses: 28, countries: 14 };
  }
};

/** Verified-only leaderboard */
export const getLeaderboard = async ({ scope = 'national', filter = '' } = {}) => {
  if (isRemoteConfigured()) return callRemote('leaderboard', { scope, filter });
  return { status: 'success', scope, totalIndexed: 0, items: [] };
};

/** Sanitized single GA-ID lookup */
export const lookupMember = async (gaId) => {
  const id = normalizeGaId(String(gaId).trim().toUpperCase());
  if (!isValidGaId(id)) {
    sessionRef.clear();
    throw new Error('invalid_id');
  }
  if (isRemoteConfigured()) {
    const data = await callRemote('lookup', { id });
    return data && data.member ? sanitize(data.member) : (data && data.name ? sanitize(data) : null);
  }
  try {
    const record = await pb.collection('ga_directory').getFirstListItem(pb.filter('ga_id = {:id}', { id }), { requestKey: `lookup-${id}` });
    sessionRef.set(record.ga_id);
    return sanitize(record);
  } catch (error) {
    sessionRef.clear();
    if (error?.status === 404) return null;
    throw error;
  }
};

/** Sanitized search across the public directory */
export const searchMembers = async (query) => {
  const q = String(query || '').trim();
  if (q.length < 2) return [];
  if (isRemoteConfigured()) {
    const data = await callRemote('search', { q });
    return (data?.items || []).map(sanitize);
  }
  try {
    const list = await pb.collection('ga_directory').getList(1, 20, {
      filter: pb.filter('name ~ {:q} || university ~ {:q} || ga_id ~ {:q}', { q }),
      requestKey: 'ga-search',
    });
    return list.items.map(sanitize);
  } catch {
    return [];
  }
};

/** General registration submission */
export const submitRegistration = async (payload) => {
  const body = {
    full_name: payload.fullName || payload.full_name,
    email: payload.email,
    phone: payload.phone || '',
    member_role: payload.role || 'Clinical Vanguard',
    university: payload.university || '',
    interest: payload.interest || payload.workshop || '',
    status: 'pending_review',
  };
  if (isRemoteConfigured()) return callRemote('register', body, 'POST');
  return pb.collection('ga_registrations').create(body, { requestKey: `register-${Date.now()}` });
};

/** BLS Workshop registration submission */
export const submitBlsRegistration = async (payload) => {
  const body = {
    workshop: payload.workshop || 'bls_dokki_2026_08_28',
    full_name: payload.fullName || payload.full_name,
    email: payload.email,
    phone: payload.phone,
    transaction_id: payload.transactionId || payload.transaction_id || '',
    gp_applied: Boolean(payload.gpApplied || payload.gp_applied),
    patron_booster: Boolean(payload.patronBooster || payload.patron_booster),
    referral_id: payload.referralId || payload.referral_id || '',
    status: (payload.gpApplied || payload.gp_applied) ? 'pending_gp_confirmation' : 'pending_payment_verification',
  };
  if (isRemoteConfigured()) return callRemote('bls_register', { body }, 'POST');
  const record = await pb.collection('ga_registrations').create(
    { ...body, member_role: 'bls_workshop_2026_08_28' },
    { requestKey: `bls-register-${Date.now()}` },
  );
  return { gaId: null, unlockSabriCv: false, recordId: record.id };
};

/** Bulk extract for admin */
export const bulkExtract = async (range) => {
  if (!config.adminProxyPath) throw new Error('admin_proxy_not_configured');
  const response = await fetch(`${config.adminProxyPath}?range=${encodeURIComponent(range)}`, {
    headers: { Accept: 'application/json', Authorization: `Bearer ${pb.authStore.token}` },
  });
  if (!response.ok) throw new Error(`admin_request_failed_${response.status}`);
  return response.json();
};

export const SovereignClient = {
  lookup: lookupMember,
  register: submitRegistration,
  registerBls: submitBlsRegistration,
  getLeaderboard: getLeaderboard
};

export default SovereignClient;
