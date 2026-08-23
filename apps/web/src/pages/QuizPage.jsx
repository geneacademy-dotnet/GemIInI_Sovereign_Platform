import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { CheckCircle2, ChevronRight, XCircle, Activity, Dna, Stethoscope, Sparkles, ShieldCheck } from 'lucide-react';
import Layout from '@/components/site/Layout';
import { DemoBadge, ProgressBar, Section } from '@/components/site/Bits';
import { useLang } from '@/i18n/LanguageContext';
import { instructors, quiz } from '@/data/demo';
import { MTCClinicalRegistry } from '@/lib/mtc-registry';

const QuizPage = () => {
    const { t, lang } = useLang();
    const [index, setIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [selected, setSelected] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [finished, setFinished] = useState(false);

    const question = quiz.questions[index];
    const instructor = instructors.find((i) => i.id === quiz.instructorId);
    const score = useMemo(
        () => quiz.questions.reduce((acc, q) => acc + (answers[q.id] === q.answer ? 1 : 0), 0),
        [answers],
    );

    const submitAnswer = () => {
        if (selected === null) return;
        setAnswers((prev) => ({ ...prev, [question.id]: selected }));
        setSubmitted(true);
    };

    const goTo = (nextIndex) => {
        setIndex(nextIndex);
        setSelected(answers[quiz.questions[nextIndex].id] ?? null);
        setSubmitted(answers[quiz.questions[nextIndex].id] !== undefined);
    };

    const next = () => {
        if (index === quiz.questions.length - 1) {
            setFinished(true);
            return;
        }
        goTo(index + 1);
    };

    const retake = () => {
        setAnswers({});
        setSelected(null);
        setSubmitted(false);
        setFinished(false);
        setIndex(0);
    };

    // Retrieve rich MTC case data if mapped
    const currentMtcCase = MTCClinicalRegistry.cases[`MTC-V-00${(index % 2) + 1}`];

    return (
        <Layout>
            <Helmet>
                <title>MTC™ Clinical Exam Simulator & Case Auditor | GemIInI Academy</title>
                <meta name="description" content="محاكي امتحانات المجلس الطبي MTC™ — تحليل السيناريوهات السريرية وفق النموذج الثلاثي: الأساس الجزيئي، التتالي الفسيولوجي، والقرار السريري الحاسم." />
            </Helmet>

            <Section rail="max-w-[72rem]">
                <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <Link to="/dashboard" className="hover:text-foreground">{t('nav.dashboard')}</Link>
                    <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
                    <Link to="/courses/mtc-core" className="hover:text-foreground">GemIInIxSMC Licensure</Link>
                    <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
                    <span className="text-foreground font-semibold">{quiz.lesson}</span>
                </nav>

                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-0.5 text-xs font-mono text-teal-600 font-bold uppercase tracking-wider mb-2">
                            <ShieldCheck className="w-3.5 h-3.5" /> MTC™ Mechanism-to-Clinic Standard
                        </span>
                        <h1 className="font-display text-3xl font-bold sm:text-4xl text-slate-900">{t('quiz.title')}</h1>
                    </div>
                </div>

                {finished ? (
                    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_20rem]">
                        <div className="rounded-2xl border border-border bg-card p-7">
                            <p className="text-xs uppercase tracking-wider text-muted-foreground">{t('quiz.score')}</p>
                            <p className="mt-2 font-display text-5xl font-extrabold text-[hsl(var(--teal))]">
                                {score}/{quiz.questions.length}
                            </p>
                            <div className="mt-6"><ProgressBar value={(score / quiz.questions.length) * 100} /></div>

                            <h2 className="mt-8 font-display text-xl font-bold">{t('quiz.audit')} — Mechanism-to-Clinic (MTC™) Analysis</h2>
                            <ul className="mt-4 divide-y divide-border border-y border-border">
                                {quiz.questions.map((q, i) => {
                                    const ok = answers[q.id] === q.answer;
                                    return (
                                        <li key={q.id} className="py-5">
                                            <div className="flex items-start gap-3 text-sm">
                                                {ok ? (
                                                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(var(--teal))]" strokeWidth={2} />
                                                ) : (
                                                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" strokeWidth={2} />
                                                )}
                                                <div className="space-y-1">
                                                    <p className="font-bold text-slate-900">{i + 1}. {q.stem}</p>
                                                    <p className="text-muted-foreground text-xs">
                                                        <strong className={ok ? 'text-teal-600 font-bold' : 'text-red-600 font-bold'}>
                                                            {ok ? t('quiz.correct') : t('quiz.incorrect')}
                                                        </strong> — {q.options[q.answer]}
                                                    </p>
                                                    <p className="mt-2 text-xs bg-slate-50 border border-slate-100 rounded-lg p-3 text-slate-700">
                                                        <strong>MTC™ Clinical Synthesis:</strong> {q.explanation}
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>

                            <div className="mt-7 flex flex-wrap gap-3">
                                <button type="button" onClick={retake} className="min-h-[44px] rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98]">
                                    {t('quiz.retake')}
                                </button>
                                <Link to="/dashboard" className="min-h-[44px] rounded-xl border border-border px-5 text-sm font-bold leading-[44px] hover:bg-slate-50">
                                    العودة للوحة التحكم واعتماد +50 GP 🚀
                                </Link>
                            </div>
                        </div>

                        <aside className="rounded-2xl border border-border bg-card p-6 text-sm">
                            <h2 className="text-xs uppercase tracking-wider text-muted-foreground font-mono">{t('quiz.framework')}</h2>
                            <p className="mt-3 text-muted-foreground leading-relaxed">{quiz.framework}</p>
                            {instructor && (
                                <div className="mt-5 flex items-center gap-3 border-t border-border pt-5">
                                    <img src={instructor.photo} alt={instructor.name} className="h-12 w-12 rounded-lg object-cover" />
                                    <div>
                                        <p className="font-bold text-slate-900">{lang === 'ar' ? instructor.nameAr : instructor.name}</p>
                                        <p className="text-xs text-muted-foreground">{lang === 'ar' ? instructor.titleAr : instructor.title}</p>
                                    </div>
                                </div>
                            )}
                        </aside>
                    </div>
                ) : (
                    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_20rem]">
                        <div className="rounded-2xl border border-border bg-card p-7 shadow-sm">
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span className="font-mono text-xs font-bold">{t('quiz.question')} {index + 1} {t('quiz.of')} {quiz.questions.length}</span>
                                <span className="font-mono text-xs font-bold">{Object.keys(answers).length} / {quiz.questions.length} Answered</span>
                            </div>
                            <div className="mt-3"><ProgressBar value={((index + 1) / quiz.questions.length) * 100} /></div>

                            {/* Clinical Vignette */}
                            <div className="mt-7 rounded-2xl bg-slate-900 text-white p-5 text-sm leading-relaxed border border-slate-800 shadow-md">
                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400 block mb-2">
                                    CLINICAL VIGNETTE // SMC SIMULATION
                                </span>
                                {question.vignette}
                            </div>

                            <h2 className="mt-6 font-display text-lg sm:text-xl font-bold text-slate-900">{question.stem}</h2>

                            <ul className="mt-5 space-y-3">
                                {question.options.map((option, i) => {
                                    const isSelected = selected === i;
                                    const isAnswer = i === question.answer;
                                    let tone = 'border-border hover:border-[hsl(var(--accent))]';
                                    if (submitted && isAnswer) tone = 'border-[hsl(var(--teal))] bg-[hsl(var(--teal))]/10 text-teal-900 font-bold';
                                    else if (submitted && isSelected) tone = 'border-destructive bg-destructive/10 text-destructive font-bold';
                                    else if (isSelected) tone = 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))]/10 font-medium';
                                    return (
                                        <li key={option}>
                                            <button
                                                type="button"
                                                disabled={submitted}
                                                onClick={() => setSelected(i)}
                                                className={`flex min-h-[52px] w-full items-center gap-3 rounded-xl border px-5 text-start text-sm transition-all cursor-pointer ${tone}`}
                                            >
                                                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-secondary text-xs font-mono font-bold">
                                                    {String.fromCharCode(65 + i)}
                                                </span>
                                                <span className="flex-1">{option}</span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>

                            {/* MTC Mechanism-to-Clinic 3-Tier Explanatory Breakdown */}
                            {submitted && (
                                <div className="mt-6 rounded-2xl border border-teal-500/30 bg-teal-50/40 p-5 space-y-4 text-xs" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                                    <div className="flex items-center justify-between border-b border-teal-500/20 pb-2">
                                        <span className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                                            <Sparkles className="w-4 h-4 text-teal-600" />
                                            {lang === 'ar' ? 'التفكيك السريري وفق معيار MTC™' : 'MTC™ 3-Tier Clinical Deconstruction'}
                                        </span>
                                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                                            answers[question.id] === question.answer ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {answers[question.id] === question.answer ? t('quiz.correct') : t('quiz.incorrect')}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div className="p-3 rounded-xl bg-white border border-teal-100 shadow-sm">
                                            <span className="text-[10px] font-mono uppercase text-purple-700 font-bold block mb-1">
                                                1. Molecular / Cell Basis
                                            </span>
                                            <p className="text-slate-600 leading-normal text-[11px]">
                                                {currentMtcCase ? currentMtcCase.step1_molecular : question.explanation}
                                            </p>
                                        </div>

                                        <div className="p-3 rounded-xl bg-white border border-teal-100 shadow-sm">
                                            <span className="text-[10px] font-mono uppercase text-teal-700 font-bold block mb-1">
                                                2. Organ Cascade
                                            </span>
                                            <p className="text-slate-600 leading-normal text-[11px]">
                                                {currentMtcCase ? currentMtcCase.step2_pathophysiological : 'Pathophysiological hemodynamic shift.'}
                                            </p>
                                        </div>

                                        <div className="p-3 rounded-xl bg-white border border-teal-100 shadow-sm">
                                            <span className="text-[10px] font-mono uppercase text-emerald-700 font-bold block mb-1">
                                                3. Bedside Decision
                                            </span>
                                            <p className="text-slate-600 leading-normal text-[11px]">
                                                {currentMtcCase ? currentMtcCase.step3_clinical : question.options[question.answer]}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="mt-7 flex flex-wrap gap-3">
                                {!submitted ? (
                                    <button
                                        type="button"
                                        onClick={submitAnswer}
                                        disabled={selected === null}
                                        className="min-h-[44px] rounded-xl bg-primary px-7 text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                                    >
                                        {t('quiz.submit')}
                                    </button>
                                ) : (
                                    <button type="button" onClick={next} className="min-h-[44px] rounded-xl bg-primary px-7 text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98] cursor-pointer">
                                        {index === quiz.questions.length - 1 ? t('quiz.finish') : t('quiz.next')}
                                    </button>
                                )}
                                {Object.keys(answers).length > 0 && (
                                    <button type="button" onClick={() => setFinished(true)} className="min-h-[44px] rounded-xl border border-border px-5 text-sm font-bold hover:bg-slate-50 cursor-pointer">
                                        {t('quiz.viewResult')}
                                    </button>
                                )}
                            </div>
                        </div>

                        <aside className="space-y-6">
                            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                                <h2 className="text-xs uppercase tracking-wider text-muted-foreground font-mono font-bold">{t('quiz.question')}</h2>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {quiz.questions.map((q, i) => {
                                        const answered = answers[q.id] !== undefined;
                                        return (
                                            <button
                                                key={q.id}
                                                type="button"
                                                onClick={() => goTo(i)}
                                                className={`h-10 w-10 rounded-xl border text-sm font-mono font-bold transition-all cursor-pointer ${
                                                    i === index
                                                        ? 'border-transparent bg-primary text-primary-foreground shadow-md'
                                                        : answered
                                                          ? 'border-teal-500 bg-teal-50 text-teal-700'
                                                          : 'border-border hover:border-slate-400'
                                                }`}
                                            >
                                                {i + 1}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="rounded-2xl border border-border bg-card p-6 text-sm shadow-sm">
                                <h2 className="text-xs uppercase tracking-wider text-muted-foreground font-mono font-bold">{t('quiz.framework')}</h2>
                                <p className="mt-3 text-muted-foreground leading-relaxed">{quiz.framework}</p>
                                {instructor && (
                                    <div className="mt-5 flex items-center gap-3 border-t border-border pt-5">
                                        <img src={instructor.photo} alt={instructor.name} className="h-12 w-12 rounded-xl object-cover" />
                                        <div>
                                            <p className="font-bold text-slate-900">{lang === 'ar' ? instructor.nameAr : instructor.name}</p>
                                            <p className="text-xs text-muted-foreground">{lang === 'ar' ? instructor.titleAr : instructor.title}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </aside>
                    </div>
                )}
            </Section>
        </Layout>
    );
};

export default QuizPage;
