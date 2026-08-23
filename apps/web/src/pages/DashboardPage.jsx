import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import {
    CalendarDays,
    ExternalLink,
    FileText,
    FolderOpen,
    Sparkles,
    Trophy,
    Stethoscope,
    Dna,
    Truck,
    ShieldCheck,
    CheckCircle2,
    Clock,
    Activity,
    QrCode,
    Cpu
} from 'lucide-react';
import Layout from '@/components/site/Layout';
import { CourseCard, DemoBadge, ProgressBar, Section } from '@/components/site/Bits';
import HolographicTiltCard from '@/components/HolographicTiltCard';
import { useLang } from '@/i18n/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { appointments, courses, invoices, leaderboard, sharedFiles } from '@/data/demo';
import { SOVEREIGN_ECOSYSTEM } from '@/data/sovereign-config';

const Panel = ({ icon: Icon, title, children, action, className }) => (
    <section className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className || ''}`}>
        <header className="mb-4 flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <h2 className="flex items-center gap-2 font-display text-base font-bold text-slate-900">
                <Icon className="h-5 w-5 text-teal-600" strokeWidth={1.8} />
                {title}
            </h2>
            {action}
        </header>
        {children}
    </section>
);

const DashboardPage = () => {
    const { t, lang } = useLang();
    const { user } = useAuth();
    const [activeMode, setActiveMode] = useState('clinician'); // 'clinician' | 'researcher' | 'glomet'

    const name = user?.full_name || user?.name || (lang === 'ar' ? 'د. أحمد عبد الرحمن' : 'Dr. Ahmed Abdelrahman');
    const gp = user?.gp_points ?? user?.gp ?? 1250;
    const tier = user?.tier || 'Sovereign Vanguard';
    const gaId = user?.ga_id || user?.id || 'GA0171';
    const workspace = user?.workspace_url || `https://drive.google.com/drive/u/0/folders/Sovereign_Workspace_${gaId}`;
    const univ = user?.university || (lang === 'ar' ? 'جامعة الخرطوم - كلية الطب' : 'University of Khartoum - Faculty of Medicine');

    const memberData = {
        id: gaId,
        name: name,
        name_ar: name,
        university: univ,
        university_ar: univ,
        role: activeMode === 'clinician' ? 'Clinical Licensure Vanguard' : activeMode === 'researcher' ? 'Senior Molecular Fellow' : 'Hospital Procurement Director',
        gp: gp,
        ects: 58.5,
        smcScore: '96.4%',
        tier: tier,
        hash: 'SUDAPASS-ED25519-SOVEREIGN-VERIFIED'
    };

    return (
        <Layout>
            <Helmet>
                <title>Sovereign Execution Dashboard | SudaGene Consortium</title>
                <meta name="description" content="لوحة التحكم السريرية المعتمدة: مسارات MTC، رصيد GP، السجل السيادي ومساحة Google Workspace المخصصة." />
            </Helmet>

            {/* DARK SOVEREIGN COCKPIT HERO */}
            <section className="bg-[#0A0D16] text-white border-b border-white/10">
                <div className="mx-auto max-w-[90rem] px-5 py-10 lg:px-10">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 rounded-full bg-teal-500/20 border border-teal-500/40 px-3 py-0.5 text-[11px] font-mono text-teal-300 font-bold">
                                    <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                                    SOVEREIGN AUTHENTICATED
                                </span>
                                <span className="text-xs font-mono text-amber-400 font-bold">
                                    {gaId}
                                </span>
                            </div>
                            <h1 className="mt-2 text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                                {name}
                            </h1>
                            <p className="mt-1 text-xs text-gray-400 font-mono">
                                🏛️ {univ}
                            </p>
                        </div>

                        {/* Quick Action Badges */}
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-center">
                                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-mono block">Sovereign GP</span>
                                <span className="text-xl font-mono font-extrabold text-amber-400">+{gp.toLocaleString()} GP</span>
                            </div>

                            <a
                                href={workspace}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 text-xs font-bold transition-colors shadow-lg shadow-teal-600/20"
                            >
                                <FolderOpen className="w-4 h-4" />
                                <span>{lang === 'ar' ? 'مساحة Google Drive المخصصة 📂' : 'Access Provisioned Drive 📂'}</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    </div>

                    {/* SITUATION SELECTOR (3 DISTINGUISHED MODES) */}
                    <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                        <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                            {lang === 'ar' ? 'نمط لوحة التحكم النشط:' : 'Active Situation Console:'}
                        </span>
                        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                            <button
                                onClick={() => setActiveMode('clinician')}
                                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    activeMode === 'clinician' ? 'bg-teal-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                <Stethoscope className="w-3.5 h-3.5" />
                                <span>{lang === 'ar' ? 'المسار السريري (GemIInI)' : 'Clinician Console'}</span>
                            </button>
                            <button
                                onClick={() => setActiveMode('researcher')}
                                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    activeMode === 'researcher' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                <Dna className="w-3.5 h-3.5" />
                                <span>{lang === 'ar' ? 'المسار البحثي 15:5:1 (Gene)' : 'Research Pod Matrix'}</span>
                            </button>
                            <button
                                onClick={() => setActiveMode('glomet')}
                                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    activeMode === 'glomet' ? 'bg-amber-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                <Truck className="w-3.5 h-3.5" />
                                <span>{lang === 'ar' ? 'إدارة المستشفيات (GLOMEt)' : 'B2B Hospital Portal'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* DASHBOARD CONTENT GRID */}
            <Section className="py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT COLUMN: Holographic ID & Status */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col items-center">
                            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-4 text-center">
                                {lang === 'ar' ? 'بطاقة الاعتماد المشفرة التفاعلية' : 'Interactive Cryptographic ID'}
                            </h3>
                            <HolographicTiltCard member={memberData} />
                        </div>

                        {/* Verified ECTS Transcript */}
                        <Panel icon={Trophy} title={lang === 'ar' ? 'السجل الأكاديمي المعتمد' : 'Verified Academic Transcript'}>
                            <div className="space-y-3 text-xs">
                                <div className="flex justify-between py-1.5 border-b border-slate-100">
                                    <span className="text-slate-500">إجمالي الساعات الأوروبية (ECTS):</span>
                                    <strong className="font-mono text-teal-600">58.5 ECTS</strong>
                                </div>
                                <div className="flex justify-between py-1.5 border-b border-slate-100">
                                    <span className="text-slate-500">ساعات التعليم الطبي المستمر (CPD):</span>
                                    <strong className="font-mono text-teal-600">40 CME Hours</strong>
                                </div>
                                <div className="flex justify-between py-1.5 border-b border-slate-100">
                                    <span className="text-slate-500">حالة اعتماد المجلس الطبي (SMC):</span>
                                    <strong className="text-emerald-600 font-bold">Passed (96.4%) ✓</strong>
                                </div>
                                <div className="flex justify-between py-1.5">
                                    <span className="text-slate-500">حالة المهارات الجراحية BSS-2:</span>
                                    <strong className="text-emerald-600 font-bold">Cairo Certified ✓</strong>
                                </div>
                            </div>
                        </Panel>
                    </div>

                    {/* RIGHT TWO COLUMNS: DYNAMIC SITUATION CONSOLE */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* SITUATION 1: CLINICAL LICENSURE & MTC BENCHMARKS */}
                        {activeMode === 'clinician' && (
                            <div className="space-y-6">
                                <Panel icon={Activity} title={lang === 'ar' ? 'مؤشرات التدرج السريري MTC™ (20% ← 100%)' : 'MTC™ Clinical Progression Benchmarks'}>
                                    <div className="space-y-4">
                                        {[
                                            { name: 'SMC-101: Internal Medicine & Hyponatremia Deficit', prog: 100, status: 'Passed (100%)' },
                                            { name: 'SMC-102: General Surgery & Tension Pneumothorax Triage', prog: 95, status: '95% Mastery' },
                                            { name: 'SMC-103: Obstetrics PPH Medical/Surgical Algorithms', prog: 80, status: '80% Competent' },
                                            { name: 'SMC-104: Pediatric NRP & Severe Dehydration Fluids', prog: 60, status: '60% In Progress' },
                                            { name: 'SMC-106: Clinical Pharmacology & TDM Vancomycin', prog: 20, status: '20% Staged' },
                                        ].map((m, idx) => (
                                            <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                                                <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                                                    <span>{m.name}</span>
                                                    <span className="font-mono text-teal-600">{m.status}</span>
                                                </div>
                                                <ProgressBar value={m.prog} className="h-2" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                                        <Link to="/quiz/smc-exam" className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:underline">
                                            <span>دخول محاكي الامتحان السريري MTC™ ←</span>
                                        </Link>
                                    </div>
                                </Panel>

                                <Panel icon={FileText} title={lang === 'ar' ? 'المستندات والملفات المتبادلة' : 'Shared Workspace Documents'}>
                                    <div className="divide-y divide-slate-100 text-xs">
                                        {sharedFiles.slice(0, 4).map((f) => (
                                            <div key={f.id} className="py-2.5 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-slate-400" />
                                                    <span className="font-medium text-slate-800">{f.name}</span>
                                                </div>
                                                <span className="font-mono text-slate-400">{f.size}</span>
                                            </div>
                                        ))}
                                    </div>
                                </Panel>
                            </div>
                        )}

                        {/* SITUATION 2: RESEARCH POD MATRIX 15:5:1 */}
                        {activeMode === 'researcher' && (
                            <div className="space-y-6">
                                <Panel icon={Dna} title={lang === 'ar' ? 'مصفوفة مجموعات الأبحاث 15:5:1 (المجموعة النشطة: #1 أورام)' : 'Active Research Pod: #1 Liquid Biopsies'}>
                                    <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 mb-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-purple-900">المشرف الرئيسي (PI): د. محمد جبريل</span>
                                            <span className="text-xs font-mono font-bold text-purple-700">1 Senior → 5 Uni → 15 Pre-Meds</span>
                                        </div>
                                        <p className="text-xs text-purple-800 mt-1">
                                            مشروع البحث النشط: تحليل الحمض النووي الحر (ctDNA) في سرطان الثدي والجهاز الهضمي لدى العينات الإقليمية.
                                        </p>
                                    </div>
                                    <div className="space-y-3 text-xs">
                                        <div className="flex justify-between py-2 border-b border-slate-100">
                                            <span className="text-slate-600">مرحلة البحث الحالية:</span>
                                            <strong className="text-purple-700">Bioinformatics Variant Calling (BAM/VCF)</strong>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-slate-100">
                                            <span className="text-slate-600">الأوراق المستهدفة للنشر:</span>
                                            <strong className="text-slate-800">Scopus Q1 / PubMed Indexed</strong>
                                        </div>
                                        <div className="flex justify-between py-2">
                                            <span className="text-slate-600">منحة GLOMEt البحثية المغطاة:</span>
                                            <strong className="text-emerald-600 font-bold">$1,500 Full CSR Grant Funded ✓</strong>
                                        </div>
                                    </div>
                                </Panel>
                            </div>
                        )}

                        {/* SITUATION 3: GLOMET B2B HOSPITAL & PROCUREMENT */}
                        {activeMode === 'glomet' && (
                            <div className="space-y-6">
                                <Panel icon={Truck} title={lang === 'ar' ? 'لوحة إدارة أجهزة وكواشف المختبرات الطبية (GLOMEt HQ)' : 'GLOMEt Laboratory Telemetry'}>
                                    <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
                                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/60">
                                            <span className="text-amber-800 font-bold block mb-1">المستشفيات الشريكة المعتمدة:</span>
                                            <span className="text-lg font-extrabold font-mono text-amber-900">40 مستشفى ومركز</span>
                                        </div>
                                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/60">
                                            <span className="text-emerald-800 font-bold block mb-1">المخزون الاستراتيجي للكواشف:</span>
                                            <span className="text-lg font-extrabold font-mono text-emerald-900">90 يوماً متواصلة ✓</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-xs">
                                        <div className="flex justify-between py-2 border-b border-slate-100">
                                            <span className="text-slate-600">أجهزة CBC الآلية الموردة (5-Part):</span>
                                            <strong className="font-mono text-slate-800">28 جهاز نشط</strong>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-slate-100">
                                            <span className="text-slate-600">مختبرات الـ RT-PCR النظيفة (Turnkey):</span>
                                            <strong className="font-mono text-slate-800">6 مختبرات مرجعية</strong>
                                        </div>
                                        <div className="flex justify-between py-2">
                                            <span className="text-slate-600">اتفاقية مستوى الصيانة الطبية (SLA):</span>
                                            <strong className="text-emerald-600 font-bold">أقل من 48 ساعة استجابة ✓</strong>
                                        </div>
                                    </div>
                                </Panel>
                            </div>
                        )}

                    </div>

                </div>
            </Section>
        </Layout>
    );
};

export default DashboardPage;
