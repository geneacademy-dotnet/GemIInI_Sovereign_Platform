// sovereign-config.js
// Headless CMS master configuration for the SudaGene Consortium / Gene Academy
// ecosystem. Every narrative string, faculty record, stat, pricing tier and
// pillar program is sourced from this single object so the platform reads as
// one sovereign voice across HomePage, Services, About and Dashboard.

export const SOVEREIGN_ECOSYSTEM = {
    institution: {
        name: 'SudaGene Consortium',
        brand: 'Gene Academy',
        ecosystem: 'GemIInI Academy',
        poweredBy: 'geneacademy.net',
        domains: ['geneacademy.net', 'gemiini.academy', 'glomet.hq'],
        established: '2023',
    },

    // ---- Faculty leadership -------------------------------------------------
    faculty: [
        {
            id: 'GA-FOUNDER-001',
            name: { en: 'Dr. Mohamed Ahmed Abdel Fattah Gibbril', ar: 'د. محمد أحمد عبد الفتاح جبريل' },
            role: { en: 'Founder & Director', ar: 'المؤسس والمدير' },
            degree: 'MBBS · MSc Molecular Biology',
            bio: {
                en: 'Architect of the Sovereign Truth blueprint. Founded the consortium to rebuild Sudanese medical and life-sciences education after academic displacement — one verified, portable credential at a time.',
                ar: 'مهندس مخطط السيادة المعرفية. أسس الكونسورتيوم لإعادة بناء التعليم الطبي وعلوم الحياة السوداني بعد النزوح الأكاديمي — بيانة موثقة محمولة في كل مرة.',
            },
        },
        {
            id: 'GA-FAC-002',
            name: { en: 'Dr. Alaa Mursi Elnour', ar: 'د. علاء مرسي النور' },
            role: { en: 'Clinical Lead — GemIInI Academy', ar: 'القائد السريري — أكاديمية جيميني' },
            degree: 'MBBS · MRCS',
            bio: {
                en: 'Leads the GemIInI licensure pathway and the Module IV Surgery & Trauma curriculum. Maps every vignette to the SMC and MRCS frameworks.',
                ar: 'يقود مسار ترخيص جيميني ومنهج الجراحة والرضوض للوحدة الرابعة. يربط كل سيناريو بإطاري SMC وMRCS.',
            },
        },
        {
            id: 'GA-FAC-003',
            name: { en: 'Dr. Safa Elhassan', ar: 'د. صفاء الحسن' },
            role: { en: 'Life Sciences Lead — GeneAcademy', ar: 'قائد علوم الحياة — أكاديمية الجينات' },
            degree: 'PhD Genetics',
            bio: {
                en: 'Directs Biology with Gibbril (BWG) and The 100 Papers Project. Designs the 15:5:1 mentorship cascade and the MM1–8 molecular mastery series.',
                ar: 'تدير علم الأحياء مع جبريل ومشروع المئة ورقة. تصمم شلال الإرشاد 15:5:1 وسلسلة الإتقان الجزيئي MM1–8.',
            },
        },
        {
            id: 'GA-FAC-004',
            name: { en: 'Dr. Abdelwakeel Mohammed', ar: 'د. عبدالوكيل محمد' },
            role: { en: 'Diagnostics Lead — GLOMEt HQ', ar: 'قائد التشخيص — مقر جلوميت' },
            degree: 'MD · MSc Laboratory Medicine',
            bio: {
                en: 'Oversees GLOMEt turnkey molecular laboratories, CBC analyzer deployment and POCT consumable supply chains across partner hospitals.',
                ar: 'يشرف على مختبرات جلوميت الجزيئية الجاهزة ونشر محللات CBC وسلاسل مستهلكات POCT في المستشفيات الشريكة.',
            },
        },
        {
            id: 'GA-FAC-005',
            name: { en: 'Dr. Maram Alarabi', ar: 'د. مرام العربي' },
            role: { en: 'Assessment & Prometric Lead', ar: 'قائد التقييم والبرومتريك' },
            degree: 'MBBS · MMed Ed',
            bio: {
                en: 'Architects the MTC clinical vignette bank and the Prometric-of-Sudan mapping. Every scenario is scored, audited and sealed with a SHA-256 certificate.',
                ar: 'تصمم بنك سيناريوهات MTC السريرية وخرائط برومتريك السودان. كل سيناريو مُحرَّز ومُدقَّق ومختوم بشهادة SHA-256.',
            },
        },
        {
            id: 'GA-FAC-006',
            name: { en: 'Reem Khalid', ar: 'ريم خالد' },
            role: { en: 'Operations & Biotech Grants', ar: 'العمليات ومنح التكنولوجيا الحيوية' },
            degree: 'MSc Biotechnology',
            bio: {
                en: 'Manages the GLOMEt CSR engine — converting equipment sales into biotech student funding grants and tracking the scholarship pipeline end to end.',
                ar: 'تدير محرك المسؤولية المجتمعية لجلوميت — تحويل مبيعات المعدات إلى منح تمويل لطلاب التكنولوجيا الحيوية وتتبع خط المنح من البداية للنهاية.',
            },
        },
    ],

    // ---- Success ledger -----------------------------------------------------
    stats: {
        members: 2441,
        universities: 54,
        vignettes: 2500,
        b2bPartners: 40,
        activePods: 8,
        welcomeGP: 500,
        cpd: { gp: 1000, hours: 10 },
    },

    // ---- Achievements & certifications --------------------------------------
    achievements: {
        bls: {
            key: 'bls',
            pillar: 'gemiini',
            count: 318,
            suffix: '+',
            label: { en: 'BLS Certified Professionals', ar: 'حاصلون على شهادة BLS' },
            desc: {
                en: 'Basic Life Support providers trained, audited and verified through the GemIInI clinical skills lab.',
                ar: 'مزوّدو دعم الحياة الأساسية مدرّبون ومدقّقون وموثّقون عبر مختبر المهارات السريرية في جيميني.',
            },
            dateRange: { en: '2024 – 2026', ar: '٢٠٢٤ – ٢٠٢٦' },
            verify: '/certifications',
        },
        mrcs: {
            key: 'mrcs',
            pillar: 'gemiini',
            count: 47,
            suffix: '',
            passRate: 86,
            label: { en: 'MRCS Candidates Passed', ar: 'ناجحون في MRCS' },
            desc: {
                en: 'Membership of the Royal College of Surgeons candidates coached to a passing score.',
                ar: 'مرشحو عضوية كلية الجراحين الملكية المدرَّبون حتى تجاوز الدرجة الناجحة.',
            },
            dateRange: { en: '2024 – 2026', ar: '٢٠٢٤ – ٢٠٢٦' },
            verify: '/certifications',
        },
        usmle: {
            key: 'usmle',
            pillar: 'gemiini',
            count: 63,
            suffix: '',
            passRate: 91,
            label: { en: 'USMLE Step 1 / 2CK Passes', ar: 'نجاحات USMLE الخطوة 1 / 2CK' },
            desc: {
                en: 'Candidates who achieved passing scores on USMLE Step 1 and Step 2CK.',
                ar: 'مرشحون حققوا درجات نجاح في USMLE الخطوة 1 و2CK.',
            },
            dateRange: { en: '2024 – 2026', ar: '٢٠٢٤ – ٢٠٢٦' },
            verify: '/certifications',
        },
        gemiiniSmc: {
            key: 'gemiiniSmc',
            pillar: 'gemiini',
            count: 412,
            suffix: '+',
            label: { en: 'GemIInIxSMC Licensed Professionals', ar: 'ممارسون مرخّصون عبر GemIInIxSMC' },
            desc: {
                en: 'Verified medical professionals licensed through the Sudan Medical Council pathway.',
                ar: 'ممارسون طبيون موثّقون مرخّصون عبر مسار المجلس الطبي السوداني.',
            },
            dateRange: { en: '2023 – 2026', ar: '٢٠٢٣ – ٢٠٢٦' },
            verify: '/certifications',
        },
        moduleIV: {
            key: 'moduleIV',
            pillar: 'gemiini',
            count: 94,
            suffix: '%',
            completionRate: 94,
            enrollment: 286,
            label: { en: 'Module IV Surgery & Trauma Completion', ar: 'إتمام الوحدة الرابعة للجراحة والرضوض' },
            desc: {
                en: 'Completion rate across enrolled candidates in the high-yield surgery and trauma module.',
                ar: 'نسبة الإتمام بين المرشحين المسجَّلين في وحدة الجراحة والرضوض عالية القيمة.',
            },
            dateRange: { en: '2024 – 2026', ar: '٢٠٢٤ – ٢٠٢٦' },
            verify: '/certifications',
        },
        germanFsp: {
            key: 'germanFsp',
            pillar: 'gemiini',
            count: 29,
            suffix: '',
            label: { en: 'German FSP / Anamnese Certifications', ar: 'شهادات الـ FSP الألماني / الأنامنيز' },
            desc: {
                en: 'International certifications awarded for the Fachsprachenprüfung and anamnese interview.',
                ar: 'شهادات دولية ممنوحة لامتحان اللغة الطبية ومقابلة الأنامنيز.',
            },
            dateRange: { en: '2024 – 2026', ar: '٢٠٢٤ – ٢٠٢٦' },
            verify: '/certifications',
        },
        papers100: {
            key: 'papers100',
            pillar: 'gene',
            count: 38,
            suffix: '',
            label: { en: 'Published Research Outputs', ar: 'مخرجات بحثية منشورة' },
            desc: {
                en: 'Critical readings from The 100 Papers Project that advanced to published research outputs.',
                ar: 'قراءات نقدية من مشروع المئة ورقة تطورت إلى مخرجات بحثية منشورة.',
            },
            dateRange: { en: '2023 – 2026', ar: '٢٠٢٣ – ٢٠٢٦' },
            verify: '/certifications',
        },
        phd: {
            key: 'phd',
            pillar: 'gene',
            count: 7,
            suffix: '',
            label: { en: 'PhD Thesis Completions', ar: 'إتمام رسائل دكتوراه' },
            desc: {
                en: 'Successful doctoral completions under direct consortium supervision.',
                ar: 'إتمام رسائل دكتوراه بنجاح تحت إشراف مباشر من الكونسورتيوم.',
            },
            theses: [
                { en: 'Molecular diagnostics of drug-resistant tuberculosis in conflict settings', ar: 'التشخيص الجزيئي للسل المقاوم للأدوية في بيئات النزاع' },
                { en: 'Genomic surveillance of vector-borne disease in the Nile basin', ar: 'الترصد الجينومي للأمراض المنقولة بالنواقل في حوض النيل' },
                { en: 'Point-of-care CRISPR diagnostics for low-resource laboratories', ar: 'تشخيصات CRISPR عند النقطة للمختبرات محدودة الموارد' },
            ],
            dateRange: { en: '2023 – 2026', ar: '٢٠٢٣ – ٢٠٢٦' },
            verify: '/certifications',
        },
        geographic: {
            universities: 54,
            partners: 40,
            regions: [
                { en: 'Khartoum', ar: 'الخرطوم' },
                { en: 'Port Sudan', ar: 'بورتسودان' },
                { en: 'Cairo', ar: 'القاهرة' },
                { en: 'Riyadh', ar: 'الرياض' },
                { en: 'Addis Ababa', ar: 'أديس أبابا' },
                { en: 'Nairobi', ar: 'نيروبي' },
            ],
        },
        timeline: [
            { month: 1, label: { en: 'Consortium founded', ar: 'تأسيس الكونسورتيوم' }, members: 500 },
            { month: 4, label: { en: 'First BLS cohort certified', ar: 'أول دفعة BLS معتمدة' }, members: 980 },
            { month: 8, label: { en: 'MTC vignette bank crosses 1,000', ar: 'بنك سيناريوهات MTC يتجاوز ١٠٠٠' }, members: 1620 },
            { month: 12, label: { en: 'GLOMEt turnkey labs deployed', ar: 'نشر مختبرات جلوميت الجاهزة' }, members: 2100 },
            { month: 15, label: { en: '2,441 verified members', ar: '٢٤٤١ عضواً موثّقاً' }, members: 2441 },
        ],
        testimonials: [
            {
                name: { en: 'Dr. Hala Othman', ar: 'د. هالة عثمان' },
                role: { en: 'GemIInIxSMC Licensed · GA-1187', ar: 'مرخّصة GemIInIxSMC · GA-1187' },
                cert: 'BLS · MRCS',
                quote: {
                    en: 'I rebuilt my credentials in exile. The vignettes were audited, sealed, and recognized when I applied abroad.',
                    ar: 'أعدت بناء اعتماداتي في المنفى. السيناريوهات كانت مدقّقة ومختومة ومعترفاً بها عند التقديم للخارج.',
                },
            },
            {
                name: { en: 'Yousif Bashir', ar: 'يوسف بشير' },
                role: { en: 'USMLE Step 1 / 2CK · GA-2034', ar: 'USMLE الخطوة 1 / 2CK · GA-2034' },
                cert: 'USMLE',
                quote: {
                    en: 'The structured Step 1 and 2CK tracking kept me accountable. I passed both on the first attempt.',
                    ar: 'التتبع المنظم للخطوة 1 و2CK أبقاني ملتزماً. نجحت في كليهما من المحاولة الأولى.',
                },
            },
            {
                name: { en: 'Dr. Salma Idris', ar: 'د. سلمى إدريس' },
                role: { en: 'PhD Candidate · GA-0742', ar: 'مرشحة دكتوراه · GA-0742' },
                cert: 'PhD Supervision',
                quote: {
                    en: 'The 15:5:1 mentorship cascade turned my scattered ideas into a defended thesis proposal.',
                    ar: 'حوّل شلال الإرشاد 15:5:1 أفكاري المتناثرة إلى مقترح رسالة مُدافَع عنه.',
                },
            },
        ],
    },

    // ---- Pricing ------------------------------------------------------------
    pricing: {
        paymentMethods: [
            {
                key: 'vodafone',
                name: 'Vodafone Cash',
                number: '+20 101 592 2628',
                holder: { en: 'Gene Academy Treasury', ar: 'خزينة أكاديمية الجينات' },
                qr: true,
                steps: {
                    en: ['Open Vodafone Cash on your phone', 'Send the tier amount to +20 101 592 2628', 'Keep the transaction SMS as proof', 'Email the receipt to payments@geneacademy.net'],
                    ar: ['افتح Vodafone Cash على هاتفك', 'أرسل قيمة الباقة إلى +20 101 592 2628', 'احتفظ برسالة العملية كإثبات', 'أرسل الإيصال إلى payments@geneacademy.net'],
                },
            },
            {
                key: 'bankak',
                name: 'Bankak',
                number: 'Master Financial Treasury',
                holder: { en: 'Gene Academy — Master Financial Treasury', ar: 'أكاديمية الجينات — الخزينة المالية الرئيسية' },
                account: 'GA-TREASURY-0000',
                steps: {
                    en: ['Open the Bankak app', 'Choose "Send to account" and enter GA-TREASURY-0000', 'Confirm the tier amount in SDG', 'Save the confirmation reference and email it to payments@geneacademy.net'],
                    ar: ['افتح تطبيق بنكك', 'اختر "إرسال إلى حساب" وأدخل GA-TREASURY-0000', 'أكّد قيمة الباقة بالجنيه السوداني', 'احفظ رقم المرجع وأرسله إلى payments@geneacademy.net'],
                },
            },
        ],
        currencies: [
            { code: 'SDG', label: 'Sudanese Pound', range: '5,000 – 100,000', method: 'Bankak' },
            { code: 'SAR', label: 'Saudi Riyal', range: '20 – 60', method: 'Saudi transfer' },
            { code: 'USD', label: 'US Dollar', range: '$10 – $50', method: 'International' },
        ],
        tiers: [
            {
                name: 'Explorer',
                sdg: 5000,
                sar: 20,
                usd: 10,
                period: { en: 'per month', ar: 'شهرياً' },
                perks: {
                    en: ['500 welcome GP', 'Community pod access', 'Public resource library', 'GA-ID verification'],
                    ar: ['٥٠٠ نقطة ترحيب', 'وصول قنوات المجتمع', 'مكتبة الموارد العامة', 'توثيق رقم العضوية'],
                },
            },
            {
                name: 'Scholar',
                sdg: 25000,
                sar: 40,
                usd: 30,
                period: { en: 'per month', ar: 'شهرياً' },
                featured: true,
                perks: {
                    en: ['Everything in Explorer', 'Full MTC vignette bank', '15:5:1 mentorship cascade', 'SHA-256 Living CV', '1,000 GP = 10 CPD hours'],
                    ar: ['كل ما في Explorer', 'بنك سيناريوهات MTC الكامل', 'شلال الإرشاد 15:5:1', 'السيرة الذاتية الحية SHA-256', '١٠٠٠ نقطة = ١٠ ساعات تطوير مهني'],
                },
            },
            {
                name: 'Sovereign',
                sdg: 100000,
                sar: 60,
                usd: 50,
                period: { en: 'per month', ar: 'شهرياً' },
                perks: {
                    en: ['Everything in Scholar', '1:1 exam coaching', 'PhD thesis supervision', 'GLOMEt partner pricing', 'Priority institutional licensing'],
                    ar: ['كل ما في Scholar', 'إرشاد فردي للامتحانات', 'إشراف رسائل الدكتوراه', 'أسعار شركاء جلوميت', 'ترخيص مؤسسي أولوية'],
                },
            },
        ],
    },

    // ---- The three doors / pillars ------------------------------------------
    pillars: {
        gemiini: {
            key: 'gemiini',
            name: { en: 'GemIInI Academy', ar: 'أكاديمية جيميني' },
            audience: { en: 'Medical Students · House Officers · Registrars', ar: 'طلاب الطب · النوابم · المسجلون' },
            tagline: {
                en: 'Medical licensure and clinical mastery — from SMC to MRCS, USMLE and the German FSP.',
                ar: 'الترخيص الطبي والإتقان السريري — من SMC إلى MRCS وUSMLE والـ FSP الألماني.',
            },
            to: '/courses?branch=GemIInI',
            programs: [
                { name: { en: 'GemIInIxSMC Licensure', ar: 'ترخيص GemIInIxSMC' }, desc: { en: 'Full Sudan Medical Council licensure pathway with audited vignettes.', ar: 'مسار ترخيص المجلس الطبي السوداني الكامل بسيناريوهات مدققة.' } },
                { name: { en: 'Module IV — Surgery & Trauma', ar: 'الوحدة الرابعة — الجراحة والرضوض' }, desc: { en: 'High-yield surgical and trauma scenarios mapped to exam blueprints.', ar: 'سيناريوهات جراحية ورضية عالية القيمة مرتبطة بمواصفات الامتحان.' } },
                { name: { en: 'BSS-2 (105h)', ar: 'BSS-2 (١٠٥ ساعة)' }, desc: { en: 'Basic Surgical Skills — 105 supervised hours with assessment.', ar: 'مهارات جراحية أساسية — ١٠٥ ساعات بإشراف وتقييم.' } },
                { name: { en: 'USMLE Step 1 / 2CK', ar: 'USMLE الخطوة 1 / 2CK' }, desc: { en: 'Structured Step 1 and 2CK preparation with progress tracking.', ar: 'تحضير منظم للخطوة 1 و2CK مع تتبع التقدم.' } },
                { name: { en: 'MRCS', ar: 'MRCS' }, desc: { en: 'Membership of the Royal College of Surgeons exam coaching.', ar: 'إرشاد امتحان عضوية كلية الجراحين الملكية.' } },
                { name: { en: 'German FSP / Anamnese', ar: 'الـ FSP الألماني / الأنامنيز' }, desc: { en: 'Fachsprachenprüfung and anamnese interview preparation.', ar: 'تحضير امتحان اللغة الطبية ومقابلة الأنامنيز.' } },
            ],
        },
        gene: {
            key: 'gene',
            name: { en: 'GeneAcademy', ar: 'أكاديمية الجينات' },
            audience: { en: 'Life Science Enthusiasts · Pre-Meds · Postgrads', ar: 'محبو علوم الحياة · قبل الطب · الدراسات العليا' },
            tagline: {
                en: 'Molecular diagnostics, genomic literacy and mentorship for the next generation of scientists.',
                ar: 'التشخيص الجزيئي والثقافة الجينومية والإرشاد للجيل القادم من العلماء.',
            },
            to: '/courses?branch=Gene%20Academy',
            programs: [
                { name: { en: 'Biology with Gibbril (BWG)', ar: 'علم الأحياء مع جبريل' }, desc: { en: 'Flagship biology series taught by the founder.', ar: 'سلسلة الأحياء الرئيسية بإشراف المؤسس.' } },
                { name: { en: '15:5:1 Mentorship Cascade', ar: 'شلال الإرشاد 15:5:1' }, desc: { en: '15 mentees, 5 mentors, 1 lead — structured cascade support.', ar: '١٥ متدرباً، ٥ مرشدين، قائد واحد — دعم متدرّج منظم.' } },
                { name: { en: 'The 100 Papers Project', ar: 'مشروع المئة ورقة' }, desc: { en: 'Guided critical reading of 100 landmark papers.', ar: 'قراءة نقدية موجهة لـ ١٠٠ ورقة علمية محورية.' } },
                { name: { en: 'MM1–8 Molecular Mastery', ar: 'الإتقان الجزيئي MM1–8' }, desc: { en: 'Eight-module molecular methods progression.', ar: 'تدرّج من ثماني وحدات في الطرق الجزيئية.' } },
                { name: { en: 'PhD Thesis Supervision', ar: 'إشراف رسائل الدكتوراه' }, desc: { en: 'Direct supervision for postgraduate research candidates.', ar: 'إشراف مباشر لمرشحي البحوث العليا.' } },
            ],
        },
        glomet: {
            key: 'glomet',
            name: { en: 'GLOMEt HQ', ar: 'مقر جلوميت' },
            audience: { en: 'Hospitals · Labs · Biotech Students', ar: 'المستشفيات · المختبرات · طلاب التكنولوجيا الحيوية' },
            tagline: {
                en: 'Turnkey molecular infrastructure — and the CSR engine that funds student biotech grants.',
                ar: 'بنية تحتية جزيئية جاهزة — ومحرك المسؤولية الذي يموّل منح الطلاب.',
            },
            to: '/services',
            programs: [
                { name: { en: 'Turnkey Molecular Labs', ar: 'مختبرات جزيئية جاهزة' }, desc: { en: 'End-to-end lab design, install, validation and training.', ar: 'تصميم وتركيب وتحقق وتدريب المختبر من البداية للنهاية.' } },
                { name: { en: 'CBC Analyzers', ar: 'محللات CBC' }, desc: { en: 'Hematology analyzer supply, calibration and service contracts.', ar: 'توريد محللات الدم ومعايرتها وعقود الصيانة.' } },
                { name: { en: 'POCT Consumables', ar: 'مستهلكات POCT' }, desc: { en: 'Point-of-care testing consumables and cold-chain logistics.', ar: 'مستهلكات الاختبار عند النقطة وسلسلة التبريد.' } },
                { name: { en: 'Biotech Student Funding Grants', ar: 'منح تمويل طلاب التكنولوجيا الحيوية' }, desc: { en: 'CSR-funded scholarships powered by equipment sales revenue.', ar: 'منح دراسية ممولة من المسؤولية المجتمعية عبر مبيعات المعدات.' } },
            ],
        },
    },

    // ---- Narrative copy -----------------------------------------------------
    narrative: {
        hero: {
            eyebrow: { en: 'SudaGene Consortium · Sovereign Truth', ar: 'كونسورتيوم سوداجين · السيادة المعرفية' },
            title: { en: 'The Sovereign Sanctuary for Medical & Life Sciences', ar: 'الملاذ السيادي للعلوم الطبية والحيوية' },
            sub: {
                en: 'A bilingual, Prometric-verified ecosystem where displaced Sudanese clinicians and scientists rebuild their credentials — one audited vignette, one SHA-256 certificate, one sovereign GA-ID at a time.',
                ar: 'منظومة ثنائية اللغة موثقة بالبرومتريك يعيد فيها الأطباء والعلماء السودانيون النازحون بناء اعتماداتهم — سيناريو مدقّق، شهادة SHA-256، رقم عضوية سيادي في كل مرة.',
            },
        },
        ledger: {
            title: { en: 'The Success Ledger', ar: 'سجل النجاح' },
            sub: { en: 'Proof, not promises. What the consortium has verified so far.', ar: 'دليل لا وعود. ما وثّقه الكونسورتيوم حتى الآن.' },
        },
        doors: {
            title: { en: 'The Three Doors', ar: 'الأبواب الثلاثة' },
            sub: { en: 'One consortium, three sovereign paths. Pick the door that matches your work today.', ar: 'كونسورتيوم واحد، ثلاثة مسارات سيادية. اختر الباب الذي يناسب عملك اليوم.' },
        },
        glometPromise: {
            eyebrow: { en: 'The GLOMEt CSR Engine', ar: 'محرك مسؤولية جلوميت' },
            title: { en: 'The GLOMEt Promise', ar: 'وعد جلوميت' },
            body: {
                en: 'Equipment sales funding student biotech grants. Every analyzer, every consumable, every turnkey lab we deliver to a hospital or research center channels revenue back into scholarships for the next generation of Sudanese biotechnologists. The more we equip, the more we educate.',
                ar: 'مبيعات المعدات تموّل منح طلاب التكنولوجيا الحيوية. كل محللة وكل مستهلك وكل مختبر جاهز نسلمه لمستشفى أو مركز بحثي يوجّه إيراده إلى منح للجيل القادم من تقنيي السودان الحيويين. كلما زاد تجهيزنا، زاد تعليمنا.',
            },
        },
        livingCV: {
            eyebrow: { en: 'Prometric of Sudan', ar: 'برومتريك السودان' },
            title: { en: 'The Living CV', ar: 'السيرة الذاتية الحية' },
            body: {
                en: 'Prometric-verified and cryptographically sealed. Every clinical vignette you master is logged, scored and stamped with a SHA-256 certificate — immutable proof of competence that travels with you across borders and into international recruitment.',
                ar: 'موثق بالبرومتريك ومختوم تشفيرياً. كل سيناريو سريري تتقنه يُسجَّل ويُحرَّز ويُختَم بشهادة SHA-256 — دليل لا يُمحى على الكفاءة يرافقك عبر الحدود وفي التوظيف الدولي.',
            },
            badges: [
                { en: 'Prometric-verified', ar: 'موثق بالبرومتريك' },
                { en: 'SHA-256 sealed', ar: 'مختوم SHA-256' },
                { en: 'Immutable proof', ar: 'دليل لا يُمحى' },
            ],
        },
        faculty: {
            title: { en: 'Faculty Leadership', ar: 'قيادة هيئة التدريس' },
            sub: { en: 'Named clinicians and scientists behind every audited scenario.', ar: 'أطباء وعلماء معروفون بالاسم خلف كل سيناريو مدقّق.' },
        },
        pricing: {
            title: { en: 'Sovereign Pricing', ar: 'أسعار السيادة' },
            sub: { en: 'Three tiers, three currencies. Pay in SDG via Bankak, SAR, or USD.', ar: 'ثلاث مستويات، ثلاث عملات. ادفع بالجنيه عبر بنكك أو الريال أو الدولار.' },
        },
        airlock: {
            eyebrow: { en: 'The Airlock', ar: 'غرفة العبور' },
            title: { en: 'Claim Your Sovereign GA-ID & Google Drive Workspace', ar: 'احجز رقم عضويتك السيادي ومساحة Google Drive' },
            body: {
                en: 'One identity across the entire consortium — verified, portable, yours. Sign in or register to unlock your secure workspace, your Living CV and your 500 welcome GP.',
                ar: 'هوية واحدة عبر الكونسورتيوم كله — موثقة، محمولة، ملكك. سجّل الدخول أو أنشئ حساباً لفتح مساحة عملك الآمنة وسيرتك الذاتية الحية و٥٠٠ نقطة ترحيب.',
            },
        },
        // The four narrative pillars
        pillars: {
            displacement: {
                title: { en: 'Academic Displacement Resilience', ar: 'صمود النزوح الأكاديمي' },
                body: { en: 'Education that survives borders, war and exile — credentials that move with the learner.', ar: 'تعليم يصمد عبر الحدود والحرب والمنفى — اعتمادات تنتقل مع المتعلم.' },
            },
            lifeSciences: {
                title: { en: 'Life Sciences Vision', ar: 'رؤية علوم الحياة' },
                body: { en: 'Genomic literacy and molecular mastery as a sovereign national capability.', ar: 'الثقافة الجينومية والإتقان الجزيئي كقدرة وطنية سيادية.' },
            },
            csr: {
                title: { en: 'GLOMEt CSR Engine', ar: 'محرك مسؤولية جلوميت' },
                body: { en: 'Equipment revenue converted into biotech student grants — commerce funding education.', ar: 'إيراد المعدات يتحول إلى منح لطلاب التكنولوجيا الحيوية — تجارة تموّل تعليماً.' },
            },
            prometric: {
                title: { en: 'Prometric of Sudan', ar: 'برومتريك السودان' },
                body: { en: 'A national standard of verified clinical competence, cryptographically sealed.', ar: 'معيار وطني للكفاءة السريرية الموثقة، مختوم تشفيرياً.' },
            },
        },
    },
};

export default SOVEREIGN_ECOSYSTEM;
