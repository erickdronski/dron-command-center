#!/usr/bin/env python3
"""
🌡️ Kalshi Weather Trader — gopfan2-style strategy on Kalshi
Inspired by gopfan2's Polymarket temperature strategy, adapted for Kalshi's API.

Uses NOAA forecasts to find mispriced weather markets and trade them.
Default: DRY RUN — pass --live to execute real orders.

Usage:
  python3 kalshi_weather_trader.py                  # dry run
  python3 kalshi_weather_trader.py --live           # execute trades
  python3 kalshi_weather_trader.py --positions      # show open positions
  python3 kalshi_weather_trader.py --config         # show config
  python3 kalshi_weather_trader.py --quiet          # minimal output
"""

import argparse
import base64
import datetime
import json
import os
import re
import sys
import time
import uuid
from typing import Optional

import requests
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding

# ─── Configuration ────────────────────────────────────────────────────────────

API_KEY_ID   = os.environ.get("KALSHI_API_KEY", "69d03bf0-4a89-414d-8ecf-d6fe4cfdf183")
BASE_URL     = os.environ.get("KALSHI_BASE_URL", "https://api.elections.kalshi.com")

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

# Strategy thresholds (prices in cents, 1-99)
ENTRY_THRESHOLD  = int(os.environ.get("KALSHI_ENTRY", "15"))    # buy YES when yes_ask ≤ this
EXIT_THRESHOLD   = int(os.environ.get("KALSHI_EXIT",  "45"))    # sell YES when yes_bid ≥ this
MAX_POSITION_CT  = int(os.environ.get("KALSHI_MAX_POSITION_CENTS", "200"))  # cents per trade
MAX_TRADES       = int(os.environ.get("KALSHI_MAX_TRADES", "5"))

# Weather series to scan (Kalshi's temperature/weather market series)
WEATHER_SERIES = [
    "KXCITIESWEATHER",  # Multi-city combo high-temp markets
    "HIGHCHI",          # Chicago daily high
    "KXLOWAUS",         # Austin low temp
    "KXHEATWARNING",    # Heat warning markets
    "KXDVHIGH",         # Death Valley
    "KXLAXSNOWM",       # LA snowfall
    "KXSLCSNOWM",       # Salt Lake City monthly snow
    "KXJACWSNOWM",      # Jackson WY monthly snow
    "KXCHISNOWXMAS",    # Chicago Christmas snow
    "KXDENSNOWXMAS",    # Denver Christmas snow
    "AVGTEMP",          # US average temp
    "KXGTEMP",          # Hottest year ever
]

# City → NOAA station mapping (for NOAA forecast lookups)
CITY_NOAA_GRID = {
    "CHI":  {"office": "LOT", "gridX": 76,  "gridY": 73,  "wfo": "41093"},
    "NY":   {"office": "OKX", "gridX": 33,  "gridY": 37,  "wfo": "94728"},
    "NYC":  {"office": "OKX", "gridX": 33,  "gridY": 37,  "wfo": "94728"},
    "LA":   {"office": "LOX", "gridX": 151, "gridY": 48,  "wfo": "03110"},
    "DEN":  {"office": "BOU", "gridX": 57,  "gridY": 62,  "wfo": "23062"},
    "MIA":  {"office": "MFL", "gridX": 110, "gridY": 37,  "wfo": "12839"},
    "SEA":  {"office": "SEW", "gridX": 124, "gridY": 69,  "wfo": "94290"},
    "ATL":  {"office": "FFC", "gridX": 52,  "gridY": 88,  "wfo": "13874"},
    "DAL":  {"office": "FWD", "gridX": 85,  "gridY": 82,  "wfo": "03927"},
    "AUS":  {"office": "EWX", "gridX": 156, "gridY": 89,  "wfo": "41009"},
    "PHIL": {"office": "PHI", "gridX": 49,  "gridY": 68,  "wfo": "13739"},
    "PHIL": {"office": "PHI", "gridX": 49,  "gridY": 68,  "wfo": "13739"},
    "BOS":  {"office": "BOX", "gridX": 64,  "gridY": 34,  "wfo": "14739"},
    "DC":   {"office": "LWX", "gridX": 97,  "gridY": 70,  "wfo": "13743"},
    "PHX":  {"office": "PSR", "gridX": 159, "gridY": 57,  "wfo": "23183"},
    "LV":   {"office": "VEF", "gridX": 40,  "gridY": 36,  "wfo": "03017"},
    "SLC":  {"office": "SLC", "gridX": 100, "gridY": 100, "wfo": "24127"},
    "JAC":  {"office": "RIW", "gridX": 37,  "gridY": 88,  "wfo": "48233"},
}


# ─── Auth ─────────────────────────────────────────────────────────────────────

def _load_key():
    pem = PRIVATE_KEY_PEM.strip()
    if os.path.isfile(pem):
        with open(pem, "rb") as f:
            pem = f.read()
    else:
        pem = pem.encode()
    return serialization.load_pem_private_key(pem, password=None, backend=default_backend())


_private_key = None

def get_key():
    global _private_key
    if _private_key is None:
        _private_key = _load_key()
    return _private_key


def sign(method: str, path: str) -> tuple[str, str]:
    """Returns (timestamp_ms, b64_signature)."""
    ts = str(int(datetime.datetime.now().timestamp() * 1000))
    msg = f"{ts}{method}{path.split('?')[0]}".encode()
    sig = get_key().sign(
        msg,
        padding.PSS(mgf=padding.MGF1(hashes.SHA256()), salt_length=padding.PSS.DIGEST_LENGTH),
        hashes.SHA256(),
    )
    return ts, base64.b64encode(sig).decode()


def _headers(method: str, path: str) -> dict:
    ts, sig = sign(method, path)
    return {
        "KALSHI-ACCESS-KEY": API_KEY_ID,
        "KALSHI-ACCESS-TIMESTAMP": ts,
        "KALSHI-ACCESS-SIGNATURE": sig,
        "Content-Type": "application/json",
    }


def kget(path: str, params: dict = None) -> requests.Response:
    full_path = path
    if params:
        full_path += "?" + "&".join(f"{k}={v}" for k, v in params.items())
    return requests.get(BASE_URL + full_path, headers=_headers("GET", path), timeout=15)


def kpost(path: str, data: dict) -> requests.Response:
    return requests.post(
        BASE_URL + path,
        headers=_headers("POST", path),
        json=data,
        timeout=15,
    )


def kdel(path: str) -> requests.Response:
    return requests.delete(BASE_URL + path, headers=_headers("DELETE", path), timeout=15)


# ─── NOAA Forecasts ───────────────────────────────────────────────────────────

_noaa_cache: dict = {}

def get_noaa_high_temp(city_code: str, target_date: datetime.date) -> Optional[float]:
    """Fetch NOAA high temperature forecast for a city on a specific date."""
    city = city_code.upper()
    if city not in CITY_NOAA_GRID:
        return None

    grid = CITY_NOAA_GRID[city]
    cache_key = f"{city}_{target_date}"
    if cache_key in _noaa_cache:
        return _noaa_cache[cache_key]

    try:
        url = f"https://api.weather.gov/gridpoints/{grid['office']}/{grid['gridX']},{grid['gridY']}/forecast"
        r = requests.get(url, headers={"User-Agent": "kalshi-weather-bot/1.0"}, timeout=10)
        if not r.ok:
            return None

        periods = r.json().get("properties", {}).get("periods", [])
        for period in periods:
            start = period.get("startTime", "")
            if not start:
                continue
            period_date = datetime.date.fromisoformat(start[:10])
            is_daytime = period.get("isDaytime", True)

            if period_date == target_date and is_daytime:
                temp = period.get("temperature")
                _noaa_cache[cache_key] = float(temp)
                return float(temp)

    except Exception:
        pass

    return None


def get_noaa_snow_probability(city_code: str, month: int, year: int) -> Optional[dict]:
    """
    Get NOAA 7-day snow outlook for a city in a given month.
    Returns: {"snow_chance_pct": float, "expected_inches": float, "details": str}
    """
    city = city_code.upper()
    if city not in CITY_NOAA_GRID:
        return None

    grid = CITY_NOAA_GRID[city]
    cache_key = f"snow_{city}_{year}_{month}"
    if cache_key in _noaa_cache:
        return _noaa_cache[cache_key]

    try:
        # Use hourly gridpoint data for snow accumulation
        url = f"https://api.weather.gov/gridpoints/{grid['office']}/{grid['gridX']},{grid['gridY']}/forecast/hourly"
        r = requests.get(url, headers={"User-Agent": "kalshi-weather-bot/1.0"}, timeout=10)
        if not r.ok:
            return None

        periods = r.json().get("properties", {}).get("periods", [])
        snow_hours = 0
        total_hours = 0
        for period in periods:
            start = period.get("startTime", "")
            if not start:
                continue
            p_date = datetime.date.fromisoformat(start[:10])
            if p_date.month != month or p_date.year != year:
                continue
            total_hours += 1
            forecast_text = (period.get("shortForecast", "") + " " + period.get("detailedForecast", "")).lower()
            if any(k in forecast_text for k in ["snow", "flurr", "wintry"]):
                snow_hours += 1

        if total_hours == 0:
            return None

        snow_pct = (snow_hours / total_hours) * 100
        result = {"snow_chance_pct": round(snow_pct, 1), "details": f"{snow_hours}/{total_hours} forecast hours mention snow"}
        _noaa_cache[cache_key] = result
        return result

    except Exception:
        pass

    return None


# ─── Market Discovery ─────────────────────────────────────────────────────────

def fetch_weather_markets() -> list[dict]:
    """Scan all weather series and return open markets."""
    markets = []
    for series in WEATHER_SERIES:
        try:
            r = kget("/trade-api/v2/markets", {"series_ticker": series, "status": "open", "limit": "100"})
            if r.ok:
                batch = r.json().get("markets", [])
                markets.extend(batch)
                if batch:
                    pass  # found some
        except Exception:
            pass
    return markets


def parse_kxcitiesweather_ticker(ticker: str) -> list[dict]:
    """
    Parse KXCITIESWEATHER ticker to extract city/temp combos.
    Example: KXCITIESWEATHER-25MAR04(CHI)(DEN)(PHIL)-(B49.5)(B46.5)(B56.5)
    Returns: [{"city": "CHI", "threshold": 49.5, "direction": "below"}, ...]
    """
    # Extract date from ticker
    date_match = re.search(r'(\d{2})([A-Z]{3})(\d{2})', ticker)
    if not date_match:
        return []

    # Extract city codes  
    cities = re.findall(r'\(([A-Z]+)\)', ticker.split('-')[2] if '-' in ticker else '')
    
    # Extract thresholds (B = below, T = above/top)
    last_part = ticker.split('-')[-1] if '-' in ticker else ''
    thresholds = re.findall(r'([BT])([\d.]+)', last_part)

    combos = []
    for i, city in enumerate(cities):
        if i < len(thresholds):
            direction = "below" if thresholds[i][0] == "B" else "above"
            temp = float(thresholds[i][1])
            combos.append({"city": city, "threshold": temp, "direction": direction})

    # Parse date
    try:
        month_map = {"JAN":1,"FEB":2,"MAR":3,"APR":4,"MAY":5,"JUN":6,
                     "JUL":7,"AUG":8,"SEP":9,"OCT":10,"NOV":11,"DEC":12}
        yr = int("20" + date_match.group(1))
        mo = month_map[date_match.group(2)]
        dy = int(date_match.group(3))
        target_date = datetime.date(yr, mo, dy)
    except Exception:
        target_date = None

    for c in combos:
        c["date"] = target_date

    return combos


def evaluate_market(market: dict, quiet: bool = False) -> dict:
    """
    Evaluate a weather market against NOAA and return signal.
    Returns: {signal, reason, noaa_temp, city, threshold, direction}
    """
    ticker = market.get("ticker", "")
    title  = market.get("title", "")
    series = market.get("series_ticker", "")

    yes_ask = market.get("yes_ask", 99)  # cost to buy YES
    yes_bid = market.get("yes_bid", 0)   # revenue from selling YES
    no_ask  = market.get("no_ask", 99)   # cost to buy NO
    close_time = market.get("close_time", "")

    # Time decay check: skip if resolves in < 2 hours
    if close_time:
        try:
            ct = datetime.datetime.fromisoformat(close_time.replace("Z", "+00:00"))
            now = datetime.datetime.now(datetime.timezone.utc)
            hours_left = (ct - now).total_seconds() / 3600
            if hours_left < 2:
                return {"signal": "skip", "reason": f"Resolves in {hours_left:.1f}h - too soon"}
        except Exception:
            pass

    # KXCITIESWEATHER — multi-city combo markets
    if series == "KXCITIESWEATHER" or "KXCITIESWEATHER" in ticker:
        combos = parse_kxcitiesweather_ticker(ticker)
        if not combos:
            return {"signal": "skip", "reason": "Could not parse ticker"}

        # All conditions must hold for YES to win — find NOAA probability
        all_match = True
        noaa_details = []
        for combo in combos:
            city = combo["city"]
            threshold = combo["threshold"]
            direction = combo["direction"]
            target_date = combo.get("date")

            if not target_date:
                continue

            noaa_temp = get_noaa_high_temp(city, target_date)
            if noaa_temp is None:
                all_match = False
                noaa_details.append(f"{city}: NOAA unavailable")
                continue

            match = (direction == "below" and noaa_temp < threshold) or \
                    (direction == "above" and noaa_temp >= threshold)
            noaa_details.append(f"{city}: NOAA={noaa_temp}°F {'<' if direction=='below' else '≥'} {threshold}°F → {'✓' if match else '✗'}")

            if not match:
                all_match = False

        noaa_str = ", ".join(noaa_details)

        if all_match:
            # NOAA says YES wins — look for underpriced YES
            if yes_ask <= ENTRY_THRESHOLD:
                return {"signal": "buy_yes", "reason": f"NOAA confirms all conditions. YES at {yes_ask}¢ is underpriced. {noaa_str}"}
            elif yes_bid >= EXIT_THRESHOLD:
                return {"signal": "sell_yes", "reason": f"NOAA confirms. YES at {yes_bid}¢ bid — profit target hit. {noaa_str}"}
        else:
            # NOAA says NO wins — look for underpriced NO
            if no_ask <= ENTRY_THRESHOLD:
                return {"signal": "buy_no", "reason": f"NOAA disagrees with YES. NO at {no_ask}¢ is underpriced. {noaa_str}"}

        return {"signal": "hold", "reason": f"Prices not at entry/exit threshold. {noaa_str}"}

    # ── Snow monthly markets (KXLAXSNOWM, KXSLCSNOWM, KXJACWSNOWM, etc.) ──────
    # Ticker format: KXLAXSNOWM-26FEB-0.5  (year+month, threshold in inches)
    if any(s in ticker for s in ["SNOWM", "SNOWXMAS"]):
        city_map = {
            "KXLAXSNOWM":  "LA",
            "KXSLCSNOWM":  "SLC",   # SLC not in grid — use SEA as proxy? skip
            "KXJACWSNOWM": "JAC",
            "KXCHISNOWXMAS": "CHI",
            "KXDENSNOWXMAS": "DEN",
        }
        city_code = None
        for prefix, code in city_map.items():
            if prefix in ticker:
                city_code = code
                break

        # Parse month/year from ticker e.g. 26FEB
        m = re.search(r'(\d{2})([A-Z]{3})', ticker)
        target_month = target_year = None
        if m:
            month_map = {"JAN":1,"FEB":2,"MAR":3,"APR":4,"MAY":5,"JUN":6,
                         "JUL":7,"AUG":8,"SEP":9,"OCT":10,"NOV":11,"DEC":12}
            target_year = int("20" + m.group(1))
            target_month = month_map.get(m.group(2))

        # Parse threshold (last part of ticker, e.g. 0.5)
        thresh_m = re.search(r'[\-_]([\d.]+)$', ticker)
        snow_threshold = float(thresh_m.group(1)) if thresh_m else None

        # Get NOAA snow data
        if city_code and city_code in CITY_NOAA_GRID and target_month and snow_threshold is not None:
            noaa = get_noaa_snow_probability(city_code, target_month, target_year)
            if noaa:
                snow_pct = noaa["snow_chance_pct"]
                details = noaa["details"]

                # If NOAA shows >70% chance of snow periods, lean YES; <20% lean NO
                if snow_pct > 70 and yes_ask <= ENTRY_THRESHOLD:
                    return {"signal": "buy_yes", "reason": f"NOAA: {snow_pct}% snow hours in forecast. YES at {yes_ask}¢ underpriced. {details}"}
                elif snow_pct < 20 and no_ask <= ENTRY_THRESHOLD:
                    return {"signal": "buy_no", "reason": f"NOAA: only {snow_pct}% snow hours. NO at {no_ask}¢ underpriced. {details}"}
                elif yes_bid >= EXIT_THRESHOLD:
                    return {"signal": "sell_yes", "reason": f"YES hit exit target at {yes_bid}¢"}
                else:
                    return {"signal": "hold", "reason": f"NOAA: {snow_pct}% snow hours. {details}. Prices not at threshold."}
            else:
                # No NOAA data — check raw price signal
                if yes_ask <= ENTRY_THRESHOLD:
                    return {"signal": "buy_yes", "reason": f"YES at {yes_ask}¢ extremely cheap (no NOAA data available)"}
                elif no_ask <= ENTRY_THRESHOLD:
                    return {"signal": "buy_no", "reason": f"NO at {no_ask}¢ extremely cheap (no NOAA data available)"}
        else:
            # City not in our grid (SLC, JAC) — pure price signal
            if yes_ask <= ENTRY_THRESHOLD:
                return {"signal": "buy_yes", "reason": f"YES at {yes_ask}¢ below entry threshold (city not in NOAA grid)"}
            elif no_ask <= ENTRY_THRESHOLD:
                return {"signal": "buy_no", "reason": f"NO at {no_ask}¢ below entry threshold (city not in NOAA grid)"}

        return {"signal": "hold", "reason": f"Snow market prices not at threshold (yes_ask={yes_ask}¢, no_ask={no_ask}¢)"}

    # ── Global temp / hottest year (KXGTEMP) ────────────────────────────────
    if "GTEMP" in ticker or "AVGTEMP" in ticker:
        # These are long-range climate markets — pure price signal, no NOAA
        if yes_ask <= ENTRY_THRESHOLD:
            return {"signal": "buy_yes", "reason": f"YES at {yes_ask}¢ below entry. Long-range climate signal — check NOAA climate outlooks manually."}
        elif no_ask <= ENTRY_THRESHOLD:
            return {"signal": "buy_no", "reason": f"NO at {no_ask}¢ below entry. Possible reversion-to-mean play."}
        elif yes_bid >= EXIT_THRESHOLD:
            return {"signal": "sell_yes", "reason": f"YES bid at {yes_bid}¢ — hit exit target."}
        return {"signal": "hold", "reason": f"Long-range climate market. yes_ask={yes_ask}¢, yes_bid={yes_bid}¢. No NOAA short-term signal."}

    # Generic temp market (single city)
    return {"signal": "skip", "reason": "Unsupported series format"}


# ─── Portfolio & Orders ────────────────────────────────────────────────────────

def get_balance() -> dict:
    r = kget("/trade-api/v2/portfolio/balance")
    if r.ok:
        return r.json()
    return {}


def get_positions() -> list[dict]:
    r = kget("/trade-api/v2/portfolio/positions")
    if r.ok:
        return r.json().get("market_positions", [])
    return []


def place_order(ticker: str, side: str, action: str, count: int, price_cents: int, live: bool) -> dict:
    """
    Place a limit order on Kalshi.
    side: 'yes' or 'no'
    action: 'buy' or 'sell'
    price_cents: 1-99
    """
    if not live:
        return {"dry_run": True, "ticker": ticker, "side": side, "action": action, "count": count, "price": price_cents}

    order_data = {
        "ticker": ticker,
        "action": action,
        "side": side,
        "count": count,
        "type": "limit",
        "client_order_id": str(uuid.uuid4()),
    }
    if side == "yes":
        order_data["yes_price"] = price_cents
    else:
        order_data["no_price"] = price_cents

    r = kpost("/trade-api/v2/portfolio/orders", order_data)
    if r.ok:
        return r.json().get("order", {})
    else:
        return {"error": r.status_code, "detail": r.text[:200]}


# ─── Main Loop ────────────────────────────────────────────────────────────────

def run(live: bool, quiet: bool, no_safeguards: bool, max_trades: int):
    if not quiet:
        print("🌡️ Kalshi Weather Trader — gopfan2-style strategy")
        print("=" * 60)

    # Balance
    bal = get_balance()
    balance_cents = bal.get("balance", 0)
    portfolio_cents = bal.get("portfolio_value", 0)
    if not quiet:
        print(f"\n💰 Balance: ${balance_cents/100:.2f} | Portfolio: ${portfolio_cents/100:.2f}")
        print(f"⚙️  Mode: {'🔴 LIVE' if live else '🟡 DRY RUN'} | Entry: {ENTRY_THRESHOLD}¢ | Exit: {EXIT_THRESHOLD}¢ | MaxPos: ${MAX_POSITION_CT/100:.2f}")

    # Discover markets
    if not quiet:
        print("\n🔍 Scanning weather series for open markets...")
    markets = fetch_weather_markets()

    if not markets:
        print("⚠️  No weather markets currently open. Kalshi weather markets are seasonal.")
        print("    Active series when weather markets run: KXCITIESWEATHER, HIGHCHI, etc.")
        print("    Check back during active seasons or when new weather events are listed.")

        # Show what series we scanned
        if not quiet:
            print(f"\n    Scanned {len(WEATHER_SERIES)} series: {', '.join(WEATHER_SERIES[:5])}...")
        return

    if not quiet:
        print(f"    Found {len(markets)} open weather market(s)")

    trades_executed = 0
    opportunities = 0

    for market in markets:
        if trades_executed >= max_trades:
            print(f"\n⛔ Max trades ({max_trades}) reached for this run.")
            break

        ticker = market.get("ticker", "")
        title  = market.get("title", "")
        yes_ask = market.get("yes_ask", 99)
        yes_bid = market.get("yes_bid", 0)
        no_ask  = market.get("no_ask", 99)

        if not quiet:
            print(f"\n📍 {ticker}")
            print(f"   {title[:70]}")
            print(f"   yes_ask={yes_ask}¢  yes_bid={yes_bid}¢  no_ask={no_ask}¢")

        result = evaluate_market(market, quiet)
        signal = result.get("signal", "skip")
        reason = result.get("reason", "")

        if signal == "skip":
            if not quiet:
                print(f"   ⏭️  Skip: {reason}")
            continue

        if signal == "hold":
            if not quiet:
                print(f"   💤 Hold: {reason}")
            continue

        # Signal is buy_yes, buy_no, or sell_yes
        opportunities += 1
        if not quiet:
            print(f"   💡 Signal [{signal.upper()}]: {reason}")

        # Calculate shares: max_position / price
        if signal == "buy_yes":
            price = yes_ask
            side, action = "yes", "buy"
        elif signal == "buy_no":
            price = no_ask
            side, action = "no", "buy"
        elif signal == "sell_yes":
            price = yes_bid
            side, action = "yes", "sell"
        else:
            continue

        if price <= 0:
            if not quiet:
                print("   ⚠️  Price is 0, skipping.")
            continue

        count = max(1, MAX_POSITION_CT // price)
        cost_cents = count * price

        if not quiet:
            print(f"   📊 {action.upper()} {count} {side.upper()} @ {price}¢ = ${cost_cents/100:.2f}")

        # Safeguards
        if not no_safeguards:
            # Don't buy if we'd spend more than available balance
            if action == "buy" and cost_cents > balance_cents:
                print(f"   🛡️  Safeguard: Insufficient balance (${balance_cents/100:.2f} < ${cost_cents/100:.2f})")
                continue

        # Execute
        order = place_order(ticker, side, action, count, price, live)

        if order.get("dry_run"):
            if not quiet:
                print(f"   [DRY RUN] Would place: {json.dumps(order)}")
        elif order.get("error"):
            print(f"   ❌ Order failed: {order}")
        else:
            trades_executed += 1
            print(f"   ✅ Order placed: {order.get('order_id', '?')} status={order.get('status', '?')}")

    print(f"\n📊 Summary: {len(markets)} markets scanned | {opportunities} opportunities | {trades_executed} trades {'executed' if live else '(dry run)'}")


def show_positions(quiet: bool):
    positions = get_positions()
    active = [p for p in positions if p.get("position", 0) != 0]

    print(f"\n📋 Open Positions ({len(active)}):")
    if not active:
        print("   (none)")
        return

    for p in active:
        ticker = p.get("ticker", "")
        pos    = p.get("position", 0)
        pnl    = p.get("realized_pnl_dollars", "0.0000")
        exp    = p.get("market_exposure_dollars", "0.0000")
        print(f"  {ticker}: pos={pos} | exposure=${exp} | realized_pnl=${pnl}")


def show_config():
    print("⚙️  Configuration:")
    print(f"   BASE_URL       : {BASE_URL}")
    print(f"   API_KEY_ID     : {API_KEY_ID}")
    print(f"   ENTRY_THRESHOLD: {ENTRY_THRESHOLD}¢ (buy YES/NO below this)")
    print(f"   EXIT_THRESHOLD : {EXIT_THRESHOLD}¢ (sell YES above this)")
    print(f"   MAX_POSITION   : ${MAX_POSITION_CT/100:.2f}")
    print(f"   MAX_TRADES     : {MAX_TRADES}")
    print(f"   WEATHER_SERIES : {', '.join(WEATHER_SERIES)}")


# ─── CLI ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Kalshi Weather Trader")
    parser.add_argument("--live", action="store_true", help="Execute real orders (default: dry run)")
    parser.add_argument("--positions", action="store_true", help="Show open positions and exit")
    parser.add_argument("--config", action="store_true", help="Show configuration and exit")
    parser.add_argument("--quiet", action="store_true", help="Minimal output")
    parser.add_argument("--no-safeguards", action="store_true", help="Disable safeguards (not recommended)")
    parser.add_argument("--max-trades", type=int, default=MAX_TRADES, help=f"Max trades per run (default: {MAX_TRADES})")
    args = parser.parse_args()

    if args.config:
        show_config()
        return

    if args.positions:
        show_positions(args.quiet)
        return

    run(
        live=args.live,
        quiet=args.quiet,
        no_safeguards=args.no_safeguards,
        max_trades=args.max_trades,
    )


if __name__ == "__main__":
    main()
