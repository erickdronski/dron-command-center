import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const priorities = [
  { level: '🔴 High', item: 'Add "Value Engineering" framing throughout', impact: 'Role alignment' },
  { level: '🔴 High', item: 'Quantify 5–7 key bullets with real numbers', impact: 'Credibility' },
  { level: '🔴 High', item: 'Fix dates (Scale CSM start date unclear)', impact: 'Professionalism' },
  { level: '🟡 Med', item: 'Add Skills section', impact: 'ATS scoring' },
  { level: '🟡 Med', item: 'Trim SpotOn / Marlin to 1-2 lines or "Earlier Experience"', impact: 'Focus' },
  { level: '🟢 Low', item: 'Reformat for whitespace on mobile/print', impact: 'Readability' },
];

const reframes = [
  {
    section: 'CoE / Scale CSM Role',
    before: 'Drove revenue growth by identifying upsell opportunities',
    after: 'Identified and closed $500K+ in expansion ARR through value-based upsell motions',
  },
  {
    section: 'Assessment Work',
    before: 'Led enterprise capability assessments',
    after: 'Built 50+ ROI/TCO models in Value Cloud, influencing $XM in pipeline',
  },
  {
    section: 'Digital Platform',
    before: 'Co-developed a redesigned digital framework experience',
    after: 'Co-developed digital assessment platform used for self-service discovery at scale; cut report time from 5 days to 1',
  },
];

const skills = [
  'Value Engineering',
  'ROI / TCO Modeling',
  'Business Case Development',
  'Executive Communication',
  'Customer Success',
  'Data Analytics',
  'ITSM / ITAM',
  'Cross-Functional Leadership',
  'Global Enablement',
  'Salesforce',
  'Value Cloud',
  'Artificial Intelligence',
  'Generative AI',
  'Enterprise SaaS',
];

export default function ResumeWorkshopPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Link href="/linkedin" className="text-[#555] hover:text-white transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Resume Workshop</h1>
          <p className="text-sm text-[#555] mt-0.5">ATS optimization · Value Engineering framing · Quantified bullets</p>
        </div>
      </div>

      {/* What's working */}
      <div className="bg-[#111] border border-[#222] rounded-xl p-5">
        <div className="text-xs text-[#555] uppercase tracking-wide font-medium mb-3">✅ What&apos;s Working</div>
        <div className="space-y-1.5 text-sm text-[#888]">
          {[
            'Strong career progression: CSM → CoE Strategist → Scale CSM → Value Engineer',
            'MBA in Data Analytics is a real differentiator for Value Engineering roles',
            'PrecisionAlgorithms shows entrepreneurial drive and founder range',
            'Global enablement experience (EMEA/APAC) is valuable and rare',
            'Value Cloud platform expertise is gold — lean into it',
          ].map((item, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-green-400">→</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Priority fixes */}
      <div className="bg-[#111] border border-[#222] rounded-xl p-5">
        <div className="text-xs text-[#555] uppercase tracking-wide font-medium mb-3">Priority Action Items</div>
        <div className="space-y-2">
          {priorities.map((p) => (
            <div key={p.item} className="grid grid-cols-[80px_1fr_100px] gap-3 text-xs items-start">
              <span className="text-[#888]">{p.level}</span>
              <span className="text-white">{p.item}</span>
              <span className="text-[#555] text-right">{p.impact}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Before/After reframes */}
      <div className="bg-[#111] border border-[#222] rounded-xl p-5">
        <div className="text-xs text-[#555] uppercase tracking-wide font-medium mb-4">Before / After — Bullet Rewrites</div>
        <div className="space-y-4">
          {reframes.map((r) => (
            <div key={r.section}>
              <div className="text-xs text-[#555] mb-2">{r.section}</div>
              <div className="space-y-1.5">
                <div className="flex gap-2 text-xs">
                  <span className="text-red-400 w-8 flex-shrink-0">✗</span>
                  <span className="text-[#666]">{r.before}</span>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="text-green-400 w-8 flex-shrink-0">✓</span>
                  <span className="text-white">{r.after}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills to add */}
      <div className="bg-[#111] border border-[#222] rounded-xl p-5">
        <div className="text-xs text-[#555] uppercase tracking-wide font-medium mb-3">Skills Section — Core Competencies</div>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span key={skill} className="text-xs bg-[#1a1a1a] border border-[#333] text-[#888] px-2.5 py-1 rounded-full">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-[#111] border border-[#222] rounded-xl p-4 text-xs text-[#555]">
        Status: Resume audit complete. Next step — rewrite specific sections with Value Engineering language and quantify 5–7 bullets with real numbers.
      </div>
    </div>
  );
}
