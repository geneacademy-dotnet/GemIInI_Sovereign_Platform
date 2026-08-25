import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ShieldCheck, Award, Smartphone, CheckCircle2, Sparkles, Coffee, MessageCircle, CreditCard, Laptop, MapPin } from 'lucide-react';
import Layout from '@/components/site/Layout';
import { PageHeader, Section, StateBlock } from '@/components/site/Bits';
import { useLang } from '@/i18n/LanguageContext';
import { submitBlsRegistration } from '@/lib/geneApi';

const WORKSHOP_START = new Date('2026-08-28T09:00:00+02:00').getTime();

const useCountdown = (target) => {
    const [remaining, setRemaining] = useState(() => Math.max(0, target - Date.now()));
    useEffect(() => {
        const id = setInterval(() => setRemaining(Math.max(0, target - Date.now())), 1000);
        return () => clearInterval(id);
    }, [target]);
    const days = Math.floor(remaining / 86400000);
    const hours = Math.floor((remaining % 86400000) / 3600000);
    const mins = Math.floor((remaining % 3600000) / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    return { days, hours, mins, secs, ended: remaining <= 0 };
};

const CountdownBlock = ({ label, value }) => (
    <div className="rounded-xl border border-[hsl(var(--accent))]/30 bg-[hsl(var(--accent))]/10 p-3 text-center">
        <div className="font-mono text-3xl font-black text-white">{String(value).padStart(2, '0')}</div>
        <div className="mt-1 text-[10px] text-[hsl(var(--accent))]">{label}</div>
    </div>
);

const buildKsaWhatsappLink = ({ gaId, fullName }) => {
    const lines = [
        'Hi, I registered for the GemIInI BLS Program.',
        gaId ? `GA-ID: ${gaId}` : null,
        fullName ? `Name: ${fullName}` : null,
        'I have an inquiry regarding KSA licensing / SCFHS / relocation.',
    ].filter(Boolean);
    return `https://wa.me/966550476176?text=${encodeURIComponent(lines.join('\n'))}`;
};

const buildKuwaitWhatsappLink = ({ gaId, fullName }) => {
    const lines = [
        'مرحباً د. صفاء الحسن (مكتب الشؤون الأكاديمية - الكويت GA004)',
        'أرغب في الاستفسار عن شهادة BLS المعتمدة عبر المسار الإلكتروني (Online Accredited Track).',
        gaId ? `GA-ID: ${gaId}` : null,
        fullName ? `الاسم: ${fullName}` : null,
    ].filter(Boolean);
    return `https://wa.me/96550872572?text=${encodeURIComponent(lines.join('\n'))}`;
};

const REF_STORAGE_KEY = 'gemiini_referral_id';

const useReferralCapture = () => {
    const [searchParams] = useSearchParams();
    const [referralId, setReferralId] = useState(null);

    useEffect(() => {
        const fromUrl = searchParams.get('ref');
        if (fromUrl && /^GA-?\d{1,6}$/i.test(fromUrl.trim())) {
            const normalized = fromUrl.trim().toUpperCase();
            sessionStorage.setItem(REF_STORAGE_KEY, normalized);
            setReferralId(normalized);
            return;
        }
        const stored = sessionStorage.getItem(REF_STORAGE_KEY);
        if (stored) setReferralId(stored);
    }, [searchParams]);

    return referralId;
};

const inputClass = 'min-h-[44px] rounded-xl border border-input bg-card px-4 text-sm outline-none focus:border-[hsl(var(--accent))]';

const Field = ({ label, children, hint }) => (
    <label className="flex flex-col gap-2 text-sm">
        <span className="font-medium">{label}</span>
        {children}
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </label>
);

const WORKSHOP = {
    title: { en: 'Basic Life Support (BLS) Clinical Workshop', ar: 'ورشة الدعم الحياتي الأساسي (BLS) والاعتماد السريري' },
    date: 'August 28, 2026',
    location: { en: 'Dokki, Cairo (On-Site) + Online Gulf Track', ar: 'الدقي، القاهرة (تدريب حضوري) + المسار الإلكتروني المعتمد للخليج' },
    price: 3000,
};

const BlsWorkshopPage = () => {
    const { lang } = useLang();
    const referralId = useReferralCapture();
    const countdown = useCountdown(WORKSHOP_START);
    
    const [hasExistingId, setHasExistingId] = useState(false);
    const [existingGaId, setExistingGaId] = useState('');
    const [attendanceMode, setAttendanceMode] = useState('ONSITE'); // ONSITE | ONLINE_GULF
    const [paymentRail, setPaymentRail] = useState('VODAFONE'); // VODAFONE | BARQ | GP

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        transactionId: '',
        patronBooster: false
    });

    const [status, setStatus] = useState('idle');
    const [errors, setErrors] = useState({});
    const [result, setResult] = useState(null);

    const update = (key) => (e) =>
        setForm((prev) => ({ ...prev, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

    const onSubmit = async (event) => {
        event.preventDefault();
        const nextErrors = {};
        if (form.fullName.trim().length < 3) nextErrors.fullName = lang === 'ar' ? 'أدخل اسمك الكامل.' : 'Enter your full name.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = lang === 'ar' ? 'بريد إلكتروني غير صالح.' : 'Enter a valid email.';
        if (!form.phone.trim()) nextErrors.phone = lang === 'ar' ? 'أدخل رقم هاتفك.' : 'Enter your phone number.';
        
        if (paymentRail !== 'GP' && form.transactionId.trim().length < 4) {
            nextErrors.transactionId = lang === 'ar'
                ? 'أدخل رقم الإشعار أو مرجع التحويل.'
                : 'Enter the transaction ID or remittance reference.';
        }
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length) return;

        setStatus('loading');
        try {
            const payload = {
                workshop: attendanceMode === 'ONLINE_GULF' ? 'bls_online_gulf_track' : 'bls_dokki_2026_08_28',
                fullName: form.fullName.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                attendanceMode: attendanceMode,
                transactionId: paymentRail === 'GP' ? null : form.transactionId.trim(),
                gpApplied: paymentRail === 'GP',
                paymentMethod: paymentRail === 'BARQ' ? 'Barq (KSA)' : (paymentRail === 'GP' ? 'GP Points' : 'Vodafone Cash'),
                existingGaId: hasExistingId ? existingGaId.trim() : null,
                patronBooster: form.patronBooster,
                referralId: referralId || null,
            };
            const res = await submitBlsRegistration(payload);
            setResult(res);
            setStatus('done');
        } catch (err) {
            setStatus('error');
        }
    };

    return (
        <Layout>
            <Helmet>
                <title>{lang === 'ar' ? 'ورشة الدعم الحياتي الأساسي (BLS) والاعتماد السريري' : 'BLS Workshop & Clinical Certification'} | GemIInI Academy</title>
                <meta
                    name="description"
                    content="Basic Life Support workshop: On-site Dokki, Cairo + Online Accredited Track with Dr. Safaa Hassan (Kuwait Desk GA004). SMC and AHA accredited."
                />
            </Helmet>

            <PageHeader
                title={WORKSHOP.title[lang]}
                subtitle={`${WORKSHOP.date} · ${WORKSHOP.location[lang]}`}
            />

            <Section rail="max-w-[40rem]">
                {!countdown.ended && (
                    <div className="mb-8 grid grid-cols-4 gap-2">
                        <CountdownBlock label={lang === 'ar' ? 'أيام' : 'DAYS'} value={countdown.days} />
                        <CountdownBlock label={lang === 'ar' ? 'ساعات' : 'HRS'} value={countdown.hours} />
                        <CountdownBlock label={lang === 'ar' ? 'دقائق' : 'MIN'} value={countdown.mins} />
                        <CountdownBlock label={lang === 'ar' ? 'ثواني' : 'SEC'} value={countdown.secs} />
                    </div>
                )}
            </Section>

            <Section rail="max-w-[56rem]">
                {/* Accreditation + bonus banner */}
                <div className="mb-8 grid gap-4 sm:grid-cols-3">
                    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5">
                        <ShieldCheck className="h-6 w-6 text-[hsl(var(--teal))]" strokeWidth={1.8} />
                        <div>
                            <p className="text-sm font-semibold">SMC</p>
                            <p className="text-xs text-muted-foreground">{lang === 'ar' ? 'اعتماد المجلس الطبي' : 'SMC Accredited'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5">
                        <Award className="h-6 w-6 text-[hsl(var(--accent))]" strokeWidth={1.8} />
                        <div>
                            <p className="text-sm font-semibold">AHA</p>
                            <p className="text-xs text-muted-foreground">{lang === 'ar' ? 'جمعية القلب الأمريكية' : 'AHA Accredited'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-[hsl(var(--accent))]/40 bg-[hsl(var(--accent))]/8 p-5">
                        <Sparkles className="h-6 w-6 text-[hsl(var(--accent))]" strokeWidth={1.8} />
                        <div>
                            <p className="text-sm font-semibold">{lang === 'ar' ? 'مكافأة الأعضاء' : 'Member bonus'}</p>
                            <p className="text-xs text-muted-foreground">
                                {lang === 'ar' ? 'سيرة ذاتية احترافية — د. محمد صبري' : 'Pro CV module — Dr. Mohamed Sabri'}
                            </p>
                        </div>
                    </div>
                </div>

                {referralId && (
                    <div className="mb-6 rounded-xl border border-[hsl(var(--teal))]/40 bg-[hsl(var(--teal))]/10 px-4 py-3 text-sm">
                        {lang === 'ar' ? 'تمت الإحالة عبر' : 'Referred by'}: <strong>{referralId}</strong>
                    </div>
                )}

                {/* REGIONAL OPERATIONS & ACADEMIC DESKS */}
                <div className="mb-8 grid gap-4 sm:grid-cols-2">
                    {/* Kuwait Academic Desk - Online Accredited Track */}
                    <a
                        href={buildKuwaitWhatsappLink({ gaId: existingGaId, fullName: form.fullName })}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-3 rounded-2xl border border-[hsl(var(--teal))]/40 bg-[hsl(var(--teal))]/5 p-4 transition-all hover:border-[hsl(var(--teal))]"
                    >
                        <Laptop className="h-5 w-5 text-[hsl(var(--teal))] shrink-0 mt-0.5" strokeWidth={1.8} />
                        <div>
                            <p className="text-xs font-bold uppercase text-[hsl(var(--teal))]">
                                {lang === 'ar' ? 'مكتب الكويت والشؤون الأكاديمية (GA-004)' : 'Kuwait Academic Desk (GA-004)'}
                            </p>
                            <p className="text-sm font-semibold mt-0.5">
                                {lang === 'ar' ? 'د. صفاء الحسن — شهادات BLS أونلاين ومعتمدة' : 'Dr. Safaa Hassan — Online Accredited BLS'}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {lang === 'ar' ? 'واتساب مباشر: +965 5087 2572 للمسار الإلكتروني للخليج والمهجر' : 'Direct WhatsApp: +965 5087 2572 for Gulf & international online track'}
                            </p>
                        </div>
                    </a>

                    {/* KSA Operations Desk */}
                    <a
                        href={buildKsaWhatsappLink({ gaId: existingGaId, fullName: form.fullName })}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 transition-all hover:border-[hsl(var(--accent))]"
                    >
                        <MessageCircle className="h-5 w-5 text-[hsl(var(--accent))] shrink-0 mt-0.5" strokeWidth={1.8} />
                        <div>
                            <p className="text-xs font-bold uppercase text-[hsl(var(--accent))]">
                                {lang === 'ar' ? 'مكتب الرياض والعمليات الميدانية (KSA)' : 'Riyadh Operations Desk (KSA)'}
                            </p>
                            <p className="text-sm font-semibold mt-0.5">
                                {lang === 'ar' ? 'شؤون التراخيص السعودية (SCFHS) والتنسيب السريري' : 'Saudi Licensing (SCFHS) & Relocation'}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {lang === 'ar' ? 'واتساب: +966 55 047 6176 للمتابعة المباشرة' : 'WhatsApp: +966 55 047 6176 for direct coordination'}
                            </p>
                        </div>
                    </a>
                </div>

                {status === 'done' ? (
                    <div className="rounded-2xl border border-[hsl(var(--teal))]/50 bg-[hsl(var(--teal))]/10 p-7">
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="mt-0.5 h-6 w-6 text-[hsl(var(--teal))]" strokeWidth={1.8} />
                            <div>
                                <h2 className="font-display text-xl font-semibold">
                                    {lang === 'ar' ? 'تم استلام التسجيل بنجاح' : 'Registration received successfully'}
                                </h2>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {result?.isExistingMember 
                                        ? (lang === 'ar' ? `تم ربط الحجز بمعرفك المسجل: ${result?.gaId}` : `Linked to your existing member ID: ${result?.gaId}`)
                                        : (lang === 'ar' ? `رقمك المؤقت: ${result?.gaId || '—'} — الحالة: قيد التحقق من الدفع.` : `Provisional GA-ID: ${result?.gaId || '—'} — status: pending payment verification.`)}
                                </p>
                                {result?.unlockSabriCv && (
                                    <p className="mt-3 text-sm">
                                        {lang === 'ar'
                                            ? 'تم تفعيل وحدة السيرة الذاتية الاحترافية مع د. محمد صبري — سيصلك رابط الوصول عبر البريد بعد تأكيد الدفع.'
                                            : "Your Dr. Mohamed Sabri CV module is unlocked — access link arrives by email once payment is confirmed."}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Post-submission intercept: KSA / Kuwait Assistance */}
                        <div className="mt-6 rounded-xl border border-[hsl(var(--accent))]/30 bg-[hsl(var(--accent))]/8 p-5">
                            <p className="text-sm font-medium">
                                {lang === 'ar'
                                    ? 'هل تحتاج مساعدة في الترخيص أو التنسيب السريري أو المسار الإلكتروني المعتمد؟'
                                    : 'Need help with licensing, clinical placement, or the accredited online track?'}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-3">
                                <a
                                    href={buildKsaWhatsappLink({ gaId: result?.gaId, fullName: form.fullName })}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--accent))] px-4 py-2 text-sm font-medium text-black"
                                >
                                    <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
                                    {lang === 'ar' ? 'مكتب الرياض (KSA)' : 'Riyadh Desk (KSA)'}
                                </a>
                                <a
                                    href={buildKuwaitWhatsappLink({ gaId: result?.gaId, fullName: form.fullName })}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--teal))] px-4 py-2 text-sm font-medium text-black"
                                >
                                    <Laptop className="h-4 w-4" strokeWidth={1.8} />
                                    {lang === 'ar' ? 'مكتب الكويت (أونلاين GA004)' : 'Kuwait Desk (Online GA004)'}
                                </a>
                            </div>
                        </div>

                        {/* Community Activation Bounty */}
                        <div className="mt-4 rounded-xl border border-[hsl(var(--accent))]/50 bg-gradient-to-r from-[hsl(var(--accent))]/20 to-transparent p-5">
                            <h3 className="text-sm font-bold flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-[hsl(var(--accent))]" />
                                {lang === 'ar' ? 'اكتشف مكافأتك الأولى: +100 GP' : 'Unlock Your First Ecosystem Bounty: +100 GP'}
                            </h3>
                            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                                {lang === 'ar' 
                                    ? 'سجل الدخول إلى members.geneacademy.net باستخدام GA-ID الخاص بك، انضم إلى مجتمع BLS، وانشر تعريفاً مهنياً عن نفسك لتحصل فوراً على 100 نقطة إضافية.' 
                                    : 'Log into members.geneacademy.net using your GA-ID, join the BLS Clinical Community, and publish your first professional introduction to instantly receive +100 GP.'}
                            </p>
                            <a href="https://members.geneacademy.net/community" target="_blank" rel="noopener noreferrer" className="mt-3 inline-block font-mono text-xs font-bold text-[hsl(var(--accent))] hover:underline">
                                {lang === 'ar' ? 'المطالبة بالمكافأة ➔' : 'Claim Bounty ➔'}
                            </a>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
                        
                        {/* ATTENDANCE TRACK SELECTION */}
                        <div className="sm:col-span-2 rounded-2xl border border-border bg-card p-5 space-y-3">
                            <span className="text-sm font-semibold block">{lang === 'ar' ? 'اختر مسار الحضور المفضل:' : 'Select Attendance Track:'}</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                <div
                                    onClick={() => setAttendanceMode('ONSITE')}
                                    className={`p-4 rounded-xl border cursor-pointer flex items-start gap-3 transition-all ${attendanceMode === 'ONSITE' ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))]/10 font-bold' : 'border-border bg-card/50'}`}
                                >
                                    <MapPin className="h-5 w-5 text-[hsl(var(--accent))] shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm">{lang === 'ar' ? 'حضور سريري مباشر (الدقي، مصر)' : 'On-Site Clinical (Dokki, Cairo)'}</p>
                                        <p className="text-[11px] text-muted-foreground mt-0.5">{lang === 'ar' ? '28 أغسطس 2026 — تدريب عملي كامل مع د. محمد صبري' : 'Aug 28, 2026 — Hands-on training with Dr. Mohamed Sabri'}</p>
                                    </div>
                                </div>
                                <div
                                    onClick={() => setAttendanceMode('ONLINE_GULF')}
                                    className={`p-4 rounded-xl border cursor-pointer flex items-start gap-3 transition-all ${attendanceMode === 'ONLINE_GULF' ? 'border-[hsl(var(--teal))] bg-[hsl(var(--teal))]/10 font-bold text-[hsl(var(--teal))]' : 'border-border bg-card/50'}`}
                                >
                                    <Laptop className="h-5 w-5 text-[hsl(var(--teal))] shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm">{lang === 'ar' ? 'المسار الإلكتروني المعتمد (الكويت والخليج)' : 'Accredited Online Track (Kuwait & Gulf)'}</p>
                                        <p className="text-[11px] text-muted-foreground mt-0.5">{lang === 'ar' ? 'إشراف أكاديمي معتمد (د. صفاء الحسن GA004) لمن هم بالخارج' : 'Accredited remote track (Dr. Safaa Hassan GA004)'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* EXISTING MEMBER TOGGLE */}
                        <div className="sm:col-span-2 p-4 rounded-2xl border border-[hsl(var(--teal))]/30 bg-[hsl(var(--teal))]/5 flex flex-col gap-3">
                            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={hasExistingId}
                                    onChange={(e) => setHasExistingId(e.target.checked)}
                                    className="h-4 w-4 rounded border-border"
                                />
                                <span>{lang === 'ar' ? 'هل أنت عضو مسجل مسبقاً ولديك معرف رقمي (GA-ID)؟' : 'Already a registered member with an existing GA-ID?'}</span>
                            </label>
                            {hasExistingId && (
                                <div>
                                    <input
                                        type="text"
                                        placeholder="GA-XXXX (e.g. GA-001, GA-1234)"
                                        value={existingGaId}
                                        onChange={(e) => setExistingGaId(e.target.value)}
                                        className={inputClass + ' w-full font-mono uppercase text-xs'}
                                    />
                                    <span className="text-[11px] text-muted-foreground mt-1 block">
                                        {lang === 'ar' ? 'سيتم ربط تسجيلك بملفك الأكاديمي الحالي ورصيد نقاطك دون إصدار معرف جديد.' : 'Your registration will link to your existing profile and GP balance.'}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="sm:col-span-2">
                            <Field label={lang === 'ar' ? 'الاسم الكامل' : 'Full name'}>
                                <input value={form.fullName} onChange={update('fullName')} className={inputClass} />
                            </Field>
                            {errors.fullName && <p className="mt-1.5 text-xs text-destructive">{errors.fullName}</p>}
                        </div>
                        <div>
                            <Field label={lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}>
                                <input type="email" value={form.email} onChange={update('email')} className={inputClass} />
                            </Field>
                            {errors.email && <p className="mt-1.5 text-xs text-destructive">{errors.email}</p>}
                        </div>
                        <div>
                            <Field label={lang === 'ar' ? 'رقم الهاتف (WhatsApp)' : 'Phone (WhatsApp)'}>
                                <input value={form.phone} onChange={update('phone')} className={inputClass} />
                            </Field>
                            {errors.phone && <p className="mt-1.5 text-xs text-destructive">{errors.phone}</p>}
                        </div>

                        {/* PAYMENT CHANNELS SELECTION */}
                        <div className="sm:col-span-2 rounded-2xl border border-border bg-card p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <CreditCard className="h-5 w-5 text-[hsl(var(--accent))]" strokeWidth={1.8} />
                                <h3 className="font-display text-lg font-semibold">
                                    {lang === 'ar' ? 'طريقة السداد المعتمدة (3,000 ج.م)' : 'Select Payment Method (EGP 3,000)'}
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                <div
                                    onClick={() => setPaymentRail('VODAFONE')}
                                    className={`p-4 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${paymentRail === 'VODAFONE' ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))]/10 font-bold' : 'border-border bg-card/50'}`}
                                >
                                    <span>{lang === 'ar' ? 'فودافون كاش (مصر)' : 'Vodafone Cash (Egypt)'}</span>
                                    <span className="font-mono text-[10px] text-muted-foreground mt-1">01015922628</span>
                                </div>

                                <div
                                    onClick={() => setPaymentRail('BARQ')}
                                    className={`p-4 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${paymentRail === 'BARQ' ? 'border-[hsl(var(--teal))] bg-[hsl(var(--teal))]/10 font-bold text-[hsl(var(--teal))]' : 'border-border bg-card/50'}`}
                                >
                                    <span>{lang === 'ar' ? 'برق / تحويل من السعودية (KSA)' : 'Barq / KSA Remittance'}</span>
                                    <span className="font-mono text-[10px] mt-1">+20 101 592 2628</span>
                                </div>

                                <div
                                    onClick={() => setPaymentRail('GP')}
                                    className={`p-4 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${paymentRail === 'GP' ? 'border-purple-500 bg-purple-500/10 font-bold text-purple-300' : 'border-border bg-card/50'}`}
                                >
                                    <span>{lang === 'ar' ? 'نقاط GemIInI (GP)' : 'GemIInI Points (GP)'}</span>
                                    <span className="text-[10px] text-muted-foreground mt-1">{lang === 'ar' ? 'للأعضاء المسجلين' : 'For Members'}</span>
                                </div>
                            </div>

                            {paymentRail === 'VODAFONE' && (
                                <div className="p-3.5 rounded-xl bg-card border border-border text-xs space-y-1">
                                    <p className="text-muted-foreground">
                                        {lang === 'ar'
                                            ? 'حوّل المبلغ (3,000 ج.م) إلى محفظة فودافون كاش الرسمية:'
                                            : 'Transfer EGP 3,000 to the official Vodafone Cash wallet:'}
                                    </p>
                                    <p className="font-mono text-sm font-bold text-white">01015922628</p>
                                </div>
                            )}

                            {paymentRail === 'BARQ' && (
                                <div className="p-3.5 rounded-xl bg-[hsl(var(--teal))]/10 border border-[hsl(var(--teal))]/30 text-xs space-y-2">
                                    <p className="text-white font-semibold">
                                        {lang === 'ar'
                                            ? 'التحويل عبر تطبيق برق (Barq) أو الحوالات السريعة من السعودية والخليج:'
                                            : 'Transfer via Barq app or instant remittance from Saudi Arabia / Gulf:'}
                                    </p>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {lang === 'ar'
                                            ? 'أرسل الحوالة ثم أرسل صورة الإشعار مباشرة إلى WhatsApp مكتب العمليات الأكاديمي:'
                                            : 'Complete transfer and send receipt to the Academic Operations WhatsApp:'}
                                    </p>
                                    <a
                                        href="https://wa.me/201015922628?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D9%85%D9%83%D8%AA%D8%A8%20%D8%A7%D9%84%D8%B9%D9%85%D9%84%D9%8A%D8%A7%D8%AA%D8%8C%20%D9%87%D8%B0%D8%A7%20%D8%A5%D8%B4%D8%B9%D8%A7%D8%B1%20%D8%AA%D8%AD%D9%88%D9%8A%D9%84%20%D8%A8%D8%B1%D9%82%20(Barq)%20%D9%84%D9%88%D8%B1%D8%B4%D8%A9%20BLS."
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[hsl(var(--teal))] text-black font-bold text-xs"
                                    >
                                        <MessageCircle className="h-3.5 w-3.5" />
                                        <span>إرسال إشعار برق عبر WhatsApp (+20 101 592 2628) ➔</span>
                                    </a>
                                </div>
                            )}

                            {paymentRail !== 'GP' && (
                                <div>
                                    <Field
                                        label={lang === 'ar' ? 'رقم العملية / المرجع (Transaction ID)' : 'Transaction ID / Reference Number'}
                                        hint={lang === 'ar' ? 'أدخل رقم المعاملة من رسالة فودافون كاش أو إشعار تحويل تطبيق برق.' : 'As shown in your confirmation SMS or Barq remittance receipt.'}
                                    >
                                        <input value={form.transactionId} onChange={update('transactionId')} className={inputClass} />
                                    </Field>
                                    {errors.transactionId && <p className="mt-1.5 text-xs text-destructive">{errors.transactionId}</p>}
                                </div>
                            )}
                        </div>

                        {/* Optional patron contribution */}
                        <label className="sm:col-span-2 flex items-start gap-3 rounded-2xl border border-[hsl(var(--accent))]/30 bg-[hsl(var(--accent))]/8 p-4 cursor-pointer">
                            <input type="checkbox" checked={form.patronBooster} onChange={update('patronBooster')} className="mt-0.5 h-4 w-4" />
                            <span className="flex items-start gap-2">
                                <Coffee className="mt-0.5 h-4 w-4 text-[hsl(var(--accent))]" strokeWidth={1.8} />
                                <span>
                                    <span className="block text-sm font-semibold">
                                        {lang === 'ar' ? 'مساهمة داعم (اختياري) — 250 جنيه مصري' : 'Patron contribution (optional) — EGP 250'}
                                    </span>
                                    <span className="block text-xs text-muted-foreground">
                                        {lang === 'ar'
                                            ? 'يسرّع مراجعة وتأكيد تسجيلك يدوياً.'
                                            : "Expedites the manual review of your registration."}
                                    </span>
                                </span>
                            </span>
                        </label>

                        {status === 'error' && (
                            <div className="sm:col-span-2">
                                <StateBlock kind="error" />
                            </div>
                        )}

                        <div className="sm:col-span-2">
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="min-h-[48px] w-full rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-60 sm:w-auto"
                            >
                                {status === 'loading'
                                    ? (lang === 'ar' ? 'جارٍ تسجيل البيانات...' : 'Submitting...')
                                    : (lang === 'ar' ? 'تأكيد الحجز والتسجيل' : 'Confirm Registration')}
                            </button>
                        </div>
                    </form>
                )}
            </Section>
        </Layout>
    );
};

export default BlsWorkshopPage;
