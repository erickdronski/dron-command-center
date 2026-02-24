'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2, Heart, Shield, Landmark, Fuel, ShoppingCart, Handshake, Plane, ChevronDown, ChevronRight, MessageSquare, Lightbulb, DollarSign, Clock } from 'lucide-react';
import { useParams } from 'next/navigation';
import { getBenefitsForVertical } from '../data';

type VerticalConfig = {
  name: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  itLandscape: string;
  painPoints: string[];
  regulations: string[];
};

const verticalConfigs: Record<string, VerticalConfig> = {
  'business-services': {
    name: 'Business Services',
    icon: Building2,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    itLandscape: 'Distributed workforce, client-facing SLAs, heavy M&A activity, multi-tenant environments. IT is the business — downtime directly impacts revenue and client trust.',
    painPoints: ['Client SLA penalties', 'Consultant onboarding speed', 'M&A integration complexity', 'Shadow IT from acquired companies'],
    regulations: ['SOC 2', 'ISO 27001', 'GDPR (if EU clients)', 'Client-specific security requirements'],
  },
  'non-profit': {
    name: 'Non-Profit',
    icon: Handshake,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    itLandscape: 'Lean IT teams (often 5-15 people supporting 500+ staff), heavy reliance on volunteers, grant-funded technology, donor data sensitivity. Every dollar saved goes to the mission.',
    painPoints: ['Tiny IT budget vs growing demands', 'Volunteer onboarding/offboarding churn', 'Donor data compliance (GDPR, PCI)', 'Legacy systems from grant cycles'],
    regulations: ['PCI-DSS (donations)', 'GDPR', 'Grant compliance/audit requirements', 'State charity regulations'],
  },
  'retail-wholesale': {
    name: 'Retail / Wholesale',
    icon: ShoppingCart,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    itLandscape: 'Thousands of store locations, POS systems, seasonal workforce surges, e-commerce + brick-and-mortar convergence. Store-level IT issues directly impact revenue per minute.',
    painPoints: ['POS downtime = lost sales', 'Seasonal hiring IT provisioning', 'Store manager IT literacy varies wildly', 'Omnichannel complexity'],
    regulations: ['PCI-DSS', 'GDPR/CCPA (customer data)', 'Accessibility compliance', 'Supply chain security'],
  },
  'medical-hospitals': {
    name: 'Medical & Surgical Hospitals',
    icon: Heart,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    itLandscape: '24/7/365 operations, life-critical systems (EHR, PACS, lab systems), clinical devices on the network, shift-based staff who can\'t wait for IT. Downtime can literally endanger patients.',
    painPoints: ['Clinical system downtime = patient safety risk', 'Nurse/doctor time is extremely expensive', 'HIPAA breach costs average $10.9M', 'Biomedical device sprawl'],
    regulations: ['HIPAA', 'HITECH', 'Joint Commission', 'FDA (for connected medical devices)', 'State health regulations'],
  },
  'energy-utilities': {
    name: 'Energy / Utilities',
    icon: Fuel,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    itLandscape: 'IT/OT convergence, field workers in remote locations, SCADA/ICS systems, critical infrastructure designation. A grid outage affects millions; regulatory fines are massive.',
    painPoints: ['IT/OT boundary security', 'Field worker IT support', 'NERC CIP compliance burden', 'Aging infrastructure + digital transformation'],
    regulations: ['NERC CIP', 'TSA Pipeline Security', 'EPA', 'State PUC regulations', 'NIS2 (EU energy)'],
  },
  'banking-finance': {
    name: 'Banking / Finance / Insurance',
    icon: Landmark,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    itLandscape: 'Branch networks, trading floors, massive transaction volumes, extreme uptime requirements. Regulatory burden is the heaviest of any industry. Every incident is a potential audit finding.',
    painPoints: ['Trading floor downtime = millions/hour', 'Branch IT support across hundreds of locations', 'Regulatory audit preparation is constant', 'Fraud and security incidents require instant escalation'],
    regulations: ['SOX', 'PCI-DSS', 'GLBA', 'GDPR/CCPA', 'OCC/FDIC requirements', 'DORA (EU financial)'],
  },
  'healthcare-pharma': {
    name: 'Healthcare / Pharma',
    icon: Shield,
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    itLandscape: 'GxP-validated environments, clinical trial systems, global R&D coordination, FDA/EMA submission systems. IT changes require validation protocols — nothing moves fast without governance.',
    painPoints: ['GxP validation slows IT changes', 'Clinical trial system uptime is non-negotiable', 'Mergers create IT integration nightmares', 'Lab instrument/IT integration complexity'],
    regulations: ['FDA 21 CFR Part 11', 'GxP (GMP, GLP, GCP)', 'HIPAA', 'EMA regulations', 'ICH guidelines'],
  },
  'aerospace-defense-manufacturing': {
    name: 'Aerospace & Defense / Manufacturing',
    icon: Plane,
    color: 'text-slate-400',
    bgColor: 'bg-slate-500/10',
    itLandscape: 'Classified environments, ITAR-controlled data, shop floor OT systems, complex supply chains with hundreds of subcontractors. Compliance isn\'t optional — it\'s existential for contract eligibility.',
    painPoints: ['CMMC compliance for DoD contracts', 'Shop floor IT/OT convergence', 'Supply chain partner security', 'Classified vs unclassified network management'],
    regulations: ['ITAR', 'CMMC/NIST 800-171', 'DFARS', 'EAR', 'ISO 9001/AS9100', 'OSHA (manufacturing floor)'],
  },
};

export default function VerticalPage() {
  const params = useParams();
  const verticalId = params.verticalId as string;
  const config = verticalConfigs[verticalId];

  if (!config) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <Link href="/value-engineering/projects/benefit-stories" className="text-[#555] hover:text-white text-sm">← Back</Link>
        <div className="mt-12 text-center text-[#555]">Vertical not found</div>
      </div>
    );
  }

  const Icon = config.icon;
  const verticalBenefits = getBenefitsForVertical(verticalId);
  const financialBenefits = verticalBenefits.filter(b => b.category === 'financial');
  const timeSavings = verticalBenefits.filter(b => b.category === 'time-savings');

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Back */}
      <div className="flex items-center gap-2">
        <Link href="/value-engineering/projects/benefit-stories" className="text-[#555] hover:text-white transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <span className="text-xs text-[#555]">Benefit Stories /</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl ${config.bgColor} flex items-center justify-center`}>
            <Icon size={24} className={config.color} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{config.name}</h1>
            <p className="text-sm text-[#666]">{verticalBenefits.length} benefit stories mapped</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-center px-3 py-1.5 bg-green-500/10 rounded-lg">
            <div className="text-[10px] text-green-400/70">Financial</div>
            <div className="text-sm font-bold text-green-400">{financialBenefits.length}</div>
          </div>
          <div className="text-center px-3 py-1.5 bg-blue-500/10 rounded-lg">
            <div className="text-[10px] text-blue-400/70">Time Savings</div>
            <div className="text-sm font-bold text-blue-400">{timeSavings.length}</div>
          </div>
        </div>
      </div>

      {/* IT Landscape */}
      <div className="bg-[#111] border border-[#222] rounded-xl p-5">
        <h2 className="text-xs font-semibold text-[#555] uppercase tracking-wider mb-2">🏢 IT Landscape</h2>
        <p className="text-sm text-[#999] leading-relaxed">{config.itLandscape}</p>
      </div>

      {/* Pain Points + Regulations */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#111] border border-[#222] rounded-xl p-5">
          <h2 className="text-xs font-semibold text-[#555] uppercase tracking-wider mb-3">🔥 Common Pain Points</h2>
          <div className="space-y-2">
            {config.painPoints.map((p, i) => (
              <div key={i} className="text-xs text-[#888] flex items-start gap-2">
                <span className={`${config.color} opacity-50 mt-0.5`}>▸</span>
                {p}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#111] border border-[#222] rounded-xl p-5">
          <h2 className="text-xs font-semibold text-[#555] uppercase tracking-wider mb-3">📋 Key Regulations</h2>
          <div className="flex flex-wrap gap-1.5">
            {config.regulations.map((r, i) => (
              <span key={i} className="text-[10px] bg-white/5 text-[#888] px-2 py-1 rounded">{r}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Financial Benefits */}
      {financialBenefits.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <DollarSign size={14} className="text-green-400" />
            <h2 className="text-sm font-semibold text-[#555] uppercase tracking-wider">Financial Benefits</h2>
          </div>
          <div className="space-y-2">
            {financialBenefits.map((b) => (
              <BenefitStoryCard key={b.id} benefit={b} color={config.color} />
            ))}
          </div>
        </div>
      )}

      {/* Time Savings */}
      {timeSavings.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock size={14} className="text-blue-400" />
            <h2 className="text-sm font-semibold text-[#555] uppercase tracking-wider">Time Savings (Non-Financial)</h2>
          </div>
          <div className="space-y-2">
            {timeSavings.map((b) => (
              <BenefitStoryCard key={b.id} benefit={b} color={config.color} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {verticalBenefits.length === 0 && (
        <div className="bg-[#111] border border-dashed border-[#333] rounded-xl p-8 text-center">
          <div className="text-2xl mb-2">📥</div>
          <div className="text-sm text-[#666] font-semibold">Awaiting Benefit Data</div>
          <p className="text-xs text-[#555] mt-1">Feed benefits from Value Cloud to populate stories for {config.name}.</p>
        </div>
      )}
    </div>
  );
}

function BenefitStoryCard({ benefit, color }: { benefit: ReturnType<typeof getBenefitsForVertical>[0]; color: string }) {
  const [open, setOpen] = useState(false);
  const story = benefit.verticalStory;

  return (
    <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors">
        <div>
          <div className="text-[10px] text-[#555] uppercase">{benefit.subcategory}</div>
          <div className="text-sm font-semibold text-white">{benefit.benefitName}</div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${benefit.category === 'financial' ? 'bg-green-500/15 text-green-400' : 'bg-blue-500/15 text-blue-400'}`}>
            {benefit.category === 'financial' ? '💰 Financial' : '⏱️ Time'}
          </span>
          {open ? <ChevronDown size={14} className="text-[#555]" /> : <ChevronRight size={14} className="text-[#555]" />}
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-[#1a1a1a] pt-3">
          {/* Platform Description */}
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-3">
            <div className="text-[10px] font-semibold text-[#555] uppercase mb-1">Platform Description</div>
            <p className="text-[11px] text-[#777] leading-relaxed">{benefit.description}</p>
          </div>

          {/* Formula */}
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-3">
            <div className="text-[10px] font-semibold text-[#555] uppercase mb-1">Formula</div>
            <p className="text-xs font-mono text-green-400/80">{benefit.formula}</p>
            <div className="mt-2 space-y-0.5">
              {benefit.formulaFactors.map((f, i) => (
                <div key={i} className="text-[10px] text-[#666] flex items-start gap-1.5">
                  <span className="text-[#444] mt-0.5">•</span>{f}
                </div>
              ))}
            </div>
          </div>

          {/* Scenario */}
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Lightbulb size={12} className={color} />
              <span className="text-[10px] font-semibold text-[#555] uppercase">Scenario</span>
            </div>
            <p className="text-xs text-[#999] leading-relaxed">{story.scenario}</p>
          </div>

          {/* Talk Track */}
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <MessageSquare size={12} className="text-purple-400" />
              <span className="text-[10px] font-semibold text-purple-400 uppercase">Talk Track (Say This)</span>
            </div>
            <p className="text-xs text-[#ccc] leading-relaxed italic bg-purple-500/5 border border-purple-500/10 rounded-lg p-3">&ldquo;{story.talkTrack}&rdquo;</p>
          </div>

          {/* Why It Matters */}
          <div>
            <div className="text-[10px] font-semibold text-[#555] uppercase mb-1">Why It Matters in This Industry</div>
            <p className="text-xs text-[#888] leading-relaxed">{story.whyItMatters}</p>
          </div>

          {/* Example Metric */}
          <div className="bg-green-500/5 border border-green-500/10 rounded-lg p-3">
            <div className="text-[10px] text-green-400 font-semibold">📊 Example Metric</div>
            <div className="text-xs text-green-300/80 mt-0.5">{story.exampleMetric}</div>
          </div>
        </div>
      )}
    </div>
  );
}
