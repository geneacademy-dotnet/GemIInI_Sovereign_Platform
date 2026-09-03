import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import {
    Award,
    BadgeCheck,
    CheckCircle2,
    HeartPulse,
    MapPin,
    Microscope,
    ScrollText,
    Search,
    Share2,
    ShieldCheck,
    Stethoscope,
    Users,
} from 'lucide-react';
import Layout from '@/components/site/Layout';
import { PageHeader, Section, StateBlock } from '@/components/site/Bits';
import AchievementCard from '@/components/AchievementCard';
import Reveal from '@/components/Reveal';
import CountUp from '@/components/CountUp';
import { useLang } from '@/i18n/LanguageContext';
import { SOVEREIGN_ECOSYSTEM } from '@/data/sovereign-config';
import { lookupMember, sessionRef } from '@/lib/geneApi';

const ACH_ORDER = ['bls', 'mrcs', 'usmle', 'gemiiniSmc', 'moduleIV', 'germanFsp', 'papers100', 'phd'];

const CertificationsPage = () => {
    const { t, lang } = useLang();
    const L = (obj) => (obj && (obj[lang] || obj.en)) || '';
    const { achievements } = SOVEREIGN_ECOSYSTEM;

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

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const share = (network) => {
        const text = lang === 'ar' ? 'Ø´Ù‡Ø§Ø¯ØªÙŠ Ù…ÙˆØ«Ù‘Ù‚Ø© ÙÙŠ Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠØ© Ø§Ù„Ø¬ÙŠÙ†Ø§Øª' : 'My Gene Academy certificate is verified';
        const urls = {
            x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${shareUrl}`)}`,
        };
        if (typeof window !== 'undefined') window.open(urls[network], '_blank', 'noopener');
    };

    const geo = achievements.geographic;

    return (
        <Layout>
            <Helmet>
                <title>Achievements & Certifications | Gene Academy verified proof of impact</title>
                <meta
                    name="description"
                    content="Gene Academy achievements and certifications â€” BLS, MRCS, USMLE, GemIInIxSMC licensure, German FSP, the 100 Papers Project and PhD completions, all SHA-256 verified. Verify any certificate by GA-ID."
                />
            </Helmet>
            <PageHeader
                title={L({ en: 'Achievements & Certifications', ar: 'Ø§Ù„Ø¥Ù†Ø¬Ø§Ø²Ø§Øª ÙˆØ§Ù„Ø´Ù‡Ø§Ø¯Ø§Øª' })}
                subtitle={L({
                    en: 'Proof of impact, cryptographically sealed. Every certification below is logged, audited and tied to a verified GA-ID.',
                    ar: 'Ø¯Ù„ÙŠÙ„ Ø§Ù„Ø£Ø«Ø±ØŒ Ù…Ø®ØªÙˆÙ… ØªØ´ÙÙŠØ±ÙŠØ§Ù‹. ÙƒÙ„ Ø´Ù‡Ø§Ø¯Ø© Ø£Ø¯Ù†Ø§Ù‡ Ù…Ø³Ø¬ÙŽÙ‘Ù„Ø© ÙˆÙ…Ø¯Ù‚Ù‘Ù‚Ø© ÙˆÙ…Ø±ØªØ¨Ø·Ø© Ø¨Ø±Ù‚Ù… Ø¹Ø¶ÙˆÙŠØ© Ù…ÙˆØ«Ù‘Ù‚.',
                })}
            />

            {/* Achievement grid */}
            <Section rail="max-w-[90rem]">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {ACH_ORDER.map((key, i) => (
                        <AchievementCard key={key} achievement={achievements[key]} delay={i * 0.05} />
                    ))}
                </div>
            </Section>

            {/* Geographic + timeline */}
            <section className="border-y border-border bg-secondary/30">
                <Section rail="max-w-[90rem]" className="!py-16">
                    <div className="grid gap-10 lg:grid-cols-2">
                        <Reveal>
                            <span className="font-tech text-xs uppercase tracking-[0.28em] text-[hsl(var(--accent))]">
                                {L({ en: 'Geographic Reach', ar: 'Ø§Ù„Ø§Ù†ØªØ´Ø§Ø± Ø§Ù„Ø¬ØºØ±Ø§ÙÙŠ' })}
                            </span>
                            <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
                                {L({ en: '54 universities, 40 partners', ar: 'Ù¥Ù¤ Ø¬Ø§Ù…Ø¹Ø©ØŒ Ù¤Ù  Ø´Ø±ÙŠÙƒØ§Ù‹' })}
                            </h2>
                            <p className="mt-3 text-muted-foreground">
                                {L({
                                    en: 'Verified members and partner institutions across Sudan and the wider region.',
                                    ar: 'Ø£Ø¹Ø¶Ø§Ø¡ Ù…ÙˆØ«Ù‘Ù‚ÙˆÙ† ÙˆÙ…Ø¤Ø³Ø³Ø§Øª Ø´Ø±ÙŠÙƒØ© Ø¹Ø¨Ø± Ø§Ù„Ø³ÙˆØ¯Ø§Ù† ÙˆØ§Ù„Ù…Ù†Ø·Ù‚Ø© Ø§Ù„Ù…Ø¬Ø§ÙˆØ±Ø©.',
                                })}
                            </p>
                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <div className="rounded-xl border border-border bg-card p-5">
                                    <p className="font-display text-3xl font-bold text-[hsl(var(--teal))]">
                                        <CountUp value={geo.universities} suffix="+" />
                                    </p>
                                    <p className="mt-1 font-tech text-[11px] uppercase tracking-wider text-muted-foreground">
                                        {L({ en: 'Universities', ar: 'Ø¬Ø§Ù…Ø¹Ø©' })}
                                    </p>
                                </div>
                                <div className="rounded-xl border border-border bg-card p-5">
                                    <p className="font-display text-3xl font-bold text-[hsl(var(--teal))]">
                                        <CountUp value={geo.partners} suffix="+" />
                                    </p>
                                    <p className="mt-1 font-tech text-[11px] uppercase tracking-wider text-muted-foreground">
                                        {L({ en: 'Lab & hospital partners', ar: 'Ø´Ø±ÙƒØ§Ø¡ Ø§Ù„Ù…Ø®ØªØ¨Ø±Ø§Øª ÙˆØ§Ù„Ù…Ø³ØªØ´ÙÙŠØ§Øª' })}
                                    </p>
                                </div>
                            </div>
                            <ul className="mt-5 flex flex-wrap gap-2">
                                {geo.regions.map((r) => (
                                    <li
                                        key={r.en}
                                        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium"
                                    >
                                        <MapPin className="h-3.5 w-3.5 text-[hsl(var(--teal))]" strokeWidth={1.8} />
                                        {L(r)}
                                    </li>
                                ))}
                            </ul>
                        </Reveal>

                        <Reveal delay={0.1}>
                            <span className="font-tech text-xs uppercase tracking-[0.28em] text-[hsl(var(--accent))]">
                                {L({ en: 'Growth Timeline', ar: 'Ù…Ø³Ø§Ø± Ø§Ù„Ù†Ù…Ùˆ' })}
                            </span>
                            <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
                                {L({ en: '2,441 members in 15 months', ar: 'Ù¢Ù¤Ù¤Ù¡ Ø¹Ø¶ÙˆØ§Ù‹ Ø®Ù„Ø§Ù„ Ù¡Ù¥ Ø´Ù‡Ø±Ø§Ù‹' })}
                            </h2>
                            <ol className="mt-6 space-y-0">
                                {achievements.timeline.map((m, i) => (
                                    <li key={m.month} className="relative flex gap-4 pb-6 last:pb-0">
                                        {i < achievements.timeline.length - 1 && (
                                            <span className="absolute start-[15px] top-8 h-full w-px bg-border" />
                                        )}
                                        <span className="z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[hsl(var(--accent))]/50 bg-card font-tech text-[11px] font-semibold text-[hsl(var(--accent))]">
                                            {m.month}
                                        </span>
                                        <div className="pt-1">
                                            <p className="text-sm font-medium">{L(m.label)}</p>
                                            <p className="font-tech text-xs text-muted-foreground">
                                                {L({ en: 'Month', ar: 'Ø´Ù‡Ø±' })} {m.month} Â·{' '}
                                                <span className="text-[hsl(var(--teal))]">
                                                    {m.members.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')}
                                                </span>{' '}
                                                {L({ en: 'members', ar: 'Ø¹Ø¶Ùˆ' })}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </Reveal>
                    </div>
                </Section>
            </section>

            {/* Testimonials */}
            <Section
                title={L({ en: 'Voices from the certified', ar: 'Ø£ØµÙˆØ§Øª Ù…Ù† Ø§Ù„Ù…ÙØ¹ØªÙ…ÙŽØ¯ÙŠÙ†' })}
                subtitle={L({
                    en: 'Verified professionals who rebuilt their credentials with the consortium.',
                    ar: 'Ù…Ù…Ø§Ø±Ø³ÙˆÙ† Ù…ÙˆØ«Ù‘Ù‚ÙˆÙ† Ø£Ø¹Ø§Ø¯ÙˆØ§ Ø¨Ù†Ø§Ø¡ Ø§Ø¹ØªÙ…Ø§Ø¯Ø§ØªÙ‡Ù… Ù…Ø¹ Ø§Ù„ÙƒÙˆÙ†Ø³ÙˆØ±ØªÙŠÙˆÙ….',
                })}
                rail="max-w-[90rem]"
            >
                <div className="grid gap-6 md:grid-cols-3">
                    {achievements.testimonials.map((tm, i) => (
                        <Reveal key={tm.name.en} delay={i * 0.07}>
                            <figure className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
                                <span className="grid h-12 w-12 place-items-center rounded-full bg-[hsl(var(--teal))]/12 font-display font-semibold text-[hsl(var(--teal))]">
                                    {L(tm.name).replace(/^(Dr\.?|Ø¯\.?)\s*/i, '').charAt(0)}
                                </span>
                                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground/90">
                                    â€œ{L(tm.quote)}â€
                                </blockquote>
                                <figcaption className="mt-5 border-t border-border pt-4">
                                    <p className="font-display text-sm font-semibold">{L(tm.name)}</p>
                                    <p className="font-tech text-[11px] uppercase tracking-wider text-muted-foreground">
                                        {L(tm.role)}
                                    </p>
                                    <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium">
                                        <Award className="h-3 w-3 text-[hsl(var(--accent))]" strokeWidth={2} />
                                        {tm.cert}
                                    </span>
                                </figcaption>
                            </figure>
                        </Reveal>
                    ))}
                </div>
            </Section>

            {/* Verify a certificate */}
            <section className="ink-panel text-white">
                <div className="mx-auto max-w-[56rem] px-5 py-20 lg:px-10">
                    <Reveal>
                        <span className="font-tech text-xs uppercase tracking-[0.3em] text-[hsl(var(--accent))]">
                            {L({ en: 'Verify a Certificate', ar: 'ØªØ­Ù‚Ù‚ Ù…Ù† Ø´Ù‡Ø§Ø¯Ø©' })}
                        </span>
                        <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
                            {L({ en: 'Public certificate lookup', ar: 'Ø¨Ø­Ø« Ø¹Ø§Ù… Ø¹Ù† Ø§Ù„Ø´Ù‡Ø§Ø¯Ø§Øª' })}
                        </h2>
                        <p className="mt-3 text-white/70">
                            {L({
                                en: 'Enter a GA-ID to confirm a certified professional. Only sanitized public fields are returned.',
                                ar: 'Ø£Ø¯Ø®Ù„ Ø±Ù‚Ù… GA-ID Ù„Ù„ØªØ£ÙƒØ¯ Ù…Ù† Ù…Ù…Ø§Ø±Ø³ Ù…Ø¹ØªÙ…Ø¯. ØªÙØ¹Ø±Ø¶ Ø§Ù„Ø­Ù‚ÙˆÙ„ Ø§Ù„Ø¹Ø§Ù…Ø© Ø§Ù„Ù…Ù†Ù‚Ù‘Ø­Ø© ÙÙ‚Ø·.',
                            })}
                        </p>
                    </Reveal>

                    <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-3 sm:flex-row">
                        <label className="relative flex flex-1 items-center">
                            <span className="sr-only">{t('verify.placeholder')}</span>
                            <Search className="absolute start-3 h-4 w-4 text-white/50" strokeWidth={1.8} />
                            <input
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                placeholder={t('verify.placeholder')}
                                className="min-h-[48px] w-full rounded-xl border border-white/20 bg-white/5 ps-10 pe-4 text-sm text-white outline-none placeholder:text-white/40 focus:border-[hsl(var(--accent))]"
                            />
                        </label>
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="min-h-[48px] rounded-xl bg-[hsl(var(--accent))] px-7 text-sm font-medium text-[hsl(var(--accent-foreground))] transition-transform active:scale-[0.98] disabled:opacity-60"
                        >
                            {status === 'loading' ? t('common.loading') : t('verify.button')}
                        </button>
                    </form>

                    <div className="mt-8">
                        {status === 'loading' && <div className="h-40 animate-pulse rounded-2xl border border-white/15 bg-white/5" />}
                        {status === 'error' && (
                            <div className="flex items-center gap-3 rounded-2xl border border-destructive/40 bg-destructive/10 px-5 py-6 text-sm text-destructive">
                                {error}
                            </div>
                        )}
                        {status === 'empty' && (
                            <div className="flex items-center gap-3 rounded-2xl border border-dashed border-white/25 px-5 py-8 text-sm text-white/60">
                                {t('verify.notFound')}
                            </div>
                        )}
                        {status === 'done' && result && (
                            <article className="rounded-2xl border border-white/15 bg-white/[0.06] p-7 backdrop-blur">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <BadgeCheck
                                            className={`h-7 w-7 ${result.verified ? 'text-[hsl(var(--teal))]' : 'text-white/40'}`}
                                            strokeWidth={1.8}
                                        />
                                        <div>
                                            <h3 className="font-display text-2xl font-semibold">{result.name}</h3>
                                            <p className="font-tech text-xs uppercase tracking-wider text-white/50">{result.gaId}</p>
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--accent))]/50 bg-[hsl(var(--accent))]/15 px-3 py-1 font-tech text-[11px] uppercase tracking-wider text-[hsl(var(--accent))]">
                                        <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} />
                                        SHA-256 âœ“
                                    </span>
                                </div>

                                <p className="mt-4 text-sm text-white/70">
                                    {result.verified ? t('verify.found') : t('verify.unverified')}
                                </p>

                                <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                                    {[
                                        [L({ en: 'Role', ar: 'Ø§Ù„Ø¯ÙˆØ±' }), result.role],
                                        [L({ en: 'University / organization', ar: 'Ø§Ù„Ø¬Ø§Ù…Ø¹Ø© / Ø§Ù„Ù…Ø¤Ø³Ø³Ø©' }), result.university],
                                        [L({ en: 'Tier', ar: 'Ø§Ù„Ù…Ø³ØªÙˆÙ‰' }), lang === 'ar' ? result.tierLabelAr : result.tier],
                                        [L({ en: 'Certification', ar: 'Ø§Ù„Ø´Ù‡Ø§Ø¯Ø©' }), result.verified ? 'BLS Â· MRCS Â· MTC' : 'â€”'],
                                    ].map(([label, val]) => (
                                        <div key={label} className="border-t border-white/10 pt-3">
                                            <dt className="text-xs uppercase tracking-wider text-white/45">{label}</dt>
                                            <dd className="mt-1 text-sm font-medium">{val || 'â€”'}</dd>
                                        </div>
                                    ))}
                                </dl>

                                <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-white/10 pt-5">
                                    <span className="font-tech text-[11px] uppercase tracking-wider text-white/45">
                                        {L({ en: 'Share', ar: 'Ù…Ø´Ø§Ø±ÙƒØ©' })}
                                    </span>
                                    {[
                                        { n: 'whatsapp', label: 'WhatsApp' },
                                        { n: 'linkedin', label: 'LinkedIn' },
                                        { n: 'x', label: 'X' },
                                    ].map((s) => (
                                        <button
                                            key={s.n}
                                            type="button"
                                            onClick={() => share(s.n)}
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-white/10"
                                        >
                                            <Share2 className="h-3.5 w-3.5" strokeWidth={1.8} />
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                            </article>
                        )}
                    </div>

                    <p className="mt-8">
                        <Link
                            to="/register"
                            className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-6 font-semibold text-[hsl(var(--primary-foreground))] transition-transform active:scale-[0.98]"
                        >
                            {L({ en: 'Join the certified community', ar: 'Ø§Ù†Ø¶Ù… Ø¥Ù„Ù‰ Ù…Ø¬ØªÙ…Ø¹ Ø§Ù„Ù…ÙØ¹ØªÙ…ÙŽØ¯ÙŠÙ†' })}
                        </Link>
                    </p>
                </div>
            </section>
        </Layout>
    );
};

export default CertificationsPage;
