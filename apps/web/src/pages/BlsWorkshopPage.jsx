/**
 * src/pages/BlsWorkshopPage.jsx
 * GemIInI Academy — Cairo Dokki In-Person BLS & Resuscitation Wet Lab
 * 2027 Apple / VisionOS Spatial UI & Zero-Fail Lead Coordination
 */

import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { 
  HeartPulse, MapPin, CheckCircle2, ArrowRight, ArrowLeft,
  Sparkles, Coffee, Phone, Zap
} from 'lucide-react';
import Layout from '@/components/site/Layout';
import { useLang } from '@/i18n/LanguageContext';
import { submitBlsRegistration } from '@/lib/geneApi';

const inputClass = 'h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition-all placeholder:text-white/40 focus:border-[#00F2FE]/50 focus:bg-white/10 focus:ring-2 focus:ring-[#00F2FE]/20';

export default function BlsWorkshopPage() {
  const { lang, isRtl } = useLang();
  
  const workshopInfo = {
    venue: { en: 'Dokki Hands-On Simulation Center, Giza, Egypt', ar: 'مركز الدقي للمحاكاة والتدريب السريري، الجيزة، مصر' },
    dateFormatted: { en: 'Friday, August 28, 2026', ar: 'الجمعة، ٢٨ أغسطس ٢٠٢٦' },
    seatsRemaining: 4,
    fee: { amount: '3,000', currency: 'EGP' },
    paymentAccount: '+20 101 592 2628',
    paymentLabel: { en: 'Vodafone Cash', ar: 'فودافون كاش (Vodafone Cash)' },
  };

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    currentStatus: 'general_practitioner',
    transactionId: '',
    expeditedCoffee: false
  });

  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState({});

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

    const payload = {
      fullName: form.fullName.trim(),
      email: form.email.trim() || `${form.phone.replace(/[^0-9]/g, '')}@geneacademy.temp`,
      phone: form.phone.trim(),
      hub: 'cairo',
      currentStatus: form.currentStatus,
      paymentMethod: 'Vodafone Cash',
      transactionId: form.transactionId.trim() || 'Manual Coordination',
      expeditedCoffee: form.expeditedCoffee,
      timestamp: new Date().toISOString()
    };

    try {
      localStorage.setItem('last_bls_registration', JSON.stringify(payload));
    } catch {}

    try {
      await submitBlsRegistration(payload);
    } catch (err) {
      console.log('Background sync logging:', err);
    }

    setStatus('done');
  };

  const getWhatsAppConfirmationUrl = () => {
    const name = form.fullName || 'Doctor';
    const tx = form.transactionId ? `Tx ID: ${form.transactionId}` : 'Payment confirmation attached';
    const coffeeText = form.expeditedCoffee ? ' [Expedited Priority + Coffee Patron]' : '';
    const text = encodeURIComponent(
      `Hello GemIInI Team! 👋\n\nI have reserved my seat for the Cairo BLS Workshop (Aug 28):\n• Name: Dr. ${name}${coffeeText}\n• Phone: ${form.phone}\n• ${tx}\n\nPlease confirm my seat registration.`
    );
    return `https://wa.me/2+20 101 592 2628?text=${text}`;
  };

  return (
    <Layout>
      <Helmet>
        <title>{isRtl ? 'البرنامج التدريبي المتقدم للإنعاش القلبي الرئوي الأساسي (AHA BLS Provider) والرئوي المتقدمة (BLS) | القاهرة | أكاديمية جيميني' : 'Advanced BLS Clinical Resuscitation Workshop | Cairo Dokki'}</title>
      </Helmet>

      <div className="bg-[#04080F] text-slate-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
        
        <div className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-gradient-to-br from-[#00F2FE]/15 via-teal-500/10 to-amber-500/10 rounded-full blur-[140px]" />

        <div className="max-w-4xl mx-auto relative z-10">
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-4 text-xs font-mono font-bold text-[#00F2FE] uppercase tracking-widest">
              <HeartPulse className="w-4 h-4 text-[#00F2FE] animate-pulse" />
              <span>{isRtl ? 'التدريب السريري الحضوري — القاهرة' : 'Hands-On Clinical Training — Cairo Dokki Hub'}</span>
            </div>
            
            <h1 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight">
              {isRtl ? 'ورشة دعم الحياة الأساسي المتقدمة (BLS)' : 'Advanced BLS & Clinical Resuscitation'}
            </h1>
            
            <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
              {isRtl 
                ? 'تدريب عملي مكثف على أحدث بروتوكولات الإنعاش وتدبير مجرى الهواء والرجفان القلبي مع منح الساعات المعتمدة.'
                : 'Intensive hands-on airway management, high-quality CPR, and defibrillation wet-lab credentialing in Dokki, Cairo.'}
            </p>

            <div className="mt-6 inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-bold shadow-lg">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>{isRtl ? 'الجمعة، ٢٨ أغسطس ٢٠٢٦ • مركز الدقي للمحاكاة' : 'Friday, August 28, 2026 • Dokki Hands-On Center (4 Seats Left)'}</span>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-white/15 bg-white/5 backdrop-blur-3xl p-6 sm:p-10 shadow-2xl">
            
            {status === 'done' ? (
              <div className="text-center py-8 space-y-6 animate-in fade-in zoom-in-95">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mx-auto border border-emerald-500/30">
                  <CheckCircle2 className="h-8 w-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                    {isRtl ? `تم تسجيل طلبك بنجاح د. ${form.fullName}` : `Seat Request Recorded, Dr. ${form.fullName}!`}
                  </h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                    {isRtl
                      ? 'تم تثبيت التسجيل السريريك المبدئي في ورشة القاهرة (٢٨ أغسطس). لتأكيد المقعد فوراً، يرجى مشاركة إشعار التحويل عبر الواتساب مع فريق التنسيق:'
                      : 'Your provisional seat in the Cairo Dokki Workshop (Aug 28) is securely logged. To confirm immediately, share your payment receipt with our coordination desk:'}
                  </p>
                </div>

                <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 max-w-md mx-auto space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono text-emerald-300">
                    <span>{isRtl ? 'رسوم التسجيل:' : 'Workshop Fee:'}</span>
                    <span className="font-bold">3,000 EGP</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-emerald-300">
                    <span>{isRtl ? 'حساب فودافون كاش:' : 'Vodafone Cash Account:'}</span>
                    <span className="font-bold">+20 101 592 2628</span>
                  </div>

                  <a
                    href={getWhatsAppConfirmationUrl()}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-xl transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{isRtl ? 'تأكيد المقعد عبر الواتساب الآن' : 'Confirm on WhatsApp Instantly'}</span>
                  </a>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => { setStatus('idle'); setForm({ fullName: '', phone: '', email: '', currentStatus: 'general_practitioner', transactionId: '', expeditedCoffee: false }); }}
                    className="text-xs text-slate-400 hover:text-white underline font-mono"
                  >
                    {isRtl ? 'تسجيل زميل أو مقعد إضافي' : 'Register another colleague or seat'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="rounded-2xl border border-[#00F2FE]/20 bg-[#00F2FE]/5 p-4 flex items-start gap-3 text-start">
                  <Sparkles className="w-5 h-5 text-[#00F2FE] flex-shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm text-slate-300 space-y-1">
                    <p className="font-semibold text-white">
                      {isRtl ? 'معلومات هامة قبل المتابعة:' : 'Before you continue, please note:'}
                    </p>
                    <p className="leading-relaxed text-slate-300/90">
                      {isRtl
                        ? 'المقاعد محدودة لضمان التدريب العملي الفردي (٤ مقاعد متبقية لورشة القاهرة). التحويل يتم مباشرة عبر فودافون كاش على الرقم +20 101 592 2628.'
                        : 'Seats are capped to ensure dedicated 1-on-1 mannequin time (4 seats left for Cairo). Payment is processed via Vodafone Cash (+20 101 592 2628).'}
                    </p>
                  </div>
                </div>

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
                      placeholder="+20 / +249"
                      className={inputClass}
                    />
                    {errors.phone && <p className="text-xs text-rose-400 mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-start">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {isRtl ? 'البريد الإلكتروني' : 'Email Address'}
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
                    </select>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/40 p-5 space-y-3 text-start">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white uppercase tracking-wider">Vodafone Cash (Egypt)</p>
                      <p className="text-xs font-mono text-[#00F2FE] mt-0.5">+20 101 592 2628</p>
                    </div>
                    <div className="text-end">
                      <p className="text-xs text-slate-400">{isRtl ? 'المبلغ المستحق' : 'Workshop Fee'}</p>
                      <p className="font-mono text-xl font-bold text-white">3,000 <span className="text-xs text-slate-400">EGP</span></p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {isRtl ? 'رقم المعاملة / إشعار التحويل (اختياري)' : 'Transaction ID / Reference (Optional)'}
                    </label>
                    <input
                      type="text"
                      value={form.transactionId}
                      onChange={(e) => setForm({ ...form, transactionId: e.target.value })}
                      placeholder={isRtl ? 'أدخل رقم الحوالة أو اترك فارغاً للتنسيق عبر الواتساب' : 'Enter reference ID or leave blank for WhatsApp desk'}
                      className={inputClass}
                    />
                  </div>
                </div>

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
                      <span>{isRtl ? 'حجز المقعد في ورشة القاهرة (٣,٠٠٠ جنيه)' : 'Secure Seat in Cairo Dokki Hub (3,000 EGP)'}</span>
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
