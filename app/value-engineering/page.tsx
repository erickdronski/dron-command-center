import Link from 'next/link';
import { BookOpen, FolderOpen, Calculator, Target, ArrowRight } from 'lucide-react';

const frameworks = [
  {
    title: 'Capability & Maturity Assessment',
    desc: '36 IT capabilities across 4 pillars. Maturity, Business Impact, and Priority measurements. On-site, virtual, or hybrid workshops.',
    pillars: ['Enterprise Service Management (13)', 'Endpoint Management & Security (12)', 'Exposure Management (4)', 'Foundations (8)'],
    icon: Target,
    color: 'text-blue-400',
    borderColor: 'border-blue-500/20',
  },
  {
    title: 'ROI Deal Deck / Value Cloud',
    desc: 'ROI calculator and business case hypothesis tool. Customer metrics + internally developed assumptions = financial and productivity outputs.',
    pillars: ['Financial Benefits (3-year ROI)', 'Productivity Benefits (hours saved)', 'Breach Risk / Cost Mitigation', 'Gartner & IBM verified sources'],
    icon: Calculator,
    color: 'text-green-400',
    borderColor: 'border-green-500/20',
  },
];

const quickLinks = [
  { href: '/value-engineering/prompt-toolkit', label: 'Prompt Toolkit', desc: '6-prompt chain for SEs, CSMs & VEs', icon: BookOpen, color: 'text-purple-400' },
  { href: '/value-engineering/projects', label: 'Active Projects', desc: 'Customer engagements & hypotheses', icon: FolderOpen, color: 'text-amber-400' },
];

export default function VEOverviewPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Frameworks */}
      <div>
        <h2 className="text-sm font-semibold text-[#555] uppercase tracking-wider mb-3">Frameworks</h2>
        <div className="grid grid-cols-2 gap-4">
          {frameworks.map((f) => (
            <div key={f.title} className={`bg-[#111] border ${f.borderColor} rounded-xl p-5`}>
              <div className="flex items-center gap-2 mb-3">
                <f.icon size={18} className={f.color} />
                <h3 className="text-sm font-bold text-white">{f.title}</h3>
              </div>
              <p className="text-xs text-[#888] mb-3 leading-relaxed">{f.desc}</p>
              <div className="space-y-1">
                {f.pillars.map((p) => (
                  <div key={p} className="text-xs text-[#666] flex items-center gap-1.5">
                    <span className={`w-1 h-1 rounded-full ${f.color} opacity-50`}></span>
                    {p}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-sm font-semibold text-[#555] uppercase tracking-wider mb-3">Tools & Workspace</h2>
        <div className="grid grid-cols-2 gap-4">
          {quickLinks.map((l) => (
            <Link key={l.href} href={l.href}
              className="bg-[#111] border border-[#222] rounded-xl p-5 hover:border-purple-500/30 transition-all group flex items-center justify-between">
              <div className="flex items-center gap-3">
                <l.icon size={20} className={`${l.color} group-hover:scale-110 transition-transform`} />
                <div>
                  <div className="text-sm font-semibold text-white">{l.label}</div>
                  <div className="text-xs text-[#666]">{l.desc}</div>
                </div>
              </div>
              <ArrowRight size={16} className="text-[#333] group-hover:text-[#666] transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="bg-[#111] border border-[#222] rounded-xl p-5">
        <h2 className="text-sm font-semibold text-[#555] uppercase tracking-wider mb-3">Value Engineering Team</h2>
        <div className="grid grid-cols-5 gap-3">
          {[
            { name: 'Matt Gacek', role: 'Manager' },
            { name: 'Erick Dronski', role: 'Value Engineer' },
            { name: 'Neal Edrich', role: 'Value Engineer' },
            { name: 'Chad Arjoon', role: 'Value Engineer' },
            { name: 'Diane Holden', role: 'Value Engineer' },
          ].map((m) => (
            <div key={m.name} className="text-center">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm font-bold mx-auto mb-1">
                {m.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="text-xs text-white font-medium">{m.name}</div>
              <div className="text-[10px] text-[#555]">{m.role}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
