'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Building2, Calendar, ChevronRight, MapPin, Tag, Zap, ArrowRight } from 'lucide-react';

/* ── Strategic Projects ── */
type Framework = 'value-cloud' | 'maturity-assessment' | 'general';

type StrategicProject = {
  href: string;
  title: string;
  desc: string;
  status: 'active' | 'completed';
  color: string;
  framework: Framework;
};

const frameworkMeta: Record<Framework, { label: string; color: string; bgColor: string; borderColor: string }> = {
  'value-cloud': { label: 'Value Cloud', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/20' },
  'maturity-assessment': { label: 'Maturity Assessment', color: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/20' },
  'general': { label: 'General', color: 'text-purple-400', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/20' },
};

const strategicProjects: StrategicProject[] = [
  // Value Cloud
  { href: '/value-engineering/projects/benefit-stories', title: 'Value Cloud Benefit Stories', desc: 'Industry-specific storytelling guides for every Value Cloud benefit. 8 verticals.', status: 'active', color: 'border-green-500/30', framework: 'value-cloud' },
  { href: '/value-engineering/projects/benefit-builder', title: 'Benefit Builder (ROI Calculator)', desc: 'Input customer metrics, select benefits, get instant ROI calculations.', status: 'active', color: 'border-emerald-500/30', framework: 'value-cloud' },
  { href: '/value-engineering/projects/hybrid-benefits', title: 'Hybrid Benefits & Service Mapping', desc: '5 hybrid ITSM + 5 Service Mapping benefits with factor fusion.', status: 'active', color: 'border-blue-500/30', framework: 'value-cloud' },
  { href: '/value-engineering/projects/glasgow', title: 'Univ. of Glasgow — Value Hypothesis', desc: '£503K/yr financial + 5,735 hrs saved. ITSM Enterprise Premium.', status: 'active', color: 'border-blue-500/30', framework: 'value-cloud' },
  // General
  { href: '/value-engineering/prompt-toolkit', title: 'Prompt Toolkit', desc: '6-prompt sales knowledge chain for SEs, CSMs & VEs.', status: 'active', color: 'border-purple-500/30', framework: 'general' },
  { href: '/value-engineering/projects/product-guide', title: 'Ivanti Product Guide', desc: '38 products across ESM, UEM & Security — searchable catalog.', status: 'active', color: 'border-cyan-500/30', framework: 'general' },
  { href: '/value-engineering/projects/bingo-card', title: 'Sales Bingo Card Automation', desc: 'Automate manual portfolio assembly — 126 hrs/rep/yr saved.', status: 'active', color: 'border-purple-500/30', framework: 'general' },
];

/* ── Customer Engagements ── */
type Project = {
  id: string;
  customer: string;
  vertical: string;
  region: string;
  status: 'active' | 'completed' | 'pending';
  type: 'roi-hypothesis' | 'capability-assessment' | 'value-proposal';
  startDate: string;
  summary: string;
  products: string[];
  keyMetrics?: Record<string, string>;
  notes?: string;
};

const projects: Project[] = [
  {
    id: 'uog-2026',
    customer: 'University of Glasgow',
    vertical: 'Higher Education',
    region: 'UK / Scotland',
    status: 'active',
    type: 'roi-hypothesis',
    startDate: '2026-02-20',
    summary: 'Building ROI hypothesis for ITSM Enterprise Premium renewal. 400 concurrent analyst seats, 4-year deal with 5% YoY uplift.',
    products: ['Neurons for ITSM Enterprise Premium', 'Voice Automation Agent', 'Voice Automation Supervisor', 'VPN Cloud', 'BI Reporting'],
    keyMetrics: { 'Employees': '~9,500', 'Endpoints': '~15,000', 'Annual Tickets': '~90,000', 'Analyst Seats': '400 concurrent', 'Annual Investment': '~£308,824', 'Deal Term': '4 years (2027-2031)' },
    notes: 'No confirmed cyber breaches — breach benefits set to Soft. JISC reports UK higher ed heavily targeted.',
  },
  {
    id: 'conair-2025',
    customer: 'Conair',
    vertical: 'Consumer Products / Manufacturing',
    region: 'US',
    status: 'completed',
    type: 'capability-assessment',
    startDate: '2025-09-24',
    summary: 'Full Capability & Maturity workshop. Low maturity in Incident, Self-Service, Knowledge, Reporting, Automation.',
    products: ['ITSM', 'ITAM', 'Discovery', 'Workspace'],
    keyMetrics: { 'Priority 1 Capabilities': '7 identified', 'Maturity Gaps': 'Incident, Self-Service, Knowledge, Reporting, Automation' },
    notes: 'New ITSM instance recommended. SAP integration for onboarding/asset management.',
  },
  {
    id: 'ihg-2025',
    customer: 'IHG Hotels & Resorts',
    vertical: 'Hospitality',
    region: 'Global (AMER, EMEA, APAC)',
    status: 'completed',
    type: 'value-proposal',
    startDate: '2025-07-01',
    summary: 'EPM to Neurons DEX dual entitlement migration. 87,000 devices. $11.8M total benefits, 239% ROI, 7-month payback.',
    products: ['Neurons for DEX', 'Neurons for Patching', 'EPM (legacy)'],
    keyMetrics: { 'Devices': '87,000', 'Total Benefits (2yr)': '$11.8M', 'Investment (2yr)': '$3.45M', 'ROI': '239%', 'Payback': '7 months' },
    notes: 'Hybrid Neurons + single core server for AMER/EMEA. China remains USB provisioning.',
  },
];

const statusColors: Record<string, string> = {
  active: 'bg-green-500/20 text-green-400',
  completed: 'bg-blue-500/20 text-blue-400',
  pending: 'bg-amber-500/20 text-amber-400',
};

const typeLabels: Record<string, string> = {
  'roi-hypothesis': 'ROI Hypothesis',
  'capability-assessment': 'Capability Assessment',
  'value-proposal': 'Value Proposal',
};

export default function ProjectsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const frameworkOrder: Framework[] = ['value-cloud', 'maturity-assessment', 'general'];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Strategic Projects by Framework */}
      <div>
        <h2 className="text-sm font-semibold text-[#555] uppercase tracking-wider mb-4">Strategic Projects</h2>

        {frameworkOrder.map((fw) => {
          const fwProjects = strategicProjects.filter(p => p.framework === fw);
          if (fwProjects.length === 0 && fw === 'maturity-assessment') {
            // Show empty state for maturity assessment
            return (
              <div key={fw} className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${frameworkMeta[fw].bgColor} ${frameworkMeta[fw].color}`}>
                    {frameworkMeta[fw].label}
                  </span>
                  <span className="text-[10px] text-[#444]">0 projects</span>
                </div>
                <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6 text-center">
                  <div className="text-xs text-[#555]">No maturity assessment projects yet</div>
                </div>
              </div>
            );
          }
          if (fwProjects.length === 0) return null;
          const meta = frameworkMeta[fw];
          return (
            <div key={fw} className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${meta.bgColor} ${meta.color}`}>
                  {meta.label}
                </span>
                <span className="text-[10px] text-[#444]">{fwProjects.length} projects</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {fwProjects.map((sp) => (
                  <Link key={sp.href} href={sp.href}
                    className={`bg-[#111] border ${meta.borderColor} rounded-xl p-4 hover:bg-[#141414] transition-all group`}>
                    <div className="flex items-start justify-between mb-2">
                      <Zap size={14} className={meta.color} />
                      <span className={`text-[9px] px-1.5 py-0.5 rounded ${statusColors[sp.status]}`}>{sp.status}</span>
                    </div>
                    <div className="text-xs font-bold text-white mb-1 group-hover:text-purple-300 transition-colors leading-tight">{sp.title}</div>
                    <div className="text-[10px] text-[#666] leading-relaxed line-clamp-2">{sp.desc}</div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Customer Engagements */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[#555] uppercase tracking-wider">Customer Engagements</h2>
          <div className="flex gap-2">
            {['active', 'completed', 'pending'].map((s) => {
              const count = projects.filter((p) => p.status === s).length;
              if (!count) return null;
              return (
                <span key={s} className={`text-xs px-2 py-1 rounded ${statusColors[s]}`}>
                  {count} {s}
                </span>
              );
            })}
          </div>
        </div>

        {projects.map((p) => {
          const isOpen = expandedId === p.id;
          return (
            <div key={p.id} className="bg-[#111] border border-[#222] rounded-xl overflow-hidden mb-3">
              <button onClick={() => setExpandedId(isOpen ? null : p.id)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] flex items-center justify-center">
                    <Building2 size={18} className="text-[#555]" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">{p.customer}</div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-[#666] flex items-center gap-1"><Tag size={10} />{p.vertical}</span>
                      <span className="text-xs text-[#666] flex items-center gap-1"><MapPin size={10} />{p.region}</span>
                      <span className="text-xs text-[#666] flex items-center gap-1"><Calendar size={10} />{p.startDate}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded bg-purple-500/10 text-purple-400">{typeLabels[p.type]}</span>
                  <span className={`text-xs px-2 py-1 rounded ${statusColors[p.status]}`}>{p.status}</span>
                  <ChevronRight size={16} className={`text-[#555] transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                </div>
              </button>
              {isOpen && (
                <div className="px-5 pb-5 space-y-4 border-t border-[#222] pt-4">
                  <p className="text-sm text-[#999]">{p.summary}</p>
                  <div>
                    <div className="text-xs font-semibold text-[#555] mb-2">Products</div>
                    <div className="flex flex-wrap gap-1.5">
                      {p.products.map((prod) => (
                        <span key={prod} className="text-xs bg-white/5 text-[#999] px-2 py-1 rounded">{prod}</span>
                      ))}
                    </div>
                  </div>
                  {p.keyMetrics && (
                    <div>
                      <div className="text-xs font-semibold text-[#555] mb-2">Key Metrics</div>
                      <div className="grid grid-cols-3 gap-2">
                        {Object.entries(p.keyMetrics).map(([k, v]) => (
                          <div key={k} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-3">
                            <div className="text-xs text-[#555]">{k}</div>
                            <div className="text-sm font-semibold text-white mt-0.5">{v}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {p.notes && (
                    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-3">
                      <div className="text-xs font-semibold text-[#555] mb-1">Notes</div>
                      <div className="text-xs text-[#888] leading-relaxed">{p.notes}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
