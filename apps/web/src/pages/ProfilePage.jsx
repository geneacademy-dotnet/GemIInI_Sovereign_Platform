import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Layout from '@/components/site/Layout';
import { PageHeader, Section } from '@/components/site/Bits';
import { useLang } from '@/i18n/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import pb from '@/lib/pocketbaseClient';

const inputClass = 'min-h-[44px] w-full rounded-xl border border-input bg-card px-4 text-sm outline-none focus:border-[hsl(var(--accent))]';

const ProfilePage = () => {
    const { t, lang } = useLang();
    const { user } = useAuth();
    const [form, setForm] = useState({
        full_name: user?.full_name || '',
        university: user?.university || '',
        phone_masked: user?.phone_masked || '',
    });
    const [status, setStatus] = useState('idle');

    const save = async (event) => {
        event.preventDefault();
        setStatus('loading');
        try {
            await pb.collection('users').update(user.id, form);
            setStatus('done');
        } catch {
            setStatus('error');
        }
    };

    return (
        <Layout>
            <Helmet>
                <title>My profile | Gene Academy member</title>
                <meta name="description" content="Manage your Gene Academy member profile, institution and contact details." />
            </Helmet>
            <PageHeader title={t('nav.profile')} subtitle={user?.email} />
            <Section rail="max-w-[48rem]">
                <div className="mb-8 grid gap-4 sm:grid-cols-3">
                    {[
                        ['GA-ID', user?.ga_id || '—'],
                        [t('dash.tier'), user?.tier || 'bronze'],
                        [t('dash.gp'), (user?.gp_points ?? 0).toLocaleString('en-US')],
                    ].map(([label, value]) => (
                        <div key={label} className="rounded-2xl border border-border bg-card p-5">
                            <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
                            <p className="mt-2 font-display text-xl font-semibold capitalize">{value}</p>
                        </div>
                    ))}
                </div>

                <form onSubmit={save} className="space-y-5">
                    <label className="block text-sm font-medium">
                        {t('register.name')}
                        <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className={`mt-2 ${inputClass}`} />
                    </label>
                    <label className="block text-sm font-medium">
                        {t('register.university')}
                        <input value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} className={`mt-2 ${inputClass}`} />
                    </label>
                    <label className="block text-sm font-medium">
                        {lang === 'ar' ? 'الهاتف (مقنّع)' : 'Phone (masked)'}
                        <input value={form.phone_masked} onChange={(e) => setForm({ ...form, phone_masked: e.target.value })} className={`mt-2 ${inputClass}`} placeholder="+249 9** *** 118" />
                    </label>
                    {status === 'error' && <p className="text-sm text-destructive">{t('common.error')}</p>}
                    {status === 'done' && <p className="text-sm text-[hsl(var(--teal))]">{lang === 'ar' ? 'تم الحفظ.' : 'Saved.'}</p>}
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="min-h-[48px] rounded-xl bg-primary px-7 text-sm font-medium text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-60"
                    >
                        {status === 'loading' ? t('common.loading') : lang === 'ar' ? 'حفظ' : 'Save changes'}
                    </button>
                </form>
            </Section>
        </Layout>
    );
};

export default ProfilePage;
