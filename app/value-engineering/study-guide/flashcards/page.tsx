'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, RotateCcw, ChevronLeft, ChevronRight, Shuffle, CheckCircle2, XCircle, BookOpen, Eye, Settings, Zap, Monitor, Shield } from 'lucide-react';

/* ────────────────────────────────────────────
   DATA — inline from study guide benefits
   ──────────────────────────────────────────── */

type Flashcard = {
  id: string;
  benefitName: string;
  solution: string;
  subcategory: string;
  scenario: string;
  talkTrack: string;
  exampleMetric: string;
};

const flashcards: Flashcard[] = [
  { id: 'high-priority-routing', benefitName: 'High Priority Ticket Routing', solution: 'ITSM', subcategory: 'Penalties & Fines Avoidance', scenario: 'A critical incident gets logged but sits in a general queue for 40+ minutes before someone realizes it\'s high-severity. The SLA clock is ticking.', talkTrack: 'Automated priority routing reads ticket context and puts critical issues in front of the right team immediately. The 20% improvement means 1 in 5 potential SLA breaches gets caught before it becomes a real problem.', exampleMetric: '$250K penalty exposure × 20% = $50K in avoided penalties/year' },
  { id: 'reduced-aht', benefitName: 'Reduced Incident AHT (11%)', solution: 'ITSM', subcategory: 'Operational Efficiencies', scenario: 'Agents spend 10+ minutes per ticket just getting oriented — which user, which system, what happened before — before they even start troubleshooting.', talkTrack: 'Auto-categorization and context cards eliminate the lookup time. Instead of 10 min of investigation, the agent gets a pre-loaded card with the right workflow. 11% AHT reduction = real capacity back.', exampleMetric: '60,000 tickets × $26/ticket × 11% = $171.6K/year' },
  { id: 'knowledge', benefitName: 'Optimized Knowledge for Service Delivery', solution: 'ITSM', subcategory: 'Operational Efficiencies', scenario: 'The same 15 questions get submitted as tickets every week because documentation is buried in a SharePoint folder nobody can find.', talkTrack: 'Searchable self-service portal surfaces answers before users even submit a ticket. That 10% deflection means agents focus on real problems instead of being a human FAQ.', exampleMetric: '60,000 tickets × $26 × 10% = $156K/year' },
  { id: 'self-service', benefitName: 'Self-Service Portal Ticket Deflection', solution: 'ITSM', subcategory: 'Operational Efficiencies', scenario: 'Software access, hardware requests, and password changes all go through agents manually — things that could be automated with a self-service catalog.', talkTrack: 'A service catalog with automated fulfillment means employees get what they need faster without an agent touching it. Key: making self-service easy enough that people actually use it.', exampleMetric: '60,000 tickets × $26 × 15% = $234K/year' },
  { id: 'escalation', benefitName: 'Reduced Escalation Rate (L1→L2→L3)', solution: 'ITSM', subcategory: 'Operational Efficiencies', scenario: '35% of tickets escalate because L1 agents lack context or tools to resolve at first contact. Each escalation costs 3-4x more and adds hours to resolution.', talkTrack: 'AI-assisted suggestions help L1 agents resolve issues they would have previously escalated. A 12% reduction in escalation rate means thousands of tickets stay at the cheapest tier.', exampleMetric: '21,000 escalations × 12% reduction × $60+ cost differential = $150-250K/year' },
  { id: 'mttr', benefitName: 'Improved Mean Time to Resolution (MTTR)', solution: 'ITSM', subcategory: 'Productivity Recovery', scenario: 'Employees lose 6.5 hours/year waiting for IT issues to resolve. Across thousands of employees, that\'s tens of thousands of hours of lost productivity.', talkTrack: 'Better routing, SLA enforcement, and self-service reduce wait time. A 10% MTTR improvement across your employee base recovers thousands of productive hours — that\'s business productivity, not just IT metrics.', exampleMetric: '33,000 downtime hours × $120/hr × 10% = $396K in recovered productivity' },
  { id: 'change-mgmt', benefitName: 'Automated Change Management Efficiency', solution: 'ITSM', subcategory: 'Operational Efficiencies', scenario: '~4 outages/year caused by changes with unintended downstream effects. No visibility into what depends on the system being changed.', talkTrack: 'CMDB-informed impact analysis shows the blast radius before you approve a change. Dynamic approval policies route by risk level. The goal: fewer surprises when changes go live.', exampleMetric: '4 outages × $43K lost productivity × 20% reduction = $34.2K/year' },
  { id: 'problem-mgmt', benefitName: 'Proactive Problem Management', solution: 'ITSM', subcategory: 'Incident Prevention', scenario: 'The same 10 incidents repeat every month — same crashes, same failures. Each time treated as new. IT team stuck in firefighting mode.', talkTrack: 'Pattern detection identifies recurring incidents. Fix the root cause once, eliminate an entire category of incidents. 15% reduction in recurring incidents = less firefighting, more strategic work.', exampleMetric: '18,000 recurring tickets × 15% elimination = 2,700 fewer tickets/year' },
  { id: 'asset-rel', benefitName: 'Asset Relationship Management', solution: 'ESM', subcategory: 'Operational Efficiencies', scenario: '"How many devices are running outdated OS?" takes days of spreadsheet reconciliation to answer. Audits reveal 5-10% discrepancy between records and reality.', talkTrack: 'Automated asset relationships link every device to user, location, and compliance status. Audit prep goes from weeks to a same-day export. The real value is instant answers when auditors or leadership ask.', exampleMetric: '10 FTEs × $89K × 2% effort reduction = $17.8K + audit readiness' },
  { id: 'energy-fm', benefitName: 'Energy & Utility Cost Optimisation', solution: 'ESM', subcategory: 'Facilities Management', scenario: 'Multiple facilities with HVAC running independently, lights on in empty spaces, no visibility into which buildings drive costs.', talkTrack: 'FM data consolidation shows exactly where energy is wasted — HVAC running full blast in empty buildings, equipment running after hours. 5.6% improvement from operational data you couldn\'t see before.', exampleMetric: '$6.19M utilities × 5.6% = $346.6K/year' },
  { id: 'vendor-contracts', benefitName: 'Vendor Contract Insights', solution: 'ESM', subcategory: 'IT Asset Management', scenario: '500 licenses purchased, only 320 users active. Maintenance auto-renews at full price every year because nobody reviews usage before the date.', talkTrack: 'ITAM shows actual usage vs. licensed capacity, flags contracts 90 days before renewal, identifies over-licensing. 25% reduction from right-sizing, data-driven negotiation, and prevented auto-renewals.', exampleMetric: '$200K contract exposure × 25% = $50K/year' },
  { id: 'maintenance', benefitName: 'Improve Maintenance Efficiency', solution: 'ESM', subcategory: 'Facilities Management', scenario: 'Maintenance team spends 40% of time on emergency repairs — fixing things that broke unexpectedly instead of doing planned work.', talkTrack: 'Predictive capabilities prioritize by actual equipment condition, not fixed schedules. Shift from reactive to predictive means fewer emergencies, lower costs, equipment that lasts longer.', exampleMetric: '60 FM staff × $80.8K × 3.6% = $173.4K/year' },
  { id: 'grc', benefitName: 'Automated & Integrated Compliance Management', solution: 'ESM', subcategory: 'GRC', scenario: 'Compliance team spends 60% of time gathering evidence and compiling reports. Highly paid professionals doing data entry instead of actual risk management.', talkTrack: 'GRC automates evidence collection, assessment tracking, and report generation. Your team focuses on risk analysis and strategic guidance — not spreadsheet archaeology.', exampleMetric: '12 compliance + 6 audit FTEs × 15% efficiency = $233.4K/year' },
  { id: 'onboarding', benefitName: 'Streamline Employee Onboarding & Transitions', solution: 'ESM', subcategory: 'HR Service Management', scenario: 'Onboarding touches IT, HR, facilities, multiple departments. Most coordination is manual — emails back and forth, things fall through cracks, new hires aren\'t productive for days.', talkTrack: 'Automated workflows: HR approves → IT provisions → facilities assigns desk → security grants access. Each step triggers the next automatically. Fast onboarding = productivity from day one.', exampleMetric: '20 HRSM FTEs × $103.9K × 3.6% = $75K/year' },
  { id: 'ppm-delivery', benefitName: 'Improve Project Delivery Predictability', solution: 'ESM', subcategory: 'Project Portfolio Management', scenario: 'PMO team spends 30% of time compiling status reports. Leadership sees a picture that\'s already a week old when decisions need to be made today.', talkTrack: 'Automated reporting means your PMO team focuses on what matters: risk identification, resource optimization, stakeholder management. Real-time project health instead of weekly PowerPoint theater.', exampleMetric: '15 PMO FTEs × $100.8K × 6% = $90.7K/year' },
  { id: 'ppm-portfolio', benefitName: 'Make Smarter Portfolio Investment Decisions', solution: 'ESM', subcategory: 'Project Portfolio Management', scenario: '50+ projects running simultaneously but leadership can\'t easily see which deliver value. Investment decisions are based on who presents the best deck, not actual data.', talkTrack: 'Portfolio decisions should be data-driven, not politics-driven. Real-time view of every project\'s health, resource consumption, and expected value. Fund the right projects with confidence.', exampleMetric: '15 PMO FTEs × $100.8K × 4% = $60.5K/year' },
  { id: 'mdm-compliance', benefitName: 'Automated Security Compliance (MDM)', solution: 'UEM', subcategory: 'Mobile Device Management', scenario: 'IT team manually checks 10,000 devices for compliance weekly. By the time they finish, the first device is out of compliance again. Infinite cycle.', talkTrack: 'MDM automates compliance checks and enforces policies automatically — non-compliant device detected, policy pushed, compliance restored. Your team stops chasing devices and starts on real threats.', exampleMetric: 'Automating 10,000 devices saves ~$208K/year in IT staff time' },
  { id: 'mdm-support', benefitName: 'Reduced IT Support Costs (MDM)', solution: 'UEM', subcategory: 'Mobile Device Management', scenario: 'Device issues require physical access — employees ship devices in or visit the IT desk. Most issues are WiFi config, app reinstalls, or profile problems.', talkTrack: 'MDM enables remote troubleshooting — WiFi configs, app reinstalls, profile fixes, OS updates — without the user leaving their desk. Fewer tickets, faster resolution, less user downtime.', exampleMetric: 'Remote management reduces device support costs by ~$468K/year' },
  { id: 'exploitation', benefitName: 'Reduce Exploitation Recovery Costs', solution: 'Security', subcategory: 'Risk & Security', scenario: 'Exploit hits. Recovery requires system rebuilds, data restoration, incident response. The vulnerability had been in the backlog 3 months but was never prioritized.', talkTrack: 'RBVM uses threat intelligence to tell you what\'s actually being exploited in the wild and which of your systems are affected. Patch what matters before attackers get there. $40K per avoided recovery event.', exampleMetric: '5 prevented exploits × $40K = $200K/year in avoided recovery costs' },
  { id: 'incident-response', benefitName: 'Minimise Incident Response & Downtime Costs', solution: 'Security', subcategory: 'Risk & Security', scenario: 'Security incident triggers full response — forensics engaged, systems isolated, 8 hours of downtime at $5,600/hour. The exploited vuln had been flagged 6 months earlier.', talkTrack: 'RBVM reduces the number of successful exploits by fixing the riskiest ones first. Each $70K incident (response + downtime) you prevent pays for itself many times over.', exampleMetric: '5 fewer incidents × $69.8K each = $349K/year' },
  { id: 'zero-day', benefitName: 'Reduce Zero-Day Defense Cost', solution: 'Security', subcategory: 'Patch Management', scenario: 'Critical zero-day announced Friday afternoon. Current process takes 2-3 weeks to test, approve, and deploy. Every system is exposed for 2-3 weeks.', talkTrack: 'Automated patching with smart rules closes the exposure window from weeks to hours. Test, stage, deploy — automated. Reducing both the number of exploit events and emergency response costs.', exampleMetric: 'Faster zero-day response saves ~$93.6K/year' },
  { id: 'remote-access', benefitName: 'Optimize Remote Access Costs', solution: 'Security', subcategory: 'Network & Access', scenario: 'Multiple legacy VPN solutions from different projects and acquisitions. Overlapping licenses, separate infrastructure, management overhead, and poor user experience.', talkTrack: 'Consolidate onto Connect Secure — fewer licenses, reduced hardware, simplified management, better security. Plus: users actually use it because it works, reducing shadow IT.', exampleMetric: 'Consolidation saves ~$350K/year in infrastructure and license costs' },
  { id: 'password-resets', benefitName: 'Elimination of Password Resets', solution: 'Security', subcategory: 'Zero Sign-On', scenario: 'Password resets are the #1 help desk ticket — 20-30% of total volume. Each one costs 8-12 min of agent time. Employee is idle the whole time.', talkTrack: 'ZSO eliminates passwords entirely. No passwords = no resets. No lockouts. No phishing. That\'s not a 10% improvement — it\'s eliminating the single largest ticket category completely.', exampleMetric: 'Eliminating password resets saves ~$561.6K/year' },
];

const solutionIcon: Record<string, React.ReactNode> = {
  ITSM: <Settings size={14} />,
  ESM: <Zap size={14} />,
  UEM: <Monitor size={14} />,
  Security: <Shield size={14} />,
};

const solutionColor: Record<string, string> = {
  ITSM: 'text-blue-400',
  ESM: 'text-amber-400',
  UEM: 'text-green-400',
  Security: 'text-red-400',
};

const solutionBg: Record<string, string> = {
  ITSM: 'bg-blue-500/10',
  ESM: 'bg-amber-500/10',
  UEM: 'bg-green-500/10',
  Security: 'bg-red-500/10',
};

/* ────────────────────────────────────────────
   FLASHCARD COMPONENT
   ──────────────────────────────────────────── */

export default function FlashcardsPage() {
  const [deck, setDeck] = useState<Flashcard[]>([...flashcards]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [revealMode, setRevealMode] = useState<'track' | 'scenario' | 'metric'>('track');
  const [results, setResults] = useState<Record<string, 'got-it' | 'missed'>>({});
  const [filterSolution, setFilterSolution] = useState<string>('all');
  const [finished, setFinished] = useState(false);

  const filteredDeck = filterSolution === 'all' ? deck : deck.filter(c => c.solution === filterSolution);
  const current = filteredDeck[index % filteredDeck.length];

  const shuffle = useCallback(() => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setIndex(0);
    setRevealed(false);
    setResults({});
    setFinished(false);
  }, []);

  const mark = (result: 'got-it' | 'missed') => {
    const newResults = { ...results, [current.id]: result };
    setResults(newResults);
    if (index + 1 >= filteredDeck.length) {
      setFinished(true);
    } else {
      setIndex(i => i + 1);
      setRevealed(false);
    }
  };

  const next = () => { setIndex(i => (i + 1) % filteredDeck.length); setRevealed(false); };
  const prev = () => { setIndex(i => (i - 1 + filteredDeck.length) % filteredDeck.length); setRevealed(false); };

  const gotIt = Object.values(results).filter(r => r === 'got-it').length;
  const missed = Object.values(results).filter(r => r === 'missed').length;
  const total = filteredDeck.length;
  const progress = ((gotIt + missed) / total) * 100;

  const solutions = ['all', ...new Set(flashcards.map(c => c.solution))];

  if (finished) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">{gotIt / total >= 0.8 ? '🎉' : gotIt / total >= 0.6 ? '💪' : '📚'}</div>
          <h2 className="text-3xl font-bold text-white mb-2">Round Complete!</h2>
          <div className="flex items-center justify-center gap-6 mt-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{gotIt}</div>
              <div className="text-[#555] text-sm">Got It</div>
            </div>
            <div className="w-px h-12 bg-[#222]" />
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400">{missed}</div>
              <div className="text-[#555] text-sm">Missed</div>
            </div>
            <div className="w-px h-12 bg-[#222]" />
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{Math.round((gotIt / total) * 100)}%</div>
              <div className="text-[#555] text-sm">Score</div>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={shuffle}
              className="flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-[#e0e0e0] transition-colors">
              <Shuffle size={16} /> Shuffle & Retry
            </button>
            <button onClick={() => { setIndex(0); setRevealed(false); setResults({}); setFinished(false); }}
              className="flex items-center gap-2 px-6 py-3 border border-[#333] text-white rounded-lg hover:bg-[#111] transition-colors">
              <RotateCcw size={16} /> Restart Same Deck
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link href="/value-engineering/study-guide" className="inline-flex items-center gap-1.5 text-[#555] hover:text-white text-sm mb-4 transition-colors">
        <ArrowLeft size={14} /> Back to Study Guide
      </Link>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">🃏 Flashcard Mode</h2>
          <p className="text-[#555] text-sm">Flip through benefits. Read the scenario, recall the talk track, then reveal it.</p>
        </div>
        <button onClick={shuffle}
          className="flex items-center gap-1.5 px-3 py-2 text-xs border border-[#333] text-[#888] rounded-lg hover:text-white hover:bg-[#111] transition-colors">
          <Shuffle size={12} /> Shuffle
        </button>
      </div>

      {/* Solution Filter */}
      <div className="flex gap-1 flex-wrap mb-4">
        {solutions.map(sol => (
          <button key={sol} onClick={() => { setFilterSolution(sol); setIndex(0); setRevealed(false); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-colors ${
              filterSolution === sol
                ? sol === 'all' ? 'bg-[#222] text-white' : `${solutionBg[sol]} ${solutionColor[sol]}`
                : 'text-[#555] hover:text-[#888] hover:bg-[#111]'
            }`}>
            {sol !== 'all' && solutionIcon[sol]}
            {sol === 'all' ? 'All' : sol}
          </button>
        ))}
      </div>

      {/* Reveal Mode Toggle */}
      <div className="flex gap-1 mb-5">
        <span className="text-[#555] text-xs self-center mr-1">Reveal:</span>
        {[
          { key: 'track' as const, label: 'Talk Track' },
          { key: 'scenario' as const, label: 'Scenario' },
          { key: 'metric' as const, label: 'Metric' },
        ].map(m => (
          <button key={m.key} onClick={() => { setRevealMode(m.key); setRevealed(false); }}
            className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
              revealMode === m.key ? 'bg-[#222] text-white' : 'text-[#555] hover:text-[#888] hover:bg-[#111]'
            }`}>{m.label}</button>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between text-xs text-[#555] mb-1">
          <span>{index + 1} of {filteredDeck.length}</span>
          <span className="flex items-center gap-3">
            <span className="text-green-400">{gotIt} ✓</span>
            <span className="text-red-400">{missed} ✗</span>
          </span>
        </div>
        <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
          <div className="h-full flex">
            <div className="bg-green-500 transition-all" style={{ width: `${(gotIt / total) * 100}%` }} />
            <div className="bg-red-500 transition-all" style={{ width: `${(missed / total) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Card */}
      {current && (
        <div className="border border-[#222] rounded-2xl overflow-hidden bg-[#111] mb-4">
          {/* Card Header */}
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-center gap-2 mb-3">
              <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${solutionBg[current.solution]} ${solutionColor[current.solution]}`}>
                {solutionIcon[current.solution]} {current.solution}
              </span>
              <span className="text-[#555] text-xs">{current.subcategory}</span>
            </div>
            <h3 className="text-white text-xl font-bold">{current.benefitName}</h3>
          </div>

          {/* Scenario (always visible) */}
          <div className="px-6 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={14} className="text-[#555]" />
              <span className="text-[#555] text-xs font-semibold uppercase tracking-wider">Scenario</span>
            </div>
            <p className="text-[#ccc] text-sm leading-relaxed">{current.scenario}</p>
          </div>

          {/* Reveal Area */}
          <div className="border-t border-[#1a1a1a] mx-4 mb-4" />
          <div className="px-6 pb-6">
            <div className="flex items-center gap-2 mb-3">
              <Eye size={14} className={revealed ? 'text-emerald-400' : 'text-[#444]'} />
              <span className={`text-xs font-semibold uppercase tracking-wider ${revealed ? 'text-emerald-400' : 'text-[#444]'}`}>
                {revealMode === 'track' ? 'Talk Track' : revealMode === 'scenario' ? 'Key Message' : 'Example Metric'}
              </span>
              {!revealed && (
                <span className="text-[#333] text-xs ml-1">(tap to reveal)</span>
              )}
            </div>

            {!revealed ? (
              <button onClick={() => setRevealed(true)}
                className="w-full py-8 border border-dashed border-[#2a2a2a] rounded-xl text-[#444] text-sm hover:border-[#444] hover:text-[#666] transition-colors flex items-center justify-center gap-2">
                <Eye size={16} /> Reveal Answer
              </button>
            ) : (
              <div className="bg-[#0a0a0a] border border-[#222] rounded-xl p-4">
                <p className="text-[#ccc] text-sm leading-relaxed">
                  {revealMode === 'track' ? current.talkTrack : revealMode === 'scenario' ? current.scenario : current.exampleMetric}
                </p>
              </div>
            )}
          </div>

          {/* Mark buttons (only after reveal) */}
          {revealed && (
            <div className="border-t border-[#1a1a1a] px-6 py-4 flex gap-3">
              <button onClick={() => mark('missed')}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/15 transition-colors text-sm font-medium">
                <XCircle size={16} /> Missed It
              </button>
              <button onClick={() => mark('got-it')}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-green-500/30 text-green-400 bg-green-500/5 hover:bg-green-500/15 transition-colors text-sm font-medium">
                <CheckCircle2 size={16} /> Got It
              </button>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={prev}
          className="flex items-center gap-1.5 px-4 py-2 text-sm border border-[#222] text-[#666] rounded-lg hover:text-white hover:bg-[#111] transition-colors">
          <ChevronLeft size={16} /> Prev
        </button>
        <button onClick={() => setRevealed(false)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs border border-[#222] text-[#555] rounded-lg hover:text-[#888] hover:bg-[#111] transition-colors">
          <RotateCcw size={12} /> Reset Card
        </button>
        <button onClick={next}
          className="flex items-center gap-1.5 px-4 py-2 text-sm border border-[#222] text-[#666] rounded-lg hover:text-white hover:bg-[#111] transition-colors">
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
