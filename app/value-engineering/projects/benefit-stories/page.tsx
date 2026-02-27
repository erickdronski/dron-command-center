'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2, Factory, Heart, Shield, Zap, Landmark, Fuel, ShoppingCart, Handshake, Plane, BookOpen, ChevronRight, Plus, Search, LayoutGrid, List } from 'lucide-react';
import { benefits, type Solution } from './data';

type Vertical = {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  examples: string[];
  benefitCount: number;
};

const verticals: Vertical[] = [
  {
    id: 'business-services',
    name: 'Business Services',
    icon: Building2,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    description: 'Consulting, staffing, outsourcing, professional services, IT services, legal, accounting. High ticket volumes, distributed workforce, client-facing SLAs.',
    examples: ['Accenture', 'Deloitte', 'ADP', 'Cognizant', 'Infosys'],
    benefitCount: benefits.filter(b => b.stories['business-services']).length,
  },
  {
    id: 'non-profit',
    name: 'Non-Profit',
    icon: Handshake,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    description: 'Charities, NGOs, foundations, associations, government-adjacent orgs. Budget-constrained, lean IT, donor/grant compliance, mission-critical uptime.',
    examples: ['Red Cross', 'WWF', 'Salvation Army', 'United Way', 'Habitat for Humanity'],
    benefitCount: benefits.filter(b => b.stories['non-profit']).length,
  },
  {
    id: 'retail-wholesale',
    name: 'Retail / Wholesale',
    icon: ShoppingCart,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
    description: 'Brick-and-mortar, e-commerce, distribution, supply chain. POS systems, seasonal spikes (Black Friday, holidays), store-level IT, high endpoint counts.',
    examples: ['Walmart', 'Target', 'Costco', 'Tesco', 'Home Depot'],
    benefitCount: benefits.filter(b => b.stories['retail-wholesale']).length,
  },
  {
    id: 'medical-hospitals',
    name: 'Medical & Surgical Hospitals',
    icon: Heart,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    description: 'Hospital systems, surgical centers, clinical networks. 24/7 operations, life-critical systems, HIPAA/regulatory, clinical devices, shift-based staff.',
    examples: ['HCA Healthcare', 'Mayo Clinic', 'Kaiser Permanente', 'NHS Trusts', 'Cleveland Clinic'],
    benefitCount: benefits.filter(b => b.stories['medical-hospitals']).length,
  },
  {
    id: 'energy-utilities',
    name: 'Energy / Utilities',
    icon: Fuel,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
    description: 'Power generation, oil & gas, water, renewables, grid operators. OT/IT convergence, NERC CIP compliance, field workers, SCADA systems, critical infrastructure.',
    examples: ['Duke Energy', 'ExxonMobil', 'NextEra', 'National Grid', 'Shell'],
    benefitCount: benefits.filter(b => b.stories['energy-utilities']).length,
  },
  {
    id: 'banking-finance',
    name: 'Banking / Finance / Insurance',
    icon: Landmark,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
    description: 'Banks, credit unions, investment firms, insurance carriers. Heavy regulation (SOX, PCI-DSS, GDPR), branch networks, trading floor uptime, fraud sensitivity.',
    examples: ['JPMorgan', 'Bank of America', 'Allianz', 'State Farm', 'Goldman Sachs'],
    benefitCount: benefits.filter(b => b.stories['banking-finance']).length,
  },
  {
    id: 'healthcare-pharma',
    name: 'Healthcare / Pharma',
    icon: Shield,
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/20',
    description: 'Pharma companies, biotech, health insurers, clinical research. FDA/EMA validation, GxP compliance, R&D environments, global trial coordination.',
    examples: ['Pfizer', 'Johnson & Johnson', 'Roche', 'UnitedHealth', 'AstraZeneca'],
    benefitCount: benefits.filter(b => b.stories['healthcare-pharma']).length,
  },
  {
    id: 'aerospace-defense-manufacturing',
    name: 'Aerospace & Defense / Manufacturing',
    icon: Plane,
    color: 'text-slate-400',
    bgColor: 'bg-slate-500/10',
    borderColor: 'border-slate-500/20',
    description: 'Defense contractors, aerospace OEMs, heavy manufacturing. ITAR/CMMC compliance, classified environments, shop floor IT/OT, supply chain complexity.',
    examples: ['Lockheed Martin', 'Boeing', 'Raytheon', 'BAE Systems', 'General Electric'],
    benefitCount: benefits.filter(b => b.stories['aerospace-defense-manufacturing']).length,
  },
];

const solutionMeta: Record<string, { label: string; color: string; bgColor: string; borderColor: string; icon: string }> = {
  all: { label: 'All Solutions', color: 'text-purple-400', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/30', icon: '📊' },
  itsm: { label: 'ITSM', color: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/30', icon: '🎫' },
  esm: { label: 'ESM', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/30', icon: '🏢' },
  uem: { label: 'UEM', color: 'text-amber-400', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/30', icon: '💻' },
  security: { label: 'Security', color: 'text-red-400', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/30', icon: '🔒' },
};

export default function BenefitStoriesPage() {
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'verticals' | 'solutions'>('verticals');
  const [solutionFilter, setSolutionFilter] = useState<string>('all');
  const totalBenefits = verticals.reduce((sum, v) => sum + v.benefitCount, 0);
  const filtered = verticals.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.description.toLowerCase().includes(search.toLowerCase())
  );

  const filteredBenefits = solutionFilter === 'all'
    ? benefits
    : benefits.filter(b => b.solution === solutionFilter);

  const searchedBenefits = filteredBenefits.filter(b =>
    b.benefitName.toLowerCase().includes(search.toLowerCase()) ||
    b.subcategory.toLowerCase().includes(search.toLowerCase()) ||
    b.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Back */}
      <div className="flex items-center gap-2">
        <Link href="/value-engineering/projects" className="text-[#555] hover:text-white transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <span className="text-xs text-[#555]">Projects /</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <BookOpen size={24} className="text-purple-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Value Cloud Benefit Stories</h1>
            <p className="text-sm text-[#666]">Industry-specific storytelling guides for every Value Cloud benefit</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* View Toggle */}
          <div className="flex items-center bg-[#111] border border-[#222] rounded-lg p-0.5">
            <button
              onClick={() => setView('verticals')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${view === 'verticals' ? 'bg-purple-500/20 text-purple-400' : 'text-[#666] hover:text-white'}`}
            >
              <LayoutGrid size={12} className="inline mr-1" />
              By Vertical
            </button>
            <button
              onClick={() => setView('solutions')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${view === 'solutions' ? 'bg-purple-500/20 text-purple-400' : 'text-[#666] hover:text-white'}`}
            >
              <List size={12} className="inline mr-1" />
              By Solution
            </button>
          </div>
          <div className="text-right">
            <div className="text-xs text-[#555]">Benefits Mapped</div>
            <div className="text-lg font-bold text-purple-400">{benefits.length}</div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-[#111] border border-purple-500/20 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-purple-400 mb-3">📖 How This Works</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-xs font-semibold text-white mb-1">1. Pick a Vertical</div>
            <p className="text-[11px] text-[#888] leading-relaxed">Select the customer's industry. Each vertical has tailored stories that resonate with that world.</p>
          </div>
          <div>
            <div className="text-xs font-semibold text-white mb-1">2. Find the Benefit</div>
            <p className="text-[11px] text-[#888] leading-relaxed">Browse by Value Cloud benefit. Each one has a short, punchy scenario written for that industry.</p>
          </div>
          <div>
            <div className="text-xs font-semibold text-white mb-1">3. Tell the Story</div>
            <p className="text-[11px] text-[#888] leading-relaxed">Use the scenario on a call, in a deck, or in a Lucidchart board. It's your cheat sheet to sound like you live in their world.</p>
          </div>
        </div>
      </div>

      {/* Audience */}
      <div className="bg-[#111] border border-[#222] rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-xs text-[#555]">For</div>
            <div className="text-sm font-semibold text-white">Value Engineers</div>
          </div>
          <div className="w-px h-6 bg-[#222]" />
          <div className="text-center">
            <div className="text-xs text-[#555]">For</div>
            <div className="text-sm font-semibold text-white">Sales Reps</div>
          </div>
          <div className="w-px h-6 bg-[#222]" />
          <div className="text-center">
            <div className="text-xs text-[#555]">For</div>
            <div className="text-sm font-semibold text-white">CSMs & SEs</div>
          </div>
        </div>
        <div className="text-xs text-[#666] max-w-xs text-right">General enough that most orgs in the vertical connect the dots. Specific enough that you sound like you put yourself in their shoes.</div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
        <input
          type="text"
          placeholder={view === 'verticals' ? 'Search verticals...' : 'Search benefits...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#111] border border-[#222] rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-[#555] focus:outline-none focus:border-purple-500/30"
        />
      </div>

      {view === 'verticals' ? (
        <>
          {/* Vertical Grid */}
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((v) => {
              const Icon = v.icon;
              const hasStories = v.benefitCount > 0;
              return (
                <Link
                  key={v.id}
                  href={`/value-engineering/projects/benefit-stories/${v.id}`}
                  className={`bg-[#111] border ${v.borderColor} rounded-xl p-5 hover:bg-[#141414] transition-all group`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${v.bgColor} flex items-center justify-center`}>
                        <Icon size={20} className={v.color} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">{v.name}</h3>
                        <div className="text-[10px] text-[#555] mt-0.5">
                          {hasStories ? `${v.benefitCount} benefits mapped` : 'Awaiting benefits'}
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-[#333] group-hover:text-[#666] transition-colors mt-1" />
                  </div>
                  <p className="text-[11px] text-[#777] leading-relaxed mb-3">{v.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {v.examples.map((ex) => (
                      <span key={ex} className="text-[10px] bg-white/5 text-[#666] px-1.5 py-0.5 rounded">{ex}</span>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      ) : (
        <>
          {/* Solution Filter Tabs */}
          <div className="flex items-center gap-2">
            {Object.entries(solutionMeta).map(([key, meta]) => {
              const count = key === 'all' ? benefits.length : benefits.filter(b => b.solution === key).length;
              return (
                <button
                  key={key}
                  onClick={() => setSolutionFilter(key)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                    solutionFilter === key
                      ? `${meta.bgColor} ${meta.color} ${meta.borderColor}`
                      : 'border-[#222] text-[#666] hover:text-white hover:border-[#333]'
                  }`}
                >
                  <span>{meta.icon}</span>
                  <span>{meta.label}</span>
                  <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${solutionFilter === key ? 'bg-white/10' : 'bg-white/5'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Benefits List */}
          <div className="space-y-3">
            {searchedBenefits.map((b) => {
              const meta = solutionMeta[b.solution] || solutionMeta.all;
              const verticalCount = Object.keys(b.stories).length;
              return (
                <div
                  key={b.id}
                  className={`bg-[#111] border ${meta.borderColor} rounded-xl p-5 hover:bg-[#141414] transition-all`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{meta.icon}</span>
                      <div>
                        <h3 className="text-sm font-bold text-white">{b.benefitName}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${meta.bgColor} ${meta.color}`}>
                            {meta.label}
                          </span>
                          <span className="text-[10px] text-[#555]">{b.subcategory}</span>
                          <span className="text-[10px] text-[#444]">•</span>
                          <span className="text-[10px] text-[#555]">{verticalCount} verticals</span>
                          <span className="text-[10px] text-[#444]">•</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${b.category === 'financial' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                            {b.category === 'financial' ? '💰 Financial' : '⏱️ Time Savings'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#888] leading-relaxed mb-3 ml-8">{b.description}</p>
                  <div className="ml-8 bg-[#0a0a0a] rounded-lg p-3">
                    <div className="text-[10px] text-[#555] mb-1">Formula</div>
                    <div className="text-[11px] text-purple-400 font-mono">{b.formula}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {searchedBenefits.length === 0 && (
            <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-12 text-center">
              <div className="text-sm text-[#555]">No benefits found</div>
            </div>
          )}
        </>
      )}

      {/* Status */}
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4 text-center">
        <div className="text-xs text-[#555]">{benefits.length} benefits across {Object.keys(solutionMeta).length - 1} solutions and {verticals.length} verticals</div>
      </div>
    </div>
  );
}
