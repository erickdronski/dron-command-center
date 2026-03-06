'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, ChevronUp, CheckCircle2, Circle, Search } from 'lucide-react';

/* ────────────────────────────────────────────
   DATA — Maturity Framework Capabilities by Product
   Up to 5 capabilities per product, drawn from the SM Maturity Framework
   ──────────────────────────────────────────── */

type MaturityLevel = 'Ad-Hoc' | 'Reactive' | 'Proactive' | 'Optimized' | 'Transformational';

type Capability = {
  name: string;
  domain: string;        // which maturity domain this belongs to
  currentState: string;  // what ad-hoc looks like
  improvedState: string; // what the product enables
  targetLevel: MaturityLevel;
};

type ProductCapabilities = {
  product: string;
  shortName: string;
  category: 'ITSM' | 'ESM' | 'UEM' | 'Security';
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  capabilities: Capability[];
};

const maturityColors: Record<MaturityLevel, string> = {
  'Ad-Hoc': 'text-red-400',
  'Reactive': 'text-orange-400',
  'Proactive': 'text-yellow-400',
  'Optimized': 'text-green-400',
  'Transformational': 'text-blue-400',
};

const maturityBg: Record<MaturityLevel, string> = {
  'Ad-Hoc': 'bg-red-500/10 border-red-500/20',
  'Reactive': 'bg-orange-500/10 border-orange-500/20',
  'Proactive': 'bg-yellow-500/10 border-yellow-500/20',
  'Optimized': 'bg-green-500/10 border-green-500/20',
  'Transformational': 'bg-blue-500/10 border-blue-500/20',
};

const productCapabilities: ProductCapabilities[] = [
  {
    product: 'Neurons for ITSM',
    shortName: 'ITSM',
    category: 'ITSM',
    color: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/20',
    description: 'Core service management platform — incident, request, change, problem, and CMDB.',
    capabilities: [
      { name: 'Incident Management', domain: 'Service Operations', currentState: 'Tickets managed in email/spreadsheet; no SLA tracking; agents manually prioritize', improvedState: 'Automated routing, SLA enforcement, and real-time queue visibility. Analysts resolve the right things first.', targetLevel: 'Optimized' },
      { name: 'Change Management', domain: 'Change Control', currentState: 'Changes approved via email chain; no impact analysis; frequent unplanned outages from changes', improvedState: 'CMDB-informed impact analysis before approval. Dynamic policies route changes to right reviewers by risk level.', targetLevel: 'Proactive' },
      { name: 'Service Catalog & Request Fulfillment', domain: 'Service Delivery', currentState: 'Requests arrive via email or phone; fulfillment is manual; no visibility into status', improvedState: 'Standardized catalog with automated fulfillment workflows. Employees know exactly where their request is.', targetLevel: 'Optimized' },
      { name: 'Knowledge Management', domain: 'Self-Service', currentState: 'Documentation scattered in SharePoint or wikis; outdated; agents reinvent solutions every time', improvedState: 'Searchable KB surfaces relevant articles at ticket creation. Usage analytics identify gaps and outdated content.', targetLevel: 'Proactive' },
      { name: 'Problem Management', domain: 'Incident Prevention', currentState: 'Same incidents repeat without root cause investigation; team in permanent firefighting mode', improvedState: 'Pattern detection identifies recurring incidents. Problem records track root cause investigation to permanent resolution.', targetLevel: 'Proactive' },
    ],
  },
  {
    product: 'Neurons for AITSM',
    shortName: 'AITSM',
    category: 'ITSM',
    color: 'text-indigo-400', bgColor: 'bg-indigo-500/10', borderColor: 'border-indigo-500/20',
    description: 'AI-powered layer on ITSM — summarization, smart self-service, and knowledge generation.',
    capabilities: [
      { name: 'AI-Assisted Incident Summarization', domain: 'Incident Efficiency', currentState: 'Agents re-read entire ticket history when escalated; slow context transfer between teams', improvedState: 'AI generates a concise summary at each escalation point. New agent is up to speed in seconds, not minutes.', targetLevel: 'Transformational' },
      { name: 'Conversational Self-Service', domain: 'Self-Service', currentState: 'Portal exists but users don\'t use it; self-service adoption below 20%; most issues still come via phone', improvedState: 'AI understands natural language requests and guides users to resolution or right form. Adoption climbs to 35-50%.', targetLevel: 'Optimized' },
      { name: 'Auto-Generated Knowledge Articles', domain: 'Knowledge Management', currentState: 'KB articles manually created by senior analysts; content quickly becomes outdated', improvedState: 'AI drafts knowledge articles from resolved tickets. Analysts review and publish. KB stays current automatically.', targetLevel: 'Transformational' },
      { name: 'Predictive Ticket Classification', domain: 'Service Operations', currentState: 'Tickets manually categorized and assigned; misclassification is common; routing delays', improvedState: 'AI classifies and routes tickets at submission. Correct team gets it immediately with full context.', targetLevel: 'Optimized' },
      { name: 'Virtual Agent / Chatbot', domain: 'Self-Service', currentState: 'Users call or email IT for every question; no 24/7 support option; after-hours issues wait until morning', improvedState: 'Virtual agent handles common requests 24/7 — password unlocks, access requests, status checks — without an agent.', targetLevel: 'Optimized' },
    ],
  },
  {
    product: 'Neurons for MDM',
    shortName: 'MDM',
    category: 'UEM',
    color: 'text-green-400', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/20',
    description: 'Mobile and endpoint device management — enrollment, policy, compliance, and remote management.',
    capabilities: [
      { name: 'Device Enrollment & Provisioning', domain: 'Device Lifecycle', currentState: 'Manual setup for every device; new employees wait days for a working device; no zero-touch', improvedState: 'Zero-touch enrollment — device ships to employee, user turns it on, it self-configures with correct policies and apps.', targetLevel: 'Optimized' },
      { name: 'Security Policy Enforcement', domain: 'Endpoint Compliance', currentState: 'Security policies applied manually or not at all; compliance varies by device and user', improvedState: 'Policies enforced automatically across all devices — encryption, PIN complexity, jailbreak detection. Non-compliant = quarantined.', targetLevel: 'Proactive' },
      { name: 'Remote Troubleshooting & Management', domain: 'Device Support', currentState: 'IT needs physical access for most device issues; employees ship devices in or visit IT desk', improvedState: 'Remote view, control, app push, profile update, and wipe — all without touching the device. Support is instant.', targetLevel: 'Optimized' },
      { name: 'App Lifecycle Management', domain: 'Software Distribution', currentState: 'Apps manually installed; no control over which apps employees install; outdated versions persist', improvedState: 'Approved app catalog with automated distribution. Unauthorized apps flagged. Updates pushed silently.', targetLevel: 'Proactive' },
      { name: 'Compliance Reporting & Audit', domain: 'Governance', currentState: 'Compliance status unknown until audit; evidence gathering is manual and time-consuming', improvedState: 'Real-time compliance dashboards. Audit-ready reports generated instantly. No scramble before an assessment.', targetLevel: 'Optimized' },
    ],
  },
  {
    product: 'Neurons for ITAM',
    shortName: 'ITAM',
    category: 'ESM',
    color: 'text-teal-400', bgColor: 'bg-teal-500/10', borderColor: 'border-teal-500/20',
    description: 'Hardware and software asset management — inventory, lifecycle, contracts, and compliance.',
    capabilities: [
      { name: 'Hardware Asset Tracking', domain: 'Asset Lifecycle', currentState: 'Device inventory in spreadsheets; frequently inaccurate; no link between device and user', improvedState: 'Automated discovery keeps inventory current. Every device linked to its user, location, and lifecycle stage.', targetLevel: 'Proactive' },
      { name: 'Software License Management', domain: 'License Optimization', currentState: 'License counts tracked manually or by finance; over-licensed on unused tools; shelfware common', improvedState: 'Usage-based license analysis identifies waste. Alerts before renewal. Right-size negotiations backed by data.', targetLevel: 'Optimized' },
      { name: 'Contract & Renewal Management', domain: 'Vendor Management', currentState: 'Contract renewal dates tracked in email or calendar; auto-renewals happen without usage review', improvedState: 'Contracts tracked with 90-day renewal alerts. Usage data attached to each contract for negotiation leverage.', targetLevel: 'Optimized' },
      { name: 'Asset Lifecycle Automation', domain: 'Asset Lifecycle', currentState: 'Procurement, deployment, and decommission handled manually across IT, finance, and HR', improvedState: 'Automated workflows connect procurement approval → deployment → maintenance → retirement. No gaps, no orphaned assets.', targetLevel: 'Proactive' },
      { name: 'Financial Optimization', domain: 'Cost Management', currentState: 'No visibility into true cost per device or software; hardware maintenance contracts not reviewed', improvedState: 'TCO analysis per asset class. Maintenance contract optimization. Energy and lifecycle savings quantified.', targetLevel: 'Optimized' },
    ],
  },
  {
    product: 'Neurons for RBVM',
    shortName: 'RBVM',
    category: 'Security',
    color: 'text-red-400', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/20',
    description: 'Risk-based vulnerability management — prioritize what to fix first based on real-world exploitability.',
    capabilities: [
      { name: 'Risk-Based Vulnerability Prioritization', domain: 'Vulnerability Management', currentState: 'All vulnerabilities treated equally; patching driven by CVSS scores; most critical threats not addressed fastest', improvedState: 'Threat intelligence + asset criticality = a ranked list. Fix what\'s actually being exploited first. Ignore theoretical risk.', targetLevel: 'Optimized' },
      { name: 'Threat Intelligence Integration', domain: 'Threat Context', currentState: 'Security team unaware which vulnerabilities are actively exploited in the wild until a breach', improvedState: 'Live threat feeds show which CVEs are in active exploit campaigns. Team focuses on real, current threats.', targetLevel: 'Proactive' },
      { name: 'Continuous Risk Assessment', domain: 'Risk Monitoring', currentState: 'Point-in-time vulnerability scans; risk posture unknown between scan cycles', improvedState: 'Continuous monitoring flags new vulnerabilities as they\'re discovered. Risk posture is always current.', targetLevel: 'Optimized' },
      { name: 'Remediation Workflow Automation', domain: 'Patch Operations', currentState: 'Vulnerabilities identified but remediation tracked in spreadsheets; ownership unclear; things slip', improvedState: 'Automated ticket creation for each finding. Assigned to the right team. SLA tracked. Nothing falls through.', targetLevel: 'Proactive' },
      { name: 'Compliance & Audit Reporting', domain: 'Governance', currentState: 'Vulnerability compliance status manually compiled for audits; takes days or weeks to produce', improvedState: 'Instant compliance reports showing vulnerability posture against regulatory requirements (PCI, HIPAA, NIST).', targetLevel: 'Optimized' },
    ],
  },
  {
    product: 'Neurons for Patch Management',
    shortName: 'Patch',
    category: 'Security',
    color: 'text-rose-400', bgColor: 'bg-rose-500/10', borderColor: 'border-rose-500/20',
    description: 'Automated patch deployment — OS and third-party patching with intelligent scheduling and risk management.',
    capabilities: [
      { name: 'Automated Patch Deployment', domain: 'Patch Operations', currentState: 'Patching is manual; takes weeks per cycle; patches miss endpoints; exposure window is large', improvedState: 'Rule-based automated deployment: scan → test → stage → deploy. Critical patches in hours, not weeks.', targetLevel: 'Optimized' },
      { name: 'Third-Party Application Patching', domain: 'Software Currency', currentState: 'OS patching handled but third-party apps (Chrome, Adobe, Java) left unmanaged; major attack surface', improvedState: 'Third-party patches included in same automated pipeline. Nothing left behind.', targetLevel: 'Proactive' },
      { name: 'Patch Compliance Reporting', domain: 'Governance', currentState: 'Compliance status unknown until a manual audit; reports take days to compile', improvedState: 'Real-time compliance dashboard by device, OS, location, and time. Instant audit evidence.', targetLevel: 'Optimized' },
      { name: 'Zero-Day Response Automation', domain: 'Emergency Patching', currentState: 'Zero-day response is a fire drill — manual effort, overtime, and inconsistent coverage', improvedState: 'Emergency patch workflows pre-configured. Critical patches deployed across the estate in hours, not days.', targetLevel: 'Proactive' },
      { name: 'Patch Risk Management', domain: 'Change Control', currentState: 'Patches deployed without testing; patch-related outages common; teams delay patching out of fear', improvedState: 'Test ring → pilot group → broad deployment. Rollback capability. Patches go out fast AND safe.', targetLevel: 'Optimized' },
    ],
  },
  {
    product: 'Ivanti Zero Sign-On (ZSO)',
    shortName: 'ZSO',
    category: 'Security',
    color: 'text-pink-400', bgColor: 'bg-pink-500/10', borderColor: 'border-pink-500/20',
    description: 'Passwordless authentication — eliminate passwords, reduce breach risk, and remove the #1 help desk ticket.',
    capabilities: [
      { name: 'Passwordless Authentication', domain: 'Identity Management', currentState: 'Password-based auth; users choose weak passwords; reuse across systems; major breach vector', improvedState: 'Certificate-based auth eliminates passwords entirely. Nothing to steal, phish, or brute-force.', targetLevel: 'Transformational' },
      { name: 'Zero-Touch Password Reset Elimination', domain: 'Help Desk Efficiency', currentState: 'Password resets are 20-30% of help desk volume; each takes 8-12 minutes of agent time', improvedState: 'No passwords = no resets. Single largest help desk ticket category eliminated completely.', targetLevel: 'Transformational' },
      { name: 'Continuous Device Trust', domain: 'Zero Trust Access', currentState: 'Authentication is point-in-time; compromised sessions continue until token expires', improvedState: 'Device posture checked continuously. Non-compliant device loses access immediately, not at next login.', targetLevel: 'Optimized' },
      { name: 'Single Sign-On Across All Apps', domain: 'User Experience', currentState: 'Multiple passwords for multiple systems; users log in 8-10x per day; friction and frustration high', improvedState: 'Authenticate once with device certificate. Access all apps automatically. Zero sign-on — literally.', targetLevel: 'Optimized' },
      { name: 'Phishing Resistance', domain: 'Security Posture', currentState: 'Phishing attacks effective because they target credentials; users regularly take the bait', improvedState: 'Phishing is irrelevant when there are no passwords to steal. Certificate auth is inherently phishing-resistant.', targetLevel: 'Optimized' },
    ],
  },
  {
    product: 'Neurons for FM',
    shortName: 'FM',
    category: 'ESM',
    color: 'text-amber-400', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/20',
    description: 'Facilities management — work orders, preventive maintenance, asset management, and energy optimization.',
    capabilities: [
      { name: 'Predictive Maintenance', domain: 'Asset Reliability', currentState: 'Reactive maintenance; equipment fails before anyone knows it\'s degrading; emergency repair costs spike', improvedState: 'Sensor data and usage patterns predict failures. Work orders created before breakdown. Emergency repairs drop significantly.', targetLevel: 'Proactive' },
      { name: 'Energy Consumption Optimization', domain: 'Cost Management', currentState: 'Energy costs tracked at the meter; no visibility into which systems or behaviors drive waste', improvedState: 'Real-time consumption data by building, system, and shift. Automated controls reduce waste without affecting operations.', targetLevel: 'Optimized' },
      { name: 'Work Order Automation', domain: 'Maintenance Operations', currentState: 'Work orders created manually; dispatched via radio or text; completion tracked in paper logs', improvedState: 'Work orders auto-generated from requests or sensor alerts. Technicians receive on mobile. Completion tracked in real time.', targetLevel: 'Proactive' },
      { name: 'Facilities Asset Lifecycle', domain: 'Asset Management', currentState: 'Facilities assets tracked in spreadsheets or not at all; no link between equipment and service history', improvedState: 'Complete asset registry with full maintenance history. Warranty, service intervals, and replacement planning all managed.', targetLevel: 'Optimized' },
      { name: 'Space & Occupancy Management', domain: 'Space Utilization', currentState: 'Space allocation based on org charts, not actual usage; conference rooms double-booked or empty', improvedState: 'Occupancy data drives space planning. Hot desking, meeting room booking, and real estate decisions backed by real usage.', targetLevel: 'Proactive' },
    ],
  },
  {
    product: 'Neurons for GRC',
    shortName: 'GRC',
    category: 'ESM',
    color: 'text-orange-400', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/20',
    description: 'Governance, risk and compliance — control frameworks, audit management, and continuous monitoring.',
    capabilities: [
      { name: 'Control Framework Management', domain: 'Compliance', currentState: 'Controls documented in spreadsheets; ownership unclear; testing is infrequent and manual', improvedState: 'All controls in one platform. Owners assigned. Testing scheduled and tracked. Evidence captured automatically.', targetLevel: 'Optimized' },
      { name: 'Automated Evidence Collection', domain: 'Audit Readiness', currentState: 'Audit prep requires weeks of manual evidence gathering; teams drop everything when auditors arrive', improvedState: 'Evidence collected continuously from connected systems. Audit package ready to export in minutes.', targetLevel: 'Optimized' },
      { name: 'Continuous Risk Monitoring', domain: 'Risk Management', currentState: 'Risk assessment is annual or semi-annual; posture unknown between cycles; surprises at audit time', improvedState: 'Risk posture updated continuously as controls are tested and issues are raised. No surprises.', targetLevel: 'Proactive' },
      { name: 'Multi-Framework Compliance', domain: 'Regulatory Management', currentState: 'Each regulation managed separately with its own spreadsheet; duplicated effort; gaps common', improvedState: 'Controls mapped to multiple frameworks simultaneously (SOC 2, ISO 27001, NIST, PCI). One control, many frameworks.', targetLevel: 'Optimized' },
      { name: 'Policy Management & Attestation', domain: 'Policy Governance', currentState: 'Policies emailed out for acknowledgment; no tracking of who has read what; outdated versions circulate', improvedState: 'Policies published with version control. Employees attest electronically. Completion tracked. Automatic renewal reminders.', targetLevel: 'Proactive' },
    ],
  },
  {
    product: 'Neurons for PPM',
    shortName: 'PPM',
    category: 'ESM',
    color: 'text-lime-400', bgColor: 'bg-lime-500/10', borderColor: 'border-lime-500/20',
    description: 'Project and portfolio management — planning, resource management, and portfolio analytics.',
    capabilities: [
      { name: 'Portfolio Visibility & Prioritization', domain: 'Strategic Planning', currentState: 'Project list exists in spreadsheets; no connection between project investments and strategic goals', improvedState: 'All projects visible in one portfolio view with health, budget, and strategic alignment. Funding decisions backed by data.', targetLevel: 'Optimized' },
      { name: 'Resource Demand & Capacity Planning', domain: 'Resource Management', currentState: 'Resources assigned by conversation; over-allocation not visible until people complain or deadlines slip', improvedState: 'Demand forecasted from planned projects. Capacity compared in real time. Over-allocation flagged before it happens.', targetLevel: 'Proactive' },
      { name: 'Automated Status Reporting', domain: 'Project Communication', currentState: 'PM spends 30% of time compiling status reports from multiple sources; reports are always a week old', improvedState: 'Status dashboards update automatically from task completion. Leadership sees real-time project health without asking.', targetLevel: 'Optimized' },
      { name: 'Risk & Issue Tracking', domain: 'Project Control', currentState: 'Risks tracked in a separate spreadsheet that nobody updates; issues escalate before leadership is aware', improvedState: 'Risks and issues logged in project context. Escalation paths configured. Nothing escalates without visibility.', targetLevel: 'Proactive' },
      { name: 'Financial Forecasting', domain: 'Budget Management', currentState: 'Project budgets tracked in finance systems disconnected from project status; surprises at quarter end', improvedState: 'Actual spend tracked against budget in real time. Forecast to complete always current. No budget surprises.', targetLevel: 'Optimized' },
    ],
  },
];

const domains = [...new Set(productCapabilities.flatMap(p => p.capabilities.map(c => c.domain)))].sort();

/* ────────────────────────────────────────────
   COMPONENTS
   ──────────────────────────────────────────── */

function CapabilityCard({ cap }: { cap: Capability }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#1a1a1a] rounded-lg overflow-hidden bg-[#0a0a0a]">
      <button onClick={() => setOpen(!open)}
        className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-[#111] transition-colors text-left">
        <div className="flex items-center gap-2 min-w-0">
          <CheckCircle2 size={14} className="text-green-400 shrink-0" />
          <span className="text-[#ccc] text-sm font-medium truncate">{cap.name}</span>
        </div>
        <div className="flex items-center gap-2 ml-2 shrink-0">
          <span className={`text-xs px-2 py-0.5 rounded-full border ${maturityBg[cap.targetLevel]} ${maturityColors[cap.targetLevel]}`}>
            {cap.targetLevel}
          </span>
          {open ? <ChevronUp size={12} className="text-[#555]" /> : <ChevronDown size={12} className="text-[#555]" />}
        </div>
      </button>
      {open && (
        <div className="px-3 pb-3 pt-1 border-t border-[#1a1a1a] space-y-2">
          <div className="text-[10px] text-[#555] uppercase tracking-wider font-semibold">{cap.domain}</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#1a0a0a] border border-red-500/10 rounded-lg p-2">
              <div className="text-red-400 text-[10px] font-semibold mb-1">❌ Current State</div>
              <p className="text-[#999] text-xs leading-snug">{cap.currentState}</p>
            </div>
            <div className="bg-[#0a1a0a] border border-green-500/10 rounded-lg p-2">
              <div className="text-green-400 text-[10px] font-semibold mb-1">✅ With Ivanti</div>
              <p className="text-[#999] text-xs leading-snug">{cap.improvedState}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductCard({ pc }: { pc: ProductCapabilities }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border ${pc.borderColor} rounded-xl overflow-hidden`}>
      <button onClick={() => setOpen(!open)}
        className={`w-full px-5 py-4 flex items-center justify-between ${pc.bgColor} hover:brightness-110 transition-all text-left`}>
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-[#0a0a0a]/50 ${pc.color}`}>{pc.category}</span>
            </div>
            <h3 className="text-white font-bold text-base mt-1">{pc.product}</h3>
            <p className="text-[#666] text-xs mt-0.5">{pc.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 ml-4 shrink-0">
          <div className="flex gap-1">
            {pc.capabilities.map((cap, i) => (
              <Circle key={i} size={8} className={maturityColors[cap.targetLevel]} fill="currentColor" />
            ))}
          </div>
          {open ? <ChevronUp size={18} className="text-[#555]" /> : <ChevronDown size={18} className="text-[#555]" />}
        </div>
      </button>
      {open && (
        <div className="p-4 space-y-2 bg-[#0a0a0a]">
          {pc.capabilities.map((cap, i) => (
            <CapabilityCard key={i} cap={cap} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────
   MAIN
   ──────────────────────────────────────────── */

export default function CapabilityMapPage() {
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');

  const levels: MaturityLevel[] = ['Ad-Hoc', 'Reactive', 'Proactive', 'Optimized', 'Transformational'];
  const categories = ['all', 'ITSM', 'ESM', 'UEM', 'Security'];

  const filtered = productCapabilities
    .filter(p => filterCat === 'all' || p.category === filterCat)
    .map(p => ({
      ...p,
      capabilities: p.capabilities.filter(c =>
        (filterLevel === 'all' || c.targetLevel === filterLevel) &&
        (!search.trim() ||
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.domain.toLowerCase().includes(search.toLowerCase()) ||
          c.improvedState.toLowerCase().includes(search.toLowerCase()) ||
          p.product.toLowerCase().includes(search.toLowerCase()))
      ),
    }))
    .filter(p => p.capabilities.length > 0);

  const totalCapabilities = productCapabilities.reduce((s, p) => s + p.capabilities.length, 0);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Link href="/value-engineering/projects" className="inline-flex items-center gap-1.5 text-[#555] hover:text-white text-sm mb-4 transition-colors">
        <ArrowLeft size={14} /> Back to Projects
      </Link>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">🏗️ Capability Maturity Map</h2>
        <p className="text-[#555] text-sm">
          For each product: up to 5 capabilities from the Service Management Maturity Framework. Current state → what Ivanti enables → target maturity level.
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-5 px-4 py-3 bg-[#111] border border-[#222] rounded-lg flex-wrap gap-y-2">
        <div className="text-center"><div className="text-white font-bold text-lg">{productCapabilities.length}</div><div className="text-[#555] text-xs">Products</div></div>
        <div className="w-px h-8 bg-[#222]" />
        <div className="text-center"><div className="text-white font-bold text-lg">{totalCapabilities}</div><div className="text-[#555] text-xs">Capabilities</div></div>
        <div className="w-px h-8 bg-[#222]" />
        {levels.filter(l => productCapabilities.some(p => p.capabilities.some(c => c.targetLevel === l))).map(level => (
          <div key={level} className="text-center">
            <div className={`font-bold text-sm ${maturityColors[level]}`}>{level}</div>
            <div className="text-[#555] text-[10px]">{productCapabilities.reduce((s, p) => s + p.capabilities.filter(c => c.targetLevel === level).length, 0)} caps</div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-2 flex-wrap mb-5">
        {levels.map(l => (
          <div key={l} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs ${maturityBg[l]} ${maturityColors[l]}`}>
            <Circle size={6} fill="currentColor" />
            {l}
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
          <input type="text" placeholder="Search capabilities, products, domains..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#111] border border-[#222] rounded-lg text-white text-sm placeholder:text-[#444] focus:outline-none focus:border-[#333]" />
        </div>
        <div className="flex gap-1 flex-wrap">
          {categories.map(c => (
            <button key={c} onClick={() => setFilterCat(c)}
              className={`px-3 py-2 text-xs rounded-lg transition-colors ${
                filterCat === c ? 'bg-[#222] text-white' : 'text-[#555] hover:text-[#888] hover:bg-[#111]'
              }`}>{c === 'all' ? 'All' : c}</button>
          ))}
        </div>
        <div className="flex gap-1 flex-wrap">
          <button onClick={() => setFilterLevel('all')}
            className={`px-3 py-2 text-xs rounded-lg transition-colors ${filterLevel === 'all' ? 'bg-[#222] text-white' : 'text-[#555] hover:text-[#888] hover:bg-[#111]'}`}>
            All Levels
          </button>
          {levels.map(l => (
            <button key={l} onClick={() => setFilterLevel(l)}
              className={`px-3 py-2 text-xs rounded-lg transition-colors ${
                filterLevel === l ? `border ${maturityBg[l]} ${maturityColors[l]}` : 'text-[#555] hover:text-[#888] hover:bg-[#111]'
              }`}>{l}</button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(pc => <ProductCard key={pc.shortName} pc={pc} />)}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-[#555]">No capabilities match your filters.</div>
      )}
    </div>
  );
}
