// DEMO DATA — clearly labelled placeholder content. Replace by wiring the
// service layer in src/lib/geneApi.js or PocketBase collections to real records.

export const instructors = [
    {
        id: 'inst-1',
        name: 'Dr. Rania Abdelrahman',
        nameAr: 'د. رانيا عبد الرحمن',
        title: 'Consultant Internal Medicine, MTC framework lead',
        titleAr: 'استشارية الطب الباطني، قائدة إطار MTC',
        photo: 'https://images.hostinger.com/78c989d9-4aeb-4585-8079-f0455f63b0bd.png',
    },
    {
        id: 'inst-2',
        name: 'Dr. Yassir Musa',
        nameAr: 'د. ياسر موسى',
        title: 'Molecular diagnostics lead, Gene Academy laboratory track',
        titleAr: 'رئيس التشخيص الجزيئي، مسار المختبرات',
        photo: 'https://images.hostinger.com/f34260fe-adc3-482f-a5c9-e57415e4d4a4.png',
    },
];

export const courses = [
    {
        id: 'mtc-core',
        slug: 'mtc-core',
        branch: 'GemIInI',
        track: 'Clinical exams',
        level: 1,
        title: 'MTC Clinical Exam Simulator — Core',
        titleAr: 'محاكي امتحان MTC السريري — الأساسي',
        summary: 'Vignette-driven single-best-answer practice with audited explanations across internal medicine, surgery, paediatrics and obstetrics.',
        summaryAr: 'تدريب على أسئلة الاختيار الأفضل المبنية على حالات سريرية مع شروحات مدققة في الباطنية والجراحة والأطفال والنساء.',
        instructorId: 'inst-1',
        lessons: 24,
        hours: 18,
        enrolled: 1284,
        progress: 62,
        cover: 'https://images.hostinger.com/03418505-e89e-482e-832e-108d10d90441.png',
        outline: ['Exam blueprint and scoring', 'Internal medicine vignettes', 'Surgical decision making', 'Paediatric emergencies', 'Timed mock exam'],
    },
    {
        id: 'genomic-literacy',
        slug: 'genomic-literacy',
        branch: 'Gene Academy',
        track: 'Genomics',
        level: 1,
        title: 'Genomic Literacy for Clinicians',
        titleAr: 'الثقافة الجينومية للأطباء',
        summary: 'Read, interpret and communicate genomic reports with confidence — from variant classification to family counselling.',
        summaryAr: 'اقرأ التقارير الجينومية وفسّرها وتواصل بها بثقة — من تصنيف المتغيرات إلى إرشاد الأسرة.',
        instructorId: 'inst-2',
        lessons: 16,
        hours: 12,
        enrolled: 742,
        progress: 25,
        cover: 'https://images.hostinger.com/bcecd8f1-39b6-4114-85a0-d0dd8cd8965d.png',
        outline: ['DNA to report', 'Variant classification (ACMG)', 'Pharmacogenomics', 'Counselling the family'],
    },
    {
        id: 'pcr-quality',
        slug: 'pcr-quality',
        branch: 'Gene Academy',
        track: 'Laboratory',
        level: 2,
        title: 'Molecular Diagnostics: PCR Quality & Validation',
        titleAr: 'التشخيص الجزيئي: جودة PCR والتحقق',
        summary: 'Assay validation, contamination control and ISO 15189 documentation for molecular laboratories.',
        summaryAr: 'التحقق من الفحوصات ومكافحة التلوث وتوثيق ISO 15189 لمختبرات البيولوجيا الجزيئية.',
        instructorId: 'inst-2',
        lessons: 20,
        hours: 15,
        enrolled: 389,
        progress: 0,
        locked: true,
        cover: 'https://images.hostinger.com/bcecd8f1-39b6-4114-85a0-d0dd8cd8965d.png',
        outline: ['Assay design', 'Verification vs validation', 'Contamination control', 'Audit readiness'],
    },
    {
        id: 'procurement-ops',
        slug: 'procurement-ops',
        branch: 'GLOMEt',
        track: 'Operations',
        level: 1,
        title: 'Medical Procurement & Clinical Operations',
        titleAr: 'المشتريات الطبية والعمليات السريرية',
        summary: 'Specification writing, supplier evaluation and cold-chain logistics for hospitals and diagnostic networks.',
        summaryAr: 'كتابة المواصفات وتقييم الموردين وسلسلة التبريد للمستشفيات وشبكات التشخيص.',
        instructorId: 'inst-1',
        lessons: 12,
        hours: 9,
        enrolled: 216,
        progress: 100,
        cover: 'https://images.hostinger.com/03418505-e89e-482e-832e-108d10d90441.png',
        outline: ['Needs assessment', 'Tender specifications', 'Supplier scoring', 'Cold-chain logistics'],
    },
];

export const resources = [
    { id: 'r1', title: 'How to read an ACMG variant table in five minutes', titleAr: 'كيف تقرأ جدول متغيرات ACMG في خمس دقائق', type: 'Article', minutes: 6 },
    { id: 'r2', title: 'MTC blueprint 2025: what actually changed', titleAr: 'مخطط امتحان MTC ٢٠٢٥: ما الذي تغيّر فعلاً', type: 'Guide', minutes: 11 },
    { id: 'r3', title: 'Contamination control checklist for small PCR labs', titleAr: 'قائمة مكافحة التلوث لمختبرات PCR الصغيرة', type: 'Checklist', minutes: 4 },
];

export const leaderboard = [
    { id: 'l1', name: 'M. Elhassan', gaId: 'GA-2087', points: 1840 },
    { id: 'l2', name: 'S. Yousif', gaId: 'GA-3311', points: 1655 },
    { id: 'l3', name: 'A. Bakri', gaId: 'GA-4520', points: 1412 },
    { id: 'l4', name: 'N. Ibrahim', gaId: 'GA-5108', points: 1290 },
    { id: 'l5', name: 'H. Osman', gaId: 'GA-6002', points: 1105 },
];

export const invoices = [
    { id: 'INV-2041', item: 'MTC Core — annual seat', amount: 180, currency: 'USD', status: 'paid', date: '2025-02-11' },
    { id: 'INV-2088', item: 'Genomic Literacy cohort', amount: 120, currency: 'USD', status: 'due', date: '2025-03-02' },
];

export const appointments = [
    { id: 'a1', title: 'Coaching: exam strategy', with: 'Dr. Rania Abdelrahman', when: '2025-03-14 17:00', mode: 'Online' },
    { id: 'a2', title: 'Lab validation review', with: 'Dr. Yassir Musa', when: '2025-03-21 11:30', mode: 'On-site' },
];

export const sharedFiles = [
    { id: 'f1', name: 'MTC_blueprint_2025.pdf', size: '2.4 MB' },
    { id: 'f2', name: 'ACMG_variant_worksheet.xlsx', size: '640 KB' },
    { id: 'f3', name: 'PCR_validation_template.docx', size: '310 KB' },
];

export const communities = [
    {
        id: 'c-sudan',
        kind: 'country',
        name: 'Sudan chapter',
        nameAr: 'فرع السودان',
        members: 1840,
        unread: 3,
        posts: [
            {
                id: 'p1',
                author: 'Dr. Rania Abdelrahman',
                announcement: true,
                time: '2h',
                body: 'Cohort 12 orientation is on Sunday 19:00 (CAT). Bring your logbook questions.',
                bodyAr: 'اجتماع التعريف بالدفعة ١٢ يوم الأحد ١٩:٠٠. أحضروا أسئلة سجلاتكم.',
                reactions: 42,
                comments: [
                    { id: 'cm1', author: 'M. Elhassan', body: 'Will it be recorded?', replies: [{ id: 'cm1r', author: 'Dr. Rania Abdelrahman', body: 'Yes — posted here within 24h.' }] },
                ],
            },
            {
                id: 'p2',
                author: 'S. Yousif',
                time: '6h',
                body: 'Sharing my notes on acid-base disorders from lesson 7 — reactions welcome.',
                bodyAr: 'أشارككم ملاحظاتي عن اضطرابات التوازن الحمضي القاعدي من الدرس السابع.',
                reactions: 18,
                comments: [],
            },
        ],
    },
    {
        id: 'c-lab',
        kind: 'career',
        name: 'Laboratory scientists',
        nameAr: 'علماء المختبرات',
        members: 612,
        unread: 0,
        posts: [
            {
                id: 'p3',
                author: 'Dr. Yassir Musa',
                time: '1d',
                body: 'Which extraction kit are you validating this quarter? Comparing yields across three sites.',
                bodyAr: 'أي طقم استخلاص تتحققون منه هذا الربع؟ نقارن العائد بين ثلاثة مواقع.',
                reactions: 25,
                comments: [{ id: 'cm2', author: 'A. Bakri', body: 'Column-based, switching from magnetic beads.', replies: [] }],
            },
        ],
    },
    {
        id: 'c-uofk',
        kind: 'institution',
        name: 'University of Khartoum',
        nameAr: 'جامعة الخرطوم',
        members: 430,
        unread: 5,
        posts: [
            {
                id: 'p4',
                author: 'N. Ibrahim',
                time: '3d',
                body: 'Study group forming for the March mock exam — 6 seats left.',
                bodyAr: 'تكوين مجموعة دراسة لامتحان مارس التجريبي — تبقى ٦ مقاعد.',
                reactions: 31,
                comments: [],
            },
        ],
    },
];

export const quiz = {
    id: 'mtc-quiz-1',
    courseId: 'mtc-core',
    lesson: 'Lesson 7 — Acid-base and electrolytes',
    framework: 'MTC Clinical Framework v3 · single best answer · negative marking disabled',
    instructorId: 'inst-1',
    questions: [
        {
            id: 'q1',
            vignette: 'A 34-year-old woman presents with 3 days of vomiting. She is drowsy. ABG: pH 7.52, pCO2 47 mmHg, HCO3- 36 mmol/L. Serum K+ 2.9 mmol/L, Cl- 88 mmol/L.',
            stem: 'Which acid-base disturbance best explains these findings?',
            options: ['Respiratory alkalosis', 'Metabolic alkalosis with respiratory compensation', 'Metabolic acidosis with raised anion gap', 'Mixed respiratory and metabolic acidosis'],
            answer: 1,
            explanation: 'Loss of gastric acid produces hypochloraemic, hypokalaemic metabolic alkalosis; the raised pCO2 reflects appropriate respiratory compensation.',
        },
        {
            id: 'q2',
            vignette: 'A 61-year-old man with type 2 diabetes has polyuria and confusion. Glucose 33 mmol/L, ketones 0.4 mmol/L, osmolality 340 mOsm/kg, pH 7.36.',
            stem: 'What is the single most likely diagnosis?',
            options: ['Diabetic ketoacidosis', 'Hyperosmolar hyperglycaemic state', 'Lactic acidosis', 'Diabetes insipidus'],
            answer: 1,
            explanation: 'Marked hyperglycaemia and hyperosmolality with minimal ketosis and near-normal pH is characteristic of the hyperosmolar hyperglycaemic state.',
        },
        {
            id: 'q3',
            vignette: 'A 22-year-old athlete collapses after a marathon. Na+ 121 mmol/L, urine osmolality 90 mOsm/kg, she drank large volumes of water during the race.',
            stem: 'What is the most appropriate immediate management?',
            options: ['Rapid 0.9% saline bolus of 2 litres', 'Fluid restriction and hypertonic 3% saline if symptomatic', 'Desmopressin', 'Oral salt tablets alone'],
            answer: 1,
            explanation: 'Exercise-associated hyponatraemia from water overload is treated with fluid restriction, with hypertonic saline reserved for neurological symptoms.',
        },
        {
            id: 'q4',
            vignette: 'A 48-year-old on lisinopril and spironolactone has generalised weakness. ECG shows peaked T waves. K+ 6.9 mmol/L.',
            stem: 'Which intervention should be given first?',
            options: ['Intravenous calcium gluconate', 'Oral calcium resonium', 'Insulin with dextrose', 'Haemodialysis'],
            answer: 0,
            explanation: 'With ECG changes, calcium stabilises the myocardium immediately; shifting and removal therapies follow.',
        },
        {
            id: 'q5',
            vignette: 'A 70-year-old with COPD is drowsy. ABG on 4 L/min oxygen: pH 7.24, pCO2 82 mmHg, HCO3- 34 mmol/L.',
            stem: 'What is the most appropriate next step?',
            options: ['Increase oxygen to 10 L/min', 'Start non-invasive ventilation and titrate oxygen to 88-92%', 'Intravenous sodium bicarbonate', 'Immediate intubation'],
            answer: 1,
            explanation: 'Acute-on-chronic hypercapnic respiratory failure with acidosis is an indication for non-invasive ventilation with controlled oxygen targets.',
        },
    ],
};

export const publicStats = [
    { key: 'hero.stat1', value: 3240, suffix: '+' },
    { key: 'hero.stat2', value: 28, suffix: '' },
    { key: 'hero.stat3', value: 14, suffix: '' },
];
