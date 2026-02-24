'use client';

import { useState } from 'react';
import { Building2, ChevronDown, ChevronRight, Shield, Zap, BookOpen, Link2, Monitor, Clock, Users, HelpCircle, CheckCircle2, MessageSquare, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type InputItem = {
  label: string;
  value: string;
  source: 'Vendor Estimated' | 'Baseline Assumption';
  talkTrack: string;
  verifyQuestion: string;
  examples: string[];
};

type BenefitItem = {
  id: string;
  title: string;
  category: string;
  annualValue: string;
  threeYearValue: string;
  formula: string;
  formulaBreakdown: string;
  talkTrack: string;
  uniScenarios: string[];
  realExamples: string[];
  verifyQuestion: string;
  icon: React.ElementType;
  color: string;
};

const inputs: InputItem[] = [
  {
    label: 'Number of Employees',
    value: '9,500',
    source: 'Vendor Estimated',
    talkTrack: 'Glasgow has roughly 9,500 staff — academic, admin, research, professional services. Pulled from publicly available university data. Represents everyone who could potentially raise a ticket or be impacted by IT service quality.',
    verifyQuestion: 'Does 9,500 feel right for your total headcount? Some universities count differently — hourly staff, visiting researchers, etc.',
    examples: [
      'University of Edinburgh runs ~15,000 staff with similar per-capita ticket volumes',
      'University of Manchester (~12,000 staff) found research staff generate 40% more tickets than admin',
      'Russell Group average is roughly 8,000-14,000 total staff',
    ],
  },
  {
    label: 'Annual Working Hours',
    value: '1,499 hours',
    source: 'Vendor Estimated',
    talkTrack: 'UK higher education standard. Based on 37-hour weeks minus bank holidays (8), annual leave (~30 days), and typical university closure days (Christmas/Easter).',
    verifyQuestion: 'Is your standard contract 35 or 37 hours? Do you have extended closure periods beyond the standard?',
    examples: [
      'Most Scottish universities observe 10 public holidays vs England\'s 8',
      'Some universities like St Andrews close for a full 2 weeks at Christmas',
    ],
  },
  {
    label: 'Fully Loaded IT FTE Annual Salary',
    value: '£66,046',
    source: 'Baseline Assumption',
    talkTrack: 'Fully loaded cost — not just salary but NI contributions, pension (USS is ~21.6%), benefits. Based on UK university IT salary bands (Grade 7-8). Conservative for Glasgow given cost-of-living in Scotland. Maths: ~£43K base + £9.3K pension + £5.9K NI + £7.8K overhead.',
    verifyQuestion: 'Does that loaded cost feel right? Some universities have moved to DC pensions which would lower this.',
    examples: [
      'University of Bristol reported average loaded IT cost of £62K in 2024 digital strategy review',
      'London universities run 15-20% higher due to London weighting',
      'Scottish universities tend to sit around the £64-68K range',
    ],
  },
  {
    label: 'Average Handle Time (AHT)',
    value: '0.5 hours (30 min)',
    source: 'Baseline Assumption',
    talkTrack: '30 minutes per ticket is the industry standard for blended university IT. Covers triage, investigation, resolution, documentation. University tickets range from "reset my password" (5 min) to "lecture capture system is down" (2+ hrs). 30 min is a fair blended average.',
    verifyQuestion: 'What does your ITSM data show for average resolution time? Do you separate first-line from escalation metrics?',
    examples: [
      'University of Leeds reported 28-minute average AHT after KB improvements',
      'Queen Mary University London was 45-min AHT before automation, dropped to 32 min after',
      'SDI (Service Desk Institute) sector benchmark for education is 25-35 minutes',
    ],
  },
  {
    label: 'Annual Compliance Penalty Exposure',
    value: '£352,493',
    source: 'Baseline Assumption',
    talkTrack: 'Based on GDPR risk exposure for a large UK university handling 30,000+ student records, NHS-linked research data, international student immigration data, and payment card data. ICO has issued £100K-£500K fines for education. £352K is a mid-range single-incident scenario.',
    verifyQuestion: 'Have you had any near-misses with data incidents? What\'s your current incident response time for potential breaches?',
    examples: [
      'University of Greenwich fined £120K by ICO in 2018 for exposing 20K students\' data',
      'UK universities collectively reported 1,785 data breaches to the ICO in 2022-23',
      'Under GDPR, max fines can reach £17.5M or 4% of turnover — £352K is conservative',
    ],
  },
  {
    label: 'IT Staff - Total Headcount',
    value: '238',
    source: 'Baseline Assumption',
    talkTrack: '~2.5% of total headcount. Covers central IT services, faculty-level support, infrastructure, networking, security, and project teams. Research universities run higher IT ratios due to HPC, research software engineering, and lab support.',
    verifyQuestion: 'How is IT structured at Glasgow? Central team vs faculty-embedded? That affects how we calculate impact.',
    examples: [
      'University of Edinburgh has ~400 IT staff (Scotland\'s largest university)',
      'University of Birmingham runs ~280 IT staff for similar headcount',
      'University of Exeter runs ~180 IT staff (smaller Russell Group)',
    ],
  },
  {
    label: 'Number of Endpoint Devices',
    value: '15,000',
    source: 'Vendor Estimated',
    talkTrack: '1.6x ratio to headcount. Accounts for staff laptops/desktops, shared teaching lab machines, library computers, research workstations, lecture theatre equipment, and specialist lab devices.',
    verifyQuestion: 'Does 15,000 cover managed devices only, or does it include BYOD? What\'s your lab PC estate like?',
    examples: [
      'University of Warwick manages ~18,000 endpoints for 8,500 staff + 29K students',
      'Post-COVID most universities saw 20-30% increase in managed devices',
      'One campus building can easily house 500+ shared teaching devices',
    ],
  },
  {
    label: 'Productivity Recapture Rate',
    value: '60%',
    source: 'Vendor Estimated',
    talkTrack: 'When we save someone an hour, they don\'t get a full productive hour back — context switching, refocusing. 60% is the conservative recapture rate. If we save 10 hours, we credit 6 as genuinely productive time. Standard conversion factor — builds trust when you mention it.',
    verifyQuestion: '',
    examples: [],
  },
  {
    label: 'Annual Tickets',
    value: '90,000',
    source: 'Vendor Estimated',
    talkTrack: '~9.5 tickets per employee per year, or ~375 tickets per working day. University volumes are highly seasonal: September surge (2-3x normal), January new term, June/July results, summer lull (40-50% normal).',
    verifyQuestion: 'What\'s your actual annual ticket volume? How does it break down between incidents and service requests?',
    examples: [
      'University of Sheffield processes ~85,000 tickets/year with ~8,000 staff',
      'University of Nottingham hit 100,000 tickets/year after adding student self-service',
      'Cardiff University runs ~70,000 with ~7,500 staff',
      'Post-COVID volumes generally 15-20% higher than pre-2020',
    ],
  },
];

const benefits: BenefitItem[] = [
  {
    id: 'hpr',
    title: 'High Priority Ticket Routing',
    category: 'Penalties & Fines Avoidance',
    annualValue: '£70.5K',
    threeYearValue: '£211.5K',
    formula: '£352,493 × 20% = £70,499/yr',
    formulaBreakdown: 'Annual compliance penalty exposure × improvement with automated routing',
    talkTrack: 'When a potential data breach comes in — say a staff member reports a phishing attack that compromised their credentials — every minute matters. Under GDPR, you have 72 hours to notify the ICO, but the clock starts when you should have known, not when the right person finally sees the ticket. Automated high-priority routing recognises severity keywords and routes directly to your security team — skipping the queue entirely. The 20% means: out of all scenarios where slow response could lead to a regulatory issue, automated routing prevents 1 in 5 from becoming a real problem.',
    uniScenarios: [
      'Research data breach: A PhD student accidentally shares an NHS dataset publicly. Ticket says "file sharing issue." Without smart routing → general IT. With routing rules, "NHS" + "shared" triggers immediate security escalation',
      'Exam paper leak: Someone reports "document access problem" — actually an exam paper accessible to students. Minutes matter before social media spread',
      'GDPR subject access request: Student requests all their data. Legal deadline is 30 days. Ticket sits unrouted for a week = 25% of response window lost',
      'Ransomware indicator: Endpoint flags suspicious encryption. If queued behind password resets, you lose hours of containment time',
    ],
    realExamples: [
      'University of Hertfordshire cyberattack (2021) — initial alert sat in queue for 4 hours, took all systems offline',
      'University of Sunderland cyber incident (2022) — students couldn\'t access systems for weeks',
      'UK universities face 1,000+ cyber attacks per year (JISC data)',
    ],
    verifyQuestion: 'How do you currently handle P1/critical incidents? Is there a dedicated security queue, or does everything come through the same front door?',
    icon: Shield,
    color: 'text-red-400',
  },
  {
    id: 'aht',
    title: 'Reduced Incident Average Handle Time (AHT)',
    category: 'Operational Efficiencies',
    annualValue: '£217.8K',
    threeYearValue: '£653.4K',
    formula: '90,000 × 11% × £22 = £217,800/yr',
    formulaBreakdown: 'Annual tickets × AHT reduction % × cost per ticket (£66K ÷ 1,499hrs = £44/hr × 0.5hr = £22)',
    talkTrack: 'Your agents spend 30 minutes per ticket. With automation — auto-categorisation, suggested resolutions, workflow templates, quick actions — we shave about 3.3 minutes off each one. Across 90,000 tickets that\'s roughly 4,950 hours per year — almost 3.5 FTEs worth of time. The £22 per ticket is your AHT cost: half hour at the loaded hourly rate of £44.',
    uniScenarios: [
      '"I can\'t connect to eduroam" — probably 5-10% of all tickets. Smart workflow gives agent diagnostic checklist + one-click "push new WiFi profile." 20 min → 5 min',
      'Start-of-term password resets — September floods the desk. Auto-suggested resolution ("not activated" vs "expired" vs "MFA lockout") saves triage time on every one',
      '"My lecture recording didn\'t work" — automated diagnostic pulls Panopto/Mediasite logs, room schedule, equipment health into the ticket. Minutes instead of 30+',
      'Research software installs — service request template pre-fills licensing, compatibility, approvals. Auto-routes with all info attached',
      'VLE issues — "I can\'t see my course" is incredibly common. Automated enrolment data checks resolve 60% before an agent looks',
    ],
    realExamples: [
      'University of Leeds cut AHT by 15% in first year with knowledge-centred service (KCS)',
      'University of Portsmouth reduced password reset AHT from 12 min to 3 min with self-service',
      'Imperial College automated new-starter provisioning — 4 days to same-day',
      'HDI reports universities with integrated KBs see 10-18% AHT improvement within 12 months',
    ],
    verifyQuestion: 'What\'s your current AHT from your ITSM data? Which ticket categories eat the most agent time?',
    icon: Zap,
    color: 'text-yellow-400',
  },
  {
    id: 'knowledge',
    title: 'Optimized Knowledge for Improved Service Delivery',
    category: 'Operational Efficiencies',
    annualValue: '£198K',
    threeYearValue: '£594K',
    formula: '90,000 × 10% × £22 = £198,000/yr',
    formulaBreakdown: 'Annual tickets × productivity improvement from KB optimization × cost per ticket',
    talkTrack: 'This is about making your existing knowledge actually work. Most universities have hundreds of KB articles nobody can find — buried in SharePoint, scattered across wikis, outdated. With optimised knowledge delivery, articles surface contextually: agent opens a "VPN not connecting on Mac" ticket → relevant solutions appear automatically. User searches "can\'t print" → step-by-step guide. 10% means 1 in 10 tickets either gets deflected entirely or resolved significantly faster.',
    uniScenarios: [
      'Freshers Week self-service: 2,000 new students setting up eduroam, email, Office 365. Good KB with guides/videos deflects 50%+ from ever hitting the desk',
      '"How do I access [system] from home?" — VPN, remote desktop, VLE access. Searchable, solvable if articles exist and are findable',
      'Seasonal knowledge: Exam submission guides in Dec/May, clearing system guides in Aug, timetabling help in Sep. Contextual KB surfaces the right articles at the right time',
      'New system rollouts: Pre-built KB reduces the "how do I..." flood by 30-40%',
      'Staff onboarding: New lecturers in September need 10+ systems. Curated "New Staff IT Guide" beats 10 separate tickets',
    ],
    realExamples: [
      'University of York implemented KCS — 22% ticket deflection in year one',
      'University of Bath\'s student-facing IT KB handles 40% of freshers week queries without human intervention',
      'Monash University achieved 35% self-service resolution within 18 months',
      'JISC data: universities with mature KBs run 15-25% fewer tickets per head',
    ],
    verifyQuestion: 'How mature is your current knowledge base? Are articles actively maintained, or is it more of a graveyard?',
    icon: BookOpen,
    color: 'text-blue-400',
  },
  {
    id: 'arm',
    title: 'Asset Relationship Management',
    category: 'Operational Efficiencies',
    annualValue: '£17.2K',
    threeYearValue: '£51.6K',
    formula: '13 FTEs × 2% × £66,046 = £17,173/yr',
    formulaBreakdown: 'IT FTEs dedicated to SAM & HAM × effort reduction with automated tracking × loaded salary',
    talkTrack: 'You\'ve got about 13 people touching software and hardware asset management — licence tracking, procurement, audit prep, lifecycle management. With automated asset-to-user mapping, when someone raises a ticket you instantly see their devices, installed software, warranty status, last update. The 2% is modest — eliminating manual lookups and reconciliation. Instead of 10 minutes finding what laptop a user has, it\'s right there.',
    uniScenarios: [
      'Software audit season: Microsoft/Adobe licence true-up currently takes weeks of reconciliation. Automated asset relationships → compliance reports in hours',
      'Equipment refresh: "Which teaching lab PCs are out of warranty?" — one query instead of 3 spreadsheets',
      'Departing staff: What devices and licences are assigned? Without asset relationships = treasure hunt. With them = checklist',
      'Research grant equipment: Grant-funded assets need tracking for audit. Assets tied to grants = audit-ready at all times',
    ],
    realExamples: [
      'University of Cambridge saved £200K/yr by identifying unused software licences',
      'University of Strathclyde reduced Microsoft audit prep from 6 weeks to 3 days',
      'Typical university over-provisions software licences by 15-25% — asset management closes that gap',
    ],
    verifyQuestion: 'How many people touch asset management today? What does your licence audit process look like?',
    icon: Link2,
    color: 'text-purple-400',
  },
  {
    id: 'interruptions',
    title: 'Reduced Core Business Service Interruptions',
    category: 'Employees — Downtime Reduction',
    annualValue: '4,000 hrs',
    threeYearValue: '12,000 hrs',
    formula: '33,321 hrs × 12% = ~3,999 hrs/yr',
    formulaBreakdown: 'Addressable employee downtime hours × reduction by remediating risk before downtime occurs',
    talkTrack: 'This is employee-side, not IT-side. When core systems go down — VLE during lectures, email during admin, student records during enrolment — staff sit idle. 33,000 hours of addressable downtime across 9,500 people is realistic for a university with complex, interdependent systems. By catching issues faster and automating escalation, we prevent 12% of that downtime from impacting users. That\'s 4,000 productive hours returned.',
    uniScenarios: [
      'VLE outage during teaching: Moodle/Canvas down for 2 hours on a busy day = hundreds of lecturers + thousands of students impacted. Faster detection + auto-escalation = shorter outage',
      'Email outage: Every hour across 9,500 people = 9,500 lost person-hours. Cutting from 3 hrs to 2.5 hrs is massive',
      'Student records during clearing: August clearing is make-or-break for recruitment. £50K+ per hour of system downtime reported',
      'Library systems during exams: Students can\'t access e-journals or past papers. Exam prep grinds to a halt',
      'HPC cluster down mid-simulation: Wastes days of compute time. Faster detection saves entire research cycles',
    ],
    realExamples: [
      'University of Manchester — 6-hour student portal outage during enrolment, estimated £300K+ cost',
      'UK universities average 15-20 major service disruptions per year (JISC)',
      'UCISA benchmarking: average UK university loses 200+ hours of core service availability per year',
    ],
    verifyQuestion: 'What are your critical services? What\'s your current average time-to-restore for major incidents?',
    icon: Monitor,
    color: 'text-orange-400',
  },
  {
    id: 'sra',
    title: 'Service Request Automation',
    category: 'Employees — Workflow & Automation',
    annualValue: '694 hrs',
    threeYearValue: '2,082 hrs',
    formula: '69,419 hrs × 1% = 694 hrs/yr',
    formulaBreakdown: 'Addressable employee productivity improvement hours × improvement with service request automation',
    talkTrack: 'Service requests are the predictable, repeatable stuff — new starter setup, software installs, access changes. Automating the workflow means: request → auto-approval for standard items → provisioning kicks off → user notified. What took 3-5 days takes hours. 1% is deliberately conservative — once you see adoption, this grows.',
    uniScenarios: [
      'New academic starter in September: Needs email, VLE, library, door access, phone, research storage, HR, payroll — 8-10 requests today. Automated = one "new starter" workflow triggers all',
      'Visiting researcher access: International collaborator needs 3-month network, VPN, software. Manual = 2 weeks. Automated = 2 days with approvals',
      'Student placement year: 500 students need different access profiles. Manual reconfiguration = nightmare. Automated = batch processed',
      'Software licence requests: "I need SPSS for my research." Standard request, standard path. Why does this take a week?',
    ],
    realExamples: [
      'University of Warwick automated new-starter IT provisioning — 5 days to 4 hours',
      'King\'s College London automated software requests — 7 days to 1 day fulfilment',
      'University of Melbourne automated 40% of service catalogue, freed 2 FTEs',
    ],
    verifyQuestion: 'What\'s your average service request fulfilment time? Which requests generate the most friction?',
    icon: Clock,
    color: 'text-green-400',
  },
  {
    id: 'selfservice',
    title: 'Enhanced Self-Service Experience',
    category: 'Employees — Workflow & Automation',
    annualValue: '1,041 hrs',
    threeYearValue: '3,123 hrs',
    formula: '69,419 hrs × 1.5% = ~1,041 hrs/yr',
    formulaBreakdown: 'Addressable employee productivity hours × reduction with case automation and self-service',
    talkTrack: 'A proper self-service portal where staff can resolve common issues themselves — password resets, ticket status, KB articles, service catalogue. No phone, no email, no waiting. 1.5% is conservative. As adoption grows, this number compounds.',
    uniScenarios: [
      '11pm before a grant deadline: Researcher\'s VPN drops. Desk is closed. Self-service VPN troubleshooting guide gets them online in 10 min instead of waiting until 9am',
      'Password resets at scale: If 20% of tickets are password-related and 80% can self-serve, that\'s 14,400 tickets deflected at £22 each = £316K avoided cost',
      '"Where\'s my ticket?" — Status checking is a top reason people call again. Portal showing real-time status eliminates repeat contacts',
      'International staff in different time zones: Researchers collaborating globally need help outside UK hours. Self-service doesn\'t sleep',
    ],
    realExamples: [
      'University of Oxford self-service portal handles 35% of all IT interactions without humans',
      'University of Birmingham saw 28% reduction in phone calls within 6 months of portal launch',
      'Lancaster University achieved 45% self-service adoption among staff in year one',
      'Gartner: self-service interaction costs £0.10 vs £15-20 for human-handled ticket',
    ],
    verifyQuestion: 'Do you have a self-service portal today? What\'s the adoption like?',
    icon: Users,
    color: 'text-cyan-400',
  },
];

function SourceBadge({ source }: { source: string }) {
  const isVendor = source === 'Vendor Estimated';
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full ${isVendor ? 'bg-blue-500/15 text-blue-400' : 'bg-amber-500/15 text-amber-400'}`}>
      {source}
    </span>
  );
}

function InputCard({ item }: { item: InputItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-3">
          <div>
            <div className="text-sm text-white font-medium">{item.label}</div>
            <div className="text-xs text-[#666] mt-0.5">Value: <span className="text-white font-semibold">{item.value}</span></div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <SourceBadge source={item.source} />
          {open ? <ChevronDown size={14} className="text-[#555]" /> : <ChevronRight size={14} className="text-[#555]" />}
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-[#1a1a1a] pt-3">
          <div>
            <div className="text-[10px] font-semibold text-[#555] uppercase mb-1">Talk Track</div>
            <p className="text-xs text-[#999] leading-relaxed">{item.talkTrack}</p>
          </div>
          {item.verifyQuestion && (
            <div className="bg-purple-500/5 border border-purple-500/10 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <HelpCircle size={12} className="text-purple-400" />
                <span className="text-[10px] font-semibold text-purple-400 uppercase">Ask the Customer</span>
              </div>
              <p className="text-xs text-purple-300/80">{item.verifyQuestion}</p>
            </div>
          )}
          {item.examples.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-[#555] uppercase mb-1">University Examples</div>
              {item.examples.map((ex, i) => (
                <div key={i} className="text-xs text-[#777] flex items-start gap-1.5 mt-1">
                  <span className="text-blue-400/50 mt-0.5">•</span>
                  {ex}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function BenefitCard({ item }: { item: BenefitItem }) {
  const [open, setOpen] = useState(false);
  const Icon = item.icon;
  return (
    <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg bg-[#1a1a1a] flex items-center justify-center`}>
            <Icon size={16} className={item.color} />
          </div>
          <div>
            <div className="text-xs text-[#666]">{item.category}</div>
            <div className="text-sm text-white font-semibold">{item.title}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-bold text-green-400">{item.annualValue}/yr</div>
            <div className="text-[10px] text-[#555]">3yr: {item.threeYearValue}</div>
          </div>
          {open ? <ChevronDown size={14} className="text-[#555]" /> : <ChevronRight size={14} className="text-[#555]" />}
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-[#1a1a1a] pt-3">
          {/* Formula */}
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-3">
            <div className="text-[10px] font-semibold text-[#555] uppercase mb-1">Formula</div>
            <div className="text-sm font-mono text-green-400">{item.formula}</div>
            <div className="text-[10px] text-[#666] mt-1">{item.formulaBreakdown}</div>
          </div>

          {/* Talk Track */}
          <div>
            <div className="text-[10px] font-semibold text-[#555] uppercase mb-1">💬 Talk Track</div>
            <p className="text-xs text-[#999] leading-relaxed">{item.talkTrack}</p>
          </div>

          {/* Uni Scenarios */}
          <div>
            <div className="text-[10px] font-semibold text-[#555] uppercase mb-1">🏫 University Scenarios</div>
            {item.uniScenarios.map((s, i) => (
              <div key={i} className="text-xs text-[#888] flex items-start gap-1.5 mt-1.5">
                <span className={`${item.color} opacity-50 mt-0.5`}>▸</span>
                <span>{s}</span>
              </div>
            ))}
          </div>

          {/* Real Examples */}
          <div>
            <div className="text-[10px] font-semibold text-[#555] uppercase mb-1">📊 Real-World Examples</div>
            {item.realExamples.map((ex, i) => (
              <div key={i} className="text-xs text-[#777] flex items-start gap-1.5 mt-1">
                <CheckCircle2 size={10} className="text-green-400/40 mt-0.5 shrink-0" />
                <span>{ex}</span>
              </div>
            ))}
          </div>

          {/* Verify */}
          <div className="bg-purple-500/5 border border-purple-500/10 rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <MessageSquare size={12} className="text-purple-400" />
              <span className="text-[10px] font-semibold text-purple-400 uppercase">Ask the Customer</span>
            </div>
            <p className="text-xs text-purple-300/80">{item.verifyQuestion}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GlasgowPage() {
  const totalFinancial = '£503.5K/yr';
  const totalHours = '5,735 hrs/yr';

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Link href="/value-engineering/projects" className="text-[#555] hover:text-white transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <span className="text-xs text-[#555]">Projects /</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Building2 size={24} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">University of Glasgow</h1>
            <p className="text-sm text-[#666]">Value Hypothesis Talk Track — Neurons for ITSM</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-[#555]">Financial Benefits</div>
            <div className="text-lg font-bold text-green-400">{totalFinancial}</div>
          </div>
          <div className="w-px h-8 bg-[#222]" />
          <div className="text-right">
            <div className="text-xs text-[#555]">Hours Saved</div>
            <div className="text-lg font-bold text-blue-400">{totalHours}</div>
          </div>
        </div>
      </div>

      {/* Context Banner */}
      <div className="bg-[#111] border border-[#222] rounded-xl p-4">
        <p className="text-xs text-[#888] leading-relaxed">
          <span className="text-white font-semibold">Context:</span> Glasgow is an existing ITSM customer with 400 concurrent analyst seats on a 4-year Enterprise Premium deal (~£308K/yr). 
          This hypothesis validates Neurons for ITSM value. All figures are conversation starters — invite the customer to correct every number.
          <span className="text-purple-400 font-medium"> Lead with AHT + Knowledge (£415K/yr combined = 80% of financial value).</span>
        </p>
      </div>

      {/* Inputs */}
      <div>
        <h2 className="text-sm font-semibold text-[#555] uppercase tracking-wider mb-3">📊 Initial Inputs & Key Data</h2>
        <div className="space-y-2">
          {inputs.map((item) => (
            <InputCard key={item.label} item={item} />
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div>
        <h2 className="text-sm font-semibold text-[#555] uppercase tracking-wider mb-3">💰 Benefit Talk Tracks</h2>
        <div className="space-y-2">
          {benefits.map((item) => (
            <BenefitCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Call Flow */}
      <div className="bg-[#111] border border-purple-500/20 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-purple-400 mb-3">🎯 Suggested Call Flow</h2>
        <div className="space-y-2">
          {[
            { step: '1', text: 'Open: "I\'ve done my homework on Glasgow — let me walk you through what I see, and you tell me where I\'m wrong."' },
            { step: '2', text: 'Walk through Initial Inputs first — invite corrections. This builds credibility.' },
            { step: '3', text: 'Lead with AHT + Knowledge: Biggest, most tangible, easiest to validate. They have ITSM data.' },
            { step: '4', text: 'Land the compliance story: Universities are under increasing regulatory scrutiny.' },
            { step: '5', text: 'Show employee impact: Not just IT savings — the whole university benefits.' },
            { step: '6', text: 'Close: "Which of these resonates most with what you\'re trying to solve? Let\'s dig deeper there."' },
          ].map((s) => (
            <div key={s.step} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold shrink-0">{s.step}</div>
              <p className="text-xs text-[#999] leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[10px] text-[#444] pt-4">
        Prepared for Erick Dronski | Value Engineering | Feb 2026
      </div>
    </div>
  );
}
