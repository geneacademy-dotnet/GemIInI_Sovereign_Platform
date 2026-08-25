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
  Search, ExternalLink, Compass, Layers
} from 'lucide-react';
import Layout from '@/components/site/Layout';
import { useLang } from '@/i18n/LanguageContext';
import ProgramsCatalog from '@/components/ProgramsCatalog';
import MotionPictureReel from '@/components/MotionPictureReel';
import MtcSimulationRunner from '@/components/MtcSimulationRunner';
import LeaderboardWidget from '@/components/LeaderboardWidget';

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
        <title>{isRtl ? 'أكاديمية جيميني وسوداجين | المنظومة السريرية والجينومية السيادية' : 'GemIInI Academy & SudaGene | Sovereign Medical & Genomic Ecosystem'}</title>
        <meta
          name="description"
          content="The Decentralized Bio-Medical & Clinical Licensure Platform for North Africa and Middle East. Mechanism-to-Clinic (MTC™) simulation, Translational Genomics, and Cryptographic Credentialing."
        />
      </Helmet>

      <div className="bg-[#04080F] text-slate-100 font-sans selection:bg-[#00F2FE] selection:text-slate-950" dir={isRtl ? 'rtl' : 'ltr'}>
        
        {/* ========================================================================= */}
        {/* 1. HERO SECTION (Apple Spatial Liquid Light & VisionOS Glass) */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-36">
          {/* Ambient Spatial Glow Orbs */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden z-0">
            <div className="h-[50rem] w-[50rem] rounded-full bg-gradient-to-tr from-[#00F2FE]/20 via-[#A855F7]/10 to-[#B48028]/15 blur-[140px]" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-4xl mx-auto">
              
              {/* Floating Spatial Badge */}
              <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-white/10 bg-white/5 shadow-2xl backdrop-blur-2xl mb-8 hover:border-[#00F2FE]/50 transition-all duration-500">
                <span className="flex h-2 w-2 rounded-full bg-[#00F2FE] animate-pulse" />
                <span className="text-xs font-mono font-bold tracking-widest text-[#00F2FE] uppercase">
                  {isRtl ? 'المنظومة السيادية للرعاية السريرية والأبحاث الجينومية' : 'Sovereign HealthTech & Bio-Medical Consortium'}
                </span>
              </div>

              {/* Giant High-Contrast Headline */}
              <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.05]">
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

              {/* Refined Subtitle */}
              <p className="mt-8 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
                {isRtl
                  ? 'منصة المحاكاة الطبية التراكمية Mechanism-to-Clinic (MTC™)، أبحاث الأورام الدقيقة، وسجل الاعتماد السيادي SudaPass عبر الشرق الأوسط وشمال أفريقيا.'
                  : 'Empowering displaced and advancing physicians with Mechanism-to-Clinic (MTC™) simulation, Precision Oncology Research Pods, and SudaPass Cryptographic Credentials.'}
              </p>

              {/* Spatial Action CTAs */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-5">
                <button
                  type="button"
                  onClick={() => setShowSim(!showSim)}
                  className="group relative inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm sm:text-base font-bold text-slate-950 transition-all duration-300 hover:bg-[#00F2FE] hover:shadow-[0_0_30px_rgba(0,242,254,0.4)] active:scale-95 shadow-xl"
                >
                  <Stethoscope className="w-5 h-5 text-slate-950" />
                  <span>{isRtl ? 'بدء محاكاة MTC™ الجراحية (مستوى 1 مجاني)' : 'Launch MTC™ Diagnostic Ramp (Free Level 1)'}</span>
                  {isRtl ? <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> : <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
                </button>

                <Link
                  to="/bls"
                  className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm sm:text-base font-bold text-white backdrop-blur-xl transition-all duration-300 hover:bg-white/10 hover:border-white/20 active:scale-95 shadow-xl"
                >
                  <HeartPulse className="w-5 h-5 text-rose-400" />
                  <span>{isRtl ? 'ورش الإنعاش القلبي (القاهرة / السودان)' : 'AHA BLS Workshops (Cairo / Sudan)'}</span>
                </Link>
              </div>

              {/* Floating Real-Time Metrics Dial */}
              <div className="mt-16 pt-10 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
                <div className="p-4 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md">
                  <p className="font-mono text-3xl sm:text-4xl font-light tracking-tight text-white">1,201+</p>
                  <p className="text-xs text-slate-400 mt-1">{isRtl ? 'طبيب وباحث موثق' : 'Verified Clinicians'}</p>
                </div>
                <div className="p-4 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md">
                  <p className="font-mono text-3xl sm:text-4xl font-light tracking-tight text-[#00F2FE]">90+</p>
                  <p className="text-xs text-slate-400 mt-1">{isRtl ? 'كلية طبية ممثلة' : 'Medical Faculties'}</p>
                </div>
                <div className="p-4 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md">
                  <p className="font-mono text-3xl sm:text-4xl font-light tracking-tight text-[#B48028]">92.5%</p>
                  <p className="text-xs text-slate-400 mt-1">{isRtl ? 'أعلى دقة تشخيصية' : 'Peak Diagnostic Acc'}</p>
                </div>
                <div className="p-4 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md">
                  <p className="font-mono text-3xl sm:text-4xl font-light tracking-tight text-teal-400">100%</p>
                  <p className="text-xs text-slate-400 mt-1">{isRtl ? 'اعتماد سيادي مشفر' : 'SudaPass Verified'}</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. FACULTY MARQUEE / SOCIAL PROOF */}
        {/* ========================================================================= */}
        <section className="py-6 border-y border-white/5 bg-slate-950/80 backdrop-blur-xl overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-semibold text-slate-500 tracking-wide">
            <span className="text-slate-400 font-mono text-xs uppercase tracking-widest">{isRtl ? 'تمثيل أكاديمي موحد:' : 'Institutional Representation:'}</span>
            {medicalFaculties.slice(0, 7).map((fac, i) => (
              <span key={i} className="hover:text-slate-300 transition-colors">{fac}</span>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. INTERACTIVE SIMULATOR RAMP (EXPANDABLE) */}
        {/* ========================================================================= */}
        {showSim && (
          <section className="py-12 bg-[#060B16] border-b border-white/10 animate-in fade-in slide-in-from-top-6">
            <div className="max-w-4xl mx-auto px-4">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <span className="px-3.5 py-1 bg-[#00F2FE]/10 text-[#00F2FE] border border-[#00F2FE]/30 rounded-full font-mono text-xs font-bold">
                    LEVEL 1 DIAGNOSTIC RAMP
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">
                    {isRtl ? 'محاكاة الطوارئ والفرز الجراحي المتقدم' : 'Acute Emergency & Trauma Simulation'}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSim(false)}
                  className="text-xs text-slate-400 hover:text-white px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
                >
                  {isRtl ? 'إغلاق المحاكي' : 'Close Simulator'}
                </button>
              </div>
              <MtcSimulationRunner candidateGaId="GA-PROVISIONAL" />
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* 4. APPLE SPATIAL BENTO GRID (4 MASTER MODULES) */}
        {/* ========================================================================= */}
        <section className="py-24 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="px-4 py-1.5 rounded-full border border-[#00F2FE]/30 bg-[#00F2FE]/10 text-[#00F2FE] text-xs font-mono font-bold uppercase tracking-widest">
              Core Capabilities
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-black text-white mt-4 tracking-tight">
              {isRtl ? 'ركائز المنظومة السريرية والجينومية' : 'The Four Pillars of Sovereign HealthTech'}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-3 max-w-xl mx-auto">
              {isRtl ? 'تكامل المحاكاة السريرية، أبحاث الجينوم التراجمية، وسجل الاعتماد السيادي.' : 'Integrated clinical reasoning, precision oncology pods, and cryptographic ledger verification.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Bento Card 1 (2-Cols): MTC Simulator & Wet Labs */}
            <div className="md:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-10 backdrop-blur-2xl shadow-2xl relative overflow-hidden group hover:border-[#00F2FE]/40 transition-all duration-500">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#00F2FE]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <div className="p-3 bg-[#00F2FE]/15 rounded-2xl w-fit text-[#00F2FE] border border-[#00F2FE]/30 mb-6">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {isRtl ? 'محاكاة MTC™ ومعامل المهارات الجراحية الرطبة' : 'Mechanism-to-Clinic (MTC™) & BSS Wet Labs'}
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed max-w-lg">
                    {isRtl
                      ? 'تدريب سريري محكم يربط الآلية الجزيئية بالتشخيص السريري، مع ورش جراحية رطبة معتمدة من الكلية الملكية البريطانية في مراكز القاهرة والسودان.'
                      : 'Bridging molecular mechanisms to clinical decision-making with Royal College-aligned Basic Surgical Skills wet-lab intensives in Cairo & Sudan hubs.'}
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setShowSim(true)}
                    className="inline-flex items-center gap-2 rounded-full bg-[#00F2FE] text-slate-950 px-6 py-3 text-xs sm:text-sm font-bold shadow-lg hover:bg-[#38BDF8] transition-all"
                  >
                    <span>{isRtl ? 'تجربة المحاكي الآن' : 'Test Diagnostic Simulator'}</span>
                    {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </button>
                  <span className="text-xs text-slate-400 font-mono">58 Verified Surgical Alumni</span>
                </div>
              </div>
            </div>

            {/* Bento Card 2 (1-Col): Translational Genomics */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden group hover:border-[#A855F7]/40 transition-all duration-500">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#A855F7]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <div className="p-3 bg-[#A855F7]/15 rounded-2xl w-fit text-[#A855F7] border border-[#A855F7]/30 mb-6">
                    <Dna className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {isRtl ? 'الأورام الدقيقة و 15:5:1 Pods' : 'Translational Oncology & 15:5:1 Pods'}
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm mt-3 leading-relaxed">
                    {isRtl
                      ? 'سلسلة MM 1.0–8.0، الخزعات السائلة ctDNA، ومبادرة إنقاذ ١٠٠ أطروحة بحثية للأطباء المتضررين من الحرب.'
                      : 'MM 1.0–8.0 master series, liquid biopsies, and 100 Papers Thesis Rescue initiative for displaced researchers.'}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10">
                  <span className="text-[11px] font-mono text-[#A855F7] uppercase tracking-wider font-bold">Molecular Fellow Track</span>
                </div>
              </div>
            </div>

            {/* Bento Card 3 (1-Col): SudaPass Ledger */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden group hover:border-[#B48028]/40 transition-all duration-500">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#B48028]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <div className="p-3 bg-[#B48028]/15 rounded-2xl w-fit text-[#B48028] border border-[#B48028]/30 mb-6">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {isRtl ? 'سجل الاعتماد SudaPass ومحفظة GP' : 'SudaPass Ledger & GP Economy'}
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm mt-3 leading-relaxed">
                    {isRtl
                      ? 'توثيق رقمي غير قابل للتزوير لكل ساعة تدريبية، حيث كل 100 GP تعادل 1.0 ساعة CPD معتمدة دولياً.'
                      : 'Cryptographic tamper-evident credentialing where 100 GP = 1.0 International CPD Hour.'}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10">
                  <Link to="/verify" className="text-xs text-[#B48028] font-bold hover:underline inline-flex items-center gap-1">
                    <span>{isRtl ? 'التحقق من الشهادات' : 'Verify Credentials'}</span>
                    {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  </Link>
                </div>
              </div>
            </div>

            {/* Bento Card 4 (2-Cols): Multi-Hub BLS Workshops */}
            <div className="md:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-10 backdrop-blur-2xl shadow-2xl relative overflow-hidden group hover:border-rose-500/40 transition-all duration-500">
              <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <div className="p-3 bg-rose-500/15 rounded-2xl w-fit text-rose-400 border border-rose-500/30 mb-6">
                    <HeartPulse className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {isRtl ? 'ورش الإنعاش القلبي المعتمدة (القاهرة والسودان)' : 'AHA-Compliant BLS & Resuscitation Multi-Hub'}
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed max-w-lg">
                    {isRtl
                      ? 'ورشة الدقي بالقاهرة (٢٨ أغسطس) والمقر القومي للسودان (١٠ سبتمبر). تدريب عملي مكثف مع تفعيل مباشر لوحدة السيرة الذاتية الاحترافية مع د. محمد صبري.'
                      : 'Live multi-hub resuscitation training in Cairo Dokki (Aug 28) and Sudan National Hub (Sept 10) with verified AHA compliance.'}
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    to="/bls"
                    className="inline-flex items-center gap-2 rounded-full bg-white text-slate-950 px-6 py-3 text-xs sm:text-sm font-bold shadow-lg hover:bg-rose-400 transition-all"
                  >
                    <span>{isRtl ? 'حجز مقعد في الورشة' : 'Reserve Workshop Seat'}</span>
                    {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </Link>
                  <span className="text-xs text-slate-400 font-mono">Cairo • Sudan • Riyadh Desk Placement</span>
                </div>
              </div>
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
              {isRtl ? 'الاستعلام الفوري عن السجل السيادي' : 'Instant SudaPass Sovereign Lookup'}
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              {isRtl ? 'أدخل الرقم السيادي (مثل GA-3521 أو GA-305) للتحقق من الاعتماد والرصيد السريري:' : 'Enter any GA-ID (e.g. GA-3521 or GA-305) to verify clinical standing:'}
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
                {isRtl ? 'استعلام' : 'Lookup'}
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
              {isRtl ? 'انضم إلى السجل السيادي الموحد اليوم' : 'Authenticate Your Sovereign Clinical Standing'}
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-3 max-w-xl mx-auto">
              {isRtl
                ? 'سجل الآن واحصل على ٢٥ نقطة GP فورية مع تفعيل معرفك السيادي غير القابل للتكرار.'
                : 'Mint your sovereign GA-ID with instant +25 GP grant and join 1,200+ clinicians across 90+ faculties.'}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="rounded-full bg-[#00F2FE] hover:bg-[#38BDF8] text-slate-950 px-8 py-3.5 text-sm font-bold shadow-xl transition-all active:scale-95"
              >
                {isRtl ? 'التسجيل في السجل السيادي (+25 GP)' : 'Mint Sovereign Profile (+25 GP)'}
              </Link>
              <Link
                to="/verify"
                className="rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white px-8 py-3.5 text-sm font-bold backdrop-blur-xl transition-all shadow-lg"
              >
                {isRtl ? 'التحقق من الشهادات والاعتمادات' : 'Verify SudaPass Credential'}
              </Link>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
}
