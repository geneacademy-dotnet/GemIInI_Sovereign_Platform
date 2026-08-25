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
    CheckSquare,
    Square
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
    const [patronActive, setPatronActive] = useState(false);

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        providerRef: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [minted, setMinted] = useState(null);

    const isDisruptedCohort = parseInt(gradYear) >= 2022 && parseInt(gradYear) <= 2026 && location === 'Egypt';
    const isSmcUrgent = track === 'SMC';
    const matchedUni = UNIVERSITIES_WITH_COHORTS.find(u => u.name === selectedUni);

    const calculatedGp = patronActive ? 250 : 200;
    const feeAmount = patronActive ? 3250 : 3000;

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
                action: 'bls_registration',
                fullName: form.fullName.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                university: selectedUni,
                gradYear: gradYear,
                location: location,
                track: track,
                paymentMethod: paymentMethod,
                boughtCoffee: patronActive,
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
                    sabriBonusUnlocked: true
                };

                localStorage.setItem('gemiini_presence_id', gaId);
                localStorage.setItem('gemiini_member_profile', JSON.stringify(finalData));

                setMinted(finalData);
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

    return (
        <div id="sovereign-intake" className="p-6 sm:p-10 rounded-3xl bg-[#080C14] border border-cyan-500/20 shadow-2xl space-y-8 max-w-3xl mx-auto">
            
            <div className="text-center space-y-2">
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold">
                    ADAPTIVE CLINICAL INTAKE GATEWAY
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                    بوابة التنسيق السريري وتوثيق المعرف الرقمي (GA-ID)
                </h3>
                <p className="text-xs text-gray-400">
                    النظام يتكيف تلقائياً مع دفعتك وجامعتك لربطك بمسار الاعتماد الدولي.
                </p>
            </div>

            {/* CONDITIONAL REACTIVE BANNERS */}
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

            {minted ? (
                <div className="p-8 rounded-3xl bg-slate-900 border border-emerald-500/40 text-center space-y-4">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
                        ✓ تم تأكيد الحجز وإصدار المعرف بنجاح
                    </span>
                    <h3 className="text-4xl font-mono font-black text-cyan-400">{minted.gaId}</h3>
                    <p className="text-sm text-gray-300">{minted.name}</p>
                    <div className="p-3 rounded-xl bg-black/40 text-amber-300 font-mono text-xs">
                        الرصيد المودع: +{minted.gpBalance} GP · بونص د. صبري مفعل
                    </div>
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
                                <option value="PLAB">الزمالة البريطانية (PLAB / UK-GMC)</option>
                                <option value="USMLE">المعادلة الأمريكية (USMLE)</option>
                                <option value="SCFHS">البورد والترخيص السعودي / الخليجي</option>
                            </select>
                        </div>
                    </div>

                    {/* CANDIDATE INFO */}
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

                    {/* PAYMENT METHOD TOGGLE */}
                    <div className="pt-4 border-t border-white/10 space-y-4">
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
                    </div>

                    {/* PATRON BOOSTER */}
                    <div onClick={() => setPatronActive(!patronActive)} className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${patronActive ? 'border-amber-400 bg-amber-950/40' : 'border-white/10 bg-white/5'}`}>
                        <div className="flex items-center gap-3">
                            {patronActive ? <CheckSquare className="w-5 h-5 text-amber-400" /> : <Square className="w-5 h-5 text-gray-400" />}
                            <div>
                                <strong className="text-xs text-white block">باقة راعي الكونسورتيوم (+50 GP / 250 EGP)</strong>
                                <span className="text-[11px] text-amber-300">تسريع التدقيق وإضافة +50 GP فورية (إجمالي 250 GP)!</span>
                            </div>
                        </div>
                        <span className="font-mono text-xs text-amber-300 font-bold">{patronActive ? '250 GP' : '+50 GP'}</span>
                    </div>

                    {error && (
                        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                            {error}
                        </div>
                    )}

                    <button type="submit" disabled={loading} className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 text-white font-black text-sm shadow-xl shadow-red-500/20 hover:opacity-95 transition-all">
                        {loading ? 'جارٍ تسجيل البيانات في السجل المركزي...' : `تأكيد الحجز وإصدار المعرف برصيد ${calculatedGp} GP وبونص د. صبري ➔`}
                    </button>
                </form>
            )}
        </div>
    );
};

export default SovereignGateway;
