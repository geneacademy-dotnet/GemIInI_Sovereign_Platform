import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { CalendarDays, ExternalLink, FileText, FolderOpen, Sparkles, Trophy } from 'lucide-react';
import Layout from '@/components/site/Layout';
import { CourseCard, DemoBadge, ProgressBar, Section } from '@/components/site/Bits';
import { useLang } from '@/i18n/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { appointments, courses, invoices, leaderboard, sharedFiles } from '@/data/demo';
import { SOVEREIGN_ECOSYSTEM } from '@/data/sovereign-config';

const Panel = ({ icon: Icon, title, children, action }) => (
    <section className="rounded-2xl border border-border bg-card p-6">
        <header className="mb-4 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                <Icon className="h-4.5 w-4.5 text-[hsl(var(--teal))]" strokeWidth={1.8} />
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

    const name = user?.full_name || user?.email?.split('@')[0] || 'member';
    const gp = user?.gp_points ?? 780;
    const tier = user?.tier || 'bronze';
    const gaId = user?.ga_id || 'pending';
    const workspace = user?.workspace_url || '';
    const resume = courses.find((c) => c.progress > 0 && c.progress < 100) || courses[0];

    return (
        <Layout>
            <Helmet>
                <title>Member dashboard | Gene Academy</title>
                <meta name="description" content="Your Gene Academy member dashboard: course progress, GP balance, leaderboard, invoices, appointments, shared files and secure workspace." />
            </Helmet>

            <section className="ink-panel text-white">
                <div className="mx-auto flex max-w-[90rem] flex-wrap items-end justify-between gap-8 px-5 py-14 lg:px-10">
                    <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-[hsl(var(--accent))]">{t('dash.welcome')}</p>
                        <h1 className="mt-3 font-display text-4xl font-semibold">{name}</h1>
                        <p className="mt-2 text-sm text-white/60">GA-ID · {gaId}</p>
                    </div>
                    <div className="flex gap-8">
                        <div>
                            <p className="text-xs uppercase tracking-wider text-white/55">{t('dash.gp')}</p>
                            <p className="font-display text-3xl font-semibold text-[hsl(var(--accent))]">{gp.toLocaleString('en-US')}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wider text-white/55">{t('dash.tier')}</p>
                            <p className="font-display text-3xl font-semibold capitalize">{tier}</p>
                        </div>
                    </div>
                </div>
            </section>

            <Section rail="max-w-[90rem]" action={<DemoBadge />}>
                <div className="grid gap-6 lg:grid-cols-3">
                    <article className="rounded-2xl border border-[hsl(var(--accent))]/40 bg-[hsl(var(--accent))]/8 p-6 lg:col-span-2">
                        <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                            <Sparkles className="h-4 w-4 text-[hsl(var(--accent))]" strokeWidth={2} />
                            {t('dash.resume')}
                        </h2>
                        <p className="mt-3 font-display text-2xl">{lang === 'ar' ? resume.titleAr : resume.title}</p>
                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>{t('dash.progress')}</span>
                                <span>{resume.progress}%</span>
                            </div>
                            <ProgressBar value={resume.progress} />
                        </div>
                        <Link
                            to={`/courses/${resume.slug}`}
                            className="mt-6 inline-flex min-h-[44px] items-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-transform active:scale-[0.98]"
                        >
                            {t('cta.continue')}
                        </Link>
                    </article>

                    <Panel icon={FolderOpen} title={t('dash.workspace')}>
                        {workspace ? (
                            <a
                                href={workspace}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground"
                            >
                                {t('dash.openWorkspace')} <ExternalLink className="h-4 w-4" strokeWidth={1.8} />
                            </a>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                {lang === 'ar' ? 'يُربط رابط مساحة العمل الآمنة بعد توثيق العضوية.' : 'A secure workspace link is attached once your membership is verified.'}
                            </p>
                        )}
                    </Panel>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-3">
                    <Panel icon={Trophy} title={t('dash.leaderboard')}>
                        <ol className="divide-y divide-border">
                            {leaderboard.map((entry, index) => (
                                <li key={entry.id} className="flex items-center gap-3 py-2.5 text-sm">
                                    <span className="w-5 text-xs text-muted-foreground">{index + 1}</span>
                                    <span className="flex-1">{entry.name}</span>
                                    <span className="font-medium">{entry.points.toLocaleString('en-US')}</span>
                                </li>
                            ))}
                        </ol>
                    </Panel>

                    <Panel icon={CalendarDays} title={t('dash.appointments')}>
                        <ul className="space-y-3 text-sm">
                            {appointments.map((item) => (
                                <li key={item.id} className="rounded-xl border border-border p-3">
                                    <p className="font-medium">{item.title}</p>
                                    <p className="mt-1 text-xs text-muted-foreground">{item.when} · {item.with} · {item.mode}</p>
                                </li>
                            ))}
                        </ul>
                    </Panel>

                    <Panel icon={FileText} title={t('dash.invoices')}>
                        <ul className="space-y-3 text-sm">
                            {invoices.map((inv) => (
                                <li key={inv.id} className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
                                    <div>
                                        <p className="font-medium">{inv.item}</p>
                                        <p className="text-xs text-muted-foreground">{inv.id} · {inv.date}</p>
                                    </div>
                                    <span className={`rounded-full px-2.5 py-1 text-xs ${inv.status === 'paid' ? 'bg-[hsl(var(--teal))]/12 text-[hsl(var(--teal))]' : 'bg-[hsl(var(--accent))]/15 text-[hsl(38_68%_32%)]'}`}>
                                        {inv.amount} {inv.currency}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </Panel>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-3">
                    <Panel icon={FolderOpen} title={t('dash.files')}>
                        <ul className="space-y-2 text-sm">
                            {sharedFiles.map((file) => (
                                <li key={file.id} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
                                    <span>{file.name}</span>
                                    <span className="text-xs text-muted-foreground">{file.size}</span>
                                </li>
                            ))}
                        </ul>
                    </Panel>
                    <Panel icon={Sparkles} title={t('dash.memberships')}>
                        <p className="text-sm text-muted-foreground">
                            {lang === 'ar' ? 'عضوية سنوية نشطة — تتجدد في مارس ٢٠٢٦.' : 'Annual membership active — renews March 2026.'}
                        </p>
                        <div className="mt-4 space-y-2 rounded-xl border border-border bg-secondary/40 p-4 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">{lang === 'ar' ? 'نقاط الترحيب' : 'Welcome GP'}</span>
                                <span className="font-tech text-[hsl(var(--teal))]">{SOVEREIGN_ECOSYSTEM.stats.welcomeGP.toLocaleString('en-US')}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">{lang === 'ar' ? 'تحويل CPD' : 'CPD conversion'}</span>
                                <span className="font-tech text-[hsl(var(--teal))]">{SOVEREIGN_ECOSYSTEM.stats.cpd.gp.toLocaleString('en-US')} GP = {SOVEREIGN_ECOSYSTEM.stats.cpd.hours} {lang === 'ar' ? 'ساعات' : 'hrs'}</span>
                            </div>
                        </div>
                    </Panel>
                    <Panel icon={Trophy} title={t('dash.affiliates')}>
                        <p className="text-sm text-muted-foreground">
                            {lang === 'ar' ? '٣ إحالات مؤكدة · ١٥٠ نقطة مكتسبة.' : '3 confirmed referrals · 150 GP earned.'}
                        </p>
                    </Panel>
                </div>
            </Section>

            <Section title={t('dash.myCourses')} rail="max-w-[90rem]" action={<DemoBadge />}>
                <div className="grid gap-6 lg:grid-cols-3">
                    {courses.map((course) => (
                        <CourseCard key={course.id} course={course} member />
                    ))}
                </div>
            </Section>
        </Layout>
    );
};

export default DashboardPage;
