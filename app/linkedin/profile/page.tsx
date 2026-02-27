import Link from 'next/link';
import { ArrowLeft, Copy } from 'lucide-react';

const sections = [
  {
    title: 'Headline',
    content: `3× LinkedIn Top Voice | Value Engineer @ Ivanti | CEO & Co-Founder @ PrecisionAlgorithms | Building AI systems that bridge strategy and execution | 68K+ audience`,
  },
  {
    title: 'About',
    content: `I help enterprise leaders turn AI hype into measurable outcomes.

3× LinkedIn Top Voice. 68K+ audience across LinkedIn and TikTok. I operate at the intersection of value engineering, AI readiness, and enterprise transformation — designing frameworks that connect emerging tech to executive decision-making.

At Ivanti, I lead AI-readiness maturity assessments and ROI-driven business cases for Fortune 500 customers. I built self-service digital assessment platforms, scaled enablement programs across EMEA/APAC, and integrated AI capability modeling into enterprise value methodologies.

Outside the day job, I'm CEO & Co-Founder of PrecisionAlgorithms — an AI-powered predictive analytics platform for algorithmic trading. We're building the infrastructure for data-driven decision making in volatile markets.

I write about AI adoption, value strategy, and the future of autonomous enterprise systems. The operators who win will be the ones who can translate strategy into scalable, AI-enabled workflows.

Currently: Scaling value engineering frameworks | Building AI trading systems | Growing 68K+ audience`,
  },
  {
    title: 'Value Engineer @ Ivanti (Jan 2026 – Present)',
    content: `• Lead AI-readiness maturity workshops for enterprise customers, translating discovery into strategic roadmaps and business cases
• Built AI-enabled workflows that cut content generation and framework delivery time by 60%
• Co-developed digital assessment platform now used for self-service customer discovery at scale
• Scaled enablement programs across Sales, CSMs, and Solution Engineering — 50+ stakeholders trained, 3x pipeline to Value Engineering
• Drive inbound through LinkedIn thought leadership: framework assets → content → traffic → assessments`,
  },
  {
    title: 'Customer Success Center of Excellence (CoE) Strategist @ Ivanti (Apr 2024 – Jan 2026)',
    content: `• Facilitated 50+ enterprise capability assessments (virtual + onsite) across EMEA and APAC
• Standardized CoE delivery processes; automated assessment outputs, cutting report time from 5 days to 1
• Partnered with Product/Marketing to launch self-guided digital assessment platform
• Co-presented enterprise frameworks at Ivanti LIVE 2026 to 1000+ customers and partners`,
  },
  {
    title: 'Scale Customer Success Manager @ Ivanti (Aug 2023 – Jan 2026)',
    content: `• 6-month strategic assignment to scale team capabilities and integrate maturity frameworks into upsell motion
• Owned onboarding, adoption, and renewal programs; reduced churn risk on $XM portfolio
• Executed upsell/cross-sell plays with Account Executives, expanding footprint in strategic accounts`,
  },
  {
    title: 'CEO & Co-Founder @ PrecisionAlgorithms (Dec 2023 – Present)',
    content: `• Building AI-powered predictive analytics platform for algorithmic trading — machine learning models that identify edge in volatile markets
• Led go-to-market strategy, securing initial client base and strategic partnerships
• Oversee product, brand, and capital allocation; team of X, $X revenue, growing X% MoM
• Combining enterprise-grade data infrastructure with retail-accessible trading tools`,
  },
  {
    title: 'Top Skills',
    content: `• Artificial Intelligence (AI)
• Generative AI
• Value Engineering
• Enterprise SaaS
• Algorithmic Trading
• ROI Strategy
• Data Analytics
• Executive Communication
• LinkedIn / Social Media Growth
• Maturity Assessments`,
  },
];

export default function ProfileLabPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Link href="/linkedin" className="text-[#555] hover:text-white transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Profile Lab</h1>
          <p className="text-sm text-[#555] mt-0.5">AI-optimized LinkedIn profile — copy-paste ready</p>
        </div>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3 text-xs text-yellow-400">
        Replace placeholders: <code className="bg-yellow-500/10 px-1 rounded">$X revenue</code>, <code className="bg-yellow-500/10 px-1 rounded">X% MoM</code>, <code className="bg-yellow-500/10 px-1 rounded">$XM portfolio</code> with real numbers before publishing.
      </div>

      <div className="space-y-4">
        {sections.map((s) => (
          <div key={s.title} className="bg-[#111] border border-[#222] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs text-[#555] uppercase tracking-wide font-medium">{s.title}</div>
            </div>
            <pre className="text-sm text-white whitespace-pre-wrap font-sans leading-relaxed">{s.content}</pre>
          </div>
        ))}
      </div>

      <div className="bg-[#111] border border-[#222] rounded-xl p-5">
        <div className="text-xs text-[#555] uppercase tracking-wide font-medium mb-3">Audit — What Was Fixed</div>
        <div className="space-y-2">
          {[
            ['Headline', 'Was a job title graveyard. Now leads with Top Voice + audience size.'],
            ['Summary', 'Cut bloat by 40%. Front-loaded credibility. Added line breaks for mobile.'],
            ['Experience', 'Added outcome-oriented bullets. Removed fluffy verbs.'],
            ['PrecisionAlgorithms', 'Rewritten to sound like a real startup, not a consulting deck.'],
            ['Skills', 'Added AI, Generative AI, Algorithmic Trading for SEO + ATS visibility.'],
          ].map(([key, val]) => (
            <div key={key} className="flex gap-3 text-xs">
              <span className="text-green-400 font-medium w-32 flex-shrink-0">{key}</span>
              <span className="text-[#888]">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
