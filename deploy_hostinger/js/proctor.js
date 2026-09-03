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
                alert(`⚠️ تحذير أمني (${focusLostCount}/${MAX_WARNINGS}):\nلقد قمت بالخروج من شاشة التقييم السريري. هذا يعتبر خرقاً لبروتوكول النزاهة.\nتم خصم 5 GP من رصيدك.`);
            } else {
                alert(`🚨 فشل التقييم السريري:\nلقد تجاوزت الحد المسموح من التحذيرات. تم إيقاف الجلسة الحالية وإشعار إدارة السجل.`);
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
        console.log(`🛡️ SudaGene Proctoring Active for ${gaId}`);
    }

    function stopProctoring() {
        if (!isActive) return;
        
        isActive = false;
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        console.log(`🛡️ SudaGene Proctoring Deactivated`);
    }

    return {
        start: startProctoring,
        stop: stopProctoring,
        getStatus: () => ({ isActive, focusLostCount })
    };
})();
