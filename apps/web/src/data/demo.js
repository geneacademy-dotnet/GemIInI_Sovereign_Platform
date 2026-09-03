// DEMO DATA â€” clearly labelled placeholder content. Replace by wiring the
// service layer in src/lib/geneApi.js or PocketBase collections to real records.

export const instructors = [
    {
        id: 'inst-1',
        name: 'Dr. Rania Abdelrahman',
        nameAr: 'Ø¯. Ø±Ø§Ù†ÙŠØ§ Ø¹Ø¨Ø¯ Ø§Ù„Ø±Ø­Ù…Ù†',
        title: 'Consultant Internal Medicine, MTC framework lead',
        titleAr: 'Ø§Ø³ØªØ´Ø§Ø±ÙŠØ© Ø§Ù„Ø·Ø¨ Ø§Ù„Ø¨Ø§Ø·Ù†ÙŠØŒ Ù‚Ø§Ø¦Ø¯Ø© Ø¥Ø·Ø§Ø± MTC',
        photo: 'https://images.hostinger.com/78c989d9-4aeb-4585-8079-f0455f63b0bd.png',
    },
    {
        id: 'inst-2',
        name: 'Dr. Yassir Musa',
        nameAr: 'Ø¯. ÙŠØ§Ø³Ø± Ù…ÙˆØ³Ù‰',
        title: 'Molecular diagnostics lead, Gene Academy laboratory track',
        titleAr: 'Ø±Ø¦ÙŠØ³ Ø§Ù„ØªØ´Ø®ÙŠØµ Ø§Ù„Ø¬Ø²ÙŠØ¦ÙŠØŒ Ù…Ø³Ø§Ø± Ø§Ù„Ù…Ø®ØªØ¨Ø±Ø§Øª',
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
        title: 'MTC Clinical Exam Simulator â€” Core',
        titleAr: 'Ù…Ø­Ø§ÙƒÙŠ Ø§Ù…ØªØ­Ø§Ù† MTC Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ â€” Ø§Ù„Ø£Ø³Ø§Ø³ÙŠ',
        summary: 'Vignette-driven single-best-answer practice with audited explanations across internal medicine, surgery, paediatrics and obstetrics.',
        summaryAr: 'ØªØ¯Ø±ÙŠØ¨ Ø¹Ù„Ù‰ Ø£Ø³Ø¦Ù„Ø© Ø§Ù„Ø§Ø®ØªÙŠØ§Ø± Ø§Ù„Ø£ÙØ¶Ù„ Ø§Ù„Ù…Ø¨Ù†ÙŠØ© Ø¹Ù„Ù‰ Ø­Ø§Ù„Ø§Øª Ø³Ø±ÙŠØ±ÙŠØ© Ù…Ø¹ Ø´Ø±ÙˆØ­Ø§Øª Ù…Ø¯Ù‚Ù‚Ø© ÙÙŠ Ø§Ù„Ø¨Ø§Ø·Ù†ÙŠØ© ÙˆØ§Ù„Ø¬Ø±Ø§Ø­Ø© ÙˆØ§Ù„Ø£Ø·ÙØ§Ù„ ÙˆØ§Ù„Ù†Ø³Ø§Ø¡.',
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
        titleAr: 'Ø§Ù„Ø«Ù‚Ø§ÙØ© Ø§Ù„Ø¬ÙŠÙ†ÙˆÙ…ÙŠØ© Ù„Ù„Ø£Ø·Ø¨Ø§Ø¡',
        summary: 'Read, interpret and communicate genomic reports with confidence â€” from variant classification to family counselling.',
        summaryAr: 'Ø§Ù‚Ø±Ø£ Ø§Ù„ØªÙ‚Ø§Ø±ÙŠØ± Ø§Ù„Ø¬ÙŠÙ†ÙˆÙ…ÙŠØ© ÙˆÙØ³Ù‘Ø±Ù‡Ø§ ÙˆØªÙˆØ§ØµÙ„ Ø¨Ù‡Ø§ Ø¨Ø«Ù‚Ø© â€” Ù…Ù† ØªØµÙ†ÙŠÙ Ø§Ù„Ù…ØªØºÙŠØ±Ø§Øª Ø¥Ù„Ù‰ Ø¥Ø±Ø´Ø§Ø¯ Ø§Ù„Ø£Ø³Ø±Ø©.',
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
        titleAr: 'Ø§Ù„ØªØ´Ø®ÙŠØµ Ø§Ù„Ø¬Ø²ÙŠØ¦ÙŠ: Ø¬ÙˆØ¯Ø© PCR ÙˆØ§Ù„ØªØ­Ù‚Ù‚',
        summary: 'Assay validation, contamination control and ISO 15189 documentation for molecular laboratories.',
        summaryAr: 'Ø§Ù„ØªØ­Ù‚Ù‚ Ù…Ù† Ø§Ù„ÙØ­ÙˆØµØ§Øª ÙˆÙ…ÙƒØ§ÙØ­Ø© Ø§Ù„ØªÙ„ÙˆØ« ÙˆØªÙˆØ«ÙŠÙ‚ ISO 15189 Ù„Ù…Ø®ØªØ¨Ø±Ø§Øª Ø§Ù„Ø¨ÙŠÙˆÙ„ÙˆØ¬ÙŠØ§ Ø§Ù„Ø¬Ø²ÙŠØ¦ÙŠØ©.',
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
        titleAr: 'Ø§Ù„Ù…Ø´ØªØ±ÙŠØ§Øª Ø§Ù„Ø·Ø¨ÙŠØ© ÙˆØ§Ù„Ø¹Ù…Ù„ÙŠØ§Øª Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ©',
        summary: 'Specification writing, supplier evaluation and cold-chain logistics for hospitals and diagnostic networks.',
        summaryAr: 'ÙƒØªØ§Ø¨Ø© Ø§Ù„Ù…ÙˆØ§ØµÙØ§Øª ÙˆØªÙ‚ÙŠÙŠÙ… Ø§Ù„Ù…ÙˆØ±Ø¯ÙŠÙ† ÙˆØ³Ù„Ø³Ù„Ø© Ø§Ù„ØªØ¨Ø±ÙŠØ¯ Ù„Ù„Ù…Ø³ØªØ´ÙÙŠØ§Øª ÙˆØ´Ø¨ÙƒØ§Øª Ø§Ù„ØªØ´Ø®ÙŠØµ.',
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
    { id: 'r1', title: 'How to read an ACMG variant table in five minutes', titleAr: 'ÙƒÙŠÙ ØªÙ‚Ø±Ø£ Ø¬Ø¯ÙˆÙ„ Ù…ØªØºÙŠØ±Ø§Øª ACMG ÙÙŠ Ø®Ù…Ø³ Ø¯Ù‚Ø§Ø¦Ù‚', type: 'Article', minutes: 6 },
    { id: 'r2', title: 'MTC blueprint 2025: what actually changed', titleAr: 'Ù…Ø®Ø·Ø· Ø§Ù…ØªØ­Ø§Ù† MTC Ù¢Ù Ù¢Ù¥: Ù…Ø§ Ø§Ù„Ø°ÙŠ ØªØºÙŠÙ‘Ø± ÙØ¹Ù„Ø§Ù‹', type: 'Guide', minutes: 11 },
    { id: 'r3', title: 'Contamination control checklist for small PCR labs', titleAr: 'Ù‚Ø§Ø¦Ù…Ø© Ù…ÙƒØ§ÙØ­Ø© Ø§Ù„ØªÙ„ÙˆØ« Ù„Ù…Ø®ØªØ¨Ø±Ø§Øª PCR Ø§Ù„ØµØºÙŠØ±Ø©', type: 'Checklist', minutes: 4 },
];

export const leaderboard = [
    { id: 'l1', name: 'M. Elhassan', gaId: 'GA-2087', points: 1840 },
    { id: 'l2', name: 'S. Yousif', gaId: 'GA-3311', points: 1655 },
    { id: 'l3', name: 'A. Bakri', gaId: 'GA-4520', points: 1412 },
    { id: 'l4', name: 'N. Ibrahim', gaId: 'GA-5108', points: 1290 },
    { id: 'l5', name: 'H. Osman', gaId: 'GA-6002', points: 1105 },
];

export const invoices = [
    { id: 'INV-2041', item: 'MTC Core â€” annual seat', amount: 180, currency: 'USD', status: 'paid', date: '2025-02-11' },
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
        nameAr: 'ÙØ±Ø¹ Ø§Ù„Ø³ÙˆØ¯Ø§Ù†',
        members: 1840,
        unread: 3,
        posts: [
            {
                id: 'p1',
                author: 'Dr. Rania Abdelrahman',
                announcement: true,
                time: '2h',
                body: 'Cohort 12 orientation is on Sunday 19:00 (CAT). Bring your logbook questions.',
                bodyAr: 'Ø§Ø¬ØªÙ…Ø§Ø¹ Ø§Ù„ØªØ¹Ø±ÙŠÙ Ø¨Ø§Ù„Ø¯ÙØ¹Ø© Ù¡Ù¢ ÙŠÙˆÙ… Ø§Ù„Ø£Ø­Ø¯ Ù¡Ù©:Ù Ù . Ø£Ø­Ø¶Ø±ÙˆØ§ Ø£Ø³Ø¦Ù„Ø© Ø³Ø¬Ù„Ø§ØªÙƒÙ….',
                reactions: 42,
                comments: [
                    { id: 'cm1', author: 'M. Elhassan', body: 'Will it be recorded?', replies: [{ id: 'cm1r', author: 'Dr. Rania Abdelrahman', body: 'Yes â€” posted here within 24h.' }] },
                ],
            },
            {
                id: 'p2',
                author: 'S. Yousif',
                time: '6h',
                body: 'Sharing my notes on acid-base disorders from lesson 7 â€” reactions welcome.',
                bodyAr: 'Ø£Ø´Ø§Ø±ÙƒÙƒÙ… Ù…Ù„Ø§Ø­Ø¸Ø§ØªÙŠ Ø¹Ù† Ø§Ø¶Ø·Ø±Ø§Ø¨Ø§Øª Ø§Ù„ØªÙˆØ§Ø²Ù† Ø§Ù„Ø­Ù…Ø¶ÙŠ Ø§Ù„Ù‚Ø§Ø¹Ø¯ÙŠ Ù…Ù† Ø§Ù„Ø¯Ø±Ø³ Ø§Ù„Ø³Ø§Ø¨Ø¹.',
                reactions: 18,
                comments: [],
            },
        ],
    },
    {
        id: 'c-lab',
        kind: 'career',
        name: 'Laboratory scientists',
        nameAr: 'Ø¹Ù„Ù…Ø§Ø¡ Ø§Ù„Ù…Ø®ØªØ¨Ø±Ø§Øª',
        members: 612,
        unread: 0,
        posts: [
            {
                id: 'p3',
                author: 'Dr. Yassir Musa',
                time: '1d',
                body: 'Which extraction kit are you validating this quarter? Comparing yields across three sites.',
                bodyAr: 'Ø£ÙŠ Ø·Ù‚Ù… Ø§Ø³ØªØ®Ù„Ø§Øµ ØªØªØ­Ù‚Ù‚ÙˆÙ† Ù…Ù†Ù‡ Ù‡Ø°Ø§ Ø§Ù„Ø±Ø¨Ø¹ØŸ Ù†Ù‚Ø§Ø±Ù† Ø§Ù„Ø¹Ø§Ø¦Ø¯ Ø¨ÙŠÙ† Ø«Ù„Ø§Ø«Ø© Ù…ÙˆØ§Ù‚Ø¹.',
                reactions: 25,
                comments: [{ id: 'cm2', author: 'A. Bakri', body: 'Column-based, switching from magnetic beads.', replies: [] }],
            },
        ],
    },
    {
        id: 'c-uofk',
        kind: 'institution',
        name: 'University of Khartoum',
        nameAr: 'Ø¬Ø§Ù…Ø¹Ø© Ø§Ù„Ø®Ø±Ø·ÙˆÙ…',
        members: 430,
        unread: 5,
        posts: [
            {
                id: 'p4',
                author: 'N. Ibrahim',
                time: '3d',
                body: 'Study group forming for the March mock exam â€” 6 seats left.',
                bodyAr: 'ØªÙƒÙˆÙŠÙ† Ù…Ø¬Ù…ÙˆØ¹Ø© Ø¯Ø±Ø§Ø³Ø© Ù„Ø§Ù…ØªØ­Ø§Ù† Ù…Ø§Ø±Ø³ Ø§Ù„ØªØ¬Ø±ÙŠØ¨ÙŠ â€” ØªØ¨Ù‚Ù‰ Ù¦ Ù…Ù‚Ø§Ø¹Ø¯.',
                reactions: 31,
                comments: [],
            },
        ],
    },
];

export const quiz = {
    id: 'mtc-quiz-1',
    courseId: 'mtc-core',
    lesson: 'Lesson 7 â€” Acid-base and electrolytes',
    framework: 'MTC Clinical Framework v3 Â· single best answer Â· negative marking disabled',
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

// Verified Master Registry Initial Dataset
export const gaRegistry = [
  { id: 'GA-000', name: 'Dr. Mohamed Gibbril', role: 'Founder & CEO â€” SudaGene Consortium', university: 'Karary University (KU 0089958 2021)', gp: 2500, status: 'ACCREDITED', verified: true, ects: 60.0, hash: 'SUDAPASS-GA000-PERMANENT', signatory: 'SudaGene Consortium Executive Board' },
  { id: 'GA-001', name: 'Dr. Alaa Mursi Elnour', role: 'Co-Founder & COO', university: 'FRCSI Letterkenny General Hospital', gp: 2500, status: 'ACCREDITED', verified: true, ects: 60.0, hash: 'SUDAPASS-GA001-PERMANENT', signatory: 'SudaGene Consortium Executive Board' },
  { id: 'GA-004', name: 'Dr. Safaa Elhassan', role: 'Senior Academic Officer', university: 'Omdurman Islamic University (OIU 2016)', gp: 1200, status: 'ACCREDITED', verified: true, ects: 30.0, hash: 'SUDAPASS-GA004-PERMANENT', signatory: 'SudaGene Consortium Executive Board' },
  { id: 'GA-011', name: 'Eng. Amjad Gurashi', role: 'Systems & GIS Operations Expert', university: 'Alzaiem Alazhari University (AAU 2017)', gp: 1500, status: 'ACCREDITED', verified: true, ects: 35.0, hash: 'SUDAPASS-GA011-PERMANENT', signatory: 'SudaGene Consortium Executive Board' },

  { id: 'GA-088', name: 'Dr. Mehad Mustafa', role: 'Clinical Member (BLS Certified)', university: 'Sudanese Medical Faculty', gp: 250, status: 'ACCREDITED', verified: true, ects: 10.0, hash: 'SUDAPASS-GA088-PERMANENT', signatory: 'Dr. Sabri Training Center & GemIInI' },
  { id: 'GA-089', name: 'Dr. Mooz Adam', role: 'Clinical Member (BLS Certified)', university: 'Sudanese Medical Faculty', gp: 250, status: 'ACCREDITED', verified: true, ects: 10.0, hash: 'SUDAPASS-GA089-PERMANENT', signatory: 'Dr. Sabri Training Center & GemIInI' }
];
