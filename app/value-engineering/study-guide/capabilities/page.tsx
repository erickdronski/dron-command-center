'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, ChevronDown, ChevronUp, MessageSquare, HelpCircle, BookOpen, Lightbulb } from 'lucide-react';
import { capabilities, domainConfig, type Domain, type CapabilityCard } from '../../capability-cards/data';

const domainOrder: Domain[] = ['esm', 'endpoint', 'exposure', 'foundations'];

function StudyCard({ cap }: { cap: CapabilityCard }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'script' | 'starters' | 'discovery' | 'consider'>('script');
  const cfg = domainConfig[cap.domain];

  return (
    <div className="border border-[#222] rounded-lg bg-[#111] overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#161616] transition-colors text-left">
        <div className="flex items-center gap-3 min-w-0">
          <span className={`text-xs px-2 py-0.5 rounded-full ${cfg.bgColor} ${cfg.color} font-medium shrink-0`}>{cfg.label.split(' ')[0]}</span>
          <span className="text-white text-sm font-medium truncate">{cap.name}</span>
        </div>
        {open ? <ChevronUp size={16} className="text-[#555] shrink-0" /> : <ChevronDown size={16} className="text-[#555] shrink-0" />}
      </button>

      {open && (
        <div className="border-t border-[#222] px-4 py-4">
          <p className="text-[#777] text-sm mb-4">{cap.description}</p>

          <div className="flex gap-1 mb-4 flex-wrap">
            {[
              { key: 'script' as const, label: 'Workshop Script', icon: <BookOpen size={12} /> },
              { key: 'starters' as const, label: 'Conversation Starters', icon: <MessageSquare size={12} /> },
              { key: 'discovery' as const, label: 'Discovery Questions', icon: <HelpCircle size={12} /> },
              { key: 'consider' as const, label: 'Assessment Checklist', icon: <Lightbulb size={12} /> },
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-colors ${
                  tab === t.key ? 'bg-[#222] text-white' : 'text-[#555] hover:text-[#888] hover:bg-[#1a1a1a]'
                }`}>{t.icon}{t.label}</button>
            ))}
          </div>

          {tab === 'script' && (
            <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-4">
              <div className="text-emerald-400 text-xs font-semibold mb-2 uppercase tracking-wider">📖 How to Open This Topic in a Workshop</div>
              <p className="text-[#ccc] text-sm leading-relaxed italic">&ldquo;{cap.workshopScript}&rdquo;</p>
            </div>
          )}

          {tab === 'starters' && (
            <ul className="space-y-2">
              {cap.conversationStarters.map((s, i) => (
                <li key={i} className="flex items-start gap-2 bg-[#0a0a0a] border border-[#222] rounded-lg p-3">
                  <MessageSquare size={14} className="text-blue-400 mt-0.5 shrink-0" />
                  <span className="text-[#ccc] text-sm">&ldquo;{s}&rdquo;</span>
                </li>
              ))}
            </ul>
          )}

          {tab === 'discovery' && (
            <ul className="space-y-2">
              {cap.discoveryQuestions.map((q, i) => (
                <li key={i} className="flex items-start gap-2 bg-[#0a0a0a] border border-[#222] rounded-lg p-3">
                  <HelpCircle size={14} className="text-amber-400 mt-0.5 shrink-0" />
                  <span className="text-[#ccc] text-sm">{q}</span>
                </li>
              ))}
            </ul>
          )}

          {tab === 'consider' && (
            <div>
              <p className="text-[#555] text-xs mb-3">Use these as a live assessment during the workshop — go through each one and ask the customer to answer Yes or No:</p>
              <ul className="space-y-2">
                {cap.thingsToConsider.map((q, i) => (
                  <li key={i} className="flex items-start gap-3 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-3">
                    <div className="flex gap-1 shrink-0 mt-0.5">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">Y</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">N</span>
                    </div>
                    <span className="text-[#ccc] text-sm">{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CapabilityStudyGuidePage() {
  const [search, setSearch] = useState('');
  const [filterDomain, setFilterDomain] = useState<Domain | 'all'>('all');

  const filtered = capabilities.filter(c => {
    const matchDomain = filterDomain === 'all' || c.domain === filterDomain;
    const matchSearch = !search.trim() ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.workshopScript.toLowerCase().includes(search.toLowerCase()) ||
      c.conversationStarters.some(s => s.toLowerCase().includes(search.toLowerCase())) ||
      c.discoveryQuestions.some(q => q.toLowerCase().includes(search.toLowerCase()));
    return matchDomain && matchSearch;
  });

  const grouped = domainOrder
    .map(d => ({ domain: d, caps: filtered.filter(c => c.domain === d) }))
    .filter(g => g.caps.length > 0);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Link href="/value-engineering/study-guide" className="inline-flex items-center gap-1.5 text-[#555] hover:text-white text-sm mb-4 transition-colors">
        <ArrowLeft size={14} /> Back to Study Guide
      </Link>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">🎓 Capability Workshop Study Guide</h2>
        <p className="text-[#555] text-sm">
          36 business capabilities — workshop scripts, conversation starters, discovery questions, and assessment checklists. Review before facilitating a capability workshop.
        </p>
      </div>

      <div className="flex items-center gap-4 mb-5 px-4 py-3 bg-[#111] border border-[#222] rounded-lg overflow-x-auto">
        <div className="text-center shrink-0"><div className="text-white font-bold text-lg">{capabilities.length}</div><div className="text-[#555] text-xs">Capabilities</div></div>
        {domainOrder.map(d => {
          const cfg = domainConfig[d];
          const count = capabilities.filter(c => c.domain === d).length;
          return (
            <div key={d} className="flex items-center gap-2 shrink-0">
              <div className="w-px h-8 bg-[#222]" />
              <div className="text-center"><div className={`font-bold text-lg ${cfg.color}`}>{count}</div><div className="text-[#555] text-xs">{cfg.label.split(' ')[0]}</div></div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-3 mb-6 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
          <input type="text" placeholder="Search capabilities, questions, scripts..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#111] border border-[#222] rounded-lg text-white text-sm placeholder:text-[#444] focus:outline-none focus:border-[#333]" />
        </div>
        <div className="flex gap-1 flex-wrap">
          <button onClick={() => setFilterDomain('all')}
            className={`px-3 py-2 text-xs rounded-lg transition-colors ${filterDomain === 'all' ? 'bg-[#222] text-white' : 'text-[#555] hover:text-[#888] hover:bg-[#111]'}`}>All</button>
          {domainOrder.map(d => {
            const cfg = domainConfig[d];
            return (
              <button key={d} onClick={() => setFilterDomain(d)}
                className={`px-3 py-2 text-xs rounded-lg transition-colors ${
                  filterDomain === d ? `${cfg.bgColor} ${cfg.color}` : 'text-[#555] hover:text-[#888] hover:bg-[#111]'
                }`}>{cfg.label.split(' ')[0]}</button>
            );
          })}
        </div>
      </div>

      <div className="space-y-6">
        {grouped.map(g => {
          const cfg = domainConfig[g.domain];
          return (
            <div key={g.domain}>
              <div className="flex items-center gap-2 mb-3">
                <h3 className={`text-sm font-semibold ${cfg.color}`}>{cfg.label}</h3>
                <span className="text-[#444] text-xs">({g.caps.length})</span>
              </div>
              <div className="space-y-2">
                {g.caps.map(c => <StudyCard key={c.id} cap={c} />)}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && <div className="text-center py-12 text-[#555]">No capabilities match your search.</div>}
    </div>
  );
}
