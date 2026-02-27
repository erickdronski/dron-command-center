import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CareerPivotPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Link href="/linkedin" className="text-[#555] hover:text-white transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">AI Career Pivot</h1>
          <p className="text-sm text-[#555] mt-0.5">Transitioning to AI-era roles · Future-proofing your career</p>
        </div>
      </div>

      <div className="bg-[#111] border border-[#222] rounded-xl p-5">
        <div className="text-xs text-[#555] uppercase tracking-wide font-medium mb-3">Core Thesis</div>
        <p className="text-sm text-[#888] leading-relaxed">
          The next career moat isn't a skill — it's a system. People who win in the AI era won't be those who know how to use AI. 
          They'll be those who've built autonomous AI operations around their work. You're already doing this. 
          The opportunity is positioning it publicly.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          {
            title: 'The "AI Operator" positioning',
            items: [
              'Not a developer — a strategist who deploys AI systems',
              'Builds autonomous workflows, not just prompts',
              'Runs multiple AI agents as a team, not tools',
              'Has measurable output: trading bots, content bots, dashboards',
            ],
          },
          {
            title: 'Skills to surface publicly',
            items: [
              'OpenClaw agent management (novel, scarce)',
              'Multi-agent orchestration across domains',
              'Value Engineering × AI — quantifiable ROI framing',
              'Building in public: audience + credibility loop',
            ],
          },
          {
            title: 'Career moves this enables',
            items: [
              'AI Product Manager at enterprise SaaS cos',
              'Head of AI Adoption / AI Center of Excellence lead',
              'Solo founder of AI-native tools (PrecisionAlgorithms)',
              'Enterprise AI consultant (Value Engineering angle)',
            ],
          },
          {
            title: 'Content that builds the brand',
            items: [
              'Show your stack: OpenClaw + Discord + Vercel',
              'Post P&Ls from bots (honest = engaging)',
              'Document what fails, not just what works',
              'Frame Value Engineering as AI\'s killer app',
            ],
          },
        ].map((card) => (
          <div key={card.title} className="bg-[#111] border border-[#222] rounded-xl p-4">
            <div className="text-xs text-[#555] uppercase tracking-wide font-medium mb-3">{card.title}</div>
            <div className="space-y-1.5">
              {card.items.map((item) => (
                <div key={item} className="flex gap-2 text-xs text-[#888]">
                  <span className="text-purple-400 flex-shrink-0">→</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#111] border border-[#333] rounded-xl p-4 text-xs text-[#555]">
        Status: Planned — build this out with your actual story. The differentiation is real, it just needs documenting.
      </div>
    </div>
  );
}
