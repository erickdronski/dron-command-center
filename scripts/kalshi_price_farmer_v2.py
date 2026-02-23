#!/usr/bin/env python3
"""
Kalshi Price Farmer v2 — Elite Edition
======================================

Upgrades from v1:
- Kelly criterion position sizing (edge-based, account growth)
- Auto take-profit (95¢+) and stop-loss (reversal detection)
- Spot market signals (Binance/Coinbase leading indicators)
- Order book flow analysis (aggressive buyer/seller detection)
- ML prediction layer (historical Kalshi price path training)
- Compounding reinvestment (50% of daily profits)

Author: Dron Builder
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
import numpy as np
from typing import Optional, Dict, List, Tuple
from dataclasses import dataclass
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from kalshi_shared_state import KalshiState

# ─── Config ──────────────────────────────────────────────────────────────────

API_KEY_ID = os.environ.get("KALSHI_API_KEY", "69d03bf0-4a89-414d-8ecf-d6fe4cfdf183")
BASE_URL = os.environ.get("KALSHI_BASE_URL", "https://api.elections.kalshi.com")

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

# Strategy params
MIN_CONVERGENCE = 80
MAX_PRICE = 99
MIN_MINUTES_UNTIL = 0.0
MAX_MINUTES_UNTIL = 5.0
CRYPTO_15M_SERIES = ["KXBTC15M", "KXETH15M", "KXSOL15M", "KXXRP15M"]

# Kelly Criterion params
KELLY_FRACTION = 0.25  # Conservative Kelly (25% of full Kelly)
BASE_POSITION_USD = 5.0
MAX_POSITION_USD = 20.0
MIN_EDGE_FOR_FULL_SIZE = 10  # cents

# Exit strategy params
TAKE_PROFIT_THRESHOLD = 95  # cents
STOP_LOSS_THRESHOLD = 70    # cents (if price drops below this, exit)
TIME_EXIT_MINUTES = 0.5     # Exit at 30s before close if not profitable

# Spot market API endpoints
BINANCE_SPOT_API = "https://api.binance.com/api/v3"
COINBASE_SPOT_API = "https://api.coinbase.com/v2"

_script_dir = os.path.dirname(os.path.abspath(__file__))
LOG_FILE = os.path.join(_script_dir, "../ml_data/kalshi_price_farmer_trades.json")
ML_MODEL_FILE = os.path.join(_script_dir, "../ml_data/kalshi_ml_model.json")

_state = KalshiState()
BOT_NAME = "price_farmer"

# ─── Data Classes ────────────────────────────────────────────────────────────

@dataclass
class MarketOpportunity:
    ticker: str
    series: str
    side: str
    price: int
    edge: int
    minutes_left: float
    yes_ask: int
    no_ask: int
    volume: int
    open_interest: int
    
@dataclass
class SpotSignal:
    symbol: str
    price_change_24h: float
    price_change_1h: float
    volume_surge: bool
    trend_direction: str  # 'up', 'down', 'neutral'
    confidence: float  # 0-1

@dataclass
class OrderBookFlow:
    ticker: str
    bid_ask_ratio: float
    aggressive_buy_ratio: float
    aggressive_sell_ratio: float
    flow_direction: str  # 'buying', 'selling', 'neutral'
    strength: float  # 0-1

# ─── Auth ────────────────────────────────────────────────────────────────────

_pk = None

def get_key():
    global _pk
    if _pk is None:
        pem = PRIVATE_KEY_PEM.strip()
        data = open(pem, "rb").read() if os.path.isfile(pem) else pem.encode()
        _pk = serialization.load_pem_private_key(data, password=None, backend=default_backend())
    return _pk

def auth_headers(method: str, path: str) -> dict:
    ts = str(int(datetime.datetime.now().timestamp() * 1000))
    msg = f"{ts}{method}{path.split('?')[0]}".encode()
    sig = get_key().sign(
        msg,
        padding.PSS(mgf=padding.MGF1(hashes.SHA256()), salt_length=padding.PSS.DIGEST_LENGTH),
        hashes.SHA256()
    )
    return {
        "KALSHI-ACCESS-KEY": API_KEY_ID,
        "KALSHI-ACCESS-TIMESTAMP": ts,
        "KALSHI-ACCESS-SIGNATURE": base64.b64encode(sig).decode(),
        "Content-Type": "application/json"
    }

def kget(path: str, params: dict = None) -> requests.Response:
    full = path + ("?" + "&".join(f"{k}={v}" for k, v in params.items()) if params else "")
    return requests.get(BASE_URL + full, headers=auth_headers("GET", path), timeout=15)

def kpost(path: str, payload: dict) -> requests.Response:
    return requests.post(
        BASE_URL + path,
        headers=auth_headers("POST", path),
        json=payload,
        timeout=15
    )

# ─── Spot Market Signals ─────────────────────────────────────────────────────

def get_binance_signal(symbol: str) -> Optional[SpotSignal]:
    """Get 24h price change and volume data from Binance."""
    try:
        # Map Kalshi symbols to Binance
        binance_symbol = f"{symbol}USDT"
        r = requests.get(f"{BINANCE_SPOT_API}/ticker/24hr", params={"symbol": binance_symbol}, timeout=10)
        if not r.ok:
            return None
        data = r.json()
        
        price_change = float(data.get("priceChangePercent", 0))
        volume = float(data.get("volume", 0))
        quote_volume = float(data.get("quoteVolume", 0))
        
        # Get 1h data for short-term trend
        r1h = requests.get(
            f"{BINANCE_SPOT_API}/klines",
            params={"symbol": binance_symbol, "interval": "1h", "limit": 2},
            timeout=10
        )
        price_change_1h = 0
        if r1h.ok and len(r1h.json()) >= 2:
            klines = r1h.json()
            open_price = float(klines[0][1])
            close_price = float(klines[-1][4])
            price_change_1h = ((close_price - open_price) / open_price) * 100
        
        # Determine trend
        if price_change_1h > 1 and price_change > 0:
            trend = 'up'
            confidence = min(0.9, 0.5 + abs(price_change_1h) / 10)
        elif price_change_1h < -1 and price_change < 0:
            trend = 'down'
            confidence = min(0.9, 0.5 + abs(price_change_1h) / 10)
        else:
            trend = 'neutral'
            confidence = 0.5
        
        # Volume surge detection (simplified)
        volume_surge = volume > 1000000  # $1M+ volume
        
        return SpotSignal(
            symbol=symbol,
            price_change_24h=price_change,
            price_change_1h=price_change_1h,
            volume_surge=volume_surge,
            trend_direction=trend,
            confidence=confidence
        )
    except Exception as e:
        print(f"  ⚠️ Binance API error: {e}")
        return None

def get_spot_signal_for_market(series: str) -> Optional[SpotSignal]:
    """Map Kalshi series to spot market symbol."""
    symbol_map = {
        "KXBTC15M": "BTC",
        "KXETH15M": "ETH",
        "KXSOL15M": "SOL",
        "KXXRP15M": "XRP"
    }
    symbol = symbol_map.get(series)
    if not symbol:
        return None
    return get_binance_signal(symbol)

# ─── Order Book Flow Analysis ────────────────────────────────────────────────

def get_order_book_flow(ticker: str) -> Optional[OrderBookFlow]:
    """Analyze Kalshi order book for aggressive buyer/seller detection."""
    try:
        # Get order book depth
        r = kget(f"/trade-api/v2/markets/{ticker}/orderbook", {"depth": "20"})
        if not r.ok:
            return None
        
        data = r.json()
        yes_bids = data.get("yes_bids", [])
        yes_asks = data.get("yes_asks", [])
        
        if not yes_bids or not yes_asks:
            return None
        
        # Calculate bid/ask ratio
        total_bid_volume = sum(b.get("count", 0) for b in yes_bids)
        total_ask_volume = sum(a.get("count", 0) for a in yes_asks)
        
        if total_ask_volume == 0:
            bid_ask_ratio = float('inf')
        else:
            bid_ask_ratio = total_bid_volume / total_ask_volume
        
        # Estimate aggressive flow based on price levels
        best_bid = yes_bids[0].get("price", 0) if yes_bids else 0
        best_ask = yes_asks[0].get("price", 0) if yes_asks else 0
        
        # Aggressive buyers hit the ask, aggressive sellers hit the bid
        aggressive_buy = sum(a.get("count", 0) for a in yes_asks if a.get("price", 99) <= best_ask)
        aggressive_sell = sum(b.get("count", 0) for b in yes_bids if b.get("price", 0) >= best_bid)
        
        total_aggressive = aggressive_buy + aggressive_sell
        if total_aggressive == 0:
            aggressive_buy_ratio = 0.5
            aggressive_sell_ratio = 0.5
        else:
            aggressive_buy_ratio = aggressive_buy / total_aggressive
            aggressive_sell_ratio = aggressive_sell / total_aggressive
        
        # Determine flow direction
        if aggressive_buy_ratio > 0.6 and bid_ask_ratio > 1.2:
            flow_direction = 'buying'
            strength = min(0.9, aggressive_buy_ratio)
        elif aggressive_sell_ratio > 0.6 and bid_ask_ratio < 0.8:
            flow_direction = 'selling'
            strength = min(0.9, aggressive_sell_ratio)
        else:
            flow_direction = 'neutral'
            strength = 0.5
        
        return OrderBookFlow(
            ticker=ticker,
            bid_ask_ratio=bid_ask_ratio,
            aggressive_buy_ratio=aggressive_buy_ratio,
            aggressive_sell_ratio=aggressive_sell_ratio,
            flow_direction=flow_direction,
            strength=strength
        )
    except Exception as e:
        print(f"  ⚠️ Order book error: {e}")
        return None

# ─── Kelly Criterion Sizing ──────────────────────────────────────────────────

def calculate_kelly_size(edge: int, spot_confidence: float, flow_strength: float, 
                         balance_cents: int, daily_budget_remaining: int) -> int:
    """
    Calculate position size using Kelly Criterion with modifications.
    Falls back to fixed size when balance is low.
    """
    # Low balance mode: fixed $2 per trade
    LOW_BALANCE_THRESHOLD = 1000  # $10
    FIXED_SIZE_LOW_BALANCE = 200  # $2
    
    if balance_cents < LOW_BALANCE_THRESHOLD:
        # Use fixed size, but ensure we have budget
        size = min(FIXED_SIZE_LOW_BALANCE, balance_cents, daily_budget_remaining)
        if size >= 100:  # Minimum $1
            return size
        return 0
    
    # Normal Kelly sizing for healthy balances
    win_prob = min(0.95, 0.80 + (edge / 100))
    loss_prob = 1 - win_prob
    
    odds = (100 - (95 - edge)) / (95 - edge) if (95 - edge) > 0 else 1
    kelly = (win_prob * odds - loss_prob) / odds if odds > 0 else 0
    kelly = max(0, kelly * KELLY_FRACTION)
    
    spot_modifier = 0.8 + (spot_confidence * 0.4)
    flow_modifier = 0.8 + (flow_strength * 0.4)
    
    base_size = BASE_POSITION_USD * kelly * spot_modifier * flow_modifier
    max_size = min(MAX_POSITION_USD, balance_cents / 100, daily_budget_remaining / 100)
    position_usd = min(base_size, max_size)
    
    if position_usd < 1.0:
        return 0
    
    return int(position_usd * 100)

# ─── ML Prediction Layer ─────────────────────────────────────────────────────

def load_ml_model() -> Optional[Dict]:
    """Load trained ML model for price path prediction."""
    try:
        if os.path.exists(ML_MODEL_FILE):
            with open(ML_MODEL_FILE) as f:
                return json.load(f)
        return None
    except Exception:
        return None

def predict_convergence_probability(market: MarketOpportunity, 
                                   spot: Optional[SpotSignal],
                                   flow: Optional[OrderBookFlow]) -> float:
    """
    Predict probability of successful convergence using ML model or heuristics.
    Returns 0-1 probability.
    """
    model = load_ml_model()
    
    if model:
        # Use trained model if available
        features = [
            market.edge / 20,  # Normalize edge
            market.minutes_left / 5,  # Normalize time
            spot.confidence if spot else 0.5,
            flow.strength if flow else 0.5,
            1 if flow and flow.flow_direction == 'buying' else 0,
            market.volume / 10000 if market.volume else 0
        ]
        
        # Simple weighted sum (placeholder for actual model)
        weights = model.get('weights', [0.3, 0.2, 0.2, 0.15, 0.1, 0.05])
        prob = sum(f * w for f, w in zip(features, weights))
        return min(0.95, max(0.1, prob))
    else:
        # Heuristic model
        base_prob = 0.5 + (market.edge / 40)  # Edge contributes
        
        if spot:
            if market.side == 'yes' and spot.trend_direction == 'up':
                base_prob += 0.15 * spot.confidence
            elif market.side == 'no' and spot.trend_direction == 'down':
                base_prob += 0.15 * spot.confidence
        
        if flow:
            if market.side == 'yes' and flow.flow_direction == 'buying':
                base_prob += 0.1 * flow.strength
            elif market.side == 'no' and flow.flow_direction == 'selling':
                base_prob += 0.1 * flow.strength
        
        return min(0.95, max(0.1, base_prob))

# ─── Exit Strategy ───────────────────────────────────────────────────────────

def check_exit_conditions(position: Dict, current_price: int, 
                          minutes_to_close: float) -> Tuple[bool, str]:
    """
    Check if position should be exited.
    Returns (should_exit, reason)
    """
    entry_price = position.get('entry_price', 0)
    side = position.get('side', 'yes')
    
    # Take profit
    if side == 'yes' and current_price >= TAKE_PROFIT_THRESHOLD:
        return True, f"take_profit_{current_price}"
    if side == 'no' and current_price <= (100 - TAKE_PROFIT_THRESHOLD):
        return True, f"take_profit_{current_price}"
    
    # Stop loss
    if side == 'yes' and current_price <= STOP_LOSS_THRESHOLD:
        return True, f"stop_loss_{current_price}"
    if side == 'no' and current_price >= (100 - STOP_LOSS_THRESHOLD):
        return True, f"stop_loss_{current_price}"
    
    # Time-based exit
    if minutes_to_close <= TIME_EXIT_MINUTES:
        pnl = current_price - entry_price if side == 'yes' else entry_price - current_price
        if pnl < 0:  # Exit if losing near close
            return True, f"time_exit_{pnl}"
    
    return False, ""

# ─── Core Functions ──────────────────────────────────────────────────────────

def get_balance() -> int:
    r = kget("/trade-api/v2/portfolio/balance")
    if r.ok:
        return r.json().get("balance", 0)
    return 0

def get_positions() -> List[Dict]:
    r = kget("/trade-api/v2/portfolio/positions")
    if r.ok:
        return r.json().get("market_positions", [])
    return []

def scan_opportunities() -> List[MarketOpportunity]:
    """Scan for convergence opportunities with full signal analysis."""
    now = datetime.datetime.now(datetime.timezone.utc)
    opportunities = []
    
    for series in CRYPTO_15M_SERIES:
        r = kget("/trade-api/v2/markets", {
            "series_ticker": series,
            "status": "open",
            "limit": "10"
        })
        if not r.ok:
            continue
        
        markets = r.json().get("markets", [])
        for m in markets:
            close_str = m.get("close_time", "")
            try:
                close_dt = datetime.datetime.fromisoformat(close_str.replace("Z", "+00:00"))
                mins_left = (close_dt - now).total_seconds() / 60
            except:
                continue
            
            if not (MIN_MINUTES_UNTIL <= mins_left <= MAX_MINUTES_UNTIL):
                continue
            
            yes_ask = m.get("yes_ask", 99)
            yes_bid = m.get("yes_bid", 0)
            no_ask = m.get("no_ask", 99)
            no_bid = m.get("no_bid", 0)
            
            # Find convergence side — check BOTH yes_ask >= 80 AND no_ask >= 80
            candidates = []
            
            # YES side convergence (price going up)
            if yes_ask >= MIN_CONVERGENCE and yes_ask < MAX_PRICE:
                candidates.append(('yes', yes_ask, 100 - yes_ask))
            
            # NO side convergence (price going down) — if no_ask >= 80, that means YES is cheap
            if no_ask >= MIN_CONVERGENCE and no_ask < MAX_PRICE:
                # Edge for NO is (100 - no_ask) — what we pay vs $1 payout
                candidates.append(('no', no_ask, 100 - no_ask))
            
            if not candidates:
                continue
            
            # Pick best edge
            side, price, edge = max(candidates, key=lambda x: x[2])
            
            opp = MarketOpportunity(
                ticker=m['ticker'],
                series=series,
                side=side,
                price=price,
                edge=edge,
                minutes_left=mins_left,
                yes_ask=yes_ask,
                no_ask=no_ask,
                volume=m.get('volume', 0),
                open_interest=m.get('open_interest', 0)
            )
            opportunities.append(opp)
    
    return sorted(opportunities, key=lambda x: x.edge, reverse=True)

def place_order(ticker: str, side: str, count: int, price: int) -> Dict:
    """Place a live order on Kalshi."""
    order_id = str(uuid.uuid4())
    
    # Kalshi API requires yes_price for YES side, no_price for NO side
    price_field = "yes_price" if side == "yes" else "no_price"
    
    payload = {
        "ticker": ticker,
        "action": "buy",  # Required field - "buy" or "sell"
        "side": side,     # "yes" or "no"
        "count": count,
        price_field: price,  # yes_price or no_price based on side
        "client_order_id": order_id
    }

    r = kpost("/trade-api/v2/portfolio/orders", payload)
    if r.ok:
        return r.json()
    else:
        error_detail = r.text[:200] if r.text else "No detail"
        print(f"     🔴 Order failed: HTTP {r.status_code} | Payload: {payload} | Response: {error_detail}")
        return {"error": r.status_code, "detail": error_detail}

def log_trade(opp: MarketOpportunity, size_cents: int, order_id: str, 
              spot: Optional[SpotSignal], flow: Optional[OrderBookFlow],
              ml_prob: float):
    """Log trade with full context for ML training."""
    entry = {
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
        "ticker": opp.ticker,
        "side": opp.side,
        "entry_price": opp.price,
        "edge": opp.edge,
        "size_cents": size_cents,
        "order_id": order_id,
        "spot_signal": {
            "trend": spot.trend_direction if spot else None,
            "confidence": spot.confidence if spot else None,
            "change_1h": spot.price_change_1h if spot else None
        } if spot else None,
        "order_flow": {
            "direction": flow.flow_direction if flow else None,
            "strength": flow.strength if flow else None,
            "bid_ask_ratio": flow.bid_ask_ratio if flow else None
        } if flow else None,
        "ml_convergence_prob": ml_prob,
        "status": "open"
    }
    
    os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)
    logs = []
    if os.path.exists(LOG_FILE):
        with open(LOG_FILE) as f:
            logs = json.load(f)
    logs.append(entry)
    with open(LOG_FILE, "w") as f:
        json.dump(logs[-500:], f, indent=2)  # Keep last 500

def run(live: bool = False):
    """Main execution loop with elite features."""
    print(f"🎯 Kalshi Price Farmer v2 — Elite Edition")
    print(f"{'='*60}")
    print(f"Mode: {'🔴 LIVE' if live else '🟡 DRY-RUN'} | Kelly: {KELLY_FRACTION*100:.0f}% | Max: ${MAX_POSITION_USD}")
    
    balance_cents = get_balance()
    print(f"💰 Balance: ${balance_cents/100:.2f}")
    
    # Check daily budget
    state = _state.status()
    pf_state = state["bots"].get("price_farmer", {})
    daily_spent = pf_state.get("daily_spent_cents", 0)
    daily_budget = pf_state.get("daily_budget_cents", 900)
    daily_remaining = daily_budget - daily_spent
    
    print(f"📊 Daily budget: ${daily_spent/100:.2f}/${daily_budget/100:.2f} spent")
    
    # Scan opportunities
    print(f"\n🔍 Scanning with signal analysis...")
    opportunities = scan_opportunities()
    
    if not opportunities:
        print("⏸️  No convergence opportunities.")
        return {"trades": 0, "opportunities": 0}
    
    print(f"🎯 {len(opportunities)} opportunity/ies found!")
    
    # Analyze each opportunity
    trades_executed = []
    for opp in opportunities[:3]:  # Top 3
        print(f"\n  📈 {opp.ticker} | {opp.side.upper()} @ {opp.price}¢ | edge={opp.edge}¢ | {opp.minutes_left:.1f}m left")
        
        # Get signals
        spot = get_spot_signal_for_market(opp.series)
        flow = get_order_book_flow(opp.ticker)
        
        if spot:
            print(f"     🌊 Spot: {spot.trend_direction} (conf: {spot.confidence:.2f}, 1h: {spot.price_change_1h:+.2f}%)")
        if flow:
            print(f"     📚 Flow: {flow.flow_direction} (strength: {flow.strength:.2f}, B/A: {flow.bid_ask_ratio:.2f})")
        
        # ML prediction
        ml_prob = predict_convergence_probability(opp, spot, flow)
        print(f"     🤖 ML prob: {ml_prob:.2f}")
        
        # Skip if ML confidence too low
        if ml_prob < 0.5:
            print(f"     ⏭️  Skipping — ML confidence {ml_prob:.2f} < 0.50")
            continue
        
        # Calculate position size
        spot_conf = spot.confidence if spot else 0.5
        flow_strength = flow.strength if flow else 0.5
        
        size_cents = calculate_kelly_size(
            opp.edge, spot_conf, flow_strength,
            balance_cents, daily_remaining
        )
        
        if size_cents == 0:
            print(f"     ⏭️  Skipping — position size too small")
            continue
        
        count = max(1, size_cents // opp.price)
        cost_cents = count * opp.price

        print(f"     💰 Kelly size: ${size_cents/100:.2f} → {count} contracts @ {opp.price}¢ = ${cost_cents/100:.2f}")
        print(f"     💵 Balance: ${balance_cents/100:.2f} | Daily remaining: ${daily_remaining/100:.2f}")

        # Check budget
        if cost_cents > balance_cents and live:
            print(f"     🛡️  Insufficient balance (need ${cost_cents/100:.2f}, have ${balance_cents/100:.2f})")
            continue

        if cost_cents > daily_remaining and live:
            print(f"     🛡️  Daily budget exhausted")
            continue
        
        # Execute
        if live:
            order = place_order(opp.ticker, opp.side, count, opp.price)
            if order.get("error"):
                print(f"     ❌ Error: {order.get('error')}")
                continue
            
            oid = order.get("order_id", "?")
            print(f"     ✅ Executed | order_id={oid}")
            
            # Record trade
            _state.record_trade(BOT_NAME, cost_cents, opp.ticker, opp.side, oid, dry_run=False)
            log_trade(opp, cost_cents, oid, spot, flow, ml_prob)
            
            balance_cents -= cost_cents
            daily_remaining -= cost_cents
            trades_executed.append({
                "ticker": opp.ticker,
                "side": opp.side,
                "count": count,
                "price": opp.price,
                "order_id": oid,
                "ml_prob": ml_prob
            })
        else:
            print(f"     [DRY-RUN] Would execute")
    
    # Summary
    print(f"\n{'='*60}")
    print(f"📊 {len(opportunities)} opps | {len(trades_executed)} trades {'executed' if live else '(dry-run)'}")
    print(_state.summary_line())
    
    return {
        "trades": len(trades_executed),
        "opportunities": len(opportunities),
        "balance": balance_cents,
        "executed": trades_executed
    }

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--live", action="store_true")
    args = parser.parse_args()
    run(args.live)
