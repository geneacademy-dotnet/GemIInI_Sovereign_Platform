import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Layout from '@/components/site/Layout';
import { PageHeader, Section } from '@/components/site/Bits';
import { useLang } from '@/i18n/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import pb from '@/lib/pocketbaseClient';
import ProfileHeaderCard from '@/components/ProfileHeaderCard';
import TelemetryGrid from '@/components/TelemetryGrid';
import LeaderboardWidget from '@/components/LeaderboardWidget';
import MtcSimulationRunner from '@/components/MtcSimulationRunner';

const inputClass = 'min-h-[44px] w-full rounded-xl border border-slate-800 bg-slate-900 px-4 text-sm text-slate-100 outline-none focus:border-[#00F2FE]';

const ProfilePage = () => {
  const { t, lang, isRtl } = useLang();
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
      if (user?.id && pb.authStore.isValid) {
        await pb.collection('users').update(user.id, form);
      }
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>{isRtl ? 'Ø§Ù„Ù…Ù„Ù Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠ | Ù…Ù†ØµØ© GemIInI' : 'My Sovereign Profile | GemIInI'}</title>
        <meta name="description" content="Manage your Gene Academy & GemIInI member profile, clinical standing and verification details." />
      </Helmet>
      <PageHeader
        title={isRtl ? 'Ø§Ù„Ù…Ù„Ù Ø§Ù„Ø´Ø®ØµÙŠ ÙˆØ§Ù„Ø³Ø¬Ù„ Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠ' : t('nav.profile')}
        subtitle={user?.email || 'Sovereign Credential Ledger'}
      />
      <Section rail="max-w-[64rem]">
        <ProfileHeaderCard
          member={{
            id: user?.ga_id || user?.id || 'GA-3521',
            name: user?.full_name || 'Dr. Elshareef Osman',
            role: user?.member_role || 'Medical Fellow',
            univ: user?.university || 'University of Khartoum',
            gp: user?.gp_points || 750,
            verified: user?.verified !== undefined ? user?.verified : true,
          }}
        />

        <TelemetryGrid
          ccr={Number(user?.ccr) || 75}
          accuracy={Number(user?.accuracy) || 92.5}
          streak={Number(user?.streak) || 12}
        />

        {/* Live Simulation Engine */}
        <div className="mb-8 mt-4">
          <MtcSimulationRunner candidateGaId={user?.ga_id || 'GA-3521'} />
        </div>

        {/* Live Leaderboard */}
        <div className="mb-8 mt-2">
          <LeaderboardWidget currentMemberGaId={user?.ga_id || 'GA-3521'} />
        </div>

        {/* Member Profile Form */}
        <div className="rounded-2xl border border-slate-800 bg-[#04080F] p-6 sm:p-8 mt-6" dir={isRtl ? 'rtl' : 'ltr'}>
          <h3 className="text-lg font-bold text-white mb-4">
            {isRtl ? 'ØªØ­Ø¯ÙŠØ« Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø­Ø³Ø§Ø¨ ÙˆØ§Ù„Ù…Ø¤Ø³Ø³Ø©' : 'Account & Faculty Details'}
          </h3>
          <form onSubmit={save} className="space-y-5">
            <label className="block text-sm font-medium text-slate-300">
              {t('register.name')}
              <input
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className={`mt-2 ${inputClass}`}
                placeholder="Dr. Candidate Name"
              />
            </label>
            <label className="block text-sm font-medium text-slate-300">
              {t('register.university')}
              <input
                value={form.university}
                onChange={(e) => setForm({ ...form, university: e.target.value })}
                className={`mt-2 ${inputClass}`}
                placeholder="University of Khartoum"
              />
            </label>
            <label className="block text-sm font-medium text-slate-300">
              {lang === 'ar' ? 'Ø§Ù„Ù‡Ø§ØªÙ (Ù…Ù‚Ù†Ù‘Ø¹)' : 'Phone (masked)'}
              <input
                value={form.phone_masked}
                onChange={(e) => setForm({ ...form, phone_masked: e.target.value })}
                className={`mt-2 ${inputClass}`}
                placeholder="+249 9** *** 118"
              />
            </label>
            {status === 'error' && <p className="text-sm text-rose-400">{t('common.error')}</p>}
            {status === 'done' && <p className="text-sm text-emerald-400">{lang === 'ar' ? 'ØªÙ… Ø§Ù„Ø­ÙØ¸ Ø¨Ù†Ø¬Ø§Ø­.' : 'Saved successfully.'}</p>}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="min-h-[48px] rounded-xl bg-[#00F2FE] hover:bg-[#00D2DE] px-7 text-sm font-bold text-slate-950 transition-transform active:scale-[0.98] disabled:opacity-60"
            >
              {status === 'loading' ? t('common.loading') : lang === 'ar' ? 'Ø­ÙØ¸ Ø§Ù„ØªØ¹Ø¯ÙŠÙ„Ø§Øª' : 'Save changes'}
            </button>
          </form>
        </div>
      </Section>
    </Layout>
  );
};

export default ProfilePage;
