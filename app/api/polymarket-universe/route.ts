import { NextResponse } from 'next/server';

export const revalidate = 60; // Cache for 60 seconds

interface RawMarket {
  question: string;
  slug: string;
  outcomePrices: string | string[];
  volume24hr?: number;
  liquidity?: number;
  endDateIso?: string;
  active?: boolean;
  closed?: boolean;
}

function parseJSON(val: unknown): unknown {
  if (typeof val === 'string') {
    try { return JSON.parse(val); } catch { return val; }
  }
  return val;
}

function daysTill(iso: string | undefined): number | null {
  if (!iso) return null;
  const end = new Date(iso.slice(0, 10) + 'T00:00:00Z');
  const diff = (end.getTime() - Date.now()) / 86400000;
  return diff > 0 ? diff : 0;
}

export async function GET() {
  try {
    const res = await fetch(
      'https://gamma-api.polymarket.com/markets?active=true&closed=false&limit=200&_sort=volume24hr&_order=desc',
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error(`Gamma API ${res.status}`);
    const raw: RawMarket[] = await res.json();

    const markets = raw
      .filter(m => {
        const op = parseJSON(m.outcomePrices) as string[];
        return Array.isArray(op) && op.length === 2;
      })
      .map(m => {
        const op = parseJSON(m.outcomePrices) as string[];
        const yes = parseFloat(op[0]) || 0;
        const no  = parseFloat(op[1]) || 0;
        const vol = m.volume24hr || 0;
        const liq = m.liquidity  || 0;
        const days = daysTill(m.endDateIso);

        // Edge score: deviation of YES+NO from 1.0, clamped 0–1
        const priceSumDev = Math.abs((yes + no) - 1.0);
        // Lottery ticket score: how cheap is the cheaper side?
        const minPrice = Math.min(yes, no);
        const lotteryScore = minPrice < 0.03 && vol > 500 ? (0.03 - minPrice) / 0.03 : 0;
        const edgeScore = Math.min(1.0, priceSumDev * 5 + lotteryScore * 0.5);

        return {
          question: m.question,
          slug: m.slug,
          yes,
          no,
          vol24h: vol,
          liquidity: liq,
          days,
          edgeScore,
          isLottery: minPrice < 0.03 && vol > 500,
        };
      });

    return NextResponse.json({ markets, fetchedAt: new Date().toISOString() });
  } catch (e) {
    return NextResponse.json({ error: String(e), markets: [] }, { status: 500 });
  }
}
