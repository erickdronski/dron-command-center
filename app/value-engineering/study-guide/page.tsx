'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Search, DollarSign, Shield, AlertTriangle, Package, Zap, TrendingDown, LifeBuoy } from 'lucide-react';

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
  total3yr: string;
  benefits: Benefit[];
};

/* ────────────────────────────────────────────
   DATA — ALL from ROI Assessment PPTX + Key Assumptions DOCX
   ──────────────────────────────────────────── */

const categories: Category[] = [
  {
    name: 'Breach Risk / Cost Mitigation',
    icon: <Shield size={18} />,
    color: 'text-red-400',
    borderColor: 'border-red-500/30',
    total3yr: '$16.1M',
    benefits: [
      {
        name: 'Reduce Data Breach Costs with Advanced Security',
        product: 'Ivanti Connect Secure',
        y1: '$222K', y2: '$222K', y3: '$222K', total: '$666K',
        story: 'Every organization with remote workers is a target. Connect Secure modernizes your VPN and builds in threat protection so breaches are less likely — and when something does happen, the blast radius is smaller. Think of it as upgrading from a screen door to a vault.',
        assumptions: ['Annual Total Risk/Cost of Data Breaches: $4,440,000 (geographic average)', '5% reduction with improved security protocols'],
        howToExplain: 'Your total annual breach risk exposure is about $4.4 million — that\'s the industry average for an org your size. We\'re saying with modern VPN architecture and integrated threat protection, you reduce that risk by just 5%. Five percent of $4.4 million is $222,000. That\'s a conservative number — most security improvements deliver way more than 5%.',
      },
      {
        name: 'Improved Detection of External Threats',
        product: 'Ivanti Neurons for EASM',
        y1: '$222K', y2: '$222K', y3: '$222K', total: '$666K',
        story: 'You can\'t protect what you can\'t see. EASM continuously scans your internet-facing assets — domains, IPs, cloud services — and finds the stuff your team doesn\'t even know is exposed. Shadow IT, misconfigs, forgotten test servers. Finding them before attackers do is the whole game.',
        assumptions: ['Annual Total Risk/Cost of Data Breaches: $4,440,000', '5% reduction in incidents with improved endpoint visibility'],
        howToExplain: 'Same $4.4 million breach risk baseline. By having continuous visibility into your external attack surface — knowing every domain, IP, and cloud service you have exposed — you catch problems before attackers do. A 5% improvement in detection means $222,000 in reduced risk annually.',
      },
      {
        name: 'Reduced Risk from Shadow IT',
        product: 'Ivanti Neurons for EASM',
        y1: '$266.4K', y2: '$266.4K', y3: '$266.4K', total: '$799.2K',
        story: 'Shadow IT is the stuff your teams spin up without IT knowing — cloud apps, test environments, random SaaS tools. Each one is an unmonitored entry point. EASM finds these hidden systems and lets you prioritize which ones to lock down first.',
        assumptions: ['Annual Total Risk/Cost of Data Breaches: $4,440,000', '6% reduction in Shadow IT risk exposure'],
        howToExplain: 'Shadow IT typically accounts for 30-40% of your technology footprint. Every unmanaged system is a potential breach vector. We\'re estimating that finding and securing these shadow systems reduces your $4.4M breach risk by about 6%, which gives you $266,000 in risk reduction per year.',
      },
      {
        name: 'Reduced Security Risks from Rogue Devices',
        product: 'Ivanti Neurons Discovery',
        y1: '$310.8K', y2: '$310.8K', y3: '$310.8K', total: '$932.4K',
        story: 'Rogue devices — personal laptops, IoT gadgets, unauthorized equipment on your network — are invisible threats. Discovery finds every device on your network, whether it\'s managed or not. You can\'t secure what you don\'t know exists.',
        assumptions: ['Annual Total Risk/Cost of Data Breaches: $4,440,000', '7% reduction from eliminating rogue device blind spots'],
        howToExplain: 'Out of your $4.4 million in annual breach risk, rogue and unmanaged devices contribute a significant portion. By discovering and managing every device on your network, we estimate a 7% reduction in that risk — about $311,000 per year. That\'s just from knowing what\'s actually on your network.',
      },
      {
        name: 'Lower Breach Risk with Rule-Based Automation',
        product: 'Ivanti Neurons for Patch Management',
        y1: '$888K', y2: '$888K', y3: '$888K', total: '$2.7M',
        story: 'Unpatched systems are the #1 way attackers get in. Automated patch management means critical patches deploy on schedule without waiting for someone to remember. It\'s the single biggest lever you can pull to reduce breach risk.',
        assumptions: ['Annual Total Risk/Cost of Data Breaches: $4,440,000', '20% reduction through automated patching'],
        howToExplain: 'Patching is the biggest bang for your buck in security. Industry data shows that 60% of breaches involve unpatched vulnerabilities. By automating your patch management — making sure critical patches deploy within your policy window — we estimate a 20% reduction in your $4.4M breach exposure. That\'s $888,000 per year. This is actually one of the most well-documented ROI calculations in cybersecurity.',
      },
      {
        name: 'Reduced risk with automated security compliance',
        product: 'Ivanti Neurons for MDM',
        y1: '$536.8K', y2: '$536.8K', y3: '$536.8K', total: '$1.6M',
        story: 'Mobile devices are everywhere — and each one with outdated policies or missing encryption is a breach waiting to happen. MDM automatically enforces security baselines across every device, so compliance isn\'t something you check quarterly — it\'s continuous.',
        assumptions: ['Annual Total Risk/Cost of Data Breaches: $4,440,000', '10,000 endpoint devices', '12% reduction through automated mobile security compliance'],
        howToExplain: 'You have roughly 10,000 endpoints. Each unmanaged or non-compliant device is a potential entry point. By automatically enforcing security policies — encryption, passcodes, app restrictions — across every mobile device, we reduce your breach risk by about 12%. That\'s $537,000 annually from your $4.4M baseline.',
      },
      {
        name: 'Reduce Lost Business Costs from Breaches',
        product: 'Ivanti MTD',
        y1: '$344.1K', y2: '$344.1K', y3: '$344.1K', total: '$1M',
        story: 'When a breach hits, the biggest cost isn\'t always the technical cleanup — it\'s lost business. Customers leave, deals stall, reputation takes a hit. Mobile Threat Defense stops threats at the device level before they become headline news.',
        assumptions: ['Annual Total Risk/Cost of Data Breaches: $4,440,000', 'Lost business component of breach costs'],
        howToExplain: 'When we look at the anatomy of a data breach, lost business — customer churn, deal delays, reputational damage — accounts for roughly 38% of total breach costs. That\'s about $1.7M of your $4.4M exposure. By preventing mobile-originated breaches, we conservatively estimate reducing that lost business component by about 20%, giving you $344,000 in preserved revenue annually.',
      },
      {
        name: 'Reduce Breach Detection and Escalation Costs',
        product: 'Ivanti MTD',
        y1: '$366.3K', y2: '$366.3K', y3: '$366.3K', total: '$1.1M',
        story: 'The average breach takes 277 days to detect. Every day it goes unnoticed, the cost grows. MTD provides real-time threat detection on mobile devices, dramatically cutting the time between breach and discovery.',
        assumptions: ['Annual Total Risk/Cost of Data Breaches: $4,440,000', 'Detection and escalation cost component'],
        howToExplain: 'Detection and escalation — the forensics, the investigation, the escalation chain — makes up a significant chunk of breach costs. Industry average is about 29% of total breach cost. With real-time mobile threat detection, you catch things in minutes instead of months. We estimate that reduces your detection costs by about $366,000 annually.',
      },
      {
        name: 'Improve Post-Breach Response',
        product: 'Ivanti MTD',
        y1: '$299.7K', y2: '$299.7K', y3: '$299.7K', total: '$899.1K',
        story: 'When a breach happens, response time is everything. MTD gives your team the data they need to contain, remediate, and recover faster — turning a potential catastrophe into a manageable incident.',
        assumptions: ['Annual Total Risk/Cost of Data Breaches: $4,440,000', 'Post-breach response cost reduction'],
        howToExplain: 'Post-breach response includes containment, remediation, legal costs, and notification. With better mobile threat data and faster containment capabilities, we estimate you reduce this component by about $300,000 per year. It\'s about having the right information immediately when something goes wrong, instead of scrambling.',
      },
      {
        name: 'Reduce Phishing & Malware Damage',
        product: 'Ivanti MTD',
        y1: '$270K', y2: '$270K', y3: '$270K', total: '$810K',
        story: 'Phishing is still the #1 attack vector and mobile makes it worse — smaller screens, SMS-based attacks, personal apps on work devices. MTD blocks phishing URLs and malware before they can do damage.',
        assumptions: ['Average cleanup cost per malware incident: $15,000', 'Multiple incident prevention annually'],
        howToExplain: 'Each malware incident costs about $15,000 to clean up — that\'s device reimaging, investigation time, and productivity loss. By blocking phishing and malware at the mobile device level, we prevent multiple incidents annually. The math works out to about $270,000 in avoided cleanup and damage costs per year.',
      },
      {
        name: 'Reduce Breach Notification Costs',
        product: 'Ivanti Neurons for MDM',
        y1: '$99.9K', y2: '$99.9K', y3: '$99.9K', total: '$299.7K',
        story: 'When a breach triggers notification requirements — and with regulations like GDPR, they almost always do — the costs add up fast. Legal fees, mass communications, credit monitoring for affected users. Preventing the breach prevents the notification bill.',
        assumptions: ['Annual Total Risk/Cost of Data Breaches: $4,440,000', 'Notification cost component reduction'],
        howToExplain: 'Breach notification costs — the legal requirements, the mass mailings, the credit monitoring you have to offer affected customers — typically run about 5-6% of total breach costs. By reducing breach likelihood through automated device compliance, you avoid approximately $100,000 in notification costs annually.',
      },
      {
        name: 'Reduced Organizational Exposure with Inventory Insights',
        product: 'Ivanti Neurons Platform',
        y1: '$133.2K', y2: '$133.2K', y3: '$133.2K', total: '$399.6K',
        story: 'The Neurons Platform gives you a single pane of glass across all your assets. When you can see everything in one place, security gaps become obvious. It\'s the foundation that makes every other security tool more effective.',
        assumptions: ['Annual Total Risk/Cost of Data Breaches: $4,440,000', '3% reduction through improved inventory visibility'],
        howToExplain: 'Think of this as the foundational layer. Having a centralized, accurate inventory of everything you own — every device, every app, every connection — reduces your exposure by about 3%. Three percent of $4.4M is $133,000. It\'s not flashy, but accurate inventory is what makes every other security investment work better.',
      },
      {
        name: 'Proactive Vulnerability Management',
        product: 'Ivanti Neurons for RBVM',
        y1: '$444K', y2: '$444K', y3: '$444K', total: '$1.3M',
        story: 'Not all vulnerabilities are equal. RBVM uses risk-based scoring to tell you which vulnerabilities actually matter for YOUR environment — so your team fixes the dangerous ones first instead of working through a spreadsheet alphabetically.',
        assumptions: ['Annual Total Risk/Cost of Data Breaches: $4,440,000', '10% reduction through risk-based prioritization'],
        howToExplain: 'Traditional vulnerability management treats everything the same — your team gets 10,000 vulnerabilities and no way to prioritize. Risk-based vulnerability management scores each one based on your specific environment, active exploits, and business criticality. By fixing the right vulnerabilities first, you reduce your breach risk by about 10% — that\'s $444,000 annually.',
      },
      {
        name: 'Minimized Password-Based Breach Risk',
        product: 'Ivanti Zero Sign-On (ZSO)',
        y1: '$222K', y2: '$222K', y3: '$222K', total: '$666K',
        story: 'Passwords are the weakest link. Credential theft, password reuse, phishing — 80% of breaches involve compromised credentials. ZSO eliminates passwords entirely, replacing them with certificate-based authentication that can\'t be phished.',
        assumptions: ['Annual Total Risk/Cost of Data Breaches: $4,440,000', '5% reduction by eliminating password-based attacks'],
        howToExplain: 'About 80% of breaches involve compromised credentials. By eliminating passwords entirely — replacing them with certificate-based, phishing-resistant authentication — you remove the #1 attack vector. We conservatively estimate that reduces your $4.4M breach risk by 5%, or $222,000 per year.',
      },
      {
        name: 'Enhanced Security Posture',
        product: 'Ivanti Zero Sign-On (ZSO)',
        y1: '$710.4K', y2: '$710.4K', y3: '$710.4K', total: '$2.1M',
        story: 'ZSO doesn\'t just remove passwords — it fundamentally changes your security posture. Continuous device health checks, certificate-based trust, and zero-trust access decisions happen automatically. Your security gets stronger without adding friction for users.',
        assumptions: ['Annual Total Risk/Cost of Data Breaches: $4,440,000', '16% overall security posture improvement'],
        howToExplain: 'Beyond just passwords, ZSO enforces continuous device health checks and zero-trust access decisions. Every time someone accesses a resource, the system verifies the device is healthy, patched, and compliant — automatically. This comprehensive security improvement reduces your overall breach risk by about 16%, or $710,000 per year.',
      },
      {
        name: 'Reduced Risk with Improved Asset Visibility',
        product: 'Ivanti Neurons for ITAM',
        y1: '$44.4K', y2: '$44.4K', y3: '$44.4K', total: '$133.2K',
        story: 'Asset management isn\'t just about tracking hardware — it\'s about knowing what software is installed, what\'s licensed, and what\'s vulnerable. ITAM gives you that visibility so nothing slips through the cracks.',
        assumptions: ['Annual Total Risk/Cost of Data Breaches: $4,440,000', '1% reduction through better asset tracking'],
        howToExplain: 'Better asset visibility — knowing exactly what you have, where it is, and what state it\'s in — contributes about a 1% reduction in breach risk. That\'s $44,000 annually. It seems small on its own, but it compounds with every other security control that depends on accurate asset data.',
      },
    ],
  },
  {
    name: 'Penalties & Fines Avoidance',
    icon: <AlertTriangle size={18} />,
    color: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    total3yr: '$787.5K',
    benefits: [
      {
        name: 'Reduced IT Fines for Non-Compliant Devices',
        product: 'Ivanti Neurons Discovery',
        y1: '$17.5K', y2: '$17.5K', y3: '$17.5K', total: '$52.5K',
        story: 'Regulators don\'t care that you didn\'t know about the non-compliant device — they care that it existed. Discovery finds every device, compliant or not, so you can fix issues before auditors find them.',
        assumptions: ['Annual compliance penalty exposure: $250,000', '7% reduction in fine exposure through device discovery'],
        howToExplain: 'Your estimated annual compliance penalty exposure is $250,000 — that\'s based on $50 per employee for a 5,000-person org. By automatically discovering and flagging non-compliant devices before audit time, you reduce that exposure by about 7%. That\'s $17,500 per year in avoided fines.',
      },
      {
        name: 'Reduce Risk with Live Visibility',
        product: 'Ivanti Neurons Edge Intelligence',
        y1: '$20K', y2: '$20K', y3: '$20K', total: '$60K',
        story: 'Edge Intelligence gives you real-time queries across every endpoint — no agents, no delays. When an auditor asks "how many devices are running Windows 10 past end-of-life?" you have the answer in seconds, not days.',
        assumptions: ['Annual compliance penalty exposure: $250,000', '8% reduction through real-time compliance visibility'],
        howToExplain: 'From your $250,000 annual fine exposure, having real-time visibility into every endpoint\'s compliance state — being able to answer any audit question immediately — reduces your risk by about 8%, or $20,000 per year.',
      },
      {
        name: 'Improve Compliance with Asset Tracking',
        product: 'Ivanti Neurons for ITAM',
        y1: '$62.5K', y2: '$62.5K', y3: '$62.5K', total: '$187.5K',
        story: 'Software audits can be devastating — one vendor audit finding unlicensed software can cost millions. ITAM tracks every license, every installation, every entitlement. When the auditor comes, you\'re ready.',
        assumptions: ['Annual compliance penalty exposure: $250,000', '25% reduction through comprehensive asset tracking'],
        howToExplain: 'Comprehensive asset tracking is your biggest lever for compliance. Knowing exactly what software is installed where, matching it to licenses, flagging overages — that\'s worth about a 25% reduction in your $250,000 fine exposure, or $62,500 per year. And that doesn\'t even count the vendor audit savings.',
      },
      {
        name: 'High Priority Ticket Routing',
        product: 'Ivanti Neurons for ITSM',
        y1: '$50K', y2: '$50K', y3: '$50K', total: '$150K',
        story: 'When a compliance-critical ticket sits in queue while someone works on a printer issue, you\'re accumulating risk by the hour. Smart routing ensures compliance and security tickets get immediate attention.',
        assumptions: ['Annual compliance penalty exposure: $250,000', '20% reduction through prioritized compliance ticket handling'],
        howToExplain: 'Compliance-related tickets — security incidents, audit findings, regulatory requests — need to be handled fast. By automatically routing these to the right team with the right priority, you reduce your fine exposure by about 20%, or $50,000 annually.',
      },
      {
        name: 'Streamlined Auditing and Compliance',
        product: 'Ivanti Neurons for MDM',
        y1: '$37.5K', y2: '$37.5K', y3: '$37.5K', total: '$112.5K',
        story: 'Mobile device compliance is a nightmare without automation. MDM automatically enforces policies and generates the audit trails regulators want to see. No more scrambling before audit season.',
        assumptions: ['Annual compliance penalty exposure: $250,000', '15% reduction through automated mobile compliance'],
        howToExplain: 'Mobile devices are a growing audit focus. MDM automatically enforces compliance policies and maintains detailed audit logs for every device action. That automated compliance trail reduces your fine exposure by about 15%, or $37,500 per year.',
      },
      {
        name: 'Automated Policy Enforcement',
        product: 'Ivanti MTD',
        y1: '$37.5K', y2: '$37.5K', y3: '$37.5K', total: '$112.5K',
        story: 'When a mobile device violates policy — jailbroken, connecting to a suspicious network, running a blacklisted app — MTD acts immediately. No waiting for a human to notice. Automatic enforcement means automatic compliance.',
        assumptions: ['Annual compliance penalty exposure: $250,000', '15% reduction through automated threat-based policy enforcement'],
        howToExplain: 'MTD automatically detects and responds to policy violations on mobile devices — jailbreaking, malicious networks, risky apps — in real time. This automated enforcement reduces your compliance penalty exposure by about 15%, or $37,500 per year.',
      },
      {
        name: 'Secure Compliance & Lower Penalty Exposure',
        product: 'Ivanti Neurons for RBVM',
        y1: '$37.5K', y2: '$37.5K', y3: '$37.5K', total: '$112.5K',
        story: 'Regulators increasingly require proof that you\'re managing vulnerabilities. RBVM doesn\'t just find vulnerabilities — it proves you\'re prioritizing and remediating them based on actual risk. That\'s exactly what auditors want to see.',
        assumptions: ['Annual compliance penalty exposure: $250,000', '15% reduction through documented vulnerability management'],
        howToExplain: 'Regulators want to see a risk-based approach to vulnerability management — not just scanning, but prioritizing and proving remediation. RBVM provides that documentation and process, reducing your penalty exposure by about 15%, or $37,500 annually.',
      },
    ],
  },
  {
    name: 'Optimized Asset Management',
    icon: <Package size={18} />,
    color: 'text-blue-400',
    borderColor: 'border-blue-500/30',
    total3yr: '$1M',
    benefits: [
      {
        name: 'Software Usage Optimization',
        product: 'Ivanti Neurons Discovery',
        y1: '$72K', y2: '$72K', y3: '$72K', total: '$216K',
        story: 'Most organizations overspend on software licenses by 10-25%. Discovery shows you which licenses are actually being used vs. sitting idle — so you stop paying for shelf-ware.',
        assumptions: ['Annual Software Costs: $5,000,000', 'Estimated 10% overspend on software'],
        howToExplain: 'Your annual software spend is about $5 million. Industry data says organizations overspend by 10-25% on unused or underused licenses. Discovery identifies those idle licenses. Even reclaiming just a fraction — about 1.4% of your total spend — saves you $72,000 per year.',
      },
      {
        name: 'Enhanced Hardware Visibility',
        product: 'Ivanti Neurons Discovery',
        y1: '$54K', y2: '$54K', y3: '$54K', total: '$162K',
        story: 'How many laptops does your org actually have? Not what the spreadsheet says — what\'s actually out there. Discovery gives you accurate hardware counts so you stop buying duplicates and find the ghost assets.',
        assumptions: ['10,000 endpoint devices', 'Estimated overspend reduction through accurate inventory'],
        howToExplain: 'With 10,000 endpoints, hardware visibility gaps cost real money — duplicate purchases, ghost assets still under maintenance contracts, devices that should have been retired. Accurate discovery saves about $54,000 per year in avoided overspend.',
      },
      {
        name: 'Predictive Analytics for Asset Performance',
        product: 'Ivanti Neurons Edge Intelligence',
        y1: '$36K', y2: '$36K', y3: '$36K', total: '$108K',
        story: 'Edge Intelligence spots devices that are about to fail — battery degradation, disk health declining, memory running consistently hot. Replace them proactively instead of waiting for the fire drill.',
        assumptions: ['10,000 endpoint devices', 'Predictive maintenance cost savings'],
        howToExplain: 'Instead of waiting for devices to fail — which means emergency procurement, lost productivity, and fire-drill IT support — Edge Intelligence predicts which devices need attention. That proactive approach saves about $36,000 per year in avoided emergency costs and extended asset life.',
      },
      {
        name: 'Automated Fixes Prevent Device Issues',
        product: 'Ivanti Neurons for Healing',
        y1: '$18K', y2: '$18K', y3: '$18K', total: '$54K',
        story: 'Healing automatically detects and fixes common device issues — corrupted profiles, registry errors, stuck services — before the user even notices. Fewer issues means longer device life and less replacement spend.',
        assumptions: ['10,000 endpoint devices', 'Reduced device replacement through automated remediation'],
        howToExplain: 'Automated self-healing extends device life by fixing problems before they cascade into hardware-replacement situations. Across 10,000 devices, that translates to about $18,000 per year in avoided premature replacements.',
      },
      {
        name: 'Centralized Application Inventory',
        product: 'Ivanti Neurons for ITAM',
        y1: '$50K', y2: '$50K', y3: '$50K', total: '$150K',
        story: 'How many different versions of the same app are running across your org? ITAM gives you one centralized view of every application, every version, every device. That\'s how you optimize licensing and standardize your environment.',
        assumptions: ['Annual Software Costs: $5,000,000', 'License optimization through centralized tracking'],
        howToExplain: 'A centralized application inventory lets you identify redundant apps, consolidate licenses, and negotiate better deals with vendors. On a $5 million software budget, this optimization saves about $50,000 per year — that\'s just 1% of your spend.',
      },
      {
        name: 'Reduced Hardware Overspend',
        product: 'Ivanti Neurons for ITAM',
        y1: '$80K', y2: '$80K', y3: '$80K', total: '$240K',
        story: 'Without accurate inventory, organizations routinely buy hardware they don\'t need — replacements for devices that aren\'t actually broken, upgrades for machines that still have years of life. ITAM stops the waste.',
        assumptions: ['10,000 endpoint devices', 'Estimated 10% hardware overspend reduction'],
        howToExplain: 'With 10,000 endpoints, hardware overspend is a real problem — buying replacements for working devices, maintaining contracts on retired equipment, ordering upgrades that aren\'t needed. Accurate asset tracking reduces this overspend by about $80,000 per year.',
      },
      {
        name: 'Improved Asset Visibility',
        product: 'Ivanti Neurons Platform',
        y1: '$31.5K', y2: '$31.5K', y3: '$31.5K', total: '$94.5K',
        story: 'The Neurons Platform connects all your asset data into one view. When procurement, IT, and finance all see the same numbers, you make better decisions about what to buy, retire, and maintain.',
        assumptions: ['10,000 endpoint devices', 'Cross-functional visibility driving better procurement decisions'],
        howToExplain: 'When every team works from the same asset data — procurement sees what IT sees, finance sees what operations sees — you eliminate the communication gaps that cause overspend. That unified visibility saves about $31,500 per year.',
      },
    ],
  },
  {
    name: 'Operational Efficiencies',
    icon: <Zap size={18} />,
    color: 'text-green-400',
    borderColor: 'border-green-500/30',
    total3yr: '$8.6M',
    benefits: [
      {
        name: 'Reduce Escalated AHT with AI Incident Summarization',
        product: 'Neurons for AITSM',
        y1: '$234.5K', y2: '$234.5K', y3: '$234.5K', total: '$703.5K',
        story: 'When a ticket gets escalated, the L2/L3 engineer spends 15 minutes just reading through the ticket history. AI summarization gives them a 30-second briefing. Multiply that time savings across thousands of escalations.',
        assumptions: ['60,000 annual tickets', 'Average Handle Time: 0.5 hours per ticket', 'IT FTE salary: $89,000'],
        howToExplain: 'You handle about 60,000 tickets per year. A percentage of those get escalated, and each escalation involves the next-tier engineer reading through the entire ticket history — 10-15 minutes minimum. AI summarization compresses that into 30 seconds. Across all your escalations, that saves about $234,500 in IT labor annually.',
      },
      {
        name: 'Smarter Self-Service with AI',
        product: 'Neurons for AITSM',
        y1: '$156.3K', y2: '$156.3K', y3: '$156.3K', total: '$469K',
        story: 'AI-powered self-service doesn\'t just search a knowledge base — it understands the question and delivers the answer. Users solve their own problems instead of calling the help desk. Every ticket deflected is money saved.',
        assumptions: ['60,000 annual tickets', 'IT FTE salary: $89,000', 'Self-service deflection rate improvement'],
        howToExplain: 'Out of your 60,000 annual tickets, a significant portion are questions that could be answered by a good self-service portal. AI makes your self-service actually useful — understanding natural language questions and providing accurate answers. Each deflected ticket saves about 30 minutes of analyst time at $52/hour. The math gives you about $156,000 in annual savings.',
      },
      {
        name: 'Take Knowledge Management to the Next Level with AI',
        product: 'Neurons for AITSM',
        y1: '$111.3K', y2: '$111.3K', y3: '$111.3K', total: '$333.8K',
        story: 'Your knowledge base is only as good as its content — and most KBs are outdated within months. AI automatically generates and updates knowledge articles from resolved tickets, keeping your KB fresh without manual effort.',
        assumptions: ['5 dedicated Knowledge Management FTEs', 'IT FTE salary: $89,000', 'Time savings on KB maintenance'],
        howToExplain: 'You have about 5 people dedicated to knowledge management. AI can automate article creation from resolved tickets, identify gaps, and flag outdated content. That saves each KM analyst about 25% of their time — $111,000 in total annual productivity gains.',
      },
      {
        name: 'Reduced Ticket Volume',
        product: 'Ivanti Neurons for Healing',
        y1: '$78.2K', y2: '$78.2K', y3: '$78.2K', total: '$234.5K',
        story: 'The best ticket is the one that never gets created. Healing fixes issues before users notice — corrupted files, stuck services, disk space issues — so the user never has to call IT in the first place.',
        assumptions: ['60,000 annual tickets', 'Average Handle Time: 0.5 hours per ticket', 'IT FTE salary: $89,000'],
        howToExplain: 'If self-healing resolves issues before users even notice — disk space, registry fixes, profile repairs — those tickets never get created. Reducing your 60,000 annual tickets by even 3% means 1,800 fewer tickets at 30 minutes each. At your IT rate, that\'s about $78,000 saved annually.',
      },
      {
        name: 'Reduced Incident Average Handle Time (AHT)',
        product: 'Ivanti Neurons for ITSM',
        y1: '$171.6K', y2: '$171.6K', y3: '$171.6K', total: '$514.8K',
        story: 'Every minute an analyst spends on a ticket costs money. ITSM streamlines the entire incident workflow — auto-categorization, smart routing, knowledge suggestions — shaving minutes off every interaction.',
        assumptions: ['60,000 annual tickets', 'Average Handle Time: 0.5 hours per ticket', 'IT FTE salary: $89,000'],
        howToExplain: 'Your analysts handle 60,000 tickets at about 30 minutes each — that\'s 30,000 hours of IT labor. By streamlining workflows, auto-categorizing tickets, and suggesting knowledge articles, we reduce average handle time by about 10%. That\'s 3,000 hours saved, or about $172,000 in IT labor costs annually.',
      },
      {
        name: 'Service Desk Productivity',
        product: 'Ivanti Neurons for ITSM',
        y1: '$156K', y2: '$156K', y3: '$156K', total: '$468K',
        story: 'More tickets per analyst doesn\'t mean working harder — it means working smarter. Better tools, better workflows, better automation means each analyst handles more volume without burning out.',
        assumptions: ['125 IT staff total', 'IT FTE salary: $89,000', 'Productivity improvement per analyst'],
        howToExplain: 'With 125 IT staff and modern ITSM tools, each analyst becomes more productive — handling more tickets in less time through better automation and workflows. That productivity lift translates to about $156,000 in annual value — essentially getting more output from the same team.',
      },
      {
        name: 'Elimination of Password Resets',
        product: 'Ivanti Zero Sign-On (ZSO)',
        y1: '$561.6K', y2: '$561.6K', y3: '$561.6K', total: '$1.7M',
        story: 'Password resets are the #1 help desk call — costing $70 per reset on average. ZSO eliminates passwords entirely. No passwords means no resets, no lockouts, no "I forgot my password" calls ever again.',
        assumptions: ['5,000 employees', 'Average password reset cost: industry benchmark', 'IT FTE salary: $89,000'],
        howToExplain: 'Password resets typically account for 20-50% of all help desk calls. Each reset costs about $70 when you factor in analyst time, verification, and user downtime. With 5,000 employees, you\'re probably doing thousands of resets per year. Eliminating passwords entirely saves about $562,000 annually — it\'s one of the most straightforward ROI calculations there is.',
      },
      {
        name: 'Streamline Endpoint Security & Incident Response',
        product: 'Ivanti Connect Secure',
        y1: '$52K', y2: '$52K', y3: '$52K', total: '$156K',
        story: 'When a security incident involves a remote user, Connect Secure gives your response team immediate visibility into the connection — who, where, what device, what they accessed. No more guessing.',
        assumptions: ['125 IT staff', 'IT FTE salary: $89,000', 'Incident response time reduction'],
        howToExplain: 'Security incident response for remote workers is time-consuming — identifying the user, their device state, what they accessed. Connect Secure centralizes all of this. Faster response across your 125-person IT team saves about $52,000 in annual labor costs.',
      },
      {
        name: 'Improved Asset Lifecycle Management',
        product: 'Ivanti Neurons for ITAM',
        y1: '$37.4K', y2: '$37.4K', y3: '$37.4K', total: '$112.1K',
        story: 'Assets have a lifecycle — procurement, deployment, maintenance, retirement. ITAM automates the tracking across every stage so nothing falls through the cracks and you always know where each asset stands.',
        assumptions: ['10,000 endpoint devices', 'IT FTE salary: $89,000', 'Lifecycle management efficiency gains'],
        howToExplain: 'Managing 10,000 devices through their full lifecycle — from purchase to retirement — involves countless manual touchpoints. ITAM automates tracking at every stage, saving your team about $37,000 in annual labor costs.',
      },
      {
        name: 'Linking Assets to Owners',
        product: 'Ivanti Neurons for ITSM',
        y1: '$12.5K', y2: '$12.5K', y3: '$12.5K', total: '$37.4K',
        story: 'When a ticket comes in, the analyst needs to know: what device is this user on? What\'s installed? What\'s their history? Auto-linking assets to users eliminates the detective work.',
        assumptions: ['60,000 annual tickets', 'Time saved per ticket from automatic asset association'],
        howToExplain: 'Out of 60,000 tickets, analysts spend time on each one figuring out what device the user is on, what\'s installed, what changed. Automatic asset-to-user linking saves a few seconds per ticket — across 60,000 tickets, that adds up to about $12,500 annually.',
      },
      {
        name: 'Automated & Integrated Compliance Management',
        product: 'Ivanti Neurons for LOB',
        y1: '$233.4K', y2: '$233.4K', y3: '$233.4K', total: '$700.3K',
        story: 'Compliance management across GRC is a mountain of manual work — documenting controls, tracking evidence, generating reports. LOB automates the busywork so your compliance team focuses on actual risk.',
        assumptions: ['12 Compliance Staff FTEs', 'Compliance Staff salary: $114,400', 'Automation of routine compliance tasks'],
        howToExplain: 'Your 12-person compliance team at $114,400 each spends a huge amount of time on manual documentation, evidence collection, and reporting. Automating those routine tasks saves about 17% of their time — that\'s $233,000 in annual productivity gains.',
      },
      {
        name: 'Improve Maintenance Efficiency via Predictive Capabilities',
        product: 'Ivanti Neurons for LOB',
        y1: '$173.4K', y2: '$173.4K', y3: '$173.4K', total: '$520.2K',
        story: 'Facilities maintenance is expensive — and reactive maintenance costs 3-5x more than predictive. LOB helps your maintenance team anticipate issues and schedule work proactively instead of responding to emergencies.',
        assumptions: ['60 FM Maintenance Staff FTEs', 'FM Maintenance salary: $80,776', 'Predictive vs reactive maintenance savings'],
        howToExplain: 'You have 60 maintenance staff at about $81,000 each. Predictive maintenance — fixing things before they break — is 3-5x cheaper than reactive emergency repairs. By automating work orders and using data-driven scheduling, we save about 3.5% of your total maintenance labor cost — $173,000 annually.',
      },
      {
        name: 'Streamline Employee Onboarding & Transitions',
        product: 'Ivanti Neurons for LOB',
        y1: '$75K', y2: '$75K', y3: '$75K', total: '$225K',
        story: 'New hire onboarding touches every department — IT, HR, facilities, security. LOB orchestrates the entire process with automated workflows so nothing gets missed and day-one is actually productive.',
        assumptions: ['20 HRSM Staff FTEs', 'HRSM Staff salary: $103,886', 'Onboarding workflow automation savings'],
        howToExplain: 'Your HR team of 20 people at about $104,000 each spends significant time coordinating onboarding across departments. Automated workflows — IT provisioning, badge access, training enrollment, equipment ordering — save about $75,000 in annual HR labor costs.',
      },
      {
        name: 'Improve Project Delivery Predictability',
        product: 'Ivanti Neurons for LOB',
        y1: '$90.7K', y2: '$90.7K', y3: '$90.7K', total: '$272.1K',
        story: 'PMO teams spend too much time chasing status updates and reconciling spreadsheets. LOB gives real-time project visibility so PMs can actually manage instead of administrate.',
        assumptions: ['15 PMO Staff FTEs', 'PMO salary: $100,750', 'Project admin time reduction'],
        howToExplain: 'Your 15-person PMO team at about $101,000 each spends roughly 6% of their time on manual status collection and reporting. Automated project dashboards and real-time visibility save about $91,000 in annual PMO labor costs.',
      },
      {
        name: 'Make Smarter Portfolio Investment Decisions',
        product: 'Ivanti Neurons for LOB',
        y1: '$60.5K', y2: '$60.5K', y3: '$60.5K', total: '$181.4K',
        story: 'Which projects should get funded? Which should be killed? LOB gives portfolio managers the data to make these calls based on actual resource utilization and ROI, not politics.',
        assumptions: ['15 PMO Staff FTEs', 'PMO salary: $100,750', 'Better investment decision-making'],
        howToExplain: 'With data-driven portfolio management, your PMO team makes better investment decisions — killing underperforming projects earlier, reallocating resources faster. That improved decision-making saves about $60,500 per year in avoided waste and better resource allocation.',
      },
      {
        name: 'Automated Security Compliance',
        product: 'Ivanti Neurons for MDM',
        y1: '$208K', y2: '$208K', y3: '$208K', total: '$624K',
        story: 'Manually checking if every mobile device meets security requirements is impossible at scale. MDM does it automatically — enforcing encryption, passcode policies, app restrictions — and reports compliance status in real time.',
        assumptions: ['10,000 endpoint devices', 'IT FTE salary: $89,000', 'Automation of manual compliance checks'],
        howToExplain: 'Across 10,000 devices, manually verifying security compliance is a full-time job for multiple people. MDM automates all of it — policy enforcement, compliance reporting, remediation actions. That automation saves about $208,000 in IT labor annually.',
      },
      {
        name: 'Reduced IT Support Costs',
        product: 'Ivanti Neurons for MDM',
        y1: '$468K', y2: '$468K', y3: '$468K', total: '$1.4M',
        story: 'Mobile device issues — connectivity problems, app crashes, profile corruptions — flood the help desk. MDM enables remote diagnostics and fixes, resolving issues without the user ever coming to IT.',
        assumptions: ['10,000 endpoint devices', 'IT FTE salary: $89,000', 'Remote resolution of mobile device issues'],
        howToExplain: 'With 10,000 mobile devices, your help desk fields a constant stream of device issues. MDM enables remote troubleshooting, automated fixes, and self-service enrollment — reducing mobile support tickets dramatically. That translates to about $468,000 in annual IT support cost reduction.',
      },
    ],
  },
  {
    name: 'Direct Cost Reductions',
    icon: <TrendingDown size={18} />,
    color: 'text-purple-400',
    borderColor: 'border-purple-500/30',
    total3yr: '$2.7M',
    benefits: [
      {
        name: 'Optimize Remote Access Costs',
        product: 'Ivanti Connect Secure',
        y1: '$350K', y2: '$350K', y3: '$350K', total: '$1.1M',
        story: 'Legacy VPN solutions are expensive — per-seat licensing, hardware appliances, maintenance contracts. Connect Secure consolidates remote access into a modern, cloud-delivered platform that costs less to operate.',
        assumptions: ['5,000 employees', 'Legacy VPN cost comparison'],
        howToExplain: 'Most organizations overspend on legacy VPN infrastructure — appliances, per-seat licenses, maintenance contracts, and the staff to manage it all. Modernizing with Connect Secure consolidates everything into a more efficient platform, saving about $350,000 per year in direct infrastructure and licensing costs.',
      },
      {
        name: 'Reduced Hardware Maintenance Costs',
        product: 'Ivanti Neurons for ITAM',
        y1: '$50K', y2: '$50K', y3: '$50K', total: '$150K',
        story: 'Are you paying maintenance on assets you\'ve already retired? ITAM catches those waste points — active contracts on decommissioned hardware, duplicate warranties, unnecessary extended support.',
        assumptions: ['10,000 endpoint devices', 'Maintenance contract optimization'],
        howToExplain: 'Across 10,000 devices, maintenance contract waste is common — paying for support on retired assets, duplicate warranties, unnecessary premium support tiers. ITAM identifies and eliminates this waste, saving about $50,000 per year in direct maintenance costs.',
      },
      {
        name: 'Vendor Contract Insights',
        product: 'Ivanti Neurons for ITAM',
        y1: '$50K', y2: '$50K', y3: '$50K', total: '$150K',
        story: 'When was the last time you negotiated a software renewal with actual usage data? ITAM gives you the ammunition — "we\'re only using 60% of our licenses, let\'s right-size this deal."',
        assumptions: ['Annual Software Costs: $5,000,000', 'Negotiation leverage from usage data'],
        howToExplain: 'On a $5 million software budget, having actual usage data when you sit down to negotiate renewals is powerful. Showing a vendor you only use 60% of your licenses gives you leverage to right-size the deal. That data-driven negotiation saves about $50,000 per year — just 1% of your spend.',
      },
      {
        name: 'Energy & Utility Cost Optimisation',
        product: 'Ivanti Neurons for LOB',
        y1: '$346.6K', y2: '$346.6K', y3: '$346.6K', total: '$1M',
        story: 'Facilities management generates massive utility bills. LOB helps optimize energy usage through data-driven operations — HVAC scheduling, lighting automation, identifying waste in large facility footprints.',
        assumptions: ['250,000 sqm facilities area', 'FM Annual Utilities Cost: $6,190,000', 'Data-driven energy optimization'],
        howToExplain: 'Your facilities cover 250,000 square meters with annual utility costs of about $6.2 million. Data-driven operations — optimizing HVAC schedules, identifying energy waste, automated lighting — typically reduce utility costs by 5-6%. That\'s about $347,000 in annual savings.',
      },
      {
        name: 'Reduced Energy Consumption',
        product: 'Ivanti Neurons for ITAM',
        y1: '$4.5K', y2: '$4.5K', y3: '$4.5K', total: '$13.5K',
        story: 'IT equipment running 24/7 when it doesn\'t need to be wastes electricity. ITAM identifies devices that should be on power management schedules, reducing your energy footprint.',
        assumptions: ['10,000 endpoint devices', 'Power management optimization'],
        howToExplain: 'With 10,000 devices, putting idle machines on power management schedules — sleep mode after hours, wake-on-LAN for patches — saves about $4,500 in annual electricity costs. Small but measurable.',
      },
      {
        name: 'Smarter Device Insights',
        product: 'Ivanti Neurons Workspace',
        y1: '$3.5K', y2: '$3.5K', y3: '$3.5K', total: '$10.5K',
        story: 'Workspace gives you DEX (Digital Employee Experience) scores for every device. Instead of guessing which devices need attention, you focus on the ones that are actually causing productivity problems.',
        assumptions: ['10,000 endpoint devices', 'Targeted device remediation savings'],
        howToExplain: 'Digital experience scoring lets you identify the 5% of devices causing 80% of user complaints. Instead of blanket hardware refreshes, you target the actual problem devices. That focused approach saves about $3,500 per year in avoided unnecessary replacements.',
      },
      {
        name: 'Reduce Zero-Day Defense Cost',
        product: 'Ivanti Neurons for Patch Management',
        y1: '$93.6K', y2: '$93.6K', y3: '$93.6K', total: '$280.8K',
        story: 'Zero-day responses are expensive fire drills — emergency change windows, overtime, weekend work. Automated patch management means your team can respond to zero-days in hours, not days, with less manual effort.',
        assumptions: ['Annual number of smaller scale exploits: 5', 'Exploit response and downtime cost per event: $69,800'],
        howToExplain: 'You experience about 5 smaller-scale exploit events per year, each costing about $70,000 in response and downtime. Automated patch management lets you respond faster with less manual effort, reducing the per-incident cost. Across all 5 events, that saves about $94,000 annually.',
      },
    ],
  },
  {
    name: 'Cost Avoidance',
    icon: <LifeBuoy size={18} />,
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500/30',
    total3yr: '$1.6M',
    benefits: [
      {
        name: 'Minimise Incident Response and Downtime Costs',
        product: 'Ivanti Neurons for RBVM',
        y1: '$349K', y2: '$349K', y3: '$349K', total: '$1M',
        story: 'Every vulnerability exploit comes with downtime — systems go offline, users can\'t work, revenue stops flowing. RBVM reduces exploit frequency by fixing the most dangerous vulnerabilities first, avoiding the downtime entirely.',
        assumptions: ['Annual number of smaller scale exploits: 5', 'Exploit average downtime: 8 hours per event', 'Downtime cost per hour: $5,600', 'Exploit response cost per event: $69,800'],
        howToExplain: 'You experience about 5 exploit events per year. Each one involves an average of 8 hours of downtime at $5,600 per hour, plus $25,000 in incident response costs — roughly $70,000 per event. By proactively managing your highest-risk vulnerabilities, RBVM prevents about 1 event per year, saving $349,000 in avoided incident response and downtime.',
      },
      {
        name: 'Reduce Exploitation Recovery Costs',
        product: 'Ivanti Neurons for RBVM',
        y1: '$200K', y2: '$200K', y3: '$200K', total: '$600K',
        story: 'After an exploit, the recovery costs pile up — system rebuilds, data restoration, forensic investigation. RBVM reduces the number of exploits that succeed in the first place, so you avoid those recovery costs entirely.',
        assumptions: ['Annual number of smaller scale exploits: 5', 'System rebuild cost: $10,000', 'Data restoration cost: $30,000', 'Per-exploit total recovery cost: ~$40,000'],
        howToExplain: 'Each exploit event requires system rebuilds at about $10,000, data restoration at $30,000, and various other recovery costs. That\'s roughly $40,000 in recovery per event. By preventing exploits through better vulnerability prioritization, RBVM saves about $200,000 in annual recovery costs.',
      },
    ],
  },
];

/* ────────────────────────────────────────────
   COMPONENTS
   ──────────────────────────────────────────── */

function BenefitCard({ benefit }: { benefit: Benefit }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-[#111] border border-[#222] rounded-lg overflow-hidden hover:border-[#333] transition-colors">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-3 flex items-start justify-between gap-3"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-[#555] bg-[#1a1a1a] px-2 py-0.5 rounded">{benefit.product}</span>
          </div>
          <h4 className="text-sm font-medium text-white">{benefit.name}</h4>
          <div className="flex gap-3 mt-1">
            <span className="text-xs text-emerald-400 font-mono">Y1: {benefit.y1}</span>
            <span className="text-xs text-emerald-400/70 font-mono">Y2: {benefit.y2}</span>
            <span className="text-xs text-emerald-400/70 font-mono">Y3: {benefit.y3}</span>
            <span className="text-xs text-emerald-300 font-mono font-semibold">Total: {benefit.total}</span>
          </div>
        </div>
        <div className="mt-1">
          {expanded ? <ChevronUp size={16} className="text-[#555]" /> : <ChevronDown size={16} className="text-[#555]" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-[#1a1a1a]">
          {/* Story */}
          <div className="pt-3">
            <div className="text-xs text-[#666] uppercase tracking-wider mb-1">💡 Why This Matters</div>
            <p className="text-sm text-[#ccc] leading-relaxed">{benefit.story}</p>
          </div>

          {/* Key Assumptions */}
          <div>
            <div className="text-xs text-[#666] uppercase tracking-wider mb-1">📊 Key Assumptions</div>
            <ul className="space-y-0.5">
              {benefit.assumptions.map((a, i) => (
                <li key={i} className="text-xs text-[#999] flex items-start gap-1.5">
                  <span className="text-[#444] mt-0.5">•</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* How to Explain */}
          <div>
            <div className="text-xs text-[#666] uppercase tracking-wider mb-1">🗣️ How to Explain the Math</div>
            <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg p-3">
              <p className="text-sm text-[#bbb] leading-relaxed italic">&ldquo;{benefit.howToExplain}&rdquo;</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CategorySection({ category }: { category: Category }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`border ${category.borderColor} rounded-xl overflow-hidden bg-[#0d0d0d]`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-[#111] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={category.color}>{category.icon}</div>
          <div>
            <h3 className={`font-semibold ${category.color}`}>{category.name}</h3>
            <p className="text-xs text-[#555]">{category.benefits.length} benefits</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-emerald-400 font-mono">{category.total3yr}</span>
          <span className="text-xs text-[#555]">3yr</span>
          {expanded ? <ChevronUp size={18} className="text-[#555]" /> : <ChevronDown size={18} className="text-[#555]" />}
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-4 space-y-2">
          {category.benefits.map((b) => (
            <BenefitCard key={b.name} benefit={b} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────
   PAGE
   ──────────────────────────────────────────── */

export default function StudyGuidePage() {
  const [search, setSearch] = useState('');

  const filtered = search.trim()
    ? categories.map((cat) => ({
        ...cat,
        benefits: cat.benefits.filter(
          (b) =>
            b.name.toLowerCase().includes(search.toLowerCase()) ||
            b.product.toLowerCase().includes(search.toLowerCase()) ||
            b.story.toLowerCase().includes(search.toLowerCase()) ||
            b.howToExplain.toLowerCase().includes(search.toLowerCase())
        ),
      })).filter((cat) => cat.benefits.length > 0)
    : categories;

  const totalBenefits = filtered.reduce((sum, cat) => sum + cat.benefits.length, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">📚 ROI Benefit Study Guide</h2>
        <div className="flex items-center gap-3 mt-1">
          <p className="text-sm text-[#666]">
            Micro-learning cards for every benefit. Review before customer calls — know the story, the math, and how to explain it.
          </p>
          <a href="/value-engineering/study-guide/flashcards"
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 transition-colors">
            🃏 Flashcard Mode
          </a>
        </div>
        <div className="flex items-center gap-4 mt-3">
          <div className="bg-[#111] border border-[#222] rounded-lg px-3 py-1.5 text-center">
            <div className="text-lg font-bold text-emerald-400 font-mono">$30.9M</div>
            <div className="text-[10px] text-[#555] uppercase">3-Year Total</div>
          </div>
          <div className="bg-[#111] border border-[#222] rounded-lg px-3 py-1.5 text-center">
            <div className="text-lg font-bold text-white">{categories.reduce((s, c) => s + c.benefits.length, 0)}</div>
            <div className="text-[10px] text-[#555] uppercase">Benefits</div>
          </div>
          <div className="bg-[#111] border border-[#222] rounded-lg px-3 py-1.5 text-center">
            <div className="text-lg font-bold text-white">6</div>
            <div className="text-[10px] text-[#555] uppercase">Categories</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
        <input
          type="text"
          placeholder="Search benefits, products, or keywords..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#111] border border-[#222] rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-[#444] focus:outline-none focus:border-[#333]"
        />
        {search && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#555]">
            {totalBenefits} result{totalBenefits !== 1 ? 's' : ''}
          </div>
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
          <Search size={32} className="mx-auto mb-3 opacity-50" />
          <p>No benefits match &ldquo;{search}&rdquo;</p>
        </div>
      )}

      {/* Quick Reference */}
      <div className="bg-[#111] border border-[#222] rounded-xl p-5 mt-8">
        <h3 className="text-sm font-semibold text-white mb-3">🎯 Quick Reference — Key Assumptions</h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
          <div className="flex justify-between text-[#999]">
            <span>Employees</span>
            <span className="text-white font-mono">5,000</span>
          </div>
          <div className="flex justify-between text-[#999]">
            <span>Endpoint Devices</span>
            <span className="text-white font-mono">10,000</span>
          </div>
          <div className="flex justify-between text-[#999]">
            <span>IT Staff</span>
            <span className="text-white font-mono">125</span>
          </div>
          <div className="flex justify-between text-[#999]">
            <span>Annual Tickets</span>
            <span className="text-white font-mono">60,000</span>
          </div>
          <div className="flex justify-between text-[#999]">
            <span>IT FTE Salary</span>
            <span className="text-white font-mono">$89,000</span>
          </div>
          <div className="flex justify-between text-[#999]">
            <span>Annual Breach Risk</span>
            <span className="text-white font-mono">$4,440,000</span>
          </div>
          <div className="flex justify-between text-[#999]">
            <span>Compliance Penalty Exposure</span>
            <span className="text-white font-mono">$250,000</span>
          </div>
          <div className="flex justify-between text-[#999]">
            <span>Annual Software Costs</span>
            <span className="text-white font-mono">$5,000,000</span>
          </div>
          <div className="flex justify-between text-[#999]">
            <span>Annual Working Hours</span>
            <span className="text-white font-mono">1,708H</span>
          </div>
          <div className="flex justify-between text-[#999]">
            <span>FM Facilities Area</span>
            <span className="text-white font-mono">250,000 sqm</span>
          </div>
          <div className="flex justify-between text-[#999]">
            <span>FM Annual Utilities</span>
            <span className="text-white font-mono">$6,190,000</span>
          </div>
          <div className="flex justify-between text-[#999]">
            <span>AHT per Ticket</span>
            <span className="text-white font-mono">0.5H</span>
          </div>
        </div>
      </div>
    </div>
  );
}
