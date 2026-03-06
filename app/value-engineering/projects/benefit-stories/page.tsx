'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, ChevronDown, ChevronUp, BookOpen, Calculator, MessageSquare, Lightbulb, Zap, Shield, Settings, Monitor } from 'lucide-react';
import { benefits, type Solution } from './data';

/* ────────────────────────────────────────────
   SOLUTION CONFIG
   ──────────────────────────────────────────── */

type SolutionConfig = {
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
};

const solutionConfig: Record<Solution, SolutionConfig> = {
  itsm: { label: 'ITSM', icon: <Settings size={14} />, color: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/20' },
  esm: { label: 'ESM / LOB', icon: <Zap size={14} />, color: 'text-amber-400', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/20' },
  uem: { label: 'UEM', icon: <Monitor size={14} />, color: 'text-green-400', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/20' },
  security: { label: 'Security', icon: <Shield size={14} />, color: 'text-red-400', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/20' },
  general: { label: 'General', icon: <BookOpen size={14} />, color: 'text-purple-400', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/20' },
};

const solutionOrder: Solution[] = ['itsm', 'esm', 'uem', 'security', 'general'];

/* ────────────────────────────────────────────
   BENEFIT CARD
   ──────────────────────────────────────────── */

function BenefitCard({ benefit }: { benefit: typeof benefits[0] }) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'scenario' | 'track' | 'formula' | 'tips'>('scenario');
  const config = solutionConfig[benefit.solution];

  return (
    <div className="border border-[#222] rounded-lg bg-[#111] overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#161616] transition-colors text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs px-2 py-0.5 rounded-full ${config.bgColor} ${config.color} font-medium`}>
              {config.label}
            </span>
            <span className="text-[#444] text-xs">·</span>
            <span className="text-[#555] text-xs">{benefit.subcategory}</span>
          </div>
          <h4 className="text-white text-sm font-medium">{benefit.benefitName}</h4>
        </div>
        <div className="ml-3 shrink-0">
          {expanded ? <ChevronUp size={16} className="text-[#555]" /> : <ChevronDown size={16} className="text-[#555]" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-[#222] px-4 py-4">
          {/* Description */}
          <p className="text-[#777] text-sm mb-4">{benefit.description}</p>

          {/* Tabs */}
          <div className="flex gap-1 mb-4 flex-wrap">
            {[
              { key: 'scenario' as const, label: 'Scenario', icon: <BookOpen size={12} /> },
              { key: 'track' as const, label: 'Talk Track', icon: <MessageSquare size={12} /> },
              { key: 'formula' as const, label: 'Formula & Metric', icon: <Calculator size={12} /> },
              { key: 'tips' as const, label: 'Tips', icon: <Lightbulb size={12} /> },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-colors ${
                  activeTab === tab.key
                    ? 'bg-[#222] text-white'
                    : 'text-[#555] hover:text-[#888] hover:bg-[#1a1a1a]'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'scenario' && (
            <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-4">
              <p className="text-[#ccc] text-sm leading-relaxed">{benefit.scenario}</p>
            </div>
          )}

          {activeTab === 'track' && (
            <div className="space-y-4">
              <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-4">
                <p className="text-[#ccc] text-sm leading-relaxed italic">{benefit.talkTrack}</p>
              </div>
              <div className="bg-[#0d1117] border border-emerald-500/20 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-emerald-400 text-xs font-semibold">💡 Why It Matters</span>
                </div>
                <p className="text-[#999] text-sm">{benefit.whyItMatters}</p>
              </div>
            </div>
          )}

          {activeTab === 'formula' && (
            <div className="space-y-3">
              <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-4">
                <div className="text-[#555] text-xs font-semibold mb-2 uppercase tracking-wider">Formula</div>
                <p className="text-white text-sm font-mono">{benefit.formula}</p>
              </div>
              <div>
                <div className="text-[#555] text-xs font-semibold mb-2 uppercase tracking-wider">Factors</div>
                <ul className="space-y-1">
                  {benefit.formulaFactors.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-blue-400 mt-0.5">→</span>
                      <span className="text-[#999]">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-[#0d1117] border border-emerald-500/20 rounded-lg p-3">
                <div className="text-emerald-400 text-xs font-semibold mb-1">📊 Example</div>
                <p className="text-[#ccc] text-sm">{benefit.exampleMetric}</p>
              </div>
            </div>
          )}

          {activeTab === 'tips' && (
            <ul className="space-y-2">
              {benefit.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 bg-[#0a0a0a] border border-[#222] rounded-lg p-3">
                  <span className="text-amber-400 mt-0.5">💡</span>
                  <span className="text-[#ccc] text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────
   MAIN PAGE
   ──────────────────────────────────────────── */

export default function BenefitStoriesPage() {
  const [search, setSearch] = useState('');
  const [filterSolution, setFilterSolution] = useState<Solution | 'all'>('all');

  // Filter benefits
  const filtered = benefits.filter((b) => {
    const matchesSearch = !search.trim() || 
      b.benefitName.toLowerCase().includes(search.toLowerCase()) ||
      b.description.toLowerCase().includes(search.toLowerCase()) ||
      b.subcategory.toLowerCase().includes(search.toLowerCase()) ||
      b.talkTrack.toLowerCase().includes(search.toLowerCase());
    const matchesSolution = filterSolution === 'all' || b.solution === filterSolution;
    return matchesSearch && matchesSolution;
  });

  // Group by solution
  const grouped = solutionOrder
    .map((sol) => ({
      solution: sol,
      config: solutionConfig[sol],
      benefits: filtered.filter((b) => b.solution === sol),
    }))
    .filter((g) => g.benefits.length > 0);

  // Stats
  const solCounts = solutionOrder.map(s => ({
    solution: s,
    count: benefits.filter(b => b.solution === s).length,
  })).filter(s => s.count > 0);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Back */}
      <Link href="/value-engineering/projects" className="inline-flex items-center gap-1.5 text-[#555] hover:text-white text-sm mb-4 transition-colors">
        <ArrowLeft size={14} />
        Back to Projects
      </Link>

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">🎯 Benefit Stories Playbook</h2>
        <p className="text-[#555] text-sm">
          Quick-reference enablement for sales &amp; CSM. One story per benefit — scenario, talk track, formula, and tips you can adapt to any customer.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-4 mb-5 px-4 py-3 bg-[#111] border border-[#222] rounded-lg overflow-x-auto">
        <div className="text-center shrink-0">
          <div className="text-white font-bold text-lg">{benefits.length}</div>
          <div className="text-[#555] text-xs">Benefits</div>
        </div>
        {solCounts.map(({ solution, count }) => {
          const cfg = solutionConfig[solution];
          return (
            <div key={solution} className="flex items-center gap-2 shrink-0">
              <div className="w-px h-8 bg-[#222]" />
              <div className="text-center">
                <div className={`font-bold text-lg ${cfg.color}`}>{count}</div>
                <div className="text-[#555] text-xs">{cfg.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3 mb-6 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
          <input
            type="text"
            placeholder="Search benefits, keywords, talk tracks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#111] border border-[#222] rounded-lg text-white text-sm placeholder:text-[#444] focus:outline-none focus:border-[#333]"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          <button
            onClick={() => setFilterSolution('all')}
            className={`px-3 py-2 text-xs rounded-lg transition-colors ${
              filterSolution === 'all' ? 'bg-[#222] text-white' : 'text-[#555] hover:text-[#888] hover:bg-[#111]'
            }`}
          >
            All
          </button>
          {solutionOrder.filter(s => benefits.some(b => b.solution === s)).map((sol) => {
            const cfg = solutionConfig[sol];
            return (
              <button
                key={sol}
                onClick={() => setFilterSolution(sol)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs rounded-lg transition-colors ${
                  filterSolution === sol
                    ? `${cfg.bgColor} ${cfg.color}`
                    : 'text-[#555] hover:text-[#888] hover:bg-[#111]'
                }`}
              >
                {cfg.icon}
                {cfg.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Benefits grouped by solution */}
      <div className="space-y-6">
        {grouped.map((group) => (
          <div key={group.solution}>
            <div className="flex items-center gap-2 mb-3">
              <span className={group.config.color}>{group.config.icon}</span>
              <h3 className={`text-sm font-semibold ${group.config.color}`}>{group.config.label}</h3>
              <span className="text-[#444] text-xs">({group.benefits.length})</span>
            </div>
            <div className="space-y-2">
              {group.benefits.map((b) => (
                <BenefitCard key={b.id} benefit={b} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-[#555]">
          No benefits match your search.
        </div>
      )}
    </div>
  );
}
