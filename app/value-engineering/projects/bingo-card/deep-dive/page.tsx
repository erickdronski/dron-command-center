'use client';

import { useState } from 'react';
import { Download, ChevronDown, ChevronUp, Bot, Shield, Globe, Users, Lightbulb, Target, CheckCircle, AlertTriangle, ExternalLink, ArrowRight, Sparkles, Building2, BarChart3 } from 'lucide-react';

/* ════════════════════════════════════════════════════════════
   SALESFORCE AGENTFORCE + DATA CLOUD
   ════════════════════════════════════════════════════════════ */

const agentforceCapabilities = [
  {
    name: 'Account Research Agent',
    desc: 'Automatically researches accounts using CRM data + external sources. Generates account briefs, competitive intel, and financial summaries on demand.',
    relevance: 'Replaces the "Area 51" manual Copilot research entirely. Rep asks "Brief me on Randstad" → gets a full account dossier.',
    available: true,
  },
  {
    name: 'Pipeline Management Agent',
    desc: 'Monitors pipeline health, follows up on stalled deals, updates opportunity stages, schedules meetings, drafts outreach emails.',
    relevance: 'Automates the "Pulse" and "Meeting Status" columns in the bingo card. Agent proactively alerts when deals go cold.',
    available: true,
  },
  {
    name: 'Data Cloud Integration',
    desc: 'Salesforce Data Cloud unifies data from ANY external system (ZoomInfo, Customer 360, usage telemetry) into a single customer profile without moving data.',
    relevance: 'THIS IS THE GAME CHANGER. Data Cloud can ingest Ivanti Customer 360 data, ZoomInfo data, and Salesforce data into one unified profile — the bingo card becomes a native Salesforce view.',
    available: true,
  },
  {
    name: 'Einstein AI Scoring',
    desc: 'Predictive lead/opportunity scoring, propensity-to-buy modeling, churn prediction based on all unified data.',
    relevance: 'Replaces the manual "Focus/Saturated/Declining" column with AI-driven health scores. Also predicts which accounts are ready for upsell.',
    available: true,
  },
  {
    name: 'White Space Agent (Custom)',
    desc: 'Custom Agentforce agent that compares account product ownership against full Ivanti portfolio and recommends cross-sell/upsell opportunities.',
    relevance: 'Automates the 25+ product columns + white space analysis. Agent says "Randstad has ITSM but no Patch Management — here\'s the talk track."',
    available: false,
    note: 'Would need to be custom-built using Agentforce Agent Builder',
  },
  {
    name: 'Competitor Intelligence Agent (Custom)',
    desc: 'Monitors ZoomInfo technographics + web signals to track competitor products at each account.',
    relevance: 'Auto-populates the "Competitors" column and alerts reps when a competitor is detected or displaced.',
    available: false,
    note: 'Requires ZoomInfo technographics API + custom agent logic',
  },
  {
    name: 'Renewal Risk Agent',
    desc: 'Proactively monitors renewal dates, usage trends, support ticket sentiment, and CSM health scores to flag at-risk accounts.',
    relevance: 'The bingo card renewal date column becomes a live risk dashboard. Agent alerts 90/60/30 days before renewal with recommended actions.',
    available: true,
  },
];

const agentforcePricing = {
  model: 'Consumption-based',
  original: '$2 per conversation (2024 launch)',
  current: '$0.10 per action (May 2025 update)',
  estimate: 'For 50 reps × ~20 agent interactions/day × 250 working days = ~250,000 actions/year',
  annualCost: '$25,000-50,000/year for agent actions',
  dataClouds: 'Data Cloud included in some Salesforce editions; may require upgrade ($65K-150K/yr)',
  buildCost: '$80K-200K for custom agents + Data Cloud configuration',
  total: '$105K-400K Year 1, $90K-200K/yr ongoing',
};

/* ════════════════════════════════════════════════════════════
   ALTERNATIVE PLATFORMS
   ════════════════════════════════════════════════════════════ */

const alternatives = [
  {
    name: 'Clari',
    category: 'Revenue Intelligence',
    what: 'AI-powered revenue platform that aggregates activity from CRM, email, calendar, and cross-functional systems. Automated pipeline inspection, deal risk scoring, and forecasting.',
    price: '~$100-125/user/month ($60K-75K/yr for 50 users)',
    solves: 'Pipeline management, forecasting accuracy, deal intelligence. Replaces manual pipeline tracking and the "Pulse" column.',
    doesnt: 'Doesn\'t do product ownership mapping, white space analysis, or Customer 360 usage data integration.',
    fit: 3,
    orgBenefits: [
      { role: 'Sales Leadership / CRO', benefit: 'AI-driven forecasting replaces gut-feel pipeline reviews. Executive dashboards show real-time revenue health across all territories.' },
      { role: 'CSMs', benefit: 'Renewal risk scoring from engagement signals. CSMs see which accounts are going dark before it becomes a fire drill.' },
      { role: 'RevOps', benefit: 'Automated pipeline hygiene — stale deals flagged, stages updated, forecast accuracy tracked over time. Eliminates hours of manual CRM cleanup.' },
      { role: 'Marketing', benefit: 'Deal velocity data shows which campaigns influence faster closes. Attribution modeling improves with activity-level engagement data.' },
      { role: 'Finance', benefit: 'More accurate revenue forecasting for quarterly planning. Reduces variance between forecast and actuals.' },
    ],
  },
  {
    name: 'People.ai',
    category: 'Revenue Intelligence',
    what: 'Captures all customer engagement signals (emails, meetings, calls) and maps them to accounts/opportunities automatically. AI-driven account planning and stakeholder mapping.',
    price: '~$50-75/user/month ($30K-45K/yr for 50 users)',
    solves: 'Contact mapping (CIO, CISO columns), relationship strength, engagement scoring. Auto-populates who\'s been contacted and how often.',
    doesnt: 'No product ownership tracking, no external data enrichment (ZoomInfo replacement), no usage telemetry.',
    fit: 3,
    orgBenefits: [
      { role: 'SEs / Pre-Sales', benefit: 'See which stakeholders have been engaged and by whom — avoid duplicating outreach. Know who the technical champion is before the call.' },
      { role: 'CSMs', benefit: 'Relationship maps show if key contacts are being nurtured post-sale. Gaps in engagement = churn risk signal.' },
      { role: 'Sales Leadership', benefit: 'Rep activity analytics: who\'s doing the outreach work vs. who\'s coasting. Data-driven coaching instead of anecdotal reviews.' },
      { role: 'Marketing', benefit: 'See which personas and titles are most engaged in active deals. Informs ABM targeting and content strategy.' },
      { role: 'VE Team', benefit: 'Know exactly which stakeholders participated in prior engagements. Prep for capability workshops with full relationship context.' },
    ],
  },
  {
    name: 'Demandbase',
    category: 'Account-Based Intelligence',
    what: 'B2B account intelligence platform with intent data, technographics, company data enrichment, and account-based advertising.',
    price: 'Custom — typically $75K-150K/yr enterprise',
    solves: 'Company intelligence (revenue, employees, industry), technographics (competitor detection), intent signals. Could replace ZoomInfo for some use cases.',
    doesnt: 'No Salesforce-native integration depth. No product ownership mapping. No usage telemetry from Customer 360.',
    fit: 2,
    orgBenefits: [
      { role: 'Marketing', benefit: 'BIGGEST winner. Intent data shows which accounts are actively researching solutions. ABM campaigns target accounts showing buying signals. Ad spend goes to accounts that are actually in-market.' },
      { role: 'SDR/BDR Team', benefit: 'Intent-based prioritization: call the accounts that are researching "endpoint management" or "ITSM" right now, not random cold outreach.' },
      { role: 'Sales Reps', benefit: 'Technographic data reveals competitor products installed at accounts. Walk into meetings knowing their current stack.' },
      { role: 'Product Marketing', benefit: 'Competitive intelligence at scale — see which competitors are gaining or losing share across your install base.' },
      { role: 'Channel / Partners', benefit: 'Identify partner-sourced accounts showing intent. Route warm leads to the right partner faster.' },
    ],
  },
  {
    name: 'ARPEDIO (Salesforce Native)',
    category: 'Account Planning + White Space',
    what: 'Salesforce-native account planning app with built-in white space analysis, relationship mapping, SWOT, and account scoring.',
    price: '~$30-50/user/month ($18K-30K/yr for 50 users)',
    solves: 'White space analysis (product gaps), account planning structure, competitive mapping — all INSIDE Salesforce. This is literally built for the bingo card use case.',
    doesnt: 'No external data enrichment (still need ZoomInfo). No usage telemetry. No AI brief generation.',
    fit: 5,
    orgBenefits: [
      { role: 'Sales Reps', benefit: 'Visual white space maps replace 25+ manual product columns. See instantly which products are owned, which aren\'t, and where the revenue opportunity is.' },
      { role: 'CSMs', benefit: 'Account plans with SWOT analysis give CSMs a strategic framework for QBRs. Adoption gaps visible at a glance.' },
      { role: 'VE Team', benefit: 'Pre-built account plans feed directly into capability assessment prep. White space data identifies which capabilities to focus workshops on.' },
      { role: 'Sales Leadership', benefit: 'Standardized account planning across all reps. Roll-up views show white space opportunity by territory, segment, product line.' },
      { role: 'Product Management', benefit: 'Aggregate white space data reveals which products have the largest addressable opportunity across the install base. Informs roadmap priorities.' },
      { role: 'Marketing', benefit: 'White space data by segment/vertical drives targeted campaign strategy. Know which products to promote to which audience.' },
    ],
  },
  {
    name: 'DemandFarm',
    category: 'Key Account Management',
    what: 'Salesforce-native key account management with visual org charts, white space mapping, and relationship health scoring.',
    price: '~$35-60/user/month ($21K-36K/yr for 50 users)',
    solves: 'Visual org charts (contacts/CIO/CISO), white space heat maps, account health scoring. Similar to ARPEDIO but with stronger visualization.',
    doesnt: 'Same gaps as ARPEDIO — no external enrichment, no usage data, no AI.',
    fit: 4,
    orgBenefits: [
      { role: 'Sales Reps', benefit: 'Visual org charts show the power map: who\'s the economic buyer, who\'s the champion, who\'s the blocker. Navigate complex orgs visually.' },
      { role: 'SEs / Pre-Sales', benefit: 'See the technical evaluation team mapped out before a demo. Tailor presentations to the specific stakeholders in the room.' },
      { role: 'CSMs', benefit: 'Relationship health scores by contact. If the champion leaves, get alerted immediately. Track multi-threaded relationships.' },
      { role: 'Sales Leadership', benefit: 'Account health dashboards across the entire book. Identify single-threaded accounts (risk) vs. well-penetrated accounts (safe).' },
      { role: 'Executive Sponsors', benefit: 'Visual account maps for exec-to-exec alignment. Know who to call at which level for strategic accounts.' },
    ],
  },
  {
    name: 'ZoomInfo + Salesforce Native Enrichment',
    category: 'Data Enrichment',
    what: 'ZoomInfo already integrates with Salesforce. Enable auto-enrichment of account fields (revenue, employees, contacts, technographics) directly in CRM.',
    price: 'Already licensed — may need API tier upgrade ($10K-20K/yr)',
    solves: 'Company intelligence auto-populated, contact discovery (CIO, CISO), competitor detection via technographics, website and LinkedIn auto-linked.',
    doesnt: 'No product ownership tracking, no usage telemetry, no white space analysis, no account planning structure.',
    fit: 4,
    orgBenefits: [
      { role: 'Sales Reps', benefit: 'Account fields auto-populated: revenue, employee count, industry, HQ, website, key contacts. Eliminates 30-45 min of manual research per account.' },
      { role: 'SDR/BDR Team', benefit: 'Contact discovery at scale — find the CIO, CISO, IT Director at any account instantly. Direct dials and verified emails.' },
      { role: 'Marketing', benefit: 'Firmographic enrichment improves segmentation. Technographic data reveals competitor install base for displacement campaigns.' },
      { role: 'CSMs', benefit: 'Auto-detect when key contacts change roles or leave the company (ZoomInfo alerts). Protect relationships proactively.' },
      { role: 'RevOps / Data Team', benefit: 'CRM data quality dramatically improves. Less manual cleanup, fewer duplicates, standardized industry/revenue fields across all accounts.' },
      { role: 'Channel / Partners', benefit: 'Enrich partner-sourced leads with firmographic data for better qualification and routing.' },
    ],
  },
];

/* ════════════════════════════════════════════════════════════
   SUCCESS STORIES
   ════════════════════════════════════════════════════════════ */

const successStories = [
  {
    company: 'Wiley (Publishing & Research)',
    problem: 'Service call spikes at peak times, manual research for every customer interaction.',
    solution: 'Salesforce Agentforce — AI agents that help customers self-serve and auto-generate contextual briefs for service reps.',
    result: '213% ROI, 40%+ increase in self-service resolution, significant reduction in rep prep time.',
    lesson: 'AI agents that pre-brief reps before every interaction eliminate the "manual research" bottleneck that Ivanti reps face with bingo cards.',
  },
  {
    company: 'Adecco Group (Global Staffing)',
    problem: 'Recruiters drowning in admin tasks — resume screening, candidate follow-ups, scheduling.',
    solution: 'Agentforce agents that auto-screen resumes, manage shortlists, notify candidates, and suggest alternatives.',
    result: 'Recruiters gained back hours/week. Exploring expanding to cross-system workflow automation.',
    lesson: 'Identical pattern to Ivanti: knowledge workers spending time on data assembly instead of high-value work. Automation freed them to focus on relationships.',
  },
  {
    company: 'Iron Mountain (Information Management)',
    problem: 'Sales reps navigating disparate systems to understand account health. Manual note-taking after every case.',
    solution: 'Salesforce Einstein AI — auto-generates case summaries, provides unified account health views.',
    result: 'Reps spend dramatically less time on manual documentation. Account health visible at a glance.',
    lesson: 'Direct parallel to the bingo card problem. Iron Mountain\'s reps were doing the same manual data assembly from multiple systems.',
  },
  {
    company: 'OpenTable (Restaurant Tech)',
    problem: 'High volume of customer support conversations requiring human intervention.',
    solution: 'Agentforce AI agent handling tens of thousands of conversations autonomously.',
    result: 'Thousands of conversations resolved without human intervention in first weeks.',
    lesson: 'Scale matters. Once you build the agent, it handles volume that humans can\'t. 50-100 reps × 35 accounts each = the same scale problem.',
  },
  {
    company: 'Accenture (Consulting)',
    problem: 'Cross-team collaboration bottlenecks in large enterprise with complex account relationships.',
    solution: 'Agentforce for internal collaboration — agents that surface relevant account context across teams.',
    result: 'Faster cross-functional alignment on key accounts.',
    lesson: 'At Ivanti, SEs, CSMs, and VEs all need the same account context but get it from different systems. A unified agent solves this for all roles.',
  },
];

/* ════════════════════════════════════════════════════════════
   POWER SALES REP FRAMEWORK
   ════════════════════════════════════════════════════════════ */

const powerRepFramework = {
  pillars: [
    {
      name: 'Account Intelligence (Know)',
      icon: '🧠',
      need: 'Who is this customer? What do they do? What are they facing?',
      dataPoints: ['Company overview, revenue, employees, industry', 'Key contacts (CIO, CISO, IT Director)', 'Recent news, M&A, leadership changes', 'Regulatory pressures, industry trends', 'Competitive landscape and installed tech stack'],
      currentState: 'Manually pulled from ZoomInfo, LinkedIn, Google. Takes 30-45 min per account.',
      futureState: 'Auto-enriched in CRM from ZoomInfo + AI-generated brief on demand.',
    },
    {
      name: 'Relationship Health (Feel)',
      icon: '💓',
      need: 'How healthy is this account? Are they happy? At risk?',
      dataPoints: ['CSM health score', 'Support ticket volume and sentiment', 'ITSM usage and adoption metrics', 'Renewal date and ARR trajectory', 'Engagement frequency (meetings, emails, calls)'],
      currentState: 'Scattered across Customer 360, Salesforce, CSM notes. Reps rarely check all of these.',
      futureState: 'Unified health score with AI-driven risk alerts. Proactive agent flags accounts drifting.',
    },
    {
      name: 'Product Landscape (See)',
      icon: '👁️',
      need: 'What do they own? What are they using? What\'s the white space?',
      dataPoints: ['Licensed products and seat counts', 'Actual usage vs. entitlement (adoption %)', 'Product gaps relative to full portfolio', 'Cross-sell/upsell opportunity scoring', 'Competitor products in environment'],
      currentState: '25+ manual columns in bingo card. No connection to actual usage data from Customer 360.',
      futureState: 'Product heat map with usage overlay. White space auto-calculated. Competitor detection via technographics.',
    },
    {
      name: 'Action Readiness (Act)',
      icon: '⚡',
      need: 'What should I do right now? Which account needs attention? What\'s the pitch?',
      dataPoints: ['Prioritized action list (renewal prep, upsell, at-risk)', 'Talk tracks per opportunity', 'Executive readout content ready to present', 'Meeting prep briefs', 'ROI / value hypothesis per solution'],
      currentState: 'Reps decide based on gut feel and whatever they last heard. No systematic prioritization.',
      futureState: 'AI-prioritized daily action list. Pre-built talk tracks. One-click meeting prep.',
    },
  ],
};

/* ════════════════════════════════════════════════════════════
   THE SALESFORCE-NATIVE SOLUTION (PROPOSAL D)
   ════════════════════════════════════════════════════════════ */

const proposalD = {
  title: 'Proposal D: Salesforce-Native (Agentforce + Data Cloud + ARPEDIO)',
  subtitle: 'The bingo card lives IN Salesforce — where reps already work',
  overview: 'Instead of building external dashboards or chat integrations, make Salesforce itself the bingo card. Use Data Cloud to unify all external data INTO Salesforce, ARPEDIO for white space analysis, ZoomInfo enrichment for company/contact data, and Agentforce agents for AI-powered account research and proactive alerts.',
  components: [
    { tool: 'Salesforce Data Cloud', role: 'Unify Customer 360 ITSM usage data + ZoomInfo data into Salesforce customer profiles', cost: '$65K-150K/yr (if not already included)' },
    { tool: 'Agentforce', role: 'AI agents for account research, renewal alerts, pipeline management, meeting prep', cost: '$25K-50K/yr (consumption-based)' },
    { tool: 'ARPEDIO or DemandFarm', role: 'Salesforce-native white space analysis, account planning, relationship mapping', cost: '$18K-36K/yr' },
    { tool: 'ZoomInfo Salesforce Integration', role: 'Auto-enrich company data, contacts, technographics directly in CRM', cost: '$10K-20K/yr (API tier upgrade)' },
    { tool: 'Salesforce Reports & Dashboards', role: 'Bingo card views, renewal timelines, product heat maps — all native', cost: '$0 (included)' },
  ],
  totalCost: {
    build: '$80K-200K (Data Cloud config, Agentforce agents, ARPEDIO setup, data mapping)',
    annual: '$118K-256K/yr',
    savings: '$535K-$1.07M/yr',
    roi: '109-806%',
    payback: '3-6 months',
  },
  whyThisWins: [
    'Zero new tools for reps — everything lives in Salesforce where they already work',
    'Data Cloud solves the REAL problem: disconnected systems. It unifies without moving data.',
    'Agentforce agents are proactive, not reactive — they come to the rep, not the other way around',
    'ARPEDIO gives you white space visualization that\'s literally designed for this exact use case',
    'ZoomInfo enrichment is already partially in place — just needs activation',
    'Scalable to every rep, every role (SE, CSM, VE, management) from day one',
    'Aligns with Salesforce\'s roadmap — this is where the industry is going',
  ],
};

/* ════════════════════════════════════════════════════════════
   DOWNLOAD
   ════════════════════════════════════════════════════════════ */

function downloadDeepDive() {
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>Sales Intelligence Deep Dive — Extended Analysis</title>
<style>
body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.5; margin: 1in; }
h1 { font-size: 22pt; color: #1a1a2e; border-bottom: 3px solid #7c3aed; padding-bottom: 8px; }
h2 { font-size: 16pt; color: #1a1a2e; margin-top: 24px; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
h3 { font-size: 13pt; color: #7c3aed; }
.highlight { background-color: #f3f0ff; padding: 12px 16px; border-left: 4px solid #7c3aed; margin: 12px 0; }
.success { background-color: #f0fdf4; padding: 12px 16px; border-left: 4px solid #16a34a; margin: 12px 0; }
table { border-collapse: collapse; width: 100%; margin: 12px 0; }
th { background-color: #1a1a2e; color: white; padding: 8px 12px; text-align: left; }
td { padding: 8px 12px; border: 1px solid #ddd; }
tr:nth-child(even) { background-color: #f9f9f9; }
.pro { color: #16a34a; }
.con { color: #d97706; }
</style></head><body>
<h1>Sales Intelligence Automation — Extended Analysis</h1>
<p><strong>Addendum: Salesforce Agentforce, Alternative Platforms, Success Stories & The Power Sales Rep Framework</strong></p>
<p><em>Prepared by Ivanti Value Engineering Team</em></p>

<h2>Proposal D: Salesforce-Native Solution</h2>
<p><em>${proposalD.subtitle}</em></p>
<p>${proposalD.overview}</p>

<h3>Components</h3>
<table>
<tr><th>Tool</th><th>Role</th><th>Cost</th></tr>
${proposalD.components.map(c => `<tr><td><strong>${c.tool}</strong></td><td>${c.role}</td><td>${c.cost}</td></tr>`).join('')}
</table>

<div class="highlight">
<p><strong>Total Build Cost:</strong> ${proposalD.totalCost.build}</p>
<p><strong>Annual Cost:</strong> ${proposalD.totalCost.annual}</p>
<p><strong>Annual Savings:</strong> ${proposalD.totalCost.savings}</p>
<p><strong>ROI:</strong> ${proposalD.totalCost.roi} | <strong>Payback:</strong> ${proposalD.totalCost.payback}</p>
</div>

<h3>Why This Wins</h3>
<ul>${proposalD.whyThisWins.map(w => `<li class="pro">${w}</li>`).join('')}</ul>

<h2>Salesforce Agentforce Capabilities</h2>
<table>
<tr><th>Agent</th><th>What It Does</th><th>Relevance to Bingo Card</th><th>Available?</th></tr>
${agentforceCapabilities.map(a => `<tr><td><strong>${a.name}</strong></td><td>${a.desc}</td><td>${a.relevance}</td><td>${a.available ? '✅ Yes' : '🔧 Custom Build'}</td></tr>`).join('')}
</table>

<h3>Agentforce Pricing</h3>
<table>
<tr><td><strong>Pricing Model</strong></td><td>${agentforcePricing.current}</td></tr>
<tr><td><strong>Estimated Volume</strong></td><td>${agentforcePricing.estimate}</td></tr>
<tr><td><strong>Agent Actions Cost</strong></td><td>${agentforcePricing.annualCost}</td></tr>
<tr><td><strong>Data Cloud</strong></td><td>${agentforcePricing.dataClouds}</td></tr>
<tr><td><strong>Custom Build</strong></td><td>${agentforcePricing.buildCost}</td></tr>
<tr><td><strong>Total Year 1</strong></td><td>${agentforcePricing.total}</td></tr>
</table>

<h2>Alternative Platform Comparison</h2>
<table>
<tr><th>Platform</th><th>Category</th><th>What It Solves</th><th>What It Doesn't</th><th>Price</th><th>Fit (1-5)</th></tr>
${alternatives.map(a => `<tr><td><strong>${a.name}</strong></td><td>${a.category}</td><td>${a.solves}</td><td>${a.doesnt}</td><td>${a.price}</td><td>${'★'.repeat(a.fit)}${'☆'.repeat(5-a.fit)}</td></tr>`).join('')}
</table>

${alternatives.map(a => `
<h3>${a.name} — Organization-Wide Benefits</h3>
<table>
<tr><th>Role / Team</th><th>Benefit</th></tr>
${a.orgBenefits ? a.orgBenefits.map((b: {role: string; benefit: string}) => `<tr><td><strong>${b.role}</strong></td><td>${b.benefit}</td></tr>`).join('') : ''}
</table>
`).join('')}

<h2>The Power Sales Rep Framework</h2>
<p><em>What data does an enterprise rep ACTUALLY need, and in what form?</em></p>
<table>
<tr><th>Pillar</th><th>What Reps Need</th><th>Current State at Ivanti</th><th>Future State</th></tr>
${powerRepFramework.pillars.map(p => `<tr><td><strong>${p.icon} ${p.name}</strong><br/><em>${p.need}</em></td><td><ul>${p.dataPoints.map(d => `<li>${d}</li>`).join('')}</ul></td><td>${p.currentState}</td><td class="pro">${p.futureState}</td></tr>`).join('')}
</table>

<h2>Enterprise Success Stories</h2>
${successStories.map(s => `
<div class="success">
<h3>${s.company}</h3>
<p><strong>Problem:</strong> ${s.problem}</p>
<p><strong>Solution:</strong> ${s.solution}</p>
<p><strong>Result:</strong> ${s.result}</p>
<p><strong>Lesson for Ivanti:</strong> <em>${s.lesson}</em></p>
</div>
`).join('')}

<h2>Updated Recommendation</h2>
<div class="highlight">
<p><strong>If Ivanti is committed to Salesforce:</strong> Go with Proposal D (Agentforce + Data Cloud + ARPEDIO). It puts the bingo card where reps already live, uses AI agents that are proactive, and unifies all data without building custom pipelines.</p>
<p><strong>If budget is constrained:</strong> Start with Proposal C (Power BI) + ARPEDIO ($78K-150K total) for immediate visual impact, then evaluate Agentforce + Data Cloud in 6 months.</p>
<p><strong>If speed is paramount:</strong> Enable ZoomInfo auto-enrichment in Salesforce NOW ($0-20K), add ARPEDIO for white space ($18-36K/yr), and build from there. This alone eliminates 40-50% of manual bingo card work within 2 weeks.</p>
</div>

</body></html>`;
  
  const blob = new Blob([html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Sales-Intelligence-Deep-Dive-Agentforce-Alternatives.doc';
  a.click();
  URL.revokeObjectURL(url);
}

/* ════════════════════════════════════════════════════════════
   COMPONENTS
   ════════════════════════════════════════════════════════════ */

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

/* ════════════════════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════════════════════ */

export default function DeepDivePage() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#555] mb-1">
            <a href="/value-engineering/projects/bingo-card" className="hover:text-[#888]">← Back to Proposals A/B/C</a>
          </div>
          <h2 className="text-lg font-bold text-white">Extended Analysis — Agentforce, Alternatives & Success Stories</h2>
          <p className="text-sm text-[#555] mt-0.5">Proposal D + platform comparison + what makes a power sales rep</p>
        </div>
        <button onClick={downloadDeepDive}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-lg transition-colors">
          <Download size={16} /> Download .doc
        </button>
      </div>

      {/* ═══ PROPOSAL D ═══ */}
      <div className="bg-gradient-to-r from-purple-500/5 to-blue-500/5 border border-purple-500/30 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-1">
          <Bot size={20} className="text-purple-400" />
          <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded font-medium">NEW — Proposal D</span>
        </div>
        <h2 className="text-lg font-bold text-white mb-1">{proposalD.title}</h2>
        <p className="text-sm text-[#888] mb-4">{proposalD.overview}</p>

        {/* Components */}
        <div className="space-y-2 mb-4">
          {proposalD.components.map((c) => (
            <div key={c.tool} className="flex items-center justify-between bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-3">
              <div>
                <div className="text-xs font-bold text-white">{c.tool}</div>
                <div className="text-[10px] text-[#666] mt-0.5">{c.role}</div>
              </div>
              <span className="text-xs text-[#888] bg-white/5 px-2 py-0.5 rounded">{c.cost}</span>
            </div>
          ))}
        </div>

        {/* Costs */}
        <div className="grid grid-cols-4 gap-3 bg-[#0a0a0a] border border-purple-500/10 rounded-lg p-4 mb-4">
          <div><div className="text-[10px] text-[#555]">Build</div><div className="text-sm font-bold text-white">{proposalD.totalCost.build}</div></div>
          <div><div className="text-[10px] text-[#555]">Annual</div><div className="text-sm font-bold text-white">{proposalD.totalCost.annual}</div></div>
          <div><div className="text-[10px] text-[#555]">ROI</div><div className="text-sm font-bold text-purple-400">{proposalD.totalCost.roi}</div></div>
          <div><div className="text-[10px] text-[#555]">Payback</div><div className="text-sm font-bold text-green-400">{proposalD.totalCost.payback}</div></div>
        </div>

        {/* Why It Wins */}
        <div className="space-y-1">
          {proposalD.whyThisWins.map((w, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-[#999]">
              <CheckCircle size={12} className="text-green-400 mt-0.5 flex-shrink-0" /> {w}
            </div>
          ))}
        </div>
      </div>

      {/* ═══ AGENTFORCE CAPABILITIES ═══ */}
      <Section title="Salesforce Agentforce — Capability Breakdown">
        <p className="text-xs text-[#888] mb-4">
          Agentforce is Salesforce&apos;s agentic AI platform — autonomous agents that act within and across Salesforce. Pricing moved from $2/conversation to <span className="text-white">$0.10/action</span> in May 2025. 8,000+ businesses are already using it.
        </p>
        <div className="space-y-2">
          {agentforceCapabilities.map((a) => (
            <div key={a.name} className={`bg-[#0a0a0a] border rounded-lg p-4 ${a.available ? 'border-green-500/10' : 'border-amber-500/10'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-bold text-white">{a.name}</div>
                <span className={`text-[10px] px-2 py-0.5 rounded ${a.available ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>
                  {a.available ? '✅ Available' : '🔧 Custom Build'}
                </span>
              </div>
              <p className="text-xs text-[#888] mb-1">{a.desc}</p>
              <p className="text-xs text-cyan-400/70"><strong>Bingo Card Impact:</strong> {a.relevance}</p>
              {a.note && <p className="text-[10px] text-[#555] mt-1 italic">{a.note}</p>}
            </div>
          ))}
        </div>
      </Section>

      {/* ═══ POWER SALES REP FRAMEWORK ═══ */}
      <Section title="The Power Sales Rep — What Data Do You Actually Need?">
        <p className="text-xs text-[#888] mb-4">
          Thinking like an enterprise sales rep: what makes you powerful? It comes down to 4 pillars. Every tool and proposal should be evaluated against whether it delivers these.
        </p>
        <div className="grid grid-cols-2 gap-4">
          {powerRepFramework.pillars.map((p) => (
            <div key={p.name} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4">
              <div className="text-lg mb-1">{p.icon}</div>
              <div className="text-sm font-bold text-white mb-1">{p.name}</div>
              <div className="text-xs text-[#666] italic mb-3">{p.need}</div>
              <div className="space-y-1 mb-3">
                {p.dataPoints.map((d, i) => (
                  <div key={i} className="text-[10px] text-[#888] flex items-start gap-1.5">
                    <span className="text-purple-400/50 mt-0.5">•</span> {d}
                  </div>
                ))}
              </div>
              <div className="text-[10px] text-red-400/60 mb-1"><strong>Today:</strong> {p.currentState}</div>
              <div className="text-[10px] text-green-400/60"><strong>Future:</strong> {p.futureState}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══ ALTERNATIVE PLATFORMS ═══ */}
      <Section title="Alternative Platforms Comparison">
        <p className="text-xs text-[#888] mb-4">
          Beyond building custom solutions, these platforms solve specific pieces of the bingo card problem. Some could complement Proposals A-D.
        </p>
        <div className="space-y-3">
          {alternatives.map((a) => (
            <div key={a.name} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm font-bold text-white">{a.name}</div>
                  <div className="text-[10px] text-purple-400">{a.category}</div>
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
              <p className="text-xs text-[#888] mb-2">{a.what}</p>
              <div className="text-xs text-green-400/70 mb-1">✅ Solves: {a.solves}</div>
              <div className="text-xs text-amber-400/70 mb-3">⚠️ Doesn&apos;t solve: {a.doesnt}</div>
              {a.orgBenefits && (
                <div className="border-t border-[#1a1a1a] pt-3">
                  <div className="text-[10px] font-semibold text-[#555] uppercase mb-2">Organization-Wide Impact</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {a.orgBenefits.map((b: {role: string; benefit: string}) => (
                      <div key={b.role} className="bg-[#111] border border-[#1a1a1a] rounded p-2">
                        <div className="text-[10px] font-bold text-purple-400">{b.role}</div>
                        <div className="text-[10px] text-[#888] mt-0.5 leading-relaxed">{b.benefit}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* ═══ SUCCESS STORIES ═══ */}
      <Section title="Enterprise Success Stories — How Others Solved This">
        <div className="space-y-3">
          {successStories.map((s) => (
            <div key={s.company} className="bg-[#0a0a0a] border border-green-500/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Building2 size={14} className="text-green-400" />
                <div className="text-sm font-bold text-white">{s.company}</div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs mb-2">
                <div><span className="text-[#555] font-medium">Problem:</span> <span className="text-[#888]">{s.problem}</span></div>
                <div><span className="text-[#555] font-medium">Solution:</span> <span className="text-[#888]">{s.solution}</span></div>
              </div>
              <div className="text-xs text-green-400/70 mb-1">📊 Result: {s.result}</div>
              <div className="text-xs text-cyan-400/70 bg-cyan-500/5 rounded p-2 mt-2">💡 Lesson for Ivanti: {s.lesson}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══ UPDATED RECOMMENDATION ═══ */}
      <div className="bg-purple-500/5 border border-purple-500/30 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={18} className="text-purple-400" />
          <h2 className="text-lg font-bold text-white">Updated Recommendation — Three Paths</h2>
        </div>
        <div className="space-y-3">
          <div className="bg-[#0a0a0a] border border-purple-500/20 rounded-lg p-4">
            <div className="text-sm font-bold text-purple-400 mb-1">If Ivanti is committed to Salesforce: Proposal D</div>
            <p className="text-xs text-[#888]">Agentforce + Data Cloud + ARPEDIO. The bingo card lives IN Salesforce. AI agents are proactive. Data Cloud unifies everything. ARPEDIO visualizes white space. $118-256K/yr but highest impact and zero new tools for reps.</p>
          </div>
          <div className="bg-[#0a0a0a] border border-blue-500/20 rounded-lg p-4">
            <div className="text-sm font-bold text-blue-400 mb-1">If budget is constrained: Proposal C + ARPEDIO</div>
            <p className="text-xs text-[#888]">Power BI dashboard for visual impact + ARPEDIO for white space = $78-150K total. Immediate value, familiar tools, evaluate Agentforce later.</p>
          </div>
          <div className="bg-[#0a0a0a] border border-green-500/20 rounded-lg p-4">
            <div className="text-sm font-bold text-green-400 mb-1">If speed is paramount: Quick Wins NOW</div>
            <p className="text-xs text-[#888]">Enable ZoomInfo auto-enrichment in Salesforce ($0-20K) + add ARPEDIO ($18-36K/yr). Eliminates 40-50% of manual work within 2 weeks. Build from there.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
