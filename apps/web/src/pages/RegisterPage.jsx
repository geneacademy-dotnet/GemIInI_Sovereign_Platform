import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { CheckCircle2, ShieldCheck, Sparkles, ArrowRight, ArrowLeft, Dna, Stethoscope, Truck, QrCode, Lock, Clock, FileCheck, Copy, Check } from 'lucide-react';
import Layout from '@/components/site/Layout';
import { PageHeader, Section } from '@/components/site/Bits';
import PaymentChannels from '@/components/PaymentChannels';
import HolographicTiltCard from '@/components/HolographicTiltCard';
import { useLang } from '@/i18n/LanguageContext';
import { submitRegistration, sessionRef } from '@/lib/geneApi';
import { SOVEREIGN_ECOSYSTEM } from '@/data/sovereign-config';

const CANONICAL_UNIVERSITIES = [
    'جامعة الخرطوم - كلية الطب',
    'جامعة الجزيرة - كلية العلوم الطبية',
    'جامعة النيلين - كلية الطب',
    'جامعة النيل - كلية الطب والعلوم الصحية',
    'الجامعة الوطنية - مجمع الكليات الطبية',
    'جامعة الأحفاد للبنات - كلية الطب',
    'جامعة بحري - كلية الطب',
    'جامعة شندي - كلية الطب',
    'جامعة كسلا - كلية الطب',
    'جامعة البحر الأحمر - كلية الطب',
    'جامعة كردفان - كلية الطب',
    'جامعة الفاشر - كلية الطب',
    'جامعة الزعيم الأزهري - كلية الطب',
    'جامعة العلوم الطبية والتكنولوجيا (UMST)',
    'جامعة السودان للعلوم والتكنولوجيا (SUST)',
    'جامعة القاهرة - كلية طب قصر العيني (فرع الشتات)',
    'جامعة عين شمس - كلية الطب (الشريك الإقليمي)'
];

const TRACKS = [
    { 
        id: 'gemiini', 
        name: 'أكاديمية جيميني (GemIInI Academy) — الترخيص السريري', 
        nameEn: 'GemIInI Academy — Clinical Licensure Track',
        desc: 'SMC 1-8 • MRCS • USMLE Step 1/2CK • BSS-2 • German FSP', 
        icon: Stethoscope, 
        color: 'teal' 
    },
    { 
        id: 'gene', 
        name: 'أكاديمية الجينات (GeneAcademy) — الطب الجزيئي والأبحاث', 
        nameEn: 'GeneAcademy — Molecular Medicine & Research',
        desc: 'MM 1.0-8.0 • WES Diagnostics • The 100 Papers Project • 15:5:1 Mentorship', 
        icon: Dna, 
        color: 'purple' 
    },
    { 
        id: 'glomet', 
        name: 'مقر جلوميت (GLOMEt HQ) — البنية التحتية للمختبرات B2B', 
        nameEn: 'GLOMEt HQ — B2B Turnkey & Laboratory Infrastructure',
        desc: 'Turnkey Labs • 5-Part CBC Reagents • 40 Accredited Hospitals • CSR Grants', 
        icon: Truck, 
        color: 'amber' 
    }
];

const RegisterPage = () => {
    const { t, lang } = useLang();
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        fullName: '',
        fullNameEn: '',
        email: '',
        phone: '',
        university: CANONICAL_UNIVERSITIES[0],
        track: 'gemiini',
        tier: 'explorer',
        paymentMethod: 'bankak',
        paymentReference: ''
    });
    const [status, setStatus] = useState('idle');
    const [submissionTicket, setSubmissionTicket] = useState(null);
    const [copiedRef, setCopiedRef] = useState(false);

    const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

    const handleCompletePaymentAndSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!form.paymentReference.trim()) {
            setStatus('ref_required');
            return;
        }

        setStatus('loading');
        try {
            const ticketId = `REG-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
            const submissionPayload = {
                ...form,
                ticketId,
                status: 'pending_review'
            };

            await submitRegistration(submissionPayload);

            // Store temporary session reference
            sessionRef.set(ticketId);

            setSubmissionTicket({
                ticketId,
                fullName: form.fullName,
                fullNameEn: form.fullNameEn || form.fullName,
                email: form.email,
                university: form.university,
                track: form.track,
                paymentMethod: form.paymentMethod,
                paymentReference: form.paymentReference.trim(),
                amount: form.paymentMethod === 'bankak' ? '5,000 SDG' : '$5.00 USD / Vodafone',
                status: 'Under Verification',
                timestamp: new Date().toLocaleDateString(lang === 'ar' ? 'ar-SD' : 'en-US')
            });

            setStatus('submitted');
            setStep(4);
        } catch (err) {
            console.error('Registration submission error:', err);
            setStatus('error');
        }
    };

    return (
        <Layout>
            <Helmet>
                <title>Sovereign Identity Onboarding & Verification | SudaGene Consortium</title>
                <meta name="description" content="بوابة الانضمام السيادية المعتمدة: توثيق الهوية الأكاديمية، تسوية رسوم الدخول الرمزية، وتخصيص مساحة Google Workspace المشفرة." />
            </Helmet>

            <Section className="py-12 md:py-16">
                <div className="mx-auto max-w-2xl text-center mb-8">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-mono text-teal-600 font-bold uppercase tracking-wider mb-4">
                        <Sparkles className="w-3.5 h-3.5" /> 4-Step Sovereign Handshake Gateway
                    </span>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                        {lang === 'ar' ? 'بوابة الانضمام وإصدار الهوية السيادية' : 'Sovereign Identity & Onboarding Gateway'}
                    </h1>
                    <p className="mt-2 text-sm md:text-base text-slate-600">
                        {lang === 'ar' 
                            ? 'إصدار الهوية المعتمدة GA-ID • اعتماد الساعات الأوروبية ECTS • تخصيص مساحة الأبحاث السحابية.' 
                            : 'Mint cryptographic GA-ID • European ECTS accreditation • Provisioned cloud workspace.'}
                    </p>

                    {/* Step Indicators */}
                    <div className="flex items-center justify-center gap-2 mt-8">
                        {[1, 2, 3, 4].map((s) => (
                            <div
                                key={s}
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    step === s ? 'w-8 bg-teal-600' : step > s ? 'w-4 bg-emerald-500' : 'w-4 bg-slate-200'
                                }`}
                            />
                        ))}
                    </div>
                </div>

                <div className="mx-auto max-w-xl bg-white rounded-3xl border border-slate-200/80 p-6 md:p-10 shadow-xl">
                    
                    {/* STEP 1: Personal & Academic Identity */}
                    {step === 1 && (
                        <div className="space-y-5 text-right" dir="rtl">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-white text-xs">1</span>
                                <span>بيانات الهوية الأكاديمية والسريرية</span>
                            </h2>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">الاسم الكامل (باللغة العربية) *</label>
                                <input
                                    type="text"
                                    required
                                    value={form.fullName}
                                    onChange={update('fullName')}
                                    placeholder="د. أحمد عبد الرحمن محمد"
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name in English (For Sovereign Living CV) *</label>
                                <input
                                    type="text"
                                    required
                                    value={form.fullNameEn}
                                    onChange={update('fullNameEn')}
                                    placeholder="Dr. Ahmed Abdelrahman Mohamed"
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                                    dir="ltr"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">البريد الإلكتروني المهني (لاستلام مساحة Google Workspace) *</label>
                                <input
                                    type="email"
                                    required
                                    value={form.email}
                                    onChange={update('email')}
                                    placeholder="ahmed.doctor@gmail.com"
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                                    dir="ltr"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">رقم الهاتف / واتساب (للتوثيق السريع)</label>
                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={update('phone')}
                                    placeholder="+249 912 345 678 أو +20 101 234 5678"
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                                    dir="ltr"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">الكلية / الجامعة المعتمدة (من بين الجامعات الـ 54 المعترف بها)</label>
                                <select
                                    value={form.university}
                                    onChange={update('university')}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 bg-white"
                                >
                                    {CANONICAL_UNIVERSITIES.map((u) => (
                                        <option key={u} value={u}>{u}</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                onClick={() => form.fullName.trim() && form.email.trim() && setStep(2)}
                                disabled={!form.fullName.trim() || !form.email.trim()}
                                className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white py-3 text-sm font-bold transition-colors cursor-pointer mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <span>المتابعة إلى اختيار المسار الأكاديمي</span>
                                <ArrowLeft className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* STEP 2: Pillar Selection */}
                    {step === 2 && (
                        <div className="space-y-5 text-right" dir="rtl">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-white text-xs">2</span>
                                <span>اختر ركيزتك ومسارك التخصصي في المنظومة</span>
                            </h2>
                            <div className="space-y-3">
                                {TRACKS.map((t) => {
                                    const Icon = t.icon;
                                    const selected = form.track === t.id;
                                    return (
                                        <div
                                            key={t.id}
                                            onClick={() => setForm((p) => ({ ...p, track: t.id }))}
                                            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                                                selected ? 'border-teal-600 bg-teal-50/30 shadow-md' : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={`p-2.5 rounded-xl bg-white border border-slate-100 shadow-sm ${selected ? 'text-teal-600' : 'text-slate-500'}`}>
                                                    <Icon className="w-5 h-5" />
                                                </span>
                                                <div>
                                                    <h3 className="text-sm font-bold text-slate-900">{t.name}</h3>
                                                    <p className="text-xs text-slate-500 mt-0.5">{t.desc}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    onClick={() => setStep(1)}
                                    className="rounded-xl border border-slate-200 hover:bg-slate-50 px-5 py-3 text-sm font-bold text-slate-700"
                                >
                                    السابق
                                </button>
                                <button
                                    onClick={() => setStep(3)}
                                    className="flex-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white py-3 text-sm font-bold transition-colors flex items-center justify-center gap-2"
                                >
                                    <span>المتابعة لبوابة تسوية الرسوم والتوثيق</span>
                                    <ArrowLeft className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: "Two Cups of Coffee" Friction Gate & True Settlement Handshake */}
                    {step === 3 && (
                        <div className="space-y-5 text-right" dir="rtl">
                            <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 text-center">
                                <span className="text-xs font-mono font-bold text-amber-800 uppercase block mb-1">
                                    ☕ The "Two Cups of Coffee" Sovereign Access Gate
                                </span>
                                <p className="text-xs text-amber-900">
                                    رسوم رمزية قدرها <strong>5,000 SDG (~$5.00 USD / 20 SAR)</strong> لفلترة الجدية وتغطية تكاليف تشفير الهوية وسعة مساحة Google Workspace المخصصة.
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">الهوية المستهدفة:</span>
                                    <strong className="font-mono text-teal-700">GA-ID Cryptographic Card</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">رصيد الترحيب الفوري:</span>
                                    <strong className="font-mono text-amber-600">+500 GP Sovereign Bonus</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">المساحة السحابية المخصصة:</span>
                                    <strong className="text-emerald-700">Google Workspace Private Drive Folder ✓</strong>
                                </div>
                            </div>

                            {/* Payment Channel Details */}
                            <PaymentChannels compact />

                            {/* Settlement Handshake Inputs */}
                            <div className="border-t border-slate-200 pt-4 space-y-3">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                                    بيانات تسوية العملية المالية
                                </h3>

                                <div className="grid grid-cols-2 gap-3">
                                    <label className="block text-xs font-bold text-slate-700">
                                        قناة التحويل المستخدمة:
                                        <select
                                            value={form.paymentMethod}
                                            onChange={update('paymentMethod')}
                                            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white outline-none focus:border-teal-500"
                                        >
                                            <option value="bankak">تطبيق بنكك (GA-TREASURY-0000)</option>
                                            <option value="vodafone">فودافون كاش (+201015922628)</option>
                                            <option value="international">تحويل دولي / USD</option>
                                        </select>
                                    </label>

                                    <label className="block text-xs font-bold text-slate-700">
                                        رقم العملية / المرجع المالي: *
                                        <input
                                            type="text"
                                            required
                                            value={form.paymentReference}
                                            onChange={update('paymentReference')}
                                            placeholder="مثال: TX-98472918 أو رقم SMS"
                                            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono outline-none focus:border-teal-500"
                                        />
                                    </label>
                                </div>

                                {status === 'ref_required' && (
                                    <p className="text-xs font-bold text-red-600">
                                        ⚠️ يرجى إدخال رقم إشعار التحويل / المرجع المالي لإتمام الطلب.
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    onClick={() => setStep(2)}
                                    className="rounded-xl border border-slate-200 hover:bg-slate-50 px-5 py-3 text-sm font-bold text-slate-700"
                                >
                                    السابق
                                </button>
                                <button
                                    onClick={handleCompletePaymentAndSubmit}
                                    disabled={status === 'loading'}
                                    className="flex-1 rounded-xl bg-teal-600 hover:bg-teal-700 text-white py-3 text-sm font-bold transition-colors cursor-pointer shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {status === 'loading' ? (
                                        <span>جارٍ تسجيل المعاملة وتوثيق السجل...</span>
                                    ) : (
                                        <>
                                            <span>إرسال إشعار السداد وطلب تفعيل الهوية 🪪</span>
                                            <CheckCircle2 className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: Real Sovereign Handshake Submission Ticket */}
                    {step === 4 && submissionTicket && (
                        <div className="space-y-6 text-center">
                            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-1.5 text-xs font-bold">
                                <FileCheck className="w-4 h-4 text-emerald-600" />
                                <span>تم استلام طلب السداد وتسجيله في السجل السيادي بنجاح!</span>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-right space-y-3" dir="rtl">
                                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                                    <span className="text-xs font-bold text-slate-600">رقم تذكرة التسجيل:</span>
                                    <span className="font-mono font-bold text-teal-700 text-sm">{submissionTicket.ticketId}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-500">الاسم المعتمد:</span>
                                    <span className="font-bold text-slate-800">{submissionTicket.fullName}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-500">الجامعة:</span>
                                    <span className="font-bold text-slate-800">{submissionTicket.university}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-500">طريقة الدفع والمرجع:</span>
                                    <span className="font-mono text-slate-800">{submissionTicket.paymentMethod} — {submissionTicket.paymentReference}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-200">
                                    <span className="text-slate-500">حالة التفعيل:</span>
                                    <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full text-[11px]">
                                        <Clock className="w-3 h-3" /> قيد التحقق المالي وتخصيص Drive
                                    </span>
                                </div>
                            </div>

                            <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
                                تتم مراجعة الإيصال تلقائياً وربطه بحسابك. فور التأكيد، ستصلك رسالة التفعيل مع رابط مجلد <strong>Google Workspace Private Drive</strong> ورقم عضويتك السيادي <strong>GA-ID</strong>.
                            </p>

                            <div className="pt-2 flex flex-col gap-2.5">
                                <a
                                    href="/login"
                                    className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white py-3.5 text-sm font-bold transition-colors shadow-md block"
                                >
                                    تسجيل الدخول إلى البوابة الأكاديمية ←
                                </a>
                                <a
                                    href="/verify"
                                    className="text-xs text-teal-600 font-bold hover:underline"
                                >
                                    الاستعلام عن السجلات عبر بوابة التحقق العامة (Verify)
                                </a>
                            </div>
                        </div>
                    )}

                </div>
            </Section>
        </Layout>
    );
};

export default RegisterPage;
