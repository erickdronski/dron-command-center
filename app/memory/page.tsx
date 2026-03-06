'use client';

import { useEffect, useRef, useState } from 'react';

/* ── Knowledge Nodes ── */
type KnowledgeNode = {
  id: string;
  label: string;
  category: 'person' | 'company' | 'skill' | 'project' | 'tool' | 'market' | 'lesson' | 'team';
  connections: string[];
  detail?: string;
};

const nodes: KnowledgeNode[] = [
  // Core
  { id: 'erick', label: 'Erick Dronski', category: 'person', connections: ['ivanti', 'value-eng', 'precision-algo', 'linkedin', 'tiktok', 'rowan', 'kalshi'], detail: 'CEO Precision Algorithms • Value Engineer at Ivanti • MBA Data Analytics' },
  
  // Company & Role
  { id: 'ivanti', label: 'Ivanti', category: 'company', connections: ['erick', 'value-eng', 'itsm', 'uem', 'security', 'service-mapping', 'matt'], detail: 'Enterprise IT management, security & service management • $1B+ ARR' },
  { id: 'value-eng', label: 'Value Engineering', category: 'skill', connections: ['erick', 'ivanti', 'roi', 'c-and-m', 'prompt-toolkit', 'benefit-stories', 'matt', 'neal', 'chad', 'diane', 'omar'], detail: 'ROI hypothesis, C&M workshops, benefit frameworks' },
  { id: 'precision-algo', label: 'Precision Algorithms', category: 'company', connections: ['erick', 'tiktok', 'linkedin', 'x-bot'], detail: 'CEO — content, trading, automation' },

  // Team
  { id: 'matt', label: 'Matt Gacek', category: 'team', connections: ['value-eng', 'ivanti'], detail: 'VE Manager' },
  { id: 'neal', label: 'Neal Edrich', category: 'team', connections: ['value-eng'], detail: 'Value Engineer' },
  { id: 'chad', label: 'Chad Arjoon', category: 'team', connections: ['value-eng'], detail: 'Value Engineer' },
  { id: 'diane', label: 'Diane Holden', category: 'team', connections: ['value-eng'], detail: 'Value Engineer' },
  { id: 'omar', label: 'Omar Shabka', category: 'team', connections: ['value-eng'], detail: 'Value Engineer' },

  // Products & Frameworks
  { id: 'itsm', label: 'Neurons for ITSM', category: 'tool', connections: ['ivanti', 'roi', 'hybrid-benefits', 'service-mapping'], detail: 'Core ITSM platform — Incident, Problem, Change, CMDB, KB, SLA' },
  { id: 'uem', label: 'UEM / DEX', category: 'tool', connections: ['ivanti'], detail: 'Unified Endpoint Management, Digital Employee Experience' },
  { id: 'security', label: 'Security Suite', category: 'tool', connections: ['ivanti'], detail: 'ZSO, Patch Mgmt, MTD, RBVM, EASM, ZTA' },
  { id: 'service-mapping', label: 'Service Mapping', category: 'tool', connections: ['ivanti', 'itsm', 'hybrid-benefits'], detail: 'Auto-discover data center dependencies, visual service maps' },

  // Projects
  { id: 'roi', label: 'Value Cloud / ROI', category: 'project', connections: ['value-eng', 'itsm', 'benefit-stories', 'hybrid-benefits', 'glasgow'], detail: 'ROI calculator and business case hypothesis tool' },
  { id: 'c-and-m', label: 'C&M Assessment', category: 'project', connections: ['value-eng', 'conair'], detail: '36 IT capabilities across 4 pillars — maturity workshops' },
  { id: 'prompt-toolkit', label: 'Prompt Toolkit', category: 'project', connections: ['value-eng'], detail: '6-prompt sales knowledge chain' },
  { id: 'benefit-stories', label: 'Benefit Stories', category: 'project', connections: ['roi', 'value-eng'], detail: '168 stories across 21 benefits × 8 verticals' },
  { id: 'hybrid-benefits', label: 'Hybrid Benefits', category: 'project', connections: ['roi', 'itsm', 'service-mapping'], detail: '5 hybrid ITSM + 5 SM benefits with factor fusion' },
  { id: 'x-bot', label: 'Precision X Bot', category: 'project', connections: ['precision-algo', 'linkedin'], detail: 'Twitter engagement engine — 10 runs/day, 200+ replies' },

  // Customers
  { id: 'glasgow', label: 'Univ. of Glasgow', category: 'market', connections: ['roi', 'itsm'], detail: '£503K/yr financial + 5,735 hrs saved • 400 analyst seats' },
  { id: 'conair', label: 'Conair', category: 'market', connections: ['c-and-m'], detail: 'Full C&M workshop — 7 priority capabilities identified' },
  { id: 'ihg', label: 'IHG Hotels', category: 'market', connections: ['ivanti'], detail: '87K devices, $11.8M benefits, 239% ROI' },

  // Social & Education
  { id: 'linkedin', label: 'LinkedIn', category: 'skill', connections: ['erick', 'precision-algo'], detail: '18K followers • 3x Top Voice' },
  { id: 'tiktok', label: 'TikTok', category: 'skill', connections: ['erick', 'precision-algo'], detail: '50K+ followers' },
  { id: 'rowan', label: 'Rowan University', category: 'company', connections: ['erick'], detail: 'MBA Data Analytics' },

  // Trading
  { id: 'kalshi', label: 'Kalshi / Trading', category: 'market', connections: ['erick'], detail: 'Prediction markets, crypto trading experiments' },

  // Lessons
  { id: 'lesson-conservative', label: 'Conservative ROI', category: 'lesson', connections: ['roi', 'hybrid-benefits'], detail: 'Use 10-20% improvement rates, not 50-80%. Real costs > theoretical revenue.' },
  { id: 'lesson-verify', label: 'Verify Execution', category: 'lesson', connections: ['kalshi'], detail: 'Always check API responses. Never assume success. The bot that lied about trades.' },
];

const categoryColors: Record<string, { fill: string; stroke: string; text: string; glow: string }> = {
  person:  { fill: '#7c3aed', stroke: '#a78bfa', text: '#e9d5ff', glow: 'rgba(124,58,237,0.4)' },
  company: { fill: '#0891b2', stroke: '#22d3ee', text: '#cffafe', glow: 'rgba(8,145,178,0.4)' },
  skill:   { fill: '#d97706', stroke: '#fbbf24', text: '#fef3c7', glow: 'rgba(217,119,6,0.4)' },
  project: { fill: '#059669', stroke: '#34d399', text: '#d1fae5', glow: 'rgba(5,150,105,0.4)' },
  tool:    { fill: '#dc2626', stroke: '#f87171', text: '#fecaca', glow: 'rgba(220,38,38,0.4)' },
  market:  { fill: '#2563eb', stroke: '#60a5fa', text: '#dbeafe', glow: 'rgba(37,99,235,0.4)' },
  lesson:  { fill: '#ca8a04', stroke: '#facc15', text: '#fef9c3', glow: 'rgba(202,138,4,0.3)' },
  team:    { fill: '#7c3aed', stroke: '#c084fc', text: '#f3e8ff', glow: 'rgba(124,58,237,0.3)' },
};

/* ── Neural Net Canvas ── */
export default function MemoryPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredNode, setHoveredNode] = useState<KnowledgeNode | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const positionsRef = useRef<Map<string, { x: number; y: number; vx: number; vy: number; baseAngle: number; baseRadius: number }>>(new Map());
  const timeRef = useRef(0);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize positions in a spiral
    const cx = canvas.offsetWidth / 2;
    const cy = canvas.offsetHeight / 2;
    
    nodes.forEach((node, i) => {
      if (positionsRef.current.has(node.id)) return;
      const angle = (i / nodes.length) * Math.PI * 2 + (Math.random() * 0.5);
      const isCore = node.id === 'erick';
      const radius = isCore ? 0 : 80 + Math.random() * 200 + (node.connections.length > 3 ? -40 : 40);
      positionsRef.current.set(node.id, {
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        vx: 0, vy: 0,
        baseAngle: angle,
        baseRadius: radius,
      });
    });

    const animate = () => {
      timeRef.current += 0.003;
      const t = timeRef.current;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      ctx.clearRect(0, 0, w, h);

      // Gentle orbital drift
      nodes.forEach((node) => {
        const pos = positionsRef.current.get(node.id)!;
        const drift = node.id === 'erick' ? 0.001 : 0.002;
        pos.baseAngle += drift;
        const wobbleX = Math.sin(t * 2 + pos.baseAngle * 3) * 3;
        const wobbleY = Math.cos(t * 1.5 + pos.baseAngle * 2) * 3;
        const targetX = cx + Math.cos(pos.baseAngle) * pos.baseRadius + wobbleX;
        const targetY = cy + Math.sin(pos.baseAngle) * pos.baseRadius + wobbleY;
        pos.x += (targetX - pos.x) * 0.02;
        pos.y += (targetY - pos.y) * 0.02;
      });

      // Draw connections
      nodes.forEach((node) => {
        const pos = positionsRef.current.get(node.id)!;
        node.connections.forEach((connId) => {
          const connPos = positionsRef.current.get(connId);
          if (!connPos) return;
          const pulse = Math.sin(t * 3 + pos.baseAngle) * 0.3 + 0.7;
          ctx.beginPath();
          ctx.moveTo(pos.x, pos.y);
          ctx.lineTo(connPos.x, connPos.y);
          ctx.strokeStyle = `rgba(124, 58, 237, ${0.08 * pulse})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();

          // Traveling particle
          const particleT = (t * 0.5 + pos.baseAngle) % 1;
          const px = pos.x + (connPos.x - pos.x) * particleT;
          const py = pos.y + (connPos.y - pos.y) * particleT;
          ctx.beginPath();
          ctx.arc(px, py, 1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(167, 139, 250, ${0.3 * pulse})`;
          ctx.fill();
        });
      });

      // Draw nodes
      nodes.forEach((node) => {
        const pos = positionsRef.current.get(node.id)!;
        const colors = categoryColors[node.category];
        const isCore = node.id === 'erick';
        const size = isCore ? 28 : node.connections.length > 3 ? 18 : 12;
        const breathe = Math.sin(t * 2 + pos.baseAngle) * 2;

        // Glow
        const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, size + 15 + breathe);
        gradient.addColorStop(0, colors.glow);
        gradient.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, size + 15 + breathe, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Node circle
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, size + breathe * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = colors.fill;
        ctx.fill();
        ctx.strokeStyle = colors.stroke;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Label
        ctx.font = isCore ? 'bold 11px system-ui' : `${node.connections.length > 3 ? '9' : '8'}px system-ui`;
        ctx.textAlign = 'center';
        ctx.fillStyle = colors.text;
        ctx.fillText(node.label, pos.x, pos.y + size + 14 + breathe * 0.5);
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  // Mouse hover detection
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    setMousePos({ x: e.clientX, y: e.clientY });

    let found: KnowledgeNode | null = null;
    for (const node of nodes) {
      const pos = positionsRef.current.get(node.id);
      if (!pos) continue;
      const dx = mx - pos.x;
      const dy = my - pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const size = node.id === 'erick' ? 35 : node.connections.length > 3 ? 25 : 18;
      if (dist < size) { found = node; break; }
    }
    setHoveredNode(found);
  };

  const categoryLabels: Record<string, string> = {
    person: '👤 Person', company: '🏢 Company', skill: '⚡ Skill', project: '📁 Project',
    tool: '🔧 Tool', market: '📊 Market', lesson: '💡 Lesson', team: '👥 Team',
  };

  return (
    <div className="relative w-full h-screen bg-[#050510] overflow-hidden">
      {/* Header overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 p-6 pointer-events-none">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white/90 flex items-center gap-2">
              🧠 Knowledge Base
            </h1>
            <p className="text-xs text-white/30 mt-0.5">{nodes.length} nodes • {nodes.reduce((s, n) => s + n.connections.length, 0) / 2} connections • Neural memory map</p>
          </div>
          <div className="flex items-center gap-3">
            {Object.entries(categoryColors).map(([cat, colors]) => (
              <div key={cat} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.fill }} />
                <span className="text-[9px] text-white/40">{cat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredNode(null)}
      />

      {/* Tooltip */}
      {hoveredNode && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{ left: mousePos.x + 15, top: mousePos.y - 10 }}
        >
          <div className="bg-[#111] border border-[#333] rounded-lg p-3 shadow-2xl max-w-xs">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: categoryColors[hoveredNode.category].fill }} />
              <span className="text-xs font-bold text-white">{hoveredNode.label}</span>
              <span className="text-[9px] text-[#666]">{categoryLabels[hoveredNode.category]}</span>
            </div>
            {hoveredNode.detail && (
              <p className="text-[10px] text-[#999] leading-relaxed">{hoveredNode.detail}</p>
            )}
            <div className="text-[9px] text-[#555] mt-1">{hoveredNode.connections.length} connections</div>
          </div>
        </div>
      )}

      {/* Bottom stats */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-6 pointer-events-none">
        <div className="flex items-center gap-6">
          <div className="bg-[#111]/80 backdrop-blur border border-[#222] rounded-lg px-4 py-2">
            <div className="text-[9px] text-[#555]">Core Identity</div>
            <div className="text-xs text-white font-medium">Erick Dronski</div>
          </div>
          <div className="bg-[#111]/80 backdrop-blur border border-[#222] rounded-lg px-4 py-2">
            <div className="text-[9px] text-[#555]">Primary Role</div>
            <div className="text-xs text-white font-medium">Value Engineer @ Ivanti</div>
          </div>
          <div className="bg-[#111]/80 backdrop-blur border border-[#222] rounded-lg px-4 py-2">
            <div className="text-[9px] text-[#555]">Social Reach</div>
            <div className="text-xs text-white font-medium">68K+ combined</div>
          </div>
          <div className="bg-[#111]/80 backdrop-blur border border-[#222] rounded-lg px-4 py-2">
            <div className="text-[9px] text-[#555]">Active Projects</div>
            <div className="text-xs text-white font-medium">{nodes.filter(n => n.category === 'project').length} tracked</div>
          </div>
        </div>
      </div>
    </div>
  );
}
