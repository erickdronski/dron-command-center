'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2, Factory, Heart, Shield, Zap, Landmark, Fuel, ShoppingCart, Handshake, Plane, BookOpen, ChevronDown, ChevronRight, MessageSquare, Lightbulb } from 'lucide-react';
import { useParams } from 'next/navigation';

type BenefitStory = {
  id: string;
  benefitName: string;
  category: string;
  scenario: string;
  talkTrack: string;
  whyItMatters: string;
  exampleMetric?: string;
};

type VerticalConfig = {
  name: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  itLandscape: string;
  painPoints: string[];
  regulations: string[];
  stories: BenefitStory[];
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
    stories: [],
  },
  'non-profit': {
    name: 'Non-Profit',
    icon: Handshake,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    itLandscape: 'Lean IT teams (often 5-15 people supporting 500+ staff), heavy reliance on volunteers, grant-funded technology, donor data sensitivity. Every dollar saved goes to the mission.',
    painPoints: ['Tiny IT budget vs growing demands', 'Volunteer onboarding/offboarding churn', 'Donor data compliance (GDPR, PCI)', 'Legacy systems from grant cycles'],
    regulations: ['PCI-DSS (donations)', 'GDPR', 'Grant compliance/audit requirements', 'State charity regulations'],
    stories: [],
  },
  'retail-wholesale': {
    name: 'Retail / Wholesale',
    icon: ShoppingCart,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    itLandscape: 'Thousands of store locations, POS systems, seasonal workforce surges, e-commerce + brick-and-mortar convergence. Store-level IT issues directly impact revenue per minute.',
    painPoints: ['POS downtime = lost sales', 'Seasonal hiring IT provisioning', 'Store manager IT literacy varies wildly', 'Omnichannel complexity'],
    regulations: ['PCI-DSS', 'GDPR/CCPA (customer data)', 'Accessibility compliance', 'Supply chain security'],
    stories: [],
  },
  'medical-hospitals': {
    name: 'Medical & Surgical Hospitals',
    icon: Heart,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    itLandscape: '24/7/365 operations, life-critical systems (EHR, PACS, lab systems), clinical devices on the network, shift-based staff who can\'t wait for IT. Downtime can literally endanger patients.',
    painPoints: ['Clinical system downtime = patient safety risk', 'Nurse/doctor time is extremely expensive', 'HIPAA breach costs average $10.9M', 'Biomedical device sprawl'],
    regulations: ['HIPAA', 'HITECH', 'Joint Commission', 'FDA (for connected medical devices)', 'State health regulations'],
    stories: [],
  },
  'energy-utilities': {
    name: 'Energy / Utilities',
    icon: Fuel,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    itLandscape: 'IT/OT convergence, field workers in remote locations, SCADA/ICS systems, critical infrastructure designation. A grid outage affects millions; regulatory fines are massive.',
    painPoints: ['IT/OT boundary security', 'Field worker IT support', 'NERC CIP compliance burden', 'Aging infrastructure + digital transformation'],
    regulations: ['NERC CIP', 'TSA Pipeline Security', 'EPA', 'State PUC regulations', 'NIS2 (EU energy)'],
    stories: [],
  },
  'banking-finance': {
    name: 'Banking / Finance / Insurance',
    icon: Landmark,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    itLandscape: 'Branch networks, trading floors, massive transaction volumes, extreme uptime requirements. Regulatory burden is the heaviest of any industry. Every incident is a potential audit finding.',
    painPoints: ['Trading floor downtime = millions/hour', 'Branch IT support across hundreds of locations', 'Regulatory audit preparation is constant', 'Fraud and security incidents require instant escalation'],
    regulations: ['SOX', 'PCI-DSS', 'GLBA', 'GDPR/CCPA', 'OCC/FDIC requirements', 'DORA (EU financial)'],
    stories: [],
  },
  'healthcare-pharma': {
    name: 'Healthcare / Pharma',
    icon: Shield,
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    itLandscape: 'GxP-validated environments, clinical trial systems, global R&D coordination, FDA/EMA submission systems. IT changes require validation protocols — nothing moves fast without governance.',
    painPoints: ['GxP validation slows IT changes', 'Clinical trial system uptime is non-negotiable', 'Mergers create IT integration nightmares', 'Lab instrument/IT integration complexity'],
    regulations: ['FDA 21 CFR Part 11', 'GxP (GMP, GLP, GCP)', 'HIPAA', 'EMA regulations', 'ICH guidelines'],
    stories: [],
  },
  'aerospace-defense-manufacturing': {
    name: 'Aerospace & Defense / Manufacturing',
    icon: Plane,
    color: 'text-slate-400',
    bgColor: 'bg-slate-500/10',
    itLandscape: 'Classified environments, ITAR-controlled data, shop floor OT systems, complex supply chains with hundreds of subcontractors. Compliance isn\'t optional — it\'s existential for contract eligibility.',
    painPoints: ['CMMC compliance for DoD contracts', 'Shop floor IT/OT convergence', 'Supply chain partner security', 'Classified vs unclassified network management'],
    regulations: ['ITAR', 'CMMC/NIST 800-171', 'DFARS', 'EAR', 'ISO 9001/AS9100', 'OSHA (manufacturing floor)'],
    stories: [],
  },
};

function StoryCard({ story, color }: { story: BenefitStory; color: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors">
        <div>
          <div className="text-[10px] text-[#555] uppercase">{story.category}</div>
          <div className="text-sm font-semibold text-white">{story.benefitName}</div>
        </div>
        {open ? <ChevronDown size={14} className="text-[#555]" /> : <ChevronRight size={14} className="text-[#555]" />}
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-[#1a1a1a] pt-3">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Lightbulb size={12} className={color} />
              <span className="text-[10px] font-semibold text-[#555] uppercase">Scenario</span>
            </div>
            <p className="text-xs text-[#999] leading-relaxed">{story.scenario}</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <MessageSquare size={12} className="text-purple-400" />
              <span className="text-[10px] font-semibold text-[#555] uppercase">Talk Track</span>
            </div>
            <p className="text-xs text-[#999] leading-relaxed italic">&ldquo;{story.talkTrack}&rdquo;</p>
          </div>
          <div>
            <div className="text-[10px] font-semibold text-[#555] uppercase mb-1">Why It Matters Here</div>
            <p className="text-xs text-[#888] leading-relaxed">{story.whyItMatters}</p>
          </div>
          {story.exampleMetric && (
            <div className="bg-green-500/5 border border-green-500/10 rounded-lg p-2">
              <div className="text-[10px] text-green-400 font-semibold">📊 Example Metric</div>
              <div className="text-xs text-green-300/80 mt-0.5">{story.exampleMetric}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

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
  const hasStories = config.stories.length > 0;

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
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl ${config.bgColor} flex items-center justify-center`}>
          <Icon size={24} className={config.color} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">{config.name}</h1>
          <p className="text-sm text-[#666]">{config.stories.length} benefit stories mapped</p>
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

      {/* Stories */}
      <div>
        <h2 className="text-sm font-semibold text-[#555] uppercase tracking-wider mb-3">💬 Benefit Stories</h2>
        {hasStories ? (
          <div className="space-y-2">
            {config.stories.map((story) => (
              <StoryCard key={story.id} story={story} color={config.color} />
            ))}
          </div>
        ) : (
          <div className="bg-[#111] border border-dashed border-[#333] rounded-xl p-8 text-center">
            <div className="text-2xl mb-2">📥</div>
            <div className="text-sm text-[#666] font-semibold">Awaiting Benefit Data</div>
            <p className="text-xs text-[#555] mt-1 max-w-md mx-auto">
              Feed benefits from Value Cloud and stories will be generated for this vertical. 
              Each benefit gets a tailored scenario, talk track, and &ldquo;why it matters&rdquo; for {config.name}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
