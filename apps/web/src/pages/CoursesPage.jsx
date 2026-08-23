import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Search } from 'lucide-react';
import Layout from '@/components/site/Layout';
import { CourseCard, DemoBadge, PageHeader, Section, StateBlock } from '@/components/site/Bits';
import { useLang } from '@/i18n/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { courses } from '@/data/demo';

const tracks = ['all', 'Clinical exams', 'Genomics', 'Laboratory', 'Operations'];

const CoursesPage = () => {
    const { t, lang } = useLang();
    const { isAuthed } = useAuth();
    const [query, setQuery] = useState('');
    const [track, setTrack] = useState('all');

    const filtered = useMemo(
        () =>
            courses.filter((course) => {
                const matchTrack = track === 'all' || course.track === track;
                const haystack = `${course.title} ${course.titleAr} ${course.branch}`.toLowerCase();
                return matchTrack && haystack.includes(query.trim().toLowerCase());
            }),
        [query, track],
    );

    return (
        <Layout>
            <Helmet>
                <title>Course catalogue | Gene Academy</title>
                <meta name="description" content="Browse Gene Academy courses: MTC clinical exam simulation, genomic literacy, molecular diagnostics quality and medical procurement operations." />
            </Helmet>
            <PageHeader title={t('courses.title')} subtitle={t('courses.sub')} />
            <Section rail="max-w-[90rem]" action={<DemoBadge />}>
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <label className="relative flex w-full max-w-sm items-center">
                        <Search className="absolute start-3 h-4 w-4 text-muted-foreground" strokeWidth={1.8} />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={t('courses.search')}
                            className="min-h-[44px] w-full rounded-xl border border-input bg-card ps-10 pe-4 text-sm outline-none focus:border-[hsl(var(--accent))]"
                        />
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {tracks.map((item) => (
                            <button
                                key={item}
                                type="button"
                                onClick={() => setTrack(item)}
                                className={`min-h-[40px] rounded-full border px-4 text-sm transition-colors ${
                                    track === item ? 'border-transparent bg-primary text-primary-foreground' : 'border-border hover:bg-secondary'
                                }`}
                            >
                                {item === 'all' ? t('courses.all') : item}
                            </button>
                        ))}
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <StateBlock />
                ) : (
                    <div className="grid gap-6 lg:grid-cols-3">
                        {filtered.map((course) => (
                            <CourseCard key={course.id} course={course} member={isAuthed} />
                        ))}
                    </div>
                )}
                <p className="mt-6 text-xs text-muted-foreground">{lang === 'ar' ? 'المستويات المتقدمة تُفتح بعد إكمال المستوى السابق.' : 'Advanced levels unlock once the previous level is completed.'}</p>
            </Section>
        </Layout>
    );
};

export default CoursesPage;
