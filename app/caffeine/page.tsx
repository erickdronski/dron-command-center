'use client';

import { useEffect, useState, useCallback } from 'react';
import { Coffee, Moon, Plus, Trash2, Clock, Zap, ChevronRight, X, CheckCircle, AlertTriangle } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────
interface Size   { id: string; label: string; oz: number; mg: number }
interface Drink  { id: string; name: string; category: string; sizes: Size[] }
interface Brand  { id: string; name: string; emoji: string; color: string; drinks: Drink[] }
interface LogEntry {
  id: string;
  time: string; // ISO
  brandId: string; brandName: string; brandEmoji: string; brandColor: string;
  drinkName: string;
  sizeLabel: string;
  oz: number; mg: number;
}

// ── Constants ──────────────────────────────────────────────────────────────
const HALF_LIFE   = 5.7;          // hours
const SLEEP_THRESH = 25;          // mg — safe to sleep
const NEXT_THRESH  = 50;          // mg — low enough to benefit from another cup
const SLEEP_TARGET = '23:00';     // default

// ── Math ───────────────────────────────────────────────────────────────────
function mgRemaining(initialMg: number, hoursElapsed: number) {
  return initialMg * Math.pow(0.5, hoursElapsed / HALF_LIFE);
}

function currentBloodstream(log: LogEntry[]): number {
  const now = Date.now();
  return log.reduce((sum, entry) => {
    const hrs = (now - new Date(entry.time).getTime()) / 3_600_000;
    return hrs >= 0 ? sum + mgRemaining(entry.mg, hrs) : sum;
  }, 0);
}

function buildCurve(log: LogEntry[], sleepIso: string) {
  const now   = new Date();
  const today = now.toISOString().slice(0, 10);
  const sleep = new Date(`${today}T${sleepIso}:00`);
  if (sleep < now) sleep.setDate(sleep.getDate() + 1);
  const end   = new Date(sleep.getTime() + 4 * 3_600_000);
  const start = new Date(Math.min(now.getTime() - 4 * 3_600_000,
    log.length ? new Date(log[0].time).getTime() - 1800_000 : now.getTime() - 3_600_000));

  const pts: { t: Date; mg: number }[] = [];
  for (let t = new Date(start); t <= end; t = new Date(t.getTime() + 15 * 60_000)) {
    const mg = log.reduce((sum, e) => {
      const hrs = (t.getTime() - new Date(e.time).getTime()) / 3_600_000;
      return hrs >= 0 ? sum + mgRemaining(e.mg, hrs) : sum;
    }, 0);
    pts.push({ t: new Date(t), mg: Math.round(mg * 10) / 10 });
  }
  return { pts, sleep };
}

function hoursUntil(mg: number, target: number): number {
  if (mg <= target) return 0;
  return HALF_LIFE * Math.log2(mg / target);
}

function fmt12(date: Date) {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}
function fmtDur(hrs: number) {
  const h = Math.floor(hrs), m = Math.round((hrs - h) * 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

// ── Storage ────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'caffeine-log-v2';
function loadLog(): LogEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const all: LogEntry[] = JSON.parse(raw);
    const cutoff = new Date(); cutoff.setHours(0, 0, 0, 0);
    return all.filter(e => new Date(e.time) >= cutoff);
  } catch { return []; }
}
function saveLog(log: LogEntry[]) {
  if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
}

// ── Curve SVG ─────────────────────────────────────────────────────────────
function CurveChart({ pts, sleep, nowMg }: {
  pts: { t: Date; mg: number }[];
  sleep: Date;
  nowMg: number;
}) {
  if (!pts.length) return null;
  const W = 600, H = 140;
  const maxMg = Math.max(...pts.map(p => p.mg), 100);
  const minT  = pts[0].t.getTime();
  const maxT  = pts[pts.length - 1].t.getTime();

  const px = (t: Date) => ((t.getTime() - minT) / (maxT - minT)) * W;
  const py = (mg: number) => H - (mg / maxMg) * H * 0.92;

  const thresholdY = py(SLEEP_THRESH);
  const nextY      = py(NEXT_THRESH);
  const nowX       = px(new Date());
  const sleepX     = Math.min(W, px(sleep));

  const polyline = pts.map(p => `${px(p.t)},${py(p.mg)}`).join(' ');
  const area     = `0,${H} ${polyline} ${W},${H}`;

  // Label every 2h
  const ticks: Date[] = [];
  const t0 = new Date(minT); t0.setMinutes(0, 0, 0);
  for (let t = new Date(t0); t.getTime() <= maxT; t = new Date(t.getTime() + 7200_000)) {
    if (t.getTime() >= minT) ticks.push(new Date(t));
  }

  return (
    <svg viewBox={`0 0 ${W} ${H + 24}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="areaAbove" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#f97316" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
        </linearGradient>
        <linearGradient id="areaBelow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#22c55e" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
        </linearGradient>
        <clipPath id="clipAbove"><rect x="0" y="0"          width={W} height={thresholdY} /></clipPath>
        <clipPath id="clipBelow"><rect x="0" y={thresholdY} width={W} height={H}          /></clipPath>
        <clipPath id="clipPast"> <rect x="0" y="0"          width={nowX} height={H + 24}  /></clipPath>
        <clipPath id="clipFuture"><rect x={nowX} y="0"      width={W}    height={H + 24}  /></clipPath>
      </defs>

      {/* Background grid */}
      {[0, 25, 50, 100, 150, 200].map(mg => {
        const y = py(mg);
        if (y < 0 || y > H) return null;
        return (
          <g key={mg}>
            <line x1={0} y1={y} x2={W} y2={y} stroke="#1a1a1a" strokeWidth="1" />
            <text x={3} y={y - 3} fontSize="7" fill="#333">{mg}mg</text>
          </g>
        );
      })}

      {/* Sleep threshold */}
      <line x1={0} y1={thresholdY} x2={W} y2={thresholdY} stroke="#22c55e" strokeWidth="0.75" strokeDasharray="3 2" opacity="0.6" />
      <text x={W - 4} y={thresholdY - 3} fontSize="7" fill="#22c55e" textAnchor="end" opacity="0.8">sleep ok</text>

      {/* Next coffee threshold */}
      <line x1={0} y1={nextY} x2={W} y2={nextY} stroke="#818cf8" strokeWidth="0.75" strokeDasharray="2 3" opacity="0.5" />
      <text x={W - 4} y={nextY - 3} fontSize="7" fill="#818cf8" textAnchor="end" opacity="0.7">next cup</text>

      {/* Sleep time marker */}
      {sleepX > 0 && sleepX < W && (
        <>
          <line x1={sleepX} y1={0} x2={sleepX} y2={H} stroke="#6366f1" strokeWidth="1" strokeDasharray="4 2" opacity="0.6" />
          <text x={sleepX + 3} y={12} fontSize="7" fill="#6366f1" opacity="0.8">🌙 sleep</text>
        </>
      )}

      {/* Area fills */}
      <polygon points={area} fill="url(#areaAbove)" clipPath="url(#clipAbove)" />
      <polygon points={area} fill="url(#areaBelow)" clipPath="url(#clipBelow)" />

      {/* Past line (solid) */}
      <polyline points={polyline} fill="none" stroke="#f97316" strokeWidth="1.5" clipPath="url(#clipPast)" />
      <polyline points={polyline} fill="none" stroke="#22c55e" strokeWidth="1.5" clipPath="url(#clipPast)"
        style={{ clipPath: `polygon(0 ${thresholdY}px, ${W}px ${thresholdY}px, ${W}px ${H}px, 0 ${H}px)` }} />

      {/* Future line (dashed) */}
      <polyline points={polyline} fill="none" stroke="#f97316" strokeWidth="1.5"
        strokeDasharray="3 2" opacity="0.5" clipPath="url(#clipFuture)" />

      {/* Now line */}
      <line x1={nowX} y1={0} x2={nowX} y2={H} stroke="#ffffff" strokeWidth="1" opacity="0.25" />
      <text x={nowX + 3} y={12} fontSize="7" fill="#888">now</text>

      {/* X-axis ticks */}
      {ticks.map((t, i) => {
        const x = px(t);
        return (
          <g key={i}>
            <line x1={x} y1={H} x2={x} y2={H + 4} stroke="#333" strokeWidth="0.75" />
            <text x={x} y={H + 14} fontSize="8" fill="#555" textAnchor="middle">
              {t.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Drink Picker ──────────────────────────────────────────────────────────
function DrinkPicker({ brands, onAdd, onClose }: {
  brands: Brand[];
  onAdd: (entry: Omit<LogEntry, 'id' | 'time'>) => void;
  onClose: () => void;
}) {
  const [brand, setBrand]   = useState<Brand | null>(null);
  const [drink, setDrink]   = useState<Drink | null>(null);
  const [size,  setSize]    = useState<Size  | null>(null);

  const reset = () => { setBrand(null); setDrink(null); setSize(null); };

  const add = () => {
    if (!brand || !drink || !size) return;
    onAdd({
      brandId: brand.id, brandName: brand.name,
      brandEmoji: brand.emoji, brandColor: brand.color,
      drinkName: drink.name,
      sizeLabel: size.label,
      oz: size.oz, mg: size.mg,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
         onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1a1a1a]">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            {brand && (
              <button onClick={reset} className="text-[#555] hover:text-white mr-1">←</button>
            )}
            <Coffee size={16} className="text-orange-400" />
            {!brand ? 'Select Brand' : !drink ? brand.name : !size ? drink.name : 'Confirm'}
          </div>
          <button onClick={onClose} className="text-[#555] hover:text-white">
            <X size={16} />
          </button>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {/* Step 1: Brand */}
          {!brand && (
            <div className="grid grid-cols-2 gap-2">
              {brands.map(b => (
                <button key={b.id} onClick={() => setBrand(b)}
                  className="flex items-center gap-3 p-3 bg-[#1a1a1a] hover:bg-[#222] border border-[#222] hover:border-[#333] rounded-xl text-left transition-all group">
                  <span className="text-2xl">{b.emoji}</span>
                  <div>
                    <div className="text-sm font-medium text-white">{b.name}</div>
                    <div className="text-[10px] text-[#555]">{b.drinks.length} drinks</div>
                  </div>
                  <ChevronRight size={14} className="ml-auto text-[#444] group-hover:text-[#666]" />
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Drink */}
          {brand && !drink && (
            <div className="space-y-1.5">
              {brand.drinks.map(d => (
                <button key={d.id} onClick={() => setDrink(d)}
                  className="flex items-center justify-between w-full p-3 bg-[#1a1a1a] hover:bg-[#222] border border-[#222] hover:border-[#333] rounded-xl transition-all text-left">
                  <div>
                    <div className="text-sm font-medium text-white">{d.name}</div>
                    <div className="text-[10px] text-[#555] mt-0.5">
                      {d.sizes[0].mg}–{d.sizes[d.sizes.length - 1].mg}mg caffeine
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-[#444]" />
                </button>
              ))}
            </div>
          )}

          {/* Step 3: Size */}
          {brand && drink && !size && (
            <div className="space-y-2">
              <p className="text-xs text-[#555] mb-3">{brand.emoji} {brand.name} · {drink.name}</p>
              {drink.sizes.map(s => (
                <button key={s.id} onClick={() => setSize(s)}
                  className="flex items-center justify-between w-full p-3.5 bg-[#1a1a1a] hover:bg-[#222] border border-[#222] hover:border-[#333] rounded-xl transition-all text-left">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {s.oz <= 4 ? '🥃' : s.oz <= 10 ? '☕' : s.oz <= 16 ? '🥤' : '🧴'}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{s.label}</div>
                      <div className="text-xs text-[#555]">{s.oz} oz</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      s.mg < 80 ? 'text-green-400' :
                      s.mg < 150 ? 'text-yellow-400' :
                      s.mg < 250 ? 'text-orange-400' : 'text-red-400'
                    }`}>{s.mg}mg</div>
                    <div className="text-[10px] text-[#555]">caffeine</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Step 4: Confirm */}
          {brand && drink && size && (
            <div className="space-y-4">
              <div className="p-4 bg-[#1a1a1a] rounded-xl border border-[#222]">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{brand.emoji}</span>
                  <div className="flex-1">
                    <div className="text-base font-semibold text-white">{drink.name}</div>
                    <div className="text-sm text-[#888]">{brand.name} · {size.label} ({size.oz} oz)</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-400">{size.mg}mg</div>
                    <div className="text-xs text-[#555]">caffeine</div>
                  </div>
                </div>
              </div>
              <button onClick={add}
                className="w-full py-3 bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-xl transition-colors text-sm">
                Log Drink · {fmt12(new Date())}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Bloodstream Gauge ─────────────────────────────────────────────────────
function BloodstreamGauge({ mg }: { mg: number }) {
  const max = 400;
  const pct = Math.min(1, mg / max);
  const r = 54, cx = 64, cy = 64;
  const circ = 2 * Math.PI * r;
  const dash = circ * 0.75; // 270° arc
  const offset = dash - dash * pct;
  const color = mg > 200 ? '#ef4444' : mg > 100 ? '#f97316' : mg > SLEEP_THRESH ? '#eab308' : '#22c55e';

  return (
    <div className="relative flex items-center justify-center" style={{ width: 128, height: 128 }}>
      <svg width="128" height="128" viewBox="0 0 128 128">
        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1a1a1a" strokeWidth="10"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeDashoffset={-circ * 0.125}
          strokeLinecap="round" transform="rotate(135 64 64)" />
        {/* Fill */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeDashoffset={offset + circ * 0.875}
          strokeLinecap="round"
          transform="rotate(135 64 64)"
          style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.4s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-bold text-white leading-none">{Math.round(mg)}</div>
        <div className="text-[10px] text-[#555] mt-1">mg active</div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────
export default function CaffeinePage() {
  const [brands,       setBrands]       = useState<Brand[]>([]);
  const [log,          setLog]          = useState<LogEntry[]>([]);
  const [picker,       setPicker]       = useState(false);
  const [now,          setNow]          = useState(new Date());
  const [sleepTarget,  setSleepTarget]  = useState('23:00');

  // Load brands
  useEffect(() => {
    fetch('/data/caffeine-brands.json').then(r => r.json()).then(d => setBrands(d.brands));
  }, []);

  // Load persisted log
  useEffect(() => { setLog(loadLog()); }, []);

  // Tick every 30s
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const addDrink = useCallback((entry: Omit<LogEntry, 'id' | 'time'>) => {
    const full: LogEntry = {
      ...entry,
      id: `${Date.now()}-${Math.random()}`,
      time: new Date().toISOString(),
    };
    setLog(prev => {
      const next = [...prev, full].sort((a, b) => a.time.localeCompare(b.time));
      saveLog(next);
      return next;
    });
  }, []);

  const removeDrink = useCallback((id: string) => {
    setLog(prev => { const next = prev.filter(e => e.id !== id); saveLog(next); return next; });
  }, []);

  // Calculations
  const curMg  = currentBloodstream(log);
  const totalMgToday = log.reduce((s, e) => s + e.mg, 0);
  const { pts, sleep } = buildCurve(log, sleepTarget);

  const hrsToSleep  = hoursUntil(curMg, SLEEP_THRESH);
  const hrsToNext   = hoursUntil(curMg, NEXT_THRESH);
  const safeSleep   = new Date(now.getTime() + hrsToSleep * 3_600_000);
  const nextCoffee  = hrsToNext <= 0 ? null : new Date(now.getTime() + hrsToNext * 3_600_000);

  const sleepDt     = new Date(`${now.toISOString().slice(0,10)}T${sleepTarget}:00`);
  if (sleepDt < now) sleepDt.setDate(sleepDt.getDate() + 1);

  // Last safe coffee = when we'd need to stop to clear by sleepTarget
  const hrsNeeded   = HALF_LIFE * Math.log2(Math.max(1, curMg + 95) / SLEEP_THRESH);
  const lastCoffee  = new Date(sleepDt.getTime() - hrsNeeded * 3_600_000);
  const pastCutoff  = now > lastCoffee;

  const status = pastCutoff
    ? { label: 'CUTOFF REACHED', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', icon: AlertTriangle }
    : curMg < SLEEP_THRESH
    ? { label: 'CLEAR TO DRINK', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', icon: CheckCircle }
    : { label: 'WITHIN LIMITS',  color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', icon: CheckCircle };

  return (
    <div className="p-5 max-w-3xl mx-auto">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Coffee size={20} className="text-orange-400" />
            <h1 className="text-lg font-bold text-white">Caffeine Optimizer</h1>
          </div>
          <p className="text-xs text-[#444] mt-0.5">
            Built with OpenClaw · Because Q3 OKRs don't need help keeping you awake
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-[#555] bg-[#111] border border-[#222] px-2.5 py-1.5 rounded-lg">
            <Moon size={11} />
            <input type="time" value={sleepTarget} onChange={e => setSleepTarget(e.target.value)}
              className="bg-transparent text-white outline-none w-[52px] text-xs" />
          </div>
          <button onClick={() => setPicker(true)}
            className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-400 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
            <Plus size={13} /> Add Drink
          </button>
        </div>
      </div>

      {/* ── Hero Row ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 mb-4">

        {/* Gauge */}
        <div className={`col-span-1 rounded-2xl border p-4 flex flex-col items-center justify-center ${status.bg}`}>
          <BloodstreamGauge mg={curMg} />
          <div className={`text-[10px] font-semibold tracking-widest mt-2 ${status.color}`}>
            {status.label}
          </div>
        </div>

        {/* Key metrics */}
        <div className="col-span-2 grid grid-cols-2 gap-3">

          {/* Last coffee deadline */}
          <div className={`rounded-2xl border p-4 ${pastCutoff ? 'bg-red-500/5 border-red-500/20' : 'bg-[#111] border-[#222]'}`}>
            <div className="text-[10px] text-[#555] uppercase tracking-wider mb-1">
              ☕ Last Coffee By
            </div>
            <div className={`text-3xl font-bold leading-none ${pastCutoff ? 'text-red-400' : 'text-orange-400'}`}>
              {fmt12(lastCoffee)}
            </div>
            <div className="text-[10px] text-[#555] mt-2">
              {pastCutoff ? `Missed by ${fmtDur((now.getTime() - lastCoffee.getTime()) / 3_600_000)}` : `in ${fmtDur((lastCoffee.getTime() - now.getTime()) / 3_600_000)}`}
            </div>
          </div>

          {/* Next optimal */}
          <div className="rounded-2xl bg-[#111] border border-[#222] p-4">
            <div className="text-[10px] text-[#555] uppercase tracking-wider mb-1">
              ⚡ Next Optimal
            </div>
            {nextCoffee ? (
              <>
                <div className="text-3xl font-bold leading-none text-indigo-400">
                  {fmt12(nextCoffee)}
                </div>
                <div className="text-[10px] text-[#555] mt-2">in {fmtDur(hrsToNext)}</div>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold leading-none text-green-400">Now ✓</div>
                <div className="text-[10px] text-[#555] mt-2">Caffeine low · Ready for next cup</div>
              </>
            )}
          </div>

          {/* Safe to sleep */}
          <div className="rounded-2xl bg-[#111] border border-[#222] p-4">
            <div className="text-[10px] text-[#555] uppercase tracking-wider mb-1">
              🌙 Safe to Sleep
            </div>
            <div className={`text-2xl font-bold leading-none ${
              hrsToSleep === 0 ? 'text-green-400' : 'text-purple-400'
            }`}>
              {hrsToSleep === 0 ? 'Now ✓' : fmt12(safeSleep)}
            </div>
            <div className="text-[10px] text-[#555] mt-2">
              {hrsToSleep === 0 ? 'Under 25mg threshold' : `in ${fmtDur(hrsToSleep)}`}
            </div>
          </div>

          {/* Today total */}
          <div className="rounded-2xl bg-[#111] border border-[#222] p-4">
            <div className="text-[10px] text-[#555] uppercase tracking-wider mb-1">
              📊 Today's Total
            </div>
            <div className="text-2xl font-bold leading-none text-white">{totalMgToday}mg</div>
            <div className="text-[10px] text-[#555] mt-2">
              {log.length} drink{log.length !== 1 ? 's' : ''} · {Math.round(curMg)}mg active
            </div>
          </div>
        </div>
      </div>

      {/* ── Curve Chart ────────────────────────────────────────────────── */}
      <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Zap size={14} className="text-orange-400" /> Caffeine Curve
          </h2>
          <div className="flex items-center gap-4 text-[10px] text-[#444]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-0.5 bg-orange-500 inline-block" /> Above threshold
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-0.5 bg-green-500 inline-block" /> Safe zone
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-0.5 bg-indigo-400 inline-block border-dashed" /> Sleep
            </span>
          </div>
        </div>
        {pts.length > 0 ? (
          <CurveChart pts={pts} sleep={sleep} nowMg={curMg} />
        ) : (
          <div className="h-32 flex items-center justify-center text-[#333] text-sm">
            Log a drink to see your caffeine curve
          </div>
        )}
      </div>

      {/* ── Drink Log ──────────────────────────────────────────────────── */}
      <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a1a1a]">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Clock size={14} className="text-[#555]" /> Today's Log
          </h2>
          <span className="text-xs text-[#555]">{now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
        </div>

        {log.length === 0 ? (
          <div className="py-10 text-center">
            <div className="text-3xl mb-2">☕</div>
            <div className="text-sm text-[#444]">No drinks logged yet</div>
            <div className="text-xs text-[#333] mt-1">Tap "Add Drink" to start tracking</div>
          </div>
        ) : (
          <div className="divide-y divide-[#141414]">
            {[...log].reverse().map((entry, i) => {
              const hoursAgo = (now.getTime() - new Date(entry.time).getTime()) / 3_600_000;
              const remaining = mgRemaining(entry.mg, hoursAgo);
              const pct = remaining / entry.mg;

              return (
                <div key={entry.id} className="flex items-center gap-4 px-5 py-3 hover:bg-[#111] transition-colors group">
                  <div className="text-xl">{entry.brandEmoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-medium text-white">{entry.drinkName}</span>
                      <span className="text-xs text-[#555]">{entry.brandName}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-[#555]">{entry.sizeLabel} · {entry.mg}mg</span>
                      <span className="text-[10px] text-[#444]">·</span>
                      <span className="text-[10px] text-[#555]">
                        {new Date(entry.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                      </span>
                    </div>
                    {/* Decay bar */}
                    <div className="mt-1.5 h-1 bg-[#1a1a1a] rounded-full w-32 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pct * 100}%`,
                          backgroundColor: pct > 0.5 ? '#f97316' : pct > 0.25 ? '#eab308' : '#22c55e'
                        }} />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-orange-400">
                      ~{Math.round(remaining)}mg
                    </div>
                    <div className="text-[10px] text-[#555]">still active</div>
                  </div>
                  <button onClick={() => removeDrink(entry.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-[#444] hover:text-red-400 ml-1">
                    <Trash2 size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer science note */}
        <div className="px-5 py-3 border-t border-[#141414] flex items-center justify-between">
          <div className="text-[10px] text-[#333]">
            Half-life {HALF_LIFE}h · Sleep threshold {SLEEP_THRESH}mg · Next cup threshold {NEXT_THRESH}mg
          </div>
          <div className="text-[10px] text-[#333]">Statland & Demas, 1980</div>
        </div>
      </div>

      {picker && <DrinkPicker brands={brands} onAdd={addDrink} onClose={() => setPicker(false)} />}
    </div>
  );
}
