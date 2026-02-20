#!/usr/bin/env python3
"""
🌡️ Kalshi Weather Trader v2 — elite gopfan2-style strategy on Kalshi
NOAA 7-day + Open-Meteo 16-day extended forecasts + smart sizing + position deduplication.

Usage:
  python3 kalshi_weather_trader.py                  # dry run
  python3 kalshi_weather_trader.py --live           # execute trades
  python3 kalshi_weather_trader.py --positions      # show open positions
  python3 kalshi_weather_trader.py --config         # show config
  python3 kalshi_weather_trader.py --quiet          # minimal output (for cron)
"""

import argparse, base64, datetime, json, os, re, sys, time, uuid
from typing import Optional
import requests
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding

# ─── Config ───────────────────────────────────────────────────────────────────

API_KEY_ID   = os.environ.get("KALSHI_API_KEY",  "69d03bf0-4a89-414d-8ecf-d6fe4cfdf183")
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

ENTRY_THRESHOLD      = int(os.environ.get("KALSHI_ENTRY",        "15"))   # buy when price ≤ this
EXIT_THRESHOLD       = int(os.environ.get("KALSHI_EXIT",         "45"))   # sell when bid ≥ this
MAX_POSITION_CENTS   = int(os.environ.get("KALSHI_MAX_POS",      "200"))  # cents per trade
SIZING_PCT           = float(os.environ.get("KALSHI_SIZING_PCT", "0.05")) # % of balance if smart sizing
MAX_TRADES           = int(os.environ.get("KALSHI_MAX_TRADES",   "10"))
MIN_EDGE_CENTS       = int(os.environ.get("KALSHI_MIN_EDGE",     "5"))    # only trade if market price is ≥ this far from NOAA estimate

WEATHER_SERIES = [
    "KXCITIESWEATHER", "HIGHCHI",    "KXLOWAUS",   "KXHEATWARNING",
    "KXDVHIGH",        "KXLAXSNOWM", "KXSLCSNOWM", "KXJACWSNOWM",
    "KXCHISNOWXMAS",   "KXDENSNOWXMAS", "AVGTEMP",  "KXGTEMP",
]

# City → coordinates for Open-Meteo + NOAA grid
CITIES = {
    "CHI":  {"lat": 41.85,  "lon": -87.65,  "noaa_office": "LOT", "gx": 76,  "gy": 73},
    "NY":   {"lat": 40.71,  "lon": -74.01,  "noaa_office": "OKX", "gx": 33,  "gy": 37},
    "NYC":  {"lat": 40.71,  "lon": -74.01,  "noaa_office": "OKX", "gx": 33,  "gy": 37},
    "LA":   {"lat": 34.05,  "lon": -118.24, "noaa_office": "LOX", "gx": 151, "gy": 48},
    "DEN":  {"lat": 39.74,  "lon": -104.98, "noaa_office": "BOU", "gx": 57,  "gy": 62},
    "MIA":  {"lat": 25.77,  "lon": -80.19,  "noaa_office": "MFL", "gx": 110, "gy": 37},
    "SEA":  {"lat": 47.61,  "lon": -122.33, "noaa_office": "SEW", "gx": 124, "gy": 69},
    "ATL":  {"lat": 33.75,  "lon": -84.39,  "noaa_office": "FFC", "gx": 52,  "gy": 88},
    "DAL":  {"lat": 32.78,  "lon": -96.80,  "noaa_office": "FWD", "gx": 85,  "gy": 82},
    "AUS":  {"lat": 30.27,  "lon": -97.74,  "noaa_office": "EWX", "gx": 156, "gy": 89},
    "PHIL": {"lat": 39.95,  "lon": -75.17,  "noaa_office": "PHI", "gx": 49,  "gy": 68},
    "BOS":  {"lat": 42.36,  "lon": -71.06,  "noaa_office": "BOX", "gx": 64,  "gy": 34},
    "DC":   {"lat": 38.91,  "lon": -77.04,  "noaa_office": "LWX", "gx": 97,  "gy": 70},
    "PHX":  {"lat": 33.45,  "lon": -112.07, "noaa_office": "PSR", "gx": 159, "gy": 57},
    "LV":   {"lat": 36.17,  "lon": -115.14, "noaa_office": "VEF", "gx": 40,  "gy": 36},
    "SLC":  {"lat": 40.76,  "lon": -111.89, "noaa_office": "SLC", "gx": 100, "gy": 100},
    "JAC":  {"lat": 43.48,  "lon": -110.76, "noaa_office": "RIW", "gx": 37,  "gy": 88},
}

# ─── Auth ──────────────────────────────────────────────────────────────────────

_pk = None
def get_key():
    global _pk
    if _pk is None:
        pem = PRIVATE_KEY_PEM.strip()
        _pk = serialization.load_pem_private_key(
            (open(pem,"rb").read() if os.path.isfile(pem) else pem.encode()),
            password=None, backend=default_backend()
        )
    return _pk

def _sign(method, path):
    ts = str(int(datetime.datetime.now().timestamp() * 1000))
    msg = f"{ts}{method}{path.split('?')[0]}".encode()
    sig = get_key().sign(msg, padding.PSS(mgf=padding.MGF1(hashes.SHA256()), salt_length=padding.PSS.DIGEST_LENGTH), hashes.SHA256())
    return ts, base64.b64encode(sig).decode()

def _hdrs(method, path):
    ts, sig = _sign(method, path)
    return {"KALSHI-ACCESS-KEY": API_KEY_ID, "KALSHI-ACCESS-TIMESTAMP": ts,
            "KALSHI-ACCESS-SIGNATURE": sig, "Content-Type": "application/json"}

def kget(path, params=None):
    fp = path + ("?" + "&".join(f"{k}={v}" for k,v in params.items()) if params else "")
    return requests.get(BASE_URL + fp, headers=_hdrs("GET", path), timeout=15)

def kpost(path, data):
    return requests.post(BASE_URL + path, headers=_hdrs("POST", path), json=data, timeout=15)

# ─── Forecast Engine ───────────────────────────────────────────────────────────

_cache = {}

def _get_openmeteo(city_code: str) -> Optional[dict]:
    """16-day daily forecast from Open-Meteo. Returns raw API response."""
    c = CITIES.get(city_code.upper())
    if not c:
        return None
    key = f"om_{city_code}"
    if key in _cache:
        return _cache[key]
    try:
        r = requests.get(
            "https://api.open-meteo.com/v1/forecast",
            params={
                "latitude":  c["lat"], "longitude": c["lon"],
                "daily":     "temperature_2m_max,temperature_2m_min,precipitation_sum,snowfall_sum,precipitation_probability_max",
                "temperature_unit": "fahrenheit",
                "precipitation_unit": "inch",
                "timezone":  "auto",
                "forecast_days": 16,
            },
            timeout=10,
        )
        if r.ok:
            data = r.json()
            _cache[key] = data
            return data
    except Exception:
        pass
    return None


def get_forecast_high(city_code: str, target_date: datetime.date) -> Optional[float]:
    """High temp forecast for a specific date (Open-Meteo 16-day, falls back to NOAA 7-day)."""
    # Try Open-Meteo first (16-day)
    om = _get_openmeteo(city_code)
    if om:
        daily = om.get("daily", {})
        dates = daily.get("time", [])
        highs = daily.get("temperature_2m_max", [])
        target_str = target_date.isoformat()
        for i, d in enumerate(dates):
            if d == target_str and i < len(highs) and highs[i] is not None:
                return float(highs[i])

    # Fallback to NOAA 7-day
    c = CITIES.get(city_code.upper())
    if not c:
        return None
    key = f"noaa_high_{city_code}_{target_date}"
    if key in _cache:
        return _cache[key]
    try:
        url = f"https://api.weather.gov/gridpoints/{c['noaa_office']}/{c['gx']},{c['gy']}/forecast"
        r = requests.get(url, headers={"User-Agent": "kalshi-weather-bot/2.0"}, timeout=10)
        if r.ok:
            for period in r.json().get("properties", {}).get("periods", []):
                if period.get("isDaytime") and period.get("startTime","")[:10] == target_date.isoformat():
                    val = float(period["temperature"])
                    _cache[key] = val
                    return val
    except Exception:
        pass
    return None


def get_monthly_snow_estimate(city_code: str, month: int, year: int) -> dict:
    """
    Estimate monthly snowfall for the REMAINING days of a month.
    Blends Open-Meteo 16-day forecast with historical climatology
    for any future days not covered by the forecast window.

    Key insight: only count FUTURE days. Past days are locked in.
    """
    om = _get_openmeteo(city_code)
    today = datetime.date.today()

    # Days remaining in the target month (from today forward)
    days_in_month = 28 if month == 2 else (30 if month in [4,6,9,11] else 31)
    if year == today.year and month == today.month:
        days_remaining = days_in_month - today.day + 1  # today + future
    elif datetime.date(year, month, 1) < today:
        days_remaining = 0  # month already past
    else:
        days_remaining = days_in_month  # future month, all days remain

    snow_days = 0
    forecast_days_remaining = 0
    total_snow_inches = 0.0

    if om and days_remaining > 0:
        daily = om.get("daily", {})
        dates  = daily.get("time", [])
        snow_f = daily.get("snowfall_sum", [])

        for i, d in enumerate(dates):
            pd = datetime.date.fromisoformat(d)
            # Only count future days in the target month
            if pd >= today and pd.month == month and pd.year == year:
                forecast_days_remaining += 1
                sf = snow_f[i] if i < len(snow_f) and snow_f[i] is not None else 0
                total_snow_inches += sf
                if sf > 0.01:
                    snow_days += 1

    # Historical climatology: monthly avg snowfall in inches
    CLIMATOLOGY = {
        "SLC":  {1:13.0, 2:10.5, 3:7.5,  4:2.0,  11:5.0,  12:11.0},
        "JAC":  {1:40.0, 2:35.0, 3:20.0, 12:35.0, 11:18.0},
        "CHI":  {1:11.0, 2:8.5,  3:4.0,  12:9.0,  11:2.0},
        "DEN":  {1:8.0,  2:8.0,  3:9.5,  12:8.0,  11:5.0},
        "LA":   {1:0.0,  2:0.0,  3:0.0,  12:0.0},
        "NYC":  {1:7.5,  2:8.0,  3:3.5,  12:5.5},
        "BOS":  {1:13.0, 2:12.0, 3:6.0,  12:9.0},
        "SEA":  {1:2.0,  2:1.5,  3:0.5,  12:2.0},
    }
    climo_monthly = CLIMATOLOGY.get(city_code.upper(), {}).get(month, None)

    # Days beyond our forecast window (still in the future)
    days_beyond_forecast = max(0, days_remaining - forecast_days_remaining)

    if climo_monthly is not None and days_in_month > 0 and days_remaining > 0:
        # Scale climatology by remaining days proportion (daily avg × uncovered days)
        daily_climo = climo_monthly / days_in_month
        climo_supplement = daily_climo * days_beyond_forecast
        blended_total = total_snow_inches + climo_supplement
        confidence = "high" if forecast_days_remaining >= days_remaining else "medium" if forecast_days_remaining >= 5 else "low"
    else:
        blended_total = total_snow_inches
        climo_monthly = None
        confidence = "low" if forecast_days_remaining < 3 else "medium"

    return {
        "snow_days_forecast": snow_days,
        "forecast_days": forecast_days_remaining,
        "days_remaining": days_remaining,
        "days_in_month": days_in_month,
        "forecast_snow_inches": round(total_snow_inches, 2),
        "blended_snow_inches": round(blended_total, 2),
        "climo_monthly_avg": climo_monthly,
        "days_beyond_forecast": days_beyond_forecast,
        "confidence": confidence,
    }


# ─── Market Discovery ──────────────────────────────────────────────────────────

def fetch_weather_markets() -> list[dict]:
    markets = []
    seen = set()
    for series in WEATHER_SERIES:
        try:
            r = kget("/trade-api/v2/markets", {"series_ticker": series, "status": "open", "limit": "100"})
            if r.ok:
                for m in r.json().get("markets", []):
                    if m["ticker"] not in seen:
                        seen.add(m["ticker"])
                        markets.append(m)
        except Exception:
            pass
    return markets


def get_held_positions() -> dict[str, dict]:
    """
    Return dict of ticker → position info for all held positions.
    position > 0 = long YES, position < 0 = long NO (Kalshi convention)
    """
    r = kget("/trade-api/v2/portfolio/positions")
    if not r.ok:
        return {}
    held = {}
    for p in r.json().get("market_positions", []):
        pos = p.get("position", 0)
        if pos != 0 or p.get("resting_orders_count", 0) > 0:
            held[p["ticker"]] = p
    return held


# ─── Signal Engine ─────────────────────────────────────────────────────────────

def parse_cities_weather_ticker(ticker: str) -> list[dict]:
    """Parse KXCITIESWEATHER-25MAR04(CHI)(DEN)(PHIL)-(B49.5)(B46.5)(B58.5)"""
    parts = ticker.split("-")
    date_match = re.search(r'(\d{2})([A-Z]{3})(\d{2})', ticker)
    target_date = None
    if date_match:
        month_map = {"JAN":1,"FEB":2,"MAR":3,"APR":4,"MAY":5,"JUN":6,"JUL":7,"AUG":8,"SEP":9,"OCT":10,"NOV":11,"DEC":12}
        try:
            target_date = datetime.date(int("20"+date_match.group(1)), month_map[date_match.group(2)], int(date_match.group(3)))
        except Exception:
            pass

    cities_str = ""
    thresholds_str = ""
    for part in parts[1:]:
        if re.search(r'\([A-Z]{2,5}\)', part):
            cities_str = part
        elif re.search(r'\([BT][\d.]+\)', part):
            thresholds_str = part

    cities = re.findall(r'\(([A-Z]{2,5})\)', cities_str)
    thresh = re.findall(r'\(([BT])([\d.]+)\)', thresholds_str)

    combos = []
    for i, city in enumerate(cities):
        if i < len(thresh):
            combos.append({
                "city": city,
                "direction": "below" if thresh[i][0] == "B" else "above",
                "threshold": float(thresh[i][1]),
                "date": target_date,
            })
    return combos


def evaluate_market(market: dict) -> dict:
    ticker = market.get("ticker", "")
    series = market.get("series_ticker", "")
    yes_ask = market.get("yes_ask", 99)
    yes_bid = market.get("yes_bid", 0)
    no_ask  = market.get("no_ask", 99)
    close_time = market.get("close_time", "")

    # Time decay guard
    if close_time:
        try:
            ct = datetime.datetime.fromisoformat(close_time.replace("Z","+00:00"))
            hours_left = (ct - datetime.datetime.now(datetime.timezone.utc)).total_seconds()/3600
            if hours_left < 2:
                return {"signal": "skip", "reason": f"Resolves in {hours_left:.1f}h"}
        except Exception:
            pass

    # ── KXCITIESWEATHER multi-city combo ───────────────────────────────────────
    if "KXCITIESWEATHER" in ticker or series == "KXCITIESWEATHER":
        combos = parse_cities_weather_ticker(ticker)
        if not combos:
            return {"signal": "skip", "reason": "Could not parse ticker"}

        all_yes = True
        noaa_lines = []
        today = datetime.date.today()

        for c in combos:
            city, direction, threshold, target_date = c["city"], c["direction"], c["threshold"], c["date"]
            if not target_date:
                all_yes = False
                noaa_lines.append(f"{city}: no date")
                continue
            if target_date < today:
                return {"signal": "skip", "reason": f"Date {target_date} already passed"}

            noaa_high = get_forecast_high(city, target_date)
            if noaa_high is None:
                all_yes = False
                noaa_lines.append(f"{city}: no forecast data")
                continue

            match = (direction == "below" and noaa_high < threshold) or (direction == "above" and noaa_high >= threshold)
            sym = "✓" if match else "✗"
            noaa_lines.append(f"{city} {noaa_high:.0f}°F {'<' if direction=='below' else '≥'} {threshold:.0f}°F {sym}")
            if not match:
                all_yes = False

        detail = " | ".join(noaa_lines)

        if all_yes:
            if yes_ask <= ENTRY_THRESHOLD:
                edge = ENTRY_THRESHOLD - yes_ask
                return {"signal": "buy_yes", "side": "yes", "price": yes_ask, "edge": edge, "reason": f"All NOAA conditions match. {detail}"}
            elif yes_bid >= EXIT_THRESHOLD:
                return {"signal": "sell_yes", "side": "yes", "price": yes_bid, "reason": f"Exit target hit. {detail}"}
        else:
            if no_ask <= ENTRY_THRESHOLD:
                edge = ENTRY_THRESHOLD - no_ask
                return {"signal": "buy_no", "side": "no", "price": no_ask, "edge": edge, "reason": f"NOAA disagrees → buy NO. {detail}"}

        return {"signal": "hold", "reason": f"No threshold hit. {detail}"}

    # ── Snow monthly markets ───────────────────────────────────────────────────
    if any(s in ticker for s in ["SNOWM", "SNOWXMAS"]):
        city_map = {"KXLAXSNOWM":"LA", "KXSLCSNOWM":"SLC", "KXJACWSNOWM":"JAC",
                    "KXCHISNOWXMAS":"CHI", "KXDENSNOWXMAS":"DEN"}
        city_code = next((v for k,v in city_map.items() if k in ticker), None)

        m = re.search(r'(\d{2})([A-Z]{3})', ticker)
        if not m:
            return {"signal": "skip", "reason": "Cannot parse date"}
        month_map = {"JAN":1,"FEB":2,"MAR":3,"APR":4,"MAY":5,"JUN":6,"JUL":7,"AUG":8,"SEP":9,"OCT":10,"NOV":11,"DEC":12}
        target_year  = int("20" + m.group(1))
        target_month = month_map.get(m.group(2))

        thresh_m = re.search(r'-([\d.]+)$', ticker)
        snow_threshold = float(thresh_m.group(1)) if thresh_m else None

        if city_code and city_code in CITIES and target_month and snow_threshold is not None:
            est = get_monthly_snow_estimate(city_code, target_month, target_year)
            blended = est["blended_snow_inches"]
            climo   = est["climo_monthly_avg"]
            conf    = est["confidence"]
            days_rem = est["days_remaining"]
            days_bey = est["days_beyond_forecast"]
            detail  = (f"Open-Meteo {est['forecast_days']}d covered ({est['forecast_snow_inches']:.1f}\") | "
                       f"{days_bey}d climo-filled @ {climo:.1f}\"/mo avg | Blended: {blended:.1f}\" vs {snow_threshold}\" threshold "
                       f"({days_rem}d left in month) [{conf}]")

            # Edge calculation: how far is blended from threshold?
            edge_inches = abs(blended - snow_threshold)
            edge_pct = edge_inches / max(snow_threshold, 0.1)

            if blended >= snow_threshold * 1.3 and conf != "low":
                # Strong YES signal
                if yes_ask <= ENTRY_THRESHOLD:
                    return {"signal": "buy_yes", "side": "yes", "price": yes_ask, "edge": ENTRY_THRESHOLD - yes_ask, "reason": f"Blended {blended:.1f}\" > {snow_threshold}\" threshold (130%+). {detail}"}
                elif yes_bid >= EXIT_THRESHOLD:
                    return {"signal": "sell_yes", "side": "yes", "price": yes_bid, "reason": f"Exit target hit @ {yes_bid}¢. {detail}"}
            elif blended <= snow_threshold * 0.5 and conf != "low":
                # Strong NO signal
                if no_ask <= ENTRY_THRESHOLD:
                    return {"signal": "buy_no", "side": "no", "price": no_ask, "edge": ENTRY_THRESHOLD - no_ask, "reason": f"Blended {blended:.1f}\" << {snow_threshold}\" (below 50%). {detail}"}
            else:
                # Ambiguous — but still check for mispriced extremes
                if yes_ask <= 5:
                    return {"signal": "buy_yes", "side": "yes", "price": yes_ask, "edge": 10, "reason": f"Extreme value play at {yes_ask}¢. {detail}"}
                if no_ask <= 5:
                    return {"signal": "buy_no", "side": "no", "price": no_ask, "edge": 10, "reason": f"Extreme value play NO at {no_ask}¢. {detail}"}

            return {"signal": "hold", "reason": detail}

        # Fallback: pure price signal (unknown city / missing data)
        if yes_ask <= ENTRY_THRESHOLD:
            return {"signal": "buy_yes", "side": "yes", "price": yes_ask, "edge": ENTRY_THRESHOLD - yes_ask, "reason": f"YES at {yes_ask}¢ below entry (no extended forecast data)"}
        if no_ask <= ENTRY_THRESHOLD:
            return {"signal": "buy_no", "side": "no", "price": no_ask, "edge": ENTRY_THRESHOLD - no_ask, "reason": f"NO at {no_ask}¢ below entry (no extended forecast data)"}
        return {"signal": "hold", "reason": f"No price edge (yes_ask={yes_ask}¢ no_ask={no_ask}¢)"}

    # ── Long-range climate (KXGTEMP, AVGTEMP) ─────────────────────────────────
    if any(s in ticker for s in ["GTEMP", "AVGTEMP"]):
        # Use NOAA CPC anomaly + media signal if extreme pricing
        if yes_ask <= ENTRY_THRESHOLD:
            return {"signal": "buy_yes", "side": "yes", "price": yes_ask, "edge": ENTRY_THRESHOLD - yes_ask, "reason": f"Climate market YES at {yes_ask}¢ — possible value"}
        if no_ask <= ENTRY_THRESHOLD:
            return {"signal": "buy_no", "side": "no", "price": no_ask, "edge": ENTRY_THRESHOLD - no_ask, "reason": f"Climate market NO at {no_ask}¢ — reversion play"}
        if yes_bid >= EXIT_THRESHOLD:
            return {"signal": "sell_yes", "side": "yes", "price": yes_bid, "reason": f"YES hit exit at {yes_bid}¢"}
        return {"signal": "hold", "reason": f"Climate market — no edge at current prices (yes_ask={yes_ask}¢)"}

    return {"signal": "skip", "reason": "Unhandled series format"}


# ─── Sizing ─────────────────────────────────────────────────────────────────────

def smart_size(balance_cents: int, price_cents: int, edge: int) -> int:
    """
    Calculate number of contracts to buy.
    - Base: SIZING_PCT of balance
    - Scale up with edge (bigger edge → bigger position)
    - Cap at MAX_POSITION_CENTS
    """
    base = max(1, int(balance_cents * SIZING_PCT))
    # Edge multiplier: 0-5¢ edge → 1x, 5-10¢ → 1.5x, 10+¢ → 2x
    if edge >= 10:
        base = int(base * 2.0)
    elif edge >= 5:
        base = int(base * 1.5)
    position_cents = min(base, MAX_POSITION_CENTS)
    return max(1, position_cents // max(price_cents, 1))


# ─── Orders ──────────────────────────────────────────────────────────────────────

def place_order(ticker, side, action, count, price_cents, live) -> dict:
    if not live:
        return {"dry_run": True, "ticker": ticker, "side": side, "action": action, "count": count, "price_cents": price_cents}
    data = {"ticker": ticker, "action": action, "side": side, "count": count,
            "type": "limit", "client_order_id": str(uuid.uuid4())}
    if side == "yes":
        data["yes_price"] = price_cents
    else:
        data["no_price"] = price_cents
    r = kpost("/trade-api/v2/portfolio/orders", data)
    if r.ok:
        return r.json().get("order", {})
    return {"error": r.status_code, "detail": r.text[:300]}


# ─── Main Run ────────────────────────────────────────────────────────────────────

def run(live: bool, quiet: bool, no_safeguards: bool, max_trades: int):
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    if not quiet:
        print(f"🌡️  Kalshi Weather Trader v2  [{timestamp}]")
        print("=" * 60)

    bal_data = kget("/trade-api/v2/portfolio/balance").json()
    balance_cents = bal_data.get("balance", 0)
    portfolio_cents = bal_data.get("portfolio_value", 0)

    if not quiet:
        print(f"💰 Balance: ${balance_cents/100:.2f} | Portfolio: ${portfolio_cents/100:.2f}")
        print(f"⚙️  Mode: {'🔴 LIVE' if live else '🟡 DRY RUN'} | Entry: {ENTRY_THRESHOLD}¢ | Exit: {EXIT_THRESHOLD}¢ | Smart sizing: {SIZING_PCT*100:.0f}% of balance")

    # Get held positions to enable exits + avoid doubling up
    held = get_held_positions()
    if not quiet and held:
        print(f"📋 Already holding: {len(held)} position(s)")

    markets = fetch_weather_markets()
    if not markets:
        print("⚠️  No weather markets currently open.")
        return {"trades": 0, "opps": 0, "balance": balance_cents}

    if not quiet:
        print(f"\n🔍 {len(markets)} open weather markets found\n")

    trades, opps = 0, 0
    results = []

    for market in markets:
        if trades >= max_trades:
            break

        ticker  = market["ticker"]
        title   = market.get("title", "")[:65]
        yes_ask = market.get("yes_ask", 99)
        yes_bid = market.get("yes_bid", 0)
        no_ask  = market.get("no_ask", 99)

        if not quiet:
            print(f"📍 {ticker}")
            print(f"   {title}")
            print(f"   yes_ask={yes_ask}¢  yes_bid={yes_bid}¢  no_ask={no_ask}¢")

        result = evaluate_market(market)
        signal = result.get("signal")
        reason = result.get("reason", "")

        if signal in ("skip", "hold"):
            if not quiet:
                icon = "⏭️" if signal == "skip" else "💤"
                print(f"   {icon}  {signal.title()}: {reason}\n")
            continue

        # SELL_YES requires actually holding YES; skip if we don't
        if signal == "sell_yes" and (not existing or existing_pos <= 0):
            if not quiet:
                print(f"   ⏭️  SELL_YES but no YES position held, skipping.\n")
            continue

        opps += 1
        side   = result.get("side", "yes")
        price  = result.get("price", yes_ask)
        edge   = result.get("edge", 0)

        if not quiet:
            print(f"   💡 [{signal.upper()}] edge={edge}¢ — {reason}")

        existing = held.get(ticker)
        existing_pos = existing.get("position", 0) if existing else 0
        # existing_pos > 0 → long YES contracts, < 0 → long NO contracts

        # ── Exit logic: model flipped, bail out of losing position ────────────
        if existing and not no_safeguards:
            # We hold YES but model says buy_no → sell our YES
            if existing_pos > 0 and signal == "buy_no":
                yes_bid = market.get("yes_bid", 0)
                if yes_bid > 0:
                    sell_count = existing_pos
                    if not quiet:
                        print(f"   ↩️  MODEL FLIP: Exiting {sell_count}x YES @ {yes_bid}¢ (model now says NO)")
                    order = place_order(ticker, "yes", "sell", sell_count, yes_bid, live)
                    if not order.get("dry_run") and not order.get("error"):
                        trades += 1
                        held.pop(ticker, None)
                        print(f"   ✅ Exit YES: {order.get('order_id','?')} status={order.get('status','?')}")
                    elif order.get("dry_run"):
                        print(f"   [DRY RUN] Exit YES: {sell_count}x @ {yes_bid}¢")
                continue

            # We hold NO but model now says buy_yes (strong YES signal) → exit NO if we can get anything
            if existing_pos < 0 and signal == "buy_yes":
                no_bid = market.get("no_bid", market.get("yes_ask", 1))
                no_bid_actual = 100 - market.get("yes_ask", 99)  # NO bid ≈ 100 - yes_ask
                held_no = abs(existing_pos)
                if no_bid_actual > 0:
                    if not quiet:
                        print(f"   ↩️  MODEL FLIP: Exiting {held_no}x NO @ {no_bid_actual}¢ (model now says YES wins)")
                    order = place_order(ticker, "no", "sell", held_no, no_bid_actual, live)
                    if not order.get("dry_run") and not order.get("error"):
                        trades += 1
                        held.pop(ticker, None)
                        balance_cents += held_no * no_bid_actual
                        print(f"   ✅ Exit NO: {order.get('order_id','?')} status={order.get('status','?')}")
                    elif order.get("dry_run"):
                        print(f"   [DRY RUN] Exit NO: {held_no}x @ {no_bid_actual}¢")
                continue

            # Same direction as our existing position — don't double up
            if (existing_pos > 0 and signal == "buy_yes") or (existing_pos < 0 and signal == "buy_no"):
                if not quiet:
                    print(f"   ⏭️  Already in this position, skipping.\n")
                continue

        # Size the trade
        count = smart_size(balance_cents, price, edge)
        cost  = count * price

        if not quiet:
            print(f"   📊 {('buy' if 'buy' in signal else 'sell').upper()} {count}x {side.upper()} @ {price}¢ = ${cost/100:.2f}")

        # Safeguard: balance check for buys
        if "buy" in signal and not no_safeguards and cost > balance_cents:
            if not quiet:
                print(f"   🛡️  Insufficient balance (${balance_cents/100:.2f} available)\n")
            continue

        action = "buy" if "buy" in signal else "sell"
        order = place_order(ticker, side, action, count, price, live)

        if order.get("dry_run"):
            if not quiet:
                print(f"   [DRY RUN] {json.dumps({k:v for k,v in order.items() if k!='dry_run'})}")
        elif order.get("error"):
            print(f"   ❌ Order error {order['error']}: {order.get('detail','')[:100]}")
        else:
            trades += 1
            balance_cents -= cost  # update local tracker
            # Track newly opened position (+count for YES, -count for NO)
            held[ticker] = {"position": count if side == "yes" else -count}
            oid = order.get("order_id", "?")
            status = order.get("status", "?")
            print(f"   ✅ Order {oid} | status={status} | {count}x {side.upper()} @ {price}¢")
            results.append({"ticker": ticker, "side": side, "action": action,
                            "count": count, "price": price, "order_id": oid})

        if not quiet:
            print()

    print(f"\n📊 Summary [{timestamp}]:")
    print(f"   Markets scanned : {len(markets)}")
    print(f"   Opportunities   : {opps}")
    print(f"   Trades {'executed' if live else '(dry run)'}: {trades}")
    print(f"   Balance now     : ${balance_cents/100:.2f}")

    return {"trades": trades, "opps": opps, "balance": balance_cents, "results": results}


def show_positions(quiet=False):
    r = kget("/trade-api/v2/portfolio/positions")
    if not r.ok:
        print("Failed to fetch positions")
        return
    positions = r.json().get("market_positions", [])
    active = [p for p in positions if p.get("position", 0) != 0]
    print(f"\n📋 Open Positions ({len(active)}):")
    if not active:
        print("   (none)")
        return
    for p in active:
        print(f"  {p['ticker']}: pos={p['position']} | exposure=${p.get('market_exposure_dollars','?')} | pnl=${p.get('realized_pnl_dollars','?')}")


def show_config():
    print("⚙️  Kalshi Weather Trader v2 Config:")
    print(f"   BASE_URL     : {BASE_URL}")
    print(f"   API_KEY      : {API_KEY_ID}")
    print(f"   ENTRY        : {ENTRY_THRESHOLD}¢")
    print(f"   EXIT         : {EXIT_THRESHOLD}¢")
    print(f"   MAX_POSITION : ${MAX_POSITION_CENTS/100:.2f}")
    print(f"   SIZING_PCT   : {SIZING_PCT*100:.0f}% of balance")
    print(f"   MAX_TRADES   : {MAX_TRADES}")
    print(f"   SERIES       : {', '.join(WEATHER_SERIES)}")
    print(f"   CITIES       : {', '.join(CITIES.keys())}")


# ─── CLI ────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Kalshi Weather Trader v2")
    parser.add_argument("--live",          action="store_true")
    parser.add_argument("--positions",     action="store_true")
    parser.add_argument("--config",        action="store_true")
    parser.add_argument("--quiet",         action="store_true")
    parser.add_argument("--no-safeguards", action="store_true")
    parser.add_argument("--max-trades",    type=int, default=MAX_TRADES)
    args = parser.parse_args()

    if args.config:
        show_config()
    elif args.positions:
        show_positions(args.quiet)
    else:
        run(live=args.live, quiet=args.quiet,
            no_safeguards=args.no_safeguards, max_trades=args.max_trades)
