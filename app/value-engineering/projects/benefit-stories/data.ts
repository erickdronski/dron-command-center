// Value Cloud Benefit Stories - Master Data
// Each benefit has stories for all 8 verticals
// [Company] or [Organization] used as placeholders throughout

export type BenefitStory = {
  id: string;
  benefitName: string;
  category: 'financial' | 'time-savings';
  subcategory: string;
  description: string;
  formula: string;
  formulaFactors: string[];
  stories: Record<string, VerticalStory>;
};

export type VerticalStory = {
  scenario: string;
  talkTrack: string;
  whyItMatters: string;
  exampleMetric: string;
};

export const benefits: BenefitStory[] = [
  // ═══════════════════════════════════════════
  // FINANCIAL BENEFIT 1: High Priority Ticket Routing
  // ═══════════════════════════════════════════
  {
    id: 'high-priority-ticket-routing',
    benefitName: 'High Priority Ticket Routing',
    category: 'financial',
    subcategory: 'Penalties & Fines Avoidance',
    description: 'Neurons for ITSM routes high-priority tickets to the right teams without delay. By leveraging workflows and contextual data, it ensures urgent issues are escalated and addressed quickly, reducing compliance penalty exposure and improving service reliability.',
    formula: 'Annual Compliance Penalty Exposure × % Improvement with Automation & Workflows × Benefit Ramp',
    formulaFactors: ['Annual compliance penalty exposure', 'Improvement with automation & workflows (default: 20%)', 'Benefit Ramp (default: 100%)'],
    stories: {
      'business-services': {
        scenario: '[Company] manages IT for multiple client accounts, each with strict SLAs. A critical incident on a client\'s production environment gets logged but sits in a general queue for 40 minutes before someone realizes it\'s an SLA-breaching P1. By then, the contractual penalty clock has been ticking.',
        talkTrack: 'In professional services, your SLAs are your reputation. When a client-impacting incident comes in, every minute it sits in the wrong queue is a minute closer to a penalty — and a damaged relationship. Automated priority routing reads the ticket context, recognizes the client, the severity, the SLA tier, and puts it directly in front of the right team. No triage delay, no misclassification.',
        whyItMatters: 'Client SLA breaches in business services don\'t just cost penalty dollars — they cost renewals. A single misrouted P1 can undo months of relationship building. The 20% improvement means 1 in 5 potential SLA breaches gets caught by routing before it becomes a contractual issue.',
        exampleMetric: 'If [Company] has $500K in annual SLA penalty exposure, a 20% improvement = $100K in avoided penalties per year.',
      },
      'non-profit': {
        scenario: '[Organization] processes donor data and grant-related financials. A volunteer reports a "system issue" that\'s actually a payment processing breach exposing donor credit card data. The ticket lands in general IT support and isn\'t escalated to the security team for 3 hours.',
        talkTrack: 'Non-profits handle sensitive donor data — credit cards, personal information, grant financials. You\'re subject to the same GDPR and PCI-DSS requirements as any for-profit, but with a fraction of the IT staff to catch problems. When a potential breach comes in disguised as a generic ticket, automated routing is the difference between a same-day containment and a reportable incident that shakes donor trust.',
        whyItMatters: 'For non-profits, a data breach doesn\'t just mean fines — it means donors pull back. Trust is the currency of fundraising. Every dollar spent on breach response is a dollar not going to the mission. Smart routing ensures the 5% of tickets that are truly urgent get treated that way immediately.',
        exampleMetric: 'If [Organization] has $200K in compliance penalty exposure, a 20% improvement = $40K in risk reduction — that\'s a program coordinator\'s salary redirected to mission.',
      },
      'retail-wholesale': {
        scenario: '[Company] operates hundreds of store locations. A POS system at a flagship store starts intermittently failing during peak Saturday hours. The store manager logs a ticket marked "register issue." It queues behind routine requests because nobody flagged it as revenue-impacting.',
        talkTrack: 'In retail, a POS outage at a busy store isn\'t just an IT ticket — it\'s lost sales per minute. If that ticket sits in a general queue while customers walk out, you\'re burning revenue in real time. Automated routing detects "POS" + "flagship location" + "peak hours" and escalates immediately. The compliance angle is real too — PCI-DSS exposure from payment system issues compounds fast across a store network.',
        whyItMatters: 'Retail penalty exposure spans PCI-DSS fines, customer data breaches across potentially millions of transactions, and CCPA/GDPR violations from loyalty program data. One misrouted ticket about a "payment glitch" could be the early signal of a card skimming attack affecting every location on that system.',
        exampleMetric: 'If [Company] has $800K in annual compliance exposure across their store network, 20% improvement = $160K in risk reduction.',
      },
      'medical-hospitals': {
        scenario: 'A nurse at [Hospital] reports that the EHR system is "running slowly" on the third floor. What\'s actually happening is a ransomware encryption event starting on that wing\'s network. The ticket sits in the general queue behind password resets for 2 hours while the encryption spreads to clinical systems.',
        talkTrack: 'In a hospital, a misrouted critical ticket isn\'t just a compliance issue — it can be a patient safety issue. When clinical systems go down, you\'re in downtime procedures, paper charting, and delayed care. HIPAA breach costs average $10.9 million. Automated routing catches the signals — "EHR" + "slow" + "multiple users" — and escalates to your security and clinical IT teams simultaneously, before it spreads.',
        whyItMatters: 'Hospitals face the highest per-record breach cost of any industry. A P1 that gets misclassified as a P3 can mean the difference between isolating a ransomware event in 30 minutes versus losing an entire wing\'s systems for days. Beyond fines, Joint Commission findings can affect accreditation.',
        exampleMetric: 'If [Hospital] has $1.2M in annual HIPAA/compliance penalty exposure, 20% improvement = $240K in risk mitigation annually.',
      },
      'energy-utilities': {
        scenario: 'A field technician at [Company] reports "unusual readings" on a SCADA monitoring console. The ticket is logged as a standard infrastructure issue. In reality, it\'s an early indicator of unauthorized access to operational technology systems. The ticket sits in IT support for 6 hours before OT security is notified.',
        talkTrack: 'In energy and utilities, the line between an IT ticket and a national security event can be one misclassification. NERC CIP violations carry fines up to $1 million per day per violation. When a field tech reports something "unusual" on a control system, that ticket needs to hit your OT security team immediately — not wait for a Level 1 tech to Google what SCADA means. Automated routing bridges the IT/OT gap.',
        whyItMatters: 'Energy companies face a unique threat landscape — IT/OT convergence means a ticket from a field worker could be the first sign of a grid-threatening cyber event. NERC CIP, TSA Pipeline Security, and state PUC regulations create massive penalty exposure. Routing isn\'t just efficiency — it\'s critical infrastructure protection.',
        exampleMetric: 'If [Company] has $2M in annual NERC CIP / regulatory penalty exposure, 20% improvement = $400K in risk reduction.',
      },
      'banking-finance': {
        scenario: 'A branch employee at [Bank] reports they "can\'t access the wire transfer system." The ticket is categorized as a standard access issue. What\'s actually happening is a business email compromise (BEC) attack that has locked out legitimate users while fraudulent transfers are being initiated. The ticket queues for 90 minutes.',
        talkTrack: 'In banking, a misrouted ticket can cost millions in fraud before anyone realizes it\'s not an access issue. Your regulatory exposure spans SOX, PCI-DSS, GLBA, and OCC requirements — any one of which carries six-figure-plus penalties. Automated routing recognizes the pattern: "wire transfer" + "access denied" + "branch" triggers an immediate fraud/security escalation, not an identity management workflow.',
        whyItMatters: 'Financial services has zero tolerance for delayed incident response. Regulators audit your incident response times. A 90-minute delay in escalating a potential fraud event isn\'t just a compliance finding — it\'s front-page news. Every minute of delayed routing on a critical financial system ticket compounds exposure exponentially.',
        exampleMetric: 'If [Bank] has $1.5M in annual regulatory penalty exposure, 20% improvement = $300K in risk mitigation.',
      },
      'healthcare-pharma': {
        scenario: 'During a live clinical trial at [Company], the data management system throws an error. A lab technician logs a ticket: "system error in CDMS." The ticket enters the general IT queue. Meanwhile, trial data integrity is potentially compromised, which — if not documented within hours — could invalidate months of trial data and trigger an FDA audit.',
        talkTrack: 'In pharma, your IT systems are validated environments. When a clinical data management system has an issue during an active trial, that\'s not a regular IT ticket — it\'s a GxP event that needs documentation, investigation, and potentially regulatory notification. Automated routing catches "CDMS" or "trial system" keywords and sends it directly to your validated systems team with the right compliance workflow attached.',
        whyItMatters: 'FDA 21 CFR Part 11 and GxP requirements mean system issues in validated environments must be documented and investigated within strict timelines. A misrouted ticket that delays response by even a few hours can trigger audit findings, warning letters, or — worst case — invalidate trial data worth tens of millions in R&D investment.',
        exampleMetric: 'If [Company] has $750K in annual FDA/GxP penalty exposure, 20% improvement = $150K in risk mitigation.',
      },
      'aerospace-defense-manufacturing': {
        scenario: 'An engineer at [Company] reports "file access issues" on a classified network segment. The ticket is routed to standard IT support. In reality, the access anomaly is an indicator of a potential ITAR data spill — controlled technical data may have been moved to an unclassified system. The security team doesn\'t see it for 4 hours.',
        talkTrack: 'In aerospace and defense, a misrouted ticket isn\'t just a compliance issue — it can be a national security incident. ITAR violations carry criminal penalties. CMMC non-compliance means you lose the contract, period. When someone on a classified network reports an access anomaly, automated routing puts that in front of your security and compliance team immediately — not your helpdesk.',
        whyItMatters: 'Defense contractors operate under ITAR, CMMC/NIST 800-171, and DFARS — all of which have strict incident reporting timelines. A data spill between classified and unclassified networks that goes undetected because of ticket misrouting can result in contract loss, debarment, and criminal prosecution. There is no "oops" in this space.',
        exampleMetric: 'If [Company] has $1M in annual ITAR/CMMC compliance exposure, 20% improvement = $200K in risk mitigation.',
      },
    },
  },

  // ═══════════════════════════════════════════
  // FINANCIAL BENEFIT 2: Reduced Incident Average Handle Time (AHT)
  // ═══════════════════════════════════════════
  {
    id: 'reduced-incident-aht',
    benefitName: 'Reduced Incident Average Handle Time (AHT)',
    category: 'financial',
    subcategory: 'Operational Efficiencies',
    description: 'Neurons for ITSM provides process optimization tools such as quick actions, knowledgebase articles, and automated workflows to lower incident average handle time (AHT). These enhancements enable agents to resolve issues more quickly and efficiently. Faster incident resolution improves both productivity and customer satisfaction.',
    formula: 'Annual Tickets × % Reduction in AHT × AHT Cost per Incident × Benefit Ramp',
    formulaFactors: ['Annual Tickets', 'Reduction in AHT with ticket automation and workflows (default: 11%)', 'AHT cost per incident (derived from loaded salary ÷ annual hours × AHT)', 'Benefit Ramp (default: 100%)'],
    stories: {
      'business-services': {
        scenario: '[Company] runs a shared service desk supporting 15 different client accounts. Agents spend 10+ minutes per ticket just figuring out which client environment they\'re dealing with, what tools apply, and what the SLA tier is — before they even start troubleshooting.',
        talkTrack: 'In professional services, your agents aren\'t just resolving tickets — they\'re context-switching between client environments all day. Every ticket requires figuring out: which client, which SLA, which tools, which escalation path. With auto-categorization and suggested resolutions based on the client context, you eliminate that lookup time. Instead of 10 minutes of "which client is this and what do I do," the agent gets a pre-loaded context card with the right workflow. That shaves 3-4 minutes off every interaction — and across tens of thousands of tickets, that\'s real FTE capacity back.',
        whyItMatters: 'Business services margins depend on service desk efficiency. If you can reduce AHT by 11%, you\'re either serving the same volume with fewer people, or absorbing client growth without adding headcount. That directly protects margin on every managed services contract.',
        exampleMetric: 'At 50,000 tickets/year with $30 cost per ticket, an 11% AHT reduction = $165K in annual savings.',
      },
      'non-profit': {
        scenario: '[Organization] has a 5-person IT team supporting 800 staff and hundreds of volunteers. Their service desk handles everything from "my laptop won\'t connect to the donor database" to "the event registration site is down." Every ticket takes longer than it should because there\'s no standardized troubleshooting — each tech has their own approach.',
        talkTrack: 'When you only have 5 people on IT and hundreds of users depending on you, every minute per ticket matters exponentially. Your team doesn\'t have time to reinvent the wheel on every incident. Automated suggestions — "this looks like the VPN issue we resolved 47 times this month, here\'s the fix" — means your small team operates like a team twice its size. That 11% AHT reduction means your 5 people are effectively doing the work of 5.5, without overtime or burnout.',
        whyItMatters: 'Non-profits can\'t hire their way out of IT problems. Every hour your IT team spends on a ticket they could have resolved faster is an hour not spent on mission-critical projects. AHT reduction is a force multiplier for lean teams — it\'s how you do more with the same headcount.',
        exampleMetric: 'At 15,000 tickets/year with $25 cost per ticket, an 11% AHT reduction = $41K saved — enough to fund a part-time IT role.',
      },
      'retail-wholesale': {
        scenario: '[Company] has a central IT helpdesk supporting 500 stores. Store associates call in about POS issues, inventory scanners, WiFi, and price label printers. Agents spend significant time on each call asking "which store, which register, what model POS, when did it start" — basic triage that could be automated.',
        talkTrack: 'Retail service desks deal with massive volume of similar issues across hundreds of locations. "Register 3 isn\'t printing receipts" is the same problem at store #47 as it is at store #312, but your agents start from scratch every time. With automation, the moment a store associate calls in, the system pulls up: store location, device inventory, recent incidents at that store, and the most likely resolution. Your agent skips 5 minutes of questioning and goes straight to fixing.',
        whyItMatters: 'In retail, store-level IT issues directly impact sales. A register down for 30 minutes during lunch rush at a busy store costs more than the IT agent\'s hourly rate. Faster resolution = stores back to selling faster. And during peak seasons like Black Friday and holidays, when ticket volume doubles, AHT reduction is the only way to keep up without hiring temp agents.',
        exampleMetric: 'At 80,000 tickets/year with $28 cost per ticket, an 11% AHT reduction = $246K in annual operational savings.',
      },
      'medical-hospitals': {
        scenario: 'A clinician at [Hospital] calls the helpdesk because their badge tap isn\'t working on a medication dispensing cabinet. The agent spends 15 minutes verifying the clinician\'s identity, the device location, checking Active Directory, and looking up the cabinet model — all before trying a fix. Meanwhile, the clinician is standing in a hallway, unable to access medications for their patients.',
        talkTrack: 'In a hospital, every minute a clinician spends on an IT issue is a minute not spent with patients. Your nurses and doctors are the most expensive people in the building — when they call IT, you need to resolve it fast. Automated context pulls their identity, role, location, device assignments, and recent incidents immediately. The agent doesn\'t spend 10 minutes asking "which floor are you on and what\'s your employee ID" — they already know, and they have the likely fix queued up.',
        whyItMatters: 'Clinical staff time is worth 3-5x IT staff time. Every minute of AHT reduction on a clinician\'s ticket has a multiplied impact on the organization. Plus, faster IT resolution means better clinician satisfaction scores, which directly impacts retention — and replacing a nurse costs $50-75K in recruiting and training.',
        exampleMetric: 'At 100,000 tickets/year with $35 cost per ticket, an 11% AHT reduction = $385K in annual savings — and immeasurable improvement in clinician satisfaction.',
      },
      'energy-utilities': {
        scenario: 'A field technician at [Company] calls in because their ruggedized tablet can\'t connect to the asset management system while at a remote substation. The agent spends 20 minutes trying to understand the environment — "Are you on cellular or satellite? Which field app? What firmware version?" — because they have no visibility into the device or location.',
        talkTrack: 'Your field technicians are your front line — and when they\'re stuck on an IT issue at a remote site, they can\'t just walk to the IT desk. Every minute of handle time on a field worker\'s ticket is a minute of a skilled technician standing idle at a substation or pipeline facility. With device context and location awareness built into the ticket, your agent immediately sees: "field tech, substation #47, ruggedized tablet model X, cellular connection, last synced 2 hours ago." They skip the interrogation and go straight to resolution.',
        whyItMatters: 'Field worker downtime in energy is exceptionally expensive — a line technician unable to complete inspections or maintenance means compliance schedules slip. AHT reduction on field tickets also reduces safety risk — a technician troubleshooting IT while standing near high-voltage equipment is a technician who\'s distracted.',
        exampleMetric: 'At 45,000 tickets/year with $32 cost per ticket, an 11% AHT reduction = $158K in annual savings, plus reduced field downtime.',
      },
      'banking-finance': {
        scenario: 'A relationship manager at [Bank] calls IT because their client portfolio dashboard is frozen during a client meeting. The agent spends 12 minutes verifying the user, determining which application and environment, checking for known issues, and looking up recent patches — all while the banker sits awkwardly with a client waiting for account information.',
        talkTrack: 'In banking, your front-line staff — relationship managers, traders, branch employees — generate revenue. Every minute they\'re waiting on IT is revenue-impaired time. With automated context, the moment a ticket comes in from a relationship manager, the agent sees their role, applications, recent system changes affecting their environment, and suggested resolutions. The "verify and investigate" phase drops from 12 minutes to 3. Your revenue generators get back to generating revenue.',
        whyItMatters: 'Financial services has the highest loaded cost per employee of almost any industry. A relationship manager\'s time is worth $200-400/hour to the bank. Shaving 3-4 minutes off their IT interactions saves both IT cost AND prevents revenue-generating time from being wasted. Multiply that across thousands of front-office staff and tens of thousands of tickets.',
        exampleMetric: 'At 120,000 tickets/year with $40 cost per ticket, an 11% AHT reduction = $528K in annual IT operational savings.',
      },
      'healthcare-pharma': {
        scenario: 'A research scientist at [Company] submits a ticket because their lab information management system (LIMS) isn\'t syncing data from an instrument. The agent has no context on the validated environment — they spend 25 minutes just understanding what LIMS is, which instrument, and whether they\'re even allowed to troubleshoot it or need to escalate to the validated systems team.',
        talkTrack: 'Pharma IT environments are unique because many systems are validated — agents can\'t just "try things." They need to know immediately: is this a validated system? Does troubleshooting require a change control? Who owns this application? With automated context, the ticket arrives pre-enriched: "LIMS system, validated environment, instrument integration issue, escalate to validated systems team with change control template." Your L1 agent doesn\'t waste 25 minutes figuring out they can\'t touch it — they route it correctly in 5.',
        whyItMatters: 'In pharma, wasted AHT on validated systems is doubly expensive: you\'re paying for IT time AND for scientist downtime while their instrument sits idle. Research scientists represent millions in annual loaded cost. Plus, incorrect troubleshooting on a validated system can trigger audit findings — so faster, correct routing actually reduces compliance risk too.',
        exampleMetric: 'At 60,000 tickets/year with $38 cost per ticket, an 11% AHT reduction = $251K in annual savings.',
      },
      'aerospace-defense-manufacturing': {
        scenario: 'A manufacturing engineer at [Company] reports that a CNC machine\'s control interface is showing errors. The IT agent spends 20 minutes trying to determine: is this an IT issue or an OT issue? Who owns the machine? Is this on the classified network? Can I remote in? What clearance level do I need? By the time they figure it out, a production line has been idle for 45 minutes.',
        talkTrack: 'Manufacturing and defense environments have an IT/OT boundary that confuses service desk agents every single day. "Is this an IT ticket or a shop floor issue?" With context automation, the ticket arrives knowing: "CNC machine #14, Building C, OT network, owned by manufacturing engineering, IT can assist with network connectivity only, escalate mechanical issues to OT team." Your agent knows immediately what they can and can\'t touch — no 20 minutes of investigation while a production line sits idle.',
        whyItMatters: 'In manufacturing, production line downtime is measured in thousands of dollars per hour. In defense, add ITAR and CMMC considerations — an IT agent accidentally accessing a classified system while troubleshooting can create a compliance incident. Faster AHT with proper context means production runs again sooner AND compliance boundaries are maintained.',
        exampleMetric: 'At 70,000 tickets/year with $35 cost per ticket, an 11% AHT reduction = $270K in annual savings, plus reduced production downtime.',
      },
    },
  },

  // ═══════════════════════════════════════════
  // FINANCIAL BENEFIT 3: Optimized Knowledge for Improved Service Delivery
  // ═══════════════════════════════════════════
  {
    id: 'optimized-knowledge',
    benefitName: 'Optimized Knowledge for Improved Service Delivery',
    category: 'financial',
    subcategory: 'Operational Efficiencies',
    description: 'Neurons for ITSM provides employees with easy access to self-service portals and searchable knowledge base articles, helping them resolve common issues without submitting support tickets. By enabling users to find solutions independently, the platform reduces the number of routine requests. Built-in feedback and analytics help continually improve support content.',
    formula: 'Annual Tickets × % Improved Productivity with KB Optimization × AHT Cost per Incident × Benefit Ramp',
    formulaFactors: ['Annual Tickets', 'Improved productivity with knowledge base optimization (default: 10%)', 'AHT cost per incident', 'Benefit Ramp (default: 100%)'],
    stories: {
      'business-services': {
        scenario: '[Company] onboards new consultants weekly, each needing access to different client environments, tools, and VPNs. The same "how do I connect to Client X\'s environment" ticket gets submitted 30 times a month because the documentation is either outdated or unfindable in a buried SharePoint folder.',
        talkTrack: 'Professional services firms have massive knowledge management challenges — you\'re supporting dozens of client environments, each with different access procedures. When a new consultant joins a client engagement, they shouldn\'t need to submit a ticket to figure out how to connect. With optimized knowledge, the self-service portal surfaces "Client X onboarding guide" the moment someone searches for that client name. The 30 tickets a month for the same question become 3, and your agents focus on real problems instead of answering the same setup question for the 400th time.',
        whyItMatters: 'In business services, speed to productivity for new consultants directly impacts billing. If a consultant spends a day waiting for an IT ticket to learn how to access their client environment, that\'s a lost billable day. Self-service knowledge turns a 24-hour wait into a 10-minute self-fix.',
        exampleMetric: 'At 50,000 tickets/year with $30 cost per ticket, a 10% deflection through knowledge = $150K in annual savings.',
      },
      'non-profit': {
        scenario: '[Organization] relies heavily on volunteers who rotate in and out. Every new volunteer cohort generates a flood of tickets: "How do I access the donor database?", "What\'s the WiFi password at the community center?", "How do I submit expense reports?" The same 15 questions repeat every month because there\'s no self-service resource.',
        talkTrack: 'Non-profits have a unique challenge: high turnover of volunteers and seasonal staff who all need the same basic IT help. Your 5-person IT team can\'t spend half their week answering "what\'s the WiFi password" 50 times. A well-structured knowledge base with a simple self-service portal — "New volunteer? Start here" — deflects those repetitive tickets entirely. Your IT team focuses on keeping mission-critical systems running instead of being a human FAQ page.',
        whyItMatters: 'With a tiny IT team, every deflected ticket is a gift. If 10% of tickets resolve through self-service, that\'s hours per week back for your team to work on things that actually require human judgment. It also improves the volunteer experience — they feel empowered, not dependent.',
        exampleMetric: 'At 15,000 tickets/year with $25 cost per ticket, a 10% knowledge deflection = $37.5K saved — nearly a full salary redirect.',
      },
      'retail-wholesale': {
        scenario: '[Company] has 500 stores with high associate turnover. Every new hire at every store generates tickets: "How do I clock in?", "The barcode scanner won\'t connect", "How do I process a return on the new system?" These basic procedural questions account for a huge portion of helpdesk volume, especially after system updates or new POS rollouts.',
        talkTrack: 'Retail turnover means you\'re effectively re-training your workforce constantly. When you roll out a new POS system or update your inventory app, 500 stores × 20 associates = 10,000 people who all have the same 5 questions. Without self-service knowledge, that\'s 10,000 tickets. With a searchable portal and contextual help — "you\'re at store #212 on POS v3.2, here\'s the returns process" — you deflect 80% of those. Your helpdesk handles the real issues, not the training gap.',
        whyItMatters: 'Retail helpdesk costs scale with store count and turnover. Every store you open, every seasonal hire, every system update generates ticket volume. Knowledge is the only way to scale support without scaling headcount linearly. It also reduces time-to-productivity for new hires — they\'re helping customers sooner instead of calling IT.',
        exampleMetric: 'At 80,000 tickets/year with $28 cost per ticket, a 10% knowledge deflection = $224K in annual savings.',
      },
      'medical-hospitals': {
        scenario: 'Every quarter, [Hospital] updates their EHR system. After each update, the helpdesk is flooded with 2,000+ tickets in a week from clinicians asking "where did [feature] move?" or "how do I do [task] in the new version?" Meanwhile, truly critical clinical IT issues get buried under the volume.',
        talkTrack: 'Hospitals have predictable knowledge spikes — every EHR update, every system migration, every Joint Commission prep generates the same flood of questions. Clinicians don\'t have time to hunt through a SharePoint. They need answers surfaced where they work — ideally before they even submit a ticket. With optimized knowledge, a nurse searching "medication reconciliation new version" gets a 2-minute walkthrough video immediately. 10% ticket deflection after an EHR update alone could free your team to handle the real clinical IT emergencies hiding in the queue.',
        whyItMatters: 'In hospitals, helpdesk volume after system updates directly impacts patient care — if clinicians are frustrated and waiting on IT, they\'re not focused on patients. Knowledge deflection reduces both IT cost AND clinician frustration. It also reduces the risk of clinicians developing unsafe workarounds because they can\'t figure out the new system.',
        exampleMetric: 'At 100,000 tickets/year with $35 cost per ticket, a 10% knowledge deflection = $350K in annual savings.',
      },
      'energy-utilities': {
        scenario: '[Company] has field technicians who rotate between substations, plants, and remote sites. Each site has different equipment, different access procedures, and different safety protocols. Technicians call the helpdesk before every site visit asking "how do I connect to the network at Site X?" because the procedures are different everywhere and documented nowhere useful.',
        talkTrack: 'Energy companies have field workers who need IT help at the worst possible times — when they\'re at a remote site, often without reliable connectivity. If they can pre-load site-specific knowledge before they deploy — "Site #47 network setup guide," "Plant B VPN configuration" — they don\'t need to call a helpdesk from the middle of a wind farm. That 10% deflection is really about enabling field workers to be self-sufficient, which is critical when cell service isn\'t guaranteed.',
        whyItMatters: 'Field worker IT issues in energy are uniquely expensive because of the cost of the truck roll, the technician\'s hourly rate, and the compliance implications of work not getting done on schedule. Self-service knowledge accessible offline on field devices is a game-changer for operational efficiency.',
        exampleMetric: 'At 45,000 tickets/year with $32 cost per ticket, a 10% knowledge deflection = $144K in annual savings.',
      },
      'banking-finance': {
        scenario: '[Bank] pushes regulatory reporting updates quarterly. Each update changes workflows in the compliance platform. After every update, compliance officers and branch managers submit hundreds of tickets asking "how do I run the new SAR report?" or "where is the updated CTR form?" The answers are always the same — but the knowledge never reaches the people who need it.',
        talkTrack: 'Banking has regulatory updates constantly — quarterly, sometimes monthly. Each one changes how people interact with compliance, trading, or customer-facing systems. If your knowledge base surfaces "Q1 2026 regulatory update — what changed and how to use the new workflows" proactively to the affected teams, you prevent the wave before it hits. That 10% deflection in financial services isn\'t just about IT cost — it\'s about compliance officers and relationship managers staying productive through change cycles.',
        whyItMatters: 'In banking, the people submitting tickets after a system update are often highly compensated compliance officers, traders, or relationship managers. Their ticket isn\'t just an IT cost — it\'s $200-400/hour of their time waiting for an answer that could have been self-served. Knowledge optimization has a multiplied ROI in high-cost-per-employee industries.',
        exampleMetric: 'At 120,000 tickets/year with $40 cost per ticket, a 10% knowledge deflection = $480K in annual savings.',
      },
      'healthcare-pharma': {
        scenario: '[Company] has 2,000 scientists across 15 global R&D sites. Each site uses slightly different versions of lab software, different instrument configurations, and different validated processes. Scientists submit tickets daily asking "how do I configure [instrument] in [site-specific LIMS version]?" — and the answer exists in a validation document that nobody can find.',
        talkTrack: 'Pharma R&D environments are a knowledge management nightmare — validated processes, site-specific configurations, instrument-specific procedures, all documented in QMS systems that scientists don\'t have time to search. If your self-service portal surfaces "Instrument X configuration for LIMS v4.2 at Site Chicago" when a scientist searches for it, you save them 30 minutes of hunting AND save your IT team from a 20-minute ticket. Multiply by 2,000 scientists making these requests regularly.',
        whyItMatters: 'Scientists are among the highest-cost employees in pharma. Every hour a researcher spends on an IT issue instead of running experiments is an hour of R&D productivity lost. In drug development, time literally equals money — a day of delay in a trial can cost hundreds of thousands. Knowledge that empowers self-service directly accelerates the R&D pipeline.',
        exampleMetric: 'At 60,000 tickets/year with $38 cost per ticket, a 10% knowledge deflection = $228K in annual savings.',
      },
      'aerospace-defense-manufacturing': {
        scenario: '[Company] operates separate classified and unclassified networks. Engineers constantly confuse which systems are on which network, which credentials to use, and how to transfer files between environments. The helpdesk handles 50+ tickets per week that are essentially "how do I access [system] on [network]?" because the documentation is classified or buried in security briefing materials.',
        talkTrack: 'In defense and manufacturing, your engineers work across multiple network classification levels, each with different access procedures, different tools, and different security requirements. If an engineer can search "how to access [program name] design files" and get a clear, security-approved guide based on their clearance level — without calling the helpdesk — that\'s a win for everyone. Your agents stop repeating classified network procedures over the phone, and your engineers stop waiting.',
        whyItMatters: 'Defense engineers are expensive and in high demand. Every hour they spend waiting on an IT answer is an hour of program work not getting done. And in this industry, there\'s a security benefit too — a well-maintained knowledge base with proper access controls reduces the chance of someone accidentally violating information handling procedures because they "guessed" instead of looking it up.',
        exampleMetric: 'At 70,000 tickets/year with $35 cost per ticket, a 10% knowledge deflection = $245K in annual savings.',
      },
    },
  },

  // ═══════════════════════════════════════════
  // FINANCIAL BENEFIT 4: Asset Relationship Management
  // ═══════════════════════════════════════════
  {
    id: 'asset-relationship-management',
    benefitName: 'Asset Relationship Management',
    category: 'financial',
    subcategory: 'Operational Efficiencies',
    description: 'Neurons for ITSM delivers visibility into assets and their associated users, enabling IT teams to manage relationships more effectively. By linking assets to user profiles, it accelerates issue resolution and improves lifecycle management.',
    formula: 'IT FTEs Dedicated to SAM & HAM × % Reduction in Effort with Automated Asset Tracking × Fully Loaded IT FTE Annual Salary × Benefit Ramp',
    formulaFactors: ['IT FTEs dedicated to SAM & HAM', 'Reduction in effort with automated asset tracking (default: 2%)', 'Fully loaded IT FTE Annual Salary', 'Benefit Ramp (default: 100%)'],
    stories: {
      'business-services': {
        scenario: '[Company] manages assets across their own infrastructure plus 12 client environments. When a client asks "how many devices are running outdated OS versions in our environment?", the asset team spends 3 days pulling data from multiple sources and reconciling spreadsheets to give an answer.',
        talkTrack: 'In professional services, you\'re not just tracking your own assets — you\'re often managing or reporting on client assets too. When a client audit requires a full inventory of their environment, your SAM team shouldn\'t need 3 days of spreadsheet reconciliation. Automated asset relationships mean you can pull "all devices for Client X, by OS version, by patch status" in minutes. That 2% effort reduction is really about eliminating the manual reconciliation work that eats your team alive during audit season.',
        whyItMatters: 'For managed services providers, asset management accuracy directly impacts client trust and contract renewals. If you can\'t quickly answer "what\'s in my environment?" for a client, they start questioning the value of the managed relationship. Automated asset relationships turn that from a 3-day project into a dashboard.',
        exampleMetric: 'With 8 FTEs on SAM/HAM at $85K loaded cost, 2% effort reduction = $13.6K in annual savings plus dramatic improvement in client reporting speed.',
      },
      'non-profit': {
        scenario: '[Organization] received a technology grant 3 years ago that funded 200 laptops. The grant requires annual reporting on device usage, condition, and disposition. The IT manager spends a full week each year trying to figure out which laptops are still in use, which were reassigned, and which were retired — because the asset records are a mess.',
        talkTrack: 'Non-profits often receive technology through grants that come with reporting requirements. "Where are the 200 laptops we gave you, and are they being used for their intended purpose?" If you can\'t answer that quickly, you risk the grant relationship. Automated asset relationships link every device to a user, a department, and a funding source. Your annual grant report goes from a week-long scavenger hunt to a same-day export.',
        whyItMatters: 'For non-profits, asset management isn\'t just operational efficiency — it\'s grant compliance. Losing track of grant-funded equipment can jeopardize future funding. With a tiny IT team, the week spent on annual asset reconciliation is a week not spent on mission-supporting work.',
        exampleMetric: 'With 2 FTEs touching asset management at $65K loaded cost, 2% effort reduction = $2.6K — modest, but the grant compliance value is disproportionately higher.',
      },
      'retail-wholesale': {
        scenario: '[Company] has 15,000 POS terminals, handheld scanners, and back-office PCs across 500 stores. When a new POS software update needs to roll out, nobody can confidently say which stores have which hardware model, which are under warranty, and which need to be replaced first because they can\'t run the new software.',
        talkTrack: 'In retail, your device estate is massive and distributed. Every store has POS terminals, scanners, label printers, back-office PCs, and digital signage — all on different refresh cycles, different warranty dates, different software versions. When you need to plan a POS migration or respond to a security vulnerability, you need to know: "exactly which stores have which devices." Automated asset relationships give your team that picture instantly instead of polling 500 store managers with a spreadsheet.',
        whyItMatters: 'Retail hardware refresh planning is a multi-million dollar decision. If you over-order by 10% because your asset data is wrong, that\'s hundreds of thousands in unnecessary capital expenditure. If you under-order, stores are stuck on unsupported hardware. Accurate asset relationships make refresh planning precise — and they make POS vendor audits painless.',
        exampleMetric: 'With 10 FTEs on SAM/HAM at $75K loaded cost, 2% effort reduction = $15K in direct savings — plus potentially hundreds of thousands in avoided over-procurement.',
      },
      'medical-hospitals': {
        scenario: '[Hospital] has thousands of clinical devices — infusion pumps, patient monitors, workstations on wheels, badge readers — many of which are networked. When Joint Commission asks "show us every networked medical device, its firmware version, and when it was last patched," the biomed and IT teams spend 2 weeks compiling the answer from 4 different systems.',
        talkTrack: 'Hospitals have the most complex asset landscape of any industry — you\'re not just tracking laptops, you\'re tracking clinical devices that connect to patient systems. Joint Commission, HIPAA audits, and FDA cybersecurity requirements all ask the same question: "what\'s connected to your network and is it current?" If it takes your team 2 weeks to answer that, you\'re burning expensive biomed engineer and IT time on manual reconciliation. Automated asset relationships — linking devices to locations, users, networks, and compliance status — turn that into a real-time dashboard.',
        whyItMatters: 'In healthcare, untracked networked devices are a security and patient safety risk. An unpatched infusion pump on the clinical network is a threat vector. Asset relationship management isn\'t just efficiency — it\'s clinical safety. And when CMS or Joint Commission walks in for a surprise audit, having that inventory instantly is the difference between a clean survey and a corrective action.',
        exampleMetric: 'With 15 FTEs across IT asset management and biomed at $80K loaded cost, 2% effort reduction = $24K — but avoiding a Joint Commission finding is priceless.',
      },
      'energy-utilities': {
        scenario: '[Company] has IT assets deployed across 200 field locations — substations, control rooms, generation plants. When a critical firmware vulnerability is announced for a specific industrial PC model, the asset team spends a week trying to figure out which sites have that model deployed, because field assets were tracked on paper or in site-specific spreadsheets.',
        talkTrack: 'Energy companies have assets everywhere — control rooms, substations, offshore platforms, field vehicles. When a critical vulnerability hits and NERC CIP requires remediation within 35 days, you can\'t spend a week just figuring out which sites are affected. Automated asset relationships link every device to its site, its network segment, and its role (IT vs OT). When the vulnerability drops, you can immediately query: "all assets of model X across all field locations" and have your remediation plan the same day.',
        whyItMatters: 'In energy, asset management has a direct compliance dimension. NERC CIP requires an accurate inventory of all cyber assets within the electronic security perimeter. If your records are wrong, that\'s a violation even without an incident. Automated asset relationships keep you audit-ready at all times — not just scrambling before the next NERC assessment.',
        exampleMetric: 'With 12 FTEs on asset management at $78K loaded cost, 2% effort reduction = $18.7K in direct savings, plus NERC CIP audit readiness.',
      },
      'banking-finance': {
        scenario: '[Bank] goes through annual SOX audits that require complete hardware and software inventories for all systems touching financial data. The IT asset team spends 6 weeks each year pre-audit reconciling asset records between their CMDB, purchasing, and disposal records. Every year, they find 5-10% discrepancies that have to be investigated.',
        talkTrack: 'In banking, your asset inventory isn\'t just operational — it\'s a compliance requirement. SOX, OCC examinations, and internal audit all need to see: what hardware exists, what software is on it, who has access, and is it all accounted for. If your team spends 6 weeks a year reconciling for audits, that\'s a quarter of someone\'s year dedicated to spreadsheet archaeology. Automated asset relationships keep that inventory live and accurate. Your pre-audit prep goes from 6 weeks to a few days of validation.',
        whyItMatters: 'Banks that can\'t produce accurate asset inventories quickly get findings. Findings lead to remediation plans, additional scrutiny, and potential restrictions from regulators. The 2% effort reduction is the steady-state time savings, but the real value is audit readiness — being able to respond to a regulatory request in hours instead of weeks.',
        exampleMetric: 'With 14 FTEs on SAM/HAM at $90K loaded cost, 2% effort reduction = $25.2K — plus dramatically reduced audit preparation time and risk.',
      },
      'healthcare-pharma': {
        scenario: '[Company] has thousands of lab instruments connected to validated systems. When the FDA sends a pre-approval inspection notice, the quality team asks IT: "Give us a complete inventory of all computer systems connected to [drug name]\'s manufacturing and testing processes, including software versions and validation status." The IT team takes 3 weeks.',
        talkTrack: 'In pharma, an FDA inspection notice triggers a fire drill across IT, quality, and operations. "Show us every computerized system in the supply chain for this product" is a question that sounds simple but — without automated asset relationships — takes weeks to answer accurately. Every instrument, every LIMS connection, every manufacturing execution system needs to be documented with current software versions, validation status, and change history. Automated asset relationships pre-build that picture so you\'re inspection-ready at all times.',
        whyItMatters: 'FDA 483 observations related to inadequate computer system controls are increasingly common. If you can\'t demonstrate you know what systems support your manufacturing processes — and that they\'re all validated and current — that\'s a finding. In pharma, a single FDA warning letter can delay a drug approval by months, costing hundreds of millions. Asset management is existential.',
        exampleMetric: 'With 10 FTEs on IT/lab asset management at $85K loaded cost, 2% effort reduction = $17K — but the FDA inspection readiness value is exponentially higher.',
      },
      'aerospace-defense-manufacturing': {
        scenario: '[Company] maintains separate asset inventories for classified and unclassified networks — both required for CMMC compliance. When a DCMA (Defense Contract Management Agency) audit is announced, the security team discovers that 200 devices migrated between networks during a facility move and the inventory wasn\'t updated. Now they have 30 days to reconcile before the audit.',
        talkTrack: 'In defense, your asset inventory is a CMMC/NIST 800-171 compliance artifact. You need to know exactly which assets are on which network, at which classification level, with which controlled unclassified information (CUI). A facility move that shuffles devices between networks can create compliance gaps that go undetected for months — until DCMA or DIBCAC shows up. Automated asset relationships track every device across networks and classification boundaries in real time. No surprises at audit time.',
        whyItMatters: 'For defense contractors, CMMC non-compliance doesn\'t just mean a fine — it means you can\'t bid on DoD contracts. Losing contract eligibility is an existential threat. Asset management accuracy is literally a prerequisite for doing business. The 2% effort reduction is operational efficiency, but the real ROI is maintaining the contract eligibility that keeps the lights on.',
        exampleMetric: 'With 15 FTEs on asset/configuration management at $82K loaded cost, 2% effort reduction = $24.6K — plus maintained CMMC compliance and contract eligibility.',
      },
    },
  },
];

// Helper to get benefits for a specific vertical
export function getBenefitsForVertical(verticalId: string): Array<BenefitStory & { verticalStory: VerticalStory }> {
  return benefits
    .filter(b => b.stories[verticalId])
    .map(b => ({
      ...b,
      verticalStory: b.stories[verticalId],
    }));
}

// Helper to get all verticals that have stories for a given benefit
export function getVerticalsForBenefit(benefitId: string): string[] {
  const benefit = benefits.find(b => b.id === benefitId);
  if (!benefit) return [];
  return Object.keys(benefit.stories);
}
