'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, RefreshCw, Camera, AlertTriangle, CheckCircle, Sparkles, Copy } from 'lucide-react';

// ── Tag Config ─────────────────────────────────────────────────────────────
interface Tag { id: string; label: string; icon: string; profScore: number; investScore: number }

const TAGS: Tag[] = [
  { id: 'shelf_clean',   label: 'Organized bookshelf',       icon: '📚', profScore: 12,  investScore: 8  },
  { id: 'shelf_chaos',   label: 'Chaotic bookshelf',         icon: '📖', profScore: -4,  investScore: 2  },
  { id: 'shelf_curated', label: 'Suspiciously curated shelf', icon: '🎭', profScore: 5,   investScore: 12 },
  { id: 'ring_light',    label: 'Ring light',                icon: '💡', profScore: 10,  investScore: 15 },
  { id: 'multi_monitor', label: 'Multiple monitors',         icon: '🖥️', profScore: 8,   investScore: 18 },
  { id: 'plant_real',    label: 'Real plant (alive)',        icon: '🌱', profScore: 6,   investScore: 5  },
  { id: 'plant_fake',    label: 'Fake or dead plant',        icon: '🪴', profScore: -3,  investScore: 2  },
  { id: 'laundry',       label: 'Laundry pile',              icon: '👕', profScore: -22, investScore: -8 },
  { id: 'unmade_bed',    label: 'Unmade bed',                icon: '🛏️', profScore: -28, investScore: -5 },
  { id: 'gaming_setup',  label: 'Gaming setup',              icon: '🎮', profScore: -8,  investScore: 20 },
  { id: 'virtual_bg',    label: 'Zoom virtual background',   icon: '🎭', profScore: -12, investScore: -10},
  { id: 'blank_wall',    label: 'Bare wall / nothing',       icon: '🫥', profScore: -6,  investScore: -5 },
  { id: 'motivational',  label: 'Motivational poster',       icon: '⭐', profScore: -7,  investScore: 3  },
  { id: 'kitchen',       label: 'Kitchen visible',           icon: '🍳', profScore: -10, investScore: -8 },
  { id: 'art',           label: 'Expensive-looking art',     icon: '🖼️', profScore: 14,  investScore: 20 },
  { id: 'sports',        label: 'Sports memorabilia',        icon: '🏆', profScore: -4,  investScore: 5  },
  { id: 'kid_toys',      label: 'Kids\' toys visible',       icon: '🧸', profScore: -12, investScore: 0  },
  { id: 'pet',           label: 'Pet appearance',            icon: '🐕', profScore: -5,  investScore: 0  },
  { id: 'home_gym',      label: 'Home gym equipment',        icon: '🏋️', profScore: -6,  investScore: 15 },
  { id: 'neon_sign',     label: 'Neon sign / LED strips',   icon: '🌈', profScore: -14, investScore: 12 },
  { id: 'nice_lighting', label: 'Warm ambient lighting',     icon: '🕯️', profScore: 9,   investScore: 10 },
  { id: 'mess_general',  label: 'General chaos / clutter',  icon: '🌪️', profScore: -18, investScore: -5 },
];

// ── Verdict Engine ──────────────────────────────────────────────────────────
interface Verdict {
  profScore: number;
  profLabel: string;
  profColor: string;
  lifeChoices: string;
  investTier: string;
  investLabel: string;
  investColor: string;
  shelfComment: string;
  mainVerdict: string;
  recommendation: string;
  overallGrade: string;
  gradeColor: string;
}

function getVerdict(tags: string[], hasImage: boolean): Verdict {
  // Base scores
  let prof = 70;
  let invest = 50;
  for (const tagId of tags) {
    const t = TAGS.find(t => t.id === tagId);
    if (t) { prof += t.profScore; invest += t.investScore; }
  }
  prof  = Math.max(5,  Math.min(99, prof));
  invest = Math.max(5, Math.min(99, invest));

  // Prof label
  const profLabel = prof >= 80 ? 'Boardroom Ready' : prof >= 65 ? 'Passably Professional' : prof >= 45 ? 'Concerning' : prof >= 25 ? 'Actively Damaging' : 'Crime Scene';
  const profColor = prof >= 80 ? 'text-green-400' : prof >= 65 ? 'text-yellow-400' : prof >= 45 ? 'text-orange-400' : 'text-red-400';

  // Investment tier
  const investTier = invest >= 80 ? 'Silicon Valley Bro' : invest >= 65 ? 'Serious Practitioner' : invest >= 45 ? 'Making An Effort' : invest >= 25 ? 'Laptop On A Kitchen Table' : 'Please Get A Desk';
  const investColor = invest >= 65 ? 'text-purple-400' : invest >= 45 ? 'text-blue-400' : invest >= 25 ? 'text-yellow-400' : 'text-red-400';
  const investLabel = invest >= 80 ? '🖥️🖥️🖥️🖥️' : invest >= 65 ? '🖥️🖥️🖥️' : invest >= 45 ? '🖥️🖥️' : '🖥️';

  // Bookshelf comment
  let shelfComment = 'No bookshelf detected. No opinion formed. That\'s fine. It\'s fine.';
  if (tags.includes('shelf_curated'))  shelfComment = 'The bookshelf is meticulously arranged with spines forward and titles visible. You wanted us to read those titles. We noticed. Everyone notices.';
  else if (tags.includes('shelf_clean'))   shelfComment = 'Organized bookshelf. Either genuinely well-read or very recently tidied. We\'re choosing to believe the best.';
  else if (tags.includes('shelf_chaos'))  shelfComment = 'The bookshelf chaos is technically authentic. It says "I\'ve read things." It also says "I stopped caring around 2019."';

  // Life choices
  let lifeChoices = 'Functional adult with functional workspace. Nothing to report.';
  if (tags.includes('unmade_bed') && tags.includes('laundry')) {
    lifeChoices = 'The bed is unmade and there\'s laundry in frame. You are either extremely comfortable with yourself or this call started 20 minutes earlier than planned. We respect both.';
  } else if (tags.includes('unmade_bed')) {
    lifeChoices = 'The bed behind you is unmade. It is a Tuesday at 2pm. The pillow is visible. Your manager can see the pillow. We are rooting for you.';
  } else if (tags.includes('laundry')) {
    lifeChoices = 'There is laundry in frame. It has been there long enough that you stopped seeing it. It is visible to everyone else on the call. It has been logged.';
  } else if (tags.includes('virtual_bg')) {
    lifeChoices = 'You\'ve hidden your background with a virtual one. The AI community salutes you. The blurring around your hair does not. Something is behind that background. We all know it.';
  } else if (tags.includes('gaming_setup') && tags.includes('multi_monitor')) {
    lifeChoices = 'This is a command center. You built a command center. You are in three Discord servers during this meeting. The RGB is on. The productivity metrics are a lie.';
  } else if (tags.includes('gaming_setup')) {
    lifeChoices = 'Gaming chair in a work meeting. Bold. Unapologetic. The chair probably cost more than the desk.';
  } else if (tags.includes('neon_sign')) {
    lifeChoices = 'There is a neon sign or LED strips in frame. This tells us a lot about you. You have opinions about RGB. You bought those opinions.';
  } else if (tags.includes('kitchen')) {
    lifeChoices = 'You\'re taking this call from what appears to be a kitchen. There may be dishes. There may not be. Either way, the professional context has shifted to "mid-renovation open concept."';
  } else if (tags.includes('motivational')) {
    lifeChoices = '"That poster is for me," you say. "I need the reminder." The poster says HUSTLE. It was $14 on Amazon. It came with a frame. You kept the frame.';
  } else if (tags.includes('blank_wall')) {
    lifeChoices = 'A bare white wall. Intentional or not, this communicates something. Either you\'ve mastered minimalism or you moved in recently and never got around to the decorating phase. Both are valid.';
  } else if (tags.includes('kid_toys')) {
    lifeChoices = 'Toys visible in the background. This is an advanced-level move. You\'ve normalized chaos. You are unstoppable. The Fischer-Price piano has been there for six months and at this point it stays.';
  } else if (tags.includes('art')) {
    lifeChoices = 'There is what appears to be an intentional art piece behind you. It is doing work. It is the hardest working thing in this call.';
  } else if (tags.includes('ring_light') && tags.includes('shelf_curated')) {
    lifeChoices = 'Ring light, curated shelf, visible effort. You have watched setup tour videos on YouTube. You have a Pinterest board. This is a production.';
  } else if (tags.includes('ring_light')) {
    lifeChoices = 'The ring light means you thought about how you look on camera. You did the research. The rest of the call participants have not. You are winning a game no one else is playing.';
  } else if (tags.includes('pet')) {
    lifeChoices = 'A pet has appeared in frame or is clearly nearby. This is the only thing anyone on the call will remember about this meeting.';
  } else if (tags.includes('home_gym')) {
    lifeChoices = 'Home gym equipment is visible. You want people to know. That\'s fine. They know.';
  } else if (tags.includes('plant_real')) {
    lifeChoices = 'A real, living plant. You remember to water it. You are keeping something alive besides your career. This is a good sign.';
  }

  // Main verdict
  let mainVerdict = '';
  let recommendation = '';

  if (prof >= 80) {
    mainVerdict = 'This background communicates competence, investment, and a controlled level of personality. Whoever set this up either has good taste or watched a lot of setup tour videos. Possibly both.';
    recommendation = 'No action required. Screenshot this and use it everywhere.';
  } else if (prof >= 65) {
    mainVerdict = 'Broadly acceptable. Nobody on the call is going to remember your background, which is the goal. A few choices are slightly visible that could be improved, but they\'re within the range of "professionally deniable."';
    recommendation = 'Minor adjustments would take this from fine to good. Low urgency.';
  } else if (prof >= 50) {
    mainVerdict = 'There are elements in this background that are making independent decisions about your personal brand without your knowledge. Some of them are incorrect decisions. The background is speaking.';
    recommendation = 'Camera up 15 degrees. Or a blanket over the thing on the left.';
  } else if (prof >= 35) {
    mainVerdict = 'The background is actively attending this meeting. It has opinions. Those opinions are not aligned with your professional positioning. The situation is recoverable but requires immediate physical intervention.';
    recommendation = 'Virtual background. Now. Pick the plain blurred one. Not the beach.';
  } else {
    mainVerdict = 'The AI has processed this image and is requesting a wellness check. Not for the meeting. For the person in the meeting. This background has seen things. We wish it hadn\'t.';
    recommendation = 'Close the laptop. Walk to a different room. Open the laptop. Try again.';
  }

  // Overall grade
  const combined = (prof + invest) / 2;
  const grade = combined >= 80 ? 'A' : combined >= 70 ? 'B' : combined >= 55 ? 'C' : combined >= 40 ? 'D' : 'F';
  const gradeColor = grade === 'A' ? 'text-green-400' : grade === 'B' ? 'text-blue-400' : grade === 'C' ? 'text-yellow-400' : grade === 'D' ? 'text-orange-400' : 'text-red-400';

  return { profScore: prof, profLabel, profColor, lifeChoices, investTier, investLabel, investColor, shelfComment, mainVerdict, recommendation, overallGrade: grade, gradeColor };
}

// ── Score Bar ───────────────────────────────────────────────────────────────
function ScoreBar({ score, color }: { score: number; color: string }) {
  const barColor = color.replace('text-', 'bg-').replace('-400', '-500');
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-1000 ${barColor}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-xs font-bold w-8 text-right ${color}`}>{score}</span>
    </div>
  );
}

// ── Scan Animation ──────────────────────────────────────────────────────────
function ScanLines() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0" style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139,92,246,0.03) 2px, rgba(139,92,246,0.03) 4px)',
        animation: 'scanMove 3s linear infinite',
      }} />
      <style>{`@keyframes scanMove { 0% { background-position: 0 0; } 100% { background-position: 0 40px; } }`}</style>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────
export default function WFHJudgePage() {
  const [image,      setImage]      = useState<string | null>(null);
  const [tags,       setTags]       = useState<string[]>([]);
  const [phase,      setPhase]      = useState<'upload' | 'tag' | 'scanning' | 'result'>('upload');
  const [verdict,    setVerdict]    = useState<Verdict | null>(null);
  const [scanStep,   setScanStep]   = useState(0);
  const [copied,     setCopied]     = useState(false);
  const [dragOver,   setDragOver]   = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const SCAN_STEPS = [
    'Analyzing ambient lighting conditions...',
    'Detecting background objects...',
    'Measuring RGB-to-productivity ratio...',
    'Checking for laundry signatures...',
    'Evaluating bookshelf curatorial intent...',
    'Cross-referencing with LinkedIn profile photo...',
    'Calibrating passive-aggressive commentary...',
    'Finalizing assessment...',
  ];

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      setImage(e.target?.result as string);
      setPhase('tag');
    };
    reader.readAsDataURL(file);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) handleFile(file);
  }, []);

  const toggleTag = (id: string) =>
    setTags(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);

  const runAnalysis = () => {
    setPhase('scanning');
    setScanStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setScanStep(step);
      if (step >= SCAN_STEPS.length) {
        clearInterval(interval);
        setTimeout(() => {
          setVerdict(getVerdict(tags, !!image));
          setPhase('result');
        }, 600);
      }
    }, 480);
  };

  const reset = () => { setImage(null); setTags([]); setPhase('upload'); setVerdict(null); setScanStep(0); };

  const copyVerdict = () => {
    if (!verdict) return;
    const text = [
      `WFH Background Audit — Grade: ${verdict.overallGrade}`,
      '',
      `Professionalism: ${verdict.profScore}/100 — ${verdict.profLabel}`,
      `Investment Level: ${verdict.investTier}`,
      '',
      `Life Choices Assessment: ${verdict.lifeChoices}`,
      '',
      `Bookshelf: ${verdict.shelfComment}`,
      '',
      `Verdict: ${verdict.mainVerdict}`,
      '',
      `Recommended Action: ${verdict.recommendation}`,
      '',
      'Analyzed by WFH Background Judge · Built with OpenClaw',
    ].join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-5 max-w-4xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">📹</span>
          <h1 className="text-lg font-bold text-white">WFH Background Judge</h1>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/20 font-medium">AI-Powered</span>
        </div>
        <p className="text-xs text-[#444]">
          Upload your Zoom background. Get a professional assessment. Prepare to be roasted.
        </p>
      </div>

      {/* ── UPLOAD PHASE ─────────────────────────────────────────────── */}
      {phase === 'upload' && (
        <div
          onDrop={onDrop}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-16 flex flex-col items-center justify-center cursor-pointer transition-all ${
            dragOver ? 'border-purple-500 bg-purple-500/5' : 'border-[#2a2a2a] hover:border-[#444] hover:bg-[#0f0f0f]'
          }`}>
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          <div className="w-16 h-16 rounded-2xl bg-[#111] border border-[#222] flex items-center justify-center mb-4">
            <Camera size={28} className="text-[#555]" />
          </div>
          <p className="text-sm font-semibold text-white mb-1">Drop your background screenshot here</p>
          <p className="text-xs text-[#555]">or click to browse · JPG, PNG, WEBP</p>
          <div className="mt-8 grid grid-cols-3 gap-3 max-w-lg">
            {[
              { icon: '📸', label: 'Screenshot your Zoom call' },
              { icon: '🤖', label: 'AI scans for chaos' },
              { icon: '📋', label: 'Receive honest verdict' },
            ].map(s => (
              <div key={s.label} className="flex flex-col items-center gap-2 p-3 bg-[#0f0f0f] rounded-xl border border-[#1a1a1a]">
                <span className="text-xl">{s.icon}</span>
                <span className="text-[10px] text-[#555] text-center">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAG PHASE ────────────────────────────────────────────────── */}
      {phase === 'tag' && image && (
        <div className="grid grid-cols-5 gap-4">
          {/* Image preview */}
          <div className="col-span-2">
            <div className="rounded-2xl overflow-hidden border border-[#222] relative">
              <img src={image} alt="Your background" className="w-full object-cover" style={{ maxHeight: 280 }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <span className="text-[10px] text-white/60 bg-black/40 px-2 py-1 rounded-lg">Your background</span>
              </div>
            </div>
            <button onClick={reset} className="mt-2 text-[10px] text-[#444] hover:text-white transition-colors flex items-center gap-1">
              <RefreshCw size={10} /> Use different image
            </button>
          </div>

          {/* Tag selector */}
          <div className="col-span-3">
            <h2 className="text-sm font-bold text-white mb-1">What&apos;s visible in your background?</h2>
            <p className="text-xs text-[#555] mb-3">Select everything that applies — the AI is watching closely</p>
            <div className="grid grid-cols-2 gap-1.5 max-h-72 overflow-y-auto pr-1">
              {TAGS.map(tag => {
                const active = tags.includes(tag.id);
                return (
                  <button key={tag.id} onClick={() => toggleTag(tag.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all text-xs ${
                      active
                        ? 'bg-purple-500/15 border-purple-500/35 text-white'
                        : 'bg-[#0f0f0f] border-[#1a1a1a] text-[#666] hover:text-white hover:border-[#2a2a2a]'
                    }`}>
                    <span>{tag.icon}</span>
                    <span className="font-medium leading-tight flex-1">{tag.label}</span>
                    {active && <span className="text-purple-400 text-[10px]">✓</span>}
                  </button>
                );
              })}
            </div>
            <button
              onClick={runAnalysis}
              className="mt-3 w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold rounded-xl text-sm transition-all">
              <Sparkles size={14} />
              Analyze Background
            </button>
          </div>
        </div>
      )}

      {/* ── SCANNING PHASE ───────────────────────────────────────────── */}
      {phase === 'scanning' && (
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-2">
            <div className="rounded-2xl overflow-hidden border border-purple-500/30 relative">
              {image && <img src={image} alt="Scanning" className="w-full object-cover opacity-60" style={{ maxHeight: 280 }} />}
              <ScanLines />
              {/* Scan bar */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="h-0.5 bg-purple-400/50 absolute w-full"
                  style={{ top: `${(scanStep / SCAN_STEPS.length) * 100}%`, transition: 'top 0.4s ease', boxShadow: '0 0 8px rgba(139,92,246,0.8)' }} />
              </div>
              <div className="absolute inset-0 bg-purple-500/5" />
            </div>
          </div>
          <div className="col-span-3 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Analysis In Progress</span>
            </div>
            <div className="space-y-2">
              {SCAN_STEPS.map((step, i) => (
                <div key={i} className={`flex items-center gap-3 transition-all duration-300 ${
                  i < scanStep ? 'opacity-100' : 'opacity-20'
                }`}>
                  {i < scanStep ? (
                    <CheckCircle size={13} className="text-green-400 flex-shrink-0" />
                  ) : i === scanStep ? (
                    <div className="w-3 h-3 rounded-full border-2 border-purple-500 border-t-transparent animate-spin flex-shrink-0" />
                  ) : (
                    <div className="w-3 h-3 rounded-full border border-[#333] flex-shrink-0" />
                  )}
                  <span className={`text-xs ${i < scanStep ? 'text-[#777]' : i === scanStep ? 'text-white font-semibold' : 'text-[#333]'}`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${(scanStep / SCAN_STEPS.length) * 100}%` }} />
              </div>
              <p className="text-[10px] text-[#444] mt-1">{Math.round((scanStep / SCAN_STEPS.length) * 100)}% complete</p>
            </div>
          </div>
        </div>
      )}

      {/* ── RESULT PHASE ─────────────────────────────────────────────── */}
      {phase === 'result' && verdict && (
        <div className="grid grid-cols-5 gap-4">
          {/* Image + grade */}
          <div className="col-span-2 space-y-3">
            <div className="rounded-2xl overflow-hidden border border-[#222] relative">
              {image && <img src={image} alt="Analyzed" className="w-full object-cover" style={{ maxHeight: 240 }} />}
              {/* Grade overlay */}
              <div className="absolute top-3 right-3">
                <div className={`w-12 h-12 rounded-xl bg-black/80 border border-white/10 flex items-center justify-center`}>
                  <span className={`text-2xl font-black ${verdict.gradeColor}`}>{verdict.overallGrade}</span>
                </div>
              </div>
            </div>

            {/* Score bars */}
            <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-2xl p-4 space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[10px] text-[#555] uppercase tracking-wider">Professionalism</span>
                  <span className={`text-[10px] font-bold ${verdict.profColor}`}>{verdict.profLabel}</span>
                </div>
                <ScoreBar score={verdict.profScore} color={verdict.profColor} />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[10px] text-[#555] uppercase tracking-wider">Setup Investment</span>
                  <span className={`text-[10px] font-bold ${verdict.investColor}`}>{verdict.investTier}</span>
                </div>
                <div className="text-sm">{verdict.investLabel}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button onClick={copyVerdict}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                  copied ? 'bg-green-500/15 border-green-500/30 text-green-400' : 'bg-[#111] border-[#222] text-white hover:bg-[#1a1a1a]'
                }`}>
                <Copy size={12} />
                {copied ? 'Copied!' : 'Copy for LinkedIn'}
              </button>
              <button onClick={reset}
                className="px-3 py-2.5 bg-[#111] border border-[#222] text-[#555] hover:text-white rounded-xl text-xs transition-all">
                <RefreshCw size={12} />
              </button>
            </div>
          </div>

          {/* Verdict cards */}
          <div className="col-span-3 space-y-3">

            {/* Main verdict */}
            <div className={`rounded-2xl border p-4 ${
              verdict.profScore >= 65 ? 'bg-green-500/5 border-green-500/20' :
              verdict.profScore >= 45 ? 'bg-yellow-500/5 border-yellow-500/20' :
              'bg-red-500/5 border-red-500/20'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {verdict.profScore >= 65 ? <CheckCircle size={13} className="text-green-400" /> : <AlertTriangle size={13} className="text-orange-400" />}
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#888]">AI Assessment</span>
              </div>
              <p className="text-sm text-white leading-relaxed">{verdict.mainVerdict}</p>
            </div>

            {/* Life choices */}
            <div className="rounded-2xl bg-[#0f0f0f] border border-[#1a1a1a] p-4">
              <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest mb-2">🧠 Implied Life Choices</p>
              <p className="text-xs text-[#bbb] leading-relaxed">{verdict.lifeChoices}</p>
            </div>

            {/* Bookshelf */}
            <div className="rounded-2xl bg-[#0f0f0f] border border-[#1a1a1a] p-4">
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-2">📚 Bookshelf Analysis</p>
              <p className="text-xs text-[#bbb] leading-relaxed">{verdict.shelfComment}</p>
            </div>

            {/* Recommendation */}
            <div className="rounded-2xl bg-[#111] border border-[#222] p-4">
              <p className="text-[10px] text-orange-400 font-bold uppercase tracking-widest mb-2">💡 Recommended Action</p>
              <p className="text-sm text-white font-medium leading-relaxed">{verdict.recommendation}</p>
            </div>

            {/* Footer */}
            <div className="text-[10px] text-[#2a2a2a] text-center">
              WFH Background Judge · Built with OpenClaw · The RGB is on. The productivity metrics are a lie.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
