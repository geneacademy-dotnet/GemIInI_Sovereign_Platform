import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, FlaskConical, Lock, Users } from 'lucide-react';
import { useLang } from '@/i18n/LanguageContext';
import { cn } from '@/lib/utils';

export const DemoBadge = () => {
    const { t } = useLang();
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--accent))]/40 bg-[hsl(var(--accent))]/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-[hsl(38_68%_32%)]">
            <FlaskConical className="h-3 w-3" strokeWidth={2} />
            {t('common.demo')}
        </span>
    );
};

export const PageHeader = ({ title, subtitle, children }) => (
    <section className="ink-panel text-white">
        <div className="mx-auto max-w-[72rem] px-5 py-16 lg:px-10 lg:py-20">
            <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">{title}</h1>
            {subtitle && <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70">{subtitle}</p>}
            {children}
        </div>
    </section>
);

export const Section = ({ title, subtitle, children, className, rail = 'max-w-[72rem]', action }) => (
    <section className={cn('mx-auto px-5 py-16 lg:px-10 lg:py-20', rail, className)}>
        {(title || action) && (
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
                <div>
                    {title && <h2 className="font-display text-3xl font-semibold sm:text-4xl">{title}</h2>}
                    {subtitle && <p className="mt-2 max-w-xl text-muted-foreground">{subtitle}</p>}
                </div>
                {action}
            </div>
        )}
        {children}
    </section>
);

export const StateBlock = ({ kind = 'empty', message }) => {
    const { t } = useLang();
    if (kind === 'loading') {
        return (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
                {[0, 1, 2].map((i) => (
                    <div key={i} className="h-52 animate-pulse rounded-2xl border border-border bg-secondary/60" />
                ))}
            </div>
        );
    }
    return (
        <div
            className={cn(
                'flex items-center gap-3 rounded-2xl border border-dashed px-5 py-8 text-sm',
                kind === 'error' ? 'border-destructive/40 bg-destructive/5 text-destructive' : 'border-border text-muted-foreground',
            )}
            role={kind === 'error' ? 'alert' : undefined}
        >
            <AlertCircle className="h-5 w-5 shrink-0" strokeWidth={1.8} />
            {message || (kind === 'error' ? t('common.error') : t('courses.empty'))}
        </div>
    );
};

export const ProgressBar = ({ value }) => (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div className="h-full rounded-full bg-[hsl(var(--teal))] transition-[width] duration-500" style={{ width: `${value}%` }} />
    </div>
);

export const CourseCard = ({ course, member = false }) => {
    const { t, lang } = useLang();
    const title = lang === 'ar' ? course.titleAr : course.title;
    const summary = lang === 'ar' ? course.summaryAr : course.summary;
    const locked = course.locked;

    return (
        <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_18px_40px_-32px_hsl(215_45%_20%/0.7)] transition-transform duration-300 hover:-translate-y-1">
            <div className="relative aspect-[16/9] overflow-hidden">
                <img
                    src={course.cover}
                    alt={title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <span className="absolute start-3 top-3 rounded-full bg-primary/90 px-2.5 py-1 text-[11px] font-medium text-primary-foreground">
                    {course.branch}
                </span>
            </div>
            <div className="flex flex-1 flex-col gap-3 p-5">
                <h3 className="font-display text-lg font-semibold leading-snug">{title}</h3>
                <p className="line-clamp-2 text-sm text-muted-foreground">{summary}</p>
                <div className="mt-auto space-y-3 pt-2">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{course.lessons} {t('courses.lessons')}</span>
                        <span className="inline-flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" strokeWidth={1.8} />
                            {course.enrolled.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')} {t('courses.enrolled')}
                        </span>
                    </div>

                    {member && !locked && (
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>{t('dash.progress')}</span>
                                <span>{course.progress}%</span>
                            </div>
                            <ProgressBar value={course.progress} />
                        </div>
                    )}

                    {locked ? (
                        <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2.5 text-xs text-muted-foreground">
                            <Lock className="h-4 w-4" strokeWidth={1.8} />
                            {t('courses.locked')}
                        </div>
                    ) : (
                        <Link
                            to={`/courses/${course.slug}`}
                            className="flex min-h-[44px] items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-transform active:scale-[0.98]"
                        >
                            {member ? t('cta.continue') : t('courses.enroll')}
                        </Link>
                    )}
                </div>
            </div>
        </article>
    );
};
