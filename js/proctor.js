/**
 * SudaGene Consortium - Independent Proctoring Engine
 * Monitors candidate focus, detects tab-switching, and logs violations.
 */

const GeneProctor = (function() {
    let focusLostCount = 0;
    let isActive = false;
    let currentGaId = null;
    let currentSessionId = null;
    
    // Telemetry configuration
    const MAX_WARNINGS = 2;

    function handleVisibilityChange() {
        if (!isActive) return;
        
        if (document.hidden) {
            focusLostCount++;
            
            // Log violation to backend via GeneAPI
            if (window.GeneAPI && currentGaId) {
                GeneAPI.post("LOG_TELEMETRY", {
                    gaId: currentGaId,
                    deltaGp: -5, // Penalty for tab switching
                    action: "PROCTOR_VIOLATION",
                    violationType: "TAB_SWITCH",
                    sessionId: currentSessionId
                });
            }

            // Alert candidate
            if (focusLostCount <= MAX_WARNINGS) {
                alert(`âš ï¸ ØªØ­Ø°ÙŠØ± Ø£Ù…Ù†ÙŠ (${focusLostCount}/${MAX_WARNINGS}):\nÙ„Ù‚Ø¯ Ù‚Ù…Øª Ø¨Ø§Ù„Ø®Ø±ÙˆØ¬ Ù…Ù† Ø´Ø§Ø´Ø© Ø§Ù„ØªÙ‚ÙŠÙŠÙ… Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ. Ù‡Ø°Ø§ ÙŠØ¹ØªØ¨Ø± Ø®Ø±Ù‚Ø§Ù‹ Ù„Ø¨Ø±ÙˆØªÙˆÙƒÙˆÙ„ Ø§Ù„Ù†Ø²Ø§Ù‡Ø©.\nØªÙ… Ø®ØµÙ… 5 GP Ù…Ù† Ø±ØµÙŠØ¯Ùƒ.`);
            } else {
                alert(`ðŸš¨ ÙØ´Ù„ Ø§Ù„ØªÙ‚ÙŠÙŠÙ… Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ:\nÙ„Ù‚Ø¯ ØªØ¬Ø§ÙˆØ²Øª Ø§Ù„Ø­Ø¯ Ø§Ù„Ù…Ø³Ù…ÙˆØ­ Ù…Ù† Ø§Ù„ØªØ­Ø°ÙŠØ±Ø§Øª. ØªÙ… Ø¥ÙŠÙ‚Ø§Ù Ø§Ù„Ø¬Ù„Ø³Ø© Ø§Ù„Ø­Ø§Ù„ÙŠØ© ÙˆØ¥Ø´Ø¹Ø§Ø± Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ø³Ø¬Ù„.`);
                stopProctoring();
                // Optionally trigger UI lockdown
                document.dispatchEvent(new CustomEvent('geneProctorLockdown'));
            }
        }
    }

    function startProctoring(gaId, sessionId = Date.now().toString()) {
        if (isActive) return;
        
        currentGaId = gaId;
        currentSessionId = sessionId;
        focusLostCount = 0;
        isActive = true;
        
        document.addEventListener("visibilitychange", handleVisibilityChange);
        console.log(`ðŸ›¡ï¸ SudaGene Proctoring Active for ${gaId}`);
    }

    function stopProctoring() {
        if (!isActive) return;
        
        isActive = false;
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        console.log(`ðŸ›¡ï¸ SudaGene Proctoring Deactivated`);
    }

    return {
        start: startProctoring,
        stop: stopProctoring,
        getStatus: () => ({ isActive, focusLostCount })
    };
})();
