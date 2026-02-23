#!/usr/bin/env python3
"""
Kalshi Sports Paper Trading System
Tracks simulated trades, P&L, and strategy performance
"""

import json
import os
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional
from dataclasses import dataclass, asdict

DATA_DIR = Path(__file__).parent / "data"
DATA_DIR.mkdir(exist_ok=True)

PAPER_PORTFOLIO_FILE = DATA_DIR / "sports_paper_portfolio.json"
PAPER_TRADES_FILE = DATA_DIR / "sports_paper_trades.json"
PAPER_SIGNALS_FILE = DATA_DIR / "sports_paper_signals.json"

STARTING_BANKROLL = 1000.0  # $1000 paper money

@dataclass
class PaperTrade:
    id: str
    timestamp: str
    ticker: str
    title: str
    side: str  # YES or NO
    entry_price: int  # cents
    size: int  # contracts
    signal_type: str
    edge: float
    reason: str
    exit_price: Optional[int] = None
    exit_timestamp: Optional[str] = None
    pnl: Optional[float] = None
    status: str = "open"  # open, closed

@dataclass
class PaperSignal:
    timestamp: str
    ticker: str
    title: str
    side: str
    price: int
    edge: float
    signal_type: str
    reason: str
    executed: bool = False

class SportsPaperTrader:
    def __init__(self):
        self._ensure_files()
    
    def _ensure_files(self):
        """Create data files if they don't exist"""
        if not PAPER_PORTFOLIO_FILE.exists():
            self._save_portfolio({
                "bankroll": STARTING_BANKROLL,
                "exposure": 0.0,
                "total_pnl": 0.0,
                "trades_count": 0,
                "win_count": 0,
                "loss_count": 0,
                "created_at": datetime.now().isoformat(),
                "last_updated": datetime.now().isoformat()
            })
        
        if not PAPER_TRADES_FILE.exists():
            with open(PAPER_TRADES_FILE, 'w') as f:
                json.dump([], f)
        
        if not PAPER_SIGNALS_FILE.exists():
            with open(PAPER_SIGNALS_FILE, 'w') as f:
                json.dump([], f)
    
    def _load_portfolio(self) -> Dict:
        with open(PAPER_PORTFOLIO_FILE) as f:
            return json.load(f)
    
    def _save_portfolio(self, portfolio: Dict):
        portfolio["last_updated"] = datetime.now().isoformat()
        with open(PAPER_PORTFOLIO_FILE, 'w') as f:
            json.dump(portfolio, f, indent=2)
    
    def _load_trades(self) -> List[Dict]:
        with open(PAPER_TRADES_FILE) as f:
            return json.load(f)
    
    def _save_trades(self, trades: List[Dict]):
        with open(PAPER_TRADES_FILE, 'w') as f:
            json.dump(trades, f, indent=2)
    
    def _load_signals(self) -> List[Dict]:
        with open(PAPER_SIGNALS_FILE) as f:
            return json.load(f)
    
    def _save_signals(self, signals: List[Dict]):
        with open(PAPER_SIGNALS_FILE, 'w') as f:
            json.dump(signals, f, indent=2)
    
    def record_signal(self, ticker: str, title: str, side: str, price: int, 
                      edge: float, signal_type: str, reason: str) -> PaperSignal:
        """Record a trading signal (opportunity identified)"""
        signal = PaperSignal(
            timestamp=datetime.now().isoformat(),
            ticker=ticker,
            title=title,
            side=side,
            price=price,
            edge=edge,
            signal_type=signal_type,
            reason=reason
        )
        
        signals = self._load_signals()
        signals.append(asdict(signal))
        # Keep last 500 signals
        signals = signals[-500:]
        self._save_signals(signals)
        
        return signal
    
    def execute_trade(self, ticker: str, title: str, side: str, entry_price: int,
                      size: int, signal_type: str, edge: float, reason: str) -> Optional[PaperTrade]:
        """Execute a paper trade"""
        portfolio = self._load_portfolio()
        
        # Calculate cost
        cost = size * (entry_price / 100)
        
        # Check if we have enough bankroll
        if cost > portfolio["bankroll"]:
            print(f"  🚫 Insufficient paper funds: need ${cost:.2f}, have ${portfolio['bankroll']:.2f}")
            return None
        
        # Check if we already have a position in this market
        trades = self._load_trades()
        open_positions = [t for t in trades if t["status"] == "open" and t["ticker"] == ticker]
        if open_positions:
            print(f"  ⏭️  Already have position in {ticker}")
            return None
        
        trade = PaperTrade(
            id=f"paper_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{len(trades)}",
            timestamp=datetime.now().isoformat(),
            ticker=ticker,
            title=title,
            side=side,
            entry_price=entry_price,
            size=size,
            signal_type=signal_type,
            edge=edge,
            reason=reason
        )
        
        # Update portfolio
        portfolio["bankroll"] -= cost
        portfolio["exposure"] += cost
        
        # Save
        trades.append(asdict(trade))
        self._save_trades(trades)
        self._save_portfolio(portfolio)
        
        print(f"  ✅ PAPER TRADE: {side} {size}x {ticker} @ {entry_price}¢ = ${cost:.2f}")
        
        return trade
    
    def close_trade(self, trade_id: str, exit_price: int, result: str = "") -> Optional[PaperTrade]:
        """Close a paper trade at market price"""
        trades = self._load_trades()
        portfolio = self._load_portfolio()
        
        trade = None
        for t in trades:
            if t["id"] == trade_id and t["status"] == "open":
                trade = t
                break
        
        if not trade:
            return None
        
        # Calculate P&L
        entry = trade["entry_price"]
        side = trade["side"]
        size = trade["size"]
        
        if side == "YES":
            # Bought YES at entry, selling at exit
            pnl = (exit_price - entry) * size / 100
        else:  # NO
            # Bought NO at entry (price = 100 - ask), selling at exit
            entry_no_price = 100 - entry
            exit_no_price = 100 - exit_price
            pnl = (exit_no_price - entry_no_price) * size / 100
        
        # Update trade
        trade["status"] = "closed"
        trade["exit_price"] = exit_price
        trade["exit_timestamp"] = datetime.now().isoformat()
        trade["pnl"] = round(pnl, 2)
        trade["result"] = result  # "win" or "loss"
        
        # Update portfolio
        original_cost = size * (entry / 100)
        if side == "YES":
            payout = size * (exit_price / 100)
        else:
            payout = size * ((100 - exit_price) / 100)
        
        portfolio["exposure"] -= original_cost
        portfolio["bankroll"] += payout
        portfolio["total_pnl"] += pnl
        portfolio["trades_count"] += 1
        
        if pnl > 0:
            portfolio["win_count"] += 1
        else:
            portfolio["loss_count"] += 1
        
        self._save_trades(trades)
        self._save_portfolio(portfolio)
        
        emoji = "🟢" if pnl > 0 else "🔴"
        print(f"  {emoji} CLOSED: {trade['ticker'][:40]} | P&L: ${pnl:+.2f} | {result}")
        
        return PaperTrade(**trade)
    
    def settle_expired_positions(self, market_results: Dict[str, bool]):
        """
        Settle positions based on actual game results.
        market_results: {ticker: True/False} where True = YES won, False = NO won
        """
        open_positions = self.get_open_positions()
        settled = 0
        
        for pos in open_positions:
            if pos.ticker in market_results:
                result_won = market_results[pos.ticker]
                
                # Determine exit price based on result
                if pos.side == "YES":
                    exit_price = 100 if result_won else 0
                    result_str = "WIN" if result_won else "LOSS"
                else:  # NO
                    exit_price = 0 if result_won else 100
                    result_str = "LOSS" if result_won else "WIN"
                
                self.close_trade(pos.id, exit_price, result_str)
                settled += 1
        
        if settled > 0:
            print(f"\n📊 Settled {settled} positions")
            self.print_report()
        
        return settled
    
    def get_open_positions(self) -> List[PaperTrade]:
        """Get all open paper trades"""
        trades = self._load_trades()
        return [PaperTrade(**t) for t in trades if t["status"] == "open"]
    
    def get_portfolio_summary(self) -> Dict:
        """Get portfolio summary"""
        portfolio = self._load_portfolio()
        trades = self._load_trades()
        
        open_trades = [t for t in trades if t["status"] == "open"]
        closed_trades = [t for t in trades if t["status"] == "closed"]
        
        wins = [t for t in closed_trades if t.get("pnl", 0) > 0]
        losses = [t for t in closed_trades if t.get("pnl", 0) <= 0]
        
        total_return = portfolio["total_pnl"]
        roi_pct = (total_return / STARTING_BANKROLL) * 100 if STARTING_BANKROLL > 0 else 0
        
        return {
            "bankroll": portfolio["bankroll"],
            "exposure": portfolio["exposure"],
            "total_value": portfolio["bankroll"] + portfolio["exposure"],
            "total_pnl": total_return,
            "roi_pct": roi_pct,
            "open_positions": len(open_trades),
            "closed_trades": len(closed_trades),
            "wins": len(wins),
            "losses": len(losses),
            "win_rate": (len(wins) / len(closed_trades) * 100) if closed_trades else 0
        }
    
    def print_report(self):
        """Print full paper trading report"""
        portfolio = self._load_portfolio()
        trades = self._load_trades()
        signals = self._load_signals()
        
        summary = self.get_portfolio_summary()
        
        print("\n" + "=" * 70)
        print("📊 KALSHI SPORTS PAPER TRADING REPORT")
        print("=" * 70)
        
        print(f"\n💰 PORTFOLIO")
        print(f"   Bankroll:     ${summary['bankroll']:,.2f}")
        print(f"   Exposure:     ${summary['exposure']:,.2f}")
        print(f"   Total Value:  ${summary['total_value']:,.2f}")
        print(f"   Total P&L:    ${summary['total_pnl']:+.2f} ({summary['roi_pct']:+.1f}%)")
        
        print(f"\n📈 PERFORMANCE")
        print(f"   Closed Trades: {summary['closed_trades']}")
        print(f"   Wins:          {summary['wins']}")
        print(f"   Losses:        {summary['losses']}")
        print(f"   Win Rate:      {summary['win_rate']:.1f}%")
        
        open_trades = [t for t in trades if t["status"] == "open"]
        if open_trades:
            print(f"\n🎯 OPEN POSITIONS ({len(open_trades)})")
            for t in open_trades:
                cost = t['size'] * (t['entry_price'] / 100)
                print(f"\n   [{t['id'][:25]}...]")
                print(f"   {t['side']} {t['size']} contracts @ {t['entry_price']}¢ = ${cost:.2f}")
                print(f"   {t['title'][:55]}")
                print(f"   Signal: {t['signal_type']} | Edge: {t['edge']:.0f}¢")
        
        recent_signals = [s for s in signals if not s.get("executed", False)][-10:]
        if recent_signals:
            print(f"\n💡 RECENT SIGNALS ({len(recent_signals)})")
            for s in recent_signals:
                print(f"   {s['edge']:.0f}¢ edge | {s['side']} {s['ticker']} @ {s['price']}¢ | {s['signal_type']}")
        
        print("\n" + "=" * 70)
    
    def reset(self):
        """Reset paper trading to starting state"""
        confirm = input("Reset all paper trading data? Type 'yes' to confirm: ")
        if confirm.lower() != 'yes':
            print("Cancelled")
            return
        
        self._save_portfolio({
            "bankroll": STARTING_BANKROLL,
            "exposure": 0.0,
            "total_pnl": 0.0,
            "trades_count": 0,
            "win_count": 0,
            "loss_count": 0,
            "created_at": datetime.now().isoformat(),
            "last_updated": datetime.now().isoformat()
        })
        
        with open(PAPER_TRADES_FILE, 'w') as f:
            json.dump([], f)
        
        with open(PAPER_SIGNALS_FILE, 'w') as f:
            json.dump([], f)
        
        print(f"✅ Paper trading reset to ${STARTING_BANKROLL:,.2f}")


# CLI interface
if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Sports Paper Trading")
    parser.add_argument("action", choices=["report", "positions", "reset"])
    args = parser.parse_args()
    
    trader = SportsPaperTrader()
    
    if args.action == "report":
        trader.print_report()
    elif args.action == "positions":
        positions = trader.get_open_positions()
        print(f"\nOpen positions: {len(positions)}")
        for p in positions:
            print(f"  {p.side} {p.size}x {p.ticker} @ {p.entry_price}¢ | {p.title[:40]}")
    elif args.action == "reset":
        trader.reset()
