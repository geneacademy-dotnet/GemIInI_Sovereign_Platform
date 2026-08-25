/**
 * src/pages/BlsWorkshopPage.jsx
 * AHA BLS & Resuscitation Workshop Page (Multi-Hub: Cairo Dokki & Sudan Hub)
 * Apple / 2027 Futuristic Luxury Design System
 */

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ShieldCheck, Award, Smartphone, CheckCircle2, Sparkles, Coffee, MessageCircle, HeartPulse, Clock, MapPin, ArrowRight, ArrowLeft, Globe, RefreshCw } from 'lucide-react';
import Layout from '@/components/site/Layout';
import { useLang } from '@/i18n/LanguageContext';
import { submitBlsRegistration } from '@/lib/geneApi';

const HUBS = {
  cairo: {
    id: 'bls_dokki_2026_08_28',
    name: { en: 'Dokki Hub (Cairo, Egypt)', ar: 'مقر الدقي (القاهرة، مصر)' },
    date: { en: 'Friday, August 28, 2026 • 09:00 Cairo', ar: 'الجمعة ٢٨ أغسطس ٢٠٢٦ • ٠٩:٠٠ صباحاً بتوقيت القاهرة' },
    location: { en: 'Dokki Clinical Simulation Suite, Cairo', ar: 'مقر المحاكاة السريرية — الدقي، الجيزة' },
    price: '3,000 EGP',
    paymentMethod: { en: 'Vodafone Cash to +20 101 592 2628', ar: 'تحويل Vodafone Cash للرقم 01015922628' },
    targetDate: new Date('2026-08-28T09:00:00+02:00').getTime(),
  },
  sudan: {
    id: 'bls_sudan_2026_09_10',
    name: { en: 'Sudan National Hub (Khartoum / Red Sea)', ar: 'المقر القومي للسودان (الخرطوم / البحر الأحمر)' },
    date: { en: 'Thursday, September 10, 2026 • 09:00 Sudan', ar: 'الخميس ١٠ سبتمبر ٢٠٢٦ • ٠٩:٠٠ صباحاً بتوقيت السودان' },
    location: { en: 'Clinical Resuscitation Training Center, Sudan', ar: 'مركز التدريب والإنعاش السريري — السودان' },
    price: '35,000 SDG / $40',
    paymentMethod: { en: 'Bankak (بنكك) / Barq (برق) Remittance', ar: 'تحويل بنكك (Bankak) / تطبيق برق' },
    targetDate: new Date('2026-09-10T09:00:00+02:00').getTime(),
  }
};

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
  <div className="rounded-2xl border border-[#00F2FE]/20 bg-[#0A0F1D]/90 backdrop-blur-md p-4 text-center shadow-lg hover:border-[#00F2FE]/50 transition-all">
    <div className="font-mono text-3xl sm:text-4xl font-black text-white">{String(value).padStart(2, '0')}</div>
    <div className="mt-1 text-[11px] font-bold uppercase tracking-wider text-[#00F2FE]">{label}</div>
  </div>
);

const buildKsaWhatsappLink = ({ gaId, fullName, hubName }) => {
  const lines = [
    'مرحباً، لقد قمت بالتسجيل في ورشة الدعم الحياتي الأساسي (BLS).',
    gaId ? `الرقم السيادي: ${gaId}` : null,
    fullName ? `الاسم: ${fullName}` : null,
    hubName ? `المقر: ${hubName}` : null,
    'أرغب في الاستفسار بخصوص الترخيص الطبي / الانتقال / التنسيب السريري في المملكة العربية السعودية.',
  ].filter(Boolean);
  return `https://wa.me/966550476176?text=${encodeURIComponent(lines.join('\n'))}`;
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

const inputClass = 'min-h-[48px] rounded-xl border border-slate-800 bg-slate-900/90 px-4 text-sm text-slate-100 outline-none focus:border-[#00F2FE] transition-all shadow-inner';

const Field = ({ label, children, hint }) => (
  <label className="flex flex-col gap-2 text-sm text-slate-300">
    <span className="font-semibold text-white">{label}</span>
    {children}
    {hint && <span className="text-xs text-slate-500">{hint}</span>}
  </label>
);

const BlsWorkshopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { lang, isRtl } = useLang();
  const referralId = useReferralCapture();
  
  const initialHub = searchParams.get('hub') === 'sudan' ? 'sudan' : 'cairo';
  const [selectedHub, setSelectedHub] = useState(initialHub);
  
  const activeHubData = HUBS[selectedHub];
  const countdown = useCountdown(activeHubData.targetDate);

  const [form, setForm] = useState({ fullName: '', email: '', phone: '', transactionId: '', gpApplied: false, patronBooster: false });
  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);

  const switchHub = (hubKey) => {
    setSelectedHub(hubKey);
    setSearchParams({ hub: hubKey });
  };

  const update = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const onSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (form.fullName.trim().length < 3) nextErrors.fullName = isRtl ? 'أدخل اسمك الكامل.' : 'Enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = isRtl ? 'بريد إلكتروني غير صالح.' : 'Enter a valid email.';
    if (!form.phone.trim()) nextErrors.phone = isRtl ? 'أدخل رقم هاتفك.' : 'Enter your phone number.';
    if (!form.gpApplied && form.transactionId.trim().length < 4) {
      nextErrors.transactionId = isRtl ? 'أدخل رقم العملية / المرجع المالي.' : 'Enter the transaction / transfer reference ID.';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setStatus('loading');
    try {
      const payload = {
        workshop: activeHubData.id,
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
        <title>{isRtl ? `ورشة الإنعاش القلبي (BLS) — ${activeHubData.name.ar}` : `BLS Workshop — ${activeHubData.name.en} | GemIInI Academy`}</title>
        <meta
          name="description"
          content="Basic Life Support workshop. SMC and AHA accredited. Multi-hub training in Cairo and Sudan with clinical MTC simulation."
        />
      </Helmet>

      <div className="py-12 bg-[#04080F] text-slate-100 font-sans relative overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          
          {/* Hub Switcher Pill */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-2xl">
              <button
                type="button"
                onClick={() => switchHub('cairo')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  selectedHub === 'cairo'
                    ? 'bg-[#00F2FE] text-slate-950 shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🇪🇬 {isRtl ? 'مقر القاهرة (٢٨ أغسطس)' : 'Cairo Hub (Aug 28)'}</span>
              </button>
              <button
                type="button"
                onClick={() => switchHub('sudan')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  selectedHub === 'sudan'
                    ? 'bg-[#00F2FE] text-slate-950 shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🇸🇩 {isRtl ? 'مقر السودان (١٠ سبتمبر)' : 'Sudan Hub (Sept 10)'}</span>
                <span className="px-1.5 py-0.5 bg-[#B48028] text-white text-[10px] font-black rounded uppercase">NEW</span>
              </button>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold rounded-full uppercase tracking-wider mb-3">
              <HeartPulse className="w-4 h-4" />
              <span>{isRtl ? 'اعتماد الإنعاش القلبي والسريري' : 'AHA & SMC Resuscitation Accreditation'}</span>
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              {isRtl ? 'ورشة الدعم الحياتي الأساسي والإنعاش القلبي (BLS)' : 'Basic Life Support (BLS) & Resuscitation Workshop'}
            </h1>
            <p className="text-sm sm:text-base text-slate-400 mt-3 flex flex-wrap items-center justify-center gap-2">
              <Clock className="w-4 h-4 text-[#00F2FE]" />
              <span>{activeHubData.date[lang] || activeHubData.date.en}</span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <MapPin className="w-4 h-4 text-[#B48028]" />
              <span>{activeHubData.location[lang] || activeHubData.location.en}</span>
            </p>
          </div>

          {/* Countdown Timer */}
          {!countdown.ended && (
            <div className="mb-12 grid grid-cols-4 gap-3 max-w-xl mx-auto">
              <CountdownBlock label={isRtl ? 'أيام' : 'DAYS'} value={countdown.days} />
              <CountdownBlock label={isRtl ? 'ساعات' : 'HRS'} value={countdown.hours} />
              <CountdownBlock label={isRtl ? 'دقائق' : 'MIN'} value={countdown.mins} />
              <CountdownBlock label={isRtl ? 'ثواني' : 'SEC'} value={countdown.secs} />
            </div>
          )}

          {/* Accreditation Badges */}
          <div className="mb-10 grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-[#0A0F1D] p-5 shadow-lg">
              <ShieldCheck className="h-7 w-7 text-teal-400" strokeWidth={1.8} />
              <div>
                <p className="text-sm font-bold text-white">SMC Accredited</p>
                <p className="text-xs text-slate-400">{isRtl ? 'معتمد من المجلس الطبي' : 'Sudan Medical Council'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-[#0A0F1D] p-5 shadow-lg">
              <Award className="h-7 w-7 text-[#00F2FE]" strokeWidth={1.8} />
              <div>
                <p className="text-sm font-bold text-white">AHA Guidelines</p>
                <p className="text-xs text-slate-400">{isRtl ? 'مطابق لمعايير AHA الدولية' : 'International Standard'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-[#B48028]/40 bg-[#0A0F1D] p-5 shadow-lg">
              <Sparkles className="h-7 w-7 text-[#B48028]" strokeWidth={1.8} />
              <div>
                <p className="text-sm font-bold text-white">{isRtl ? 'مكافأة الأعضاء' : 'Member Bonus'}</p>
                <p className="text-xs text-slate-400">
                  {isRtl ? 'سيرة ذاتية احترافية — د. محمد صبري' : 'Pro CV Module — Dr. Sabri'}
                </p>
              </div>
            </div>
          </div>

          {/* Referral Banner */}
          {referralId && (
            <div className="mb-6 rounded-xl border border-[#00F2FE]/40 bg-[#00F2FE]/10 px-5 py-3.5 text-xs sm:text-sm text-slate-200 flex items-center justify-between">
              <span>{isRtl ? 'تمت الإحالة عبر المعرف السيادي:' : 'Referred by Sovereign ID:'} <strong>{referralId}</strong></span>
              <span className="px-2 py-0.5 bg-[#00F2FE] text-slate-950 font-bold font-mono rounded text-xs">+50 GP Referral</span>
            </div>
          )}

          {/* Riyadh Desk Inquiries */}
          <a
            href="https://wa.me/966550476176"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-8 flex items-center gap-3 rounded-2xl border border-slate-800 bg-[#0A0F1D] hover:border-teal-500/50 p-4 text-xs sm:text-sm transition-all shadow-md group"
          >
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
              <MessageCircle className="h-5 w-5" strokeWidth={1.8} />
            </div>
            <div>
              <span className="font-semibold text-white">
                {isRtl
                  ? 'لديك استفسار بخصوص الترخيص أو الانتقال إلى السعودية؟ راسل مكتبنا في الرياض'
                  : 'Questions about KSA licensing or relocation? Message our Riyadh desk'}
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">{isRtl ? 'استشارات الاعتماد والتنسيب السريري' : 'Clinical Placement & Fellowship Guidance'}</p>
            </div>
          </a>

          {/* Form / Result Area */}
          {status === 'done' ? (
            <div className="rounded-2xl border border-emerald-500/50 bg-[#0A0F1D] p-8 shadow-2xl animate-in fade-in">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-500/15 border border-emerald-500 rounded-xl text-emerald-400">
                  <CheckCircle2 className="h-8 w-8" strokeWidth={2} />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-white">
                    {isRtl ? 'تم استلام تسجيلك بنجاح وإرسال بريد الترحيب' : 'Registration Received & CRM Email Dispatched'}
                  </h2>
                  <p className="mt-2 text-sm text-slate-300">
                    {isRtl
                      ? `رقمك السيادي المحجوز: ${result?.gaId || 'GA-PENDING'} — المقر: ${activeHubData.name.ar} — الحالة: قيد التحقق والتأكيد.`
                      : `Provisional GA-ID: ${result?.gaId || 'GA-PENDING'} — Hub: ${activeHubData.name.en} — status: pending verification.`}
                  </p>
                  <p className="mt-3 text-xs sm:text-sm text-teal-300 bg-teal-500/10 border border-teal-500/30 rounded-xl p-3">
                    {isRtl
                      ? 'تم إرسال بريد تأكيد رسمي يحتوي على رابط البورتال الشخصي وتعليمات الحضور.'
                      : 'An official onboarding email with your personalized portal link and attendance instructions has been sent.'}
                  </p>
                </div>
              </div>

              {/* Riyadh Desk Intercept */}
              <div className="mt-8 rounded-2xl border border-[#B48028]/40 bg-[#121B2A] p-6">
                <p className="text-sm font-bold text-white">
                  {isRtl
                    ? 'هل تحتاج مساعدة في الترخيص أو الانتقال أو التنسيب السريري في السعودية؟'
                    : 'Need help with KSA licensing, relocation, or clinical placement?'}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {isRtl ? 'مستشارونا في مكتب الرياض جاهزون لمراجعة مسارك المهني فوراً.' : 'Our Riyadh desk consultants are available to assist with your placement roadmap.'}
                </p>
                <a
                  href={buildKsaWhatsappLink({ gaId: result?.gaId, fullName: form.fullName, hubName: activeHubData.name.en })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#B48028] hover:bg-[#96671E] px-5 py-2.5 text-xs font-bold text-white shadow-lg transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{isRtl ? 'مراسلة مكتب الرياض عبر واتساب' : 'Message Riyadh Desk via WhatsApp'}</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="rounded-2xl border border-slate-800 bg-[#0A0F1D] p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-xl font-bold text-white">
                  {isRtl ? `تأكيد حجز مقعد — ${activeHubData.name.ar}` : `Seat Reservation — ${activeHubData.name.en}`}
                </h3>
                <span className="px-3 py-1 bg-[#00F2FE]/10 border border-[#00F2FE]/30 text-[#00F2FE] text-xs font-mono font-bold rounded-lg">
                  {activeHubData.price}
                </span>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label={isRtl ? 'الاسم الكامل (كما في الشهادة الطبية)' : 'Full Name (as on Medical Degree)'}>
                    <input value={form.fullName} onChange={update('fullName')} className={inputClass} placeholder="Dr. Full Name" />
                  </Field>
                  {errors.fullName && <p className="mt-1.5 text-xs text-rose-400">{errors.fullName}</p>}
                </div>
                <div>
                  <Field label={isRtl ? 'البريد الإلكتروني' : 'Email Address'}>
                    <input type="email" value={form.email} onChange={update('email')} className={inputClass} placeholder="doctor@example.com" />
                  </Field>
                  {errors.email && <p className="mt-1.5 text-xs text-rose-400">{errors.email}</p>}
                </div>
                <div>
                  <Field label={isRtl ? 'رقم الهاتف / واتساب' : 'Phone / WhatsApp'}>
                    <input value={form.phone} onChange={update('phone')} className={inputClass} placeholder="+20 101 ... / +249 9..." />
                  </Field>
                  {errors.phone && <p className="mt-1.5 text-xs text-rose-400">{errors.phone}</p>}
                </div>
              </div>

              {/* Payment Section */}
              <div className="rounded-2xl border border-slate-800 bg-[#04080F] p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="p-2 bg-rose-500/10 rounded-xl text-rose-400 border border-rose-500/30">
                    <Smartphone className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-white">
                      {isRtl ? 'طريقة الدفع والتأكيد المالي' : 'Payment Method & Transfer Reference'}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {activeHubData.paymentMethod[lang] || activeHubData.paymentMethod.en}
                    </p>
                  </div>
                </div>

                <label className="mb-4 flex items-center gap-2.5 text-xs sm:text-sm text-slate-300 cursor-pointer bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <input type="checkbox" checked={form.gpApplied} onChange={update('gpApplied')} className="w-4 h-4 rounded text-[#00F2FE]" />
                  <span>{isRtl ? 'استخدام رصيد نقاط GemIInI (GP) لتغطية الرسوم' : 'Apply GemIInI Points (GP) balance instead of cash'}</span>
                </label>

                {!form.gpApplied && (
                  <div className="mt-4">
                    <Field
                      label={isRtl ? 'رقم العملية المرجعي (Transaction Reference ID)' : 'Transaction Reference / Receipt ID'}
                      hint={isRtl ? 'أدخل الرقم المرجعي للتحويل كما يظهر في إشعار البنك أو رسالة التحويل.' : 'As shown in your bank transfer or remittance receipt.'}
                    >
                      <input value={form.transactionId} onChange={update('transactionId')} className={inputClass} placeholder="e.g. 194038291 / Bankak Ref" />
                    </Field>
                    {errors.transactionId && <p className="mt-1.5 text-xs text-rose-400">{errors.transactionId}</p>}
                  </div>
                )}
              </div>

              {/* Patron Booster */}
              <label className="flex items-start gap-3 rounded-2xl border border-[#B48028]/30 bg-[#B48028]/5 p-4 cursor-pointer hover:border-[#B48028]/60 transition-all">
                <input type="checkbox" checked={form.patronBooster} onChange={update('patronBooster')} className="mt-1 h-4 w-4 rounded" />
                <span className="flex items-start gap-2.5">
                  <Coffee className="mt-0.5 h-5 w-5 text-[#B48028] flex-shrink-0" strokeWidth={1.8} />
                  <span>
                    <span className="block text-xs sm:text-sm font-bold text-white">
                      {isRtl ? 'مساهمة داعم للمبادرة الأكاديمية (اختياري)' : 'Patron contribution (optional)'}
                    </span>
                    <span className="block text-xs text-slate-400 mt-0.5">
                      {isRtl
                        ? 'تساهم في دعم تدريب الأطباء المتضررين من النزاع وتسريع مراجعة وتأكيد تسجيلك يدوياً.'
                        : 'Supports displaced physician training & prioritizes your manual verification review.'}
                    </span>
                  </span>
                </span>
              </label>

              {status === 'error' && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300">
                  {isRtl ? 'حدث خطأ أثناء إرسال التسجيل. يرجى المحاولة مرة أخرى أو التواصل معنا عبر واتساب.' : 'An error occurred while submitting your registration. Please retry or contact support.'}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3.5 rounded-xl bg-[#00F2FE] hover:bg-[#00D2DE] text-slate-950 font-extrabold text-sm transition-all shadow-[0_0_20px_rgba(0,242,254,0.3)] active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <span>{isRtl ? 'جاري تسجيل وتوثيق المقعد...' : 'Registering Seat...'}</span>
                ) : (
                  <>
                    <span>{isRtl ? `تأكيد حجز مقعد ${activeHubData.name.ar}` : `Confirm Seat in ${activeHubData.name.en}`}</span>
                    {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </>
                )}
              </button>
            </form>
          )}

        </div>
      </div>
    </Layout>
  );
};

export default BlsWorkshopPage;
