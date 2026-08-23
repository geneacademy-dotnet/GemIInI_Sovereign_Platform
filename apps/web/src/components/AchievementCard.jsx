import React from 'react';
import { Link } from 'react-router-dom';
import { Award, HeartPulse, Microscope, ScrollText, Stethoscope, ShieldCheck, ArrowRight } from 'lucide-react';
import CountUp from '@/components/CountUp';
import Reveal from '@/components/Reveal';
import { useLang } from '@/i18n/LanguageContext';

const ICONS = {
    bls: HeartPulse,
    mrcs: Stethoscope,
    usmle: Award,
    gemiiniSmc: ShieldCheck,
    moduleIV: Stethoscope,
    germanFsp: Award,
    papers100: ScrollText,
    phd: Microscope,
};

const AchievementCard = ({ achievement, delay = 0 }) => {
    const { lang } = useLang();
    const L = (obj) => (obj && (obj[lang] || obj.en)) || '';
    const Icon = ICONS[achievement.key] || Award;

    return (
        <Reveal delay={delay} className="h-full">
            <article className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-transform duration-300 hover:-translate-y-1">
                <div className="flex items-start justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-[hsl(var(--teal))]/12 text-[hsl(var(--teal))]">
                        <Icon className="h-6 w-6" strokeWidth={1.7} />
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--accent))]/40 bg-[hsl(var(--accent))]/10 px-2.5 py-1 font-tech text-[10px] uppercase tracking-wider text-[hsl(var(--accent))]">
                        <ShieldCheck className="h-3 w-3" strokeWidth={2} />
                        SHA-256
                    </span>
                </div>

                <p className="mt-5 font-display text-4xl font-bold text-[hsl(var(--teal))]">
                    <CountUp value={achievement.count} suffix={achievement.suffix || ''} />
                    {achievement.passRate ? (
                        <span className="ms-2 font-tech text-sm text-muted-foreground">
                            · {achievement.passRate}% {lang === 'ar' ? 'نجاح' : 'pass'}
                        </span>
                    ) : null}
                </p>

                <h3 className="mt-3 font-display text-lg font-semibold leading-snug">{L(achievement.label)}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{L(achievement.desc)}</p>

                <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                    <span className="font-tech text-[11px] uppercase tracking-wider text-muted-foreground">
                        {L(achievement.dateRange)}
                    </span>
                    <Link
                        to={achievement.verify || '/certifications'}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline-offset-4 hover:underline"
                    >
                        {lang === 'ar' ? 'عرض المُعتمَدين' : 'View certified'}
                        <ArrowRight className="h-4 w-4 rtl:rotate-180" strokeWidth={2} />
                    </Link>
                </div>
            </article>
        </Reveal>
    );
};

export default AchievementCard;
export { AchievementCard };
