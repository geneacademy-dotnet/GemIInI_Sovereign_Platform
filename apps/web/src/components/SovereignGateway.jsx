import React, { useState } from 'react';
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
    Flame,
    Lock,
    ExternalLink,
    Zap,
    MessageSquare,
    Globe,
    Send
} from 'lucide-react';
import SovereignClient, { generateIdempotencyKey, normalizeGaId } from '@/services/sovereignService';

const UNIVERSITIES_WITH_COHORTS = [
    { name: 'جامعة الخرطوم | University of Khartoum', peers: '342+ طبيب مسجل' },
    { name: 'جامعة الجزيرة | University of Gezira', peers: '289+ طبيب مسجل' },
    { name: 'جامعة أم درمان الإسلامية | Omdurman Islamic University', peers: '215+ طبيب مسجل' },
    { name: 'جامعة الأحفاد للبنات | Ahfad University for Women', peers: '178+ طبيبة مسجلة' },
    { name: 'جامعة الزعيم الأزهري | Alzaiem Alazhari University', peers: '164+ طبيب مسجل' },
    { name: 'جامعة النيلين | Al-Neelain University', peers: '198+ طبيب مسجل' },
    { name: 'جامعة كرري | Karary University', peers: '145+ طبيب مسجل' },
    { name: 'جامعة العلوم الطبية والتكنولوجيا | UMST', peers: '182+ طبيب مسجل' },
    { name: 'جامعة شندي | University of Shendi', peers: '112+ طبيب مسجل' },
    { name: 'كليات الطب المصرية والجامعات الأخرى (Egypt & Regional)', peers: '420+ طبيب مسجل' }
];

export const SovereignGateway = ({ onRegistered }) => {
    const [gradYear, setGradYear] = useState('2024');
    const [location, setLocation] = useState('Egypt');
    const [track, setTrack] = useState('SMC');
    const [selectedUni, setSelectedUni] = useState(UNIVERSITIES_WITH_COHORTS[0].name);
    
    const [paymentMethod, setPaymentMethod] = useState('VODAFONE');

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        providerRef: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [minted, setMinted] = useState(null);

    // KSA Post-Submission Intercept Modal State
    const [showKsaModal, setShowKsaModal] = useState(false);
    const [ksaQuestion, setKsaQuestion] = useState('');

    const isDisruptedCohort = parseInt(gradYear) >= 2022 && parseInt(gradYear) <= 2026 && location === 'Egypt';
    const isSmcUrgent = track === 'SMC';
    const matchedUni = UNIVERSITIES_WITH_COHORTS.find(u => u.name === selectedUni);

    const feeAmount = 3000;
    const calculatedGp = 200;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim() || !form.providerRef.trim()) {
            setError('يرجى إكمال جميع الحقول الإلزامية ورقم الإشعار المالي.');
            return;
        }

        setLoading(true);

        try {
            const idempotencyKey = generateIdempotencyKey({
                email: form.email,
                phone: form.phone,
                ref: form.providerRef
            });

            const payload = {
                action: 'bls_register',
                fullName: form.fullName.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                university: selectedUni,
                gradYear: gradYear,
                location: location,
                track: track,
                paymentMethod: paymentMethod,
                feeAmount: feeAmount,
                providerRef: form.providerRef.trim(),
                referralId: localStorage.getItem('gemiini_affiliate_ref') || 'GA-000',
                gpAwarded: calculatedGp,
                idempotencyKey
            };

            const res = await SovereignClient.register(payload);

            if (res && (res.status === 'success' || res.gaId)) {
                const gaId = normalizeGaId(res.gaId || 'GA-1001');
                const finalData = {
                    gaId,
                    name: form.fullName,
                    gpBalance: res.gpBalance || calculatedGp,
                    digitalBonusUnlocked: true,
                    track: track
                };

                localStorage.setItem('gemiini_presence_id', gaId);
                localStorage.setItem('gemiini_member_profile', JSON.stringify(finalData));

                setMinted(finalData);
                setShowKsaModal(true); // TRIGGER POST-SUBMISSION INTERCEPT MODAL
                if (onRegistered) onRegistered(finalData);
            } else {
                setError(res.message || 'تعذر تأكيد التسجيل في السجل المركزي.');
            }
        } catch (err) {
            setError(err.message || 'خطأ في الاتصال بالخادم المركزي.');
        } finally {
            setLoading(false);
        }
    };

    const handleKsaSubmit = (e) => {
        e.preventDefault();
        const baseMsg = `مرحباً مكتب العمليات بالمملكة العربية السعودية (KSA Node):\n\nأنا الطبيب: ${minted?.name || form.fullName}\nالمعرف الرقمي: ${minted?.gaId || 'GA-PENDING'}\nالمسار المستهدف: ${track}\n\nاستفساري بخصوص التصنيف / التوظيف السريري:\n${ksaQuestion || 'أرغب في الحصول على استشارة فورية لترخيص الهيئة السعودية والتنسيق السريري.'}`;
        const url = `https://wa.me/966550476176?text=${encodeURIComponent(baseMsg)}`;
        window.open(url, '_blank');
        setShowKsaModal(false);
    };

    return (
        <div id="sovereign-intake" className="p-6 sm:p-10 rounded-3xl bg-[#080C14] border border-cyan-500/20 shadow-2xl space-y-8 max-w-3xl mx-auto relative">
            
            {/* KSA OPERATIONS DESK FLOATING BADGE */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 text-xs">
                <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <Globe className="w-4 h-4 text-emerald-400" />
                    <div>
                        <strong className="text-white block font-mono text-[11px]">KSA OPERATIONS DESK / مكتب العمليات بالمملكة</strong>
                        <span className="text-[10px] text-gray-400">تنسيق التراخيص (SCFHS) والتوزيع السريري في السعودية</span>
                    </div>
                </div>
                <a
                    href="https://wa.me/966550476176?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D9%85%D9%83%D8%AA%D8%A8%20%D8%B9%D9%85%D9%84%D9%8A%D8%A7%D8%AA%20%D8%A7%D9%84%D8%B3%D8%B9%D9%88%D8%AF%D9%8A%D8%A9%20(KSA%20Node)%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A7%D8%B3%D8%AA%D8%B4%D8%A7%D8%B1%D8%A9%20%D8%A7%D9%84%D8%AA%D8%B1%D8%A7%D8%AE%D9%8A%D8%B5%20%D8%A7%D9%84%D9%85%D9%87%D9%86%D9%8A%D8%A9."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>+966 55 047 6176 ➔</span>
                </a>
            </div>

            {/* 1. HEADER */}
            <div className="text-center space-y-2">
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold">
                    ADAPTIVE CLINICAL INTAKE & SETTLEMENT
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                    استمارة الحجز والتوثيق الأكاديمي المعتمد
                </h3>
                <p className="text-xs text-gray-400">
                    النظام يتكيف تلقائياً مع دفعتك وجامعتك لربطك بمسار الاعتماد الدولي.
                </p>
            </div>

            {/* 2. ADAPTIVE CONVERSATIONAL BANNERS */}
            <div className="space-y-3">
                {isDisruptedCohort && (
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3 animate-fadeIn">
                        <GraduationCap className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <strong className="block text-amber-300 font-bold mb-0.5">مسار الدفعات الاستثنائية (2022–2026 — الإقليم المصري):</strong>
                            <span>نحن ندرك حجم التحديات والانقطاع السريري الذي واجهته دفعتك. أكاديمية جيميني هي جسرك المباشر للاعتماد والتوظيف الدولي.</span>
                        </div>
                    </div>
                )}

                {isSmcUrgent && (
                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs flex items-start gap-3 animate-fadeIn">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <strong className="block text-red-300 font-bold mb-0.5">🚨 مسار امتحان الكفاءة الدائمة للمجلس الطبي (SMC):</strong>
                            <span>موعد الامتحان يقترب. يضمن لك هذا التدريب العملي استيفاء الساعات السريرية ومنهاج MTC™ الدولي.</span>
                        </div>
                    </div>
                )}

                {matchedUni && (
                    <div className="p-3.5 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 text-cyan-200 text-xs flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-cyan-400" />
                            <span>مرحباً بك! انضم إلى زملائك الموثقين في السجل من <strong>{matchedUni.name.split('|')[0]}</strong></span>
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold">
                            {matchedUni.peers}
                        </span>
                    </div>
                )}
            </div>

            {/* 3. CONFIRMED MINTED STATE */}
            {minted ? (
                <div className="p-8 rounded-3xl bg-slate-900 border border-emerald-500/40 text-center space-y-4">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
                        ✓ تم تأكيد الحجز وإصدار المعرف بنجاح
                    </span>
                    <h3 className="text-4xl font-mono font-black text-cyan-400">{minted.gaId}</h3>
                    <p className="text-sm text-gray-300">{minted.name}</p>
                    <div className="p-3 rounded-xl bg-black/40 text-amber-300 font-mono text-xs">
                        الرصيد المودع: +{minted.gpBalance} GP · حقيبة التحول الرقمي والسيرة الذاتية مفعلة
                    </div>
                    
                    <button
                        type="button"
                        onClick={() => setShowKsaModal(true)}
                        className="px-5 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 text-xs font-bold transition-all inline-flex items-center gap-2"
                    >
                        <MessageSquare className="w-4 h-4" />
                        <span>طلب استشارة الترخيص والتسكين في السعودية (KSA Node) ➔</span>
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* ADAPTIVE SELECTORS */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                            <label className="block text-gray-300 mb-1">سنة التخرج / الدفعة</label>
                            <select value={gradYear} onChange={(e) => setGradYear(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white focus:border-cyan-400 focus:outline-none">
                                <option value="2026">2026 (دفعة الامتياز الحالية)</option>
                                <option value="2025">2025 (دفعة الامتياز)</option>
                                <option value="2024">2024 (طبيب مقيم / امتياز)</option>
                                <option value="2023">2023 (دفعة الأزمة)</option>
                                <option value="2022">2022 (طبيب عام / نائب)</option>
                                <option value="2020">2021 وما قبلها (أخصائي / استشاري)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-1">الموقع الجغرافي الحالي</label>
                            <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white focus:border-cyan-400 focus:outline-none">
                                <option value="Egypt">مصر (القاهرة / المحافظات)</option>
                                <option value="Sudan">السودان (بورتسودان / الولايات)</option>
                                <option value="Gulf">الخليج العربي (السعودية / الإمارات / قطر)</option>
                                <option value="UK_EU">المملكة المتحدة / أوروبا / أخرى</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-1">المسار المهني المستهدف</label>
                            <select value={track} onChange={(e) => setTrack(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white focus:border-cyan-400 focus:outline-none">
                                <option value="SMC">المجلس الطبي السوداني (SMC)</option>
                                <option value="SCFHS">البورد والترخيص السعودي (SCFHS / KSA)</option>
                                <option value="PLAB">الزمالة البريطانية (PLAB / UK-GMC)</option>
                                <option value="USMLE">المعادلة الأمريكية (USMLE)</option>
                            </select>
                        </div>
                    </div>

                    {/* CANDIDATE CONTACT INFO */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-gray-300 mb-1">الاسم الرباعي الرسمي *</label>
                            <input type="text" required placeholder="Dr. Firstname Lastname" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:border-cyan-400 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-300 mb-1">البريد الإلكتروني المهني *</label>
                            <input type="email" required placeholder="physician@hospital.edu" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:border-cyan-400 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-300 mb-1">رقم الواتساب للتأكيد الفوري *</label>
                            <input type="tel" required placeholder="+20 100 000 0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:border-cyan-400 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-300 mb-1">الجامعة / الكلية الطبية *</label>
                            <select value={selectedUni} onChange={(e) => setSelectedUni(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:border-cyan-400 focus:outline-none">
                                {UNIVERSITIES_WITH_COHORTS.map((u, i) => (
                                    <option key={i} value={u.name}>{u.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* 4. PROFESSIONAL ORDER SUMMARY RECEIPT BLOCK */}
                    <div className="p-5 rounded-2xl bg-black/60 border border-white/15 space-y-3">
                        <div className="flex items-center justify-between pb-2.5 border-b border-white/10 text-xs font-mono">
                            <span className="text-gray-400 uppercase tracking-wider">ORDER SUMMARY / ملخص الحجز</span>
                            <span className="text-cyan-400 font-bold">COHORT: AUG 28, 2026</span>
                        </div>
                        <div className="space-y-1.5 text-xs">
                            <div className="flex justify-between text-gray-300">
                                <span>1. الورشة السريرية للإنعاش القلبي (BLS Provider) — مركز د. صبري</span>
                                <span className="font-mono text-white">مشمول</span>
                            </div>
                            <div className="flex justify-between text-gray-300">
                                <span>2. توثيق المعرف الرقمي الدائم (GA-ID) ومنحة 200 GP — أكاديمية جيميني</span>
                                <span className="font-mono text-emerald-400">مشمول ($150 مجاناً)</span>
                            </div>
                            <div className="flex justify-between text-gray-300">
                                <span>3. حقيبة التحول الرقمي وهندسة السيرة الذاتية — حصرياً من Gene Academy</span>
                                <span className="font-mono text-purple-400">مشمول مجاناً</span>
                            </div>
                        </div>
                        <div className="pt-2.5 border-t border-white/10 flex items-center justify-between">
                            <span className="text-xs text-gray-300 font-bold">إجمالي الاستثمار السريري:</span>
                            <span className="text-lg font-mono font-black text-amber-400">3,000 ج.م</span>
                        </div>
                    </div>

                    {/* 5. PAYMENT METHOD TOGGLE */}
                    <div className="pt-2 space-y-4">
                        <label className="block text-xs text-gray-300 font-bold">اختر قناة السداد المعتمدة:</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div onClick={() => setPaymentMethod('VODAFONE')} className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between text-xs transition-all ${paymentMethod === 'VODAFONE' ? 'border-red-500 bg-red-500/10 text-red-300 font-bold' : 'border-white/10 bg-white/5 text-gray-400'}`}>
                                <span>فودافون كاش (Vodafone Cash — 3,000 EGP)</span>
                                {paymentMethod === 'VODAFONE' && <span>✓</span>}
                            </div>
                            <div onClick={() => setPaymentMethod('BANK')} className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between text-xs transition-all ${paymentMethod === 'BANK' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-bold' : 'border-white/10 bg-white/5 text-gray-400'}`}>
                                <span>تحويل بنكي / InstaPay / بنكك (WhatsApp Gate)</span>
                                {paymentMethod === 'BANK' && <span>✓</span>}
                            </div>
                        </div>

                        {paymentMethod === 'VODAFONE' ? (
                            <div className="p-3.5 rounded-2xl bg-red-500/5 border border-red-500/20 text-xs flex items-center justify-between">
                                <div>
                                    <span className="text-gray-300 block">رقم المحفظة الرسمي:</span>
                                    <strong className="text-white font-mono text-sm">01015922628</strong>
                                </div>
                                <span className="font-mono text-cyan-300 bg-black/60 px-3 py-1.5 rounded-lg">*9*7*01015922628*3000#</span>
                            </div>
                        ) : (
                            <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-xs space-y-2">
                                <span className="text-gray-300 block">أرسل إشعار التحويل البنكي إلى مكتب العمليات:</span>
                                <a href="https://wa.me/201015922628" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs">
                                    <span>مراسلة المكتب الأكاديمي (+20 101 592 2628) ➔</span>
                                </a>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs text-gray-300 mb-1">رقم العملية / الإشعار من الرسالة *</label>
                            <input type="text" required placeholder="TRX-XXXXXXXX أو رقم التحويل" value={form.providerRef} onChange={(e) => setForm({ ...form, providerRef: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none" />
                        </div>

                        {/* PROFESSIONAL CANCELLATION & REFUND POLICY */}
                        <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 text-[11px] text-gray-400 flex items-center gap-2 font-mono">
                            <Lock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            <span>🔒 معاملة آمنة. قابلة للاسترداد بنسبة 100% حتى 48 ساعة قبل موعد الجلسة السريرية. محمية ببروتوكولات كونسورتيوم سوداجين.</span>
                        </div>
                    </div>

                    {/* 6. THE 10% - 30% MEMBERSHIP UPSELL (THE GOLDEN HOOK) */}
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-900/20 to-slate-900 border border-amber-500/40 shadow-lg space-y-2">
                        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold font-mono">
                            <Zap className="w-4 h-4" />
                            <span>💡 هل أنت عضو مسجل في منظومة GemIInI؟</span>
                        </div>
                        <p className="text-xs text-gray-200 leading-relaxed">
                            قم بتفعيل ملفك الرقمي عبر <a href="https://dev-members.geneacademy.net" target="_blank" rel="noopener noreferrer" className="text-amber-300 underline font-bold">members.geneacademy.net</a> للحصول فوراً على <strong>خصم 10%</strong> على ورشة اليوم، والترقي في الرتب الأكاديمية لفتح <strong>خصومات تصل إلى 30%</strong> على كافة الدورات والامتحانات السريرية القادمة.
                        </p>
                    </div>

                    {error && (
                        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                            {error}
                        </div>
                    )}

                    <button type="submit" disabled={loading} className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 text-white font-black text-sm shadow-xl shadow-red-500/20 hover:opacity-95 transition-all">
                        {loading ? 'جارٍ تسجيل البيانات في السجل المركزي...' : 'تأكيد الحجز وإصدار المعرف برصيد 200 GP وبونص التحول الرقمي ➔'}
                    </button>
                </form>
            )}

            {/* POST-SUBMISSION INTERCEPT MODAL (KSA COMMUNITY HUB) */}
            {showKsaModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
                    <div className="bg-[#0A0F1D] border border-emerald-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 text-right relative">
                        <button
                            onClick={() => setShowKsaModal(false)}
                            className="absolute top-4 left-4 text-gray-400 hover:text-white text-sm font-mono"
                        >
                            ✕ إغلاق
                        </button>

                        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                <Globe className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">KSA LICENSING & RELOCATION INTERCEPT</span>
                                <h4 className="text-base font-bold text-white">تنسيق التراخيص والتسكين السريري بالسعودية</h4>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-black/50 border border-white/10 text-xs text-gray-300 space-y-2">
                            <p className="font-semibold text-white">
                                مرحباً د. {minted?.name || form.fullName} — تم تثبيت معرفك الرقمي ({minted?.gaId || 'GA-CONFIRMED'}).
                            </p>
                            <p className="text-emerald-300">
                                هل ترغب في الحصول على استشارة فورية أو مساعدة في تراخيص الهيئة السعودية للتخصصات الصحية (SCFHS) أو التسكين والتوظيف في مستشفيات المملكة؟
                            </p>
                        </div>

                        <form onSubmit={handleKsaSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs text-gray-300 mb-1">اكتب استفسارك لمكتب العمليات بالمملكة:</label>
                                <textarea
                                    rows="3"
                                    placeholder="مثال: أرغب في معرفة شروط امتحان البرومترك ونقل الترخيص إلى المستشفيات السعودية..."
                                    value={ksaQuestion}
                                    onChange={(e) => setKsaQuestion(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:border-emerald-400 focus:outline-none"
                                ></textarea>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-2"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                    <span>إرسال الاستفسار لمكتب السعودية عبر WhatsApp ➔</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowKsaModal(false)}
                                    className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs transition-all"
                                >
                                    لاحقاً
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SovereignGateway;
