import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { BadgeCheck, Search, ShieldAlert } from 'lucide-react';
import Layout from '@/components/site/Layout';
import { PageHeader, Section, StateBlock } from '@/components/site/Bits';
import { useLang } from '@/i18n/LanguageContext';
import { lookupMember, sessionRef } from '@/lib/geneApi';

const VerifyPage = () => {
    const { t, lang } = useLang();
    const [value, setValue] = useState('');
    const [status, setStatus] = useState('idle');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const onSubmit = async (event) => {
        event.preventDefault();
        setStatus('loading');
        setResult(null);
        setError('');
        try {
            const member = await lookupMember(value);
            if (!member) {
                sessionRef.clear();
                setStatus('empty');
                return;
            }
            setResult(member);
            setStatus('done');
        } catch (err) {
            sessionRef.clear();
            setError(err.message === 'invalid_id' ? t('verify.invalid') : t('common.error'));
            setStatus('error');
        }
    };

    return (
        <Layout>
            <Helmet>
                <title>Verify a GA-ID | Gene Academy public member lookup</title>
                <meta name="description" content="Check whether a Gene Academy GA-ID belongs to a verified member. Only sanitized public fields are returned — never balances or private links." />
            </Helmet>
            <PageHeader title={t('verify.title')} subtitle={t('verify.sub')} />
            <Section rail="max-w-[56rem]">
                <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
                    <label className="relative flex flex-1 items-center">
                        <span className="sr-only">{t('verify.placeholder')}</span>
                        <Search className="absolute start-3 h-4 w-4 text-muted-foreground" strokeWidth={1.8} />
                        <input
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder={t('verify.placeholder')}
                            className="min-h-[48px] w-full rounded-xl border border-input bg-card ps-10 pe-4 text-sm outline-none focus:border-[hsl(var(--accent))]"
                        />
                    </label>
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="min-h-[48px] rounded-xl bg-primary px-7 text-sm font-medium text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-60"
                    >
                        {status === 'loading' ? t('common.loading') : t('verify.button')}
                    </button>
                </form>

                <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
                    <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.8} />
                    {t('verify.note')}
                </p>

                <div className="mt-8">
                    {status === 'loading' && <div className="h-40 animate-pulse rounded-2xl border border-border bg-secondary/60" />}
                    {status === 'error' && <StateBlock kind="error" message={error} />}
                    {status === 'empty' && <StateBlock message={t('verify.notFound')} />}
                    {status === 'done' && result && (
                        <article className="rounded-2xl border border-border bg-card p-7">
                            <div className="flex flex-wrap items-center gap-3">
                                <BadgeCheck className={`h-6 w-6 ${result.verified ? 'text-[hsl(var(--teal))]' : 'text-muted-foreground'}`} strokeWidth={1.8} />
                                <h2 className="font-display text-2xl font-semibold">{result.name}</h2>
                                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">{result.gaId}</span>
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground">{result.verified ? t('verify.found') : t('verify.unverified')}</p>
                            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                                {[
                                    [lang === 'ar' ? 'الدور' : 'Role', result.role],
                                    [lang === 'ar' ? 'الجامعة / المؤسسة' : 'University / organization', result.university],
                                    [lang === 'ar' ? 'المستوى' : 'Tier', lang === 'ar' ? result.tierLabelAr : result.tier],
                                    ['SudaPass', result.sudapass ? (lang === 'ar' ? 'مفعل' : 'Active') : (lang === 'ar' ? 'غير مفعل' : 'Inactive')],
                                    [lang === 'ar' ? 'الهاتف' : 'Phone', result.phoneMasked],
                                    [lang === 'ar' ? 'البريد' : 'Email', result.emailMasked],
                                ].map(([label, val]) => (
                                    <div key={label} className="border-t border-border pt-3">
                                        <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
                                        <dd className="mt-1 text-sm font-medium">{val || '—'}</dd>
                                    </div>
                                ))}
                            </dl>
                        </article>
                    )}
                </div>
            </Section>
        </Layout>
    );
};

export default VerifyPage;
