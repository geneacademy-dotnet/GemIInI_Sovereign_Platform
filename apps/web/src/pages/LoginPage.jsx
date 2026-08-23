import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import Layout from '@/components/site/Layout';
import { Section } from '@/components/site/Bits';
import { useLang } from '@/i18n/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { sessionRef } from '@/lib/geneApi';

const inputClass = 'min-h-[44px] w-full rounded-xl border border-input bg-card px-4 text-sm outline-none focus:border-[hsl(var(--accent))]';

const LoginPage = () => {
    const { t } = useLang();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [status, setStatus] = useState('idle');

    const onSubmit = async (event) => {
        event.preventDefault();
        setStatus('loading');
        try {
            const auth = await login(form.email, form.password);
            sessionRef.set(auth?.record?.id || 'session');
            navigate('/dashboard');
        } catch {
            sessionRef.clear();
            setStatus('error');
        }
    };

    return (
        <Layout>
            <Helmet>
                <title>Member sign in | Gene Academy</title>
                <meta name="description" content="Sign in to the Gene Academy member area to access your dashboard, courses, communities and secure workspace." />
            </Helmet>
            <Section rail="max-w-[32rem]">
                <div className="rounded-2xl border border-border bg-card p-8">
                    <ShieldCheck className="h-7 w-7 text-[hsl(var(--teal))]" strokeWidth={1.7} />
                    <h1 className="mt-4 font-display text-3xl font-semibold">{t('auth.login')}</h1>
                    <p className="mt-2 text-sm text-muted-foreground">{t('auth.gate')}</p>
                    <form onSubmit={onSubmit} className="mt-7 space-y-5">
                        <label className="block text-sm font-medium">
                            {t('auth.email')}
                            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={`mt-2 ${inputClass}`} required />
                        </label>
                        <label className="block text-sm font-medium">
                            {t('auth.password')}
                            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={`mt-2 ${inputClass}`} required />
                        </label>
                        {status === 'error' && <p className="text-sm text-destructive">{t('auth.error')}</p>}
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="min-h-[48px] w-full rounded-xl bg-primary text-sm font-medium text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-60"
                        >
                            {status === 'loading' ? t('common.loading') : t('auth.login')}
                        </button>
                    </form>
                    <p className="mt-6 text-sm text-muted-foreground">
                        {t('auth.noAccount')}{' '}
                        <Link to="/signup" className="font-medium text-foreground underline-offset-4 hover:underline">{t('auth.signup')}</Link>
                    </p>
                </div>
            </Section>
        </Layout>
    );
};

export default LoginPage;
