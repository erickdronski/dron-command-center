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
      "He fixes the computer when it breaks. But also makes things for the computer. Like a mechanic but the cars are invisible and he made the cars too.",
      "You know how the TV has channels? He makes the channels. But on your phone. And you don't call them channels.",
      "He types really fast and then things happen on the internet.",
    ],
    grandma: "He works at the computer place. Is he still at the computer place? I thought he was going to be a doctor.",
    grandmaMisheard: "He's an engineer. A computer engineer. He fixes computers."
  },
  {
    id: 'pm', title: 'Product Manager', emoji: '📋',
    attempts: [
      "She's the boss of a thing but not the boss boss. More like... she tells people what to make but doesn't make it herself. She's responsible when it goes wrong but doesn't get credit when it goes right.",
      "Like a project manager but it's different. Apparently they're very different and it's important that you know they're different.",
      "She goes to a lot of meetings and then writes down what happened in the meetings.",
    ],
    grandma: "She manages something. A product. What's the product? I don't know. Something on the phone.",
    grandmaMisheard: "She's a manager. Very important. Management."
  },
  {
    id: 'devops', title: 'DevOps Engineer', emoji: '⚙️',
    attempts: [
      "He makes sure the website doesn't fall down. And when it falls down he puts it back up. He does this at 3am sometimes.",
      "You know how the internet works? He's part of why. But not the whole internet. Just some of it. His company's part.",
      "He works with servers. No not that kind of server. Not like a waiter. A different kind of server. It's a computer.",
    ],
    grandma: "I've heard of DevOps. I don't know what it is but I've heard of it. Is it good money?",
    grandmaMisheard: "He does development. And operations. Both."
  },
  {
    id: 'ds', title: 'Data Scientist', emoji: '📊',
    attempts: [
      "She looks at a lot of numbers and finds patterns. Like a really good accountant but she'd be offended if you called her an accountant.",
      "Remember when we used to do puzzles? Like that, but the puzzle is made of spreadsheets and when you finish it a company knows something about you that you didn't know about yourself.",
      "Statistics. She does statistics. With Python.",
    ],
    grandma: "A scientist! She was always the smart one. What does she study? Numbers? Like math?",
    grandmaMisheard: "She's a scientist. At a tech company. Like a research scientist."
  },
  {
    id: 'ux', title: 'UX Designer', emoji: '🎨',
    attempts: [
      "She makes apps look nice. And also makes them work nice. Those are two different things apparently, and it's two different jobs, and please don't confuse them.",
      "Interior designer but for websites. She moves the buttons around until it feels right. Then tests it. Then moves them again.",
      "She draws on a computer and then argues about whether the button should be blue or slightly different blue.",
    ],
    grandma: "A designer! Like fashion? Or more like... interior? She has a good eye, that one.",
    grandmaMisheard: "She does the graphics. The graphic design."
  },
  {
    id: 'mle', title: 'ML Engineer', emoji: '🤖',
    attempts: [
      "He teaches computers to learn things. Without telling them the answers first. The computer figures it out on its own. Then it's wrong. Then he fixes it. Then it's less wrong.",
      "You know how Netflix knows what you want to watch before you do? He builds the thing that figures that out. But he'd probably recommend a better movie than Netflix does.",
      "AI stuff. He does the AI stuff.",
    ],
    grandma: "Is that dangerous? I saw something on the news. About the robots taking over. Should I be worried?",
    grandmaMisheard: "Machine learning. He teaches machines. Like a trainer but for robots."
  },
  {
    id: 'prompt', title: 'Prompt Engineer', emoji: '🗣️',
    attempts: [
      "He talks to the AI and gets it to do things. He's very good at asking it questions the right way. It sounds simple and it isn't, and he has to explain that constantly.",
      "You know how when you call customer service and you say 'representative' three times to skip the robot? Like that, but the other way around. He makes the robot smarter.",
      "He asks ChatGPT things. Professionally.",
    ],
    grandma: "A prompt what? Can you spell that? Is that a real job? My friend Carol's son is a doctor.",
    grandmaMisheard: "He works with that ChatGPT thing. He's very good at it."
  },
  {
    id: 'cloud', title: 'Cloud Architect', emoji: '☁️',
    attempts: [
      "She designs how companies store their stuff on the internet. Not like a USB stick. More like... up there. In the cloud. She decides what shape the cloud is.",
      "You know Amazon? She uses Amazon, but not for shopping. She rents computers from Amazon and builds things with them. It's expensive.",
      "She draws pictures of systems that other engineers then build. Very important pictures.",
    ],
    grandma: "The cloud! My photos are in the cloud. Does she know where my photos are? Can she find the ones from 2019?",
    grandmaMisheard: "She works with clouds. Computing clouds. Amazon, I think she mentioned Amazon."
  },
  {
    id: 'scrum', title: 'Scrum Master', emoji: '🏉',
    attempts: [
      "He runs the team's meetings about what they're going to do, then checks if they did it. He's a referee but nobody's playing a sport.",
      "Agile. He does Agile. It's a way of working where you work in two-week chunks and he's in charge of the chunks.",
      "He has a lot of Post-it notes.",
    ],
    grandma: "A master! Like a grandmaster? Of what? Scrum? Is that like chess? Your uncle plays chess.",
    grandmaMisheard: "He's a project manager. At a tech company."
  },
  {
    id: 'fullstack', title: 'Full Stack Developer', emoji: '🥞',
    attempts: [
      "She makes the front of the website AND the back of the website. The front is the pretty part you see. The back is the part you don't see that makes the front work. She does both.",
      "She's a software engineer but she does double the work for the same job title and slightly less respect than specialists who only do one half.",
      "She codes everything.",
    ],
    grandma: "Full stack. Like pancakes? Does she work at a restaurant? IHOP?",
    grandmaMisheard: "She's a developer. Full developer. Very skilled."
  },
  {
    id: 'ai', title: 'AI Engineer', emoji: '🧠',
    attempts: [
      "He builds the AI tools. Like ChatGPT but for companies. He makes companies their own ChatGPT that only talks about their business.",
      "He teaches computers to be smart and then puts those smart computers inside other computers that do things for companies.",
      "He does AI.",
    ],
    grandma: "Is the AI going to take his job? I saw that on 60 Minutes. They said AI is taking everyone's jobs. Is he safe?",
    grandmaMisheard: "He works in artificial intelligence. He's very smart. We always knew."
  },
  {
    id: 'cyber', title: 'Cybersecurity Analyst', emoji: '🔐',
    attempts: [
      "She stops hackers. Specifically she's paid by companies to try to hack them before the real hackers do. She is the hacker but she works for the good guys.",
      "You know when you get that email saying you've won $4 million from a Nigerian prince? She's the reason your bank knows that's not your bank. Usually.",
      "She makes sure people who aren't supposed to get into computers don't get into computers.",
    ],
    grandma: "Oh she can help me! I got an email saying I won a prize. There's a link. Should I click the link? Can she look at it?",
    grandmaMisheard: "She works in security. Computer security. Like a security guard but for the internet."
  },
  {
    id: 'coo', title: 'Chief of Staff', emoji: '📎',
    attempts: [
      "He does whatever the CEO can't get to. He's kind of like the CEO's assistant but that's an insult and you shouldn't say that to him.",
      "You know how the President has a chief of staff who runs everything while the President does the important stuff? Like that. But for a smaller company. Similar stress.",
      "He goes to all the meetings so the CEO doesn't have to.",
    ],
    grandma: "Chief! Like an Indian chief? Or wait — is he a chef? Does he cook? He was always a good cook.",
    grandmaMisheard: "He works directly with the CEO. Very close to the CEO. Very important."
  },
  {
    id: 'growth', title: 'Growth Hacker', emoji: '📈',
    attempts: [
      "She gets more people to download the app. As fast as possible. Without spending much money. And sometimes the ways she does it are very creative.",
      "Marketing, but she went to coding school first, so she can actually build the things she's marketing, which makes her twice as dangerous.",
      "She hacks the growth. It's a thing now.",
    ],
    grandma: "Hacker? Is that legal? I thought hacking was illegal. She's not going to get in trouble, is she?",
    grandmaMisheard: "She does marketing. And some computer stuff. Growth marketing I think."
  },
  {
    id: 'revops', title: 'Revenue Operations', emoji: '💰',
    attempts: [
      "He makes sure the sales team and the marketing team and the customer team are all using the same spreadsheet. This is harder than it sounds.",
      "You know how companies have sales and marketing and they never talk to each other? He's the one making them talk. They don't always want to. He makes them anyway.",
      "He does RevOps. Very important spreadsheets.",
    ],
    grandma: "Revenue! So he counts the money? Like an accountant? Is he an accountant? We have a family accountant, does he know Henry?",
    grandmaMisheard: "He works in finance. Revenue. Something with the money."
  },
  {
    id: 'se', title: 'Solutions Engineer', emoji: '🤝',
    attempts: [
      "She sells software but she's not a salesperson. She's an engineer. Who explains the software to people thinking about buying it. She does the scary technical demos.",
      "Pre-sales. Technical pre-sales. She shows people how it works. If it breaks during the demo, she fixes it while smiling. Very important skill.",
      "She does demos.",
    ],
    grandma: "A solution engineer. So she solves problems? With engineering? That sounds very useful. More useful than some of the things your cousins do.",
    grandmaMisheard: "She's in sales. Technical sales. She's very technical."
  },
  {
    id: 'vpe', title: 'VP of Engineering', emoji: '👔',
    attempts: [
      "He's in charge of all the people who write the code. He used to write code. Now he talks about code in meetings. He misses writing code but won't admit it.",
      "He makes decisions about technology that other people then build. He has opinions about everything and he's allowed to have them now.",
      "He's the boss. Of the computer people.",
    ],
    grandma: "Vice President! Of the whole company? Does he know the President? Can he get us tickets? To what, I don't know. Something.",
    grandmaMisheard: "He's a VP. Vice President. Of engineering. He's basically running the place."
  },
  {
    id: 'blockchain', title: 'Blockchain Developer', emoji: '⛓️',
    attempts: [
      "You know Bitcoin? He makes things that work like Bitcoin but for companies. Sometimes actual Bitcoin. The technology behind it. Not the buying part. Mostly.",
      "Web3. He does Web3. We're currently on Web2. Web3 is the next one. It's decentralized. That means nobody's in charge. Except everyone is. It's complicated.",
      "Crypto stuff. He does crypto stuff.",
    ],
    grandma: "I heard you can make a lot of money with that. Is he making a lot of money? Should I invest? Your uncle put $500 in something and lost it all.",
    grandmaMisheard: "He does the Bitcoin. The crypto. He's very good with computers."
  },
  {
    id: 'openclaw', title: 'OpenClaw Engineer', emoji: '🏗️',
    attempts: [
      "He builds autonomous AI agents. The agents run things for him while he's not looking. He watches them from Discord. This is normal now apparently.",
      "You know how you have to do things yourself? He made robots that do things for him. Trading. Posting. Managing. The robots do it. He approves the robots.",
      "He built an AI that built other AIs and now the AIs talk to each other and he just... watches.",
    ],
    grandma: "OpenClaw? Is that like a lobster thing? Is he in seafood? I thought he was in computers. Maybe he's in both.",
    grandmaMisheard: "He has robots. A lot of robots. He controls them from his phone. Very impressive I'm sure."
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
  return {
    id: 'custom',
    title: role,
    emoji: '🫵',
    attempts: [
      `They do... ${role.toLowerCase()} things. For a company. It's important apparently.`,
      `You know how companies need people to do the ${role.toLowerCase()} stuff? That's what they do. The ${role.toLowerCase()} stuff.`,
      `It's hard to explain. You'd have to work there.`,
    ],
    grandma: `${role}. I'll have to tell my friends at church. They'll know what that is. Or they'll pretend to. Like I'm doing now.`,
    grandmaMisheard: `They're a ${role.split(' ')[0]}. Something like that. Very good job. Very impressive.`
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
