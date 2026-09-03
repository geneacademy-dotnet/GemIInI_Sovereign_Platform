import React from 'react';
import { Helmet } from 'react-helmet';
import Layout from '@/components/site/Layout';
import { DemoBadge, PageHeader, Section, StateBlock } from '@/components/site/Bits';
import { useLang } from '@/i18n/LanguageContext';
import { resources } from '@/data/demo';

const ResourcesPage = () => {
    const { t, lang } = useLang();

    return (
        <Layout>
            <Helmet>
                <title>Educational resources | Gene Academy blog and guides</title>
                <meta name="description" content="Free Gene Academy guides, checklists and articles on clinical exams, ACMG variant interpretation and molecular laboratory quality." />
            </Helmet>
            <PageHeader title={t('resources.title')} subtitle={lang === 'ar' ? 'Ù…Ù‚Ø§Ù„Ø§Øª ÙˆØ£Ø¯Ù„Ø© ÙˆÙ‚ÙˆØ§Ø¦Ù… ØªØ¯Ù‚ÙŠÙ‚ Ù…Ø¬Ø§Ù†ÙŠØ©.' : 'Free articles, guides and clinical checklists.'} />
            <Section rail="max-w-[56rem]" action={<DemoBadge />}>
                {resources.length === 0 ? (
                    <StateBlock />
                ) : (
                    <div className="divide-y divide-border border-y border-border">
                        {resources.map((res) => (
                            <article key={res.id} className="py-7">
                                <p className="text-xs uppercase tracking-[0.2em] text-[hsl(var(--teal))]">{res.type} Â· {res.minutes} min read</p>
                                <h2 className="mt-2 font-display text-2xl font-semibold leading-snug">{lang === 'ar' ? res.titleAr : res.title}</h2>
                                <p className="mt-3 text-sm text-muted-foreground">
                                    {lang === 'ar'
                                        ? 'Ù…Ø­ØªÙˆÙ‰ ØªØ¬Ø±ÙŠØ¨ÙŠ Ù…Ø®ØªØµØ± ÙŠÙˆØ¶Ø­ ÙƒÙŠÙ Ø³ØªØ¸Ù‡Ø± Ø§Ù„Ù…Ù‚Ø§Ù„Ø§Øª Ø§Ù„Ø­Ù‚ÙŠÙ‚ÙŠØ© Ø¹Ù†Ø¯ Ø±Ø¨Ø· Ù…ØµØ¯Ø± Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª.'
                                        : 'Short demo content showing how published articles will render once the real content source is connected.'}
                                </p>
                            </article>
                        ))}
                    </div>
                )}
            </Section>
        </Layout>
    );
};

export default ResourcesPage;
