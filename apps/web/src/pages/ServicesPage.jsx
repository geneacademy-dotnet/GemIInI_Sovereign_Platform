import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowRight, Banknote, Building2, GraduationCap, Microscope, Stethoscope, Truck } from 'lucide-react';
import Layout from '@/components/site/Layout';
import { PageHeader, Section } from '@/components/site/Bits';
import Reveal from '@/components/Reveal';
import PaymentChannels from '@/components/PaymentChannels';
import { useLang } from '@/i18n/LanguageContext';
import { SOVEREIGN_ECOSYSTEM } from '@/data/sovereign-config';

const PILLAR_ICON = { gemiini: Stethoscope, gene: Microscope, glomet: Truck };
const PILLAR_ORDER = ['gemiini', 'gene', 'glomet'];

const ServicesPage = () => {
    const { t, lang } = useLang();
    const { pricing, narrative } = SOVEREIGN_ECOSYSTEM;
    const L = (obj) => (obj && (obj[lang] || obj.en)) || '';

    return (
        <Layout>
            <Helmet>
                <title>Services | Gene Academy — three sovereign pillars</title>
                <meta
                    name="description"
                    content="Gene Academy services across three pillars: GemIInI Academy licensure, GeneAcademy life-sciences mentorship, and GLOMEt HQ turnkey molecular labs and biotech grants."
                />
            </Helmet>
            <PageHeader
                title={t('services.title')}
                subtitle={L({
                    en: 'Three pillars, one consortium. Licensure, life-sciences mentorship and turnkey molecular infrastructure — plus the CSR engine that funds student grants.',
                    ar: 'ثلاثة أعمدة، كونسورتيوم واحد. ترخيص وإرشاد في علوم الحياة وبنية تحتية جزيئية جاهزة — ومحرك المسؤولية الذي يموّل منح الطلاب.',
                })}
            />

            {/* Pillar programs */}
            <Section rail="max-w-[90rem]">
                <div className="space-y-16">
                    {PILLAR_ORDER.map((key, idx) => {
                        const p = SOVEREIGN_ECOSYSTEM.pillars[key];
                        const Icon = PILLAR_ICON[key];
                        const reversed = idx % 2 === 1;
                        return (
                            <div key={key} className="grid gap-8 lg:grid-cols-[0.9fr_1.4fr] lg:items-start">
                                <Reveal>
                                    <div className={`rounded-2xl border border-border bg-card p-7 ${reversed ? 'lg:order-2' : ''}`}>
                                        <span className="grid h-12 w-12 place-items-center rounded-xl bg-[hsl(var(--teal))]/12 text-[hsl(var(--teal))]">
                                            <Icon className="h-6 w-6" strokeWidth={1.7} />
                                        </span>
                                        <h2 className="mt-5 font-display text-2xl font-semibold">{L(p.name)}</h2>
                                        <p className="mt-2 font-tech text-[11px] uppercase tracking-wider text-[hsl(var(--accent))]">
                                            {L(p.audience)}
                                        </p>
                                        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{L(p.tagline)}</p>
                                        <Link
                                            to={p.to}
                                            className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-transform active:scale-[0.98]"
                                        >
                                            {t('cta.learnMore')} <ArrowRight className="h-4 w-4 rtl:rotate-180" strokeWidth={2} />
                                        </Link>
                                    </div>
                                </Reveal>
                                <Reveal delay={0.08}>
                                    <ul className="divide-y divide-border border-y border-border">
                                        {p.programs.map((prog) => (
                                            <li key={prog.name.en} className="grid gap-2 py-5 md:grid-cols-[1fr_1.6fr] md:items-center">
                                                <h3 className="font-display text-base font-semibold">{L(prog.name)}</h3>
                                                <p className="text-sm leading-relaxed text-muted-foreground">{L(prog.desc)}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </Reveal>
                            </div>
                        );
                    })}
                </div>
            </Section>

            {/* Pricing */}
            <section className="border-y border-border bg-secondary/40">
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
                                    <h3 className="font-display text-xl font-semibold">{tier.name}</h3>
                                    <div className="mt-4 space-y-1 font-tech text-sm">
                                        <p className="text-lg text-[hsl(var(--teal))]">{tier.sdg.toLocaleString('en-US')} SDG</p>
                                        <p className="text-muted-foreground">
                                            {tier.sar} SAR · ${tier.usd} USD
                                        </p>
                                        <p className="text-xs text-muted-foreground/70">{L(tier.period)}</p>
                                    </div>
                                    <ul className="mt-5 flex-1 space-y-2 text-sm text-muted-foreground">
                                        {tier.perks[lang]?.map((perk) => (
                                            <li key={perk} className="flex gap-2">
                                                <span className="mt-px text-[hsl(var(--teal))]">›</span>
                                                <span>{perk}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </article>
                            </Reveal>
                        ))}
                    </div>
                    <div className="mt-8 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-5 text-sm">
                        <span className="font-tech text-xs uppercase tracking-wider text-muted-foreground">Payment</span>
                        {pricing.paymentMethods.map((m) => (
                            <span
                                key={m.name}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/60 px-3 py-1.5 font-medium"
                            >
                                <Banknote className="h-3.5 w-3.5 text-[hsl(var(--teal))]" strokeWidth={1.8} />
                                {m.name} · <span className="font-tech text-xs text-muted-foreground">{m.number}</span>
                            </span>
                        ))}
                    </div>
                </Section>
            </section>

            {/* Payment channels */}
            <Section rail="max-w-[90rem]">
                <PaymentChannels />
            </Section>

            {/* Audiences strip */}
            <Section rail="max-w-[90rem]" className="!py-16">
                <div className="grid gap-6 sm:grid-cols-3">
                    {[
                        { icon: GraduationCap, en: 'Students & learners', ar: 'الطلاب والمتعلمون', body: { en: 'Structured curricula, exam simulators and peer pods.', ar: 'مناهج منظمة ومحاكيات وقنوات أقران.' } },
                        { icon: Building2, en: 'Professionals', ar: 'المهنيون', body: { en: 'CPD-aligned modules, coaching and consultancy.', ar: 'وحدات تطوير مهني وإرشاد واستشارات.' } },
                        { icon: Truck, en: 'Institutions', ar: 'المؤسسات', body: { en: 'Cohort licensing, turnkey labs and procurement.', ar: 'ترخيص جماعي ومختبرات جاهزة ومشتريات.' } },
                    ].map((a) => {
                        const Icon = a.icon;
                        return (
                            <div key={a.en} className="rounded-2xl border border-border bg-card p-6">
                                <Icon className="h-6 w-6 text-[hsl(var(--teal))]" strokeWidth={1.7} />
                                <h3 className="mt-4 font-display text-lg font-semibold">{lang === 'ar' ? a.ar : a.en}</h3>
                                <p className="mt-2 text-sm text-muted-foreground">{L(a.body)}</p>
                            </div>
                        );
                    })}
                </div>
            </Section>
        </Layout>
    );
};

export default ServicesPage;
