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
            <PageHeader title={t('resources.title')} subtitle={lang === 'ar' ? 'مقالات وأدلة وقوائم تدقيق مجانية.' : 'Free articles, guides and clinical checklists.'} />
            <Section rail="max-w-[56rem]" action={<DemoBadge />}>
                {resources.length === 0 ? (
                    <StateBlock />
                ) : (
                    <div className="divide-y divide-border border-y border-border">
                        {resources.map((res) => (
                            <article key={res.id} className="py-7">
                                <p className="text-xs uppercase tracking-[0.2em] text-[hsl(var(--teal))]">{res.type} · {res.minutes} min read</p>
                                <h2 className="mt-2 font-display text-2xl font-semibold leading-snug">{lang === 'ar' ? res.titleAr : res.title}</h2>
                                <p className="mt-3 text-sm text-muted-foreground">
                                    {lang === 'ar'
                                        ? 'محتوى تجريبي مختصر يوضح كيف ستظهر المقالات الحقيقية عند ربط مصدر البيانات.'
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
