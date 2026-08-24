// sovereign-config.js
// Master Headless CMS configuration for SudaGene Consortium.
// All leadership records, verified metrics, real survey reviews, and registry counts locked.

export const SOVEREIGN_ECOSYSTEM = {
    institution: {
        name: 'SudaGene Consortium',
        brand: 'Gene Academy',
        ecosystem: 'GemIInI Academy',
        infrastructure: 'GLOMEt HQ',
        poweredBy: 'geneacademy.net',
        domains: {
            public: 'https://geneacademy.net',
            clinical: 'https://gemiini.geneacademy.net',
            member: 'https://member.geneacademy.net',
        },
        gasBackend: 'https://script.google.com/macros/s/AKfycbxAVR42yEQlQMkOBhlcka622FNbSD_3_pIJrNL1bktLyN8TqIYGC2P5cGpUqeZcoql8/exec',
        established: '2023',
    },

    // ---- Living Verified Registry Metrics ------------------------------------
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

    // ---- Authentic Leadership Roster -----------------------------------------
    faculty: [
        {
            id: 'GA000',
            name: 'Dr. Mohamed Gibbril',
            name_ar: 'د. محمد أحمد جبريل',
            role: 'Co-Founder & CEO | Academic Officer in Molecular Medicine',
            role_ar: 'المؤسس المشارك والرئيس التنفيذي | المسؤول الأكاديمي للطب الجزيئي',
            degrees: 'MBBS (KU 0089958, 3 Aug 2021), MSc Molecular Medicine',
            pillar: 'GeneAcademy & GemIInI Core Architecture',
            focus: 'Translational Systems, Accreditation & Archiving, Royal College Alignment, MTC™ Framework, 15:5:1 Pods',
            avatar: '/assets/team/dr-gibbril.jpg'
        },
        {
            id: 'GA001',
            name: 'Dr. Alaa Mursi Elnour (FRCS)',
            name_ar: 'د. علاء مرسي النور (FRCS)',
            role: 'Clinical Licensure & Surgical Director',
            role_ar: 'مديرة التدريب الإكلينيكي والجراحي وقائدة مسارات التراخيص والزمالات',
            degrees: 'MBBS, FRCS (Letterkenny University Hospital, Ireland)',
            pillar: 'GemIInI Academy',
            focus: 'SMC 8 Modules, Intercollegiate MRCS Part A/B, BSS-1 & BSS-2 Psychomotor Surgical Masterclasses',
            avatar: '/assets/team/dr-alaa.jpg'
        },
        {
            id: 'GA004',
            name: 'Dr. Safaa El Hassan',
            name_ar: 'د. صفاء الحسن',
            role: 'Academic Officer | Molecular Medicine Team Lead',
            role_ar: 'المسؤول الأكاديمي | قائد فريق أبحاث وتدريب الطب الجزيئي',
            degrees: 'MBBS (Omdurman Islamic University - OIU, Graduated 2016)',
            pillar: 'GeneAcademy Research & MM 1.0–8.0',
            focus: 'Molecular Medicine Curriculum, 15:5:1 Research Pods, Quality Control & Survey Telemetry',
            avatar: '/assets/team/dr-safaa.jpg'
        }
    ],

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
            author: 'Dr. Safaa El Hassan (GA004)',
            role: 'Academic Officer & Molecular Lead (OIU 2016)',
            rating: 5,
            quote: 'التوثيق الأكاديمي ومجموعات البحث 15:5:1 فتحت آفاقاً حقيقية لربط الباحثين السودانيين بقواعد البيانات العالمية والمجلات المصنفة Scopus Q1.',
            quote_en: 'The 15:5:1 research pods bridged displaced Sudanese researchers directly with global genomic databases and Scopus Q1 journals.',
            date: '2026-08-18'
        }
    ],

    // ---- Payment & Dispatch Information -------------------------------------
    paymentChannels: {
        vodafoneCash: '+201015922628',
        bankakAccount: 'Verified on Dispatch Desk',
        dispatchWhatsApp: '+201015922628',
        quickDialCode: '*9*7*01015922628#',
        officialEmail: 'info@geneacademy.net'
    }
};

Object.freeze(SOVEREIGN_ECOSYSTEM);
