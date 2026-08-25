/**
 * src/pages/BlsWorkshopPage.jsx
 * GemIInI Academy — Dual-Hub Multi-Center BLS Workshop Portal
 * 2027 Apple / VisionOS Spatial Aesthetics & Resilient Fail-Safe Lead Segmentation
 */

import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { 
  ShieldCheck, Award, Zap, Activity, Users, Globe2, BookOpen, 
  ArrowRight, ArrowLeft, Sparkles, CheckCircle2, ChevronRight,
  Flame, Stethoscope, Dna, Play, HeartPulse, Building2, Microscope,
  Search, ExternalLink, Compass, Layers, Fingerprint, MapPin, 
  DatabaseZap, Clock, Phone, AlertCircle, Coffee
} from 'lucide-react';
import Layout from '@/components/site/Layout';
import { useLang } from '@/i18n/LanguageContext';
import { submitBlsRegistration } from '@/lib/geneApi';

export const WORKSHOP_HUBS = {
  cairo: {
    id: 'cairo',
    name: { en: 'Cairo Dokki Hub', ar: 'فرع القاهرة (الدقي)' },
    venue: { en: 'Dokki Hands-On Simulation Center, Giza', ar: 'مركز الدقي للمحاكاة والتدريب السريري، الجيزة' },
    dateIso: '2026-08-28T09:00:00+02:00',
    dateFormatted: { en: 'Friday, August 28, 2026', ar: 'الجمعة، ٢٨ أغسطس ٢٠٢٦' },
    seatsRemaining: 4,
    fee: { amount: '3,000', currency: 'EGP' },
    paymentAccount: '+20 101 592 2628',
    paymentLabel: { en: 'Vodafone Cash', ar: 'فودافون كاش (Vodafone Cash)' },
    flag: '🇪🇬',
  },
  sudan: {
    id: 'sudan',
    name: { en: 'Sudan National Hub', ar: 'المقر الوطني بالسودان' },
    venue: { en: 'Clinical Skills Lab, Port Sudan / Wad Medani', ar: 'معمل المهارات السريرية، بورتسودان / ود مدني' },
    dateIso: '2026-09-10T09:00:00+02:00',
    dateFormatted: { en: 'Thursday, September 10, 2026', ar: 'الخميس، ١٠ سبتمبر ٢٠٢٦' },
    seatsRemaining: 18,
    fee: { amount: '35,000', currency: 'SDG', usd: '$40' },
    paymentAccount: 'Bankak / Barq Remittance',
    paymentLabel: { en: 'Bankak (Bank of Khartoum)', ar: 'بنكك (بنك الخرطوم) أو تحويل فوري' },
    flag: '🇸🇩',
  },
};

const inputClass = 'h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition-all placeholder:text-white/40 focus:border-[#00F2FE]/50 focus:bg-white/10 focus:ring-2 focus:ring-[#00F2FE]/20';

export default function BlsWorkshopPage() {
  const { lang, isRtl } = useLang();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const initialHub = searchParams.get('hub') === 'sudan' ? 'sudan' : 'cairo';
  const [selectedHub, setSelectedHub] = useState(initialHub);
  const hubData = WORKSHOP_HUBS[selectedHub];

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    gaId: '',
    currentStatus: 'general_practitioner',
    paymentMethod: 'vodafone_cash',
    transactionId: '',
    expeditedCoffee: false,
    useGpPoints: false
  });

  const [status, setStatus] = useState('idle'); // idle | loading | done
  const [errors, setErrors] = useState({});
  const [submittedData, setSubmittedData] = useState(null);

  // Sync hub with URL param
  const handleHubChange = (hubId) => {
    setSelectedHub(hubId);
    setSearchParams({ hub: hubId });
  };

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = isRtl ? 'يرجى كتابة الاسم الكامل' : 'Please enter your full name';
    if (!form.phone.trim()) errs.phone = isRtl ? 'يرجى كتابة رقم الهاتف أو الواتساب' : 'Please enter your phone/WhatsApp number';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('loading');

    // Build rich segmented payload
    const payload = {
      fullName: form.fullName.trim(),
      email: form.email.trim() || `${form.phone.replace(/[^0-9]/g, '')}@geneacademy.temp`,
      phone: form.phone.trim(),
      gaId: form.gaId.trim().toUpperCase(),
      hub: selectedHub,
      hubName: hubData.name.en,
      dateFormatted: hubData.dateFormatted.en,
      currentStatus: form.currentStatus,
      paymentMethod: form.paymentMethod,
      transactionId: form.transactionId.trim() || 'Manual Coordination',
      expeditedCoffee: form.expeditedCoffee,
      segmentTag: form.expeditedCoffee ? 'VIP_PRIORITY_COFFEE_PATRON' : 'STANDARD_CLINICAL_COHORT',
      intakeTier: selectedHub === 'cairo' ? 'Cairo Dokki In-Person' : 'Sudan National In-Person',
      timestamp: new Date().toISOString()
    };

    // Save locally to safeguard lead
    try {
      localStorage.setItem('last_bls_registration', JSON.stringify(payload));
    } catch {}

    // Dispatch to Apps Script backend with graceful fail-safe
    try {
      await submitBlsRegistration(payload);
    } catch (err) {
      console.log('Background sync logging:', err);
    }

    setSubmittedData(payload);
    setStatus('done');
  };

  const getWhatsAppConfirmationUrl = () => {
    const name = form.fullName || 'Doctor';
    const hubText = selectedHub === 'cairo' ? 'Cairo Dokki Hub (Aug 28)' : 'Sudan National Hub (Sept 10)';
    const tx = form.transactionId ? `Tx ID: ${form.transactionId}` : 'Payment confirmation attached';
    const coffeeText = form.expeditedCoffee ? ' [Expedited Priority + Coffee Patron]' : '';
    const text = encodeURIComponent(
      `Hello GemIInI Team! 👋\n\nI have reserved my seat for the BLS Workshop:\n• Name: Dr. ${name}\n• Hub: ${hubText}${coffeeText}\n• Phone: ${form.phone}\n• ${tx}\n\nPlease confirm my seat registration.`
    );
    return `https://wa.me/201015922628?text=${text}`;
  };

  return (
    <Layout>
      <Helmet>
        <title>{isRtl ? 'حجز مقعد: ورشة الإنعاش القلبي والرئوي BLS | أكاديمية جيميني' : 'BLS & Resuscitation Workshop Registration | GemIInI Academy'}</title>
      </Helmet>

      <div className="bg-[#04080F] text-slate-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
        
        {/* Ambient Glow */}
        <div className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-gradient-to-br from-[#00F2FE]/15 via-teal-500/10 to-amber-500/10 rounded-full blur-[140px]" />

        <div className="max-w-4xl mx-auto relative z-10">
          
          {/* Header Title */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-4 text-xs font-mono font-bold text-[#00F2FE] uppercase tracking-widest">
              <HeartPulse className="w-4 h-4 text-[#00F2FE] animate-pulse" />
              <span>{isRtl ? 'التدريب السريري العملي والإنعاش' : 'Hands-On Resuscitation & Emergency Care'}</span>
            </div>
            
            <h1 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight">
              {isRtl ? 'ورشة دعم الحياة الأساسي المتقدمة (BLS)' : 'Advanced BLS & Clinical Resuscitation'}
            </h1>
            
            <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-xl mx-auto font-light">
              {isRtl 
                ? 'تدريب عملي مكثف على أحدث بروتوكولات الإنعاش وتدبير مجرى الهواء والرجفان القلبي مع منح الاعتماد والساعات المعتمدة.'
                : 'Intensive hands-on airway management, high-quality CPR, and defibrillation wet-lab credentialing.'}
            </p>

            {/* Dual Hub Switcher Pill */}
            <div className="mt-8 inline-flex items-center p-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-2xl shadow-2xl">
              <button
                type="button"
                onClick={() => handleHubChange('cairo')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                  selectedHub === 'cairo' 
                    ? 'bg-[#00F2FE] text-slate-950 shadow-lg shadow-[#00F2FE]/20' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>🇪🇬</span>
                <span>{isRtl ? 'فرع القاهرة (٢٨ أغسطس)' : 'Cairo Dokki Hub (Aug 28)'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleHubChange('sudan')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                  selectedHub === 'sudan' 
                    ? 'bg-[#00F2FE] text-slate-950 shadow-lg shadow-[#00F2FE]/20' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>🇸🇩</span>
                <span>{isRtl ? 'فرع السودان (١٠ سبتمبر)' : 'Sudan Hub (Sept 10)'}</span>
              </button>
            </div>
          </div>

          {/* MAIN INTAKE CARD */}
          <div className="rounded-[2.5rem] border border-white/15 bg-white/5 backdrop-blur-3xl p-6 sm:p-10 shadow-2xl">
            
            {status === 'done' ? (
              /* SUCCESS STATE — WARM DOCTOR-TO-DOCTOR CONFIRMATION */
              <div className="text-center py-8 space-y-6 animate-in fade-in zoom-in-95">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mx-auto border border-emerald-500/30">
                  <CheckCircle2 className="h-8 w-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                    {isRtl ? `تم تسجيل طلبك بنجاح د. ${form.fullName || ''}` : `Seat Request Recorded, Dr. ${form.fullName || ''}!`}
                  </h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                    {isRtl
                      ? `تم حجز مقعدك المبدئي في ورشة ${hubData.name.ar} (${hubData.dateFormatted.ar}). لتأكيد المقعد فوراً، يرجى مشاركة إشعار التحويل عبر الواتساب مع فريق التنسيق:`
                      : `Your provisional seat in the ${hubData.name.en} (${hubData.dateFormatted.en}) is securely logged. To confirm immediately, share your payment receipt with our coordination desk:`}
                  </p>
                </div>

                {/* Instant WhatsApp Action Card */}
                <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 max-w-md mx-auto space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono text-emerald-300">
                    <span>{isRtl ? 'المقر المحدد:' : 'Target Hub:'}</span>
                    <span className="font-bold">{hubData.name.en}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-emerald-300">
                    <span>{isRtl ? 'رسوم التسجيل:' : 'Fee:'}</span>
                    <span className="font-bold">{hubData.fee.amount} {hubData.fee.currency}</span>
                  </div>

                  <a
                    href={getWhatsAppConfirmationUrl()}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-xl transition-all active:scale-95"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{isRtl ? 'تأكيد المقعد عبر الواتساب الآن' : 'Confirm on WhatsApp Instantly'}</span>
                  </a>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => { setStatus('idle'); setForm({ ...form, fullName: '', phone: '', transactionId: '' }); }}
                    className="text-xs text-slate-400 hover:text-white underline font-mono"
                  >
                    {isRtl ? 'تسجيل زميل أو مقعد إضافي' : 'Register another colleague or seat'}
                  </button>
                </div>
              </div>

            ) : (

              /* INTAKE FORM */
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Dynamic Warm Pre-Submission Notice (Replaces cold authority jargon) */}
                <div className="rounded-2xl border border-[#00F2FE]/20 bg-[#00F2FE]/5 p-4 flex items-start gap-3 text-start">
                  <Sparkles className="w-5 h-5 text-[#00F2FE] flex-shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm text-slate-300 space-y-1">
                    <p className="font-semibold text-white">
                      {isRtl ? 'معلومات هامة قبل المتابعة:' : 'Before you continue, please note:'}
                    </p>
                    <p className="leading-relaxed text-slate-300/90">
                      {isRtl
                        ? `المقاعد محدودة لضمان التدريب العملي الفردي (${hubData.seatsRemaining} مقاعد متبقية لورشة ${hubData.name.ar}). التحويل يتم مباشرة عبر ${hubData.paymentLabel.ar}.`
                        : `Seats are capped to ensure dedicated 1-on-1 mannequin time (${hubData.seatsRemaining} seats left for ${hubData.name.en}). Payment is processed directly via ${hubData.paymentLabel.en}.`}
                    </p>
                  </div>
                </div>

                {/* Candidate Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-start">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {isRtl ? 'الاسم الكامل *' : 'Full Legal Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      placeholder={isRtl ? 'د. أحمد محمد علي' : 'Dr. Ahmed Mohamed'}
                      className={inputClass}
                    />
                    {errors.fullName && <p className="text-xs text-rose-400 mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {isRtl ? 'رقم الواتساب أو الهاتف *' : 'WhatsApp / Phone Number *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+249 / +20 / +966"
                      className={inputClass}
                    />
                    {errors.phone && <p className="text-xs text-rose-400 mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-start">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {isRtl ? 'البريد الإلكتروني (اختياري)' : 'Email Address (Optional)'}
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="doctor@example.com"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {isRtl ? 'المستوى المهني' : 'Professional Standing'}
                    </label>
                    <select
                      value={form.currentStatus}
                      onChange={(e) => setForm({ ...form, currentStatus: e.target.value })}
                      className={`${inputClass} appearance-none cursor-pointer`}
                    >
                      <option value="general_practitioner">{isRtl ? 'طبيب عمومي / امتياز' : 'General Practitioner / Intern'}</option>
                      <option value="resident">{isRtl ? 'طبيب مقيم (Resident)' : 'Clinical Resident'}</option>
                      <option value="specialist">{isRtl ? 'أخصائي / استشاري' : 'Specialist / Consultant'}</option>
                      <option value="medical_student">{isRtl ? 'طالب طب (السنوات السريرية)' : 'Senior Medical Student'}</option>
                      <option value="nurse_paramedic">{isRtl ? 'تمريض / رعاية حرجة' : 'Critical Care / Nursing'}</option>
                    </select>
                  </div>
                </div>

                {/* Payment Breakdown Box */}
                <div className="rounded-2xl border border-white/10 bg-black/40 p-5 space-y-3 text-start">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white uppercase tracking-wider">{hubData.paymentLabel.en}</p>
                      <p className="text-xs font-mono text-[#00F2FE] mt-0.5">{hubData.paymentAccount}</p>
                    </div>
                    <div className="text-end">
                      <p className="text-xs text-slate-400">{isRtl ? 'المبلغ المستحق' : 'Workshop Fee'}</p>
                      <p className="font-mono text-xl font-bold text-white">{hubData.fee.amount} <span className="text-xs text-slate-400">{hubData.fee.currency}</span></p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {isRtl ? 'رقم المعاملة / إشعار التحويل (إن وجد)' : 'Transaction ID / Reference (If already paid)'}
                    </label>
                    <input
                      type="text"
                      value={form.transactionId}
                      onChange={(e) => setForm({ ...form, transactionId: e.target.value })}
                      placeholder={isRtl ? 'أدخل رقم الحوالة أو اكتب (تنسيق عبر الواتساب)' : 'Enter reference ID or type "WhatsApp Desk"'}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Friendly Coffee / Priority Review Addon (Simplified language) */}
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-start">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.expeditedCoffee}
                      onChange={(e) => setForm({ ...form, expeditedCoffee: e.target.checked })}
                      className="mt-1 h-4 w-4 rounded border-amber-500/30 text-amber-500 focus:ring-amber-500/20"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                        <Coffee className="w-3.5 h-3.5 text-amber-400" />
                        <span>{isRtl ? 'دعم أبحاث المعامل والتأكيد الفوري (+٢٥٠ جنيه)' : 'Support Wet-Lab Research & Expedited Confirmation (+EGP 250)'}</span>
                      </div>
                      <p className="text-[11px] text-amber-200/70 mt-0.5 leading-relaxed">
                        {isRtl
                          ? 'مساهمة اختيارية لتطوير معامل المحاكاة وتمنحك أولوية المراجعة والتأكيد الفوري.'
                          : 'An optional patron contribution supporting continuous medical wet-labs, with instant manual desk priority.'}
                      </p>
                    </div>
                  </label>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full h-14 rounded-2xl bg-white hover:bg-[#00F2FE] text-slate-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-xl active:scale-[0.98] disabled:opacity-70"
                >
                  {status === 'loading' ? (
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 animate-pulse text-slate-950" />
                      <span>{isRtl ? 'جارٍ تسجيل المقعد...' : 'Reserving Your Seat...'}</span>
                    </div>
                  ) : (
                    <>
                      <span>{isRtl ? `حجز المقعد في ${hubData.name.ar}` : `Secure Seat in ${hubData.name.en}`}</span>
                      {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                    </>
                  )}
                </button>

              </form>
            )}

          </div>

        </div>
      </div>
    </Layout>
  );
}
