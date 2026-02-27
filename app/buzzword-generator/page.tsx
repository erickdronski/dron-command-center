'use client';

import { useState, useCallback } from 'react';
import { Copy, RefreshCw, Sparkles, Check, Flame } from 'lucide-react';

// ── Word Banks ─────────────────────────────────────────────────────────────
const OPENERS = [
  "Excited to share", "Humbled to announce", "Thrilled to reveal",
  "Grateful to reflect on", "Honored to discuss", "Proud to share",
  "I rarely post, but today", "3 years ago I was told this was impossible.",
  "This one's personal.", "Not everything needs to be shared. But this does.",
  "I've been sitting on this for a while.", "The numbers don't lie.",
];

const VERBS = [
  "disrupting", "transforming", "reimagining", "revolutionizing",
  "redefining", "unlocking", "supercharging", "scaling", "operationalizing",
  "leveraging", "optimizing", "democratizing", "future-proofing", "ideating",
  "synergizing", "cascading", "gamifying", "incentivizing", "pivoting toward",
];

const NOUNS = [
  "the enterprise", "the ecosystem", "the value chain", "our core competencies",
  "the talent pipeline", "stakeholder alignment", "the digital transformation journey",
  "human capital", "the go-to-market motion", "our thought leadership",
  "the north star metric", "customer-centricity", "the paradigm shift",
  "proactive synergies", "the innovation flywheel", "cross-functional bandwidth",
];

const ADJECTIVES = [
  "best-in-class", "world-class", "bleeding-edge", "mission-critical",
  "high-impact", "results-driven", "data-driven", "human-centered",
  "future-ready", "purpose-driven", "full-stack", "360-degree",
  "intentional", "holistic", "agile", "scalable", "frictionless",
  "disruptive", "actionable", "authentic", "growth-oriented", "learner",
];

const OUTCOMES = [
  "10x ROI", "meaningful impact", "sustainable growth", "stakeholder value",
  "long-term success", "organizational agility", "competitive advantage",
  "thought leadership", "industry-defining results", "culture change",
  "measurable outcomes", "transformational results", "generational wealth",
  "psychological safety", "radical transparency", "operational excellence",
];

const CLOSERS = [
  "What are your thoughts? Drop them in the comments 👇",
  "If this resonated with you, share it with someone who needs to hear it.",
  "The future belongs to those who show up. Every. Single. Day.",
  "Follow me for more insights on [topic I just made up].",
  "Save this post. You'll need it later.",
  "Agree? Disagree? Let me know — I read every comment.",
  "Not looking for likes. Just want to start a conversation.",
  "Tag someone who embodies this. They know who they are.",
  "#leadership #growth #mindset #AI #innovation #grateful",
  "The market doesn't care about your excuses. It cares about your execution.",
  "P.S. — I'm building something new. Stay tuned. 🚀",
  "Unpopular opinion: this is actually popular opinion. Discuss.",
];

const STORIES = [
  "A {ROLE} once told me: \"{WISDOM}\"\nI didn't understand it then.\nI do now.",
  "5 years ago I had {NUMBER} followers.\nToday I have {NUMBER2}.\nThe difference? I started {ACTION}.",
  "I got rejected by {COMPANY}.\n{YEARS} years later, they asked me to {ACHIEVEMENT}.\nYour setbacks are setups.",
  "My {RELATION} gave me {ADVICE_ITEM} when I started.\nBest advice I ever received.",
  "I used to work {HOURS} hours a week.\nThen I learned to {LESSON}.\nNow I work {HOURS2} hours and earn {MULTIPLIER}x more.",
];

const ROLES = ["cab driver", "janitor", "barista", "parking attendant", "my Uber driver", "a stranger on a plane", "my 7-year-old", "a homeless man outside the Salesforce tower"];
const WISDOMS = [
  "You can't pour from an empty cup.",
  "The best time to plant a tree was 20 years ago.",
  "Ships don't sink because of the water around them.",
  "Be the change you want to see in the spreadsheet.",
  "Work smarter, not harder — unless you need to work harder.",
];
const COMPANIES = ["Goldman Sachs", "McKinsey", "Google", "Meta", "every VC I pitched", "Harvard Business School"];
const ACHIEVEMENTS = ["speak at their conference", "consult for their team", "mentor their leadership", "design their strategy"];
const RELATIONS = ["mentor", "father", "grandmother", "first manager", "therapist"];
const ADVICE_ITEMS = ["a handshake", "one piece of advice", "a Post-it note with three words on it", "a book I never read", "a coffee and a hard truth"];

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const pickN = <T,>(arr: T[], n: number): T[] => {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
};

// ── Post Generator ─────────────────────────────────────────────────────────
type Vibe = 'thought-leadership' | 'humble-brag' | 'crisis-survived' | 'stranger-wisdom' | 'controversial' | 'numbers-guy';
type Intensity = 1 | 2 | 3;

interface GeneratedPost {
  text: string;
  buzzwords: string[];
  type: string;
  engagementScore: number;
}

function generatePost(vibe: Vibe, intensity: Intensity): GeneratedPost {
  const buzzwords: string[] = [];
  const track = (w: string) => { buzzwords.push(w); return w; };

  let text = '';
  let type = '';
  let engagementScore = 0;

  const opener = pick(OPENERS);
  const verb   = pick(VERBS);
  const adj    = pick(ADJECTIVES);
  const adj2   = pick(ADJECTIVES.filter(a => a !== adj));
  const noun   = pick(NOUNS);
  const outcome = pick(OUTCOMES);
  const closer = pick(CLOSERS);

  if (vibe === 'thought-leadership') {
    type = '🎓 Thought Leadership';
    engagementScore = 45 + Math.floor(Math.random() * 30);
    const buzzed = pickN([...VERBS, ...ADJECTIVES, ...NOUNS], intensity === 1 ? 3 : intensity === 2 ? 6 : 10);
    buzzed.forEach(b => track(b));

    if (intensity === 1) {
      text = `${opener} something I've been thinking about.\n\nThe companies winning right now aren't the ones ${track(verb)} the fastest.\n\nThey're the ones building ${track(adj)} foundations first.\n\n${closer}`;
    } else if (intensity === 2) {
      text = `${opener} a ${track(adj)} insight from our last ${track(noun)} review.\n\nWe spent 18 months ${track(verb)} our ${track(noun)}.\n\nThe result? ${track(outcome)}.\n\nHere's what we learned:\n\n→ ${pick(ADJECTIVES)} execution beats ${pick(ADJECTIVES)} strategy\n→ ${track(noun)} matters more than people think\n→ The real unlock is ${track(verb)} before you scale\n\n${closer}`;
    } else {
      text = `${opener}.\n\nAfter ${2 + Math.floor(Math.random() * 8)} years of ${track(verb)} ${track(noun)}, I've distilled everything into 7 principles.\n\n${['1', '2', '3', '4', '5', '6', '7'].map(n => `${n}. ${pick(ADJECTIVES)} ${pick(VERBS)} ${pick(NOUNS)} to achieve ${pick(OUTCOMES)}`).join('\n')}\n\nPrint this out. Put it on your wall. This is the whole game.\n\n${closer}`;
      pickN([...VERBS, ...ADJECTIVES], 8).forEach(b => track(b));
    }

  } else if (vibe === 'humble-brag') {
    type = '🏆 Humble Brag';
    engagementScore = 60 + Math.floor(Math.random() * 25);
    const num1 = (Math.floor(Math.random() * 9) + 1) * 100;
    const num2 = num1 * (10 + Math.floor(Math.random() * 40));
    const years = 2 + Math.floor(Math.random() * 6);

    if (intensity === 1) {
      text = `${years} years ago I started with nothing.\n\nToday I'm proud to share we just crossed $${(num2/1000).toFixed(0)}K in ${track(outcome)}.\n\nNot sharing this to brag. Sharing this because someone needs to hear it's possible.\n\n${closer}`;
    } else if (intensity === 2) {
      text = `I almost quit ${years} years ago.\n\nI had ${num1} followers, $0 in revenue, and ${pick(['zero direction', 'no team', 'nothing but a vision', 'too many rejections to count'])}.\n\nThen I started ${track(verb)} ${track(noun)} — ${track(adj)}, ${track(adj2)}, relentless.\n\nToday: ${(num2/1000).toFixed(0)}K followers. ${Math.floor(Math.random() * 8 + 2)}M impressions. ${pick(OUTCOMES)}.\n\nI'm not special. I just didn't stop.\n\n${closer}`;
    } else {
      text = `I'm not supposed to share this.\n\nBut someone in my DMs last week said I inspired them to ${track(verb)} their ${track(noun)}.\n\nThat's why I do this.\n\nNot for the ${pick(['awards', 'accolades', 'followers', 'recognition'])}.\nNot for the ${pick(['money', 'status', 'brand deals', 'speaking fees'])}.\nFor that one ${track(adj)} human who needed to hear that ${track(outcome)} is possible for them too.\n\nFrom the bottom of my ${track(adj)} heart: thank you.\n\n${closer}`;
      pickN([...ADJECTIVES, ...VERBS], 5).forEach(b => track(b));
    }

  } else if (vibe === 'crisis-survived') {
    type = '🔥 Crisis Survived';
    engagementScore = 70 + Math.floor(Math.random() * 20);
    const bad = pick(['let go', 'failed spectacularly', 'lost everything', 'hit rock bottom', 'made the worst decision of my career', 'was publicly humiliated']);
    const good = pick(['launched a company', 'landed my dream role', 'built a $10M business', 'wrote a book', 'found my purpose', 'signed my first enterprise client']);

    text = `In ${2015 + Math.floor(Math.random() * 8)}, I was ${bad}.\n\n${pick(['It broke me.', 'I cried in my car.', "I didn't leave the house for a week.", 'I almost gave up.', 'I had no backup plan.'])}\n\n${pick(['But then something shifted.', 'Then a stranger said something I\'ll never forget.', 'Then I read one sentence that changed everything.', 'Then I made one phone call.'])}\n\nI started ${track(verb)} ${track(adj)} ${track(noun)} from scratch.\n\nOne year later: I had ${good}.\n\n${pick(['Failure is just success with bad timing.', 'Your darkest chapter is someone else\'s roadmap.', 'The comeback is always better than the setback.', "If you're going through hell, keep going — and document it for LinkedIn content."])}\n\n${closer}`;

  } else if (vibe === 'stranger-wisdom') {
    type = '🚕 Stranger Gave Me Wisdom';
    engagementScore = 75 + Math.floor(Math.random() * 20);
    const role = pick(ROLES);
    const wisdom = pick(WISDOMS);
    const years = 1 + Math.floor(Math.random() * 9);

    text = `${years === 1 ? 'Last year' : `${years} years ago`}, a ${role} said something that changed my life.\n\n"${wisdom}"\n\n${pick(["I didn't understand it at the time.", "I laughed. I shouldn't have.", "I wrote it down on a napkin.", "I almost dismissed it.", "It sounded like nonsense.", "I've thought about it every day since."])}\n\n${pick(['Now I think about it every morning.', 'I built my entire company around this idea.', 'I turned it into a framework.', 'I sent it to every person I manage.', "It's on a Post-it above my desk."])}\n\nThe most important lessons don't come from ${pick(['boardrooms', 'MBAs', 'conferences', 'consultants', 'TED talks'])}.\n\nThey come from ${track(adj)} conversations with ${track(adj2)} people who have nothing to prove.\n\n${closer}`;

  } else if (vibe === 'controversial') {
    type = '🌶️ Unpopular Opinion';
    engagementScore = 80 + Math.floor(Math.random() * 15);
    const controversial = pick([
      `${track(adj)} ${track(verb)} is actually overrated`,
      `most ${track(noun)} is just noise`,
      `the hustle culture is destroying ${track(noun)}`,
      `${track(outcome)} doesn't matter as much as people think`,
      `most "thought leaders" are just ${track(verb)} other people's ideas`,
      `${track(adj)} teams outperform ${track(adj2)} ones every time`,
    ]);

    text = `Unpopular opinion: ${controversial}.\n\nI'll wait.\n\n...\n\nStill here?\n\nHere's why:\n\n${['→', '→', '→'].map(() => `${pick(ADJECTIVES)} ${pick(VERBS)} ${pick(NOUNS)} ≠ ${pick(OUTCOMES)}`).join('\n')}\n\nThe data backs this up. The narrative doesn't.\n\n${pick(['Change my mind.', 'I know this is controversial.', 'You might disagree. That\'s okay.', 'Repost if you agree. Argue if you don\'t.', 'The comments will be interesting.'])}\n\n${closer}`;
    pickN([...VERBS, ...ADJECTIVES], 4).forEach(b => track(b));

  } else { // numbers-guy
    type = '📊 Data-Bro';
    engagementScore = 55 + Math.floor(Math.random() * 25);
    const n = () => Math.floor(Math.random() * 90 + 10);

    text = `I analyzed ${(Math.floor(Math.random() * 900) + 100)} ${track(noun)} decisions.\n\nHere's what separates the top ${n()}% from everyone else:\n\n→ ${n()}% ${track(verb)} ${track(noun)} before competitors\n→ ${n()}% prioritize ${track(adj)} systems over ${track(adj2)} processes\n→ ${n()}% achieve ${track(outcome)} within 12 months\n\nThe bottom ${100-n()}%?\n\nStill ${pick(['in planning mode', 'waiting for the right moment', 'in alignment meetings', 'refining the strategy deck', 'building consensus'])}.\n\nData doesn't lie.\nPeople do.\n\n${closer}`;
    pickN([...VERBS, ...ADJECTIVES, ...OUTCOMES], 5).forEach(b => track(b));
  }

  return { text, buzzwords: [...new Set(buzzwords)], type, engagementScore };
}

// ── UI Components ─────────────────────────────────────────────────────────
const VIBES: { id: Vibe; label: string; desc: string }[] = [
  { id: 'thought-leadership', label: '🎓 Thought Leader',   desc: 'Profound insights you definitely had' },
  { id: 'humble-brag',        label: '🏆 Humble Brag',      desc: 'Success wrapped in humility' },
  { id: 'crisis-survived',    label: '🔥 Crisis Survived',  desc: 'Rock bottom → triumph arc' },
  { id: 'stranger-wisdom',    label: '🚕 Stranger Wisdom',  desc: 'Taxi driver / janitor enlightenment' },
  { id: 'controversial',      label: '🌶️ Unpopular Take',   desc: 'Bait engagement with fake heat' },
  { id: 'numbers-guy',        label: '📊 Data-Bro',         desc: 'Statistics with vibes, no sources' },
];

export default function BuzzwordGeneratorPage() {
  const [vibe,      setVibe]      = useState<Vibe>('thought-leadership');
  const [intensity, setIntensity] = useState<Intensity>(2);
  const [post,      setPost]      = useState<GeneratedPost | null>(null);
  const [copied,    setCopied]    = useState(false);
  const [spinning,  setSpinning]  = useState(false);

  const generate = useCallback(() => {
    setSpinning(true);
    setPost(null);
    setTimeout(() => {
      setPost(generatePost(vibe, intensity));
      setSpinning(false);
    }, 600);
  }, [vibe, intensity]);

  const copy = () => {
    if (post) {
      navigator.clipboard.writeText(post.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Highlight buzzwords in text
  const renderText = (text: string, buzzwords: string[]) => {
    if (!buzzwords.length) return <span>{text}</span>;
    const pattern = new RegExp(`(${buzzwords.map(b => b.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
    const parts = text.split(pattern);
    return (
      <>
        {parts.map((part, i) =>
          buzzwords.some(b => b.toLowerCase() === part.toLowerCase())
            ? <mark key={i} className="bg-purple-500/20 text-purple-300 rounded px-0.5 not-italic">{part}</mark>
            : <span key={i}>{part}</span>
        )}
      </>
    );
  };

  const intensityLabels: Record<Intensity, string> = {
    1: 'Mild — Tolerable at a dinner party',
    2: 'Corporate — Standard LinkedIn energy',
    3: 'CONSULTANT MODE — Full bingo card',
  };
  const intensityColors: Record<Intensity, string> = {
    1: 'text-green-400', 2: 'text-yellow-400', 3: 'text-red-400',
  };

  return (
    <div className="p-5 max-w-3xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">✍️</span>
          <h1 className="text-lg font-bold text-white">Corporate Buzzword Generator</h1>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400 border border-yellow-500/20 font-medium">
            Satire
          </span>
        </div>
        <p className="text-xs text-[#444]">
          For when you need to post on LinkedIn but have absolutely nothing to say.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Left: Controls */}
        <div className="lg:col-span-2 space-y-4">

          {/* Vibe selector */}
          <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4">
            <div className="text-xs text-[#555] uppercase tracking-wider mb-3">Post Vibe</div>
            <div className="space-y-1.5">
              {VIBES.map(v => (
                <button key={v.id} onClick={() => setVibe(v.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl transition-all border ${
                    vibe === v.id
                      ? 'bg-purple-500/15 border-purple-500/30 text-white'
                      : 'bg-[#111] border-[#1a1a1a] text-[#666] hover:text-[#999] hover:border-[#222]'
                  }`}>
                  <div className="text-xs font-medium">{v.label}</div>
                  <div className="text-[10px] text-[#444] mt-0.5">{v.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Intensity */}
          <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4">
            <div className="text-xs text-[#555] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Flame size={11} /> Buzzword Intensity
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {([1, 2, 3] as Intensity[]).map(i => (
                <button key={i} onClick={() => setIntensity(i)}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                    intensity === i
                      ? i === 1 ? 'bg-green-500/15 border-green-500/30 text-green-400'
                        : i === 2 ? 'bg-yellow-500/15 border-yellow-500/30 text-yellow-400'
                        : 'bg-red-500/15 border-red-500/30 text-red-400'
                      : 'bg-[#111] border-[#1a1a1a] text-[#555] hover:text-[#888]'
                  }`}>
                  {i === 1 ? 'Mild' : i === 2 ? 'Corporate' : '💀 MAX'}
                </button>
              ))}
            </div>
            <div className={`text-[10px] mt-2 text-center ${intensityColors[intensity]}`}>
              {intensityLabels[intensity]}
            </div>
          </div>

          {/* Generate button */}
          <button onClick={generate}
            className="w-full py-3.5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-2">
            <RefreshCw size={14} className={spinning ? 'animate-spin' : ''} />
            {spinning ? 'Generating...' : post ? 'Regenerate' : 'Generate Post'}
          </button>
        </div>

        {/* Right: Output */}
        <div className="lg:col-span-3">
          {!post && !spinning && (
            <div className="h-full bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl flex flex-col items-center justify-center py-16 text-center gap-3">
              <div className="text-4xl">✍️</div>
              <div className="text-sm text-[#444]">Select a vibe and hit Generate</div>
              <div className="text-xs text-[#333]">The AI will do the rest.<br />You take the credit.</div>
            </div>
          )}

          {spinning && (
            <div className="h-full bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl flex flex-col items-center justify-center py-16 gap-4">
              <div className="text-2xl animate-bounce">✍️</div>
              <div className="text-sm text-[#555]">Synthesizing thought leadership...</div>
              <div className="flex gap-1">
                {[0,1,2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
            </div>
          )}

          {post && !spinning && (
            <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl overflow-hidden">

              {/* Post header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-[#141414]">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#555]">{post.type}</span>
                  <span className="text-[10px] text-[#333]">·</span>
                  <span className="text-[10px] text-[#444]">Intensity {intensity}/3</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-[10px] text-[#444]">
                    <Sparkles size={10} className="text-yellow-400" />
                    Predicted engagement score:
                    <span className={`font-semibold ${
                      post.engagementScore > 75 ? 'text-green-400' :
                      post.engagementScore > 55 ? 'text-yellow-400' : 'text-[#666]'
                    }`}>{post.engagementScore}/100</span>
                  </div>
                </div>
              </div>

              {/* LinkedIn card preview */}
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">D</div>
                  <div>
                    <div className="text-sm font-semibold text-white">Erick Dronski</div>
                    <div className="text-[10px] text-[#555]">AI Practitioner · Building in public · OpenClaw</div>
                  </div>
                  <div className="ml-auto px-2.5 py-1 border border-blue-500/40 text-blue-400 text-[10px] font-semibold rounded-full">
                    + Follow
                  </div>
                </div>

                {/* Post body */}
                <div className="text-sm text-[#ccc] whitespace-pre-wrap leading-relaxed font-light">
                  {renderText(post.text, post.buzzwords)}
                </div>

                {/* LinkedIn actions (fake) */}
                <div className="flex items-center gap-4 mt-5 pt-4 border-t border-[#141414] text-[#555]">
                  {['👍 Like', '💬 Comment', '🔁 Repost', '📤 Send'].map(a => (
                    <button key={a} className="text-[11px] hover:text-[#888] transition-colors">{a}</button>
                  ))}
                </div>
              </div>

              {/* Buzzword legend */}
              {post.buzzwords.length > 0 && (
                <div className="px-5 pb-4">
                  <div className="text-[10px] text-[#444] mb-2">
                    <mark className="bg-purple-500/20 text-purple-400 rounded px-0.5">highlighted</mark> = detected buzzwords ({post.buzzwords.length} total)
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {post.buzzwords.map(b => (
                      <span key={b} className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/15">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Copy + regen */}
              <div className="flex gap-2 px-5 pb-5">
                <button onClick={copy}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    copied
                      ? 'bg-green-500/15 border border-green-500/30 text-green-400'
                      : 'bg-[#111] border border-[#222] text-white hover:bg-[#1a1a1a]'
                  }`}>
                  {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy Post</>}
                </button>
                <button onClick={generate}
                  className="px-4 py-2.5 bg-[#111] border border-[#222] text-[#888] hover:text-white rounded-xl text-xs transition-all hover:bg-[#1a1a1a]">
                  <RefreshCw size={13} />
                </button>
              </div>

              {/* Disclaimer */}
              <div className="px-5 pb-4 text-[10px] text-[#2a2a2a] text-center">
                Built with OpenClaw · For entertainment purposes · Please don't actually post this · (or do, we're not your manager)
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
