/**
 * SUDAGENE S_OS — MTC™ PEDAGOGICAL PIPELINE ENGINE
 * VERIFIED ARCHITECTURE DEPLOYMENT FOR ADVANCED SIMULATORS
 */

export const MTCClinicalRegistry = {
    // Verified Master Case Ledger
    cases: {
        "MTC-V-001": {
            id: "MTC-V-001",
            title: "Cellular Anoxia & Fluid Balance Deregulation",
            title_ar: "نقص الأكسجين الخلوي واختلال توازن السوائل والأملاح",
            focusArea: "Guyton & Hall Organ Physiology / Internal Medicine (SMC-101)",
            
            // STEP 1: Biological & Molecular Mechanism
            step1_molecular: "Severe reduction in systemic partial oxygen pressure (PO2) halts cellular oxidative phosphorylation inside mitochondrial cristae. This inactivates the Adenosine Triphosphate (ATP)-dependent sodium-potassium pump (Na+/K+ ATPase).",
            step1_molecular_ar: "الانخفاض الحاد في الضغط الجزئي للأكسجين (PO2) يوقف الفسفرة التأكسدية داخل أعراف الميتوكوندريا، مما يؤدي إلى تعطل مضخة الصوديوم والبوتاسيوم المعتمدة على الـ ATP (Na+/K+ ATPase).",
            
            // STEP 2: Pathophysiological Cascade
            step2_pathophysiological: "Intracellular sodium accumulation alters the oncotic gradient, drawing free interstitial water into the cytoplasm. This triggers cell swelling, membrane blebbing, organelle failure, and anaerobic metabolic acidosis.",
            step2_pathophysiological_ar: "تراكم الصوديوم داخل الخلية يخل بالتدرج التناضحي جاذباً السوائل الخلالية للداخل، مما يحدث تورم الخلية وفشل العضيات الخلوية مع حماض أيضي لاهوائي.",
            
            // STEP 3: Definitive Bedside Clinical Decision
            step3_clinical: "Immediate stabilization of tissue perfusion via targeted intravenous fluid administration using isotonic crystalloid fluids (0.9% Sodium Chloride or Hartmann's Solution) at 30 mL/kg within a strict 3-hour resuscitation window, alongside continuous peripheral saturation telemetry tracking.",
            step3_clinical_ar: "الاستقرار الفوري للتروية النسيجية عبر محاليل بلورية متساوية التوتر (0.9% NaCl أو محلول هارتمان) بمعدل 30 مل/كجم خلال نافذة إنعاش مدتها 3 ساعات مع مراقبة أكسجة الأنسجة."
        },
        "MTC-V-002": {
            id: "MTC-V-002",
            title: "Acute Tension Pneumothorax & Hemodynamic Collapse",
            title_ar: "استرواح الصدر الضاغط الحاد والانهيار الديناميكي الدموي",
            focusArea: "Emergency Surgery & Trauma Care (SMC-102)",
            step1_molecular: "One-way pleural valve laceration creates positive intrapleural atmospheric pressure trapping expanding air with each inspiration.",
            step1_molecular_ar: "تمزق صمامي أحادي الاتجاه في غشاء الجنب يولد ضغطاً إيجابياً يحبس الهواء المتمدد مع كل شهيق.",
            step2_pathophysiological: "Massive mediastinal shift acutely kinks the inferior and superior vena cava, obliterating right atrial venous return (preload collapse).",
            step2_pathophysiological_ar: "انحراف المنصف الحاد يضغط على الوريدين الأجوفين العلوي والسفلي مؤدياً إلى انهيار العائد الوريدي للأذين الأيمن.",
            step3_clinical: "Immediate emergency needle decompression with a 14G cannula at the 2nd intercostal space midclavicular line (or 5th space anterior axillary line) prior to chest radiography.",
            step3_clinical_ar: "تفريغ هوائي طارئ فوري بإبرة قياس 14G في المسافة الوربية الثانية على خط منتصف الترقوة قبل إجراء أي أشعة."
        }
    },

    /**
     * Retrieves case details by ID
     * @param {string} caseId Unique case reference ID
     */
    getCase: function(caseId) {
        return this.cases[caseId] || null;
    },

    /**
     * Renders a verified MTC case block to console
     * @param {string} caseId Unique case reference ID
     */
    renderMTCCase: function(caseId) {
        const activeCase = this.cases[caseId];
        if (!activeCase) {
            console.error(`DATA POINT MISSING: Verified Case Record for ID ${caseId}`);
            return;
        }

        console.log(`=== DISPLAYING MTC™ CLINICAL SCENARIO: ${activeCase.title} ===`);
        console.log(`[CORE MODULE] ${activeCase.focusArea}
`);
        console.log(`[STEP 1: MOLECULAR BASIS]
${activeCase.step1_molecular}
`);
        console.log(`[STEP 2: PATHOPHYSIOLOGICAL CASCADE]
${activeCase.step2_pathophysiological}
`);
        console.log(`[STEP 3: DEFINITIVE BEDSIDE PROTOCOL]
${activeCase.step3_clinical}
`);
        console.log(`=== END OF DEPLOYED CASE BLOCK ===`);
    }
};

if (typeof window !== "undefined") {
    window.MTCClinicalRegistry = MTCClinicalRegistry;
}
