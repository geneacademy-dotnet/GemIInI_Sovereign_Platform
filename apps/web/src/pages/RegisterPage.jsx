import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { CheckCircle2 } from 'lucide-react';
import Layout from '@/components/site/Layout';
import { PageHeader, Section, StateBlock } from '@/components/site/Bits';
import PaymentChannels from '@/components/PaymentChannels';
import { useLang } from '@/i18n/LanguageContext';
import { submitRegistration } from '@/lib/geneApi';

const roles = ['student', 'professional', 'instructor', 'organization'];

const Field = ({ label, children }) => (
    <label className="flex flex-col gap-2 text-sm">
        <span className="font-medium">{label}</span>
        {children}
    </label>
);

const inputClass = 'min-h-[44px] rounded-xl border border-input bg-card px-4 text-sm outline-none focus:border-[hsl(var(--accent))]';

const RegisterPage = () => {
    const { t, lang } = useLang();
    const [form, setForm] = useState({ fullName: '', email: '', phone: '', role: 'student', university: '', interest: '' });
    const [status, setStatus] = useState('idle');
    const [errors, setErrors] = useState({});
    const [paid, setPaid] = useState(false);

    const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

    const onSubmit = async (event) => {
        event.preventDefault();
        const nextErrors = {};
        if (form.fullName.trim().length < 3) nextErrors.fullName = lang === 'ar' ? 'أدخل اسمك الكامل.' : 'Enter your full name.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = lang === 'ar' ? 'بريد إلكتروني غير صالح.' : 'Enter a valid email address.';
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length) return;

        setStatus('loading');
        try {
            await submitRegistration(form);
            setStatus('done');
        } catch {
            setStatus('error');
        }
    };

    return (
        <Layout>
            <Helmet>
                <title>Register with Gene Academy | Request a GA-ID</title>
                <meta name="description" content="Register your interest in Gene Academy courses. Applications are reviewed by our admin team before a GA-ID is issued." />
            </Helmet>
            <PageHeader title={t('register.title')} subtitle={t('register.sub')} />
            <Section rail="max-w-[56rem]">
                {status === 'done' ? (
                    <div className="space-y-6">
                        <div
                            className={`flex items-start gap-3 rounded-2xl border p-7 ${
                                paid
                                    ? 'border-[hsl(var(--teal))]/50 bg-[hsl(var(--teal))]/10'
                                    : 'border-[hsl(var(--accent))]/40 bg-[hsl(var(--accent))]/8'
                            }`}
                        >
                            <CheckCircle2
                                className={`mt-0.5 h-6 w-6 ${paid ? 'text-[hsl(var(--teal))]' : 'text-[hsl(var(--accent))]'}`}
                                strokeWidth={1.8}
                            />
                            <div>
                                <h2 className="font-display text-xl font-semibold">
                                    {paid
                                        ? lang === 'ar' ? 'تم استلام إشعار الدفع' : 'Payment confirmation received'
                                        : t('register.success')}
                                </h2>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {paid
                                        ? lang === 'ar'
                                            ? 'الحالة: دفع مُؤكَّد — قيد مراجعة الإدارة لإصدار رقم العضوية'
                                            : 'Status: payment confirmed — pending admin review to issue your GA-ID'
                                        : lang === 'ar'
                                            ? 'الحالة: قيد مراجعة الإدارة — أكمل الدفع بالأسفل لتفعيل باقتك'
                                            : 'Status: pending admin review — complete payment below to activate your tier'}
                                </p>
                            </div>
                        </div>

                        {!paid && (
                            <div className="rounded-2xl border border-border bg-card p-6">
                                <h3 className="mb-4 font-display text-lg font-semibold">
                                    {lang === 'ar' ? 'ادفع لتفعيل باقتك' : 'Pay to activate your tier'}
                                </h3>
                                <PaymentChannels compact />
                                <button
                                    type="button"
                                    onClick={() => setPaid(true)}
                                    className="mt-5 inline-flex min-h-[48px] items-center rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground transition-transform active:scale-[0.98]"
                                >
                                    {lang === 'ar' ? 'أرسلت الإيصال — تأكيد الدفع' : "I've sent the receipt — confirm payment"}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <Field label={t('register.name')}>
                                <input value={form.fullName} onChange={update('fullName')} className={inputClass} />
                            </Field>
                            {errors.fullName && <p className="mt-1.5 text-xs text-destructive">{errors.fullName}</p>}
                        </div>
                        <div>
                            <Field label={t('register.email')}>
                                <input type="email" value={form.email} onChange={update('email')} className={inputClass} />
                            </Field>
                            {errors.email && <p className="mt-1.5 text-xs text-destructive">{errors.email}</p>}
                        </div>
                        <Field label={t('register.phone')}>
                            <input value={form.phone} onChange={update('phone')} className={inputClass} />
                        </Field>
                        <Field label={t('register.role')}>
                            <select value={form.role} onChange={update('role')} className={inputClass}>
                                {roles.map((role) => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        </Field>
                        <Field label={t('register.university')}>
                            <input value={form.university} onChange={update('university')} className={inputClass} />
                        </Field>
                        <div className="sm:col-span-2">
                            <Field label={t('register.interest')}>
                                <textarea rows={4} value={form.interest} onChange={update('interest')} className={`${inputClass} py-3`} />
                            </Field>
                        </div>
                        {status === 'error' && (
                            <div className="sm:col-span-2">
                                <StateBlock kind="error" />
                            </div>
                        )}
                        <div className="sm:col-span-2">
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="min-h-[48px] w-full rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-60 sm:w-auto"
                            >
                                {status === 'loading' ? t('common.loading') : t('register.submit')}
                            </button>
                        </div>
                    </form>
                )}
            </Section>
        </Layout>
    );
};

export default RegisterPage;
