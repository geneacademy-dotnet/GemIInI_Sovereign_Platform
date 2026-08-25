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
    ArrowLeft,
    Clock,
    Users,
    Stethoscope,
    AlertCircle,
    Globe2,
    Linkedin,
    FileCheck,
    Flame,
    Share2,
    QrCode
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
    'جامعة كرري | Karary University (KU)',
    'جامعة القاهرة / كليات الطب المصرية (Egypt)',
    'جامعة عين شمس / قصر العيني (Egypt)',
    'مؤسسة طبية أخرى / خريج خارج السودان ومصر'
];

const ROLES = [
    { id: 'house_officer', name: 'طبيب امتياز (House Officer)' },
    { id: 'clinical_student', name: 'طالب سريري / سنة 4-6 (Clinical Student)' },
    { id: 'pre_clinical', name: 'طالب مرحلة أساسية / سنة 1-3 (Pre-Clinical)' },
    { id: 'medical_officer', name: 'طبيب عمومي / نائب (Medical Officer / Resident)' },
    { id: 'specialist', name: 'اختصاصي / استشاري (Specialist / Consultant)' },
    { id: 'allied_health', name: 'مختبرات وتمريض وكادر صحي (Clinical Staff)' }
];

// Targeted event: August 28, 2026 at 09:00 AM Cairo/Khartoum time
const EVENT_TARGET_DATE = new Date('2026-08-28T09:00:00+02:00').getTime();

const BlsWorkshopPage = () => {
    const { lang } = useLang();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Referral Tracking
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

    // Live Countdown Timer State
    const [timeLeft, setTimeLeft] = useState({
        days: '03',
        hours: '00',
        minutes: '00',
        seconds: '00',
        isExpired: false
    });

    useEffect(() => {
        const updateCountdown = () => {
            const now = Date.now();
            const difference = EVENT_TARGET_DATE - now;

            if (difference <= 0) {
                setTimeLeft({
                    days: '00',
                    hours: '00',
                    minutes: '00',
                    seconds: '00',
                    isExpired: true
                });
                return;
            }

            const d = Math.floor(difference / (1000 * 60 * 60 * 24));
            const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((difference % (1000 * 60)) / 1000);

            setTimeLeft({
                days: String(d).padStart(2, '0'),
                hours: String(h).padStart(2, '0'),
                minutes: String(m).padStart(2, '0'),
                seconds: String(s).padStart(2, '0'),
                isExpired: false
            });
        };

        updateCountdown();
        const timer = setInterval(updateCountdown, 1000);
        return () => clearInterval(timer);
    }, []);

    // Form State
    const [form, setForm] = useState({
        fullName: '',
        fullNameEn: '',
        email: '',
        phone: '',
        university: CANONICAL_UNIVERSITIES[0],
        role: 'house_officer',
        providerRef: '',
        notes: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [mintedResult, setMintedResult] = useState(null);
    const [copiedNumber, setCopiedNumber] = useState(false);
    const [copiedId, setCopiedId] = useState(false);

    const handleCopyNumber = (num) => {
        navigator.clipboard.writeText(num);
        setCopiedNumber(true);
        setTimeout(() => setCopiedNumber(false), 2000);
    };

    const handleCopyId = (id) => {
        navigator.clipboard.writeText(id);
        setCopiedId(true);
        setTimeout(() => setCopiedId(false), 2000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim()) {
            setError(lang === 'ar' ? 'يرجى إكمال جميع الحقول المطلوبة للتسجيل.' : 'Please fill all required fields to proceed.');
            return;
        }

        if (!form.providerRef.trim()) {
            setError(
                lang === 'ar'
                    ? 'يرجى إدخال رقم إشعار / عملية فودافون كاش (3,000 جنيه مصري).'
                    : 'Please enter your Vodafone Cash transaction reference ID (3,000 EGP).'
            );
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
                fullNameEn: form.fullNameEn || form.fullName,
                email: form.email,
                phone: form.phone,
                university: form.university,
                role: form.role,
                workshopTrack: 'BLS_DOKKI_CAIRO_AUG28_2026',
                paymentChannel: 'VODAFONE_CASH_EGP',
                feeAmount: 3000,
                providerRef: form.providerRef.trim(),
                referralId: referralId || 'GA-000',
                unlock_digital_transformation: true,
                idempotencyKey
            };

            const res = await SovereignClient.register(payload);

            if (res && (res.status === 'success' || res.gaId)) {
                const gaId = normalizeGaId(res.gaId || 'GA-BLS-MEMBER');
                const finalResult = {
                    gaId,
                    name: form.fullName,
                    nameEn: form.fullNameEn || form.fullName,
                    email: form.email,
                    phone: form.phone,
                    university: form.university,
                    gpBalance: res.gpBalance || 50,
                    referralId: referralId || 'GA-000',
                    unlockDigitalTransformation: true,
                    workshopDate: 'Friday, 28 August 2026 (09:00 AM)',
                    location: 'Dokki, Cairo, Egypt — Dr. Sabri Training Center',
                    status: 'Seat Reserved & GemIInI ID Minted'
                };

                // Store in user presence session
                localStorage.setItem('gemiini_presence_id', gaId);
                localStorage.setItem('gemiini_member_profile', JSON.stringify(finalResult));
                localStorage.setItem('ga_session_ref', gaId);

                setMintedResult(finalResult);
            } else {
                setError(res.message || res.error || 'Registration failed. Please verify your data and try again.');
            }
        } catch (err) {
            console.error('BLS Intake error:', err);
            setError(err.message || 'Network timeout or system error during automated seat dispatch.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <Helmet>
                <title>Official BLS Workshop Cairo — AHA & SMC Certified | ورشة الإنعاش القلبي الرئوي</title>
                <meta
                    name="description"
                    content="احجز مقعدك الآن في ورشة الإنعاش القلبي الرئوي (BLS) بالقاهرة يوم 28 أغسطس 2026. اعتماد رسمي من جمعية القلب الأمريكية (AHA) والمجلس الطبي، وباقة التحول الرقمي والسيرة الذاتية مجاناً من أكاديمية الجينات."
                />
            </Helmet>

            <Section className="py-8 md:py-14 bg-[#04080F] text-white min-h-screen relative overflow-hidden">
                {/* Background Ambient Glow */}
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/3 -right-40 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="mx-auto max-w-5xl px-4 relative z-10">

                    {/* ========================================================================= */}
                    {/* SUCCESS MODAL / MINTED CREDENTIAL VIEW                                    */}
                    {/* ========================================================================= */}
                    {mintedResult ? (
                        <div className="p-6 md:p-12 rounded-3xl bg-slate-900/95 border-2 border-emerald-500/50 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300 backdrop-blur-xl">
                            <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-400" />

                            <div className="text-center mb-8">
                                <div className="inline-flex p-4 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 mb-4 shadow-lg shadow-emerald-500/20">
                                    <CheckCircle2 className="w-14 h-14" />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                                    {lang === 'ar' ? 'تم تأكيد حجز مقعدك بنجاح!' : 'BLS Workshop Seat Confirmed!'}
                                </h2>
                                <p className="text-base md:text-lg text-emerald-300 font-medium mt-2">
                                    {lang === 'ar'
                                        ? 'تم إصدار رقم عضويتك السيادي وتفعيل باقة التحول الرقمي والسيرة الذاتية.'
                                        : 'GemIInI ID Minted · Gene Academy Digital Transformation & CV Package Unlocked.'}
                                </p>
                            </div>

                            {/* MINTED CREDENTIAL CARD */}
                            <div className="p-6 md:p-8 rounded-2xl bg-black/80 border border-white/15 space-y-6 mb-8">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
                                    <div>
                                        <span className="text-xs font-mono text-gray-400 uppercase tracking-widest block">
                                            Permanent Sovereign Identity (GA-ID)
                                        </span>
                                        <span className="text-3xl md:text-5xl font-mono font-black text-cyan-400 tracking-wider mt-1 block">
                                            {mintedResult.gaId}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleCopyId(mintedResult.gaId)}
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-sm font-mono font-bold hover:bg-cyan-500/30 transition-all cursor-pointer"
                                    >
                                        {copiedId ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                                        {copiedId ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ المعرف' : 'Copy GA-ID')}
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono">
                                    <div>
                                        <span className="text-gray-400 block text-xs mb-1">Candidate Name:</span>
                                        <strong className="text-white text-base">{mintedResult.name}</strong>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 block text-xs mb-1">Medical Faculty / Institution:</span>
                                        <strong className="text-white text-sm">{mintedResult.university}</strong>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 block text-xs mb-1">Workshop Schedule:</span>
                                        <strong className="text-amber-300">{mintedResult.workshopDate}</strong>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 block text-xs mb-1">Clinical Venue:</span>
                                        <strong className="text-cyan-300">{mintedResult.location}</strong>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 block text-xs mb-1">Welcome Sovereign Ledger:</span>
                                        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-base">
                                            <Sparkles className="w-4 h-4" /> +{mintedResult.gpBalance} GP Credited
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 block text-xs mb-1">Referral / Sponsor Node:</span>
                                        <span className="text-gray-300 font-bold">{mintedResult.referralId}</span>
                                    </div>
                                </div>
                            </div>

                            {/* EXCLUSIVE GENE ACADEMY BONUS UNLOCKED BANNER */}
                            <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-cyan-500/15 border border-amber-400/40 mb-8 flex flex-col md:flex-row items-start md:items-center gap-5">
                                <div className="p-3.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex-shrink-0">
                                    <Gift className="w-8 h-8" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                                            GENE ACADEMY EXCLUSIVE BONUS UNLOCKED
                                        </span>
                                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                                            FREE $150 VALUE
                                        </span>
                                    </div>
                                    <h4 className="text-base md:text-lg font-bold text-white mt-1">
                                        {lang === 'ar'
                                            ? 'باقة التحول الرقمي، بناء السيرة الذاتية المهنية وتطوير حساب LinkedIn'
                                            : 'Global Hiring & Digital Transformation Package (CV & LinkedIn Optimization)'}
                                    </h4>
                                    <p className="text-xs md:text-sm text-gray-300 mt-1 leading-relaxed">
                                        {lang === 'ar'
                                            ? 'تم ربط ملفك بقسم التوظيف والاعتماد الدولي. يمكنك البدء في بناء سيرتك الذاتية وتجهيز ملفك الطبي عبر لوحة التحكم.'
                                            : 'Your profile is now integrated with the Gene Academy career acceleration engine. Access continuous CV tracking in your dashboard.'}
                                    </p>
                                </div>
                            </div>

                            {/* ACTION BUTTONS */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate(`/verify?id=${mintedResult.gaId}`)}
                                    className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-base shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
                                >
                                    <ShieldCheck className="w-5 h-5" />
                                    {lang === 'ar' ? 'التحقق من القيد في السجل العام ➔' : 'Verify in Master Registry ➔'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate('/dashboard')}
                                    className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-base border border-white/15 transition-all cursor-pointer"
                                >
                                    <UserCheckIcon className="w-5 h-5 text-amber-400" />
                                    {lang === 'ar' ? 'الدخول إلى لوحة التحكم وباقة السيرة الذاتية ➔' : 'Enter Dashboard & Access CV Package ➔'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* ========================================================================= */
                        /* HIGH-CONVERTING LANDING & INTAKE VIEW                                      */
                        /* ========================================================================= */
                        <div className="space-y-10">

                            {/* 1. URGENCY & TICKING COUNTDOWN HERO */}
                            <div className="text-center space-y-6">
                                
                                {/* Pulse Tag */}
                                <div className="inline-flex items-center gap-2 rounded-full bg-red-500/15 border border-red-500/40 px-5 py-2 text-xs md:text-sm font-mono font-bold text-red-400 shadow-lg shadow-red-500/20 animate-pulse">
                                    <Flame className="w-4 h-4 text-red-500" />
                                    <span>
                                        {lang === 'ar'
                                            ? 'المقاعد محدودة جداً • الحدث بعد 3 أيام فقط'
                                            : 'SEATS STRICTLY LIMITED · EVENT IN 3 DAYS'}
                                    </span>
                                </div>

                                {/* MASSIVE TYPOGRAPHY TITLE */}
                                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
                                    {lang === 'ar' ? (
                                        <>
                                            احجز مقعدك الآن في ورشة <br className="hidden sm:inline" />
                                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-400">
                                                الإنعاش القلبي الرئوي (BLS)
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            Official Clinical <br className="hidden sm:inline" />
                                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-400">
                                                Basic Life Support (BLS)
                                            </span> Workshop
                                        </>
                                    )}
                                </h1>

                                {/* NATURAL AUTHORITATIVE SUBTITLE */}
                                <p className="text-base sm:text-xl md:text-2xl text-gray-200 font-medium max-w-3xl mx-auto leading-relaxed" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                                    {lang === 'ar'
                                        ? 'اعتماد رسمي من جمعية القلب الأمريكية (AHA) والمجلس الطبي السوداني (SMC). يشمل باقة أكاديمية الجينات للتحول الرقمي وتجهيز السيرة الذاتية مجاناً.'
                                        : 'Certified by the American Heart Association (AHA) & Sudan Medical Council (SMC). Includes the Gene Academy Global Hiring & Digital CV Package.'}
                                </p>

                                {/* 2. LIVE TICKING COUNTDOWN BLOCKS */}
                                <div className="pt-4 max-w-2xl mx-auto">
                                    <div className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold mb-3">
                                        ⏱️ {lang === 'ar' ? 'العد التنازلي لإغلاق التسجيل وبدء الورشة:' : 'Registration Closes In:'}
                                    </div>
                                    <div className="grid grid-cols-4 gap-2 sm:gap-4 font-mono">
                                        {[
                                            { label: lang === 'ar' ? 'أيام' : 'DAYS', val: timeLeft.days },
                                            { label: lang === 'ar' ? 'ساعات' : 'HOURS', val: timeLeft.hours },
                                            { label: lang === 'ar' ? 'دقائق' : 'MINUTES', val: timeLeft.minutes },
                                            { label: lang === 'ar' ? 'ثواني' : 'SECONDS', val: timeLeft.seconds },
                                        ].map((slot, idx) => (
                                            <div
                                                key={idx}
                                                className="p-3 sm:p-5 rounded-2xl bg-slate-900/90 border-2 border-red-500/40 text-center shadow-xl shadow-red-900/20 backdrop-blur-md"
                                            >
                                                <div className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-wider">
                                                    {slot.val}
                                                </div>
                                                <div className="text-[10px] sm:text-xs font-bold text-red-400 mt-1 uppercase tracking-wider">
                                                    {slot.label}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* EVENT METRICS PILLS */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto pt-2 text-sm font-mono">
                                    <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-center gap-2.5">
                                        <Calendar className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                                        <span className="font-bold text-white">الجمعة 28 أغسطس 2026</span>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-center gap-2.5">
                                        <MapPin className="w-5 h-5 text-red-400 flex-shrink-0" />
                                        <span className="font-bold text-white">الدقي، الجيزة، القاهرة</span>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-center gap-2.5">
                                        <Smartphone className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                        <span className="font-bold text-emerald-300">3,000 جنيه مصري</span>
                                    </div>
                                </div>

                                {/* DUAL ACCREDITATION TRUST BADGES */}
                                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
                                    <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 text-xs sm:text-sm font-mono font-bold shadow-md">
                                        <Award className="w-5 h-5 text-cyan-400" />
                                        <span>Sudan Medical Council (SMC) Accredited</span>
                                    </div>
                                    <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900 border border-red-500/40 text-red-300 text-xs sm:text-sm font-mono font-bold shadow-md">
                                        <HeartPulse className="w-5 h-5 text-red-400" />
                                        <span>American Heart Association (AHA) Standards</span>
                                    </div>
                                </div>
                            </div>

                            {/* 3. VALUE PROPOSITION & ROLE SEPARATION GRID */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                
                                {/* COLUMN A: CLINICAL TRAINING PROVIDER (DR. SABRI) */}
                                <div className="p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-white/10 flex flex-col justify-between space-y-4">
                                    <div>
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-red-500/20 text-red-300 text-xs font-mono font-bold mb-3">
                                            <Stethoscope className="w-4 h-4" />
                                            <span>الجهة التدريبية السريرية (Clinical Provider)</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white">
                                            مركز د. صبري للتدريب الطبي المتقدم (STC)
                                        </h3>
                                        <p className="text-xs text-gray-400 font-mono mt-0.5">
                                            Dr. Sabri Training Center · Lic. 1549 · Reg. 96628
                                        </p>
                                        <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-gray-300">
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                                                <span>تدريب عملي على مجسمات ومحاكيات الإنعاش القلبي الرئوي (CPR).</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                                                <span>تشغيل وتطبيق جهاز الصدمات الآلي (AED) والتعامل مع السكتات القلبية.</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                                                <span>إتقان بروتوكولات إنقاذ الأطفال والرضع وإدارة مجرى الهواء التنفسي.</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                                                <span>شهادة معتمدة رسمياً وموثقة تلبي متطلبات التوظيف والامتياز والتسجيل الدائم.</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="pt-3 border-t border-white/10 text-xs font-mono text-gray-400">
                                        🏛️ تدريب حضوري مباشر ومكثف تحت إشراف نخبة من المدربين المعتمدين.
                                    </div>
                                </div>

                                {/* COLUMN B: EXCLUSIVE GENE ACADEMY BONUS */}
                                <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-amber-500/10 via-purple-500/10 to-cyan-500/10 border-2 border-amber-400/40 flex flex-col justify-between space-y-4">
                                    <div>
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-mono font-bold mb-3">
                                            <Gift className="w-4 h-4" />
                                            <span>الباقة الحصرية المجانية (Exclusive Bonus)</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white flex items-center justify-between">
                                            <span>أكاديمية الجينات (Gene Academy)</span>
                                            <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-400 text-black font-extrabold">FREE $150</span>
                                        </h3>
                                        <p className="text-xs text-amber-300 font-mono mt-0.5">
                                            Global Hiring & Digital Transformation Package
                                        </p>
                                        <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-gray-200">
                                            <li className="flex items-start gap-2">
                                                <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                                                <span><strong>رقم عضوية سيادي مجاني (GA-ID):</strong> تسجيل رسمي في السجل الحي لمنظومة سوداجين.</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <FileCheck className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                                                <span><strong>بناء السيرة الذاتية الطبية:</strong> صياغة وتتبع السيرة الذاتية المهنية وفق المعايير العالمية.</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Linkedin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                                                <span><strong>تطوير وتوثيق حساب LinkedIn:</strong> تحسين الملف لزيادة فرص التوظيف الإقليمي والدولي.</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Globe2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                                                <span><strong>محفظة +50 GP ترحيبية:</strong> رصيد فوري لفتح محاكيات امتحانات المجلس الطبي SMC.</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="pt-3 border-t border-amber-400/20 text-xs font-mono text-amber-300 font-bold">
                                        ⚡ يتم تفعيل هذه الباقة مجاناً وفورياً بمجرد تأكيد حجز مقعد الورشة.
                                    </div>
                                </div>

                            </div>

                            {/* 4. OFFICIAL BLS CERTIFICATE SAMPLE PREVIEW */}
                            <div className="p-6 md:p-10 rounded-3xl bg-slate-900/90 border border-white/15 space-y-6">
                                <div className="text-center space-y-2">
                                    <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold block">
                                        ACCREDITED CREDENTIAL SPECIMEN
                                    </span>
                                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                                        {lang === 'ar' ? 'نموذج الشهادة المعتمدة الصادرة للخريجين' : 'Official BLS Certificate of Completion'}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto">
                                        {lang === 'ar'
                                            ? 'تمنح الشهادة رسمياً للمتدرب بعد إتمام الجلسات العملية واجتياز تقييم الإنعاش القلبي بنجاح.'
                                            : 'Issued upon successful hands-on resuscitation simulation and clinical skills evaluation.'}
                                    </p>
                                </div>

                                {/* CERTIFICATE MOCKUP */}
                                <div className="max-w-3xl mx-auto p-6 sm:p-10 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-black border-4 border-amber-400/50 shadow-2xl relative overflow-hidden">
                                    {/* Gold Guilloche Border Accent */}
                                    <div className="absolute inset-2 border border-amber-400/30 rounded-xl pointer-events-none" />
                                    <div className="absolute top-4 right-4 text-amber-400/20">
                                        <Award className="w-24 h-24" />
                                    </div>

                                    <div className="relative z-10 text-center space-y-4 font-serif">
                                        
                                        {/* Certificate Top Badges */}
                                        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono border-b border-amber-400/30 pb-3">
                                            <span className="text-cyan-300 font-bold uppercase">SUDAN MEDICAL COUNCIL ACCREDITATION</span>
                                            <span className="text-amber-400 font-bold uppercase">AHA RESUSCITATION STANDARDS</span>
                                        </div>

                                        {/* Certificate Title */}
                                        <div className="pt-2">
                                            <h4 className="text-xs sm:text-sm font-mono tracking-widest text-amber-300 uppercase">
                                                DR. SABRI TRAINING CENTER (STC) · LIC. 1549
                                            </h4>
                                            <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-wide mt-1 font-serif">
                                                CERTIFICATE OF CLINICAL COMPETENCE
                                            </h2>
                                            <p className="text-xs sm:text-sm font-mono text-cyan-400 uppercase tracking-wider mt-1">
                                                BASIC LIFE SUPPORT (BLS) & AED MASTERY
                                            </p>
                                        </div>

                                        <p className="text-xs sm:text-sm text-gray-300 italic pt-2">
                                            This is to officially certify that
                                        </p>

                                        {/* Dynamic Name Display */}
                                        <div className="py-2 border-b-2 border-amber-400/60 max-w-md mx-auto">
                                            <span className="text-lg sm:text-2xl font-bold text-amber-200 tracking-wide font-sans">
                                                {form.fullNameEn.trim() || form.fullName.trim() || 'Dr. Candidate Full Name'}
                                            </span>
                                        </div>

                                        <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
                                            has successfully completed the intensive hands-on clinical simulation, demonstrating clinical mastery in Cardiopulmonary Resuscitation (CPR), Automated External Defibrillation (AED), pediatric resuscitation, and emergency airway stabilization.
                                        </p>

                                        {/* Certificate Footer / Signatures */}
                                        <div className="pt-6 grid grid-cols-3 gap-4 text-center text-xs font-mono border-t border-amber-400/30">
                                            <div>
                                                <span className="text-gray-400 block text-[10px]">Clinical Director (STC)</span>
                                                <strong className="text-white text-xs block mt-1">Dr. Sabri Abugroon</strong>
                                                <span className="text-amber-400 text-[10px]">Lead Clinical Facilitator</span>
                                            </div>
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="w-10 h-10 rounded-full border border-amber-400/50 flex items-center justify-center text-amber-400 bg-amber-500/10 mb-1">
                                                    <ShieldCheck className="w-6 h-6" />
                                                </div>
                                                <span className="text-[10px] text-gray-400">AUTHENTICATED</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-400 block text-[10px]">Sovereign Directorate</span>
                                                <strong className="text-white text-xs block mt-1">Gene Academy Hub</strong>
                                                <span className="text-cyan-400 text-[10px]">GA-ID Master Registry</span>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            {/* 5. INTAKE & VODAFONE CASH SETTLEMENT FORM */}
                            <div className="p-6 md:p-10 rounded-3xl bg-slate-900/90 border-2 border-cyan-500/40 shadow-2xl backdrop-blur-xl">
                                
                                <div className="text-center mb-8">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 px-4 py-1 text-xs font-mono font-bold text-cyan-400 mb-2">
                                        <Sparkles className="w-4 h-4" /> STEP 1 OF 1: INSTANT SEAT DISPATCH
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
                                        {lang === 'ar' ? 'استمارة التسديد وتأكيد الحجز الفوري' : 'Registration & Instant Seat Confirmation'}
                                    </h2>
                                    <p className="text-xs sm:text-sm text-gray-400 mt-1">
                                        {lang === 'ar'
                                            ? 'أدخل بياناتك ثم قم بتحويل 3,000 جنيه عبر فودافون كاش واكتب رقم العملية لتفعيل حجزك وميزتك فوراً.'
                                            : 'Fill your credentials, transfer 3,000 EGP via Vodafone Cash, and enter your reference ID.'}
                                    </p>
                                </div>

                                {error && (
                                    <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-200 text-sm mb-6 flex items-center gap-3">
                                        <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
                                        <span className="font-medium">{error}</span>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                                    
                                    {/* SECTION 1: APPLICANT PROFILE */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                            <h3 className="text-sm font-bold text-cyan-400 font-mono flex items-center gap-2">
                                                <span>01.</span>
                                                <span>{lang === 'ar' ? 'بيانات الطبيب / المتدرب' : 'Physician & Candidate Profile'}</span>
                                            </h3>
                                            {referralId && (
                                                <span className="text-xs font-mono text-amber-300 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-lg">
                                                    Affiliate Node: <strong>{referralId}</strong>
                                                </span>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs sm:text-sm text-gray-300 mb-1.5 font-bold">
                                                    {lang === 'ar' ? 'الاسم الكامل باللغة العربية *' : 'Full Name in Arabic *'}
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={form.fullName}
                                                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                                    placeholder="د. أحمد عبد الرحمن محمد"
                                                    className="w-full px-4 py-3.5 rounded-2xl bg-black/60 border border-white/15 text-white text-sm sm:text-base focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs sm:text-sm text-gray-300 mb-1.5 font-bold">
                                                    {lang === 'ar' ? 'الاسم بالإنجليزية (لشهادة BLS المعتمدة) *' : 'Full Name in English (For Certificate) *'}
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={form.fullNameEn}
                                                    onChange={(e) => setForm({ ...form, fullNameEn: e.target.value })}
                                                    placeholder="Dr. Ahmed Abdelrahman Mohamed"
                                                    className="w-full px-4 py-3.5 rounded-2xl bg-black/60 border border-white/15 text-white text-sm sm:text-base focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                                                    dir="ltr"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs sm:text-sm text-gray-300 mb-1.5 font-bold">
                                                    {lang === 'ar' ? 'البريد الإلكتروني الأساسي *' : 'Primary Email Address *'}
                                                </label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={form.email}
                                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                    placeholder="ahmed.doctor@gmail.com"
                                                    className="w-full px-4 py-3.5 rounded-2xl bg-black/60 border border-white/15 text-white text-sm sm:text-base focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                                                    dir="ltr"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs sm:text-sm text-gray-300 mb-1.5 font-bold">
                                                    {lang === 'ar' ? 'رقم الهاتف / الواتساب (للتواصل وتأكيد الموقع) *' : 'Phone / WhatsApp Number *'}
                                                </label>
                                                <input
                                                    type="tel"
                                                    required
                                                    value={form.phone}
                                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                                    placeholder="+20 101 234 5678 أو +249 ..."
                                                    className="w-full px-4 py-3.5 rounded-2xl bg-black/60 border border-white/15 text-white text-sm sm:text-base focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                                                    dir="ltr"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs sm:text-sm text-gray-300 mb-1.5 font-bold">
                                                    {lang === 'ar' ? 'الكلية / الجامعة المتخرج منها أو الدارس بها *' : 'University / Medical School *'}
                                                </label>
                                                <select
                                                    value={form.university}
                                                    onChange={(e) => setForm({ ...form, university: e.target.value })}
                                                    className="w-full px-4 py-3.5 rounded-2xl bg-black/60 border border-white/15 text-white text-sm sm:text-base focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                                                >
                                                    {CANONICAL_UNIVERSITIES.map((u, idx) => (
                                                        <option key={idx} value={u} className="bg-slate-900 text-white">
                                                            {u}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-xs sm:text-sm text-gray-300 mb-1.5 font-bold">
                                                    {lang === 'ar' ? 'الصفة المهنية الحالية *' : 'Current Professional Role *'}
                                                </label>
                                                <select
                                                    value={form.role}
                                                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                                                    className="w-full px-4 py-3.5 rounded-2xl bg-black/60 border border-white/15 text-white text-sm sm:text-base focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                                                >
                                                    {ROLES.map((r) => (
                                                        <option key={r.id} value={r.id} className="bg-slate-900 text-white">
                                                            {r.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* SECTION 2: VODAFONE CASH SETTLEMENT */}
                                    <div className="space-y-4 pt-4 border-t border-white/10">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-bold text-cyan-400 font-mono flex items-center gap-2">
                                                <span>02.</span>
                                                <span>{lang === 'ar' ? 'تسوية رسوم الورشة (3,000 EGP عبر فودافون كاش)' : 'Workshop Settlement (3,000 EGP)'}</span>
                                            </h3>
                                            <span className="text-xs font-mono font-bold text-red-400">
                                                Vodafone Cash Wallet
                                            </span>
                                        </div>

                                        <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/30 space-y-4">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400">
                                                        <Smartphone className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <strong className="text-base text-white block">
                                                            {lang === 'ar' ? 'محفظة فودافون كاش الرسمية (مصر)' : 'Official Vodafone Cash Wallet (Egypt)'}
                                                        </strong>
                                                        <span className="text-xs text-gray-300">
                                                            {lang === 'ar' ? 'تحويل مباشر بقيمة 3,000 جنيه مصري' : 'Direct transfer of 3,000 EGP'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <span className="px-4 py-2 rounded-xl bg-black/70 border border-white/20 font-mono text-base sm:text-lg text-red-300 font-black">
                                                        01015922628
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCopyNumber('01015922628')}
                                                        className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                                                        title="Copy Vodafone Number"
                                                    >
                                                        {copiedNumber ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* USSD Fast Dial Code */}
                                            <div className="p-3 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between text-xs sm:text-sm font-mono text-gray-300">
                                                <span>كود التحويل السريع عبر الهاتف:</span>
                                                <span className="text-cyan-300 font-bold text-sm sm:text-base" dir="ltr">
                                                    *9*7*01015922628*3000#
                                                </span>
                                            </div>

                                            {/* Reference Input */}
                                            <div>
                                                <label className="block text-xs sm:text-sm text-gray-200 mb-1.5 font-bold">
                                                    {lang === 'ar' ? 'رقم الإشعار / مرجع العملية المالي (Transaction ID) *' : 'Vodafone Cash Transaction Reference *'}
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={form.providerRef}
                                                    onChange={(e) => setForm({ ...form, providerRef: e.target.value })}
                                                    placeholder="مثال: TRX-98472918 أو رقم العملية من رسالة فودافون"
                                                    className="w-full px-4 py-3.5 rounded-2xl bg-black/70 border border-white/20 text-white font-mono text-sm sm:text-base focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                                                    dir="ltr"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* SUBMIT BUTTON */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-5 px-8 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-base sm:text-xl tracking-wide shadow-2xl shadow-red-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <span>{lang === 'ar' ? 'جارٍ تسجيل المقعد وإصدار المعرف...' : 'Minting ID & Reserving Seat...'}</span>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="w-6 h-6" />
                                                <span>
                                                    {lang === 'ar'
                                                        ? 'تأكيد الحجز الفوري وإصدار GemIInI ID وباقة السيرة الذاتية ➔'
                                                        : 'Confirm BLS Seat & Unlock Gene Academy Package ➔'}
                                                </span>
                                            </>
                                        )}
                                    </button>

                                    <p className="text-center text-xs text-gray-400 font-mono">
                                        🔒 {lang === 'ar' ? 'البيانات محمية ومسجلة في السجل السيادي المعتمد · دعم فني مباشر عبر الواتساب' : 'Encrypted sovereign intake · Live WhatsApp assistance available'}
                                    </p>
                                </form>

                            </div>

                        </div>
                    )}

                </div>
            </Section>
        </Layout>
    );
};

// Helper user check icon
const UserCheckIcon = ({ className }) => <UserCheck className={className} />;

const UserCheck = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

export default BlsWorkshopPage;
