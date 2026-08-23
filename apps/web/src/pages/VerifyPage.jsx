import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams, Link } from 'react-router-dom';
import { BadgeCheck, Search, ShieldAlert, Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import Layout from '@/components/site/Layout';
import { PageHeader, Section, StateBlock } from '@/components/site/Bits';
import HolographicTiltCard from '@/components/HolographicTiltCard';
import { useLang } from '@/i18n/LanguageContext';
import { lookupMember, sessionRef } from '@/lib/geneApi';

const VerifyPage = () => {
    const { t, lang } = useLang();
    const [searchParams] = useSearchParams();
    const queryId = searchParams.get('id') || '';
    const [value, setValue] = useState(queryId);
    const [status, setStatus] = useState('idle');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const runLookup = async (idToSearch) => {
        if (!idToSearch || !idToSearch.trim()) return;
        setStatus('loading');
        setResult(null);
        setError('');
        try {
            const member = await lookupMember(idToSearch.trim());
            if (!member) {
                sessionRef.clear();
                setStatus('empty');
                return;
            }
            setResult(member);
            setStatus('done');
        } catch (err) {
            sessionRef.clear();
            setError(err.message === 'invalid_id' ? (lang === 'ar' ? 'الرمز غير صحيح أو غير مسجل بالسجل السيادي.' : 'Invalid ID or unverified candidate.') : t('common.error'));
            setStatus('error');
        }
    };

    useEffect(() => {
        if (queryId) {
            setValue(queryId);
            runLookup(queryId);
        } else {
            // Default preview GA0171
            runLookup('GA0171');
        }
    }, [queryId]);

    const onSubmit = (e) => {
        e.preventDefault();
        runLookup(value);
    };

    return (
        <Layout>
            <Helmet>
                <title>Verify a Sovereign Credential | SudaGene Consortium</title>
                <meta name="description" content="البوابة الرسمية للتحقق اللحظي المشفر من شهادات وسجلات الأطباء والباحثين المعتمدين في المجلس الطبي والمشروع الوطني للجينوم." />
            </Helmet>

            <Section className="py-12 md:py-16">
                <div className="mx-auto max-w-2xl text-center mb-8">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-mono text-teal-600 font-bold uppercase tracking-wider mb-4">
                        <ShieldCheck className="w-3.5 h-3.5" /> SudaPass Cryptographic Ledger
                    </span>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                        {lang === 'ar' ? 'التحقق السيادي من الاعتمادات الطبية' : 'Sovereign Credential Verification'}
                    </h1>
                    <p className="mt-2 text-sm md:text-base text-slate-600">
                        {lang === 'ar' 
                            ? 'أدخل الرمز التعريفي (مثال: GA0171 أو GA5406) للتحقق الفوري من صحة السجل والرصيد السريري المعتمد.' 
                            : 'Enter any GA-ID (e.g., GA0171 or GA5406) to audit verifiable clinical transcripts and credits.'}
                    </p>

                    {/* Search Bar */}
                    <form onSubmit={onSubmit} className="mt-6 flex items-center gap-2 max-w-md mx-auto">
                        <div className="relative flex-1">
                            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                placeholder="GA0171 / GA5406"
                                className="w-full rounded-xl border border-slate-200 bg-white ps-10 pe-4 py-2.5 text-sm font-mono uppercase outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 shadow-sm"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                        >
                            {status === 'loading' ? (lang === 'ar' ? 'جارٍ التحقق...' : 'Checking...') : (lang === 'ar' ? 'فحص السجل' : 'Verify')}
                        </button>
                    </form>
                </div>

                {/* State Results */}
                {status === 'done' && result && (
                    <div className="mx-auto flex flex-col items-center">
                        <HolographicTiltCard member={result} />
                    </div>
                )}

                {status === 'empty' && (
                    <div className="mx-auto max-w-md text-center p-8 rounded-2xl bg-amber-50/50 border border-amber-200/60">
                        <ShieldAlert className="w-10 h-10 text-amber-600 mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-slate-900">
                            {lang === 'ar' ? 'لم يتم العثور على سجل مطابق' : 'No Sovereign Record Found'}
                        </h3>
                        <p className="text-xs text-slate-600 mt-1 mb-4">
                            {lang === 'ar' ? 'الرمز غير مسجل أو لم يستكمل بوابة التوثيق.' : 'This ID has not been minted or verified yet.'}
                        </p>
                        <Link to="/register" className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 hover:underline">
                            {lang === 'ar' ? 'طلب إصدار هوية معتمدة ←' : 'Mint a Sovereign GA-ID →'}
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className="mx-auto max-w-md text-center p-6 rounded-2xl bg-red-50/50 border border-red-200 text-red-700 text-xs font-semibold">
                        {error}
                    </div>
                )}
            </Section>
        </Layout>
    );
};

export default VerifyPage;
