#!/usr/bin/env python3
"""Quick diagnostic for Kalshi API issues"""
import os, sys, json, base64, datetime
import requests
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding

API_KEY_ID = os.environ.get("KALSHI_API_KEY", "69d03bf0-4a89-414d-8ecf-d6fe4cfdf183")
BASE_URL = "https://api.elections.kalshi.com"

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

def kget(path: str, params: dict = None):
    full = path + ("?" + "&".join(f"{k}={v}" for k, v in params.items()) if params else "")
    return requests.get(BASE_URL + full, headers=auth_headers("GET", path), timeout=15)

def kpost(path: str, payload: dict):
    return requests.post(
        BASE_URL + path,
        headers=auth_headers("POST", path),
        json=payload,
        timeout=15
    )

print("=" * 60)
print("Kalshi API Diagnostic")
print("=" * 60)

# Test 1: Get balance
print("\n1. Testing balance endpoint...")
r = kget("/trade-api/v2/portfolio/balance")
print(f"   Status: {r.status_code}")
if r.ok:
    print(f"   Balance: ${r.json().get('balance', 0)/100:.2f}")
else:
    print(f"   Error: {r.text}")

# Test 2: Get open markets
print("\n2. Testing markets endpoint...")
r = kget("/trade-api/v2/markets", {"status": "open", "limit": "5"})
print(f"   Status: {r.status_code}")
if r.ok:
    markets = r.json().get("markets", [])
    print(f"   Found {len(markets)} open markets")
    if markets:
        m = markets[0]
        print(f"   Example: {m.get('ticker')} - {m.get('title', 'N/A')[:50]}")
        ticker = m.get('ticker')
        
        # Test 3: Get orderbook for first market
        print(f"\n3. Testing orderbook for {ticker}...")
        r2 = kget(f"/trade-api/v2/markets/{ticker}/orderbook", {"depth": "5"})
        print(f"   Status: {r2.status_code}")
        if r2.ok:
            data = r2.json()
            yes_asks = data.get('yes_asks', [])
            if yes_asks:
                print(f"   Best YES ask: {yes_asks[0].get('price')}¢ (count: {yes_asks[0].get('count')})")
        else:
            print(f"   Error: {r2.text[:200]}")
else:
    print(f"   Error: {r.text[:200]}")

# Test 4: Check exchange status
print("\n4. Testing exchange status...")
r = kget("/trade-api/v2/exchange/status")
print(f"   Status: {r.status_code}")
if r.ok:
    print(f"   Exchange: {r.json()}")

print("\n" + "=" * 60)
print("Diagnostic complete")
