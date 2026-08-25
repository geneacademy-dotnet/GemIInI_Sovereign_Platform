import React, { useState } from 'react';
import { useLang } from '@/i18n/LanguageContext';
import { Link } from 'react-router-dom';
import mediaData from '@/data/media-vault-manifest.json';
import { 
  Play, 
  Film, 
  Video, 
  Image as ImageIcon, 
  FileText, 
  Sparkles, 
  Layers, 
  Maximize2, 
  X, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Tv
} from 'lucide-react';

export default function MotionPictureReel() {
  const { lang, isRtl: isRTL } = useLang();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState(null);

  const featuredReels = mediaData.featured_reels || [];
  const stats = mediaData.categories || { images: 627, videos: 162, pdfs: 642 };
  const totalItems = mediaData.total_indexed || 1431;

  const filteredReels = activeTab === 'all' 
    ? featuredReels 
    : featuredReels.filter(r => r.pillar === activeTab || r.tags.some(t => t.toLowerCase().includes(activeTab.toLowerCase())));

  const getPillarBadge = (pillar) => {
    switch (pillar) {
      case 'gemiini':
        return {
          label: 'GemIInI Academy',
          bg: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
          glow: 'from-teal-500/20'
        };
      case 'geneacademy':
        return {
          label: 'GeneAcademy®',
          bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
          glow: 'from-purple-500/20'
        };
      case 'glomet':
        return {
          label: 'GLOMEt HQ',
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          glow: 'from-amber-500/20'
        };
      default:
        return {
          label: 'Sovereign Vault',
          bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
          glow: 'from-blue-500/20'
        };
    }
  };

  return (
    <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Background Glow Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-teal-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Title & Live Vault Telemetry */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-teal-500/30 bg-teal-950/40 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-[0_0_15px_rgba(20,184,166,0.2)]">
            <Film className="w-3.5 h-3.5 animate-pulse text-teal-300" />
            <span>{isRTL ? 'الأرشيف المرئي والسينمائي للسيادة' : 'Sovereign Cinema & Motion Archive'}</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-5 bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            {isRTL 
              ? 'التوثيق الحي والمشاهد السينمائية' 
              : 'Motion Picture Cinema & Living Documentation'}
          </h2>

          <p className="text-slate-400 text-base md:text-lg leading-relaxed mb-8">
            {isRTL 
              ? 'استكشف البث المرئي، تدريبات المحاكاة الجراحية بالقاهرة، كبسولات الأبحاث الانتقالية، وتجهيزات المنشآت الطبية عبر أرشيفنا المركزي المعتمد.'
              : 'Explore living clinical broadcasts, hands-on surgical simulation in Cairo, oncology research pods, and turnkey healthcare facilities across our verified media vault.'}
          </p>

          {/* Central Vault Statistics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto p-2 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 shadow-2xl">
            <div className="p-3 text-center rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center justify-center gap-1.5 text-xs text-teal-400 font-medium mb-1">
                <Video className="w-3.5 h-3.5" />
                <span>{isRTL ? 'أفلام وفيديوهات' : 'Motion Videos'}</span>
              </div>
              <div className="text-xl font-bold text-white tracking-tight">{stats.videos || 162}+</div>
            </div>

            <div className="p-3 text-center rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center justify-center gap-1.5 text-xs text-purple-400 font-medium mb-1">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>{isRTL ? 'لوحات تشخيصية' : 'Visual Plates'}</span>
              </div>
              <div className="text-xl font-bold text-white tracking-tight">{stats.images || 627}+</div>
            </div>

            <div className="p-3 text-center rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center justify-center gap-1.5 text-xs text-amber-400 font-medium mb-1">
                <FileText className="w-3.5 h-3.5" />
                <span>{isRTL ? 'أطروحات ووثائق' : 'Manuscripts'}</span>
              </div>
              <div className="text-xl font-bold text-white tracking-tight">{stats.pdfs || 642}+</div>
            </div>

            <div className="p-3 text-center rounded-xl bg-gradient-to-br from-teal-950/40 to-slate-950/80 border border-teal-500/30">
              <div className="flex items-center justify-center gap-1.5 text-xs text-teal-300 font-medium mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isRTL ? 'إجمالي الأرشيف' : 'Central Vault'}</span>
              </div>
              <div className="text-xl font-bold text-teal-300 tracking-tight">{totalItems.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {[
            { id: 'all', label: isRTL ? 'جميع الأفلام الوثائقية' : 'All Featured Reels', icon: Film },
            { id: 'gemiini', label: 'GemIInI Academy', icon: Sparkles },
            { id: 'geneacademy', label: 'GeneAcademy®', icon: Layers },
            { id: 'glomet', label: 'GLOMEt HQ', icon: Tv },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-teal-500 text-slate-950 shadow-[0_0_20px_rgba(20,184,166,0.4)] font-semibold'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Moving Motion Picture Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReels.map((reel) => {
            const pillarInfo = getPillarBadge(reel.pillar);
            return (
              <div
                key={reel.id}
                onClick={() => setSelectedVideo(reel)}
                className="group relative bg-slate-900/70 border border-slate-800/90 hover:border-teal-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(20,184,166,0.2)] hover:-translate-y-1.5 cursor-pointer flex flex-col"
              >
                {/* Visual Viewport Frame (Filmstrip Header) */}
                <div className="relative aspect-video bg-slate-950 overflow-hidden flex items-center justify-center border-b border-slate-800">
                  {/* Subtle Background Pattern */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/40 via-slate-950 to-slate-950" />

                  {/* Filmstrip Perforations Simulation */}
                  <div className="absolute top-0 inset-x-0 h-3 bg-slate-950 flex justify-between px-2 items-center opacity-60">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 bg-slate-700 rounded-sm" />
                    ))}
                  </div>

                  {/* Play Button Action Overlay */}
                  <div className="relative z-10 w-16 h-16 rounded-full bg-teal-500/90 text-slate-950 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:bg-teal-400">
                    <Play className="w-7 h-7 fill-current ml-0.5" />
                  </div>

                  {/* Motion Quality & Duration Badges */}
                  <div className="absolute top-5 right-3 z-10 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900/90 text-teal-400 border border-teal-500/30 backdrop-blur-sm">
                      {reel.quality || '1080p HD'}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-950/90 text-slate-300 border border-slate-800 backdrop-blur-sm flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {reel.duration}
                    </span>
                  </div>

                  {/* Pillar Chip */}
                  <div className="absolute bottom-3 left-3 z-10">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border backdrop-blur-sm ${pillarInfo.bg}`}>
                      {pillarInfo.label}
                    </span>
                  </div>
                </div>

                {/* Card Information Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors duration-200 mb-2 leading-snug">
                      {isRTL ? reel.title_ar : reel.title}
                    </h3>
                    <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed mb-4">
                      {isRTL ? reel.description_ar : reel.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {reel.tags.slice(0, 2).map((tag, idx) => (
                        <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-400">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <span className="text-xs font-medium text-teal-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      <span>{isRTL ? 'مشاهدة العرض' : 'Watch Reel'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Central Vault CTA */}
        <div className="mt-14 text-center">
          <Link
            to="/media"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-bold text-base shadow-[0_0_25px_rgba(20,184,166,0.35)] transition-all duration-300 hover:scale-105"
          >
            <Film className="w-5 h-5" />
            <span>{isRTL ? 'تصفح الأرشيف الكامل (1,431 وسيط معتمد)' : 'Enter Sovereign Media Vault (1,431 Items)'}</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

      </div>

      {/* Interactive Cinematic Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
                  <Film className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {isRTL ? selectedVideo.title_ar : selectedVideo.title}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {selectedVideo.source_file} • {selectedVideo.duration} • {selectedVideo.quality}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedVideo(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cinematic Viewport Display */}
            <div className="relative aspect-video bg-black flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-400 flex items-center justify-center mb-4 animate-pulse">
                <Film className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {isRTL ? selectedVideo.title_ar : selectedVideo.title}
              </h3>
              <p className="text-slate-400 text-sm max-w-md mb-6">
                {isRTL ? selectedVideo.description_ar : selectedVideo.description}
              </p>

              {/* Status Banner */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-teal-500/30 text-teal-300 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>{isRTL ? 'الملف مؤرشف ومتاح في الخزينة المركزية' : 'Secured & Indexed in Sovereign Media Vault'}</span>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-slate-950 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">
                  Vault ID: {selectedVideo.id} | Size: {(selectedVideo.size_kb / 1024).toFixed(1)} MB
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to="/media"
                  onClick={() => setSelectedVideo(null)}
                  className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all"
                >
                  {isRTL ? 'فتح في الخزينة' : 'Browse in Vault'}
                </Link>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all"
                >
                  {isRTL ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
