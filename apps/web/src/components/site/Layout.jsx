/**
 * src/components/site/Layout.jsx
 * Unified Sovereign Platform Navigation & Obsidian Frame
 * 2027 Apple / VisionOS Spatial Aesthetics
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, Globe, Fingerprint, ShieldCheck, 
  MapPin, BookOpen, Film, User, CheckCircle2, ChevronRight, Zap
} from 'lucide-react';
import { useLang } from '@/i18n/LanguageContext';

export default function Layout({ children }) {
  const { lang, setLang, isRtl } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'ar' : 'en');
  };

  const navLinks = [
    { path: '/', labelEn: 'Overview', labelAr: 'الرئيسية' },
    { path: '/bls', labelEn: 'BLS Workshops', labelAr: 'ورش الإنعاش (BLS)', highlight: true },
    { path: '/courses', labelEn: 'Programs', labelAr: 'البرامج الأكاديمية' },
    { path: '/profile', labelEn: 'Clinical Cockpit', labelAr: 'منصة الطبيب (SudaPass)' },
    { path: '/verify', labelEn: 'Verify Credential', labelAr: 'التحقق من الشهادات' },
    { path: '/vault', labelEn: 'Media Vault', labelAr: 'مكتبة المعامل الحية' },
  ];

  return (
    <div className="min-h-screen bg-[#04080F] text-slate-100 flex flex-col font-sans selection:bg-[#00F2FE] selection:text-slate-950" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* 1. TOP GLOBAL NAVIGATION (Spatial Glass Ribbon) */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#04080F]/80 backdrop-blur-2xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Identity */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-gradient-to-br from-white/10 to-white/5 p-2 shadow-xl backdrop-blur-xl group-hover:border-[#00F2FE]/50 transition-all duration-500">
              <Fingerprint className="h-6 w-6 text-[#00F2FE]" />
            </div>
            <div className="flex flex-col text-start">
              <span className="font-display text-lg font-black tracking-tight text-white group-hover:text-[#00F2FE] transition-colors">
                GemIInI <span className="text-[#00F2FE]">Academy</span>
              </span>
              <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                SudaGene Sovereign Platform
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navLinks.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
                    active
                      ? 'bg-white/10 text-[#00F2FE] border border-white/15 shadow-sm'
                      : item.highlight
                      ? 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {isRtl ? item.labelAr : item.labelEn}
                  {item.highlight && !active && (
                    <span className="absolute top-1.5 right-1.5 flex h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-all backdrop-blur-xl"
              title="Toggle Language"
            >
              <Globe className="h-3.5 w-3.5 text-[#00F2FE]" />
              <span className="font-bold">{lang === 'en' ? 'العربية' : 'English'}</span>
            </button>

            {/* Direct SudaPass CTA */}
            <Link
              to="/profile"
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#00F2FE] to-[#38BDF8] px-5 py-2 text-xs font-bold text-slate-950 shadow-lg shadow-[#00F2FE]/20 hover:brightness-110 active:scale-95 transition-all"
            >
              <User className="h-3.5 w-3.5" />
              <span>{isRtl ? 'حسابي الطبي' : 'My SudaPass'}</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="md:hidden border-b border-white/10 bg-[#04080F]/95 backdrop-blur-3xl px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-300">
            {navLinks.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                    active 
                      ? 'bg-[#00F2FE]/10 text-[#00F2FE] border border-[#00F2FE]/20' 
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>{isRtl ? item.labelAr : item.labelEn}</span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </Link>
              );
            })}
            <div className="pt-3 border-t border-white/10">
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-[#00F2FE] text-slate-950 font-bold text-sm shadow-xl"
              >
                <User className="h-4 w-4" />
                <span>{isRtl ? 'الدخول إلى SudaPass' : 'Access SudaPass Cockpit'}</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. MAIN CONTENT BODY */}
      <main className="flex-1">
        {children}
      </main>

      {/* 3. MODERNIZED UNIFIED FOOTER */}
      <footer className="border-t border-white/10 bg-slate-950/80 backdrop-blur-2xl py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3 text-start">
            <div className="flex items-center gap-2.5">
              <Fingerprint className="h-5 w-5 text-[#00F2FE]" />
              <span className="font-display font-black text-white text-base">GemIInI Academy Sovereign Network</span>
            </div>
            <p className="text-slate-400 max-w-md leading-relaxed">
              {isRtl
                ? 'المنظومة الأكاديمية والسريرية والجينومية الموحدة للسودان والمنطقة. ربط المعامل الحضورية بالسجل الرقمي السيادي لحماية الكوادر الطبية.'
                : 'The unified clinical, academic, and translational genomic ecosystem for Sudan and the region. Grounded in live physical wet labs and cryptographic SudaPass credentials.'}
            </p>
            <p className="text-slate-500 font-mono text-[11px]">
              Dedicated in honor of Prof. Ahmed Mohamed El Hassan (Father of Sudanese Pathology).
            </p>
          </div>

          {/* Core Routes */}
          <div className="text-start space-y-2">
            <p className="font-bold text-white uppercase tracking-wider text-[11px]">{isRtl ? 'الروابط الرئيسية' : 'Quick Access'}</p>
            <ul className="space-y-1.5">
              <li><Link to="/bls?hub=cairo" className="hover:text-[#00F2FE] transition-colors">{isRtl ? 'ورشة القاهرة (٢٨ أغسطس)' : 'Cairo Dokki Hub (Aug 28)'}</Link></li>
              <li><Link to="/bls?hub=sudan" className="hover:text-[#00F2FE] transition-colors">{isRtl ? 'ورشة السودان (١٠ سبتمبر)' : 'Sudan Hub (Sept 10)'}</Link></li>
              <li><Link to="/courses" className="hover:text-[#00F2FE] transition-colors">{isRtl ? 'البرامج والزمالات' : 'Sovereign Programs'}</Link></li>
              <li><Link to="/verify" className="hover:text-[#00F2FE] transition-colors">{isRtl ? 'التحقق من الاعتماد' : 'Verify SudaPass Credential'}</Link></li>
            </ul>
          </div>

          {/* Coordination Desks */}
          <div className="text-start space-y-2">
            <p className="font-bold text-white uppercase tracking-wider text-[11px]">{isRtl ? 'مكاتب التنسيق المباشر' : 'Direct Coordination'}</p>
            <ul className="space-y-1.5 font-mono text-[11px]">
              <li>🇪🇬 Cairo Desk: +20 101 592 2628</li>
              <li>🇸🇦 Riyadh Hub: +966 55 047 6176</li>
              <li>🇸🇩 Sudan Desk: direct@geneacademy.net</li>
            </ul>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-white/5 text-center text-slate-500 text-[11px] font-mono">
          © {new Date().getFullYear()} GemIInI Academy & SudaGene Consortium. All rights reserved.
        </div>
      </footer>

    </div>
  );
}
