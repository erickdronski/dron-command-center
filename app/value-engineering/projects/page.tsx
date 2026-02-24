'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Building2, Calendar, ChevronRight, MapPin, Users, Tag, ExternalLink, Zap, ArrowRight } from 'lucide-react';

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
    keyMetrics: {
      'Employees': '~9,500',
      'Endpoints': '~15,000',
      'Annual Hours (UK)': '1,538',
      'Annual Tickets': '~90,000',
      'Analyst Seats': '400 concurrent',
      'Annual Investment': '~£308,824',
      'Deal Term': '4 years (2027-2031)',
    },
    notes: 'No confirmed cyber breaches — breach benefits set to Soft. JISC reports UK higher ed heavily targeted. Student + staff tickets in scope given 400 analyst seats.',
  },
  {
    id: 'conair-2025',
    customer: 'Conair',
    vertical: 'Consumer Products / Manufacturing',
    region: 'US',
    status: 'completed',
    type: 'capability-assessment',
    startDate: '2025-09-24',
    summary: 'Full Capability & Maturity workshop. Low maturity in Incident, Self-Service, Knowledge, Reporting, Automation. Crawl/Walk/Run roadmap delivered.',
    products: ['ITSM', 'ITAM', 'Discovery', 'Workspace'],
    keyMetrics: {
      'Priority 1 Capabilities': '7 identified',
      'Maturity Gaps': 'Incident, Self-Service, Knowledge, Reporting, Automation',
    },
    notes: 'New ITSM instance recommended. SAP integration for onboarding/asset management. Global support strategy.',
  },
  {
    id: 'ihg-2025',
    customer: 'IHG Hotels & Resorts',
    vertical: 'Hospitality',
    region: 'Global (AMER, EMEA, APAC)',
    status: 'completed',
    type: 'value-proposal',
    startDate: '2025-07-01',
    summary: 'EPM to Neurons DEX dual entitlement migration. 87,000 devices across corporate + hotel properties. $11.8M total benefits, 239% ROI, 7-month payback.',
    products: ['Neurons for DEX', 'Neurons for Patching', 'EPM (legacy)'],
    keyMetrics: {
      'Devices': '87,000',
      'Total Benefits (2yr)': '$11.8M',
      'Investment (2yr)': '$3.45M',
      'ROI': '239%',
      'Payback': '7 months',
    },
    notes: 'Hybrid Neurons + single core server for AMER/EMEA. China remains USB provisioning. Dual entitlement during migration.',
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

  const strategicProjects = [
    {
      href: '/value-engineering/projects/glasgow',
      title: 'University of Glasgow — Value Hypothesis',
      desc: 'Talk track & ROI hypothesis for Neurons for ITSM. £503K/yr financial + 5,735 hrs saved. Ready for customer call.',
      status: 'active',
      color: 'border-blue-500/30',
    },
    {
      href: '/value-engineering/projects/bingo-card',
      title: 'Sales Bingo Card Automation',
      desc: 'Executive proposal to automate manual portfolio assembly — 126 hrs/rep/yr saved, 564%+ ROI',
      status: 'active',
      color: 'border-purple-500/30',
    },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Strategic Projects */}
      <div>
        <h2 className="text-sm font-semibold text-[#555] uppercase tracking-wider mb-3">Strategic Projects</h2>
        <div className="space-y-3">
          {strategicProjects.map((sp) => (
            <Link key={sp.href} href={sp.href}
              className={`block bg-[#111] border ${sp.color} rounded-xl p-5 hover:bg-[#141414] transition-all group`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap size={18} className="text-purple-400" />
                  <div>
                    <div className="text-sm font-bold text-white">{sp.title}</div>
                    <div className="text-xs text-[#666] mt-0.5">{sp.desc}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded ${statusColors[sp.status]}`}>{sp.status}</span>
                  <ArrowRight size={16} className="text-[#333] group-hover:text-[#666] transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Customer Engagements */}
      <h2 className="text-sm font-semibold text-[#555] uppercase tracking-wider mb-0">Customer Engagements</h2>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-[#666]">{projects.length} engagements tracked</p>
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
          <div key={p.id} className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
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

                {/* Products */}
                <div>
                  <div className="text-xs font-semibold text-[#555] mb-2">Products</div>
                  <div className="flex flex-wrap gap-1.5">
                    {p.products.map((prod) => (
                      <span key={prod} className="text-xs bg-white/5 text-[#999] px-2 py-1 rounded">{prod}</span>
                    ))}
                  </div>
                </div>

                {/* Key Metrics */}
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

                {/* Notes */}
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
  );
}
