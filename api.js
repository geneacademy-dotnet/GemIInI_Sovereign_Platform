/**
 * api.js — GemIInI Academy Master Ledger & Verification Client
 * SudaGene Consortium · GemIInI Academy
 *
 * ZERO FAKE SUCCESS POLICY:
 * If the backend ledger cannot be reached, the system NEVER mints a fake ID.
 * It returns an explicit error with transaction recovery instructions and direct WhatsApp desk contact.
 */

const APPS_SCRIPT_API_URL = "https://script.google.com/macros/s/AKfycbxAVR42yEQlQMkOBhlcka622FNbSD_3_pIJrNL1bktLyN8TqIYGC2P5cGpUqeZcoql8/exec";
const GEMIINI_SESSION_KEY = "gemiini_presence_id";
const GEMIINI_PROFILE_KEY = "gemiini_member_profile";

/**
 * Stores active session ID and profile
 */
function applyGemIInISession(gaId, profileData) {
    if (!gaId) return;
    localStorage.setItem(GEMIINI_SESSION_KEY, gaId);
    if (profileData) {
        localStorage.setItem(GEMIINI_PROFILE_KEY, JSON.stringify(profileData));
    }
}

/**
 * Retrieves current active session ID
 */
function getActiveGemIInIId() {
    return localStorage.getItem(GEMIINI_SESSION_KEY) || null;
}

/**
 * Dispatches registration payload to Google Apps Script.
 * Fails loudly on network or server error to prevent silent data loss.
 */
async function executeGemIInISync(payload) {
    try {
        const response = await fetch(APPS_SCRIPT_API_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Ledger responded with status ${response.status}`);
        }

        const data = await response.json();
        
        if (data.status === "error") {
            throw new Error(data.message || "Ledger returned an error processing your intake.");
        }

        return data;
    } catch (err) {
        console.error("Ledger sync failure:", err);
        // Explicit failure return — NO RANDOM / FAKE ID MINTING
        return {
            status: "error",
            error: true,
            message: "تعذر الاتصال بالسجل المركزي لتأكيد العملية. يرجى التواصل فوراً مع المكتب الأكاديمي عبر واتساب لتأكيد قيدك يدوياً.",
            rawError: err.message || err.toString()
        };
    }
}

/**
 * Queries the real master ledger for public verification.
 * Returns found: false if the ID does not exist in the database.
 */
async function lookupGemIInIId(searchId) {
    if (!searchId) return { found: false, message: "No ID provided" };
    try {
        const url = `${APPS_SCRIPT_API_URL}?action=lookup&id=${encodeURIComponent(searchId)}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Lookup failed with status ${response.status}`);
        return await response.json();
    } catch (err) {
        console.error("Lookup error:", err);
        return { found: false, error: true, message: "تعذر التحقق من السجل حالياً. يرجى المحاولة لاحقاً." };
    }
}

// Expose globally
window.applyGemIInISession = applyGemIInISession;
window.getActiveGemIInIId = getActiveGemIInIId;
window.executeGemIInISync = executeGemIInISync;
window.lookupGemIInIId = lookupGemIInIId;
