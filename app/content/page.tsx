'use client';
import { useEffect, useState } from 'react';
import { FileText, Clock } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  stage: string;
  platform: string;
  assignee: string;
  createdAt: string;
}

const STAGES = ['Ideas', 'Scripting', 'Thumbnail', 'Filming', 'Editing', 'Published'] as const;

const STAGE_STYLES: Record<string, { border: string; header: string; dot: string }> = {
  Ideas:     { border: 'border-[#333]',        header: 'text-[#888]',     dot: 'bg-[#555]' },
  Scripting: { border: 'border-yellow-500/30', header: 'text-yellow-400', dot: 'bg-yellow-500' },
  Thumbnail: { border: 'border-blue-500/30',   header: 'text-blue-400',   dot: 'bg-blue-500' },
  Filming:   { border: 'border-orange-500/30', header: 'text-orange-400', dot: 'bg-orange-500' },
  Editing:   { border: 'border-pink-500/30',   header: 'text-pink-400',   dot: 'bg-pink-500' },
  Published: { border: 'border-green-500/30',  header: 'text-green-400',  dot: 'bg-green-500' },
};

const PLATFORM_STYLES: Record<string, string> = {
  YouTube: 'bg-red-500/20 text-red-400',
  Twitter: 'bg-sky-500/20 text-sky-400',
  LinkedIn:'bg-blue-500/20 text-blue-400',
  TikTok:  'bg-pink-500/20 text-pink-400',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ContentPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content').then(r => r.json()).then(d => {
      setItems(d.content || []);
      setLoading(false);
    });
  }, []);

  const byStage = (stage: string) => items.filter(i => i.stage === stage);
  const published = items.filter(i => i.stage === 'Published').length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#222] flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText size={20} className="text-purple-400" />
            <h1 className="text-lg font-semibold">Content Pipeline</h1>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <div className="text-xl font-bold text-white">{items.length}</div>
              <div className="text-xs text-[#555]">Total</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-400">{published}</div>
              <div className="text-xs text-[#555]">Published</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-yellow-400">{items.length - published}</div>
              <div className="text-xs text-[#555]">In Pipeline</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Board */}
      <div className="flex-1 overflow-x-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-40 text-[#555]">Loading content...</div>
        ) : (
          <div className="flex gap-4 h-full min-w-max">
            {STAGES.map((stage) => {
              const style = STAGE_STYLES[stage];
              const stageItems = byStage(stage);
              return (
                <div key={stage} className={`w-60 flex flex-col bg-[#0d0d0d] rounded-lg border ${style.border}`}>
                  {/* Header */}
                  <div className="flex items-center gap-2 px-3 py-3 border-b border-[#1a1a1a]">
                    <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                    <span className={`text-xs font-semibold uppercase tracking-wider ${style.header}`}>{stage}</span>
                    <span className="ml-auto text-xs text-[#555] bg-[#1a1a1a] px-1.5 py-0.5 rounded">{stageItems.length}</span>
                  </div>
                  {/* Cards */}
                  <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {stageItems.length === 0 ? (
                      <div className="flex items-center justify-center h-20 text-xs text-[#444]">Empty</div>
                    ) : (
                      stageItems.map((item) => (
                        <div key={item.id} className="bg-[#111] border border-[#1e1e1e] hover:border-[#333] rounded-lg p-3 transition-colors cursor-pointer">
                          <div className="text-sm font-medium text-white mb-1 leading-tight">{item.title}</div>
                          <div className="text-xs text-[#555] mb-3 leading-relaxed">{item.description}</div>
                          <div className="flex items-center justify-between">
                            <span className={`text-xs px-1.5 py-0.5 rounded ${PLATFORM_STYLES[item.platform] || 'bg-[#222] text-[#888]'}`}>
                              {item.platform}
                            </span>
                            <span className={`text-xs px-1.5 py-0.5 rounded ${
                              item.assignee === 'AI' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                            }`}>
                              {item.assignee}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mt-2 text-xs text-[#444]">
                            <Clock size={10} />
                            {formatDate(item.createdAt)}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
