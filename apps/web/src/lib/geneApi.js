/**
 * geneApi.js
 * Hybrid Data Layer Re-exporting SovereignClient with Circuit Breaker,
 * Mutex FIFO Queue, and PocketBase Fallback.
 *
 * SudaGene Consortium — GemIInI Academy · Gene Academy
 */

import SovereignClient, {
  normalizeGaId,
  isValidGaId,
  generateIdempotencyKey,
  callRemote,
  sovereignQueue,
} from '@/services/sovereignService';

export {
  SovereignClient,
  normalizeGaId,
  isValidGaId,
  generateIdempotencyKey,
  callRemote,
  sovereignQueue,
};

export const config = {
  endpoint: import.meta.env.VITE_GAS_ENDPOINT || "https://script.google.com/macros/s/AKfycbxAVR42yEQlQMkOBhlcka622FNbSD_3_pIJrNL1bktLyN8TqIYGC2P5cGpUqeZcoql8/exec",
  publicToken: import.meta.env.VITE_GAS_PUBLIC_TOKEN || '',
  adminProxyPath: import.meta.env.VITE_ADMIN_PROXY_PATH || '',
};

export const isRemoteConfigured = () => Boolean(config.endpoint);

const SESSION_KEY = 'ga_session_ref';

export const sessionRef = {
  get: () => localStorage.getItem(SESSION_KEY) || '',
  set: (value) => localStorage.setItem(SESSION_KEY, String(value).slice(0, 64)),
  clear: () => localStorage.removeItem(SESSION_KEY),
};

export const geneApi = {
  lookup: SovereignClient.lookup,
  search: SovereignClient.search,
  register: SovereignClient.register,
  uploadReceipt: SovereignClient.uploadReceipt,
  getStats: SovereignClient.getStats,
  normalizeId: normalizeGaId,
};

export default SovereignClient;
