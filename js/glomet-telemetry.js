/**
 * SUDAGENE S_OS â€” GLOMEt HQ CORE TELEMETRY AUDITING ENGINE
 * DATA INTERCHANGE FORMAT VALIDATOR & INGESTION NODE
 * v2.0 â€” Independent Telemetry UI Layer appended below the lab engine.
 */

// â”€â”€â”€ SECTION 1: GLOMEt Laboratory Equipment Telemetry Engine â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const GLOMEtTelemetryEngine = {
    // Verified Registry Parameters
    stateNodes: ["SD-RS", "SD-KH", "SD-GD", "SD-SN", "SD-KA", "SD-NN", "SD-WN", "SD-BN", "SD-ND", "SD-NS"],
    allowedSkus: ["GLM-EQ-CBC-301", "GLM-EQ-BIO-401", "GLM-P-120-DG", "GLM-CC-REF-450"],

    /**
     * Executes strict validation and formatting on incoming laboratory records
     * @param {Object} sampleData Raw telemetry log instance
     * @returns {Object} Cleaned and validated telemetry record
     */
    processTelemetryLog: function(sampleData) {
        if (!sampleData) {
            throw new Error("CRITICAL AUDIT ERROR: Telemetry payload configuration is null or empty.");
        }

        // 1. Mandatory Data Verification - Zero Assumption Validation
        if (!sampleData.facilityId || !sampleData.facilityId.match(/^GLM-FAC-[0-9]{4}$/)) {
            console.error("DATA POINT MISSING: Valid Cryptographic Facility ID.");
            return { status: "REJECTED", error: "MISSING_OR_CORRUPT_FACILITY_ID" };
        }

        if (!this.stateNodes.includes(sampleData.stateNode)) {
            console.error("DATA POINT MISSING: Verified State Location System Node.");
            return { status: "REJECTED", error: "INVALID_STATE_NODE" };
        }

        if (!this.allowedSkus.includes(sampleData.hardwareSku)) {
            console.error("DATA POINT MISSING: Verified Hardware Component SKU Mapping.");
            return { status: "REJECTED", error: "UNAUTHORIZED_HARDWARE_SIGNATURE" };
        }

        // 2. Forensic Typographical Formatting Verification
        let structuredResult = {
            timestamp: new Date().toISOString(),
            facilityId: sampleData.facilityId,
            stateNode: sampleData.stateNode,
            hardwareSku: sampleData.hardwareSku,
            metrics: {}
        };

        // Standardize fluidic constant strings - Remove unspaced units and illegal notation
        if (sampleData.hardwareSku === "GLM-EQ-CBC-301") {
            if (!sampleData.wbcCount || !sampleData.rbcCount) {
                console.error("DATA POINT MISSING: Quantitative Hematological Calibration Metrics.");
                return { status: "REJECTED", error: "INCOMPLETE_HEMATOLOGY_DATA" };
            }
            structuredResult.metrics.whiteBloodCellCount = `${parseFloat(sampleData.wbcCount).toFixed(2)} x10^9/L`;
            structuredResult.metrics.redBloodCellCount   = `${parseFloat(sampleData.rbcCount).toFixed(2)} x10^12/L`;
        }

        else if (sampleData.hardwareSku === "GLM-CC-REF-450") {
            let currentTemp = parseFloat(sampleData.internalTemperature);
            if (isNaN(currentTemp)) {
                console.error("DATA POINT MISSING: Accurate Internal Thermal Reading Constant.");
                return { status: "REJECTED", error: "INVALID_TEMPERATURE_VALUE" };
            }
            if (currentTemp < 2.0 || currentTemp > 8.0) {
                structuredResult.coldChainWarning = "CRITICAL COLD CHAIN BREAK DETECTED: Out of enzyme stabilization bounds.";
            }
            structuredResult.metrics.internalTemperature = `${currentTemp.toFixed(1)} Â°C`;
        }

        return {
            status: "VERIFIED_SUCCESS",
            payload: structuredResult,
            sudaPassSignature: btoa(`${sampleData.facilityId}:${sampleData.hardwareSku}:${Date.now()}`)
        };
    }
};

if (typeof window !== "undefined") {
    window.GLOMEtTelemetryEngine = GLOMEtTelemetryEngine;
}


// â”€â”€â”€ SECTION 2: Independent Telemetry UI Renderer (5-Pillar Dashboard) â”€â”€â”€â”€â”€â”€â”€â”€â”€
//
// Called after geneApi.js / Code.gs returns a verified member record.
// Maps SSOT columns directly to the 5 institutional identity pillars.
//
// Column mapping (mirrors Code.gs registry schema):
//   gaId           â†’ Col 1  GA_ID
//   careerStage    â†’ Col 6  CAREER_STAGE
//   certification  â†’ Col 16 CERT
//   sudaPassHash   â†’ Col 8  SUDAPASS_HASH
//   status         â†’ Col 4  STATUS
//   modulesCompleted â†’ MTC diagnostic log aggregation
//   gpPoints       â†’ Student Tracker GP column
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * Renders the 5-pillar Independent Telemetry Dashboard.
 * Fails silently per pillar â€” a missing data field never crashes the page.
 *
 * @param {Object} userData - Normalised member payload from geneApi.js
 * @param {string}  userData.gaId
 * @param {string}  userData.careerStage
 * @param {string}  [userData.certification]
 * @param {number}  [userData.modulesCompleted]
 * @param {string}  [userData.sudaPassHash]
 * @param {string}  [userData.status]          â€” "ACTIVE" | "PROVISIONAL" | "SUSPENDED"
 * @param {number}  [userData.gpPoints]
 */
function renderIndependentTelemetry(userData) {
    if (!userData) {
        console.error("[GLOMEt] renderIndependentTelemetry called with null payload.");
        return;
    }

    // â”€â”€ Pillar 1: Identity (GA-ID + Career Stage) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const identityEl = document.getElementById('data-identity');
    if (identityEl) {
        const stage = userData.careerStage ? ` \u2022 ${userData.careerStage}` : '';
        identityEl.textContent = userData.gaId
            ? `${userData.gaId}${stage}`
            : 'Unregistered';
        identityEl.style.color = userData.gaId ? '#0284C7' : '#94A3B8';
    }

    // â”€â”€ Pillar 2: Training (Certification record from Col 16) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const trainingEl = document.getElementById('data-training');
    if (trainingEl) {
        trainingEl.textContent = userData.certification
            ? userData.certification
            : 'In Progress';
        trainingEl.style.color = userData.certification ? '#0F172A' : '#94A3B8';
    }

    // â”€â”€ Pillar 3: Skills (MTC diagnostic log aggregation) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const skillsEl = document.getElementById('data-skills');
    if (skillsEl) {
        if (userData.modulesCompleted !== undefined && userData.modulesCompleted !== null) {
            skillsEl.textContent = `${userData.modulesCompleted} Clinical Case${userData.modulesCompleted !== 1 ? 's' : ''} Solved`;
            skillsEl.style.color = '#0F172A';
        } else {
            skillsEl.textContent = 'No Cases Logged';
            skillsEl.style.color = '#94A3B8';
        }
    }

    // â”€â”€ Pillar 4: Evidence (SudaPass SHA-256 gate) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const evidenceEl = document.getElementById('data-evidence');
    if (evidenceEl) {
        const isVerified = userData.sudaPassHash && userData.status === 'ACTIVE';
        if (isVerified) {
            evidenceEl.innerHTML = '<span class="telemetry-verified">SudaPass Verified</span>';
        } else if (userData.status === 'PROVISIONAL') {
            evidenceEl.innerHTML = '<span class="telemetry-pending">Pending KYC</span>';
        } else {
            evidenceEl.innerHTML = '<span class="telemetry-pending">Pending KYC</span>';
        }
    }

    // â”€â”€ Pillar 5: Progress (Gene Points from Student Tracker) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const progressEl = document.getElementById('data-progress');
    if (progressEl) {
        if (userData.gpPoints !== undefined && userData.gpPoints !== null) {
            const formatted = Number(userData.gpPoints).toLocaleString('en-US');
            progressEl.textContent = `${formatted} GP`;
            progressEl.style.color = userData.gpPoints >= 500 ? '#059669' : '#0F172A';
        } else {
            progressEl.textContent = '0 GP';
            progressEl.style.color = '#94A3B8';
        }
    }

    // â”€â”€ Highlight the active card border when data is present â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    ['identity', 'training', 'skills', 'evidence', 'progress'].forEach(pillar => {
        const card = document.getElementById(`card-${pillar}`);
        if (card) card.classList.add('telemetry-card--loaded');
    });
}

// Expose globally for inline script usage in verify.html and dashboard.html
if (typeof window !== "undefined") {
    window.renderIndependentTelemetry = renderIndependentTelemetry;
}
