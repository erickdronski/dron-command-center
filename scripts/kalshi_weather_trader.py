#!/usr/bin/env python3
"""
🌡️ Kalshi Weather Trader v3 — full daily + monthly coverage
gopfan2-style: NOAA + Open-Meteo vs Kalshi daily high/low/bucket markets.

Covers 150+ daily markets across 20 cities:
  Daily high temp   : KXHIGHT{CITY}-{DATE}-{T|B}{THRESHOLD}
  Daily low temp    : KXLOWT{CITY}-{DATE}-{T|B}{THRESHOLD}
  Monthly snow      : KXSLCSNOWM, KXLAXSNOWM, etc.
  Monthly rain      : KXRAINHOUM, KXRAINCHIM, etc.
  Multi-city combos : KXCITIESWEATHER
"""

import argparse, base64, datetime, json, os, re, sys, uuid
from typing import Optional

# Shared state coordination with Price Farmer
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from kalshi_shared_state import KalshiState
_state = KalshiState()
BOT_NAME = "weather_trader"
import requests
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding

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

# Strategy params
ENTRY_THRESHOLD    = int(os.environ.get("KALSHI_ENTRY",    "15"))   # buy when price ≤ this
EXIT_THRESHOLD     = int(os.environ.get("KALSHI_EXIT",     "70"))   # sell when bid ≥ this
MAX_POSITION_CENTS = int(os.environ.get("KALSHI_MAX_POS",  "300"))  # max spend per trade (cents)
SIZING_PCT         = float(os.environ.get("KALSHI_SIZING", "0.04")) # % of balance per trade
MAX_TRADES         = int(os.environ.get("KALSHI_MAX_TRADES","20"))
MIN_TIME_HOURS     = float(os.environ.get("KALSHI_MIN_HRS", "1.5")) # skip if resolves < this soon
MIN_EDGE_CENTS     = int(os.environ.get("KALSHI_MIN_EDGE",  "3"))   # minimum edge to trade

# ─── City registry ───────────────────────────────────────────────────────────
# Maps ticker city codes → Open-Meteo lat/lon + NOAA grid
CITIES = {
    "ATL":  {"lat": 33.749, "lon": -84.388, "tz": "America/New_York",     "noaa": ("FFC",52,88)},
    "AUS":  {"lat": 30.267, "lon": -97.743, "tz": "America/Chicago",      "noaa": ("EWX",156,89)},
    "BOS":  {"lat": 42.360, "lon": -71.058, "tz": "America/New_York",     "noaa": ("BOX",64,34)},
    "CHI":  {"lat": 41.850, "lon": -87.650, "tz": "America/Chicago",      "noaa": ("LOT",76,73)},
    "DAL":  {"lat": 32.783, "lon": -96.800, "tz": "America/Chicago",      "noaa": ("FWD",85,82)},
    "DC":   {"lat": 38.907, "lon": -77.037, "tz": "America/New_York",     "noaa": ("LWX",97,70)},
    "DEN":  {"lat": 39.739, "lon": -104.984,"tz": "America/Denver",       "noaa": ("BOU",57,62)},
    "DFW":  {"lat": 32.783, "lon": -96.800, "tz": "America/Chicago",      "noaa": ("FWD",85,82)},
    "HOU":  {"lat": 29.760, "lon": -95.370, "tz": "America/Chicago",      "noaa": ("HGX",70,97)},
    "JAC":  {"lat": 43.480, "lon": -110.762,"tz": "America/Denver",       "noaa": ("RIW",37,88)},
    "LA":   {"lat": 34.052, "lon": -118.243,"tz": "America/Los_Angeles",  "noaa": ("LOX",151,48)},
    "LAX":  {"lat": 34.052, "lon": -118.243,"tz": "America/Los_Angeles",  "noaa": ("LOX",151,48)},
    "LV":   {"lat": 36.175, "lon": -115.137,"tz": "America/Los_Angeles",  "noaa": ("VEF",40,36)},
    "MIA":  {"lat": 25.774, "lon": -80.194, "tz": "America/New_York",     "noaa": ("MFL",110,37)},
    "MIN":  {"lat": 44.980, "lon": -93.270, "tz": "America/Chicago",      "noaa": ("MPX",107,70)},
    "NOLA": {"lat": 29.951, "lon": -90.075, "tz": "America/Chicago",      "noaa": ("LIX",71,90)},
    "NYC":  {"lat": 40.713, "lon": -74.006, "tz": "America/New_York",     "noaa": ("OKX",33,37)},
    "NY":   {"lat": 40.713, "lon": -74.006, "tz": "America/New_York",     "noaa": ("OKX",33,37)},
    "OKC":  {"lat": 35.467, "lon": -97.516, "tz": "America/Chicago",      "noaa": ("OUN",84,62)},
    "PHIL": {"lat": 39.952, "lon": -75.165, "tz": "America/New_York",     "noaa": ("PHI",49,68)},
    "PHX":  {"lat": 33.448, "lon": -112.074,"tz": "America/Phoenix",      "noaa": ("PSR",159,57)},
    "SATX": {"lat": 29.424, "lon": -98.494, "tz": "America/Chicago",      "noaa": ("EWX",175,84)},
    "SEA":  {"lat": 47.608, "lon": -122.335,"tz": "America/Los_Angeles",  "noaa": ("SEW",124,69)},
    "SFO":  {"lat": 37.774, "lon": -122.419,"tz": "America/Los_Angeles",  "noaa": ("MTR",94,82)},
    "SLC":  {"lat": 40.760, "lon": -111.891,"tz": "America/Denver",       "noaa": ("SLC",100,100)},
}

# Series → (city_code, metric: "high"|"low"|"rain")
SERIES_MAP = {
    # Daily high temp
    "KXHIGHTATL":    ("ATL",  "high"),
    "KXHIGHAUS":     ("AUS",  "high"),
    "KXHIGHTBOS":    ("BOS",  "high"),
    "KXHIGHCHI":     ("CHI",  "high"),
    "KXHIGHTCHI":    ("CHI",  "high"),   # duplicate series same city
    "KXHIGHTDAL":    ("DAL",  "high"),
    "KXHIGHTDC":     ("DC",   "high"),
    "KXHIGHTEMPDEN": ("DEN",  "high"),
    "KXHIGHDEN":     ("DEN",  "high"),
    "KXHIGHTHOU":    ("HOU",  "high"),
    "KXHIGHHOU":     ("HOU",  "high"),
    "KXHIGHLAX":     ("LA",   "high"),
    "KXHIGHTLV":     ("LV",   "high"),
    "KXHIGHMIA":     ("MIA",  "high"),
    "KXHIGHTMIN":    ("MIN",  "high"),
    "KXHIGHTNOLA":   ("NOLA", "high"),
    "KXHIGHNY":      ("NYC",  "high"),
    "KXHIGHNY0":     ("NYC",  "high"),
    "KXHIGHTOKC":    ("OKC",  "high"),
    "KXHIGHTPHX":    ("PHX",  "high"),
    "KXHIGHPHIL":    ("PHIL", "high"),
    "KXHIGHTSATX":   ("SATX", "high"),
    "KXHIGHTSEA":    ("SEA",  "high"),
    "KXHIGHTSFO":    ("SFO",  "high"),
    # Daily low temp
    "KXLOWTAUS":     ("AUS",  "low"),
    "KXLOWTCHI":     ("CHI",  "low"),
    "KXLOWCHI":      ("CHI",  "low"),
    "KXLOWTDEN":     ("DEN",  "low"),
    "KXLOWTLAX":     ("LA",   "low"),
    "KXLOWTMIA":     ("MIA",  "low"),
    "KXLOWTNYC":     ("NYC",  "low"),
    "KXLOWNYC":      ("NYC",  "low"),
    "KXLOWTPHIL":    ("PHIL", "low"),
    "KXLOWPHIL":     ("PHIL", "low"),
    # Monthly snow
    "KXLAXSNOWM":    ("LA",   "snow_monthly"),
    "KXSLCSNOWM":    ("SLC",  "snow_monthly"),
    "KXJACWSNOWM":   ("JAC",  "snow_monthly"),
    "KXCHISNOWM":    ("CHI",  "snow_monthly"),
    "KXCHISNOWXMAS": ("CHI",  "snow_monthly"),
    "KXDENSNOWM":    ("DEN",  "snow_monthly"),
    "KXDENSNOWXMAS": ("DEN",  "snow_monthly"),
    "KXBOSSNOWM":    ("BOS",  "snow_monthly"),
    "KXNYCSNOWM":    ("NYC",  "snow_monthly"),
    "KXSEASNOWM":    ("SEA",  "snow_monthly"),
    "KXDALSNOWM":    ("DAL",  "snow_monthly"),
    "KXHOUSNOWM":    ("HOU",  "snow_monthly"),
    "KXPHILSNOWM":   ("PHIL", "snow_monthly"),
    # Monthly rain
    "KXRAINHOUM":    ("HOU",  "rain_monthly"),
    "KXRAINCHIM":    ("CHI",  "rain_monthly"),
    "KXRAINNYCM":    ("NYC",  "rain_monthly"),
    "KXRAINNYC":     ("NYC",  "rain_daily"),
    "KXRAINSEAM":    ("SEA",  "rain_monthly"),
    "KXRAINLAXM":    ("LA",   "rain_monthly"),
    "KXRAINDENM":    ("DEN",  "rain_monthly"),
    "KXRAINMIAM":    ("MIA",  "rain_monthly"),
    "KXRAINAUSM":    ("AUS",  "rain_monthly"),
    "KXRAINDALM":    ("DAL",  "rain_monthly"),
    "KXRAINSFOM":    ("SFO",  "rain_monthly"),
    # Multi-city combos
    "KXCITIESWEATHER": ("MULTI", "high"),
}

ALL_SERIES = list(SERIES_MAP.keys())

# Monthly climatology: avg snowfall (inches) & rain (inches) by city/month
SNOW_CLIMO = {
    "SLC":  {1:13.0,2:10.5,3:7.5, 4:2.0,  11:5.0, 12:11.0},
    "JAC":  {1:40.0,2:35.0,3:20.0,12:35.0,11:18.0},
    "CHI":  {1:11.0,2:8.5, 3:4.0, 12:9.0, 11:2.0},
    "DEN":  {1:8.0, 2:8.0, 3:9.5, 12:8.0, 11:5.0},
    "LA":   {1:0.0, 2:0.0, 3:0.0, 12:0.0},
    "NYC":  {1:7.5, 2:8.0, 3:3.5, 12:5.5},
    "BOS":  {1:13.0,2:12.0,3:6.0, 12:9.0},
    "SEA":  {1:2.0, 2:1.5, 3:0.5, 12:2.0},
    "DAL":  {1:1.0, 2:0.8, 3:0.2, 12:0.8},
    "HOU":  {1:0.1, 2:0.1, 3:0.0, 12:0.1},
    "PHIL": {1:6.0, 2:5.5, 3:2.5, 12:4.0},
}
RAIN_CLIMO = {  # avg monthly inches
    "NYC":  {1:3.5,2:3.0,3:4.1,4:4.2,5:4.5,6:4.2,7:4.5,8:4.1,9:3.8,10:3.6,11:3.4,12:3.7},
    "HOU":  {1:3.6,2:3.0,3:3.5,4:3.5,5:5.2,6:5.5,7:3.5,8:4.0,9:5.3,10:4.4,11:4.4,12:3.9},
    "CHI":  {1:1.7,2:1.5,3:2.7,4:3.6,5:3.5,6:3.6,7:3.7,8:4.1,9:3.3,10:2.6,11:2.9,12:2.2},
    "SEA":  {1:5.6,2:3.5,3:3.8,4:2.8,5:2.2,6:1.7,7:0.6,8:1.0,9:1.6,10:3.5,11:5.9,12:5.6},
    "LA":   {1:3.0,2:3.5,3:2.5,4:0.7,5:0.2,6:0.1,7:0.0,8:0.0,9:0.2,10:0.5,11:1.4,12:2.4},
    "DEN":  {1:0.5,2:0.5,3:1.3,4:1.7,5:2.4,6:1.7,7:2.0,8:1.7,9:1.1,10:1.0,11:0.7,12:0.5},
    "MIA":  {1:1.9,2:2.2,3:2.5,4:3.0,5:6.2,6:9.8,7:6.7,8:9.1,9:8.9,10:5.6,11:2.8,12:2.0},
    "AUS":  {1:1.6,2:2.1,3:2.4,4:2.4,5:4.0,6:3.7,7:2.0,8:2.2,9:3.4,10:3.5,11:2.5,12:2.0},
    "DAL":  {1:1.8,2:2.1,3:2.8,4:3.1,5:4.5,6:3.3,7:2.3,8:2.2,9:3.6,10:3.6,11:2.8,12:2.0},
    "SFO":  {1:4.4,2:3.2,3:3.0,4:1.5,5:0.7,6:0.2,7:0.0,8:0.0,9:0.3,10:1.2,11:2.9,12:4.0},
    "PHIL": {1:3.2,2:2.7,3:3.9,4:3.7,5:4.2,6:3.9,7:4.4,8:4.3,9:3.7,10:3.0,11:3.1,12:3.4},
}

MONTH_MAP = {"JAN":1,"FEB":2,"MAR":3,"APR":4,"MAY":5,"JUN":6,
             "JUL":7,"AUG":8,"SEP":9,"OCT":10,"NOV":11,"DEC":12}

# ─── Auth ────────────────────────────────────────────────────────────────────

_pk = None
def get_key():
    global _pk
    if _pk is None:
        pem = PRIVATE_KEY_PEM.strip()
        data = open(pem,"rb").read() if os.path.isfile(pem) else pem.encode()
        _pk = serialization.load_pem_private_key(data, password=None, backend=default_backend())
    return _pk

def _auth_headers(method, path):
    ts = str(int(datetime.datetime.now().timestamp() * 1000))
    msg = f"{ts}{method}{path.split('?')[0]}".encode()
    sig = get_key().sign(msg, padding.PSS(mgf=padding.MGF1(hashes.SHA256()),
                        salt_length=padding.PSS.DIGEST_LENGTH), hashes.SHA256())
    return {"KALSHI-ACCESS-KEY": API_KEY_ID,
            "KALSHI-ACCESS-TIMESTAMP": ts,
            "KALSHI-ACCESS-SIGNATURE": base64.b64encode(sig).decode(),
            "Content-Type": "application/json"}

def kget(path, params=None):
    full = path + ("?"+"&".join(f"{k}={v}" for k,v in params.items()) if params else "")
    return requests.get(BASE_URL+full, headers=_auth_headers("GET", path), timeout=15)

def kpost(path, data):
    return requests.post(BASE_URL+path, headers=_auth_headers("POST", path), json=data, timeout=15)


# ─── Open-Meteo forecast cache ───────────────────────────────────────────────

_om_cache = {}

def _fetch_openmeteo(city_code: str) -> Optional[dict]:
    c = CITIES.get(city_code)
    if not c:
        return None
    if city_code in _om_cache:
        return _om_cache[city_code]
    try:
        r = requests.get("https://api.open-meteo.com/v1/forecast", params={
            "latitude":  c["lat"], "longitude": c["lon"],
            "daily": ("temperature_2m_max,temperature_2m_min,"
                      "precipitation_sum,snowfall_sum,precipitation_probability_max,"
                      "weathercode"),
            "hourly": "precipitation_probability,temperature_2m",
            "temperature_unit": "fahrenheit",
            "precipitation_unit": "inch",
            "timezone": c.get("tz", "auto"),
            "forecast_days": 16,
        }, timeout=12)
        if r.ok:
            _om_cache[city_code] = r.json()
            return _om_cache[city_code]
    except Exception:
        pass
    return None


def get_daily_forecast(city_code: str, target_date: datetime.date) -> dict:
    """
    Returns full daily forecast dict for a city/date.
    Keys: high, low, snow_in, precip_in, precip_pct, source
    """
    om = _fetch_openmeteo(city_code)
    if om:
        daily = om.get("daily", {})
        dates = daily.get("time", [])
        for i, d in enumerate(dates):
            if d == target_date.isoformat():
                return {
                    "high":       _safe(daily.get("temperature_2m_max"), i),
                    "low":        _safe(daily.get("temperature_2m_min"), i),
                    "snow_in":    _safe(daily.get("snowfall_sum"), i, 0.0),
                    "precip_in":  _safe(daily.get("precipitation_sum"), i, 0.0),
                    "precip_pct": _safe(daily.get("precipitation_probability_max"), i, 0),
                    "source":     "open-meteo-16d",
                }
    # Fallback NOAA
    c = CITIES.get(city_code)
    if c:
        try:
            office, gx, gy = c["noaa"]
            url = f"https://api.weather.gov/gridpoints/{office}/{gx},{gy}/forecast"
            r = requests.get(url, headers={"User-Agent":"kalshi-wx/3.0"}, timeout=10)
            if r.ok:
                for p in r.json().get("properties",{}).get("periods",[]):
                    if p.get("startTime","")[:10] == target_date.isoformat():
                        val = {"source": "noaa-7d"}
                        if p.get("isDaytime"):
                            val["high"] = float(p["temperature"])
                        else:
                            val["low"] = float(p["temperature"])
                        return val
        except Exception:
            pass
    return {}

def _safe(lst, i, default=None):
    try:
        v = lst[i]
        return default if v is None else v
    except Exception:
        return default


# ─── Ticker parser ───────────────────────────────────────────────────────────

def parse_ticker(ticker: str, series: str) -> Optional[dict]:
    """
    Parse a daily/monthly weather market ticker.
    Returns dict with: date, metric, kind, threshold, bucket_lo, bucket_hi, direction
    """
    # Daily markets: KXHIGHTHOU-26FEB20-T85 or KXHIGHTHOU-26FEB20-B84.5
    date_m = re.search(r'(\d{2})([A-Z]{3})(\d{2})(?!\d)', ticker)
    if date_m:
        try:
            yr = int("20"+date_m.group(1))
            mo = MONTH_MAP[date_m.group(2)]
            dy = int(date_m.group(3))
            target_date = datetime.date(yr, mo, dy)
        except Exception:
            return None

        rest = ticker[date_m.end():]  # e.g. -T85 or -B84.5 or -T78

        # Bucket: B84.5 → 84-85°F range
        bkt = re.search(r'-B([\d.]+)$', rest)
        if bkt:
            lo = float(bkt.group(1))
            hi = round(lo + 1.0, 1)
            return {"date": target_date, "kind": "bucket",
                    "bucket_lo": lo, "bucket_hi": hi, "threshold": None, "direction": None}

        # Threshold: T85 or T78 (need title or series context for above/below)
        thr = re.search(r'-T([\d.]+)$', rest)
        if thr:
            threshold = float(thr.group(1))
            # Figure out direction from title or position in series
            # Convention Kalshi uses: larger T values are typically "above", smaller are "below"
            # We'll mark as "unknown" and resolve in evaluate_market using title
            return {"date": target_date, "kind": "threshold",
                    "threshold": threshold, "direction": "unknown",
                    "bucket_lo": None, "bucket_hi": None}

    # Monthly markets: KXSLCSNOWM-26FEB-1.0 or KXRAINHOUM-26FEB-7
    month_m = re.search(r'(\d{2})([A-Z]{3})(?![\d])', ticker)
    thresh_m = re.search(r'-([\d.]+)$', ticker)
    if month_m and thresh_m:
        try:
            yr = int("20"+month_m.group(1))
            mo = MONTH_MAP[month_m.group(2)]
            threshold = float(thresh_m.group(1))
            return {"date": datetime.date(yr, mo, 1), "kind": "monthly",
                    "threshold": threshold, "direction": None,
                    "bucket_lo": None, "bucket_hi": None}
        except Exception:
            pass

    return None


def resolve_direction(title: str, threshold: float) -> str:
    """Determine above/below from market title string."""
    t = title.lower()
    if ">"+str(int(threshold)) in t or f">{threshold}" in t or " above" in t or ">=" in t:
        return "above"
    if "<"+str(int(threshold)) in t or f"<{threshold}" in t or " below" in t or "<=" in t:
        return "below"
    # Heuristic fallback: if NOAA typical for city is higher than threshold, it might be above
    return "above"  # default


# ─── Signal engine ───────────────────────────────────────────────────────────

def evaluate_daily_temp(market: dict, parsed: dict, city_code: str, metric: str) -> dict:
    """
    Core gopfan2 signal: compare NOAA/OM forecast to market threshold/bucket.
    Returns {signal, side, price, edge, reason}
    """
    yes_ask = market.get("yes_ask", 99)
    yes_bid = market.get("yes_bid", 0)
    no_ask  = market.get("no_ask", 99)
    title   = market.get("title", "")
    target_date = parsed["date"]
    today = datetime.date.today()

    if target_date < today:
        return {"signal": "skip", "reason": "Date already passed"}

    fc = get_daily_forecast(city_code, target_date)
    if not fc:
        return {"signal": "skip", "reason": f"No forecast for {city_code} {target_date}"}

    noaa_val = fc.get("high") if metric == "high" else fc.get("low")
    source   = fc.get("source", "?")

    if noaa_val is None:
        return {"signal": "skip", "reason": f"Missing {metric} temp from {source}"}

    days_out = (target_date - today).days
    # Confidence degrades beyond 7 days
    forecast_conf = "high" if days_out <= 2 else "medium" if days_out <= 7 else "low"

    kind = parsed["kind"]

    # ── Bucket market (84-85°F range) ─────────────────────────────────────
    if kind == "bucket":
        lo = parsed["bucket_lo"]
        hi = parsed["bucket_hi"]
        in_bucket = lo <= noaa_val < hi

        if in_bucket and forecast_conf != "low":
            edge = ENTRY_THRESHOLD - yes_ask
            if yes_ask <= ENTRY_THRESHOLD:
                return {"signal": "buy_yes", "side": "yes", "price": yes_ask, "edge": edge,
                        "reason": f"NOAA {metric}={noaa_val:.0f}°F → IN bucket {lo:.0f}-{hi:.0f}°F. YES at {yes_ask}¢. [{source}, {forecast_conf} conf, {days_out}d out]"}
        elif not in_bucket and no_ask <= ENTRY_THRESHOLD:
            edge = ENTRY_THRESHOLD - no_ask
            return {"signal": "buy_no", "side": "no", "price": no_ask, "edge": edge,
                    "reason": f"NOAA {metric}={noaa_val:.0f}°F → OUT of bucket {lo:.0f}-{hi:.0f}°F. NO at {no_ask}¢. [{source}]"}

        if yes_bid >= EXIT_THRESHOLD and in_bucket:
            return {"signal": "sell_yes", "side": "yes", "price": yes_bid,
                    "reason": f"YES bid {yes_bid}¢ hit exit. NOAA {noaa_val:.0f}°F in bucket."}

        return {"signal": "hold", "reason": f"NOAA {metric}={noaa_val:.0f}°F vs {lo:.0f}-{hi:.0f}°F bucket. yes_ask={yes_ask}¢"}

    # ── Threshold market (>X° or <X°) ─────────────────────────────────────
    if kind == "threshold":
        threshold = parsed["threshold"]
        direction = resolve_direction(title, threshold)
        noaa_wins_yes = (direction == "above" and noaa_val > threshold) or \
                        (direction == "below" and noaa_val < threshold)
        sym = ">" if direction == "above" else "<"

        # Calculate implied probability from NOAA confidence + distance from threshold
        temp_delta = abs(noaa_val - threshold)
        # Strong signal: delta > 5°F; medium: 2-5°F; weak: < 2°F
        conf_mult = 1.0 if temp_delta > 5 else (0.7 if temp_delta > 2 else 0.4)
        signal_strong = conf_mult * (1.0 if forecast_conf == "high" else 0.7 if forecast_conf == "medium" else 0.5) > 0.5

        if noaa_wins_yes:
            if yes_ask <= ENTRY_THRESHOLD and signal_strong:
                edge = ENTRY_THRESHOLD - yes_ask
                return {"signal": "buy_yes", "side": "yes", "price": yes_ask, "edge": edge,
                        "reason": f"NOAA {metric}={noaa_val:.0f}°F {sym}{threshold:.0f}°F → YES likely. YES at {yes_ask}¢ (Δ={temp_delta:.0f}°F). [{source}, {forecast_conf}]"}
            elif yes_bid >= EXIT_THRESHOLD:
                return {"signal": "sell_yes", "side": "yes", "price": yes_bid,
                        "reason": f"YES at {yes_bid}¢ bid — exit. NOAA {noaa_val:.0f}°F confirmed."}
        else:
            if no_ask <= ENTRY_THRESHOLD and signal_strong:
                edge = ENTRY_THRESHOLD - no_ask
                return {"signal": "buy_no", "side": "no", "price": no_ask, "edge": edge,
                        "reason": f"NOAA {metric}={noaa_val:.0f}°F NOT {sym}{threshold:.0f}°F → NO. NO at {no_ask}¢ (Δ={temp_delta:.0f}°F). [{source}, {forecast_conf}]"}

        return {"signal": "hold",
                "reason": f"NOAA {metric}={noaa_val:.0f}°F vs threshold {sym}{threshold:.0f}°F (Δ={temp_delta:.0f}°F). No entry. yes_ask={yes_ask}¢ no_ask={no_ask}¢"}

    return {"signal": "skip", "reason": f"Unknown kind: {kind}"}


def evaluate_monthly_snow(market: dict, parsed: dict, city_code: str) -> dict:
    yes_ask = market.get("yes_ask", 99)
    yes_bid = market.get("yes_bid", 0)
    no_ask  = market.get("no_ask", 99)
    threshold = parsed["threshold"]
    target_date = parsed["date"]
    month, year = target_date.month, target_date.year

    today = datetime.date.today()
    days_in_month = 28 if month == 2 else (30 if month in [4,6,9,11] else 31)
    if year == today.year and month == today.month:
        days_remaining = days_in_month - today.day + 1
    elif datetime.date(year, month, 1) < today:
        return {"signal": "skip", "reason": "Month already ended"}
    else:
        days_remaining = days_in_month

    # Get Open-Meteo snow forecast for remaining days
    om = _fetch_openmeteo(city_code)
    forecast_snow = 0.0
    forecast_days = 0
    if om:
        daily = om.get("daily", {})
        dates  = daily.get("time", [])
        snow_f = daily.get("snowfall_sum", [])
        for i, d in enumerate(dates):
            pd = datetime.date.fromisoformat(d)
            if pd >= today and pd.month == month and pd.year == year:
                forecast_days += 1
                sf = snow_f[i] if i < len(snow_f) and snow_f[i] is not None else 0
                forecast_snow += sf

    # Climo supplement for uncovered days
    climo = SNOW_CLIMO.get(city_code, {}).get(month)
    days_uncovered = max(0, days_remaining - forecast_days)
    climo_supplement = climo * (days_uncovered / days_in_month) if climo else 0
    blended = forecast_snow + climo_supplement
    conf = "high" if forecast_days >= days_remaining else "medium" if forecast_days >= 5 else "low"

    detail = (f"OM:{forecast_snow:.1f}\"/{forecast_days}d + "
              f"climo:{climo_supplement:.1f}\"/{days_uncovered}d = "
              f"blended:{blended:.1f}\" vs {threshold}\" ({days_remaining}d left) [{conf}]")

    # Only trade monthly snow when forecast clearly resolves the question:
    # - Forecast covers most of the remaining month (high conf)
    # - Blended estimate is far enough from threshold to be actionable
    if blended >= threshold * 1.5 and conf == "high":
        # NOAA says 50%+ above threshold — YES is likely
        if yes_ask <= ENTRY_THRESHOLD:
            return {"signal": "buy_yes", "side": "yes", "price": yes_ask, "edge": ENTRY_THRESHOLD - yes_ask,
                    "reason": f"Snow likely (blended {blended:.1f}\" >> {threshold}\"): {detail}"}
        elif yes_bid >= EXIT_THRESHOLD:
            return {"signal": "sell_yes", "side": "yes", "price": yes_bid, "reason": f"Exit YES. {detail}"}
    elif blended <= threshold * 0.3 and conf == "high":
        # NOAA says less than 30% of threshold — NO is very likely
        if no_ask <= ENTRY_THRESHOLD:
            return {"signal": "buy_no", "side": "no", "price": no_ask, "edge": ENTRY_THRESHOLD - no_ask,
                    "reason": f"Snow very unlikely (blended {blended:.1f}\" << {threshold}\"): {detail}"}

    # No data backing → hold. Don't bet on extreme snow unless forecast actually supports it.
    return {"signal": "hold", "reason": f"No strong signal. {detail}"}


def evaluate_monthly_rain(market: dict, parsed: dict, city_code: str) -> dict:
    yes_ask = market.get("yes_ask", 99)
    yes_bid = market.get("yes_bid", 0)
    no_ask  = market.get("no_ask", 99)
    threshold = parsed["threshold"]
    target_date = parsed["date"]
    month, year = target_date.month, target_date.year
    today = datetime.date.today()

    days_in_month = 28 if month == 2 else (30 if month in [4,6,9,11] else 31)
    if year == today.year and month == today.month:
        days_remaining = days_in_month - today.day + 1
    elif datetime.date(year, month, 1) < today:
        return {"signal": "skip", "reason": "Month already ended"}
    else:
        days_remaining = days_in_month

    om = _fetch_openmeteo(city_code)
    forecast_rain = 0.0
    forecast_days = 0
    if om:
        daily = om.get("daily", {})
        for i, d in enumerate(daily.get("time",[])):
            pd = datetime.date.fromisoformat(d)
            if pd >= today and pd.month == month and pd.year == year:
                forecast_days += 1
                prec = _safe(daily.get("precipitation_sum"), i, 0.0)
                forecast_rain += prec

    climo = RAIN_CLIMO.get(city_code, {}).get(month)
    days_uncovered = max(0, days_remaining - forecast_days)
    climo_supplement = climo * (days_uncovered / days_in_month) if climo else 0
    blended = forecast_rain + climo_supplement
    conf = "high" if forecast_days >= days_remaining else "medium" if forecast_days >= 5 else "low"

    # Rain threshold markets: "Will Houston get >7 rainy days in Feb?"
    # threshold = # of rain days, blended = estimated rain days (rough: each inch ~ 1 rainy day)
    # Use precip_pct from OM as proxy
    rain_day_est = 0
    if om:
        daily = om.get("daily", {})
        for i, d in enumerate(daily.get("time",[])):
            pd = datetime.date.fromisoformat(d)
            if pd >= today and pd.month == month and pd.year == year:
                pp = _safe(daily.get("precipitation_probability_max"), i, 0)
                if pp and pp > 40:
                    rain_day_est += 1

    detail = (f"OM:{forecast_rain:.1f}\" rain ({forecast_days}d) | {rain_day_est} rain-day(s) forecast | "
              f"climo blend:{blended:.1f}\" vs threshold:{threshold} rain-days [{conf}]")

    # Strong signal
    if rain_day_est >= threshold * 1.3 and conf != "low" and yes_ask <= ENTRY_THRESHOLD:
        return {"signal": "buy_yes", "side": "yes", "price": yes_ask, "edge": ENTRY_THRESHOLD - yes_ask,
                "reason": f"Rain days likely: {detail}"}
    elif rain_day_est <= threshold * 0.4 and conf != "low" and no_ask <= ENTRY_THRESHOLD:
        return {"signal": "buy_no", "side": "no", "price": no_ask, "edge": ENTRY_THRESHOLD - no_ask,
                "reason": f"Rain days unlikely: {detail}"}
    elif yes_bid >= EXIT_THRESHOLD:
        return {"signal": "sell_yes", "side": "yes", "price": yes_bid, "reason": f"Exit YES. {detail}"}

    return {"signal": "hold", "reason": detail}


def evaluate_rain_daily(market: dict, parsed: dict, city_code: str) -> dict:
    yes_ask = market.get("yes_ask", 99)
    yes_bid = market.get("yes_bid", 0)
    no_ask  = market.get("no_ask", 99)
    target_date = parsed.get("date")
    if not target_date:
        return {"signal": "skip", "reason": "No date"}

    fc = get_daily_forecast(city_code, target_date)
    precip_pct = fc.get("precip_pct", 0)
    precip_in  = fc.get("precip_in", 0)
    source = fc.get("source", "?")

    # NOAA says rain likely → YES
    if precip_pct >= 70 and yes_ask <= ENTRY_THRESHOLD:
        return {"signal": "buy_yes", "side": "yes", "price": yes_ask, "edge": ENTRY_THRESHOLD - yes_ask,
                "reason": f"NOAA: {precip_pct}% rain prob, {precip_in:.2f}\" expected. YES at {yes_ask}¢. [{source}]"}
    elif precip_pct <= 20 and no_ask <= ENTRY_THRESHOLD:
        return {"signal": "buy_no", "side": "no", "price": no_ask, "edge": ENTRY_THRESHOLD - no_ask,
                "reason": f"NOAA: only {precip_pct}% rain prob. NO at {no_ask}¢. [{source}]"}
    elif yes_bid >= EXIT_THRESHOLD:
        return {"signal": "sell_yes", "side": "yes", "price": yes_bid, "reason": f"Rain confirmed exit at {yes_bid}¢"}

    return {"signal": "hold", "reason": f"Rain prob={precip_pct}%, precip={precip_in:.2f}\". yes_ask={yes_ask}¢ no_ask={no_ask}¢"}


def evaluate_market(market: dict) -> dict:
    """Master evaluation function — routes to the right evaluator."""
    ticker  = market.get("ticker", "")
    series  = market.get("series_ticker", "") or ""
    yes_ask = market.get("yes_ask", 99)
    yes_bid = market.get("yes_bid", 0)
    no_ask  = market.get("no_ask", 99)
    close_time = market.get("close_time", "")

    # Time decay guard
    if close_time:
        try:
            ct = datetime.datetime.fromisoformat(close_time.replace("Z","+00:00"))
            hrs = (ct - datetime.datetime.now(datetime.timezone.utc)).total_seconds()/3600
            if hrs < MIN_TIME_HOURS:
                return {"signal": "skip", "reason": f"Resolves in {hrs:.1f}h"}
        except Exception:
            pass

    # Identify series
    matched_series = None
    for s in SERIES_MAP:
        if series == s or ticker.startswith(s+"-") or ticker.startswith(s):
            matched_series = s
            break
    if not matched_series:
        return {"signal": "skip", "reason": f"Unknown series: {series}"}

    city_code, metric = SERIES_MAP[matched_series]
    parsed = parse_ticker(ticker, matched_series)
    if not parsed:
        return {"signal": "skip", "reason": "Could not parse ticker"}

    if metric == "high" or metric == "low":
        return evaluate_daily_temp(market, parsed, city_code, metric)
    elif metric == "snow_monthly":
        return evaluate_monthly_snow(market, parsed, city_code)
    elif metric == "rain_monthly":
        return evaluate_monthly_rain(market, parsed, city_code)
    elif metric == "rain_daily":
        return evaluate_rain_daily(market, parsed, city_code)
    else:
        return {"signal": "skip", "reason": f"Unhandled metric: {metric}"}


# ─── Market fetch ─────────────────────────────────────────────────────────────

def fetch_all_weather_markets() -> list[dict]:
    """Fetch all open markets from all weather series."""
    markets = []
    seen = set()
    for series in ALL_SERIES:
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


def get_held_positions() -> dict:
    r = kget("/trade-api/v2/portfolio/positions")
    if not r.ok:
        return {}
    result = {}
    for p in r.json().get("market_positions", []):
        pos = p.get("position", 0)
        if pos != 0 or p.get("resting_orders_count", 0) > 0:
            result[p["ticker"]] = p
    return result


# ─── Sizing ──────────────────────────────────────────────────────────────────

def smart_size(balance_cents: int, price_cents: int, edge: int) -> int:
    base = max(1, int(balance_cents * SIZING_PCT))
    # Scale with edge: 0-5¢ → 1x, 5-10¢ → 1.5x, 10+¢ → 2x
    mult = 2.0 if edge >= 10 else 1.5 if edge >= 5 else 1.0
    position_cents = min(int(base * mult), MAX_POSITION_CENTS)
    return max(1, position_cents // max(price_cents, 1))


# ─── Order ───────────────────────────────────────────────────────────────────

def place_order(ticker, side, action, count, price_cents, live) -> dict:
    if not live:
        return {"dry_run": True, "ticker": ticker, "side": side,
                "action": action, "count": count, "price_cents": price_cents}
    data = {"ticker": ticker, "action": action, "side": side, "count": count,
            "type": "limit", "client_order_id": str(uuid.uuid4())}
    if side == "yes":
        data["yes_price"] = price_cents
    else:
        data["no_price"] = price_cents
    r = kpost("/trade-api/v2/portfolio/orders", data)
    return r.json().get("order", {}) if r.ok else {"error": r.status_code, "detail": r.text[:200]}


# ─── Main ────────────────────────────────────────────────────────────────────

def run(live: bool, quiet: bool, no_safeguards: bool, max_trades: int):
    ts = datetime.datetime.now().strftime("%Y-%m-%d %H:%M ET")
    if not quiet:
        print(f"🌡️  Kalshi Weather Trader v3  [{ts}]")
        print("=" * 65)

    bal = kget("/trade-api/v2/portfolio/balance").json()
    balance_cents  = bal.get("balance", 0)
    portfolio_cents = bal.get("portfolio_value", 0)

    if not quiet:
        print(f"💰 Balance: ${balance_cents/100:.2f} | Portfolio: ${portfolio_cents/100:.2f}")
        print(f"⚙️  {'🔴 LIVE' if live else '🟡 DRY RUN'} | Entry≤{ENTRY_THRESHOLD}¢ | Exit≥{EXIT_THRESHOLD}¢ | Sizing:{SIZING_PCT*100:.0f}% | MaxPos:${MAX_POSITION_CENTS/100:.2f}")

    held = get_held_positions()
    if not quiet and held:
        print(f"📋 Holding {len(held)} position(s) already")

    if not quiet:
        print(f"\n🔍 Scanning {len(ALL_SERIES)} weather series for open markets...")

    markets = fetch_all_weather_markets()

    if not quiet:
        print(f"   → {len(markets)} open markets found\n")

    trades, opps = 0, 0
    results = []
    city_om_printed = set()  # avoid spammy repeat messages

    for market in markets:
        if trades >= max_trades:
            if not quiet:
                print(f"\n⛔ Max trades ({max_trades}) reached.")
            break

        ticker  = market["ticker"]
        title   = market.get("title", "")[:60]
        yes_ask = market.get("yes_ask", 99)
        yes_bid = market.get("yes_bid", 0)
        no_ask  = market.get("no_ask", 99)

        result = evaluate_market(market)
        signal = result.get("signal")
        reason = result.get("reason", "")

        if signal in ("skip", "hold"):
            if not quiet and signal == "hold":
                print(f"  💤 {ticker} | {reason[:80]}")
            continue

        # SELL_YES without holding YES → skip
        existing = held.get(ticker)
        existing_pos = existing.get("position", 0) if existing else 0
        if signal == "sell_yes" and existing_pos <= 0:
            continue

        opps += 1
        side   = result.get("side", "yes")
        price  = result.get("price", yes_ask)
        edge   = result.get("edge", 0)

        if edge < MIN_EDGE_CENTS and signal.startswith("buy"):
            if not quiet:
                print(f"  ⚡ {ticker} | Edge {edge}¢ below minimum {MIN_EDGE_CENTS}¢, skip")
            continue

        # Dedup: same direction as existing position
        if existing:
            if (existing_pos > 0 and signal == "buy_yes") or (existing_pos < 0 and signal == "buy_no"):
                if not quiet:
                    print(f"  ⏭️  {ticker} | Already in this position")
                continue

        if not quiet:
            print(f"\n  💡 {ticker}")
            print(f"     {title}")
            print(f"     [{signal.upper()}] edge={edge}¢ | {reason[:90]}")

        count = smart_size(balance_cents, price, edge)
        cost  = count * price

        if not quiet:
            print(f"     📊 {'BUY' if 'buy' in signal else 'SELL'} {count}x {side.upper()} @ {price}¢ = ${cost/100:.2f}")

        if "buy" in signal and not no_safeguards and cost > balance_cents:
            if not quiet:
                print(f"     🛡️  Insufficient balance (${balance_cents/100:.2f})")
            continue

        # Shared budget check — coordinate with Price Farmer
        if "buy" in signal and live:
            ok, reason_budget = _state.can_trade(BOT_NAME, cost)
            if not ok:
                if not quiet:
                    print(f"     🤝 Budget gate: {reason_budget}")
                continue

        action = "buy" if "buy" in signal else "sell"
        order = place_order(ticker, side, action, count, price, live)

        if order.get("dry_run"):
            if not quiet:
                print(f"     [DRY RUN] {action.upper()} {count}x {side.upper()} @ {price}¢")
        elif order.get("error"):
            print(f"     ❌ Error {order['error']}: {order.get('detail','')[:80]}")
        else:
            trades += 1
            balance_cents -= cost
            held[ticker] = {"position": count if side == "yes" else -count}
            oid = order.get("order_id", "?")
            print(f"     ✅ {order.get('status','?')} | {oid}")
            if "buy" in signal:
                _state.record_trade(BOT_NAME, cost, ticker, side, oid, dry_run=False)
            results.append({"ticker": ticker, "side": side, "action": action,
                            "count": count, "price_cents": price, "order_id": oid,
                            "reason": reason[:80]})

    print(f"\n{'='*65}")
    print(f"📊 [{ts}] {len(markets)} markets | {opps} opportunities | "
          f"{trades} trades {'executed' if live else '(dry run)'} | "
          f"Balance: ${balance_cents/100:.2f}")
    print(_state.summary_line())
    if results:
        print("🎯 Trades:")
        for r in results:
            print(f"   {r['action'].upper()} {r['count']}x {r['ticker']} {r['side'].upper()} "
                  f"@ {r['price_cents']}¢ | {r['reason'][:60]}")

    return {"trades": trades, "opps": opps, "balance": balance_cents, "results": results,
            "markets_scanned": len(markets)}


def show_positions():
    r = kget("/trade-api/v2/portfolio/positions")
    positions = r.json().get("market_positions", []) if r.ok else []
    active = [p for p in positions if p.get("position", 0) != 0]
    print(f"\n📋 Open Positions ({len(active)}):")
    if not active:
        print("  (none)")
        return
    for p in sorted(active, key=lambda x: x["ticker"]):
        print(f"  {p['ticker']}: pos={p['position']} | "
              f"exposure=${p.get('market_exposure_dollars','?')} | "
              f"pnl=${p.get('realized_pnl_dollars','?')}")


def show_config():
    print("⚙️  Kalshi Weather Trader v3")
    print(f"   ENTRY      : ≤{ENTRY_THRESHOLD}¢")
    print(f"   EXIT       : ≥{EXIT_THRESHOLD}¢")
    print(f"   MAX_POS    : ${MAX_POSITION_CENTS/100:.2f}")
    print(f"   SIZING     : {SIZING_PCT*100:.0f}% of balance")
    print(f"   MAX_TRADES : {MAX_TRADES}")
    print(f"   SERIES     : {len(ALL_SERIES)} series")
    print(f"   CITIES     : {', '.join(CITIES.keys())}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Kalshi Weather Trader v3")
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
        show_positions()
    else:
        run(live=args.live, quiet=args.quiet,
            no_safeguards=args.no_safeguards, max_trades=args.max_trades)
