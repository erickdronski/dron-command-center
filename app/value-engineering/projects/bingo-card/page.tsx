'use client';

import { useState } from 'react';
import { Download, ChevronDown, ChevronUp, Clock, DollarSign, Users, Zap, AlertTriangle, CheckCircle, ArrowRight, Database, RefreshCw, Brain, BarChart3, Layers } from 'lucide-react';

/* ── Data ── */

const currentColumns = [
  { name: 'Account Identity', count: 8, fields: 'SFDC Names, Primary/Secondary SFDC, Customer 360, LinkedIn, ZoomInfo, Digital Room, Website', source: 'Manual from 5+ systems', automatable: 'full' },
  { name: 'Company Intelligence', count: 6, fields: 'HQ City, State, Industry, Revenue, Employees, Fiscal Date', source: 'ZoomInfo + Manual', automatable: 'full' },
  { name: 'Ivanti Relationship', count: 6, fields: 'Previous AM, CSM, TRM, Support Level, Primary/Secondary Partner', source: 'Salesforce + Tribal Knowledge', automatable: 'full' },
  { name: 'Financial Data', count: 3, fields: 'ARR, 2026 ARR, Renewal Date', source: 'Salesforce', automatable: 'full' },
  { name: 'Product Ownership', count: 25, fields: 'MDM, MTD, EASM, RBVM, Patch, DEX, ITSM/ITAM, LOB, Discovery, etc.', source: 'Salesforce Assets + Customer 360', automatable: 'full' },
  { name: 'Strategic Signals', count: 8, fields: 'Focus/Saturated/Declining, Competitors, Meeting Status, Workshop Target, White Space, Notes', source: 'Rep Judgment', automatable: 'ai-assisted' },
  { name: 'Contacts', count: 3, fields: 'Key Contacts, CIO, CISO', source: 'ZoomInfo + LinkedIn', automatable: 'full' },
];

const phases = [
  {
    id: 1,
    title: 'Quick Win — Auto-Populated Bingo Card',
    timeline: '2-4 weeks',
    description: 'Power Automate flow pulls Salesforce + ZoomInfo data weekly into a standardized Excel/SharePoint template. Reps get a pre-populated card and only add judgment columns.',
    tools: ['Power Automate (existing)', 'Salesforce REST API', 'ZoomInfo API', 'SharePoint'],
    coverage: '70%',
    effort: '40-80 hrs',
    cost: '$15-25K',
  },
  {
    id: 2,
    title: 'High Value — Live Portfolio Dashboard',
    timeline: '4-8 weeks',
    description: 'Power BI dashboard with interactive bingo card view, product heat map, renewal timeline, and white space calculator. Copilot for natural language queries.',
    tools: ['Power BI (existing M365)', 'Salesforce Connector', 'Customer 360 Data Feed', 'Copilot'],
    coverage: '85%',
    effort: '60-120 hrs',
    cost: '$20-40K',
  },
  {
    id: 3,
    title: 'AI Layer — Account Intelligence Engine',
    timeline: '8-12 weeks',
    description: 'Automated AI briefs per account (financial strategy, industry insights, competitive intel) generated weekly. The "Area 51" concept at scale — every rep gets it for every account, automatically.',
    tools: ['AI/LLM API', 'ZoomInfo Technographics', 'Power Automate', 'Ivy or Copilot'],
    coverage: '95%',
    effort: '80-160 hrs',
    cost: '$15-30K',
  },
];

const timeSavings = [
  { activity: 'Initial bingo card build', current: '6 hours', automated: '30 min', savings: '5.5 hrs' },
  { activity: 'Weekly maintenance', current: '30 min/week (26 hrs/yr)', automated: '5 min/week (4.3 hrs/yr)', savings: '21.7 hrs/yr' },
  { activity: 'Pre-meeting research', current: '30-45 min/account', automated: '5-10 min (AI brief ready)', savings: '25 min/meeting' },
  { activity: 'White space identification', current: '2 hrs/quarter', automated: 'Automated', savings: '8 hrs/yr' },
  { activity: 'Renewal prep & review', current: '1 hr/account', automated: '15 min (pre-loaded)', savings: '45 min/account' },
];

const whatExists = [
  { tool: 'Salesforce', status: 'have', note: 'System of record. Custom reports may cover 60% without new tools.' },
  { tool: 'Microsoft 365 / Power Platform', status: 'have', note: 'Power Automate, Power BI, Copilot — likely enterprise-licensed.' },
  { tool: 'ZoomInfo', status: 'have', note: 'Already used (links in bingo card). API access may need upgrade.' },
  { tool: 'Customer 360 / Data Warehouse', status: 'have', note: 'Exists internally. Needs connector or scheduled export API.' },
  { tool: 'Ivy (Ivanti AI)', status: 'have', note: 'Could generate AI account briefs if web search enabled.' },
  { tool: 'ZoomInfo API Access', status: 'need', note: 'May need license upgrade to enable programmatic access.' },
  { tool: 'Customer 360 API/Export', status: 'need', note: 'Biggest gap. Need data engineering to expose this programmatically.' },
  { tool: 'Executive Sponsorship', status: 'need', note: 'RevOps/Sales Ops initiative — needs CRO or VP Sales backing.' },
];

function downloadProposal() {
  fetch('/data/bingo-card-proposal.txt')
    .catch(() => {
      // Generate inline
      const text = `SALES BINGO CARD AUTOMATION — EXECUTIVE PROPOSAL
${'='.repeat(60)}

PROBLEM: Sales reps manually build portfolio spreadsheets with 70+ columns from 5+ disconnected systems.
- 4-8 hours to build initial card per rep (~35 accounts)
- 15-30 min/week ongoing maintenance
- Data goes stale within days
- Inconsistent formats across reps

SOLUTION: Automate 70-80% of data assembly using existing tools (Salesforce, Power Platform, ZoomInfo).

PHASE 1 (2-4 weeks): Power Automate weekly sync → pre-populated Excel/SharePoint template
PHASE 2 (4-8 weeks): Power BI live dashboard with product heat map + renewal timeline
PHASE 3 (8-12 weeks): AI-generated account briefs (financial strategy, industry insights, competitive intel)

ROI SUMMARY:
- Hours saved/year (50 reps): 6,300
- Hours saved/year (100 reps): 12,600
- Cost savings @ $85/hr: $535K-$1.07M/year
- Investment: $50-95K
- ROI: 564%-1,126%
- Payback: < 2 months

WHAT WE NEED:
1. Salesforce admin access for custom report types
2. ZoomInfo API access confirmation
3. Customer 360 data export/API endpoint
4. Power BI workspace allocation
5. 1 RevOps analyst + 1 Salesforce admin for 8-12 weeks`;
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bingo-card-automation-proposal.txt';
      a.click();
      URL.revokeObjectURL(url);
    });
}

/* ── Components ── */

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02]">
        <h3 className="text-sm font-bold text-white">{title}</h3>
        {open ? <ChevronUp size={16} className="text-[#555]" /> : <ChevronDown size={16} className="text-[#555]" />}
      </button>
      {open && <div className="px-5 pb-5 border-t border-[#222] pt-4">{children}</div>}
    </div>
  );
}

/* ── Page ── */

export default function BingoCardPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Sales Bingo Card Automation</h2>
          <p className="text-sm text-[#555] mt-0.5">Executive proposal to eliminate manual portfolio assembly</p>
        </div>
        <button onClick={downloadProposal}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-lg transition-colors">
          <Download size={16} />
          Download Proposal
        </button>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Hours Saved / Rep / Year', value: '126', icon: Clock, color: 'text-blue-400' },
          { label: 'Org Savings (50 reps)', value: '$535K', icon: DollarSign, color: 'text-green-400' },
          { label: 'ROI', value: '564%+', icon: BarChart3, color: 'text-purple-400' },
          { label: 'Payback Period', value: '<2 mo', icon: Zap, color: 'text-amber-400' },
        ].map((s) => (
          <div key={s.label} className="bg-[#111] border border-[#222] rounded-xl p-4">
            <s.icon size={18} className={s.color} />
            <div className={`text-2xl font-bold ${s.color} mt-2`}>{s.value}</div>
            <div className="text-xs text-[#555] mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Problem */}
      <Section title="The Problem — What Reps Do Today">
        <p className="text-sm text-[#888] mb-4">
          Every sales rep manually builds a &quot;Bingo Card&quot; — a 70+ column spreadsheet tracking ~35 accounts across 5+ disconnected systems.
          Maley&apos;s card: <span className="text-white font-medium">35 accounts × 70+ fields = 2,450+ data points</span> manually curated.
          Across 50-100 reps: <span className="text-white font-medium">120K-245K data points maintained by hand</span>.
        </p>
        <div className="space-y-2">
          {currentColumns.map((col) => (
            <div key={col.name} className="flex items-center justify-between bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">{col.name}</span>
                  <span className="text-xs bg-white/5 text-[#666] px-1.5 py-0.5 rounded">{col.count} cols</span>
                </div>
                <div className="text-xs text-[#555] mt-0.5">{col.fields}</div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <span className="text-xs text-[#666]">{col.source}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  col.automatable === 'full' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'
                }`}>
                  {col.automatable === 'full' ? '✅ Automatable' : '🤖 AI-Assisted'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Solution Architecture */}
      <Section title="Proposed Solution — 3-Phase Rollout">
        <div className="space-y-4">
          {phases.map((p) => (
            <div key={p.id} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm font-bold">{p.id}</div>
                  <div>
                    <div className="text-sm font-bold text-white">{p.title}</div>
                    <div className="text-xs text-[#555]">{p.timeline}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded">{p.coverage} automated</span>
                  <span className="text-xs bg-white/5 text-[#666] px-2 py-1 rounded">{p.cost}</span>
                </div>
              </div>
              <p className="text-xs text-[#888] mb-3">{p.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {p.tools.map((t) => (
                  <span key={t} className="text-xs bg-white/5 text-[#999] px-2 py-1 rounded">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Time Savings */}
      <Section title="Time Savings Breakdown — Per Rep">
        <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#0a0a0a]">
                <th className="text-left p-3 text-[#555] font-semibold">Activity</th>
                <th className="text-left p-3 text-[#555] font-semibold">Current (Manual)</th>
                <th className="text-left p-3 text-[#555] font-semibold">Automated</th>
                <th className="text-left p-3 text-[#555] font-semibold">Savings</th>
              </tr>
            </thead>
            <tbody>
              {timeSavings.map((t) => (
                <tr key={t.activity} className="border-t border-[#1a1a1a]">
                  <td className="p-3 text-[#999]">{t.activity}</td>
                  <td className="p-3 text-red-400/70">{t.current}</td>
                  <td className="p-3 text-green-400/70">{t.automated}</td>
                  <td className="p-3 text-white font-medium">{t.savings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 bg-green-500/5 border border-green-500/20 rounded-lg p-3 flex items-center justify-between">
          <span className="text-sm text-green-400 font-medium">Total: ~126 hours/year per rep</span>
          <span className="text-xs text-[#666]">= 3 full working weeks recovered for selling</span>
        </div>
      </Section>

      {/* ROI */}
      <Section title="ROI & Financial Impact">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4">
            <div className="text-xs text-[#555] mb-2">Conservative (50 Reps)</div>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-xs text-[#888]">Hours saved/year</span><span className="text-sm text-white font-bold">6,300</span></div>
              <div className="flex justify-between"><span className="text-xs text-[#888]">FTE equivalent</span><span className="text-sm text-white font-bold">3.7 FTEs</span></div>
              <div className="flex justify-between"><span className="text-xs text-[#888]">Cost savings @ $85/hr</span><span className="text-sm text-green-400 font-bold">$535,500/yr</span></div>
            </div>
          </div>
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4">
            <div className="text-xs text-[#555] mb-2">Full Org (100 Reps)</div>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-xs text-[#888]">Hours saved/year</span><span className="text-sm text-white font-bold">12,600</span></div>
              <div className="flex justify-between"><span className="text-xs text-[#888]">FTE equivalent</span><span className="text-sm text-white font-bold">7.4 FTEs</span></div>
              <div className="flex justify-between"><span className="text-xs text-[#888]">Cost savings @ $85/hr</span><span className="text-sm text-green-400 font-bold">$1,071,000/yr</span></div>
            </div>
          </div>
        </div>
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4">
          <div className="text-xs text-[#555] mb-2">Investment vs. Return</div>
          <div className="grid grid-cols-4 gap-4">
            <div><div className="text-xs text-[#888]">Total Investment</div><div className="text-lg font-bold text-white">$50-95K</div></div>
            <div><div className="text-xs text-[#888]">Annual Savings</div><div className="text-lg font-bold text-green-400">$535K-$1.07M</div></div>
            <div><div className="text-xs text-[#888]">ROI</div><div className="text-lg font-bold text-purple-400">564-1,126%</div></div>
            <div><div className="text-xs text-[#888]">Payback</div><div className="text-lg font-bold text-amber-400">&lt; 2 months</div></div>
          </div>
        </div>
      </Section>

      {/* What We Have vs. Need */}
      <Section title="Current Tools — What We Have vs. What We Need" defaultOpen={false}>
        <div className="space-y-2">
          {whatExists.map((t) => (
            <div key={t.tool} className="flex items-center gap-3 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-3">
              {t.status === 'have' ? (
                <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
              ) : (
                <AlertTriangle size={16} className="text-amber-400 flex-shrink-0" />
              )}
              <div className="flex-1">
                <div className="text-sm font-medium text-white">{t.tool}</div>
                <div className="text-xs text-[#666] mt-0.5">{t.note}</div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded ${
                t.status === 'have' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'
              }`}>
                {t.status === 'have' ? 'Have' : 'Need'}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* Executive Ask */}
      <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-5">
        <h3 className="text-sm font-bold text-purple-400 mb-3">Executive Ask — What We Need to Move Forward</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            'Salesforce admin access for custom report types',
            'ZoomInfo API access confirmation',
            'Customer 360 data export / API endpoint',
            'Power BI workspace allocation',
            '1 RevOps analyst + 1 SF admin for 8-12 weeks',
            'VP Sales / CRO sponsorship',
          ].map((ask) => (
            <div key={ask} className="flex items-center gap-2 text-xs text-[#999]">
              <ArrowRight size={12} className="text-purple-400 flex-shrink-0" />
              {ask}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
