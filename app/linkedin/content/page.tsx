import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const postIdeas = [
  {
    id: 1,
    headline: '"I made my AI apply to jobs on my behalf to see if it could replace me"',
    hook: 'Have the agent write a cover letter for your own job, at your own company, using your own resume. Post the cover letter. The twist: it\'s better than what you\'d write.',
    why: 'Hits the deepest fear of business people. Makes them screenshot and share.',
    effort: 'Low',
  },
  {
    id: 2,
    headline: '"My AI got into an argument with another AI on a social network for bots"',
    hook: 'Moltbook is real — bots post and interact. Put your agent on there, screenshot it getting into a philosophical debate with someone else\'s agent.',
    why: 'Bots beefing is inherently hilarious to business people. Pure novelty.',
    effort: 'Med',
  },
  {
    id: 3,
    headline: '"I gave my AI agent a formal performance review"',
    hook: 'Pull activity logs from the Live Feed. Calculate uptime, tasks completed, error rate. Write a formal performance review. Give it a rating and a development plan.',
    why: 'The absurdity of HR-ing your own bot. Everyone will tag their IT teams.',
    effort: 'Low',
  },
  {
    id: 4,
    headline: '"My AI agent has better work-life balance than I do"',
    hook: 'Show the cron schedule — structured hours, defined scope, scheduled intervals. Meanwhile you\'re answering Slack at midnight. Screenshot cron calendar vs your screen time.',
    why: 'Every burned-out professional will relate instantly.',
    effort: 'Low',
  },
  {
    id: 5,
    headline: '"My AI trades weather markets. It\'s up $47. I spent $200 on compute."',
    hook: 'Brutally honest P&L. Show trading results alongside OpenClaw/API costs. The math doesn\'t math — and that\'s the point.',
    why: 'Business people LOVE honest ROI breakdowns, especially negative ones.',
    effort: 'Low',
  },
  {
    id: 6,
    headline: '"I built a command center to monitor AI agents that monitor things for me"',
    hook: 'You built a dashboard to watch bots that watch markets that watch weather. Screenshot the full command center. It\'s monitoring layers deep.',
    why: 'The recursion is the content. Tech people and suits both get it.',
    effort: 'Low',
  },
  {
    id: 7,
    headline: '"I automated my morning routine and now my AI knows I\'m late before I do"',
    hook: 'Set up a morning briefing cron: weather, calendar, unread emails, market positions. If you\'re not active by 9am, it pings you. Screenshot the morning briefing.',
    why: 'Tangible, relatable, slightly paranoid. People love quantified daily routines.',
    effort: 'Med',
  },
  {
    id: 8,
    headline: '"My AI wrote this post. I\'m reviewing it from the beach."',
    hook: 'Actually have the agent draft the LinkedIn post, screenshot the Discord conversation where you approve it, then post it. Show the back-and-forth.',
    why: 'Meta content that proves the workflow. Self-referential is always engaging.',
    effort: 'Low',
  },
  {
    id: 9,
    headline: '"I taught my AI to roast my bad trades"',
    hook: 'When a trade closes at a loss, the agent sends a sarcastic Discord message. "Congrats on buying Wembanyama 8+ assists at 7¢. He had 2." Screenshot the roasts.',
    why: 'Finance + humor + AI = guaranteed engagement. Rare combo.',
    effort: 'Low',
  },
  {
    id: 10,
    headline: '"My AI has a better memory than me. Literally."',
    hook: 'Show the MEMORY.md and memory/ system. Your agent remembers every decision, every project detail. You forgot what you had for lunch. Screenshot memory files vs a poll about Q3 OKRs.',
    why: 'Universal relatability. Every person who loses notes will feel this.',
    effort: 'Low',
  },
];

const postFormat = `[Funny headline]

[2-3 sentences of setup]

[What I actually built — specific, technical]

[The punchline / honest realization]

[Screenshot proving it's real]

#AI #OverEngineered #BuildingInPublic`;

export default function ContentStrategyPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Link href="/linkedin" className="text-[#555] hover:text-white transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Content Strategy</h1>
          <p className="text-sm text-[#555] mt-0.5">&quot;Build in public&quot; series — 10 post ideas, all executable from existing systems</p>
        </div>
      </div>

      {/* Series format */}
      <div className="bg-[#111] border border-[#222] rounded-xl p-5">
        <div className="text-xs text-[#555] uppercase tracking-wide font-medium mb-3">Series Format — Every Post</div>
        <pre className="text-sm text-[#888] whitespace-pre-wrap font-mono leading-relaxed">{postFormat}</pre>
      </div>

      {/* Post ideas */}
      <div className="space-y-3">
        {postIdeas.map((p) => (
          <div key={p.id} className="bg-[#111] border border-[#222] rounded-xl p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-start gap-3">
                <span className="text-[#555] text-sm font-mono w-5 flex-shrink-0">{p.id}.</span>
                <div className="text-sm font-medium text-white leading-snug">{p.headline}</div>
              </div>
              <span className={`text-xs flex-shrink-0 px-2 py-0.5 rounded-full border ${
                p.effort === 'Low'
                  ? 'text-green-400 border-green-500/30 bg-green-500/10'
                  : 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10'
              }`}>
                {p.effort}
              </span>
            </div>
            <p className="text-xs text-[#666] ml-8 mb-2 leading-relaxed">{p.hook}</p>
            <p className="text-xs text-[#444] ml-8 italic">{p.why}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#111] border border-[#222] rounded-xl p-4 text-xs text-[#555]">
        All 10 ideas use systems that already exist. Posts #3, #5, #6, #9 can be published this week with no new builds.
      </div>
    </div>
  );
}
