'use client';

import { useState } from 'react';
import { RefreshCw, ChevronRight, Sparkles } from 'lucide-react';

// ── Data ───────────────────────────────────────────────────────────────────
interface Role {
  id: string;
  title: string;
  emoji: string;
  attempts: string[];   // progressively more confused
  grandma: string;      // grandma's final take
  grandmaMisheard: string; // what grandma tells her friends your job is
}

const ROLES: Role[] = [
  {
    id: 'swe', title: 'Software Engineer', emoji: '💻',
    attempts: [
      "You know how the bank website lets you check your balance? Somebody built that. He builds those. Not that exact one — a different one. For a different company. But same idea. He types things and then a website does something.",
      "Okay so you know how your phone has apps? And the apps do things when you tap them? He writes the instructions that tell the app what to do when you tap it. The instructions are in a language the phone understands but humans can also technically read. He reads and writes that language all day.",
      "He sits at a computer and makes the computer do things. It's very important. He makes good money.",
    ],
    grandma: "So he fixes computers? Like when mine freezes? Because mine has been doing a thing where it freezes and I have to unplug it. Can he look at it when he visits?",
    grandmaMisheard: "He's a computer engineer. Very technical. Fixes computers for a living, I think."
  },
  {
    id: 'pm', title: 'Product Manager', emoji: '📋',
    attempts: [
      "She decides what gets built — like which new features go in the app. She talks to customers, figures out what they need, then tells the engineers to build it. She's the one who says 'we should add a button that does this thing' and then everyone has a two-hour meeting about where the button goes.",
      "Okay, so there's the people who build the thing, and there's the people who sell the thing, and she's in the middle. She makes sure the thing being built is actually what people want to buy. She's like the translator between the business people and the computer people. Neither side fully understands her.",
      "She's in charge of the product. She goes to a lot of meetings. She makes lists.",
    ],
    grandma: "She manages people? How many people? Is she a boss? I always knew she'd be a boss. She was very bossy as a child. I mean that as a compliment.",
    grandmaMisheard: "She's a manager. Upper management I think. Very organized, very important."
  },
  {
    id: 'devops', title: 'DevOps Engineer', emoji: '⚙️',
    attempts: [
      "You know how when a website crashes, somebody has to fix it at 3am? He's that person. But also he sets things up so websites don't crash in the first place. Think of him as the person who maintains the pipes — you never notice him until the pipes burst, and then he's very important.",
      "Imagine there's a factory that makes software. He doesn't build the product, he maintains the factory. He makes sure the conveyor belts work, the machines don't break, everything ships on time. The factory is made of computers. The product is invisible. But the factory is very important.",
      "He keeps the website running. At all hours. Very stressful job.",
    ],
    grandma: "Dev... ops? What's ops? Operations? Like a surgery? Is he in the medical field now? I thought it was computers.",
    grandmaMisheard: "He works in operations. Computer operations. Very behind-the-scenes. Essential."
  },
  {
    id: 'ds', title: 'Data Scientist', emoji: '📊',
    attempts: [
      "Companies collect enormous amounts of information — every click, every purchase, every time someone abandons their cart. She looks at all of that and finds patterns that aren't obvious. Like, she might figure out that people who buy dog food on Tuesdays are more likely to cancel their subscription. That information is somehow worth millions of dollars.",
      "Remember how dad used to read the sports statistics in the newspaper and could predict which team would win? She does that, but with math so advanced that even she has trouble explaining it, and instead of sports it's things like 'which customer is about to leave us' or 'which email makes people click the buy button.'",
      "She's a scientist but for numbers. At a company. The numbers are about the company.",
    ],
    grandma: "A data scientist! So she studies science? What kind of science? Numbers? I was always terrible at math. She did not get that from my side.",
    grandmaMisheard: "She's a scientist at a tech company. Research, I think. Very intelligent girl."
  },
  {
    id: 'ux', title: 'UX Designer', emoji: '🎨',
    attempts: [
      "When you use an app and it just feels easy — like you know exactly where to tap — that's not an accident. Someone designed it to feel that way. She's that person. She figures out how humans think about things and then designs the app to match how their brain expects it to work.",
      "You know when you go to a website and can't find the checkout button and you get frustrated and leave? That's bad UX. She spends her whole career making sure that doesn't happen. She talks to real people, watches them get confused, and fixes the thing that confused them. Repeat. Forever.",
      "She makes apps easy to use. She draws a lot. She has opinions about buttons.",
    ],
    grandma: "A designer! Does she do logos? My church needs a new logo. Could she do something with a cross and maybe a dove? Could she do that as a favor?",
    grandmaMisheard: "She's a graphic designer. Art and computers. Very creative, always was."
  },
  {
    id: 'mle', title: 'ML Engineer', emoji: '🤖',
    attempts: [
      "You know how a dog learns that when you pick up the leash it means a walk? Not because you told it — it just figured it out from watching it happen a hundred times? He does that with computers. He shows the computer thousands of examples until the computer learns the pattern itself. Then the computer can predict things.",
      "The spam folder in your email knows which emails are spam without you telling it. Someone taught it how to figure that out. He builds systems like that. Except instead of spam, it might be 'which loan will get paid back' or 'is this medical scan normal.' The computer learns. He's the one who teaches it.",
      "He does AI stuff. The math part of AI. It's extremely complicated and if he tries to explain it further everyone's eyes glaze over.",
    ],
    grandma: "Machine learning. So he teaches machines? Like robots? Are we going to have robot butlers? I want one. I'd name him Gerald.",
    grandmaMisheard: "He works in AI. The artificial intelligence. Builds robots maybe. Very futuristic."
  },
  {
    id: 'prompt', title: 'Prompt Engineer', emoji: '🗣️',
    attempts: [
      "You know how if you ask someone a question badly, you get a bad answer? But if you ask it the right way, you get exactly what you need? ChatGPT is the same way. He figures out exactly how to phrase things to get the AI to do what you actually want. Some prompts cost a sentence. Some cost a paragraph. Getting it right can save companies millions of dollars.",
      "Okay you know how Alexa sometimes completely misunderstands you and plays the wrong song? He's the person who studies why that happens and finds the exact phrasing that makes it not happen. Except he does it for much more powerful AI than Alexa, and when he gets it right, the AI writes legal documents or diagnoses problems or runs customer service.",
      "He's very good at talking to computers. They pay him for this.",
    ],
    grandma: "Prompt what? He's a prompter? Like in a play, where they stand at the side and tell the actors their lines? That's a job now? At a tech company?",
    grandmaMisheard: "He works with ChatGPT. Professionally. He's very good at it. I use ChatGPT too — I asked it for a lasagna recipe."
  },
  {
    id: 'cloud', title: 'Cloud Architect', emoji: '☁️',
    attempts: [
      "You know how your photos used to be on your phone, and if your phone broke, the photos were gone? Now they're 'in the cloud,' which means they're on someone else's computer far away. Big companies need millions of those computers. She designs the whole system — which computers go where, how they talk to each other, how to make sure nothing gets lost. It's like being an architect, but for invisible buildings.",
      "You know Amazon? Massive warehouses full of stuff you order online? She works with Amazon's other business — they also rent out thousands of servers, like storage units but for data. She designs the layout of those storage units for companies. How big, how many, how they connect. If she makes a mistake, websites crash. No pressure.",
      "She builds things in the cloud. The cloud is not weather. It's computers that belong to Amazon.",
    ],
    grandma: "The cloud! I put my photos in the cloud. My grandson set it up. Can she tell me if they're safe? The ones from the cruise, I really don't want to lose those.",
    grandmaMisheard: "She's an architect but for computers. Cloud architect. Something to do with Amazon."
  },
  {
    id: 'scrum', title: 'Scrum Master', emoji: '🏉',
    attempts: [
      "Software teams work in two-week sprints — they pick a set of things to build, build them, then review. He runs those sprints. He makes sure the team knows what they're doing each day, removes anything that's blocking them, and runs the meetings. He's the coach but he doesn't play. He's the one making sure everyone else can play.",
      "You know how on a project there's always that one problem that nobody wants to deal with, so it just sits there getting worse? He deals with those problems. That's literally his job. Remove obstacles. Keep the team moving. Make sure the meetings don't turn into an hour of people staring at each other.",
      "He organizes the team. He runs the meetings. He has very good Post-it note handwriting.",
    ],
    grandma: "Scrum Master. Is scrum a sport? Like scrimmage? He was always athletic. Though I don't see how sports gets into it at a tech company.",
    grandmaMisheard: "He's a team manager. Manages the software team. Like a coach."
  },
  {
    id: 'fullstack', title: 'Full Stack Developer', emoji: '🥞',
    attempts: [
      "A website has two parts: the part you see — the colors, the buttons, the layout — and the part you don't see, which is all the logic running in the background. Like, what happens when you click 'submit'? Where does your data go? How does it come back? Most engineers do one or the other. She does both.",
      "The front part of a website is like a restaurant's dining room — pretty, for customers. The back part is the kitchen — messy, technical, where the actual work happens. Most people specialize in one. She works the dining room and the kitchen. By herself. Simultaneously.",
      "She builds the whole website. Both sides. Yes she knows that's a lot.",
    ],
    grandma: "Full stack. Like a full stack of pancakes? She must be very hungry. No but really — she built the whole website herself? Tell her I'm very proud.",
    grandmaMisheard: "She makes websites. The whole thing, front to back. Very capable."
  },
  {
    id: 'ai', title: 'AI Engineer', emoji: '🧠',
    attempts: [
      "You know ChatGPT, the thing you've read about in the newspaper? Companies want their own version — one that only knows about their business, their customers, their products. He builds that. He takes the AI technology and wires it into a company's systems so it can answer questions, write things, make decisions. Like installing a very smart employee who never sleeps.",
      "Before AI, companies needed people to answer emails, summarize documents, review applications. He builds the software that does those things now, automatically, at 3am, without complaining. He didn't take those people's jobs, technically — he just built a thing that technically could.",
      "He does the AI. Not ChatGPT itself, but the kind of AI that ChatGPT is. At companies. Very in-demand.",
    ],
    grandma: "Is the AI going to take his job too eventually? I'm asking genuinely. Because I saw something on the news and I've been worried. Does he have a backup plan?",
    grandmaMisheard: "He does artificial intelligence. Builds it, I think. He's the one making those things smarter. Very scary when you think about it."
  },
  {
    id: 'cyber', title: 'Cybersecurity Analyst', emoji: '🔐',
    attempts: [
      "Companies hire her to try to break into their own systems before the actual criminals do. She's a professional burglar but working for the bank. She finds the unlocked window, reports it, and they lock it. If she doesn't find it, the real hackers will — and they won't report it politely.",
      "You know how your email somehow knows which messages are scams? Or how the bank catches when someone in Russia is using your card? She builds the systems that catch that, or she's the person testing whether those systems work. Think of her as the person who checks that your door locks actually lock.",
      "She stops hackers. She is legally also a hacker. It's complicated.",
    ],
    grandma: "Oh! I got an email this morning. It says my Amazon account has been compromised. There's a number to call. Should I call the number? Can she look at this email?",
    grandmaMisheard: "She works in computer security. Very important job right now with all these hackers. She's basically a detective."
  },
  {
    id: 'coo', title: 'Chief of Staff', emoji: '📎',
    attempts: [
      "The CEO has a hundred things on their plate and can only focus on ten of them. He takes the other ninety. Every meeting the CEO can't make, he goes. Every decision that doesn't need the CEO but needs someone senior, he makes it. He is the reason the company doesn't fall apart while the CEO is doing the important stuff.",
      "You know how the President has a Chief of Staff who basically runs the daily operation while the President handles the big decisions? Like that. Except the president in this case runs a software company and the big decisions are about technology strategy and product roadmaps, not foreign policy. Same stress, slightly smaller blast radius.",
      "He supports the CEO. Very important support. He's everywhere.",
    ],
    grandma: "Chief of Staff! Like the White House? Does he know anyone famous? Could he put in a good word somewhere? I don't know where. Somewhere good.",
    grandmaMisheard: "He's very high up. Works directly with the CEO. Chief something. Very important title."
  },
  {
    id: 'growth', title: 'Growth Hacker', emoji: '📈',
    attempts: [
      "She's the reason apps grow from 100 users to 100,000 users in six months. She runs experiments — change the button color, tweak the signup flow, try a different subject line — and figures out what makes more people sign up and stay. Every tiny change gets measured. She's the scientific method applied to getting more customers.",
      "You know how Dropbox gave you more storage if you referred a friend? And then every single person you know got Dropbox? Someone designed that referral loop. She designs those loops. Not always Dropbox-sized. But that's the job. Find the thing that makes the product spread itself.",
      "She makes the app grow. Faster than normal. Using clever tricks.",
    ],
    grandma: "Hacker? That sounds illegal. I hope she's not getting into trouble. Is this legitimate? Should I not mention this at church?",
    grandmaMisheard: "She does marketing. Tech marketing. Growth something. Good money I hear."
  },
  {
    id: 'revops', title: 'Revenue Operations', emoji: '💰',
    attempts: [
      "Sales and marketing are two different departments and they almost never agree on anything. He's the person who forces them to agree, specifically about what counts as a good lead, what happens when a deal closes, and why the numbers from sales never match the numbers from marketing. He fixes the plumbing between departments.",
      "Imagine three teams who all own different pieces of a puzzle but nobody told them they had the same puzzle. One team has the data, one has the customer relationships, one has the money. He makes sure all three know what's going on. With spreadsheets. Very important spreadsheets. The company would lose significant money without those spreadsheets.",
      "He makes sure the business side works smoothly. Lots of data. Lots of coordination.",
    ],
    grandma: "Revenue. So he handles money? Is he like an accountant? Our accountant Henry could use an assistant. Should I mention him? I'll mention him.",
    grandmaMisheard: "He works in finance I think. Revenue operations. Something between sales and accounting."
  },
  {
    id: 'se', title: 'Solutions Engineer', emoji: '🤝',
    attempts: [
      "When a company wants to buy expensive software, they need to see it work first. She does the demo — live, in front of the customer, with their actual data. If the software breaks during the demo, she fixes it without breaking a sweat and keeps talking. She's an engineer who can also close a room. That combination is rare and they pay well for it.",
      "She's the bridge between the sales people who promise things and the engineers who actually have to build those things. She has to know the technical side well enough to demo it, and the business side well enough to explain why it solves the problem. When the salesperson says 'we can do anything' and the customer asks 'can you do this specific thing?' — she's the one who knows the actual answer.",
      "She demos software to companies that might buy it. She is not in sales. Please do not call her sales.",
    ],
    grandma: "Solutions! She solves problems. I like that. Very practical. Not like some of these other computer things. She sounds sensible.",
    grandmaMisheard: "She's in sales. Technical sales. Demos. Very smart girl, can talk to anyone."
  },
  {
    id: 'vpe', title: 'VP of Engineering', emoji: '👔',
    attempts: [
      "He's the most senior technical person at the company who still goes to meetings instead of writing code. He leads all the engineers, makes decisions about which technology to use, sets the standards for how things get built, and is responsible when major things go wrong. He used to write code himself. Now he writes strategy documents and wishes they were code.",
      "There's a hundred engineers at the company. Somebody has to make sure they're all working on the right things, not stepping on each other's work, and building things that actually hold together. He's that person. He hires them, organizes them into teams, sets the direction, and carries the pager when production breaks at 2am.",
      "He runs the whole engineering department. Lots of responsibility. Very good salary.",
    ],
    grandma: "Vice President! I'll tell everyone. Of the whole company? Is he near the top? How many people are above him? Is he going to be President next?",
    grandmaMisheard: "He's basically running the company. VP of Engineering. High up. Very high up."
  },
  {
    id: 'blockchain', title: 'Blockchain Developer', emoji: '⛓️',
    attempts: [
      "You know how your bank keeps a record of every transaction? Blockchain is like that record book, except there are thousands of copies all over the world, and nobody owns it, and everyone can see it, and you can't change what's already written. He builds things that use that system instead of a regular bank.",
      "Bitcoin works because thousands of computers all agree on the same record of who owns what. He builds other things using the same idea — not just money, but contracts, art ownership, voting. It solves the problem of 'how do you trust someone you've never met' without having a bank in the middle. Whether that's actually useful is a conversation the industry is still having.",
      "He does crypto stuff. Blockchain. He gets passionate if you ask follow-up questions.",
    ],
    grandma: "Bitcoin! My neighbor made money on Bitcoin. Then he lost it. Then he made it again. He's exhausted. Is this the same thing? Should I buy some?",
    grandmaMisheard: "He does the cryptocurrency. Bitcoin, blockchain, that whole thing. Makes good money. I think."
  },
  {
    id: 'openclaw', title: 'OpenClaw Engineer', emoji: '🏗️',
    attempts: [
      "He builds AI agents — basically software robots that take actions on their own. Not just answer questions. Actually do things: trade stocks, post on Twitter, send emails, analyze data, make decisions. He watches them work from his phone. The robots run 24/7. He mostly just reviews what they did.",
      "You know how some people use apps? He built the apps. And then made the apps run themselves. And then made the apps talk to each other and coordinate. He's less a programmer now and more... an AI manager. He has a staff of robots. He does performance reviews on the robots.",
      "He built robots. Software robots. They run his whole operation. He watches. Sometimes he approves things.",
    ],
    grandma: "OpenClaw? That sounds like something with a lobster. Is he in seafood now? I thought it was computers. Can it be both? Ask him if it's lobster-related.",
    grandmaMisheard: "He has robots. AI robots. They run everything. He just supervises. Honestly sounds like a good deal."
  },
  {
    id: 'custom', title: 'My Job', emoji: '🫵',
    attempts: [],
    grandma: '',
    grandmaMisheard: ''
  }
];

// Custom role explanation generator
function generateCustom(role: string): Role {
  const word = role.split(' ')[0];
  return {
    id: 'custom',
    title: role,
    emoji: '🫵',
    attempts: [
      `Okay so it's a tech job. They work at a company and they're in charge of the ${role.toLowerCase()} side of things. It's more complex than it sounds, which is why it pays well.`,
      `You know how every department at a company needs someone who really understands their specific thing? They're that person for ${role.toLowerCase()}. Very important. Very specialized.`,
      `It's... honestly hard to explain in a quick way. But they're good at it. The company needs it. That's really all that matters.`,
    ],
    grandma: `${role}. That's a mouthful. I'm going to tell people at church you work in technology. That covers everything, doesn't it? Technology.`,
    grandmaMisheard: `They're a ${word} person. At a tech company. Does very important ${word} things. Very impressive.`
  };
}

// ── Attempt Display ────────────────────────────────────────────────────────
const ATTEMPT_STYLES = [
  { label: 'Attempt 1', sub: 'Giving it a shot', color: '#60a5fa', bg: 'bg-blue-500/8 border-blue-500/20' },
  { label: 'Attempt 2', sub: 'Getting creative', color: '#a78bfa', bg: 'bg-purple-500/8 border-purple-500/20' },
  { label: 'Attempt 3', sub: 'Just winging it', color: '#f97316', bg: 'bg-orange-500/8 border-orange-500/20' },
];

export default function ParentTranslatorPage() {
  const [selected,    setSelected]    = useState<Role | null>(null);
  const [step,        setStep]        = useState(0);     // 0=nothing, 1=attempt1, 2=attempt2, 3=attempt3, 4=grandma
  const [customRole,  setCustomRole]  = useState('');
  const [showCustom,  setShowCustom]  = useState(false);
  const [copied,      setCopied]      = useState(false);

  const pick = (role: Role) => {
    setSelected(role);
    setStep(1);
    setShowCustom(false);
  };

  const pickCustom = () => {
    if (!customRole.trim()) return;
    pick(generateCustom(customRole.trim()));
  };

  const next = () => setStep(s => Math.min(s + 1, 4));
  const reset = () => { setSelected(null); setStep(0); setCustomRole(''); };

  const copy = () => {
    if (!selected) return;
    const lines = [
      `"${selected.title}" — explained to my parents by AI`,
      '',
      ...selected.attempts.map((a, i) => `Attempt ${i + 1}: "${a}"`),
      '',
      `Grandma's version: "${selected.grandma}"`,
      '',
      `What she tells her friends: "${selected.grandmaMisheard}"`,
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayRoles = ROLES.filter(r => r.id !== 'custom');

  return (
    <div className="p-5 max-w-3xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">👨‍👩‍👧</span>
          <h1 className="text-lg font-bold text-white">Parent Job Translator</h1>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/20 font-medium">AI-Powered</span>
        </div>
        <p className="text-xs text-[#444]">
          "I asked an AI to explain what I do to my parents." · {displayRoles.length} roles · 3 increasingly confused attempts · 1 grandma
        </p>
      </div>

      {/* Left/Right layout when a role is selected */}
      <div className={`${selected ? 'grid grid-cols-5 gap-4' : ''}`}>

        {/* Role Grid */}
        <div className={selected ? 'col-span-2' : ''}>
          <div className={`grid gap-2 ${selected ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-3'}`}>
            {displayRoles.map(role => (
              <button key={role.id} onClick={() => pick(role)}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                  selected?.id === role.id
                    ? 'bg-white/8 border-white/20 text-white'
                    : 'bg-[#0f0f0f] border-[#1a1a1a] text-[#777] hover:text-white hover:border-[#2a2a2a] hover:bg-[#141414]'
                }`}>
                <span className={selected ? 'text-base' : 'text-xl'}>{role.emoji}</span>
                <span className={`font-medium leading-tight ${selected ? 'text-xs' : 'text-sm'}`}>{role.title}</span>
                {selected?.id === role.id && (
                  <ChevronRight size={12} className="ml-auto text-white/40" />
                )}
              </button>
            ))}

            {/* Custom role */}
            <div className={`${selected ? '' : 'col-span-2 sm:col-span-3'}`}>
              {!showCustom ? (
                <button onClick={() => setShowCustom(true)}
                  className="w-full flex items-center gap-2.5 p-3 rounded-xl border border-dashed border-[#2a2a2a] text-[#444] hover:text-white hover:border-[#444] transition-all text-sm">
                  <span>✏️</span> Enter my job title...
                </button>
              ) : (
                <div className="flex gap-2">
                  <input value={customRole} onChange={e => setCustomRole(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && pickCustom()}
                    placeholder="Your job title..."
                    className="flex-1 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-[#444] outline-none focus:border-[#444] min-w-0"
                  />
                  <button onClick={pickCustom}
                    className="px-3 py-2.5 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-xl text-xs font-semibold hover:bg-blue-500/30 transition-colors">
                    Go
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Result Panel */}
        {selected && (
          <div className="col-span-3 space-y-3">

            {/* Role header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selected.emoji}</span>
                <div>
                  <h2 className="text-base font-bold text-white">{selected.title}</h2>
                  <p className="text-[10px] text-[#444]">as explained by AI to someone's parents</p>
                </div>
              </div>
              <button onClick={reset} className="text-[10px] text-[#444] hover:text-white transition-colors">
                ← back
              </button>
            </div>

            {/* Attempts */}
            {selected.attempts.map((attempt, i) => {
              if (step < i + 1) return null;
              const style = ATTEMPT_STYLES[i];
              return (
                <div key={i} className={`rounded-2xl border p-4 ${style.bg}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: style.color }}>
                      {style.label}
                    </span>
                    <span className="text-[10px] text-[#444]">— {style.sub}</span>
                  </div>
                  <p className="text-sm text-white leading-relaxed">"{attempt}"</p>
                </div>
              );
            })}

            {/* Grandma section */}
            {step >= 4 && (
              <>
                <div className="bg-pink-500/8 border border-pink-500/25 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base">👵</span>
                    <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest">
                      Grandma's Understanding
                    </span>
                  </div>
                  <p className="text-sm text-white leading-relaxed mb-3">"{selected.grandma}"</p>
                  <div className="border-t border-pink-500/15 pt-3">
                    <p className="text-[10px] text-pink-400/70 uppercase tracking-wider mb-1">What she tells her friends:</p>
                    <p className="text-xs text-[#aaa] italic">"{selected.grandmaMisheard}"</p>
                  </div>
                </div>

                {/* Share / copy */}
                <div className="flex items-center gap-2">
                  <button onClick={copy}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                      copied ? 'bg-green-500/15 border-green-500/30 text-green-400' : 'bg-[#111] border-[#222] text-white hover:bg-[#1a1a1a]'
                    }`}>
                    {copied ? '✓ Copied!' : '📋 Copy for LinkedIn'}
                  </button>
                  <button onClick={() => { setSelected(null); setStep(0); }}
                    className="px-4 py-2.5 bg-[#111] border border-[#222] text-[#555] hover:text-white rounded-xl text-xs transition-all hover:bg-[#1a1a1a]">
                    <RefreshCw size={12} />
                  </button>
                </div>

                {/* Footer */}
                <div className="text-[10px] text-[#2a2a2a] text-center">
                  Built with OpenClaw · "He works at the computer place."
                </div>
              </>
            )}

            {/* Next / CTA */}
            {step < 4 && (
              <button onClick={next}
                className="w-full py-3 bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-500/80 hover:to-purple-500/80 text-white font-semibold rounded-xl transition-all text-sm flex items-center justify-center gap-2">
                <Sparkles size={14} />
                {step < 3 ? `Try explaining again (Attempt ${step + 1})` : "Ask grandma 👵"}
              </button>
            )}

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4].map(s => (
                <div key={s} className={`rounded-full transition-all duration-300 ${
                  step >= s ? 'w-4 h-1.5' : 'w-1.5 h-1.5'
                } ${
                  step >= s
                    ? s === 4 ? 'bg-pink-400' : 'bg-blue-400'
                    : 'bg-[#1a1a1a]'
                }`} />
              ))}
              <span className="text-[10px] text-[#333] ml-1">
                {step === 4 ? "grandma has entered the chat" : `attempt ${step} of 3`}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Empty state */}
      {!selected && (
        <div className="mt-8 text-center text-[#333] text-xs">
          ← Select a role to generate the parent explanation
        </div>
      )}
    </div>
  );
}
