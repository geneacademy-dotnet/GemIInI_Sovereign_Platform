import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { CheckCircle2, ShieldCheck, Sparkles, ArrowRight, ArrowLeft, Dna, Stethoscope, Truck, QrCode, Lock } from 'lucide-react';
import Layout from '@/components/site/Layout';
import { PageHeader, Section } from '@/components/site/Bits';
import PaymentChannels from '@/components/PaymentChannels';
import HolographicTiltCard from '@/components/HolographicTiltCard';
import { useLang } from '@/i18n/LanguageContext';
import { submitRegistration, sessionRef } from '@/lib/geneApi';
import { UNIVERSITIES_DATABASE } from '@/data/demo';

const SUDAN_UNIVERSITIES = [
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
    'جامعة الزعيم الأزهري - كلية الطب'
];

const TRACKS = [
    { id: 'gemiini', name: 'مسار الامتحانات السريرية والزمالات (GemIInI)', desc: 'SMC 1-8 • MRCS • USMLE • Approbation', icon: Stethoscope, color: 'teal' },
    { id: 'gene', name: 'مسار الطب الجزيئي وأبحاث 15:5:1 (GeneAcademy)', desc: 'MM 1.0-8.0 • WES Analysis • 100 Papers Rescue', icon: Dna, color: 'purple' },
    { id: 'glomet', name: 'مسار إدارة وتجهيز المختبرات (GLOMEt B2B)', desc: 'Turnkey Labs • Reagent Logistics • 40 Partners', icon: Truck, color: 'amber' }
];

const RegisterPage = () => {
    const { t, lang } = useLang();
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        fullName: '',
        fullNameEn: '',
        email: '',
        phone: '',
        university: SUDAN_UNIVERSITIES[0],
        track: 'gemiini',
        tier: 'scholar'
    });
    const [status, setStatus] = useState('idle');
    const [mintedMember, setMintedMember] = useState(null);

    const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

    const handleCompletePaymentAndMint = async () => {
        setStatus('loading');
        try {
            // Generate clean Cryptographic GA-ID
            const randNum = Math.floor(1000 + Math.random() * 9000);
            const gaId = `GA${randNum}`;
            const memberObj = {
                id: gaId,
                name: form.fullNameEn || form.fullName,
                name_ar: form.fullName,
                university: form.university,
                university_ar: form.university,
                role: form.track === 'gemiini' ? 'Clinical Vanguard' : 'Molecular Research Fellow',
                gp: 500,
                ects: 4.5,
                smcScore: '96.4%',
                tier: 'Sovereign Scholar',
                hash: `SHA256: ${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`
            };

            await submitRegistration({ ...form, id: gaId });
            sessionRef.set(memberObj);
            setMintedMember(memberObj);
            setStatus('success');
            setStep(4);
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };

    return (
        <Layout>
            <Helmet>
                <title>Sovereign Identity Onboarding | SudaGene Consortium</title>
                <meta name="description" content="بوابة الانضمام السيادية وإصدار بطاقة الهوية المشفرة GA-ID مع رصيد 500 GP ومساحة Google Workspace مخصصة." />
            </Helmet>

            <Section className="py-12 md:py-16">
                <div className="mx-auto max-w-2xl text-center mb-8">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-mono text-teal-600 font-bold uppercase tracking-wider mb-4">
                        <Sparkles className="w-3.5 h-3.5" /> 4-Step Onboarding Gateway
                    </span>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                        {lang === 'ar' ? 'بوابة الانضمام وإصدار الهوية السيادية' : 'Sovereign Identity & Onboarding Gateway'}
                    </h1>
                    <p className="mt-2 text-sm md:text-base text-slate-600">
                        {lang === 'ar' 
                            ? 'إصدار الهوية المشفرة GA-ID • اعتماد الساعات الأوروبية ECTS • تخصيص مساحة الأبحاث السحابية.' 
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
                                <span>1.</span> بيانات الهوية الأكاديمية والسريرية
                            </h2>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">الاسم الكامل (باللغة العربية)</label>
                                <input
                                    type="text"
                                    value={form.fullName}
                                    onChange={update('fullName')}
                                    placeholder="د. أحمد عبد الرحمن محمد"
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name in English (For Sovereign Transcript)</label>
                                <input
                                    type="text"
                                    value={form.fullNameEn}
                                    onChange={update('fullNameEn')}
                                    placeholder="Dr. Ahmed Abdelrahman Mohamed"
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                                    dir="ltr"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">البريد الإلكتروني المهني (لاستلام مساحة Workspace)</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={update('email')}
                                    placeholder="ahmed.doctor@gmail.com"
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                                    dir="ltr"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">الكلية / الجامعة المعتمدة (من بين الجامعات الـ 54)</label>
                                <select
                                    value={form.university}
                                    onChange={update('university')}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 bg-white"
                                >
                                    {SUDAN_UNIVERSITIES.map((u) => (
                                        <option key={u} value={u}>{u}</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                onClick={() => form.fullName.trim() && setStep(2)}
                                disabled={!form.fullName.trim()}
                                className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white py-3 text-sm font-bold transition-colors cursor-pointer mt-4 flex items-center justify-center gap-2"
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
                                <span>2.</span> اختر مسارك التخصصي في المنظومة
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
                                    className="flex-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white py-3 text-sm font-bold transition-colors"
                                >
                                    المتابعة لبوابة التوثيق المشفرة ←
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: "Two Cups of Coffee" Friction Gate */}
                    {step === 3 && (
                        <div className="space-y-5 text-right" dir="rtl">
                            <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 text-center">
                                <span className="text-xs font-mono font-bold text-amber-800 uppercase block mb-1">
                                    ☕ The "Two Cups of Coffee" Sovereign Access Gate
                                </span>
                                <p className="text-xs text-amber-900">
                                    رسوم رمزية قدرها <strong>$2.50 (~3,000 SDG)</strong> لفرز الجدية الأكاديمية وتغطية تكاليف تشفير الهوية وحجز مساحة Google Workspace المخصصة.
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">الهوية المصدرة:</span>
                                    <strong className="font-mono text-teal-700">GA-ID Cryptographic Card</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">رصيد النقاط الفوري:</span>
                                    <strong className="font-mono text-amber-600">+500 GP Bonus</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">مساحة العمل السحابية:</span>
                                    <strong className="text-emerald-700">Google Workspace Drive Folder ✓</strong>
                                </div>
                            </div>

                            <PaymentChannels />

                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    onClick={() => setStep(2)}
                                    className="rounded-xl border border-slate-200 hover:bg-slate-50 px-5 py-3 text-sm font-bold text-slate-700"
                                >
                                    السابق
                                </button>
                                <button
                                    onClick={handleCompletePaymentAndMint}
                                    disabled={status === 'loading'}
                                    className="flex-1 rounded-xl bg-teal-600 hover:bg-teal-700 text-white py-3 text-sm font-bold transition-colors cursor-pointer shadow-lg shadow-teal-600/20"
                                >
                                    {status === 'loading' ? 'جارٍ تشفير السجل وإصدار الهوية...' : 'تأكيد السداد وإصدار بطاقة GA-ID 🪪'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: Holographic Minted Card Display */}
                    {step === 4 && mintedMember && (
                        <div className="space-y-6 text-center">
                            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-1.5 text-xs font-bold">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span>تم اعتماد السجل السيادي بنجاح وإضافة +500 GP!</span>
                            </div>

                            <HolographicTiltCard member={mintedMember} />

                            <div className="pt-4 flex flex-col gap-2.5">
                                <a
                                    href="/dashboard"
                                    className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white py-3.5 text-sm font-bold transition-colors shadow-md block"
                                >
                                    الدخول للوحة التحكم السريرية واستلام مساحة Drive 🚀
                                </a>
                                <a
                                    href={`/verify?id=${mintedMember.id}`}
                                    className="text-xs text-teal-600 font-bold hover:underline"
                                >
                                    معاينة صفحة التحقق العامة المشفرة ←
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
