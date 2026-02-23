'use client';

import { useState } from 'react';
import { Download, ChevronDown, ChevronUp, Clock, DollarSign, Zap, AlertTriangle, CheckCircle, ArrowRight, BarChart3, MessageSquare, Database, LayoutDashboard, Layers, Star, ExternalLink } from 'lucide-react';

/* ════════════════════════════════════════════════════════════
   DATA
   ════════════════════════════════════════════════════════════ */

const proposals = [
  {
    id: 'A',
    title: 'AI-First: Ivy / Copilot Integration',
    subtitle: 'Single prompt → blended output from all systems',
    icon: MessageSquare,
    color: 'purple',
    borderColor: 'border-purple-500/30',
    badgeColor: 'bg-purple-500/20 text-purple-400',
    tagline: 'Conversational intelligence — ask and receive',
    timeToValue: '3-6 months',
    annualCost: '$40K-80K',
    buildCost: '$80K-150K',
    complexityScore: 4,
    impactScore: 5,
    feasibilityScore: 3,
    overview: 'Extend Ivy (or Microsoft Copilot) with enterprise connectors so a sales rep can type one prompt — "Give me the bingo card for Randstad" — and get a complete, blended account portfolio pulled live from Salesforce, ZoomInfo, Customer 360, and enriched with AI-generated insights.',
    howItWorks: [
      'Build custom Copilot plugins / Ivy connectors for Salesforce REST API, ZoomInfo API, and Customer 360 data warehouse',
      'Rep types natural language query → AI orchestrates API calls across all systems simultaneously',
      'AI blends data into structured output: account snapshot, product ownership matrix, white space analysis, renewal timeline, competitive intel',
      'Output delivered as formatted response, downloadable Excel, or auto-populated PowerPoint',
      'AI generates "Area 51" style financial/industry briefs on the fly using web search + ZoomInfo technographics',
      'Prompt library (from our existing toolkit) embedded as quick-start templates',
    ],
    techStack: [
      { name: 'Microsoft Copilot Studio', role: 'AI orchestration & plugin framework', status: 'likely-have' },
      { name: 'Ivy (Ivanti AI)', role: 'Alternative AI interface if Copilot not available', status: 'have' },
      { name: 'Salesforce REST API', role: 'Account, opportunity, asset, contact data', status: 'have' },
      { name: 'ZoomInfo API', role: 'Company intel, contacts, technographics', status: 'need-upgrade' },
      { name: 'Customer 360 API / Data Export', role: 'Tenant data, ITSM usage, adoption metrics', status: 'need-build' },
      { name: 'Azure OpenAI / LLM', role: 'AI synthesis, brief generation', status: 'likely-have' },
    ],
    pros: [
      'Lowest friction for reps — just ask a question',
      'No new UI to learn — lives in Teams/Copilot/Ivy where reps already work',
      'Flexible output formats (chat, Excel, PPT)',
      'AI can reason across data (e.g., "which accounts are renewing in Q3 with low ITSM adoption?")',
      'Naturally extends to the prompt toolkit we already built',
    ],
    cons: [
      'Requires enterprise Copilot Studio or Ivy API development — not trivial',
      'API connectors need building and maintaining',
      'Customer 360 API is the biggest gap — may need data engineering investment',
      'LLM hallucination risk on financial data — needs guardrails',
      'Dependent on Copilot/Ivy platform roadmap',
    ],
    timeline: [
      { phase: 'Phase 1: Salesforce connector', weeks: '4-6', desc: 'Pull account, opportunity, ARR, renewal, product data via prompt' },
      { phase: 'Phase 2: ZoomInfo connector', weeks: '3-4', desc: 'Company intel, employee count, revenue, contacts, technographics' },
      { phase: 'Phase 3: Customer 360 connector', weeks: '6-8', desc: 'ITSM usage data, tenant metrics, adoption scores' },
      { phase: 'Phase 4: AI synthesis layer', weeks: '4-6', desc: 'Blended output, brief generation, white space analysis, prompt templates' },
    ],
    costs: {
      build: [
        { item: 'Copilot Studio plugin development (3 connectors)', cost: '$40K-60K' },
        { item: 'Customer 360 API development', cost: '$20K-40K' },
        { item: 'AI prompt engineering & guardrails', cost: '$10K-20K' },
        { item: 'Testing, security review, deployment', cost: '$10K-30K' },
      ],
      ongoing: [
        { item: 'Copilot Studio licensing (if not in E5)', cost: '$0-30K/yr' },
        { item: 'ZoomInfo API tier upgrade', cost: '$10K-20K/yr' },
        { item: 'Azure OpenAI API usage', cost: '$5K-15K/yr' },
        { item: 'Maintenance & connector updates', cost: '$15K-25K/yr' },
      ],
    },
  },
  {
    id: 'B',
    title: 'Integration Platform (iPaaS)',
    subtitle: 'Enterprise middleware connecting all systems',
    icon: Database,
    color: 'blue',
    borderColor: 'border-blue-500/30',
    badgeColor: 'bg-blue-500/20 text-blue-400',
    tagline: 'Connect everything once, automate forever',
    timeToValue: '4-8 months',
    annualCost: '$60K-180K',
    buildCost: '$100K-200K',
    complexityScore: 3,
    impactScore: 5,
    feasibilityScore: 4,
    overview: 'Deploy an enterprise integration platform (Power Automate, Workato, MuleSoft, or n8n) that connects Salesforce, ZoomInfo, Customer 360, and other systems into a unified data pipeline. Automated workflows pull, blend, and deliver data on schedule or on-demand — outputting to Excel, dashboards, Slack/Teams notifications, or AI models.',
    howItWorks: [
      'Central integration hub connects to all source systems via pre-built or custom connectors',
      'Scheduled workflows (nightly/weekly) sync account data across all sources',
      'Event-driven triggers: renewal approaching, ARR change, product adoption shift → auto-alert reps',
      'Unified data model normalizes account data from disparate systems into one schema',
      'Output to multiple channels: auto-populated Excel bingo cards, Teams alerts, CRM enrichment, dashboard feeds',
      'AI enrichment layer can be added for brief generation and white space scoring',
    ],
    techStack: [
      { name: 'Power Automate (Microsoft)', role: 'Workflow automation — already in M365 stack', status: 'have', note: 'Free with E3/E5. Premium connectors ~$15/user/mo' },
      { name: 'Workato', role: 'Enterprise iPaaS — best for complex multi-system orchestration', status: 'evaluate', note: '$60K-130K/yr enterprise' },
      { name: 'MuleSoft (Salesforce)', role: 'Enterprise API management & integration', status: 'evaluate', note: '$80K-200K+/yr. Best if deep Salesforce commitment' },
      { name: 'n8n (Self-Hosted)', role: 'Open-source automation — lowest cost, most flexible', status: 'evaluate', note: 'Free self-hosted, $50/mo cloud, enterprise custom' },
      { name: 'Salesforce Flow + Reports', role: 'Native Salesforce automation', status: 'have', note: 'Free. Limited to SF data only.' },
    ],
    subOptions: [
      {
        name: 'Option B1: Power Automate (In-Stack)',
        cost: '$15K-40K build + $5K-15K/yr',
        timeframe: '4-8 weeks',
        pros: 'Already licensed, no procurement, IT-approved',
        cons: 'Limited complex orchestration, premium connectors cost extra, less flexible than dedicated iPaaS',
        best: 'If Ivanti is all-in on Microsoft stack and needs fast time-to-value',
      },
      {
        name: 'Option B2: Workato (Enterprise iPaaS)',
        cost: '$100K-150K build + $60K-130K/yr license',
        timeframe: '8-16 weeks',
        pros: 'Purpose-built for enterprise integration, 1000+ pre-built connectors, handles complex logic, scales org-wide',
        cons: 'New vendor procurement, significant annual cost, requires iPaaS expertise',
        best: 'If Ivanti wants a scalable platform for ALL sales/rev ops automation, not just bingo cards',
      },
      {
        name: 'Option B3: n8n (Self-Hosted / Lean)',
        cost: '$20K-40K build + $5K-10K/yr hosting',
        timeframe: '6-10 weeks',
        pros: 'Open source, extremely flexible, AI-native, lowest ongoing cost, full control',
        cons: 'Requires technical team to maintain, less enterprise support, self-hosted = own infrastructure',
        best: 'If Ivanti has a technical RevOps team willing to own it, and wants maximum flexibility at minimal cost',
      },
    ],
    pros: [
      'Solves the root problem — disconnected systems become connected permanently',
      'Benefits extend far beyond bingo cards (onboarding, forecasting, customer success)',
      'Event-driven alerts surface insights reps would otherwise miss',
      'Scales to entire org without per-rep manual effort',
      'Data flows both directions — enrich Salesforce FROM other systems, not just pull from it',
    ],
    cons: [
      'Higher upfront investment (especially Workato/MuleSoft)',
      'Requires IT/RevOps to build and maintain integrations',
      'Procurement process for new vendor can take months',
      'Customer 360 API still the biggest gap regardless of platform',
      'Complexity increases with number of connected systems',
    ],
    timeline: [
      { phase: 'Phase 1: Platform selection & setup', weeks: '2-4', desc: 'Evaluate, procure, configure base platform' },
      { phase: 'Phase 2: Salesforce connector + data model', weeks: '3-4', desc: 'Account, opportunity, asset, contact, partner data flows' },
      { phase: 'Phase 3: ZoomInfo + Customer 360 connectors', weeks: '4-6', desc: 'Company intel enrichment + ITSM usage/adoption data' },
      { phase: 'Phase 4: Output automation', weeks: '3-4', desc: 'Auto-generate bingo cards, alerts, dashboard feeds' },
      { phase: 'Phase 5: AI enrichment (optional)', weeks: '4-6', desc: 'AI briefs, white space scoring, competitive intel' },
    ],
    costs: {
      build: [
        { item: 'Platform setup & connector development', cost: '$40K-80K' },
        { item: 'Customer 360 API/export development', cost: '$20K-40K' },
        { item: 'Data model design & normalization', cost: '$15K-25K' },
        { item: 'Output templates & automation flows', cost: '$10K-20K' },
        { item: 'Testing, security, deployment', cost: '$15K-35K' },
      ],
      ongoing: [
        { item: 'Platform licensing (varies by option)', cost: '$5K-130K/yr' },
        { item: 'ZoomInfo API tier', cost: '$10K-20K/yr' },
        { item: 'Maintenance & monitoring', cost: '$15K-30K/yr' },
        { item: 'AI API costs (if enrichment added)', cost: '$5K-15K/yr' },
      ],
    },
  },
  {
    id: 'C',
    title: 'Power BI Live Dashboard',
    subtitle: 'Unified visual portfolio for every rep',
    icon: LayoutDashboard,
    color: 'green',
    borderColor: 'border-green-500/30',
    badgeColor: 'bg-green-500/20 text-green-400',
    tagline: 'See everything, act on anything — one screen',
    timeToValue: '2-4 months',
    annualCost: '$10K-30K',
    buildCost: '$60K-120K',
    complexityScore: 2,
    impactScore: 4,
    feasibilityScore: 5,
    overview: 'Build a comprehensive Power BI dashboard that replaces the static Excel bingo card with a live, interactive portfolio view. Reps see their entire book of business with product heat maps, renewal timelines, ITSM usage data from Customer 360, white space analysis, and account health — all auto-refreshing and filterable.',
    howItWorks: [
      'Salesforce data flows via native Power BI Salesforce connector (direct query or scheduled refresh)',
      'Customer 360 data piped via data warehouse or scheduled CSV/API export into Power BI dataset',
      'ZoomInfo data enriches Salesforce records (via existing ZoomInfo-SFDC integration) — flows through automatically',
      'Interactive dashboards: filter by rep, region, industry, renewal quarter, product gaps',
      'ITSM Usage View: tenant health, ticket volume, feature adoption %, module usage — surfaced for reps to see customer engagement',
      'White Space Calculator: automatically highlights product gaps per account based on owned vs. available portfolio',
      'Copilot in Power BI: natural language queries ("show me accounts renewing in Q3 with ITSM but no patch management")',
      'Mobile-friendly: reps access on phone/tablet before meetings',
    ],
    dashboardViews: [
      { name: 'Portfolio Overview', desc: 'All accounts with ARR, renewal date, health status, product count — sortable, filterable' },
      { name: 'Product Heat Map', desc: 'Matrix view: accounts (rows) × Ivanti products (columns) with color-coded ownership' },
      { name: 'Renewal Timeline', desc: 'Visual calendar of upcoming renewals with ARR sizing and risk indicators' },
      { name: 'White Space Analysis', desc: 'Product gaps per account ranked by revenue potential and customer readiness' },
      { name: 'ITSM Usage & Adoption', desc: 'Customer 360 data: ticket volume trends, module usage, feature adoption rates, health scores' },
      { name: 'Account Deep Dive', desc: 'Drill into single account: full history, contacts, product details, competitive landscape, notes' },
      { name: 'Executive Roll-Up', desc: 'Management view: team ARR, pipeline, renewal risk, white space by territory' },
    ],
    techStack: [
      { name: 'Power BI Pro', role: 'Dashboard creation & sharing', status: 'have', note: 'Included in M365 E5 or $10/user/mo' },
      { name: 'Power BI Premium (optional)', role: 'Large datasets, paginated reports, AI features', status: 'evaluate', note: '$14/user/mo add-on or capacity-based' },
      { name: 'Salesforce Connector', role: 'Native Power BI connector', status: 'have', note: 'Free, standard connector' },
      { name: 'Customer 360 Data Pipeline', role: 'Scheduled export → Power BI dataset', status: 'need-build', note: 'Data warehouse query or API export' },
      { name: 'Copilot for Power BI', role: 'Natural language queries', status: 'likely-have', note: 'Included in some M365 plans' },
    ],
    pros: [
      'Highest feasibility — Power BI is almost certainly already licensed',
      'Fastest time to value — first dashboards in 4-6 weeks',
      'Visually powerful — product heat maps and renewal timelines that Excel can\'t match',
      'ITSM usage data finally visible to sales (biggest unlock for Customer 360 value)',
      'Self-service: reps explore data themselves instead of waiting for someone to build them a spreadsheet',
      'Copilot integration enables AI queries without building custom connectors',
      'Executive-ready roll-up views for management visibility',
    ],
    cons: [
      'Read-only — reps can view but not add notes/judgment fields (those stay in Salesforce)',
      'Doesn\'t solve the data connection problem — still needs source systems to be connected upstream',
      'Customer 360 data pipeline needs to be built regardless',
      'Power BI refresh is scheduled (15 min-daily) not true real-time',
      'Training needed — some reps may resist new tool if not mandatory',
    ],
    timeline: [
      { phase: 'Phase 1: Salesforce dataset + Portfolio Overview', weeks: '3-4', desc: 'Core account data flowing, first dashboard live' },
      { phase: 'Phase 2: Product Heat Map + White Space', weeks: '3-4', desc: 'Asset/entitlement data mapped, gap analysis built' },
      { phase: 'Phase 3: Customer 360 / ITSM Usage', weeks: '4-6', desc: 'Data pipeline built, usage dashboards live' },
      { phase: 'Phase 4: Renewal Timeline + Alerts', weeks: '2-3', desc: 'Visual renewal calendar, Power Automate alert integration' },
      { phase: 'Phase 5: Executive Roll-Up + Copilot', weeks: '2-3', desc: 'Management views, natural language query enabled' },
    ],
    costs: {
      build: [
        { item: 'Power BI dashboard development (7 views)', cost: '$30K-50K' },
        { item: 'Customer 360 data pipeline', cost: '$15K-30K' },
        { item: 'Data model design & Salesforce mapping', cost: '$10K-20K' },
        { item: 'Training & adoption program', cost: '$5K-10K' },
        { item: 'Testing & deployment', cost: '$5K-10K' },
      ],
      ongoing: [
        { item: 'Power BI licensing (likely already covered by M365 E5)', cost: '$0-10K/yr' },
        { item: 'Data pipeline maintenance', cost: '$5K-10K/yr' },
        { item: 'Dashboard iteration & new views', cost: '$5K-10K/yr' },
      ],
    },
  },
];

const recommendedHybrid = {
  title: 'Recommended: Hybrid Approach (C → A, with B as foundation)',
  description: 'Start with what\'s fastest and most impactful, then layer on intelligence.',
  phases: [
    {
      name: 'NOW: Power BI Dashboard (Proposal C)',
      timeline: 'Months 1-3',
      cost: '$60-120K build',
      why: 'Immediate visual impact. Reps see their portfolio in a way Excel never could. ITSM usage data visible for the first time. White space analysis automated. Executive roll-ups for management. Highest ROI per dollar spent.',
    },
    {
      name: 'NEXT: Customer 360 API + Data Pipeline',
      timeline: 'Months 2-4 (parallel)',
      cost: '$20-40K build',
      why: 'This is the critical dependency for ALL proposals. Build it once, use it everywhere. Without this, every other solution is incomplete. Fund this as shared infrastructure.',
    },
    {
      name: 'THEN: AI Integration (Proposal A)',
      timeline: 'Months 4-8',
      cost: '$80-150K build',
      why: 'Once data flows are established, add the AI layer. Reps can ask Copilot/Ivy for account briefs, and it pulls from already-connected systems. The "Area 51" concept at scale. Prompt library extends naturally.',
    },
    {
      name: 'SCALE: iPaaS if Needed (Proposal B)',
      timeline: 'Months 8-12 (evaluate)',
      cost: '$60-180K/yr',
      why: 'Only pursue if Power Automate hits its limits and you need enterprise-grade orchestration across 10+ systems. Evaluate after Phase 1-3 deliver results.',
    },
  ],
  totalInvestment: {
    year1: '$160K-310K',
    ongoing: '$30K-80K/yr',
    savings: '$535K-$1.07M/yr',
    roi: '170-670%',
    payback: '3-6 months',
  },
};

const roiComparison = [
  { metric: 'Hours Saved / Rep / Year', value: '126 hours' },
  { metric: 'FTE Equivalent (50 reps)', value: '3.7 FTEs' },
  { metric: 'Cost Savings (50 reps @ $85/hr)', value: '$535,500/yr' },
  { metric: 'Cost Savings (100 reps)', value: '$1,071,000/yr' },
  { metric: 'Faster Deal Cycles (est.)', value: '5-10% improvement' },
  { metric: 'Reduced Churn (missed renewal prevention)', value: '1-3% ARR retention uplift' },
  { metric: 'White Space Revenue (new opportunities surfaced)', value: 'Est. $500K-2M incremental pipeline' },
];

const itsm360Value = [
  { metric: 'Ticket Volume Trends', benefit: 'Reps see if a customer is submitting more tickets (scaling usage = upsell signal) or fewer (disengagement = churn risk)' },
  { metric: 'Module/Feature Adoption %', benefit: 'Surface which ITSM modules are used vs. licensed but dormant → drives adoption conversations and prevents shelfware objections at renewal' },
  { metric: 'User Activity & Logins', benefit: 'Low login rates = low adoption = renewal risk. High activity = happy customer = expansion ready' },
  { metric: 'Self-Service Usage', benefit: 'If self-service is high, customer is getting value. If low, opportunity to enable portal/catalog → drives services or training revenue' },
  { metric: 'Automation & Bot Usage', benefit: 'Customers using automation are sticky. Those not using it are candidates for AITSM/Healing upsell' },
  { metric: 'CMDB/Discovery Utilization', benefit: 'If CMDB is empty but ITSM is active → Discovery/ITAM cross-sell. If full → service mapping upsell' },
];

/* ════════════════════════════════════════════════════════════
   DOWNLOAD FUNCTIONS
   ════════════════════════════════════════════════════════════ */

function generateProposalText() {
  let t = '';
  t += '═'.repeat(70) + '\n';
  t += 'SALES INTELLIGENCE AUTOMATION — ENTERPRISE PROPOSAL\n';
  t += 'Prepared by: Ivanti Value Engineering Team\n';
  t += '═'.repeat(70) + '\n\n';

  t += 'EXECUTIVE SUMMARY\n';
  t += '─'.repeat(40) + '\n';
  t += 'Sales reps manually build portfolio spreadsheets ("Bingo Cards") with 70+\n';
  t += 'columns from 5+ disconnected systems. This takes 4-8 hours per rep to build\n';
  t += 'and 25+ hours/year to maintain. Data goes stale within days.\n\n';
  t += 'We propose three enterprise solutions to automate this entirely, saving\n';
  t += '126 hours/rep/year ($535K-$1.07M org-wide) with ROI of 170-670%.\n\n';

  proposals.forEach((p) => {
    t += '\n' + '═'.repeat(70) + '\n';
    t += `PROPOSAL ${p.id}: ${p.title.toUpperCase()}\n`;
    t += `${p.subtitle}\n`;
    t += '═'.repeat(70) + '\n\n';
    t += `Overview: ${p.overview}\n\n`;
    t += `Time to Value: ${p.timeToValue}\n`;
    t += `Build Cost: ${p.buildCost}\n`;
    t += `Annual Cost: ${p.annualCost}\n\n`;
    t += 'How It Works:\n';
    p.howItWorks.forEach((h) => t += `  • ${h}\n`);
    t += '\nPros:\n';
    p.pros.forEach((pr) => t += `  ✅ ${pr}\n`);
    t += '\nCons:\n';
    p.cons.forEach((c) => t += `  ⚠️ ${c}\n`);
    t += '\nTimeline:\n';
    p.timeline.forEach((tl) => t += `  ${tl.phase} (${tl.weeks} weeks): ${tl.desc}\n`);
    t += '\nBuild Costs:\n';
    p.costs.build.forEach((c) => t += `  ${c.item}: ${c.cost}\n`);
    t += '\nOngoing Costs:\n';
    p.costs.ongoing.forEach((c) => t += `  ${c.item}: ${c.cost}\n`);
    if (p.subOptions) {
      t += '\nSub-Options:\n';
      p.subOptions.forEach((s) => {
        t += `\n  ${s.name}\n`;
        t += `  Cost: ${s.cost} | Timeline: ${s.timeframe}\n`;
        t += `  Pros: ${s.pros}\n`;
        t += `  Cons: ${s.cons}\n`;
        t += `  Best for: ${s.best}\n`;
      });
    }
    if (p.dashboardViews) {
      t += '\nDashboard Views:\n';
      p.dashboardViews.forEach((d) => t += `  • ${d.name}: ${d.desc}\n`);
    }
  });

  t += '\n\n' + '═'.repeat(70) + '\n';
  t += 'RECOMMENDED: HYBRID APPROACH\n';
  t += '═'.repeat(70) + '\n\n';
  recommendedHybrid.phases.forEach((ph) => {
    t += `${ph.name}\n`;
    t += `  Timeline: ${ph.timeline} | Cost: ${ph.cost}\n`;
    t += `  Why: ${ph.why}\n\n`;
  });
  t += `Total Year 1 Investment: ${recommendedHybrid.totalInvestment.year1}\n`;
  t += `Ongoing Annual Cost: ${recommendedHybrid.totalInvestment.ongoing}\n`;
  t += `Annual Savings: ${recommendedHybrid.totalInvestment.savings}\n`;
  t += `ROI: ${recommendedHybrid.totalInvestment.roi}\n`;
  t += `Payback Period: ${recommendedHybrid.totalInvestment.payback}\n`;

  t += '\n\n' + '═'.repeat(70) + '\n';
  t += 'ROI SUMMARY\n';
  t += '═'.repeat(70) + '\n\n';
  roiComparison.forEach((r) => t += `${r.metric}: ${r.value}\n`);

  t += '\n\n' + '═'.repeat(70) + '\n';
  t += 'CUSTOMER 360 ITSM USAGE — UNLOCKED VALUE FOR SALES\n';
  t += '═'.repeat(70) + '\n\n';
  itsm360Value.forEach((i) => t += `${i.metric}\n  → ${i.benefit}\n\n`);

  return t;
}

function downloadTxt() {
  const blob = new Blob([generateProposalText()], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Sales-Intelligence-Automation-Proposal.txt';
  a.click();
  URL.revokeObjectURL(url);
}

function downloadDocx() {
  // Generate HTML that Word can open natively
  const text = generateProposalText();
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>Sales Intelligence Automation Proposal</title>
<style>
body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.5; margin: 1in; }
h1 { font-size: 20pt; color: #1a1a2e; border-bottom: 2px solid #7c3aed; padding-bottom: 8px; }
h2 { font-size: 16pt; color: #1a1a2e; margin-top: 24px; }
h3 { font-size: 13pt; color: #7c3aed; }
.metric { font-weight: bold; }
.highlight { background-color: #f3f0ff; padding: 8px 12px; border-left: 4px solid #7c3aed; margin: 8px 0; }
table { border-collapse: collapse; width: 100%; margin: 12px 0; }
th { background-color: #1a1a2e; color: white; padding: 8px 12px; text-align: left; }
td { padding: 8px 12px; border: 1px solid #ddd; }
tr:nth-child(even) { background-color: #f9f9f9; }
.pro { color: #16a34a; }
.con { color: #d97706; }
</style></head><body>
<h1>Sales Intelligence Automation</h1>
<p><strong>Enterprise Proposal — Ivanti Value Engineering</strong></p>
<div class="highlight">
<p><strong>The Problem:</strong> Sales reps manually build portfolio spreadsheets with 70+ columns from 5+ disconnected systems — spending 126+ hours/year per rep on data assembly instead of selling.</p>
<p><strong>The Opportunity:</strong> $535K-$1.07M/year in recovered selling time. 170-670% ROI. Payback in 3-6 months.</p>
</div>

${proposals.map(p => `
<h2>Proposal ${p.id}: ${p.title}</h2>
<p><em>${p.subtitle}</em></p>
<p>${p.overview}</p>
<table><tr><th>Time to Value</th><th>Build Cost</th><th>Annual Cost</th></tr>
<tr><td>${p.timeToValue}</td><td>${p.buildCost}</td><td>${p.annualCost}</td></tr></table>

<h3>How It Works</h3>
<ul>${p.howItWorks.map(h => `<li>${h}</li>`).join('')}</ul>

<h3>Pros</h3>
<ul>${p.pros.map(pr => `<li class="pro">✅ ${pr}</li>`).join('')}</ul>

<h3>Cons</h3>
<ul>${p.cons.map(c => `<li class="con">⚠️ ${c}</li>`).join('')}</ul>

<h3>Implementation Timeline</h3>
<table><tr><th>Phase</th><th>Duration</th><th>Description</th></tr>
${p.timeline.map(t => `<tr><td>${t.phase}</td><td>${t.weeks} weeks</td><td>${t.desc}</td></tr>`).join('')}</table>

<h3>Costs</h3>
<table><tr><th>Build Item</th><th>Cost</th></tr>
${p.costs.build.map(c => `<tr><td>${c.item}</td><td>${c.cost}</td></tr>`).join('')}</table>
<table><tr><th>Ongoing Item</th><th>Annual Cost</th></tr>
${p.costs.ongoing.map(c => `<tr><td>${c.item}</td><td>${c.cost}</td></tr>`).join('')}</table>

${p.subOptions ? `<h3>Sub-Options</h3>
<table><tr><th>Option</th><th>Cost</th><th>Timeline</th><th>Best For</th></tr>
${p.subOptions.map(s => `<tr><td><strong>${s.name}</strong><br/><span class="pro">+ ${s.pros}</span><br/><span class="con">- ${s.cons}</span></td><td>${s.cost}</td><td>${s.timeframe}</td><td>${s.best}</td></tr>`).join('')}</table>` : ''}

${p.dashboardViews ? `<h3>Dashboard Views</h3>
<table><tr><th>View</th><th>Description</th></tr>
${p.dashboardViews.map(d => `<tr><td><strong>${d.name}</strong></td><td>${d.desc}</td></tr>`).join('')}</table>` : ''}
`).join('')}

<h2>Recommended: Hybrid Approach</h2>
<p><em>${recommendedHybrid.description}</em></p>
<table><tr><th>Phase</th><th>Timeline</th><th>Cost</th><th>Why</th></tr>
${recommendedHybrid.phases.map(p => `<tr><td><strong>${p.name}</strong></td><td>${p.timeline}</td><td>${p.cost}</td><td>${p.why}</td></tr>`).join('')}</table>

<div class="highlight">
<p><strong>Total Year 1 Investment:</strong> ${recommendedHybrid.totalInvestment.year1}</p>
<p><strong>Ongoing Annual Cost:</strong> ${recommendedHybrid.totalInvestment.ongoing}</p>
<p><strong>Annual Savings:</strong> ${recommendedHybrid.totalInvestment.savings}</p>
<p><strong>ROI:</strong> ${recommendedHybrid.totalInvestment.roi}</p>
<p><strong>Payback Period:</strong> ${recommendedHybrid.totalInvestment.payback}</p>
</div>

<h2>ROI Summary</h2>
<table><tr><th>Metric</th><th>Value</th></tr>
${roiComparison.map(r => `<tr><td>${r.metric}</td><td><strong>${r.value}</strong></td></tr>`).join('')}</table>

<h2>Customer 360 ITSM Usage — Unlocked Value for Sales</h2>
<p>ITSM usage data from Customer 360 is currently underutilized by sales. Here's how surfacing it drives revenue:</p>
<table><tr><th>Data Point</th><th>Sales Benefit</th></tr>
${itsm360Value.map(i => `<tr><td><strong>${i.metric}</strong></td><td>${i.benefit}</td></tr>`).join('')}</table>

</body></html>`;
  
  const blob = new Blob([html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Sales-Intelligence-Automation-Proposal.doc';
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

function ScoreBar({ label, score, max = 5, color }: { label: string; score: number; max?: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-[#666] w-20">{label}</span>
      <div className="flex gap-0.5">
        {Array.from({ length: max }).map((_, i) => (
          <div key={i} className={`w-4 h-2 rounded-sm ${i < score ? color : 'bg-[#222]'}`} />
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════════════════════ */

export default function BingoCardPage() {
  const [activeProposal, setActiveProposal] = useState<string | null>(null);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Sales Intelligence Automation</h2>
          <p className="text-sm text-[#555] mt-0.5">Enterprise proposals to eliminate manual portfolio assembly</p>
        </div>
        <div className="flex gap-2">
          <button onClick={downloadDocx}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-lg transition-colors">
            <Download size={16} /> Download .doc
          </button>
          <button onClick={downloadTxt}
            className="flex items-center gap-2 px-3 py-2 bg-[#222] hover:bg-[#333] text-[#999] text-sm rounded-lg transition-colors">
            <Download size={14} /> .txt
          </button>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'Hours Saved / Rep', value: '126/yr', icon: Clock, color: 'text-blue-400' },
          { label: 'Org Savings', value: '$535K-1M', icon: DollarSign, color: 'text-green-400' },
          { label: 'ROI Range', value: '170-670%', icon: BarChart3, color: 'text-purple-400' },
          { label: 'Payback', value: '3-6 mo', icon: Zap, color: 'text-amber-400' },
          { label: 'Data Points Automated', value: '245K+', icon: Database, color: 'text-cyan-400' },
        ].map((s) => (
          <div key={s.label} className="bg-[#111] border border-[#222] rounded-xl p-3 text-center">
            <s.icon size={16} className={`${s.color} mx-auto`} />
            <div className={`text-lg font-bold ${s.color} mt-1`}>{s.value}</div>
            <div className="text-[10px] text-[#555] mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Problem Summary */}
      <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5">
        <h3 className="text-sm font-bold text-red-400 mb-2">The Problem</h3>
        <p className="text-sm text-[#888]">
          Every sales rep manually builds a <span className="text-white font-medium">70+ column spreadsheet</span> from <span className="text-white font-medium">5+ disconnected systems</span> (Salesforce, ZoomInfo, Customer 360, LinkedIn, tribal knowledge).
          35 accounts × 70 fields = <span className="text-white font-medium">2,450+ data points per rep</span>, all manually curated.
          Data goes stale within days. Every tool lives in a different tab. ITSM usage data from Customer 360 is barely touched by sales.
          Across 50-100 reps: <span className="text-white font-medium">120K-245K data points maintained by hand instead of selling.</span>
        </p>
      </div>

      {/* Three Proposals */}
      <div>
        <h2 className="text-sm font-semibold text-[#555] uppercase tracking-wider mb-3">Three Enterprise Proposals</h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {proposals.map((p) => {
            const isActive = activeProposal === p.id;
            const colors: Record<string, string> = {
              purple: 'border-purple-500/50 bg-purple-500/5',
              blue: 'border-blue-500/50 bg-blue-500/5',
              green: 'border-green-500/50 bg-green-500/5',
            };
            const textColors: Record<string, string> = { purple: 'text-purple-400', blue: 'text-blue-400', green: 'text-green-400' };
            const barColors: Record<string, string> = { purple: 'bg-purple-500', blue: 'bg-blue-500', green: 'bg-green-500' };
            return (
              <button key={p.id} onClick={() => setActiveProposal(isActive ? null : p.id)}
                className={`text-left rounded-xl p-4 border transition-all ${isActive ? colors[p.color] : 'border-[#222] bg-[#111] hover:border-[#333]'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <p.icon size={18} className={textColors[p.color]} />
                  <span className={`text-xs px-2 py-0.5 rounded ${p.badgeColor}`}>Proposal {p.id}</span>
                </div>
                <div className="text-sm font-bold text-white mb-1">{p.title}</div>
                <div className="text-xs text-[#666] mb-3">{p.tagline}</div>
                <div className="space-y-1.5">
                  <ScoreBar label="Impact" score={p.impactScore} color={barColors[p.color]} />
                  <ScoreBar label="Feasibility" score={p.feasibilityScore} color={barColors[p.color]} />
                  <ScoreBar label="Complexity" score={p.complexityScore} color={barColors[p.color]} />
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#222]">
                  <div><div className="text-[10px] text-[#555]">Build</div><div className="text-xs text-white font-medium">{p.buildCost}</div></div>
                  <div><div className="text-[10px] text-[#555]">Annual</div><div className="text-xs text-white font-medium">{p.annualCost}</div></div>
                  <div><div className="text-[10px] text-[#555]">Time</div><div className="text-xs text-white font-medium">{p.timeToValue}</div></div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Expanded Proposal Detail */}
        {activeProposal && (() => {
          const p = proposals.find(pr => pr.id === activeProposal)!;
          const textColor: Record<string, string> = { purple: 'text-purple-400', blue: 'text-blue-400', green: 'text-green-400' };
          return (
            <div className={`bg-[#111] border ${p.borderColor} rounded-xl p-6 space-y-5`}>
              <div>
                <h3 className={`text-lg font-bold ${textColor[p.color]}`}>Proposal {p.id}: {p.title}</h3>
                <p className="text-sm text-[#888] mt-2">{p.overview}</p>
              </div>

              {/* How It Works */}
              <div>
                <h4 className="text-xs font-semibold text-[#555] uppercase mb-2">How It Works</h4>
                <div className="space-y-1.5">
                  {p.howItWorks.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[#999]">
                      <span className={`mt-0.5 font-bold ${textColor[p.color]}`}>{i + 1}.</span> {h}
                    </div>
                  ))}
                </div>
              </div>

              {/* Dashboard Views (Proposal C) */}
              {p.dashboardViews && (
                <div>
                  <h4 className="text-xs font-semibold text-[#555] uppercase mb-2">Dashboard Views (7 Views)</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {p.dashboardViews.map((d) => (
                      <div key={d.name} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-3">
                        <div className="text-xs font-medium text-white">{d.name}</div>
                        <div className="text-[10px] text-[#666] mt-0.5">{d.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-Options (Proposal B) */}
              {p.subOptions && (
                <div>
                  <h4 className="text-xs font-semibold text-[#555] uppercase mb-2">Platform Options</h4>
                  <div className="space-y-2">
                    {p.subOptions.map((s) => (
                      <div key={s.name} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xs font-bold text-white">{s.name}</div>
                          <div className="flex gap-2">
                            <span className="text-[10px] bg-white/5 text-[#888] px-2 py-0.5 rounded">{s.cost}</span>
                            <span className="text-[10px] bg-white/5 text-[#888] px-2 py-0.5 rounded">{s.timeframe}</span>
                          </div>
                        </div>
                        <div className="text-xs text-green-400/70 mb-1">+ {s.pros}</div>
                        <div className="text-xs text-amber-400/70 mb-1">- {s.cons}</div>
                        <div className="text-xs text-[#555]">Best for: {s.best}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tech Stack */}
              <div>
                <h4 className="text-xs font-semibold text-[#555] uppercase mb-2">Technology Stack</h4>
                <div className="space-y-1.5">
                  {p.techStack.map((t) => (
                    <div key={t.name} className="flex items-center justify-between bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-2.5">
                      <div>
                        <span className="text-xs font-medium text-white">{t.name}</span>
                        <span className="text-xs text-[#555] ml-2">{t.role}</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded ${
                        t.status === 'have' ? 'bg-green-500/10 text-green-400' :
                        t.status === 'likely-have' ? 'bg-blue-500/10 text-blue-400' :
                        t.status === 'evaluate' ? 'bg-cyan-500/10 text-cyan-400' :
                        'bg-amber-500/10 text-amber-400'
                      }`}>
                        {t.status === 'have' ? '✅ Have' : t.status === 'likely-have' ? '🔵 Likely Have' : t.status === 'evaluate' ? '🔍 Evaluate' : '⚠️ Need'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pros & Cons */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-semibold text-green-400/70 uppercase mb-2">Pros</h4>
                  <div className="space-y-1">
                    {p.pros.map((pr, i) => (
                      <div key={i} className="text-xs text-[#999] flex items-start gap-1.5">
                        <CheckCircle size={12} className="text-green-400/50 mt-0.5 flex-shrink-0" /> {pr}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-amber-400/70 uppercase mb-2">Cons</h4>
                  <div className="space-y-1">
                    {p.cons.map((c, i) => (
                      <div key={i} className="text-xs text-[#999] flex items-start gap-1.5">
                        <AlertTriangle size={12} className="text-amber-400/50 mt-0.5 flex-shrink-0" /> {c}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="text-xs font-semibold text-[#555] uppercase mb-2">Implementation Timeline</h4>
                <div className="space-y-1.5">
                  {p.timeline.map((tl, i) => (
                    <div key={i} className="flex items-center gap-3 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-3">
                      <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${p.badgeColor}`}>{i + 1}</div>
                      <div className="flex-1">
                        <div className="text-xs font-medium text-white">{tl.phase}</div>
                        <div className="text-[10px] text-[#666]">{tl.desc}</div>
                      </div>
                      <span className="text-[10px] text-[#555]">{tl.weeks} wks</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Costs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-semibold text-[#555] uppercase mb-2">Build Costs</h4>
                  {p.costs.build.map((c) => (
                    <div key={c.item} className="flex justify-between text-xs py-1.5 border-b border-[#1a1a1a]">
                      <span className="text-[#888]">{c.item}</span>
                      <span className="text-white font-medium">{c.cost}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#555] uppercase mb-2">Ongoing Annual Costs</h4>
                  {p.costs.ongoing.map((c) => (
                    <div key={c.item} className="flex justify-between text-xs py-1.5 border-b border-[#1a1a1a]">
                      <span className="text-[#888]">{c.item}</span>
                      <span className="text-white font-medium">{c.cost}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* ITSM Usage Value */}
      <Section title="Customer 360 ITSM Usage — Unlocked Value for Sales">
        <p className="text-xs text-[#888] mb-4">
          ITSM usage data from Customer 360 is the most underutilized sales asset at Ivanti. Here&apos;s how surfacing it in any of the three proposals drives revenue:
        </p>
        <div className="space-y-2">
          {itsm360Value.map((i) => (
            <div key={i.metric} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-3">
              <div className="text-xs font-semibold text-cyan-400">{i.metric}</div>
              <div className="text-xs text-[#888] mt-1">{i.benefit}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Recommended Hybrid */}
      <div className="bg-purple-500/5 border border-purple-500/30 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Star size={18} className="text-purple-400" />
          <h2 className="text-lg font-bold text-white">{recommendedHybrid.title}</h2>
        </div>
        <p className="text-sm text-[#888] mb-5">{recommendedHybrid.description}</p>
        <div className="space-y-3 mb-5">
          {recommendedHybrid.phases.map((ph, i) => (
            <div key={i} className="bg-[#0a0a0a] border border-purple-500/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-bold text-white">{ph.name}</div>
                <div className="flex gap-2">
                  <span className="text-xs bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded">{ph.timeline}</span>
                  <span className="text-xs bg-white/5 text-[#888] px-2 py-0.5 rounded">{ph.cost}</span>
                </div>
              </div>
              <p className="text-xs text-[#888]">{ph.why}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-3 bg-[#0a0a0a] border border-purple-500/10 rounded-lg p-4">
          {Object.entries(recommendedHybrid.totalInvestment).map(([k, v]) => (
            <div key={k} className="text-center">
              <div className="text-xs text-[#555] capitalize">{k.replace(/([A-Z])/g, ' $1')}</div>
              <div className="text-sm font-bold text-purple-400 mt-0.5">{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      <Section title="Side-by-Side Comparison" defaultOpen={false}>
        <div className="overflow-hidden rounded-lg border border-[#1a1a1a]">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#0a0a0a]">
                <th className="text-left p-3 text-[#555]">Criteria</th>
                <th className="text-center p-3 text-purple-400">A: AI/Chat</th>
                <th className="text-center p-3 text-blue-400">B: iPaaS</th>
                <th className="text-center p-3 text-green-400">C: Power BI</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Build Cost', '$80-150K', '$100-200K', '$60-120K'],
                ['Annual Cost', '$40-80K', '$60-180K', '$10-30K'],
                ['Time to Value', '3-6 months', '4-8 months', '2-4 months'],
                ['Rep Friction', 'Lowest (just ask)', 'None (automated)', 'Low (new dashboard)'],
                ['ITSM Usage Visibility', '✅ On demand', '✅ Piped to outputs', '✅ Dedicated views'],
                ['White Space Analysis', '✅ AI-driven', '✅ Calculated', '✅ Visual heat map'],
                ['Scalability', 'High', 'Highest', 'High'],
                ['New Vendor Needed?', 'No', 'Possibly', 'No'],
                ['Prerequisite', '360 API', '360 API', '360 data pipeline'],
              ].map((row, i) => (
                <tr key={i} className="border-t border-[#1a1a1a]">
                  <td className="p-3 text-[#888] font-medium">{row[0]}</td>
                  <td className="p-3 text-center text-[#999]">{row[1]}</td>
                  <td className="p-3 text-center text-[#999]">{row[2]}</td>
                  <td className="p-3 text-center text-[#999]">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ROI */}
      <Section title="Full ROI Analysis" defaultOpen={false}>
        <div className="space-y-2">
          {roiComparison.map((r) => (
            <div key={r.metric} className="flex items-center justify-between bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-3">
              <span className="text-xs text-[#888]">{r.metric}</span>
              <span className="text-sm font-bold text-white">{r.value}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Executive Ask */}
      <div className="bg-[#111] border border-[#222] rounded-xl p-5">
        <h3 className="text-sm font-bold text-white mb-3">Executive Ask — Required for Any Proposal</h3>
        <p className="text-xs text-[#666] mb-3">Regardless of which proposal is selected, these prerequisites are needed:</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { ask: 'Customer 360 API / Data Export capability', critical: true },
            { ask: 'ZoomInfo API access (confirm current license tier)', critical: true },
            { ask: 'Salesforce admin capacity (custom report types, fields)', critical: true },
            { ask: 'VP Sales / CRO sponsorship for org-wide rollout', critical: true },
            { ask: 'Power BI workspace (likely already available via M365)', critical: false },
            { ask: '1 RevOps analyst + 1 SF admin for 8-12 weeks', critical: false },
            { ask: 'Copilot Studio access (for Proposal A)', critical: false },
            { ask: 'iPaaS evaluation budget (for Proposal B)', critical: false },
          ].map((a) => (
            <div key={a.ask} className="flex items-center gap-2 text-xs text-[#999]">
              {a.critical ? (
                <AlertTriangle size={12} className="text-red-400 flex-shrink-0" />
              ) : (
                <ArrowRight size={12} className="text-[#555] flex-shrink-0" />
              )}
              <span className={a.critical ? 'text-[#ccc]' : ''}>{a.ask}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Deep Dive Link */}
      <a href="/value-engineering/projects/bingo-card/deep-dive"
        className="block bg-gradient-to-r from-purple-500/5 to-blue-500/5 border border-purple-500/30 rounded-xl p-5 hover:border-purple-500/50 transition-all group">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare size={20} className="text-purple-400" />
            <div>
              <div className="text-sm font-bold text-white">Extended Analysis: Salesforce Agentforce + Alternatives + Success Stories</div>
              <div className="text-xs text-[#666] mt-0.5">Proposal D (Salesforce-Native), ARPEDIO, Clari, People.ai, Demandbase comparison, Power Sales Rep framework, 5 enterprise case studies</div>
            </div>
          </div>
          <ArrowRight size={16} className="text-[#333] group-hover:text-purple-400 transition-colors" />
        </div>
      </a>
    </div>
  );
}
