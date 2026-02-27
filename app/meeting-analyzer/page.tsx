'use client';

import { useState } from 'react';
import { Mail, Users, Clock, FileText, Sparkles, RotateCcw, DollarSign, AlertTriangle, CheckCircle, Minus } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────
interface AnalysisResult {
  verdict: 'EMAIL' | 'BORDERLINE' | 'MEETING';
  confidence: number;
  emailScore: number; // 0–100, higher = more email-able
  timeLostMins: number;
  salaryWasted: number;
  factors: { label: string; impact: 'bad' | 'neutral' | 'good'; points: number }[];
  summary: string;
  tip: string;
}

// ── Scoring Engine ("the AI") ─────────────────────────────────────────────
function analyzeMeeting(
  title: string,
  attendees: number,
  durationMins: number,
  agenda: string,
  purpose: string,
  avgSalaryK: number
): AnalysisResult {
  let score = 35; // baseline — slightly toward email
  const factors: AnalysisResult['factors'] = [];

  const t = title.toLowerCase();
  const a = agenda.toLowerCase();

  // ── Title signals (penalizers) ─────────────────────────
  if (/\b(sync|check[\-\s]?in|standup|stand[\-\s]?up|update|status|touch[\s]?base|debrief|recap|weekly|daily|bi[\-\s]?weekly)\b/.test(t)) {
    score -= 28;
    factors.push({ label: `"${title}" signals a recurring update`, impact: 'bad', points: -28 });
  }
  if (/\b(meeting|call|discuss|chat|catch[\s]?up)\b/.test(t) && !/\b(decision|decide|sign|approve|launch|crisis|negotiate)\b/.test(t)) {
    score -= 10;
    factors.push({ label: 'Generic meeting title with no stated outcome', impact: 'bad', points: -10 });
  }

  // ── Attendees ──────────────────────────────────────────
  if (attendees === 1) {
    score -= 40;
    factors.push({ label: '1 attendee — this is a calendar block', impact: 'bad', points: -40 });
  } else if (attendees === 2) {
    score += 8;
    factors.push({ label: '2 people — efficient back-and-forth possible', impact: 'good', points: 8 });
  } else if (attendees <= 4) {
    score += 5;
    factors.push({ label: `${attendees} attendees — small group, manageable`, impact: 'neutral', points: 5 });
  } else if (attendees <= 7) {
    score -= 15;
    factors.push({ label: `${attendees} attendees — at least 2 are there just to listen`, impact: 'bad', points: -15 });
  } else {
    score -= 30;
    factors.push({ label: `${attendees} attendees — someone is being CCed in human form`, impact: 'bad', points: -30 });
  }

  // ── Duration ───────────────────────────────────────────
  if (durationMins <= 15) {
    score += 12;
    factors.push({ label: `${durationMins}-min slot — quick, tight, defensible`, impact: 'good', points: 12 });
  } else if (durationMins <= 30) {
    score += 5;
    factors.push({ label: `${durationMins}-min slot — reasonable if focused`, impact: 'neutral', points: 5 });
  } else if (durationMins <= 60) {
    score -= 12;
    factors.push({ label: `${durationMins}-min slot — that's a lot of people's afternoon`, impact: 'bad', points: -12 });
  } else {
    score -= 25;
    factors.push({ label: `${durationMins}-min marathon — this organization has no Slack`, impact: 'bad', points: -25 });
  }

  // ── Agenda ─────────────────────────────────────────────
  if (!agenda.trim()) {
    score -= 18;
    factors.push({ label: 'No agenda provided — classic email in disguise', impact: 'bad', points: -18 });
  } else if (agenda.length < 20) {
    score -= 8;
    factors.push({ label: 'Vague agenda — barely counts', impact: 'bad', points: -8 });
  } else {
    score += 10;
    factors.push({ label: 'Structured agenda exists — rare and commendable', impact: 'good', points: 10 });
  }

  // ── Purpose ────────────────────────────────────────────
  const purposeMap: Record<string, { pts: number; label: string; impact: 'bad' | 'neutral' | 'good' }> = {
    'status-update':   { pts: -35, label: 'Purpose: status update — the #1 email crime', impact: 'bad' },
    'brainstorm':      { pts: +20, label: 'Purpose: brainstorming — async tools are worse for this', impact: 'good' },
    'decision':        { pts: +35, label: 'Purpose: making a decision — legitimate meeting need', impact: 'good' },
    'presentation':    { pts: -15, label: 'Purpose: presentation — a recording would do the same thing', impact: 'bad' },
    'client-call':     { pts: +30, label: 'External client call — always justified', impact: 'good' },
    'crisis':          { pts: +40, label: 'Crisis/incident — there is no email for fire', impact: 'good' },
    'negotiation':     { pts: +30, label: 'Negotiation — can\'t email this one away', impact: 'good' },
    'onboarding':      { pts: +15, label: 'Onboarding — human presence matters here', impact: 'good' },
    'team-building':   { pts: +10, label: 'Team building — arguably not a meeting but fine', impact: 'neutral' },
    'interview':       { pts: +30, label: 'Interview — must be synchronous', impact: 'good' },
    'other':           { pts: 0,   label: 'Purpose: unspecified', impact: 'neutral' },
  };

  if (purpose && purposeMap[purpose]) {
    const p = purposeMap[purpose];
    score += p.pts;
    factors.push({ label: p.label, impact: p.impact, points: p.pts });
  }

  // ── Agenda keywords ────────────────────────────────────
  if (/\b(decide|decision|approve|sign[\s-]?off|vote|choose)\b/.test(a)) {
    score += 20;
    factors.push({ label: 'Agenda includes a decision point', impact: 'good', points: 20 });
  }
  if (/\b(update|fyi|inform|announce|share|present)\b/.test(a) && !/\b(decide|approve)\b/.test(a)) {
    score -= 15;
    factors.push({ label: 'Agenda is purely informational — that\'s what email is for', impact: 'bad', points: -15 });
  }

  // ── Clamp score ────────────────────────────────────────
  score = Math.max(5, Math.min(95, score));

  // emailScore: higher = more email-able (inverse of meeting score)
  const emailScore = 100 - score;

  // Verdict & confidence
  let verdict: AnalysisResult['verdict'];
  let confidence: number;
  let summary: string;
  let tip: string;

  if (emailScore >= 68) {
    verdict = 'EMAIL';
    confidence = Math.min(97, 70 + Math.floor((emailScore - 68) * 0.9));
    summary = 'This meeting could have been an email.';
    tip = 'Draft a concise email with context, question, and deadline. You just gave everyone 30 minutes back.';
  } else if (emailScore >= 45) {
    verdict = 'BORDERLINE';
    confidence = Math.floor(40 + Math.random() * 20);
    summary = 'Unclear. Lean email if attendees > 4. Lean meeting if a decision must be made.';
    tip = 'Try a 15-min standup instead. If you can\'t cover it in 15, the agenda isn\'t clear enough.';
  } else {
    verdict = 'MEETING';
    confidence = Math.min(96, 65 + Math.floor((45 - emailScore) * 0.8));
    summary = 'Meeting justified. Rare. Cherish this moment.';
    tip = 'Keep it tight. End with written action items — send the email *after* the meeting.';
  }

  // Salary calc: (attendees × duration/60) × (avgSalaryK × 1000 / 2080)
  const hourlyRate = (avgSalaryK * 1000) / 2080;
  const salaryWasted = Math.round(attendees * (durationMins / 60) * hourlyRate);
  const timeLostMins = attendees * durationMins;

  return { verdict, confidence, emailScore, timeLostMins, salaryWasted, factors, summary, tip };
}

// ── Components ─────────────────────────────────────────────────────────────
const VERDICT_CONFIG = {
  EMAIL: {
    label: '📧 COULD HAVE BEEN AN EMAIL',
    sublabel: 'The algorithm has spoken.',
    bg: 'bg-red-500/8 border-red-500/25',
    badge: 'bg-red-500/15 text-red-400 border-red-500/30',
    bar: 'bg-red-500',
    color: 'text-red-400',
    emoji: '📧',
  },
  BORDERLINE: {
    label: '🤔 THE JURY IS STILL OUT',
    sublabel: 'Could go either way. Flip a coin.',
    bg: 'bg-yellow-500/8 border-yellow-500/25',
    badge: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    bar: 'bg-yellow-500',
    color: 'text-yellow-400',
    emoji: '🤔',
  },
  MEETING: {
    label: '✅ MEETING JUSTIFIED',
    sublabel: 'One of the good ones. They exist.',
    bg: 'bg-green-500/8 border-green-500/25',
    badge: 'bg-green-500/15 text-green-400 border-green-500/30',
    bar: 'bg-green-500',
    color: 'text-green-400',
    emoji: '✅',
  },
};

// Stats that display on the page (hardcoded for "AI" vibes)
const SYSTEM_STATS = {
  analyzed: '52,847',
  accuracy: '94.3%',
  emailRate: '78.2%',
  avgWaste: '$1,340',
};

export default function MeetingAnalyzerPage() {
  const [title,       setTitle]       = useState('');
  const [attendees,   setAttendees]   = useState(5);
  const [duration,    setDuration]    = useState(60);
  const [agenda,      setAgenda]      = useState('');
  const [purpose,     setPurpose]     = useState('status-update');
  const [salary,      setSalary]      = useState(120);
  const [result,      setResult]      = useState<AnalysisResult | null>(null);
  const [loading,     setLoading]     = useState(false);

  const analyze = () => {
    setLoading(true);
    setResult(null);
    // Fake 1.2s "AI thinking" delay for drama
    setTimeout(() => {
      setResult(analyzeMeeting(title || 'Weekly Sync', attendees, duration, agenda, purpose, salary));
      setLoading(false);
    }, 1200);
  };

  const reset = () => {
    setResult(null);
    setTitle(''); setAgenda('');
    setAttendees(5); setDuration(60); setPurpose('status-update');
  };

  const cfg = result ? VERDICT_CONFIG[result.verdict] : null;

  return (
    <div className="p-5 max-w-3xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">🤖</span>
          <h1 className="text-lg font-bold text-white">Meeting or Email?</h1>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/20 font-medium">AI-Powered</span>
        </div>
        <p className="text-xs text-[#444]">
          Paste your meeting details. The model will decide if you wasted everyone's afternoon.
        </p>
      </div>

      {/* System Stats Bar */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        {[
          { label: 'Meetings Analyzed', value: SYSTEM_STATS.analyzed },
          { label: 'Model Accuracy',    value: SYSTEM_STATS.accuracy  },
          { label: 'Were Emails',       value: SYSTEM_STATS.emailRate  },
          { label: 'Avg Salary Lost',   value: SYSTEM_STATS.avgWaste   },
        ].map(s => (
          <div key={s.label} className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-3 text-center">
            <div className="text-base font-bold text-white">{s.value}</div>
            <div className="text-[9px] text-[#444] mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Form */}
      {!result && (
        <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl overflow-hidden mb-4">
          <div className="p-5 space-y-4">

            {/* Title */}
            <div>
              <label className="text-xs text-[#555] uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <FileText size={11} /> Meeting Title
              </label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Weekly Team Sync · Q3 Budget Review · Product Decision"
                className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#333] outline-none focus:border-[#444] transition-colors"
              />
            </div>

            {/* Purpose */}
            <div>
              <label className="text-xs text-[#555] uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <Sparkles size={11} /> Primary Purpose
              </label>
              <select value={purpose} onChange={e => setPurpose(e.target.value)}
                className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#444] transition-colors">
                <option value="status-update">📊 Status Update</option>
                <option value="decision">⚖️ Making a Decision</option>
                <option value="brainstorm">💡 Brainstorming</option>
                <option value="presentation">📽️ Presentation / Demo</option>
                <option value="client-call">🤝 External Client / Partner</option>
                <option value="crisis">🚨 Crisis / Incident</option>
                <option value="negotiation">💼 Negotiation / Deal</option>
                <option value="onboarding">👋 Onboarding</option>
                <option value="interview">🎤 Interview</option>
                <option value="team-building">🎉 Team Building</option>
                <option value="other">❓ Other</option>
              </select>
            </div>

            {/* Attendees + Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#555] uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Users size={11} /> Attendees
                </label>
                <div className="flex items-center gap-3 bg-[#111] border border-[#222] rounded-xl px-4 py-3">
                  <button onClick={() => setAttendees(Math.max(1, attendees - 1))}
                    className="text-[#555] hover:text-white text-lg w-5 text-center">−</button>
                  <span className="flex-1 text-center text-white font-semibold text-lg">{attendees}</span>
                  <button onClick={() => setAttendees(Math.min(50, attendees + 1))}
                    className="text-[#555] hover:text-white text-lg w-5 text-center">+</button>
                </div>
                <div className="text-[10px] text-[#444] mt-1 text-center">
                  {attendees === 1 ? 'just you' : attendees <= 3 ? 'small' : attendees <= 6 ? 'medium' : 'uh oh'}
                </div>
              </div>
              <div>
                <label className="text-xs text-[#555] uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Clock size={11} /> Duration
                </label>
                <select value={duration} onChange={e => setDuration(Number(e.target.value))}
                  className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#444]">
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                  <option value={180}>3 hours 💀</option>
                </select>
              </div>
            </div>

            {/* Agenda */}
            <div>
              <label className="text-xs text-[#555] uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <FileText size={11} /> Agenda <span className="text-[#333] normal-case">(optional — suspiciously)</span>
              </label>
              <textarea
                value={agenda}
                onChange={e => setAgenda(e.target.value)}
                placeholder="What's actually being covered? Or leave blank if there isn't one..."
                rows={3}
                className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#333] outline-none focus:border-[#444] transition-colors resize-none"
              />
            </div>

            {/* Salary */}
            <div>
              <label className="text-xs text-[#555] uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <DollarSign size={11} /> Avg Attendee Salary (K) — for the math
              </label>
              <div className="flex items-center gap-3">
                <input type="range" min={50} max={300} step={10} value={salary}
                  onChange={e => setSalary(Number(e.target.value))}
                  className="flex-1 accent-orange-500" />
                <span className="text-white font-semibold text-sm w-16 text-right">${salary}K</span>
              </div>
            </div>
          </div>

          <div className="px-5 pb-5">
            <button onClick={analyze}
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold rounded-xl transition-all text-sm flex items-center justify-center gap-2">
              <Sparkles size={15} />
              Analyze Meeting
            </button>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-12 flex flex-col items-center justify-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-full border-2 border-purple-500/20 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full border-2 border-t-purple-500 border-purple-500/10 animate-spin" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center text-xl">🤖</div>
          </div>
          <div className="text-sm text-white font-medium">Consulting the model...</div>
          <div className="text-xs text-[#444]">Cross-referencing 52,847 meetings · Calculating salary burned · Judging silently</div>
        </div>
      )}

      {/* Result */}
      {result && cfg && (
        <div className="space-y-3">

          {/* Verdict Hero */}
          <div className={`rounded-2xl border p-6 ${cfg.bg}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className={`text-2xl font-black tracking-tight ${cfg.color}`}>{cfg.label}</div>
                <div className="text-sm text-[#666] mt-1">{cfg.sublabel}</div>
              </div>
              <div className={`text-right px-3 py-1.5 rounded-full border text-xs font-bold ${cfg.badge}`}>
                {result.confidence}% confidence
              </div>
            </div>

            {/* Confidence bar */}
            <div className="mb-4">
              <div className="flex justify-between text-[10px] text-[#555] mb-1.5">
                <span>DEFINITELY EMAIL</span>
                <span>DEFINITELY MEETING</span>
              </div>
              <div className="h-3 bg-[#111] rounded-full overflow-hidden relative">
                {/* Gradient track */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 via-yellow-500/30 to-green-500/30" />
                {/* Needle */}
                <div className="absolute top-0 bottom-0 w-1 bg-white rounded-full shadow-lg transition-all duration-700"
                  style={{ left: `calc(${100 - result.emailScore}% - 2px)` }} />
              </div>
              <div className="flex justify-center mt-2 text-xs text-[#555]">
                Needle position: <span className={`ml-1 font-semibold ${cfg.color}`}>
                  {result.verdict === 'EMAIL' ? `${result.emailScore}% emailability` :
                   result.verdict === 'MEETING' ? `${100 - result.emailScore}% meeting score` :
                   'borderline zone'}
                </span>
              </div>
            </div>

            <div className="text-sm text-[#888]">{result.summary}</div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-orange-400">{result.timeLostMins}m</div>
              <div className="text-[10px] text-[#555] mt-1">Combined time consumed</div>
              <div className="text-[9px] text-[#333]">({attendees} people × {duration}min)</div>
            </div>
            <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-red-400">${result.salaryWasted.toLocaleString()}</div>
              <div className="text-[10px] text-[#555] mt-1">Salary burned</div>
              <div className="text-[9px] text-[#333]">at ${salary}K avg</div>
            </div>
            <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {Math.round(result.timeLostMins / 480 * 10) / 10}d
              </div>
              <div className="text-[10px] text-[#555] mt-1">Work days consumed</div>
              <div className="text-[9px] text-[#333]">across all attendees</div>
            </div>
          </div>

          {/* Factor breakdown */}
          <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#141414] flex items-center gap-2">
              <Sparkles size={14} className="text-purple-400" />
              <span className="text-sm font-semibold text-white">Model Reasoning</span>
              <span className="text-[10px] text-[#444] ml-auto">What drove the verdict</span>
            </div>
            <div className="divide-y divide-[#0f0f0f]">
              {result.factors.map((f, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3">
                  <div className="flex-shrink-0">
                    {f.impact === 'bad'     && <AlertTriangle size={13} className="text-red-400" />}
                    {f.impact === 'good'    && <CheckCircle   size={13} className="text-green-400" />}
                    {f.impact === 'neutral' && <Minus         size={13} className="text-[#555]" />}
                  </div>
                  <div className="flex-1 text-xs text-[#888]">{f.label}</div>
                  <div className={`text-xs font-semibold w-12 text-right ${
                    f.points > 0 ? 'text-green-400' : f.points < 0 ? 'text-red-400' : 'text-[#555]'
                  }`}>
                    {f.points > 0 ? `+${f.points}` : f.points}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tip */}
          <div className="bg-purple-500/8 border border-purple-500/20 rounded-2xl p-4 flex items-start gap-3">
            <span className="text-lg">💡</span>
            <div>
              <div className="text-xs font-semibold text-purple-300 mb-1">Model Recommendation</div>
              <div className="text-sm text-[#888]">{result.tip}</div>
            </div>
          </div>

          {/* Footer / attribution */}
          <div className="flex items-center justify-between px-1">
            <div className="text-[10px] text-[#333]">
              Built with OpenClaw · {SYSTEM_STATS.analyzed} meetings analyzed · {SYSTEM_STATS.accuracy} accuracy
            </div>
            <button onClick={reset}
              className="flex items-center gap-1.5 text-xs text-[#555] hover:text-white transition-colors">
              <RotateCcw size={11} /> Analyze another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
