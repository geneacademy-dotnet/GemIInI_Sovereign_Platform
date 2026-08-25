/**
 * src/pages/HomePage.jsx
 * SudaGene Consortium & GemIInI Academy Sovereign Portal
 * 2027 Apple-Grade Futuristic Luxury Design System
 */

import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Award, Zap, Activity, Users, Globe2, BookOpen, 
  ArrowRight, ArrowLeft, Sparkles, CheckCircle2, ChevronRight,
  Flame, Stethoscope, Dna, Play, HeartPulse, Building2, Microscope
} from 'lucide-react';
import Layout from '@/components/site/Layout';
import { useLang } from '@/i18n/LanguageContext';
import ProgramsCatalog from '@/components/ProgramsCatalog';
import MotionPictureReel from '@/components/MotionPictureReel';
import MtcSimulationRunner from '@/components/MtcSimulationRunner';
import LeaderboardWidget from '@/components/LeaderboardWidget';

export default function HomePage() {
  const { t, lang, isRtl } = useLang();
  const [showSim, setShowSim] = useState(false);

  return (
    <Layout>
      <Helmet>
        <title>{isRtl ? 'أكاديمية جيميني وسوداجين | المنظومة الأكاديمية والسريرية السيادية' : 'GemIInI Academy & SudaGene | Sovereign Medical & Genomic Ecosystem'}</title>
        <meta
          name="description"
          content="The Decentralized Bio-Medical & Clinical Licensure Platform for North Africa and Middle East. Mechanism-to-Clinic (MTC™) simulation, Translational Genomics, and Cryptographic Credentialing."
        />
      </Helmet>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (2027 Ambient Glassmorphism & Liquid Light) */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-[#04080F] text-slate-100 py-20 lg:py-28 border-b border-slate-800/80 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Glowing Background Radial Blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-[#00F2FE]/15 via-[#A855F7]/10 to-[#B48028]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-24 right-10 w-96 h-96 bg-[#00F2FE]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            
            {/* Consortium Badge Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/60 shadow-xl backdrop-blur-md mb-6 hover:border-[#00F2FE]/50 transition-all">
              <span className="flex h-2 w-2 rounded-full bg-[#00F2FE] animate-pulse" />
              <span className="text-[11px] font-mono font-bold tracking-widest text-[#00F2FE] uppercase">
                {isRtl ? 'المنظومة السيادية للرعاية السريرية والأبحاث الجينومية' : 'Sovereign HealthTech & Bio-Medical Consortium'}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
              {isRtl ? (
                <>
                  إعادة بناء البنية السريرية <br />
                  <span className="bg-gradient-to-r from-[#00F2FE] via-[#38BDF8] to-[#B48028] bg-clip-text text-transparent">
                    بمعايير سيادية لامركزية
                  </span>
                </>
              ) : (
                <>
                  Decentralized Clinical <br />
                  <span className="bg-gradient-to-r from-[#00F2FE] via-[#38BDF8] to-[#B48028] bg-clip-text text-transparent">
                    Licensure & Genomics
                  </span>
                </>
              )}
            </h1>

            {/* Sub-Headline */}
            <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              {isRtl
                ? 'منصة المحاكاة الطبية التراكمية Mechanism-to-Clinic (MTC™)، أبحاث الأورام الدقيقة، وسجل الاعتماد السيادي SudaPass عبر الشرق الأوسط وشمال أفريقيا.'
                : 'Advanced Mechanism-to-Clinic (MTC™) simulation, Precision Oncology Research Pods, and SudaPass Cryptographic Credentials across North Africa & MENA.'}
            </p>

            {/* Action CTAs */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setShowSim(!showSim)}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00F2FE] to-[#00C2DE] text-slate-950 font-extrabold text-sm sm:text-base shadow-[0_0_30px_rgba(0,242,254,0.35)] hover:shadow-[0_0_40px_rgba(0,242,254,0.5)] transition-all flex items-center gap-2.5 active:scale-95"
              >
                <Stethoscope className="w-5 h-5" />
                <span>{isRtl ? 'بدء محاكاة MTC™ الجراحية (مستوى 1 مجاني)' : 'Launch MTC™ Diagnostic Ramp (Free Level 1)'}</span>
              </button>

              <Link
                to="/bls"
                className="px-8 py-4 rounded-2xl bg-slate-900/90 border border-slate-700 hover:border-[#B48028]/60 text-white font-bold text-sm sm:text-base shadow-xl backdrop-blur-md transition-all flex items-center gap-2 hover:bg-slate-800"
              >
                <HeartPulse className="w-5 h-5 text-rose-400" />
                <span>{isRtl ? 'ورش الإنعاش القلبي (القاهرة / السودان)' : 'AHA BLS Workshops (Cairo / Sudan)'}</span>
              </Link>
            </div>

            {/* Verified Statistics Bar */}
            <div className="mt-14 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div>
                <p className="font-mono text-2xl sm:text-3xl font-black text-white">1,201+</p>
                <p className="text-xs text-slate-400 mt-1">{isRtl ? 'طبيب وباحث موثق' : 'Verified Clinicians'}</p>
              </div>
              <div>
                <p className="font-mono text-2xl sm:text-3xl font-black text-[#00F2FE]">90+</p>
                <p className="text-xs text-slate-400 mt-1">{isRtl ? 'كلية طبية ممثلة' : 'Medical Faculties'}</p>
              </div>
              <div>
                <p className="font-mono text-2xl sm:text-3xl font-black text-[#B48028]">92.5%</p>
                <p className="text-xs text-slate-400 mt-1">{isRtl ? 'أعلى دقة تشخيصية' : 'Peak Diagnostic Acc'}</p>
              </div>
              <div>
                <p className="font-mono text-2xl sm:text-3xl font-black text-teal-400">100%</p>
                <p className="text-xs text-slate-400 mt-1">{isRtl ? 'اعتماد سيادي غير قابل للتزوير' : 'Verifiable Credentials'}</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. INTERACTIVE CLINICAL SIMULATOR (EXPANDABLE RAMP) */}
      {/* ========================================================================= */}
      {showSim && (
        <section className="py-12 bg-[#060B16] border-b border-slate-800" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="max-w-4xl mx-auto px-4">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <span className="px-3 py-1 bg-[#00F2FE]/10 text-[#00F2FE] border border-[#00F2FE]/30 rounded-full font-mono text-xs font-bold">
                  LEVEL 1 DIAGNOSTIC TRIAL
                </span>
                <h2 className="text-2xl font-bold text-white mt-2">
                  {isRtl ? 'اختبار الحالات الطارئة والجراحة السريرية' : 'Acute Clinical & Trauma Triage Trial'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowSim(false)}
                className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900"
              >
                {isRtl ? 'إغلاق المحاكي' : 'Close Simulator'}
              </button>
            </div>
            <MtcSimulationRunner candidateGaId="GA-PROVISIONAL" />
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 3. 3-TIER SOVEREIGN PROGRAM CATALOG */}
      {/* ========================================================================= */}
      <ProgramsCatalog />

      {/* ========================================================================= */}
      {/* 4. LIVE MOTION PICTURE REEL & MASTERCLASS STREAM */}
      {/* ========================================================================= */}
      <MotionPictureReel />

      {/* ========================================================================= */}
      {/* 5. SOVEREIGN MERIT LEADERBOARD PREVIEW */}
      {/* ========================================================================= */}
      <section className="py-16 bg-[#04080F] border-t border-slate-800" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="px-3.5 py-1 bg-[#B48028]/10 border border-[#B48028]/30 text-[#B48028] text-xs font-mono font-bold rounded-full uppercase tracking-wider">
              Transparency & Meritocracy
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
              {isRtl ? 'السجل السيادي ولوحة المتصدرين' : 'Live Sovereign Clinical Standings'}
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
              {isRtl
                ? 'توثيق مباشر للأداء السريري ومعدلات الإكمال بدون وسطاء أو أرقام افتراضية.'
                : 'Direct mathematical verification of candidate telemetry with zero fabricated standings.'}
            </p>
          </div>

          <LeaderboardWidget />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. INSTITUTIONAL FOOTER BANNER */}
      {/* ========================================================================= */}
      <section className="py-16 bg-gradient-to-b from-[#0A0F1D] to-[#04080F] border-t border-slate-800 text-center" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {isRtl ? 'هل أنت مستعد لتفعيل ملفك السيادي والارتقاء بمسارك الطبي؟' : 'Ready to Authenticate Your Sovereign Clinical Standing?'}
          </h2>
          <p className="text-sm text-slate-400 mt-3 max-w-xl mx-auto">
            {isRtl
              ? 'انضم إلى أكثر من ١,٢٠٠ طبيب وباحث في أكبر منظومة صحية وأكاديمية متكاملة.'
              : 'Join over 1,200 clinicians and researchers in the most robust sovereign medical ecosystem.'}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-xl bg-[#00F2FE] hover:bg-[#00D2DE] text-slate-950 font-extrabold text-sm shadow-xl transition-all"
            >
              {isRtl ? 'التسجيل في السجل السيادي (+25 GP)' : 'Mint Sovereign Profile (+25 GP)'}
            </Link>
            <Link
              to="/verify"
              className="px-8 py-3.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-white text-slate-200 font-bold text-sm transition-all"
            >
              {isRtl ? 'التحقق من الشهادات والاعتمادات' : 'Verify SudaPass Credential'}
            </Link>
          </div>
        </div>
      </section>

    </Layout>
  );
}
