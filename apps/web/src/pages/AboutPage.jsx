import React from 'react';
import { Helmet } from 'react-helmet';
import { ShieldCheck, Award, Stethoscope, Dna, Building2, CheckCircle2, Star, Users } from 'lucide-react';
import Layout from '@/components/site/Layout';
import { Section } from '@/components/site/Bits';
import { useLang } from '@/i18n/LanguageContext';
import { SOVEREIGN_ECOSYSTEM } from '@/data/sovereign-config';

const AboutPage = () => {
    const { t, lang } = useLang();
    const { faculty, metrics, reviews } = SOVEREIGN_ECOSYSTEM;

    return (
        <Layout>
            <Helmet>
                <title>About SudaGene Consortium | القيادة المؤسسية والركائز السيادية</title>
                <meta name="description" content="تعرف على القيادة الأكاديمية والسريرية لمنظومة سوداجين: د. محمد جبريل، د. علاء مرسي النور، ود. صفاء الحسن." />
            </Helmet>

            {/* HERO SECTION */}
            <section className="bg-[#04080F] text-white py-16 border-b border-white/10">
                <div className="mx-auto max-w-5xl px-5 text-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 px-3.5 py-1 text-xs font-mono font-bold text-cyan-400 mb-4">
                        <ShieldCheck className="w-4 h-4" />
                        INSTITUTIONAL GOVERNANCE & SOVEREIGN MANDATE
                    </span>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                        {lang === 'ar' ? 'القيادة الأكاديمية والسريرية للمنظومة' : 'Academic & Clinical Executive Directorate'}
                    </h1>
                    <p className="mt-4 text-sm md:text-base text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        {lang === 'ar'
                            ? 'منظومة سيادية قائمة على توثيق الكفاءة السريرية والبحثية، وضبط الجودة الأكاديمية بالمعايير العالمية للزمالات البريطانية والمجلس الطبي.'
                            : 'A decentralized digital university and clinical ecosystem anchoring forensic medical competency across 54 Sudanese faculties.'}
                    </p>
                </div>
            </section>

            {/* CORE EXECUTIVE DIRECTORS */}
            <Section className="py-16">
                <div className="mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                            {lang === 'ar' ? 'أعضاء القيادة الأكاديمية والسريرية' : 'Executive Directorate & Academic Officers'}
                        </h2>
                        <p className="text-xs text-slate-500 font-mono mt-1">
                            {metrics.registryDisplay}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {faculty.map((member) => (
                            <div key={member.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:border-cyan-400 transition-all">
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="px-2.5 py-1 rounded-md bg-slate-900 text-cyan-400 font-mono text-xs font-bold">
                                            {member.id}
                                        </span>
                                        <span className="text-[10px] font-mono text-slate-400">OFFICIAL RECORD</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                                        {lang === 'ar' ? member.name_ar : member.name}
                                    </h3>
                                    <p className="text-xs font-bold text-teal-700 mb-3">
                                        {lang === 'ar' ? member.role_ar : member.role}
                                    </p>
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-mono text-slate-600 mb-4">
                                        <strong>{member.degrees}</strong>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                                        {member.focus}
                                    </p>
                                </div>
                                <div className="pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                                    <span>Pillar:</span>
                                    <strong className="text-slate-800">{member.pillar}</strong>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* AUTHENTIC SURVEY REVIEWS & CANDIDATE FEEDBACK */}
            <section className="bg-slate-50 py-16 border-t border-slate-200">
                <div className="mx-auto max-w-6xl px-5">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-bold font-mono mb-2">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            {metrics.satisfactionRating} SATISFACTION SCORE ({metrics.surveySubmissions} VERIFIED SUBMISSIONS)
                        </div>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                            {lang === 'ar' ? 'آراء وملاحظات الأطباء والباحثين المسجلين' : 'Verified Candidate & Researcher Feedback'}
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            {lang === 'ar' ? 'تقييمات حقيقية موثقة من أطباء وباحثي المنظومة:' : 'Authentic unedited feedback from registered doctors and research fellows:'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {reviews.map((rev) => (
                            <div key={rev.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="font-mono text-xs text-teal-700 font-bold">{rev.id}</span>
                                        <div className="flex text-amber-400">
                                            {[...Array(rev.rating)].map((_, i) => (
                                                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-700 leading-relaxed italic mb-4">
                                        "{lang === 'ar' ? rev.quote : rev.quote_en}"
                                    </p>
                                </div>
                                <div className="pt-3 border-t border-slate-100">
                                    <strong className="text-xs text-slate-900 block">{rev.author}</strong>
                                    <span className="text-[10px] text-slate-400 font-mono">{rev.role} • {rev.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default AboutPage;
