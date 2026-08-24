import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, Sparkles, ArrowRight, ArrowLeft, Dna, Stethoscope, Copy, Check, ExternalLink, UserCheck, ShieldAlert, Award, Clock } from 'lucide-react';
import Layout from '@/components/site/Layout';
import { Section } from '@/components/site/Bits';
import PaymentChannels from '@/components/PaymentChannels';
import { useLang } from '@/i18n/LanguageContext';
import SovereignClient, { generateIdempotencyKey, normalizeGaId } from '@/services/sovereignService';
import { SOVEREIGN_ECOSYSTEM } from '@/data/sovereign-config';

const CANONICAL_UNIVERSITIES = [
    'جامعة الخرطوم | University of Khartoum (UofK)',
    'جامعة الجزيرة | University of Gezira (UOG)',
    'جامعة أم درمان الإسلامية | Omdurman Islamic University (OIU)',
    'جامعة الزعيم الأزهري | Alzaiem Alazhari University (AAU)',
    'جامعة النيلين | Al-Neelain University (NU)',
    'جامعة بحري | University of Bahri (UB)',
    'جامعة شندي | University of Shendi (USH)',
    'جامعة كردفان | University of Kordofan (UOK)',
    'جامعة كسلا | University of Kassala (UOK)',
    'جامعة البحر الأحمر | Red Sea University (RSU)',
    'جامعة القضارف | University of Gadarif (UOG)',
    'جامعة سنار | University of Sinnar (SU)',
    'جامعة الفاشر | University of El Fasher (UOF)',
    'جامعة العلوم والتقانة | University of Science and Technology (UST)',
    'جامعة السودان للعلوم والتكنولوجيا | SUST',
    'جامعة العلوم الطبية والتكنولوجيا | UMST',
    'جامعة ابن سينا | Ibn Sina University (ISU)',
    'جامعة الرازي | Al-Razi University (RU)',
    'جامعة الأحفاد للبنات | Ahfad University for Women (AUW)',
    'جامعة النيل | Nile University (NU)',
    'جامعة المغتربين | Al-Mughtaribeen University (MU)',
    'جامعة كرري | Karary University (KU)',
    'كلية النهضة | Al-Nahda College (NC)',
    'كلية نبتة | Napata College (NC)',
    'كلية اليرموك | Yarmouk College',
    'مؤسسة طبية أخرى / خريج خارج السودان'
];

const TRACKS = [
    {
        id: 'gemiini',
        name: 'أكاديمية جيميني (GemIInI Academy) — الترخيص السريري والجراحة',
        nameEn: 'GemIInI Academy — Clinical Licensure & Surgical Track',
        desc: 'SMC 1-8 • MRCS Part A/B • USMLE • BSS-1/BSS-2 Cairo Wet Labs • German FSP',
        icon: Stethoscope,
        color: 'teal'
    },
    {
        id: 'gene',
        name: 'أكاديمية الجينات (GeneAcademy) — الطب الجزيئي والبحث العلمي',
        nameEn: 'GeneAcademy — Molecular Medicine & Genomic Research',
        desc: 'MM 1.0-8.0 • WES Diagnostics • 100 Papers Thesis Rescue • 15:5:1 Mentorship Pods',
        icon: Dna,
        color: 'purple'
    }
];

const ROLES = [
    { id: 'house_officer', name: 'طبيب امتياز (House Officer)' },
    { id: 'clinical_student', name: 'طالب سريري / سنة 4-6 (Clinical Student)' },
    { id: 'pre_clinical', name: 'طالب مرحلة أساسية / سنة 1-3 (Pre-Clinical)' },
    { id: 'medical_officer', name: 'طبيب عمومي / نائب اختصاصي (Medical Officer / Resident)' },
    { id: 'specialist', name: 'اختصاصي / استشاري (Specialist / Consultant)' },
    { id: 'researcher', name: 'باحث في العلوم الحيوية (Biomedical Researcher)' },
    { id: 'allied_health', name: 'مختبرات طبية / كادر صحي (Clinical Laboratory / Allied Health)' }
];

const RegisterPage = () => {
    const { lang } = useLang();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        university: CANONICAL_UNIVERSITIES[0],
        role: 'clinical_student',
        track: 'gemiini',
        paymentMethod: 'vodafone',
        providerRef: '',
        deferredPayment: false
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [issuedCredential, setIssuedCredential] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleCopyId = (id) => {
        navigator.clipboard.writeText(id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim()) {
            setError(lang === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
            return;
        }

        if (!form.deferredPayment && !form.providerRef.trim()) {
            setError(lang === 'ar' ? 'يرجى إدخال رقم المعاملة أو تحديد خيار الإرسال لاحقاً' : 'Please enter payment reference or check deferred submission');
            return;
        }

        setLoading(true);

        try {
            const idempotencyKey = generateIdempotencyKey({
                email: form.email,
                phone: form.phone,
                fullName: form.fullName
            });

            const payload = {
                fullName: form.fullName,
                email: form.email,
                phone: form.phone,
                university: form.university,
                role: form.role,
                track: form.track,
                paymentChannel: form.paymentMethod,
                providerRef: form.deferredPayment ? 'DEFERRED_VIA_WHATSAPP' : form.providerRef,
                idempotencyKey
            };

            const res = await SovereignClient.register(payload);

            if (res && (res.status === 'success' || res.gaId)) {
                const gaId = normalizeGaId(res.gaId || 'GA-LOCAL-PENDING');
                const gp = form.deferredPayment ? 0 : (res.gpBalance || 25);
                const status = form.deferredPayment ? 'AWAITING_PAYMENT' : 'PENDING_AUDIT';

                const credential = {
                    gaId,
                    name: form.fullName,
                    email: form.email,
                    university: form.university,
                    role: form.role,
                    track: form.track,
                    gpBalance: gp,
                    status: status,
                    issuedAt: new Date().toISOString()
                };

                // Store in localStorage session
                localStorage.setItem('gemiini_presence_id', gaId);
                localStorage.setItem('gemiini_member_profile', JSON.stringify(credential));
                localStorage.setItem('ga_session_ref', gaId);

                setIssuedCredential(credential);
            } else {
                setError(res.message || res.error || 'Failed to complete registration. Please try again.');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.message || 'System error during intake dispatch.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <Helmet>
                <title>Sovereign Intake & Registry Minting | تسجيل العضوية السيادية</title>
                <meta name="description" content="انضم إلى منظومة سوداجين الطبية السيادية: سجل بياناتك للحصول على رقم العضوية GA-ID وتفعيل مساحتك السحابية." />
            </Helmet>

            <Section className="py-12 bg-[#04080F] text-white min-h-screen">
                <div className="mx-auto max-w-4xl px-4">
                    {/* IF CREDENTIAL ISSUED -> RENDER SOVEREIGN CREDENTIAL CARD */}
                    {issuedCredential ? (
                        <div className="p-8 rounded-3xl bg-slate-900 border border-cyan-500/40 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300">
                            <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-cyan-400 via-teal-400 to-amber-400"></div>

                            <div className="text-center mb-8">
                                <div className="inline-flex p-3 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-3">
                                    <ShieldCheck className="w-10 h-10" />
                                </div>
                                <h2 className="text-2xl md:text-3xl font-black text-white">
                                    {lang === 'ar' ? 'تم تسجيل واعتماد بيانات العضوية بنجاح' : 'Sovereign Credential Minted Successfully'}
                                </h2>
                                <p className="text-xs md:text-sm text-gray-400 mt-1">
                                    {lang === 'ar'
                                        ? 'تم توثيق قيدك في السجل السيادي وتخصيص محفظة النقاط والمسار الأكاديمي.'
                                        : 'Your record has been logged in the master ledger with encrypted session token.'}
                                </p>
                            </div>

                            {/* CREDENTIAL BOX */}
                            <div className="p-6 rounded-2xl bg-black/60 border border-white/10 space-y-4 mb-8">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
                                    <div>
                                        <span className="text-[11px] font-mono text-gray-400 uppercase block">Assigned Sovereign GA-ID</span>
                                        <span className="text-2xl md:text-3xl font-mono font-black text-cyan-400 tracking-wider">
                                            {issuedCredential.gaId}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleCopyId(issuedCredential.gaId)}
                                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold hover:bg-cyan-500/30 transition-all"
                                    >
                                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                        {copied ? (lang === 'ar' ? 'تم النسخ' : 'Copied!') : (lang === 'ar' ? 'نسخ المعرف' : 'Copy GA-ID')}
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                                    <div>
                                        <span className="text-gray-400 block mb-0.5">Candidate Name:</span>
                                        <strong className="text-white text-sm">{issuedCredential.name}</strong>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 block mb-0.5">University / Faculty:</span>
                                        <strong className="text-white">{issuedCredential.university}</strong>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 block mb-0.5">Initial Tier & GP Balance:</span>
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-500/20 text-teal-300 font-bold">
                                            <Sparkles className="w-3.5 h-3.5" />
                                            Explorer Tier ({issuedCredential.gpBalance} GP)
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 block mb-0.5">Accreditation Status:</span>
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 font-bold">
                                            <Clock className="w-3.5 h-3.5" />
                                            {issuedCredential.status} (Audit SLA ~15m)
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* ACTION BUTTONS */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate(`/verify?id=${issuedCredential.gaId}`)}
                                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all"
                                >
                                    <ShieldCheck className="w-4 h-4" />
                                    {lang === 'ar' ? 'التحقق من العضوية في السجل السيادي ➔' : 'Verify Credential on Public Registry ➔'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate('/dashboard')}
                                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-white/10 transition-all"
                                >
                                    <UserCheck className="w-4 h-4 text-cyan-400" />
                                    {lang === 'ar' ? 'الدخول إلى لوحة تحكم العضو ➔' : 'Enter Member Dashboard Cockpit ➔'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* INTAKE FORM VIEW */
                        <div>
                            <div className="text-center mb-10">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 px-3.5 py-1 text-xs font-mono font-bold text-cyan-400 mb-3">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    SOVEREIGN ONBOARDING GATEWAY
                                </span>
                                <h1 className="text-3xl md:text-4xl font-extrabold text-white">
                                    {lang === 'ar' ? 'بوابة تسجيل العضوية وإصدار المعرف السيادي' : 'Sovereign Intake & GA-ID Minting Gateway'}
                                </h1>
                                <p className="text-sm text-gray-400 mt-2 max-w-2xl mx-auto">
                                    {lang === 'ar'
                                        ? 'سجل بياناتك للانضمام إلى 2,441 طبيباً وباحثاً في 54 جامعة سودانية، والحصول على المعرف الرقمي GA-ID ورصيد 25 GP الأولي.'
                                        : 'Mint your encrypted GA-ID, unlock 2,500 SMC clinical vignettes, and join the verified living registry.'}
                                </p>
                            </div>

                            {error && (
                                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm mb-6 flex items-center gap-2">
                                    <ShieldAlert className="w-5 h-5 flex-shrink-0 text-red-400" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900/80 border border-white/10 p-6 md:p-8 rounded-3xl backdrop-blur-md">
                                {/* STEP 1: APPLICANT IDENTITY */}
                                <div>
                                    <h3 className="text-sm font-bold text-cyan-400 font-mono mb-4 flex items-center gap-2">
                                        <span>01.</span> {lang === 'ar' ? 'البيانات الشخصية والأكاديمية' : 'Personal & Academic Profile'}
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-gray-300 mb-1.5 font-medium">
                                                {lang === 'ar' ? 'الاسم الثلاثي / الرباعي *' : 'Full Name *'}
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={form.fullName}
                                                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                                placeholder={lang === 'ar' ? 'د. محمد أحمد علي' : 'Dr. Mohamed Ahmed'}
                                                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:border-cyan-400 focus:outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs text-gray-300 mb-1.5 font-medium">
                                                {lang === 'ar' ? 'البريد الإلكتروني الأساسي *' : 'Email Address *'}
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={form.email}
                                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                placeholder="doctor@example.com"
                                                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:border-cyan-400 focus:outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs text-gray-300 mb-1.5 font-medium">
                                                {lang === 'ar' ? 'رقم الهاتف / الواتساب *' : 'Phone / WhatsApp *'}
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                value={form.phone}
                                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                                placeholder="+249 / +20 ..."
                                                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:border-cyan-400 focus:outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs text-gray-300 mb-1.5 font-medium">
                                                {lang === 'ar' ? 'الصفة المهنية الحالية *' : 'Current Professional Role *'}
                                            </label>
                                            <select
                                                value={form.role}
                                                onChange={(e) => setForm({ ...form, role: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:border-cyan-400 focus:outline-none"
                                            >
                                                {ROLES.map((r) => (
                                                    <option key={r.id} value={r.id} className="bg-slate-900 text-white">
                                                        {r.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-xs text-gray-300 mb-1.5 font-medium">
                                            {lang === 'ar' ? 'الجامعة / الكلية الطبية (54 مؤسسة معتمدة) *' : 'University / Faculty *'}
                                        </label>
                                        <select
                                            value={form.university}
                                            onChange={(e) => setForm({ ...form, university: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:border-cyan-400 focus:outline-none"
                                        >
                                            {CANONICAL_UNIVERSITIES.map((u, idx) => (
                                                <option key={idx} value={u} className="bg-slate-900 text-white">
                                                    {u}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* STEP 2: TRACK SELECTION */}
                                <div className="pt-4 border-t border-white/10">
                                    <h3 className="text-sm font-bold text-cyan-400 font-mono mb-3 flex items-center gap-2">
                                        <span>02.</span> {lang === 'ar' ? 'المسار الأكاديمي والتدريبي' : 'Academic Track'}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {TRACKS.map((t) => {
                                            const Icon = t.icon;
                                            const isSelected = form.track === t.id;
                                            return (
                                                <div
                                                    key={t.id}
                                                    onClick={() => setForm({ ...form, track: t.id })}
                                                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                                                        isSelected
                                                            ? 'border-cyan-400 bg-cyan-950/30 ring-1 ring-cyan-400'
                                                            : 'border-white/10 bg-white/5 hover:border-white/20'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2 mb-1.5">
                                                        <Icon className="w-4 h-4 text-cyan-400" />
                                                        <strong className="text-xs text-white">
                                                            {lang === 'ar' ? t.name : t.nameEn}
                                                        </strong>
                                                    </div>
                                                    <p className="text-[11px] text-gray-400">{t.desc}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* STEP 3: FRICTION GATE & PAYMENT REFERENCE */}
                                <div className="pt-4 border-t border-white/10">
                                    <h3 className="text-sm font-bold text-cyan-400 font-mono mb-3 flex items-center gap-2">
                                        <span>03.</span> {lang === 'ar' ? 'بوابة التحقق والرسوم الرمزية (Two Cups of Coffee)' : 'Friction Gate & Payment Reference'}
                                    </h3>

                                    <PaymentChannels
                                        selectedMethod={form.paymentMethod}
                                        onSelectMethod={(method) => setForm({ ...form, paymentMethod: method })}
                                    />

                                    <div className="mt-4 p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                                        <div>
                                            <label className="block text-xs text-gray-300 mb-1 font-medium">
                                                {lang === 'ar' ? 'رقم الإشعار / العملية (Bankak / Vodafone Ref) *' : 'Transaction Reference ID *'}
                                            </label>
                                            <input
                                                type="text"
                                                disabled={form.deferredPayment}
                                                value={form.providerRef}
                                                onChange={(e) => setForm({ ...form, providerRef: e.target.value })}
                                                placeholder={form.deferredPayment ? (lang === 'ar' ? 'سيتم الإرسال لاحقاً عبر واتساب' : 'Deferred submission') : 'مثال: TRX-884920194 أو رقم المعاملة'}
                                                className="w-full px-4 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none disabled:opacity-50"
                                            />
                                        </div>

                                        <label className="flex items-center gap-2.5 text-xs text-gray-400 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={form.deferredPayment}
                                                onChange={(e) => setForm({ ...form, deferredPayment: e.target.checked })}
                                                className="rounded bg-black/60 border-white/20 text-cyan-400 focus:ring-0"
                                            />
                                            <span>
                                                {lang === 'ar'
                                                    ? 'سأقوم بإرسال إشعار الدفع لاحقاً عبر واتساب الإدارة (+20 101 592 2628)'
                                                    : 'I will attach payment confirmation later / via WhatsApp concierge'}
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-500 hover:opacity-95 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <span>{lang === 'ar' ? 'جارٍ تسجيل البيانات في السجل السيادي...' : 'Minting GA-ID in Ledger...'}</span>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span>{lang === 'ar' ? 'إصدار المعرف السيادي وتفعيل العضوية ➔' : 'Mint Sovereign GA-ID & Activate ➔'}</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </Section>
        </Layout>
    );
};

export default RegisterPage;
