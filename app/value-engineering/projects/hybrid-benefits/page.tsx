'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, ChevronUp, Lightbulb, Zap, ArrowRight, Shield, Map, Layers, RefreshCw, Info, Calculator } from 'lucide-react';

/* ────────────────────────────────────────────
   DATA: Old Benefits, New Factors, Hybrids, Service Mapping
   ──────────────────────────────────────────── */

type Factor = {
  name: string;
  type: 'driver' | 'improvement' | 'financial' | 'ramp';
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

const oldBenefits: OldBenefit[] = [
  {
    id: 'old-change-mgmt',
    name: 'Reduce core business service disruptions through ability to modernize your change manage process',
    description: 'Reduce core business service disruptions (planned and unplanned) by up to 70% with more successful changes informed by an accurate CMDB.',
    capabilities: ['Simplify, automate, and accelerate complex change processes', 'Accelerate change management using dynamic change approval policies'],
    painPoints: ['Manual and offline processes for change management', 'Lack of documented change management processes', 'Lack of visibility and reporting through dashboards and analytics'],
    factors: [
      { name: 'Annual outages', type: 'driver', value: '3.96', y1: '3.96', y2: '3.96', y3: '3.96' },
      { name: '% reduction in number of outage impacts', type: 'improvement', value: '50%', y1: '50%', y2: '50%', y3: '50%' },
      { name: 'Lost productivity per outage due to infrastructure or application change', type: 'financial', value: '$10,600', y1: '$10.6K', y2: '$10.6K', y3: '$10.6K' },
      { name: 'Benefit Ramp', type: 'ramp', value: '60/100/100%', y1: '60%', y2: '100%', y3: '100%' },
    ],
    totals: { y1: '$12.5K', y2: '$20.9K', y3: '$20.9K' },
  },
  {
    id: 'old-onboarding',
    name: 'Improve New Hire Onboarding Experience through reduced handle time',
    description: 'Before the start date of the employee through the first 90 days, enable coordination between all departments that are part of the onboarding process.',
    capabilities: ['Streamlined process across the onboarding lifecycle', 'Organization visibility across key stakeholders', 'Dependency task creation via automated workflows'],
    painPoints: ['Manual processes lead to errors and mistakes', 'Lack of end-to-end approach over multiple systems and departments', 'Poor day 1 employee experience could lead to turnover'],
    factors: [
      { name: 'Hours spent performing onboarding activities (per year)', type: 'driver', value: '2,200 H', y1: '2.2K', y2: '2.2K', y3: '2.2K' },
      { name: '% reduction in time spent on onboarding activities', type: 'improvement', value: '20%', y1: '20%', y2: '20%', y3: '20%' },
      { name: 'Revenue impact per FTE per hour', type: 'financial', value: '$120', y1: '$120', y2: '$120', y3: '$120' },
      { name: 'Benefit Ramp', type: 'ramp', value: '60/100/100%', y1: '60%', y2: '100%', y3: '100%' },
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
      { name: 'Annual hours saved from improved service requests management', type: 'driver', value: '360 H', y1: '360', y2: '360', y3: '360' },
      { name: '% of saved hours which translate to business user productivity', type: 'improvement', value: '80%', y1: '80%', y2: '80%', y3: '80%' },
      { name: 'Revenue impact per FTE per hour', type: 'financial', value: '$120', y1: '$120', y2: '$120', y3: '$120' },
      { name: 'Benefit Ramp', type: 'ramp', value: '60/100/100%', y1: '60%', y2: '100%', y3: '100%' },
    ],
    totals: { y1: '$20.7K', y2: '$34.6K', y3: '$34.6K' },
  },
  {
    id: 'old-reduced-incidents',
    name: 'Improve IT efficiencies through reduced incidents volume',
    description: 'Improve incident management procedures with knowledge base articles, automated workflows to reduce manual processes, and increased efficiency.',
    capabilities: ['Improved service through relevant information, insights and analytics', 'Improved employee satisfaction through higher first call resolution and MTTR', 'Improve agent resource bandwidth through ticket deflection'],
    painPoints: ['Relieve staff from manual, mundane, repetitive tasks', 'Low staff morale, which could lead to employee turnover and higher costs', 'Low NPS and employee SAT scores'],
    factors: [
      { name: 'Incident tickets per year', type: 'driver', value: '9,000', y1: '9K', y2: '9K', y3: '9K' },
      { name: '% reduction in incidents submitted', type: 'improvement', value: '50%', y1: '50%', y2: '50%', y3: '50%' },
      { name: 'Average cost per incident', type: 'financial', value: '$3.75', y1: '$3.75', y2: '$3.75', y3: '$3.75' },
      { name: 'Benefit Ramp', type: 'ramp', value: '60/100/100%', y1: '60%', y2: '100%', y3: '100%' },
    ],
    totals: { y1: '$10.1K', y2: '$16.9K', y3: '$16.9K' },
  },
  {
    id: 'old-service-request',
    name: 'Reduce service request inefficiencies through automation and workflow',
    description: 'Consolidated and integrated processes to reduce the number of touches. Automation and workflows keep an organization connected to all the activity.',
    capabilities: ['Improve service task lifecycle management', 'Leverage workflows to identify, track, and resolve high impact service requests', 'Drive adoption with one channel for all service request offerings'],
    painPoints: ['Siloed operations, disparate automation capabilities', 'Non-integrated solutions leading to unnecessary resource overhead', 'Missed SLAs'],
    factors: [
      { name: 'Annual number of access or software service requests currently addressed', type: 'driver', value: '1,100', y1: '1.1K', y2: '1.1K', y3: '1.1K' },
      { name: '% reduction of access or software service requests handle time', type: 'improvement', value: '80%', y1: '80%', y2: '80%', y3: '80%' },
      { name: 'Average cost per service request', type: 'financial', value: '$12.50', y1: '$12.5', y2: '$12.5', y3: '$12.5' },
      { name: 'Benefit Ramp', type: 'ramp', value: '60/100/100%', y1: '60%', y2: '100%', y3: '100%' },
    ],
    totals: { y1: '$6.5K', y2: '$10.8K', y3: '$10.8K' },
  },
  {
    id: 'old-user-productivity',
    name: 'Improve business user productivity through decreased incident volume',
    description: 'This benefit helps the employee and organization to remain productive and avoid multiple touches with support teams.',
    capabilities: ['Reduce MTTR and satisfy customers with consistent IT solutions', 'Avoid 30% of ticket volume through self-service activities', 'Deflection of incidents through automation or self-service'],
    painPoints: ['Long hold times for support affect business user productivity', 'Poor support experiences result in negative NPS and CSAT scores'],
    factors: [
      { name: 'Incident tickets per year', type: 'driver', value: '9,000', y1: '9K', y2: '9K', y3: '9K' },
      { name: '% business user hours saved from decreased incident volume', type: 'improvement', value: '10%', y1: '10%', y2: '10%', y3: '10%' },
      { name: 'Revenue impact per FTE per hour', type: 'financial', value: '$120', y1: '$120', y2: '$120', y3: '$120' },
      { name: 'Benefit Ramp', type: 'ramp', value: '60/100/100%', y1: '60%', y2: '100%', y3: '100%' },
    ],
    totals: { y1: '$64.8K', y2: '$108K', y3: '$108K' },
  },
];

/* ── New Factor Assumptions ── */
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

/* ── Service Mapping Factor Assumptions ── */
const smDriverFactors: FactorAssumption[] = [
  { name: 'Annual Manufacturing Revenue Impact per outage', value: '$25,000', category: 'driver' },
  { name: 'Annual number of hours spent on impact management resolution', value: '120 H', category: 'driver' },
  { name: 'Annual outages (0.33/month × 12)', value: '3.96', category: 'driver' },
  { name: 'Potential revenue hours impacted from cyber or virus service interruption event', value: '2,500 H', category: 'driver' },
];

const smFinancialFactors: FactorAssumption[] = [
  { name: 'Estimated Total Organizational Impact Cost (Revenue impact × Employees)', value: '$1,080,000', category: 'financial' },
  { name: 'Revenue impact per FTE per hour', value: '$120', category: 'financial' },
  { name: 'Lost productivity per outage (9,000 × $120 × 0.04 hrs)', value: '$43,200', category: 'financial' },
  { name: 'Cost per device replacement', value: '$10', category: 'financial' },
];

/* ── Hybrid ITSM Benefits ── */
type HybridBenefit = {
  id: string;
  name: string;
  tag: 'hybrid-itsm' | 'service-mapping';
  rationale: string;
  conservatismNote: string;
  description: string;
  oldSourceBenefits: string[];
  newFactorsUsed: string[];
  capabilities: string[];
  painPoints: string[];
  factors: Factor[];
  calculation: string;
  totals: { y1: string; y2: string; y3: string };
};

const hybridBenefits: HybridBenefit[] = [
  {
    id: 'hybrid-1',
    name: 'Reduce IT Service Desk Costs Through Intelligent Ticket Automation',
    tag: 'hybrid-itsm',
    rationale: 'The old environment valued incidents at $3.75/ticket — far below industry benchmarks. The new factor library provides $26/ticket (AHT cost per incident), which is realistic for a blended agent rate. However, the old 50% reduction assumption was aggressive. We dial improvement down to 12% — a conservative but achievable number with AI categorization, knowledge suggestions, and workflow automation. This produces a realistic, defensible ROI that scales linearly without dramatic jumps.',
    conservatismNote: 'At 12% improvement, doubling the factor only doubles the result — no exponential scaling. Even at 8% improvement, the benefit remains meaningful ($24.9K/yr). The $26/ticket is an established cost benchmark, not an assumption.',
    description: 'Leverage Neurons for ITSM intelligent automation — AI categorization, knowledge article suggestions, and workflow-driven routing — to reduce the volume and handling cost of IT service desk tickets. Uses the realistic $26/ticket AHT cost with a conservative 12% ticket reduction.',
    oldSourceBenefits: ['Improve IT efficiencies through reduced incidents volume (Old #4)', 'Reduce service request inefficiencies through automation and workflow (Old #5)'],
    newFactorsUsed: ['Annual Hours Handling Tickets (30,000 H)', 'AHT cost per incident ($26)', 'Annual Cost of Ticket Handling ($1,563,232)'],
    capabilities: ['AI-powered ticket categorization and routing', 'Knowledge article auto-suggestion at ticket creation', 'Automated workflows for common request types', 'Self-service deflection through guided resolutions'],
    painPoints: ['High ticket volume consuming agent capacity', 'Inconsistent ticket categorization leading to rework', 'Manual triage adding 5-10 minutes per ticket'],
    factors: [
      { name: 'Annual Hours Handling Tickets', type: 'driver', value: '30,000 H', y1: '30,000', y2: '30,000', y3: '30,000' },
      { name: '% reduction in ticket handling hours through automation', type: 'improvement', value: '12%', y1: '12%', y2: '12%', y3: '12%' },
      { name: 'IT hourly rate', type: 'financial', value: '$52', y1: '$52', y2: '$52', y3: '$52' },
      { name: 'Benefit Ramp', type: 'ramp', value: '60/100/100%', y1: '60%', y2: '100%', y3: '100%' },
    ],
    calculation: '30,000 H × 12% × $52/hr × Ramp',
    totals: { y1: '$112.3K', y2: '$187.2K', y3: '$187.2K' },
  },
  {
    id: 'hybrid-2',
    name: 'Recover Employee Productivity Lost to IT Downtime and Support Wait Times',
    tag: 'hybrid-itsm',
    rationale: 'The old benefit #6 used 9K tickets × 10% × $120/hr — mixing ticket counts with per-hour revenue impact, which creates scaling risk (if tickets double, benefit doubles unrealistically). The new "Addressable Employee Downtime" factor (33,306 H) is a direct measurement of actual hours lost, not a ticket count proxy. We apply a conservative 5% recovery rate — acknowledging that ITSM improvements capture only a fraction of total organizational downtime. We use $52/hr IT rate (not $120 FTE revenue impact) to ground the financial factor in actual cost, not theoretical revenue.',
    conservatismNote: 'Using 5% of 33,306 hours (1,665 hours recovered) is deliberately modest. Even if downtime is underreported, the low percentage keeps the benefit stable. Using IT hourly rate ($52) instead of revenue impact ($120) avoids overstating the recoverable value.',
    description: 'Reduce addressable employee downtime through faster incident resolution, proactive monitoring, and self-service capabilities. Measures actual productivity hours returned to the organization when IT issues are resolved faster.',
    oldSourceBenefits: ['Improve business user productivity through decreased incident volume (Old #6)', 'Increase business user productivity through automation workflow (Old #3)'],
    newFactorsUsed: ['Addressable Employee Downtime (33,306 H)', 'IT hourly rate ($52)'],
    capabilities: ['Proactive incident detection before user reports', 'Reduced MTTR through AI-assisted diagnostics', 'Self-service resolution for common downtime causes', 'Real-time status communication to affected users'],
    painPoints: ['Employees losing productive hours waiting for IT resolution', 'No visibility into how much downtime IT issues actually cause', 'Reactive support model means users wait instead of working'],
    factors: [
      { name: 'Addressable Employee Downtime', type: 'driver', value: '33,306 H', y1: '33,306', y2: '33,306', y3: '33,306' },
      { name: '% of downtime hours recovered through ITSM improvements', type: 'improvement', value: '5%', y1: '5%', y2: '5%', y3: '5%' },
      { name: 'IT hourly rate', type: 'financial', value: '$52', y1: '$52', y2: '$52', y3: '$52' },
      { name: 'Benefit Ramp', type: 'ramp', value: '60/100/100%', y1: '60%', y2: '100%', y3: '100%' },
    ],
    calculation: '33,306 H × 5% × $52/hr × Ramp',
    totals: { y1: '$51.9K', y2: '$86.6K', y3: '$86.6K' },
  },
  {
    id: 'hybrid-3',
    name: 'Prevent Service Disruptions Through Modern Change Management',
    tag: 'hybrid-itsm',
    rationale: 'The old benefit used $10.6K lost productivity per outage. The new factor library calculates $43,200 per outage (9,000 employees × $120/hr × 0.04 hrs average impact). The old 50% improvement was too aggressive — we reduce to 15%, reflecting that change management improvements prevent roughly 1 in 7 outages. With only ~4 outages/year, even small factor changes don\'t create wild ROI swings. The math: 3.96 outages × 15% prevented = 0.594 outages prevented × $43,200 = ~$25.7K. Conservative, credible, and easy to explain.',
    conservatismNote: 'At 3.96 annual outages, this benefit is naturally capped — you can\'t prevent more outages than exist. The 15% improvement means preventing ~0.6 outages per year, which is believable. Even if outages increase to 6/year, the benefit only reaches $38.9K — no exponential scaling.',
    description: 'Leverage accurate CMDB data and automated change workflows to reduce the number of change-related service disruptions. Uses the corrected organizational impact cost per outage with a conservative prevention rate.',
    oldSourceBenefits: ['Reduce core business service disruptions through change management (Old #1)'],
    newFactorsUsed: ['Annual outages (3.96)', 'Lost productivity per outage ($43,200 — from 9,000 emps × $120 × 0.04 hrs)'],
    capabilities: ['CMDB-informed change risk assessment', 'Automated change approval workflows', 'Post-implementation verification', 'Change collision detection and scheduling'],
    painPoints: ['Changes causing unplanned outages', 'No visibility into downstream dependencies', 'Manual change processes missing risk signals'],
    factors: [
      { name: 'Annual outages', type: 'driver', value: '3.96', y1: '3.96', y2: '3.96', y3: '3.96' },
      { name: '% of outages prevented through improved change management', type: 'improvement', value: '15%', y1: '15%', y2: '15%', y3: '15%' },
      { name: 'Lost productivity per outage', type: 'financial', value: '$43,200', y1: '$43,200', y2: '$43,200', y3: '$43,200' },
      { name: 'Benefit Ramp', type: 'ramp', value: '60/100/100%', y1: '60%', y2: '100%', y3: '100%' },
    ],
    calculation: '3.96 × 15% × $43,200 × Ramp',
    totals: { y1: '$15.4K', y2: '$25.7K', y3: '$25.7K' },
  },
  {
    id: 'hybrid-4',
    name: 'Streamline Employee Lifecycle Management (Onboarding + Offboarding)',
    tag: 'hybrid-itsm',
    rationale: 'The old onboarding benefit used 2,200 hours × 20% × $120/hr. The new factors give us 500 hours for offboarding — combining them to 2,700 hours for the full employee lifecycle is more complete. We reduce improvement to 15% (vs 20%) and use $52/hr IT rate (vs $120 revenue impact). The old benefit used FTE revenue impact ($120) as if every saved onboarding hour translates to revenue — it doesn\'t. IT staff performing onboarding are paid $52/hr; that\'s the actual savings. This gives a more honest, defensible number that customers won\'t push back on.',
    conservatismNote: 'Using $52/hr instead of $120/hr cuts the benefit by 57% — but it\'s the real cost being saved. If challenged, you can justify every dollar. The 15% improvement on 2,700 hours = 405 hours saved = ~7.8 hours/week, which is highly believable for workflow automation.',
    description: 'Automate and streamline the full employee lifecycle — from new hire onboarding through offboarding — using ITSM workflows. Combines onboarding and offboarding hours with a realistic IT cost rate.',
    oldSourceBenefits: ['Improve New Hire Onboarding Experience through reduced handle time (Old #2)'],
    newFactorsUsed: ['Annual IT & HR hours spent offboarding employees (500 H)', 'IT hourly rate ($52)', 'Fully loaded IT FTE Annual Salary ($89,000)'],
    capabilities: ['Automated onboarding task orchestration across departments', 'Day-zero provisioning workflows', 'Offboarding checklists with automated deprovisioning', 'Cross-department visibility for HR, IT, and managers'],
    painPoints: ['Manual onboarding taking days instead of hours', 'Offboarding gaps leaving orphaned accounts and access', 'No single system of record for employee lifecycle tasks'],
    factors: [
      { name: 'Annual hours spent on onboarding + offboarding', type: 'driver', value: '2,700 H', y1: '2,700', y2: '2,700', y3: '2,700' },
      { name: '% reduction in lifecycle management time through automation', type: 'improvement', value: '15%', y1: '15%', y2: '15%', y3: '15%' },
      { name: 'IT hourly rate', type: 'financial', value: '$52', y1: '$52', y2: '$52', y3: '$52' },
      { name: 'Benefit Ramp', type: 'ramp', value: '60/100/100%', y1: '60%', y2: '100%', y3: '100%' },
    ],
    calculation: '2,700 H × 15% × $52/hr × Ramp',
    totals: { y1: '$12.6K', y2: '$21.1K', y3: '$21.1K' },
  },
  {
    id: 'hybrid-5',
    name: 'Increase Self-Service Adoption to Deflect Tickets and Reduce Agent Load',
    tag: 'hybrid-itsm',
    rationale: 'The old benefits #3 and #5 used high improvement percentages (80%) against small driver numbers (360 hours, 1,100 requests). The new factors provide "Annual Hours Handling Tickets" (30,000 H) and "$26/ticket" — much larger, more realistic base numbers. We apply a conservative 8% self-service deflection rate. This is well below the 30% commonly cited by vendors but reflects real-world adoption curves. The benefit: 30,000 × 8% = 2,400 hours deflected × $52/hr = $124.8K at full ramp. Scales linearly and doesn\'t produce shocking jumps.',
    conservatismNote: '8% deflection is intentionally below industry claims. If self-service adoption exceeds expectations and reaches 15%, the benefit grows to $234K — a nice upside story. But the baseline assumption is conservative enough to survive scrutiny.',
    description: 'Drive ticket deflection through self-service portal, knowledge base optimization, and automated fulfillment workflows. Measures actual agent hours freed when users resolve issues independently.',
    oldSourceBenefits: ['Increase business user productivity through automation workflow (Old #3)', 'Reduce service request inefficiencies through automation and workflow (Old #5)'],
    newFactorsUsed: ['Annual Hours Handling Tickets (30,000 H)', 'IT hourly rate ($52)', 'Average IT support cost per ticket ($26)'],
    capabilities: ['AI-powered self-service portal with guided resolutions', 'Knowledge base with contextual article suggestions', 'Automated software provisioning and access requests', 'Omnichannel self-service (portal, chat, mobile)'],
    painPoints: ['Agents handling routine, repeatable requests manually', 'Low self-service adoption due to poor portal experience', 'Knowledge base exists but is underutilized and outdated'],
    factors: [
      { name: 'Annual Hours Handling Tickets', type: 'driver', value: '30,000 H', y1: '30,000', y2: '30,000', y3: '30,000' },
      { name: '% of handling hours deflected through self-service', type: 'improvement', value: '8%', y1: '8%', y2: '8%', y3: '8%' },
      { name: 'IT hourly rate', type: 'financial', value: '$52', y1: '$52', y2: '$52', y3: '$52' },
      { name: 'Benefit Ramp', type: 'ramp', value: '60/100/100%', y1: '60%', y2: '100%', y3: '100%' },
    ],
    calculation: '30,000 H × 8% × $52/hr × Ramp',
    totals: { y1: '$74.9K', y2: '$124.8K', y3: '$124.8K' },
  },

  /* ── Service Mapping Benefits ── */
  {
    id: 'sm-1',
    name: 'Reduce Manufacturing Downtime Through Application Dependency Visibility',
    tag: 'service-mapping',
    rationale: 'Directly from the Service Mapping deck. Manufacturing environments lose revenue when IT outages hit factory systems. Service mapping provides visibility into application dependencies so teams can isolate and resolve issues faster. With only 3.96 outages/year and $25K impact per outage, the total exposure is ~$99K. Applying a conservative 12% reduction (vs the deck\'s implied higher number) keeps the benefit grounded — you\'re preventing about half an outage\'s worth of impact per year.',
    conservatismNote: 'At 3.96 outages × 12% = 0.47 outages prevented. Even rounding up, you\'re claiming less than one prevented outage per year — easy to defend. The $25K per outage is a customer-provided or industry benchmark, not our assumption.',
    description: 'Use application dependency mapping to quickly identify root causes and restore service to impacted manufacturing environments. Reduces both the frequency and duration of technology-related factory downtime.',
    oldSourceBenefits: [],
    newFactorsUsed: ['Annual Manufacturing Revenue Impact per outage ($25,000)', 'Annual outages (3.96)'],
    capabilities: ['Visual application dependency maps for manufacturing systems', 'Real-time impact analysis during outages', 'Root cause identification across infrastructure layers', 'Proactive bottleneck and single-point-of-failure detection'],
    painPoints: ['Idle time affects productivity and morale', 'Lack of visibility & reporting creates extended resolution time', 'Undocumented application & infrastructure details'],
    factors: [
      { name: 'Annual outages', type: 'driver', value: '3.96', y1: '3.96', y2: '3.96', y3: '3.96' },
      { name: '% reduction in outage impact through dependency visibility', type: 'improvement', value: '12%', y1: '12%', y2: '12%', y3: '12%' },
      { name: 'Annual Manufacturing Revenue Impact per outage', type: 'financial', value: '$25,000', y1: '$25,000', y2: '$25,000', y3: '$25,000' },
      { name: 'Benefit Ramp', type: 'ramp', value: '100/100/100%', y1: '100%', y2: '100%', y3: '100%' },
    ],
    calculation: '3.96 × 12% × $25,000 × Ramp',
    totals: { y1: '$11.9K', y2: '$11.9K', y3: '$11.9K' },
  },
  {
    id: 'sm-2',
    name: 'Reduce Cyber Incident Impact Through Service-Aware Response',
    tag: 'service-mapping',
    rationale: 'The deck listed this at $2.59M — an extremely large number. We reconstruct it conservatively: 2,500 potential impact hours from a cyber event × the organizational impact cost. Rather than using the full $1,080,000 organizational impact, we apply a 5% containment improvement (service mapping helps you identify which services are affected 5% faster, reducing blast radius). This grounds the benefit in a defensible improvement rate rather than the full exposure number.',
    conservatismNote: 'The deck\'s $2.59M figure implies near-total prevention of a major breach impact — unrealistic. Our 5% improvement on $1,080,000 organizational cost = $54K is a fraction of that but defensible. If the customer has stronger breach data, the number can be adjusted up with evidence.',
    description: 'Service mapping provides service-relevant insights to respond to cyber incidents faster by understanding which business services are impacted, enabling targeted containment and faster recovery.',
    oldSourceBenefits: [],
    newFactorsUsed: ['Estimated Total Organizational Impact Cost ($1,080,000)', 'Potential revenue hours impacted from cyber event (2,500 H)', 'Annual Breach Detection & Escalation Cost ($1,465,200)'],
    capabilities: ['Service-to-infrastructure impact mapping during incidents', 'Automated blast radius assessment', 'Priority-based recovery sequencing', 'Business service health dashboards during events'],
    painPoints: ['No visibility into which services are impacted during an attack', 'Slow containment due to unknown dependencies', 'Recovery prioritization based on guesswork, not data'],
    factors: [
      { name: 'Estimated Total Organizational Impact Cost', type: 'driver', value: '$1,080,000', y1: '$1,080,000', y2: '$1,080,000', y3: '$1,080,000' },
      { name: '% impact reduction through faster service-aware containment', type: 'improvement', value: '5%', y1: '5%', y2: '5%', y3: '5%' },
      { name: 'Benefit Ramp', type: 'ramp', value: '60/100/100%', y1: '60%', y2: '100%', y3: '100%' },
    ],
    calculation: '$1,080,000 × 5% × Ramp',
    totals: { y1: '$32.4K', y2: '$54.0K', y3: '$54.0K' },
  },
  {
    id: 'sm-3',
    name: 'Improve Change Success Rate with Dependency-Aware Impact Analysis',
    tag: 'service-mapping',
    rationale: 'This maps directly to the deck\'s "Improve Change Management Operations with accurate data" benefit ($51.3K at 60% ramp). We reconstruct it using: impact management resolution hours (120/yr) + outage prevention through better change analysis. The key insight is that service mapping gives change managers visibility into what breaks when something changes — preventing cascading failures. We use the new $43,200/outage figure with a conservative 10% prevention rate.',
    conservatismNote: 'At 3.96 outages × 10% = 0.396 outages prevented × $43,200 = $17.1K from outage prevention. Plus 120 hrs × 15% efficiency × $52/hr = $936 in resolution efficiency. Combined ~$18K at full ramp. Conservative compared to deck\'s $51.3K — we can build up from here if the customer has stronger data.',
    description: 'Use service dependency maps to understand the full impact of proposed changes before implementation. Reduces change-related outages and accelerates impact assessment during change planning.',
    oldSourceBenefits: [],
    newFactorsUsed: ['Annual outages (3.96)', 'Lost productivity per outage ($43,200)', 'Annual hours on impact management resolution (120 H)', 'IT hourly rate ($52)'],
    capabilities: ['Dependency-aware change impact assessment', 'Visual service maps showing change blast radius', 'Stakeholder identification for change approval', 'Post-change service health validation'],
    painPoints: ['Changes causing unexpected downstream failures', 'Manual impact assessment missing hidden dependencies', 'Change Advisory Board lacking accurate dependency data'],
    factors: [
      { name: 'Annual outages', type: 'driver', value: '3.96', y1: '3.96', y2: '3.96', y3: '3.96' },
      { name: '% of outages prevented through dependency-aware changes', type: 'improvement', value: '10%', y1: '10%', y2: '10%', y3: '10%' },
      { name: 'Lost productivity per outage', type: 'financial', value: '$43,200', y1: '$43,200', y2: '$43,200', y3: '$43,200' },
      { name: 'Benefit Ramp', type: 'ramp', value: '60/100/100%', y1: '60%', y2: '100%', y3: '100%' },
    ],
    calculation: '3.96 × 10% × $43,200 × Ramp',
    totals: { y1: '$10.3K', y2: '$17.1K', y3: '$17.1K' },
  },
  {
    id: 'sm-4',
    name: 'Reduce Business User Downtime Through Proactive Service Health Monitoring',
    tag: 'service-mapping',
    rationale: 'The deck\'s "Reduce business user impact downtime" benefit ($11.5K) is modest because it uses small driver numbers. We anchor to Addressable Employee Downtime (33,306 H) from the new factors — a much larger, measured driver — and apply a tiny 2% improvement. Service mapping enables proactive detection of degraded services before they become full outages. At 2%, we\'re claiming to recover 666 hours of downtime per year — about 2.6 hours per business day across the whole organization. Very conservative.',
    conservatismNote: '2% of 33,306 hours = 666 hours. For an organization with 9,000 employees, that\'s 0.07 hours (4.4 minutes) saved per employee per year. Almost impossibly conservative — leaves significant upside room.',
    description: 'Leverage service mapping to detect degrading service health before it impacts business users. Proactive monitoring of service dependencies enables faster response and reduced total downtime.',
    oldSourceBenefits: [],
    newFactorsUsed: ['Addressable Employee Downtime (33,306 H)', 'IT hourly rate ($52)'],
    capabilities: ['Service health dashboards with dependency awareness', 'Proactive alerting when upstream services degrade', 'Automated impact assessment for developing incidents', 'Business service availability trending and reporting'],
    painPoints: ['Users reporting outages before IT detects them', 'No understanding of which services depend on which infrastructure', 'Reactive monitoring missing slow degradation patterns'],
    factors: [
      { name: 'Addressable Employee Downtime', type: 'driver', value: '33,306 H', y1: '33,306', y2: '33,306', y3: '33,306' },
      { name: '% of downtime reduced through proactive service monitoring', type: 'improvement', value: '2%', y1: '2%', y2: '2%', y3: '2%' },
      { name: 'IT hourly rate', type: 'financial', value: '$52', y1: '$52', y2: '$52', y3: '$52' },
      { name: 'Benefit Ramp', type: 'ramp', value: '100/100/100%', y1: '100%', y2: '100%', y3: '100%' },
    ],
    calculation: '33,306 H × 2% × $52/hr × Ramp',
    totals: { y1: '$34.6K', y2: '$34.6K', y3: '$34.6K' },
  },
  {
    id: 'sm-5',
    name: 'Prevent Revenue Loss from Cyber or Virus Service Interruption Events',
    tag: 'service-mapping',
    rationale: 'The deck lists this at $12.5K (same as manufacturing). We use the 2,500 potential impact hours from cyber/virus events and apply the $120/hr revenue impact with a tiny 3% prevention rate. Service mapping helps you understand which revenue-generating services are at risk and prioritize protection and recovery. At 3%, we\'re claiming that service mapping visibility prevents $9K of the $300K total exposure — extremely conservative, but the benefit exists regardless of scale.',
    conservatismNote: '3% of (2,500 H × $120) = $9K. The full exposure is $300K; we\'re claiming 3%. This is deliberately low to avoid the "you\'re claiming to prevent a breach" objection. We\'re saying service mapping helps you respond 3% faster — not prevent the event entirely.',
    description: 'Service mapping visibility enables faster identification and protection of revenue-critical services during cyber or virus interruption events. Measures revenue preserved through faster, targeted response.',
    oldSourceBenefits: [],
    newFactorsUsed: ['Potential revenue hours impacted from cyber/virus event (2,500 H)', 'Revenue impact per FTE per hour ($120)'],
    capabilities: ['Revenue-critical service identification and mapping', 'Prioritized recovery based on business impact', 'Pre-incident playbook generation from service maps', 'Service-aware incident response orchestration'],
    painPoints: ['No visibility into which services generate revenue', 'Recovery prioritization based on gut feel, not data', 'Lengthy post-incident triage to understand business impact'],
    factors: [
      { name: 'Potential revenue hours impacted from cyber/virus event', type: 'driver', value: '2,500 H', y1: '2,500', y2: '2,500', y3: '2,500' },
      { name: '% of revenue impact prevented through service mapping response', type: 'improvement', value: '3%', y1: '3%', y2: '3%', y3: '3%' },
      { name: 'Revenue impact per FTE per hour', type: 'financial', value: '$120', y1: '$120', y2: '$120', y3: '$120' },
      { name: 'Benefit Ramp', type: 'ramp', value: '100/100/100%', y1: '100%', y2: '100%', y3: '100%' },
    ],
    calculation: '2,500 H × 3% × $120/hr × Ramp',
    totals: { y1: '$9.0K', y2: '$9.0K', y3: '$9.0K' },
  },
];

/* ──────────── UI COMPONENTS ──────────── */

const factorTypeColors: Record<string, { bg: string; text: string; label: string }> = {
  driver: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'Driver' },
  improvement: { bg: 'bg-amber-500/10', text: 'text-amber-400', label: 'Improvement' },
  financial: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'Financial' },
  ramp: { bg: 'bg-purple-500/10', text: 'text-purple-400', label: 'Ramp' },
};

function FactorRow({ factor }: { factor: Factor }) {
  const meta = factorTypeColors[factor.type];
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${meta.bg} ${meta.text} w-20 text-center`}>{meta.label}</span>
      <span className="text-[11px] text-[#999] flex-1">{factor.name}</span>
      <div className="flex items-center gap-4 text-[11px] font-mono">
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
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-white">{benefit.name}</div>
            <div className="text-[10px] text-[#666] mt-0.5">(Neurons for ITSM)</div>
          </div>
          <div className="flex items-center gap-3 ml-4">
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
            <div className="flex items-center gap-10 text-[9px] text-[#555] mb-1">
              <span className="w-20" /><span className="flex-1" />
              <span className="w-16 text-right">Year 1</span>
              <span className="w-16 text-right">Year 2</span>
              <span className="w-16 text-right">Year 3</span>
            </div>
            {benefit.factors.map((f, i) => <FactorRow key={i} factor={f} />)}
            <div className="flex items-center gap-3 py-1.5 mt-1 border-t border-[#222]">
              <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-white/5 text-white w-20 text-center">Total</span>
              <span className="flex-1" />
              <div className="flex items-center gap-4 text-[11px] font-mono font-bold">
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

  return (
    <div className={`bg-[#111] border ${borderColor} rounded-xl p-5 space-y-4`}>
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] px-2 py-0.5 rounded border ${tagColor}`}>{tagLabel}</span>
            </div>
            <h3 className="text-sm font-bold text-white">{benefit.name}</h3>
          </div>
          <div className="flex items-center gap-3 ml-4 mt-1">
            <div className="text-right">
              <div className="text-[9px] text-[#555]">3-Year Total</div>
              <div className="text-base font-bold text-emerald-400">
                {(() => {
                  const vals = [benefit.totals.y1, benefit.totals.y2, benefit.totals.y3].map(v => {
                    const n = v.replace(/[^0-9.]/g, '');
                    const mult = v.includes('M') ? 1000000 : v.includes('K') ? 1000 : 1;
                    return parseFloat(n) * mult;
                  });
                  const total = vals.reduce((a, b) => a + b, 0);
                  return total >= 1000000 ? `$${(total / 1000000).toFixed(1)}M` : total >= 1000 ? `$${(total / 1000).toFixed(1)}K` : `$${total.toFixed(0)}`;
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

          {/* Rationale */}
          <div className="bg-[#0a0a0a] border border-amber-500/10 rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Lightbulb size={12} className="text-amber-400" />
              <span className="text-[10px] font-semibold text-amber-400">Why This Benefit & Why It\'s Built This Way</span>
            </div>
            <p className="text-[11px] text-[#888] leading-relaxed">{benefit.rationale}</p>
          </div>

          {/* Conservatism Note */}
          <div className="bg-[#0a0a0a] border border-emerald-500/10 rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Shield size={12} className="text-emerald-400" />
              <span className="text-[10px] font-semibold text-emerald-400">Conservatism & Scaling Guard</span>
            </div>
            <p className="text-[11px] text-[#888] leading-relaxed">{benefit.conservatismNote}</p>
          </div>

          {/* Source Mapping */}
          {benefit.oldSourceBenefits.length > 0 && (
            <div className="flex items-start gap-2">
              <RefreshCw size={12} className="text-purple-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-[10px] font-semibold text-purple-400 mb-1">Replaces / Combines Old Benefits</div>
                {benefit.oldSourceBenefits.map((b, i) => (
                  <div key={i} className="text-[10px] text-[#777]">• {b}</div>
                ))}
              </div>
            </div>
          )}

          {/* New Factors Used */}
          <div className="flex items-start gap-2">
            <Zap size={12} className="text-blue-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-[10px] font-semibold text-blue-400 mb-1">New Factors Leveraged</div>
              {benefit.newFactorsUsed.map((f, i) => (
                <div key={i} className="text-[10px] text-[#777]">• {f}</div>
              ))}
            </div>
          </div>

          {/* Capabilities & Pain Points side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0a0a0a] rounded-lg p-3">
              <div className="text-[10px] font-semibold text-white mb-1.5">Capabilities</div>
              {benefit.capabilities.map((c, i) => (
                <div key={i} className="text-[10px] text-[#777] leading-relaxed">• {c}</div>
              ))}
            </div>
            <div className="bg-[#0a0a0a] rounded-lg p-3">
              <div className="text-[10px] font-semibold text-white mb-1.5">Pain Points Addressed</div>
              {benefit.painPoints.map((p, i) => (
                <div key={i} className="text-[10px] text-[#777] leading-relaxed">• {p}</div>
              ))}
            </div>
          </div>

          {/* Formula */}
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-3">
            <div className="flex items-center gap-10 text-[9px] text-[#555] mb-2">
              <span className="w-20" /><span className="flex-1" />
              <span className="w-16 text-right">Year 1</span>
              <span className="w-16 text-right">Year 2</span>
              <span className="w-16 text-right">Year 3</span>
            </div>
            {benefit.factors.map((f, i) => <FactorRow key={i} factor={f} />)}
            <div className="mt-2 pt-2 border-t border-[#222]">
              <div className="text-[10px] text-[#555] font-mono mb-1">{benefit.calculation}</div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-white w-20">= Total</span>
                <span className="flex-1" />
                <div className="flex items-center gap-4 text-sm font-mono font-bold">
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
  const [showOldFactors, setShowOldFactors] = useState(false);

  const tabs = [
    { id: 'hybrids' as const, label: '🎫 Hybrid ITSM Benefits', count: hybridBenefits.filter(b => b.tag === 'hybrid-itsm').length },
    { id: 'service-mapping' as const, label: '🗺️ Service Mapping Benefits', count: hybridBenefits.filter(b => b.tag === 'service-mapping').length },
    { id: 'old-benefits' as const, label: '📋 Old Benefits (Reference)', count: oldBenefits.length },
    { id: 'factor-library' as const, label: '📊 Factor Library', count: newDriverFactors.length + newFinancialFactors.length },
  ];

  const hybridITSM = hybridBenefits.filter(b => b.tag === 'hybrid-itsm');
  const serviceMappingBenefits = hybridBenefits.filter(b => b.tag === 'service-mapping');

  // Calculate totals
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

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Back */}
      <div className="flex items-center gap-2">
        <Link href="/value-engineering/projects" className="text-[#555] hover:text-white transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <span className="text-xs text-[#555]">Projects /</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Layers size={24} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Hybrid Benefits & Service Mapping</h1>
            <p className="text-sm text-[#666]">Conservative, realistic ROI benefits combining old & new factor libraries</p>
          </div>
        </div>
        <div className="text-right space-y-1">
          <div>
            <span className="text-[10px] text-[#555]">Hybrid ITSM 3yr: </span>
            <span className="text-sm font-bold text-blue-400">{hybridTotal >= 1000000 ? `$${(hybridTotal/1000000).toFixed(1)}M` : `$${(hybridTotal/1000).toFixed(0)}K`}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#555]">Service Mapping 3yr: </span>
            <span className="text-sm font-bold text-teal-400">{smTotal >= 1000000 ? `$${(smTotal/1000000).toFixed(1)}M` : `$${(smTotal/1000).toFixed(0)}K`}</span>
          </div>
        </div>
      </div>

      {/* Approach Summary */}
      <div className="bg-[#111] border border-amber-500/15 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-amber-400 mb-2 flex items-center gap-2">
          <Info size={14} />
          Design Philosophy
        </h2>
        <div className="grid grid-cols-3 gap-4 text-[11px] text-[#888] leading-relaxed">
          <div>
            <div className="text-xs font-semibold text-white mb-1">Conservative by Default</div>
            Improvement percentages are deliberately low (2-15%) vs old benefits (20-80%). If factors change, ROI scales linearly — no dramatic jumps. Every number should survive customer scrutiny.
          </div>
          <div>
            <div className="text-xs font-semibold text-white mb-1">Real Costs, Not Revenue Proxies</div>
            Where possible, we use IT hourly rate ($52) instead of FTE revenue impact ($120). Saves us from the &quot;does every saved hour really generate revenue?&quot; objection. Actual cost savings &gt; theoretical revenue recovery.
          </div>
          <div>
            <div className="text-xs font-semibold text-white mb-1">New Factors as Anchors</div>
            The new driver factors (30K ticket hours, 33K downtime hours, $26/ticket) are larger and more realistic than old numbers. We pair them with tiny improvement %s to get moderate, defensible totals.
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#222] pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 rounded-t-lg text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-[#111] text-white border border-b-0 border-[#333]'
                : 'text-[#666] hover:text-white'
            }`}
          >
            {tab.label} <span className="text-[10px] opacity-60">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'hybrids' && (
        <div className="space-y-4">
          <div className="text-xs text-[#666]">5 hybrid benefits combining old ITSM benefit structures with new factor assumptions. Each includes rationale and conservatism notes.</div>
          {hybridITSM.map(b => <HybridBenefitCard key={b.id} benefit={b} />)}
        </div>
      )}

      {activeTab === 'service-mapping' && (
        <div className="space-y-4">
          <div className="text-xs text-[#666]">5 Service Mapping benefits derived from the Service Mapping deck, reconstructed with conservative assumptions and new factor library anchors.</div>
          {serviceMappingBenefits.map(b => <HybridBenefitCard key={b.id} benefit={b} />)}
        </div>
      )}

      {activeTab === 'old-benefits' && (
        <div className="space-y-3">
          <div className="text-xs text-[#666]">6 original ITSM benefits from the old Value Cloud environment. Click to expand formula details. These are the source material for the hybrid benefits.</div>
          {oldBenefits.map(b => <OldBenefitCard key={b.id} benefit={b} />)}
        </div>
      )}

      {activeTab === 'factor-library' && (
        <div className="space-y-4">
          <div className="text-xs text-[#666]">Complete factor assumptions from the new environment. These are the building blocks for all hybrid and service mapping benefits.</div>

          {/* New Driver Factors */}
          <div className="bg-[#111] border border-blue-500/20 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-blue-400 mb-3">Driver Factor Assumptions (New)</h3>
            <div className="space-y-1.5">
              {newDriverFactors.map((f, i) => (
                <div key={i} className="flex items-center justify-between py-1 border-b border-[#1a1a1a] last:border-0">
                  <span className="text-[11px] text-[#999]">{f.name}</span>
                  <span className="text-[11px] font-mono text-white">{f.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* New Financial Factors */}
          <div className="bg-[#111] border border-emerald-500/20 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-emerald-400 mb-3">Financial Factor Assumptions (New)</h3>
            <div className="space-y-1.5">
              {newFinancialFactors.map((f, i) => (
                <div key={i} className="flex items-center justify-between py-1 border-b border-[#1a1a1a] last:border-0">
                  <span className="text-[11px] text-[#999]">{f.name}</span>
                  <span className="text-[11px] font-mono text-white">{f.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Service Mapping Factors */}
          <div className="bg-[#111] border border-teal-500/20 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-teal-400 mb-3">Service Mapping Factor Assumptions</h3>
            <div className="space-y-1.5">
              {[...smDriverFactors, ...smFinancialFactors].map((f, i) => (
                <div key={i} className="flex items-center justify-between py-1 border-b border-[#1a1a1a] last:border-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] px-1 py-0.5 rounded ${f.category === 'driver' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
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
