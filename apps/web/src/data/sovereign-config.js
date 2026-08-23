// sovereign-config.js
// Headless CMS master configuration for SudaGene Consortium / Gene Academy.
// All verified metrics locked and forensically audited. Zero guesswork, zero inflation.

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

    // ---- Verified Credential Metrics (LOCKED & HONEST) -----------------------
    metrics: {
        gaRegistryMembers: '2,441+',
        canonicalUniversities: 54,
        smcQBankVignettes: 2500,
        smcModulesCount: 8,
        mrcsCandidates: 6, // Inaugural cohort
        bss2Graduates: 35, // Cairo cohorts (Aug 23-24, 2025 + prior)
        blsAlumni: 7, // STC Partner (Lic. 1549, Reg. 96628)
        smcNationalMarketExamined: '11,473', // Nov 2025 - June 2026 (SUNA/Fana)
        smcNationalPassRate: '92%',
        competitorComparison: '2,500 vignettes vs. competitor 1,301 MCQs',
        cpdConversionRate: '1,000 GP = 10 CPD / CME Hours',
        accreditedHospitals: 40,
    },

    // ---- Key Partners & Institutional Accreditations ------------------------
    accreditations: {
        blsPartner: {
            name: 'Dr. Sabri Abugroon Training Center (STC)',
            licenceNo: '1549',
            regCertNo: '96628',
            alumniCount: 7
        },
        bssSignatory: {
            name: 'Dr. Ahmed Ezz',
            title: 'Head of Surgery Department',
            graduatesCount: 35,
            location: 'Cairo High-Fi Surgical Center'
        },
        founderCredentials: {
            name: 'Dr. Mohamed Ahmed Abdel Fattah Gibbril',
            degrees: 'MBBS, MSc Molecular Medicine',
            registrationNo: 'KU 0089958',
            gradDate: '3 Aug 2021',
            faculty: 'University of Khartoum - Faculty of Medicine'
        }
    },

    // ---- Faculty Leadership -------------------------------------------------
    faculty: [
        {
            id: 'GA-FOUNDER-001',
            name: 'Dr. Mohamed Gibbril',
            name_ar: 'د. محمد أحمد جبريل',
            role: 'Founder & Lead Systems Architect',
            role_ar: 'المؤسس ورئيس المعمارية المعرفية والأنظمة السريرية',
            degrees: 'MBBS (KU 0089958), MSc Molecular Medicine',
            pillar: 'GeneAcademy & GemIInI Core',
            focus: 'MTC™ Architecture, 15:5:1 Pods, Molecular Biology',
            avatar: '/assets/team/dr-gibbril.jpg'
        },
        {
            id: 'GA-FAC-002',
            name: 'Dr. Alaa Mursi Elnour',
            name_ar: 'د. علاء مرسي النور',
            role: 'Clinical Licensure & Surgical Director',
            role_ar: 'مدير التدريب السريري والجراحي وقائد مسار التراخيص الطبية',
            degrees: 'MBBS, Surgical Skills Director',
            pillar: 'GemIInI Academy',
            focus: 'SMC 8 Modules, MRCS Part A/B, BSS-1 & BSS-2 Wet Labs',
            avatar: '/assets/team/dr-alaa.jpg'
        }
    ],

    // ---- Navigation & Route Structure ---------------------------------------
    links: {
        whatsappConcierge: 'https://wa.me/201015922628',
        dispatchPhone: '+201015922628',
        email: 'info@geneacademy.net',
    }
};

Object.freeze(SOVEREIGN_ECOSYSTEM);
