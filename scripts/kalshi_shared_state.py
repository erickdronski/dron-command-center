#!/usr/bin/env python3
"""
Kalshi Shared State — coordination layer for all Kalshi bots.

Ensures the Price Farmer and Weather Trader share a $20 balance fairly,
reset daily, and never over-spend the account.

Budget split (configurable via KALSHI_DAILY_LIMIT env var):
  Total daily cap : $18.00  (keep $2 as reserve)
  Price Farmer    :  $9.00  (high-frequency, 15-min crypto)
  Weather Trader  :  $9.00  (strategic, daily/monthly weather)

Usage:
  from kalshi_shared_state import KalshiState

  state = KalshiState()
  remaining = state.remaining("price_farmer")   # cents
  if remaining >= cost:
      # place trade ...
      state.record_trade("price_farmer", cost_cents, ticker, side, order_id)
"""

import fcntl
import json
import os
import datetime
from typing import Optional

_script_dir  = os.path.dirname(os.path.abspath(__file__))
STATE_FILE   = os.path.join(_script_dir, "../ml_data/kalshi_shared_state.json")

# Daily budget config (cents)
DAILY_LIMIT_CENTS       = int(os.environ.get("KALSHI_DAILY_LIMIT",  "1800"))  # $18 total
PRICE_FARMER_BUDGET     = int(os.environ.get("KALSHI_PF_BUDGET",    "900"))   # $9
WEATHER_TRADER_BUDGET   = int(os.environ.get("KALSHI_WT_BUDGET",    "900"))   # $9

BOTS = ["price_farmer", "weather_trader"]


def _today() -> str:
    return datetime.date.today().isoformat()


def _empty_day() -> dict:
    return {
        "date":              _today(),
        "daily_limit_cents": DAILY_LIMIT_CENTS,
        "total_spent_cents": 0,
        "bots": {
            "price_farmer": {
                "daily_budget_cents": PRICE_FARMER_BUDGET,
                "daily_spent_cents":  0,
                "trades_today":       0,
                "last_trade":         None,
                "last_trade_ticker":  None,
            },
            "weather_trader": {
                "daily_budget_cents": WEATHER_TRADER_BUDGET,
                "daily_spent_cents":  0,
                "trades_today":       0,
                "last_trade":         None,
                "last_trade_ticker":  None,
            },
        },
        "trade_log":    [],   # last 100 trades today
        "last_updated": None,
    }


class KalshiState:
    def __init__(self):
        os.makedirs(os.path.dirname(STATE_FILE), exist_ok=True)

    def _load(self) -> dict:
        if not os.path.exists(STATE_FILE):
            return _empty_day()
        try:
            with open(STATE_FILE) as f:
                data = json.load(f)
            # Auto-reset at midnight
            if data.get("date") != _today():
                return _empty_day()
            return data
        except Exception:
            return _empty_day()

    def _save(self, data: dict):
        data["last_updated"] = datetime.datetime.utcnow().isoformat() + "Z"
        tmp = STATE_FILE + ".tmp"
        with open(tmp, "w") as f:
            json.dump(data, f, indent=2)
        os.replace(tmp, STATE_FILE)  # atomic

    def _locked_read_write(self, fn):
        """Read-modify-write with file lock to avoid races between bots."""
        lock_path = STATE_FILE + ".lock"
        with open(lock_path, "w") as lock:
            try:
                fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
                data = self._load()
                result = fn(data)
                self._save(data)
                return result
            except BlockingIOError:
                # Another bot holds the lock — wait briefly and retry
                import time
                time.sleep(0.3)
                fcntl.flock(lock, fcntl.LOCK_EX)
                data = self._load()
                result = fn(data)
                self._save(data)
                return result
            finally:
                fcntl.flock(lock, fcntl.LOCK_UN)

    # ── Public API ────────────────────────────────────────────────────────

    def status(self) -> dict:
        """Return current state snapshot (read-only)."""
        return self._load()

    def remaining(self, bot: str) -> int:
        """
        How many cents can this bot still spend today?
        Returns min of (bot's own remaining budget, remaining total daily cap).
        """
        data = self._load()
        bdata = data["bots"].get(bot, {})
        bot_remaining   = bdata.get("daily_budget_cents", 0) - bdata.get("daily_spent_cents", 0)
        total_remaining = data["daily_limit_cents"] - data["total_spent_today_cents"]
        return max(0, min(bot_remaining, total_remaining))

    def can_trade(self, bot: str, cost_cents: int) -> tuple[bool, str]:
        """
        Check if a bot can place a trade of this cost.
        Returns (ok, reason).
        """
        data = self._load()
        bdata = data["bots"].get(bot, {})
        budget   = bdata.get("daily_budget_cents", 0)
        spent    = bdata.get("daily_spent_cents", 0)
        tot_cap  = data["daily_limit_cents"]
        tot_spent = data["total_spent_today_cents"]

        if cost_cents > (budget - spent):
            return False, (f"{bot} daily budget exhausted "
                           f"(${spent/100:.2f}/${budget/100:.2f} spent)")
        if cost_cents > (tot_cap - tot_spent):
            return False, (f"Total daily cap reached "
                           f"(${tot_spent/100:.2f}/${tot_cap/100:.2f} spent)")
        return True, "ok"

    def record_trade(self, bot: str, cost_cents: int,
                     ticker: str, side: str, order_id: str,
                     dry_run: bool = False):
        """Record a completed trade and update budget tracking."""
        if dry_run:
            return  # don't count dry-runs against budget

        def _update(data):
            bdata = data["bots"].setdefault(bot, {
                "daily_budget_cents": PRICE_FARMER_BUDGET if bot == "price_farmer" else WEATHER_TRADER_BUDGET,
                "daily_spent_cents": 0, "trades_today": 0,
                "last_trade": None, "last_trade_ticker": None,
            })
            bdata["daily_spent_cents"]  += cost_cents
            bdata["trades_today"]        += 1
            bdata["last_trade"]          = datetime.datetime.utcnow().isoformat() + "Z"
            bdata["last_trade_ticker"]   = ticker
            data["total_spent_today_cents"] += cost_cents

            entry = {
                "ts":       bdata["last_trade"],
                "bot":      bot,
                "ticker":   ticker,
                "side":     side,
                "cost_c":   cost_cents,
                "order_id": order_id,
            }
            data.setdefault("trade_log", []).append(entry)
            data["trade_log"] = data["trade_log"][-100:]

        self._locked_read_write(_update)

    def summary_line(self) -> str:
        """One-line summary for logs/Discord."""
        data = self._load()
        pf = data["bots"].get("price_farmer", {})
        wt = data["bots"].get("weather_trader", {})
        tot = data["total_spent_today_cents"]
        cap = data["daily_limit_cents"]
        return (
            f"💰 Kalshi daily: ${tot/100:.2f}/${cap/100:.2f} spent | "
            f"PriceFarmer: ${pf.get('daily_spent_cents',0)/100:.2f}/${pf.get('daily_budget_cents',PRICE_FARMER_BUDGET)/100:.2f} "
            f"({pf.get('trades_today',0)} trades) | "
            f"WeatherTrader: ${wt.get('daily_spent_cents',0)/100:.2f}/${wt.get('daily_budget_cents',WEATHER_TRADER_BUDGET)/100:.2f} "
            f"({wt.get('trades_today',0)} trades)"
        )


# CLI: python3 kalshi_shared_state.py
if __name__ == "__main__":
    import sys
    s = KalshiState()
    if len(sys.argv) > 1 and sys.argv[1] == "reset":
        import os
        if os.path.exists(STATE_FILE):
            os.remove(STATE_FILE)
        print("State reset.")
    else:
        import json as _json
        print(_json.dumps(s.status(), indent=2))
        print()
        print(s.summary_line())
