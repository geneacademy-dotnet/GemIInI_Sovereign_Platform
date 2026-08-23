import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Mail, MapPin, Phone } from 'lucide-react';
import Layout from '@/components/site/Layout';
import { PageHeader, Section } from '@/components/site/Bits';
import { useLang } from '@/i18n/LanguageContext';
import { submitRegistration } from '@/lib/geneApi';

const inputClass = 'min-h-[44px] w-full rounded-xl border border-input bg-card px-4 text-sm outline-none focus:border-[hsl(var(--accent))]';

const ContactPage = () => {
    const { t, lang } = useLang();
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('idle');

    const onSubmit = async (event) => {
        event.preventDefault();
        if (!form.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            setStatus('error');
            return;
        }
        setStatus('loading');
        try {
            await submitRegistration({ fullName: form.name, email: form.email, interest: form.message, role: 'contact' });
            setStatus('done');
        } catch {
            setStatus('error');
        }
    };

    return (
        <Layout>
            <Helmet>
                <title>Contact Gene Academy | Consulting and institutional training</title>
                <meta name="description" content="Contact Gene Academy about online courses, in-person clinical training, consulting, coaching and GLOMEt procurement support." />
            </Helmet>
            <PageHeader title={t('contact.title')} subtitle={t('contact.sub')} />
            <Section rail="max-w-[72rem]">
                <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr]">
                    <form onSubmit={onSubmit} className="space-y-5">
                        <label className="block text-sm font-medium">
                            {t('register.name')}
                            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={`mt-2 ${inputClass}`} />
                        </label>
                        <label className="block text-sm font-medium">
                            {t('register.email')}
                            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={`mt-2 ${inputClass}`} />
                        </label>
                        <label className="block text-sm font-medium">
                            {t('contact.message')}
                            <textarea rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={`mt-2 py-3 ${inputClass}`} />
                        </label>
                        {status === 'error' && <p className="text-sm text-destructive">{t('common.error')}</p>}
                        {status === 'done' && <p className="text-sm text-[hsl(var(--teal))]">{t('contact.sent')}</p>}
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="min-h-[48px] rounded-xl bg-primary px-7 text-sm font-medium text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-60"
                        >
                            {status === 'loading' ? t('common.loading') : t('contact.send')}
                        </button>
                    </form>

                    <aside className="space-y-5 rounded-2xl border border-border bg-card p-7 text-sm">
                        <p className="flex items-center gap-3"><Mail className="h-4 w-4 text-[hsl(var(--teal))]" strokeWidth={1.8} /> hello@geneacademy.net</p>
                        <p className="flex items-center gap-3"><Phone className="h-4 w-4 text-[hsl(var(--teal))]" strokeWidth={1.8} /> +249 900 000 000</p>
                        <p className="flex items-center gap-3"><MapPin className="h-4 w-4 text-[hsl(var(--teal))]" strokeWidth={1.8} /> {lang === 'ar' ? 'الخرطوم ودبي' : 'Khartoum and Dubai'}</p>
                        <p className="border-t border-border pt-5 text-muted-foreground">{t('brand.powered')}</p>
                    </aside>
                </div>
            </Section>
        </Layout>
    );
};

export default ContactPage;
