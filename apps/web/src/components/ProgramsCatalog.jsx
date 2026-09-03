/**
 * src/components/ProgramsCatalog.jsx
 * 3-Tier Sovereign Program Catalog
 * GemIInI Clinical Vanguard (Tier 1), Gene Academy Molecular Fellow (Tier 2), and Strategic Imperatives & GLOMEt (Tier 3)
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/i18n/LanguageContext';
import { Stethoscope, Dna, Building2, CheckCircle2, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

export default function ProgramsCatalog() {
  const { lang, isRtl } = useLang();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section className="py-16 bg-[#04080F] text-slate-100 font-sans relative overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[#00F2FE]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#00F2FE]/10 border border-[#00F2FE]/30 text-[#00F2FE] text-xs font-mono font-bold rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRtl ? 'Ø§Ù„Ø±ÙƒØ§Ø¦Ø² Ø§Ù„Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠØ© Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠØ©' : 'SudaGene Academic Pillars'}</span>
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-3">
            {isRtl ? 'Ø§Ù„Ù…Ø³Ø§Ø±Ø§Øª Ø§Ù„Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠØ© ÙˆØ§Ù„Ø¨Ø±Ø§Ù…Ø¬ Ø§Ù„ØªØ®ØµØµÙŠØ©' : 'Academic Tracks & Specialized Programs'}
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            {isRtl
              ? 'Ø¨Ø±Ø§Ù…Ø¬ ØªØ¯Ø±ÙŠØ¨ÙŠØ© Ù…Ø¹ØªÙ…Ø¯Ø© ÙˆÙÙ‚ Ø¥Ø·Ø§Ø± Mechanism-to-Clinic (MTCâ„¢) Ù…Ø¹ ØªÙˆØ«ÙŠÙ‚ Ø§Ù„Ø³Ø§Ø¹Ø§Øª Ø§Ù„Ù…Ø¹ØªÙ…Ø¯Ø© ÙÙŠ Ø§Ù„Ø³Ø¬Ù„ Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠ.'
              : 'Accredited training programs built on the Mechanism-to-Clinic (MTCâ„¢) framework with certified CPD hours recorded in the Sovereign Registry.'}
          </p>
        </div>

        {/* 3-Tier Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* TIER 1: GemIInI Clinical Vanguard */}
          <div className="bg-[#0A0F1D] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-[#00F2FE]/50 transition-all shadow-xl group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 bg-teal-500/10 text-teal-400 text-xs font-bold rounded-lg border border-teal-500/30">
                  {isRtl ? 'Tier 1 â€¢ Ø§Ù„Ù…Ø³Ø§Ø± Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ' : 'Tier 1 â€¢ Clinical'}
                </span>
                <span className="text-xs font-mono text-teal-400 font-semibold">+500 GP</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-teal-500/10 border border-teal-500/30 rounded-lg text-teal-400">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white">GemIInI Academy</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {isRtl
                  ? 'Ø§Ù„ØªØ­Ø¶ÙŠØ± Ù„Ø§Ù…ØªØ­Ø§Ù†Ø§Øª Ø§Ù„Ù…Ø²Ø§ÙˆÙ„Ø© ÙˆØ§Ù„Ø²Ù…Ø§Ù„Ø§Øª Ø§Ù„Ø¯ÙˆÙ„ÙŠØ© (SMC, MRCS, USMLE, Approbation) Ø¹Ø¨Ø± Ù…Ø­Ø§ÙƒØ§Ø© Ø§Ù„Ø­Ø§Ù„Ø§Øª Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ© Ø§Ù„Ù…Ø¹Ù‚Ø¯Ø©.'
                  : 'Preparation for licensure exams and international fellowships (SMC, MRCS, USMLE, German Approbation) via complex clinical simulation.'}
              </p>
              <ul className="space-y-2 text-xs text-slate-300 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                  <span>{isRtl ? '8 ÙˆØ­Ø¯Ø§Øª ØªØ¯Ø±ÙŠØ¨ÙŠØ© ÙˆÙÙ‚ Ù†Ù…ÙˆØ°Ø¬ MTCâ„¢' : '8 Training modules aligned with MTCâ„¢'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                  <span>{isRtl ? 'Ø¨Ù†Ùƒ Ø§Ù„Ø£Ø³Ø¦Ù„Ø© Ø¹Ø§Ù„ÙŠ Ø§Ù„Ø¯Ù‚Ø© (20Q & 40Q)' : 'High-yield question banks (20Q & 40Q blocks)'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                  <span>{isRtl ? 'Ø¯ÙˆØ±Ø© Ø§Ù„Ø¥Ù†Ø¹Ø§Ø´ Ø§Ù„Ù‚Ù„Ø¨ÙŠ AHA BLS (Ø¯ÙØ¹Ø© 28 Ø£ØºØ³Ø·Ø³)' : 'AHA-compliant BLS Certification Track'}</span>
                </li>
              </ul>
            </div>
            <Link
              to="/register?track=gemiini"
              className="w-full py-3 bg-[#00F2FE] hover:bg-[#00D2DE] text-slate-950 font-bold text-xs rounded-xl text-center transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,242,254,0.2)]"
            >
              <span>{isRtl ? 'Ø§Ù„Ø§Ù†Ø¶Ù…Ø§Ù… Ù„Ù„Ù…Ø³Ø§Ø± Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ' : 'Join Clinical Track'}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* TIER 2: Gene Academy Molecular Fellow */}
          <div className="bg-[#0A0F1D] border border-purple-500/40 rounded-2xl p-6 flex flex-col justify-between hover:border-purple-500 transition-all shadow-xl relative group">
            <div className="absolute -top-3 right-6 px-3 py-0.5 bg-purple-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
              {isRtl ? 'Ø§Ù„Ø¨Ø­Ø« Ø§Ù„Ø¬Ø²ÙŠØ¦ÙŠ' : 'Molecular Research'}
            </div>
            <div>
              <div className="flex items-center justify-between mb-4 mt-1">
                <span className="px-2.5 py-1 bg-purple-500/10 text-purple-300 text-xs font-bold rounded-lg border border-purple-500/30">
                  {isRtl ? 'Tier 2 â€¢ Ø§Ù„Ø¬ÙŠÙ†ÙˆÙ…' : 'Tier 2 â€¢ Genomics'}
                </span>
                <span className="text-xs font-mono text-purple-300 font-semibold">+750 GP</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-400">
                  <Dna className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white">Gene Academy</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {isRtl
                  ? 'Ø£Ø¨Ø­Ø§Ø« Ø§Ù„Ø·Ø¨ Ø§Ù„Ø¬Ø²ÙŠØ¦ÙŠØŒ ØªØ³Ù„Ø³Ù„ Ø§Ù„Ø¬ÙŠÙ„ Ø§Ù„Ù‚Ø§Ø¯Ù… (NGS)ØŒ ÙˆØªØ­Ù„ÙŠÙ„ Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø¬ÙŠÙ†ÙˆÙ…ÙŠØ© Ø¶Ù…Ù† Ø®Ù„Ø§ÙŠØ§ Ø§Ù„Ù†Ø´Ø± 15:5:1.'
                  : 'Translational oncology, Next-Generation Sequencing (NGS), and genomic pipelines in 15:5:1 publishing pods.'}
              </p>
              <ul className="space-y-2 text-xs text-slate-300 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span>{isRtl ? 'Ù…Ù†Ù‡Ø¬ MM 1.0â€“8.0 Ù„Ù„Ø·Ø¨ Ø§Ù„Ø¬Ø²ÙŠØ¦ÙŠ' : 'MM 1.0â€“8.0 Molecular Medicine Series'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span>{isRtl ? 'ØªØ­Ù„ÙŠÙ„ Ø§Ù„ØªÙ†ÙˆØ¹ Ø§Ù„Ø¬ÙŠÙ†ÙŠ ÙˆØ¹Ù„Ù… Ø§Ù„Ø£ÙˆØ±Ø§Ù… Ø§Ù„Ø¯Ù‚ÙŠÙ‚' : 'Variant analysis & precision oncology ctDNA'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span>{isRtl ? 'Ù…Ø´Ø±ÙˆØ¹ Ø¥Ù†Ù‚Ø§Ø° ÙˆØªÙˆØ«ÙŠÙ‚ 100 ÙˆØ±Ù‚Ø© Ø¨Ø­Ø«ÙŠØ©' : 'The 100 Papers Project & Thesis Support'}</span>
                </li>
              </ul>
            </div>
            <Link
              to="/register?track=gene"
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl text-center transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
            >
              <span>{isRtl ? 'Ø§Ù„Ø§Ù†Ø¶Ù…Ø§Ù… Ù„Ù„Ù…Ø³Ø§Ø± Ø§Ù„Ø¬Ø²ÙŠØ¦ÙŠ' : 'Join Molecular Track'}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* TIER 3: Strategic Imperatives & GLOMEt B2B */}
          <div className="bg-[#0A0F1D] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-amber-500/50 transition-all shadow-xl group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 text-xs font-bold rounded-lg border border-amber-500/30">
                  {isRtl ? 'Tier 3 â€¢ Ø§Ù„Ø¥Ø¯Ø§Ø±Ø© ÙˆØ§Ù„ØªØ´ØºÙŠÙ„' : 'Tier 3 â€¢ Operations & Management'}
                </span>
                <span className="text-xs font-mono text-amber-400 font-semibold">+250 GP Early-Bird</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white">Strategic Imperatives & GLOMEt</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {isRtl
                  ? 'Ù‚ÙˆØ§Ø¦Ù… Ø§Ù„Ø­Ø¬Ø² Ø§Ù„Ù…Ø¨ÙƒØ± Ù„Ù„Ù…Ø³Ø§Ø±Ø§Øª Ø§Ù„Ù‚ÙŠØ§Ø¯ÙŠØ© ÙˆØ§Ù„Ù„ÙˆØ¬Ø³ØªÙŠØ©: Ø·Ø¨ Ø§Ù„Ø·ÙˆØ§Ø±Ø¦ (EM-302)ØŒ Ù…Ù†Ù‡Ø¬ÙŠØ© Ø§Ù„Ø¨Ø­Ø« (RES-310)ØŒ ÙˆØ¥Ø¯Ø§Ø±Ø© Ø§Ù„Ù…Ø³ØªØ´ÙÙŠØ§Øª (MGT-400).'
                  : 'Priority early-bird queue for emergency triage (EM-302), GCP research governance (RES-310), and hospital systems economics (MGT-400).'}
              </p>
              <ul className="space-y-2 text-xs text-slate-300 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>{isRtl ? 'Ø­Ø¬Ø² Ù…Ù‚Ø§Ø¹Ø¯ Ù…Ø¨ÙƒØ± Ù…Ø¹ Ø¨ÙˆÙ†Øµ +250 GP' : 'Priority early-bird access with +250 GP bonus'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>{isRtl ? 'Ø¥Ø¯Ø§Ø±Ø© Ø³Ù„Ø§Ø³Ù„ Ø¥Ù…Ø¯Ø§Ø¯ Ø§Ù„Ø£Ø¬Ù‡Ø²Ø© ÙˆØ§Ù„Ù…Ø³ØªÙ‡Ù„ÙƒØ§Øª' : 'Turnkey diagnostic laboratory & reagent cold chain'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>{isRtl ? 'ØªØ£Ù‡ÙŠÙ„ Ø§Ù„Ù‚ÙŠØ§Ø¯Ø§Øª Ø§Ù„Ø·Ø¨ÙŠØ© ÙˆØ§Ù„Ø¥Ø¯Ø§Ø±ÙŠØ©' : 'Executive clinical governance & practice management'}</span>
                </li>
              </ul>
            </div>
            <Link
              to="/register?track=strategic"
              className="w-full py-3 bg-[#B48028] hover:bg-[#96671E] text-white font-bold text-xs rounded-xl text-center transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(180,128,40,0.2)]"
            >
              <span>{isRtl ? 'ØªØ³Ø¬ÙŠÙ„ ÙÙŠ Ù‚ÙˆØ§Ø¦Ù… Ø§Ù„Ø§Ù†ØªØ¸Ø§Ø±' : 'Reserve Early-Bird Seat'}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
