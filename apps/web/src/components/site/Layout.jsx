import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Dna, Globe, LogOut, Menu, ShieldCheck, X } from 'lucide-react';
import { useLang } from '@/i18n/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import IdGateModal from '@/components/IdGateModal';
import { sessionRef } from '@/lib/geneApi';
import { cn } from '@/lib/utils';

const publicLinks = [
    { to: '/', key: 'nav.home' },
    { to: '/bls', label: 'ورشة BLS القاهرة' },
    { to: '/about', key: 'nav.about' },
    { to: '/services', key: 'nav.services' },
    { to: '/courses', key: 'nav.courses' },
  { to: '/media', key: 'nav.media', label: 'Media Vault', label_ar: 'الخزينة المرئية' },
    { to: '/verify', key: 'nav.verify' },
    { to: '/certifications', key: 'nav.certifications' },
    { to: '/contact', key: 'nav.contact' },
];

const memberLinks = [
    { to: '/dashboard', key: 'nav.dashboard' },
    { to: '/communities', key: 'nav.communities' },
  { to: '/media', key: 'nav.media', label: 'Media Vault', label_ar: 'الخزينة المرئية' },
    { to: '/courses', key: 'nav.courses' },
  { to: '/media', key: 'nav.media', label: 'Media Vault', label_ar: 'الخزينة المرئية' },
    { to: '/profile', key: 'nav.profile' },
];

export const Brand = ({ light = false }) => {
    const { t } = useLang();
    return (
        <Link to="/" className="flex items-center gap-3">
            <span
                className={cn(
                    'grid h-10 w-10 place-items-center rounded-xl',
                    light ? 'bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]' : 'bg-primary text-primary-foreground',
                )}
            >
                <Dna className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <span className="leading-tight">
                <span className={cn('block font-display text-lg font-semibold', light && 'text-white')}>{t('brand.name')}</span>
                <span className={cn('block text-[11px] uppercase tracking-[0.18em]', light ? 'text-white/60' : 'text-muted-foreground')}>
                    {t('brand.eco')}
                </span>
            </span>
        </Link>
    );
};

const Header = () => {
    const { t, lang, toggleLang } = useLang();
    const { isAuthed, logout, setUser } = useAuth();
  const [isGateOpen, setIsGateOpen] = useState(false);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const links = isAuthed ? memberLinks : publicLinks;

    const handleLogout = () => {
        logout();
        sessionRef.clear();
        navigate('/');
    };

    return (
        <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
            <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white text-xs py-2 px-4 text-center font-bold tracking-wide flex flex-wrap items-center justify-center gap-2 shadow-md">
                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                <span>🚨 التسجيل مفتوح: ورشة الإنعاش القلبي الرئوي المتقدمة (BLS) — القاهرة 28 أغسطس 2026</span>
                <Link to="/bls" className="underline bg-black/25 hover:bg-black/40 px-2.5 py-0.5 rounded-full text-white transition-all inline-flex items-center gap-1">
                    <span>احجز مقعدك واحصل على +200 GP</span>
                    <span>➔</span>
                </Link>
            </div>
            <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-4 px-5 py-3.5 lg:px-10">
                <Brand />

                <nav className="hidden items-center gap-1 lg:flex">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.to === '/'}
                            className={({ isActive }) =>
                                cn(
                                    'rounded-lg px-3 py-2 text-sm transition-colors',
                                    isActive ? 'bg-secondary font-medium text-foreground' : 'text-muted-foreground hover:text-foreground',
                                )
                            }
                        >
                            {link.label || (link.key ? t(link.key) : '')}
                        </NavLink>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={toggleLang}
                        className="flex min-h-[44px] items-center gap-1.5 rounded-lg border border-border px-3 text-sm font-medium transition-colors hover:bg-secondary"
                        aria-label="Switch language"
                    >
                        <Globe className="h-4 w-4" strokeWidth={1.8} />
                        {lang === 'en' ? 'العربية' : 'EN'}
                    </button>

                    {isAuthed ? (
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="hidden min-h-[44px] items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-transform active:scale-[0.98] sm:flex"
                        >
                            <LogOut className="h-4 w-4" strokeWidth={1.8} />
                            {t('cta.signout')}
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className="hidden min-h-[44px] items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-transform active:scale-[0.98] sm:flex"
                        >
                            <ShieldCheck className="h-4 w-4" strokeWidth={1.8} />
                            {t('cta.signin')}
                        </Link>
                    )}

                    <button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        className="grid h-11 w-11 place-items-center rounded-lg border border-border lg:hidden"
                        aria-label="Menu"
                    >
                        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {open && (
                <div className="border-t border-border bg-background lg:hidden">
                    <div className="mx-auto flex max-w-[90rem] flex-col px-5 py-2">
                        {links.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.to === '/'}
                                onClick={() => setOpen(false)}
                                className="min-h-[44px] border-b border-border/60 py-3 text-sm last:border-0"
                            >
                                {link.label || (link.key ? t(link.key) : '')}
                            </NavLink>
                        ))}
                        {isAuthed ? (
                            <button type="button" onClick={handleLogout} className="py-3 text-start text-sm font-medium">
                                {t('cta.signout')}
                            </button>
                        ) : (
                            <Link to="/login" onClick={() => setOpen(false)} className="py-3 text-sm font-medium">
                                {t('cta.signin')}
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

const Footer = () => {
    const { t } = useLang();
    return (
        <footer className="ink-panel mt-24 text-white/70">
            <div className="mx-auto grid max-w-[90rem] gap-10 px-5 py-14 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-10">
                <div>
                    <Brand light />
                    <p className="mt-4 max-w-sm text-sm leading-relaxed">{t('hero.sub')}</p>
                </div>
                <div className="text-sm">
                    <h3 className="mb-3 font-display text-base text-white">{t('nav.courses')}</h3>
                    <ul className="space-y-2">
                        <li><Link to="/courses" className="hover:text-white">{t('courses.title')}</Link></li>
                        <li><Link to="/resources" className="hover:text-white">{t('resources.title')}</Link></li>
                        <li><Link to="/verify" className="hover:text-white">{t('nav.verify')}</Link></li>
                    </ul>
                </div>
                <div className="text-sm">
                    <h3 className="mb-3 font-display text-base text-white">{t('footer.contact')}</h3>
                    <ul className="space-y-2">
                        <li><Link to="/contact" className="hover:text-white">{t('contact.title')}</Link></li>
                        <li><Link to="/about" className="hover:text-white">{t('footer.privacy')}</Link></li>
                        <li><Link to="/about" className="hover:text-white">{t('footer.terms')}</Link></li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-white/10">
                <div className="mx-auto flex max-w-[90rem] flex-col gap-2 px-5 py-6 text-xs sm:flex-row sm:items-center sm:justify-between lg:px-10">
                    <span>Gene Academy / GemIInI Academy — {t('brand.powered')}</span>
                    <span>© {new Date().getFullYear()} Gene Academy. All rights reserved.</span>
                </div>
            </div>
        </footer>
    );
};

const Layout = ({ children }) => {
    const [isGateOpen, setIsGateOpen] = useState(false);
    const { setUser } = useAuth();

    return (
        <div className="flex min-h-screen flex-col">
            <Header onOpenGate={() => setIsGateOpen(true)} />
            <main className="flex-1">{children}</main>
            <Footer />
            <IdGateModal 
                isOpen={isGateOpen} 
                onClose={() => setIsGateOpen(false)} 
                onHydrateProfile={(m) => { if (setUser) setUser(m); }} 
            />
        </div>
    );
};

export default Layout;
