/**
 * src/pages/BlsWorkshopPage.jsx
 * AHA BLS & Resuscitation Workshop Page (Multi-Hub: Cairo Dokki & Sudan Hub)
 * 2027 Apple / VisionOS Spatial Design System
 */

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ShieldCheck, Award, Smartphone, CheckCircle2, Sparkles, Coffee, MessageCircle, ArrowRight, ArrowLeft, HeartPulse, Clock, MapPin, Globe } from 'lucide-react';
import Layout from '@/components/site/Layout';
import { PageHeader, Section, StateBlock } from '@/components/site/Bits';
import { useLang } from '@/i18n/LanguageContext';
import { submitBlsRegistration } from '@/lib/geneApi';

const HUBS = {
  cairo: {
    id: 'bls_dokki_2026_08_28',
    name: { en: 'Dokki Hub (Cairo, Egypt)', ar: 'مقر الدقي (القاهرة، مصر)' },
    date: { en: 'Friday, August 28, 2026 • 09:00 Cairo', ar: 'الجمعة ٢٨ أغسطس ٢٠٢٦ • ٠٩:٠٠ صباحاً' },
    location: { en: 'Dokki Clinical Simulation Suite, Cairo', ar: 'مقر المحاكاة السريرية — الدقي، الجيزة' },
    priceDisplay: 'EGP 3,000',
    priceVal: 3000,
    currency: 'EGP',
    paymentLabel: { en: 'Vodafone Cash', ar: 'فودافون كاش (Vodafone Cash)' },
    paymentHint: { en: 'Transfer to +20 101 592 2628 and enter reference', ar: 'حوّل إلى 01015922628 وأدخل الرقم المرجعي' },
    targetDate: new Date('2026-08-28T09:00:00+02:00').getTime(),
  },
  sudan: {
    id: 'bls_sudan_2026_09_10',
    name: { en: 'Sudan National Hub', ar: 'المقر القومي للسودان' },
    date: { en: 'Thursday, September 10, 2026 • 09:00 Sudan', ar: 'الخميس ١٠ سبتمبر ٢٠٢٦ • ٠٩:٠٠ صباحاً' },
    location: { en: 'Clinical Resuscitation Training Center, Sudan', ar: 'مركز التدريب والإنعاش السريري — السودان' },
    priceDisplay: '35,000 SDG / $40',
    priceVal: 35000,
    currency: 'SDG',
    paymentLabel: { en: 'Bankak / Barq Remittance', ar: 'بنكك (Bankak) / تطبيق برق' },
    paymentHint: { en: 'Send to official merchant account and enter receipt reference', ar: 'أرسل للحساب المعتمد وأدخل رقم الإشعار المرجعي' },
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
  <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl transition-all duration-500 hover:bg-white/10 hover:border-white/20 shadow-xl">
    <div className="font-mono text-3xl font-light tracking-tighter text-white sm:text-5xl">
      {String(value).padStart(2, '0')}
    </div>
    <div className="mt-2 text-[10px] font-bold tracking-widest text-[#00F2FE] uppercase">{label}</div>
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

const inputClass = 'min-h-[52px] w-full rounded-2xl border border-white/10 bg-slate-900/60 px-5 text-[15px] text-white outline-none transition-all duration-300 placeholder:text-slate-500 hover:bg-slate-900/80 focus:border-[#00F2FE]/60 focus:bg-slate-900 focus:ring-4 focus:ring-[#00F2FE]/15';

const Field = ({ label, children, hint }) => (
  <label className="flex flex-col gap-2">
    <span className="text-[13px] font-semibold tracking-wide text-slate-300">{label}</span>
    {children}
    {hint && <span className="text-[11px] text-slate-500">{hint}</span>}
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
    if (form.fullName.trim().length < 3) nextErrors.fullName = isRtl ? 'أدخل اسمك الكامل.' : 'Enter your full legal name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = isRtl ? 'بريد إلكتروني غير صالح.' : 'Enter a valid email address.';
    if (!form.phone.trim()) nextErrors.phone = isRtl ? 'أدخل رقم هاتفك.' : 'Enter your phone number.';
    if (!form.gpApplied && form.transactionId.trim().length < 4) {
      nextErrors.transactionId = isRtl ? 'أدخل رقم العملية / الإشعار المرجعي.' : 'Enter the transaction / reference ID.';
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
        <title>{isRtl ? `ورشة دعم الحياة الأساسي (BLS) — ${activeHubData.name.ar}` : `BLS Workshop — ${activeHubData.name.en} | GemIInI Academy`}</title>
      </Helmet>

      <div className="relative pt-12 pb-24 bg-[#04080F] min-h-screen text-slate-100 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
        
        {/* Ambient Spatial Glow Orbs */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden z-0">
          <div className="h-[45rem] w-[45rem] rounded-full bg-gradient-to-tr from-[#00F2FE]/15 via-rose-500/10 to-[#B48028]/10 blur-[130px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          
          {/* Dual-Hub Spatial Toggle */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex p-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl">
              <button
                type="button"
                onClick={() => switchHub('cairo')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
                  selectedHub === 'cairo'
                    ? 'bg-gradient-to-r from-[#00F2FE] to-[#38BDF8] text-slate-950 shadow-[0_0_20px_rgba(0,242,254,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🇪🇬 {isRtl ? 'مقر القاهرة (٢٨ أغسطس)' : 'Cairo Hub (Aug 28)'}</span>
              </button>
              <button
                type="button"
                onClick={() => switchHub('sudan')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
                  selectedHub === 'sudan'
                    ? 'bg-gradient-to-r from-[#00F2FE] to-[#38BDF8] text-slate-950 shadow-[0_0_20px_rgba(0,242,254,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🇸🇩 {isRtl ? 'مقر السودان (١٠ سبتمبر)' : 'Sudan Hub (Sept 10)'}</span>
                <span className="px-2 py-0.5 bg-[#B48028] text-white text-[10px] font-black rounded-full uppercase tracking-wider">NEW</span>
              </button>
            </div>
          </div>

          {/* Header Title */}
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
              {isRtl ? 'دعم الحياة الأساسي (BLS)' : 'Basic Life Support (BLS)'}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-xl mx-auto flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 text-[#00F2FE]" />
              <span>{activeHubData.date[lang] || activeHubData.date.en}</span>
              <span className="text-slate-600">•</span>
              <MapPin className="w-4 h-4 text-[#B48028]" />
              <span>{activeHubData.location[lang] || activeHubData.location.en}</span>
            </p>
          </div>

          {/* Floating Glass Countdown Widget */}
          {!countdown.ended && (
            <div className="mb-12 grid grid-cols-4 gap-3 sm:gap-6 max-w-2xl mx-auto">
              <CountdownBlock label={isRtl ? 'أيام' : 'DAYS'} value={countdown.days} />
              <CountdownBlock label={isRtl ? 'ساعات' : 'HOURS'} value={countdown.hours} />
              <CountdownBlock label={isRtl ? 'دقائق' : 'MINS'} value={countdown.mins} />
              <CountdownBlock label={isRtl ? 'ثواني' : 'SECS'} value={countdown.secs} />
            </div>
          )}

          {/* Spatial Floating Badges */}
          <div className="mb-10 flex flex-wrap justify-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 backdrop-blur-xl shadow-lg">
              <ShieldCheck className="h-4 w-4 text-teal-400" />
              <span className="text-sm font-medium tracking-tight text-slate-200">SMC {isRtl ? 'معتمد' : 'Accredited'}</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 backdrop-blur-xl shadow-lg">
              <Award className="h-4 w-4 text-[#00F2FE]" />
              <span className="text-sm font-medium tracking-tight text-slate-200">AHA {isRtl ? 'معتمد' : 'Accredited'}</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[#B48028]/40 bg-[#B48028]/10 px-5 py-2.5 backdrop-blur-xl shadow-[0_0_20px_rgba(180,128,40,0.2)]">
              <Sparkles className="h-4 w-4 text-[#B48028]" />
              <span className="text-sm font-bold tracking-tight text-[#B48028]">
                {isRtl ? 'سيرة ذاتية احترافية مجاناً — د. صبري' : 'Pro CV Bonus Included — Dr. Sabri'}
              </span>
            </div>
          </div>

          {/* Referral Banner */}
          {referralId && (
            <div className="mb-8 rounded-2xl border border-[#00F2FE]/30 bg-[#00F2FE]/10 p-4 text-center text-sm text-slate-200 backdrop-blur-xl">
              {isRtl ? 'تمت الإحالة عبر المعرف السيادي:' : 'Referred by Sovereign ID:'} <strong className="font-mono text-[#00F2FE] ml-1">{referralId}</strong> (+50 GP Grant)
            </div>
          )}

          {/* Form or Success Screen */}
          {status === 'done' ? (
            <div className="overflow-hidden rounded-3xl border border-teal-500/30 bg-slate-900/60 p-8 sm:p-12 backdrop-blur-2xl shadow-2xl transition-all duration-700 animate-in fade-in slide-in-from-bottom-8">
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-teal-500/20 ring-8 ring-teal-500/10">
                  <CheckCircle2 className="h-10 w-10 text-teal-400" />
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  {isRtl ? 'تم تأكيد طلب التسجيل وإرسال البريد' : 'Registration Secured & Onboarding Dispatched'}
                </h2>
                <p className="mt-4 text-lg text-slate-300">
                  {isRtl ? 'رقمك المعرف السيادي: ' : 'Provisional Ticket: '}
                  <span className="font-mono font-black text-[#00F2FE] bg-white/10 px-3 py-1 rounded-xl ml-2">{result?.gaId || 'GA-RESERVED'}</span>
                </p>
                <p className="mt-4 text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                  {isRtl
                    ? `طلبك في مقر (${activeHubData.name.ar}) قيد مراجعة الدفع والتأكيد. تم إرسال بريد رسمي برابط البورتال وتعليمات الحضور.`
                    : `Your reservation for (${activeHubData.name.en}) is pending verification. An onboarding email with your profile link has been sent.`}
                </p>
              </div>

              {/* Riyadh Placement Intercept */}
              <div className="mt-10 rounded-2xl border border-[#B48028]/30 bg-[#B48028]/10 p-6 sm:p-8 text-center backdrop-blur-xl">
                <h3 className="text-base font-bold text-white mb-2">
                  {isRtl ? 'السفر والعمل في المملكة العربية السعودية؟' : 'Relocating or Licensing in KSA?'}
                </h3>
                <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
                  {isRtl
                    ? 'تحدث مباشرة مع فريق مكتب الرياض للحصول على الاستشارات السريرية والتنسيب الوظيفي.'
                    : 'Speak with our Riyadh desk for licensing, residency, and clinical placement assistance.'}
                </p>
                <a
                  href={buildKsaWhatsappLink({ gaId: result?.gaId, fullName: form.fullName, hubName: activeHubData.name.en })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#B48028] hover:bg-[#96671E] px-8 py-3.5 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(180,128,40,0.4)]"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>{isRtl ? 'تواصل مع مكتب الرياض عبر واتساب' : 'Connect with Riyadh Desk'}</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 p-6 sm:p-10 backdrop-blur-2xl shadow-2xl">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label={isRtl ? 'الاسم الكامل (كما في الشهادة الطبية)' : 'Full Legal Name'}>
                    <input value={form.fullName} onChange={update('fullName')} className={inputClass} placeholder="Dr. Full Name" />
                  </Field>
                  {errors.fullName && <p className="mt-2 text-xs font-medium text-rose-400">{errors.fullName}</p>}
                </div>
                <div>
                  <Field label={isRtl ? 'البريد الإلكتروني' : 'Email Address'}>
                    <input type="email" value={form.email} onChange={update('email')} className={inputClass} placeholder="doctor@example.com" />
                  </Field>
                  {errors.email && <p className="mt-2 text-xs font-medium text-rose-400">{errors.email}</p>}
                </div>
                <div>
                  <Field label={isRtl ? 'رقم الهاتف / واتساب' : 'Phone Number'}>
                    <input value={form.phone} onChange={update('phone')} className={inputClass} placeholder="+20 100 ... / +249 9..." />
                  </Field>
                  {errors.phone && <p className="mt-2 text-xs font-medium text-rose-400">{errors.phone}</p>}
                </div>

                {/* Glassy Payment Card */}
                <div className="sm:col-span-2 mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00F2FE]/20">
                        <Smartphone className="h-5 w-5 text-[#00F2FE]" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold tracking-tight text-white">
                          {activeHubData.paymentLabel[lang] || activeHubData.paymentLabel.en}
                        </h3>
                        <p className="text-xs text-slate-400">
                          {activeHubData.paymentHint[lang] || activeHubData.paymentHint.en}
                        </p>
                      </div>
                    </div>
                    <div className="text-end">
                      <span className="block text-2xl font-bold tracking-tighter text-white">{activeHubData.priceDisplay}</span>
                    </div>
                  </div>
                  
                  <label className="mb-5 flex cursor-pointer items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-4 transition-colors hover:bg-white/10">
                    <div className="relative flex items-center">
                      <input type="checkbox" checked={form.gpApplied} onChange={update('gpApplied')} className="peer sr-only" />
                      <div className="h-5 w-5 rounded-lg border border-slate-500 bg-transparent transition-all peer-checked:border-[#00F2FE] peer-checked:bg-[#00F2FE]"></div>
                      <CheckCircle2 className="absolute inset-0 h-5 w-5 text-slate-950 opacity-0 transition-opacity peer-checked:opacity-100" />
                    </div>
                    <span className="text-sm font-medium text-slate-200">
                      {isRtl ? 'استخدام رصيد نقاط GemIInI (GP) بدلاً من الدفع النقدي' : 'Apply GemIInI Points (GP) Ledger Balance'}
                    </span>
                  </label>

                  {!form.gpApplied && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                      <Field
                        label={isRtl ? 'رقم العملية / الإشعار المرجعي' : 'Transaction Reference / Receipt ID'}
                        hint={isRtl ? 'أدخل الرقم المرجعي للتحويل المستلم في الرسالة.' : 'As shown in your transfer confirmation receipt.'}
                      >
                        <input value={form.transactionId} onChange={update('transactionId')} className={inputClass} placeholder="e.g. 1098765432" />
                      </Field>
                      {errors.transactionId && <p className="mt-2 text-xs font-medium text-rose-400">{errors.transactionId}</p>}
                    </div>
                  )}
                </div>

                {/* Expedite Patron Boost */}
                <label className="sm:col-span-2 group flex cursor-pointer items-start gap-4 rounded-2xl border border-[#B48028]/30 bg-gradient-to-r from-[#B48028]/10 to-transparent p-5 transition-all hover:border-[#B48028]/50">
                  <div className="relative mt-0.5 flex items-center">
                    <input type="checkbox" checked={form.patronBooster} onChange={update('patronBooster')} className="peer sr-only" />
                    <div className="h-5 w-5 rounded-lg border border-[#B48028]/50 bg-transparent transition-all peer-checked:border-[#B48028] peer-checked:bg-[#B48028]"></div>
                    <CheckCircle2 className="absolute inset-0 h-5 w-5 text-white opacity-0 transition-opacity peer-checked:opacity-100" />
                  </div>
                  <div>
                    <span className="flex items-center gap-2 text-[15px] font-bold text-white">
                      <Coffee className="h-4 w-4 text-[#B48028]" />
                      {isRtl ? 'تسريع المراجعة وتأييد المبادرة (اختياري)' : 'Expedited Priority Review (Optional)'}
                    </span>
                    <span className="mt-1 block text-sm text-slate-400">
                      {isRtl
                        ? 'تخطى طابور الانتظار وتمتع بمراجعة يدوية فورية وتأكيد حجز مقعدك.'
                        : 'Skip the queue. Upgrades your registration to priority manual processing.'}
                    </span>
                  </div>
                </label>

                {status === 'error' && (
                  <div className="sm:col-span-2 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-300">
                    {isRtl ? 'حدث خطأ أثناء إرسال التسجيل. يرجى المحاولة مرة أخرى.' : 'An error occurred while processing. Please retry.'}
                  </div>
                )}

                <div className="sm:col-span-2 mt-4">
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="group relative flex min-h-[56px] w-full items-center justify-center overflow-hidden rounded-2xl bg-white px-8 text-base font-bold text-slate-950 transition-all hover:bg-[#00F2FE] active:scale-[0.98] disabled:opacity-60 shadow-xl"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {status === 'loading'
                        ? (isRtl ? 'جاري المعالجة والتأمين...' : 'Processing Securely...')
                        : (isRtl ? `تأكيد حجز مقعد ${activeHubData.name.ar}` : `Secure Seat in ${activeHubData.name.en}`)}
                      {status !== 'loading' && (isRtl ? <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> : <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />)}
                    </span>
                  </button>
                </div>
              </div>
            </form>
          )}

        </div>
      </div>
    </Layout>
  );
};

export default BlsWorkshopPage;
