'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, ChevronDown, ChevronUp, MessageSquare, Settings, Zap, Monitor, Shield } from 'lucide-react';

type Question = {
  question: string;
  why: string; // why ask this — what it uncovers
  followUp?: string;
};

type Area = {
  area: string;
  questions: Question[];
};

type SolutionBank = {
  solution: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  areas: Area[];
};

const bank: SolutionBank[] = [
  {
    solution: 'ITSM',
    icon: <Settings size={16} />,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    areas: [
      {
        area: 'Incident & Ticket Management',
        questions: [
          { question: 'How many tickets does your service desk handle per month?', why: 'Baseline for AHT savings and deflection ROI. Also sizes the deal.', followUp: 'How does that break down between incidents vs. service requests?' },
          { question: 'What\'s your current average handle time per ticket?', why: 'Direct input to AHT reduction benefit. Anything above 25 min is a strong opportunity.', followUp: 'Has that changed year over year?' },
          { question: 'What percentage of tickets get escalated from L1 to L2 or L3?', why: 'Uncovers the escalation rate benefit. Above 25% is a clear pain signal.' },
          { question: 'How do tickets get routed today — is it manual triage or automated?', why: 'Opens the door to smart routing and priority classification benefits.' },
          { question: 'What\'s your #1 ticket category by volume?', why: 'Almost always password resets — which ZSO eliminates entirely.', followUp: 'Have you looked at what percentage are repeat issues that could be deflected?' },
        ],
      },
      {
        area: 'SLA & Compliance Exposure',
        questions: [
          { question: 'Do you have SLA penalties or compliance fines as part of your contracts or regulatory environment?', why: 'Unlocks the penalty avoidance benefit. Key for regulated industries.', followUp: 'What were your SLA breach costs in the last 12 months?' },
          { question: 'How do you currently ensure high-priority tickets get escalated immediately?', why: 'Opens the routing automation conversation. "Manually" = clear gap.' },
          { question: 'What happens when a P1 ticket gets misclassified as a lower priority?', why: 'Surfaces the real-world cost of routing failures. Emotional anchor for the benefit.' },
        ],
      },
      {
        area: 'Knowledge & Self-Service',
        questions: [
          { question: 'What\'s your current self-service adoption rate?', why: 'Most orgs are under 20%. Gap between current and 30-40% = significant deflection savings.', followUp: 'What\'s stopping employees from using it more?' },
          { question: 'How often does your team get the same question submitted as a new ticket?', why: 'Quantifies the knowledge gap. Repetitive tickets are pure waste.' },
          { question: 'How do you keep your knowledge base current and accurate?', why: 'If the answer is "we don\'t" or "manually" — KB automation is the pitch.' },
          { question: 'When an employee has an IT question today, what\'s their first instinct — submit a ticket, email IT, call the helpdesk, or look something up?', why: 'Diagnoses self-service culture maturity. "Call the helpdesk" = huge deflection opportunity.' },
        ],
      },
      {
        area: 'Change Management',
        questions: [
          { question: 'What percentage of your outages are caused by changes?', why: 'Industry average is 40-60%. High percentage = change management is broken.', followUp: 'How do you assess impact before approving a change?' },
          { question: 'When a change is proposed, how does your team evaluate what systems might be affected?', why: 'If the answer is "manually" or "from memory" — CMDB-informed change is the pitch.' },
          { question: 'How many changes per month require emergency approval, and what triggers that process?', why: 'High emergency change rate = poor planning and visibility, which CMDB fixes.' },
        ],
      },
      {
        area: 'Onboarding & Lifecycle',
        questions: [
          { question: 'How many people do you onboard per month?', why: 'Volume × automation savings = onboarding efficiency benefit.' },
          { question: 'How long does it take from a new hire\'s start date to them being fully provisioned?', why: 'Anything over 1 day is a strong pain point. Each day of delay = lost productivity.' },
          { question: 'When someone leaves, how quickly is their access revoked?', why: 'Security angle — delayed offboarding is an access risk. Emotionally resonant for security-conscious buyers.' },
          { question: 'How many departments are involved in onboarding — does IT coordinate with HR, facilities, security?', why: 'Cross-department coordination pain = ESM/HRSM upsell.' },
        ],
      },
    ],
  },
  {
    solution: 'ESM / LOB',
    icon: <Zap size={16} />,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
    areas: [
      {
        area: 'Asset & Contract Management',
        questions: [
          { question: 'How do you track your software licenses today — ITSM, spreadsheet, or a dedicated SAM tool?', why: 'Spreadsheet = asset management pain. Gap from best-practice = ITAM opportunity.' },
          { question: 'When was the last time you reviewed all your software contracts before renewal?', why: 'If they struggle to answer, shelfware and over-licensing are almost certainly present.' },
          { question: 'How many contracts auto-renewed last year without a usage review?', why: 'Every auto-renewal without review = potential wasted spend. Direct setup for vendor contract insights benefit.' },
          { question: 'If I asked you right now how many licenses you own for [key software], how quickly could you tell me?', why: 'Puts the asset visibility gap in concrete terms. Creates urgency around accuracy.' },
          { question: 'Do you have visibility into which employees are using which software licenses?', why: 'Usage visibility is the foundation of SAM savings. No = direct opportunity.' },
        ],
      },
      {
        area: 'Facilities & Energy',
        questions: [
          { question: 'What\'s your annual utilities/energy spend across facilities?', why: 'The bigger the number, the bigger the 5.6% savings. $6M+ = $346K+ in savings.', followUp: 'Do you have visibility into which buildings or systems drive that cost?' },
          { question: 'How do you manage predictive vs. reactive maintenance today?', why: 'High reactive ratio = predictive maintenance opportunity. Ask for the ratio.' },
          { question: 'How many emergency repairs did your facilities team respond to last year?', why: 'Each emergency costs 3-5x a planned repair. High number = strong case for predictive capabilities.' },
          { question: 'How do you track energy consumption across buildings — is it automated or manual meter reading?', why: 'Manual = data gap. No data = no optimization. Clear opportunity for FM platform.' },
        ],
      },
      {
        area: 'Compliance & GRC',
        questions: [
          { question: 'How many audits or compliance assessments does your team manage per year?', why: 'High audit load = high manual effort for evidence gathering = automation opportunity.', followUp: 'What does audit prep look like — how far in advance do you start?' },
          { question: 'What percentage of your compliance team\'s time is spent gathering evidence vs. actual risk analysis?', why: 'If it\'s more than 30% on evidence gathering, automation ROI is clear.' },
          { question: 'How do you track control effectiveness — is it continuous or point-in-time?', why: 'Point-in-time = gaps between assessments. Continuous monitoring is the upgrade.' },
        ],
      },
      {
        area: 'Project Portfolio',
        questions: [
          { question: 'What percentage of your projects deliver on time and on budget?', why: 'Industry average is ~50%. Below that = PPM is broken.', followUp: 'What do you think causes most of the slippage?' },
          { question: 'How do you decide which projects get funded when you have more requests than budget?', why: 'If the answer is "whoever presents best" — portfolio analytics is the pitch.' },
          { question: 'How much time does your PMO spend on manual status reporting?', why: 'Anything above 20% of their time on reports = automation opportunity.' },
        ],
      },
    ],
  },
  {
    solution: 'UEM',
    icon: <Monitor size={16} />,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    areas: [
      {
        area: 'Device Management & Compliance',
        questions: [
          { question: 'How many endpoints are you managing today — laptops, mobile, servers?', why: 'Sizes the deal and baseline for all UEM benefits.' },
          { question: 'How do you verify mobile device compliance today?', why: '"We don\'t" or "manually" = direct MDM automated compliance opportunity.' },
          { question: 'What\'s your device refresh cycle — is it based on age or actual device health?', why: 'Age-only refresh = over-spending on healthy devices. Data-driven = cost savings.' },
          { question: 'How do you support BYOD — do employees use personal devices for work?', why: 'BYOD = MDM complexity and security gap. Strong ESM/MDM upsell signal.' },
          { question: 'When a device is lost or stolen, how quickly can you remotely wipe it?', why: 'Slow answer = security gap. Measures incident response capability.' },
        ],
      },
      {
        area: 'Support & Helpdesk',
        questions: [
          { question: 'What percentage of your helpdesk tickets are device-related?', why: 'Higher % = bigger MDM support savings opportunity.' },
          { question: 'When a user has a device issue, does IT need physical access to fix it or can you do it remotely?', why: '"Need physical access" = remote management gap = MDM opportunity.' },
          { question: 'How do you handle software deployment to endpoints — is it automated or manual?', why: 'Manual deployment = IT hours wasted at scale. Automation pitch.' },
        ],
      },
      {
        area: 'Energy & Asset Lifecycle',
        questions: [
          { question: 'Do you have visibility into which endpoints are idle or no longer in active use?', why: 'Idle devices still draw power and hold licenses. Visibility = cost reduction.' },
          { question: 'How do you manage hardware maintenance contracts — do you know which devices are under warranty?', why: 'If uncertain = likely over-paying for coverage they don\'t need.' },
          { question: 'What\'s your process for decommissioning devices when employees leave?', why: 'Weak process = security risk + paying for unused licenses + energy waste.' },
        ],
      },
    ],
  },
  {
    solution: 'Security',
    icon: <Shield size={16} />,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    areas: [
      {
        area: 'Vulnerability & Patch Management',
        questions: [
          { question: 'How do you prioritize which vulnerabilities to patch first?', why: '"By CVSS score" or "we try to patch everything" = risk-based prioritization gap. RBVM pitch.' },
          { question: 'What\'s your average time from vulnerability announcement to patch deployed?', why: 'Anything over 72 hours for critical CVEs is a real exposure window. Quantifies risk.' },
          { question: 'When a zero-day drops, what\'s your emergency patching process?', why: 'Fire drill vs. automated response. Shows maturity gap.' },
          { question: 'How many security incidents in the last 12 months required formal incident response?', why: 'Each one had a cost. Connects to the RBVM incident avoidance benefit directly.' },
          { question: 'Do you have visibility into which vulnerabilities are currently being exploited in the wild?', why: '"No" = they\'re flying blind. Threat intelligence feed is the differentiator.' },
        ],
      },
      {
        area: 'Identity & Access',
        questions: [
          { question: 'What\'s your #1 helpdesk ticket category?', why: 'Almost always password resets. Unlocks the ZSO elimination benefit immediately.' },
          { question: 'How many password reset tickets did you process last month?', why: 'Specific volume × cost per ticket = instant ROI calculation they can\'t argue with.' },
          { question: 'How do employees authenticate today — passwords, MFA, or something else?', why: 'Password-heavy = breach risk + helpdesk burden. Both angles matter.' },
          { question: 'Have you had any credential-based security incidents?', why: 'Stolen credentials = #1 breach cause. Creates emotional urgency for ZSO.' },
        ],
      },
      {
        area: 'Remote Access',
        questions: [
          { question: 'How many different VPN or remote access solutions do you have?', why: 'Multiple solutions = sprawl, cost, management overhead. Consolidation pitch.' },
          { question: 'How do you manage access for contractors or third parties?', why: 'Often an ungoverned gap. Connects to zero-trust and Connect Secure benefits.' },
          { question: 'What\'s the user experience like with your current remote access — do employees complain about it?', why: 'Poor UX = shadow IT (personal VPNs, unsafe workarounds). Visibility and security gap.' },
          { question: 'How do you revoke remote access when a contractor engagement ends?', why: 'Manual or slow = access risk. Urgency for automated access management.' },
        ],
      },
      {
        area: 'Breach & Incident Readiness',
        questions: [
          { question: 'What\'s your annual data breach risk exposure — have you quantified it?', why: 'Opens the quantified risk conversation. Most orgs haven\'t done this formally.' },
          { question: 'When a security incident happens, how do you determine what systems are impacted?', why: '"We investigate" = no service mapping. Slow, expensive, reactive.' },
          { question: 'How do you test your incident response plan?', why: 'Tabletop exercises vs. automated response. Readiness gap = urgency.' },
          { question: 'What\'s the average cost of a security incident for your organization?', why: 'If they know, anchor to it. If they don\'t, use industry benchmarks ($4.45M average breach cost).' },
        ],
      },
    ],
  },
];

function AreaCard({ area }: { area: Area }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#222] rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#161616] transition-colors text-left bg-[#111]">
        <span className="text-white text-sm font-medium">{area.area}</span>
        <div className="flex items-center gap-2">
          <span className="text-[#555] text-xs">{area.questions.length} questions</span>
          {open ? <ChevronUp size={14} className="text-[#555]" /> : <ChevronDown size={14} className="text-[#555]" />}
        </div>
      </button>
      {open && (
        <div className="bg-[#0a0a0a] p-4 space-y-4">
          {area.questions.map((q, i) => (
            <div key={i} className="border border-[#1a1a1a] rounded-lg p-3">
              <div className="flex items-start gap-2 mb-2">
                <MessageSquare size={14} className="text-blue-400 mt-0.5 shrink-0" />
                <p className="text-white text-sm font-medium">&ldquo;{q.question}&rdquo;</p>
              </div>
              <p className="text-[#666] text-xs ml-6">→ {q.why}</p>
              {q.followUp && (
                <p className="text-[#555] text-xs ml-6 mt-1 italic">Follow-up: &ldquo;{q.followUp}&rdquo;</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DiscoveryQuestionsPage() {
  const [search, setSearch] = useState('');
  const [activeSolution, setActiveSolution] = useState<string>('all');

  const totalQuestions = bank.reduce((s, b) => s + b.areas.reduce((a, ar) => a + ar.questions.length, 0), 0);

  const filteredBank = bank
    .filter(b => activeSolution === 'all' || b.solution === activeSolution)
    .map(b => ({
      ...b,
      areas: b.areas.map(a => ({
        ...a,
        questions: a.questions.filter(q =>
          !search.trim() ||
          q.question.toLowerCase().includes(search.toLowerCase()) ||
          q.why.toLowerCase().includes(search.toLowerCase()) ||
          a.area.toLowerCase().includes(search.toLowerCase())
        ),
      })).filter(a => a.questions.length > 0),
    }))
    .filter(b => b.areas.length > 0);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Link href="/value-engineering/projects" className="inline-flex items-center gap-1.5 text-[#555] hover:text-white text-sm mb-4 transition-colors">
        <ArrowLeft size={14} /> Back to Projects
      </Link>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">❓ Discovery Question Bank</h2>
        <p className="text-[#555] text-sm">Questions that uncover pain and open the door to each benefit. Know what you&apos;re listening for.</p>
      </div>

      <div className="flex items-center gap-4 mb-5 px-4 py-3 bg-[#111] border border-[#222] rounded-lg">
        <div className="text-center"><div className="text-white font-bold text-lg">{totalQuestions}</div><div className="text-[#555] text-xs">Questions</div></div>
        {bank.map(b => (
          <div key={b.solution} className="flex items-center gap-2">
            <div className="w-px h-8 bg-[#222]" />
            <div className="text-center">
              <div className={`font-bold text-lg ${b.color}`}>{b.areas.reduce((s, a) => s + a.questions.length, 0)}</div>
              <div className="text-[#555] text-xs">{b.solution}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-6 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
          <input type="text" placeholder="Search questions..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#111] border border-[#222] rounded-lg text-white text-sm placeholder:text-[#444] focus:outline-none focus:border-[#333]" />
        </div>
        <div className="flex gap-1 flex-wrap">
          {['all', ...bank.map(b => b.solution)].map(sol => {
            const cfg = sol === 'all' ? null : bank.find(b => b.solution === sol);
            return (
              <button key={sol} onClick={() => setActiveSolution(sol)}
                className={`px-3 py-2 text-xs rounded-lg transition-colors ${
                  activeSolution === sol
                    ? cfg ? `${cfg.bgColor} ${cfg.color}` : 'bg-[#222] text-white'
                    : 'text-[#555] hover:text-[#888] hover:bg-[#111]'
                }`}>
                {sol === 'all' ? 'All' : sol}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-8">
        {filteredBank.map(b => (
          <div key={b.solution}>
            <div className={`flex items-center gap-2 mb-3 px-3 py-2 rounded-lg ${b.bgColor} border ${b.borderColor} w-fit`}>
              <span className={b.color}>{b.icon}</span>
              <span className={`text-sm font-semibold ${b.color}`}>{b.solution}</span>
            </div>
            <div className="space-y-2">
              {b.areas.map(a => <AreaCard key={a.area} area={a} />)}
            </div>
          </div>
        ))}
      </div>

      {filteredBank.length === 0 && (
        <div className="text-center py-12 text-[#555]">No questions match your search.</div>
      )}
    </div>
  );
}
