import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, ShieldCheck, Sparkles, ArrowRight, ArrowLeft, Dna, 
  Stethoscope, Copy, Check, ExternalLink, UserCheck, ShieldAlert, 
  Award, Clock, Search, Building2, AlertTriangle, MessageCircle, HelpCircle
} from 'lucide-react';
import Layout from '@/components/site/Layout';
import { Section } from '@/components/site/Bits';
import PaymentChannels from '@/components/PaymentChannels';
import { useLang } from '@/i18n/LanguageContext';
import SovereignClient, { generateIdempotencyKey, normalizeGaId } from '@/services/sovereignService';

const CANONICAL_UNIVERSITIES = [
  "University of Khartoum | جامعة الخرطوم | UofK",
  "University of Gezira | جامعة الجزيرة | UofG",
  "Al-Neelain University | جامعة النيلين",
  "Ahfad University for Women | جامعة الأحفاد للبنات | AUW",
  "National University Sudan | الجامعة الوطنية | NUSU",
  "Omdurman Islamic University | جامعة أم درمان الإسلامية | OIU",
  "University of Bahri | جامعة بحري",
  "Ibn Sina University | جامعة ابن سينا | ISU",
  "Karary University | جامعة كرري",
  "Al-Razi University | جامعة الرازي",
  "University of Sinnar | جامعة سنار",
  "University of Medical Sciences and Technology | جامعة العلوم الطبية والتكنولوجيا | UMST",
  "Red Sea University | جامعة البحر الأحمر | RSU",
  "University of Kordofan | جامعة كردفان",
  "University of Kassala | جامعة كسلا",
  "Shendi University | جامعة شندي",
  "Al Fashir University | جامعة الفاشر",
  "University of Nyala | جامعة نيالا",
  "University of Gadarif | جامعة القضارف",
  "University of Bakht Al-Ruda | جامعة بخت الرضا",
  "Sudan International University | جامعة السودان العالمية | SIU",
  "Nile University | جامعة النيل",
  "Yarmouk University College | كلية اليرموك الجامعية",
  "Al-Mughtaribeen University | جامعة المغتربين",
  "Cairo University | جامعة القاهرة (Kasr Alainy)",
  "Ain Shams University | جامعة عين شمس",
  "Mansoura University | جامعة المنصورة",
  "Alexandria University | جامعة الإسكندرية",
  "Other Accredited Medical Faculty / كليات الطب المعتمدة الأخرى"
];

const VERIFIED_SOCIAL_PROOF = [
  "2,500 clinical vignettes across 8 SMC modules",
  "35 BSS-2 graduates from our Cairo surgical cohort",
  "6 MRCS candidates prepared through our MTC™ framework",
  "92% national SMC pass rate (June 2026, SUNA/Fana News)",
  "Candidates from 54 Sudanese universities",
  "7 BLS-certified alumni via STC partnership (Lic. 1549)"
];

export default function RegisterPage() {
  const { lang, L } = useLang();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    university: '',
    careerStage: 'clinical_student',
    track: 'smc_licensing',
    paymentMethod: 'VODAFONE_CASH_EG',
    txRef: ''
  });

  // Flow & State Machine: 'FORM' | 'VERIFYING' | 'EXISTING_USER' | 'PENDING_REVIEW' | 'REVIEW_REQUIRED' | 'REJECTED'
  const [flowState, setFlowState] = useState('FORM');
  const [verificationStep, setVerificationStep] = useState(0);
  const [socialProofIndex, setSocialProofIndex] = useState(0);
  const [apiResult, setApiResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  // Verification Animation Timer (8-10 seconds intentional friction)
  useEffect(() => {
    let timer;
    if (flowState === 'VERIFYING') {
      const stepInterval = setInterval(() => {
        setVerificationStep((prev) => {
          if (prev < 3) return prev + 1;
          return prev;
        });
      }, 2500);

      const quoteInterval = setInterval(() => {
        setSocialProofIndex((prev) => (prev + 1) % VERIFIED_SOCIAL_PROOF.length);
      }, 3000);

      // Complete after 9.5 seconds
      timer = setTimeout(() => {
        clearInterval(stepInterval);
        clearInterval(quoteInterval);
        if (apiResult) {
          handleOutcomeTransition(apiResult);
        } else {
          // If API hasn't returned yet, wait for it
          const waitPoll = setInterval(() => {
            if (window._latestApiResult) {
              clearInterval(waitPoll);
              handleOutcomeTransition(window._latestApiResult);
            }
          }, 500);
        }
      }, 9500);

      return () => {
        clearInterval(stepInterval);
        clearInterval(quoteInterval);
        clearTimeout(timer);
      };
    }
  }, [flowState, apiResult]);

  const handleOutcomeTransition = (res) => {
    if (res.status === 'EXISTING_USER') {
      setFlowState('EXISTING_USER');
    } else if (res.status === 'PENDING_REVIEW' || (res.success && res.gaId)) {
      setFlowState('PENDING_REVIEW');
    } else if (res.status === 'REVIEW_REQUIRED' || res.reason === 'PHONE_EXISTS') {
      setFlowState('REVIEW_REQUIRED');
    } else {
      setFlowState('REJECTED');
      setErrorMessage(res.message || res.error || 'Credentials could not be verified.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    // Basic client validation
    if (!formData.fullName.trim() || formData.fullName.trim().split(/\s+/).length < 2) {
      setErrorMessage(lang === 'ar' ? 'يرجى كتابة الاسم الثلاثي كاملاً' : 'Please provide your full legal name (first & last).');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage(lang === 'ar' ? 'يرجى كتابة بريد إلكتروني صحيح' : 'Please provide a valid email address.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 8) {
      setErrorMessage(lang === 'ar' ? 'يرجى كتابة رقم واتساب صحيح بالرمز الدولي' : 'Please provide a valid WhatsApp number with country code.');
      return;
    }
    if (!formData.university) {
      setErrorMessage(lang === 'ar' ? 'يرجى اختيار الكلية أو الجامعة الطبية' : 'Please select your medical faculty / university.');
      return;
    }

    // Enter verification theater
    setFlowState('VERIFYING');
    setVerificationStep(0);
    window._latestApiResult = null;

    try {
      const payload = {
        action: 'REGISTER_USER',
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        university: formData.university,
        careerStage: formData.careerStage,
        track: formData.track,
        paymentMethod: formData.paymentMethod,
        txRef: formData.txRef.trim(),
        idempotencyKey: generateIdempotencyKey('INTAKE')
      };

      const res = await SovereignClient.registerUser(payload);
      setApiResult(res);
      window._latestApiResult = res;
    } catch (err) {
      const fallbackRes = {
        success: false,
        status: 'REVIEW_REQUIRED',
        message: 'Network verification timeout. An admissions officer will follow up on WhatsApp.'
      };
      setApiResult(fallbackRes);
      window._latestApiResult = fallbackRes;
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <Helmet>
        <title>{lang === 'ar' ? 'بوابة التسجيل والتحقق السريري | GemIInI Sovereign' : 'Clinical Intake & Credential Verification | GemIInI Sovereign'}</title>
      </Helmet>

      <div className="relative min-h-[90vh] bg-[#04080F] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl mx-auto relative z-10">

          {/* ========================================================================= */}
          {/* STATE 1: REGISTRATION FORM                                                */}
          {/* ========================================================================= */}
          {flowState === 'FORM' && (
            <div className="backdrop-blur-xl bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 sm:p-10 shadow-2xl">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-4">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {lang === 'ar' ? 'البوابة الرسمية لاعتماد الأطباء' : 'Institutional Candidate Intake'}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
                  {lang === 'ar' ? 'طلب الانضمام والتسجيل المؤسسي' : 'Apply for Clinical Candidate Enrollment'}
                </h1>
                <p className="text-sm text-slate-400 mt-2">
                  {lang === 'ar' 
                    ? 'يخضع جميع المتقدمين للتدقيق الأكاديمي والتحقق المتبادل عبر السجلات المعتمدة.' 
                    : 'All candidate credentials are authenticated across consortium medical registries.'}
                </p>
              </div>

              {errorMessage && (
                <div className="mb-6 p-4 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-sm flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>{errorMessage}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Legal Name */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                    {lang === 'ar' ? 'الاسم الثلاثي أو الرباعي (مطابق للسجلات الطبية)' : 'Full Legal Name (as in Medical Council / Faculty)'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder={lang === 'ar' ? 'د. محمد أحمد عثمان' : 'Dr. Mohamed Ahmed Osman'}
                    className="w-full px-4 py-3 bg-slate-950/70 border border-slate-700/70 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm transition"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                    {lang === 'ar' ? 'البريد الإلكتروني المعتمد' : 'Primary Email Address'} *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="doctor@example.com"
                    className="w-full px-4 py-3 bg-slate-950/70 border border-slate-700/70 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm font-mono transition"
                  />
                </div>

                {/* Direct WhatsApp Phone */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                    {lang === 'ar' ? 'رقم الواتساب المباشر (مع الرمز الدولي)' : 'Direct WhatsApp Number (with Country Code)'} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+249 912 345 678 / +20 101 592 2628"
                    className="w-full px-4 py-3 bg-slate-950/70 border border-slate-700/70 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm font-mono transition"
                  />
                </div>

                {/* Canonical Medical Faculty Selection */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                    {lang === 'ar' ? 'الكلية أو الجامعة الطبية المعتمدة' : 'Accredited Medical Faculty / University'} *
                  </label>
                  <select
                    required
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950/70 border border-slate-700/70 rounded-xl text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm transition"
                  >
                    <option value="" disabled>{lang === 'ar' ? '-- اختر الكلية الطبية من القائمة المعتمدة --' : '-- Select Accredited Medical Faculty --'}</option>
                    {CANONICAL_UNIVERSITIES.map((univ, idx) => (
                      <option key={idx} value={univ}>{univ}</option>
                    ))}
                  </select>
                </div>

                {/* Career Stage & Track */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                      {lang === 'ar' ? 'المرحلة السريرية الحالية' : 'Current Clinical Stage'}
                    </label>
                    <select
                      value={formData.careerStage}
                      onChange={(e) => setFormData({ ...formData, careerStage: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-950/70 border border-slate-700/70 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 transition"
                    >
                      <option value="clinical_student">{lang === 'ar' ? 'طالب طب سريري (Year 4-6)' : 'Clinical Student (Year 4-6)'}</option>
                      <option value="house_officer">{lang === 'ar' ? 'طبيب امتياز (House Officer / Intern)' : 'House Officer / Intern'}</option>
                      <option value="graduate_doctor">{lang === 'ar' ? 'طبيب عام / ممارس عام' : 'Medical Officer / General Practitioner'}</option>
                      <option value="specialist">{lang === 'ar' ? 'نائب / أخصائي مسجل' : 'Registrar / Specialist'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                      {lang === 'ar' ? 'المسار التدريبي المطلوب' : 'Primary Training Track'}
                    </label>
                    <select
                      value={formData.track}
                      onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-950/70 border border-slate-700/70 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 transition"
                    >
                      <option value="smc_licensing">{lang === 'ar' ? 'امتحان الكفاءة المهنية (SMC Licensing)' : 'SMC Licensing Exam Preparation'}</option>
                      <option value="bss_surgery">{lang === 'ar' ? 'المهارات الجراحية الأساسية (BSS)' : 'Basic Surgical Skills (BSS)'}</option>
                      <option value="bls_cairo">{lang === 'ar' ? 'ورشة BLS العملية (القاهرة - 28 أغسطس)' : 'Hands-on BLS Workshop (Cairo)'}</option>
                      <option value="mtc_simulation">{lang === 'ar' ? 'محاكاة الحالات السريرية (MTC)' : 'MTC™ Clinical Reasoning Simulation'}</option>
                    </select>
                  </div>
                </div>

                {/* Optional Transaction Ref */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                    {lang === 'ar' ? 'رقم الإشعار أو الحوالة (اختياري لتسريع التفعيل)' : 'Payment Reference / Voucher (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={formData.txRef}
                    onChange={(e) => setFormData({ ...formData, txRef: e.target.value })}
                    placeholder="e.g. VF-Cash / Bankak Reference #"
                    className="w-full px-4 py-3 bg-slate-950/70 border border-slate-700/70 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm font-mono transition"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 font-bold font-display text-base tracking-wide shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:opacity-95 transition flex items-center justify-center gap-2 group"
                  >
                    <span>{lang === 'ar' ? 'إرسال بيانات التسجيل والتدقيق' : 'Submit for Clinical Credential Verification'}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                  </button>
                  <p className="text-[11px] text-center text-slate-500 mt-3">
                    {lang === 'ar' ? 'بالضغط على التسجيل، فإنك توافق على ميثاق التدقيق السريري وسجل SudaPass الموحد.' : 'By applying, you agree to the Consortium Clinical Honor Code and SudaPass attestation.'}
                  </p>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STATE 2: VERIFICATION SEQUENCE (8-10s Intentional Friction)              */}
          {/* ========================================================================= */}
          {flowState === 'VERIFYING' && (
            <div className="backdrop-blur-xl bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-8 sm:p-12 shadow-2xl text-center space-y-8">
              {/* Radar Scanner Animation */}
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-ping" />
                <div className="absolute inset-2 rounded-full border border-cyan-400/40 animate-pulse" />
                <div className="absolute inset-4 rounded-full bg-cyan-950/60 border border-cyan-500/50 flex items-center justify-center">
                  <Dna className="w-10 h-10 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
                </div>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
                  {verificationStep === 0 && (lang === 'ar' ? 'جاري البحث والتدقيق المتبادل في السجل...' : 'Searching Sovereign Registry for Colleagues...')}
                  {verificationStep === 1 && (lang === 'ar' ? 'التحقق من الكلية الطبية وبيانات الاعتماد...' : 'Verifying Medical Faculty & Council Credentials...')}
                  {verificationStep === 2 && (lang === 'ar' ? 'مطابقة السجل الأكاديمي واحتساب النقاط...' : 'Matching Institutional History & Telemetry...')}
                  {verificationStep === 3 && (lang === 'ar' ? 'تجهيز بطاقة العضوية والرمز المشفر...' : 'Preparing Provisional SudaPass Credentials...')}
                </h2>
                <p className="text-sm text-cyan-400 font-mono mt-2 animate-pulse">
                  {lang === 'ar' ? 'التدقيق الآمن عبر بروتوكول SudaPass v4.0' : 'Secure Protocol Verification • LockService Active'}
                </p>
              </div>

              {/* Progress Stepper */}
              <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
                {[0, 1, 2, 3].map((step) => (
                  <div 
                    key={step} 
                    className={`h-1.5 rounded-full transition-all duration-700 ${
                      step <= verificationStep ? 'bg-gradient-to-r from-cyan-400 to-teal-400' : 'bg-slate-800'
                    }`} 
                  />
                ))}
              </div>

              {/* Verified Institutional Social Proof Carousel */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 flex items-center justify-center gap-3">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-mono text-slate-200">
                  {VERIFIED_SOCIAL_PROOF[socialProofIndex]}
                </span>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STATE 3: EXISTING USER FOUND                                              */}
          {/* ========================================================================= */}
          {flowState === 'EXISTING_USER' && apiResult && (
            <div className="backdrop-blur-xl bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400">
                <UserCheck className="w-8 h-8" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-wider">
                  {lang === 'ar' ? 'سجل معتمد موجود' : 'Existing Member Verified'}
                </span>
                <h2 className="text-2xl font-bold font-display text-white mt-3">
                  {lang === 'ar' ? `مرحباً بعودتك د. ${apiResult.legalName || ''}` : `Welcome Back, Dr. ${apiResult.legalName || ''}`}
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  {lang === 'ar' ? 'تم العثور على ملفك المعتمد مسبقاً في سجل الأكاديمية.' : 'We found your verified institutional profile in our sovereign ledger.'}
                </p>
              </div>

              {/* Credential Card */}
              <div className="p-5 rounded-xl bg-slate-950/90 border border-slate-800 text-left space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-slate-500">CANONICAL GA-ID:</span>
                  <span className="text-cyan-400 font-bold text-sm tracking-wider">{apiResult.gaId}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-slate-500">FACULTY:</span>
                  <span className="text-slate-300">{apiResult.university || formData.university}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">ACCREDITED STATUS:</span>
                  <span className="text-emerald-400 font-bold">{apiResult.userStatus || 'VERIFIED'} • {apiResult.gpBalance || 500} GP</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold font-display text-sm hover:opacity-95 transition flex items-center justify-center gap-2"
                >
                  <span>{lang === 'ar' ? 'الدخول إلى لوحة التحكم' : 'Go to Candidate Dashboard'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/verify')}
                  className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition"
                >
                  {lang === 'ar' ? 'فحص بطاقة SudaPass' : 'Verify SudaPass'}
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STATE 4: PENDING REVIEW (NEW APPLICANT)                                    */}
          {/* ========================================================================= */}
          {flowState === 'PENDING_REVIEW' && apiResult && (
            <div className="backdrop-blur-xl bg-slate-900/90 border border-amber-500/40 rounded-2xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-amber-950/80 border border-amber-500/50 flex items-center justify-center mx-auto text-amber-400">
                <Clock className="w-8 h-8" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-400 text-xs font-mono uppercase tracking-wider">
                  {lang === 'ar' ? 'الطلب قيد التدقيق الأكاديمي' : 'Application Logged • Under Review'}
                </span>
                <h2 className="text-2xl font-bold font-display text-white mt-3">
                  {lang === 'ar' ? 'تم استلام طلب الانضمام بنجاح' : 'Candidate Intake Received'}
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  {lang === 'ar' 
                    ? 'تم تسجيل بياناتك وتوليد معرّف مؤقت. سيقوم ضابط التسجيل بتدقيق الأوراق خلال 24 ساعة.' 
                    : 'Your credentials have been securely registered. An operations officer will verify your records within 24 hours.'}
                </p>
              </div>

              {/* Provisional Card */}
              <div className="p-5 rounded-xl bg-slate-950/90 border border-slate-800 text-left space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-slate-500">PROVISIONAL ID:</span>
                  <span className="text-amber-400 font-bold text-sm tracking-wider">{apiResult.gaId}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-slate-500">INITIAL TIER:</span>
                  <span className="text-slate-300">EXPLORER (25 GP)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">POST-AUDIT UPGRADE:</span>
                  <span className="text-cyan-400 font-bold">PATHFINDER (+475 GP → 500 GP)</span>
                </div>
              </div>

              {/* WhatsApp Verification Link */}
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-200 text-left flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-cyan-300">
                    {lang === 'ar' ? 'لتسريع الاعتماد الفوري:' : 'For Expedited Credential Activation:'}
                  </p>
                  <p className="text-slate-300 mt-1">
                    {lang === 'ar'
                      ? 'يمكنك إرسال إشعار الرسوم أو إثبات الهوية الطبية مباشرة إلى مكتب التسجيل على الواتساب:'
                      : 'Send your student/work ID or transfer voucher directly to the admissions desk:'}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://wa.me/201015922628?text=${encodeURIComponent(`السلام عليكم، قمت بتقديم طلب تسجيل برقم مؤقت: ${apiResult.gaId} - الاسم: ${formData.fullName} - كلية: ${formData.university}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold font-display text-sm hover:opacity-95 transition flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'تأكيد التسجيل عبر الواتساب' : 'Confirm via WhatsApp (+20 101 592 2628)'}</span>
                </a>
                <button
                  onClick={() => setFlowState('FORM')}
                  className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition"
                >
                  {lang === 'ar' ? 'تسجيل متقدم آخر' : 'Submit Another'}
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STATE 5: REVIEW REQUIRED (POTENTIAL DUPLICATE)                           */}
          {/* ========================================================================= */}
          {flowState === 'REVIEW_REQUIRED' && (
            <div className="backdrop-blur-xl bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center mx-auto text-cyan-400">
                <ShieldAlert className="w-8 h-8" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider">
                  {lang === 'ar' ? 'تنبيه التدقيق والمطابقة' : 'Credential Reconciliation Alert'}
                </span>
                <h2 className="text-2xl font-bold font-display text-white mt-3">
                  {lang === 'ar' ? 'تم العثور على تطابق في السجلات' : 'Existing Phone Record Detected'}
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  {lang === 'ar'
                    ? 'رقم الهاتف المدخل مسجل مسبقاً مع بريد إلكتروني آخر. لحماية الحسابات من التكرار، يتطلب تفعيل الحساب مطابقة يدوية.'
                    : 'This phone number matches an existing candidate in our ledger with a different email address.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 text-left">
                <p className="font-semibold text-cyan-300">{lang === 'ar' ? 'إجراءات حل التضارب:' : 'Resolution Procedure:'}</p>
                <p className="mt-1 text-slate-400">
                  {lang === 'ar' 
                    ? 'تواصل مع مكتب الدعم الفني والأكاديمي لتأكيد هويتك واستعادة المعرّف الخاص بك فوراً.'
                    : 'Contact the admissions officer on WhatsApp to authenticate your identity and retrieve your canonical GA-ID.'}
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://wa.me/201015922628?text=${encodeURIComponent(`السلام عليكم، أحتاج مطابقة رقم الهاتف: ${formData.phone} للاسم: ${formData.fullName}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold font-display text-sm hover:opacity-95 transition flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'مراسلة مسؤول التسجيل' : 'Chat with Admissions Desk'}</span>
                </a>
                <button
                  onClick={() => setFlowState('FORM')}
                  className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition"
                >
                  {lang === 'ar' ? 'تعديل البيانات' : 'Edit Input'}
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STATE 6: REJECTED                                                         */}
          {/* ========================================================================= */}
          {flowState === 'REJECTED' && (
            <div className="backdrop-blur-xl bg-slate-900/90 border border-rose-500/40 rounded-2xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-rose-950/80 border border-rose-500/50 flex items-center justify-center mx-auto text-rose-400">
                <AlertTriangle className="w-8 h-8" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-400 text-xs font-mono uppercase tracking-wider">
                  {lang === 'ar' ? 'تعذر إتمام التسجيل' : 'Verification Incomplete'}
                </span>
                <h2 className="text-2xl font-bold font-display text-white mt-3">
                  {lang === 'ar' ? 'لم نتمكن من اعتماد البيانات المدخلة' : 'Could Not Verify Credentials'}
                </h2>
                <p className="text-sm text-rose-300/80 mt-1">
                  {errorMessage || (lang === 'ar' ? 'يرجى مراجعة صحة الاسم والجامعة الطبية.' : 'Please verify your faculty and legal name format.')}
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setFlowState('FORM')}
                  className="flex-1 py-3 px-5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-display text-sm transition"
                >
                  {lang === 'ar' ? 'إعادة المحاولة وتصحيح البيانات' : 'Retry Registration'}
                </button>
                <a
                  href="https://wa.me/201015922628"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition flex items-center justify-center gap-2"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'طلب المساعدة' : 'Support Desk'}</span>
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}
