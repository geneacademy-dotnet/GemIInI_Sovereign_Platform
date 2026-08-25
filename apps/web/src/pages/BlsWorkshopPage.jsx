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
    Clock,
    Flame
} from 'lucide-react';
import Layout from '@/components/site/Layout';
import { Section } from '@/components/site/Bits';
import SovereignGateway from '@/components/SovereignGateway';
import ForensicProofVault from '@/components/ForensicProofVault';
import { useLang } from '@/i18n/LanguageContext';

const BlsWorkshopPage = () => {
    const { lang } = useLang();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // 1. Referral Capture (?ref=GA-000)
    const rawRef = searchParams.get('ref') || searchParams.get('affiliate') || '';
    useEffect(() => {
        if (rawRef) {
            localStorage.setItem('gemiini_affiliate_ref', rawRef);
        }
    }, [rawRef]);

    // 2. Live Countdown Timer to August 28, 2026 09:00:00 GMT+2
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

    return (
        <Layout>
            <Helmet>
                <title>البرنامج السريري المتقدم للإنعاش القلبي الرئوي (BLS) — القاهرة | GemIInI Academy</title>
                <meta
                    name="description"
                    content="البرنامج السريري المعتمد للإنعاش القلبي الرئوي (BLS) — دفعة القاهرة 28 أغسطس 2026. تدريب عملي بمحاكيات سريرية واعتماد المجلس الطبي السوداني وجمعية القلب الأمريكية."
                />
            </Helmet>

            <Section className="py-12 bg-[#04080F] text-white min-h-screen">
                <div className="mx-auto max-w-4xl px-4 space-y-16">
                    
                    {/* STAGE 1: ATTENTION (HERO & LIVE COUNTDOWN & STRICT CAPACITY) */}
                    <div className="text-center space-y-6">
                        <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full bg-slate-900/90 border border-white/10 px-4 py-1.5 text-xs font-mono text-gray-300">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                            <span className="text-white font-bold">جلسة محاكاة سريرية معتمدة — القاهرة</span>
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
                            تدريب عملي ومحاكاة سريرية حية بمركز د. صبري للتدريب (ترخيص 1549)، مع توثيق الساعات المعرفية بـ <strong>200 نقطة GP</strong> وحقيبة التحول الرقمي والسيرة الذاتية المهنية من أكاديمية جيميني.
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
                                    مركز د. صبري للتدريب (ترخيص 1549) — الدقي، القاهرة
                                </span>
                                <span className="text-red-400 font-bold flex items-center gap-1">
                                    <Flame className="w-4 h-4" />
                                    مقاعد محدودة لضمان المعايير السريرية
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* STAGE 2: FORENSIC PROOF VAULT & INSTITUTIONAL CRUCIBLE */}
                    <ForensicProofVault />

                    {/* STAGE 3: THE VALUATION MATRIX & EXCLUSIVE BONUSES */}
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
                                            ورشة الإنعاش القلبي الرئوي العملي (BLS Provider) — مركز د. صبري
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
                                            بونص حصري: حقيبة التحول الرقمي وهندسة السيرة الذاتية (Gene Academy)
                                            <span className="block text-[11px] text-gray-400">تصميم وتحديث السيرة الذاتية الطبية للمنح والوظائف</span>
                                        </td>
                                        <td className="py-4 text-center font-mono text-purple-300 font-bold">بونص مجاني</td>
                                        <td className="py-4 text-left text-gray-300">حقيبة تدريبية سريرية كاملة في لوحة العضو</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* GENE ACADEMY DIGITAL BONUS BANNER */}
                        <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-500/15 via-indigo-500/10 to-cyan-500/15 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center text-2xl flex-shrink-0">
                                    🎁
                                </div>
                                <div>
                                    <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest block">GENE ACADEMY EXCLUSIVE FEATURE</span>
                                    <h4 className="text-sm sm:text-base font-bold text-white mt-0.5">
                                        حقيبة التحول الرقمي وهندسة السيرة الذاتية والملف المهني (LinkedIn & CV Portfolio)
                                    </h4>
                                    <p className="text-xs text-gray-300 mt-1">ميزة حصرية من أكاديمية جيميني تُفعّل تلقائياً داخل لوحة العضو عند إتمام الحجز.</p>
                                </div>
                            </div>
                            <span className="px-4 py-2 rounded-xl bg-purple-500 text-white font-bold text-xs font-mono flex-shrink-0">
                                مشمولة مجاناً
                            </span>
                        </div>
                    </div>

                    {/* STAGE 4: THE ADAPTIVE SOVEREIGN GATEWAY INTAKE */}
                    <SovereignGateway />

                </div>
            </Section>
        </Layout>
    );
};

export default BlsWorkshopPage;
