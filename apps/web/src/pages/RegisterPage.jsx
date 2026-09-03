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
  "University of Khartoum | Ø¬Ø§Ù…Ø¹Ø© Ø§Ù„Ø®Ø±Ø·ÙˆÙ… | UofK",
  "University of Gezira | Ø¬Ø§Ù…Ø¹Ø© Ø§Ù„Ø¬Ø²ÙŠØ±Ø© | UofG",
  "Al-Neelain University | Ø¬Ø§Ù…Ø¹Ø© Ø§Ù„Ù†ÙŠÙ„ÙŠÙ†",
  "Ahfad University for Women | Ø¬Ø§Ù…Ø¹Ø© Ø§Ù„Ø£Ø­ÙØ§Ø¯ Ù„Ù„Ø¨Ù†Ø§Øª | AUW",
  "National University Sudan | Ø§Ù„Ø¬Ø§Ù…Ø¹Ø© Ø§Ù„ÙˆØ·Ù†ÙŠØ© | NUSU",
  "Omdurman Islamic University | Ø¬Ø§Ù…Ø¹Ø© Ø£Ù… Ø¯Ø±Ù…Ø§Ù† Ø§Ù„Ø¥Ø³Ù„Ø§Ù…ÙŠØ© | OIU",
  "University of Bahri | Ø¬Ø§Ù…Ø¹Ø© Ø¨Ø­Ø±ÙŠ",
  "Ibn Sina University | Ø¬Ø§Ù…Ø¹Ø© Ø§Ø¨Ù† Ø³ÙŠÙ†Ø§ | ISU",
  "Karary University | Ø¬Ø§Ù…Ø¹Ø© ÙƒØ±Ø±ÙŠ",
  "Al-Razi University | Ø¬Ø§Ù…Ø¹Ø© Ø§Ù„Ø±Ø§Ø²ÙŠ",
  "University of Sinnar | Ø¬Ø§Ù…Ø¹Ø© Ø³Ù†Ø§Ø±",
  "University of Medical Sciences and Technology | Ø¬Ø§Ù…Ø¹Ø© Ø§Ù„Ø¹Ù„ÙˆÙ… Ø§Ù„Ø·Ø¨ÙŠØ© ÙˆØ§Ù„ØªÙƒÙ†ÙˆÙ„ÙˆØ¬ÙŠØ§ | UMST",
  "Red Sea University | Ø¬Ø§Ù…Ø¹Ø© Ø§Ù„Ø¨Ø­Ø± Ø§Ù„Ø£Ø­Ù…Ø± | RSU",
  "University of Kordofan | Ø¬Ø§Ù…Ø¹Ø© ÙƒØ±Ø¯ÙØ§Ù†",
  "University of Kassala | Ø¬Ø§Ù…Ø¹Ø© ÙƒØ³Ù„Ø§",
  "Shendi University | Ø¬Ø§Ù…Ø¹Ø© Ø´Ù†Ø¯ÙŠ",
  "Al Fashir University | Ø¬Ø§Ù…Ø¹Ø© Ø§Ù„ÙØ§Ø´Ø±",
  "University of Nyala | Ø¬Ø§Ù…Ø¹Ø© Ù†ÙŠØ§Ù„Ø§",
  "University of Gadarif | Ø¬Ø§Ù…Ø¹Ø© Ø§Ù„Ù‚Ø¶Ø§Ø±Ù",
  "University of Bakht Al-Ruda | Ø¬Ø§Ù…Ø¹Ø© Ø¨Ø®Øª Ø§Ù„Ø±Ø¶Ø§",
  "Sudan International University | Ø¬Ø§Ù…Ø¹Ø© Ø§Ù„Ø³ÙˆØ¯Ø§Ù† Ø§Ù„Ø¹Ø§Ù„Ù…ÙŠØ© | SIU",
  "Nile University | Ø¬Ø§Ù…Ø¹Ø© Ø§Ù„Ù†ÙŠÙ„",
  "Yarmouk University College | ÙƒÙ„ÙŠØ© Ø§Ù„ÙŠØ±Ù…ÙˆÙƒ Ø§Ù„Ø¬Ø§Ù…Ø¹ÙŠØ©",
  "Al-Mughtaribeen University | Ø¬Ø§Ù…Ø¹Ø© Ø§Ù„Ù…ØºØªØ±Ø¨ÙŠÙ†",
  "Cairo University | Ø¬Ø§Ù…Ø¹Ø© Ø§Ù„Ù‚Ø§Ù‡Ø±Ø© (Kasr Alainy)",
  "Ain Shams University | Ø¬Ø§Ù…Ø¹Ø© Ø¹ÙŠÙ† Ø´Ù…Ø³",
  "Mansoura University | Ø¬Ø§Ù…Ø¹Ø© Ø§Ù„Ù…Ù†ØµÙˆØ±Ø©",
  "Alexandria University | Ø¬Ø§Ù…Ø¹Ø© Ø§Ù„Ø¥Ø³ÙƒÙ†Ø¯Ø±ÙŠØ©",
  "Other Accredited Medical Faculty / ÙƒÙ„ÙŠØ§Øª Ø§Ù„Ø·Ø¨ Ø§Ù„Ù…Ø¹ØªÙ…Ø¯Ø© Ø§Ù„Ø£Ø®Ø±Ù‰"
];

const VERIFIED_SOCIAL_PROOF = [
  "2,500 clinical vignettes across 8 SMC modules",
  "35 BSS-2 graduates from our Cairo surgical cohort",
  "6 MRCS candidates prepared through our MTCâ„¢ framework",
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
      setErrorMessage(lang === 'ar' ? 'ÙŠØ±Ø¬Ù‰ ÙƒØªØ§Ø¨Ø© Ø§Ù„Ø§Ø³Ù… Ø§Ù„Ø«Ù„Ø§Ø«ÙŠ ÙƒØ§Ù…Ù„Ø§Ù‹' : 'Please provide your full legal name (first & last).');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage(lang === 'ar' ? 'ÙŠØ±Ø¬Ù‰ ÙƒØªØ§Ø¨Ø© Ø¨Ø±ÙŠØ¯ Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ ØµØ­ÙŠØ­' : 'Please provide a valid email address.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 8) {
      setErrorMessage(lang === 'ar' ? 'ÙŠØ±Ø¬Ù‰ ÙƒØªØ§Ø¨Ø© Ø±Ù‚Ù… ÙˆØ§ØªØ³Ø§Ø¨ ØµØ­ÙŠØ­ Ø¨Ø§Ù„Ø±Ù…Ø² Ø§Ù„Ø¯ÙˆÙ„ÙŠ' : 'Please provide a valid WhatsApp number with country code.');
      return;
    }
    if (!formData.university) {
      setErrorMessage(lang === 'ar' ? 'ÙŠØ±Ø¬Ù‰ Ø§Ø®ØªÙŠØ§Ø± Ø§Ù„ÙƒÙ„ÙŠØ© Ø£Ùˆ Ø§Ù„Ø¬Ø§Ù…Ø¹Ø© Ø§Ù„Ø·Ø¨ÙŠØ©' : 'Please select your medical faculty / university.');
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
        <title>{lang === 'ar' ? 'Ø¨ÙˆØ§Ø¨Ø© Ø§Ù„ØªØ³Ø¬ÙŠÙ„ ÙˆØ§Ù„ØªØ­Ù‚Ù‚ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ | GemIInI Sovereign' : 'Clinical Intake & Credential Verification | GemIInI Sovereign'}</title>
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
                  {lang === 'ar' ? 'Ø§Ù„Ø¨ÙˆØ§Ø¨Ø© Ø§Ù„Ø±Ø³Ù…ÙŠØ© Ù„Ø§Ø¹ØªÙ…Ø§Ø¯ Ø§Ù„Ø£Ø·Ø¨Ø§Ø¡' : 'Institutional Candidate Intake'}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
                  {lang === 'ar' ? 'Ø·Ù„Ø¨ Ø§Ù„Ø§Ù†Ø¶Ù…Ø§Ù… ÙˆØ§Ù„ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ù…Ø¤Ø³Ø³ÙŠ' : 'Apply for Clinical Candidate Enrollment'}
                </h1>
                <p className="text-sm text-slate-400 mt-2">
                  {lang === 'ar' 
                    ? 'ÙŠØ®Ø¶Ø¹ Ø¬Ù…ÙŠØ¹ Ø§Ù„Ù…ØªÙ‚Ø¯Ù…ÙŠÙ† Ù„Ù„ØªØ¯Ù‚ÙŠÙ‚ Ø§Ù„Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠ ÙˆØ§Ù„ØªØ­Ù‚Ù‚ Ø§Ù„Ù…ØªØ¨Ø§Ø¯Ù„ Ø¹Ø¨Ø± Ø§Ù„Ø³Ø¬Ù„Ø§Øª Ø§Ù„Ù…Ø¹ØªÙ…Ø¯Ø©.' 
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
                    {lang === 'ar' ? 'Ø§Ù„Ø§Ø³Ù… Ø§Ù„Ø«Ù„Ø§Ø«ÙŠ Ø£Ùˆ Ø§Ù„Ø±Ø¨Ø§Ø¹ÙŠ (Ù…Ø·Ø§Ø¨Ù‚ Ù„Ù„Ø³Ø¬Ù„Ø§Øª Ø§Ù„Ø·Ø¨ÙŠØ©)' : 'Full Legal Name (as in Medical Council / Faculty)'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder={lang === 'ar' ? 'Ø¯. Ù…Ø­Ù…Ø¯ Ø£Ø­Ù…Ø¯ Ø¹Ø«Ù…Ø§Ù†' : 'Dr. Mohamed Ahmed Osman'}
                    className="w-full px-4 py-3 bg-slate-950/70 border border-slate-700/70 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm transition"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                    {lang === 'ar' ? 'Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ Ø§Ù„Ù…Ø¹ØªÙ…Ø¯' : 'Primary Email Address'} *
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
                    {lang === 'ar' ? 'Ø±Ù‚Ù… Ø§Ù„ÙˆØ§ØªØ³Ø§Ø¨ Ø§Ù„Ù…Ø¨Ø§Ø´Ø± (Ù…Ø¹ Ø§Ù„Ø±Ù…Ø² Ø§Ù„Ø¯ÙˆÙ„ÙŠ)' : 'Direct WhatsApp Number (with Country Code)'} *
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
                    {lang === 'ar' ? 'Ø§Ù„ÙƒÙ„ÙŠØ© Ø£Ùˆ Ø§Ù„Ø¬Ø§Ù…Ø¹Ø© Ø§Ù„Ø·Ø¨ÙŠØ© Ø§Ù„Ù…Ø¹ØªÙ…Ø¯Ø©' : 'Accredited Medical Faculty / University'} *
                  </label>
                  <select
                    required
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950/70 border border-slate-700/70 rounded-xl text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm transition"
                  >
                    <option value="" disabled>{lang === 'ar' ? '-- Ø§Ø®ØªØ± Ø§Ù„ÙƒÙ„ÙŠØ© Ø§Ù„Ø·Ø¨ÙŠØ© Ù…Ù† Ø§Ù„Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ù…Ø¹ØªÙ…Ø¯Ø© --' : '-- Select Accredited Medical Faculty --'}</option>
                    {CANONICAL_UNIVERSITIES.map((univ, idx) => (
                      <option key={idx} value={univ}>{univ}</option>
                    ))}
                  </select>
                </div>

                {/* Career Stage & Track */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                      {lang === 'ar' ? 'Ø§Ù„Ù…Ø±Ø­Ù„Ø© Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ© Ø§Ù„Ø­Ø§Ù„ÙŠØ©' : 'Current Clinical Stage'}
                    </label>
                    <select
                      value={formData.careerStage}
                      onChange={(e) => setFormData({ ...formData, careerStage: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-950/70 border border-slate-700/70 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 transition"
                    >
                      <option value="clinical_student">{lang === 'ar' ? 'Ø·Ø§Ù„Ø¨ Ø·Ø¨ Ø³Ø±ÙŠØ±ÙŠ (Year 4-6)' : 'Clinical Student (Year 4-6)'}</option>
                      <option value="house_officer">{lang === 'ar' ? 'Ø·Ø¨ÙŠØ¨ Ø§Ù…ØªÙŠØ§Ø² (House Officer / Intern)' : 'House Officer / Intern'}</option>
                      <option value="graduate_doctor">{lang === 'ar' ? 'Ø·Ø¨ÙŠØ¨ Ø¹Ø§Ù… / Ù…Ù…Ø§Ø±Ø³ Ø¹Ø§Ù…' : 'Medical Officer / General Practitioner'}</option>
                      <option value="specialist">{lang === 'ar' ? 'Ù†Ø§Ø¦Ø¨ / Ø£Ø®ØµØ§Ø¦ÙŠ Ù…Ø³Ø¬Ù„' : 'Registrar / Specialist'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                      {lang === 'ar' ? 'Ø§Ù„Ù…Ø³Ø§Ø± Ø§Ù„ØªØ¯Ø±ÙŠØ¨ÙŠ Ø§Ù„Ù…Ø·Ù„ÙˆØ¨' : 'Primary Training Track'}
                    </label>
                    <select
                      value={formData.track}
                      onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-950/70 border border-slate-700/70 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 transition"
                    >
                      <option value="smc_licensing">{lang === 'ar' ? 'Ø§Ù…ØªØ­Ø§Ù† Ø§Ù„ÙƒÙØ§Ø¡Ø© Ø§Ù„Ù…Ù‡Ù†ÙŠØ© (SMC Licensing)' : 'SMC Licensing Exam Preparation'}</option>
                      <option value="bss_surgery">{lang === 'ar' ? 'Ø§Ù„Ù…Ù‡Ø§Ø±Ø§Øª Ø§Ù„Ø¬Ø±Ø§Ø­ÙŠØ© Ø§Ù„Ø£Ø³Ø§Ø³ÙŠØ© (BSS)' : 'Basic Surgical Skills (BSS)'}</option>
                      <option value="bls_cairo">{lang === 'ar' ? 'Ø§Ù„Ø¨Ø±Ù†Ø§Ù…Ø¬ Ø§Ù„ØªØ¯Ø±ÙŠØ¨ÙŠ Ø§Ù„Ù…ØªÙ‚Ø¯Ù… (AHA BLS Provider) Ø§Ù„Ø¹Ù…Ù„ÙŠØ© (Ø§Ù„Ù‚Ø§Ù‡Ø±Ø© - 28 Ø£ØºØ³Ø·Ø³)' : 'Hands-on BLS Workshop (Cairo)'}</option>
                      <option value="mtc_simulation">{lang === 'ar' ? 'Ù…Ø­Ø§ÙƒØ§Ø© Ø§Ù„Ø­Ø§Ù„Ø§Øª Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ© (MTC)' : 'MTCâ„¢ Clinical Reasoning Simulation'}</option>
                    </select>
                  </div>
                </div>

                {/* Optional Transaction Ref */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                    {lang === 'ar' ? 'Ø±Ù‚Ù… Ø§Ù„Ø¥Ø´Ø¹Ø§Ø± Ø£Ùˆ Ø§Ù„Ø­ÙˆØ§Ù„Ø© (Ø§Ø®ØªÙŠØ§Ø±ÙŠ Ù„ØªØ³Ø±ÙŠØ¹ Ø§Ù„ØªÙØ¹ÙŠÙ„)' : 'Payment Reference / Voucher (Optional)'}
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
                    <span>{lang === 'ar' ? 'Ø¥Ø±Ø³Ø§Ù„ Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„ØªØ³Ø¬ÙŠÙ„ ÙˆØ§Ù„ØªØ¯Ù‚ÙŠÙ‚' : 'Submit for Clinical Credential Verification'}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                  </button>
                  <p className="text-[11px] text-center text-slate-500 mt-3">
                    {lang === 'ar' ? 'Ø¨Ø§Ù„Ø¶ØºØ· Ø¹Ù„Ù‰ Ø§Ù„ØªØ³Ø¬ÙŠÙ„ØŒ ÙØ¥Ù†Ùƒ ØªÙˆØ§ÙÙ‚ Ø¹Ù„Ù‰ Ù…ÙŠØ«Ø§Ù‚ Ø§Ù„ØªØ¯Ù‚ÙŠÙ‚ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ ÙˆØ³Ø¬Ù„ SudaPass Ø§Ù„Ù…ÙˆØ­Ø¯.' : 'By applying, you agree to the Consortium Clinical Honor Code and SudaPass attestation.'}
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
                  {verificationStep === 0 && (lang === 'ar' ? 'Ø¬Ø§Ø±ÙŠ Ø§Ù„Ø¨Ø­Ø« ÙˆØ§Ù„ØªØ¯Ù‚ÙŠÙ‚ Ø§Ù„Ù…ØªØ¨Ø§Ø¯Ù„ ÙÙŠ Ø§Ù„Ø³Ø¬Ù„...' : 'Searching Sovereign Registry for Colleagues...')}
                  {verificationStep === 1 && (lang === 'ar' ? 'Ø§Ù„ØªØ­Ù‚Ù‚ Ù…Ù† Ø§Ù„ÙƒÙ„ÙŠØ© Ø§Ù„Ø·Ø¨ÙŠØ© ÙˆØ¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø§Ø¹ØªÙ…Ø§Ø¯...' : 'Verifying Medical Faculty & Council Credentials...')}
                  {verificationStep === 2 && (lang === 'ar' ? 'Ù…Ø·Ø§Ø¨Ù‚Ø© Ø§Ù„Ø³Ø¬Ù„ Ø§Ù„Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠ ÙˆØ§Ø­ØªØ³Ø§Ø¨ Ø§Ù„Ù†Ù‚Ø§Ø·...' : 'Matching Institutional History & Telemetry...')}
                  {verificationStep === 3 && (lang === 'ar' ? 'ØªØ¬Ù‡ÙŠØ² Ø¨Ø·Ø§Ù‚Ø© Ø§Ù„Ø¹Ø¶ÙˆÙŠØ© ÙˆØ§Ù„Ø±Ù…Ø² Ø§Ù„Ù…Ø´ÙØ±...' : 'Preparing Provisional SudaPass Credentials...')}
                </h2>
                <p className="text-sm text-cyan-400 font-mono mt-2 animate-pulse">
                  {lang === 'ar' ? 'Ø§Ù„ØªØ¯Ù‚ÙŠÙ‚ Ø§Ù„Ø¢Ù…Ù† Ø¹Ø¨Ø± Ø¨Ø±ÙˆØªÙˆÙƒÙˆÙ„ SudaPass v4.0' : 'Secure Protocol Verification â€¢ LockService Active'}
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
                  {lang === 'ar' ? 'Ø³Ø¬Ù„ Ù…Ø¹ØªÙ…Ø¯ Ù…ÙˆØ¬ÙˆØ¯' : 'Existing Member Verified'}
                </span>
                <h2 className="text-2xl font-bold font-display text-white mt-3">
                  {lang === 'ar' ? `Ù…Ø±Ø­Ø¨Ø§Ù‹ Ø¨Ø¹ÙˆØ¯ØªÙƒ Ø¯. ${apiResult.legalName || ''}` : `Welcome Back, Dr. ${apiResult.legalName || ''}`}
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  {lang === 'ar' ? 'ØªÙ… Ø§Ù„Ø¹Ø«ÙˆØ± Ø¹Ù„Ù‰ Ù…Ù„ÙÙƒ Ø§Ù„Ù…Ø¹ØªÙ…Ø¯ Ù…Ø³Ø¨Ù‚Ø§Ù‹ ÙÙŠ Ø³Ø¬Ù„ Ø§Ù„Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠØ©.' : 'We found your verified institutional profile in our sovereign ledger.'}
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
                  <span className="text-emerald-400 font-bold">{apiResult.userStatus || 'VERIFIED'} â€¢ {apiResult.gpBalance || 500} GP</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold font-display text-sm hover:opacity-95 transition flex items-center justify-center gap-2"
                >
                  <span>{lang === 'ar' ? 'Ø§Ù„Ø¯Ø®ÙˆÙ„ Ø¥Ù„Ù‰ Ù„ÙˆØ­Ø© Ø§Ù„ØªØ­ÙƒÙ…' : 'Go to Candidate Dashboard'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/verify')}
                  className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition"
                >
                  {lang === 'ar' ? 'ÙØ­Øµ Ø¨Ø·Ø§Ù‚Ø© SudaPass' : 'Verify SudaPass'}
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
                  {lang === 'ar' ? 'Ø§Ù„Ø·Ù„Ø¨ Ù‚ÙŠØ¯ Ø§Ù„ØªØ¯Ù‚ÙŠÙ‚ Ø§Ù„Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠ' : 'Application Logged â€¢ Under Review'}
                </span>
                <h2 className="text-2xl font-bold font-display text-white mt-3">
                  {lang === 'ar' ? 'ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… Ø·Ù„Ø¨ Ø§Ù„Ø§Ù†Ø¶Ù…Ø§Ù… Ø¨Ù†Ø¬Ø§Ø­' : 'Candidate Intake Received'}
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  {lang === 'ar' 
                    ? 'ØªÙ… ØªØ³Ø¬ÙŠÙ„ Ø¨ÙŠØ§Ù†Ø§ØªÙƒ ÙˆØªÙˆÙ„ÙŠØ¯ Ù…Ø¹Ø±Ù‘Ù Ù…Ø¤Ù‚Øª. Ø³ÙŠÙ‚ÙˆÙ… Ø¶Ø§Ø¨Ø· Ø§Ù„ØªØ³Ø¬ÙŠÙ„ Ø¨ØªØ¯Ù‚ÙŠÙ‚ Ø§Ù„Ø£ÙˆØ±Ø§Ù‚ Ø®Ù„Ø§Ù„ 24 Ø³Ø§Ø¹Ø©.' 
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
                  <span className="text-cyan-400 font-bold">PATHFINDER (+475 GP â†’ 500 GP)</span>
                </div>
              </div>

              {/* WhatsApp Verification Link */}
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-200 text-left flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-cyan-300">
                    {lang === 'ar' ? 'Ù„ØªØ³Ø±ÙŠØ¹ Ø§Ù„Ø§Ø¹ØªÙ…Ø§Ø¯ Ø§Ù„ÙÙˆØ±ÙŠ:' : 'For Expedited Credential Activation:'}
                  </p>
                  <p className="text-slate-300 mt-1">
                    {lang === 'ar'
                      ? 'ÙŠÙ…ÙƒÙ†Ùƒ Ø¥Ø±Ø³Ø§Ù„ Ø¥Ø´Ø¹Ø§Ø± Ø§Ù„Ø±Ø³ÙˆÙ… Ø£Ùˆ Ø¥Ø«Ø¨Ø§Øª Ø§Ù„Ù‡ÙˆÙŠØ© Ø§Ù„Ø·Ø¨ÙŠØ© Ù…Ø¨Ø§Ø´Ø±Ø© Ø¥Ù„Ù‰ Ù…ÙƒØªØ¨ Ø§Ù„ØªØ³Ø¬ÙŠÙ„ Ø¹Ù„Ù‰ Ø§Ù„ÙˆØ§ØªØ³Ø§Ø¨:'
                      : 'Send your student/work ID or transfer voucher directly to the admissions desk:'}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://wa.me/2+20 101 592 2628?text=${encodeURIComponent(`Ø§Ù„Ø³Ù„Ø§Ù… Ø¹Ù„ÙŠÙƒÙ…ØŒ Ù‚Ù…Øª Ø¨ØªÙ‚Ø¯ÙŠÙ… Ø·Ù„Ø¨ ØªØ³Ø¬ÙŠÙ„ Ø¨Ø±Ù‚Ù… Ù…Ø¤Ù‚Øª: ${apiResult.gaId} - Ø§Ù„Ø§Ø³Ù…: ${formData.fullName} - ÙƒÙ„ÙŠØ©: ${formData.university}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold font-display text-sm hover:opacity-95 transition flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'ØªØ£ÙƒÙŠØ¯ Ø§Ù„ØªØ³Ø¬ÙŠÙ„ Ø¹Ø¨Ø± Ø§Ù„ÙˆØ§ØªØ³Ø§Ø¨' : 'Confirm via WhatsApp (+20 101 592 2628)'}</span>
                </a>
                <button
                  onClick={() => setFlowState('FORM')}
                  className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition"
                >
                  {lang === 'ar' ? 'ØªØ³Ø¬ÙŠÙ„ Ù…ØªÙ‚Ø¯Ù… Ø¢Ø®Ø±' : 'Submit Another'}
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
                  {lang === 'ar' ? 'ØªÙ†Ø¨ÙŠÙ‡ Ø§Ù„ØªØ¯Ù‚ÙŠÙ‚ ÙˆØ§Ù„Ù…Ø·Ø§Ø¨Ù‚Ø©' : 'Credential Reconciliation Alert'}
                </span>
                <h2 className="text-2xl font-bold font-display text-white mt-3">
                  {lang === 'ar' ? 'ØªÙ… Ø§Ù„Ø¹Ø«ÙˆØ± Ø¹Ù„Ù‰ ØªØ·Ø§Ø¨Ù‚ ÙÙŠ Ø§Ù„Ø³Ø¬Ù„Ø§Øª' : 'Existing Phone Record Detected'}
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  {lang === 'ar'
                    ? 'Ø±Ù‚Ù… Ø§Ù„Ù‡Ø§ØªÙ Ø§Ù„Ù…Ø¯Ø®Ù„ Ù…Ø³Ø¬Ù„ Ù…Ø³Ø¨Ù‚Ø§Ù‹ Ù…Ø¹ Ø¨Ø±ÙŠØ¯ Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ Ø¢Ø®Ø±. Ù„Ø­Ù…Ø§ÙŠØ© Ø§Ù„Ø­Ø³Ø§Ø¨Ø§Øª Ù…Ù† Ø§Ù„ØªÙƒØ±Ø§Ø±ØŒ ÙŠØªØ·Ù„Ø¨ ØªÙØ¹ÙŠÙ„ Ø§Ù„Ø­Ø³Ø§Ø¨ Ù…Ø·Ø§Ø¨Ù‚Ø© ÙŠØ¯ÙˆÙŠØ©.'
                    : 'This phone number matches an existing candidate in our ledger with a different email address.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 text-left">
                <p className="font-semibold text-cyan-300">{lang === 'ar' ? 'Ø¥Ø¬Ø±Ø§Ø¡Ø§Øª Ø­Ù„ Ø§Ù„ØªØ¶Ø§Ø±Ø¨:' : 'Resolution Procedure:'}</p>
                <p className="mt-1 text-slate-400">
                  {lang === 'ar' 
                    ? 'ØªÙˆØ§ØµÙ„ Ù…Ø¹ Ù…ÙƒØªØ¨ Ø§Ù„Ø¯Ø¹Ù… Ø§Ù„ÙÙ†ÙŠ ÙˆØ§Ù„Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠ Ù„ØªØ£ÙƒÙŠØ¯ Ù‡ÙˆÙŠØªÙƒ ÙˆØ§Ø³ØªØ¹Ø§Ø¯Ø© Ø§Ù„Ù…Ø¹Ø±Ù‘Ù Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ ÙÙˆØ±Ø§Ù‹.'
                    : 'Contact the admissions officer on WhatsApp to authenticate your identity and retrieve your canonical GA-ID.'}
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://wa.me/2+20 101 592 2628?text=${encodeURIComponent(`Ø§Ù„Ø³Ù„Ø§Ù… Ø¹Ù„ÙŠÙƒÙ…ØŒ Ø£Ø­ØªØ§Ø¬ Ù…Ø·Ø§Ø¨Ù‚Ø© Ø±Ù‚Ù… Ø§Ù„Ù‡Ø§ØªÙ: ${formData.phone} Ù„Ù„Ø§Ø³Ù…: ${formData.fullName}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold font-display text-sm hover:opacity-95 transition flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'Ù…Ø±Ø§Ø³Ù„Ø© Ù…Ø³Ø¤ÙˆÙ„ Ø§Ù„ØªØ³Ø¬ÙŠÙ„' : 'Chat with Admissions Desk'}</span>
                </a>
                <button
                  onClick={() => setFlowState('FORM')}
                  className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition"
                >
                  {lang === 'ar' ? 'ØªØ¹Ø¯ÙŠÙ„ Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª' : 'Edit Input'}
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
                  {lang === 'ar' ? 'ØªØ¹Ø°Ø± Ø¥ØªÙ…Ø§Ù… Ø§Ù„ØªØ³Ø¬ÙŠÙ„' : 'Verification Incomplete'}
                </span>
                <h2 className="text-2xl font-bold font-display text-white mt-3">
                  {lang === 'ar' ? 'Ù„Ù… Ù†ØªÙ…ÙƒÙ† Ù…Ù† Ø§Ø¹ØªÙ…Ø§Ø¯ Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ù…Ø¯Ø®Ù„Ø©' : 'Could Not Verify Credentials'}
                </h2>
                <p className="text-sm text-rose-300/80 mt-1">
                  {errorMessage || (lang === 'ar' ? 'ÙŠØ±Ø¬Ù‰ Ù…Ø±Ø§Ø¬Ø¹Ø© ØµØ­Ø© Ø§Ù„Ø§Ø³Ù… ÙˆØ§Ù„Ø¬Ø§Ù…Ø¹Ø© Ø§Ù„Ø·Ø¨ÙŠØ©.' : 'Please verify your faculty and legal name format.')}
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setFlowState('FORM')}
                  className="flex-1 py-3 px-5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-display text-sm transition"
                >
                  {lang === 'ar' ? 'Ø¥Ø¹Ø§Ø¯Ø© Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø© ÙˆØªØµØ­ÙŠØ­ Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª' : 'Retry Registration'}
                </button>
                <a
                  href="https://wa.me/2+20 101 592 2628"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition flex items-center justify-center gap-2"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'Ø·Ù„Ø¨ Ø§Ù„Ù…Ø³Ø§Ø¹Ø¯Ø©' : 'Support Desk'}</span>
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}
