import React from 'react';
import { Helmet } from 'react-helmet';
import { Fingerprint, Microscope, ShieldCheck, Truck } from 'lucide-react';
import Layout from '@/components/site/Layout';
import { PageHeader, Section } from '@/components/site/Bits';
import Reveal from '@/components/Reveal';
import { useLang } from '@/i18n/LanguageContext';
import { SOVEREIGN_ECOSYSTEM } from '@/data/sovereign-config';

const initialsOf = (nameObj, lang) => {
    const name = (nameObj && (nameObj[lang] || nameObj.en)) || '';
    const parts = name.replace(/^(Dr\.?|د\.?)\s*/i, '').split(' ').filter(Boolean);
    return (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
};

const AboutPage = () => {
    const { t, lang } = useLang();
    const { institution, faculty, narrative, stats } = SOVEREIGN_ECOSYSTEM;
    const L = (obj) => (obj && (obj[lang] || obj.en)) || '';

    const fourPillars = [
        { key: 'displacement', icon: ShieldCheck },
        { key: 'lifeSciences', icon: Microscope },
        { key: 'csr', icon: Truck },
        { key: 'prometric', icon: Fingerprint },
    ];

    return (
        <Layout>
            <Helmet>
                <title>About Gene Academy | SudaGene Consortium</title>
                <meta
                    name="description"
                    content="Gene Academy is the medical-education arm of the SudaGene Consortium — bilingual clinical training, genomic literacy, verified membership and the GLOMEt CSR engine."
                />
            </Helmet>
            <PageHeader
                title={t('about.title')}
                subtitle={L({
                    en: 'The SudaGene Consortium is a sovereign sanctuary for medical and life-sciences education — built for displaced Sudanese clinicians and scientists, verified by Prometric, sealed by SHA-256.',
                    ar: 'كونسورتيوم سوداجين ملاذ سيادي لتعليم العلوم الطبية والحيوية — بُني للأطباء والعلماء السودانيين النازحين، موثق بالبرومتريك، مختوم بـ SHA-256.',
                })}
            />

            {/* Mission / four pillars */}
            <Section rail="max-w-[90rem]">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {fourPillars.map((p, i) => {
                        const Icon = p.icon;
                        const data = narrative.pillars[p.key];
                        return (
                            <Reveal key={p.key} delay={i * 0.06}>
                                <div className="h-full border-t-2 border-[hsl(var(--accent))] pt-5">
                                    <Icon className="h-6 w-6 text-[hsl(var(--teal))]" strokeWidth={1.7} />
                                    <h2 className="mt-4 font-display text-lg font-semibold">{L(data.title)}</h2>
                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{L(data.body)}</p>
                                </div>
                            </Reveal>
                        );
                    })}
                </div>
            </Section>

            {/* Faculty leadership */}
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

            {/* Consortium stats */}
            <section className="border-y border-border bg-secondary/40">
                <Section rail="max-w-[90rem]" className="!py-16">
                    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
                        {[
                            { v: stats.members, l: { en: 'Verified Members', ar: 'أعضاء موثقون' } },
                            { v: stats.universities, l: { en: 'Universities', ar: 'جامعات' } },
                            { v: stats.vignettes, l: { en: 'Vignettes', ar: 'سيناريوهات' } },
                            { v: stats.b2bPartners, l: { en: 'B2B Partners', ar: 'شركاء' } },
                        ].map((s) => (
                            <div key={s.l.en} className="bg-card p-6 text-center">
                                <p className="font-display text-3xl font-bold text-[hsl(var(--teal))]">
                                    {s.v.toLocaleString('en-US')}+
                                </p>
                                <p className="mt-2 font-tech text-[11px] uppercase tracking-wider text-muted-foreground">
                                    {L(s.l)}
                                </p>
                            </div>
                        ))}
                    </div>
                </Section>
            </section>

            {/* Institution footer block */}
            <Section rail="max-w-[72rem]" className="!py-16">
                <div className="rounded-2xl border border-border bg-card p-8">
                    <h2 className="font-display text-2xl font-semibold">{institution.name}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {L({
                            en: 'A consortium spanning three pillars and three domains, powered by geneacademy.net. Established to keep Sudanese medical and life-sciences education sovereign, portable and verifiable — wherever its learners are forced to go.',
                            ar: 'كونسورتيوم يمتد عبر ثلاثة أعمدة وثلاثة نطاقات، مدعوم بـ geneacademy.net. أُسس ليبقى التعليم الطبي وعلوم الحياة السوداني سيادياً محمولاً موثقاً — أينما اضطر متعلموه للذهاب.',
                        })}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                        {institution.domains.map((d) => (
                            <span key={d} className="font-tech text-xs rounded-lg border border-border bg-secondary/60 px-3 py-1.5 text-muted-foreground">
                                {d}
                            </span>
                        ))}
                    </div>
                </div>
            </Section>
        </Layout>
    );
};

export default AboutPage;
