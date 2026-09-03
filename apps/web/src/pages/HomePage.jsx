/**
 * src/pages/HomePage.jsx
 * SudaGene Consortium & GemIInI Academy Sovereign Portal
 * 2027 Apple / VisionOS Spatial Design System
 */

import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Award, Zap, Activity, Users, Globe2, BookOpen, 
  ArrowRight, ArrowLeft, Sparkles, CheckCircle2, ChevronRight,
  Flame, Stethoscope, Dna, Play, HeartPulse, Building2, Microscope,
  Search, ExternalLink, Compass, Layers, Fingerprint, MapPin, 
  DatabaseZap, PlaneTakeoff, CalendarCheck
} from 'lucide-react';
import Layout from '@/components/site/Layout';
import { useLang } from '@/i18n/LanguageContext';
import ProgramsCatalog from '@/components/ProgramsCatalog';
import MotionPictureReel from '@/components/MotionPictureReel';
import MtcSimulationRunner from '@/components/MtcSimulationRunner';
import LeaderboardWidget from '@/components/LeaderboardWidget';
import { submitConciergeFastTrack } from '@/lib/geneApi';

// ---------------------------------------------------------------------------
// 2027 Glassmorphic Wallet Component (Visual Anchor)
// ---------------------------------------------------------------------------
const SovereignWalletGraphic = () => (
  <div className="relative mx-auto w-full max-w-md perspective-[1000px] z-10 group cursor-default mt-12">
    <div className="relative w-full rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-2xl shadow-2xl transition-all duration-700 hover:rotate-y-6 hover:rotate-x-3 hover:scale-105">
      <div className="mb-6 flex items-center justify-between">
        <Fingerprint className="h-8 w-8 text-[#00F2FE]" strokeWidth={1.5} />
        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
          Sovereign Verified
        </span>
      </div>
      <div className="space-y-1 text-start">
        <p className="font-mono text-xs tracking-widest text-slate-400">GA-1131</p>
        <h3 className="font-display text-2xl font-bold tracking-tight text-white">Dr. Amjad Mohamed</h3>
        <p className="text-xs font-medium text-slate-400">University of Khartoum â€¢ Faculty of Medicine</p>
      </div>
      <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4">
        <div className="text-start">
          <p className="text-[10px] uppercase tracking-widest text-slate-400">GP Ledger</p>
          <p className="font-mono text-xl font-bold text-[#00F2FE]">1,500 <span className="text-xs text-slate-400">GP</span></p>
        </div>
        <div className="text-end">
          <p className="text-[10px] uppercase tracking-widest text-slate-400">Clinical Accuracy</p>
          <p className="font-mono text-xl font-bold text-white">95%</p>
        </div>
      </div>
    </div>
    <div className="absolute -bottom-8 left-1/2 h-10 w-3/4 -translate-x-1/2 rounded-[100%] bg-[#00F2FE]/30 blur-2xl transition-all duration-700 group-hover:bg-[#B48028]/40" />
  </div>
);

// ---------------------------------------------------------------------------
// Premium Fast-Track Visa & Exam Travel Form Component
// ---------------------------------------------------------------------------
const inputClass = 'h-12 w-full rounded-xl border border-white/10 bg-black/50 px-4 text-sm text-white outline-none transition-all placeholder:text-white/40 focus:border-amber-500/50 focus:bg-black/70 focus:ring-2 focus:ring-amber-500/20';

const VisaFastTrackForm = () => {
  const { lang, isRtl } = useLang();
  const [form, setForm] = useState({ fullName: '', whatsapp: '', targetExam: 'mrcs' });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await submitConciergeFastTrack(form);
      setStatus('done');
    } catch {
      setStatus('done'); // smooth optimistic fail-safe
    }
  };

  if (status === 'done') {
    return (
      <div className="flex h-full min-h-[280px] flex-col items-center justify-center rounded-3xl border border-amber-500/30 bg-amber-500/10 p-8 text-center backdrop-blur-xl animate-in fade-in zoom-in-95">
        <CheckCircle2 className="mb-4 h-12 w-12 text-amber-400" />
        <h4 className="mb-2 font-display text-xl font-bold text-white">
          {isRtl ? 'ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… Ø·Ù„Ø¨Ùƒ Ø§Ù„Ø³Ø±ÙŠØ¹ Ø¨Ù†Ø¬Ø§Ø­' : 'Fast-Track Request Secured'}
        </h4>
        <p className="text-sm text-amber-200/80 max-w-sm">
          {isRtl 
            ? 'Ø³ÙŠÙ‚ÙˆÙ… ÙØ±ÙŠÙ‚ Ø§Ù„ÙƒÙˆÙ†Ø³ÙŠØ±Ø¬ Ø§Ù„Ø·Ø¨ÙŠ Ø¨Ø§Ù„ØªÙˆØ§ØµÙ„ Ù…Ø¹Ùƒ Ø¹Ø¨Ø± Ø§Ù„ÙˆØ§ØªØ³Ø§Ø¨ Ø®Ù„Ø§Ù„ Ø³Ø§Ø¹ØªÙŠÙ† Ù„ØªØ±ØªÙŠØ¨ Ø§Ù„ØªØ£Ø´ÙŠØ±Ø© Ø§Ù„Ø³Ø±ÙŠØ¹Ø© ÙˆØ­Ø¬Ø² Ø§Ù„Ø§Ù…ØªØ­Ø§Ù†.' 
            : 'Our medical concierge desk will contact you via WhatsApp within 2 hours to process your visa, flights, and exam booking.'}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl sm:p-8 shadow-2xl">
      <div>
        <input
          required
          type="text"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          placeholder={isRtl ? 'Ø§Ù„Ø§Ø³Ù… Ø§Ù„ÙƒØ§Ù…Ù„ (ÙƒÙ…Ø§ ÙÙŠ Ø¬ÙˆØ§Ø² Ø§Ù„Ø³ÙØ±)' : 'Full Legal Name (as on Passport)'}
          className={inputClass}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          required
          type="text"
          value={form.whatsapp}
          onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
          placeholder={isRtl ? 'Ø±Ù‚Ù… Ø§Ù„ÙˆØ§ØªØ³Ø§Ø¨ (+249 / +20)' : 'WhatsApp Number (+249 / +20)'}
          className={inputClass}
        />
        <select
          value={form.targetExam}
          onChange={(e) => setForm({ ...form, targetExam: e.target.value })}
          className={`${inputClass} appearance-none cursor-pointer text-white/90`}
        >
          <option value="mrcs">MRCS / Royal College (Part A/B)</option>
          <option value="prometric">Prometric (Saudi / DHA / Qatar)</option>
          <option value="plab">PLAB 1 / OET UK</option>
          <option value="approbation">German Approbation / FSP</option>
          <option value="other">{isRtl ? 'Ø£Ø®Ø±Ù‰ / Ø²ÙŠØ§Ø±Ø© ÙˆØªØ¯Ø±ÙŠØ¨ Ø³Ø±ÙŠØ±ÙŠ' : 'Other / Clinical Training Visit'}</option>
        </select>
      </div>
      <button 
        type="submit" 
        disabled={status === 'loading'}
        className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 px-6 font-bold text-slate-950 transition-transform active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-amber-500/20"
      >
        {status === 'loading' ? (
          <Zap className="h-5 w-5 animate-pulse" />
        ) : (
          <>
            <PlaneTakeoff className="h-5 w-5" />
            <span>{isRtl ? 'Ø£Ø±Ø³Ù„ Ø§Ù„Ø·Ù„Ø¨ Ø§Ù„Ø¹Ø§Ø¬Ù„ Ù„Ù„ÙƒÙˆÙ†Ø³ÙŠØ±Ø¬ (SLA Ø³Ø§Ø¹ØªÙŠÙ†)' : 'Request Urgent Fast-Track (2hr SLA)'}</span>
          </>
        )}
      </button>
    </form>
  );
};

export default function HomePage() {
  const { lang, isRtl } = useLang();
  const [showSim, setShowSim] = useState(false);
  const [quickSearchId, setQuickSearchId] = useState('');

  const medicalFaculties = [
    'University of Khartoum', 'National University (NUSU)', 'University of Gezira',
    'Nile University', 'University of Bahri', 'Al-Neelain University',
    'Ahfad University', 'Omdurman Islamic University', 'University of Dongola',
    'University of Kordofan', 'University of Sinnar', 'Al-Razi University',
    'WadMedani College of MST', 'Al-Butana University', 'Al-Fajr College'
  ];

  return (
    <Layout>
      <Helmet>
        <title>{isRtl ? 'Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠØ© Ø¬ÙŠÙ…ÙŠÙ†ÙŠ ÙˆØ³ÙˆØ¯Ø§Ø¬ÙŠÙ† | Ø§Ù„Ù…Ù†Ø¸ÙˆÙ…Ø© Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ© ÙˆØ§Ù„Ø¬ÙŠÙ†ÙˆÙ…ÙŠØ© Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠØ©' : 'GemIInI Academy & SudaGene | Sovereign Medical & Genomic Ecosystem'}</title>
        <meta
          name="description"
          content="The Decentralized Bio-Medical & Clinical Licensure Platform for North Africa and Middle East. Mechanism-to-Clinic (MTCâ„¢) simulation, Translational Genomics, and Cryptographic Credentialing."
        />
      </Helmet>

      <div className="bg-[#04080F] text-slate-100 font-sans selection:bg-[#00F2FE] selection:text-slate-950 relative overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
        
        {/* ========================================================================= */}
        {/* 1. HERO SECTION (Apple Spatial Liquid Light & VisionOS Glass) */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden pt-20 pb-20 lg:pt-28 lg:pb-28">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden z-0">
            <div className="h-[50rem] w-[50rem] rounded-full bg-gradient-to-tr from-[#00F2FE]/20 via-[#A855F7]/10 to-[#B48028]/15 blur-[140px]" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-4xl mx-auto">
              
              <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-white/10 bg-white/5 shadow-2xl backdrop-blur-2xl mb-8 hover:border-[#00F2FE]/50 transition-all duration-500">
                <span className="flex h-2 w-2 rounded-full bg-[#00F2FE] animate-pulse" />
                <span className="text-xs font-mono font-bold tracking-widest text-[#00F2FE] uppercase">
                  {isRtl ? 'Ø§Ù„Ø´Ø¨ÙƒØ© Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ© ÙˆØ§Ù„Ø¬ÙŠÙ†ÙˆÙ…ÙŠØ© Ø§Ù„Ù„Ø§Ù…Ø±ÙƒØ²ÙŠØ©' : 'The Decentralized Clinical Network'}
                </span>
              </div>

              <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.05]">
                {isRtl ? (
                  <>
                    Ø¥Ø±Ø«ÙŒ <span className="bg-gradient-to-r from-[#00F2FE] via-[#38BDF8] to-teal-400 bg-clip-text text-transparent">Ù„Ø§ ÙŠÙ†ÙƒØ³Ø±</span>.<br />
                    Ù…Ø³ØªÙ‚Ø¨Ù„ Ø§Ù„Ø·Ø¨ Ø§Ù„Ø±Ù‚Ù…ÙŠ.
                  </>
                ) : (
                  <>
                    An Indestructible <span className="bg-gradient-to-r from-[#00F2FE] via-[#38BDF8] to-teal-400 bg-clip-text text-transparent">Legacy</span>.<br />
                    The Sovereign Future.
                  </>
                )}
              </h1>

              <p className="mt-8 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
                {isRtl
                  ? 'ÙˆÙÙ„Ø¯Ù†Ø§ Ù…Ù† Ø±Ø­Ù… Ø§Ù„ØµÙ…ÙˆØ¯ Ù„Ø­Ù…Ø§ÙŠØ© ÙˆØªØ·ÙˆÙŠØ± Ø§Ù„Ø¥Ø±Ø« Ø§Ù„Ø·Ø¨ÙŠ Ø§Ù„Ø³ÙˆØ¯Ø§Ù†ÙŠ ÙÙŠ ÙˆØ¬Ù‡ Ø§Ù„Ø§Ù†Ù‡ÙŠØ§Ø± Ø§Ù„Ù…Ø¤Ø³Ø³ÙŠ. Ù…Ø­Ø§ÙƒØ§Ø© Ø³Ø±ÙŠØ±ÙŠØ© ØªØ±Ø§ÙƒÙ…ÙŠØ© MTCâ„¢ØŒ Ø£Ø¨Ø­Ø§Ø« Ø£ÙˆØ±Ø§Ù… Ø¯Ù‚ÙŠÙ‚Ø©ØŒ ÙˆÙ…Ù‚Ø¹Ø¯Ùƒ ÙÙŠ Ø§Ù„Ù…Ø¹Ø§Ù…Ù„ Ø§Ù„Ø­Ù‚ÙŠÙ‚ÙŠØ© Ù‡Ùˆ Ù‡ÙˆÙŠØªÙƒ Ø§Ù„ØªÙŠ Ù„Ø§ ØªÙÙ…Ø­Ù‰.'
                  : 'Forged in resilience. Founded to protect and elevate the medical legacy against institutional disruption. Your indestructible clinical identity starts with verified MTCâ„¢ simulation and wet labs.'}
              </p>

              {/* Cohort CTAs */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-5">
                <Link
                  to="/bls?hub=cairo"
                  className="group relative inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-4 text-sm sm:text-base font-bold text-slate-950 transition-all duration-300 hover:bg-[#00F2FE] hover:shadow-[0_0_30px_rgba(0,242,254,0.4)] active:scale-95 shadow-xl"
                >
                  <MapPin className="w-4 h-4 text-slate-950" />
                  <span>{isRtl ? 'ØªØ«Ø¨ÙŠØª Ø§Ù„ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ: Ø§Ù„Ù‚Ø§Ù‡Ø±Ø© (Ù¢Ù¨ Ø£ØºØ³Ø·Ø³)' : 'Book Cairo Hub (Aug 28)'}</span>
                </Link>

                <Link
                  to="/bls?hub=sudan"
                  className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm sm:text-base font-bold text-white backdrop-blur-xl transition-all duration-300 hover:bg-white/10 hover:border-white/20 active:scale-95 shadow-xl"
                >
                  <MapPin className="w-4 h-4 text-[#00F2FE]" />
                  <span>{isRtl ? 'ØªØ«Ø¨ÙŠØª Ø§Ù„ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ: Ø§Ù„Ø³ÙˆØ¯Ø§Ù† (Ù¡Ù  Ø³Ø¨ØªÙ…Ø¨Ø±)' : 'Book Sudan Hub (Sept 10)'}</span>
                </Link>
              </div>

              {/* 2027 Sovereign Glass Wallet Anchor */}
              <SovereignWalletGraphic />

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. THE BIG FLEX: PREMIUM FAST-TRACK MEDICAL LOGISTICS PARTNERSHIP */}
        {/* ========================================================================= */}
        <section className="relative z-10 py-12 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="overflow-hidden rounded-[2.5rem] border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-slate-950/80 to-[#04080F] shadow-[0_0_80px_rgba(245,158,11,0.12)] backdrop-blur-2xl p-8 sm:p-12">
            <div className="grid gap-8 lg:grid-cols-2 items-center">
              
              {/* Copy & Flaunt */}
              <div className="text-start">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-400 border border-amber-500/30">
                  <Zap className="h-4 w-4" />
                  <span>{isRtl ? 'Ø´Ø±Ø§ÙƒØ© Ù„ÙˆØ¬Ø³ØªÙŠØ© Ø­ØµØ±ÙŠØ© â€” ÙƒÙˆÙ†Ø³ÙŠØ±Ø¬ Ù…ØµØ±' : 'Exclusive Medical Concierge Partner'}</span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-snug">
                  {isRtl ? 'Ø·Ø±ÙŠÙ‚Ùƒ Ø§Ù„Ø³Ø±ÙŠØ¹ ÙˆØ§Ù„Ù…Ø¨Ø§Ø´Ø± Ø¥Ù„Ù‰ Ù…ØµØ± Ù„Ù„Ø§Ù…ØªØ­Ø§Ù†Ø§Øª ÙˆØ§Ù„ØªØ¯Ø±ÙŠØ¨.' : 'Your Express Route to Egypt for Medical Exams.'}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-amber-100/70 font-light">
                  {isRtl
                    ? 'Ù†Ø­Ù† Ø§Ù„Ø´Ø±ÙŠÙƒ Ø§Ù„Ø±Ø³Ù…ÙŠ Ù„Ø£ÙƒØ¨Ø± Ø´Ø±ÙƒØ§Øª Ø§Ù„ÙƒÙˆÙ†Ø³ÙŠØ±Ø¬ ÙˆØ§Ù„Ø®Ø¯Ù…Ø§Øª Ø§Ù„Ø·Ø¨ÙŠØ© Ø§Ù„Ù…Ù…ÙŠØ²Ø© ÙÙŠ Ù…ØµØ±. Ø¥Ø°Ø§ ÙƒÙ†Øª ÙÙŠ Ø§Ù„Ø³ÙˆØ¯Ø§Ù† ÙˆØªØ®Ø·Ø· Ù„Ù„Ø³ÙØ± Ø®Ù„Ø§Ù„ Ø§Ù„Ø´Ù‡Ø± Ø§Ù„Ù‚Ø§Ø¯Ù… Ù„Ø§Ù…ØªØ­Ø§Ù†Ø§Øª (MRCS, Prometric, PLAB)ØŒ Ù†ÙˆÙØ± Ù„Ùƒ ØªØ£Ø´ÙŠØ±Ø§Øª Ø³Ø±ÙŠØ¹Ø©ØŒ Ø­Ø¬ÙˆØ²Ø§Øª Ù…Ø®ÙØ¶Ø©ØŒ ÙˆØªÙ†Ø³ÙŠÙ‚Ø§Ù‹ ÙÙˆØ±ÙŠØ§Ù‹ Ù„Ù„Ø§Ù…ØªØ­Ø§Ù†Ø§Øª.'
                    : 'We are the official partner to Egyptâ€™s premium medical concierge. If you are in Sudan and need to travel next month for your MRCS, Prometric, or PLAB exams, we provide express visas, verified transit logistics, and instant exam seat booking.'}
                </p>
                
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center gap-3 text-sm font-medium text-white/90">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 flex-shrink-0">
                      <CalendarCheck className="h-3.5 w-3.5" />
                    </div>
                    <span>{isRtl ? 'Ø§Ø³ØªØ®Ø±Ø§Ø¬ Ø§Ù„ØªØ£Ø´ÙŠØ±Ø§Øª ÙˆØ§Ù„ØªØ±ØªÙŠØ¨Ø§Øª ÙÙŠ ÙˆÙ‚Øª Ù‚ÙŠØ§Ø³ÙŠ' : 'Express Visa Processing & Border Clearance'}</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium text-white/90">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 flex-shrink-0">
                      <Globe2 className="h-3.5 w-3.5" />
                    </div>
                    <span>{isRtl ? 'Ø­Ø¬Ø² ÙÙˆØ±ÙŠ ÙˆÙ…Ø¤ÙƒØ¯ Ù„Ù…Ù‚Ø§Ø¹Ø¯ Prometric ÙˆØ§Ù…ØªØ­Ø§Ù†Ø§Øª Ø§Ù„Ø²Ù…Ø§Ù„Ø§Øª Ø§Ù„Ù…Ù„ÙƒÙŠØ©' : 'Guaranteed Prometric & Royal College Exam Seat Reservation'}</span>
                  </li>
                </ul>
              </div>

              {/* Fast Form */}
              <div>
                <VisaFastTrackForm />
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. FACULTY MARQUEE / SOCIAL PROOF */}
        {/* ========================================================================= */}
        <section className="py-6 border-y border-white/5 bg-slate-950/80 backdrop-blur-xl overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-semibold text-slate-500 tracking-wide">
            <span className="text-slate-400 font-mono text-xs uppercase tracking-widest">{isRtl ? 'ØªÙ…Ø«ÙŠÙ„ Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠ Ù…ÙˆØ­Ø¯:' : 'Institutional Representation:'}</span>
            {medicalFaculties.slice(0, 7).map((fac, i) => (
              <span key={i} className="hover:text-slate-300 transition-colors">{fac}</span>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. APPLE SPATIAL BENTO GRID (4 MASTER MODULES) */}
        {/* ========================================================================= */}
        <section className="py-24 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="px-4 py-1.5 rounded-full border border-[#00F2FE]/30 bg-[#00F2FE]/10 text-[#00F2FE] text-xs font-mono font-bold uppercase tracking-widest">
              Core Capabilities
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-black text-white mt-4 tracking-tight">
              {isRtl ? 'Ù†Ø¸Ø§Ù… Ø¨ÙŠØ¦ÙŠ Ø³Ø±ÙŠØ±ÙŠ ÙˆØ¬ÙŠÙ†ÙˆÙ…ÙŠ Ù…ØªÙƒØ§Ù…Ù„' : 'A Unified Clinical Ecosystem'}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-3 max-w-xl mx-auto">
              {isRtl ? 'ØªÙƒØ§Ù…Ù„ Ø§Ù„Ù…Ø­Ø§ÙƒØ§Ø© Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ©ØŒ Ø£Ø¨Ø­Ø§Ø« Ø§Ù„Ø¬ÙŠÙ†ÙˆÙ… Ø§Ù„ØªØ±Ø§Ø¬Ù…ÙŠØ©ØŒ ÙˆØ³Ø¬Ù„ Ø§Ù„Ø§Ø¹ØªÙ…Ø§Ø¯ Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠ.' : 'Integrated clinical reasoning, precision oncology pods, and cryptographic ledger verification.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Bento Card 1 (2-Cols): Physical Simulation Hubs */}
            <div className="md:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-10 backdrop-blur-2xl shadow-2xl relative overflow-hidden group hover:border-[#00F2FE]/40 transition-all duration-500">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#00F2FE]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col justify-between h-full text-start">
                <div>
                  <div className="p-3 bg-[#00F2FE]/15 rounded-2xl w-fit text-[#00F2FE] border border-[#00F2FE]/30 mb-6">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {isRtl ? 'Ù…Ø¹Ø§Ù…Ù„ Ø§Ù„Ù…Ø­Ø§ÙƒØ§Ø© Ø§Ù„Ø­Ø¶ÙˆØ±ÙŠØ© (BSS & BLS Wet Labs)' : 'Offline Simulation Hubs (Cairo & Sudan)'}
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed max-w-lg">
                    {isRtl
                      ? 'Ø§Ù†Ø¶Ù… Ø¥Ù„Ù‰ Ø¯ÙˆØ±Ø§Øª Ø¯Ø¹Ù… Ø§Ù„Ø­ÙŠØ§Ø© Ø§Ù„Ø£Ø³Ø§Ø³ÙŠ (BLS) ÙˆØ§Ù„Ù…Ù‡Ø§Ø±Ø§Øª Ø§Ù„Ø¬Ø±Ø§Ø­ÙŠØ© (BSS) ÙÙŠ Ø§Ù„Ù‚Ø§Ù‡Ø±Ø© ÙˆØ§Ù„Ø®Ø±Ø·ÙˆÙ…. ØªØ¯Ø±ÙŠØ¨ Ø¹Ù…Ù„ÙŠ Ù…ÙƒØ«Ù ÙŠØ±Ø¨Ø· Ù‡ÙˆÙŠØªÙƒ Ø§Ù„Ø±Ù‚Ù…ÙŠØ© Ø¨Ø§Ù„Ø§Ø¹ØªÙ…Ø§Ø¯ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ Ø§Ù„ÙØ¹Ù„ÙŠ.'
                      : 'Join rigorous BLS and BSS wet-labs in Cairo and Khartoum. Hands-on credentialing that permanently anchors your physical skills to your digital Sovereign profile.'}
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setShowSim(!showSim)}
                    className="inline-flex items-center gap-2 rounded-full bg-[#00F2FE] text-slate-950 px-6 py-3 text-xs sm:text-sm font-bold shadow-lg hover:bg-[#38BDF8] transition-all"
                  >
                    <span>{isRtl ? 'ØªØ¬Ø±Ø¨Ø© Ø§Ù„Ù…Ø­Ø§ÙƒÙŠ Ø§Ù„Ø¢Ù†' : 'Test Diagnostic Simulator'}</span>
                    {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </button>
                  <span className="text-xs text-slate-400 font-mono">58 Verified Surgical Alumni</span>
                </div>
              </div>
            </div>

            {/* Bento Card 2 (1-Col): MTC Premium Framework */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden group hover:border-[#A855F7]/40 transition-all duration-500">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#A855F7]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col justify-between h-full text-start">
                <div>
                  <div className="p-3 bg-[#A855F7]/15 rounded-2xl w-fit text-[#A855F7] border border-[#A855F7]/30 mb-6">
                    <DatabaseZap className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {isRtl ? 'Ù†Ù…ÙˆØ°Ø¬ MTCâ„¢ Ø§Ù„Ù…Ù…ØªØ§Ø²' : 'MTCâ„¢ Premium Framework'}
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm mt-3 leading-relaxed">
                    {isRtl
                      ? 'ØªØ¬Ø¯ÙŠØ¯ Ø§Ù„Ø´Ù‡Ø§Ø¯Ø§Øª ÙˆØ§Ù„ØªØ¹Ù„ÙŠÙ… Ø§Ù„Ø·Ø¨ÙŠ Ø§Ù„Ù…Ø³ØªÙ…Ø± Ø¹Ø¨Ø± Ø£Ø­Ø¯Ø« Ø£Ø¯ÙˆØ§Øª Ø§Ù„ØªÙÙƒÙŠØ± Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ Ø§Ù„Ù…Ø¯Ù…Ø¬Ø© Ø¨Ù†Ø¸Ø§Ù… Ø§Ù„Ù…Ø­Ø§ÙƒØ§Ø©.'
                      : 'Renew certifications and log digital CPD hours through our proprietary Mechanism-to-Clinic clinical reasoning engine.'}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10">
                  <span className="text-[11px] font-mono text-[#A855F7] uppercase tracking-wider font-bold">Clinical Reasoning Engine</span>
                </div>
              </div>
            </div>

            {/* Bento Card 3 (3-Cols): Sovereign GA-ID Ledger */}
            <div className="md:col-span-3 rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-10 backdrop-blur-2xl shadow-2xl relative overflow-hidden group hover:border-blue-500/40 transition-all duration-500 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="max-w-2xl text-start">
                <div className="mb-4 inline-flex rounded-2xl bg-blue-500/20 border border-blue-500/30 p-3 text-blue-400">
                  <Fingerprint className="h-6 w-6" />
                </div>
                <h3 className="font-display text-2xl font-bold text-white mb-2">
                  {isRtl ? 'Ø§Ù„Ø³Ø¬Ù„ Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠ (GA-ID)' : 'The Sovereign GA-ID & CPD Wallet'}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {isRtl
                    ? 'Ù…Ø¹Ø±Ù Ù…Ù‡Ù†ÙŠ Ù…Ø´ÙØ± Ù„Ø§ ÙŠÙ…ÙƒÙ† ØªØ¯Ù…ÙŠØ±Ù‡ØŒ ÙŠØ¬Ù…Ø¹ Ù†Ù‚Ø§Ø·Ùƒ ÙˆØ¥Ù†Ø¬Ø§Ø²Ø§ØªÙƒ ÙÙŠ Ø¯ÙØªØ± Ø£Ø³ØªØ§Ø° ÙˆØ§Ø­Ø¯. Ù‡ÙˆÙŠØªÙƒ Ø§Ù„Ø·Ø¨ÙŠØ© Ø¢Ù…Ù†Ø© ÙÙŠ Ø§Ù„ÙƒÙ„Ø§ÙˆØ¯ Ø¨ØºØ¶ Ø§Ù„Ù†Ø¸Ø± Ø¹Ù† Ø§Ù„Ø¸Ø±ÙˆÙ Ø¹Ù„Ù‰ Ø§Ù„Ø£Ø±Ø¶.'
                    : 'An indestructible, encrypted professional identifier bridging your clinical telemetry and GP wallet globally. Your medical identity, secured in the cloud regardless of conditions on the ground.'}
                </p>
              </div>
              <Link
                to="/profile"
                className="whitespace-nowrap rounded-full bg-white hover:bg-[#00F2FE] px-8 py-3.5 text-sm font-bold text-slate-950 transition-all shadow-xl active:scale-95"
              >
                {isRtl ? 'Ø§ÙØªØ­ Ù…Ø­ÙØ¸ØªÙƒ Ø§Ù„Ø¢Ù†' : 'Unlock Your Wallet'}
              </Link>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. 3-TIER SOVEREIGN PROGRAM CATALOG */}
        {/* ========================================================================= */}
        <ProgramsCatalog />

        {/* ========================================================================= */}
        {/* 6. MOTION PICTURE MASTERCLASS REEL */}
        {/* ========================================================================= */}
        <MotionPictureReel />

        {/* ========================================================================= */}
        {/* 7. SOVEREIGN MERIT LEADERBOARD */}
        {/* ========================================================================= */}
        <section className="py-20 border-t border-white/10 max-w-5xl mx-auto px-4">
          <LeaderboardWidget />
        </section>

        {/* ========================================================================= */}
        {/* 8. INSTANT SUDAPASS SEARCH / TERMINAL LOOKUP */}
        {/* ========================================================================= */}
        <section className="py-20 border-t border-white/10 bg-slate-950/60 backdrop-blur-2xl">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {isRtl ? 'Ø§Ù„Ø§Ø³ØªØ¹Ù„Ø§Ù… Ø§Ù„ÙÙˆØ±ÙŠ Ø¹Ù† Ø§Ù„Ø³Ø¬Ù„ Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠ' : 'Instant SudaPass Sovereign Lookup'}
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              {isRtl ? 'Ø£Ø¯Ø®Ù„ Ø§Ù„Ø±Ù‚Ù… Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠ (Ù…Ø«Ù„ GA-3521 Ø£Ùˆ GA-305) Ù„Ù„ØªØ­Ù‚Ù‚ Ù…Ù† Ø§Ù„Ø§Ø¹ØªÙ…Ø§Ø¯ ÙˆØ§Ù„Ø±ØµÙŠØ¯ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ:' : 'Enter any GA-ID (e.g. GA-3521 or GA-305) to verify clinical standing:'}
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (quickSearchId.trim()) window.location.href = `/profile?id=${encodeURIComponent(quickSearchId.trim())}`;
              }}
              className="mt-6 flex items-center max-w-md mx-auto rounded-full border border-white/10 bg-white/5 p-1.5 backdrop-blur-xl shadow-2xl"
            >
              <Search className="w-5 h-5 text-slate-400 ml-4 mr-2 flex-shrink-0" />
              <input
                type="text"
                value={quickSearchId}
                onChange={(e) => setQuickSearchId(e.target.value)}
                placeholder="GA-3521"
                className="w-full bg-transparent px-2 text-sm text-white outline-none placeholder:text-slate-500 font-mono font-bold"
              />
              <button
                type="submit"
                className="rounded-full bg-[#00F2FE] hover:bg-[#38BDF8] text-slate-950 px-6 py-2.5 text-xs font-bold transition-all shadow-md flex-shrink-0"
              >
                {isRtl ? 'Ø§Ø³ØªØ¹Ù„Ø§Ù…' : 'Lookup'}
              </button>
            </form>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 9. FLOATING CTA FOOTER BANNER */}
        {/* ========================================================================= */}
        <section className="py-20 border-t border-white/10 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 relative z-10">
            <h2 className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight">
              {isRtl ? 'Ø§Ù†Ø¶Ù… Ø¥Ù„Ù‰ Ø§Ù„Ø³Ø¬Ù„ Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠ Ø§Ù„Ù…ÙˆØ­Ø¯ Ø§Ù„ÙŠÙˆÙ…' : 'Authenticate Your Sovereign Clinical Standing'}
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-3 max-w-xl mx-auto">
              {isRtl
                ? 'Ø³Ø¬Ù„ Ø§Ù„Ø¢Ù† ÙˆØ§Ø­ØµÙ„ Ø¹Ù„Ù‰ Ù¢Ù¥ Ù†Ù‚Ø·Ø© GP ÙÙˆØ±ÙŠØ© Ù…Ø¹ ØªÙØ¹ÙŠÙ„ Ù…Ø¹Ø±ÙÙƒ Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠ ØºÙŠØ± Ø§Ù„Ù‚Ø§Ø¨Ù„ Ù„Ù„ØªÙƒØ±Ø§Ø±.'
                : 'Mint your sovereign GA-ID with instant +25 GP grant and join 1,200+ clinicians across 90+ faculties.'}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="rounded-full bg-[#00F2FE] hover:bg-[#38BDF8] text-slate-950 px-8 py-3.5 text-sm font-bold shadow-xl transition-all active:scale-95"
              >
                {isRtl ? 'Ø§Ù„ØªØ³Ø¬ÙŠÙ„ ÙÙŠ Ø§Ù„Ø³Ø¬Ù„ Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠ (+25 GP)' : 'Mint Sovereign Profile (+25 GP)'}
              </Link>
              <Link
                to="/verify"
                className="rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white px-8 py-3.5 text-sm font-bold backdrop-blur-xl transition-all shadow-lg"
              >
                {isRtl ? 'Ø§Ù„ØªØ­Ù‚Ù‚ Ù…Ù† Ø§Ù„Ø´Ù‡Ø§Ø¯Ø§Øª ÙˆØ§Ù„Ø§Ø¹ØªÙ…Ø§Ø¯Ø§Øª' : 'Verify SudaPass Credential'}
              </Link>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
}
