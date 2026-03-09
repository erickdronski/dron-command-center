'use client';

import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, CheckCircle2, Circle, BookOpen, Target, Star, HelpCircle } from 'lucide-react';
import { capabilities, domainConfig, type Domain, type CapabilityCard as CapCard } from './data';

const domainOrder: Domain[] = ['esm', 'endpoint', 'exposure', 'foundations'];

function CapabilityCard({ cap }: { cap: CapCard }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'features' | 'best' | 'kpis' | 'consider'>('features');
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
              { key: 'features' as const, label: 'Features', icon: <Star size={12} /> },
              { key: 'kpis' as const, label: 'KPIs', icon: <Target size={12} /> },
              { key: 'best' as const, label: 'Best Practices', icon: <BookOpen size={12} /> },
              { key: 'consider' as const, label: 'Things to Consider', icon: <HelpCircle size={12} /> },
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-colors ${
                  tab === t.key ? 'bg-[#222] text-white' : 'text-[#555] hover:text-[#888] hover:bg-[#1a1a1a]'
                }`}>{t.icon}{t.label}</button>
            ))}
          </div>

          {tab === 'features' && (
            <div className="grid grid-cols-2 gap-2">
              {cap.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg">
                  <CheckCircle2 size={12} className="text-green-400 shrink-0" />
                  <span className="text-[#ccc] text-xs">{f}</span>
                </div>
              ))}
            </div>
          )}

          {tab === 'kpis' && (
            <div className="grid grid-cols-2 gap-2">
              {cap.kpis.map((k, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg">
                  <Target size={12} className="text-blue-400 shrink-0" />
                  <span className="text-[#ccc] text-xs">{k}</span>
                </div>
              ))}
            </div>
          )}

          {tab === 'best' && (
            <ul className="space-y-2">
              {cap.bestPractices.map((bp, i) => (
                <li key={i} className="flex items-start gap-2 px-3 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg">
                  <span className="text-emerald-400 mt-0.5 shrink-0">→</span>
                  <span className="text-[#ccc] text-xs leading-relaxed">{bp}</span>
                </li>
              ))}
            </ul>
          )}

          {tab === 'consider' && (
            <ul className="space-y-2">
              {cap.thingsToConsider.map((q, i) => (
                <li key={i} className="flex items-start gap-2 px-3 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg">
                  <Circle size={12} className="text-amber-400 mt-0.5 shrink-0" />
                  <span className="text-[#ccc] text-xs">{q}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default function CapabilityCardsPage() {
  const [search, setSearch] = useState('');
  const [filterDomain, setFilterDomain] = useState<Domain | 'all'>('all');

  const filtered = capabilities.filter(c => {
    const matchDomain = filterDomain === 'all' || c.domain === filterDomain;
    const matchSearch = !search.trim() ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    return matchDomain && matchSearch;
  });

  const grouped = domainOrder
    .map(d => ({ domain: d, caps: filtered.filter(c => c.domain === d) }))
    .filter(g => g.caps.length > 0);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">📋 Business Capability Cards</h2>
        <p className="text-[#555] text-sm">36 IT-focused business capabilities from the Ivanti Business Capability Toolkit v2.0. Vendor agnostic reference for assessments and workshops.</p>
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
          <input type="text" placeholder="Search capabilities..." value={search}
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
                {g.caps.map(c => <CapabilityCard key={c.id} cap={c} />)}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && <div className="text-center py-12 text-[#555]">No capabilities match your search.</div>}
    </div>
  );
}
