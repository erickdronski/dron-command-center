'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

interface Market {
  question: string;
  slug: string;
  yes: number;
  no: number;
  vol24h: number;
  liquidity: number;
  days: number | null;
  edgeScore: number;
  isLottery: boolean;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  market: Market | null;
}

const AMBIENT_COUNT = 8000;
const SPREAD = 80;

export default function PolymarketUniverse() {
  const mountRef   = useRef<HTMLDivElement>(null);
  const sceneRef   = useRef<THREE.Scene | null>(null);
  const cameraRef  = useRef<THREE.PerspectiveCamera | null>(null);
  const rendRef    = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef   = useRef<number>(0);
  const marketsRef = useRef<Market[]>([]);
  const clockRef   = useRef(new THREE.Clock());
  const mouseRef   = useRef(new THREE.Vector2(-999, -999));
  const raycasterRef = useRef(new THREE.Raycaster());

  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, market: null });
  const [stats, setStats] = useState({ total: 0, edges: 0, lotteries: 0, fetchedAt: '' });
  const [loading, setLoading] = useState(true);

  const buildAmbientParticles = (scene: THREE.Scene) => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(AMBIENT_COUNT * 3);
    const col = new Float32Array(AMBIENT_COUNT * 3);
    for (let i = 0; i < AMBIENT_COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * SPREAD * 3;
      pos[i * 3 + 1] = (Math.random() - 0.5) * SPREAD * 3;
      pos[i * 3 + 2] = (Math.random() - 0.5) * SPREAD * 3;
      const hue = 0.55 + Math.random() * 0.2;
      const c = new THREE.Color().setHSL(hue, 0.6, 0.15 + Math.random() * 0.1);
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const mat = new THREE.PointsMaterial({ size: 0.3, vertexColors: true, transparent: true, opacity: 0.4 });
    scene.add(new THREE.Points(geo, mat));
  };

  const buildMarketParticles = (scene: THREE.Scene, markets: Market[]) => {
    // Remove old market particles group
    const old = scene.getObjectByName('marketGroup');
    if (old) scene.remove(old);

    const group = new THREE.Group();
    group.name = 'marketGroup';

    const geo = new THREE.BufferGeometry();
    const n   = markets.length;
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    const siz = new Float32Array(n);

    markets.forEach((m, i) => {
      // Position mapping:
      // X = probability spread (yes - 0.5) * SPREAD  → leftward = cheap/NO, rightward = expensive/YES
      // Y = log volume — vertical axis = market liquidity
      // Z = days to resolution — depth = time
      const x = (m.yes - 0.5) * SPREAD;
      const y = Math.log10(Math.max(m.vol24h, 1)) * 6 - 25;
      const z = m.days != null ? -Math.min(m.days, 365) / 365 * SPREAD + SPREAD / 2 : 0;
      pos[i * 3] = x + (Math.random() - 0.5) * 3;
      pos[i * 3 + 1] = y + (Math.random() - 0.5) * 2;
      pos[i * 3 + 2] = z + (Math.random() - 0.5) * 3;

      // Color:
      // Lottery tickets: warm gold → hot orange
      // High edge arb:   bright teal
      // Normal:          cool blue
      let hue: number, sat: number, lit: number;
      if (m.isLottery) {
        hue = 0.08 + m.edgeScore * 0.05;  // gold → orange
        sat = 1.0;
        lit = 0.5 + m.edgeScore * 0.3;
      } else if (m.edgeScore > 0.3) {
        hue = 0.5;  // teal for real arb
        sat = 1.0;
        lit = 0.4 + m.edgeScore * 0.4;
      } else {
        hue = 0.62 + m.yes * 0.1;  // cool blue
        sat = 0.5;
        lit = 0.2 + m.yes * 0.2;
      }

      const c = new THREE.Color().setHSL(hue, sat, lit);
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;

      // Size: proportional to sqrt(volume)
      siz[i] = Math.max(1.5, Math.min(8, Math.sqrt(m.vol24h) / 50));
    });

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(siz, 1));

    const mat = new THREE.PointsMaterial({
      size: 3,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geo, mat);
    points.name = 'markets';
    group.add(points);

    // Add glow rings for high-edge markets
    markets.forEach((m, i) => {
      if (m.edgeScore < 0.2) return;
      const ringGeo = new THREE.RingGeometry(siz[i] * 0.4, siz[i] * 0.6, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: m.isLottery ? 0xFFAA00 : 0x00FFB0,
        transparent: true,
        opacity: m.edgeScore * 0.6,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(
        pos[i * 3],
        pos[i * 3 + 1],
        pos[i * 3 + 2]
      );
      ring.userData = { marketIndex: i };
      group.add(ring);
    });

    scene.add(group);
    marketsRef.current = markets;

    // Store positions for raycasting
    geo.userData = { positions: pos, markets };
  };

  const fetchAndRender = useCallback(async () => {
    try {
      const r = await fetch('/api/polymarket-universe');
      const d = await r.json();
      if (!d.markets?.length) return;

      if (sceneRef.current) {
        buildMarketParticles(sceneRef.current, d.markets);
      }

      const edges = d.markets.filter((m: Market) => m.edgeScore > 0.2).length;
      const lotteries = d.markets.filter((m: Market) => m.isLottery).length;
      setStats({ total: d.markets.length, edges, lotteries, fetchedAt: d.fetchedAt });
      setLoading(false);
    } catch (e) {
      console.error('fetch failed', e);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;
    const el = mountRef.current;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020B18);
    scene.fog = new THREE.Fog(0x020B18, 100, 280);
    sceneRef.current = scene;

    // Camera
    const cam = new THREE.PerspectiveCamera(60, el.clientWidth / el.clientHeight, 0.1, 500);
    cam.position.set(0, 10, 120);
    cameraRef.current = cam;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);
    rendRef.current = renderer;

    buildAmbientParticles(scene);

    // Axis labels (subtle grid lines)
    const addLine = (from: THREE.Vector3, to: THREE.Vector3, color: number) => {
      const geo = new THREE.BufferGeometry().setFromPoints([from, to]);
      const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.15 });
      scene.add(new THREE.Line(geo, mat));
    };
    addLine(new THREE.Vector3(-SPREAD / 2, 0, 0), new THREE.Vector3(SPREAD / 2, 0, 0), 0x00FFB0);
    addLine(new THREE.Vector3(0, -30, 0), new THREE.Vector3(0, 30, 0), 0x00FFB0);

    // Auto-rotate variables
    let azimuth = 0;
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let elevation = 0.2;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => { isDragging = false; };
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        azimuth  -= (e.clientX - prevMouse.x) * 0.005;
        elevation = Math.max(-1, Math.min(1, elevation - (e.clientY - prevMouse.y) * 0.003));
        prevMouse = { x: e.clientX, y: e.clientY };
      }
      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
    };
    const onWheel = (e: WheelEvent) => {
      cam.position.z = Math.max(20, Math.min(200, cam.position.z + e.deltaY * 0.05));
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('wheel', onWheel);

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const t = clockRef.current.getElapsedTime();

      if (!isDragging) azimuth += 0.0008;

      const radius = cam.position.z;
      cam.position.x = Math.sin(azimuth) * radius * Math.cos(elevation);
      cam.position.y = Math.sin(elevation) * radius;
      cam.position.z = Math.cos(azimuth) * radius * Math.cos(elevation);
      cam.lookAt(0, 0, 0);

      // Pulse glow rings
      scene.traverse(obj => {
        if (obj instanceof THREE.Mesh && obj.userData.marketIndex !== undefined) {
          const mat = obj.material as THREE.MeshBasicMaterial;
          mat.opacity = 0.2 + 0.3 * Math.abs(Math.sin(t * 1.5 + obj.userData.marketIndex * 0.1));
          obj.rotation.z = t * 0.3 + obj.userData.marketIndex * 0.05;
        }
      });

      // Raycasting for tooltip
      raycasterRef.current.setFromCamera(mouseRef.current, cam);
      const group = scene.getObjectByName('marketGroup');
      if (group) {
        const pts = group.getObjectByName('markets') as THREE.Points | null;
        if (pts) {
          raycasterRef.current.params.Points!.threshold = 3;
          const hits = raycasterRef.current.intersectObject(pts);
          if (hits.length > 0) {
            const idx = hits[0].index!;
            const mkt = marketsRef.current[idx];
            const screenPos = hits[0].point.clone().project(cam);
            setTooltip({
              visible: true,
              x: (screenPos.x + 1) / 2 * el.clientWidth,
              y: (-screenPos.y + 1) / 2 * el.clientHeight,
              market: mkt,
            });
          } else {
            setTooltip(prev => prev.visible ? { ...prev, visible: false } : prev);
          }
        }
      }

      renderer.render(scene, cam);
    };
    animate();

    const onResize = () => {
      cam.aspect = el.clientWidth / el.clientHeight;
      cam.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // Fetch data
    fetchAndRender();
    const interval = setInterval(fetchAndRender, 60000);

    return () => {
      cancelAnimationFrame(frameRef.current);
      clearInterval(interval);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [fetchAndRender]);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative', background: '#020B18', overflow: 'hidden', fontFamily: 'monospace' }}>
      {/* Three.js canvas mount */}
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* HUD - top left */}
      <div style={{
        position: 'absolute', top: 16, left: 16,
        color: '#00FFB0', fontSize: 12, lineHeight: '1.8',
        background: 'rgba(0,0,0,0.5)', padding: '12px 16px', borderRadius: 8,
        border: '1px solid rgba(0,255,176,0.2)',
      }}>
        <div style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 6 }}>⬡ Polymarket Universe</div>
        {loading ? (
          <div style={{ color: '#888' }}>Loading live markets…</div>
        ) : (
          <>
            <div>📊 Markets: <b>{stats.total}</b></div>
            <div>⚖️ Edge opps: <b style={{ color: '#00FFB0' }}>{stats.edges}</b></div>
            <div>🎰 Lottery tickets: <b style={{ color: '#FFAA00' }}>{stats.lotteries}</b></div>
            <div style={{ color: '#555', marginTop: 4, fontSize: 10 }}>
              Updated {stats.fetchedAt ? new Date(stats.fetchedAt).toLocaleTimeString() : '—'}
            </div>
          </>
        )}
      </div>

      {/* Legend - bottom left */}
      <div style={{
        position: 'absolute', bottom: 16, left: 16,
        color: '#888', fontSize: 11, lineHeight: '1.8',
        background: 'rgba(0,0,0,0.5)', padding: '10px 14px', borderRadius: 8,
      }}>
        <div><span style={{ color: '#FFAA00' }}>■</span> Lottery ticket (&lt;3¢) — asymmetric payoff</div>
        <div><span style={{ color: '#00FFB0' }}>■</span> Price arb edge — YES+NO ≠ $1</div>
        <div><span style={{ color: '#4466BB' }}>■</span> Normal market</div>
        <div style={{ marginTop: 4 }}>X = probability | Y = volume | Z = time</div>
        <div>Drag to rotate · Scroll to zoom</div>
      </div>

      {/* Tooltip */}
      {tooltip.visible && tooltip.market && (
        <div style={{
          position: 'absolute',
          left: Math.min(tooltip.x + 12, (mountRef.current?.clientWidth ?? 800) - 280),
          top:  Math.min(tooltip.y - 10, (mountRef.current?.clientHeight ?? 600) - 140),
          background: 'rgba(2,11,24,0.92)',
          border: `1px solid ${tooltip.market.isLottery ? '#FFAA00' : '#00FFB0'}`,
          color: '#fff', fontSize: 12, borderRadius: 8, padding: '10px 14px',
          maxWidth: 260, pointerEvents: 'none',
          boxShadow: `0 0 20px ${tooltip.market.isLottery ? 'rgba(255,170,0,0.3)' : 'rgba(0,255,176,0.3)'}`,
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: 6, fontSize: 13, lineHeight: 1.3 }}>
            {tooltip.market.question.slice(0, 80)}{tooltip.market.question.length > 80 ? '…' : ''}
          </div>
          <div>YES: <b style={{ color: '#00FFB0' }}>{(tooltip.market.yes * 100).toFixed(1)}¢</b>
           {' '}NO: <b>{(tooltip.market.no * 100).toFixed(1)}¢</b></div>
          <div>Vol 24h: <b>${tooltip.market.vol24h.toLocaleString()}</b></div>
          {tooltip.market.days != null && <div>Expires: <b>{tooltip.market.days.toFixed(0)}d</b></div>}
          <div>Edge score: <b style={{ color: tooltip.market.edgeScore > 0.2 ? '#FFAA00' : '#888' }}>
            {(tooltip.market.edgeScore * 100).toFixed(0)}%</b></div>
          <div style={{ marginTop: 6, fontSize: 10, color: '#555' }}>
            polymarket.com/event/{tooltip.market.slug}
          </div>
        </div>
      )}
    </div>
  );
}
