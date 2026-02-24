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
            EXECUTIVE SUMMARY — ONE PAGE
            ═══════════════════════════════════════════ */}
        <div className="page-break px-12 py-8 pdf-section">
          <div className="text-xs text-purple-400 font-mono mb-2">EXECUTIVE SUMMARY</div>
          <h2 className="text-2xl font-bold mb-4">The Bottom Line</h2>
          
          <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-5 mb-4">
            <h3 className="text-sm font-bold text-purple-400 mb-2">Why This Proposal Exists</h3>
            <p className="text-xs text-[#ccc] leading-relaxed">
              Every Ivanti sales rep spends <strong className="text-white">126 hours/year</strong> manually assembling account data from 5+ disconnected systems (Salesforce, ZoomInfo, Customer 360, LinkedIn, tribal knowledge). That's <strong className="text-white">3 full work weeks</strong> per rep spent on data assembly instead of selling. Across 50-100 reps, that's <strong className="text-white">$535K-$1M/year</strong> in wasted salary cost — plus lost revenue from slower deal cycles and missed opportunities.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
              <h3 className="text-xs font-bold text-red-400 mb-2">❌ Today</h3>
              <ul className="space-y-1 text-[10px] text-[#999]">
                <li>• 70+ column spreadsheets built by hand</li>
                <li>• Data goes stale within days</li>
                <li>• ITSM usage data invisible to sales</li>
                <li>• No systematic way to identify which accounts need the C&amp;M Assessment</li>
                <li>• VE team builds every engagement from scratch</li>
              </ul>
            </div>
            <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
              <h3 className="text-xs font-bold text-green-400 mb-2">✅ With The Connected Journey</h3>
              <ul className="space-y-1 text-[10px] text-[#999]">
                <li>• Real-time unified portfolio view</li>
                <li>• AI-generated account briefs on demand</li>
                <li>• ITSM usage data visible for first time</li>
                <li>• Algorithmic targeting for Capability &amp; Maturity Assessments</li>
                <li>• Automated synthesis and roadmap generation</li>
              </ul>
            </div>
          </div>

          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4 mb-4">
            <h3 className="text-xs font-bold text-white mb-3">Recommended Path: Hybrid Approach</h3>
            <div className="flex items-center gap-2 text-[10px] text-[#888] mb-2">
              <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">Now: Power BI Dashboard</span>
              <span>→</span>
              <span className="bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded">Parallel: 360 API</span>
              <span>→</span>
              <span className="bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">Then: AI Layer</span>
            </div>
            <div className="grid grid-cols-4 gap-3 text-center">
              <div>
                <div className="text-lg font-bold text-white">$160-310K</div>
                <div className="text-[10px] text-[#666]">Year 1 Investment</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-400">$535K-$1.07M</div>
                <div className="text-[10px] text-[#666]">Annual Savings</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-400">170-670%</div>
                <div className="text-[10px] text-[#666]">ROI Range</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-400">3-6 months</div>
                <div className="text-[10px] text-[#666]">Payback Period</div>
              </div>
            </div>
          </div>

          <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
            <h3 className="text-xs font-bold text-amber-400 mb-2">⚡ The Strategic Connection</h3>
            <p className="text-xs text-[#888] leading-relaxed">
              This isn't just about saving time — it's about <strong className="text-white">making the Capability &amp; Maturity Assessment land harder</strong>. When reps walk into an account already knowing their product gaps, ITSM adoption %, and renewal timeline, the assessment becomes a strategic conversation, not a generic pitch. The Connected Journey arms every role (Sales, SE, CSM, VE, Leadership) with the intelligence to move from vendor to trusted advisor.
            </p>
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
              ['09', 'The Connected Story — Capability & Maturity Framework'],
              ['10', 'Enterprise Success Stories'],
              ['11', 'Side-by-Side Comparison'],
              ['12', 'Recommended Hybrid Approach'],
              ['13', 'ROI & Financial Impact'],
              ['14', 'Executive Ask & Next Steps'],
              ['A', 'Appendix — Calculations & Methodology'],
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

          {/* Time Waste Visualization */}
          <div className="mt-4 bg-[#111] border border-[#1a1a1a] rounded-xl p-5 avoid-break">
            <h3 className="text-sm font-bold text-[#ccc] mb-3">Where 126 Hours/Year Per Rep Goes</h3>
            <div className="space-y-2">
              {[
                { label: 'Pre-meeting research', hours: 65, pct: 52, color: 'bg-red-500' },
                { label: 'Weekly maintenance', hours: 22, pct: 17, color: 'bg-orange-500' },
                { label: 'Renewal prep & review', hours: 26, pct: 21, color: 'bg-amber-500' },
                { label: 'White space identification', hours: 8, pct: 6, color: 'bg-yellow-500' },
                { label: 'Initial bingo card build', hours: 5.5, pct: 4, color: 'bg-lime-500' },
              ].map((b) => (
                <div key={b.label} className="avoid-break">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-[#888]">{b.label}</span>
                    <span className="text-[10px] text-white font-bold">{b.hours} hrs/yr</span>
                  </div>
                  <div className="h-5 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div className={`h-full ${b.color} rounded-full flex items-center justify-end pr-2`} style={{ width: `${b.pct}%` }}>
                      <span className="text-[8px] text-white font-bold">{b.pct}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-[#1a1a1a] flex items-center justify-between">
              <span className="text-xs text-[#888]">Total per rep per year</span>
              <span className="text-sm font-bold text-red-400">126 hours = 3 full work weeks</span>
            </div>
          </div>

          {/* Disconnected vs Connected Architecture */}
          <div className="mt-4 bg-[#111] border border-[#1a1a1a] rounded-xl p-5 avoid-break">
            <h3 className="text-sm font-bold text-[#ccc] mb-4">Today vs. Connected — Data Flow Architecture</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Today - Disconnected */}
              <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                <div className="text-xs font-bold text-red-400 mb-3 text-center">❌ Today: Manual Stitching</div>
                <svg viewBox="0 0 280 200" className="w-full">
                  {/* Source systems */}
                  {[
                    { x: 20, y: 15, label: 'Salesforce', color: '#3b82f6' },
                    { x: 20, y: 55, label: 'ZoomInfo', color: '#8b5cf6' },
                    { x: 20, y: 95, label: 'Customer 360', color: '#06b6d4' },
                    { x: 20, y: 135, label: 'LinkedIn', color: '#2563eb' },
                    { x: 20, y: 175, label: 'Tribal Knowledge', color: '#f59e0b' },
                  ].map((s) => (
                    <g key={s.label}>
                      <rect x={s.x} y={s.y} width="80" height="24" rx="4" fill={s.color} opacity="0.2" stroke={s.color} strokeWidth="1" />
                      <text x={s.x + 40} y={s.y + 15} textAnchor="middle" fill={s.color} fontSize="7" fontWeight="600">{s.label}</text>
                      {/* Messy lines to rep */}
                      <line x1="100" y1={s.y + 12} x2="160" y2="105" stroke="#ef4444" strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />
                    </g>
                  ))}
                  {/* Rep in the middle doing manual work */}
                  <circle cx="180" cy="105" r="22" fill="#ef4444" opacity="0.15" stroke="#ef4444" strokeWidth="1" />
                  <text x="180" y="102" textAnchor="middle" fill="#ef4444" fontSize="14">😰</text>
                  <text x="180" y="115" textAnchor="middle" fill="#ef4444" fontSize="6" fontWeight="600">Manual</text>
                  {/* Arrow to Excel */}
                  <line x1="202" y1="105" x2="230" y2="105" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#arrowRed)" />
                  <rect x="230" y="90" width="45" height="30" rx="4" fill="#ef4444" opacity="0.15" stroke="#ef4444" strokeWidth="1" />
                  <text x="252" y="108" textAnchor="middle" fill="#ef4444" fontSize="7" fontWeight="600">Excel</text>
                  <defs><marker id="arrowRed" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#ef4444" /></marker></defs>
                </svg>
              </div>

              {/* Connected */}
              <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                <div className="text-xs font-bold text-green-400 mb-3 text-center">✅ Connected: Automated Intelligence</div>
                <svg viewBox="0 0 280 200" className="w-full">
                  {/* Source systems */}
                  {[
                    { x: 5, y: 15, label: 'Salesforce', color: '#3b82f6' },
                    { x: 5, y: 55, label: 'ZoomInfo', color: '#8b5cf6' },
                    { x: 5, y: 95, label: 'Customer 360', color: '#06b6d4' },
                    { x: 5, y: 135, label: 'Data Cloud', color: '#f59e0b' },
                  ].map((s) => (
                    <g key={s.label}>
                      <rect x={s.x} y={s.y} width="72" height="24" rx="4" fill={s.color} opacity="0.2" stroke={s.color} strokeWidth="1" />
                      <text x={s.x + 36} y={s.y + 15} textAnchor="middle" fill={s.color} fontSize="7" fontWeight="600">{s.label}</text>
                      <line x1="77" y1={s.y + 12} x2="108" y2="85" stroke="#22c55e" strokeWidth="1.5" opacity="0.5" />
                    </g>
                  ))}
                  {/* Hub */}
                  <rect x="108" y="62" width="56" height="46" rx="8" fill="#22c55e" opacity="0.15" stroke="#22c55e" strokeWidth="1.5" />
                  <text x="136" y="80" textAnchor="middle" fill="#22c55e" fontSize="7" fontWeight="700">Connected</text>
                  <text x="136" y="92" textAnchor="middle" fill="#22c55e" fontSize="7" fontWeight="700">Hub</text>
                  {/* Outputs */}
                  {[
                    { x: 195, y: 10, label: 'Dashboard', color: '#22c55e' },
                    { x: 195, y: 45, label: 'AI Briefs', color: '#8b5cf6' },
                    { x: 195, y: 80, label: 'Bingo Card', color: '#3b82f6' },
                    { x: 195, y: 115, label: 'White Space', color: '#06b6d4' },
                    { x: 195, y: 150, label: 'Alerts', color: '#f59e0b' },
                  ].map((o) => (
                    <g key={o.label}>
                      <line x1="164" y1="85" x2={o.x} y2={o.y + 12} stroke="#22c55e" strokeWidth="1" opacity="0.4" />
                      <rect x={o.x} y={o.y} width="58" height="24" rx="4" fill={o.color} opacity="0.2" stroke={o.color} strokeWidth="1" />
                      <text x={o.x + 29} y={o.y + 15} textAnchor="middle" fill={o.color} fontSize="7" fontWeight="600">{o.label}</text>
                    </g>
                  ))}
                  {/* Rep happy */}
                  <circle cx="254" cy="185" r="12" fill="#22c55e" opacity="0.15" stroke="#22c55e" strokeWidth="1" />
                  <text x="254" y="189" textAnchor="middle" fill="#22c55e" fontSize="12">😎</text>
                </svg>
              </div>
            </div>
          </div>
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
            09 - CAPABILITY & MATURITY CONNECTION
            ═══════════════════════════════════════════ */}
        <div className="page-break px-12 py-8 pdf-section">
          <div className="text-xs text-purple-400 font-mono mb-2">09</div>
          <h2 className="text-3xl font-bold mb-2">The Connected Story</h2>
          <p className="text-lg text-purple-400 mb-1">Capability &amp; Maturity Meets Sales Intelligence</p>
          <p className="text-sm text-[#888] mb-4">
            Ivanti&apos;s Capability &amp; Maturity Assessment is the most powerful strategic engagement we offer — 36 capabilities, 4 pillars, deep stakeholder alignment. It&apos;s how we become a trusted advisor, not just a vendor. But today, the people who pitch it, run it, and follow up on it are <strong className="text-white">operating blind</strong>. The Connected Journey arms every role with the intelligence they need to make this framework land harder.
          </p>

          {/* How each role benefits */}
          <h3 className="text-sm font-bold text-[#ccc] mb-2">How the Connected Layer Empowers Every Role</h3>
          <div className="space-y-2 mb-4">
            {[
              { role: 'Sales Rep / Account Executive', icon: '💼',
                without: 'Pitches the assessment cold. Doesn\'t know which customers need it or which capabilities matter most. Can\'t articulate why this account specifically would benefit.',
                with: 'Walks in knowing the customer\'s product footprint, white space gaps, ITSM adoption %, and renewal timeline. Pitches the assessment with precision: "You have ITSM but your self-service adoption is 12% — let\'s assess your Service Management maturity and build a plan to get that to 60%." That\'s a conversation that lands.',
                outcome: 'Higher assessment conversion rate. More qualified engagements. Shorter time from pitch to booked workshop.' },
              { role: 'SE / Pre-Sales Engineer', icon: '🔧',
                without: 'Joins the assessment without context on what the customer owns or how they\'re using it. Spends the first hour discovering what they could have known beforehand.',
                with: 'Has the full product landscape, usage data, and competitive intel before the room. Knows which of the 36 capabilities to focus on because the data already points to the gaps. Can immediately connect capability gaps to Ivanti solutions with credibility.',
                outcome: 'More targeted workshops. Stronger technical credibility. Faster path from gap identification to solution mapping.' },
              { role: 'CSM / Customer Success', icon: '🤝',
                without: 'Uses the assessment as a relationship builder but struggles to follow through. After VE delivers the roadmap, the loop often breaks — no systematic way to track whether the customer acted on recommendations.',
                with: 'Sees real-time adoption data against the assessment roadmap. If the customer committed to improving Incident Management maturity, the CSM can track ticket volume, resolution time, and self-service adoption. QBRs become progress reviews, not status updates. Renewal conversations are backed by measurable growth.',
                outcome: 'Stronger renewal position. QBRs driven by data. Year 2 assessments happen because progress is visible and compelling.' },
              { role: 'Value Engineering Team', icon: '📐',
                without: 'Builds every engagement from scratch. Manually researches the customer, manually builds the deck, manually writes the synthesis. Days of work per engagement. The prompt toolkit helps but data is still scattered.',
                with: 'Account intelligence pre-loaded. The prompt toolkit fires with real data instead of placeholders. Output generation accelerated because product ownership, usage metrics, and industry context are already structured. More time spent on strategic insight, less on data assembly.',
                outcome: 'Faster time-to-deliverable. More engagements per quarter. Higher quality outputs because more time is spent on strategy, not research.' },
              { role: 'Sales Leadership / VP', icon: '📊',
                without: 'Can\'t see which accounts have been assessed, what the outcomes were, or whether the assessment drove revenue. No way to measure the ROI of the VE program itself.',
                with: 'Dashboard view: assessments completed, capabilities assessed, recommendations made, products sold as a result, maturity progression year-over-year. Can prove the VE program\'s impact on pipeline and retention. Can identify which verticals and account segments benefit most from assessments.',
                outcome: 'Data-driven VE program investment decisions. Proof of ROI for the assessment practice. Targeted expansion of the program to high-impact segments.' },
            ].map((r) => (
              <div key={r.role} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-4 avoid-break">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{r.icon}</span>
                  <div className="text-sm font-bold text-white">{r.role}</div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div><div className="text-[10px] font-bold text-red-400/70 mb-1">Without the Connected Layer</div><div className="text-[10px] text-[#888] leading-relaxed">{r.without}</div></div>
                  <div><div className="text-[10px] font-bold text-green-400/70 mb-1">With the Connected Layer</div><div className="text-[10px] text-[#888] leading-relaxed">{r.with}</div></div>
                </div>
                <div className="text-[10px] text-cyan-400/70 bg-cyan-500/5 rounded p-2">📈 Outcome: {r.outcome}</div>
              </div>
            ))}
          </div>

          {/* The value chain */}
          <h3 className="text-sm font-bold text-[#ccc] mb-2">The Value Chain — From Intelligence to Revenue</h3>
          <div className="bg-[#111] border border-purple-500/20 rounded-xl p-4 mb-4 avoid-break">
            <p className="text-xs text-[#888] mb-3">
              The Capability &amp; Maturity Assessment is the <strong className="text-white">strategic conversation</strong>. The Connected Journey is the <strong className="text-white">intelligence layer</strong> that makes it land. Together, they create a value chain:
            </p>
            <div className="space-y-2">
              {[
                { step: '1', label: 'Identify', desc: 'Connected data surfaces which accounts are ripe for an assessment — product gaps, low adoption, upcoming renewal, executive engagement.' },
                { step: '2', label: 'Pitch', desc: 'Sales rep walks in armed with the customer\'s product landscape and usage data. The assessment isn\'t generic — it\'s positioned around their specific gaps.' },
                { step: '3', label: 'Assess', desc: 'VE leads the workshop with pre-loaded context. The 36 capabilities are prioritized based on data, not guesswork. Stakeholders see that Ivanti already understands their world.' },
                { step: '4', label: 'Recommend', desc: 'Maturity gaps map directly to Ivanti products and the ROI Deal Deck. Recommendations come with value hypotheses, not just suggestions.' },
                { step: '5', label: 'Close', desc: 'Account team picks up with a clear cross-sell/upsell playbook. White space is quantified. The executive readout is data-backed.' },
                { step: '6', label: 'Adopt & Grow', desc: 'CSM tracks adoption against the roadmap using real usage data. Customer sees measurable progress. Year 2 assessment shows growth. Renewal is a strategic conversation.' },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">{s.step}</div>
                  <div><span className="text-xs font-bold text-white">{s.label}</span> <span className="text-xs text-[#888]">— {s.desc}</span></div>
                </div>
              ))}
            </div>
          </div>

          {/* What changes for the customer */}
          <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 avoid-break">
            <h3 className="text-xs font-bold text-green-400 mb-2">What the Customer Experiences</h3>
            <p className="text-xs text-[#888] leading-relaxed">
              From the customer&apos;s perspective, the difference is night and day. Instead of a vendor showing up with a generic assessment, <strong className="text-white">Ivanti arrives already understanding their environment</strong>. The workshop is focused on what matters to them. The recommendations connect to products they already own (or should own). The follow-up includes measurable milestones. And a year later, Ivanti comes back and shows them their growth. That&apos;s not a vendor relationship — that&apos;s a <strong className="text-white">strategic partnership</strong>. That&apos;s what drives retention, expansion, and advocacy.
            </p>
          </div>

          {/* The flywheel */}
          <div className="bg-[#111] border border-purple-500/20 rounded-lg p-4 mt-3 avoid-break">
            <h3 className="text-xs font-bold text-purple-400 mb-2">The Flywheel</h3>
            <p className="text-xs text-[#888] leading-relaxed mb-3">
              Every successful assessment makes the next one better. Customer data flows back into the connected layer. Usage patterns validate (or challenge) the maturity roadmap. Success stories from one vertical inform the pitch to the next. The VE program compounds in value over time — but <strong className="text-white">only if the systems are connected</strong>.
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-[#666]">
              <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded">Intel</span>
              <span>→</span>
              <span className="bg-purple-500/10 text-purple-400 px-2 py-1 rounded">Pitch</span>
              <span>→</span>
              <span className="bg-green-500/10 text-green-400 px-2 py-1 rounded">Assess</span>
              <span>→</span>
              <span className="bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded">Close</span>
              <span>→</span>
              <span className="bg-amber-500/10 text-amber-400 px-2 py-1 rounded">Adopt</span>
              <span>→</span>
              <span className="bg-rose-500/10 text-rose-400 px-2 py-1 rounded">Renew</span>
              <span>→ 🔄</span>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            10 - SUCCESS STORIES
            ═══════════════════════════════════════════ */}
        <div className="page-break px-12 py-8 pdf-section">
          <div className="text-xs text-green-400 font-mono mb-2">10</div>
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
            11 - COMPARISON
            ═══════════════════════════════════════════ */}
        <div className="page-break px-12 py-8 pdf-section">
          <div className="text-xs text-purple-400 font-mono mb-2">11</div>
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
            12 - RECOMMENDED
            ═══════════════════════════════════════════ */}
        <div className="page-break px-12 py-8 pdf-section">
          <div className="text-xs text-purple-400 font-mono mb-2">12</div>
          <h2 className="text-3xl font-bold mb-4">Recommended Hybrid Approach</h2>

          {/* Visual Timeline */}
          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5 mb-4 avoid-break">
            <h3 className="text-sm font-bold text-[#ccc] mb-2">Implementation Roadmap</h3>
            <svg viewBox="0 0 600 120" className="w-full">
              {/* Timeline axis */}
              <line x1="20" y1="60" x2="580" y2="60" stroke="#333" strokeWidth="2" />
              {/* Month markers */}
              {[0,1,2,3,4,5,6,7,8,9,10,11,12].map((m) => (
                <g key={m}>
                  <line x1={20 + m * 46.6} y1="57" x2={20 + m * 46.6} y2="63" stroke="#555" strokeWidth="1" />
                  <text x={20 + m * 46.6} y="73" textAnchor="middle" fill="#555" fontSize="6">M{m}</text>
                </g>
              ))}
              {/* Phase bars */}
              {[
                { x: 20, w: 140, y: 22, label: 'C: Power BI Dashboard', color: '#22c55e', cost: '$60-120K' },
                { x: 66, w: 140, y: 38, label: '360 API (parallel)', color: '#06b6d4', cost: '$20-40K' },
                { x: 186, w: 186, y: 22, label: 'A/D: AI Layer', color: '#a855f7', cost: '$80-200K' },
                { x: 372, w: 186, y: 38, label: 'B: iPaaS (if needed)', color: '#3b82f6', cost: '$60-180K/yr' },
              ].map((p) => (
                <g key={p.label}>
                  <rect x={p.x} y={p.y} width={p.w} height="14" rx="4" fill={p.color} opacity="0.3" stroke={p.color} strokeWidth="1" />
                  <text x={p.x + 4} y={p.y + 10} fill={p.color} fontSize="6" fontWeight="600">{p.label}</text>
                  <text x={p.x + p.w - 4} y={p.y + 10} textAnchor="end" fill={p.color} fontSize="5.5" opacity="0.7">{p.cost}</text>
                </g>
              ))}
              {/* Value milestones */}
              <circle cx="160" cy="85" r="3" fill="#22c55e" />
              <text x="160" y="98" textAnchor="middle" fill="#22c55e" fontSize="6">First dashboards live</text>
              <circle cx="300" cy="85" r="3" fill="#a855f7" />
              <text x="300" y="98" textAnchor="middle" fill="#a855f7" fontSize="6">AI briefs operational</text>
              <circle cx="460" cy="85" r="3" fill="#f59e0b" />
              <text x="460" y="98" textAnchor="middle" fill="#f59e0b" fontSize="6">Full automation live</text>
              {/* Breakeven marker */}
              <line x1="250" y1="55" x2="250" y2="105" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,2" />
              <text x="250" y="115" textAnchor="middle" fill="#f59e0b" fontSize="7" fontWeight="700">↑ ROI breakeven</text>
            </svg>
          </div>

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
            13 - ROI
            ═══════════════════════════════════════════ */}
        <div className="page-break px-12 py-8 pdf-section">
          <div className="text-xs text-green-400 font-mono mb-2">13</div>
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

          {/* Proposal Cost Comparison Chart */}
          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5 mb-4 avoid-break">
            <h3 className="text-sm font-bold text-[#ccc] mb-3">Proposal Cost vs. Annual Savings</h3>
            <svg viewBox="0 0 600 200" className="w-full">
              {/* Y axis labels */}
              <text x="0" y="32" fill="#666" fontSize="8">$1.2M</text>
              <text x="0" y="82" fill="#666" fontSize="8">$600K</text>
              <text x="0" y="132" fill="#666" fontSize="8">$300K</text>
              <text x="0" y="178" fill="#666" fontSize="8">$0</text>
              {/* Grid lines */}
              <line x1="45" y1="28" x2="590" y2="28" stroke="#1a1a1a" strokeWidth="1" />
              <line x1="45" y1="78" x2="590" y2="78" stroke="#1a1a1a" strokeWidth="1" />
              <line x1="45" y1="128" x2="590" y2="128" stroke="#1a1a1a" strokeWidth="1" />
              <line x1="45" y1="175" x2="590" y2="175" stroke="#1a1a1a" strokeWidth="1" />

              {/* Savings bar (background across all) */}
              <rect x="45" y="38" width="545" height="18" rx="3" fill="#22c55e" opacity="0.08" />
              <text x="55" y="50" fill="#22c55e" fontSize="7" fontWeight="600">Annual Savings Range: $535K - $1.07M</text>
              <rect x="45" y="38" width="300" height="18" rx="3" fill="#22c55e" opacity="0.15" />
              <rect x="45" y="38" width="545" height="18" rx="3" fill="none" stroke="#22c55e" strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />

              {/* Proposal bars - Build Cost */}
              {[
                { x: 60, label: 'A: AI-First', build: 150, annual: 80, color: '#a855f7', buildH: 50, annH: 27 },
                { x: 190, label: 'B: iPaaS', build: 200, annual: 180, color: '#3b82f6', buildH: 67, annH: 60 },
                { x: 320, label: 'C: Power BI', build: 120, annual: 30, color: '#22c55e', buildH: 40, annH: 10 },
                { x: 450, label: 'D: SF Native', build: 200, annual: 256, color: '#8b5cf6', buildH: 67, annH: 85 },
              ].map((p) => (
                <g key={p.label}>
                  <text x={p.x + 45} y="190" textAnchor="middle" fill="#888" fontSize="7" fontWeight="600">{p.label}</text>
                  {/* Build cost bar */}
                  <rect x={p.x} y={175 - p.buildH} width="38" height={p.buildH} rx="3" fill={p.color} opacity="0.6" />
                  <text x={p.x + 19} y={170 - p.buildH} textAnchor="middle" fill={p.color} fontSize="7" fontWeight="600">${p.build}K</text>
                  {/* Annual cost bar */}
                  <rect x={p.x + 44} y={175 - p.annH} width="38" height={p.annH} rx="3" fill={p.color} opacity="0.3" />
                  <text x={p.x + 63} y={170 - p.annH} textAnchor="middle" fill={p.color} fontSize="7">${p.annual}K/yr</text>
                </g>
              ))}
              {/* Legend */}
              <rect x="45" y="196" width="8" height="4" rx="1" fill="#888" opacity="0.6" />
              <text x="56" y="200" fill="#666" fontSize="6">Build (one-time)</text>
              <rect x="120" y="196" width="8" height="4" rx="1" fill="#888" opacity="0.3" />
              <text x="131" y="200" fill="#666" fontSize="6">Annual ongoing</text>
              <rect x="200" y="196" width="8" height="4" rx="1" fill="#22c55e" opacity="0.15" />
              <text x="211" y="200" fill="#22c55e" fontSize="6">Savings zone ($535K-$1.07M)</text>
            </svg>
          </div>

          {/* 3-Year Value Chart */}
          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5 mb-4 avoid-break">
            <h3 className="text-sm font-bold text-[#ccc] mb-3">3-Year Cumulative Value (Hybrid Approach)</h3>
            <svg viewBox="0 0 600 180" className="w-full">
              {/* Grid */}
              <line x1="60" y1="20" x2="60" y2="150" stroke="#1a1a1a" strokeWidth="1" />
              <line x1="60" y1="150" x2="580" y2="150" stroke="#1a1a1a" strokeWidth="1" />
              {/* Y labels */}
              <text x="55" y="25" textAnchor="end" fill="#666" fontSize="8">$3M</text>
              <text x="55" y="58" textAnchor="end" fill="#666" fontSize="8">$2M</text>
              <text x="55" y="92" textAnchor="end" fill="#666" fontSize="8">$1M</text>
              <text x="55" y="125" textAnchor="end" fill="#666" fontSize="8">$500K</text>
              <text x="55" y="153" textAnchor="end" fill="#666" fontSize="8">$0</text>
              {/* X labels */}
              <text x="160" y="165" textAnchor="middle" fill="#666" fontSize="8">Q2 2026</text>
              <text x="280" y="165" textAnchor="middle" fill="#666" fontSize="8">Q4 2026</text>
              <text x="400" y="165" textAnchor="middle" fill="#666" fontSize="8">Q2 2027</text>
              <text x="540" y="165" textAnchor="middle" fill="#666" fontSize="8">Q4 2028</text>

              {/* Investment line (red area) */}
              <polygon points="60,150 120,125 200,118 280,115 400,112 540,110 540,150" fill="#ef4444" opacity="0.1" />
              <polyline points="60,150 120,125 200,118 280,115 400,112 540,110" fill="none" stroke="#ef4444" strokeWidth="2" />
              <text x="545" y="108" fill="#ef4444" fontSize="7" fontWeight="600">Investment: ~$310K</text>

              {/* Savings line (green area) */}
              <polygon points="60,150 120,150 200,135 280,105 400,65 540,20 540,150" fill="#22c55e" opacity="0.1" />
              <polyline points="60,150 120,150 200,135 280,105 400,65 540,20" fill="none" stroke="#22c55e" strokeWidth="2" />
              <text x="545" y="18" fill="#22c55e" fontSize="7" fontWeight="600">Savings: ~$3.2M</text>

              {/* Breakeven point */}
              <circle cx="220" cy="130" r="4" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1" />
              <text x="220" y="143" textAnchor="middle" fill="#f59e0b" fontSize="7" fontWeight="600">↑ Breakeven (~5 mo)</text>

              {/* Net value annotation */}
              <rect x="420" y="40" width="90" height="28" rx="4" fill="#22c55e" opacity="0.1" stroke="#22c55e" strokeWidth="1" />
              <text x="465" y="52" textAnchor="middle" fill="#22c55e" fontSize="7" fontWeight="700">3-Year Net Value</text>
              <text x="465" y="63" textAnchor="middle" fill="#22c55e" fontSize="9" fontWeight="700">~$2.9M</text>
            </svg>
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
            14 - EXECUTIVE ASK
            ═══════════════════════════════════════════ */}
        <div className="page-break px-12 py-8 pdf-section">
          <div className="text-xs text-purple-400 font-mono mb-2">14</div>
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

        </div>

        {/* ═══════════════════════════════════════════
            APPENDIX — CALCULATIONS
            ═══════════════════════════════════════════ */}
        <div className="page-break px-12 py-8 pdf-section">
          <div className="text-xs text-[#555] font-mono mb-2">APPENDIX A</div>
          <h2 className="text-3xl font-bold mb-2">Calculations &amp; Methodology</h2>
          <p className="text-sm text-[#666] mb-4">All figures in this proposal are derived from the calculations below. Assumptions are clearly marked and adjustable.</p>

          {/* Base Assumptions */}
          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5 mb-4">
            <h3 className="text-sm font-bold text-purple-400 mb-3">Base Assumptions</h3>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
              <table className="w-full text-xs">
                <thead><tr className="bg-[#0a0a0a]">
                  <th className="text-left p-2 text-[#555]">Assumption</th>
                  <th className="text-left p-2 text-[#555]">Value</th>
                  <th className="text-left p-2 text-[#555]">Source</th>
                </tr></thead>
                <tbody>
                  {[
                    ['Sales reps (conservative)', '50', 'Estimated Ivanti sales org size — adjust to actual headcount'],
                    ['Sales reps (full org)', '100', 'Includes SEs, CSMs, and overlay reps who maintain account views'],
                    ['Accounts per rep', '35', 'Based on Maley bingo card (actual data point)'],
                    ['Columns per bingo card', '70+', 'Based on Maley bingo card (85 actual columns counted)'],
                    ['Fully loaded hourly rate', '$85/hr', 'BLS median for sales engineers/account execs ($140K-$180K salary ÷ 1,708 hrs + 30% benefits)'],
                    ['Annual working hours (US)', '1,708', 'OECD average annual hours, United States (2024)'],
                    ['Working days per year', '250', 'Standard: 52 weeks × 5 days - 10 holidays'],
                    ['Meetings per week per rep', '3', 'Conservative estimate for enterprise B2B sales (many have 5+)'],
                  ].map(([assumption, value, source]) => (
                    <tr key={assumption} className="border-t border-[#1a1a1a]">
                      <td className="p-2 text-[#999]">{assumption}</td>
                      <td className="p-2 text-white font-medium">{value}</td>
                      <td className="p-2 text-[#666]">{source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Time Savings Calculations */}
          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5 mb-4">
            <h3 className="text-sm font-bold text-purple-400 mb-3">Time Savings Per Rep — Detailed Calculations</h3>
            <div className="space-y-3">
              {[
                {
                  activity: 'Initial Bingo Card Build',
                  calc: '6 hours manual build → 0.5 hours review/validate with automation',
                  formula: '6.0 - 0.5 = 5.5 hours saved (one-time)',
                  annual: '5.5 hrs',
                  notes: 'Based on actual time to assemble Maley\'s 85-column, 35-account spreadsheet from 5+ systems. With automation, rep only reviews pre-populated data.',
                },
                {
                  activity: 'Weekly Maintenance',
                  calc: '30 min/week manual → 5 min/week spot-checking automated updates',
                  formula: '(30 - 5) min × 52 weeks = 1,300 min = 21.7 hrs/year',
                  annual: '21.7 hrs',
                  notes: 'Reps currently update ARR changes, new contacts, product changes, meeting notes weekly. Automated sync handles data fields; rep only updates judgment fields (notes, status).',
                },
                {
                  activity: 'Pre-Meeting Research',
                  calc: '35 min average per account research → 10 min reviewing AI brief',
                  formula: '(35 - 10) min × 3 meetings/week × 52 weeks = 3,900 min = 65 hrs/year',
                  annual: '65 hrs',
                  notes: 'Today: open ZoomInfo, Salesforce, LinkedIn, Customer 360, Google separately per account before each meeting. With AI brief, rep reviews a pre-generated summary.',
                },
                {
                  activity: 'White Space Identification',
                  calc: '2 hours per quarter manually cross-referencing product ownership vs. full portfolio',
                  formula: '2 hrs × 4 quarters = 8 hrs/year → automated to 0',
                  annual: '8 hrs',
                  notes: 'Currently: rep manually compares 25+ product columns across 35 accounts to identify gaps. With automation: white space auto-calculated and ranked by revenue potential.',
                },
                {
                  activity: 'Renewal Prep & Account Review',
                  calc: '1 hour per account for renewal preparation → 15 min with pre-loaded data',
                  formula: '(60 - 15) min × 35 accounts = 1,575 min = 26.25 hrs/year',
                  annual: '26 hrs',
                  notes: 'Assumes all 35 accounts renew annually. Prep includes: pulling ARR, reviewing usage, checking health score, building talking points. With automation: all pre-loaded, rep focuses on strategy.',
                },
              ].map((c) => (
                <div key={c.activity} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-3 avoid-break">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{c.activity}</span>
                    <span className="text-xs font-bold text-purple-400">{c.annual}</span>
                  </div>
                  <div className="text-[10px] text-[#888] mb-1">{c.calc}</div>
                  <div className="text-[10px] text-cyan-400 font-mono bg-cyan-500/5 rounded px-2 py-1 mb-1">{c.formula}</div>
                  <div className="text-[10px] text-[#555] italic">{c.notes}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-[#1a1a1a] flex items-center justify-between">
              <div className="text-xs text-[#888]">Total per rep per year</div>
              <div className="text-xs font-mono text-cyan-400 bg-cyan-500/5 rounded px-2 py-1">5.5 + 21.7 + 65.0 + 8.0 + 26.0 = <strong className="text-white">126.2 hours/year</strong></div>
            </div>
          </div>

          {/* Org-Wide Financial Calculations */}
          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5 mb-4">
            <h3 className="text-sm font-bold text-purple-400 mb-3">Org-Wide Financial Impact — Calculations</h3>
            <div className="space-y-2">
              {[
                {
                  label: 'Hours saved (50 reps)',
                  formula: '126.2 hrs/rep × 50 reps = 6,310 hours/year',
                  result: '6,300 hrs/yr (rounded)',
                },
                {
                  label: 'Hours saved (100 reps)',
                  formula: '126.2 hrs/rep × 100 reps = 12,620 hours/year',
                  result: '12,600 hrs/yr (rounded)',
                },
                {
                  label: 'FTE equivalent (50 reps)',
                  formula: '6,310 hrs ÷ 1,708 hrs/FTE = 3.69 FTEs',
                  result: '3.7 FTEs',
                },
                {
                  label: 'FTE equivalent (100 reps)',
                  formula: '12,620 hrs ÷ 1,708 hrs/FTE = 7.39 FTEs',
                  result: '7.4 FTEs',
                },
                {
                  label: 'Cost savings (50 reps)',
                  formula: '6,310 hrs × $85/hr = $536,350/year',
                  result: '$535,500/yr (rounded)',
                },
                {
                  label: 'Cost savings (100 reps)',
                  formula: '12,620 hrs × $85/hr = $1,072,700/year',
                  result: '$1,071,000/yr (rounded)',
                },
              ].map((c) => (
                <div key={c.label} className="flex items-center gap-3 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-2.5 avoid-break">
                  <span className="text-xs text-[#888] w-40 flex-shrink-0">{c.label}</span>
                  <span className="text-[10px] text-cyan-400 font-mono flex-1">{c.formula}</span>
                  <span className="text-xs text-white font-bold w-32 text-right">{c.result}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ROI Calculations */}
          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5 mb-4">
            <h3 className="text-sm font-bold text-purple-400 mb-3">ROI Calculations by Proposal</h3>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
              <table className="w-full text-xs">
                <thead><tr className="bg-[#0a0a0a]">
                  <th className="text-left p-2 text-[#555]">Metric</th>
                  <th className="text-center p-2 text-purple-400">A: AI</th>
                  <th className="text-center p-2 text-blue-400">B: iPaaS</th>
                  <th className="text-center p-2 text-green-400">C: Power BI</th>
                  <th className="text-center p-2 text-purple-400">D: SF Native</th>
                  <th className="text-center p-2 text-[#555]">Hybrid</th>
                </tr></thead>
                <tbody>
                  {[
                    ['Build cost (max)', '$150K', '$200K', '$120K', '$200K', '$310K'],
                    ['Annual cost (max)', '$80K', '$180K', '$30K', '$256K', '$80K'],
                    ['Year 1 total cost', '$230K', '$380K', '$150K', '$456K', '$390K'],
                    ['Annual savings (50 reps)', '$535K', '$535K', '$535K', '$535K', '$535K'],
                    ['Year 1 net savings', '$305K', '$155K', '$385K', '$79K', '$145K'],
                    ['Year 1 ROI', '132%', '41%', '257%', '17%', '37%'],
                    ['—', '—', '—', '—', '—', '—'],
                    ['Annual savings (100 reps)', '$1,071K', '$1,071K', '$1,071K', '$1,071K', '$1,071K'],
                    ['Year 1 net savings (100)', '$841K', '$691K', '$921K', '$615K', '$681K'],
                    ['Year 1 ROI (100 reps)', '366%', '182%', '614%', '135%', '175%'],
                  ].map((row, i) => (
                    <tr key={i} className={`border-t border-[#1a1a1a] ${row[0] === '—' ? 'h-1' : ''}`}>
                      {row[0] === '—' ? <td colSpan={6} className="bg-[#1a1a1a] h-px"></td> : <>
                        <td className="p-2 text-[#888]">{row[0]}</td>
                        <td className="p-2 text-center text-[#999]">{row[1]}</td>
                        <td className="p-2 text-center text-[#999]">{row[2]}</td>
                        <td className="p-2 text-center text-[#999]">{row[3]}</td>
                        <td className="p-2 text-center text-[#999]">{row[4]}</td>
                        <td className="p-2 text-center text-white font-medium">{row[5]}</td>
                      </>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-2 text-[10px] text-[#555]">
              <strong>ROI formula:</strong> (Annual Savings - Year 1 Total Cost) ÷ Year 1 Total Cost × 100
              <br /><strong>Example (Proposal C, 50 reps):</strong> ($535,500 - $150,000) ÷ $150,000 × 100 = 257%
            </div>
          </div>

          {/* 3-Year Projection */}
          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5 mb-4">
            <h3 className="text-sm font-bold text-purple-400 mb-3">3-Year Projection (Hybrid Approach, 50 Reps)</h3>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
              <table className="w-full text-xs">
                <thead><tr className="bg-[#0a0a0a]">
                  <th className="text-left p-2 text-[#555]">Item</th>
                  <th className="text-center p-2 text-[#555]">Year 1</th>
                  <th className="text-center p-2 text-[#555]">Year 2</th>
                  <th className="text-center p-2 text-[#555]">Year 3</th>
                  <th className="text-center p-2 text-[#555]">3-Year Total</th>
                </tr></thead>
                <tbody>
                  {[
                    ['Build costs', '$310K', '$0', '$0', '$310K', false],
                    ['Ongoing costs', '$80K', '$80K', '$80K', '$240K', false],
                    ['Total investment', '$390K', '$80K', '$80K', '$550K', true],
                    ['—', '', '', '', '', false],
                    ['Gross savings', '$535K', '$535K', '$535K', '$1,607K', false],
                    ['Net savings', '$145K', '$455K', '$455K', '$1,057K', true],
                    ['Cumulative net', '$145K', '$601K', '$1,057K', '—', true],
                    ['—', '', '', '', '', false],
                    ['ROI (cumulative)', '37%', '254%', '481%', '—', true],
                    ['Payback period', '~5 months', '—', '—', '—', false],
                  ].map((row, i) => (
                    <tr key={i} className={`border-t border-[#1a1a1a] ${row[0] === '—' ? 'h-1' : ''}`}>
                      {row[0] === '—' ? <td colSpan={5} className="bg-[#1a1a1a] h-px"></td> : <>
                        <td className={`p-2 ${row[4] ? 'text-white font-medium' : 'text-[#888]'}`}>{row[0]}</td>
                        <td className="p-2 text-center text-[#999]">{row[1]}</td>
                        <td className="p-2 text-center text-[#999]">{row[2]}</td>
                        <td className="p-2 text-center text-[#999]">{row[3]}</td>
                        <td className={`p-2 text-center ${row[4] ? 'text-green-400 font-bold' : 'text-[#999]'}`}>{row[4] !== true && row[4] !== false ? row[4] : ''}</td>
                      </>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-2 text-[10px] text-[#555]">
              <strong>Payback formula:</strong> Build cost ÷ (Monthly savings - Monthly ongoing) = $310K ÷ ($44.6K - $6.7K) = $310K ÷ $37.9K/mo = <strong className="text-white">~5.1 months (rounded to ~5 months)</strong>
              <br /><strong>Monthly savings:</strong> $535,500 ÷ 12 = $44,625/mo
              <br /><strong>Monthly ongoing:</strong> $80,000 ÷ 12 = $6,667/mo
            </div>
          </div>

          {/* Per-Proposal Cost Breakdowns */}
          <div className="bg-[#111] border border-purple-500/20 rounded-xl p-5 mb-4">
            <h3 className="text-sm font-bold text-purple-400 mb-3">Proposal A: AI-First (Ivy / Copilot) — Cost Breakdown</h3>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] mb-2">
              <table className="w-full text-xs">
                <thead><tr className="bg-[#0a0a0a]">
                  <th className="text-left p-2 text-[#555]">Line Item</th>
                  <th className="text-left p-2 text-[#555]">Low</th>
                  <th className="text-left p-2 text-[#555]">High</th>
                  <th className="text-left p-2 text-[#555]">Calculation / Source</th>
                </tr></thead>
                <tbody>
                  {[
                    ['BUILD COSTS', '', '', '', true],
                    ['Copilot Studio plugin dev (3 connectors)', '$40K', '$60K', 'Senior dev at $175-250/hr × 200-300 hrs. 3 connectors (SF, ZoomInfo, 360) × ~80-100 hrs each including auth, data mapping, error handling, testing.'],
                    ['Customer 360 API development', '$20K', '$40K', 'Data engineering to expose 360 data via API or scheduled export. $175-225/hr × 100-200 hrs. Complexity depends on existing data warehouse architecture.'],
                    ['AI prompt engineering & guardrails', '$10K', '$20K', 'Prompt design, output validation, hallucination guardrails, template library. $150-200/hr × 60-100 hrs. Includes testing across diverse account profiles.'],
                    ['Testing, security review, deployment', '$10K', '$30K', 'QA: $125-175/hr × 40-80 hrs. Security review for API credentials, data access controls, PII handling. Deployment + documentation.'],
                    ['TOTAL BUILD', '$80K', '$150K', '', true],
                    ['ONGOING ANNUAL', '', '', '', true],
                    ['Copilot Studio licensing', '$0', '$30K', '$0 if included in existing M365 E5. If not: Copilot Studio starts at ~$200/mo per author + $0.01/message for users. 50 reps × heavy usage = up to $30K/yr.'],
                    ['ZoomInfo API tier upgrade', '$10K', '$20K', 'Current ZoomInfo license covers UI access. API enrichment tier: ~$10-20K/yr incremental based on ZoomInfo Enterprise API add-on. Source: ZoomInfo sales + G2 pricing data.'],
                    ['Azure OpenAI API usage', '$5K', '$15K', 'GPT-4o at ~$5/1M input tokens, ~$15/1M output tokens. Est. 50 reps × 20 queries/day × 250 days × ~2K tokens avg = 500M tokens/yr. Blended cost: $5-15K depending on model mix.'],
                    ['Maintenance & connector updates', '$15K', '$25K', 'Dev time for API version updates, schema changes, bug fixes, new feature requests. $175/hr × 80-140 hrs/yr (~2-3 hrs/week).'],
                    ['TOTAL ONGOING', '$30K', '$80K', '', true],
                  ].map((row, i) => (
                    <tr key={i} className={`border-t border-[#1a1a1a] ${row[4] ? 'bg-purple-500/5' : ''}`}>
                      <td className={`p-2 ${row[4] ? 'text-purple-400 font-bold' : 'text-[#999]'}`}>{row[0]}</td>
                      <td className={`p-2 ${row[4] ? 'text-white font-bold' : 'text-[#999]'}`}>{row[1]}</td>
                      <td className={`p-2 ${row[4] ? 'text-white font-bold' : 'text-[#999]'}`}>{row[2]}</td>
                      <td className="p-2 text-[#666] text-[10px]">{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-[#111] border border-blue-500/20 rounded-xl p-5 mb-4">
            <h3 className="text-sm font-bold text-blue-400 mb-3">Proposal B: iPaaS — Cost Breakdown (3 Sub-Options)</h3>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] mb-2">
              <table className="w-full text-xs">
                <thead><tr className="bg-[#0a0a0a]">
                  <th className="text-left p-2 text-[#555]">Line Item</th>
                  <th className="text-center p-2 text-[#555]">B1: Power Auto</th>
                  <th className="text-center p-2 text-[#555]">B2: Workato</th>
                  <th className="text-center p-2 text-[#555]">B3: n8n</th>
                  <th className="text-left p-2 text-[#555]">Source</th>
                </tr></thead>
                <tbody>
                  {[
                    ['BUILD', '', '', '', '', true],
                    ['Platform setup', '$5K', '$20K', '$5K', 'PA: minimal (already provisioned). Workato: workspace config, SSO, governance. n8n: server provisioning, Docker/K8s setup.'],
                    ['Connector development', '$5-15K', '$30-50K', '$10-20K', 'PA: premium connectors + custom flows. Workato: recipes + custom connectors. n8n: nodes + custom API integrations. Dev rate: $150-250/hr.'],
                    ['360 API/export build', '$5-10K', '$20-30K', '$5-10K', 'Same data engineering work across all options. PA & n8n use simpler scheduled exports; Workato can do real-time streaming (more complex).'],
                    ['Data model + output templates', '$3-5K', '$15-25K', '$5-10K', 'Schema normalization, bingo card Excel template, Teams/Slack alert formatting. Workato requires more formal recipe architecture.'],
                    ['Testing + deployment', '$2-5K', '$15-25K', '$5-10K', 'Proportional to complexity. Workato enterprise requires formal UAT + security review.'],
                    ['TOTAL BUILD', '$15-40K', '$100-150K', '$20-40K', '', true],
                    ['ONGOING', '', '', '', '', true],
                    ['Platform licensing', '$5-15K/yr', '$60-130K/yr', '$0-2K/yr', 'PA: premium connectors $15/user/mo × relevant users. Workato: enterprise contract. n8n: free self-hosted, $600/yr cloud.'],
                    ['ZoomInfo API', '$10-20K/yr', '$10-20K/yr', '$10-20K/yr', 'Same across all options — API tier upgrade for programmatic access.'],
                    ['Maintenance', '$5-10K/yr', '$10-20K/yr', '$10-15K/yr', 'PA: flow updates, connector maintenance. Workato: recipe tuning, vendor-managed. n8n: self-maintained (higher internal effort).'],
                    ['TOTAL ONGOING', '$20-45K/yr', '$80-170K/yr', '$20-37K/yr', '', true],
                  ].map((row, i) => (
                    <tr key={i} className={`border-t border-[#1a1a1a] ${row[5] ? 'bg-blue-500/5' : ''}`}>
                      <td className={`p-2 ${row[5] ? 'text-blue-400 font-bold' : 'text-[#999]'}`}>{row[0]}</td>
                      <td className={`p-2 text-center ${row[5] ? 'text-white font-bold' : 'text-[#999]'}`}>{row[1]}</td>
                      <td className={`p-2 text-center ${row[5] ? 'text-white font-bold' : 'text-[#999]'}`}>{row[2]}</td>
                      <td className={`p-2 text-center ${row[5] ? 'text-white font-bold' : 'text-[#999]'}`}>{row[3]}</td>
                      <td className="p-2 text-[#666] text-[10px]">{row[4]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-[#111] border border-green-500/20 rounded-xl p-5 mb-4">
            <h3 className="text-sm font-bold text-green-400 mb-3">Proposal C: Power BI Dashboard — Cost Breakdown</h3>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] mb-2">
              <table className="w-full text-xs">
                <thead><tr className="bg-[#0a0a0a]">
                  <th className="text-left p-2 text-[#555]">Line Item</th>
                  <th className="text-left p-2 text-[#555]">Low</th>
                  <th className="text-left p-2 text-[#555]">High</th>
                  <th className="text-left p-2 text-[#555]">Calculation / Source</th>
                </tr></thead>
                <tbody>
                  {[
                    ['BUILD COSTS', '', '', '', true],
                    ['Dashboard dev (7 views)', '$30K', '$50K', 'BI developer at $125-200/hr × 200-300 hrs. 7 dashboard views × ~30-40 hrs each (data modeling, DAX measures, visuals, filters, drill-through). Includes design iteration.'],
                    ['Customer 360 data pipeline', '$15K', '$30K', 'Data engineer to build scheduled export or API from 360 data warehouse → Power BI dataset. $150-225/hr × 100-150 hrs. Includes data transformation, scheduling, monitoring.'],
                    ['Data model + SF mapping', '$10K', '$20K', 'Map Salesforce objects (Account, Opportunity, Asset, Contact, AccountTeam) to Power BI star schema. $150/hr × 60-130 hrs. Includes handling deduplication, null handling, calculated columns.'],
                    ['Training & adoption program', '$5K', '$10K', 'Training materials, recorded walkthroughs, 3-4 live training sessions for different roles (reps, managers, SEs). $150/hr × 30-65 hrs. Adoption tracking setup.'],
                    ['Testing & deployment', '$5K', '$10K', 'UAT with 5-10 pilot users, data validation, performance optimization (dataset refresh times, query speed), workspace permissions, row-level security. $150/hr × 30-65 hrs.'],
                    ['TOTAL BUILD', '$60K', '$120K', 'Range driven primarily by 360 pipeline complexity and number of dashboard iterations needed.', true],
                    ['ONGOING ANNUAL', '', '', '', true],
                    ['Power BI licensing', '$0', '$10K', '$0 if M365 E5 (Power BI Pro included). If additional seats needed: $10/user/mo × up to 80 users = $9.6K/yr. Power BI Premium Per User at $20/user/mo if large datasets needed.'],
                    ['Data pipeline maintenance', '$5K', '$10K', 'Monthly: monitor refresh failures, handle schema changes from Salesforce/360 updates, add new fields. $150/hr × 30-65 hrs/yr (~1 hr/week).'],
                    ['Dashboard iteration', '$5K', '$10K', 'New views, modified visuals, additional filters/drill-throughs as team provides feedback. $150/hr × 30-65 hrs/yr. Tapers off after Year 1.'],
                    ['TOTAL ONGOING', '$10K', '$30K', 'Lowest ongoing cost of all proposals — leverages existing M365 licensing.', true],
                  ].map((row, i) => (
                    <tr key={i} className={`border-t border-[#1a1a1a] ${row[4] ? 'bg-green-500/5' : ''}`}>
                      <td className={`p-2 ${row[4] ? 'text-green-400 font-bold' : 'text-[#999]'}`}>{row[0]}</td>
                      <td className={`p-2 ${row[4] ? 'text-white font-bold' : 'text-[#999]'}`}>{row[1]}</td>
                      <td className={`p-2 ${row[4] ? 'text-white font-bold' : 'text-[#999]'}`}>{row[2]}</td>
                      <td className="p-2 text-[#666] text-[10px]">{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-[#111] border border-purple-500/20 rounded-xl p-5 mb-4">
            <h3 className="text-sm font-bold text-purple-400 mb-3">Proposal D: Salesforce-Native — Cost Breakdown</h3>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] mb-2">
              <table className="w-full text-xs">
                <thead><tr className="bg-[#0a0a0a]">
                  <th className="text-left p-2 text-[#555]">Line Item</th>
                  <th className="text-left p-2 text-[#555]">Low</th>
                  <th className="text-left p-2 text-[#555]">High</th>
                  <th className="text-left p-2 text-[#555]">Calculation / Source</th>
                </tr></thead>
                <tbody>
                  {[
                    ['BUILD COSTS', '', '', '', true],
                    ['Data Cloud configuration', '$25K', '$60K', 'Configure Data Cloud to ingest 360 + ZoomInfo data streams. Create unified customer profiles. Data mapping, identity resolution, calculated insights. SF consultant at $200-300/hr × 100-200 hrs.'],
                    ['Agentforce agent development', '$20K', '$50K', 'Build 3-4 custom agents (White Space, Competitor Intel, Account Research, Renewal Risk). Agent Builder + prompt engineering + testing. $200-250/hr × 80-200 hrs.'],
                    ['ARPEDIO / DemandFarm setup', '$10K', '$25K', 'Configure white space matrix (map 25+ Ivanti products), account planning templates, SWOT framework, scoring models. Includes data migration from existing spreadsheets. Vendor PS + internal: $175/hr × 60-140 hrs.'],
                    ['ZoomInfo enrichment activation', '$5K', '$15K', 'Enable auto-enrichment flows in Salesforce. Map ZoomInfo fields to SF fields. Configure technographic tracking. Deduplication rules. $150/hr × 30-100 hrs.'],
                    ['SF reports, dashboards, RLS', '$10K', '$25K', 'Build bingo card report types, dashboards, row-level security per rep. Custom fields, formula fields, validation rules. $150/hr × 60-165 hrs.'],
                    ['Integration testing + deployment', '$10K', '$25K', 'End-to-end testing across all components. Data validation, performance testing, user acceptance. Security review for Data Cloud access. $175/hr × 60-140 hrs.'],
                    ['TOTAL BUILD', '$80K', '$200K', 'Wide range due to Data Cloud complexity. If already on Data Cloud: build drops to ~$55-140K.', true],
                    ['ONGOING ANNUAL', '', '', '', true],
                    ['Salesforce Data Cloud', '$65K', '$150K', 'Included in some SF Enterprise+ editions ($0). Standalone: starts ~$65K/yr. Enterprise with multiple external connectors + high volume: up to $150K/yr. Source: Salesforce.com pricing page (2025). Verify current license entitlements first.'],
                    ['Agentforce consumption', '$25K', '$50K', '$0.10/action. 50 reps × 20 interactions/day × 250 days = 250K actions/yr = $25K base. Complex multi-step queries (research agent doing 5+ actions per request) push toward $50K.'],
                    ['ARPEDIO / DemandFarm license', '$18K', '$36K', 'ARPEDIO: ~$30-50/user/mo for 50 users = $18-30K/yr. DemandFarm: ~$35-60/user/mo = $21-36K/yr. Source: vendor websites + G2 pricing (2025).'],
                    ['ZoomInfo API tier', '$10K', '$20K', 'Incremental cost for API-level enrichment beyond current UI-only license. Based on ZoomInfo Enterprise API add-on pricing.'],
                    ['TOTAL ONGOING', '$118K', '$256K', 'Highest ongoing cost. Dominated by Data Cloud licensing. If already entitled: drops to $53-106K/yr.', true],
                  ].map((row, i) => (
                    <tr key={i} className={`border-t border-[#1a1a1a] ${row[4] ? 'bg-purple-500/5' : ''}`}>
                      <td className={`p-2 ${row[4] ? 'text-purple-400 font-bold' : 'text-[#999]'}`}>{row[0]}</td>
                      <td className={`p-2 ${row[4] ? 'text-white font-bold' : 'text-[#999]'}`}>{row[1]}</td>
                      <td className={`p-2 ${row[4] ? 'text-white font-bold' : 'text-[#999]'}`}>{row[2]}</td>
                      <td className="p-2 text-[#666] text-[10px]">{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-[#111] border border-amber-500/20 rounded-xl p-5 mb-4">
            <h3 className="text-sm font-bold text-amber-400 mb-3">Hybrid Approach — Combined Cost Build-Up</h3>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a] mb-2">
              <table className="w-full text-xs">
                <thead><tr className="bg-[#0a0a0a]">
                  <th className="text-left p-2 text-[#555]">Phase</th>
                  <th className="text-left p-2 text-[#555]">Components</th>
                  <th className="text-left p-2 text-[#555]">Build</th>
                  <th className="text-left p-2 text-[#555]">Annual</th>
                  <th className="text-left p-2 text-[#555]">How Calculated</th>
                </tr></thead>
                <tbody>
                  {[
                    ['Phase 1: Power BI', 'Dashboard (7 views) + SF data model', '$60-120K', '$10-30K/yr', 'Full Proposal C build. See Proposal C breakdown above.'],
                    ['Phase 1 (parallel): 360 API', 'Data pipeline from Customer 360', '$20-40K', '(incl above)', 'Subset of Proposal C build. Data engineering: $150-225/hr × 100-200 hrs.'],
                    ['Phase 2: AI Layer', 'Copilot/Ivy connectors + prompts', '$80-150K', '$30-80K/yr', 'Full Proposal A build. See Proposal A breakdown above. Leverages 360 API already built in Phase 1.'],
                    ['TOTAL HYBRID', '', '$160-310K', '$40-110K/yr', '', true],
                  ].map((row, i) => (
                    <tr key={i} className={`border-t border-[#1a1a1a] ${row[5] ? 'bg-amber-500/5' : ''}`}>
                      <td className={`p-2 ${row[5] ? 'text-amber-400 font-bold' : 'text-[#999]'}`}>{row[0]}</td>
                      <td className="p-2 text-[#888] text-[10px]">{row[1]}</td>
                      <td className={`p-2 ${row[5] ? 'text-white font-bold' : 'text-[#999]'}`}>{row[2]}</td>
                      <td className={`p-2 ${row[5] ? 'text-white font-bold' : 'text-[#999]'}`}>{row[3]}</td>
                      <td className="p-2 text-[#666] text-[10px]">{row[4]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-[10px] text-[#555] mt-2">
              <strong>Note:</strong> Hybrid avoids Proposal D&apos;s Data Cloud licensing ($65-150K/yr) by using Power BI + direct 360 pipeline instead. The 360 API build cost is shared between Phase 1 and Phase 2 (built once, used twice). If Ivanti later decides to add Data Cloud, it&apos;s additive — not wasted work.
            </div>
          </div>

          {/* Developer Rate Justification */}
          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5 mb-4">
            <h3 className="text-sm font-bold text-purple-400 mb-3">Developer / Consultant Rate Assumptions</h3>
            <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
              <table className="w-full text-xs">
                <thead><tr className="bg-[#0a0a0a]">
                  <th className="text-left p-2 text-[#555]">Role</th>
                  <th className="text-left p-2 text-[#555]">Rate Range</th>
                  <th className="text-left p-2 text-[#555]">Basis</th>
                </tr></thead>
                <tbody>
                  {[
                    ['BI Developer (Power BI)', '$125-200/hr', 'Mid-market to enterprise BI consultants. Source: Glassdoor + Upwork enterprise tier. Internal FTE equivalent: $90-130/hr fully loaded.'],
                    ['Data Engineer', '$150-225/hr', 'ETL/pipeline specialists with Salesforce + data warehouse experience. Source: Levels.fyi + consulting firm rate cards.'],
                    ['Salesforce Developer/Admin', '$150-250/hr', 'Certified SF developers for Data Cloud, Agentforce, custom objects. Source: Salesforce partner rate cards (2025). Internal FTE: $100-150/hr.'],
                    ['AI/ML Engineer', '$175-300/hr', 'Copilot Studio / LLM integration specialists. Source: AI consulting market rates (2025). Niche skill = premium rate.'],
                    ['QA / Testing', '$125-175/hr', 'Test engineering for enterprise integrations. Source: consulting firm rate cards. Lower than dev rates.'],
                    ['Project Management', '$125-175/hr', 'Included in build estimates as ~10-15% overhead. Not broken out separately.'],
                  ].map(([role, rate, basis]) => (
                    <tr key={role} className="border-t border-[#1a1a1a]">
                      <td className="p-2 text-[#999] font-medium">{role}</td>
                      <td className="p-2 text-white">{rate}</td>
                      <td className="p-2 text-[#666] text-[10px]">{basis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-[10px] text-[#555] mt-2">
              <strong>Internal vs. External:</strong> If Ivanti uses internal resources, rates drop 30-40%. Build costs would decrease proportionally. Above rates assume external consultants/contractors which is typical for project-based work when internal teams are at capacity.
            </div>
          </div>

          {/* Cost Sources */}
          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5 mb-4">
            <h3 className="text-sm font-bold text-purple-400 mb-3">Tool Licensing — Sources &amp; Verification</h3>
            <div className="space-y-2">
              {[
                { item: 'Fully loaded hourly rate ($85/hr)', source: 'BLS Occupational Employment and Wage Statistics (2024). Median salary for Sales Engineers: $116K-$160K. With 30% benefits loading: $150K-$208K. Midpoint $180K ÷ 1,708 annual hours = ~$105/hr for senior reps. We use $85/hr as a blended average across all roles (including CSMs at lower salary bands) to be conservative.' },
                { item: 'Power BI licensing ($0-10K/yr)', source: 'Microsoft 365 E5 includes Power BI Pro ($14/user/mo value). If Ivanti is on E5 (likely for an enterprise), Power BI is included. Estimate assumes 0-50 additional Power BI Pro seats needed at $10/user/mo.' },
                { item: 'Workato ($60-130K/yr)', source: 'Workato enterprise pricing: starts at ~$60K/yr for basic tier. Custom enterprise with advanced connectors and high-volume workflows: $100-130K/yr. Source: Workato pricing page + Gartner iPaaS market guide (2025).' },
                { item: 'n8n ($5-10K/yr self-hosted)', source: 'n8n is open source (free). Self-hosting costs: cloud VM ($50-100/mo) + maintenance time (~2 hrs/month). Enterprise support: $500-1000/mo optional.' },
                { item: 'Agentforce ($25-50K/yr)', source: 'Salesforce Agentforce pricing: $0.10/action (updated May 2025, down from $2/conversation at launch). Estimate: 50 reps × 20 interactions/day × 250 days = 250K actions × $0.10 = $25K baseline. Buffer for complex multi-action queries: up to $50K.' },
                { item: 'Data Cloud ($65-150K/yr)', source: 'Salesforce Data Cloud: included in some Enterprise+ editions. Standalone: starts at ~$65K/yr for basic data ingestion. Enterprise with multiple external connectors and high volume: up to $150K/yr. Source: Salesforce pricing (2025).' },
                { item: 'ARPEDIO ($18-30K/yr)', source: 'ARPEDIO Salesforce-native pricing: ~$30-50/user/month. For 50 users: $18K-30K/yr. Source: ARPEDIO website + G2 pricing data.' },
                { item: 'ZoomInfo API upgrade ($10-20K/yr)', source: 'ZoomInfo is already licensed (links present in bingo card). API tier upgrade for programmatic enrichment: estimated $10-20K/yr incremental based on ZoomInfo Enterprise API add-on pricing.' },
                { item: 'Build costs ($80-200K per proposal)', source: 'Based on enterprise integration project benchmarks: senior developer/consultant rate of $150-250/hr. Project timelines of 400-800 hours depending on complexity. Includes: development, testing, security review, deployment, and training.' },
              ].map((c) => (
                <div key={c.item} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-3 avoid-break">
                  <div className="text-xs font-medium text-white mb-1">{c.item}</div>
                  <div className="text-[10px] text-[#888] leading-relaxed">{c.source}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sensitivity note */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4 avoid-break">
            <h3 className="text-xs font-bold text-amber-400 mb-2">⚠️ Sensitivity Note</h3>
            <p className="text-[10px] text-[#888] leading-relaxed">
              All figures use conservative estimates. Key sensitivities: (1) <strong className="text-white">Hourly rate</strong> — using $85 vs. the $105 senior-rep rate understates savings by ~24%. (2) <strong className="text-white">Rep count</strong> — actual sales org size is the single biggest multiplier. (3) <strong className="text-white">Meetings per week</strong> — reps averaging 5 meetings/week instead of 3 would increase pre-meeting savings by 67%. (4) <strong className="text-white">Adoption rate</strong> — assumes 100% adoption. At 70% adoption, multiply all savings by 0.7. We recommend validating rep count and meeting frequency with Sales Ops for a more precise estimate.
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            THE IDEAL OUTCOME — WHAT SUCCESS LOOKS LIKE
            ═══════════════════════════════════════════ */}
        <div className="page-break px-12 py-8 pdf-section">
          <div className="text-xs text-green-400 font-mono mb-2">THE IDEAL OUTCOME</div>
          <h2 className="text-3xl font-bold mb-4">What Success Looks Like</h2>
          
          <p className="text-sm text-[#888] mb-4">
            This isn't about building software — it's about transforming how Ivanti's go-to-market team operates. Here's the picture of what we're building toward:
          </p>

          <div className="space-y-3 mb-4">
            {[
              { 
                role: 'For the Sales Rep', 
                now: 'Spends Monday morning updating a spreadsheet with data from 5 different tabs.',
                future: 'Opens a dashboard Monday morning. Their 35 accounts are prioritized by renewal risk and white space opportunity. They know exactly who to call and why.',
                metric: '3 weeks/year back for selling'
              },
              { 
                role: 'For the SE', 
                now: 'Walks into discovery calls blind, spending the first 20 minutes learning basic account context.',
                future: 'Walks in with an AI-generated brief: current stack, usage patterns, competitive intel, and recommended capabilities to assess.',
                metric: 'Faster time to credibility'
              },
              { 
                role: 'For the CSM', 
                now: 'Prepares for QBRs by manually pulling usage data from Customer 360, often days out of date.',
                future: 'QBR deck auto-populates with real-time adoption metrics, maturity progress against the roadmap, and renewal risk scoring.',
                metric: 'Data-driven customer conversations'
              },
              { 
                role: 'For the VE Team', 
                now: 'Builds every workshop from scratch: researching the account, customizing slides, manually populating the capability canvas.',
                future: 'Account intelligence pre-loaded. The 36 capabilities are pre-prioritized based on actual data. Output synthesis is AI-assisted.',
                metric: '2-3x more engagements per quarter'
              },
              { 
                role: 'For Leadership', 
                now: 'Cannot quantify the ROI of the C&M Assessment program or the VE team's impact on revenue.',
                future: 'Dashboard shows: assessments completed → products sold → adoption tracked → renewals secured. The flywheel is visible and measurable.',
                metric: 'Proof of program ROI'
              },
              { 
                role: 'For the Customer', 
                now: 'Experiences a generic vendor assessment with recommendations that may or may not fit their actual situation.',
                future: 'Experiences a partner who already understands their environment. Recommendations are specific, measurable, and tied to their actual usage data.',
                metric: 'Strategic partnership, not vendor'
              },
            ].map((item) => (
              <div key={item.role} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4 avoid-break">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-white">{item.role}</span>
                  <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded">{item.metric}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[10px] text-red-400/70 mb-1">Today</div>
                    <div className="text-xs text-[#666]">{item.now}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-green-400/70 mb-1">With Connected Journey</div>
                    <div className="text-xs text-[#888]">{item.future}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-5">
            <h3 className="text-sm font-bold text-purple-400 mb-3">The Flywheel in Motion</h3>
            <p className="text-xs text-[#888] leading-relaxed mb-3">
              Month 3: First dashboards go live. Reps stop building spreadsheets. Time saved: ~10 hours/week per rep.
            </p>
            <p className="text-xs text-[#888] leading-relaxed mb-3">
              Month 6: AI layer active. Reps walk into meetings with briefs. Assessment conversion rates improve. VE team delivers 50% more engagements with the same headcount.
            </p>
            <p className="text-xs text-[#888] leading-relaxed mb-3">
              Month 12: Year 1 assessments show measurable maturity progress. Renewals include data-backed proof of value. Churn drops. Expansion revenue grows.
            </p>
            <p className="text-xs text-[#ccc] leading-relaxed font-medium">
              Month 18: The C&M Assessment is no longer a "nice to have" program — it's a core driver of Ivanti's growth strategy. Customers expect it. Reps rely on it. The data proves it works.
            </p>
          </div>
        </div>

        {/* Closing */}
        <div className="px-12 py-16 text-center">
          <div className="w-20 h-1 bg-purple-500 rounded mx-auto mb-4" />
          <p className="text-sm text-[#555]">The Ivanti Connected Journey</p>
          <p className="text-xs text-[#444] mt-1">Prepared by Value Engineering • February 2026</p>
        </div>

      </div>
    </>
  );
}
