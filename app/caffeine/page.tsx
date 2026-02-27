'use client';

import { useEffect, useState, useCallback } from 'react';
import { Coffee, Moon, Sun, Clock, AlertTriangle, CheckCircle, Zap, RefreshCw } from 'lucide-react';

interface CaffeineData {
  last_coffee_time: string;
  sleep_time: string;
  wake_time: string;
  num_coffees: number;
  coffee_mg: number;
  source: string;
  current_mg: number;
  safe_sleep_time: string;
  status: string;
  cutoff_str: string;
  half_life_hours: number;
  curve: [string, number][];
  intake_times: string[];
  generated_at: string;
}

const SLEEP_THRESHOLD = 25;

const SOURCES = [
  { id: 'coffee',       label: 'Coffee',       mg: 95,  emoji: '☕' },
  { id: 'espresso',     label: 'Espresso',     mg: 63,  emoji: '⚡' },
  { id: 'latte',        label: 'Latte',        mg: 75,  emoji: '🥛' },
  { id: 'cold_brew',    label: 'Cold Brew',    mg: 200, emoji: '🧊' },
  { id: 'energy_drink', label: 'Energy Drink', mg: 160, emoji: '🔋' },
  { id: 'green_tea',    label: 'Green Tea',    mg: 28,  emoji: '🍵' },
];

export default function CaffeinePage() {
  const [data, setData] = useState<CaffeineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [wake, setWake]     = useState('07:00');
  const [sleep, setSleep]   = useState('23:00');
  const [coffees, setCoffees] = useState(3);
  const [source, setSource] = useState('coffee');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/caffeine?wake=${wake}&sleep=${sleep}&coffees=${coffees}&source=${source}`
      );
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [wake, sleep, coffees, source]);

  useEffect(() => { fetchData(); }, [fetchData]);
  // Auto-refresh every 5 min so "current mg" stays live
  useEffect(() => {
    const id = setInterval(fetchData, 300_000);
    return () => clearInterval(id);
  }, [fetchData]);

  const isCutoff = data?.status?.includes('CUT OFF');
  const mgPct    = data ? Math.min(100, (data.current_mg / 200) * 100) : 0;

  // Build SVG path from curve
  const CurveChart = () => {
    if (!data?.curve?.length) return null;
    const pts   = data.curve;
    const maxMg = Math.max(...pts.map(([, mg]) => mg), 100);
    const W = 700, H = 160;

    const x = (i: number) => (i / (pts.length - 1)) * W;
    const y = (mg: number) => H - (mg / maxMg) * H;

    const thresholdY = y(SLEEP_THRESHOLD);
    const polyPoints = pts.map(([, mg], i) => `${x(i)},${y(mg)}`).join(' ');
    const areaPoints = `0,${H} ${polyPoints} ${W},${H}`;

    // Find the cutoff index
    const now = new Date();
    const cutoffIdx = pts.findIndex(([t]) => new Date(t) > now);

    // Intake markers
    const intakeMarkers = (data.intake_times || []).map(t => {
      const idx = pts.findIndex(([pt]) => new Date(pt) >= new Date(t));
      return idx >= 0 ? x(idx) : null;
    }).filter(Boolean);

    // Time labels — just a few
    const labelCount = 6;
    const labelIndices = Array.from({ length: labelCount }, (_, i) =>
      Math.floor((i / (labelCount - 1)) * (pts.length - 1))
    );

    return (
      <svg viewBox={`0 0 ${W} ${H + 28}`} className="w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="cafGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#f97316" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="safeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#22c55e" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.02" />
          </linearGradient>
          <clipPath id="aboveThreshold">
            <rect x="0" y="0" width={W} height={thresholdY} />
          </clipPath>
          <clipPath id="belowThreshold">
            <rect x="0" y={thresholdY} width={W} height={H - thresholdY} />
          </clipPath>
        </defs>

        {/* Sleep threshold line */}
        <line x1="0" y1={thresholdY} x2={W} y2={thresholdY}
          stroke="#22c55e" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
        <text x={W - 4} y={thresholdY - 4} textAnchor="end"
          fontSize="9" fill="#22c55e" opacity="0.7">sleep threshold</text>

        {/* Area above threshold (orange/bad) */}
        <polygon points={areaPoints} fill="url(#cafGrad)" clipPath="url(#aboveThreshold)" />
        {/* Area below threshold (green/good) */}
        <polygon points={areaPoints} fill="url(#safeGrad)" clipPath="url(#belowThreshold)" />

        {/* Line: orange above threshold, green below */}
        <polyline points={polyPoints} fill="none" stroke="#f97316" strokeWidth="1.5"
          clipPath="url(#aboveThreshold)" />
        <polyline points={polyPoints} fill="none" stroke="#22c55e" strokeWidth="1.5"
          clipPath="url(#belowThreshold)" />

        {/* "Now" vertical line */}
        {cutoffIdx > 0 && (
          <line x1={x(cutoffIdx)} y1={0} x2={x(cutoffIdx)} y2={H}
            stroke="#ffffff" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
        )}

        {/* Intake markers */}
        {intakeMarkers.map((xi, i) => (
          <g key={i}>
            <line x1={xi!} y1={0} x2={xi!} y2={H} stroke="#fb923c" strokeWidth="1" opacity="0.4" />
            <text x={xi!} y={H - 4} textAnchor="middle" fontSize="10" fill="#fb923c" opacity="0.8">☕</text>
          </g>
        ))}

        {/* X-axis time labels */}
        {labelIndices.map(idx => {
          const [t] = pts[idx];
          const label = new Date(t).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
          return (
            <text key={idx} x={x(idx)} y={H + 18}
              textAnchor="middle" fontSize="9" fill="#555">
              {label}
            </text>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <Coffee size={24} className="text-orange-400" />
          <div>
            <h1 className="text-xl font-semibold text-white">Caffeine Optimization Engine</h1>
            <p className="text-xs text-[#555] mt-0.5">
              Built with OpenClaw · Because lying awake at 2am thinking about Q3 OKRs is a caffeine architecture problem
            </p>
          </div>
        </div>
        <button onClick={fetchData}
          className="flex items-center gap-1.5 text-xs text-[#555] hover:text-white border border-[#222] hover:border-[#444] px-3 py-1.5 rounded transition-colors">
          <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />
          Recalculate
        </button>
      </div>

      {/* Config Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-[#111] border border-[#222] rounded-lg p-3">
          <label className="text-[10px] text-[#555] uppercase tracking-wider flex items-center gap-1 mb-2">
            <Sun size={10} /> Wake Time
          </label>
          <input type="time" value={wake} onChange={e => setWake(e.target.value)}
            className="w-full bg-transparent text-white text-sm font-medium outline-none" />
        </div>
        <div className="bg-[#111] border border-[#222] rounded-lg p-3">
          <label className="text-[10px] text-[#555] uppercase tracking-wider flex items-center gap-1 mb-2">
            <Moon size={10} /> Sleep Target
          </label>
          <input type="time" value={sleep} onChange={e => setSleep(e.target.value)}
            className="w-full bg-transparent text-white text-sm font-medium outline-none" />
        </div>
        <div className="bg-[#111] border border-[#222] rounded-lg p-3">
          <label className="text-[10px] text-[#555] uppercase tracking-wider mb-2 block">Drinks / Day</label>
          <div className="flex items-center gap-2">
            <button onClick={() => setCoffees(Math.max(1, coffees - 1))}
              className="text-[#555] hover:text-white text-lg leading-none">−</button>
            <span className="text-white font-bold text-lg w-4 text-center">{coffees}</span>
            <button onClick={() => setCoffees(Math.min(8, coffees + 1))}
              className="text-[#555] hover:text-white text-lg leading-none">+</button>
          </div>
        </div>
        <div className="bg-[#111] border border-[#222] rounded-lg p-3">
          <label className="text-[10px] text-[#555] uppercase tracking-wider mb-2 block">Source</label>
          <select value={source} onChange={e => setSource(e.target.value)}
            className="w-full bg-transparent text-white text-sm outline-none">
            {SOURCES.map(s => (
              <option key={s.id} value={s.id} className="bg-[#111]">
                {s.emoji} {s.label} ({s.mg}mg)
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48 text-[#444]">
          Calculating optimal caffeine withdrawal strategy...
        </div>
      ) : data ? (
        <>
          {/* Hero: Last Coffee Time */}
          <div className={`rounded-xl border p-6 mb-5 text-center ${
            isCutoff
              ? 'bg-red-500/5 border-red-500/20'
              : 'bg-orange-500/5 border-orange-500/20'
          }`}>
            <div className="text-xs text-[#555] uppercase tracking-widest mb-2">
              Last Coffee Deadline
            </div>
            <div className={`text-6xl font-bold tracking-tight mb-3 ${
              isCutoff ? 'text-red-400' : 'text-orange-400'
            }`}>
              {data.last_coffee_time}
            </div>
            <div className={`flex items-center justify-center gap-2 text-sm font-medium ${
              isCutoff ? 'text-red-400' : 'text-green-400'
            }`}>
              {isCutoff
                ? <><AlertTriangle size={14} /> {data.status} — {data.cutoff_str}</>
                : <><CheckCircle size={14} /> {data.status} — {data.cutoff_str}</>
              }
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-[#111] border border-[#222] rounded-lg p-4">
              <div className="text-xs text-[#555] uppercase tracking-wider mb-1 flex items-center gap-1">
                <Zap size={10} /> Current Bloodstream
              </div>
              <div className={`text-2xl font-bold ${
                data.current_mg > 100 ? 'text-red-400' :
                data.current_mg > SLEEP_THRESHOLD ? 'text-orange-400' : 'text-green-400'
              }`}>{data.current_mg}mg</div>
              <div className="mt-2 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-700 ${
                  data.current_mg > 100 ? 'bg-red-500' :
                  data.current_mg > SLEEP_THRESHOLD ? 'bg-orange-500' : 'bg-green-500'
                }`} style={{ width: `${mgPct}%` }} />
              </div>
              <div className="text-[10px] text-[#444] mt-1">
                Sleep threshold: {SLEEP_THRESHOLD}mg
              </div>
            </div>

            <div className="bg-[#111] border border-[#222] rounded-lg p-4">
              <div className="text-xs text-[#555] uppercase tracking-wider mb-1 flex items-center gap-1">
                <Moon size={10} /> Safe to Sleep By
              </div>
              <div className="text-2xl font-bold text-white">{data.safe_sleep_time}</div>
              <div className="text-[10px] text-[#444] mt-1">
                Based on current {data.current_mg}mg load
              </div>
            </div>

            <div className="bg-[#111] border border-[#222] rounded-lg p-4">
              <div className="text-xs text-[#555] uppercase tracking-wider mb-1 flex items-center gap-1">
                <Clock size={10} /> Half-Life
              </div>
              <div className="text-2xl font-bold text-white">{data.half_life_hours}h</div>
              <div className="text-[10px] text-[#444] mt-1">
                Statland & Demas, 1980 (yes, really)
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-[#111] border border-[#222] rounded-lg p-5 mb-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Coffee size={14} className="text-[#555]" />
                Caffeine Curve — Today
              </h2>
              <div className="flex items-center gap-4 text-[10px] text-[#555]">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
                  Above sleep threshold
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                  Safe zone
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-orange-400">☕</span>
                  Coffee intake
                </span>
              </div>
            </div>
            <CurveChart />
          </div>

          {/* Science footnote */}
          <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg p-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-[#555]">
              <div><span className="text-[#444]">Model:</span> First-order pharmacokinetics</div>
              <div><span className="text-[#444]">Half-life:</span> 5.7h avg (range: 1.5–9.5h)</div>
              <div><span className="text-[#444]">Per {data.source}:</span> {data.coffee_mg}mg caffeine</div>
              <div><span className="text-[#444]">Built with:</span> OpenClaw + Python + zero chill</div>
            </div>
            <div className="mt-3 text-[10px] text-[#333] text-center">
              This page exists because Q3 OKRs are not a reason to be awake at 2am. The caffeine is, though.
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-[#444]">Failed to load caffeine data</div>
      )}
    </div>
  );
}
