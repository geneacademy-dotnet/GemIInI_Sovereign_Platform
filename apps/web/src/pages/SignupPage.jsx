import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import Layout from '@/components/site/Layout';
import { Section } from '@/components/site/Bits';
import { useLang } from '@/i18n/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { sessionRef } from '@/lib/geneApi';

const inputClass = 'min-h-[44px] w-full rounded-xl border border-input bg-card px-4 text-sm outline-none focus:border-[hsl(var(--accent))]';

const SignupPage = () => {
    const { t, lang } = useLang();
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', university: '' });
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');

    const onSubmit = async (event) => {
        event.preventDefault();
        if (form.password.length < 8) {
            setStatus('error');
            setMessage(lang === 'ar' ? 'كلمة المرور يجب أن تكون ٨ أحرف على الأقل.' : 'Password must be at least 8 characters.');
            return;
        }
        setStatus('loading');
        try {
            const auth = await signup(form.email, form.password, {
                full_name: form.name,
                university: form.university,
                member_role: 'student',
                tier: 'bronze',
                gp_points: 0,
                verified_member: false,
            });
            sessionRef.set(auth?.record?.id || 'session');
            navigate('/dashboard');
        } catch (err) {
            sessionRef.clear();
            setStatus('error');
            setMessage(err?.response?.data?.email?.message || t('common.error'));
        }
    };

    return (
        <Layout>
            <Helmet>
                <title>Create a Gene Academy member account</title>
                <meta name="description" content="Create your Gene Academy member account to access courses, communities, progress tracking and the MTC exam simulator." />
            </Helmet>
            <Section rail="max-w-[32rem]">
                <div className="rounded-2xl border border-border bg-card p-8">
                    <UserPlus className="h-7 w-7 text-[hsl(var(--teal))]" strokeWidth={1.7} />
                    <h1 className="mt-4 font-display text-3xl font-semibold">{t('auth.signup')}</h1>
                    <p className="mt-2 text-sm text-muted-foreground">{t('register.sub')}</p>
                    <form onSubmit={onSubmit} className="mt-7 space-y-5">
                        <label className="block text-sm font-medium">
                            {t('register.name')}
                            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={`mt-2 ${inputClass}`} required />
                        </label>
                        <label className="block text-sm font-medium">
                            {t('auth.email')}
                            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={`mt-2 ${inputClass}`} required />
                        </label>
                        <label className="block text-sm font-medium">
                            {t('register.university')}
                            <input value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} className={`mt-2 ${inputClass}`} />
                        </label>
                        <label className="block text-sm font-medium">
                            {t('auth.password')}
                            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={`mt-2 ${inputClass}`} required />
                        </label>
                        {status === 'error' && <p className="text-sm text-destructive">{message}</p>}
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="min-h-[48px] w-full rounded-xl bg-primary text-sm font-medium text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-60"
                        >
                            {status === 'loading' ? t('common.loading') : t('auth.signup')}
                        </button>
                    </form>
                    <p className="mt-6 text-sm text-muted-foreground">
                        {t('auth.haveAccount')}{' '}
                        <Link to="/login" className="font-medium text-foreground underline-offset-4 hover:underline">{t('auth.login')}</Link>
                    </p>
                </div>
            </Section>
        </Layout>
    );
};

export default SignupPage;
