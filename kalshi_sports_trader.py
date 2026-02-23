#!/usr/bin/env python3
"""
🏆 Kalshi Sports Trader v1 — Sports market predictions
Separate bot from weather trader, shares auth + state infrastructure.
Targets: NBA, NFL, MLB, NHL player props and game outcomes.
Signal sources: ESPN injuries, weather for outdoor games, sharp money detection.
"""

import argparse, base64, datetime, json, os, re, sys, uuid
from typing import Optional, Dict, List

# Shared state coordination
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "scripts"))
from kalshi_shared_state import KalshiState
from sports_paper_trading import SportsPaperTrader
_state = KalshiState()
_paper = SportsPaperTrader()
BOT_NAME = "sports_trader"

import requests
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding

# ─── Config ──────────────────────────────────────────────────────────────────

API_KEY_ID = os.environ.get("KALSHI_API_KEY", "69d03bf0-4a89-414d-8ecf-d6fe4cfdf183")
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
ENTRY_THRESHOLD    = int(os.environ.get("SPORTS_ENTRY",    "15"))   # buy when price ≤ this
EXIT_THRESHOLD     = int(os.environ.get("SPORTS_EXIT",     "70"))   # sell when bid ≥ this
MAX_POSITION_CENTS = int(os.environ.get("SPORTS_MAX_POS",  "300"))  # max spend per trade
SIZING_PCT         = float(os.environ.get("SPORTS_SIZING", "0.04")) # % of balance per trade
MAX_TRADES         = int(os.environ.get("SPORTS_MAX_TRADES","10"))
MIN_EDGE_CENTS     = int(os.environ.get("SPORTS_MIN_EDGE", "3"))    # minimum edge to trade

# ─── Sports Config ───────────────────────────────────────────────────────────

SPORTS_SERIES = {
    # NBA - active now
    "KXNBA": ("NBA", "game_outcomes"),
    "KXNBAPTS": ("NBA", "player_points"),
    "KXNBAREB": ("NBA", "player_rebounds"),
    "KXNBAAST": ("NBA", "player_assists"),
    "KXNBATHREE": ("NBA", "player_threes"),
    "KXNBAMVP": ("NBA", "awards"),
    
    # NFL - offseason but keep for fall
    "KXNFL": ("NFL", "game_outcomes"),
    "KXNFLPASS": ("NFL", "player_pass_yards"),
    "KXNFLRUSH": ("NFL", "player_rush_yards"),
    "KXNFLRECV": ("NFL", "player_rec_yards"),
    "KXNFLTD": ("NFL", "player_tds"),
    
    # MLB - upcoming
    "KXMLB": ("MLB", "game_outcomes"),
    "KXMLBHITS": ("MLB", "player_hits"),
    "KXMLBHR": ("MLB", "player_hr"),
    "KXMLBSTRIKEOUTS": ("MLB", "player_ks"),
    
    # NHL
    "KXNHL": ("NHL", "game_outcomes"),
    "KXNHLSAVE": ("NHL", "goalie_saves"),
    "KXNHLGOALS": ("NHL", "player_goals"),
    
    # Soccer
    "KXSOCCER": ("SOCCER", "game_outcomes"),
    "KXSOCCERGOALS": ("SOCCER", "total_goals"),
    "KXCHAMPIONS": ("SOCCER", "champions_league"),
    
    # Tennis
    "KXTENNIS": ("TENNIS", "match_winner"),
    "KXWIMBLEDON": ("TENNIS", "tournament"),
    "KXUSOPEN": ("TENNIS", "tournament"),
    
    # UFC/Boxing
    "KXUFC": ("UFC", "fight_winner"),
    "KXBOXING": ("BOXING", "fight_winner"),
    
    # F1
    "KXF1": ("F1", "race_winner"),
    "KXF1CHAMP": ("F1", "championship"),
}

# Player name mappings from ticker codes to full names
PLAYER_MAPPINGS = {
    # NBA - Current Kalshi markets (Feb 2026)
    "DFOX4": ("De'Aaron Fox", "SAS"),
    "THARRIS12": ("Tobias Harris", "DET"),
    "DROBINSON55": ("Duncan Robinson", "DET"),
    "CCUNNINGHAM2": ("Cade Cunningham", "DET"),
    "VWEMBANYAMA1": ("Victor Wembanyama", "SAS"),
    "ATHOMPSON9": ("Amen Thompson", "HOU"),
    "DDEROZAN10": ("DeMar DeRozan", "SAC"),
    "JWELLS0": ("Jaylen Wells", "MEM"),
    "KMURRAY13": ("Keegan Murray", "SAC"),
    "RWESTBROOK18": ("Russell Westbrook", "DEN"),
    "SCASTLE5": ("Stephon Castle", "SAS"),
    "TJEROME2": ("Ty Jerome", "CLE"),
}

# ESPN API sport mapping
ESPN_SPORT_IDS = {
    "NBA": "basketball/nba",
    "NFL": "football/nfl",
    "MLB": "baseball/mlb",
    "NHL": "hockey/nhl",
}

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


# ─── ESPN Data ───────────────────────────────────────────────────────────────

_injury_cache = {}
_schedule_cache = {}

def fetch_espn_injuries(sport: str) -> List[Dict]:
    """Fetch injury reports from ESPN"""
    if sport not in ESPN_SPORT_IDS:
        return []
    
    cache_key = f"{sport}_injuries"
    if cache_key in _injury_cache:
        return _injury_cache[cache_key]
    
    url = f"https://site.api.espn.com/apis/site/v2/sports/{ESPN_SPORT_IDS[sport]}/injuries"
    try:
        r = requests.get(url, timeout=10)
        if r.ok:
            injuries = []
            for team in r.json().get("injuries", []):
                team_name = team.get("team", {}).get("name", "")
                for inj in team.get("injuries", []):
                    injuries.append({
                        "player": inj.get("athlete", {}).get("displayName", ""),
                        "team": team_name,
                        "status": inj.get("status", ""),
                        "details": inj.get("details", ""),
                        "date": inj.get("date", ""),
                    })
            _injury_cache[cache_key] = injuries
            return injuries
    except Exception as e:
        print(f"ESPN injury error: {e}")
    return []

def get_player_injury_status(player: str, sport: str) -> Optional[Dict]:
    """Check if player is injured"""
    injuries = fetch_espn_injuries(sport)
    for inj in injuries:
        if player.lower() in inj["player"].lower():
            return inj
    return None


# ─── NBA Stats (nba_api) ─────────────────────────────────────────────────────

_player_stats_cache = {}

def get_player_season_stats(player_name: str) -> Optional[Dict]:
    """Get current season stats from nba_api"""
    if player_name in _player_stats_cache:
        return _player_stats_cache[player_name]
    
    try:
        from nba_api.stats.static import players
        from nba_api.stats.endpoints import playergamelog
        import time
        
        # Find player
        player_list = players.find_players_by_full_name(player_name)
        if not player_list:
            # Try last name only
            last = player_name.split()[-1]
            player_list = players.find_players_by_last_name(last)
        
        if not player_list:
            _player_stats_cache[player_name] = None
            return None
        
        pid = player_list[0]["id"]
        
        # Get game log (last 10 games for recent form)
        time.sleep(0.6)  # Rate limit
        gl = playergamelog.PlayerGameLog(
            player_id=pid,
            season="2025-26",
            season_type_all_star="Regular Season"
        )
        df = gl.get_data_frames()[0]
        
        if df.empty:
            _player_stats_cache[player_name] = None
            return None
        
        # Last 10 games
        recent = df.head(10)
        
        stats = {
            "games": len(recent),
            "avg_pts": float(recent["PTS"].mean()),
            "avg_reb": float(recent["REB"].mean()),
            "avg_ast": float(recent["AST"].mean()),
            "avg_fg3m": float(recent["FG3M"].mean()),
            "pts_list": recent["PTS"].tolist(),
            "reb_list": recent["REB"].tolist(),
            "ast_list": recent["AST"].tolist(),
            "fg3m_list": recent["FG3M"].tolist(),
        }
        
        _player_stats_cache[player_name] = stats
        return stats
        
    except Exception as e:
        print(f"  ⚠️  nba_api error for {player_name}: {e}")
        _player_stats_cache[player_name] = None
        return None

def estimate_over_probability(stats: Dict, stat_type: str, threshold: float) -> Optional[float]:
    """Estimate probability of going over a threshold based on recent stats"""
    if not stats:
        return None
    
    stat_map = {
        "points": ("avg_pts", "pts_list"),
        "rebounds": ("avg_reb", "reb_list"),
        "assists": ("avg_ast", "ast_list"),
        "threes": ("avg_fg3m", "fg3m_list"),
    }
    
    if stat_type not in stat_map:
        return None
    
    avg_key, list_key = stat_map[stat_type]
    avg = stats.get(avg_key, 0)
    game_values = stats.get(list_key, [])
    
    if not game_values:
        return None
    
    # Calculate hit rate (% of games over threshold)
    over_count = sum(1 for v in game_values if v >= threshold)
    hit_rate = over_count / len(game_values) * 100
    
    # Blend hit rate with normal distribution estimate
    delta = avg - threshold
    
    if delta > 10:
        model_prob = 90
    elif delta > 5:
        model_prob = 75
    elif delta > 2:
        model_prob = 60
    elif delta > 0:
        model_prob = 55
    elif delta > -2:
        model_prob = 45
    elif delta > -5:
        model_prob = 35
    elif delta > -10:
        model_prob = 20
    else:
        model_prob = 10
    
    # Blend: 60% hit rate, 40% model
    blended = (hit_rate * 0.6) + (model_prob * 0.4)
    
    return round(blended, 1)

def detect_stat_type(title: str, series: str) -> Optional[str]:
    """Detect which stat type from title/series"""
    title_lower = title.lower()
    if "point" in title_lower or "pts" in series.upper():
        return "points"
    elif "rebound" in title_lower or "reb" in series.upper():
        return "rebounds"
    elif "assist" in title_lower or "ast" in series.upper():
        return "assists"
    elif "three" in title_lower or "3pt" in title_lower or "THREE" in series.upper():
        return "threes"
    return None


# ─── Market Evaluation ───────────────────────────────────────────────────────

def extract_player_from_ticker(ticker: str) -> Optional[tuple]:
    """Extract player from ticker code. Returns (name, team, player_code) or None."""
    parts = ticker.split("-")
    if len(parts) < 3:
        return None
    
    for part in parts:
        for code, (name, team) in PLAYER_MAPPINGS.items():
            if code in part.upper():
                return (name, team, code)
    return None

def extract_threshold_from_title(title: str) -> Optional[float]:
    """Extract numerical threshold from title"""
    patterns = [
        r'(\d+\.?\d*)\s*\+',
        r'>\s*(\d+\.?\d*)',
        r'(\d+\.?\d*)\s*(?:points|yards|rebounds|assists|threes|hits|hr|ks)',
    ]
    for pattern in patterns:
        match = re.search(pattern, title.lower())
        if match:
            return float(match.group(1))
    return None

def evaluate_sports_market(market: Dict) -> Dict:
    """Evaluate a sports market for trading edge."""
    ticker = market.get("ticker", "")
    title = market.get("title", "")
    series = market.get("series_ticker", "")
    yes_ask = market.get("yes_ask", 99)
    yes_bid = market.get("yes_bid", 0)
    no_ask = market.get("no_ask", 99)
    close_time = market.get("close_time", "")
    
    # Time decay guard - skip if resolves too soon
    if close_time:
        try:
            ct = datetime.datetime.fromisoformat(close_time.replace("Z", "+00:00"))
            hrs = (ct - datetime.datetime.now(datetime.timezone.utc)).total_seconds() / 3600
            if hrs < 1.5:
                return {"signal": "skip", "reason": f"Resolves in {hrs:.1f}h — too soon"}
        except Exception:
            pass
    
    # Identify sport
    sport = None
    for series_prefix, (s, _) in SPORTS_SERIES.items():
        if series == series_prefix or ticker.startswith(series_prefix):
            sport = s
            break
    
    if not sport:
        return {"signal": "skip", "reason": "Unknown sport series"}
    
    # Extract player
    player_info = extract_player_from_ticker(ticker)
    player = player_info[0] if player_info else None
    threshold = extract_threshold_from_title(title)
    
    signals = []
    
    # Check injuries
    if player:
        injury = get_player_injury_status(player, sport)
        if injury:
            status = injury.get("status", "").lower()
            if "out" in status or "injured" in status:
                signals.append("injury_out")
            elif "questionable" in status or "doubtful" in status:
                signals.append("injury_questionable")
    
    # Check for sharp money signals
    spread = yes_ask - yes_bid
    if spread > 5:
        signals.append("wide_spread")
    
    # Volume check
    volume = market.get("volume", 0)
    if volume == 0:
        return {"signal": "skip", "reason": "Zero volume"}
    
    # ── SIGNAL: Injury-based edge ──
    if "injury_out" in signals and threshold:
        if yes_ask > 5:
            edge = yes_ask - 5
            if edge >= MIN_EDGE_CENTS:
                return {
                    "signal": "buy_no",
                    "side": "no",
                    "price": no_ask,
                    "edge": edge,
                    "signal_type": "injury_out",
                    "reason": f"{sport} | INJURY OUT | {player} OUT → prop should be ~0% but YES={yes_ask}¢"
                }
    
    # ── SIGNAL: Stats-based edge ──
    if sport == "NBA" and player and threshold and volume > 0:
        stat_type = detect_stat_type(title, series)
        if stat_type:
            stats = get_player_season_stats(player)
            if stats:
                theo_prob = estimate_over_probability(stats, stat_type, threshold)
                if theo_prob is not None:
                    edge_yes = theo_prob - yes_ask
                    edge_no = (100 - theo_prob) - (100 - no_ask) if no_ask < 100 else 0
                    
                    avg_key = {"points": "avg_pts", "rebounds": "avg_reb", "assists": "avg_ast", "threes": "avg_fg3m"}
                    avg_val = stats.get(avg_key.get(stat_type, ""), 0)
                    
                    if edge_yes >= MIN_EDGE_CENTS:
                        return {
                            "signal": "buy_yes",
                            "side": "yes",
                            "price": yes_ask,
                            "edge": edge_yes,
                            "signal_type": "stats_edge",
                            "reason": f"{sport} | STATS | {player} avg {avg_val:.1f} → {threshold}+ theo={theo_prob:.0f}% vs mkt={yes_ask}% | +{edge_yes:.0f}¢ edge"
                        }
                    elif edge_no >= MIN_EDGE_CENTS and no_ask <= ENTRY_THRESHOLD:
                        return {
                            "signal": "buy_no",
                            "side": "no",
                            "price": no_ask,
                            "edge": edge_no,
                            "signal_type": "stats_edge",
                            "reason": f"{sport} | STATS | {player} avg {avg_val:.1f} → {threshold}+ unlikely, NO at {no_ask}¢ | +{edge_no:.0f}¢ edge"
                        }
    
    return {"signal": "hold", "reason": f"No edge. Signals: {signals or 'none'} | Player: {player or 'N/A'}"}


# ─── Market Fetch ────────────────────────────────────────────────────────────

def fetch_all_sports_markets() -> List[Dict]:
    """Fetch all open sports markets from Kalshi"""
    markets = []
    seen = set()
    
    for series in SPORTS_SERIES.keys():
        try:
            r = kget("/trade-api/v2/markets", {
                "series_ticker": series,
                "status": "open",
                "limit": "100"
            })
            if r.ok:
                for m in r.json().get("markets", []):
                    if m["ticker"] not in seen:
                        seen.add(m["ticker"])
                        markets.append(m)
        except Exception as e:
            print(f"Error fetching {series}: {e}")
    
    return markets


def smart_size(balance_cents: int, price_cents: int, edge: int) -> int:
    """Calculate position size based on edge and bankroll"""
    base = max(1, int(balance_cents * SIZING_PCT))
    mult = 2.0 if edge >= 10 else 1.5 if edge >= 5 else 1.0
    position_cents = min(int(base * mult), MAX_POSITION_CENTS)
    return max(1, position_cents // max(price_cents, 1))


def check_and_settle_paper_trades():
    """Check for completed games and settle paper trades"""
    open_positions = _paper.get_open_positions()
    if not open_positions:
        return []
    
    settled_trades = []
    
    for pos in open_positions:
        ticker = pos.ticker
        try:
            r = kget(f"/trade-api/v2/markets/{ticker}")
            if r.ok:
                market = r.json().get("market", {})
                status = market.get("status", "")
                
                if status == "resolved":
                    resolution = market.get("resolution", "")
                    yes_won = resolution == "yes"
                    
                    if pos.side == "YES":
                        exit_price = 100 if yes_won else 0
                        result = "WIN" if yes_won else "LOSS"
                    else:
                        exit_price = 0 if yes_won else 100
                        result = "LOSS" if yes_won else "WIN"
                    
                    closed = _paper.close_trade(pos.id, exit_price, result)
                    if closed:
                        settled_trades.append({
                            "ticker": pos.ticker,
                            "pnl": closed.pnl,
                            "result": result,
                            "side": pos.side
                        })
        except Exception as e:
            pass
    
    if settled_trades:
        print(f"\n📊 Settled {len(settled_trades)} completed trades")
    
    return settled_trades


def run(live: bool, quiet: bool, no_safeguards: bool, max_trades: int, settle: bool = True):
    """Main trading loop"""
    ts = datetime.datetime.now().strftime("%Y-%m-%d %H:%M ET")
    
    if not quiet:
        print(f"🏆 Kalshi Sports Trader v1  [{ts}]")
        print("=" * 65)
    
    # Check for settled positions first
    new_settled = []
    if settle:
        new_settled = check_and_settle_paper_trades()
    
    # Get paper portfolio summary
    paper_summary = _paper.get_portfolio_summary()
    
    # Get live balance (for reference)
    bal = kget("/trade-api/v2/portfolio/balance").json()
    balance_cents = bal.get("balance", 0)
    
    if not quiet:
        print(f"💰 Live Balance: ${balance_cents/100:.2f}")
        print(f"📊 Paper Trading: ${paper_summary['bankroll']:.2f} | P&L: ${paper_summary['total_pnl']:+.2f}")
        print(f"⚙️  {'🔴 LIVE' if live else '🟡 DRY RUN'} | Entry≤{ENTRY_THRESHOLD}¢ | Min Edge≥{MIN_EDGE_CENTS}¢")
    
    # Fetch markets
    if not quiet:
        print(f"\n🔍 Scanning {len(SPORTS_SERIES)} sports series...")
    
    markets = fetch_all_sports_markets()
    
    if not quiet:
        print(f"   → {len(markets)} open markets found\n")
    
    trades, opps = 0, 0
    results = []
    
    for market in markets:
        if trades >= max_trades:
            if not quiet:
                print(f"\n⛔ Max trades ({max_trades}) reached.")
            break
        
        ticker = market["ticker"]
        title = market.get("title", "")[:60]
        
        # Evaluate market
        result = evaluate_sports_market(market)
        signal = result.get("signal")
        reason = result.get("reason", "")
        
        if signal in ("skip", "hold"):
            if not quiet and signal == "hold":
                print(f"  💤 {ticker} | {reason[:70]}")
            continue
        
        opps += 1
        side = result.get("side", "yes")
        price = result.get("price", 50)
        edge = result.get("edge", 0)
        
        if edge < MIN_EDGE_CENTS:
            if not quiet:
                print(f"  ⚡ {ticker} | Edge {edge}¢ below min {MIN_EDGE_CENTS}¢")
            continue
        
        # Calculate position size
        count = smart_size(int(paper_summary['bankroll'] * 100), price, edge)
        cost = count * price / 100
        
        if not quiet:
            print(f"\n  💡 {ticker}")
            print(f"     {title}")
            print(f"     [{signal.upper()}] edge={edge:.0f}¢ | {result['reason'][:85]}")
            print(f"     📊 BUY {count}x {side.upper()} @ {price}¢ = ${cost:.2f}")
        
        # Paper trade execution (always happens)
        if "buy" in signal:
            trade = _paper.execute_trade(
                ticker=ticker,
                title=title,
                side=side,
                entry_price=price,
                size=count,
                signal_type=result.get("signal_type", "unknown"),
                edge=edge,
                reason=reason
            )
            if trade:
                trades += 1
                results.append({
                    "ticker": ticker,
                    "side": side,
                    "count": count,
                    "price_cents": price,
                    "paper_trade_id": trade.id,
                    "reason": reason[:80]
                })
        
        # Live trade execution (only if --live flag)
        if "buy" in signal and live:
            ok, reason_budget = _state.can_trade(BOT_NAME, int(cost * 100))
            if not ok:
                if not quiet:
                    print(f"     🤝 Budget gate: {reason_budget}")
                continue
            
            print(f"     🔴 Would execute LIVE trade here (disabled for safety)")
    
    # Summary
    print(f"\n{'='*65}")
    print(f"📊 [{ts}] {len(markets)} markets | {opps} opportunities | "
          f"{trades} paper trades | P&L: ${paper_summary['total_pnl']:+.2f}")
    
    if results:
        print("🎯 Paper Trades:")
        for r in results:
            print(f"   BUY {r['count']}x {r['ticker']} {r['side'].upper()} "
                  f"@ {r['price_cents']}¢ | {r['reason'][:55]}")
    
    # Print paper trading report
    _paper.print_report()
    
    # Discord summary
    discord_msg = generate_discord_summary(ts, markets, opps, trades, results, paper_summary, new_settled)
    if discord_msg:
        print(f"\n📤 Discord summary ready")
        # Write to file for cron to pick up
        with open("/tmp/sports_trader_discord_msg.txt", "w") as f:
            f.write(discord_msg)
    
    return {
        "trades": trades,
        "opps": opps,
        "results": results,
        "markets_scanned": len(markets)
    }


def generate_discord_summary(ts: str, markets: list, opps: int, trades: int, 
                              results: list, paper_summary: dict, settled: list) -> str:
    """Generate a Discord-friendly summary of the trading session"""
    lines = []
    lines.append(f"🏆 **Kalshi Sports Trader** — {ts}")
    lines.append("")
    
    # Portfolio snapshot
    lines.append(f"📊 **Paper Portfolio**")
    lines.append(f"   Bankroll: ${paper_summary['bankroll']:.2f}")
    lines.append(f"   Exposure: ${paper_summary['exposure']:.2f}")
    lines.append(f"   Total P&L: ${paper_summary['total_pnl']:+.2f} ({paper_summary['roi_pct']:+.1f}%)")
    lines.append("")
    
    # Performance stats
    if paper_summary['closed_trades'] > 0:
        lines.append(f"📈 **Performance**")
        lines.append(f"   Closed: {paper_summary['closed_trades']} | Wins: {paper_summary['wins']} | Losses: {paper_summary['losses']}")
        lines.append(f"   Win Rate: {paper_summary['win_rate']:.1f}%")
        lines.append("")
    
    # New trades
    if trades > 0:
        lines.append(f"🎯 **New Trades ({trades})**")
        for r in results[:5]:  # Show max 5
            lines.append(f"   BUY {r['count']}x {r['ticker'][:30]} {r['side'].upper()} @ {r['price_cents']}¢")
        if len(results) > 5:
            lines.append(f"   ... and {len(results) - 5} more")
        lines.append("")
    
    # Settled trades with P&L
    if settled:
        lines.append(f"💰 **Settled Trades ({len(settled)})**")
        for s in settled[:5]:
            emoji = "🟢" if s['pnl'] > 0 else "🔴"
            lines.append(f"   {emoji} {s['ticker'][:30]}: ${s['pnl']:+.2f} ({s['result']})")
        lines.append("")
    
    # Open positions
    open_count = paper_summary['open_positions']
    if open_count > 0:
        lines.append(f"📋 **Open Positions: {open_count}**")
    
    return "\n".join(lines)


def show_config():
    """Display configuration"""
    print("⚙️  Kalshi Sports Trader v1")
    print(f"   ENTRY      : ≤{ENTRY_THRESHOLD}¢")
    print(f"   EXIT       : ≥{EXIT_THRESHOLD}¢")
    print(f"   MAX_POS    : ${MAX_POSITION_CENTS/100:.2f}")
    print(f"   SIZING     : {SIZING_PCT*100:.0f}% of balance")
    print(f"   MAX_TRADES : {MAX_TRADES}")
    print(f"   SERIES     : {len(SPORTS_SERIES)} series")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Kalshi Sports Trader v1")
    parser.add_argument("--live", action="store_true", help="Execute live trades")
    parser.add_argument("--config", action="store_true", help="Show config")
    parser.add_argument("--quiet", action="store_true", help="Minimal output")
    parser.add_argument("--no-safeguards", action="store_true", help="Skip safety checks")
    parser.add_argument("--settle", action="store_true", default=True, help="Settle completed trades")
    parser.add_argument("--no-settle", action="store_false", dest="settle", help="Skip settlement check")
    parser.add_argument("--max-trades", type=int, default=5, help="Max trades per run")
    
    args = parser.parse_args()
    
    if args.config:
        show_config()
    else:
        run(live=args.live, quiet=args.quiet, no_safeguards=args.no_safeguards, 
            max_trades=args.max_trades, settle=args.settle)
