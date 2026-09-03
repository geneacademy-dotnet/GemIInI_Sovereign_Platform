import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Heart, Megaphone, MessageSquare, Share2 } from 'lucide-react';
import Layout from '@/components/site/Layout';
import { DemoBadge, PageHeader, Section, StateBlock } from '@/components/site/Bits';
import { useLang } from '@/i18n/LanguageContext';

import { communities } from '@/data/demo';

const CommunitiesPage = () => {
    const { t, lang } = useLang();
    const [activeId, setActiveId] = useState(communities[0].id);
    const [reactions, setReactions] = useState({});
    const [openComments, setOpenComments] = useState({});

    const active = communities.find((c) => c.id === activeId);

    return (
        <Layout>
            <Helmet>
                <title>Communities | Gene Academy member channels</title>
                <meta name="description" content="Gene Academy member communities by country, career and institution â€” announcements, posts, reactions and nested discussion." />
            </Helmet>
            <PageHeader title={t('comm.title')} subtitle={t('comm.sub')} />
            <Section rail="max-w-[90rem]" action={<DemoBadge />}>
                <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
                    <aside>
                        <h2 className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">{t('comm.channels')}</h2>
                        <ul className="space-y-2">
                            {communities.map((channel) => (
                                <li key={channel.id}>
                                    <button
                                        type="button"
                                        onClick={() => setActiveId(channel.id)}
                                        className={`flex min-h-[52px] w-full items-center justify-between gap-3 rounded-xl border px-4 text-start text-sm transition-colors ${
                                            channel.id === activeId ? 'border-transparent bg-primary text-primary-foreground' : 'border-border hover:bg-secondary'
                                        }`}
                                    >
                                        <span>
                                            <span className="block font-medium">{lang === 'ar' ? channel.nameAr : channel.name}</span>
                                            <span className="text-xs opacity-70">{channel.kind} Â· {channel.members} members</span>
                                        </span>
                                        {channel.unread > 0 && (
                                            <span className="rounded-full bg-[hsl(var(--accent))] px-2 py-0.5 text-[11px] font-medium text-[hsl(var(--accent-foreground))]">
                                                {channel.unread} {t('comm.unread')}
                                            </span>
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </aside>

                    <div className="space-y-5">
                        {!active || active.posts.length === 0 ? (
                            <StateBlock message={lang === 'ar' ? 'Ù„Ø§ ØªÙˆØ¬Ø¯ Ù…Ù†Ø´ÙˆØ±Ø§Øª Ø¨Ø¹Ø¯.' : 'No posts in this channel yet.'} />
                        ) : (
                            active.posts.map((post) => {
                                const liked = reactions[post.id];
                                const open = openComments[post.id];
                                return (
                                    <article key={post.id} className="rounded-2xl border border-border bg-card p-6">
                                        {post.announcement && (
                                            <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[hsl(var(--accent))]/15 px-3 py-1 text-xs font-medium text-[hsl(38_68%_32%)]">
                                                <Megaphone className="h-3.5 w-3.5" strokeWidth={2} /> {t('comm.announcement')}
                                            </p>
                                        )}
                                        <div className="flex items-baseline gap-3">
                                            <h3 className="font-medium">{post.author}</h3>
                                            <span className="text-xs text-muted-foreground">{post.time}</span>
                                        </div>
                                        <p className="mt-3 text-sm leading-relaxed">{lang === 'ar' ? post.bodyAr : post.body}</p>

                                        <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                            <button
                                                type="button"
                                                onClick={() => setReactions((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                                                className="inline-flex min-h-[40px] items-center gap-2 transition-transform active:scale-[0.98]"
                                            >
                                                <Heart className={`h-4 w-4 ${liked ? 'fill-current text-destructive' : ''}`} strokeWidth={1.8} />
                                                {post.reactions + (liked ? 1 : 0)}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setOpenComments((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                                                className="inline-flex min-h-[40px] items-center gap-2"
                                            >
                                                <MessageSquare className="h-4 w-4" strokeWidth={1.8} />
                                                {post.comments.length} {t('comm.comments')}
                                            </button>
                                            <button type="button" className="inline-flex min-h-[40px] items-center gap-2">
                                                <Share2 className="h-4 w-4" strokeWidth={1.8} /> {t('comm.share')}
                                            </button>
                                        </div>

                                        {open && (
                                            <div className="mt-5 space-y-4 border-t border-border pt-5">
                                                {post.comments.length === 0 ? (
                                                    <p className="text-sm text-muted-foreground">{lang === 'ar' ? 'Ù„Ø§ ØªÙˆØ¬Ø¯ ØªØ¹Ù„ÙŠÙ‚Ø§Øª.' : 'No comments yet.'}</p>
                                                ) : (
                                                    post.comments.map((comment) => (
                                                        <div key={comment.id} className="text-sm">
                                                            <p className="font-medium">{comment.author}</p>
                                                            <p className="mt-1 text-muted-foreground">{comment.body}</p>
                                                            {comment.replies?.map((reply) => (
                                                                <div key={reply.id} className="mt-3 border-s-2 border-border ps-4">
                                                                    <p className="font-medium">{reply.author}</p>
                                                                    <p className="mt-1 text-muted-foreground">{reply.body}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </article>
                                );
                            })
                        )}
                    </div>
                </div>
            </Section>
        </Layout>
    );
};

export default CommunitiesPage;
