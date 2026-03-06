'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Search, DollarSign, Shield, AlertTriangle, Settings, TrendingDown, Ban, BookOpen, Calculator, MessageSquare } from 'lucide-react';

/* ────────────────────────────────────────────
   TYPES
   ──────────────────────────────────────────── */

type Benefit = {
  name: string;
  product: string;
  y1: string;
  y2: string;
  y3: string;
  total: string;
  story: string;
  assumptions: string[];
  howToExplain: string;
};

type Category = {
  name: string;
  icon: React.ReactNode;
  color: string;
  borderColor: string;
  bgColor: string;
  total3yr: string;
  benefits: Benefit[];
};

/* ────────────────────────────────────────────
   DATA — from Ivanti ROI Assessment PPTXs
   ──────────────────────────────────────────── */

const categories: Category[] = [
  {
    name: 'Breach Risk / Cost Mitigation',
    icon: <Shield size={18} />,
    color: 'text-red-400',
    borderColor: 'border-red-500/30',
    bgColor: 'bg-red-500/10',
    total3yr: '$16.1M',
    benefits: [
      {
        name: 'Reduce Data Breach Costs with Advanced Security',
        product: 'Ivanti Connect Secure',
        y1: '$222K', y2: '$222K', y3: '$222K', total: '$666K',
        story: 'Every organization is one breach away from millions in damages. Connect Secure modernizes your VPN architecture and integrates threat protection so remote access stays resilient. You\'re not just patching holes — you\'re reducing the likelihood of a breach happening in the first place.',
        assumptions: ['Annual Total Risk/Cost of Data Breaches: $4,440,000 (geographic average)', '5% reduction with improved security protocols'],
        howToExplain: '"Your total data breach exposure based on industry averages is about $4.4 million per year. We\'re not saying we eliminate all of that — we\'re saying with modernized VPN, integrated threat protection, and zero-trust security, you can realistically reduce that exposure by 5%. That gives you about $222,000 in annual risk reduction."',
      },
      {
        name: 'Improved Detection of External Threats',
        product: 'Neurons for EASM',
        y1: '$222K', y2: '$222K', y3: '$222K', total: '$666K',
        story: 'You can\'t protect what you can\'t see. EASM continuously scans your internet-facing assets — domains, IPs, cloud services — to find exposures before attackers do. It\'s like having a security guard patrolling your perimeter 24/7.',
        assumptions: ['Annual Total Risk/Cost of Data Breaches: $4,440,000', '5% reduction in incidents with improved endpoint visibility'],
        howToExplain: '"Same starting point — $4.4M in breach exposure. EASM gives you complete visibility of everything facing the internet. By catching misconfigurations and shadow IT before they become attack vectors, you reduce that risk by about 5%, saving roughly $222K per year."',
      },
      {
        name: 'Reduced Risk from Shadow IT',
        product: 'Neurons for EASM',
        y1: '$266.4K', y2: '$266.4K', y3: '$266.4K', total: '$799.2K',
        story: 'Shadow IT is the stuff your security team doesn\'t know exists — unapproved apps, forgotten cloud instances, rogue domains. EASM finds them automatically. Every one you discover and remediate is one less door for an attacker.',
        assumptions: ['Annual Total Risk/Cost of Data Breaches: $4,440,000', '6% reduction from eliminating Shadow IT exposure'],
        howToExplain: '"Shadow IT typically accounts for a meaningful chunk of breach risk. We estimate about 6% of your total breach exposure — around $266K — comes from assets your security team doesn\'t even know exist. EASM finds and surfaces those assets so you can lock them down."',
      },
      {
        name: 'Reduced Security Risks from Rogue Devices',
        product: 'Neurons Discovery',
        y1: '$310.8K', y2: '$310.8K', y3: '$310.8K', total: '$932.4K',
        story: 'Unmanaged devices on your network are ticking time bombs. Discovery finds every device — managed or not — so your security team can enforce policies everywhere. No more blind spots.',
        assumptions: ['Annual Total Risk/Cost of Data Breaches: $4,440,000', '7% reduction from eliminating rogue device exposure'],
        howToExplain: '"Rogue devices — things connected to your network that nobody\'s managing — are a significant risk vector. We estimate about 7% of breach risk, roughly $311K annually, comes from these unmanaged endpoints. Discovery gives you full visibility so nothing hides."',
      },
      {
        name: 'Reduced Risk with Improved Asset Visibility',
        product: 'Neurons for ITAM',
        y1: '$44.4K', y2: '$44.4K', y3: '$44.4K', total: '$133.2K',
        story: 'When you know exactly what assets you have, where they are, and what\'s running on them, your security posture improves automatically. ITAM gives you that single source of truth.',
        assumptions: ['Annual Total Risk/Cost of Data Breaches: $4,440,000', '1% reduction from improved asset tracking'],
        howToExplain: '"Better asset visibility means fewer surprises. Even a 1% improvement in your security posture through better tracking saves you about $44K per year against your $4.4M breach exposure."',
      },
      {
        name: 'Reduced Risk with Automated Security Compliance',
        product: 'Neurons for MDM',
        y1: '$536.8K', y2: '$536.8K', y3: '$536.8K', total: '$1.6M',
        story: 'Mobile devices are everywhere, and each one is a potential entry point. MDM automates security compliance across every device — enforcing policies, pushing updates, and locking down access without manual effort.',
        assumptions: ['Annual Total Risk/Cost of Data Breaches: $4,440,000', '~12% reduction from automated mobile security compliance'],
        howToExplain: '"Your mobile fleet is a significant attack surface. Automating security compliance across all managed devices reduces your breach exposure by about 12% — that\'s over $536K per year. No more chasing users to update their phones."',
      },
      {
        name: 'Reduce Lost Business Costs from Breaches',
        product: 'Ivanti MTD',
        y1: '$344.1K', y2: '$344.1K', y3: '$344.1K', total: '$1M',
        story: 'When a breach happens, the biggest cost isn\'t the fix — it\'s the lost business. Customers leave, deals stall, reputation takes a hit. MTD prevents mobile-originated breaches that cause that downstream damage.',
        assumptions: ['Annual Total Risk/Cost of Data Breaches: $4,440,000', 'Lost business component reduction through mobile threat defense'],
        howToExplain: '"The IBM Cost of a Data Breach report shows lost business is the largest cost category in a breach. MTD protects the mobile attack vector, reducing your exposure to those lost-business costs by about $344K per year."',
      },
      {
        name: 'Reduce Breach Detection and Escalation Costs',
        product: 'Ivanti MTD',
        y1: '$366.3K', y2: '$366.3K', y3: '$366.3K', total: '$1.1M',
        story: 'The longer a breach goes undetected, the more expensive it gets. MTD catches mobile threats early — phishing attempts, malicious apps, network attacks — so your team spends less time and money on detection and escalation.',
        assumptions: ['Annual Total Risk/Cost of Data Breaches: $4,440,000', 'Detection & escalation cost reduction through early mobile threat identification'],
        howToExplain: '"Detection and escalation are expensive — forensics, investigation, war rooms. By catching threats on mobile devices before they become full breaches, MTD saves your team about $366K per year in those detection and escalation costs."',
      },
      {
        name: 'Improve Post-Breach Response',
        product: 'Ivanti MTD',
        y1: '$299.7K', y2: '$299.7K', y3: '$299.7K', total: '$899.1K',
        story: 'Even when incidents happen, how fast you respond matters. MTD gives your team the visibility and context to contain mobile-related incidents faster, reducing the blast radius and recovery costs.',
        assumptions: ['Annual Total Risk/Cost of Data Breaches: $4,440,000', 'Post-breach response cost reduction'],
        howToExplain: '"Post-breach response — notification, legal, PR, remediation — adds up fast. MTD improves your response capabilities specifically around mobile incidents, saving about $300K per year in those post-incident costs."',
      },
      {
        name: 'Reduce Phishing & Malware Damage',
        product: 'Ivanti MTD',
        y1: '$270K', y2: '$270K', y3: '$270K', total: '$810K',
        story: 'Phishing is the #1 attack vector and mobile makes it worse — smaller screens, less context, users on the go. MTD blocks phishing links, detects malware, and prevents the damage before it starts.',
        assumptions: ['Average cleanup cost per malware incident: $15,000', 'Reduction in successful phishing/malware attacks on mobile devices'],
        howToExplain: '"Each malware incident costs about $15,000 to clean up. When you factor in phishing attacks that originate on mobile devices — which are harder for users to spot — the cumulative damage adds up to about $270K per year that MTD prevents."',
      },
      {
        name: 'Reduce Breach Notification Costs',
        product: 'Neurons for MDM',
        y1: '$99.9K', y2: '$99.9K', y3: '$99.9K', total: '$299.7K',
        story: 'Breach notifications are legally required and expensive — letters, call centers, credit monitoring. MDM prevents the device-level incidents that trigger those requirements.',
        assumptions: ['Annual Total Risk/Cost of Data Breaches: $4,440,000', 'Notification cost component reduction'],
        howToExplain: '"If a breach involves personal data, you\'re legally required to notify affected individuals. That process alone can cost hundreds of thousands. By preventing device-level incidents through MDM, you reduce that notification risk by about $100K per year."',
      },
      {
        name: 'Lower Breach Risk with Rule-Based Automation',
        product: 'Neurons for Patch Management',
        y1: '$888K', y2: '$888K', y3: '$888K', total: '$2.7M',
        story: 'Unpatched systems are the low-hanging fruit for attackers. Automated patching with smart rules closes vulnerabilities at scale — no more waiting for manual patch cycles while your systems sit exposed.',
        assumptions: ['Annual Total Risk/Cost of Data Breaches: $4,440,000', '20% reduction from automated, rule-based patching'],
        howToExplain: '"Unpatched vulnerabilities are involved in the majority of breaches. Automating your patching with intelligent rules — test, stage, deploy — reduces your breach exposure by about 20%. On a $4.4M risk baseline, that\'s $888K per year in avoided risk."',
      },
      {
        name: 'Reduced Organizational Exposure with Inventory Insights',
        product: 'Neurons Platform',
        y1: '$133.2K', y2: '$133.2K', y3: '$133.2K', total: '$399.6K',
        story: 'The Neurons platform gives you a centralized view of every asset and its security status. When you can see everything in one place, you can prioritize what needs attention and reduce your overall attack surface.',
        assumptions: ['Annual Total Risk/Cost of Data Breaches: $4,440,000', '3% reduction from centralized inventory visibility'],
        howToExplain: '"Having a single dashboard that shows every asset, its compliance status, and its risk level reduces your organizational exposure. Even a 3% improvement — about $133K per year — comes from simply knowing what you have and where your gaps are."',
      },
      {
        name: 'Proactive Vulnerability Management',
        product: 'Neurons for RBVM',
        y1: '$444K', y2: '$444K', y3: '$444K', total: '$1.3M',
        story: 'Not all vulnerabilities are equal. RBVM uses risk-based prioritization to fix the ones that matter most first — the ones actually being exploited in the wild — instead of chasing every CVE.',
        assumptions: ['Annual Total Risk/Cost of Data Breaches: $4,440,000', '10% reduction with risk-based vulnerability prioritization'],
        howToExplain: '"Instead of treating all vulnerabilities the same, RBVM prioritizes based on actual exploitability and business impact. This focused approach reduces your breach risk by about 10% — roughly $444K per year — because you\'re fixing the right things first."',
      },
      {
        name: 'Minimized Password-Based Breach Risk',
        product: 'Ivanti ZSO',
        y1: '$222K', y2: '$222K', y3: '$222K', total: '$666K',
        story: 'Stolen credentials are the #1 cause of breaches. Zero Sign-On eliminates passwords entirely — no passwords means nothing to steal, phish, or brute-force.',
        assumptions: ['Annual Total Risk/Cost of Data Breaches: $4,440,000', '5% reduction from eliminating password-based attack vectors'],
        howToExplain: '"Stolen or weak passwords cause the majority of breaches. ZSO eliminates passwords from the equation entirely. That alone reduces your breach exposure by about 5% — roughly $222K per year — because there\'s simply nothing to steal."',
      },
      {
        name: 'Enhanced Security Posture',
        product: 'Ivanti ZSO',
        y1: '$710.4K', y2: '$710.4K', y3: '$710.4K', total: '$2.1M',
        story: 'ZSO doesn\'t just eliminate passwords — it strengthens your entire security posture with certificate-based authentication, continuous device compliance checks, and zero-trust access. It\'s a foundational security upgrade.',
        assumptions: ['Annual Total Risk/Cost of Data Breaches: $4,440,000', '16% overall security posture improvement'],
        howToExplain: '"Beyond password elimination, ZSO enforces certificate-based auth, continuous compliance, and zero-trust principles. This comprehensive improvement to your security posture reduces breach risk by about 16% — over $710K per year."',
      },
    ],
  },
  {
    name: 'Penalties & Fines Avoidance',
    icon: <AlertTriangle size={18} />,
    color: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    bgColor: 'bg-amber-500/10',
    total3yr: '$787.5K',
    benefits: [
      {
        name: 'Reduced IT Fines for Non-Compliant Devices',
        product: 'Neurons Discovery',
        y1: '$17.5K', y2: '$17.5K', y3: '$17.5K', total: '$52.5K',
        story: 'Non-compliant devices that slip through the cracks can trigger regulatory fines. Discovery ensures you know about every device and its compliance status so nothing gets missed during an audit.',
        assumptions: ['Annual compliance penalty exposure: $250,000 (based on $50/employee × 5,000)', '7% reduction from improved device compliance visibility'],
        howToExplain: '"Your compliance penalty exposure is about $250K per year based on your employee count. Discovery catches non-compliant devices before auditors do, reducing that fine risk by about 7% — roughly $17.5K per year."',
      },
      {
        name: 'Reduce Risk with Live Visibility',
        product: 'Neurons Edge Intelligence',
        y1: '$20K', y2: '$20K', y3: '$20K', total: '$60K',
        story: 'Edge Intelligence gives you real-time data from every endpoint — CPU, disk, software, compliance status — without waiting for scheduled scans. When an auditor asks a question, you have the answer immediately.',
        assumptions: ['Annual compliance penalty exposure: $250,000', '8% reduction from real-time endpoint visibility'],
        howToExplain: '"Real-time visibility into every endpoint means you\'re never caught off guard during an audit. That reduces your $250K penalty exposure by about 8% — roughly $20K per year."',
      },
      {
        name: 'Improve Compliance with Asset Tracking',
        product: 'Neurons for ITAM',
        y1: '$62.5K', y2: '$62.5K', y3: '$62.5K', total: '$187.5K',
        story: 'Knowing what you own, where it is, and what\'s running on it is compliance 101. ITAM gives you that complete picture so you can prove compliance instead of scrambling during audit season.',
        assumptions: ['Annual compliance penalty exposure: $250,000', '25% reduction from comprehensive asset tracking'],
        howToExplain: '"The biggest compliance risk is not knowing what you have. ITAM gives you a complete, auditable inventory. That alone reduces your penalty exposure by about 25% — roughly $62.5K per year."',
      },
      {
        name: 'High Priority Ticket Routing',
        product: 'Neurons for ITSM',
        y1: '$50K', y2: '$50K', y3: '$50K', total: '$150K',
        story: 'When a compliance-critical issue comes in, it needs to get to the right person immediately — not sit in a queue. ITSM\'s smart routing ensures high-priority tickets get handled fast, reducing compliance risk from delayed responses.',
        assumptions: ['Annual compliance penalty exposure: $250,000', '20% reduction from improved SLA compliance on critical tickets'],
        howToExplain: '"Missing SLAs on compliance-critical tickets can trigger penalties. Smart routing ensures those tickets get to the right team instantly, reducing that risk by about 20% — roughly $50K per year."',
      },
      {
        name: 'Streamlined Auditing and Compliance',
        product: 'Neurons for MDM',
        y1: '$37.5K', y2: '$37.5K', y3: '$37.5K', total: '$112.5K',
        story: 'Mobile compliance is often the weak link in audits. MDM gives you automatic compliance reporting across every managed device so you can demonstrate compliance instantly.',
        assumptions: ['Annual compliance penalty exposure: $250,000', '15% reduction from automated mobile compliance'],
        howToExplain: '"Mobile devices are increasingly in-scope for compliance audits. MDM automates that compliance across your entire fleet, reducing penalty risk by about 15% — roughly $37.5K per year."',
      },
      {
        name: 'Automated Policy Enforcement',
        product: 'Ivanti MTD',
        y1: '$37.5K', y2: '$37.5K', y3: '$37.5K', total: '$112.5K',
        story: 'MTD automatically enforces security policies on mobile devices — no manual intervention needed. When policies are enforced consistently, compliance gaps disappear.',
        assumptions: ['Annual compliance penalty exposure: $250,000', '15% reduction from automated mobile security policy enforcement'],
        howToExplain: '"Inconsistent policy enforcement is a compliance red flag. MTD enforces policies automatically across every mobile device, reducing your penalty exposure by about 15% — roughly $37.5K per year."',
      },
      {
        name: 'Secure Compliance & Lower Penalty Exposure',
        product: 'Neurons for RBVM',
        y1: '$37.5K', y2: '$37.5K', y3: '$37.5K', total: '$112.5K',
        story: 'RBVM helps you prove that you\'re actively managing vulnerabilities — which is exactly what regulators want to see. Documented, risk-based remediation shows you\'re taking security seriously.',
        assumptions: ['Annual compliance penalty exposure: $250,000', '15% reduction from documented vulnerability management'],
        howToExplain: '"Regulators want to see you\'re actively managing vulnerabilities, not just scanning for them. RBVM gives you that documented, risk-based approach, reducing your penalty exposure by about 15% — roughly $37.5K per year."',
      },
    ],
  },
  {
    name: 'Optimized Asset Management',
    icon: <Settings size={18} />,
    color: 'text-blue-400',
    borderColor: 'border-blue-500/30',
    bgColor: 'bg-blue-500/10',
    total3yr: '$1M',
    benefits: [
      {
        name: 'Software Usage Optimization',
        product: 'Neurons Discovery',
        y1: '$72K', y2: '$72K', y3: '$72K', total: '$216K',
        story: 'Most organizations are paying for software licenses nobody uses. Discovery shows you exactly what\'s installed, what\'s being used, and what you can reclaim. It\'s like finding money in your couch cushions — except it\'s tens of thousands.',
        assumptions: ['Annual Software Costs: $5,000,000 ($1,000/employee)', 'Estimated Overspend: 10%', 'Reclaim ~1.4% through usage visibility'],
        howToExplain: '"You\'re spending about $5M per year on software. Industry data shows 10-25% of that is wasted on unused licenses. Discovery shows you exactly which licenses aren\'t being used so you can reclaim them. Even reclaiming a small percentage saves you about $72K per year."',
      },
      {
        name: 'Enhanced Hardware Visibility',
        product: 'Neurons Discovery',
        y1: '$54K', y2: '$54K', y3: '$54K', total: '$162K',
        story: 'How many devices do you actually have? Most IT teams can\'t answer that accurately. Discovery gives you a complete, real-time hardware inventory — which means smarter purchasing decisions and less waste.',
        assumptions: ['Number of endpoint devices: 10,000', 'Hardware overspend reduction through accurate inventory'],
        howToExplain: '"With 10,000 endpoints, you need accurate hardware visibility to avoid over-purchasing and wasted spend. Discovery gives you that real-time inventory, saving about $54K per year in smarter hardware decisions."',
      },
      {
        name: 'Predictive Analytics for Asset Performance',
        product: 'Neurons Edge Intelligence',
        y1: '$36K', y2: '$36K', y3: '$36K', total: '$108K',
        story: 'Instead of replacing devices on a fixed schedule, Edge Intelligence tells you which ones actually need attention. Predictive analytics means you replace assets when they need it, not before — saving money and reducing waste.',
        assumptions: ['Number of endpoint devices: 10,000', 'Cost savings from predictive vs. scheduled asset replacement'],
        howToExplain: '"Instead of replacing devices every 3 years whether they need it or not, Edge Intelligence predicts which ones are actually degrading. That data-driven approach saves about $36K per year by extending the life of healthy devices."',
      },
      {
        name: 'Automated Fixes Prevent Device Issues',
        product: 'Neurons for Healing',
        y1: '$18K', y2: '$18K', y3: '$18K', total: '$54K',
        story: 'Healing automatically detects and fixes common device issues — before users even notice. That means fewer tickets, less downtime, and devices that last longer because they\'re always in good shape.',
        assumptions: ['Reduction in device-related incidents through automated self-healing'],
        howToExplain: '"Self-healing automation catches and fixes device issues before they become tickets. Fewer issues means devices stay healthier longer, saving about $18K per year in avoided replacements and reduced support costs."',
      },
      {
        name: 'Centralized Application Inventory',
        product: 'Neurons for ITAM',
        y1: '$50K', y2: '$50K', y3: '$50K', total: '$150K',
        story: 'Knowing every application in your environment — who installed it, who\'s using it, what version — gives you control. ITAM centralizes that inventory so you can make informed decisions about renewals, consolidation, and security.',
        assumptions: ['Annual Software Costs: $5,000,000', '1% savings from centralized application visibility and consolidation'],
        howToExplain: '"A centralized app inventory lets you identify duplicate tools, negotiate better contracts, and consolidate vendors. Even a 1% improvement on your $5M software spend saves $50K per year."',
      },
      {
        name: 'Reduced Hardware Overspend',
        product: 'Neurons for ITAM',
        y1: '$80K', y2: '$80K', y3: '$80K', total: '$240K',
        story: 'Without accurate asset data, organizations buy more hardware than they need. ITAM shows you what you have, what\'s available, and what\'s underutilized — so you buy only what you actually need.',
        assumptions: ['Number of endpoint devices: 10,000', 'Reduction in unnecessary hardware purchases through accurate tracking'],
        howToExplain: '"With 10,000 devices, even small over-purchasing adds up fast. ITAM gives you accurate data on what you have and what\'s underutilized, reducing hardware overspend by about $80K per year."',
      },
      {
        name: 'Improved Asset Visibility',
        product: 'Neurons Platform',
        y1: '$31.5K', y2: '$31.5K', y3: '$31.5K', total: '$94.5K',
        story: 'The Neurons platform ties all your asset data together into one unified view. That cross-product visibility helps you spot inefficiencies and make better decisions across your entire IT estate.',
        assumptions: ['Improved decision-making from unified asset dashboard'],
        howToExplain: '"When all your asset data lives in one place, you spot things you\'d miss in silos — redundant tools, underused hardware, compliance gaps. That unified visibility saves about $31.5K per year in smarter decisions."',
      },
    ],
  },
  {
    name: 'Operational Efficiencies',
    icon: <TrendingDown size={18} />,
    color: 'text-green-400',
    borderColor: 'border-green-500/30',
    bgColor: 'bg-green-500/10',
    total3yr: '$8.6M',
    benefits: [
      {
        name: 'Reduce Escalated AHT with AI Incident Summarization',
        product: 'Neurons for AITSM',
        y1: '$234.5K', y2: '$234.5K', y3: '$234.5K', total: '$703.5K',
        story: 'When tickets get escalated, the next analyst wastes time re-reading the entire history. AI summarization gives them the key context in seconds — so they can start fixing instead of reading.',
        assumptions: ['Annual Tickets: 60,000', 'Average Handle Time: 0.5 hours', 'IT FTE Salary: $89,000', 'Reduction in escalated ticket handle time through AI summarization'],
        howToExplain: '"Your team handles about 60,000 tickets per year. When tickets escalate, the next analyst spends time re-reading everything. AI summarization cuts that re-read time dramatically, saving about $234.5K per year in analyst productivity."',
      },
      {
        name: 'Smarter Self-Service with AI',
        product: 'Neurons for AITSM',
        y1: '$156.3K', y2: '$156.3K', y3: '$156.3K', total: '$469K',
        story: 'AI-powered self-service means employees can resolve their own issues without submitting a ticket. The AI understands what they need and guides them to the answer — reducing ticket volume and making everyone happier.',
        assumptions: ['Annual Tickets: 60,000', 'Ticket deflection through AI-powered self-service'],
        howToExplain: '"A significant portion of your 60,000 annual tickets are things employees could resolve themselves with the right guidance. AI-powered self-service deflects those tickets, saving your team about $156K per year."',
      },
      {
        name: 'Take Knowledge Management to the Next Level with AI',
        product: 'Neurons for AITSM',
        y1: '$111.3K', y2: '$111.3K', y3: '$111.3K', total: '$333.8K',
        story: 'Your knowledge base is only useful if people can find what they need. AI makes your KB smarter — auto-generating articles from resolved tickets, suggesting relevant content, and keeping everything current.',
        assumptions: ['Dedicated Knowledge Management FTEs: 5', 'Efficiency gains in KB creation and maintenance through AI'],
        howToExplain: '"You have about 5 FTEs dedicated to knowledge management. AI automates article creation from resolved tickets and keeps content current, making those 5 people significantly more productive — saving about $111K per year."',
      },
      {
        name: 'Streamline Endpoint Security & Incident Response',
        product: 'Ivanti Connect Secure',
        y1: '$52K', y2: '$52K', y3: '$52K', total: '$156K',
        story: 'Connect Secure centralizes endpoint security management so your team spends less time jumping between tools and more time actually responding to incidents.',
        assumptions: ['IT Staff Total Headcount: 125', 'Time savings from centralized endpoint security management'],
        howToExplain: '"With 125 IT staff, even small efficiency gains add up. Centralizing endpoint security through Connect Secure saves your team about $52K per year in reduced context-switching and faster incident response."',
      },
      {
        name: 'Reduced Ticket Volume',
        product: 'Neurons for Healing',
        y1: '$78.2K', y2: '$78.2K', y3: '$78.2K', total: '$234.5K',
        story: 'Every ticket that Healing prevents is one your analysts don\'t have to touch. Self-healing automation fixes device issues proactively — before users even notice — which means fewer tickets hitting your queue.',
        assumptions: ['Annual Tickets: 60,000', 'Ticket reduction through proactive self-healing'],
        howToExplain: '"Out of your 60,000 annual tickets, a meaningful percentage are device issues that could be auto-fixed. Healing catches and resolves those proactively, reducing your ticket volume and saving about $78K per year."',
      },
      {
        name: 'Improved Asset Lifecycle Management',
        product: 'Neurons for ITAM',
        y1: '$37.4K', y2: '$37.4K', y3: '$37.4K', total: '$112.1K',
        story: 'Managing the full lifecycle of an asset — from procurement to retirement — is complex. ITAM automates the tedious parts so your team can focus on strategic decisions instead of spreadsheet tracking.',
        assumptions: ['IT Staff Total Headcount: 125', 'Time savings from automated lifecycle tracking'],
        howToExplain: '"Your IT team spends significant time manually tracking asset lifecycles. ITAM automates procurement, deployment, maintenance, and retirement workflows, saving about $37K per year in operational efficiency."',
      },
      {
        name: 'Reduced Incident Average Handle Time (AHT)',
        product: 'Neurons for ITSM',
        y1: '$171.6K', y2: '$171.6K', y3: '$171.6K', total: '$514.8K',
        story: 'Every minute an analyst spends on a ticket costs money. ITSM reduces AHT through better workflows, smarter routing, and contextual information — so analysts resolve issues faster.',
        assumptions: ['Annual Tickets: 60,000', 'Average Handle Time: 0.5 hours', 'IT FTE hourly rate: ~$52', 'AHT reduction through improved workflows'],
        howToExplain: '"At 60,000 tickets per year and 30 minutes average handle time, that\'s 30,000 hours of analyst time. Reducing AHT by even a modest percentage through better workflows and routing saves about $171.6K per year."',
      },
      {
        name: 'Service Desk Productivity (More Tickets per Analyst)',
        product: 'Neurons for ITSM',
        y1: '$156K', y2: '$156K', y3: '$156K', total: '$468K',
        story: 'When your service desk tools work smoothly — intuitive interface, smart suggestions, automated categorization — each analyst handles more tickets per day. Same team, more throughput.',
        assumptions: ['IT Staff Total Headcount: 125', 'Productivity improvement per service desk analyst'],
        howToExplain: '"Better tooling means each analyst processes more tickets per shift. Across your service desk team, that productivity improvement translates to about $156K per year — without adding headcount."',
      },
      {
        name: 'Linking Assets to Owners',
        product: 'Neurons for ITSM',
        y1: '$12.5K', y2: '$12.5K', y3: '$12.5K', total: '$37.4K',
        story: 'When a ticket comes in about a specific device, knowing who owns it and its full history saves time. ITSM automatically links assets to their owners for instant context.',
        assumptions: ['Time savings from automatic asset-to-owner mapping'],
        howToExplain: '"How much time does your team spend figuring out who owns a device or what\'s installed on it? Automatic asset-to-owner linking saves about $12.5K per year in that lookup time."',
      },
      {
        name: 'Improve Maintenance Efficiency via Predictive & Preventative Capabilities',
        product: 'Neurons for LOB (FM)',
        y1: '$173.4K', y2: '$173.4K', y3: '$173.4K', total: '$520.2K',
        story: 'For facilities management, predictive maintenance means fixing things before they break — saving money on emergency repairs and extending equipment life.',
        assumptions: ['FM Maintenance Staff FTEs: 60', 'FM Maintenance Fully Loaded Salary: $80,776', 'Efficiency gains from predictive maintenance'],
        howToExplain: '"With 60 maintenance staff, predictive capabilities help them prioritize work based on actual equipment condition rather than fixed schedules. That smarter approach saves about $173K per year in labor efficiency."',
      },
      {
        name: 'Automated & Integrated Compliance Management',
        product: 'Neurons for LOB (GRC)',
        y1: '$233.4K', y2: '$233.4K', y3: '$233.4K', total: '$700.3K',
        story: 'Compliance management is a massive time sink — gathering evidence, filling out assessments, tracking controls. GRC automates the tedious parts so your compliance team focuses on actual risk.',
        assumptions: ['Compliance Staff FTEs: 12', 'Compliance Staff Salary: $114,400', 'Audit Staff FTEs: 6', 'Efficiency gains from automated compliance workflows'],
        howToExplain: '"Between your 12 compliance staff and 6 audit staff, a huge amount of time goes to manual evidence gathering and report generation. Automating those workflows saves about $233K per year."',
      },
      {
        name: 'Streamline Employee Onboarding & Transitions',
        product: 'Neurons for LOB (HRSM)',
        y1: '$75K', y2: '$75K', y3: '$75K', total: '$225K',
        story: 'New hire onboarding touches IT, HR, facilities, and security. HRSM coordinates all those workflows automatically so nothing falls through the cracks and new hires are productive faster.',
        assumptions: ['HRSM Staff FTEs: 20', 'HRSM Fully Loaded Salary: $103,886', 'Time savings from automated onboarding workflows'],
        howToExplain: '"Onboarding coordination across departments is manual and error-prone. Automating those workflows across your 20 HR staff saves about $75K per year and gets new hires productive faster."',
      },
      {
        name: 'Improve Project Delivery Predictability',
        product: 'Neurons for LOB (PPM)',
        y1: '$90.7K', y2: '$90.7K', y3: '$90.7K', total: '$272.1K',
        story: 'PMO teams struggle with project visibility and predictability. PPM gives you real-time dashboards, resource forecasting, and automated status updates so projects stay on track.',
        assumptions: ['PMO Staff FTEs: 15', 'PMO Fully Loaded Salary: $100,750', 'Productivity improvement from better project visibility'],
        howToExplain: '"Your 15 PMO staff spend significant time on status reporting and resource juggling. PPM automates that, improving delivery predictability and saving about $90.7K per year."',
      },
      {
        name: 'Make Smarter Portfolio Investment Decisions',
        product: 'Neurons for LOB (PPM)',
        y1: '$60.5K', y2: '$60.5K', y3: '$60.5K', total: '$181.4K',
        story: 'PPM gives leadership the data to make better investment decisions — which projects to fund, which to cut, and where resources should go for maximum impact.',
        assumptions: ['PMO Staff FTEs: 15', 'Better resource allocation through portfolio analytics'],
        howToExplain: '"Better portfolio visibility means better investment decisions. Your PMO team can allocate resources more effectively, saving about $60.5K per year through smarter project prioritization."',
      },
      {
        name: 'Automated Security Compliance',
        product: 'Neurons for MDM',
        y1: '$208K', y2: '$208K', y3: '$208K', total: '$624K',
        story: 'Manually checking every mobile device for compliance is impossible at scale. MDM automates those checks and enforces policies automatically, freeing your security team for higher-value work.',
        assumptions: ['Number of endpoint devices: 10,000', 'IT Staff Total Headcount: 125', 'Time savings from automated mobile compliance checks'],
        howToExplain: '"With 10,000 devices, manual compliance checks don\'t scale. MDM automates those across your entire fleet, saving about $208K per year in security team time."',
      },
      {
        name: 'Reduced IT Support Costs',
        product: 'Neurons for MDM',
        y1: '$468K', y2: '$468K', y3: '$468K', total: '$1.4M',
        story: 'MDM reduces the number of device-related support tickets by enabling remote troubleshooting, automated fixes, and self-service device management. Less support needed = lower costs.',
        assumptions: ['Annual Tickets: 60,000', 'IT FTE Salary: $89,000', 'Ticket reduction from remote device management capabilities'],
        howToExplain: '"A significant portion of your 60,000 tickets are device issues. MDM enables remote troubleshooting and self-service, reducing those tickets dramatically — saving about $468K per year in support costs."',
      },
      {
        name: 'Elimination of Password Resets',
        product: 'Ivanti ZSO',
        y1: '$561.6K', y2: '$561.6K', y3: '$561.6K', total: '$1.7M',
        story: 'Password resets are the #1 help desk ticket. ZSO eliminates them entirely — no passwords means no resets. That\'s a massive productivity win for both your help desk and your employees.',
        assumptions: ['Number of employees: 5,000', 'Password reset tickets as % of total volume', 'IT FTE hourly rate: ~$52', 'Complete elimination of password reset workload'],
        howToExplain: '"Password resets are typically 20-30% of help desk tickets. With 5,000 employees, that\'s a massive volume. ZSO eliminates passwords entirely — no passwords, no resets — saving about $561.6K per year."',
      },
    ],
  },
  {
    name: 'Direct Cost Reductions',
    icon: <DollarSign size={18} />,
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    bgColor: 'bg-emerald-500/10',
    total3yr: '$2.7M',
    benefits: [
      {
        name: 'Optimize Remote Access Costs',
        product: 'Ivanti Connect Secure',
        y1: '$350K', y2: '$350K', y3: '$350K', total: '$1.1M',
        story: 'Legacy VPN solutions are expensive and over-provisioned. Connect Secure modernizes your remote access with better technology at a lower cost — fewer licenses, better performance, less hardware.',
        assumptions: ['Current VPN/remote access infrastructure costs', 'Savings from modernized, consolidated remote access'],
        howToExplain: '"Your current remote access infrastructure likely involves multiple legacy VPN solutions. Consolidating onto Connect Secure reduces licensing, hardware, and management costs by about $350K per year."',
      },
      {
        name: 'Smarter Device Insights',
        product: 'Neurons Workspace',
        y1: '$3.5K', y2: '$3.5K', y3: '$3.5K', total: '$10.5K',
        story: 'Workspace gives IT detailed device insights that help make smarter decisions about device refresh, configuration, and support — reducing unnecessary spending.',
        assumptions: ['Improved decision-making from device analytics'],
        howToExplain: '"Better device insights lead to smarter purchasing and support decisions. The savings are modest but real — about $3.5K per year from more informed device management."',
      },
      {
        name: 'Reduced Hardware Maintenance Costs',
        product: 'Neurons for ITAM',
        y1: '$50K', y2: '$50K', y3: '$50K', total: '$150K',
        story: 'When you know exactly what hardware you have and its condition, you can negotiate better maintenance contracts, retire end-of-life equipment, and avoid paying for coverage you don\'t need.',
        assumptions: ['Number of endpoint devices: 10,000', 'Savings from optimized maintenance contracts'],
        howToExplain: '"With 10,000 devices, you\'re paying for maintenance contracts on all of them. ITAM helps you identify end-of-life equipment, consolidate contracts, and stop paying for coverage you don\'t need — saving about $50K per year."',
      },
      {
        name: 'Reduced Energy Consumption',
        product: 'Neurons for ITAM',
        y1: '$4.5K', y2: '$4.5K', y3: '$4.5K', total: '$13.5K',
        story: 'ITAM helps identify devices that should be powered down, decommissioned, or consolidated — reducing your energy footprint.',
        assumptions: ['Number of endpoint devices: 10,000', 'Energy savings from better device lifecycle management'],
        howToExplain: '"Identifying idle or end-of-life devices that are still drawing power saves a small but real amount — about $4.5K per year in energy costs."',
      },
      {
        name: 'Vendor Contract Insights',
        product: 'Neurons for ITAM',
        y1: '$50K', y2: '$50K', y3: '$50K', total: '$150K',
        story: 'ITAM gives you the data to negotiate better vendor contracts — usage metrics, license counts, renewal dates — so you go into every negotiation with leverage.',
        assumptions: ['Annual Software Costs: $5,000,000', 'Savings from data-driven vendor negotiations'],
        howToExplain: '"You\'re spending $5M on software. ITAM gives you usage data and contract visibility so you can negotiate from a position of strength — saving about $50K per year through better deals."',
      },
      {
        name: 'Energy & Utility Cost Optimization Through Data-Driven Operations',
        product: 'Neurons for LOB (FM)',
        y1: '$346.6K', y2: '$346.6K', y3: '$346.6K', total: '$1M',
        story: 'For facilities teams managing 250,000 sqm, data-driven operations can dramatically reduce energy and utility costs. IoT sensors, automated controls, and analytics identify waste and optimize consumption.',
        assumptions: ['FM Facilities Area: 250,000 sqm', 'FM Annual Utilities Cost: $6,190,000', 'Savings from data-driven energy optimization'],
        howToExplain: '"Your facilities are spending about $6.2M per year on utilities across 250,000 sqm. Data-driven optimization — smart controls, usage analytics, waste identification — reduces that by about 5.6%, saving roughly $347K per year."',
      },
      {
        name: 'Reduce Zero-Day Defense Cost',
        product: 'Neurons for Patch Management',
        y1: '$93.6K', y2: '$93.6K', y3: '$93.6K', total: '$280.8K',
        story: 'Responding to zero-day vulnerabilities is expensive and chaotic. Automated patching with Patch Management means you can deploy critical patches in hours instead of days, reducing the emergency response cost.',
        assumptions: ['Annual number of smaller scale exploits: 5', 'Exploit response and downtime cost per event: $69,800', 'Reduction in zero-day response costs through automation'],
        howToExplain: '"You experience roughly 5 smaller-scale exploit events per year, each costing about $70K in response and downtime. Automated patching reduces both the number and cost of those events, saving about $93.6K per year."',
      },
    ],
  },
  {
    name: 'Cost Avoidance',
    icon: <Ban size={18} />,
    color: 'text-purple-400',
    borderColor: 'border-purple-500/30',
    bgColor: 'bg-purple-500/10',
    total3yr: '$1.6M',
    benefits: [
      {
        name: 'Minimise Incident Response and Downtime Costs',
        product: 'Neurons for RBVM',
        y1: '$349K', y2: '$349K', y3: '$349K', total: '$1M',
        story: 'Every vulnerability that gets exploited triggers an incident response — forensics, containment, recovery. RBVM reduces the number of exploitable vulnerabilities by fixing the riskiest ones first.',
        assumptions: ['Annual number of smaller scale exploits: 5', 'Exploit response and downtime cost per event: $69,800', 'Exploit downtime: 8 hours at $5,600/hour', 'Reduction in exploitable vulnerabilities'],
        howToExplain: '"You experience about 5 exploit events per year, each costing roughly $70K when you add up incident response ($25K), data restoration ($30K), and downtime (8 hours at $5,600/hour). RBVM reduces the number of those events by prioritizing the most dangerous vulnerabilities, saving about $349K per year."',
      },
      {
        name: 'Reduce Exploitation Recovery Costs',
        product: 'Neurons for RBVM',
        y1: '$200K', y2: '$200K', y3: '$200K', total: '$600K',
        story: 'After an exploit, recovery is expensive — rebuilding systems ($10K), restoring data ($30K), incident response ($25K). Fewer exploits means less recovery spending.',
        assumptions: ['System Rebuild Cost: $10,000/event', 'Data Restoration Cost: $30,000/event', 'Incident Response Cost: $25,000/event', 'Reduction in number of successful exploits'],
        howToExplain: '"Each exploitation event costs about $65K just in recovery — system rebuilds, data restoration, and incident response. By reducing the number of successful exploits through proactive vulnerability management, you avoid about $200K per year in those recovery costs."',
      },
    ],
  },
];

/* ────────────────────────────────────────────
   COMPONENTS
   ──────────────────────────────────────────── */

function BenefitCard({ benefit }: { benefit: Benefit }) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'story' | 'math' | 'explain'>('story');

  return (
    <div className="border border-[#222] rounded-lg bg-[#111] overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#161616] transition-colors text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-white text-sm font-medium truncate">{benefit.name}</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[#555] text-xs">{benefit.product}</span>
            <span className="text-emerald-400 text-xs font-mono font-bold">{benefit.total} (3yr)</span>
          </div>
        </div>
        <div className="flex items-center gap-3 ml-3 shrink-0">
          <div className="hidden sm:flex gap-2 text-xs font-mono">
            <span className="text-[#555]">Y1: <span className="text-[#888]">{benefit.y1}</span></span>
            <span className="text-[#555]">Y2: <span className="text-[#888]">{benefit.y2}</span></span>
            <span className="text-[#555]">Y3: <span className="text-[#888]">{benefit.y3}</span></span>
          </div>
          {expanded ? <ChevronUp size={16} className="text-[#555]" /> : <ChevronDown size={16} className="text-[#555]" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-[#222] px-4 py-4">
          {/* Tabs */}
          <div className="flex gap-1 mb-4">
            {[
              { key: 'story' as const, label: 'The Story', icon: <BookOpen size={12} /> },
              { key: 'math' as const, label: 'Key Assumptions', icon: <Calculator size={12} /> },
              { key: 'explain' as const, label: 'How to Explain', icon: <MessageSquare size={12} /> },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-colors ${
                  activeTab === tab.key
                    ? 'bg-[#222] text-white'
                    : 'text-[#555] hover:text-[#888] hover:bg-[#1a1a1a]'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'story' && (
            <p className="text-[#999] text-sm leading-relaxed">{benefit.story}</p>
          )}

          {activeTab === 'math' && (
            <ul className="space-y-1.5">
              {benefit.assumptions.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-emerald-400 mt-0.5">→</span>
                  <span className="text-[#999]">{a}</span>
                </li>
              ))}
            </ul>
          )}

          {activeTab === 'explain' && (
            <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-4">
              <p className="text-[#ccc] text-sm leading-relaxed italic">{benefit.howToExplain}</p>
            </div>
          )}

          {/* Mobile Y1/Y2/Y3 */}
          <div className="sm:hidden flex gap-3 mt-4 pt-3 border-t border-[#1a1a1a] text-xs font-mono">
            <span className="text-[#555]">Y1: <span className="text-[#888]">{benefit.y1}</span></span>
            <span className="text-[#555]">Y2: <span className="text-[#888]">{benefit.y2}</span></span>
            <span className="text-[#555]">Y3: <span className="text-[#888]">{benefit.y3}</span></span>
          </div>
        </div>
      )}
    </div>
  );
}

function CategorySection({ category }: { category: Category }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`border ${category.borderColor} rounded-xl overflow-hidden`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full px-5 py-4 flex items-center justify-between ${category.bgColor} hover:brightness-110 transition-all text-left`}
      >
        <div className="flex items-center gap-3">
          <span className={category.color}>{category.icon}</span>
          <div>
            <h3 className="text-white font-semibold text-sm">{category.name}</h3>
            <span className="text-[#555] text-xs">{category.benefits.length} benefits</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`${category.color} font-mono font-bold text-lg`}>{category.total3yr}</span>
          <span className="text-[#555] text-xs">3yr</span>
          {expanded ? <ChevronUp size={18} className="text-[#555]" /> : <ChevronDown size={18} className="text-[#555]" />}
        </div>
      </button>

      {expanded && (
        <div className="p-4 space-y-2 bg-[#0a0a0a]">
          {category.benefits.map((b) => (
            <BenefitCard key={b.name} benefit={b} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────
   MAIN PAGE
   ──────────────────────────────────────────── */

export default function StudyGuidePage() {
  const [search, setSearch] = useState('');

  const totalBenefits = categories.reduce((sum, c) => sum + c.benefits.length, 0);

  const filtered = search.trim()
    ? categories
        .map((c) => ({
          ...c,
          benefits: c.benefits.filter(
            (b) =>
              b.name.toLowerCase().includes(search.toLowerCase()) ||
              b.product.toLowerCase().includes(search.toLowerCase()) ||
              b.story.toLowerCase().includes(search.toLowerCase())
          ),
        }))
        .filter((c) => c.benefits.length > 0)
    : categories;

  const filteredCount = filtered.reduce((sum, c) => sum + c.benefits.length, 0);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">📚 ROI Benefits Study Guide</h2>
        <p className="text-[#555] text-sm">
          Micro-learning cards for every ROI benefit. Review before customer calls — know the story, the math, and how to explain it.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-4 mb-5 px-4 py-3 bg-[#111] border border-[#222] rounded-lg">
        <div className="text-center">
          <div className="text-white font-bold text-lg">$30.9M</div>
          <div className="text-[#555] text-xs">3-Year Total</div>
        </div>
        <div className="w-px h-8 bg-[#222]" />
        <div className="text-center">
          <div className="text-white font-bold text-lg">{totalBenefits}</div>
          <div className="text-[#555] text-xs">Benefits</div>
        </div>
        <div className="w-px h-8 bg-[#222]" />
        <div className="text-center">
          <div className="text-white font-bold text-lg">6</div>
          <div className="text-[#555] text-xs">Categories</div>
        </div>
        <div className="w-px h-8 bg-[#222]" />
        <div className="text-center">
          <div className="text-white font-bold text-lg">$10.3M</div>
          <div className="text-[#555] text-xs">Annual Value</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
        <input
          type="text"
          placeholder="Search benefits, products, or keywords..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[#111] border border-[#222] rounded-lg text-white text-sm placeholder:text-[#444] focus:outline-none focus:border-[#333]"
        />
        {search && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] text-xs">
            {filteredCount} result{filteredCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-3">
        {filtered.map((cat) => (
          <CategorySection key={cat.name} category={cat} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-[#555]">
          No benefits match &ldquo;{search}&rdquo;
        </div>
      )}

      {/* Key Assumptions Footer */}
      <div className="mt-8 p-5 bg-[#111] border border-[#222] rounded-xl">
        <h3 className="text-white font-semibold text-sm mb-3">📊 Baseline Assumptions (5,000 Employee Org)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          {[
            { label: 'Employees', value: '5,000' },
            { label: 'Endpoints', value: '10,000' },
            { label: 'Annual Tickets', value: '60,000' },
            { label: 'IT FTE Salary', value: '$89,000' },
            { label: 'IT Headcount', value: '125' },
            { label: 'AHT per Ticket', value: '0.5 hours' },
            { label: 'Breach Exposure', value: '$4.44M' },
            { label: 'Compliance Penalty', value: '$250K' },
            { label: 'Software Spend', value: '$5M' },
            { label: 'Cloud Spend', value: '$5M' },
            { label: 'Utilities Cost', value: '$6.19M' },
            { label: 'Facilities Area', value: '250K sqm' },
          ].map((item) => (
            <div key={item.label} className="flex justify-between px-3 py-2 bg-[#0a0a0a] rounded-md">
              <span className="text-[#555]">{item.label}</span>
              <span className="text-white font-mono">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
