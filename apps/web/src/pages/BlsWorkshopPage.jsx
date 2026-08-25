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
    Coffee,
    FileText,
    ArrowRight,
    Users,
    Stethoscope,
    AlertCircle,
    Coins,
    GraduationCap,
    Mic,
    Building2,
    MessageCircle,
    CheckSquare,
    Square
} from 'lucide-react';
import Layout from '@/components/site/Layout';
import { Section } from '@/components/site/Bits';
import { useLang } from '@/i18n/LanguageContext';
import SovereignClient, { generateIdempotencyKey, normalizeGaId } from '@/services/sovereignService';

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

    // Capture referral affiliate ID from URL (?ref=GA-000)
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

    // Payment Routing state: 'VODAFONE' vs 'BANK'
    const [paymentMethod, setPaymentMethod] = useState('VODAFONE');
    // "Two Cups of Coffee" Upsell state
    const [boughtCoffee, setBoughtCoffee] = useState(false);

    // Form inputs state
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        university: CANONICAL_UNIVERSITIES[0],
        role: 'house_officer',
        providerRef: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [mintedResult, setMintedResult] = useState(null);
    const [copied, setCopied] = useState(false);

    const calculatedGp = boughtCoffee ? 250 : 200;
    const totalAmountEgp = boughtCoffee ? 3250 : 3000;

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim()) {
            setError(lang === 'ar' ? 'يرجى إكمال جميع الحقول الإلزامية' : 'Please complete all required fields');
            return;
        }

        if (paymentMethod === 'VODAFONE' && !form.providerRef.trim()) {
            setError(lang === 'ar' ? 'يرجى إدخال رقم العملية من رسالة فودافون كاش' : 'Please enter your Vodafone Cash transaction ID');
            return;
        }

        if (paymentMethod === 'BANK' && !form.providerRef.trim()) {
            setError(lang === 'ar' ? 'يرجى إدخال رقم إشعار التحويل البنكي أو اسم المحول' : 'Please enter your bank transfer receipt number or account name');
            return;
        }

        setLoading(true);

        try {
            const idempotencyKey = generateIdempotencyKey({
                email: form.email,
                phone: form.phone,
                method: paymentMethod,
                coffee: boughtCoffee,
                ref: form.providerRef
            });

            // Action Required 2: Payload with paymentMethod and boughtCoffee
            const payload = {
                action: 'bls_registration',
                fullName: form.fullName,
                email: form.email,
                phone: form.phone,
                university: form.university,
                role: form.role,
                workshopTrack: 'BLS_DOKKI_CAIRO_AUG28_2026',
                paymentMethod: paymentMethod, // 'VODAFONE' | 'BANK'
                boughtCoffee: boughtCoffee,   // boolean
                feeAmount: totalAmountEgp,
                providerRef: form.providerRef,
                referralId: referralId || 'GA-000',
                gpAwarded: calculatedGp,
                idempotencyKey
            };

            const res = await SovereignClient.register(payload);

            if (res && (res.status === 'success' || res.gaId)) {
                const gaId = normalizeGaId(res.gaId || 'GA-1001');
                const finalResult = {
                    gaId,
                    name: form.fullName,
                    email: form.email,
                    phone: form.phone,
                    university: form.university,
                    gpBalance: calculatedGp,
                    paymentMethod: paymentMethod,
                    boughtCoffee: boughtCoffee,
                    referralId: referralId || 'GA-000',
                    sabriBonusUnlocked: true,
                    workshopDate: 'Friday, August 28, 2026',
                    location: 'Dokki, Cairo, Egypt'
                };

                // Save in user presence session
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
                <title>Basic Life Support (BLS) Workshop — Cairo | GemIInI Academy</title>
                <meta
                    name="description"
                    content="ورشة الإنعاش القلبي الرئوي الأساسي (BLS) المعتمدة من مجلس التخصصات الطبية وجمعية القلب الأمريكية - 28 أغسطس 2026 بالدقي، القاهرة."
                />
            </Helmet>

            <Section className="py-12 bg-[#04080F] text-white min-h-screen">
                <div className="mx-auto max-w-4xl px-4">
                    {/* SUCCESS VIEW: DYNAMIC MINTED CREDENTIAL CARD (200 GP or 250 GP) */}
                    {mintedResult ? (
                        <div className="p-8 rounded-3xl bg-slate-900 border border-emerald-500/40 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300">
                            <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-400"></div>

                            <div className="text-center mb-8">
                                <div className="inline-flex p-3 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-3">
                                    <CheckCircle2 className="w-12 h-12" />
                                </div>
                                <h2 className="text-2xl md:text-3xl font-black text-white">
                                    {lang === 'ar' ? 'تم تأكيد حجزك وإصدار بروفايل GemIInI ID' : 'BLS Seat Confirmed & GemIInI ID Minted'}
                                </h2>
                                <p className="text-xs md:text-sm text-gray-400 mt-1">
                                    {lang === 'ar'
                                        ? 'تم تفعيل مساحتك السحابية وإيداع رصيد النقاط السريرية وبونص د. محمد صبري.'
                                        : 'Your digital presence profile is active with accredited GP balance and Dr. Sabri CV module.'}
                                </p>
                            </div>

                            {/* MINTED CREDENTIAL CARD */}
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
                                        <span className="text-gray-400 block mb-0.5">Physician Name:</span>
                                        <strong className="text-white text-sm">{mintedResult.name}</strong>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 block mb-0.5">Living Ledger Balance:</span>
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-sm">
                                            <Coins className="w-4 h-4 text-amber-400" />
                                            +{mintedResult.gpBalance} GemIInI Points (GP) Credited
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 block mb-0.5">Sponsor / Affiliate Node:</span>
                                        <span className="text-amber-300 font-bold">{mintedResult.referralId}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 block mb-0.5">Clinical Hours Equivalent:</span>
                                        <span className="text-cyan-300 font-bold">{mintedResult.gpBalance} Hours of Clinical Credit</span>
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
                                    {lang === 'ar' ? `فتح لوحة التحكم ومحفظة ${mintedResult.gpBalance} GP ➔` : 'Enter Dashboard & Wallet ➔'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* INTAKE WORKSHOP VIEW */
                        <div>
                            {/* WORKSHOP HERO HEADER */}
                            <div className="text-center mb-10">
                                <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 border border-red-500/30 px-4 py-1.5 text-xs font-mono font-bold text-red-400 mb-4">
                                    <HeartPulse className="w-4 h-4 text-red-400 animate-pulse" />
                                    <span>OFFICIAL PHYSICAL WORKSHOP — CAIRO COHORT</span>
                                </div>
                                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                                    {lang === 'ar'
                                        ? 'ورشة الإنعاش القلبي الرئوي الأساسي (BLS)'
                                        : 'Basic Life Support (BLS) Clinical Workshop'}
                                </h1>
                                <p className="text-sm md:text-base text-gray-300 mt-3 max-w-2xl mx-auto">
                                    {lang === 'ar'
                                        ? 'تدريب عملي ومحاكاة سريرية حية على الإنعاش، مع إصدار بروفايل GemIInI ID برصيد 200 نقطة GP وبونص د. محمد صبري.'
                                        : 'Hands-on clinical resuscitation training in Cairo with 200 GP loaded profile & Dr. Mohamed Sabri bonus.'}
                                </p>

                                {/* METRICS BAR */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 max-w-2xl mx-auto text-xs font-mono">
                                    <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center gap-2">
                                        <Calendar className="w-4 h-4 text-cyan-400" />
                                        <span>الجمعة 28 أغسطس 2026 - 9:00 ص</span>
                                    </div>
                                    <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center gap-2">
                                        <MapPin className="w-4 h-4 text-red-400" />
                                        <span>مركز د. صبري (ترخيص 1549) - الدقي</span>
                                    </div>
                                    <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center gap-2">
                                        <Coins className="w-4 h-4 text-amber-400" />
                                        <span>+200 GemIInI Points (GP)</span>
                                    </div>
                                </div>

                                {/* DUAL ACCREDITATION BADGES */}
                                <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
                                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold">
                                        <Award className="w-4 h-4 text-cyan-400" />
                                        اعتماد المجلس الطبي السوداني (SMC)
                                    </span>
                                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-red-500/30 text-red-300 text-xs font-mono font-bold">
                                        <HeartPulse className="w-4 h-4 text-red-400" />
                                        معايير جمعية القلب الأمريكية (AHA)
                                    </span>
                                </div>
                            </div>

                            {/* 1. THE SMART GP ECOSYSTEM INFO-BOX (EXPLICIT DEFINITION & UTILITY) */}
                            <div className="p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/30 mb-8 backdrop-blur-md shadow-xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                                        <Coins className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                                            <span>ما هي نقاط جيميني (What are GemIInI Points - GP)؟</span>
                                            <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-full font-bold">
                                                1 GP = 1 Hour of Clinical Credit
                                            </span>
                                        </h3>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            عملة السمعة السريرية والأكاديمية التي تقيس إنتاجيتك المعرفية وتفتح مساراتك الدولية
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-3 border-t border-white/10 text-xs leading-relaxed text-gray-300">
                                    <p>
                                        <strong>1 GP = 1 Hour of Clinical Credit.</strong> It is your dynamic digital asset. Attending this workshop instantly awards you <strong>200 GP</strong>. Accumulate GP to unlock Continuous Professional Development (CPD) modules, SMC/USMLE exam simulators, physical gifts, MedTalks speaker slots, or fast-track recruitment into our paid global faculty.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-start gap-2.5">
                                            <GraduationCap className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <strong className="text-white block">ساعات معتمدة للتعليم الطبي (CPD)</strong>
                                                <span className="text-gray-400 text-[11px]">تحويل النقاط إلى شهادات ساعات CPD رسمية (1,000 GP = 10 ساعات).</span>
                                            </div>
                                        </div>

                                        <div className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-start gap-2.5">
                                            <Gift className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <strong className="text-white block">محرك الجوائز والحقائب الجراحية (Gifts)</strong>
                                                <span className="text-gray-400 text-[11px]">استبدال النقاط بأطقم خياطة جراحية (Suture Kits) واشتراكات منصات طبية كبرى.</span>
                                            </div>
                                        </div>

                                        <div className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-start gap-2.5">
                                            <Mic className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <strong className="text-white block">منصة MedTalks الدولية (Giving Talks)</strong>
                                                <span className="text-gray-400 text-[11px]">حجز مقاعد متحدثين واستعراض الحالات السريرية في قمم مراجعة الأقران الأكاديمية.</span>
                                            </div>
                                        </div>

                                        <div className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-start gap-2.5">
                                            <Users className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <strong className="text-white block">الانضمام للفريق الأكاديمي الدولي (Global Faculty)</strong>
                                                <span className="text-gray-400 text-[11px]">الترشح المباشر من مكتب GA-000 لأدوار محاضرين مدفوعي الأجر وسفراء إقليميين.</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* DR. MOHAMED SABRI EXCLUSIVE BONUS BANNER */}
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
                                            بونص حصري: ورشة التحول الرقمي وصناعة السيرة الذاتية الطبية مع د. محمد صبري
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
                                            <span>01.</span> {lang === 'ar' ? 'بيانات الطبيب / المتدرب' : 'Physician Profile'}
                                        </h3>
                                        {referralId && (
                                            <span className="text-[11px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                                                عقدة الإحالة: <strong>{referralId}</strong>
                                            </span>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-gray-300 mb-1 font-medium">
                                                الاسم الرباعي الكامل *
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
                                                البريد الإلكتروني الأساسي *
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
                                                رقم الهاتف / الواتساب *
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
                                                الجامعة / الكلية الطبية *
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

                                {/* SECTION 2: PAYMENT ROUTING (VODAFONE CASH vs BANK TRANSFER / INSTAPAY) */}
                                <div className="pt-4 border-t border-white/10">
                                    <h3 className="text-sm font-bold text-cyan-400 font-mono mb-3 flex items-center gap-2">
                                        <span>02.</span> قنوات السداد وتأكيد التفعيل
                                    </h3>

                                    {/* SLEEK UI TOGGLE */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                        <div
                                            onClick={() => setPaymentMethod('VODAFONE')}
                                            className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                                                paymentMethod === 'VODAFONE'
                                                    ? 'border-red-500 bg-red-500/10 text-red-300 font-bold shadow-lg shadow-red-500/10'
                                                    : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Smartphone className="w-4 h-4 text-red-400" />
                                                <span className="text-xs">فودافون كاش (Vodafone Cash - Egypt)</span>
                                            </div>
                                            {paymentMethod === 'VODAFONE' && <CheckCircle2 className="w-4 h-4 text-red-400" />}
                                        </div>

                                        <div
                                            onClick={() => setPaymentMethod('BANK')}
                                            className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                                                paymentMethod === 'BANK'
                                                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-bold shadow-lg shadow-emerald-500/10'
                                                    : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Building2 className="w-4 h-4 text-emerald-400" />
                                                <span className="text-xs">تحويل بنكي / InstaPay / بنكك (Manual Validation)</span>
                                            </div>
                                            {paymentMethod === 'BANK' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                                        </div>
                                    </div>

                                    {/* CONDITIONAL UI: VODAFONE CASH (01015922628) */}
                                    {paymentMethod === 'VODAFONE' ? (
                                        <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 space-y-3">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                <div>
                                                    <strong className="text-sm text-white block">محفظة فودافون كاش الرسمية</strong>
                                                    <span className="text-xs text-gray-400">
                                                        المبلغ: <strong className="text-red-300">{totalAmountEgp.toLocaleString()} جنيه مصري</strong>
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 font-mono text-sm text-red-300 font-bold">
                                                        01015922628
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCopy('01015922628')}
                                                        className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
                                                    >
                                                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono text-gray-300">
                                                كود التحويل المباشر: <span className="text-cyan-300 font-bold">*9*7*01015922628*{totalAmountEgp}#</span>
                                            </div>

                                            <div>
                                                <label className="block text-xs text-gray-300 mb-1 font-medium">
                                                    رقم العملية / الإشعار من رسالة فودافون كاش *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={form.providerRef}
                                                    onChange={(e) => setForm({ ...form, providerRef: e.target.value })}
                                                    placeholder="مثال: TRX-992817462 أو رقم المعاملة من الرسالة"
                                                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        /* CONDITIONAL UI: BANK TRANSFER / INSTAPAY (WHATSAPP ACTIVATION GATE) */
                                        <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
                                            <div className="flex items-start gap-3">
                                                <Building2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <strong className="text-sm text-white block">Bank transfers require manual validation</strong>
                                                    <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                                                        Click here to contact our Academic Desk via WhatsApp (+20 101 592 2628) for the verified account details, then paste your transfer receipt number below.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-black/40 border border-white/5">
                                                <div className="flex items-center gap-2">
                                                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                                                    <span className="text-xs font-mono text-emerald-300">واتساب الإدارة: <strong>+20 101 592 2628</strong></span>
                                                </div>
                                                <a
                                                    href={`https://wa.me/201015922628?text=${encodeURIComponent('السلام عليكم، أرغب في سداد رسوم ورشة BLS عبر التحويل البنكي / InstaPay / بنكك. اسمي: ' + (form.fullName || 'طبيب'))}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                                                >
                                                    <MessageCircle className="w-4 h-4" />
                                                    <span>مراسلة المكتب الأكاديمي على واتساب ➔</span>
                                                </a>
                                            </div>

                                            <div>
                                                <label className="block text-xs text-gray-300 mb-1 font-medium">
                                                    رقم إشعار التحويل / اسم الحساب المحول منه *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={form.providerRef}
                                                    onChange={(e) => setForm({ ...form, providerRef: e.target.value })}
                                                    placeholder="مثال: رقم العملية من تطبيق البنك أو إنستاباي أو بنكك"
                                                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* THE "TWO CUPS OF COFFEE" UPSELL CHECKBOX */}
                                <div
                                    onClick={() => setBoughtCoffee(!boughtCoffee)}
                                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                                        boughtCoffee
                                            ? 'border-amber-400 bg-amber-950/40 ring-1 ring-amber-400 shadow-xl'
                                            : 'border-white/10 bg-white/5 hover:border-white/20'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="text-amber-400">
                                            {boughtCoffee ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-gray-400" />}
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                                                <span>Support the Consortium: Buy our Academic Desk two cups of coffee ☕ (250 EGP)</span>
                                            </h4>
                                            <p className="text-[11px] text-amber-300 mt-0.5">
                                                Expedite your manual review, and instantly credit your ledger with an extra <strong>+50 GemIInI Points (GP)</strong>!
                                            </p>
                                        </div>
                                    </div>
                                    <span className="px-2.5 py-1 rounded-full font-mono text-[11px] font-bold flex-shrink-0 bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                        {boughtCoffee ? '+50 GP Active (Total 250 GP)' : '+50 GP Booster'}
                                    </span>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 hover:opacity-95 text-white font-black text-sm tracking-wide shadow-xl shadow-red-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <span>جارٍ حجز المقعد وإصدار بروفايل {calculatedGp} GP...</span>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-5 h-5" />
                                            <span>
                                                تأكيد الحجز وإصدار GemIInI ID برصيد {calculatedGp} GP وبونص د. صبري ➔
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
