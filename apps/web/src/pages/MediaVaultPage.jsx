import React, { useState, useMemo } from 'react';
import { useLang } from '@/i18n/LanguageContext';
import { Link } from 'react-router-dom';
import mediaData from '@/data/media-vault-manifest.json';
import { 
  Film, 
  Video, 
  Image as ImageIcon, 
  FileText, 
  Search, 
  Filter, 
  Layers, 
  Sparkles, 
  Play, 
  Clock, 
  ShieldCheck, 
  FolderArchive, 
  ExternalLink, 
  Download, 
  X, 
  CheckCircle2, 
  Tv,
  Eye,
  ChevronRight
} from 'lucide-react';

export default function MediaVaultPage() {
  const { lang, isRtl: isRTL } = useLang();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const stats = mediaData.categories || { images: 627, videos: 162, pdfs: 642 };
  const totalIndexed = mediaData.total_indexed || 1431;
  const featuredReels = mediaData.featured_reels || [];
  const rawItems = mediaData.items || [];

  // Filter items based on category and search query
  const filteredItems = useMemo(() => {
    return rawItems.filter(item => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchSearch = !searchQuery || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.original_path && item.original_path.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [rawItems, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4">
      {/* Background Lighting */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-teal-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-8">
          <Link to="/" className="hover:text-teal-400 transition-colors">
            {isRTL ? 'الرئيسية' : 'Home'}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-teal-400">{isRTL ? 'خزينة الوسائط والأفلام' : 'Sovereign Media Vault'}</span>
        </div>

        {/* Page Hero Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-teal-500/30 bg-teal-950/40 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-[0_0_20px_rgba(20,184,166,0.2)]">
            <Film className="w-4 h-4 animate-pulse" />
            <span>{isRTL ? 'الخزينة المركزية المعتمدة للوسائط' : 'Central Sovereign Media Vault'}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
            {isRTL ? 'الأرشيف المرئي والسينمائي للسيادة' : 'Sovereign Motion Picture & Media Archive'}
          </h1>

          <p className="text-slate-400 text-base md:text-xl leading-relaxed max-w-3xl mx-auto mb-10">
            {isRTL 
              ? 'المستودع الرقمي المركزي الموحد لجميع تسجيلات البث المرئي، تدريبات المحاكاة الجراحية، لوحات التشخيص الجزيئي، والأطروحات الأكاديمية الموثقة.'
              : 'The unified sovereign digital vault hosting living motion picture broadcasts, hands-on surgical simulation footage, diagnostic pathology plates, and verified academic theses.'}
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-teal-400 font-semibold mb-1">
                <Video className="w-4 h-4" />
                <span>{isRTL ? 'أفلام وفيديوهات' : 'Motion Videos'}</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.videos || 162}+</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-purple-400 font-semibold mb-1">
                <ImageIcon className="w-4 h-4" />
                <span>{isRTL ? 'لوحات تشخيصية' : 'Visual Plates'}</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.images || 627}+</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-amber-400 font-semibold mb-1">
                <FileText className="w-4 h-4" />
                <span>{isRTL ? 'أطروحات ووثائق' : 'Manuscripts'}</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.pdfs || 642}+</div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-950/60 to-slate-900/90 border border-teal-500/40 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-teal-300 font-semibold mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>{isRTL ? 'إجمالي الأرشيف' : 'Vault Total'}</span>
              </div>
              <div className="text-2xl font-bold text-teal-300">{totalIndexed.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Section 1: Featured Cinematic Motion Picture Reels */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
                <Film className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {isRTL ? 'أبرز الأفلام الوثائقية والإنتاج السينمائي' : 'Featured Motion Picture Cinema Reels'}
                </h2>
                <p className="text-xs text-slate-400">
                  {isRTL ? 'عروض مرئية عالية الدقة لبرامج الأكاديمية والعمليات' : 'High-definition video showcases across academy tracks and operations'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredReels.map((reel) => (
              <div
                key={reel.id}
                onClick={() => setSelectedItem({
                  name: reel.source_file,
                  category: 'videos',
                  title: reel.title,
                  title_ar: reel.title_ar,
                  description: reel.description,
                  description_ar: reel.description_ar,
                  duration: reel.duration,
                  quality: reel.quality,
                  size_kb: reel.size_kb,
                  tags: reel.tags
                })}
                className="group relative bg-slate-900/70 border border-slate-800 hover:border-teal-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(20,184,166,0.2)] hover:-translate-y-1.5 cursor-pointer flex flex-col"
              >
                <div className="relative aspect-video bg-slate-950 overflow-hidden flex items-center justify-center border-b border-slate-800">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/40 via-slate-950 to-slate-950" />
                  
                  {/* Filmstrip Frame */}
                  <div className="absolute top-0 inset-x-0 h-3 bg-slate-950 flex justify-between px-2 items-center opacity-60">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 bg-slate-700 rounded-sm" />
                    ))}
                  </div>

                  <div className="relative z-10 w-16 h-16 rounded-full bg-teal-500/90 text-slate-950 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <Play className="w-7 h-7 fill-current ml-0.5" />
                  </div>

                  <div className="absolute top-5 right-3 z-10 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900/90 text-teal-400 border border-teal-500/30">
                      {reel.quality || '1080p HD'}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-950/90 text-slate-300 border border-slate-800 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {reel.duration}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors duration-200 mb-2">
                      {isRTL ? reel.title_ar : reel.title}
                    </h3>
                    <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed mb-4">
                      {isRTL ? reel.description_ar : reel.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-500">
                      {(reel.size_kb / 1024).toFixed(1)} MB
                    </span>
                    <span className="text-xs font-semibold text-teal-400 flex items-center gap-1">
                      <span>{isRTL ? 'تشغيل العرض' : 'Play Reel'}</span>
                      <Play className="w-3 h-3 fill-current" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Complete Vault Explorer & Search */}
        <div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                <FolderArchive className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {isRTL ? 'مستعرض الأرشيف الكامل' : 'Complete Vault Archive Explorer'}
                </h2>
                <p className="text-xs text-slate-400">
                  {isRTL ? `عرض ${filteredItems.length} عنصر متطابق` : `Displaying ${filteredItems.length} matching vault items`}
                </p>
              </div>
            </div>

            {/* Search Input Bar */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={isRTL ? 'بحث بالاسم أو المسار...' : 'Search by name or file path...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-teal-500 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {[
              { id: 'all', label: isRTL ? 'جميع الوسائط' : 'All Vault Items', icon: Layers, count: totalIndexed },
              { id: 'videos', label: isRTL ? 'تسجيلات وفيديوهات' : 'Motion Videos', icon: Video, count: stats.videos },
              { id: 'images', label: isRTL ? 'لوحات تشخيصية وصور' : 'Diagnostic Visuals', icon: ImageIcon, count: stats.images },
              { id: 'pdfs', label: isRTL ? 'أطروحات ووثائق' : 'PDFs & Manuscripts', icon: FileText, count: stats.pdfs },
            ].map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-teal-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(20,184,166,0.3)]'
                      : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] ${isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Vault Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map((item, idx) => {
              const isVideo = item.category === 'videos';
              const isImage = item.category === 'images';
              const isPdf = item.category === 'pdfs';

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedItem(item)}
                  className="group bg-slate-900/80 hover:bg-slate-900 border border-slate-800/90 hover:border-teal-500/40 rounded-xl p-4 transition-all duration-200 hover:-translate-y-1 cursor-pointer flex flex-col justify-between shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isVideo ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30' :
                        isImage ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {isVideo && <Video className="w-4 h-4" />}
                        {isImage && <ImageIcon className="w-4 h-4" />}
                        {isPdf && <FileText className="w-4 h-4" />}
                      </div>

                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                        {item.category}
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-white group-hover:text-teal-300 transition-colors line-clamp-2 mb-2 leading-snug break-words">
                      {item.name}
                    </h4>

                    {item.original_path && (
                      <p className="text-[11px] font-mono text-slate-500 line-clamp-1 mb-3">
                        {item.original_path}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>
                      {item.size_kb ? `${(item.size_kb > 1024 ? (item.size_kb/1024).toFixed(1) + ' MB' : item.size_kb.toFixed(0) + ' KB')}` : 'Verified'}
                    </span>
                    <span className="text-teal-400 group-hover:underline flex items-center gap-1 text-[11px]">
                      <span>{isRTL ? 'معاينة' : 'Inspect'}</span>
                      <Eye className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="py-20 text-center rounded-2xl bg-slate-900/50 border border-slate-800">
              <Search className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">
                {isRTL ? 'لم يتم العثور على وسائط مطابقة' : 'No Matching Vault Media Found'}
              </h3>
              <p className="text-slate-400 text-xs">
                {isRTL ? 'يرجى تجربة كلمات بحث أخرى أو تغيير الفئة.' : 'Try adjusting your search terms or category filter.'}
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Interactive Item Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
                  {selectedItem.category === 'videos' ? <Film className="w-5 h-5" /> :
                   selectedItem.category === 'images' ? <ImageIcon className="w-5 h-5" /> :
                   <FileText className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white break-words">
                    {selectedItem.title || selectedItem.name}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">
                    Category: {selectedItem.category} • Size: {selectedItem.size_kb ? `${(selectedItem.size_kb > 1024 ? (selectedItem.size_kb/1024).toFixed(1) + ' MB' : selectedItem.size_kb.toFixed(0) + ' KB')}` : 'Indexed'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 text-center bg-black/60 flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center mb-4">
                {selectedItem.category === 'videos' ? <Video className="w-10 h-10" /> :
                 selectedItem.category === 'images' ? <ImageIcon className="w-10 h-10" /> :
                 <FileText className="w-10 h-10" />}
              </div>

              <h3 className="text-lg font-bold text-white mb-2 max-w-lg break-words">
                {selectedItem.title || selectedItem.name}
              </h3>

              {selectedItem.description && (
                <p className="text-slate-400 text-xs max-w-md mb-4">
                  {isRTL ? selectedItem.description_ar : selectedItem.description}
                </p>
              )}

              {selectedItem.original_path && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 max-w-xl break-all mb-4 text-left">
                  {selectedItem.original_path}
                </div>
              )}

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-950/40 border border-teal-500/30 text-teal-300 text-xs font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                <span>Verified Sovereign Vault Artifact</span>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                {isRTL ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
