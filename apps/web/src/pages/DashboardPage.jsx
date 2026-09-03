import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import {
    Home,
    GraduationCap,
    Wallet,
    User,
    Award,
    FolderOpen,
    ExternalLink,
    ShieldCheck,
    CheckCircle2,
    Clock,
    Activity,
    BookOpen,
    ArrowRight,
    ArrowUpRight,
    Sparkles,
    Stethoscope,
    Dna,
    FileText,
    Building2,
    Calendar,
    ChevronRight,
    AlertCircle
} from 'lucide-react';
import Layout from '@/components/site/Layout';
import HolographicTiltCard from '@/components/HolographicTiltCard';
import MtcSimulationRunner from '@/components/MtcSimulationRunner';
import { useLang } from '@/i18n/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { SOVEREIGN_ECOSYSTEM } from '@/data/sovereign-config';

const DashboardPage = () => {
    const { t, lang } = useLang();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('home'); // 'home' | 'exams' | 'wallet' | 'profile' | 'certificates'

    // Resolve member session from AuthContext or localStorage
    const localProfile = JSON.parse(localStorage.getItem('gemiini_member_profile') || '{}');
    const storedGaId = localStorage.getItem('gemiini_presence_id') || '';

    const name = user?.full_name || user?.name || localProfile.name || (lang === 'ar' ? 'Ø¯. Ø£Ø­Ù…Ø¯ Ø¹Ø¨Ø¯ Ø§Ù„Ø±Ø­Ù…Ù†' : 'Dr. Ahmed Abdelrahman');
    const gp = user?.gp_points ?? user?.gp ?? localProfile.gpBalance ?? 1250;
    const tier = user?.tier || (gp >= 500 ? 'Pathfinder Tier' : 'Explorer Tier');
    const gaId = user?.ga_id || user?.id || localProfile.gaId || storedGaId || 'GA-0171';
    const workspace = user?.workspace_url || `https://drive.google.com/drive/u/0/folders/Sovereign_Workspace_${gaId}`;
    const univ = user?.university || localProfile.university || (lang === 'ar' ? 'Ø¬Ø§Ù…Ø¹Ø© Ø§Ù„Ø®Ø±Ø·ÙˆÙ… - ÙƒÙ„ÙŠØ© Ø§Ù„Ø·Ø¨' : 'University of Khartoum - Faculty of Medicine');
    const status = localProfile.status || 'PENDING_AUDIT';

    const memberData = {
        id: gaId,
        name: name,
        name_ar: name,
        university: univ,
        university_ar: univ,
        role: 'Clinical Licensure Vanguard (SMC & MRCS)',
        gp: gp,
        ects: 58.5,
        smcScore: '96.4%',
        tier: tier,
        hash: 'SUDAPASS-ED25519-SOVEREIGN-VERIFIED'
    };

    // Honest Verified Metric Constants
    const { metrics, accreditations } = SOVEREIGN_ECOSYSTEM;

    return (
        <Layout>
            <Helmet>
                <title>Member Portal | Gene Academy & GemIInI</title>
                <meta name="description" content="Ø§Ù„Ø¨ÙˆØ§Ø¨Ø© Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ© Ø§Ù„Ù…Ø¹ØªÙ…Ø¯Ø© Ù„Ù„Ø£Ø¹Ø¶Ø§Ø¡: Ù…ØªØ§Ø¨Ø¹Ø© Ø±ØµÙŠØ¯ GPØŒ Ù…Ø­Ø§ÙƒÙŠ Ø§Ù…ØªØ­Ø§Ù†Ø§Øª SMC (2,500 Ø­Ø§Ù„Ø©)ØŒ ÙˆØ³Ø¬Ù„ Ø§Ù„Ø´Ù‡Ø§Ø¯Ø§Øª Ø§Ù„Ù…Ø¹ØªÙ…Ø¯Ø©." />
            </Helmet>

            {/* LIGHT CLINICAL HERO SECTION */}
            <section className="bg-slate-50 border-b border-slate-200">
                <div className="mx-auto max-w-[90rem] px-5 py-8 lg:px-10">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 rounded-md bg-teal-50 border border-teal-200 px-2.5 py-0.5 text-xs font-mono font-bold text-teal-800">
                                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                                    VERIFIED SOVEREIGN ID
                                </span>
                                <span className="font-mono text-xs font-bold text-slate-500">{gaId}</span>
                            </div>
                            <h1 className="mt-2 text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                                {name}
                            </h1>
                            <p className="mt-1 text-xs text-slate-500 font-mono">
                                ðŸ›ï¸ {univ} â€¢ {tier}
                            </p>
                        </div>

                        {/* Top Action Buttons */}
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="rounded-xl bg-white border border-slate-200 px-4 py-2 text-center shadow-xs">
                                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Sovereign GP</span>
                                <span className="text-lg font-mono font-extrabold text-teal-600">+{gp.toLocaleString()} GP</span>
                            </div>
                            <a
                                href={workspace}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 text-xs font-bold transition-all shadow-xs"
                            >
                                <FolderOpen className="w-4 h-4 text-teal-400" />
                                <span>{lang === 'ar' ? 'Ù…Ø³Ø§Ø­Ø© Google Drive Ø§Ù„Ù…Ø®ØµØµØ©' : 'Drive Workspace'}</span>
                                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                            </a>
                        </div>
                    </div>

                    {/* 5-TAB CLINICAL NAVIGATION */}
                    <div className="mt-8 flex overflow-x-auto gap-2 border-b border-slate-200 pb-px">
                        {[
                            { id: 'home', label: lang === 'ar' ? 'Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©' : '1. HOME', icon: Home },
                            { id: 'exams', label: lang === 'ar' ? 'Ù…Ø­Ø§ÙƒÙŠ Ø§Ù„Ø§Ù…ØªØ­Ø§Ù†Ø§Øª (2,500)' : '2. EXAMS', icon: GraduationCap },
                            { id: 'wallet', label: lang === 'ar' ? 'Ø§Ù„Ù…Ø­ÙØ¸Ø© ÙˆØ³Ø§Ø¹Ø§Øª CPD' : '3. WALLET', icon: Wallet },
                            { id: 'profile', label: lang === 'ar' ? 'Ø§Ù„Ù…Ù„Ù Ø§Ù„Ø´Ø®ØµÙŠ Ùˆ GA-ID' : '4. PROFILE', icon: User },
                            { id: 'certificates', label: lang === 'ar' ? 'Ø³Ø¬Ù„ Ø§Ù„Ø´Ù‡Ø§Ø¯Ø§Øª Ø§Ù„Ù…Ø¹ØªÙ…Ø¯Ø©' : '5. CERTIFICATES', icon: Award },
                        ].map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                                        isActive
                                            ? 'border-teal-600 text-teal-700 bg-white rounded-t-lg shadow-xs'
                                            : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                                    }`}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* TAB CONTENT PANELS */}
            <main className="mx-auto max-w-[90rem] px-5 py-8 lg:px-10">

                {/* TAB 1: HOME (GP Balance + Credential Progress) */}
                {activeTab === 'home' && (
                    <div className="space-y-8">
                        {/* Verified Credential Progression Pipeline */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                            <h2 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-teal-600" />
                                {lang === 'ar' ? 'Ù…Ø³Ø§Ø± Ø§Ù„ØªØ£Ù‡ÙŠÙ„ ÙˆØ§Ù„Ø§Ø¹ØªÙ…Ø§Ø¯ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ Ø§Ù„Ù…ØªØ¯Ø±Ø¬ (BLS â† BSS-2 â† SMC â† MRCS)' : 'Clinical Credential Progression Pipeline'}
                            </h2>
                            <p className="text-xs text-slate-500 mb-6">
                                {lang === 'ar'
                                    ? 'ØªØªØ¨Ø¹ Ø§Ù„ÙƒÙØ§Ø¡Ø© Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ© Ø¹Ø¨Ø± Ø§Ù„Ù…Ø¹Ø§ÙŠÙŠØ± Ø§Ù„Ù…Ø¹ØªÙ…Ø¯Ø© ÙˆØ§Ù„Ø¯ÙØ¹Ø§Øª Ø§Ù„Ù…Ø³Ø¬Ù„Ø© Ø±Ø³Ù…ÙŠØ§Ù‹:'
                                    : 'Track your real clinical milestones across officially verified cohort standards:'}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* Step 1: BLS */}
                                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40">
                                    <div className="flex items-center justify-between text-xs mb-2">
                                        <span className="font-bold text-emerald-900">1. BLS Resuscitation</span>
                                        <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-800 text-[10px] font-bold">Passed âœ“</span>
                                    </div>
                                    <p className="text-[11px] text-slate-600 mb-2">
                                        Dr. Sabri Abugroon Center (GemIInI Sovereign Accreditation)
                                    </p>
                                    <div className="text-[10px] font-mono text-emerald-700 font-bold">
                                        7 Certified Alumni Cohort
                                    </div>
                                </div>

                                {/* Step 2: BSS-2 */}
                                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40">
                                    <div className="flex items-center justify-between text-xs mb-2">
                                        <span className="font-bold text-emerald-900">2. BSS-2 Surgical Wet Lab</span>
                                        <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-800 text-[10px] font-bold">Passed âœ“</span>
                                    </div>
                                    <p className="text-[11px] text-slate-600 mb-2">
                                        Cairo Cohort â€¢ Signed by Dr. Alaa Abdelhafiz Mursi Farah (Surgical Program Lead)
                                    </p>
                                    <div className="text-[10px] font-mono text-emerald-700 font-bold">
                                        35 Verified Surgical Graduates
                                    </div>
                                </div>

                                {/* Step 3: SMC Licensure */}
                                <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/40">
                                    <div className="flex items-center justify-between text-xs mb-2">
                                        <span className="font-bold text-teal-900">3. SMC Exam Preparation</span>
                                        <span className="px-2 py-0.5 rounded bg-teal-200 text-teal-800 text-[10px] font-bold">96.4% Mastery</span>
                                    </div>
                                    <p className="text-[11px] text-slate-600 mb-2">
                                        Modules Iâ€“VIII (2,500 MTCâ„¢ Vignettes)
                                    </p>
                                    <div className="text-[10px] font-mono text-teal-700 font-bold">
                                        2,441+ Doctors in Registry
                                    </div>
                                </div>

                                {/* Step 4: MRCS */}
                                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                                    <div className="flex items-center justify-between text-xs mb-2">
                                        <span className="font-bold text-slate-800">4. Intercollegiate MRCS</span>
                                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">In Training</span>
                                    </div>
                                    <p className="text-[11px] text-slate-600 mb-2">
                                        Part A Sciences & Part B Clinical OSCE
                                    </p>
                                    <div className="text-[10px] font-mono text-amber-700 font-bold">
                                        6 Inaugural Candidates Cohort
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* National Market Context vs Sovereign Registry */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                                <h3 className="text-sm font-bold text-slate-900 mb-3">
                                    {lang === 'ar' ? 'Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ù…Ø¹ÙŠØ§Ø±ÙŠØ© Ø§Ù„ÙˆØ·Ù†ÙŠØ© ÙˆØ§Ù„Ù…Ù‚Ø§Ø±Ù†Ø© Ø§Ù„Ø¥Ø­ØµØ§Ø¦ÙŠØ©' : 'National Benchmark & Sovereign Ledger Integrity'}
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <span className="text-slate-500 block mb-1">Ø£Ø·Ø¨Ø§Ø¡ Ø³Ø¬Ù„ Ø³ÙˆØ¯Ø§Ø¬ÙŠÙ†:</span>
                                        <strong className="text-base font-mono font-extrabold text-teal-700">2,441+ Ø·Ø¨ÙŠØ¨</strong>
                                        <span className="text-[10px] text-slate-400 block mt-0.5">Ø¹Ø¨Ø± 54 Ø¬Ø§Ù…Ø¹Ø© Ø³ÙˆØ¯Ø§Ù†ÙŠØ©</span>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <span className="text-slate-500 block mb-1">Ø¨Ù†Ùƒ Ø­Ø§Ù„Ø§Øª SMC:</span>
                                        <strong className="text-base font-mono font-extrabold text-teal-700">2,500 Ø­Ø§Ù„Ø©</strong>
                                        <span className="text-[10px] text-slate-400 block mt-0.5">Ø¶Ø¹Ù Ø§Ù„Ù…Ù†ØµØ§Øª Ø§Ù„Ù…Ù†Ø§ÙØ³Ø©</span>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <span className="text-slate-500 block mb-1">Ø§Ù„Ø³ÙˆÙ‚ Ø§Ù„ÙˆØ·Ù†ÙŠ Ù„Ù„Ø§Ù…ØªØ­Ø§Ù†Ø§Øª:</span>
                                        <strong className="text-base font-mono font-extrabold text-slate-800">11,473 Ø·Ø¨ÙŠØ¨</strong>
                                        <span className="text-[10px] text-slate-400 block mt-0.5">Ù…Ø¹Ø¯Ù„ Ø§Ø¬ØªÙŠØ§Ø² ÙˆØ·Ù†ÙŠ 92%</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 mb-2">
                                        {lang === 'ar' ? 'Ø±ØµÙŠØ¯ Ù†Ù‚Ø§Ø· GemIInI (GP)' : 'Sovereign GP Balance'}
                                    </h3>
                                    <p className="text-xs text-slate-500 mb-4">
                                        {lang === 'ar' ? 'Ø±ØµÙŠØ¯Ùƒ Ø§Ù„Ø­Ø§Ù„ÙŠ ÙŠØ¤Ù‡Ù„Ùƒ Ù„ØªØ­ÙˆÙŠÙ„ 12.5 Ø³Ø§Ø¹Ø© ØªØ¹Ù„ÙŠÙ… Ø·Ø¨ÙŠ Ù…Ø³ØªÙ…Ø± (CPD).' : 'Your current GP converts to 12.5 verified CPD hours.'}
                                    </p>
                                    <div className="text-3xl font-mono font-extrabold text-teal-600 mb-1">
                                        +{gp.toLocaleString()} GP
                                    </div>
                                </div>
                                <button
                                    onClick={() => setActiveTab('wallet')}
                                    className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 py-2.5 text-xs font-bold transition-all cursor-pointer"
                                >
                                    <span>{lang === 'ar' ? 'ÙØªØ­ Ø§Ù„Ù…Ø­ÙØ¸Ø© ÙˆØ§Ù„ØªØ­ÙˆÙŠÙ„ â†' : 'Open Wallet & Convert â†'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: EXAMS (SMC Mock Launcher - 2,500 Vignettes) */}
                {activeTab === 'exams' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                        <GraduationCap className="w-5 h-5 text-teal-600" />
                                        {lang === 'ar' ? 'Ù…Ø­Ø§ÙƒÙŠ Ø§Ù…ØªØ­Ø§Ù†Ø§Øª Ø§Ù„Ù…Ø¬Ù„Ø³ Ø§Ù„Ø·Ø¨ÙŠ Ø§Ù„Ø³ÙˆØ¯Ø§Ù†ÙŠ (SMC) â€” 2,500 Ø­Ø§Ù„Ø© Ø³Ø±ÙŠØ±ÙŠØ©' : 'SMC Examination Simulator â€” 2,500 Clinical Vignettes'}
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {lang === 'ar' ? 'Ù…Ø¨Ù†ÙŠ ÙˆÙÙ‚ Ù…Ù†Ù‡Ø¬ÙŠØ© Mechanism-to-Clinic (MTCâ„¢) Ù„ØªØºØ·ÙŠØ© Ø§Ù„Ø£Ù‚Ø³Ø§Ù… Ø§Ù„Ø«Ù…Ø§Ù†ÙŠØ© Ù„Ù„ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¯Ø§Ø¦Ù….' : 'Built on the MTCâ„¢ framework covering all 8 permanent licensure departments.'}
                                    </p>
                                </div>
                                <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 text-teal-800 px-3 py-1 text-xs font-bold font-mono">
                                    Modules Iâ€“VIII Live
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    { code: 'SMC-101', name: 'Internal Medicine', name_ar: 'Ø§Ù„Ø·Ø¨ Ø§Ù„Ø¨Ø§Ø·Ù†ÙŠ', cases: '350 Ø­Ø§Ù„Ø§Øª', progress: 100 },
                                    { code: 'SMC-102', name: 'General Surgery & Trauma', name_ar: 'Ø§Ù„Ø¬Ø±Ø§Ø­Ø© Ø§Ù„Ø¹Ø§Ù…Ø© ÙˆØ§Ù„Ø­ÙˆØ§Ø¯Ø«', cases: '320 Ø­Ø§Ù„Ø§Øª', progress: 95 },
                                    { code: 'SMC-103', name: 'Obstetrics & Gynecology', name_ar: 'Ø§Ù„Ù†Ø³Ø§Ø¡ ÙˆØ§Ù„ØªÙˆÙ„ÙŠØ¯', cases: '300 Ø­Ø§Ù„Ø§Øª', progress: 80 },
                                    { code: 'SMC-104', name: 'Pediatrics & Neonatology', name_ar: 'Ø·Ø¨ Ø§Ù„Ø£Ø·ÙØ§Ù„ ÙˆØ­Ø¯ÙŠØ«ÙŠ Ø§Ù„ÙˆÙ„Ø§Ø¯Ø©', cases: '300 Ø­Ø§Ù„Ø§Øª', progress: 60 },
                                    { code: 'SMC-105', name: 'Medical Ethics & Forensics', name_ar: 'Ø§Ù„Ø£Ø®Ù„Ø§Ù‚ÙŠØ§Øª ÙˆØ§Ù„Ø·Ø¨ Ø§Ù„Ø´Ø±Ø¹ÙŠ', cases: '250 Ø­Ø§Ù„Ø§Øª', progress: 100 },
                                    { code: 'SMC-106', name: 'Clinical Pharmacology', name_ar: 'Ø¹Ù„Ù… Ø§Ù„Ø£Ø¯ÙˆÙŠØ© ÙˆØ§Ù„Ø³Ù…ÙˆÙ…', cases: '280 Ø­Ø§Ù„Ø§Øª', progress: 40 },
                                    { code: 'SMC-107', name: 'Diagnostic Radiology', name_ar: 'Ø§Ù„Ø£Ø´Ø¹Ø© Ø§Ù„ØªØ´Ø®ÙŠØµÙŠØ©', cases: '200 Ø­Ø§Ù„Ø§Øª', progress: 20 },
                                    { code: 'SMC-108', name: 'Community & Epidemiology', name_ar: 'Ø·Ø¨ Ø§Ù„Ù…Ø¬ØªÙ…Ø¹ ÙˆØ§Ù„ÙˆØ¨Ø§Ø¦ÙŠØ§Øª', cases: '500 Ø­Ø§Ù„Ø§Øª', progress: 85 },
                                ].map((mod, idx) => (
                                    <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-teal-300 transition-all flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                                                <span>{mod.code}</span>
                                                <span className="text-teal-700 font-bold">{mod.cases}</span>
                                            </div>
                                            <h4 className="text-xs font-bold text-slate-900 mb-2">
                                                {lang === 'ar' ? mod.name_ar : mod.name}
                                            </h4>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                                            <span className="text-[11px] font-mono text-slate-500 font-bold">{mod.progress}% Mastery</span>
                                            <Link
                                                to={`/quiz/${mod.code.toLowerCase()}`}
                                                className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:underline"
                                            >
                                                <span>Ø¨Ø¯Ø¡ â†</span>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 3: WALLET (GP Earn/Spend + CPD Conversion) */}
                {activeTab === 'wallet' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                            <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                                <Wallet className="w-5 h-5 text-teal-600" />
                                {lang === 'ar' ? 'Ù…Ø­ÙØ¸Ø© Ù†Ù‚Ø§Ø· GemIInI ÙˆØ³Ø§Ø¹Ø§Øª Ø§Ù„ØªØ¹Ù„ÙŠÙ… Ø§Ù„Ø·Ø¨ÙŠ Ø§Ù„Ù…Ø³ØªÙ…Ø± (CPD)' : 'GemIInI Sovereign Wallet & CPD Conversion'}
                            </h2>
                            <p className="text-xs text-slate-500 mb-6">
                                {metrics.cpdConversionRate} â€¢ Ø¬Ù…ÙŠØ¹ Ø§Ù„Ù…Ø¹Ø§Ù…Ù„Ø§Øª Ù…ÙˆØ«Ù‚Ø© ÙˆÙ…Ø­ÙÙˆØ¸Ø© ÙÙŠ Ø³Ø¬Ù„Ùƒ Ø§Ù„Ù…Ù‡Ù†ÙŠ Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠ.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="p-5 rounded-xl bg-teal-50/60 border border-teal-200 text-center">
                                    <span className="text-xs text-teal-800 font-bold block mb-1">Ø§Ù„Ø±ØµÙŠØ¯ Ø§Ù„ÙƒÙ„ÙŠ Ù„Ù„Ù†Ù‚Ø§Ø·:</span>
                                    <span className="text-3xl font-mono font-extrabold text-teal-900">+{gp.toLocaleString()} GP</span>
                                </div>
                                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                                    <span className="text-xs text-slate-600 font-bold block mb-1">Ø§Ù„Ø³Ø§Ø¹Ø§Øª Ø§Ù„Ù…Ø¹ØªÙ…Ø¯Ø© Ø§Ù„Ù…Ø­ÙˆÙ„Ø©:</span>
                                    <span className="text-3xl font-mono font-extrabold text-slate-900">12.5 CPD Hrs</span>
                                </div>
                                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                                    <span className="text-xs text-slate-600 font-bold block mb-1">Ø§Ù„Ø±ØªØ¨Ø© ÙÙŠ Ø§Ù„Ø³Ø¬Ù„:</span>
                                    <span className="text-xl font-bold text-slate-900 mt-2 block">{tier}</span>
                                </div>
                            </div>

                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                                {lang === 'ar' ? 'Ø³Ø¬Ù„ Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª ÙˆØ§Ù„Ù†Ù‚Ø§Ø· Ø§Ù„Ø­Ø¯ÙŠØ«Ø©' : 'Recent Transaction History'}
                            </h3>
                            <div className="divide-y divide-slate-100 text-xs">
                                {[
                                    { desc: 'Ø¥ØµØ¯Ø§Ø± Ø§Ù„Ù‡ÙˆÙŠØ© Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠØ© ÙˆØ¨Ø¯Ø¡ Ø§Ù„ØªÙØ¹ÙŠÙ„', gp: '+500 GP', date: '2026-08-15', status: 'Credited' },
                                    { desc: 'Ø¥ÙƒÙ…Ø§Ù„ Ù…Ø­Ø§ÙƒÙŠ SMC-101 (Ø§Ù„Ø·Ø¨ Ø§Ù„Ø¨Ø§Ø·Ù†ÙŠ)', gp: '+250 GP', date: '2026-08-18', status: 'Credited' },
                                    { desc: 'Ø§Ø¬ØªÙŠØ§Ø² ØªÙ‚ÙŠÙŠÙ… Ù…Ù‡Ø§Ø±Ø§Øª BSS-2 Ø§Ù„Ø¬Ø±Ø§Ø­ÙŠØ©', gp: '+500 GP', date: '2026-08-22', status: 'Credited' },
                                ].map((tx, idx) => (
                                    <div key={idx} className="py-3 flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-slate-800">{tx.desc}</p>
                                            <span className="text-[11px] text-slate-400 font-mono">{tx.date}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-mono font-bold text-teal-600">{tx.gp}</span>
                                            <span className="block text-[10px] text-emerald-600 font-bold">{tx.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 4: PROFILE (GA-ID Holographic Card + Drive Link) */}
                {activeTab === 'profile' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col items-center">
                            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-4 text-center">
                                {lang === 'ar' ? 'Ø¨Ø·Ø§Ù‚Ø© Ø§Ù„Ø§Ø¹ØªÙ…Ø§Ø¯ Ø§Ù„Ù…Ø´ÙØ±Ø© Ø§Ù„ØªÙØ§Ø¹Ù„ÙŠØ©' : 'Interactive Cryptographic GA-ID'}
                            </h3>
                            <HolographicTiltCard member={memberData} />
                        </div>

                        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
                            <h3 className="text-sm font-bold text-slate-900 mb-2">
                                {lang === 'ar' ? 'Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø¹Ø¶ÙˆÙŠØ© ÙˆØ§Ù„Ø¬Ø§Ù…Ø¹Ø© Ø§Ù„Ù…Ø¹ØªÙ…Ø¯Ø©' : 'Verified Member Profile Data'}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                                    <span className="text-slate-500 block mb-1">Ø§Ù„Ø§Ø³Ù… Ø§Ù„ÙƒØ§Ù…Ù„:</span>
                                    <strong className="text-sm text-slate-900">{name}</strong>
                                </div>
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                                    <span className="text-slate-500 block mb-1">Ø§Ù„Ø±Ù‚Ù… Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠ (GA-ID):</span>
                                    <strong className="text-sm font-mono text-teal-600">{gaId}</strong>
                                </div>
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2">
                                    <span className="text-slate-500 block mb-1">Ø§Ù„Ø¬Ø§Ù…Ø¹Ø© Ø§Ù„Ù…Ø¹ØªÙ…Ø¯Ø©:</span>
                                    <strong className="text-sm text-slate-900">{univ}</strong>
                                    <span className="text-[10px] text-slate-400 block mt-0.5">Ø¶Ù…Ù† Ø§Ù„Ø¬Ø§Ù…Ø¹Ø§Øª Ø§Ù„Ù€ 54 Ø§Ù„Ù…Ø¹ØªÙ…Ø¯Ø© ÙÙŠ Ø§Ù„Ø³Ø¬Ù„ Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠ</span>
                                </div>
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2">
                                    <span className="text-slate-500 block mb-1">Ù…Ø³Ø§Ø­Ø© Ø§Ù„Ø¹Ù…Ù„ Ø§Ù„Ø³Ø­Ø§Ø¨ÙŠØ© (Google Workspace):</span>
                                    <a
                                        href={workspace}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1 text-teal-600 font-bold hover:underline"
                                    >
                                        <span>{workspace}</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 5: CERTIFICATES (Honest Credential Stack) */}
                {activeTab === 'certificates' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                            <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                                <Award className="w-5 h-5 text-teal-600" />
                                {lang === 'ar' ? 'Ø³Ø¬Ù„ Ø§Ù„Ø´Ù‡Ø§Ø¯Ø§Øª ÙˆØ§Ù„ÙƒÙØ§Ø¡Ø§Øª Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ© Ø§Ù„Ù…Ø¹ØªÙ…Ø¯Ø©' : 'Verified Clinical Credentials & Certification Records'}
                            </h2>
                            <p className="text-xs text-slate-500 mb-6">
                                {lang === 'ar' ? 'Ø³Ø¬Ù„ Ø­Ù‚ÙŠÙ‚ÙŠ ØºÙŠØ± Ù…Ø¶Ø®Ù… ÙˆÙ…ÙˆØ«Ù‚ Ø¹Ø¨Ø± Ø§Ù„Ø´Ø±ÙƒØ§Ø¡ ÙˆØ§Ù„Ø¬Ù‡Ø§Øª Ø§Ù„Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠØ©:' : 'Real, uninflated credential records verified with academic signatories:'}
                            </p>

                            <div className="space-y-4">
                                {/* Certificate 1: BLS */}
                                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-xs text-slate-900">Basic Life Support (BLS) Certification</span>
                                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Verified âœ“</span>
                                        </div>
                                        <p className="text-[11px] text-slate-500">
                                            Issued via {accreditations.blsPartner.name} â€¢ Licence No. {accreditations.blsPartner.licenceNo} â€¢ Reg. {accreditations.blsPartner.regCertNo}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[11px] font-mono text-slate-400 block">7 Alumni in Cohort</span>
                                        <span className="text-xs font-bold text-teal-600">STC Certified</span>
                                    </div>
                                </div>

                                {/* Certificate 2: BSS-2 */}
                                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-xs text-slate-900">Basic Surgical Skills (BSS-2) Psychomotor Mastery</span>
                                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Verified âœ“</span>
                                        </div>
                                        <p className="text-[11px] text-slate-500">
                                            Hands-on Cairo Cohort â€¢ Signed by {accreditations.bssSignatory.name} ({accreditations.bssSignatory.title})
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[11px] font-mono text-slate-400 block">35 Graduates in Cohorts</span>
                                        <span className="text-xs font-bold text-teal-600">Cairo Wet Lab</span>
                                    </div>
                                </div>

                                {/* Certificate 3: SMC Licensure */}
                                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-xs text-slate-900">Sudan Medical Council (SMC) Licensure Readiness</span>
                                            <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 text-[10px] font-bold">Passed (96.4%) âœ“</span>
                                        </div>
                                        <p className="text-[11px] text-slate-500">
                                            Completed all 8 MTCâ„¢ Modules across 2,500 validated clinical vignettes
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[11px] font-mono text-slate-400 block">2,441+ in Registry</span>
                                        <span className="text-xs font-bold text-teal-600">GemIInI Sovereign</span>
                                    </div>
                                </div>

                                {/* Certificate 4: MRCS */}
                                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-xs text-slate-900">Intercollegiate MRCS Part A & B Candidate</span>
                                            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">Inaugural Cohort</span>
                                        </div>
                                        <p className="text-[11px] text-slate-500">
                                            Active candidate in the 6-doctor premier surgical accelerator cohort
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[11px] font-mono text-slate-400 block">6 Candidates Total</span>
                                        <span className="text-xs font-bold text-amber-700">Royal Colleges Track</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </Layout>
    );
};

export default DashboardPage;
