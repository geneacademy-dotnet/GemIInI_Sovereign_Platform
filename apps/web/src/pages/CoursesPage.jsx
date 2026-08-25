import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { BookOpen, ShieldCheck, Sparkles, Award, FileText, CheckCircle2, Search, X, Filter } from 'lucide-react';
import Layout from '@/components/site/Layout';
import { PageHeader, Section } from '@/components/site/Bits';
import { useLang } from '@/i18n/LanguageContext';
import curriculumData from '@/data/curriculum-inventory.json';

const PILLAR_COLORS = {
    gemiini: {
        border: 'border-[hsl(var(--teal))]/40',
        bg: 'bg-[hsl(var(--teal))]/5',
        badge: 'bg-[hsl(var(--teal))]/15 text-[hsl(var(--teal))]',
        accent: 'text-[hsl(var(--teal))]',
        name: 'GemIInI Academy',
    },
    geneacademy: {
        border: 'border-purple-500/40',
        bg: 'bg-purple-500/5',
        badge: 'bg-purple-500/15 text-purple-300',
        accent: 'text-purple-400',
        name: 'GeneAcademy®',
    },
    glomet: {
        border: 'border-[hsl(var(--accent))]/40',
        bg: 'bg-[hsl(var(--accent))]/5',
        badge: 'bg-[hsl(var(--accent))]/15 text-[hsl(var(--accent))]',
        accent: 'text-[hsl(var(--accent))]',
        name: 'GLOMEt HQ',
    }
};

const CoursesPage = () => {
    const { lang } = useLang();
    const [activeTier, setActiveTier] = useState('tier_1_active');
    const [selectedPillar, setSelectedPillar] = useState('ALL');
    const [selectedTrack, setSelectedTrack] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSyllabusModal, setActiveSyllabusModal] = useState(null);

    const currentTierData = curriculumData.tiers.find((t) => t.id === activeTier) || curriculumData.tiers[0];

    // Extract unique tracks for the current tier
    const availableTracks = Array.from(new Set(currentTierData.modules.map((m) => m.track).filter(Boolean)));

    const filteredModules = currentTierData.modules.filter((m) => {
        const matchesPillar = selectedPillar === 'ALL' || m.pillar === selectedPillar;
        const matchesTrack = selectedTrack === 'ALL' || m.track === selectedTrack;
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = !q || 
            m.code.toLowerCase().includes(q) || 
            m.title.toLowerCase().includes(q) || 
            (m.title_ar && m.title_ar.includes(q)) ||
            (m.focus && m.focus.toLowerCase().includes(q)) ||
            (m.track && m.track.toLowerCase().includes(q));
        return matchesPillar && matchesTrack && matchesSearch;
    });

    return (
        <Layout>
            <Helmet>
                <title>{lang === 'ar' ? 'سجل البرامج والمناهج الأكاديمية' : 'Curriculum & Inventory Registry'} | GemIInI Academy</title>
                <meta
                    name="description"
                    content="Authoritative curriculum registry: Clinical Licensure, International Boards (USMLE, MRCS, Approbation), Pre-Clinical, Molecular Medicine, and MTC™ Compliance."
                />
            </Helmet>

            <PageHeader
                title={lang === 'ar' ? 'المصفوفة الأكاديمية والمناهج المعتمدة' : 'Academic Matrix & Curriculum Inventory'}
                subtitle={lang === 'ar' 
                    ? 'السجل المعياري الشامل للبرامج السريرية، مسارات الزمالات الدولية، والطب الجزيئي، وأدوات الحوكمة MTC™' 
                    : 'The authoritative matrix for clinical licensure, international board mastery, molecular genomics, and MTC™ pedagogical quality assurance.'}
            />

            <Section rail="max-w-[76rem]">
                {/* 3 OPERATIONAL TIERS TABS */}
                <div className="flex flex-col sm:flex-row gap-2 border-b border-border pb-4 mb-8">
                    {curriculumData.tiers.map((tier) => {
                        const isActive = tier.id === activeTier;
                        return (
                            <button
                                key={tier.id}
                                onClick={() => {
                                    setActiveTier(tier.id);
                                    setSelectedTrack('ALL');
                                }}
                                className={`px-5 py-3.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all text-left flex items-center justify-between gap-3 ${
                                    isActive
                                        ? 'bg-[hsl(var(--accent))] text-black shadow-lg scale-[1.01]'
                                        : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <span>{tier.label[lang] || tier.label.en}</span>
                                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${isActive ? 'bg-black/20 text-black font-bold' : 'bg-muted text-muted-foreground'}`}>
                                    {tier.modules.length}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* SEARCH & PILLAR FILTERS */}
                <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center mb-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder={lang === 'ar' ? 'ابحث بالكود (مثال: SMC-101، USMLE، MTC-000) أو الموضوع...' : 'Search by code (e.g. SMC-101, USMLE, MTC-000) or topic...'}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-card text-xs sm:text-sm outline-none focus:border-[hsl(var(--accent))]"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs">
                        <button
                            onClick={() => setSelectedPillar('ALL')}
                            className={`px-3 py-1.5 rounded-lg border transition-all ${
                                selectedPillar === 'ALL' ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))]/10 font-bold text-[hsl(var(--accent))]' : 'border-border bg-card'
                            }`}
                        >
                            {lang === 'ar' ? 'جميع الأركان' : 'All Pillars'}
                        </button>
                        <button
                            onClick={() => setSelectedPillar('gemiini')}
                            className={`px-3 py-1.5 rounded-lg border transition-all ${
                                selectedPillar === 'gemiini' ? 'border-[hsl(var(--teal))] bg-[hsl(var(--teal))]/10 font-bold text-[hsl(var(--teal))]' : 'border-border bg-card'
                            }`}
                        >
                            GemIInI (Clinical)
                        </button>
                        <button
                            onClick={() => setSelectedPillar('geneacademy')}
                            className={`px-3 py-1.5 rounded-lg border transition-all ${
                                selectedPillar === 'geneacademy' ? 'border-purple-500 bg-purple-500/10 font-bold text-purple-400' : 'border-border bg-card'
                            }`}
                        >
                            GeneAcademy (Genomics)
                        </button>
                        <button
                            onClick={() => setSelectedPillar('glomet')}
                            className={`px-3 py-1.5 rounded-lg border transition-all ${
                                selectedPillar === 'glomet' ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))]/10 font-bold text-[hsl(var(--accent))]' : 'border-border bg-card'
                            }`}
                        >
                            GLOMEt (B2B Supply)
                        </button>
                    </div>
                </div>

                {/* TRACK FILTERS */}
                {availableTracks.length > 0 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 text-xs text-muted-foreground scrollbar-none">
                        <span className="flex items-center gap-1 font-medium shrink-0">
                            <Filter className="h-3.5 w-3.5" />
                            {lang === 'ar' ? 'المسار:' : 'Track:'}
                        </span>
                        <button
                            onClick={() => setSelectedTrack('ALL')}
                            className={`px-3 py-1 rounded-full border text-[11px] shrink-0 transition-all ${
                                selectedTrack === 'ALL' ? 'bg-primary text-primary-foreground font-semibold border-primary' : 'border-border bg-card hover:text-foreground'
                            }`}
                        >
                            {lang === 'ar' ? 'الكل' : 'All Tracks'}
                        </button>
                        {availableTracks.map((trk) => (
                            <button
                                key={trk}
                                onClick={() => setSelectedTrack(trk)}
                                className={`px-3 py-1 rounded-full border text-[11px] shrink-0 transition-all ${
                                    selectedTrack === trk ? 'bg-primary text-primary-foreground font-semibold border-primary' : 'border-border bg-card hover:text-foreground'
                                }`}
                            >
                                {trk}
                            </button>
                        ))}
                    </div>
                )}

                {/* MODULES GRID */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredModules.map((item) => {
                        const style = PILLAR_COLORS[item.pillar] || PILLAR_COLORS.gemiini;
                        return (
                            <div
                                key={item.code}
                                className={`rounded-2xl border p-5 flex flex-col justify-between transition-all hover:scale-[1.01] ${style.border} ${style.bg}`}
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-card border border-border text-foreground">
                                            {item.code}
                                        </span>
                                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${style.badge}`}>
                                            {item.track || style.name}
                                        </span>
                                    </div>

                                    <h3 className="font-semibold text-sm leading-snug mb-1">
                                        {lang === 'ar' && item.title_ar ? item.title_ar : item.title}
                                    </h3>
                                    {lang === 'ar' && item.title_ar && (
                                        <p className="font-mono text-[11px] text-muted-foreground mb-2">{item.title}</p>
                                    )}

                                    <p className="text-xs text-muted-foreground leading-relaxed mt-2 line-clamp-3">
                                        {item.focus}
                                    </p>
                                </div>

                                <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-[11px]">
                                    <span className="text-muted-foreground font-mono">
                                        {item.credits || (item.level ? `Level ${item.level}` : 'Core')}
                                    </span>

                                    {item.syllabus ? (
                                        <button
                                            onClick={() => setActiveSyllabusModal(item)}
                                            className="font-semibold text-[hsl(var(--accent))] hover:underline flex items-center gap-1"
                                        >
                                            <FileText className="h-3.5 w-3.5" />
                                            <span>{lang === 'ar' ? 'عرض وثيقة المنهج ➔' : 'View Syllabus ➔'}</span>
                                        </button>
                                    ) : (
                                        <span className="text-muted-foreground font-medium">
                                            {item.hours ? item.hours : (item.level ? `Level ${item.level}` : 'Accredited')}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredModules.length === 0 && (
                    <div className="text-center py-16 rounded-2xl border border-dashed border-border bg-card p-8">
                        <p className="text-sm text-muted-foreground">
                            {lang === 'ar' ? 'لا توجد وحدات مطابقة لبحثك في هذا المستوى أو المسار.' : 'No modules matched your query in this tier or track.'}
                        </p>
                    </div>
                )}
            </Section>

            {/* MTC-000 SYLLABUS MODAL */}
            {activeSyllabusModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[hsl(var(--accent))]/40 bg-card p-6 sm:p-8 shadow-2xl space-y-6">
                        <button
                            onClick={() => setActiveSyllabusModal(null)}
                            className="absolute right-5 top-5 p-2 rounded-full bg-muted/60 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="flex items-center gap-3">
                            <span className="font-mono text-xs font-bold px-3 py-1 rounded-lg bg-[hsl(var(--accent))]/20 text-[hsl(var(--accent))] border border-[hsl(var(--accent))]/40">
                                {activeSyllabusModal.code}
                            </span>
                            <span className="text-xs font-semibold text-muted-foreground">
                                {activeSyllabusModal.credits} · {activeSyllabusModal.hours}
                            </span>
                        </div>

                        <div>
                            <h2 className="font-display text-xl sm:text-2xl font-bold">
                                {lang === 'ar' && activeSyllabusModal.title_ar ? activeSyllabusModal.title_ar : activeSyllabusModal.title}
                            </h2>
                            <p className="text-xs text-[hsl(var(--accent))] font-medium mt-1">
                                Instructor: {activeSyllabusModal.instructor}
                            </p>
                        </div>

                        {activeSyllabusModal.syllabus && (
                            <div className="space-y-6 text-xs sm:text-sm">
                                <div className="rounded-2xl border border-border bg-card/60 p-4">
                                    <h4 className="font-bold text-foreground mb-1">
                                        {lang === 'ar' ? 'الرؤية والهدف المؤسسي:' : 'Course Overview & Rationale:'}
                                    </h4>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {activeSyllabusModal.syllabus.rationale}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-bold text-foreground mb-2">
                                        {lang === 'ar' ? 'أهداف التعلم الأساسية:' : 'Core Learning Objectives:'}
                                    </h4>
                                    <ul className="space-y-2">
                                        {activeSyllabusModal.syllabus.objectives.map((obj, i) => (
                                            <li key={i} className="flex items-start gap-2.5 text-muted-foreground">
                                                <CheckCircle2 className="h-4 w-4 text-[hsl(var(--teal))] shrink-0 mt-0.5" />
                                                <span>{obj}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-bold text-foreground mb-3">
                                        {lang === 'ar' ? 'الوحدات والمحاور الدراسية:' : 'Module Units & Content Breakdown:'}
                                    </h4>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {activeSyllabusModal.syllabus.units.map((u, i) => (
                                            <div key={i} className="rounded-xl border border-border bg-muted/20 p-4">
                                                <p className="font-semibold text-foreground text-xs mb-2">{u.unit}</p>
                                                <ul className="space-y-1 text-[11px] text-muted-foreground list-disc list-inside">
                                                    {u.topics.map((t, idx) => (
                                                        <li key={idx}>{t}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-[hsl(var(--teal))]/30 bg-[hsl(var(--teal))]/5 p-4 space-y-2">
                                    <h4 className="font-bold text-foreground">
                                        {lang === 'ar' ? 'نظام التقييم والاعتماد:' : 'Assessment & Certification Structure:'}
                                    </h4>
                                    <p className="text-muted-foreground text-xs leading-relaxed">
                                        <strong>Formative:</strong> {activeSyllabusModal.syllabus.assessment.formative}
                                    </p>
                                    <p className="text-muted-foreground text-xs leading-relaxed">
                                        <strong>Summative:</strong> {activeSyllabusModal.syllabus.assessment.summative}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default CoursesPage;
