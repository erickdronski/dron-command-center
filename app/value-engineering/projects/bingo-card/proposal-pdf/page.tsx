'use client';

import { useEffect } from 'react';

export default function ProposalPDF() {
  useEffect(() => {
    // Hide sidebar when this page is active
    const sidebar = document.querySelector('aside');
    const main = document.querySelector('main');
    if (sidebar) sidebar.style.display = 'none';
    if (main) { main.style.width = '100%'; main.style.overflow = 'visible'; main.style.height = 'auto'; }
    document.body.style.overflow = 'visible';
    document.body.style.height = 'auto';
    document.body.style.display = 'block';

    // Auto-trigger print dialog if requested
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && window.location.search.includes('print=1')) {
        window.print();
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      // Restore sidebar when navigating away
      if (sidebar) sidebar.style.display = '';
      if (main) { main.style.width = ''; main.style.overflow = ''; main.style.height = ''; }
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.body.style.display = '';
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        @media print {
          body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; overflow: visible !important; height: auto !important; display: block !important; }
          .no-print { display: none !important; }
          .page-break { break-before: page; }
          .avoid-break { break-inside: avoid; }
          @page { margin: 0.4in 0.5in; size: letter; }
          aside { display: none !important; }
          main { margin: 0 !important; padding: 0 !important; width: 100% !important; max-width: 100% !important; overflow: visible !important; height: auto !important; }
          body > * > aside { display: none !important; }
          [class*="border-b"][class*="bg-[#0a0a0a]"] { display: none !important; }
          /* Tighter spacing for print */
          .pdf-section { padding: 24px 0 !important; }
          .pdf-wrapper { padding: 0 !important; }
        }
        body { background: #0a0a0f !important; }
      `}</style>

      {/* Print Button */}
      <div className="no-print fixed top-4 right-4 z-50 flex gap-2">
        <button onClick={() => window.print()}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg shadow-lg text-sm">
          🖨️ Print / Save as PDF
        </button>
        <a href="/value-engineering/projects/bingo-card"
          className="px-4 py-3 bg-[#222] hover:bg-[#333] text-[#999] rounded-lg text-sm flex items-center">
          ← Back
        </a>
      </div>

      <div className="max-w-[850px] mx-auto bg-[#0a0a0f] text-white pdf-wrapper" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>

        {/* ═══════════════════════════════════════════
            COVER PAGE
            ═══════════════════════════════════════════ */}
        <div className="flex flex-col justify-center items-center px-12 py-20 text-center">
          <div className="w-20 h-1 bg-purple-500 rounded mb-5" />
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            The Ivanti<br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Connected Journey</span>
          </h1>
          <p className="text-xl text-[#666] max-w-lg mt-2 mb-12">
            An enterprise proposal to unify sales intelligence, eliminate manual data assembly, and unlock revenue through connected systems.
          </p>
          <div className="grid grid-cols-3 gap-8 mt-8">
            <div><div className="text-3xl font-bold text-purple-400">126</div><div className="text-xs text-[#555] mt-1">Hours Saved<br />Per Rep / Year</div></div>
            <div><div className="text-3xl font-bold text-green-400">$1M+</div><div className="text-xs text-[#555] mt-1">Annual Savings<br />Org-Wide</div></div>
            <div><div className="text-3xl font-bold text-blue-400">670%</div><div className="text-xs text-[#555] mt-1">Maximum<br />ROI</div></div>
          </div>
          <div className="mt-16 text-xs text-[#444]">
            Prepared by Ivanti Value Engineering • February 2026
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            TABLE OF CONTENTS
            ═══════════════════════════════════════════ */}
        <div className="page-break px-12 py-8 pdf-section">
          <h2 className="text-2xl font-bold mb-5 text-purple-400">Contents</h2>
          <div className="space-y-1">
            {[
              ['01', 'The Problem — Disconnected Sales Intelligence'],
              ['02', 'The Power Sales Rep Framework'],
              ['03', 'Proposal A — AI-First (Ivy / Copilot Integration)'],
              ['04', 'Proposal B — Integration Platform (iPaaS)'],
              ['05', 'Proposal C — Power BI Live Dashboard'],
              ['06', 'Proposal D — Salesforce-Native (Agentforce + Data Cloud)'],
              ['07', 'Alternative Platforms & Organization-Wide Impact'],
              ['08', 'Customer 360 ITSM Usage — Unlocked Value'],
              ['09', 'Enterprise Success Stories'],
              ['10', 'Side-by-Side Comparison'],
              ['11', 'Recommended Hybrid Approach'],
              ['12', 'ROI & Financial Impact'],
              ['13', 'Executive Ask & Next Steps'],
            ].map(([num, title]) => (
              <div key={num} className="flex items-center gap-4 py-2 border-b border-[#1a1a1a]">
                <span className="text-purple-400 font-mono text-sm w-6">{num}</span>
                <span className="text-sm text-[#999]">{title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            01 - THE PROBLEM
            ═══════════════════════════════════════════ */}
        <div className="page-break px-12 py-8 pdf-section">
          <div className="text-xs text-purple-400 font-mono mb-2">01</div>
          <h2 className="text-3xl font-bold mb-4">The Problem</h2>
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-5">
            <p className="text-sm text-[#ccc] leading-relaxed">
              Every sales rep at Ivanti manually builds a <strong className="text-white">"Bingo Card"</strong> — a 70+ column spreadsheet tracking ~35 accounts across 5+ disconnected systems. This requires pulling data from Salesforce, ZoomInfo, Customer 360, LinkedIn, and tribal knowledge — then stitching it together by hand.
            </p>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center"><div className="text-2xl font-bold text-red-400">2,450+</div><div className="text-xs text-[#666]">Data points per rep<br/>manually curated</div></div>
              <div className="text-center"><div className="text-2xl font-bold text-red-400">245K</div><div className="text-xs text-[#666]">Total data points across<br/>100 reps maintained by hand</div></div>
              <div className="text-center"><div className="text-2xl font-bold text-red-400">126 hrs</div><div className="text-xs text-[#666]">Per rep per year<br/>on data assembly</div></div>
            </div>
          </div>

          <h3 className="text-lg font-bold mb-4 text-[#ccc]">What's In a Bingo Card (70+ Columns)</h3>
          <div className="space-y-2">
            {[
              { name: 'Account Identity', count: 8, fields: 'SFDC links, Customer 360, LinkedIn, ZoomInfo, Digital Room, Website', source: 'Manual from 5+ systems', auto: true },
              { name: 'Company Intelligence', count: 6, fields: 'HQ, State, Industry, Revenue, Employees, Fiscal Date', source: 'ZoomInfo + Manual', auto: true },
              { name: 'Ivanti Relationship', count: 6, fields: 'Previous AM, CSM, TRM, Support Level, Partners', source: 'Salesforce + Tribal Knowledge', auto: true },
              { name: 'Financial Data', count: 3, fields: 'ARR, 2026 ARR, Renewal Date', source: 'Salesforce', auto: true },
              { name: 'Product Ownership', count: 25, fields: 'MDM, MTD, EASM, RBVM, Patch, DEX, ITSM, ITAM, LOB, Discovery...', source: 'Salesforce + Customer 360', auto: true },
              { name: 'Strategic Signals', count: 8, fields: 'Account Status, Competitors, Meetings, Workshop Targets, Notes', source: 'Rep Judgment', auto: false },
              { name: 'Contacts', count: 3, fields: 'Key Contacts, CIO, CISO', source: 'ZoomInfo + LinkedIn', auto: true },
            ].map((c) => (
              <div key={c.name} className="flex items-center justify-between bg-[#111] border border-[#1a1a1a] rounded-lg p-3 avoid-break">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{c.name}</span>
                    <span className="text-[10px] bg-white/5 text-[#666] px-1.5 py-0.5 rounded">{c.count} columns</span>
                  </div>
                  <div className="text-xs text-[#555] mt-0.5">{c.fields}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#555]">{c.source}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded ${c.auto ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    {c.auto ? '✅ Automatable' : '🤖 AI-Assisted'}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#555] mt-4 italic">70-80% of bingo card data already exists in systems Ivanti has. Reps are just manually stitching it together.</p>
        </div>

        {/* ═══════════════════════════════════════════
            02 - POWER SALES REP
            ═══════════════════════════════════════════ */}
        <div className="page-break px-12 py-8 pdf-section">
          <div className="text-xs text-purple-400 font-mono mb-2">02</div>
          <h2 className="text-3xl font-bold mb-2">The Power Sales Rep Framework</h2>
          <p className="text-sm text-[#666] mb-5">What data does an enterprise rep actually need to be unstoppable — and in what form?</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: '🧠', name: 'Know — Account Intelligence', need: 'Who is this customer? What are they facing?',
                points: ['Company overview, revenue, employees, industry', 'Key contacts (CIO, CISO, IT Director)', 'Recent news, M&A, leadership changes', 'Regulatory pressures, industry trends', 'Competitive landscape and installed tech stack'],
                today: 'Manually pulled from ZoomInfo, LinkedIn, Google. 30-45 min per account.',
                future: 'Auto-enriched in CRM. AI-generated briefs on demand.' },
              { icon: '💓', name: 'Feel — Relationship Health', need: 'Are they happy? At risk? Growing?',
                points: ['CSM health score', 'Support ticket volume & sentiment', 'ITSM usage and adoption metrics', 'Renewal date and ARR trajectory', 'Engagement frequency (meetings, emails, calls)'],
                today: 'Scattered across Customer 360, Salesforce, CSM notes. Reps rarely check all.',
                future: 'Unified health score with AI-driven risk alerts. Proactive flagging.' },
              { icon: '👁️', name: 'See — Product Landscape', need: 'What do they own? What\'s the white space?',
                points: ['Licensed products and seat counts', 'Actual usage vs. entitlement', 'Product gaps vs. full portfolio', 'Cross-sell/upsell scoring', 'Competitor products in environment'],
                today: '25+ manual columns. No connection to actual usage data.',
                future: 'Product heat map with usage overlay. White space auto-calculated.' },
              { icon: '⚡', name: 'Act — Action Readiness', need: 'What should I do RIGHT NOW?',
                points: ['Prioritized action list', 'Talk tracks per opportunity', 'Executive readout content', 'Meeting prep briefs', 'ROI / value hypothesis per solution'],
                today: 'Reps decide by gut feel. No systematic prioritization.',
                future: 'AI-prioritized daily action list. Pre-built talk tracks. One-click meeting prep.' },
            ].map((p) => (
              <div key={p.name} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5 avoid-break">
                <div className="text-2xl mb-2">{p.icon}</div>
                <div className="text-sm font-bold text-white mb-1">{p.name}</div>
                <div className="text-xs text-[#666] italic mb-3">{p.need}</div>
                <div className="space-y-1 mb-3">
                  {p.points.map((d, i) => (
                    <div key={i} className="text-[10px] text-[#888] flex items-start gap-1.5">
                      <span className="text-purple-400/50">•</span> {d}
                    </div>
                  ))}
                </div>
                <div className="text-[10px] text-red-400/70 mb-1">❌ Today: {p.today}</div>
                <div className="text-[10px] text-green-400/70">✅ Future: {p.future}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            03 - PROPOSAL A
            ═══════════════════════════════════════════ */}
        <div className="page-break px-12 py-8 pdf-section">
          <div className="text-xs text-purple-400 font-mono mb-2">03</div>
          <h2 className="text-3xl font-bold mb-2">Proposal A: AI-First</h2>
          <p className="text-lg text-purple-400 mb-1">Ivy / Copilot Integration</p>
          <p className="text-sm text-[#666] mb-4">Single prompt → blended output from all systems. "Give me the bingo card for Randstad" → complete portfolio.</p>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-[#111] border border-purple-500/20 rounded-lg p-4 text-center">
              <div className="text-xs text-[#555]">Build Cost</div><div className="text-lg font-bold text-white">$80-150K</div>
            </div>
            <div className="bg-[#111] border border-purple-500/20 rounded-lg p-4 text-center">
              <div className="text-xs text-[#555]">Annual Cost</div><div className="text-lg font-bold text-white">$40-80K</div>
            </div>
            <div className="bg-[#111] border border-purple-500/20 rounded-lg p-4 text-center">
              <div className="text-xs text-[#555]">Time to Value</div><div className="text-lg font-bold text-white">3-6 months</div>
            </div>
          </div>

          <h3 className="text-sm font-bold text-[#ccc] mb-3">How It Works</h3>
          <div className="space-y-2 mb-4">
            {[
              'Build custom Copilot plugins / Ivy connectors for Salesforce REST API, ZoomInfo API, and Customer 360 data warehouse',
              'Rep types natural language query → AI orchestrates API calls across all systems simultaneously',
              'AI blends data into structured output: account snapshot, product ownership, white space analysis, competitive intel',
              'Output delivered as formatted response, downloadable Excel, or auto-populated PowerPoint',
              'AI generates "Area 51" style financial/industry briefs on the fly',
              'Prompt library from existing toolkit embedded as quick-start templates',
            ].map((h, i) => (
              <div key={i} className="flex items-start gap-3 text-xs text-[#999]">
                <span className="text-purple-400 font-bold mt-0.5">{i + 1}.</span> {h}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-bold text-green-400/70 mb-2">Pros</h3>
              {['Lowest friction — just ask a question', 'No new UI — lives in Teams/Copilot/Ivy', 'Flexible output (chat, Excel, PPT)', 'AI reasons across data sources', 'Extends existing prompt toolkit'].map((p, i) => (
                <div key={i} className="text-xs text-[#999] flex items-start gap-1.5 mb-1"><span className="text-green-400">✅</span> {p}</div>
              ))}
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-400/70 mb-2">Cons</h3>
              {['Requires Copilot Studio / Ivy API development', 'API connectors need building and maintaining', 'Customer 360 API is the biggest gap', 'LLM hallucination risk on financial data', 'Dependent on platform roadmap'].map((c, i) => (
                <div key={i} className="text-xs text-[#999] flex items-start gap-1.5 mb-1"><span className="text-amber-400">⚠️</span> {c}</div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            04 - PROPOSAL B
            ═══════════════════════════════════════════ */}
        <div className="page-break px-12 py-8 pdf-section">
          <div className="text-xs text-blue-400 font-mono mb-2">04</div>
          <h2 className="text-3xl font-bold mb-2">Proposal B: Integration Platform</h2>
          <p className="text-lg text-blue-400 mb-1">Enterprise Middleware (iPaaS)</p>
          <p className="text-sm text-[#666] mb-4">Connect everything once, automate forever. Salesforce + ZoomInfo + Customer 360 unified through a central hub.</p>

          <h3 className="text-sm font-bold text-[#ccc] mb-3">Three Sub-Options</h3>
          <div className="space-y-2 mb-4">
            {[
              { name: 'B1: Power Automate (In-Stack)', cost: '$15-40K build + $5-15K/yr', time: '4-8 weeks', best: 'Already licensed, IT-approved, fast.', risk: 'Limited complex orchestration.' },
              { name: 'B2: Workato (Enterprise iPaaS)', cost: '$100-150K build + $60-130K/yr', time: '8-16 weeks', best: '1000+ connectors, handles complex logic, scales org-wide.', risk: 'New vendor, significant annual cost.' },
              { name: 'B3: n8n (Self-Hosted)', cost: '$20-40K build + $5-10K/yr', time: '6-10 weeks', best: 'Open source, AI-native, lowest cost, full control.', risk: 'Requires technical team to maintain.' },
            ].map((s) => (
              <div key={s.name} className="bg-[#111] border border-blue-500/10 rounded-lg p-4 avoid-break">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-bold text-white">{s.name}</div>
                  <div className="flex gap-2">
                    <span className="text-[10px] bg-white/5 text-[#888] px-2 py-0.5 rounded">{s.cost}</span>
                    <span className="text-[10px] bg-white/5 text-[#888] px-2 py-0.5 rounded">{s.time}</span>
                  </div>
                </div>
                <div className="text-xs text-green-400/70 mb-1">✅ {s.best}</div>
                <div className="text-xs text-amber-400/70">⚠️ {s.risk}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-bold text-green-400/70 mb-2">Pros</h3>
              {['Solves root cause: disconnected systems', 'Benefits extend beyond bingo cards', 'Event-driven alerts surface insights automatically', 'Scales to entire org', 'Data flows both directions'].map((p, i) => (
                <div key={i} className="text-xs text-[#999] flex items-start gap-1.5 mb-1"><span className="text-green-400">✅</span> {p}</div>
              ))}
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-400/70 mb-2">Cons</h3>
              {['Higher upfront investment', 'Requires IT/RevOps to maintain', 'Procurement can take months', 'Customer 360 API still the gap', 'Complexity grows with systems'].map((c, i) => (
                <div key={i} className="text-xs text-[#999] flex items-start gap-1.5 mb-1"><span className="text-amber-400">⚠️</span> {c}</div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            05 - PROPOSAL C
            ═══════════════════════════════════════════ */}
        <div className="page-break px-12 py-8 pdf-section">
          <div className="text-xs text-green-400 font-mono mb-2">05</div>
          <h2 className="text-3xl font-bold mb-2">Proposal C: Power BI Dashboard</h2>
          <p className="text-lg text-green-400 mb-1">Unified Visual Portfolio for Every Rep</p>
          <p className="text-sm text-[#666] mb-4">See everything, act on anything — one screen. Highest feasibility, fastest time to value.</p>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-[#111] border border-green-500/20 rounded-lg p-4 text-center">
              <div className="text-xs text-[#555]">Build Cost</div><div className="text-lg font-bold text-white">$60-120K</div>
            </div>
            <div className="bg-[#111] border border-green-500/20 rounded-lg p-4 text-center">
              <div className="text-xs text-[#555]">Annual Cost</div><div className="text-lg font-bold text-white">$10-30K</div>
            </div>
            <div className="bg-[#111] border border-green-500/20 rounded-lg p-4 text-center">
              <div className="text-xs text-[#555]">Time to Value</div><div className="text-lg font-bold text-white">2-4 months</div>
            </div>
          </div>

          <h3 className="text-sm font-bold text-[#ccc] mb-3">7 Dashboard Views</h3>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {[
              { name: 'Portfolio Overview', desc: 'All accounts with ARR, renewal, health, product count — sortable, filterable' },
              { name: 'Product Heat Map', desc: 'Accounts × Products matrix with color-coded ownership' },
              { name: 'Renewal Timeline', desc: 'Visual calendar of upcoming renewals with ARR and risk' },
              { name: 'White Space Analysis', desc: 'Product gaps ranked by revenue potential and readiness' },
              { name: 'ITSM Usage & Adoption', desc: 'Customer 360: ticket trends, module usage, feature adoption' },
              { name: 'Account Deep Dive', desc: 'Single account: full history, contacts, products, competitors' },
              { name: 'Executive Roll-Up', desc: 'Management: team ARR, pipeline, risk, white space by territory' },
            ].map((d) => (
              <div key={d.name} className="bg-[#111] border border-[#1a1a1a] rounded-lg p-3 avoid-break">
                <div className="text-xs font-bold text-green-400">{d.name}</div>
                <div className="text-[10px] text-[#888] mt-0.5">{d.desc}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-bold text-green-400/70 mb-2">Pros</h3>
              {['Power BI almost certainly already licensed', 'First dashboards in 4-6 weeks', 'ITSM usage data visible to sales for first time', 'Self-service: reps explore data themselves', 'Copilot enables AI queries', 'Executive-ready roll-ups', 'Mobile-friendly'].map((p, i) => (
                <div key={i} className="text-xs text-[#999] flex items-start gap-1.5 mb-1"><span className="text-green-400">✅</span> {p}</div>
              ))}
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-400/70 mb-2">Cons</h3>
              {['Read-only — no note-taking in dashboard', 'Customer 360 pipeline still needs building', 'Scheduled refresh not true real-time', 'Training needed for adoption'].map((c, i) => (
                <div key={i} className="text-xs text-[#999] flex items-start gap-1.5 mb-1"><span className="text-amber-400">⚠️</span> {c}</div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            06 - PROPOSAL D
            ═══════════════════════════════════════════ */}
        <div className="page-break px-12 py-8 pdf-section">
          <div className="text-xs text-purple-400 font-mono mb-2">06</div>
          <h2 className="text-3xl font-bold mb-2">Proposal D: Salesforce-Native</h2>
          <p className="text-lg text-purple-400 mb-1">Agentforce + Data Cloud + ARPEDIO</p>
          <p className="text-sm text-[#666] mb-4">The bingo card lives IN Salesforce — where reps already work. AI agents that come to you, not the other way around.</p>

          <div className="space-y-2 mb-4">
            {[
              { tool: 'Salesforce Data Cloud', role: 'Unify Customer 360 ITSM data + ZoomInfo INTO Salesforce profiles', cost: '$65-150K/yr' },
              { tool: 'Agentforce', role: 'AI agents for account research, renewal alerts, pipeline management', cost: '$25-50K/yr' },
              { tool: 'ARPEDIO or DemandFarm', role: 'Salesforce-native white space analysis and account planning', cost: '$18-36K/yr' },
              { tool: 'ZoomInfo Enrichment', role: 'Auto-enrich company data, contacts, technographics in CRM', cost: '$10-20K/yr' },
              { tool: 'SF Reports & Dashboards', role: 'Bingo card views, renewal timelines, product heat maps', cost: '$0 (included)' },
            ].map((c) => (
              <div key={c.tool} className="flex items-center justify-between bg-[#111] border border-purple-500/10 rounded-lg p-3 avoid-break">
                <div><div className="text-xs font-bold text-white">{c.tool}</div><div className="text-[10px] text-[#666]">{c.role}</div></div>
                <span className="text-xs text-[#888] bg-white/5 px-2 py-0.5 rounded">{c.cost}</span>
              </div>
            ))}
          </div>

          <h3 className="text-sm font-bold text-[#ccc] mb-3">Agentforce Capabilities Mapped to Bingo Card</h3>
          <div className="space-y-2 mb-4">
            {[
              { agent: 'Account Research Agent', impact: 'Replaces manual "Area 51" research. Rep asks "Brief me on Randstad" → full dossier.', ready: true },
              { agent: 'Data Cloud Integration', impact: 'THE GAME CHANGER. Unifies all external data into one Salesforce profile. The bingo card becomes native.', ready: true },
              { agent: 'Einstein AI Scoring', impact: 'Replaces manual "Focus/Saturated/Declining" with AI-driven health scores.', ready: true },
              { agent: 'White Space Agent', impact: 'Compares product ownership vs. full portfolio. Auto-recommends cross-sell with talk tracks.', ready: false },
              { agent: 'Competitor Intel Agent', impact: 'ZoomInfo technographics → auto-populates "Competitors" column. Alerts on changes.', ready: false },
              { agent: 'Renewal Risk Agent', impact: 'Proactive 90/60/30 day alerts with usage trends and recommended actions.', ready: true },
            ].map((a) => (
              <div key={a.agent} className="flex items-start gap-3 bg-[#111] border border-[#1a1a1a] rounded-lg p-3 avoid-break">
                <span className={`text-[10px] px-1.5 py-0.5 rounded mt-0.5 ${a.ready ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>
                  {a.ready ? '✅' : '🔧'}
                </span>
                <div>
                  <div className="text-xs font-bold text-white">{a.agent}</div>
                  <div className="text-[10px] text-[#888] mt-0.5">{a.impact}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div><div className="text-xs text-[#555]">Build</div><div className="text-sm font-bold text-white">$80-200K</div></div>
              <div><div className="text-xs text-[#555]">Annual</div><div className="text-sm font-bold text-white">$118-256K</div></div>
              <div><div className="text-xs text-[#555]">ROI</div><div className="text-sm font-bold text-purple-400">109-806%</div></div>
              <div><div className="text-xs text-[#555]">Payback</div><div className="text-sm font-bold text-green-400">3-6 months</div></div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            07 - ALTERNATIVES + ORG IMPACT
            ═══════════════════════════════════════════ */}
        <div className="page-break px-12 py-8 pdf-section">
          <div className="text-xs text-purple-400 font-mono mb-2">07</div>
          <h2 className="text-3xl font-bold mb-2">Alternative Platforms</h2>
          <p className="text-sm text-[#666] mb-4">These platforms solve specific pieces of the puzzle. Each includes organization-wide impact beyond sales.</p>

          {[
            { name: 'ARPEDIO', cat: 'Account Planning + White Space', price: '$18-30K/yr', fit: 5, solves: 'White space, account planning, SWOT — all inside Salesforce.',
              org: [
                ['Sales Reps', 'Visual white space maps replace 25+ manual columns. Instant gap visibility.'],
                ['CSMs', 'Account plans with SWOT give strategic framework for QBRs.'],
                ['VE Team', 'White space data identifies which capabilities to focus workshops on.'],
                ['Sales Leadership', 'Standardized planning. Roll-up views by territory and product line.'],
                ['Product Management', 'Aggregate white space reveals largest addressable opportunity. Informs roadmap.'],
                ['Marketing', 'White space by segment drives targeted campaign strategy.'],
              ]},
            { name: 'Clari', cat: 'Revenue Intelligence', price: '$60-75K/yr', fit: 3, solves: 'Pipeline management, forecasting, deal intelligence.',
              org: [
                ['Sales Leadership', 'AI-driven forecasting replaces gut-feel pipeline reviews.'],
                ['CSMs', 'Renewal risk scoring from engagement signals. Accounts going dark = early warning.'],
                ['RevOps', 'Automated pipeline hygiene. Stale deals flagged, forecast accuracy tracked.'],
                ['Marketing', 'Deal velocity shows which campaigns influence faster closes.'],
                ['Finance', 'More accurate revenue forecasting. Reduces variance.'],
              ]},
            { name: 'People.ai', cat: 'Revenue Intelligence', price: '$30-45K/yr', fit: 3, solves: 'Contact mapping, engagement scoring, relationship intelligence.',
              org: [
                ['SEs', 'See which stakeholders have been engaged before the call.'],
                ['CSMs', 'Relationship maps show gaps in post-sale nurturing.'],
                ['Sales Leadership', 'Rep activity analytics for data-driven coaching.'],
                ['Marketing', 'Persona engagement data informs ABM targeting.'],
                ['VE Team', 'Full relationship context for workshop prep.'],
              ]},
            { name: 'ZoomInfo Enrichment', cat: 'Data Enrichment', price: '$10-20K/yr (upgrade)', fit: 4, solves: 'Auto-populate company data, contacts, technographics in CRM.',
              org: [
                ['Sales Reps', 'Account fields auto-populated. Eliminates 30-45 min research per account.'],
                ['SDR/BDR', 'Contact discovery at scale — CIO, CISO, direct dials, verified emails.'],
                ['Marketing', 'Firmographic enrichment improves segmentation. Technographics reveal competitors.'],
                ['CSMs', 'Auto-detect when key contacts change roles or leave.'],
                ['RevOps', 'CRM data quality dramatically improves. Fewer duplicates.'],
              ]},
            { name: 'Demandbase', cat: 'Account Intelligence', price: '$75-150K/yr', fit: 2, solves: 'Intent data, technographics, ABM advertising.',
              org: [
                ['Marketing', 'BIGGEST winner. Intent data shows who\'s actively researching. ABM precision.'],
                ['SDR/BDR', 'Call accounts researching "ITSM" or "endpoint" RIGHT NOW.'],
                ['Sales Reps', 'Technographics reveal competitor products at accounts.'],
                ['Product Marketing', 'Competitive share tracking across install base.'],
                ['Channel', 'Intent-based lead routing to right partners.'],
              ]},
          ].map((a) => (
            <div key={a.name} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5 mb-4 avoid-break">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm font-bold text-white">{a.name}</div>
                  <div className="text-[10px] text-purple-400">{a.cat}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#888] bg-white/5 px-2 py-0.5 rounded">{a.price}</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className={`w-3 h-1.5 rounded-sm ${i < a.fit ? 'bg-purple-500' : 'bg-[#222]'}`} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-xs text-green-400/70 mb-3">✅ {a.solves}</div>
              <div className="text-[10px] font-semibold text-[#555] uppercase mb-2">Organization-Wide Impact</div>
              <div className="grid grid-cols-2 gap-1.5">
                {a.org.map(([role, benefit]) => (
                  <div key={role} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded p-2">
                    <div className="text-[10px] font-bold text-purple-400">{role}</div>
                    <div className="text-[10px] text-[#888] mt-0.5">{benefit}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ═══════════════════════════════════════════
            08 - ITSM USAGE
            ═══════════════════════════════════════════ */}
        <div className="page-break px-12 py-8 pdf-section">
          <div className="text-xs text-cyan-400 font-mono mb-2">08</div>
          <h2 className="text-3xl font-bold mb-2">Customer 360 ITSM Usage</h2>
          <p className="text-sm text-[#666] mb-4">The most underutilized sales asset at Ivanti. Here&apos;s how surfacing it drives revenue.</p>
          <div className="space-y-2">
            {[
              { metric: 'Ticket Volume Trends', signal: '📈 Rising = scaling (upsell) | 📉 Falling = disengagement (churn risk)' },
              { metric: 'Module / Feature Adoption %', signal: 'Licensed but dormant modules → adoption conversation. Prevents shelfware objections at renewal.' },
              { metric: 'User Activity & Logins', signal: 'Low logins = low adoption = renewal risk. High activity = expansion ready.' },
              { metric: 'Self-Service Usage', signal: 'High = getting value. Low = opportunity to enable portal/catalog → services revenue.' },
              { metric: 'Automation & Bot Usage', signal: 'Using automation = sticky customer. Not using it = AITSM/Healing upsell candidate.' },
              { metric: 'CMDB / Discovery Utilization', signal: 'Empty CMDB + active ITSM → Discovery/ITAM cross-sell. Full CMDB → service mapping upsell.' },
            ].map((i) => (
              <div key={i.metric} className="bg-[#111] border border-cyan-500/10 rounded-lg p-4 avoid-break">
                <div className="text-sm font-bold text-cyan-400">{i.metric}</div>
                <div className="text-xs text-[#888] mt-1">{i.signal}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            09 - SUCCESS STORIES
            ═══════════════════════════════════════════ */}
        <div className="page-break px-12 py-8 pdf-section">
          <div className="text-xs text-green-400 font-mono mb-2">09</div>
          <h2 className="text-3xl font-bold mb-4">Enterprise Success Stories</h2>
          <div className="space-y-2">
            {[
              { co: 'Wiley (Publishing)', result: '213% ROI, 40%+ self-service', solution: 'Agentforce AI agents for customer self-service and contextual rep briefs.', lesson: 'AI agents that pre-brief reps eliminate the manual research bottleneck.' },
              { co: 'Adecco (Global Staffing)', result: 'Hours/week recovered per recruiter', solution: 'Agentforce automating resume screening, shortlists, candidate management.', lesson: 'Identical to Ivanti: knowledge workers doing data assembly instead of high-value work.' },
              { co: 'Iron Mountain (Info Mgmt)', result: 'Dramatic reduction in manual documentation', solution: 'Einstein AI auto-generates case summaries and unified account health.', lesson: 'Direct parallel — their reps were doing the same manual multi-system data assembly.' },
              { co: 'OpenTable (Restaurant Tech)', result: 'Thousands of conversations resolved autonomously', solution: 'Agentforce handling support at scale without human intervention.', lesson: '50-100 reps × 35 accounts = scale problem AI agents are built for.' },
              { co: 'Accenture (Consulting)', result: 'Faster cross-functional alignment', solution: 'Agentforce surfacing account context across teams automatically.', lesson: 'SEs, CSMs, and VEs all need the same context from different systems. One agent fixes all.' },
            ].map((s) => (
              <div key={s.co} className="bg-[#111] border border-green-500/10 rounded-lg p-5 avoid-break">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-bold text-white">{s.co}</div>
                  <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded">{s.result}</span>
                </div>
                <div className="text-xs text-[#888] mb-2">Solution: {s.solution}</div>
                <div className="text-xs text-cyan-400/70 bg-cyan-500/5 rounded p-2">💡 Lesson for Ivanti: {s.lesson}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            10 - COMPARISON
            ═══════════════════════════════════════════ */}
        <div className="page-break px-12 py-8 pdf-section">
          <div className="text-xs text-purple-400 font-mono mb-2">10</div>
          <h2 className="text-3xl font-bold mb-4">Side-by-Side Comparison</h2>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#111]">
                  <th className="text-left p-3 text-[#555]">Criteria</th>
                  <th className="text-center p-3 text-purple-400">A: AI/Chat</th>
                  <th className="text-center p-3 text-blue-400">B: iPaaS</th>
                  <th className="text-center p-3 text-green-400">C: Power BI</th>
                  <th className="text-center p-3 text-purple-400">D: SF Native</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Build Cost', '$80-150K', '$100-200K', '$60-120K', '$80-200K'],
                  ['Annual Cost', '$40-80K', '$60-180K', '$10-30K', '$118-256K'],
                  ['Time to Value', '3-6 mo', '4-8 mo', '2-4 mo', '4-8 mo'],
                  ['Rep Friction', 'Lowest', 'None', 'Low', 'None'],
                  ['New Tools?', 'No', 'Possibly', 'No', 'No'],
                  ['ITSM Usage', '✅', '✅', '✅', '✅'],
                  ['White Space', '✅ AI', '✅ Calc', '✅ Visual', '✅ ARPEDIO'],
                  ['Proactive Alerts', '❌', '✅', '⚠️ Limited', '✅ Agents'],
                  ['Org-Wide Benefit', 'Medium', 'High', 'High', 'Highest'],
                  ['Scalability', 'High', 'Highest', 'High', 'High'],
                  ['Prerequisite', '360 API', '360 API', '360 pipeline', '360 API + Data Cloud'],
                ].map((row, i) => (
                  <tr key={i} className="border-t border-[#1a1a1a]">
                    <td className="p-3 text-[#888] font-medium">{row[0]}</td>
                    <td className="p-3 text-center text-[#999]">{row[1]}</td>
                    <td className="p-3 text-center text-[#999]">{row[2]}</td>
                    <td className="p-3 text-center text-[#999]">{row[3]}</td>
                    <td className="p-3 text-center text-[#999]">{row[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            11 - RECOMMENDED
            ═══════════════════════════════════════════ */}
        <div className="page-break px-12 py-8 pdf-section">
          <div className="text-xs text-purple-400 font-mono mb-2">11</div>
          <h2 className="text-3xl font-bold mb-4">Recommended Hybrid Approach</h2>
          <div className="space-y-2">
            {[
              { phase: 'NOW', title: 'Power BI Dashboard (Proposal C)', time: 'Months 1-3', cost: '$60-120K', why: 'Immediate visual impact. ITSM usage visible for first time. White space automated. Executive roll-ups.' },
              { phase: 'PARALLEL', title: 'Customer 360 API + Data Pipeline', time: 'Months 2-4', cost: '$20-40K', why: 'Critical dependency for ALL proposals. Build once, use everywhere. Shared infrastructure.' },
              { phase: 'THEN', title: 'AI Integration (Proposal A or D)', time: 'Months 4-8', cost: '$80-200K', why: 'Once data flows, add AI layer. Agentforce agents or Copilot — rep gets proactive intelligence.' },
              { phase: 'SCALE', title: 'iPaaS if Needed (Proposal B)', time: 'Months 8-12', cost: '$60-180K/yr', why: 'Only if Power Automate hits limits and 10+ system orchestration is needed.' },
            ].map((p) => (
              <div key={p.phase} className="bg-[#111] border border-purple-500/10 rounded-xl p-5 avoid-break">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded font-bold">{p.phase}</span>
                    <div className="text-sm font-bold text-white">{p.title}</div>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs text-[#888] bg-white/5 px-2 py-0.5 rounded">{p.time}</span>
                    <span className="text-xs text-[#888] bg-white/5 px-2 py-0.5 rounded">{p.cost}</span>
                  </div>
                </div>
                <p className="text-xs text-[#888]">{p.why}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            12 - ROI
            ═══════════════════════════════════════════ */}
        <div className="page-break px-12 py-8 pdf-section">
          <div className="text-xs text-green-400 font-mono mb-2">12</div>
          <h2 className="text-3xl font-bold mb-4">ROI & Financial Impact</h2>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
              <div className="text-xs text-[#555] mb-3">Conservative (50 Reps)</div>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-xs text-[#888]">Hours saved/year</span><span className="text-sm text-white font-bold">6,300</span></div>
                <div className="flex justify-between"><span className="text-xs text-[#888]">FTE equivalent</span><span className="text-sm text-white font-bold">3.7 FTEs</span></div>
                <div className="flex justify-between"><span className="text-xs text-[#888]">Cost savings @ $85/hr</span><span className="text-sm text-green-400 font-bold">$535,500/yr</span></div>
              </div>
            </div>
            <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
              <div className="text-xs text-[#555] mb-3">Full Org (100 Reps)</div>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-xs text-[#888]">Hours saved/year</span><span className="text-sm text-white font-bold">12,600</span></div>
                <div className="flex justify-between"><span className="text-xs text-[#888]">FTE equivalent</span><span className="text-sm text-white font-bold">7.4 FTEs</span></div>
                <div className="flex justify-between"><span className="text-xs text-[#888]">Cost savings @ $85/hr</span><span className="text-sm text-green-400 font-bold">$1,071,000/yr</span></div>
              </div>
            </div>
          </div>

          <h3 className="text-sm font-bold text-[#ccc] mb-3">Additional Revenue Impact</h3>
          <div className="space-y-2">
            {[
              ['Faster Deal Cycles', '5-10% improvement from instant account intelligence'],
              ['Reduced Churn', '1-3% ARR retention uplift from proactive renewal management'],
              ['White Space Revenue', 'Est. $500K-2M incremental pipeline from automated gap analysis'],
              ['New Rep Onboarding', 'Pre-built portfolio view eliminates weeks of manual assembly'],
              ['Management Visibility', 'Real-time territory views for better resource allocation'],
            ].map(([metric, value]) => (
              <div key={metric} className="flex items-center justify-between bg-[#111] border border-[#1a1a1a] rounded-lg p-3 avoid-break">
                <span className="text-xs text-[#888] font-medium">{metric}</span>
                <span className="text-xs text-[#999]">{value}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-green-500/5 border border-green-500/20 rounded-xl p-5">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div><div className="text-xs text-[#555]">Year 1 Investment</div><div className="text-lg font-bold text-white">$160-310K</div></div>
              <div><div className="text-xs text-[#555]">Annual Savings</div><div className="text-lg font-bold text-green-400">$535K-$1.07M</div></div>
              <div><div className="text-xs text-[#555]">ROI</div><div className="text-lg font-bold text-purple-400">170-670%</div></div>
              <div><div className="text-xs text-[#555]">Payback</div><div className="text-lg font-bold text-green-400">3-6 months</div></div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            13 - EXECUTIVE ASK
            ═══════════════════════════════════════════ */}
        <div className="page-break px-12 py-8 pdf-section">
          <div className="text-xs text-purple-400 font-mono mb-2">13</div>
          <h2 className="text-3xl font-bold mb-4">Executive Ask & Next Steps</h2>

          <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-6 mb-5">
            <h3 className="text-sm font-bold text-purple-400 mb-4">Required for Any Proposal</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { ask: 'Customer 360 API / Data Export capability', critical: true },
                { ask: 'ZoomInfo API access (confirm license tier)', critical: true },
                { ask: 'Salesforce admin capacity for custom reports', critical: true },
                { ask: 'VP Sales / CRO sponsorship', critical: true },
                { ask: 'Power BI workspace allocation', critical: false },
                { ask: '1 RevOps analyst + 1 SF admin (8-12 weeks)', critical: false },
                { ask: 'Copilot Studio access (Proposal A)', critical: false },
                { ask: 'Agentforce / Data Cloud evaluation (Proposal D)', critical: false },
              ].map((a) => (
                <div key={a.ask} className="flex items-center gap-2 text-xs text-[#999]">
                  <span className={a.critical ? 'text-red-400' : 'text-[#555]'}>{a.critical ? '🔴' : '⚪'}</span>
                  <span className={a.critical ? 'text-[#ccc]' : ''}>{a.ask}</span>
                </div>
              ))}
            </div>
          </div>

          <h3 className="text-lg font-bold text-[#ccc] mb-4">Proposed Next Steps</h3>
          <div className="space-y-2">
            {[
              { step: 1, action: 'Present this proposal to VP / leadership team', owner: 'Erick + VE Team', time: 'This week' },
              { step: 2, action: 'Confirm Salesforce licensing (Data Cloud, Agentforce eligibility)', owner: 'IT / SF Admin', time: 'Week 1-2' },
              { step: 3, action: 'Validate Customer 360 API / export feasibility', owner: 'Data Engineering', time: 'Week 1-2' },
              { step: 4, action: 'Pilot: Enable ZoomInfo auto-enrichment + evaluate ARPEDIO', owner: 'RevOps + Sales Ops', time: 'Week 2-4' },
              { step: 5, action: 'Phase 1 build: Power BI dashboard (if approved)', owner: 'BI Team + RevOps', time: 'Month 2-4' },
              { step: 6, action: 'Evaluate Agentforce / Copilot for Phase 2', owner: 'IT + VE Team', time: 'Month 4-6' },
            ].map((s) => (
              <div key={s.step} className="flex items-center gap-4 bg-[#111] border border-[#1a1a1a] rounded-lg p-4 avoid-break">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm font-bold flex-shrink-0">{s.step}</div>
                <div className="flex-1">
                  <div className="text-xs font-medium text-white">{s.action}</div>
                  <div className="text-[10px] text-[#666] mt-0.5">Owner: {s.owner}</div>
                </div>
                <span className="text-[10px] text-[#888] bg-white/5 px-2 py-0.5 rounded">{s.time}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="w-20 h-1 bg-purple-500 rounded mx-auto mb-4" />
            <p className="text-sm text-[#555]">The Ivanti Connected Journey</p>
            <p className="text-xs text-[#444] mt-1">Prepared by Value Engineering • February 2026</p>
          </div>
        </div>

      </div>
    </>
  );
}
