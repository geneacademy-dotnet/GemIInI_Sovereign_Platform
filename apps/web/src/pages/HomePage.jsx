import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    Fingerprint,
    FlaskConical,
    KeyRound,
    Microscope,
    ShieldCheck,
    Stethoscope,
    Truck,
} from 'lucide-react';
import Layout from '@/components/site/Layout';
import { Section } from '@/components/site/Bits';
import Reveal from '@/components/Reveal';
import CountUp from '@/components/CountUp';
import AchievementCard from '@/components/AchievementCard';
import PaymentChannels from '@/components/PaymentChannels';
import MotionPictureReel from '@/components/MotionPictureReel';
import { useLang } from '@/i18n/LanguageContext';
import { SOVEREIGN_ECOSYSTEM } from '@/data/sovereign-config';

const PILLAR_ICON = { gemiini: Stethoscope, gene: Microscope, glomet: Truck };
const PILLAR_ORDER = ['gemiini', 'gene', 'glomet'];
const ACH_ORDER = ['bls', 'mrcs', 'usmle', 'gemiiniSmc', 'moduleIV', 'germanFsp', 'papers100', 'phd'];

const initialsOf = (nameObj, lang) => {
    const name = (nameObj && (nameObj[lang] || nameObj.en)) || '';
    const parts = name.replace(/^(Dr\.?|د\.?)\s*/i, '').split(' ').filter(Boolean);
    return (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
};

const HomePage = () => {
    const { t, lang } = useLang();
    const { institution, stats, pricing, narrative, faculty, achievements } = SOVEREIGN_ECOSYSTEM;
    const L = (obj) => (obj && (obj[lang] || obj.en)) || '';

    const ledger = [
        { value: stats.members, label: { en: 'Verified Members', ar: 'أعضاء موثقون' }, suffix: '+' },
        { value: stats.vignettes, label: { en: 'Clinical Scenarios', ar: 'سيناريوهات سريرية' }, suffix: '+' },
        { value: stats.b2bPartners, label: { en: 'Lab & Hospital Partners', ar: 'شركاء المختبرات والمستشفيات' } },
        { value: stats.universities, label: { en: 'Universities Reached', ar: 'جامعات' } },
        { value: stats.activePods, label: { en: 'Active Pods', ar: 'قنوات نشطة' } },
    ];

    const fourPillars = [
        { key: 'displacement', icon: ShieldCheck },
        { key: 'lifeSciences', icon: Microscope },
        { key: 'csr', icon: Truck },
        { key: 'prometric', icon: Fingerprint },
    ];

    return (
        <Layout>
            <Helmet>
                <title>Gene Academy | The Sovereign Sanctuary for Medical & Life Sciences</title>
                <meta
                    name="description"
                    content="Gene Academy — the SudaGene Consortium sanctuary for bilingual medical education, MTC exam simulation, molecular diagnostics and sovereign verified membership."
                />
            </Helmet>

            {/* ── HERO ─────────────────────────────────────────────────────── */}
            <section className="ink-panel sovereign-grid relative overflow-hidden text-white">
                <div className="mx-auto grid min-h-[100dvh] max-w-[90rem] items-center gap-12 px-5 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
                    <div>
                        <Reveal>
                            <p className="font-tech text-xs uppercase tracking-[0.3em] text-[hsl(var(--accent))]">
                                {L(narrative.hero.eyebrow)}
                            </p>
                        </Reveal>
                        <Reveal delay={0.08}>
                            <h1 className="mt-6 font-display text-[clamp(2.4rem,5.6vw,4.4rem)] font-bold leading-[1.04]">
                                {L(narrative.hero.title)}
                            </h1>
                        </Reveal>
                        <Reveal delay={0.16}>
                            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">{L(narrative.hero.sub)}</p>
                        </Reveal>
                        <Reveal delay={0.24}>
                            <div className="mt-9 flex flex-wrap gap-3">
                                <Link
                                    to="/courses"
                                    className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-6 font-semibold text-[hsl(var(--primary-foreground))] transition-transform active:scale-[0.98]"
                                >
                                    {t('cta.explore')} <ArrowRight className="h-4 w-4 rtl:rotate-180" strokeWidth={2} />
                                </Link>
                                <Link
                                    to="/register"
                                    className="inline-flex min-h-[48px] items-center rounded-xl bg-[hsl(var(--accent))] px-6 font-semibold text-[hsl(var(--accent-foreground))] transition-transform active:scale-[0.98]"
                                >
                                    {t('cta.join')}
                                </Link>
                                <Link
                                    to="/verify"
                                    className="inline-flex min-h-[48px] items-center rounded-xl border border-white/25 px-6 font-medium text-white transition-colors hover:bg-white/10"
                                >
                                    {t('cta.verify')}
                                </Link>
                            </div>
                        </Reveal>
                    </div>

                    <Reveal delay={0.2} y={32}>
                        <div className="relative rounded-[1.75rem] border border-white/12 bg-gradient-to-br from-white/[0.07] to-transparent p-8 backdrop-blur">
                            <div className="flex items-center justify-between">
                                <span className="font-tech text-xs uppercase tracking-[0.2em] text-[hsl(var(--accent))]">
                                    Sovereign Credential
                                </span>
                                <ShieldCheck className="h-5 w-5 text-[hsl(var(--teal))]" strokeWidth={1.8} />
                            </div>
                            <p className="mt-6 font-display text-4xl font-bold">GA-1042</p>
                            <p className="mt-1 text-sm text-white/60">Verified Member · Scholar Tier</p>
                            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 text-sm">
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-white/45">GP Balance</p>
                                    <p className="font-tech text-lg text-[hsl(var(--teal))]">1,240</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-white/45">CPD Hours</p>
                                    <p className="font-tech text-lg text-[hsl(var(--teal))]">12.4</p>
                                </div>
                            </div>
                            <div className="mt-6 rounded-lg border border-white/10 bg-black/30 p-3">
                                <p className="font-tech text-[11px] break-all text-white/40">
                                    SHA-256 · 9f2a7c41e8…b3d0 · Prometric-verified
                                </p>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ── SUCCESS LEDGER ───────────────────────────────────────────── */}
            <Section rail="max-w-[90rem]" className="!py-16 lg:!py-20">
                <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <span className="font-tech text-xs uppercase tracking-[0.28em] text-[hsl(var(--accent))]">
                            {L(narrative.ledger.title)}
                        </span>
                        <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">{L(narrative.ledger.sub)}</h2>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3 lg:grid-cols-5">
                    {ledger.map((s) => (
                        <div key={s.label.en} className="bg-card p-6 text-center">
                            <p className="font-display text-4xl font-bold text-[hsl(var(--teal))]">
                                <CountUp value={s.value} suffix={s.suffix || ''} />
                            </p>
                            <p className="mt-2 font-tech text-[11px] uppercase tracking-wider text-muted-foreground">
                                {L(s.label)}
                            </p>
                        </div>
                    ))}
                </div>
            </Section>

            {/* ── THE THREE DOORS ──────────────────────────────────────────── */}
            <Section title={L(narrative.doors.title)} subtitle={L(narrative.doors.sub)} rail="max-w-[90rem]">
                <div className="grid gap-6 md:grid-cols-3">
                    {PILLAR_ORDER.map((key, i) => {
                        const p = SOVEREIGN_ECOSYSTEM.pillars[key];
                        const Icon = PILLAR_ICON[key];
                        return (
                            <Reveal key={key} delay={i * 0.08}>
                                <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-7 transition-transform duration-300 hover:-translate-y-1">
                                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-[hsl(var(--teal))]/12 text-[hsl(var(--teal))]">
                                        <Icon className="h-6 w-6" strokeWidth={1.7} />
                                    </span>
                                    <h3 className="mt-5 font-display text-2xl font-semibold">{L(p.name)}</h3>
                                    <p className="mt-1 font-tech text-[11px] uppercase tracking-wider text-[hsl(var(--accent))]">
                                        {L(p.audience)}
                                    </p>
                                    <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">{L(p.tagline)}</p>
                                    <ul className="mt-5 space-y-2 text-sm">
                                        {p.programs.slice(0, 4).map((prog) => (
                                            <li key={prog.name.en} className="flex gap-2">
                                                <span className="mt-px text-[hsl(var(--teal))]">›</span>
                                                <span>{L(prog.name)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Link
                                        to={p.to}
                                        className="mt-6 inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-foreground underline-offset-4 hover:underline"
                                    >
                                        {t('cta.learnMore')} <ArrowRight className="h-4 w-4 rtl:rotate-180" strokeWidth={2} />
                                    </Link>
                                </article>
                            </Reveal>
                        );
                    })}
                </div>
            </Section>

            {/* ── ACHIEVEMENTS & CERTIFICATIONS ───────────────────────────── */}
            <section className="border-y border-border bg-secondary/30">
                <Section
                    title={L({ en: 'Achievements & Certifications', ar: 'الإنجازات والشهادات' })}
                    subtitle={L({
                        en: 'Proof of impact, cryptographically sealed. Every count below is tied to a verified GA-ID.',
                        ar: 'دليل الأثر، مختوم تشفيرياً. كل رقم أدناه مرتبط برقم عضوية موثّق.',
                    })}
                    rail="max-w-[90rem]"
                    action={
                        <Link
                            to="/certifications"
                            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium transition-colors hover:bg-secondary"
                        >
                            {L({ en: 'Verify a certificate', ar: 'تحقق من شهادة' })}
                            <ArrowRight className="h-4 w-4 rtl:rotate-180" strokeWidth={2} />
                        </Link>
                    }
                >
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {ACH_ORDER.map((key, i) => (
                            <AchievementCard key={key} achievement={achievements[key]} delay={i * 0.05} />
                        ))}
                    </div>
                </Section>
            </section>

            {/* ── THE GLOMET PROMISE ───────────────────────────────────────── */}
            <section className="border-y border-border bg-secondary/40">
                <Section rail="max-w-[90rem]" className="!py-20">
                    <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
                        <Reveal>
                            <span className="font-tech text-xs uppercase tracking-[0.28em] text-[hsl(var(--accent))]">
                                {L(narrative.glometPromise.eyebrow)}
                            </span>
                            <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
                                {L(narrative.glometPromise.title)}
                            </h2>
                        </Reveal>
                        <Reveal delay={0.1}>
                            <p className="text-lg leading-relaxed text-muted-foreground">{L(narrative.glometPromise.body)}</p>
                            <div className="mt-6 flex flex-wrap gap-2.5">
                                {SOVEREIGN_ECOSYSTEM.pillars.glomet.programs.map((prog) => (
                                    <span
                                        key={prog.name.en}
                                        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground"
                                    >
                                        <Truck className="h-3.5 w-3.5 text-[hsl(var(--teal))]" strokeWidth={1.8} />
                                        {L(prog.name)}
                                    </span>
                                ))}
                            </div>
                        </Reveal>
                    </div>
                </Section>
            </section>

            {/* ── THE LIVING CV ────────────────────────────────────────────── */}
            <Section rail="max-w-[90rem]">
                <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                    <Reveal>
                        <span className="font-tech text-xs uppercase tracking-[0.28em] text-[hsl(var(--accent))]">
                            {L(narrative.livingCV.eyebrow)}
                        </span>
                        <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">{L(narrative.livingCV.title)}</h2>
                        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{L(narrative.livingCV.body)}</p>
                        <div className="mt-7 grid gap-3 sm:grid-cols-3">
                            {narrative.livingCV.badges.map((b, i) => {
                                const Icon = [ShieldCheck, KeyRound, Fingerprint][i];
                                return (
                                    <div
                                        key={b.en}
                                        className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium"
                                    >
                                        <Icon className="h-4 w-4 text-[hsl(var(--teal))]" strokeWidth={1.8} />
                                        {L(b)}
                                    </div>
                                );
                            })}
                        </div>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <div className="rounded-2xl border border-border bg-card p-6">
                            <div className="flex items-center justify-between border-b border-border pb-4">
                                <span className="font-tech text-[11px] uppercase tracking-wider text-muted-foreground">
                                    Certificate of Competence
                                </span>
                                <ShieldCheck className="h-5 w-5 text-[hsl(var(--teal))]" strokeWidth={1.8} />
                            </div>
                            <p className="mt-5 font-display text-2xl font-semibold">MTC Vignette #2,514</p>
                            <p className="mt-1 text-sm text-muted-foreground">Surgery & Trauma · Score 94%</p>
                            <dl className="mt-5 space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <dt className="text-muted-foreground">Holder</dt>
                                    <dd className="font-medium">GA-1042</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-muted-foreground">Framework</dt>
                                    <dd className="font-medium">SMC · MRCS</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-muted-foreground">Sealed</dt>
                                    <dd className="font-tech text-xs text-[hsl(var(--teal))]">SHA-256 ✓</dd>
                                </div>
                            </dl>
                        </div>
                    </Reveal>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                        to="/certifications"
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-transform active:scale-[0.98]"
                    >
                        <ShieldCheck className="h-4 w-4" strokeWidth={1.8} />
                        {L({ en: 'Verify a certificate', ar: 'تحقق من شهادة' })}
                    </Link>
                    <Link
                        to="/certifications"
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-border bg-card px-5 text-sm font-medium transition-colors hover:bg-secondary"
                    >
                        {L({ en: 'View achievements', ar: 'عرض الإنجازات' })}
                        <ArrowRight className="h-4 w-4 rtl:rotate-180" strokeWidth={2} />
                    </Link>
                </div>
            </Section>

            {/* ── FOUR PILLARS NARRATIVE BAND ──────────────────────────────── */}
            <section className="border-y border-border bg-secondary/30">
                <Section rail="max-w-[90rem]" className="!py-16">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {fourPillars.map((p, i) => {
                            const Icon = p.icon;
                            const data = narrative.pillars[p.key];
                            return (
                                <Reveal key={p.key} delay={i * 0.06}>
                                    <div className="border-t-2 border-[hsl(var(--accent))] pt-5">
                                        <Icon className="h-6 w-6 text-[hsl(var(--teal))]" strokeWidth={1.7} />
                                        <h3 className="mt-4 font-display text-lg font-semibold">{L(data.title)}</h3>
                                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{L(data.body)}</p>
                                    </div>
                                </Reveal>
                            );
                        })}
                    </div>
                </Section>
            </section>

            {/* ── PAYMENT CHANNELS ─────────────────────────────────────────── */}
            <Section rail="max-w-[90rem]">
                <MotionPictureReel />
      <PaymentChannels />
            </Section>

            {/* ── FACULTY LEADERSHIP ───────────────────────────────────────── */}
            <Section title={L(narrative.faculty.title)} subtitle={L(narrative.faculty.sub)} rail="max-w-[90rem]">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {faculty.map((f, i) => (
                        <Reveal key={f.id} delay={i * 0.06}>
                            <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
                                <div className="flex items-center gap-4">
                                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-[hsl(var(--teal))]/12 font-display text-lg font-semibold text-[hsl(var(--teal))]">
                                        {initialsOf(f.name, lang)}
                                    </span>
                                    <div>
                                        <h3 className="font-display text-lg font-semibold leading-tight">{L(f.name)}</h3>
                                        <p className="font-tech text-[11px] uppercase tracking-wider text-[hsl(var(--accent))]">
                                            {L(f.role)}
                                        </p>
                                    </div>
                                </div>
                                <p className="mt-4 font-tech text-xs text-muted-foreground">{f.degree}</p>
                                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{L(f.bio)}</p>
                                <p className="mt-4 font-tech text-[11px] text-muted-foreground/70">{f.id}</p>
                            </article>
                        </Reveal>
                    ))}
                </div>
            </Section>

            {/* ── SOVEREIGN PRICING ────────────────────────────────────────── */}
            <Section title={L(narrative.pricing.title)} subtitle={L(narrative.pricing.sub)} rail="max-w-[90rem]">
                <div className="grid gap-6 md:grid-cols-3">
                    {pricing.tiers.map((tier, i) => (
                        <Reveal key={tier.name} delay={i * 0.08}>
                            <article
                                className={`flex h-full flex-col rounded-2xl border p-7 ${
                                    tier.featured
                                        ? 'border-[hsl(var(--accent))]/50 bg-[hsl(var(--accent))]/5'
                                        : 'border-border bg-card'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="font-display text-xl font-semibold">{tier.name}</h3>
                                    {tier.featured && (
                                        <span className="rounded-full bg-[hsl(var(--accent))] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[hsl(var(--accent-foreground))]">
                                            Popular
                                        </span>
                                    )}
                                </div>
                                <div className="mt-4 space-y-1 font-tech text-sm">
                                    <p className="text-lg text-[hsl(var(--teal))]">{tier.sdg.toLocaleString('en-US')} SDG</p>
                                    <p className="text-muted-foreground">
                                        {tier.sar} SAR · ${tier.usd} USD
                                    </p>
                                    <p className="text-xs text-muted-foreground/70">{L(tier.period)}</p>
                                </div>
                                <ul className="mt-5 flex-1 space-y-2 text-sm text-muted-foreground">
                                    {tier.perks[lang]?.map((p) => (
                                        <li key={p} className="flex gap-2">
                                            <span className="mt-px text-[hsl(var(--teal))]">›</span>
                                            <span>{p}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    to="/register"
                                    className={`mt-6 flex min-h-[44px] items-center justify-center rounded-lg px-4 text-sm font-medium transition-transform active:scale-[0.98] ${
                                        tier.featured
                                            ? 'bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]'
                                            : 'bg-primary text-primary-foreground'
                                    }`}
                                >
                                    {t('cta.join')}
                                </Link>
                            </article>
                        </Reveal>
                    ))}
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-secondary/40 p-5 text-sm">
                    <span className="font-tech text-xs uppercase tracking-wider text-muted-foreground">Payment</span>
                    {pricing.paymentMethods.map((m) => (
                        <span
                            key={m.name}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 font-medium"
                        >
                            <FlaskConical className="h-3.5 w-3.5 text-[hsl(var(--teal))]" strokeWidth={1.8} />
                            {m.name} · <span className="font-tech text-xs text-muted-foreground">{m.number}</span>
                        </span>
                    ))}
                </div>
            </Section>

            {/* ── THE AIRLOCK ──────────────────────────────────────────────── */}
            <section className="ink-panel relative overflow-hidden text-white">
                <div className="mx-auto max-w-[90rem] px-5 py-24 text-center lg:px-10">
                    <Reveal>
                        <span className="font-tech text-xs uppercase tracking-[0.3em] text-[hsl(var(--accent))]">
                            {L(narrative.airlock.eyebrow)}
                        </span>
                        <h2 className="mx-auto mt-5 max-w-3xl font-display text-[clamp(2rem,4.5vw,3.4rem)] font-bold leading-tight">
                            {L(narrative.airlock.title)}
                        </h2>
                        <p className="mx-auto mt-5 max-w-2xl text-lg text-white/70">{L(narrative.airlock.body)}</p>
                        <div className="mt-9 flex flex-wrap justify-center gap-3">
                            <Link
                                to="/register"
                                className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-6 font-semibold text-[hsl(var(--primary-foreground))] transition-transform active:scale-[0.98]"
                            >
                                {t('cta.join')} <ArrowRight className="h-4 w-4 rtl:rotate-180" strokeWidth={2} />
                            </Link>
                            <Link
                                to="/login"
                                className="inline-flex min-h-[48px] items-center rounded-xl bg-[hsl(var(--accent))] px-6 font-semibold text-[hsl(var(--accent-foreground))] transition-transform active:scale-[0.98]"
                            >
                                {t('cta.signin')}
                            </Link>
                            <Link
                                to="/verify"
                                className="inline-flex min-h-[48px] items-center rounded-xl border border-white/25 px-6 font-medium text-white transition-colors hover:bg-white/10"
                            >
                                {t('cta.verify')}
                            </Link>
                        </div>
                        <p className="mt-8 font-tech text-xs uppercase tracking-wider text-white/40">
                            {institution.brand} / {institution.ecosystem} — {t('brand.powered')}
                        </p>
                    </Reveal>
                </div>
            </section>
        </Layout>
    );
};

export default HomePage;
