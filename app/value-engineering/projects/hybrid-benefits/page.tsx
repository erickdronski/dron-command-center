'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, ChevronUp, Lightbulb, Zap, Shield, Layers, RefreshCw, Info, Tag } from 'lucide-react';

/* ────────────────────────────────────────────
   TYPES
   ──────────────────────────────────────────── */

type FactorSource = 'current' | 'new';

type Factor = {
  name: string;
  type: 'driver' | 'improvement' | 'financial' | 'ramp';
  source: FactorSource; // current = from old or new provided factor libraries, new = we created it
  sourceNote?: string;  // which library it came from
  value: string;
  y1?: string;
  y2?: string;
  y3?: string;
};

type OldBenefit = {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  painPoints: string[];
  factors: Factor[];
  totals: { y1: string; y2: string; y3: string };
};

type HybridBenefit = {
  id: string;
  name: string;
  tag: 'hybrid-itsm' | 'service-mapping';
  rationale: string;
  conservatismNote: string;
  description: string;
  ivantiProducts: string[]; // actual Ivanti products enabling this
  verifiedCapabilities: string[]; // verified against Ivanti reference guide
  oldSourceBenefits: string[];
  painPoints: string[];
  factors: Factor[];
  calculation: string;
  totals: { y1: string; y2: string; y3: string };
};

/* ────────────────────────────────────────────
   OLD BENEFITS (from screenshots)
   ──────────────────────────────────────────── */

const oldBenefits: OldBenefit[] = [
  {
    id: 'old-change-mgmt',
    name: 'Reduce core business service disruptions through ability to modernize your change manage process',
    description: 'Reduce core business service disruptions (planned and unplanned) by up to 70% with more successful changes informed by an accurate CMDB.',
    capabilities: ['Simplify, automate, and accelerate complex change processes', 'Accelerate change management using dynamic change approval policies'],
    painPoints: ['Manual and offline processes for change management', 'Lack of documented change management processes', 'Lack of visibility and reporting through dashboards and analytics'],
    factors: [
      { name: 'Annual outages', type: 'driver', source: 'current', sourceNote: 'Old benefit library', value: '3.96', y1: '3.96', y2: '3.96', y3: '3.96' },
      { name: '% reduction in number of outage impacts', type: 'improvement', source: 'current', sourceNote: 'Old benefit library', value: '50%', y1: '50%', y2: '50%', y3: '50%' },
      { name: 'Lost productivity per outage due to infrastructure or application change', type: 'financial', source: 'current', sourceNote: 'Old benefit library', value: '$10,600', y1: '$10.6K', y2: '$10.6K', y3: '$10.6K' },
      { name: 'Benefit Ramp', type: 'ramp', source: 'current', value: '60/100/100%', y1: '60%', y2: '100%', y3: '100%' },
    ],
    totals: { y1: '$12.5K', y2: '$20.9K', y3: '$20.9K' },
  },
  {
    id: 'old-onboarding',
    name: 'Improve New Hire Onboarding Experience through reduced handle time',
    description: 'Enable coordination between all departments through the first 90 days. Automation and workflow create a personalized experience on any device.',
    capabilities: ['Streamlined process across the onboarding lifecycle', 'Organization visibility across key stakeholders', 'Dependency task creation via automated workflows'],
    painPoints: ['Manual processes lead to errors and mistakes', 'Lack of end-to-end approach over multiple systems and departments', 'Poor day 1 employee experience could lead to turnover'],
    factors: [
      { name: 'Hours spent performing onboarding activities (per year)', type: 'driver', source: 'current', sourceNote: 'Old benefit library', value: '2,200 H', y1: '2.2K', y2: '2.2K', y3: '2.2K' },
      { name: '% reduction in time spent on onboarding activities', type: 'improvement', source: 'current', sourceNote: 'Old benefit library', value: '20%', y1: '20%', y2: '20%', y3: '20%' },
      { name: 'Revenue impact per FTE per hour', type: 'financial', source: 'current', sourceNote: 'Old benefit library', value: '$120', y1: '$120', y2: '$120', y3: '$120' },
      { name: 'Benefit Ramp', type: 'ramp', source: 'current', value: '60/100/100%', y1: '60%', y2: '100%', y3: '100%' },
    ],
    totals: { y1: '$31.7K', y2: '$52.8K', y3: '$52.8K' },
  },
  {
    id: 'old-automation-workflow',
    name: 'Increase business user productivity and experience through automation workflow',
    description: 'Empower every employee to resolve or request assistance through automated business processes and self-service environments.',
    capabilities: ['Omnichannel', 'Drive adoption of new service offerings', 'Empower every employee with self-service through knowledgebase and request offerings'],
    painPoints: ['Time inefficiency tracking and tracing service requests', 'Lack of visibility into status', 'Poor support experience and wasted resource bandwidth'],
    factors: [
      { name: 'Annual hours saved from improved service requests management', type: 'driver', source: 'current', sourceNote: 'Old benefit library', value: '360 H', y1: '360', y2: '360', y3: '360' },
      { name: '% of saved hours which translate to business user productivity', type: 'improvement', source: 'current', sourceNote: 'Old benefit library', value: '80%', y1: '80%', y2: '80%', y3: '80%' },
      { name: 'Revenue impact per FTE per hour', type: 'financial', source: 'current', sourceNote: 'Old benefit library', value: '$120', y1: '$120', y2: '$120', y3: '$120' },
      { name: 'Benefit Ramp', type: 'ramp', source: 'current', value: '60/100/100%', y1: '60%', y2: '100%', y3: '100%' },
    ],
    totals: { y1: '$20.7K', y2: '$34.6K', y3: '$34.6K' },
  },
  {
    id: 'old-reduced-incidents',
    name: 'Improve IT efficiencies through reduced incidents volume',
    description: 'Improve incident management procedures with knowledge base articles, automated workflows to reduce manual processes, and increased efficiency.',
    capabilities: ['Improved service through relevant information, insights and analytics', 'Improved employee satisfaction through higher first call resolution and MTTR', 'Improve agent resource bandwidth through ticket deflection'],
    painPoints: ['Staff doing manual, mundane, repetitive tasks', 'Low staff morale leading to turnover and higher costs', 'Low NPS and employee SAT scores'],
    factors: [
      { name: 'Incident tickets per year', type: 'driver', source: 'current', sourceNote: 'Old benefit library', value: '9,000', y1: '9K', y2: '9K', y3: '9K' },
      { name: '% reduction in incidents submitted', type: 'improvement', source: 'current', sourceNote: 'Old benefit library', value: '50%', y1: '50%', y2: '50%', y3: '50%' },
      { name: 'Average cost per incident', type: 'financial', source: 'current', sourceNote: 'Old benefit library', value: '$3.75', y1: '$3.75', y2: '$3.75', y3: '$3.75' },
      { name: 'Benefit Ramp', type: 'ramp', source: 'current', value: '60/100/100%', y1: '60%', y2: '100%', y3: '100%' },
    ],
    totals: { y1: '$10.1K', y2: '$16.9K', y3: '$16.9K' },
  },
  {
    id: 'old-service-request',
    name: 'Reduce service request inefficiencies through automation and workflow',
    description: 'Consolidated and integrated processes to reduce the number of touches. Automation and workflows create faster resolution time.',
    capabilities: ['Improve service task lifecycle management', 'Leverage workflows to identify, track, and resolve high impact service requests', 'Drive adoption with one channel for all service request offerings'],
    painPoints: ['Siloed operations, disparate automation capabilities', 'Non-integrated solutions leading to unnecessary resource overhead', 'Missed SLAs'],
    factors: [
      { name: 'Annual number of access or software service requests currently addressed', type: 'driver', source: 'current', sourceNote: 'Old benefit library', value: '1,100', y1: '1.1K', y2: '1.1K', y3: '1.1K' },
      { name: '% reduction of access or software service requests handle time', type: 'improvement', source: 'current', sourceNote: 'Old benefit library', value: '80%', y1: '80%', y2: '80%', y3: '80%' },
      { name: 'Average cost per service request', type: 'financial', source: 'current', sourceNote: 'Old benefit library', value: '$12.50', y1: '$12.5', y2: '$12.5', y3: '$12.5' },
      { name: 'Benefit Ramp', type: 'ramp', source: 'current', value: '60/100/100%', y1: '60%', y2: '100%', y3: '100%' },
    ],
    totals: { y1: '$6.5K', y2: '$10.8K', y3: '$10.8K' },
  },
  {
    id: 'old-user-productivity',
    name: 'Improve business user productivity through decreased incident volume',
    description: 'Help the employee and organization remain productive and avoid multiple touches with support teams.',
    capabilities: ['Reduce MTTR and satisfy customers with consistent IT solutions', 'Avoid 30% of ticket volume through self-service activities', 'Deflection of incidents through automation or self-service'],
    painPoints: ['Long hold times for support affect business user productivity', 'Poor support experiences result in negative NPS and CSAT scores'],
    factors: [
      { name: 'Incident tickets per year', type: 'driver', source: 'current', sourceNote: 'Old benefit library', value: '9,000', y1: '9K', y2: '9K', y3: '9K' },
      { name: '% business user hours saved from decreased incident volume', type: 'improvement', source: 'current', sourceNote: 'Old benefit library', value: '10%', y1: '10%', y2: '10%', y3: '10%' },
      { name: 'Revenue impact per FTE per hour', type: 'financial', source: 'current', sourceNote: 'Old benefit library', value: '$120', y1: '$120', y2: '$120', y3: '$120' },
      { name: 'Benefit Ramp', type: 'ramp', source: 'current', value: '60/100/100%', y1: '60%', y2: '100%', y3: '100%' },
    ],
    totals: { y1: '$64.8K', y2: '$108K', y3: '$108K' },
  },
];

/* ── Factor Libraries ── */
type FactorAssumption = { name: string; value: string; category: 'driver' | 'financial' };

const newDriverFactors: FactorAssumption[] = [
  { name: 'Addressable Employee Downtime', value: '33,306 H', category: 'driver' },
  { name: 'Addressable Employee Productivity Improvement Hours', value: '41,633 H', category: 'driver' },
  { name: 'Annual Breach Detection & Escalation Cost', value: '$1,465,200', category: 'driver' },
  { name: 'Annual Breach Notification Cost', value: '$399,600', category: 'driver' },
  { name: 'Annual Compliance Staff Working Hours', value: '250,000 H', category: 'driver' },
  { name: 'Annual Cost of Ticket Handling', value: '$1,563,232', category: 'driver' },
  { name: 'Annual Hours Handling Tickets', value: '30,000 H', category: 'driver' },
  { name: 'Annual IT & HR hours spent offboarding employees', value: '500 H', category: 'driver' },
  { name: 'Annual IT hours spent analyzing risk', value: '4,000 H', category: 'driver' },
  { name: 'Annual IT hours spent analyzing threat intelligence', value: '1,000 H', category: 'driver' },
  { name: 'Annual IT hours spent monitoring the IT estate', value: '5,417 H', category: 'driver' },
  { name: 'Annual IT hours spent on app deployments', value: '4,500 H', category: 'driver' },
  { name: 'Annual IT hours spent on asset management', value: '10,000 H', category: 'driver' },
  { name: 'Annual IT hours spent on device management', value: '14,500 H', category: 'driver' },
  { name: 'Annual IT hours spent on emergency repairs', value: '3,000 H', category: 'driver' },
  { name: 'Annual IT hours spent on patch auditing', value: '2,000 H', category: 'driver' },
  { name: 'Annual IT hours spent on periodic assessments', value: '2,000 H', category: 'driver' },
  { name: 'Annual IT hours spent on procurement', value: '500 H', category: 'driver' },
  { name: 'Annual IT hours spent on routine tasks', value: '299 H', category: 'driver' },
  { name: 'Annual IT hours spent on security updates', value: '10,000 H', category: 'driver' },
  { name: 'Annual IT hours spent reconciling asset inventory', value: '5,000 H', category: 'driver' },
];

const newFinancialFactors: FactorAssumption[] = [
  { name: 'Fully loaded IT FTE Annual Salary', value: '$89,000', category: 'financial' },
  { name: 'IT hourly rate', value: '$52', category: 'financial' },
  { name: 'AHT cost per incident', value: '$26', category: 'financial' },
  { name: 'Average IT support cost per ticket', value: '$26', category: 'financial' },
  { name: 'Average cleanup cost per malware incident', value: '$15,000', category: 'financial' },
  { name: 'PMO Hourly Rate', value: '$1', category: 'financial' },
  { name: 'HRSM Hourly Rate', value: '$1', category: 'financial' },
  { name: 'FM Maintenance Hourly Rate', value: '$1', category: 'financial' },
  { name: 'GRC Compliance Staff Hourly Rate', value: '$1', category: 'financial' },
];

const smDriverFactors: FactorAssumption[] = [
  { name: 'Annual Manufacturing Revenue Impact per outage', value: '$25,000', category: 'driver' },
  { name: 'Annual number of hours spent on impact management resolution', value: '120 H', category: 'driver' },
  { name: 'Annual outages (0.33/month × 12)', value: '3.96', category: 'driver' },
  { name: 'Potential revenue hours impacted from cyber or virus service interruption event', value: '2,500 H', category: 'driver' },
];

const smFinancialFactors: FactorAssumption[] = [
  { name: 'Estimated Total Organizational Impact Cost', value: '$1,080,000', category: 'financial' },
  { name: 'Revenue impact per FTE per hour', value: '$120', category: 'financial' },
  { name: 'Lost productivity per outage (9,000 × $120 × 0.04 hrs)', value: '$43,200', category: 'financial' },
  { name: 'Cost per device replacement', value: '$10', category: 'financial' },
];

/* ────────────────────────────────────────────
   HYBRID ITSM BENEFITS (5)
   All capabilities verified against Ivanti reference guide
   All factors tagged current/new
   ──────────────────────────────────────────── */

const hybridBenefits: HybridBenefit[] = [
  {
    id: 'hybrid-1',
    name: 'Reduce IT Service Desk Costs Through Intelligent Ticket Automation',
    tag: 'hybrid-itsm',
    ivantiProducts: ['Ivanti Neurons for ITSM', 'Ivanti Intelligence – AI for ITSM Analyst', 'Ivanti Neurons Digital Assistant'],
    verifiedCapabilities: [
      'AI ticket classification and incident summarization (AI for ITSM Analyst)',
      'KB article generation and suggested resolutions (AI for ITSM Analyst)',
      'Automated workflows for incident and service request routing (Neurons for ITSM — Incident, Problem, Service Catalog modules)',
      'Conversational AI virtual support agent for self-service deflection (Neurons Digital Assistant)',
    ],
    rationale: 'The old environment valued incidents at $3.75/ticket — the new factor library provides $26 AHT cost per incident, which is realistic for a blended IT agent rate derived from $89K loaded salary. We pair this with the new "Annual Hours Handling Tickets" (30,000 H) driver instead of the old "9K tickets" count. The improvement is dialed to 12% — achievable through Ivanti\'s AI classification (which auto-categorizes and routes), KB auto-suggestion (reduces research time), and Digital Assistant deflection (handles L0 queries). This replaces old benefits #4 and #5 which had aggressive 50%/80% improvement assumptions.',
    conservatismNote: 'At 12% improvement, doubling ticket volume only doubles the result linearly. The $52/hr IT rate and 30,000 hour driver are both from the provided new factor library — no invented numbers. Even at 8% improvement, the benefit is $124.8K/yr, still meaningful.',
    description: 'Leverage Neurons for ITSM AI classification, KB auto-suggestion, and Digital Assistant self-service to reduce ticket handling time and volume.',
    oldSourceBenefits: ['Old #4: Improve IT efficiencies through reduced incidents volume', 'Old #5: Reduce service request inefficiencies through automation and workflow'],
    painPoints: ['High ticket volume consuming agent capacity', 'Inconsistent ticket categorization leading to rework and escalation', 'Agents manually searching KB for known resolutions'],
    factors: [
      { name: 'Annual Hours Handling Tickets', type: 'driver', source: 'current', sourceNote: 'New factor library', value: '30,000 H', y1: '30,000', y2: '30,000', y3: '30,000' },
      { name: '% reduction in ticket handling hours through AI automation', type: 'improvement', source: 'new', sourceNote: 'Conservative estimate — blends AI classification + KB suggestion + Digital Assistant deflection', value: '12%', y1: '12%', y2: '12%', y3: '12%' },
      { name: 'IT hourly rate', type: 'financial', source: 'current', sourceNote: 'New factor library', value: '$52', y1: '$52', y2: '$52', y3: '$52' },
      { name: 'Benefit Ramp', type: 'ramp', source: 'current', sourceNote: 'Standard ramp', value: '60/100/100%', y1: '60%', y2: '100%', y3: '100%' },
    ],
    calculation: '30,000 H × 12% × $52/hr × Ramp',
    totals: { y1: '$112.3K', y2: '$187.2K', y3: '$187.2K' },
  },
  {
    id: 'hybrid-2',
    name: 'Recover Employee Productivity Lost to IT Downtime and Support Wait Times',
    tag: 'hybrid-itsm',
    ivantiProducts: ['Ivanti Neurons for ITSM', 'Ivanti Intelligence – AI for ITSM Analyst', 'Ivanti Neurons Digital Assistant'],
    verifiedCapabilities: [
      'Incident correlation to identify and resolve widespread issues faster (AI for ITSM Analyst — incident correlation)',
      'SLA management with escalation policies to enforce resolution timelines (Neurons for ITSM — SLA module)',
      'Self-service portal and Digital Assistant for immediate L0 resolution (Neurons for ITSM Service Catalog + Digital Assistant)',
      'Knowledge base for end-user self-help (Neurons for ITSM — Knowledge module)',
    ],
    rationale: 'Old benefit #6 used 9K tickets × 10% × $120/hr — mixing ticket count with per-hour revenue impact creates scaling risk. The new "Addressable Employee Downtime" (33,306 H) is a direct measurement from the new factor library. We apply a conservative 5% recovery rate and use the $52/hr IT rate instead of $120 FTE revenue impact — grounding the financial factor in actual cost rather than theoretical productivity. Ivanti\'s incident correlation (groups related incidents), SLA enforcement, and self-service all directly reduce the time employees wait on IT.',
    conservatismNote: '5% of 33,306 hours = 1,665 hours recovered. For 9,000 employees, that\'s ~11 minutes/employee/year saved — extremely conservative. Using $52 IT rate instead of $120 revenue rate avoids the "does every saved hour generate revenue?" objection.',
    description: 'Reduce addressable employee downtime through faster incident resolution via AI correlation, SLA enforcement, and self-service capabilities.',
    oldSourceBenefits: ['Old #6: Improve business user productivity through decreased incident volume', 'Old #3: Increase business user productivity through automation workflow'],
    painPoints: ['Employees losing productive hours waiting for IT', 'No measurement of how much downtime IT issues cause', 'Reactive support model means users wait instead of working'],
    factors: [
      { name: 'Addressable Employee Downtime', type: 'driver', source: 'current', sourceNote: 'New factor library', value: '33,306 H', y1: '33,306', y2: '33,306', y3: '33,306' },
      { name: '% of downtime hours recovered through ITSM improvements', type: 'improvement', source: 'new', sourceNote: 'Conservative — 5% of measured downtime recovered via faster resolution + self-service', value: '5%', y1: '5%', y2: '5%', y3: '5%' },
      { name: 'IT hourly rate', type: 'financial', source: 'current', sourceNote: 'New factor library', value: '$52', y1: '$52', y2: '$52', y3: '$52' },
      { name: 'Benefit Ramp', type: 'ramp', source: 'current', sourceNote: 'Standard ramp', value: '60/100/100%', y1: '60%', y2: '100%', y3: '100%' },
    ],
    calculation: '33,306 H × 5% × $52/hr × Ramp',
    totals: { y1: '$51.9K', y2: '$86.6K', y3: '$86.6K' },
  },
  {
    id: 'hybrid-3',
    name: 'Prevent Service Disruptions Through CMDB-Informed Change Management',
    tag: 'hybrid-itsm',
    ivantiProducts: ['Ivanti Neurons for ITSM'],
    verifiedCapabilities: [
      'Change Management with dynamic change approval policies (Neurons for ITSM — Change module)',
      'CMDB with Configuration Items for impact analysis (Neurons for ITSM — CMDB module)',
      'Problem Management for root cause analysis of recurring disruptions (Neurons for ITSM — Problem module)',
      'Reporting and dashboards for change success rate tracking (Neurons for ITSM — Reporting)',
    ],
    rationale: 'Old benefit #1 used $10.6K lost productivity per outage with a 50% improvement — aggressive. The new factor library provides $43,200 per outage (9,000 employees × $120 × 0.04 hrs average impact), which is the full organizational cost. We reduce improvement to 15%. Ivanti\'s CMDB provides the configuration item relationships that inform change risk — the Change module enforces approval policies and the Problem module identifies patterns causing disruptions. At 3.96 outages/year, 15% prevented = 0.594 outages — less than one per year. Credible.',
    conservatismNote: 'At 3.96 annual outages, this benefit is naturally capped. 15% means preventing ~0.6 outages/year. Even if outages increase to 6/year, the benefit only reaches $38.9K — no exponential scaling.',
    description: 'Use CMDB-informed change management and dynamic approval policies to reduce change-related service disruptions.',
    oldSourceBenefits: ['Old #1: Reduce core business service disruptions through change management'],
    painPoints: ['Changes causing unplanned outages due to unknown dependencies', 'Manual change processes missing risk signals', 'No CMDB data to inform change impact assessment'],
    factors: [
      { name: 'Annual outages', type: 'driver', source: 'current', sourceNote: 'Old benefit library + SM factor library (both = 3.96)', value: '3.96', y1: '3.96', y2: '3.96', y3: '3.96' },
      { name: '% of outages prevented through CMDB-informed change management', type: 'improvement', source: 'new', sourceNote: 'Reduced from old 50% to conservative 15%', value: '15%', y1: '15%', y2: '15%', y3: '15%' },
      { name: 'Lost productivity per outage', type: 'financial', source: 'current', sourceNote: 'SM financial factor library ($43,200 = 9,000 × $120 × 0.04)', value: '$43,200', y1: '$43,200', y2: '$43,200', y3: '$43,200' },
      { name: 'Benefit Ramp', type: 'ramp', source: 'current', sourceNote: 'Standard ramp', value: '60/100/100%', y1: '60%', y2: '100%', y3: '100%' },
    ],
    calculation: '3.96 × 15% × $43,200 × Ramp',
    totals: { y1: '$15.4K', y2: '$25.7K', y3: '$25.7K' },
  },
  {
    id: 'hybrid-4',
    name: 'Streamline Employee Lifecycle Management (Onboarding + Offboarding)',
    tag: 'hybrid-itsm',
    ivantiProducts: ['Ivanti Neurons for ITSM', 'Ivanti Neurons for ITSM Line of Business'],
    verifiedCapabilities: [
      'HR Service Management workflows extending ITSM to HR processes (ITSM Line of Business — HRSM module)',
      'Automated task orchestration with dependency chaining across departments (Neurons for ITSM — workflow engine)',
      'Service Catalog for standardized onboarding/offboarding request templates (Neurons for ITSM — Service Catalog)',
      'Real-time dashboards and reports for lifecycle task visibility (Neurons for ITSM — Reporting)',
    ],
    rationale: 'Old benefit #2 used 2,200 onboarding hours × 20% × $120/hr. The new factor library provides 500 offboarding hours — combining to 2,700 hours for full lifecycle. We use IT hourly rate ($52) instead of revenue impact ($120) because IT staff performing lifecycle tasks are paid $52/hr — that\'s the actual cost being saved, not theoretical revenue. ITSM Line of Business extends Neurons for ITSM to HR workflows, and the Service Catalog provides standardized templates. Improvement reduced to 15% from 20%.',
    conservatismNote: 'Using $52/hr vs $120/hr cuts the benefit ~57% but represents actual cost. 15% × 2,700 = 405 hours saved = ~7.8 hrs/week — highly believable for workflow automation.',
    description: 'Automate full employee lifecycle using ITSM workflows and HR Service Management. Combines onboarding and offboarding hours.',
    oldSourceBenefits: ['Old #2: Improve New Hire Onboarding Experience through reduced handle time'],
    painPoints: ['Manual onboarding taking days instead of hours', 'Offboarding gaps leaving orphaned accounts and access', 'No cross-department visibility for lifecycle tasks'],
    factors: [
      { name: 'Hours spent performing onboarding activities (per year)', type: 'driver', source: 'current', sourceNote: 'Old benefit library', value: '2,200 H', y1: '2,200', y2: '2,200', y3: '2,200' },
      { name: 'Annual IT & HR hours spent offboarding employees', type: 'driver', source: 'current', sourceNote: 'New factor library', value: '500 H', y1: '500', y2: '500', y3: '500' },
      { name: '% reduction in lifecycle management time through automation', type: 'improvement', source: 'new', sourceNote: 'Reduced from old 20% to conservative 15%', value: '15%', y1: '15%', y2: '15%', y3: '15%' },
      { name: 'IT hourly rate', type: 'financial', source: 'current', sourceNote: 'New factor library', value: '$52', y1: '$52', y2: '$52', y3: '$52' },
      { name: 'Benefit Ramp', type: 'ramp', source: 'current', sourceNote: 'Standard ramp', value: '60/100/100%', y1: '60%', y2: '100%', y3: '100%' },
    ],
    calculation: '(2,200 + 500) H × 15% × $52/hr × Ramp',
    totals: { y1: '$12.6K', y2: '$21.1K', y3: '$21.1K' },
  },
  {
    id: 'hybrid-5',
    name: 'Increase Self-Service Adoption to Deflect Tickets and Reduce Agent Load',
    tag: 'hybrid-itsm',
    ivantiProducts: ['Ivanti Neurons for ITSM', 'Ivanti Neurons Digital Assistant', 'Ivanti Intelligence – AI for ITSM Analyst'],
    verifiedCapabilities: [
      'Self-service portal with Service Catalog for standardized request fulfillment (Neurons for ITSM — Service Catalog)',
      'Knowledge base with searchable articles for end-user self-help (Neurons for ITSM — Knowledge module)',
      'Conversational AI virtual agent handling L0 requests without human intervention (Neurons Digital Assistant)',
      'KB article generation to continuously expand self-service content (AI for ITSM Analyst)',
    ],
    rationale: 'Old benefits #3 and #5 used high improvement % (80%) against small drivers (360 hours, 1,100 requests). The new factor library provides "Annual Hours Handling Tickets" (30,000 H) — a much larger, realistic base. We apply 8% self-service deflection — well below vendor claims of 30% but realistic for year-1 adoption. Ivanti\'s Service Catalog, Knowledge module, and Digital Assistant are the actual product features that enable this. The AI for ITSM Analyst generates KB articles to continuously expand self-service coverage.',
    conservatismNote: '8% deflection on 30,000 hours = 2,400 hours freed. If self-service exceeds expectations at 15%, the benefit grows to $234K — a nice upside. But 8% is the defensible baseline.',
    description: 'Drive ticket deflection through self-service portal, Knowledge base, and Digital Assistant AI agent.',
    oldSourceBenefits: ['Old #3: Increase business user productivity through automation workflow', 'Old #5: Reduce service request inefficiencies through automation and workflow'],
    painPoints: ['Agents handling routine, repeatable requests manually', 'Low self-service adoption due to poor portal experience', 'Knowledge base underutilized and outdated'],
    factors: [
      { name: 'Annual Hours Handling Tickets', type: 'driver', source: 'current', sourceNote: 'New factor library', value: '30,000 H', y1: '30,000', y2: '30,000', y3: '30,000' },
      { name: '% of handling hours deflected through self-service', type: 'improvement', source: 'new', sourceNote: 'Conservative — 8% vs industry 30% claims. Reflects realistic year-1 self-service adoption', value: '8%', y1: '8%', y2: '8%', y3: '8%' },
      { name: 'IT hourly rate', type: 'financial', source: 'current', sourceNote: 'New factor library', value: '$52', y1: '$52', y2: '$52', y3: '$52' },
      { name: 'Benefit Ramp', type: 'ramp', source: 'current', sourceNote: 'Standard ramp', value: '60/100/100%', y1: '60%', y2: '100%', y3: '100%' },
    ],
    calculation: '30,000 H × 8% × $52/hr × Ramp',
    totals: { y1: '$74.9K', y2: '$124.8K', y3: '$124.8K' },
  },

  /* ── SERVICE MAPPING BENEFITS (5) ── */
  {
    id: 'sm-1',
    name: 'Reduce Manufacturing Downtime Through Application Dependency Visibility',
    tag: 'service-mapping',
    ivantiProducts: ['Ivanti Neurons for Service Mapping', 'Ivanti Neurons for Discovery'],
    verifiedCapabilities: [
      'Auto-discover data center dependencies and visual service maps (Service Mapping — core capability)',
      'Application dependency mapping showing infrastructure-to-service relationships (Service Mapping — core capability)',
      'Real-time active/passive scanning to maintain current dependency data (Neurons for Discovery)',
    ],
    rationale: 'Directly from the Service Mapping deck. Manufacturing environments lose $25K per outage when IT issues hit factory systems. Service Mapping\'s core capability — auto-discovering application dependencies — enables teams to trace root cause faster. With 3.96 outages/year, 12% reduction means preventing ~0.47 outages worth of impact. All factors are from the provided SM factor library.',
    conservatismNote: '12% of 3.96 = 0.47 outages worth of impact reduced. Even rounding up, less than one prevented outage per year. The $25K/outage and 3.96 outage count are from the SM factor library, not assumptions.',
    description: 'Use Service Mapping application dependency discovery to quickly identify root causes and restore factory technology. Reduces manufacturing downtime.',
    oldSourceBenefits: [],
    painPoints: ['Idle time affects productivity and morale', 'Lack of visibility creates extended resolution time', 'Undocumented application & infrastructure details'],
    factors: [
      { name: 'Annual outages', type: 'driver', source: 'current', sourceNote: 'SM factor library', value: '3.96', y1: '3.96', y2: '3.96', y3: '3.96' },
      { name: '% reduction in outage impact through dependency visibility', type: 'improvement', source: 'new', sourceNote: 'Conservative 12% — Service Mapping reduces mean time to identify root cause', value: '12%', y1: '12%', y2: '12%', y3: '12%' },
      { name: 'Annual Manufacturing Revenue Impact per outage', type: 'financial', source: 'current', sourceNote: 'SM factor library', value: '$25,000', y1: '$25,000', y2: '$25,000', y3: '$25,000' },
      { name: 'Benefit Ramp', type: 'ramp', source: 'current', sourceNote: 'Per SM deck: 100% Y1', value: '100/100/100%', y1: '100%', y2: '100%', y3: '100%' },
    ],
    calculation: '3.96 × 12% × $25,000 × Ramp',
    totals: { y1: '$11.9K', y2: '$11.9K', y3: '$11.9K' },
  },
  {
    id: 'sm-2',
    name: 'Reduce Cyber Incident Impact Through Service-Aware Response',
    tag: 'service-mapping',
    ivantiProducts: ['Ivanti Neurons for Service Mapping', 'Ivanti Neurons for Discovery'],
    verifiedCapabilities: [
      'Visual service maps showing business service-to-infrastructure relationships (Service Mapping — core capability)',
      'Auto-discovery of data center dependencies for impact assessment (Service Mapping — core capability)',
      'Real-time infrastructure scanning for current environment state (Neurons for Discovery)',
    ],
    rationale: 'The deck listed this at $2.59M — which implied near-total prevention of a major breach. We reconstruct conservatively using the Estimated Total Organizational Impact Cost ($1,080,000 from SM financial factors) and apply 5% impact reduction. Service Mapping helps identify which business services are affected during a cyber event, enabling targeted containment. 5% faster containment means reducing blast radius — not preventing the event.',
    conservatismNote: 'The deck\'s $2.59M was unrealistic. $1,080,000 × 5% = $54K is a fraction of that but defensible. Service Mapping doesn\'t prevent breaches — it helps you respond faster by understanding which services are impacted.',
    description: 'Service Mapping provides service-relevant insights during cyber incidents — understanding which business services are impacted enables targeted containment and prioritized recovery.',
    oldSourceBenefits: [],
    painPoints: ['No visibility into which services are impacted during an attack', 'Slow containment due to unknown dependencies', 'Recovery prioritization based on guesswork'],
    factors: [
      { name: 'Estimated Total Organizational Impact Cost', type: 'driver', source: 'current', sourceNote: 'SM financial factor library', value: '$1,080,000', y1: '$1,080,000', y2: '$1,080,000', y3: '$1,080,000' },
      { name: '% impact reduction through faster service-aware containment', type: 'improvement', source: 'new', sourceNote: 'Conservative 5% — reduces blast radius via targeted response, not breach prevention', value: '5%', y1: '5%', y2: '5%', y3: '5%' },
      { name: 'Benefit Ramp', type: 'ramp', source: 'current', sourceNote: 'Standard ramp', value: '60/100/100%', y1: '60%', y2: '100%', y3: '100%' },
    ],
    calculation: '$1,080,000 × 5% × Ramp',
    totals: { y1: '$32.4K', y2: '$54.0K', y3: '$54.0K' },
  },
  {
    id: 'sm-3',
    name: 'Improve Change Success Rate with Dependency-Aware Impact Analysis',
    tag: 'service-mapping',
    ivantiProducts: ['Ivanti Neurons for Service Mapping', 'Ivanti Neurons for ITSM'],
    verifiedCapabilities: [
      'Application dependency mapping showing what breaks when infrastructure changes (Service Mapping — core capability)',
      'Visual service maps for change advisory board review (Service Mapping — core capability)',
      'Change Management integration — service maps inform change risk assessment (ITSM Change module + Service Mapping)',
    ],
    rationale: 'Maps to the deck\'s "Improve Change Management Operations" benefit ($51.3K at 60% ramp). We reconstruct using outage prevention: 3.96 outages × 10% prevented × $43,200 per outage. Service Mapping feeds dependency data into ITSM\'s Change module — change managers can see downstream impact before approving. 10% is conservative vs the deck\'s higher implied improvement.',
    conservatismNote: '3.96 × 10% = 0.396 outages prevented × $43,200 = $17.1K at full ramp. Intentionally below deck\'s $51.3K to allow room to adjust up with customer data.',
    description: 'Service Mapping dependency data feeds into ITSM Change Management to assess impact before implementation. Reduces change-related outages.',
    oldSourceBenefits: [],
    painPoints: ['Changes causing unexpected downstream failures', 'Change Advisory Board lacking accurate dependency data', 'Manual impact assessment missing hidden dependencies'],
    factors: [
      { name: 'Annual outages', type: 'driver', source: 'current', sourceNote: 'SM factor library + Old benefit library', value: '3.96', y1: '3.96', y2: '3.96', y3: '3.96' },
      { name: '% of outages prevented through dependency-aware change planning', type: 'improvement', source: 'new', sourceNote: 'Conservative 10% — Service Mapping shows downstream impact before change execution', value: '10%', y1: '10%', y2: '10%', y3: '10%' },
      { name: 'Lost productivity per outage', type: 'financial', source: 'current', sourceNote: 'SM financial factor library', value: '$43,200', y1: '$43,200', y2: '$43,200', y3: '$43,200' },
      { name: 'Benefit Ramp', type: 'ramp', source: 'current', sourceNote: 'Standard ramp', value: '60/100/100%', y1: '60%', y2: '100%', y3: '100%' },
    ],
    calculation: '3.96 × 10% × $43,200 × Ramp',
    totals: { y1: '$10.3K', y2: '$17.1K', y3: '$17.1K' },
  },
  {
    id: 'sm-4',
    name: 'Reduce Business User Downtime Through Proactive Service Health Monitoring',
    tag: 'service-mapping',
    ivantiProducts: ['Ivanti Neurons for Service Mapping', 'Ivanti Neurons for Discovery'],
    verifiedCapabilities: [
      'Visual service maps identifying bottlenecks and single points of failure (Service Mapping — stated capability from deck)',
      'Auto-discovery providing real-time accurate infrastructure data (Neurons for Discovery — real-time active/passive scanning)',
      'Service-to-infrastructure dependency tracking for proactive alerting (Service Mapping — core capability)',
    ],
    rationale: 'The deck\'s equivalent benefit was $11.5K. We anchor to Addressable Employee Downtime (33,306 H from new factor library) and apply 2% — service mapping visibility enables detection of degrading upstream services before full outage. At 2%, we\'re claiming 666 hours recovered across the entire organization per year — ~4.4 minutes per employee. Extremely conservative.',
    conservatismNote: '2% of 33,306 hours = 666 hours for 9,000 employees = 4.4 min/employee/year. Almost impossibly conservative. Significant upside room if the customer validates even 5% improvement.',
    description: 'Service Mapping identifies bottlenecks and single points of failure proactively. Detect service degradation before it impacts business users.',
    oldSourceBenefits: [],
    painPoints: ['Users reporting outages before IT detects them', 'No understanding of which services depend on which infrastructure', 'Lost productivity while waiting on end user to report impacts'],
    factors: [
      { name: 'Addressable Employee Downtime', type: 'driver', source: 'current', sourceNote: 'New factor library', value: '33,306 H', y1: '33,306', y2: '33,306', y3: '33,306' },
      { name: '% of downtime reduced through proactive service monitoring', type: 'improvement', source: 'new', sourceNote: 'Ultra-conservative 2% — proactive detection of degrading upstream services', value: '2%', y1: '2%', y2: '2%', y3: '2%' },
      { name: 'IT hourly rate', type: 'financial', source: 'current', sourceNote: 'New factor library', value: '$52', y1: '$52', y2: '$52', y3: '$52' },
      { name: 'Benefit Ramp', type: 'ramp', source: 'current', sourceNote: 'Per SM deck: 100% Y1', value: '100/100/100%', y1: '100%', y2: '100%', y3: '100%' },
    ],
    calculation: '33,306 H × 2% × $52/hr × Ramp',
    totals: { y1: '$34.6K', y2: '$34.6K', y3: '$34.6K' },
  },
  {
    id: 'sm-5',
    name: 'Prevent Revenue Loss from Cyber or Virus Service Interruption Events',
    tag: 'service-mapping',
    ivantiProducts: ['Ivanti Neurons for Service Mapping'],
    verifiedCapabilities: [
      'Service-to-business mapping identifying revenue-critical services (Service Mapping — core capability)',
      'Visual dependency maps for prioritized recovery sequencing (Service Mapping — core capability)',
      'Proactive identification of single points of failure in revenue-critical service chains (Service Mapping — stated capability from deck)',
    ],
    rationale: 'From the deck. Uses "Potential revenue hours impacted from cyber/virus event" (2,500 H) and "Revenue impact per FTE per hour" ($120) — both from the SM factor library. We apply 3% prevention, meaning service mapping visibility helps the organization respond 3% faster — targeted containment, not full prevention. $9K/year is deliberately modest.',
    conservatismNote: '3% of (2,500 × $120) = $9K. Full exposure is $300K; we claim 3%. This avoids the "you\'re claiming to prevent a breach" objection — we\'re saying faster targeted response.',
    description: 'Service Mapping enables identification of revenue-critical services and prioritized recovery during cyber or virus interruption events.',
    oldSourceBenefits: [],
    painPoints: ['No visibility into which services generate revenue', 'Recovery prioritization based on gut feel, not data', 'Lengthy post-incident triage to understand business impact'],
    factors: [
      { name: 'Potential revenue hours impacted from cyber/virus event', type: 'driver', source: 'current', sourceNote: 'SM driver factor library', value: '2,500 H', y1: '2,500', y2: '2,500', y3: '2,500' },
      { name: '% of revenue impact prevented through service-aware response', type: 'improvement', source: 'new', sourceNote: 'Conservative 3% — targeted containment, not breach prevention', value: '3%', y1: '3%', y2: '3%', y3: '3%' },
      { name: 'Revenue impact per FTE per hour', type: 'financial', source: 'current', sourceNote: 'SM financial factor library', value: '$120', y1: '$120', y2: '$120', y3: '$120' },
      { name: 'Benefit Ramp', type: 'ramp', source: 'current', sourceNote: 'Per SM deck: 100% Y1', value: '100/100/100%', y1: '100%', y2: '100%', y3: '100%' },
    ],
    calculation: '2,500 H × 3% × $120/hr × Ramp',
    totals: { y1: '$9.0K', y2: '$9.0K', y3: '$9.0K' },
  },
];

/* ──────────── UI COMPONENTS ──────────── */

const factorTypeColors: Record<string, { bg: string; text: string; label: string }> = {
  driver: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'Driver' },
  improvement: { bg: 'bg-amber-500/10', text: 'text-amber-400', label: 'Improv.' },
  financial: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'Financial' },
  ramp: { bg: 'bg-purple-500/10', text: 'text-purple-400', label: 'Ramp' },
};

function SourceBadge({ source, note }: { source: FactorSource; note?: string }) {
  const isNew = source === 'new';
  return (
    <span className="group relative">
      <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold ${isNew ? 'bg-orange-500/15 text-orange-400 border border-orange-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/15'}`}>
        {isNew ? '✦ NEW' : '✓ CURRENT'}
      </span>
      {note && (
        <span className="absolute bottom-full left-0 mb-1 px-2 py-1 bg-[#222] text-[9px] text-[#aaa] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 max-w-xs">
          {note}
        </span>
      )}
    </span>
  );
}

function FactorRow({ factor }: { factor: Factor }) {
  const meta = factorTypeColors[factor.type];
  return (
    <div className="flex items-center gap-2 py-1.5">
      <span className={`text-[8px] px-1.5 py-0.5 rounded font-medium ${meta.bg} ${meta.text} w-14 text-center shrink-0`}>{meta.label}</span>
      <SourceBadge source={factor.source} note={factor.sourceNote} />
      <span className="text-[11px] text-[#999] flex-1 min-w-0 truncate">{factor.name}</span>
      <div className="flex items-center gap-3 text-[11px] font-mono shrink-0">
        <span className="text-white w-16 text-right">{factor.y1}</span>
        <span className="text-white w-16 text-right">{factor.y2}</span>
        <span className="text-white w-16 text-right">{factor.y3}</span>
      </div>
    </div>
  );
}

function OldBenefitCard({ benefit }: { benefit: OldBenefit }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4 hover:border-[#333] transition-colors">
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 pr-4">
            <div className="text-xs font-medium text-white">{benefit.name}</div>
            <div className="text-[10px] text-[#666] mt-0.5">(Neurons for ITSM)</div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex gap-2 text-[10px] font-mono">
              <span className="text-[#555]">Y1</span><span className="text-amber-400">{benefit.totals.y1}</span>
              <span className="text-[#555]">Y2</span><span className="text-emerald-400">{benefit.totals.y2}</span>
              <span className="text-[#555]">Y3</span><span className="text-emerald-400">{benefit.totals.y3}</span>
            </div>
            {expanded ? <ChevronUp size={14} className="text-[#555]" /> : <ChevronDown size={14} className="text-[#555]" />}
          </div>
        </div>
      </button>
      {expanded && (
        <div className="mt-3 pt-3 border-t border-[#1a1a1a] space-y-3">
          <p className="text-[11px] text-[#888] leading-relaxed">{benefit.description}</p>
          <div>
            <div className="flex items-center gap-2 text-[9px] text-[#555] mb-1">
              <span className="w-14 shrink-0" /><span className="w-16 shrink-0" /><span className="flex-1" />
              <span className="w-16 text-right shrink-0">Year 1</span>
              <span className="w-16 text-right shrink-0">Year 2</span>
              <span className="w-16 text-right shrink-0">Year 3</span>
            </div>
            {benefit.factors.map((f, i) => <FactorRow key={i} factor={f} />)}
            <div className="flex items-center gap-2 py-1.5 mt-1 border-t border-[#222]">
              <span className="text-[8px] px-1.5 py-0.5 rounded font-bold bg-white/5 text-white w-14 text-center shrink-0">Total</span>
              <span className="w-16 shrink-0" /><span className="flex-1" />
              <div className="flex items-center gap-3 text-[11px] font-mono font-bold shrink-0">
                <span className="text-amber-400 w-16 text-right">{benefit.totals.y1}</span>
                <span className="text-emerald-400 w-16 text-right">{benefit.totals.y2}</span>
                <span className="text-emerald-400 w-16 text-right">{benefit.totals.y3}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HybridBenefitCard({ benefit }: { benefit: HybridBenefit }) {
  const [expanded, setExpanded] = useState(true);
  const isITSM = benefit.tag === 'hybrid-itsm';
  const tagColor = isITSM ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-teal-500/10 text-teal-400 border-teal-500/20';
  const tagLabel = isITSM ? '🎫 Hybrid ITSM' : '🗺️ Service Mapping';
  const borderColor = isITSM ? 'border-blue-500/20' : 'border-teal-500/20';

  const newFactorCount = benefit.factors.filter(f => f.source === 'new').length;
  const currentFactorCount = benefit.factors.filter(f => f.source === 'current').length;

  return (
    <div className={`bg-[#111] border ${borderColor} rounded-xl p-5 space-y-4`}>
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-[10px] px-2 py-0.5 rounded border ${tagColor}`}>{tagLabel}</span>
              <span className="text-[9px] text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">✓ {currentFactorCount} current</span>
              {newFactorCount > 0 && <span className="text-[9px] text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded">✦ {newFactorCount} new</span>}
            </div>
            <h3 className="text-sm font-bold text-white">{benefit.name}</h3>
            <div className="text-[10px] text-[#666] mt-0.5">
              Powered by: {benefit.ivantiProducts.join(' + ')}
            </div>
          </div>
          <div className="flex items-center gap-3 ml-4 mt-1 shrink-0">
            <div className="text-right">
              <div className="text-[9px] text-[#555]">3-Year Total</div>
              <div className="text-base font-bold text-emerald-400">
                {(() => {
                  const vals = [benefit.totals.y1, benefit.totals.y2, benefit.totals.y3].map(v => {
                    const n = parseFloat(v.replace(/[^0-9.]/g, ''));
                    const mult = v.includes('M') ? 1000000 : v.includes('K') ? 1000 : 1;
                    return n * mult;
                  });
                  const total = vals.reduce((a, b) => a + b, 0);
                  return total >= 1000000 ? `$${(total / 1000000).toFixed(1)}M` : `$${(total / 1000).toFixed(1)}K`;
                })()}
              </div>
            </div>
            {expanded ? <ChevronUp size={14} className="text-[#555]" /> : <ChevronDown size={14} className="text-[#555]" />}
          </div>
        </div>
      </button>

      {expanded && (
        <>
          <p className="text-[11px] text-[#999] leading-relaxed">{benefit.description}</p>

          {/* Verified Ivanti Capabilities */}
          <div className="bg-[#0a0a0a] border border-blue-500/10 rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Tag size={12} className="text-blue-400" />
              <span className="text-[10px] font-semibold text-blue-400">Verified Ivanti Capabilities</span>
            </div>
            {benefit.verifiedCapabilities.map((c, i) => (
              <div key={i} className="text-[10px] text-[#888] leading-relaxed ml-4">• {c}</div>
            ))}
          </div>

          {/* Rationale */}
          <div className="bg-[#0a0a0a] border border-amber-500/10 rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Lightbulb size={12} className="text-amber-400" />
              <span className="text-[10px] font-semibold text-amber-400">Why This Benefit & Design Rationale</span>
            </div>
            <p className="text-[11px] text-[#888] leading-relaxed">{benefit.rationale}</p>
          </div>

          {/* Conservatism */}
          <div className="bg-[#0a0a0a] border border-emerald-500/10 rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Shield size={12} className="text-emerald-400" />
              <span className="text-[10px] font-semibold text-emerald-400">Conservatism & Scaling Guard</span>
            </div>
            <p className="text-[11px] text-[#888] leading-relaxed">{benefit.conservatismNote}</p>
          </div>

          {/* Source + Pain Points */}
          <div className="grid grid-cols-2 gap-3">
            {benefit.oldSourceBenefits.length > 0 && (
              <div className="bg-[#0a0a0a] rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <RefreshCw size={12} className="text-purple-400" />
                  <span className="text-[10px] font-semibold text-purple-400">Replaces Old Benefits</span>
                </div>
                {benefit.oldSourceBenefits.map((b, i) => (
                  <div key={i} className="text-[10px] text-[#777] leading-relaxed">• {b}</div>
                ))}
              </div>
            )}
            <div className={`bg-[#0a0a0a] rounded-lg p-3 ${benefit.oldSourceBenefits.length === 0 ? 'col-span-2' : ''}`}>
              <div className="text-[10px] font-semibold text-red-400 mb-1.5">Pain Points Addressed</div>
              {benefit.painPoints.map((p, i) => (
                <div key={i} className="text-[10px] text-[#777] leading-relaxed">• {p}</div>
              ))}
            </div>
          </div>

          {/* Formula with source tags */}
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-3">
            <div className="flex items-center gap-2 text-[9px] text-[#555] mb-2">
              <span className="w-14 shrink-0" /><span className="w-16 shrink-0" /><span className="flex-1" />
              <span className="w-16 text-right shrink-0">Year 1</span>
              <span className="w-16 text-right shrink-0">Year 2</span>
              <span className="w-16 text-right shrink-0">Year 3</span>
            </div>
            {benefit.factors.map((f, i) => <FactorRow key={i} factor={f} />)}
            <div className="mt-2 pt-2 border-t border-[#222]">
              <div className="text-[10px] text-[#555] font-mono mb-1">{benefit.calculation}</div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-white w-14 shrink-0">= Total</span>
                <span className="w-16 shrink-0" /><span className="flex-1" />
                <div className="flex items-center gap-3 text-sm font-mono font-bold shrink-0">
                  <span className="text-amber-400 w-16 text-right">{benefit.totals.y1}</span>
                  <span className="text-emerald-400 w-16 text-right">{benefit.totals.y2}</span>
                  <span className="text-emerald-400 w-16 text-right">{benefit.totals.y3}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ──────────── MAIN PAGE ──────────── */

export default function HybridBenefitsPage() {
  const [activeTab, setActiveTab] = useState<'hybrids' | 'service-mapping' | 'old-benefits' | 'factor-library'>('hybrids');

  const tabs = [
    { id: 'hybrids' as const, label: '🎫 Hybrid ITSM Benefits', count: hybridBenefits.filter(b => b.tag === 'hybrid-itsm').length },
    { id: 'service-mapping' as const, label: '🗺️ Service Mapping Benefits', count: hybridBenefits.filter(b => b.tag === 'service-mapping').length },
    { id: 'old-benefits' as const, label: '📋 Old Benefits (Reference)', count: oldBenefits.length },
    { id: 'factor-library' as const, label: '📊 Factor Library', count: newDriverFactors.length + newFinancialFactors.length + smDriverFactors.length + smFinancialFactors.length },
  ];

  const hybridITSM = hybridBenefits.filter(b => b.tag === 'hybrid-itsm');
  const serviceMappingBenefits = hybridBenefits.filter(b => b.tag === 'service-mapping');

  const calcTotal = (benefits: HybridBenefit[]) => {
    return benefits.reduce((sum, b) => {
      return sum + [b.totals.y1, b.totals.y2, b.totals.y3].reduce((s, v) => {
        const n = parseFloat(v.replace(/[^0-9.]/g, ''));
        const mult = v.includes('M') ? 1000000 : v.includes('K') ? 1000 : 1;
        return s + n * mult;
      }, 0);
    }, 0);
  };

  const hybridTotal = calcTotal(hybridITSM);
  const smTotal = calcTotal(serviceMappingBenefits);

  // Count new vs current factors across all benefits
  const allFactors = hybridBenefits.flatMap(b => b.factors);
  const currentCount = allFactors.filter(f => f.source === 'current').length;
  const newCount = allFactors.filter(f => f.source === 'new').length;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/value-engineering/projects" className="text-[#555] hover:text-white transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <span className="text-xs text-[#555]">Projects /</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Layers size={24} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Hybrid Benefits & Service Mapping</h1>
            <p className="text-sm text-[#666]">Conservative ROI — verified Ivanti capabilities, tagged factor sources</p>
          </div>
        </div>
        <div className="text-right space-y-1">
          <div>
            <span className="text-[10px] text-[#555]">ITSM 3yr: </span>
            <span className="text-sm font-bold text-blue-400">${(hybridTotal/1000).toFixed(0)}K</span>
          </div>
          <div>
            <span className="text-[10px] text-[#555]">SM 3yr: </span>
            <span className="text-sm font-bold text-teal-400">${(smTotal/1000).toFixed(0)}K</span>
          </div>
          <div className="flex items-center gap-2 justify-end mt-1">
            <span className="text-[9px] text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">✓ {currentCount} current factors</span>
            <span className="text-[9px] text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded">✦ {newCount} new factors</span>
          </div>
        </div>
      </div>

      {/* Design Philosophy */}
      <div className="bg-[#111] border border-amber-500/15 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-amber-400 mb-2 flex items-center gap-2"><Info size={14} />Design Philosophy</h2>
        <div className="grid grid-cols-3 gap-4 text-[11px] text-[#888] leading-relaxed">
          <div>
            <div className="text-xs font-semibold text-white mb-1">✓ CURRENT = Your Factor Libraries</div>
            Green-tagged factors come from your provided old benefit library, new factor assumptions (Slide 1), or Service Mapping factor assumptions. No modifications — used as-is.
          </div>
          <div>
            <div className="text-xs font-semibold text-white mb-1">✦ NEW = Created When Required</div>
            Orange-tagged factors are improvement percentages we had to create because the old library used aggressive assumptions (50-80%). Each is conservative (2-15%) with a rationale for the specific number.
          </div>
          <div>
            <div className="text-xs font-semibold text-white mb-1">Verified Against Ivanti Products</div>
            Every capability is mapped to a specific Ivanti product module from the reference guide. No generic claims — only what Neurons for ITSM, Service Mapping, AI for ITSM, Digital Assistant, and ITSM LoB actually do.
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#222] pb-2 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 rounded-t-lg text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id ? 'bg-[#111] text-white border border-b-0 border-[#333]' : 'text-[#666] hover:text-white'
            }`}
          >
            {tab.label} <span className="text-[10px] opacity-60">({tab.count})</span>
          </button>
        ))}
      </div>

      {activeTab === 'hybrids' && (
        <div className="space-y-4">
          <div className="text-xs text-[#666]">5 hybrid ITSM benefits combining old benefit structures with new factor assumptions. Each capability verified against Ivanti product documentation.</div>
          {hybridITSM.map(b => <HybridBenefitCard key={b.id} benefit={b} />)}
        </div>
      )}

      {activeTab === 'service-mapping' && (
        <div className="space-y-4">
          <div className="text-xs text-[#666]">5 Service Mapping benefits from the deck, reconstructed with conservative assumptions and factor library anchors.</div>
          {serviceMappingBenefits.map(b => <HybridBenefitCard key={b.id} benefit={b} />)}
        </div>
      )}

      {activeTab === 'old-benefits' && (
        <div className="space-y-3">
          <div className="text-xs text-[#666]">6 original ITSM benefits. Click to expand formula details. All factors tagged as ✓ CURRENT (from old benefit library).</div>
          {oldBenefits.map(b => <OldBenefitCard key={b.id} benefit={b} />)}
        </div>
      )}

      {activeTab === 'factor-library' && (
        <div className="space-y-4">
          <div className="text-xs text-[#666]">Complete factor libraries as provided. All tagged ✓ CURRENT.</div>

          <div className="bg-[#111] border border-blue-500/20 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-blue-400 mb-3">New Driver Factor Assumptions</h3>
            <div className="space-y-1.5">
              {newDriverFactors.map((f, i) => (
                <div key={i} className="flex items-center justify-between py-1 border-b border-[#1a1a1a] last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] px-1.5 py-0.5 rounded font-bold bg-green-500/10 text-green-500 border border-green-500/15">✓ CURRENT</span>
                    <span className="text-[11px] text-[#999]">{f.name}</span>
                  </div>
                  <span className="text-[11px] font-mono text-white">{f.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111] border border-emerald-500/20 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-emerald-400 mb-3">New Financial Factor Assumptions</h3>
            <div className="space-y-1.5">
              {newFinancialFactors.map((f, i) => (
                <div key={i} className="flex items-center justify-between py-1 border-b border-[#1a1a1a] last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] px-1.5 py-0.5 rounded font-bold bg-green-500/10 text-green-500 border border-green-500/15">✓ CURRENT</span>
                    <span className="text-[11px] text-[#999]">{f.name}</span>
                  </div>
                  <span className="text-[11px] font-mono text-white">{f.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111] border border-teal-500/20 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-teal-400 mb-3">Service Mapping Factor Assumptions</h3>
            <div className="space-y-1.5">
              {[...smDriverFactors, ...smFinancialFactors].map((f, i) => (
                <div key={i} className="flex items-center justify-between py-1 border-b border-[#1a1a1a] last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] px-1.5 py-0.5 rounded font-bold bg-green-500/10 text-green-500 border border-green-500/15">✓ CURRENT</span>
                    <span className={`text-[8px] px-1 py-0.5 rounded ${f.category === 'driver' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                      {f.category === 'driver' ? 'Driver' : 'Financial'}
                    </span>
                    <span className="text-[11px] text-[#999]">{f.name}</span>
                  </div>
                  <span className="text-[11px] font-mono text-white">{f.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
