#!/usr/bin/env python3
"""
Kalshi Price Farmer v1
======================

Port of Polymarket FastLoop v16 Price Farmer → Kalshi.

Strategy: buy the convergence side (80¢+) on short-term crypto price markets
within the last N minutes before close.

Kalshi markets:
  KXBTC15M  — BTC price up in next 15 mins?
  KXETH15M  — ETH price up in next 15 mins?
  KXSOL15M  — SOL price up in next 15 mins?
  KXXRP15M  — XRP price up in next 15 mins?

Prices are in cents (1–99). Contracts pay $1 (100¢) on YES.
Order API uses yes_price / no_price in cents, count = number of contracts.
"""

import argparse
import base64
import datetime
import json
import os
import sys
import uuid
import time
import requests
from typing import Optional
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding

# Shared state coordination with Weather Trader
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from kalshi_shared_state import KalshiState
_state = KalshiState()
BOT_NAME = "price_farmer"

# ─── Config ──────────────────────────────────────────────────────────────────

API_KEY_ID = os.environ.get("KALSHI_API_KEY",  "69d03bf0-4a89-414d-8ecf-d6fe4cfdf183")
BASE_URL   = os.environ.get("KALSHI_BASE_URL", "https://api.elections.kalshi.com")

PRIVATE_KEY_PEM = os.environ.get("KALSHI_PRIVATE_KEY", """-----BEGIN RSA PRIVATE KEY-----
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
-----END RSA PRIVATE KEY-----""")

# Strategy params — tune these as you learn the market
MIN_CONVERGENCE   = 80    # cents — buy side when it's at 80¢+ (same as 0.80 on Polymarket)
MAX_PRICE         = 99    # skip if >= 99¢ (no sellers, illiquid)
MIN_MINUTES_UNTIL = 0.0   # catch everything up to expiry
MAX_MINUTES_UNTIL = 5.0   # last 5 minutes (convergence window)
POSITION_SIZE_USD = 5.0   # dollars per trade
MAX_TRADES        = 6     # cap per run

# 15-min crypto series to scan
CRYPTO_15M_SERIES = ["KXBTC15M", "KXETH15M", "KXSOL15M", "KXXRP15M"]

# Trade log path (relative to script dir)
_script_dir = os.path.dirname(os.path.abspath(__file__))
LOG_FILE = os.path.join(_script_dir, "../ml_data/kalshi_price_farmer_trades.json")

# ─── Auth ────────────────────────────────────────────────────────────────────

_pk = None

def get_key():
    global _pk
    if _pk is None:
        pem = PRIVATE_KEY_PEM.strip()
        data = open(pem, "rb").read() if os.path.isfile(pem) else pem.encode()
        _pk = serialization.load_pem_private_key(data, password=None, backend=default_backend())
    return _pk

def _auth_headers(method: str, path: str) -> dict:
    ts  = str(int(datetime.datetime.now().timestamp() * 1000))
    msg = f"{ts}{method}{path.split('?')[0]}".encode()
    sig = get_key().sign(
        msg,
        padding.PSS(mgf=padding.MGF1(hashes.SHA256()), salt_length=padding.PSS.DIGEST_LENGTH),
        hashes.SHA256(),
    )
    return {
        "KALSHI-ACCESS-KEY":       API_KEY_ID,
        "KALSHI-ACCESS-TIMESTAMP": ts,
        "KALSHI-ACCESS-SIGNATURE": base64.b64encode(sig).decode(),
        "Content-Type":            "application/json",
    }

def kget(path: str, params: dict = None) -> requests.Response:
    full = path + ("?" + "&".join(f"{k}={v}" for k, v in params.items()) if params else "")
    return requests.get(BASE_URL + full, headers=_auth_headers("GET", path), timeout=15)

def kpost(path: str, data: dict) -> requests.Response:
    return requests.post(BASE_URL + path, headers=_auth_headers("POST", path), json=data, timeout=15)


# ─── Market scan ─────────────────────────────────────────────────────────────

def scan_opportunities() -> list[dict]:
    """
    Scan all 15-min crypto series for markets priced 80-99¢ resolving within
    MAX_MINUTES_UNTIL. Returns list of candidate dicts, sorted by edge desc.
    """
    candidates = []
    now = datetime.datetime.now(datetime.timezone.utc)

    for series in CRYPTO_15M_SERIES:
        try:
            r = kget("/trade-api/v2/markets", {"series_ticker": series, "status": "open", "limit": "10"})
            if not r.ok:
                continue
            markets = r.json().get("markets", [])
        except Exception as e:
            print(f"  ⚠️ {series} fetch error: {e}")
            continue

        for m in markets:
            ticker    = m.get("ticker", "")
            title     = m.get("title", "")
            yes_ask   = m.get("yes_ask", 99)
            no_ask    = m.get("no_ask", 99)
            close_iso = m.get("close_time", "")

            if not close_iso:
                continue

            try:
                close_dt    = datetime.datetime.fromisoformat(close_iso.replace("Z", "+00:00"))
                minutes_left = (close_dt - now).total_seconds() / 60
            except Exception:
                continue

            if minutes_left < MIN_MINUTES_UNTIL or minutes_left > MAX_MINUTES_UNTIL:
                continue

            # Find the high side (convergence price = max of YES ask, NO ask)
            # YES at 85 → crowd says 85% chance of UP → buy YES
            # NO at 85  → crowd says 85% chance of DOWN → buy NO
            if yes_ask >= MIN_CONVERGENCE and yes_ask <= MAX_PRICE:
                side  = "yes"
                price = yes_ask
                edge  = 100 - yes_ask
            elif no_ask >= MIN_CONVERGENCE and no_ask <= MAX_PRICE:
                side  = "no"
                price = no_ask
                edge  = 100 - no_ask
            else:
                continue

            candidates.append({
                "ticker":       ticker,
                "series":       series,
                "title":        title,
                "side":         side,
                "price":        price,    # cents
                "edge":         edge,     # cents
                "minutes_left": minutes_left,
            })

    candidates.sort(key=lambda x: x["edge"], reverse=False)  # lowest edge = highest price = most convergence
    return candidates


# ─── Sizing ──────────────────────────────────────────────────────────────────

def smart_size(balance_cents: int, price_cents: int) -> int:
    """
    How many contracts to buy?
    Each contract costs price_cents and pays 100¢ on win.
    Target POSITION_SIZE_USD worth at current price.
    """
    target_cents = int(POSITION_SIZE_USD * 100)
    contracts    = max(1, target_cents // max(price_cents, 1))
    # Safety cap: never spend more than 20% of balance in one trade
    max_contracts = max(1, int(balance_cents * 0.20) // max(price_cents, 1))
    return min(contracts, max_contracts)


# ─── Order ───────────────────────────────────────────────────────────────────

def place_order(ticker: str, side: str, count: int, price_cents: int, live: bool) -> dict:
    if not live:
        return {"dry_run": True, "ticker": ticker, "side": side, "count": count, "price": price_cents}

    data = {
        "ticker":          ticker,
        "action":          "buy",
        "side":            side,
        "count":           count,
        "type":            "limit",
        "client_order_id": str(uuid.uuid4()),
    }
    if side == "yes":
        data["yes_price"] = price_cents
    else:
        data["no_price"] = price_cents

    r = kpost("/trade-api/v2/portfolio/orders", data)
    if r.ok:
        return r.json().get("order", {})
    else:
        return {"error": r.status_code, "detail": r.text[:300]}


# ─── Logging ─────────────────────────────────────────────────────────────────

def log_trade(candidate: dict, count: int, cost_cents: int, order_id: str, dry_run: bool):
    os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)
    trades = []
    if os.path.exists(LOG_FILE):
        try:
            with open(LOG_FILE) as f:
                trades = json.load(f)
        except Exception:
            trades = []

    trades.append({
        "timestamp":    datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "dry_run":      dry_run,
        "ticker":       candidate["ticker"],
        "series":       candidate["series"],
        "title":        candidate["title"],
        "side":         candidate["side"],
        "price_cents":  candidate["price"],
        "edge_cents":   candidate["edge"],
        "count":        count,
        "cost_cents":   cost_cents,
        "cost_usd":     round(cost_cents / 100, 2),
        "minutes_left": round(candidate["minutes_left"], 2),
        "order_id":     order_id,
    })

    with open(LOG_FILE, "w") as f:
        json.dump(trades[-500:], f, indent=2)


# ─── Main ────────────────────────────────────────────────────────────────────

def run(live: bool, quiet: bool, max_trades: int):
    ts = datetime.datetime.now().strftime("%Y-%m-%d %H:%M ET")
    if not quiet:
        print(f"🎯 Kalshi Price Farmer v1  [{ts}]")
        print("=" * 60)
        print(f"Mode: {'🔴 LIVE' if live else '🟡 DRY-RUN'}  |  "
              f"Entry ≥{MIN_CONVERGENCE}¢  |  Window ≤{MAX_MINUTES_UNTIL}m  |  "
              f"Position ${POSITION_SIZE_USD}")

    # Balance
    try:
        bal = kget("/trade-api/v2/portfolio/balance").json()
        balance_cents = bal.get("balance", 0)
        portfolio_cents = bal.get("portfolio_value", 0)
    except Exception as e:
        print(f"❌ Balance fetch failed: {e}")
        return

    if not quiet:
        print(f"💰 Balance: ${balance_cents/100:.2f} | Portfolio: ${portfolio_cents/100:.2f}\n")

    if not quiet:
        print(f"🔍 Scanning {len(CRYPTO_15M_SERIES)} series: {', '.join(CRYPTO_15M_SERIES)}")

    candidates = scan_opportunities()

    if not candidates:
        if not quiet:
            print("⏸️  No convergence opportunities right now.")
        return {"trades": 0, "opps": 0, "balance": balance_cents}

    print(f"\n🚨 {len(candidates)} OPPORTUNITY/IES FOUND!\n")
    for i, c in enumerate(candidates, 1):
        print(f"  {i}. {c['ticker']} | {c['side'].upper()} @ {c['price']}¢ | "
              f"edge={c['edge']}¢ | {c['minutes_left']:.1f}m left")
        print(f"     {c['title']}")

    trades_done = 0
    results = []

    for c in candidates:
        if trades_done >= max_trades:
            print(f"\n⛔ Max trades ({max_trades}) reached.")
            break

        count     = smart_size(balance_cents, c["price"])
        cost_c    = count * c["price"]

        if cost_c > balance_cents and live:
            print(f"  🛡️  {c['ticker']} | Insufficient balance (${balance_cents/100:.2f})")
            continue

        # Shared budget check — coordinate with Weather Trader
        ok, reason = _state.can_trade(BOT_NAME, cost_c)
        if not ok and live:
            print(f"  🤝 {c['ticker']} | Budget gate: {reason}")
            continue

        print(f"\n  💰 {c['ticker']} | BUY {count}x {c['side'].upper()} @ {c['price']}¢ "
              f"= ${cost_c/100:.2f} | edge {c['edge']}¢")

        order = place_order(c["ticker"], c["side"], count, c["price"], live)

        if order.get("dry_run"):
            print(f"  [DRY-RUN] would place order")
            log_trade(c, count, cost_c, "dry-run", dry_run=True)
            trades_done += 1
        elif order.get("error"):
            print(f"  ❌ Error {order['error']}: {order.get('detail','')[:100]}")
        else:
            oid = order.get("order_id", "?")
            status = order.get("status", "?")
            print(f"  ✅ {status} | order_id={oid}")
            log_trade(c, count, cost_c, oid, dry_run=False)
            _state.record_trade(BOT_NAME, cost_c, c["ticker"], c["side"], oid, dry_run=False)
            balance_cents -= cost_c
            trades_done   += 1
            results.append({"ticker": c["ticker"], "side": c["side"],
                             "count": count, "price": c["price"], "order_id": oid})

        time.sleep(0.5)

    print(f"\n{'='*60}")
    print(f"📊 {len(candidates)} opps | {trades_done} trades {'executed' if live else '(dry-run)'} | "
          f"Balance: ${balance_cents/100:.2f}")
    print(_state.summary_line())
    if results:
        print("🎯 Trades:")
        for r in results:
            print(f"   BUY {r['count']}x {r['ticker']} {r['side'].upper()} @ {r['price']}¢  →  {r['order_id']}")

    return {"trades": trades_done, "opps": len(candidates),
            "balance": balance_cents, "results": results}


def show_positions():
    r = kget("/trade-api/v2/portfolio/positions")
    if not r.ok:
        print(f"Error: {r.status_code} {r.text[:200]}")
        return
    active = [p for p in r.json().get("market_positions", [])
              if p.get("position", 0) != 0]
    print(f"\n📋 Open Positions ({len(active)}):")
    for p in sorted(active, key=lambda x: x["ticker"]):
        print(f"  {p['ticker']}: pos={p['position']} | "
              f"exposure=${p.get('market_exposure_dollars','?')} | "
              f"pnl=${p.get('realized_pnl_dollars','?')}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Kalshi Price Farmer v1")
    parser.add_argument("--live",      action="store_true", help="Execute real trades")
    parser.add_argument("--quiet",     action="store_true", help="Minimal output")
    parser.add_argument("--positions", action="store_true", help="Show open positions")
    parser.add_argument("--max-trades", type=int, default=MAX_TRADES)
    args = parser.parse_args()

    if args.positions:
        show_positions()
    else:
        run(live=args.live, quiet=args.quiet, max_trades=args.max_trades)
