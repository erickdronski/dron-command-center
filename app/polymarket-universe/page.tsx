'use client';

import dynamic from 'next/dynamic';

const PolymarketUniverse = dynamic(
  () => import('./PolymarketUniverse'),
  {
    ssr: false,
    loading: () => (
      <div style={{
        width: '100vw', height: '100vh', background: '#020B18',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#00FFB0', fontFamily: 'monospace', fontSize: 18,
      }}>
        ⬡ Initializing Polymarket Universe…
      </div>
    ),
  }
);

export default function Page() {
  return <PolymarketUniverse />;
}
