'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Layers, ArrowLeftRight } from 'lucide-react';

/* ────────────────────────────────────────────
   DATA
   ──────────────────────────────────────────── */

type ProductEntry = {
  product: string;
  shortName: string;
  category: 'ITSM' | 'ESM' | 'UEM' | 'Security';
  color: string;
  bgColor: string;
  borderColor: string;
  benefits: string[]; // benefit IDs from data.ts
};

type BenefitEntry = {
  id: string;
  name: string;
  subcategory: string;
  products: string[]; // product shortNames
};

const products: ProductEntry[] = [
  {
    product: 'Neurons for ITSM',
    shortName: 'ITSM',
    category: 'ITSM',
    color: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/20',
    benefits: [
      'High Priority Ticket Routing',
      'Reduced Incident AHT',
      'Optimized Knowledge for Service Delivery',
      'Self-Service Portal Ticket Deflection',
      'Reduced Escalation Rate (L1→L2→L3)',
      'Improved Mean Time to Resolution (MTTR)',
      'Automated Change Management Efficiency',
      'Proactive Problem Management',
      'Asset Relationship Management',
      'Streamline Employee Onboarding & Transitions',
    ],
  },
  {
    product: 'Neurons for AITSM',
    shortName: 'AITSM',
    category: 'ITSM',
    color: 'text-indigo-400', bgColor: 'bg-indigo-500/10', borderColor: 'border-indigo-500/20',
    benefits: [
      'Reduce Escalated AHT with AI Incident Summarization',
      'Smarter Self-Service with AI',
      'Knowledge Management with AI',
      'Optimized Knowledge for Service Delivery',
      'Self-Service Portal Ticket Deflection',
    ],
  },
  {
    product: 'Neurons for FM',
    shortName: 'FM',
    category: 'ESM',
    color: 'text-amber-400', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/20',
    benefits: [
      'Energy & Utility Cost Optimisation Through Data-Driven Operations',
      'Improve Maintenance Efficiency via Predictive & Preventative Capabilities',
    ],
  },
  {
    product: 'Neurons for GRC',
    shortName: 'GRC',
    category: 'ESM',
    color: 'text-orange-400', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/20',
    benefits: [
      'Automated & Integrated Compliance Management',
    ],
  },
  {
    product: 'Neurons for HRSM',
    shortName: 'HRSM',
    category: 'ESM',
    color: 'text-yellow-400', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/20',
    benefits: [
      'Streamline Employee Onboarding & Transitions',
    ],
  },
  {
    product: 'Neurons for PPM',
    shortName: 'PPM',
    category: 'ESM',
    color: 'text-lime-400', bgColor: 'bg-lime-500/10', borderColor: 'border-lime-500/20',
    benefits: [
      'Improve Project Delivery Predictability',
      'Make Smarter Portfolio Investment Decisions',
    ],
  },
  {
    product: 'Neurons for ITAM',
    shortName: 'ITAM',
    category: 'ESM',
    color: 'text-teal-400', bgColor: 'bg-teal-500/10', borderColor: 'border-teal-500/20',
    benefits: [
      'Asset Relationship Management',
      'Vendor Contract Insights',
      'Reduced Hardware Maintenance Costs',
      'Reduced Energy Consumption',
    ],
  },
  {
    product: 'Neurons for MDM',
    shortName: 'MDM',
    category: 'UEM',
    color: 'text-green-400', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/20',
    benefits: [
      'Automated Security Compliance',
      'Reduced IT Support Costs',
      'Smarter Device Insights',
    ],
  },
  {
    product: 'Neurons Workspace',
    shortName: 'Workspace',
    category: 'UEM',
    color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/20',
    benefits: [
      'Smarter Device Insights',
      'Reduced IT Support Costs',
    ],
  },
  {
    product: 'Neurons for RBVM',
    shortName: 'RBVM',
    category: 'Security',
    color: 'text-red-400', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/20',
    benefits: [
      'Reduce Exploitation Recovery Costs',
      'Minimise Incident Response & Downtime Costs',
      'Secure Compliance & Lower Penalty Exposure',
    ],
  },
  {
    product: 'Neurons for Patch Management',
    shortName: 'Patch',
    category: 'Security',
    color: 'text-rose-400', bgColor: 'bg-rose-500/10', borderColor: 'border-rose-500/20',
    benefits: [
      'Reduce Zero-Day Defense Cost',
      'Lower Breach Risk with Rule-Based Automation',
    ],
  },
  {
    product: 'Ivanti Zero Sign-On (ZSO)',
    shortName: 'ZSO',
    category: 'Security',
    color: 'text-pink-400', bgColor: 'bg-pink-500/10', borderColor: 'border-pink-500/20',
    benefits: [
      'Elimination of Password Resets',
      'Minimised Password-Based Breach Risk',
      'Enhanced Security Posture',
    ],
  },
  {
    product: 'Ivanti Connect Secure',
    shortName: 'Connect Secure',
    category: 'Security',
    color: 'text-fuchsia-400', bgColor: 'bg-fuchsia-500/10', borderColor: 'border-fuchsia-500/20',
    benefits: [
      'Optimize Remote Access Costs',
      'Streamline Endpoint Security & Incident Response',
      'Reduce Data Breach Costs with Advanced Security',
    ],
  },
  {
    product: 'Neurons for EASM',
    shortName: 'EASM',
    category: 'Security',
    color: 'text-purple-400', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/20',
    benefits: [
      'Improved Detection of External Threats',
      'Reduced Risk from Shadow IT',
    ],
  },
  {
    product: 'Neurons Discovery',
    shortName: 'Discovery',
    category: 'ESM',
    color: 'text-cyan-400', bgColor: 'bg-cyan-500/10', borderColor: 'border-cyan-500/20',
    benefits: [
      'Software Usage Optimization',
      'Enhanced Hardware Visibility',
      'Reduced Security Risks from Rogue Devices',
      'Reduced IT Fines for Non-Compliant Devices',
      'Asset Relationship Management',
    ],
  },
  {
    product: 'Ivanti MTD',
    shortName: 'MTD',
    category: 'Security',
    color: 'text-violet-400', bgColor: 'bg-violet-500/10', borderColor: 'border-violet-500/20',
    benefits: [
      'Reduce Lost Business Costs from Breaches',
      'Reduce Breach Detection and Escalation Costs',
      'Improve Post-Breach Response',
      'Reduce Phishing & Malware Damage',
      'Automated Policy Enforcement',
    ],
  },
];

// Derive benefit list from all products (deduplicated)
const allBenefits: BenefitEntry[] = (() => {
  const map = new Map<string, string[]>();
  products.forEach(p => {
    p.benefits.forEach(b => {
      if (!map.has(b)) map.set(b, []);
      map.get(b)!.push(p.shortName);
    });
  });
  return Array.from(map.entries()).map(([name, prods]) => ({
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name,
    subcategory: '',
    products: prods,
  }));
})();

const categoryConfig: Record<string, { color: string; bgColor: string }> = {
  ITSM: { color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
  ESM: { color: 'text-amber-400', bgColor: 'bg-amber-500/10' },
  UEM: { color: 'text-green-400', bgColor: 'bg-green-500/10' },
  Security: { color: 'text-red-400', bgColor: 'bg-red-500/10' },
};

/* ────────────────────────────────────────────
   VIEWS
   ──────────────────────────────────────────── */

function ProductView() {
  const [selected, setSelected] = useState<string | null>(null);
  const [filterCat, setFilterCat] = useState<string>('all');
  const categories = ['all', 'ITSM', 'ESM', 'UEM', 'Security'];

  const filtered = products.filter(p => filterCat === 'all' || p.category === filterCat);
  const selectedProduct = products.find(p => p.shortName === selected);

  return (
    <div className="flex gap-4 h-full">
      {/* Product List */}
      <div className="w-64 shrink-0 space-y-2">
        <div className="flex gap-1 flex-wrap mb-3">
          {categories.map(c => {
            const cfg = c === 'all' ? null : categoryConfig[c];
            return (
              <button key={c} onClick={() => setFilterCat(c)}
                className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                  filterCat === c
                    ? cfg ? `${cfg.bgColor} ${cfg.color}` : 'bg-[#222] text-white'
                    : 'text-[#555] hover:text-[#888] hover:bg-[#111]'
                }`}>
                {c}
              </button>
            );
          })}
        </div>
        {filtered.map(p => (
          <button key={p.shortName} onClick={() => setSelected(selected === p.shortName ? null : p.shortName)}
            className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all ${
              selected === p.shortName
                ? `${p.bgColor} ${p.borderColor} ${p.color}`
                : 'border-[#222] bg-[#111] text-[#888] hover:text-white hover:bg-[#161616]'
            }`}>
            <div className="text-sm font-medium">{p.shortName}</div>
            <div className="text-[10px] text-[#555] mt-0.5">{p.benefits.length} benefits</div>
          </button>
        ))}
      </div>

      {/* Detail Panel */}
      <div className="flex-1 min-w-0">
        {!selectedProduct ? (
          <div className="h-full flex items-center justify-center text-[#444] text-sm">
            ← Select a product to see its benefits
          </div>
        ) : (
          <div className={`border ${selectedProduct.borderColor} ${selectedProduct.bgColor} rounded-xl p-5`}>
            <div className="mb-4">
              <div className={`text-xs font-semibold ${selectedProduct.color} mb-1`}>{selectedProduct.category}</div>
              <h3 className="text-white font-bold text-lg">{selectedProduct.product}</h3>
              <p className="text-[#555] text-xs mt-1">{selectedProduct.benefits.length} value benefits</p>
            </div>
            <div className="space-y-2">
              {selectedProduct.benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 bg-[#0a0a0a] border border-[#222] rounded-lg">
                  <ChevronRight size={14} className={selectedProduct.color} />
                  <span className="text-[#ccc] text-sm">{b}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function BenefitView() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedBenefit = allBenefits.find(b => b.id === selected);

  return (
    <div className="flex gap-4">
      {/* Benefit List */}
      <div className="w-72 shrink-0 space-y-1 max-h-[600px] overflow-y-auto pr-1">
        {allBenefits.map(b => (
          <button key={b.id} onClick={() => setSelected(selected === b.id ? null : b.id)}
            className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all ${
              selected === b.id
                ? 'border-[#333] bg-[#1a1a1a] text-white'
                : 'border-[#222] bg-[#111] text-[#888] hover:text-white hover:bg-[#161616]'
            }`}>
            <div className="text-xs font-medium leading-snug">{b.name}</div>
            <div className="text-[10px] text-[#555] mt-0.5">{b.products.length} product{b.products.length !== 1 ? 's' : ''}</div>
          </button>
        ))}
      </div>

      {/* Detail */}
      <div className="flex-1 min-w-0">
        {!selectedBenefit ? (
          <div className="h-full flex items-center justify-center text-[#444] text-sm">
            ← Select a benefit to see which products drive it
          </div>
        ) : (
          <div className="border border-[#222] bg-[#111] rounded-xl p-5">
            <h3 className="text-white font-bold text-base mb-1">{selectedBenefit.name}</h3>
            <p className="text-[#555] text-xs mb-4">Delivered by {selectedBenefit.products.length} product{selectedBenefit.products.length !== 1 ? 's' : ''}</p>
            <div className="space-y-2">
              {selectedBenefit.products.map(pName => {
                const p = products.find(pr => pr.shortName === pName);
                if (!p) return null;
                return (
                  <div key={pName} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border ${p.borderColor} ${p.bgColor}`}>
                    <ChevronRight size={14} className={p.color} />
                    <div>
                      <div className={`text-sm font-medium ${p.color}`}>{p.product}</div>
                      <div className="text-[10px] text-[#555]">{p.category}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   MAIN
   ──────────────────────────────────────────── */

export default function ProductBenefitMapPage() {
  const [view, setView] = useState<'product' | 'benefit'>('product');

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Link href="/value-engineering/projects" className="inline-flex items-center gap-1.5 text-[#555] hover:text-white text-sm mb-4 transition-colors">
        <ArrowLeft size={14} /> Back to Projects
      </Link>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">🗺️ Product ↔ Benefit Map</h2>
        <p className="text-[#555] text-sm">
          Two-way map: click a product to see its benefits, or click a benefit to see which products drive it.
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-5 px-4 py-3 bg-[#111] border border-[#222] rounded-lg">
        <div className="text-center"><div className="text-white font-bold text-lg">{products.length}</div><div className="text-[#555] text-xs">Products</div></div>
        <div className="w-px h-8 bg-[#222]" />
        <div className="text-center"><div className="text-white font-bold text-lg">{allBenefits.length}</div><div className="text-[#555] text-xs">Benefits</div></div>
        {Object.entries(categoryConfig).map(([cat, cfg]) => (
          <div key={cat} className="flex items-center gap-2">
            <div className="w-px h-8 bg-[#222]" />
            <div className="text-center">
              <div className={`font-bold text-lg ${cfg.color}`}>{products.filter(p => p.category === cat).length}</div>
              <div className="text-[#555] text-xs">{cat}</div>
            </div>
          </div>
        ))}
      </div>

      {/* View Toggle */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setView('product')}
          className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors ${
            view === 'product' ? 'bg-[#222] text-white' : 'text-[#555] hover:text-[#888] hover:bg-[#111]'
          }`}>
          <Layers size={14} /> Product → Benefits
        </button>
        <button onClick={() => setView('benefit')}
          className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors ${
            view === 'benefit' ? 'bg-[#222] text-white' : 'text-[#555] hover:text-[#888] hover:bg-[#111]'
          }`}>
          <ArrowLeftRight size={14} /> Benefit → Products
        </button>
      </div>

      {view === 'product' ? <ProductView /> : <BenefitView />}
    </div>
  );
}
