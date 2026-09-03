/**
 * ============================================================================
 * GENEACADEMY & SUDAGENE RESILIENT API CLIENT (V4.6 ENTERPRISE)
 * Target: Hostinger Production Edge â€¢ Unified Apps Script Single Source of Truth
 * Active Endpoint: AKfycbwe3rUYJgtSjcnPaKxJOiPsmA19yglrXyWJtAVq0fy4rPi1zLUIacZaWpC4Yhg0x5Ux
 * ============================================================================
 */

const GEMIINI_CONFIG = {
  ENDPOINT: 'https://script.google.com/macros/s/AKfycbwe3rUYJgtSjcnPaKxJOiPsmA19yglrXyWJtAVq0fy4rPi1zLUIacZaWpC4Yhg0x5Ux/exec',
  TIMEOUT_MS: 15000
};

/**
 * Central transactional dispatcher to the Google Apps Script backend.
 * ðŸ”’ FAIL-CLOSED GUARANTEE: Never returns a fabricated success or fake GA-ID on network failure.
 * Throws a real Error on network/server errors so caller handles real error states.
 */
async function executeGemIInISync(payload) {
  if (!payload || (!payload.action && !payload.formCode)) {
    throw new Error('INVALID_PAYLOAD: action or formCode is required');
  }

  // Attach client metadata
  payload.clientTimestamp = new Date().toISOString();
  payload.userAgent = navigator.userAgent || 'Unknown';

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), GEMIINI_CONFIG.TIMEOUT_MS);

  try {
    const response = await fetch(GEMIINI_CONFIG.ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8' // Avoid CORS preflight overhead with GAS
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP_${response.status}: ${response.statusText || 'Server Error'}`);
    }

    const data = await response.json();

    if (!data || data.success !== true) {
      throw new Error(data.error || data.message || 'TRANSACTION_REJECTED_BY_SERVER');
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('GemIInI API Sync Error:', error);
    // Explicitly rethrow error â€” NEVER return fake success or placeholder ID
    throw new Error(error.name === 'AbortError' ? 'NETWORK_TIMEOUT: Server took too long to respond' : error.message);
  }
}
