import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, Clock, Users } from 'lucide-react';
import Layout from '@/components/site/Layout';
import { DemoBadge, ProgressBar, Section, StateBlock } from '@/components/site/Bits';
import { useLang } from '@/i18n/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { courses, instructors } from '@/data/demo';

const CourseDetailPage = () => {
    const { slug } = useParams();
    const { t, lang } = useLang();
    const { isAuthed } = useAuth();
    const course = courses.find((c) => c.slug === slug);

    if (!course) {
        return (
            <Layout>
                <Helmet>
                    <title>Course not found | Gene Academy</title>
                    <meta name="description" content="The requested Gene Academy course could not be found." />
                </Helmet>
                <Section rail="max-w-[56rem]">
                    <StateBlock kind="error" message={lang === 'ar' ? 'لم يتم العثور على هذه الدورة.' : 'That course could not be found.'} />
                    <Link to="/courses" className="mt-6 inline-block text-sm underline-offset-4 hover:underline">
                        ← {t('courses.title')}
                    </Link>
                </Section>
            </Layout>
        );
    }

    const instructor = instructors.find((i) => i.id === course.instructorId);
    const title = lang === 'ar' ? course.titleAr : course.title;

    return (
        <Layout>
            <Helmet>
                <title>{`${course.title} | Gene Academy course`}</title>
                <meta name="description" content={course.summary} />
            </Helmet>

            <section className="ink-panel text-white">
                <div className="mx-auto grid max-w-[90rem] gap-10 px-5 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:px-10">
                    <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-[hsl(var(--accent))]">{course.branch} · {course.track}</p>
                        <h1 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl">{title}</h1>
                        <p className="mt-5 max-w-2xl text-white/70">{lang === 'ar' ? course.summaryAr : course.summary}</p>
                        <div className="mt-7 flex flex-wrap gap-6 text-sm text-white/70">
                            <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4" strokeWidth={1.8} />{course.hours} h · {course.lessons} {t('courses.lessons')}</span>
                            <span className="inline-flex items-center gap-2"><Users className="h-4 w-4" strokeWidth={1.8} />{course.enrolled.toLocaleString('en-US')} {t('courses.enrolled')}</span>
                        </div>
                        <div className="mt-8">
                            {isAuthed ? (
                                <Link to="/quiz/mtc-quiz-1" className="inline-flex min-h-[48px] items-center rounded-xl bg-[hsl(var(--accent))] px-6 font-medium text-[hsl(var(--accent-foreground))] transition-transform active:scale-[0.98]">
                                    {t('cta.continue')}
                                </Link>
                            ) : (
                                <Link to="/register" className="inline-flex min-h-[48px] items-center rounded-xl bg-[hsl(var(--accent))] px-6 font-medium text-[hsl(var(--accent-foreground))] transition-transform active:scale-[0.98]">
                                    {t('course.enrollNow')}
                                </Link>
                            )}
                        </div>
                    </div>
                    <img src={course.cover} alt={title} className="h-64 w-full rounded-2xl border border-white/15 object-cover lg:h-full" />
                </div>
            </section>

            <Section rail="max-w-[72rem]" action={<DemoBadge />}>
                <div className="grid gap-10 lg:grid-cols-[1.4fr_0.6fr]">
                    <div>
                        <h2 className="font-display text-2xl font-semibold">{t('course.outline')}</h2>
                        <ol className="mt-5 divide-y divide-border border-y border-border">
                            {course.outline.map((item, index) => (
                                <li key={item} className="flex items-center gap-4 py-4 text-sm">
                                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary text-xs font-medium">{index + 1}</span>
                                    {item}
                                    {isAuthed && index === 0 && <CheckCircle2 className="ms-auto h-4 w-4 text-[hsl(var(--teal))]" strokeWidth={2} />}
                                </li>
                            ))}
                        </ol>
                        {isAuthed && (
                            <div className="mt-8 space-y-2">
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>{t('dash.progress')}</span>
                                    <span>{course.progress}%</span>
                                </div>
                                <ProgressBar value={course.progress} />
                            </div>
                        )}
                    </div>

                    <aside className="rounded-2xl border border-border bg-card p-6">
                        <h3 className="text-xs uppercase tracking-wider text-muted-foreground">{t('course.instructor')}</h3>
                        {instructor && (
                            <div className="mt-4">
                                <img src={instructor.photo} alt={instructor.name} className="h-24 w-24 rounded-xl object-cover" />
                                <p className="mt-4 font-display text-lg font-semibold">{lang === 'ar' ? instructor.nameAr : instructor.name}</p>
                                <p className="mt-2 text-sm text-muted-foreground">{lang === 'ar' ? instructor.titleAr : instructor.title}</p>
                            </div>
                        )}
                    </aside>
                </div>
            </Section>
        </Layout>
    );
};

export default CourseDetailPage;
