import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const STATE_FILE = path.join(process.cwd(), 'ml_data', 'kalshi_shared_state.json');

interface TradeLogEntry {
  ts: string;
  bot: string;
  ticker: string;
  side: string;
  cost_c: number;
  order_id: string;
}

interface BotState {
  daily_budget_cents: number;
  daily_spent_cents: number;
  trades_today: number;
  last_trade: string | null;
  last_trade_ticker: string | null;
}

interface SharedState {
  date: string;
  daily_limit_cents: number;
  total_spent_cents: number;
  bots: {
    price_farmer: BotState;
    weather_trader: BotState;
  };
  trade_log: TradeLogEntry[];
  last_updated: string | null;
}

// Classify ticker as weather vs crypto
function isWeather(ticker: string): boolean {
  return /^KXHIGH|^KXLOWT|^KXRAIN|^KXCITIES|^KXSNOW|^KXGLOBAL/.test(ticker);
}

function describeWeatherTicker(ticker: string): string {
  if (ticker.startsWith('KXHIGH')) return 'Daily High Temp';
  if (ticker.startsWith('KXLOWT')) return 'Daily Low Temp';
  if (ticker.startsWith('KXRAIN')) return 'Monthly Rain';
  if (ticker.startsWith('KXSNOW') || ticker.startsWith('KXSLCSNOW') || ticker.startsWith('KXLAXSNOW')) return 'Monthly Snow';
  if (ticker.startsWith('KXCITIES')) return 'Multi-City Combo';
  return 'Weather';
}

export async function GET() {
  try {
    if (!fs.existsSync(STATE_FILE)) {
      return NextResponse.json({ ok: false, error: 'No trading state found — bot may not have run yet today' });
    }

    const raw = fs.readFileSync(STATE_FILE, 'utf-8');
    const state: SharedState = JSON.parse(raw);

    const wt = state.bots.weather_trader;
    const pf = state.bots.price_farmer;

    // Split trade log by bot
    const weatherTrades = state.trade_log.filter(t => t.bot === 'weather_trader');
    const farmTrades    = state.trade_log.filter(t => t.bot === 'price_farmer');

    // Budget math
    const wtBudgetPct  = wt.daily_budget_cents > 0 ? Math.round((wt.daily_spent_cents  / wt.daily_budget_cents)  * 100) : 0;
    const pfBudgetPct  = pf.daily_budget_cents > 0 ? Math.round((pf.daily_spent_cents  / pf.daily_budget_cents)  * 100) : 0;
    const totBudgetPct = state.daily_limit_cents > 0 ? Math.round((state.total_spent_cents / state.daily_limit_cents) * 100) : 0;

    return NextResponse.json({
      ok: true,
      date: state.date,
      lastUpdated: state.last_updated,

      budget: {
        totalLimitCents:  state.daily_limit_cents,
        totalSpentCents:  state.total_spent_cents,
        totalRemainingCents: Math.max(0, state.daily_limit_cents - state.total_spent_cents),
        totalPct: totBudgetPct,
      },

      weatherTrader: {
        tradesDay:      wt.trades_today,
        spentCents:     wt.daily_spent_cents,
        budgetCents:    wt.daily_budget_cents,
        budgetPct:      wtBudgetPct,
        lastTrade:      wt.last_trade,
        lastTicker:     wt.last_trade_ticker,
        trades: weatherTrades.map(t => ({
          ts:      t.ts,
          ticker:  t.ticker,
          type:    describeWeatherTicker(t.ticker),
          side:    t.side.toUpperCase(),
          costUsd: +(t.cost_c / 100).toFixed(2),
          orderId: t.order_id,
        })),
      },

      priceFarmer: {
        tradesDay:   pf.trades_today,
        spentCents:  pf.daily_spent_cents,
        budgetCents: pf.daily_budget_cents,
        budgetPct:   pfBudgetPct,
        lastTrade:   pf.last_trade,
        lastTicker:  pf.last_trade_ticker,
        trades: farmTrades.map(t => ({
          ts:      t.ts,
          ticker:  t.ticker,
          side:    t.side.toUpperCase(),
          costUsd: +(t.cost_c / 100).toFixed(2),
          orderId: t.order_id,
        })),
      },
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
