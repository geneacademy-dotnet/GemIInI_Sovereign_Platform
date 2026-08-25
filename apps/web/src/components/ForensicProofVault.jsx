import React from 'react';
import {
    ShieldCheck,
    Award,
    Calendar,
    Users,
    Stethoscope,
    Sparkles,
    Star,
    CheckCircle2,
    Activity,
    BookOpen,
    Building2,
    GraduationCap
} from 'lucide-react';

export const ForensicProofVault = () => {
    return (
        <section className="py-16 space-y-12">
            
            {/* 1. HEADER */}
            <div className="text-center space-y-2">
                <span className="px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
                    EMPIRICAL REALITY & INSTITUTIONAL RECORD
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white">
                    سجل الصمود والإنجاز الميداني
                </h2>
                <p className="text-xs sm:text-sm text-gray-400 max-w-2xl mx-auto">
                    لسنا منصة تسويقية ناشئة؛ نحن حراك طبي وأكاديمي متجذر ينقل الكفاءات السريرية من قلب الأزمة إلى العالمية.
                </p>
            </div>

            {/* 2. THE TELEMETRY GRID (4 MASSIVE STATS CARDS) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 hover:border-cyan-500/40 transition-all">
                    <span className="text-3xl sm:text-4xl font-mono font-black text-cyan-400 block mb-1">2,441+</span>
                    <span className="text-xs text-gray-300 font-bold block">طبيب وباحث مسجل</span>
                    <span className="text-[10px] text-gray-500 font-mono">Master Verified Ledger</span>
                </div>

                <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 hover:border-amber-500/40 transition-all">
                    <span className="text-3xl sm:text-4xl font-mono font-black text-amber-400 block mb-1">35+</span>
                    <span className="text-xs text-gray-300 font-bold block">جراح وخريج BSS في القاهرة</span>
                    <span className="text-[10px] text-gray-500 font-mono">Cairo Surgical Fellows</span>
                </div>

                <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 hover:border-emerald-500/40 transition-all">
                    <span className="text-3xl sm:text-4xl font-mono font-black text-emerald-400 block mb-1">2,500+</span>
                    <span className="text-xs text-gray-300 font-bold block">سيناريو وحالة سريرية</span>
                    <span className="text-[10px] text-gray-500 font-mono">SMC / USMLE Vignettes</span>
                </div>

                <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 hover:border-purple-500/40 transition-all">
                    <span className="text-3xl sm:text-4xl font-mono font-black text-purple-400 block mb-1">54</span>
                    <span className="text-xs text-gray-300 font-bold block">جامعة وكلية طبية معتمدة</span>
                    <span className="text-[10px] text-gray-500 font-mono">Canonical G-UNIS Registry</span>
                </div>
            </div>

            {/* 3. THE CRUCIBLE TIMELINE */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#080C14] border border-white/10 space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    <span>خط السير المؤسسي (The Crucible Timeline)</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                        <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-[10px] font-mono font-bold">أبريل 2023</span>
                        <h4 className="text-sm font-bold text-white">انقطاع المسار السريري</h4>
                        <p className="text-xs text-gray-400">اندلاع الأزمة وتعليق التدريب الجامعي والمستشفيات التعليمية في الخرطوم.</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">يونيو 2023 – 2024</span>
                        <h4 className="text-sm font-bold text-white">إنقاذ سوداجين اللامركزي</h4>
                        <p className="text-xs text-gray-400">إطلاق التعليم الطبي الرقمي وتدريب أكثر من 1,900 طبيب وباحث على المنهجية السريرية.</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                        <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold">2024 – 2026</span>
                        <h4 className="text-sm font-bold text-white">دورات الجراحة بالقاهرة (BSS)</h4>
                        <p className="text-xs text-gray-400">تخريج 35+ جراحاً في ورش المهارات الجراحية الأساسية BSS-1 و BSS-2 بالقاهرة.</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 space-y-1">
                        <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">28 أغسطس 2026</span>
                        <h4 className="text-sm font-bold text-cyan-300">الدفعة السريرية الحالية (BLS)</h4>
                        <p className="text-xs text-gray-300">انعقاد البرنامج السريري المتقدم للإنعاش بمركز د. صبري بالدقي.</p>
                    </div>
                </div>
            </div>

            {/* 4. FORENSIC MARQUEE (ALUMNI VERIFICATION) */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/20 via-slate-900 to-amber-950/20 border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                    <div className="flex text-amber-400">
                        <Star className="w-4 h-4 fill-amber-400" />
                        <Star className="w-4 h-4 fill-amber-400" />
                        <Star className="w-4 h-4 fill-amber-400" />
                        <Star className="w-4 h-4 fill-amber-400" />
                        <Star className="w-4 h-4 fill-amber-400" />
                    </div>
                    <span className="text-white font-bold">التقييم المؤسسي الميداني:</span>
                    <span className="text-gray-300">4.74 / 5.00 عبر 16 استبياناً سريرياً موثقاً للخريجين.</span>
                </div>
                <span className="text-cyan-300 font-mono text-[11px]">Audit Reference: 0G-UNIS-VERIFIED</span>
            </div>

            {/* 5. ACCREDITATION WALL */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 flex flex-wrap items-center justify-around gap-6 text-center">
                <div>
                    <span className="text-gray-400 block text-[10px] font-mono">TRAINING CENTER LICENSING</span>
                    <strong className="text-white text-sm">Dr. Sabri Training Center (Lic. 1549)</strong>
                </div>
                <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
                <div>
                    <span className="text-gray-400 block text-[10px] font-mono">CLINICAL ACCREDITATION</span>
                    <strong className="text-cyan-300 text-sm">American Heart Association (AHA Guidelines)</strong>
                </div>
                <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
                <div>
                    <span className="text-gray-400 block text-[10px] font-mono">REGULATORY COMPLIANCE</span>
                    <strong className="text-emerald-400 text-sm">Sudan Medical Council (SMC Standards)</strong>
                </div>
            </div>
        </section>
    );
};

export default ForensicProofVault;
