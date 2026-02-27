import Link from 'next/link';
import { User, FileText, Megaphone, Compass, ExternalLink, ArrowRight } from 'lucide-react';

const sections = [
  {
    href: '/linkedin/profile',
    icon: User,
    color: 'text-blue-400',
    border: 'border-blue-500/20 hover:border-blue-500/50',
    label: 'Profile Lab',
    desc: 'Optimized headline, about, experience. 3× Top Voice. 68K+ audience.',
    status: 'Rewritten',
    statusColor: 'text-green-400',
  },
  {
    href: '/linkedin/resume',
    icon: FileText,
    color: 'text-purple-400',
    border: 'border-purple-500/20 hover:border-purple-500/50',
    label: 'Resume Workshop',
    desc: 'ATS-optimized. Value Engineering framing. Quantified bullets.',
    status: 'In review',
    statusColor: 'text-yellow-400',
  },
  {
    href: '/linkedin/content',
    icon: Megaphone,
    color: 'text-orange-400',
    border: 'border-orange-500/20 hover:border-orange-500/50',
    label: 'Content Strategy',
    desc: '"Build in public" series. 10 viral post ideas. Automation workflow.',
    status: '10 ideas',
    statusColor: 'text-blue-400',
  },
  {
    href: '/linkedin/career',
    icon: Compass,
    color: 'text-green-400',
    border: 'border-green-500/20 hover:border-green-500/50',
    label: 'AI Career Pivot',
    desc: 'Transitioning to AI-era roles. OpenClaw as a skill. Future-proofing.',
    status: 'Planned',
    statusColor: 'text-[#555]',
  },
];

export default function LinkedInPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">LinkedIn Suite</h1>
          <p className="text-sm text-[#555] mt-0.5">Profile, resume, content strategy — all optimized</p>
        </div>
        <a
          href="https://www.linkedin.com/in/erickdronski/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-[#555] hover:text-blue-400 border border-[#222] hover:border-blue-500/40 px-3 py-1.5 rounded-lg transition-all"
        >
          <ExternalLink size={11} />
          View Profile
        </a>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Connections', value: '18K+' },
          { label: 'Top Voice', value: '3×' },
          { label: 'LinkedIn', value: '18K' },
          { label: 'TikTok', value: '50K' },
        ].map((s) => (
          <div key={s.label} className="bg-[#111] border border-[#222] rounded-xl p-4 text-center">
            <div className="text-xl font-bold text-white">{s.value}</div>
            <div className="text-xs text-[#555] mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Section cards */}
      <div className="grid grid-cols-2 gap-4">
        {sections.map((s) => (
          <Link key={s.href} href={s.href} className={`bg-[#111] border ${s.border} rounded-xl p-5 transition-all group`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#1a1a1a] rounded-lg flex items-center justify-center">
                  <s.icon size={16} className={s.color} />
                </div>
                <span className="font-semibold text-white">{s.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs ${s.statusColor}`}>{s.status}</span>
                <ArrowRight size={14} className="text-[#444] group-hover:text-white transition-colors" />
              </div>
            </div>
            <p className="text-xs text-[#555] leading-relaxed">{s.desc}</p>
          </Link>
        ))}
      </div>

      {/* Quick headline preview */}
      <div className="bg-[#111] border border-[#222] rounded-xl p-5">
        <div className="text-xs text-[#555] mb-2 uppercase tracking-wide">Current Headline</div>
        <p className="text-sm text-white leading-relaxed">
          3× LinkedIn Top Voice | Value Engineer @ Ivanti | CEO &amp; Co-Founder @ PrecisionAlgorithms | Building AI systems that bridge strategy and execution | 68K+ audience
        </p>
      </div>
    </div>
  );
}
