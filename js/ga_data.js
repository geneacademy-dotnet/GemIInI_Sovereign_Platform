/**
 * SudaPass Sovereign Registry — Core Member Ledger
 * Verified GA-IDs and Academic Affiliations
 */

export const gaRegistry = [
    {
        id: "GA000",
        name: "Dr. Mohamed Gibbril",
        name_ar: "د. محمد أحمد جبريل",
        university: "University of Khartoum - Faculty of Medicine (KU 0089958, 2021)",
        university_ar: "جامعة الخرطوم - كلية الطب",
        role: "Co-Founder & CEO | Academic Officer in Molecular Medicine",
        gp: 5000,
        ects: 120.0,
        smc: "Verified (100%)",
        tier: "Sovereign Architect"
    },
    {
        id: "GA001",
        name: "Dr. Alaa Mursi Elnour (FRCS)",
        name_ar: "د. علاء مرسي النور (FRCS)",
        university: "Letterkenny University Hospital / Clinical Directorate",
        university_ar: "مستشفى ليتركيني الجامعي / الإدارة الإكلينيكية",
        role: "Clinical Licensure & Surgical Director",
        gp: 5000,
        ects: 120.0,
        smc: "Verified (100%)",
        tier: "Sovereign Director"
    },
    {
        id: "GA004",
        name: "Dr. Safaa El Hassan",
        name_ar: "د. صفاء الحسن",
        university: "Omdurman Islamic University - Faculty of Medicine (OIU, 2016)",
        university_ar: "جامعة أم درمان الإسلامية - كلية الطب",
        role: "Academic Officer | Molecular Medicine Team Lead",
        gp: 2500,
        ects: 85.0,
        smc: "Verified (100%)",
        tier: "Senior Molecular Fellow"
    },
    {
        id: "GA0171",
        name: "Dr. Ahmed Abdelrahman",
        name_ar: "د. أحمد عبد الرحمن",
        university: "University of Khartoum - Faculty of Medicine",
        university_ar: "جامعة الخرطوم - كلية الطب",
        role: "Clinical Licensure Vanguard (SMC & MRCS)",
        gp: 1250,
        ects: 58.5,
        smc: "96.4%",
        tier: "Sovereign Vanguard"
    },
    {
        id: "GA1008",
        name: "Dr. Maram Hassan",
        name_ar: "د. مرام حسن",
        university: "University of Gezira - Faculty of Medicine",
        university_ar: "جامعة الجزيرة - كلية الطب",
        role: "Clinical Licensure Scholar",
        gp: 780,
        ects: 35.0,
        smc: "91.2%",
        tier: "Active Scholar"
    },
    {
        id: "GA5406",
        name: "Dr. Tarig Mohamed",
        name_ar: "د. طارق محمد",
        university: "Nile University - Faculty of Medicine",
        university_ar: "جامعة النيل - مجمع الكليات الطبية",
        role: "Emergency & Critical Care Fellow",
        gp: 1850,
        ects: 72.0,
        smc: "98.1%",
        tier: "Sovereign Vanguard"
    }
];

if (typeof window !== "undefined") {
    window.gaRegistry = gaRegistry;
}
