'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, Flame, Target, Quote, Zap } from 'lucide-react';

interface Briefing {
  date: string;
  day_name: string;
  streak: number;
  intensity: number;
  intensity_label: string;
  intensity_note: string;
  opener: string;
  challenge: string;
  quote: string;
  quote_author: string;
  closer: string;
  generated_at: string;
}

function IntensityBar({ value }: { value: number }) {
  const pct = (value / 10) * 100;
  const color = value >= 8 ? '#ef4444' : value >= 6 ? '#f97316' : value >= 4 ? '#eab308' : '#22c55e';
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-lg font-black tabular-nums" style={{ color }}>{value}/10</span>
    </div>
  );
}

export default function GogginsPage() {
  const [data,    setData]    = useState<Briefing | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/data/goggins-today.json', { cache: 'no-store' });
      setData(await res.json());
    } catch { /* show skeleton */ }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const intensityColor = data
    ? data.intensity >= 8 ? '#ef4444'
    : data.intensity >= 6 ? '#f97316'
    : data.intensity >= 4 ? '#eab308'
    : '#22c55e'
    : '#f97316';

  return (
    <div className="min-h-full bg-[#0a0a0a] p-5">
      <div className="max-w-2xl mx-auto">

        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flame size={20} style={{ color: intensityColor }} />
              <h1 className="text-lg font-black tracking-tight text-white uppercase">
                Morning Briefing
              </h1>
            </div>
            <p className="text-xs text-[#444]">
              Built with OpenClaw · Delivered 6am daily · Because alarms don't judge you hard enough
            </p>
          </div>
          <button onClick={load}
            className="p-2 text-[#444] hover:text-white border border-[#1a1a1a] hover:border-[#333] rounded-lg transition-colors">
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {loading && !data && (
          <div className="space-y-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-24 bg-[#0f0f0f] border border-[#1a1a1a] rounded-2xl animate-pulse" />
            ))}
          </div>
        )}

        {data && (
          <div className="space-y-3">

            {/* ── Date + Streak + Intensity ─────────────────────── */}
            <div className="bg-[#0f0f0f] border rounded-2xl p-5 overflow-hidden relative"
              style={{ borderColor: `${intensityColor}25` }}>

              {/* Glow */}
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${intensityColor}60, transparent)` }} />

              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-[10px] text-[#444] uppercase tracking-widest mb-1">
                    {data.date}
                  </div>
                  <div className="text-4xl font-black tracking-tighter text-white">
                    {data.day_name}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-[#444] uppercase tracking-widest mb-1">Day</div>
                  <div className="text-4xl font-black tabular-nums" style={{ color: intensityColor }}>
                    {data.streak}
                  </div>
                </div>
              </div>

              <IntensityBar value={data.intensity} />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: intensityColor }}>
                  {data.intensity_label}
                </span>
                <span className="text-[10px] text-[#444]">{data.intensity_note}</span>
              </div>
            </div>

            {/* ── Wake Up Call ──────────────────────────────────── */}
            <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={13} style={{ color: intensityColor }} />
                <span className="text-[10px] font-bold text-[#555] uppercase tracking-widest">Wake Up Call</span>
              </div>
              <p className="text-base font-semibold text-white leading-snug">
                {data.opener}
              </p>
            </div>

            {/* ── Daily Challenge ───────────────────────────────── */}
            <div className="rounded-2xl p-5 border relative overflow-hidden"
              style={{ borderColor: `${intensityColor}30`, background: `${intensityColor}08` }}>
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${intensityColor}40, transparent)` }} />
              <div className="flex items-center gap-2 mb-3">
                <Target size={13} style={{ color: intensityColor }} />
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: intensityColor }}>
                  Daily Challenge
                </span>
              </div>
              <p className="text-sm font-semibold text-white leading-relaxed">
                {data.challenge}
              </p>
            </div>

            {/* ── Quote ─────────────────────────────────────────── */}
            <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Quote size={13} className="text-[#333]" />
                <span className="text-[10px] font-bold text-[#555] uppercase tracking-widest">Calibration</span>
              </div>
              <blockquote className="text-sm text-[#aaa] italic leading-relaxed mb-3 border-l-2 pl-3"
                style={{ borderColor: intensityColor }}>
                "{data.quote}"
              </blockquote>
              <div className="text-[10px] text-[#555] font-semibold uppercase tracking-wider">
                — {data.quote_author}
              </div>
            </div>

            {/* ── Closer / Sign-off ─────────────────────────────── */}
            <div className="rounded-2xl p-6 text-center border relative overflow-hidden"
              style={{ borderColor: `${intensityColor}20`, background: `${intensityColor}06` }}>
              <div className="absolute inset-0 opacity-5"
                style={{ background: `radial-gradient(circle at 50% 50%, ${intensityColor}, transparent 70%)` }} />
              <div className="text-2xl font-black tracking-widest relative" style={{ color: intensityColor }}>
                {data.closer}
              </div>
            </div>

            {/* ── Footer ───────────────────────────────────────── */}
            <div className="flex items-center justify-between px-1 text-[10px] text-[#2a2a2a]">
              <span>OpenClaw Automation · Delivered 6:00 AM EST</span>
              <span>Suffering is the true test of life</span>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
