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
    AlertCircle,
    Coins,
    GraduationCap,
    Mic,
    Building2,
    MessageCircle,
    CheckSquare,
    Square,
    Clock,
    Flame
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

    // Live Countdown Timer to August 28, 2026 09:00:00 GMT+2
    const [timeLeft, setTimeLeft] = useState({ days: '03', hours: '14', mins: '28', secs: '45' });
    useEffect(() => {
        const target = new Date('August 28, 2026 09:00:00 GMT+0200').getTime();
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const diff = target - now;
            if (diff > 0) {
                setTimeLeft({
                    days: String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0'),
                    hours: String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0'),
                    mins: String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0'),
                    secs: String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0')
                });
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Payment Routing state: 'VODAFONE' vs 'BANK'
    const [paymentMethod, setPaymentMethod] = useState('VODAFONE');
    // Consortium Patron Booster state
    const [patronActive, setPatronActive] = useState(false);

    // Sanitized Form inputs state
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

    const calculatedGp = patronActive ? 250 : 200;
    const totalAmountEgp = patronActive ? 3250 : 3000;

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

        if (!form.providerRef.trim()) {
            setError(lang === 'ar' ? 'يرجى إدخال رقم العملية أو الإشعار' : 'Please enter your payment transaction reference');
            return;
        }

        setLoading(true);

        try {
            const idempotencyKey = generateIdempotencyKey({
                email: form.email,
                phone: form.phone,
                method: paymentMethod,
                patron: patronActive,
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
                paymentMethod: paymentMethod,
                boughtCoffee: patronActive,
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
                    boughtCoffee: patronActive,
                    referralId: referralId || 'GA-000',
                    sabriBonusUnlocked: true,
                    workshopDate: 'Friday, August 28, 2026',
                    location: 'Dokki, Cairo, Egypt'
                };

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
                <title>البرنامج السريري المتقدم للإنعاش القلبي الرئوي (BLS) — القاهرة | GemIInI Academy</title>
                <meta
                    name="description"
                    content="البرنامج السريري المعتمد للإنعاش القلبي الرئوي (BLS) — دفعة القاهرة 28 أغسطس 2026. تدريب عملي بمحاكيات GemIInI عالية الدقة واعتماد المجلس الطبي السوداني وجمعية القلب الأمريكية."
                />
            </Helmet>

            <Section className="py-12 bg-[#04080F] text-white min-h-screen">
                <div className="mx-auto max-w-4xl px-4 space-y-16">
                    
                    {/* STAGE 1: HERO & LIVE COUNTDOWN & STRICT CAPACITY */}
                    <div className="text-center space-y-6">
                        <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full bg-slate-900/90 border border-white/10 px-4 py-1.5 text-xs font-mono text-gray-300">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                            <span className="text-white font-bold">جلسة محاكاة سريرية عالية الدقة</span>
                            <span className="text-gray-500">|</span>
                            <span className="text-cyan-300">اعتماد AHA & SMC</span>
                        </div>

                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight">
                            البرنامج السريري المتقدم<br />
                            <span className="bg-gradient-to-r from-red-400 via-amber-300 to-cyan-400 bg-clip-text text-transparent">
                                للإنعاش القلبي الرئوي الأساسي (BLS)
                            </span>
                        </h1>

                        <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                            محاكاة سريرية 1:1 على دمى الإنعاش الذكية الخاصة بأكاديمية جيميني، بالتعاون الأكاديمي مع مركز د. صبري للتدريب (ترخيص 1549)، مع توثيق الساعات المعرفية بـ <strong>200 نقطة GP</strong> في السجل العام.
                        </p>

                        {/* LIVE COUNTDOWN ENGINE */}
                        <div className="p-6 rounded-3xl bg-slate-900/80 border border-red-500/30 max-w-2xl mx-auto shadow-2xl backdrop-blur-md">
                            <div className="text-xs font-mono text-gray-400 mb-3 uppercase tracking-wider flex items-center justify-center gap-2">
                                <Clock className="w-4 h-4 text-red-400" />
                                <span>الموعد النهائي لانعقاد الدفعة السريرية — القاهرة</span>
                            </div>
                            <div className="grid grid-cols-4 gap-2 text-center font-mono">
                                <div className="p-3 rounded-2xl bg-black/50 border border-white/10">
                                    <span className="text-2xl sm:text-3xl font-black text-white block">{timeLeft.days}</span>
                                    <span className="text-[10px] text-gray-400">أيام</span>
                                </div>
                                <div className="p-3 rounded-2xl bg-black/50 border border-white/10">
                                    <span className="text-2xl sm:text-3xl font-black text-white block">{timeLeft.hours}</span>
                                    <span className="text-[10px] text-gray-400">ساعة</span>
                                </div>
                                <div className="p-3 rounded-2xl bg-black/50 border border-white/10">
                                    <span className="text-2xl sm:text-3xl font-black text-white block">{timeLeft.mins}</span>
                                    <span className="text-[10px] text-gray-400">دقيقة</span>
                                </div>
                                <div className="p-3 rounded-2xl bg-black/50 border border-white/10">
                                    <span className="text-2xl sm:text-3xl font-black text-red-400 block">{timeLeft.secs}</span>
                                    <span className="text-[10px] text-gray-400">ثانية</span>
                                </div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-gray-400 font-mono gap-2">
                                <span className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-red-400" />
                                    مركز د. صبري — الدقي، القاهرة
                                </span>
                                <span className="text-red-400 font-bold flex items-center gap-1">
                                    <Flame className="w-4 h-4" />
                                    مقاعد محدودة جداً لضمان نسبة 1:1 على الدمى
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* STAGE 2: THE INSTITUTIONAL HERITAGE STORY (TIMES NEW ROMAN / EDITORIAL SERIF) */}
                    <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/90 border border-amber-500/30 shadow-2xl relative overflow-hidden backdrop-blur-md">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-lg">
                                🏛️
                            </div>
                            <div>
                                <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold block">
                                    THE INSTITUTIONAL LEGACY & B2B INFRASTRUCTURE
                                </span>
                                <h2 className="text-xl sm:text-2xl font-bold text-white font-serif mt-0.5">
                                    قصة التأسيس: كيف تحولت جيميني من دراسة الاحتياج إلى تزويد المراكز بالمحاكيات
                                </h2>
                            </div>
                        </div>

                        <div className="space-y-4 text-gray-200 text-sm sm:text-base leading-relaxed font-serif">
                            <p className="text-justify">
                                لم تبدأ أكاديمية جيميني كمنصة تجارية تبحث عن بيع المقاعد، بل انطلقت من دراسة تشخيصية دقيقة لاحتياجات الأطباء والكوادر السريرية في مسارات الهجرة والاعتماد الدولي. بدأنا مسار التدريب العملي بشكل مستقل، وخرّجنا دفعتنا التأسيسية الأولى المكونة من <strong>7 أطباء متميزين</strong> أثبتوا كفاءتهم السريرية في مختلف المستشفيات.
                            </p>
                            <p className="text-justify">
                                وبعقلية مؤسسية لا تقبل المساومة، قمنا بإعادة استثمار كامل العوائد في الاستحواذ على أحدث <strong>دمى الإنعاش القلبي عالية الدقة (High-Fidelity CPR Mannequins)</strong> لتكون ملكاً خالصاً لبنيتنا التحتية الطبية (GLOMEt B2B Network).
                            </p>
                            <p className="text-justify border-r-2 border-amber-400 pr-4 text-amber-100 font-bold italic">
                                "واليوم، لا نكتفي بحجز قاعة تدريب، بل تقوم أكاديمية جيميني بتزويد مركز د. صبري للتدريب بالدمى والمعدات السريرية لهذه الدفعة. نحن من يصنع معيار الكفاءة، لأننا نؤمن بأن التدريب الطبي الحقيقي يُبنى على التجهيز الرصين لا الدعاية."
                            </p>
                        </div>

                        <div className="mt-8 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-gray-400">
                            <span>🎖️ الدفعة التأسيسية: 7 خريجين معتمدين</span>
                            <span>🔬 البنية التحتية: GLOMEt Clinical Hardware Network</span>
                            <span>📍 الموقع الميداني: Dokki Clinical Center</span>
                        </div>
                    </div>

                    {/* STAGE 3: VISUAL ANCHORING & METRICS */}
                    <div className="space-y-6">
                        <div className="text-center">
                            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">VERIFIED METRICS & INSTITUTIONAL FOOTPRINT</span>
                            <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">أرقام تتحدث عن ثقل المنظومة</h3>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                            <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 hover:border-cyan-500/40 transition-all">
                                <span className="text-3xl sm:text-4xl font-mono font-black text-cyan-400 block mb-1">1,905+</span>
                                <span className="text-xs text-gray-300 font-bold block">طبيب وباحث مسجل</span>
                                <span className="text-[10px] text-gray-500 font-mono">Global Medical Registry</span>
                            </div>

                            <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 hover:border-amber-500/40 transition-all">
                                <span className="text-3xl sm:text-4xl font-mono font-black text-amber-400 block mb-1">7</span>
                                <span className="text-xs text-gray-300 font-bold block">خريجو الدفعة الأولى</span>
                                <span className="text-[10px] text-gray-500 font-mono">Inaugural BLS Fellows</span>
                            </div>

                            <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 hover:border-emerald-500/40 transition-all">
                                <span className="text-3xl sm:text-4xl font-mono font-black text-emerald-400 block mb-1">2,500+</span>
                                <span className="text-xs text-gray-300 font-bold block">حالة وسيناريو سريري</span>
                                <span className="text-[10px] text-gray-500 font-mono">SMC / USMLE Vignettes</span>
                            </div>

                            <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 hover:border-indigo-500/40 transition-all">
                                <span className="text-3xl sm:text-4xl font-mono font-black text-indigo-400 block mb-1">200 GP</span>
                                <span className="text-xs text-gray-300 font-bold block">منحة الرصيد التأسيسي</span>
                                <span className="text-[10px] text-gray-500 font-mono">1 GP = 1 Certified Hour</span>
                            </div>
                        </div>
                    </div>

                    {/* STAGE 4: VALUATION MATRIX & DR. SABRI BONUS */}
                    <div className="space-y-6">
                        <div className="text-center">
                            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">PROGRAM VALUATION ARCHITECTURE</span>
                            <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">ماذا تستلم فعلياً مقابل استثمارك؟</h3>
                        </div>

                        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-white/10 overflow-x-auto">
                            <table className="w-full text-right text-xs sm:text-sm">
                                <thead>
                                    <tr className="border-b border-white/10 text-gray-400 font-mono">
                                        <th className="pb-3 text-right">المكوّن السريري / الأصل الرقمي</th>
                                        <th className="pb-3 text-center">القيمة المؤسسية</th>
                                        <th className="pb-3 text-left">العائد المهني المباشر</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    <tr>
                                        <td className="py-4 font-bold text-white">
                                            ورشة الإنعاش القلبي الرئوي العملي (BLS Provider)
                                            <span className="block text-[11px] text-gray-400">محاكاة عملية واختبار معتمد من AHA & SMC</span>
                                        </td>
                                        <td className="py-4 text-center font-mono text-cyan-300 font-bold">3,000 ج.م</td>
                                        <td className="py-4 text-left text-gray-300">متطلب إلزامي للترخيص والزمالات الدولية</td>
                                    </tr>
                                    <tr>
                                        <td className="py-4 font-bold text-white">
                                            هوية GemIInI الرقمية + صفحة التحقق الدائم
                                            <span className="block text-[11px] text-gray-400">سجل موثق ضد التزوير للتقديم على المستشفيات</span>
                                        </td>
                                        <td className="py-4 text-center font-mono text-emerald-300 font-bold">مشمول (150$ مجاناً)</td>
                                        <td className="py-4 text-left text-gray-300">توثيق دولي فوري عبر QR Code والسجل العام</td>
                                    </tr>
                                    <tr>
                                        <td className="py-4 font-bold text-white">
                                            منحة رصيد الساعات السريرية (200 GP)
                                            <span className="block text-[11px] text-gray-400">1 GP = 1 ساعة تعليم طبي معتمد في المنظومة</span>
                                        </td>
                                        <td className="py-4 text-center font-mono text-amber-300 font-bold">مشمول مجاناً</td>
                                        <td className="py-4 text-left text-gray-300">تفتح محاكي امتحانات SMC وبنك الأسئلة السريرية</td>
                                    </tr>
                                    <tr>
                                        <td className="py-4 font-bold text-white">
                                            بونص حصري: ورشة التحول الرقمي والسيرة الذاتية (د. صبري)
                                            <span className="block text-[11px] text-gray-400">تصميم وتحديث السيرة الذاتية الطبية للمنح والوظائف</span>
                                        </td>
                                        <td className="py-4 text-center font-mono text-purple-300 font-bold">بونص مجاني</td>
                                        <td className="py-4 text-left text-gray-300">حقيبة تدريبية سريرية كاملة في لوحة العضو</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* DR. MOHAMED SABRI BONUS BANNER */}
                        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-purple-500/10 to-cyan-500/15 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-2xl flex-shrink-0">
                                    🎁
                                </div>
                                <div>
                                    <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">EXCLUSIVE BONUS UNLOCKED</span>
                                    <h4 className="text-sm sm:text-base font-bold text-white mt-0.5">
                                        ورشة التحول الرقمي وتصميم السيرة الذاتية السريرية — تقديم: د. محمد صبري
                                    </h4>
                                    <p className="text-xs text-gray-300 mt-1">تُفعّل الحقيبة التدريبية فوراً داخل لوحة تحكم كل طبيب يسجل عبر هذه البوابة.</p>
                                </div>
                            </div>
                            <span className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs font-mono flex-shrink-0">
                                مشمولة مجاناً
                            </span>
                        </div>
                    </div>

                    {/* STAGE 5: THE INTAKE FORM (PLACED AT THE BOTTOM OF THE FUNNEL) */}
                    <div id="register" className="pt-8">
                        <div className="text-center mb-8">
                            <span className="text-xs font-mono text-red-400 font-bold uppercase tracking-wider block">FINAL STEP: SECURE YOUR PHYSICAL SEAT</span>
                            <h3 className="text-2xl sm:text-4xl font-black text-white mt-1">استمارة الحجز والتسجيل السريري</h3>
                            <p className="text-xs sm:text-sm text-gray-400 mt-2">يتم إصدار رقم المعرف الأكاديمي (GA-ID) وتفعيل رصيد 200 GP فور تأكيد الإشعار.</p>
                        </div>

                        {mintedResult ? (
                            <div className="p-8 rounded-3xl bg-slate-900 border border-emerald-500/40 shadow-2xl space-y-4">
                                <div className="text-center pb-4 border-b border-white/10">
                                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">تم تأكيد المقعد وإصدار الهوية بنجاح</span>
                                    <h3 className="text-3xl font-mono font-black text-cyan-400 mt-2">{mintedResult.gaId}</h3>
                                    <p className="text-xs text-gray-400 mt-1">{mintedResult.name}</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                                    <div className="p-3 rounded-xl bg-black/40">الرصيد المودع: <strong className="text-amber-400">+{mintedResult.gpBalance} GP</strong></div>
                                    <div className="p-3 rounded-xl bg-black/40">بونص د. صبري: <strong className="text-emerald-300">مفعل (حقيبة السيرة الذاتية)</strong></div>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button onClick={() => navigate('/dashboard')} className="w-full py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs text-center">دخول لوحة التحكم والمحفظة ➔</button>
                                    <button onClick={() => navigate(`/verify?id=${mintedResult.gaId}`)} className="w-full py-3 rounded-xl bg-slate-800 text-white font-bold text-xs text-center">التحقق في السجل العام ➔</button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="p-6 sm:p-10 rounded-3xl bg-slate-900/90 border border-white/10 space-y-6 shadow-2xl">
                                <div>
                                    <h4 className="text-xs font-mono font-bold text-cyan-400 mb-3 flex items-center gap-2">
                                        <span>01.</span> البيانات الشخصية والجامعية
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-gray-300 mb-1">الاسم الرباعي الرسمي *</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Dr. Firstname Lastname"
                                                value={form.fullName}
                                                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:border-cyan-400 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-300 mb-1">البريد الإلكتروني المهني *</label>
                                            <input
                                                type="email"
                                                required
                                                placeholder="physician@hospital.edu"
                                                value={form.email}
                                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:border-cyan-400 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-300 mb-1">رقم الهاتف / الواتساب *</label>
                                            <input
                                                type="tel"
                                                required
                                                placeholder="+20 100 000 0000"
                                                value={form.phone}
                                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:border-cyan-400 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-300 mb-1">الجامعة / الكلية الطبية *</label>
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

                                <div className="pt-4 border-t border-white/10 space-y-4">
                                    <h4 className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-2">
                                        <span>02.</span> قناة السداد والتحقق
                                    </h4>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div
                                            onClick={() => setPaymentMethod('VODAFONE')}
                                            className={`p-4 rounded-xl border cursor-pointer font-bold flex items-center justify-between text-xs transition-all ${
                                                paymentMethod === 'VODAFONE'
                                                    ? 'border-red-500 bg-red-500/10 text-red-300'
                                                    : 'border-white/10 bg-white/5 text-gray-400'
                                            }`}
                                        >
                                            <span>فودافون كاش (Vodafone Cash — 3,000 EGP)</span>
                                            {paymentMethod === 'VODAFONE' && <span>✓</span>}
                                        </div>
                                        <div
                                            onClick={() => setPaymentMethod('BANK')}
                                            className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between text-xs transition-all ${
                                                paymentMethod === 'BANK'
                                                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-bold'
                                                    : 'border-white/10 bg-white/5 text-gray-400'
                                            }`}
                                        >
                                            <span>تحويل بنكي / InstaPay / بنكك (Manual Gate)</span>
                                            {paymentMethod === 'BANK' && <span>✓</span>}
                                        </div>
                                    </div>

                                    {paymentMethod === 'VODAFONE' ? (
                                        <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 space-y-3">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                <div>
                                                    <strong className="text-sm text-white block">محفظة فودافون كاش الرسمية</strong>
                                                    <span className="text-xs text-gray-400">المبلغ: 3,000 جنيه مصري</span>
                                                </div>
                                                <span className="px-3 py-1.5 rounded-xl bg-black/60 font-mono text-red-300 font-bold text-sm">01015922628</span>
                                            </div>
                                            <div className="p-2.5 rounded-xl bg-black/40 font-mono text-[11px] text-gray-300">
                                                كود السداد المباشر: <span className="text-cyan-300 font-bold">*9*7*01015922628*3000#</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
                                            <div className="flex items-start gap-3">
                                                <span className="text-emerald-400 text-xl">🏛️</span>
                                                <div>
                                                    <strong className="text-sm text-white block">التحويلات البنكية تتطلب التحقق الفوري</strong>
                                                    <p className="text-xs text-gray-300 mt-1">تواصل مع مكتب العمليات الأكاديمية على واتساب لتزويدك برقم الحساب وإرسال الإشعار.</p>
                                                </div>
                                            </div>
                                            <a
                                                href="https://wa.me/201015922628"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                                            >
                                                <span>مراسلة المكتب الأكاديمي على واتساب (+20 101 592 2628) ➔</span>
                                            </a>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-xs text-gray-300 mb-1 font-medium">رقم العملية / الإشعار من الرسالة *</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="TRX-XXXXXXXX أو رقم التحويل"
                                            value={form.providerRef}
                                            onChange={(e) => setForm({ ...form, providerRef: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div
                                    onClick={() => setPatronActive(!patronActive)}
                                    className={`p-4 sm:p-5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                                        patronActive
                                            ? 'border-amber-400 bg-amber-950/40 ring-1 ring-amber-400'
                                            : 'border-white/10 bg-white/5'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        {patronActive ? <CheckSquare className="w-5 h-5 text-amber-400" /> : <Square className="w-5 h-5 text-gray-400" />}
                                        <div>
                                            <strong className="text-xs sm:text-sm text-white block">باقة راعي الكونسورتيوم (Consortium Patron Booster — 250 EGP)</strong>
                                            <p className="text-[11px] text-amber-300 mt-0.5">
                                                المساهمة في التوسع المستمر لشبكة المحاكيات الطبية، تفعيل التدقيق السريع للطلب، ومنح رصيد إضافي <strong>+50 GP</strong> (إجمالي 250 GP)!
                                            </p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 rounded-full font-mono text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex-shrink-0">
                                        {patronActive ? '+50 GP Active (Total 250 GP)' : '+50 GP Booster'}
                                    </span>
                                </div>

                                {error && (
                                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 text-white font-black text-sm shadow-xl shadow-red-500/20 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <span>جارٍ معالجة الحجز وإصدار الهوية...</span>
                                    ) : (
                                        <span>تأكيد الحجز وإصدار GemIInI ID برصيد {calculatedGp} GP وبونص د. صبري ➔</span>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </Section>
        </Layout>
    );
};

export default BlsWorkshopPage;
