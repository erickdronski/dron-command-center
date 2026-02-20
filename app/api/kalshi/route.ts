import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

const API_KEY_ID = process.env.KALSHI_API_KEY ?? '69d03bf0-4a89-414d-8ecf-d6fe4cfdf183';
const BASE_URL   = 'https://api.elections.kalshi.com';

const PRIVATE_KEY_PEM = process.env.KALSHI_PRIVATE_KEY ?? `-----BEGIN RSA PRIVATE KEY-----
MIIEpQIBAAKCAQEAqJAo0ChmUgSZ5HfMR348/jcqVuqSOjWtiBDK6c6SrRizI8I6
CH1znReZIexJSE1ioanQEBmCbEkcBApRnVxbF++LE7M+Gk6Z+6nidscyu1yrHrOk
1AQF7i/2wz8u1PhDuNETULSi7gn4OEr01D/DTWxnmxPR4TT2jqHMNOr9TusLH+x7
lLkRhNFKhWa2eWGrihU0VudDOvr188q4s+bonh4u4mu1gmfOP1V9E4N92Rx3mXJ+
033Uh7/2qwlIYSifz+aC4fTUlo2zSS/TTk2N3SIajIiybfzdWUAfv0U8ZNZmZHre
PTQ8OMTb6j3/8krRTKGVY4cwTcLAdJ+ZwExh3QIDAQABAoIBABY4luDGCqMSTzVC
o6/jEOhUXmUB3FAHJn6y9AT5gfWGtYrnvl3DJ/wUEdBahVieNvvn1nFg44Qh6SsR
Lywm8i1IG1X4AZ5XMU5vWVbeMK5pa3eLKBX5B80cDpQznpldtxPEoB66CWaG8u18
2CSo2Ta6LThQ1xCwujYYV0K8nbMK62driGKepsjtcQh3qPsDwvnCoan/hmm06kBp
VhaDIRu5O/qWMcrJv0sET9h33Mx/PkHmk4n+IzPViUV+RQuRMolFIgy2gKMcz2CF
UncttMUGjG3YPG/9/KEcwxjqlU3RZwzSP0Ou3u446tTEKv5wuklHDgVrTdaocg0K
3DWmcNMCgYEA1/ROaxPNr6jXnL0BU4AzcOpNUKpRlxnVwhprd8VD75CYkkogSuzd
DF5m5br1XKofapWHR/TV87GeFSfbJM7znbU0JU88ulCtpc756GNDBp5x9J5utxca
mHvVuVnOMCkHdTi4VLheqDDZ6cDggrdRmJHmSg4VhFL4/+IlhXiL1RsCgYEAx9Ie
KqJIhDMdSDWRJ1XJQq7nibHaep+aKJ+8jEY8OPyfNQnlYmgKu5L7z5Px71U9xeGJ
W82cziAGne/w3DV39Qmu7wIhp2dUn2bmX2nq3mYLPHuSSqBIbyzvPvOlS7jB8+Al
kAZofLGINnTWFL89xFonKIhTg6cKn7Ycd2HLLGcCgYEAk2shBROVu64k0chsWVYQ
x6oKcWBzJhTqyQBEEJTHFYi9vk9/z+X11/WxhG2mBUXVAGtm2AYY76x2X7a/cFce
ErCaEkYPDJj6kU/DZZItNR2AaR6mMbJB44nVkhvuFw5LGwhHPP5HD8WZXGrgWBtQ
RjiC3lbS9Wu2subr+jsaKbUCgYEAvQJUhJFitKHA1ffNaH6t1ASrgMSZ25mycTC/
YZRiDKlwUvQcZNvzIwBibjQMCg4AU3gFvK+d3h/PAn/evf1ZjY/uR6glezqzgeAM
kz4V6u5tPHXKqAo62eaQG2TN+vU1iOCBx104YpJvPMuBYLiQzXVVSvLAxGwyEWZq
QMZhL4sCgYEAm5EguHwDzEg/Hpalhq7U2hA13hDc6IPiXVN9saelwj4EaY9cFMwW
CbE+OXBiEW0rpVGN40AGKhlk+UOe5y1W5YHAQF2gTXuiq6MF5LijjsyhXrFc+wrm
HJwDVluWYFju91JKgvgEBIon99IKvqqcvbIndnAhC0l/sHENkGf6HAk=
-----END RSA PRIVATE KEY-----`;

// Weather market ticker prefixes
const WEATHER_PREFIXES = ['KXHIGHT', 'KXLOWT', 'KXCITIES', 'KXSLCSNOW', 'KXLAXSNOW', 'KXRAIN', 'KXGLOBAL'];

function signRequest(method: string, path: string, timestampMs: number): string {
  const msgStr = `${timestampMs}${method.toUpperCase()}${path}`;
  const sig = crypto.sign(
    'sha256',
    Buffer.from(msgStr),
    { key: PRIVATE_KEY_PEM, padding: crypto.constants.RSA_PKCS1_PSS_PADDING, saltLength: 32 }
  );
  return sig.toString('base64');
}

async function kalshiFetch(path: string) {
  const ts = Date.now();
  const sig = signRequest('GET', path, ts);
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'KALSHI-ACCESS-KEY': API_KEY_ID,
      'KALSHI-ACCESS-SIGNATURE': sig,
      'KALSHI-ACCESS-TIMESTAMP': String(ts),
      'Content-Type': 'application/json',
    },
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Kalshi ${path} → ${res.status}`);
  return res.json();
}

function isWeatherMarket(ticker: string): boolean {
  return WEATHER_PREFIXES.some(p => ticker.startsWith(p));
}

export async function GET() {
  try {
    const [balanceData, positionsData, fillsData] = await Promise.allSettled([
      kalshiFetch('/trade-api/v2/portfolio/balance'),
      kalshiFetch('/trade-api/v2/portfolio/positions?limit=100'),
      kalshiFetch('/trade-api/v2/portfolio/fills?limit=50'),
    ]);

    // Balance
    const balance: number = balanceData.status === 'fulfilled'
      ? (balanceData.value?.balance ?? 0) / 100  // Kalshi returns cents
      : 0;

    // All positions — filter to weather
    const allPositions = positionsData.status === 'fulfilled'
      ? (positionsData.value?.market_positions ?? [])
      : [];
    const weatherPositions = allPositions.filter((p: {ticker_name?: string}) =>
      isWeatherMarket(p.ticker_name ?? '')
    );
    const totalPositions = allPositions.length;

    // Recent fills — filter to weather
    const allFills = fillsData.status === 'fulfilled'
      ? (fillsData.value?.fills ?? [])
      : [];
    const weatherFills = allFills.filter((f: {ticker?: string}) =>
      isWeatherMarket(f.ticker ?? '')
    );

    // Compute weather P&L from fills
    let weatherPnl = 0;
    let weatherWins = 0;
    let weatherLosses = 0;
    for (const fill of weatherFills) {
      const cost = ((fill.count ?? 0) * (fill.yes_price ?? fill.no_price ?? 0)) / 100;
      weatherPnl += fill.is_taker ? -cost : cost; // rough approximation
      if (fill.side === 'yes' && (fill.yes_price ?? 0) > 50) weatherWins++;
      else weatherLosses++;
    }

    // Cities being monitored (from v3 script)
    const monitoredCities = ['ATL', 'AUS', 'BOS', 'CHI', 'DAL', 'DC', 'DEN', 'HOU', 'LA', 'LV', 'MIA', 'MIN', 'NYC', 'PHX', 'SEA', 'SFO'];
    const marketsScanned = 438; // from v3 dry run

    // Weather position breakdown by city
    const cityCounts: Record<string, number> = {};
    for (const pos of weatherPositions) {
      const ticker: string = pos.ticker_name ?? '';
      for (const city of monitoredCities) {
        if (ticker.includes(city)) {
          cityCounts[city] = (cityCounts[city] ?? 0) + 1;
        }
      }
    }

    const winRate = weatherFills.length > 0
      ? Math.round((weatherWins / weatherFills.length) * 100)
      : null;

    return NextResponse.json({
      ok: true,
      balance,
      totalPositions,
      weather: {
        openPositions: weatherPositions.length,
        recentFills: weatherFills.length,
        pnlApprox: Math.round(weatherPnl * 100) / 100,
        winRate,
        marketsScanned,
        monitoredCities: monitoredCities.length,
        cityCounts,
        strategy: 'NOAA forecast vs Kalshi daily high/low temp buckets',
        thresholds: { entry: 15, exit: 70, maxPositionCents: 300 },
        lastPositions: weatherPositions.slice(0, 5).map((p: {
          ticker_name?: string;
          position?: number;
          market_exposure?: number;
          realized_pnl?: number;
        }) => ({
          ticker: p.ticker_name,
          contracts: p.position,
          exposure: (p.market_exposure ?? 0) / 100,
          realizedPnl: (p.realized_pnl ?? 0) / 100,
        })),
      },
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
