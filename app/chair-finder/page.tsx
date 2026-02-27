'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Check, ExternalLink, RotateCcw } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────
interface Tag { id: string; label: string; icon?: string }
interface Hotspot {
  id: string;
  label: string;
  desc: string;
  svgX: number; svgY: number;     // dot position in SVG coords (0-500 x 0-560)
  labelSide: 'left' | 'right';
  question: string;
  tags: Tag[];
}
interface Chair {
  name: string;
  brand: string;
  price: string;
  priceLevel: 1 | 2 | 3 | 4;
  tagline: string;
  emoji: string;
  link: string;
  features: string[];
  scores: Record<string, number>; // hotspot-id → score (0–10)
  tagBoosts: string[];            // tag ids that boost this chair
}

// ── Hotspot Config ─────────────────────────────────────────────────────────
const HOTSPOTS: Hotspot[] = [
  {
    id: 'headrest', label: 'Headrest', desc: 'Head & neck support',
    svgX: 250, svgY: 68, labelSide: 'right',
    question: 'What do you need from a headrest?',
    tags: [
      { id: 'hr_none',     label: "Don't need one",     icon: '🚫' },
      { id: 'hr_adj',      label: 'Adjustable height',  icon: '↕️' },
      { id: 'hr_memory',   label: 'Memory foam pillow', icon: '💤' },
      { id: 'hr_neck',     label: 'Neck & shoulder wrap', icon: '🫂' },
    ],
  },
  {
    id: 'back', label: 'Back Support', desc: 'Upper & mid-back',
    svgX: 143, svgY: 155, labelSide: 'left',
    question: 'How do you want your back supported?',
    tags: [
      { id: 'bk_mesh',    label: 'Breathable mesh',    icon: '💨' },
      { id: 'bk_pad',     label: 'Padded & plush',     icon: '🛋️' },
      { id: 'bk_flex',    label: 'Flexes with movement', icon: '🤸' },
      { id: 'bk_tall',    label: 'Full tall back',      icon: '📏' },
    ],
  },
  {
    id: 'lumbar', label: 'Lumbar', desc: 'Lower back support',
    svgX: 143, svgY: 240, labelSide: 'left',
    question: 'How do you prefer lumbar support?',
    tags: [
      { id: 'lb_adj',     label: 'Adjustable knob',    icon: '🎚️' },
      { id: 'lb_built',   label: 'Built-in curve',     icon: '⌒'  },
      { id: 'lb_pillow',  label: 'Add-on pillow',      icon: '🎒' },
      { id: 'lb_none',    label: 'Don\'t need it',     icon: '✌️' },
    ],
  },
  {
    id: 'armrests', label: 'Armrests', desc: 'Arm & shoulder support',
    svgX: 357, svgY: 190, labelSide: 'right',
    question: 'What kind of armrests do you need?',
    tags: [
      { id: 'ar_4d',      label: '4D fully adjustable', icon: '🎛️' },
      { id: 'ar_3d',      label: '3D adjustable',       icon: '🔧' },
      { id: 'ar_fixed',   label: 'Fixed is fine',        icon: '📌' },
      { id: 'ar_none',    label: 'No armrests',          icon: '🚫' },
    ],
  },
  {
    id: 'seat', label: 'Seat Cushion', desc: 'Cushion & depth',
    svgX: 250, svgY: 320, labelSide: 'right',
    question: 'What matters most in a seat cushion?',
    tags: [
      { id: 'st_mesh',    label: 'Mesh (stays cool)',   icon: '💨' },
      { id: 'st_foam',    label: 'Dense foam',          icon: '🧱' },
      { id: 'st_memory',  label: 'Memory foam',         icon: '☁️' },
      { id: 'st_depth',   label: 'Adjustable depth',    icon: '↔️' },
      { id: 'st_firm',    label: 'Firm & supportive',   icon: '💪' },
    ],
  },
  {
    id: 'base', label: 'Priority', desc: 'What matters most overall',
    svgX: 250, svgY: 490, labelSide: 'right',
    question: 'What\'s your biggest priority?',
    tags: [
      { id: 'pr_budget',  label: 'Best value / budget', icon: '💸' },
      { id: 'pr_ergo',    label: 'Max ergonomics',      icon: '🏆' },
      { id: 'pr_hours',   label: '8+ hours daily',      icon: '⏰' },
      { id: 'pr_style',   label: 'Looks / aesthetics',  icon: '✨' },
      { id: 'pr_game',    label: 'Gaming / streaming',  icon: '🎮' },
    ],
  },
];

// ── Chair Database ─────────────────────────────────────────────────────────
const CHAIRS: Chair[] = [
  {
    name: 'Aeron', brand: 'Herman Miller', price: '$1,395', priceLevel: 4,
    emoji: '🪑',
    tagline: 'The gold standard of ergonomic seating for serious office workers.',
    link: 'https://www.hermanmiller.com/products/seating/office-chairs/aeron-chairs/',
    features: ['8Z Pellicle mesh', 'PostureFit SL lumbar', '4D adjustable arms', 'No headrest (optional add-on)', 'Forward tilt'],
    scores: { headrest: 5, back: 10, lumbar: 10, armrests: 10, seat: 9, base: 8 },
    tagBoosts: ['bk_mesh', 'lb_adj', 'ar_4d', 'st_mesh', 'pr_ergo', 'pr_hours', 'hr_none'],
  },
  {
    name: 'Leap V2', brand: 'Steelcase', price: '$1,229', priceLevel: 4,
    emoji: '🛋️',
    tagline: 'Moves with your body. Best for people who shift positions constantly.',
    link: 'https://www.steelcase.com/products/office-chairs/leap/',
    features: ['Flexible back adapts to your spine', 'Natural glide recline', '4D arms', 'Adjustable lumbar', 'No headrest'],
    scores: { headrest: 4, back: 10, lumbar: 9, armrests: 10, seat: 9, base: 8 },
    tagBoosts: ['bk_flex', 'bk_pad', 'lb_adj', 'ar_4d', 'pr_ergo', 'pr_hours', 'st_firm', 'hr_none'],
  },
  {
    name: 'Titan Evo', brand: 'Secretlab', price: '$519', priceLevel: 3,
    emoji: '🎮',
    tagline: 'Premium gaming chair that crosses into serious productivity. Comes with memory foam neck pillow.',
    link: 'https://secretlab.co/collections/omega-series',
    features: ['Memory foam head pillow', 'Integrated adjustable lumbar', 'Cold-cure foam seat', '4D arms', 'Full recline'],
    scores: { headrest: 9, back: 7, lumbar: 8, armrests: 8, seat: 8, base: 6 },
    tagBoosts: ['hr_memory', 'hr_neck', 'lb_pillow', 'st_memory', 'ar_4d', 'pr_game', 'pr_style'],
  },
  {
    name: 'Ergonomic Chair Pro', brand: 'Branch', price: '$349', priceLevel: 2,
    emoji: '✅',
    tagline: 'The smart budget pick. Hits 90% of the Herman Miller experience at 25% of the cost.',
    link: 'https://www.branchfurniture.com/products/ergonomic-chair',
    features: ['Mesh back', 'Adjustable lumbar knob', '3D armrests', 'Seat depth adjust', 'Optional headrest'],
    scores: { headrest: 6, back: 8, lumbar: 8, armrests: 7, seat: 7, base: 9 },
    tagBoosts: ['bk_mesh', 'lb_adj', 'ar_3d', 'st_depth', 'pr_budget', 'hr_adj'],
  },
  {
    name: 'Fern', brand: 'Haworth', price: '$1,800+', priceLevel: 4,
    emoji: '🌿',
    tagline: 'Ultra-premium, frond-like flex back that mirrors your every movement.',
    link: 'https://www.haworth.com/en/products/seating/office-chairs/fern.html',
    features: ['Organic flex back', 'Self-adjusting recline', 'Adjustable arms', 'Seat depth adjust', 'Exceptional aesthetics'],
    scores: { headrest: 4, back: 10, lumbar: 9, armrests: 9, seat: 9, base: 7 },
    tagBoosts: ['bk_flex', 'bk_tall', 'pr_style', 'pr_ergo', 'pr_hours', 'hr_none'],
  },
  {
    name: 'Markus', brand: 'IKEA', price: '$229', priceLevel: 1,
    emoji: '🟡',
    tagline: "The no-drama chair. You've seen it everywhere. For good reason.",
    link: 'https://www.ikea.com/us/en/p/markus-office-chair-vissle-dark-gray/',
    features: ['Built-in headrest', 'Molded lumbar support', 'Fixed armrests', 'Foam seat', 'Simple recline'],
    scores: { headrest: 7, back: 6, lumbar: 6, armrests: 3, seat: 6, base: 10 },
    tagBoosts: ['hr_adj', 'ar_fixed', 'lb_built', 'pr_budget', 'st_foam'],
  },
  {
    name: 'Freedom', brand: 'Humanscale', price: '$1,500+', priceLevel: 4,
    emoji: '🕊️',
    tagline: 'Self-adjusting. No knobs. The chair does the thinking.',
    link: 'https://www.humanscale.com/products/seating/freedom-chair',
    features: ['Auto-adjusting recline by body weight', 'Integrated pivoting headrest', 'Self-adjusting armrests', 'Minimal controls'],
    scores: { headrest: 9, back: 9, lumbar: 8, armrests: 8, seat: 8, base: 7 },
    tagBoosts: ['hr_adj', 'hr_neck', 'bk_flex', 'lb_built', 'pr_ergo', 'pr_hours', 'pr_style'],
  },
];

// ── Recommendation Engine ──────────────────────────────────────────────────
function recommend(selections: Record<string, string[]>): Chair[] {
  const allTags = Object.values(selections).flat();
  return [...CHAIRS]
    .map(chair => {
      let score = Object.entries(selections).reduce((sum, [hotspotId, tags]) => {
        return sum + (chair.scores[hotspotId] || 0) * (tags.length > 0 ? 1 : 0.5);
      }, 0);
      // Boost for matching tags
      const boost = allTags.filter(t => chair.tagBoosts.includes(t)).length * 8;
      // Penalize high-price chairs if budget priority selected
      const budgetPenalty = allTags.includes('pr_budget') ? (chair.priceLevel - 1) * 12 : 0;
      return { chair, score: score + boost - budgetPenalty };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(r => r.chair);
}

// ── Chair SVG ──────────────────────────────────────────────────────────────
function ChairSVG({ activeId, completedIds, onHotspotClick }: {
  activeId: string | null;
  completedIds: string[];
  onHotspotClick: (id: string) => void;
}) {
  const getPartColor = (partId: string) => {
    if (activeId === partId) return '#7c3aed';
    if (completedIds.includes(partId)) return '#16a34a';
    return undefined;
  };

  const mainColor   = '#1c1c1c';
  const accentColor = '#2a2a2a';
  const meshColor   = '#262626';
  const armColor    = '#242424';

  return (
    <svg viewBox="0 0 500 560" className="w-full h-full" style={{ maxHeight: 520 }}>
      <defs>
        <pattern id="mesh" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="8" y2="8" stroke="#333" strokeWidth="0.4" />
          <line x1="8" y1="0" x2="0" y2="8" stroke="#333" strokeWidth="0.4" />
        </pattern>
        <radialGradient id="seatGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#303030" />
          <stop offset="100%" stopColor="#1a1a1a" />
        </radialGradient>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.5" />
        </filter>
        <linearGradient id="colGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#222" />
          <stop offset="40%" stopColor="#444" />
          <stop offset="100%" stopColor="#1a1a1a" />
        </linearGradient>
        <linearGradient id="armGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#333" />
          <stop offset="100%" stopColor="#1c1c1c" />
        </linearGradient>
      </defs>

      {/* ── HEADREST ─────────────────────────────────────────────── */}
      <g filter="url(#shadow)">
        <rect x="172" y="28" width="156" height="60" rx="14" ry="14"
          fill={getPartColor('headrest') ?? '#252525'}
          stroke={activeId === 'headrest' ? '#7c3aed' : completedIds.includes('headrest') ? '#16a34a' : '#3a3a3a'}
          strokeWidth={activeId === 'headrest' || completedIds.includes('headrest') ? 2.5 : 1}
          style={{ transition: 'fill 0.3s, stroke 0.3s', cursor: 'pointer' }}
          onClick={() => onHotspotClick('headrest')}
        />
        {/* Headrest texture lines */}
        <line x1="200" y1="40" x2="200" y2="78" stroke="#333" strokeWidth="1" opacity="0.5" />
        <line x1="220" y1="40" x2="220" y2="78" stroke="#333" strokeWidth="1" opacity="0.5" />
        <line x1="240" y1="40" x2="240" y2="78" stroke="#333" strokeWidth="1" opacity="0.5" />
        <line x1="260" y1="40" x2="260" y2="78" stroke="#333" strokeWidth="1" opacity="0.5" />
        <line x1="280" y1="40" x2="280" y2="78" stroke="#333" strokeWidth="1" opacity="0.5" />
        <line x1="300" y1="40" x2="300" y2="78" stroke="#333" strokeWidth="1" opacity="0.5" />
      </g>

      {/* ── CHAIR BACK ────────────────────────────────────────────── */}
      <g filter="url(#shadow)">
        {/* Main back frame */}
        <rect x="153" y="82" width="194" height="192" rx="8" ry="8"
          fill={meshColor} stroke="#333" strokeWidth="1" />
        {/* Mesh fill */}
        <rect x="157" y="86" width="186" height="184" rx="5" fill="url(#mesh)" opacity="0.9" />
        {/* Back highlight (clickable) */}
        <rect x="153" y="82" width="194" height="100" rx="8" ry="8"
          fill={getPartColor('back') ? getPartColor('back') + '33' : 'transparent'}
          stroke={activeId === 'back' ? '#7c3aed' : completedIds.includes('back') ? '#16a34a' : 'transparent'}
          strokeWidth="2" style={{ cursor: 'pointer' }} strokeDasharray="5,3"
          onClick={() => onHotspotClick('back')}
        />
        {/* Lumbar highlight */}
        <rect x="153" y="182" width="194" height="92" rx="0" ry="0"
          fill={getPartColor('lumbar') ? getPartColor('lumbar') + '33' : 'transparent'}
          stroke={activeId === 'lumbar' ? '#7c3aed' : completedIds.includes('lumbar') ? '#16a34a' : 'transparent'}
          strokeWidth="2" style={{ cursor: 'pointer' }} strokeDasharray="5,3"
          onClick={() => onHotspotClick('lumbar')}
        />
        {/* Lumbar bump */}
        <ellipse cx="250" cy="230" rx="28" ry="10" fill={accentColor} opacity="0.6" />
      </g>

      {/* ── ARMRESTS ─────────────────────────────────────────────── */}
      {/* Left armrest support */}
      <rect x="128" y="170" width="27" height="104" rx="4" fill={armColor} stroke="#2a2a2a" strokeWidth="1" />
      {/* Left armrest pad */}
      <g style={{ cursor: 'pointer' }} onClick={() => onHotspotClick('armrests')}>
        <rect x="90" y="156" width="66" height="22" rx="6"
          fill={getPartColor('armrests') ?? 'url(#armGrad)'}
          stroke={activeId === 'armrests' ? '#7c3aed' : completedIds.includes('armrests') ? '#16a34a' : '#3a3a3a'}
          strokeWidth={activeId === 'armrests' || completedIds.includes('armrests') ? 2 : 1}
          style={{ transition: 'fill 0.3s' }}
        />
      </g>
      {/* Right armrest support */}
      <rect x="345" y="170" width="27" height="104" rx="4" fill={armColor} stroke="#2a2a2a" strokeWidth="1" />
      {/* Right armrest pad */}
      <g style={{ cursor: 'pointer' }} onClick={() => onHotspotClick('armrests')}>
        <rect x="344" y="156" width="66" height="22" rx="6"
          fill={getPartColor('armrests') ?? 'url(#armGrad)'}
          stroke={activeId === 'armrests' ? '#7c3aed' : completedIds.includes('armrests') ? '#16a34a' : '#3a3a3a'}
          strokeWidth={activeId === 'armrests' || completedIds.includes('armrests') ? 2 : 1}
          style={{ transition: 'fill 0.3s' }}
        />
      </g>

      {/* ── SEAT CUSHION ─────────────────────────────────────────── */}
      <g filter="url(#shadow)" style={{ cursor: 'pointer' }} onClick={() => onHotspotClick('seat')}>
        <rect x="118" y="270" width="264" height="68" rx="14"
          fill={getPartColor('seat') ?? 'url(#seatGrad)'}
          stroke={activeId === 'seat' ? '#7c3aed' : completedIds.includes('seat') ? '#16a34a' : '#3a3a3a'}
          strokeWidth={activeId === 'seat' || completedIds.includes('seat') ? 2.5 : 1}
          style={{ transition: 'fill 0.3s' }}
        />
        {/* Seat seam lines */}
        <line x1="180" y1="280" x2="180" y2="328" stroke="#333" strokeWidth="1" opacity="0.6" />
        <line x1="250" y1="278" x2="250" y2="330" stroke="#333" strokeWidth="1" opacity="0.6" />
        <line x1="320" y1="280" x2="320" y2="328" stroke="#333" strokeWidth="1" opacity="0.6" />
        {/* Seat front edge highlight */}
        <rect x="118" y="326" width="264" height="12" rx="0" ry="14"
          fill="#222" opacity="0.4" />
      </g>

      {/* ── COLUMN + GAS CYLINDER ────────────────────────────────── */}
      <rect x="234" y="338" width="32" height="62" rx="4" fill="url(#colGrad)" />
      <rect x="238" y="400" width="24" height="48" rx="3" fill="#2a2a2a" />
      {/* Adjustment ring */}
      <rect x="232" y="390" width="36" height="12" rx="6" fill="#333" />

      {/* ── 5-STAR BASE ──────────────────────────────────────────── */}
      <g style={{ cursor: 'pointer' }} onClick={() => onHotspotClick('base')}>
        {/* Center hub */}
        <circle cx="250" cy="455" r="14"
          fill={getPartColor('base') ?? '#252525'}
          stroke={activeId === 'base' ? '#7c3aed' : completedIds.includes('base') ? '#16a34a' : '#333'}
          strokeWidth={activeId === 'base' || completedIds.includes('base') ? 2 : 1}
        />
        {/* 5 arms */}
        {[0, 72, 144, 216, 288].map((angle, i) => {
          const rad = (angle - 90) * Math.PI / 180;
          const x2 = 250 + Math.cos(rad) * 90;
          const y2 = 455 + Math.sin(rad) * 35;
          const wx = 250 + Math.cos(rad) * 92;
          const wy = 455 + Math.sin(rad) * 36;
          return (
            <g key={i}>
              <line x1="250" y1="455" x2={x2} y2={y2}
                stroke={getPartColor('base') ?? '#2a2a2a'} strokeWidth="9" strokeLinecap="round" />
              <ellipse cx={wx} cy={wy} rx="9" ry="5.5"
                fill="#1a1a1a" stroke="#333" strokeWidth="1"
                transform={`rotate(${angle}, ${wx}, ${wy})`} />
            </g>
          );
        })}
      </g>

      {/* ── HOTSPOT DOTS ─────────────────────────────────────────── */}
      {HOTSPOTS.map(h => {
        const done = completedIds.includes(h.id);
        const active = activeId === h.id;
        return (
          <g key={h.id} style={{ cursor: 'pointer' }} onClick={() => onHotspotClick(h.id)}>
            {/* Pulse ring */}
            {!done && !active && (
              <circle cx={h.svgX} cy={h.svgY} r="14" fill="none" stroke="#fff" strokeWidth="1" opacity="0.15">
                <animate attributeName="r" values="12;20;12" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;0;0.2" dur="2s" repeatCount="indefinite" />
              </circle>
            )}
            {/* Connector line to label */}
            <line
              x1={h.svgX} y1={h.svgY}
              x2={h.labelSide === 'right' ? h.svgX + 48 : h.svgX - 48} y2={h.svgY}
              stroke={active ? '#a78bfa' : done ? '#4ade80' : '#888'}
              strokeWidth="1" strokeDasharray={active ? '' : '3 2'}
            />
            {/* Label box */}
            <rect
              x={h.labelSide === 'right' ? h.svgX + 48 : h.svgX - 120}
              y={h.svgY - 13}
              width="72" height="26" rx="6"
              fill={active ? '#7c3aed' : done ? '#14532d' : '#1a1a1a'}
              stroke={active ? '#a78bfa' : done ? '#4ade80' : '#2a2a2a'}
              strokeWidth="1"
            />
            <text
              x={h.labelSide === 'right' ? h.svgX + 84 : h.svgX - 84}
              y={h.svgY + 4.5}
              textAnchor="middle"
              fontSize="9.5" fontWeight="600"
              fill={active ? '#e9d5ff' : done ? '#86efac' : '#888'}
            >
              {done ? `✓ ${h.label}` : h.label}
            </text>
            {/* Main dot */}
            <circle cx={h.svgX} cy={h.svgY} r="8"
              fill={active ? '#7c3aed' : done ? '#16a34a' : '#fff'}
              stroke={active ? '#c4b5fd' : done ? '#4ade80' : '#555'}
              strokeWidth="2"
            />
            {done && (
              <text x={h.svgX} y={h.svgY + 4} textAnchor="middle" fontSize="9" fill="#fff">✓</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ── Question Panel ─────────────────────────────────────────────────────────
function QuestionPanel({ hotspot, selected, onToggle, onNext, onPrev, isFirst, isLast }: {
  hotspot: Hotspot;
  selected: string[];
  onToggle: (id: string) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <div className="text-[10px] text-purple-400 uppercase tracking-widest font-bold mb-1">{hotspot.desc}</div>
        <h2 className="text-lg font-bold text-white leading-tight">{hotspot.question}</h2>
        <p className="text-xs text-[#555] mt-1">Select all that apply</p>
      </div>

      <div className="flex-1 space-y-2">
        {hotspot.tags.map(tag => {
          const active = selected.includes(tag.id);
          return (
            <button key={tag.id} onClick={() => onToggle(tag.id)}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                active
                  ? 'bg-purple-500/15 border-purple-500/40 text-white'
                  : 'bg-[#0f0f0f] border-[#222] text-[#888] hover:text-white hover:border-[#333]'
              }`}>
              <span className="text-xl">{tag.icon}</span>
              <span className="text-sm font-medium flex-1">{tag.label}</span>
              {active && (
                <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                  <Check size={11} className="text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex gap-2 mt-5">
        {!isFirst && (
          <button onClick={onPrev}
            className="flex items-center gap-1 px-4 py-2.5 bg-[#111] border border-[#222] text-[#888] hover:text-white rounded-xl text-sm transition-colors">
            <ChevronLeft size={14} /> Back
          </button>
        )}
        <button onClick={onNext} disabled={selected.length === 0}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            selected.length > 0
              ? 'bg-purple-600 hover:bg-purple-500 text-white'
              : 'bg-[#111] border border-[#222] text-[#444] cursor-not-allowed'
          }`}>
          {isLast ? 'Find My Chair 🪑' : 'Next'}
          {!isLast && <ChevronRight size={14} />}
        </button>
      </div>
    </div>
  );
}

// ── Price Dots ─────────────────────────────────────────────────────────────
function PriceDots({ level }: { level: 1 | 2 | 3 | 4 }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className={`w-2 h-2 rounded-full ${i <= level ? 'bg-green-400' : 'bg-[#2a2a2a]'}`} />
      ))}
    </div>
  );
}

// ── Results ────────────────────────────────────────────────────────────────
function Results({ chairs, onReset }: { chairs: Chair[]; onReset: () => void }) {
  return (
    <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
      <div className="mb-1">
        <h2 className="text-lg font-bold text-white">Your top matches</h2>
        <p className="text-xs text-[#555]">Based on your preferences across all 6 zones</p>
      </div>

      {chairs.map((chair, i) => (
        <div key={chair.name}
          className={`rounded-2xl border p-4 transition-all ${
            i === 0
              ? 'bg-purple-500/8 border-purple-500/30'
              : 'bg-[#0f0f0f] border-[#1a1a1a]'
          }`}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">{chair.emoji}</span>
              <div>
                {i === 0 && (
                  <div className="text-[9px] text-purple-400 font-bold uppercase tracking-widest mb-0.5">Best Match</div>
                )}
                <div className="text-sm font-bold text-white">{chair.brand} {chair.name}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-green-400">{chair.price}</div>
              <PriceDots level={chair.priceLevel} />
            </div>
          </div>

          <p className="text-xs text-[#777] mb-3 leading-relaxed">{chair.tagline}</p>

          <div className="flex flex-wrap gap-1 mb-3">
            {chair.features.map(f => (
              <span key={f} className="text-[10px] px-2 py-0.5 rounded-full bg-[#1a1a1a] border border-[#222] text-[#666]">{f}</span>
            ))}
          </div>

          <a href={chair.link} target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors">
            View chair <ExternalLink size={11} />
          </a>
        </div>
      ))}

      <button onClick={onReset}
        className="flex items-center justify-center gap-2 py-3 bg-[#111] border border-[#222] text-[#555] hover:text-white rounded-xl text-sm transition-colors mt-1">
        <RotateCcw size={13} /> Start over
      </button>

      <div className="text-[10px] text-[#2a2a2a] text-center pb-2">
        Built with OpenClaw · Chair recommendations not sponsored (we just vibed with the data)
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function ChairFinderPage() {
  const [activeHotspot,  setActiveHotspot]  = useState<string | null>(null);
  const [selections,     setSelections]     = useState<Record<string, string[]>>({});
  const [completedIds,   setCompletedIds]   = useState<string[]>([]);
  const [showResults,    setShowResults]    = useState(false);
  const [recommendations, setRecommendations] = useState<Chair[]>([]);

  const progress = completedIds.length / HOTSPOTS.length;
  const activeIdx = activeHotspot ? HOTSPOTS.findIndex(h => h.id === activeHotspot) : -1;
  const activeH = activeIdx >= 0 ? HOTSPOTS[activeIdx] : null;

  const toggleTag = (hotspotId: string, tagId: string) => {
    setSelections(prev => {
      const cur = prev[hotspotId] ?? [];
      return {
        ...prev,
        [hotspotId]: cur.includes(tagId) ? cur.filter(t => t !== tagId) : [...cur, tagId],
      };
    });
  };

  const handleNext = () => {
    if (!activeHotspot) return;
    if (!completedIds.includes(activeHotspot)) {
      setCompletedIds(prev => [...prev, activeHotspot]);
    }
    const nextIdx = activeIdx + 1;
    if (nextIdx < HOTSPOTS.length) {
      setActiveHotspot(HOTSPOTS[nextIdx].id);
    } else {
      // Done — generate recommendations
      const recs = recommend(selections);
      setRecommendations(recs);
      setShowResults(true);
      setActiveHotspot(null);
    }
  };

  const handlePrev = () => {
    if (activeIdx > 0) setActiveHotspot(HOTSPOTS[activeIdx - 1].id);
  };

  const reset = () => {
    setActiveHotspot(null);
    setSelections({});
    setCompletedIds([]);
    setShowResults(false);
    setRecommendations([]);
  };

  const handleHotspotClick = (id: string) => {
    if (showResults) return;
    setActiveHotspot(id);
  };

  return (
    <div className="flex flex-col h-full bg-[#080808]">
      {/* ── Top Bar ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-[#111]">
        <div>
          <h1 className="text-sm font-bold text-white flex items-center gap-2">
            🪑 Chair Finder
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/20 font-medium">AI-Powered</span>
          </h1>
          <p className="text-[10px] text-[#444]">Click each hotspot to share your preferences</p>
        </div>
        <div className="flex-1 mx-6">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-[#555]">{completedIds.length}/{HOTSPOTS.length} zones configured</span>
            {showResults && <span className="text-[10px] text-green-400 font-semibold">✓ Complete</span>}
          </div>
          <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${progress * 100}%` }} />
          </div>
        </div>
        <button onClick={reset} className="text-[10px] text-[#444] hover:text-white transition-colors flex items-center gap-1">
          <RotateCcw size={11} /> Reset
        </button>
      </div>

      {/* ── Body ────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Chair Visual */}
        <div className={`flex items-center justify-center p-6 transition-all duration-500 ${
          activeHotspot || showResults ? 'w-[55%]' : 'w-full'
        }`}
          style={{ background: 'radial-gradient(ellipse at 50% 40%, #141414 0%, #0a0a0a 100%)' }}>

          {/* Intro text when nothing selected */}
          {!activeHotspot && !showResults && (
            <div className="absolute top-24 left-1/2 -translate-x-1/2 text-center z-10">
              <p className="text-xs text-[#444] animate-pulse">Tap a hotspot to begin</p>
            </div>
          )}

          <div className="w-full max-w-xs">
            <ChairSVG
              activeId={activeHotspot}
              completedIds={completedIds}
              onHotspotClick={handleHotspotClick}
            />
          </div>
        </div>

        {/* Side Panel */}
        {(activeHotspot || showResults) && (
          <div className="flex-1 border-l border-[#111] p-5 overflow-y-auto flex flex-col"
            style={{ background: '#0c0c0c' }}>
            {showResults ? (
              <Results chairs={recommendations} onReset={reset} />
            ) : activeH ? (
              <QuestionPanel
                hotspot={activeH}
                selected={selections[activeH.id] ?? []}
                onToggle={tagId => toggleTag(activeH.id, tagId)}
                onNext={handleNext}
                onPrev={handlePrev}
                isFirst={activeIdx === 0}
                isLast={activeIdx === HOTSPOTS.length - 1}
              />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
