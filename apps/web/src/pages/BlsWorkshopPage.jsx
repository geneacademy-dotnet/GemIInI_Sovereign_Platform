import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    HeartPulse,
    ShieldCheck,
    Award,
    Calendar,
    MapPin,
    Smartphone,
    CheckCircle2,
    Sparkles,
    Copy,
    Check,
    Gift,
    FileText,
    ArrowRight,
    Users,
    Stethoscope,
    AlertCircle
} from 'lucide-react';
import Layout from '@/components/site/Layout';
import { Section } from '@/components/site/Bits';
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
    'جامعة العلوم الطبية والتكنولوجيا | UMST',
    'جامعة السودان للعلوم والتكنولوجيا | SUST',
    'جامعة ابن سينا | Ibn Sina University (ISU)',
    'جامعة الرازي | Al-Razi University (RU)',
    'جامعة كرري | Karary University (KU)',
    'جامعة القاهرة / كليات الطب المصرية (Egypt)',
    'مؤسسة طبية أخرى / خريج خارج السودان ومصر'
];

const BlsWorkshopPage = () => {
    const { lang } = useLang();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Step 1: Capture & Store Referral / Affiliate GA-ID from URL query string
    const rawRef = searchParams.get('ref') || searchParams.get('affiliate') || '';
    const [referralId, setReferralId] = useState('');

    useEffect(() => {
        if (rawRef) {
            const cleanRef = normalizeGaId(rawRef);
            setReferralId(cleanRef);
            localStorage.setItem('gemiini_affiliate_ref', cleanRef);
        } else {
            const savedRef = localStorage.getItem('gemiini_affiliate_ref') || 'GA-000';
            setReferralId(savedRef);
        }
    }, [rawRef]);

    // Form state
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        university: CANONICAL_UNIVERSITIES[0],
        role: 'house_officer',
        providerRef: '',
        applyGp: false
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [mintedResult, setMintedResult] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim()) {
            setError(lang === 'ar' ? 'يرجى إكمال البيانات المطلوبة' : 'Please complete all required fields');
            return;
        }

        if (!form.providerRef.trim()) {
            setError(lang === 'ar' ? 'يرجى إدخال رقم إشعار / عملية فودافون كاش (3,000 جنيه مصري)' : 'Please provide the Vodafone Cash transaction reference ID (3,000 EGP)');
            return;
        }

        setLoading(true);

        try {
            const idempotencyKey = generateIdempotencyKey({
                email: form.email,
                phone: form.phone,
                workshop: 'BLS_CAIRO_AUG28',
                ref: form.providerRef
            });

            const payload = {
                action: 'bls_registration',
                fullName: form.fullName,
                email: form.email,
                phone: form.phone,
                university: form.university,
                role: form.role,
                workshopTrack: 'BLS_DOKKI_CAIRO_AUG28_2026',
                paymentChannel: 'VODAFONE_CASH_EGP',
                feeAmount: 3000,
                providerRef: form.providerRef,
                referralId: referralId || 'GA-000',
                idempotencyKey
            };

            const res = await SovereignClient.register(payload);

            if (res && (res.status === 'success' || res.gaId)) {
                const gaId = normalizeGaId(res.gaId || 'GA-PENDING');
                const finalResult = {
                    gaId,
                    name: form.fullName,
                    email: form.email,
                    phone: form.phone,
                    university: form.university,
                    gpBalance: res.gpBalance || 50,
                    referralId: referralId || 'GA-000',
                    sabriBonusUnlocked: true,
                    workshopDate: '28 August 2026',
                    location: 'Dokki, Cairo, Egypt'
                };

                // Store in user presence session
                localStorage.setItem('gemiini_presence_id', gaId);
                localStorage.setItem('gemiini_member_profile', JSON.stringify(finalResult));

                setMintedResult(finalResult);
            } else {
                setError(res.message || res.error || 'Registration failed. Please try again.');
            }
        } catch (err) {
            console.error('BLS Intake error:', err);
            setError(err.message || 'System error during automated intake.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <Helmet>
                <title>Basic Life Support (BLS) Workshop — Cairo | ورشة الإنعاش القلبي الرئوي</title>
                <meta
                    name="description"
                    content="ورشة الإنعاش القلبي الرئوي الأساسي (BLS) المعتمدة من مجلس التخصصات الطبية وجمعية القلب الأمريكية - 28 أغسطس 2026 بالدقي، القاهرة."
                />
            </Helmet>

            <Section className="py-12 bg-[#04080F] text-white min-h-screen">
                <div className="mx-auto max-w-4xl px-4">
                    {/* SUCCESS MODAL / MINTED CREDENTIAL VIEW */}
                    {mintedResult ? (
                        <div className="p-8 rounded-3xl bg-slate-900 border border-emerald-500/40 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300">
                            <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-400"></div>

                            <div className="text-center mb-8">
                                <div className="inline-flex p-3 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-3">
                                    <CheckCircle2 className="w-12 h-12" />
                                </div>
                                <h2 className="text-2xl md:text-3xl font-black text-white">
                                    {lang === 'ar' ? 'تم تأكيد حجز مقعدك وإصدار معرف GemIInI ID' : 'BLS Workshop Seat Confirmed & ID Minted'}
                                </h2>
                                <p className="text-xs md:text-sm text-gray-400 mt-1">
                                    {lang === 'ar'
                                        ? 'ورشة الإنعاش القلبي الرئوي الأساسي (BLS) — الجمعة 28 أغسطس 2026 — الدقي، القاهرة'
                                        : 'Basic Life Support (BLS) Workshop — 28 August 2026 — Dokki, Cairo'}
                                </p>
                            </div>

                            {/* MINTED ID CARD */}
                            <div className="p-6 rounded-2xl bg-black/60 border border-white/10 space-y-4 mb-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
                                    <div>
                                        <span className="text-[11px] font-mono text-gray-400 uppercase block">Digital Presence / GemIInI ID</span>
                                        <span className="text-3xl font-mono font-black text-cyan-400 tracking-wider">
                                            {mintedResult.gaId}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(mintedResult.gaId)}
                                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold hover:bg-cyan-500/30"
                                    >
                                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                        {copied ? 'Copied' : 'Copy ID'}
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                                    <div>
                                        <span className="text-gray-400 block mb-0.5">Attendee Name:</span>
                                        <strong className="text-white text-sm">{mintedResult.name}</strong>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 block mb-0.5">Registered University:</span>
                                        <strong className="text-white">{mintedResult.university}</strong>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 block mb-0.5">Sponsor / Referral Node:</span>
                                        <span className="text-amber-300 font-bold">{mintedResult.referralId}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 block mb-0.5">Earned Living Wallet:</span>
                                        <span className="text-emerald-400 font-bold">+{mintedResult.gpBalance} GP Credited</span>
                                    </div>
                                </div>
                            </div>

                            {/* DR. MOHAMED SABRI EXCLUSIVE BONUS BANNER */}
                            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-cyan-500/10 border border-amber-500/30 mb-8 flex items-start gap-4">
                                <Gift className="w-8 h-8 text-amber-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block">
                                        EXCLUSIVE REGISTRATION BONUS UNLOCKED
                                    </span>
                                    <h4 className="text-sm font-bold text-white mt-0.5">
                                        {lang === 'ar'
                                            ? 'برنامج التحول الرقمي المهني وتصميم السيرة الذاتية السريرية — د. محمد صبري'
                                            : 'Professional Digital Transformation & Personalized CV Module — Dr. Mohamed Sabri'}
                                    </h4>
                                    <p className="text-xs text-gray-300 mt-1">
                                        {lang === 'ar'
                                            ? 'تم فتح الوصول الفوري للحقيبة التدريبية في لوحة تحكم العضو الخاصة بك.'
                                            : 'Direct access to Dr. Sabri’s CV engineering track is active in your Member Dashboard.'}
                                    </p>
                                </div>
                            </div>

                            {/* ACTION BUTTONS */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate(`/verify?id=${mintedResult.gaId}`)}
                                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20"
                                >
                                    <ShieldCheck className="w-4 h-4" />
                                    {lang === 'ar' ? 'التحقق من القيد في السجل العام ➔' : 'Verify in Master Ledger ➔'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate('/dashboard')}
                                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-white/10"
                                >
                                    <Sparkles className="w-4 h-4 text-amber-400" />
                                    {lang === 'ar' ? 'فتح لوحة التحكم وبونص د. صبري ➔' : 'Enter Dashboard & Open Bonus ➔'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* INTAKE WORKSHOP VIEW */
                        <div>
                            {/* WORKSHOP HERO HEADER */}
                            <div className="text-center mb-10">
                                <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 border border-red-500/30 px-4 py-1.5 text-xs font-mono font-bold text-red-400 mb-4">
                                    <HeartPulse className="w-4 h-4 animate-pulse" />
                                    <span>OFFICIAL PHYSICAL WORKSHOP — CAIRO COHORT</span>
                                </div>
                                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                                    {lang === 'ar'
                                        ? 'ورشة الإنعاش القلبي الرئوي الأساسي (BLS)'
                                        : 'Basic Life Support (BLS) Clinical Workshop'}
                                </h1>
                                <p className="text-sm md:text-base text-gray-300 mt-3 max-w-2xl mx-auto">
                                    {lang === 'ar'
                                        ? 'تدريب عملي ومحاكاة سريرية حية على الإنعاش القلبي وإنقاذ الحياة، باعتماد دولي ومحلي متكامل.'
                                        : 'Hands-on clinical resuscitation training and wet-lab simulation in Dokki, Cairo.'}
                                </p>

                                {/* EVENT METRICS BAR */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 max-w-2xl mx-auto text-xs font-mono">
                                    <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center gap-2">
                                        <Calendar className="w-4 h-4 text-cyan-400" />
                                        <span>28 August 2026</span>
                                    </div>
                                    <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center gap-2">
                                        <MapPin className="w-4 h-4 text-red-400" />
                                        <span>Dokki, Cairo, Egypt</span>
                                    </div>
                                    <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center gap-2">
                                        <Smartphone className="w-4 h-4 text-emerald-400" />
                                        <span>3,000 EGP (Vodafone)</span>
                                    </div>
                                </div>

                                {/* DUAL ACCREDITATION BADGES */}
                                <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold">
                                        <Award className="w-4 h-4 text-cyan-400" />
                                        <span>Sudan Medical Council (SMC) Accredited</span>
                                    </div>
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-red-500/30 text-red-300 text-xs font-mono font-bold">
                                        <HeartPulse className="w-4 h-4 text-red-400" />
                                        <span>American Heart Association (AHA) Standards</span>
                                    </div>
                                </div>
                            </div>

                            {/* DR. MOHAMED SABRI BONUS TEASER */}
                            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-purple-500/10 to-cyan-500/15 border border-amber-500/40 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300">
                                        <Gift className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                                            EXCLUSIVE WEB INTAKE BONUS
                                        </span>
                                        <h3 className="text-sm font-bold text-white">
                                            {lang === 'ar'
                                                ? 'بونص حصري: ورشة التحول الرقمي وصناعة السيرة الذاتية الطبية مع د. محمد صبري'
                                                : 'Exclusive Bonus: Professional Digital Transformation & CV with Dr. Mohamed Sabri'}
                                        </h3>
                                    </div>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold flex-shrink-0">
                                    FREE WITH THIS TICKET
                                </span>
                            </div>

                            {error && (
                                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm mb-6 flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* INTAKE FORM */}
                            <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900/80 border border-white/10 p-6 md:p-8 rounded-3xl backdrop-blur-md shadow-2xl">
                                {/* SECTION 1: ATTENDEE DATA */}
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-bold text-cyan-400 font-mono flex items-center gap-2">
                                            <span>01.</span> {lang === 'ar' ? 'بيانات الطبيب / المتدرب' : 'Physician & Trainee Identity'}
                                        </h3>
                                        {referralId && (
                                            <span className="text-[11px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                                                Affiliate Node: <strong>{referralId}</strong>
                                            </span>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-gray-300 mb-1 font-medium">
                                                {lang === 'ar' ? 'الاسم الثلاثي / الرباعي *' : 'Full Name *'}
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={form.fullName}
                                                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                                placeholder="د. أحمد عبد الرحمن"
                                                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:border-cyan-400 focus:outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs text-gray-300 mb-1 font-medium">
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
                                            <label className="block text-xs text-gray-300 mb-1 font-medium">
                                                {lang === 'ar' ? 'رقم الهاتف / الواتساب *' : 'Phone / WhatsApp *'}
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                value={form.phone}
                                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                                placeholder="+20 / +249 ..."
                                                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:border-cyan-400 focus:outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs text-gray-300 mb-1 font-medium">
                                                {lang === 'ar' ? 'الجامعة / الكلية الطبية *' : 'Medical Faculty / University *'}
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
                                </div>

                                {/* SECTION 2: VODAFONE CASH GATEWAY & TRANSACTION REF */}
                                <div className="pt-4 border-t border-white/10">
                                    <h3 className="text-sm font-bold text-cyan-400 font-mono mb-3 flex items-center gap-2">
                                        <span>02.</span> {lang === 'ar' ? 'سداد رسوم الورشة عبر فودافون كاش (3,000 EGP)' : 'Vodafone Cash Payment Gateway (3,000 EGP)'}
                                    </h3>

                                    <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 space-y-3">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <Smartphone className="w-5 h-5 text-red-400" />
                                                <div>
                                                    <strong className="text-sm text-white block">Vodafone Cash Wallet (مصر)</strong>
                                                    <span className="text-xs text-gray-400">تحويل مباشر بقيمة 3,000 جنيه مصري</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 font-mono text-sm text-red-300 font-bold">
                                                    01015922628
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleCopy('01015922628')}
                                                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
                                                    title="Copy Number"
                                                >
                                                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono text-gray-300">
                                            كود التحويل السريع: <span className="text-cyan-300 font-bold">*9*7*01015922628*3000#</span>
                                        </div>

                                        <div>
                                            <label className="block text-xs text-gray-300 mb-1 font-medium">
                                                {lang === 'ar' ? 'رقم الإشعار / العملية (Transaction ID) *' : 'Vodafone Cash Transaction Reference ID *'}
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={form.providerRef}
                                                onChange={(e) => setForm({ ...form, providerRef: e.target.value })}
                                                placeholder="مثال: TRX-992817462 أو رقم العملية من رسالة فودافون"
                                                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 hover:opacity-95 text-white font-black text-sm tracking-wide shadow-xl shadow-red-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <span>{lang === 'ar' ? 'جارٍ تسجيل المقعد وإصدار المعرف...' : 'Minting ID & Reserving Seat...'}</span>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-5 h-5" />
                                            <span>
                                                {lang === 'ar'
                                                    ? 'تأكيد الحجز الفوري وإصدار GemIInI ID وبونص د. صبري ➔'
                                                    : 'Confirm BLS Seat & Mint GemIInI ID ➔'}
                                            </span>
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

export default BlsWorkshopPage;
