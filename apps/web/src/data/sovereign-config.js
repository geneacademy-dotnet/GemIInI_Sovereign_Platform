// Independent-config.js
// Authoritative Independent Governance Charter (GA20 Protocol).
// All leadership, founded date (19 April 2025), Operational Year 2, and Coffee-Parity pricing locked.

export const Independent_ECOSYSTEM = {
  GP_MODEL: {
    REGISTRATION_EXPLORER: 25,
    ACCREDITATION_PATHFINDER_BUMP: 475,
    VERIFIED_TOTAL: 500,
    WORKSHOP_HANDS_ON_BONUS: 150, // BLS, BSS-2, and future physical workshops
    MTC_CASE_PASSED: 10,
    MTC_CASE_ATTEMPTED: 2
  },
  PUBLIC_MOBILE_APP: {
    name_en: "GemIInI Jaib",
    name_ar: "جيميناي جيب",
    tagline_ar: "تطبيقنا للمتابعة السريرية",
    tagline_en: "Our Candidate Clinical Companion App"
  },
    institution: {
        name: 'SudaGene Consortium',
        brand: 'Gene Academy',
        ecosystem: 'GemIInI Academy',
        infrastructure: 'GLOMEt HQ',
        founded: '19 April 2025',
        operationalYear: 2,
        poweredBy: 'geneacademy.net',
        domains: {
            public: 'https://geneacademy.net',
            clinical: 'https://gemiini.geneacademy.net',
            member: 'https://member.geneacademy.net',
        },
        gasBackend: 'https://script.google.com/macros/s/AKfycbyyFkVDH7JD6TYgFmlZ3kUqZwJrQaDZhvKeIGDkVg2wW2OJfH1iYlgrwd4lW0A3eKVE/exec',
    },

    // ---- Executive Leadership (GA20 Governance Protocol) ---------------------
    leadership: [
        {
            id: 'GA-000',
            name: { en: 'Dr. Mohamed Gibbril', ar: 'د. محمد أحمد جبريل' },
            role: { en: 'Founder & Chief Executive Officer', ar: 'المؤسس والرئيس التنفيذي' },
            focus: 'Overall Decentralized Verification Framework, Biology Foundations, Molecular Medicine, System Overseer',
            degrees: 'MBBS (KU 0089958, 2021), MSc Molecular Medicine',
            pillar: 'GemIInI & Gene Core',
            status: 'Stable / Permanent Founding Position'
        },
        {
            id: 'GA-001',
            name: { en: 'Dr. Alaa Mursi Elnour', ar: 'د. علاء مرسي النور' },
            role: { en: 'Co-Founder & Academic Lead (COO)', ar: 'المؤسس الشريك والمدير الأكاديمي (COO)' },
            focus: 'Chemistry Integration, Advanced Clinical Synthesis, BSS-2 Program Director, SMC Surgery Bank',
            degrees: 'MBBS, FRCSI (Letterkenny University Hospital, Ireland)',
            pillar: 'GemIInI Clinical Lead',
            status: 'Stable / Permanent Founding Position'
        },
        {
            id: 'GA-004',
            name: { en: 'Dr. Safaa El Hassan', ar: 'د. صفاء عبد القادر الحسن' },
            role: { en: 'Senior Academic Officer', ar: 'المسؤول الأكاديمي الأول' },
            focus: 'Intake Ingestion, Curriculum Design, Molecular Medicine, Diagnostic Imaging Tracking',
            degrees: 'MBBS (Omdurman Islamic University - OIU, 2016)',
            pillar: 'Academic Operations',
            status: 'Assigned Lifecycle 2025–2026 (Operational Year 2)'
        },
        {
            id: 'GA-011',
            name: { en: 'Amjad Gorashi', ar: 'م. أمجد قرشي حسن' },
            role: { en: 'Operations & Systems Logistics Officer', ar: 'مسؤول العمليات والأنظمة والمعلومات' },
            focus: 'Systems Architecture, Information Networks, GIS & Operational Telemetry',
            pillar: 'GLOMEt & Systems Operations',
            status: 'Hired Aug 2026 (Training since Jul 01, 2026)'
        }
    ],

    // Backward-compatible faculty alias
    faculty: [
        {
            id: 'GA-000',
            name: 'Dr. Mohamed Gibbril',
            name_ar: 'د. محمد أحمد جبريل',
            role: 'Founder & CEO | Systems Architect',
            role_ar: 'المؤسس والرئيس التنفيذي | المعمارية المعرفية والأنظمة',
            degrees: 'MBBS (KU 0089958, 2021), MSc Molecular Medicine',
            pillar: 'GemIInI & Gene Core',
            focus: 'Overall Decentralized Verification Framework, Biology Foundations, Molecular Medicine',
            avatar: '/assets/team/dr-gibbril.jpg'
        },
        {
            id: 'GA-001',
            name: 'Dr. Alaa Mursi Elnour',
            name_ar: 'د. علاء مرسي النور (FRCSI)',
            role: 'Co-Founder & Academic Lead (COO)',
            role_ar: 'المؤسس الشريك والمدير الأكاديمي (COO)',
            degrees: 'MBBS, FRCSI (Letterkenny University Hospital, Ireland)',
            pillar: 'GemIInI Clinical Lead',
            focus: 'Chemistry Synthesis, BSS-2 Program Director, SMC Surgery Bank',
            avatar: '/assets/team/dr-alaa.jpg'
        },
        {
            id: 'GA-004',
            name: 'Dr. Safaa El Hassan',
            name_ar: 'د. صفاء عبد القادر الحسن',
            role: 'Senior Academic Officer',
            role_ar: 'المسؤول الأكاديمي الأول',
            degrees: 'MBBS (Omdurman Islamic University, 2016)',
            pillar: 'Academic Operations',
            focus: 'Intake Ingestion, Molecular Medicine & Curriculum Design',
            avatar: '/assets/team/dr-safaa.jpg'
        },
        {
            id: 'GA-011',
            name: 'Amjad Gorashi',
            name_ar: 'م. أمجد قرشي حسن',
            role: 'Operations & Systems Logistics Officer',
            role_ar: 'مسؤول العمليات والأنظمة والمعلومات',
            degrees: 'B.Sc. Systems Engineering & GIS',
            pillar: 'GLOMEt & Systems Operations',
            focus: 'Systems Architecture, GIS & Field Telemetry',
            avatar: '/assets/team/eng-amjad.jpg'
        }
    ],

    // ---- Living Verified Registry Metrics (LOCKED) ---------------------------
    metrics: {
        verifiedGaIds: '1,200 GA-ID verified',
        totalEnrolledMembers: '2,441 total enrolled',
        registryDisplay: '1,200 GA-ID verified · 2,441 total enrolled',
        canonicalUniversities: 54,
        smcQBankVignettes: 2500,
        smcModulesCount: 8,
        mrcsCandidates: 6, // Inaugural Royal Colleges preparation cohort
        bss2Graduates: 35, // Cairo cohorts (Aug 2025 + prior)
        blsAlumni: 7, // STC Partner (Lic. 1549, Reg. 96628)
        smcNationalMarketExamined: '11,473', // Nov 2025 - June 2026 (SUNA/Fana)
        smcNationalPassRate: '92%',
        satisfactionRating: '4.74 / 5.0',
        surveySubmissions: 16,
        cpdConversionRate: '1,000 GP = 10 CPD / CME Hours',
        accreditedHospitals: 40,
    },

    // ---- Dynamic Friction-Gate Pricing Model (Coffee-Parity Index) -----------
    pricing: {
        concept: 'The Price of Two Cups of Coffee',
        sudan: '3,000 – 5,000 SDG',
        egyptDiaspora: '100 – 150 EGP / ~$2.50 USD',
        welcomeGp: 25, // Explorer Tier on intake
        accreditedBumpGp: 475, // Bump to 500 GP Pathfinder on approval
        totalAccreditedGp: 500
    },

    // ---- Real Survey Reviews (Authentic Feedback - 4.74/5 Rating) -----------
    reviews: [
        {
            id: 'REV-2026-001',
            author: 'Dr. T. M. (MBBS, University of Khartoum)',
            role: 'SMC Licensure Candidate',
            rating: 5,
            quote: 'المنهجية المتبعة في ربط الآلية الحيوية بالقرار السريري (MTC) غيرت تماماً طريقة إجابتي في امتحانات المجلس الطبي. لم أعد أحفظ بل أصبحت أفهم التسلسل الإمراضي بدقة.',
            quote_en: 'The Mechanism-to-Clinic (MTC) pedagogy completely transformed my clinical decision making for the SMC exam. True pathophysiology understanding instead of rote memorization.',
            date: '2026-07-14'
        },
        {
            id: 'REV-2026-007',
            author: 'Dr. K. A. (MBBS, University of Gezira)',
            role: 'BSS-2 Cairo Surgical Graduate',
            rating: 5,
            quote: 'التدريب العملي الجراحي في القاهرة بإشراف د. علاء مرسي كان نقطة تحول في التعامل مع الأدوات وخياطة الأمعاء والأوعية الدقيقة.',
            quote_en: 'The hands-on surgical training in Cairo under Dr. Alaa Mursi was a turning point in instrument ergonomics and microvascular anastomosis.',
            date: '2026-08-10'
        },
        {
            id: 'REV-2026-015',
            author: 'Dr. Safaa El Hassan (GA-004)',
            role: 'Senior Academic Officer (OIU 2016)',
            rating: 5,
            quote: 'التوثيق الأكاديمي ومجموعات البحث 15:5:1 فتحت آفاقاً حقيقية لربط الباحثين السودانيين بقواعد البيانات العالمية والمجلات المصنفة Scopus Q1.',
            quote_en: 'The 15:5:1 research pods bridged displaced Sudanese researchers directly with global genomic databases and Scopus Q1 journals.',
            date: '2026-08-18'
        }
    ],

    // ---- Live Dispatch & Payment Endpoints -----------------------------------
    channels: {
        vodafoneCash: '+20 101 592 2628',
        bankakName: 'Gene Academy / GemIInI Medical',
        // Primary Inquiry Lines (Handled by Safaa/Amjad)
        whatsapp: 'https://wa.me/201270192777', // Default frontend contact
        whatsapp_kwt: 'https://wa.me/9650872572',
        whatsapp_ksa: 'https://wa.me/966550476176',
        // High-Security Identity Verification Line (Only used for sending codes)
        whatsapp_verification: 'https://wa.me/201015922628',
        dispatchPhone: '+20 101 592 2628',
        officialEmail: 'info@geneacademy.net'
    }
};

Object.freeze(Independent_ECOSYSTEM);
