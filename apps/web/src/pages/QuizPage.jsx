import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { CheckCircle2, ChevronRight, XCircle } from 'lucide-react';
import Layout from '@/components/site/Layout';
import { DemoBadge, ProgressBar, Section } from '@/components/site/Bits';
import { useLang } from '@/i18n/LanguageContext';
import { instructors, quiz } from '@/data/demo';

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

    return (
        <Layout>
            <Helmet>
                <title>MTC clinical exam simulator | Gene Academy</title>
                <meta name="description" content="Practise MTC single-best-answer clinical vignettes with instant scoring, answer auditing and framework-aligned explanations." />
            </Helmet>

            <Section rail="max-w-[72rem]" action={<DemoBadge />}>
                <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <Link to="/dashboard" className="hover:text-foreground">{t('nav.dashboard')}</Link>
                    <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
                    <Link to="/courses/mtc-core" className="hover:text-foreground">MTC Core</Link>
                    <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
                    <span className="text-foreground">{quiz.lesson}</span>
                </nav>

                <h1 className="font-display text-3xl font-semibold sm:text-4xl">{t('quiz.title')}</h1>

                {finished ? (
                    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_20rem]">
                        <div className="rounded-2xl border border-border bg-card p-7">
                            <p className="text-xs uppercase tracking-wider text-muted-foreground">{t('quiz.score')}</p>
                            <p className="mt-2 font-display text-5xl font-semibold text-[hsl(var(--teal))]">
                                {score}/{quiz.questions.length}
                            </p>
                            <div className="mt-6"><ProgressBar value={(score / quiz.questions.length) * 100} /></div>

                            <h2 className="mt-8 font-display text-xl font-semibold">{t('quiz.audit')}</h2>
                            <ul className="mt-4 divide-y divide-border border-y border-border">
                                {quiz.questions.map((q, i) => {
                                    const ok = answers[q.id] === q.answer;
                                    return (
                                        <li key={q.id} className="py-4">
                                            <div className="flex items-start gap-3 text-sm">
                                                {ok ? (
                                                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--teal))]" strokeWidth={2} />
                                                ) : (
                                                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" strokeWidth={2} />
                                                )}
                                                <div>
                                                    <p className="font-medium">{i + 1}. {q.stem}</p>
                                                    <p className="mt-1 text-muted-foreground">
                                                        {ok ? t('quiz.correct') : t('quiz.incorrect')} — {q.options[q.answer]}
                                                    </p>
                                                    <p className="mt-1 text-xs text-muted-foreground">{q.explanation}</p>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>

                            <div className="mt-7 flex flex-wrap gap-3">
                                <button type="button" onClick={retake} className="min-h-[44px] rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-transform active:scale-[0.98]">
                                    {t('quiz.retake')}
                                </button>
                                <Link to="/courses/mtc-core" className="min-h-[44px] rounded-lg border border-border px-5 text-sm font-medium leading-[44px]">
                                    {t('quiz.nextLesson')}
                                </Link>
                            </div>
                        </div>

                        <aside className="rounded-2xl border border-border bg-card p-6 text-sm">
                            <h2 className="text-xs uppercase tracking-wider text-muted-foreground">{t('quiz.framework')}</h2>
                            <p className="mt-3 text-muted-foreground">{quiz.framework}</p>
                            {instructor && (
                                <div className="mt-5 flex items-center gap-3 border-t border-border pt-5">
                                    <img src={instructor.photo} alt={instructor.name} className="h-12 w-12 rounded-lg object-cover" />
                                    <div>
                                        <p className="font-medium">{lang === 'ar' ? instructor.nameAr : instructor.name}</p>
                                        <p className="text-xs text-muted-foreground">{lang === 'ar' ? instructor.titleAr : instructor.title}</p>
                                    </div>
                                </div>
                            )}
                        </aside>
                    </div>
                ) : (
                    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_20rem]">
                        <div className="rounded-2xl border border-border bg-card p-7">
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>{t('quiz.question')} {index + 1} {t('quiz.of')} {quiz.questions.length}</span>
                                <span>{Object.keys(answers).length} / {quiz.questions.length}</span>
                            </div>
                            <div className="mt-3"><ProgressBar value={((index + 1) / quiz.questions.length) * 100} /></div>

                            <p className="mt-7 rounded-xl bg-secondary/70 p-5 text-sm leading-relaxed">{question.vignette}</p>
                            <h2 className="mt-6 font-display text-xl font-semibold">{question.stem}</h2>

                            <ul className="mt-5 space-y-3">
                                {question.options.map((option, i) => {
                                    const isSelected = selected === i;
                                    const isAnswer = i === question.answer;
                                    let tone = 'border-border hover:border-[hsl(var(--accent))]';
                                    if (submitted && isAnswer) tone = 'border-[hsl(var(--teal))] bg-[hsl(var(--teal))]/8';
                                    else if (submitted && isSelected) tone = 'border-destructive bg-destructive/5';
                                    else if (isSelected) tone = 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))]/10';
                                    return (
                                        <li key={option}>
                                            <button
                                                type="button"
                                                disabled={submitted}
                                                onClick={() => setSelected(i)}
                                                className={`flex min-h-[52px] w-full items-center gap-3 rounded-full border px-5 text-start text-sm transition-colors ${tone}`}
                                            >
                                                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-secondary text-xs font-medium">
                                                    {String.fromCharCode(65 + i)}
                                                </span>
                                                {option}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>

                            {submitted && (
                                <p className="mt-5 rounded-xl border border-border p-4 text-sm text-muted-foreground">
                                    <strong className="text-foreground">
                                        {answers[question.id] === question.answer ? t('quiz.correct') : t('quiz.incorrect')}.
                                    </strong>{' '}
                                    {question.explanation}
                                </p>
                            )}

                            <div className="mt-7 flex flex-wrap gap-3">
                                {!submitted ? (
                                    <button
                                        type="button"
                                        onClick={submitAnswer}
                                        disabled={selected === null}
                                        className="min-h-[44px] rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-50"
                                    >
                                        {t('quiz.submit')}
                                    </button>
                                ) : (
                                    <button type="button" onClick={next} className="min-h-[44px] rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-transform active:scale-[0.98]">
                                        {index === quiz.questions.length - 1 ? t('quiz.finish') : t('quiz.next')}
                                    </button>
                                )}
                                {Object.keys(answers).length > 0 && (
                                    <button type="button" onClick={() => setFinished(true)} className="min-h-[44px] rounded-lg border border-border px-5 text-sm font-medium">
                                        {t('quiz.viewResult')}
                                    </button>
                                )}
                            </div>
                        </div>

                        <aside className="space-y-6">
                            <div className="rounded-2xl border border-border bg-card p-6">
                                <h2 className="text-xs uppercase tracking-wider text-muted-foreground">{t('quiz.question')}</h2>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {quiz.questions.map((q, i) => {
                                        const answered = answers[q.id] !== undefined;
                                        return (
                                            <button
                                                key={q.id}
                                                type="button"
                                                onClick={() => goTo(i)}
                                                className={`h-10 w-10 rounded-lg border text-sm transition-colors ${
                                                    i === index
                                                        ? 'border-transparent bg-primary text-primary-foreground'
                                                        : answered
                                                          ? 'border-[hsl(var(--teal))] text-[hsl(var(--teal))]'
                                                          : 'border-border'
                                                }`}
                                            >
                                                {i + 1}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="rounded-2xl border border-border bg-card p-6 text-sm">
                                <h2 className="text-xs uppercase tracking-wider text-muted-foreground">{t('quiz.framework')}</h2>
                                <p className="mt-3 text-muted-foreground">{quiz.framework}</p>
                                {instructor && (
                                    <div className="mt-5 flex items-center gap-3 border-t border-border pt-5">
                                        <img src={instructor.photo} alt={instructor.name} className="h-12 w-12 rounded-lg object-cover" />
                                        <div>
                                            <p className="font-medium">{lang === 'ar' ? instructor.nameAr : instructor.name}</p>
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
