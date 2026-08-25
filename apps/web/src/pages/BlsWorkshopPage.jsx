import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ShieldCheck, Award, Smartphone, CheckCircle2, Sparkles, Coffee, MessageCircle } from 'lucide-react';
import Layout from '@/components/site/Layout';
import { PageHeader, Section, StateBlock } from '@/components/site/Bits';
import { useLang } from '@/i18n/LanguageContext';
import { submitBlsRegistration } from '@/lib/geneApi';

// ---------------------------------------------------------------------------
// Countdown to the workshop start. Pure client-side timer, no claims about
// data — safe to ship without separate verification.
// ---------------------------------------------------------------------------
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
        'Hi, I just registered for the BLS workshop.',
        gaId ? `GA-ID: ${gaId}` : null,
        fullName ? `Name: ${fullName}` : null,
        'I have a question about KSA licensing / relocation / clinical placement.',
    ].filter(Boolean);
    return `https://wa.me/966550476176?text=${encodeURIComponent(lines.join('\n'))}`;
};

// ---------------------------------------------------------------------------
// STEP 1: Referral capture.
// Reads ?ref=GA-000 from the URL (e.g. geneacademy.net/bls?ref=GA-000),
// validates the shape loosely (doesn't hit the backend to confirm the ID is
// real — that check belongs server-side), and persists it in
// sessionStorage so it survives a page reload before the user submits the
// form. Falls back to any previously-captured ref if the current URL has
// none, so a referral isn't lost if the user navigates around the site
// before registering.
// ---------------------------------------------------------------------------
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
    title: { en: 'Basic Life Support (BLS) Workshop', ar: 'ورشة الدعم الحياتي الأساسي (BLS)' },
    date: 'August 28, 2026',
    location: { en: 'Dokki, Cairo, Egypt', ar: 'الدقي، القاهرة، مصر' },
    price: 3000, // EGP — fixed on the client for display only; the source of
                 // truth for the charge is your own Vodafone merchant
                 // account, never a value posted from the browser.
};

const BlsWorkshopPage = () => {
    const { lang } = useLang();
    const referralId = useReferralCapture();
    const countdown = useCountdown(WORKSHOP_START);
    const [form, setForm] = useState({ fullName: '', email: '', phone: '', transactionId: '', gpApplied: false, patronBooster: false });
    const [status, setStatus] = useState('idle'); // idle | loading | done | error
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
        if (!form.gpApplied && form.transactionId.trim().length < 4) {
            nextErrors.transactionId = lang === 'ar'
                ? 'أدخل رقم عملية Vodafone Cash.'
                : 'Enter the Vodafone Cash transaction ID.';
        }
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length) return;

        setStatus('loading');
        try {
            const payload = {
                workshop: 'bls_dokki_2026_08_28',
                fullName: form.fullName.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                transactionId: form.gpApplied ? null : form.transactionId.trim(),
                gpApplied: form.gpApplied,
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
                <title>{lang === 'ar' ? 'ورشة الدعم الحياتي الأساسي — الدقي' : 'BLS Workshop — Dokki, Cairo'} | GemIInI Academy</title>
                <meta
                    name="description"
                    content="Basic Life Support workshop, Dokki, Cairo — August 28, 2026. SMC and AHA accredited. GemIInI members bonus: personalized CV module with Dr. Mohamed Sabri."
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
                            <p className="text-xs text-muted-foreground">{lang === 'ar' ? 'معتمد' : 'Accredited'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5">
                        <Award className="h-6 w-6 text-[hsl(var(--accent))]" strokeWidth={1.8} />
                        <div>
                            <p className="text-sm font-semibold">AHA</p>
                            <p className="text-xs text-muted-foreground">{lang === 'ar' ? 'معتمد' : 'Accredited'}</p>
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

                <a
                    href="https://wa.me/966550476176"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mb-6 flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm transition-colors hover:border-[hsl(var(--teal))]/50"
                >
                    <MessageCircle className="h-5 w-5 text-[hsl(var(--teal))]" strokeWidth={1.8} />
                    <span>
                        {lang === 'ar'
                            ? 'لديك استفسار بخصوص الترخيص أو الانتقال إلى السعودية؟ راسل مكتبنا في الرياض'
                            : 'Questions about KSA licensing or relocation? Message our Riyadh desk'}
                    </span>
                </a>

                {status === 'done' ? (
                    <div className="rounded-2xl border border-[hsl(var(--teal))]/50 bg-[hsl(var(--teal))]/10 p-7">
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="mt-0.5 h-6 w-6 text-[hsl(var(--teal))]" strokeWidth={1.8} />
                            <div>
                                <h2 className="font-display text-xl font-semibold">
                                    {lang === 'ar' ? 'تم استلام التسجيل' : 'Registration received'}
                                </h2>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {lang === 'ar'
                                        ? `رقمك المؤقت: ${result?.gaId || '—'} — الحالة: قيد التحقق من الدفع.`
                                        : `Provisional GA-ID: ${result?.gaId || '—'} — status: pending payment verification.`}
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

                        {/* Post-submission intercept: offers KSA assistance before the
                            user leaves, with the just-minted context pre-filled into
                            the WhatsApp message. Only appears after a real
                            registration exists — never fabricates a GA-ID to show it. */}
                        <div className="mt-6 rounded-xl border border-[hsl(var(--accent))]/30 bg-[hsl(var(--accent))]/8 p-5">
                            <p className="text-sm font-medium">
                                {lang === 'ar'
                                    ? 'هل تحتاج مساعدة في الترخيص أو الانتقال أو التنسيب السريري في السعودية؟'
                                    : 'Need help with KSA licensing, relocation, or clinical placement?'}
                            </p>
                            <a
                                href={buildKsaWhatsappLink({ gaId: result?.gaId, fullName: form.fullName })}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--accent))] px-4 py-2 text-sm font-medium text-black"
                            >
                                <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
                                {lang === 'ar' ? 'راسل مكتب الرياض' : 'Message the Riyadh desk'}
                            </a>
                        </div>

                        {/* Community Activation Bounty */}
                        <div className="mt-4 rounded-xl border border-[hsl(var(--accent))]/50 bg-gradient-to-r from-[hsl(var(--accent))]/20 to-transparent p-5">
                            <h3 className="text-sm font-bold flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-[hsl(var(--accent))]" />
                                {lang === 'ar' ? 'اكتشف مكافأتك الأولى: +100 GP' : 'Unlock Your First Ecosystem Bounty: +100 GP'}
                            </h3>
                            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                                {lang === 'ar' 
                                    ? 'سجل الدخول إلى members.geneacademy.net باستخدام GA-ID الجديد الخاص بك، انضم إلى مجتمع BLS، وانشر تعريفاً مهنياً عن نفسك لتحصل فوراً على 100 نقطة إضافية.' 
                                    : 'Log into members.geneacademy.net using your new GA-ID, join the BLS Clinical Community, and publish your first professional introduction to instantly receive +100 GP.'}
                            </p>
                            <a href="https://members.geneacademy.net/community" target="_blank" rel="noopener noreferrer" className="mt-3 inline-block font-mono text-xs font-bold text-[hsl(var(--accent))] hover:underline">
                                {lang === 'ar' ? 'المطالبة بالمكافأة ➔' : 'Claim Bounty ➔'}
                            </a>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
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
                            <Field label={lang === 'ar' ? 'رقم الهاتف' : 'Phone'}>
                                <input value={form.phone} onChange={update('phone')} className={inputClass} />
                            </Field>
                            {errors.phone && <p className="mt-1.5 text-xs text-destructive">{errors.phone}</p>}
                        </div>

                        {/* Vodafone Cash intake */}
                        <div className="sm:col-span-2 rounded-2xl border border-border bg-card p-6">
                            <div className="mb-4 flex items-center gap-3">
                                <Smartphone className="h-5 w-5 text-[hsl(var(--accent))]" strokeWidth={1.8} />
                                <h3 className="font-display text-lg font-semibold">
                                    {lang === 'ar' ? 'الدفع عبر Vodafone Cash' : 'Pay via Vodafone Cash'}
                                </h3>
                            </div>
                            <p className="mb-4 text-sm text-muted-foreground">
                                {lang === 'ar'
                                    ? `المبلغ: ${WORKSHOP.price} جنيه مصري. أرسل المبلغ ثم أدخل رقم العملية بالأسفل.`
                                    : `Amount: EGP ${WORKSHOP.price}. Send the payment, then enter the transaction ID below.`}
                            </p>
                            <label className="mb-4 flex items-center gap-2 text-sm">
                                <input type="checkbox" checked={form.gpApplied} onChange={update('gpApplied')} />
                                {lang === 'ar' ? 'أستخدم نقاط GemIInI (GP) بدلاً من الدفع النقدي' : 'Applying GemIInI Points (GP) instead of cash'}
                            </label>
                            {!form.gpApplied && (
                                <>
                                    <Field
                                        label={lang === 'ar' ? 'رقم عملية Vodafone Cash' : 'Vodafone Cash Transaction ID'}
                                        hint={lang === 'ar' ? 'كما يظهر في رسالة التأكيد.' : 'As shown in your confirmation SMS.'}
                                    >
                                        <input value={form.transactionId} onChange={update('transactionId')} className={inputClass} />
                                    </Field>
                                    {errors.transactionId && <p className="mt-1.5 text-xs text-destructive">{errors.transactionId}</p>}
                                </>
                            )}
                        </div>

                        {/* Optional patron contribution — expedites manual review.
                            GP-award amount intentionally left out of the UI copy:
                            it appeared only in an unverified document this
                            session, not confirmed by GA000 directly. Wire the
                            real number in once confirmed. */}
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
                                            ? 'يسرّع مراجعة تسجيلك يدوياً.'
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
                                    ? (lang === 'ar' ? 'جارٍ الإرسال...' : 'Submitting...')
                                    : (lang === 'ar' ? 'سجّل الآن' : 'Register now')}
                            </button>
                        </div>
                    </form>
                )}
            </Section>
        </Layout>
    );
};

export default BlsWorkshopPage;
