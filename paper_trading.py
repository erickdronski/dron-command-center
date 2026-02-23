#!/usr/bin/env python3
"""
Paper Trading Manager for Kalshi Sports
Track portfolio, P&L, and trade history
"""

import json
import argparse
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional
from dataclasses import dataclass, asdict

DATA_DIR = Path(__file__).parent / "data"
DATA_DIR.mkdir(exist_ok=True)

PORTFOLIO_FILE = DATA_DIR / "portfolio.json"
TRADES_FILE = DATA_DIR / "paper_trades.json"
HISTORY_FILE = DATA_DIR / "trade_history.json"

STARTING_BANKROLL = 1000.0

@dataclass
class Portfolio:
    bankroll: float
    exposure: float
    total_pnl: float
    trades_count: int
    win_count: int
    loss_count: int
    
    @property
    def total_value(self) -> float:
        return self.bankroll + self.exposure
    
    @property
    def win_rate(self) -> float:
        if self.trades_count == 0:
            return 0.0
        return self.win_count / self.trades_count * 100


class PaperTradingManager:
    def __init__(self):
        self._ensure_files()
    
    def _ensure_files(self):
        """Create files if they don't exist"""
        if not PORTFOLIO_FILE.exists():
            self._save_portfolio(Portfolio(
                bankroll=STARTING_BANKROLL,
                exposure=0.0,
                total_pnl=0.0,
                trades_count=0,
                win_count=0,
                loss_count=0
            ))
        
        if not TRADES_FILE.exists():
            with open(TRADES_FILE, 'w') as f:
                json.dump([], f)
    
    def _load_portfolio(self) -> Portfolio:
        with open(PORTFOLIO_FILE) as f:
            data = json.load(f)
        return Portfolio(**data)
    
    def _save_portfolio(self, portfolio: Portfolio):
        with open(PORTFOLIO_FILE, 'w') as f:
            json.dump(asdict(portfolio), f, indent=2)
    
    def _load_trades(self) -> List[Dict]:
        with open(TRADES_FILE) as f:
            return json.load(f)
    
    def _save_trades(self, trades: List[Dict]):
        with open(TRADES_FILE, 'w') as f:
            json.dump(trades, f, indent=2)
    
    def buy(self, market_id: str, title: str, side: str, price: float, contracts: int):
        """Open a new paper position"""
        portfolio = self._load_portfolio()
        trades = self._load_trades()
        
        cost = contracts * (price / 100)
        
        if cost > portfolio.bankroll:
            print(f"❌ Insufficient funds. Need ${cost:.2f}, have ${portfolio.bankroll:.2f}")
            return False
        
        trade = {
            "id": f"paper_{int(datetime.now().timestamp())}",
            "market_id": market_id,
            "market_title": title,
            "side": side.upper(),
            "entry_price": price,
            "size": contracts,
            "timestamp": datetime.now().isoformat(),
            "status": "open",
            "exit_price": None,
            "exit_timestamp": None,
            "pnl": None
        }
        
        trades.append(trade)
        portfolio.bankroll -= cost
        portfolio.exposure += cost
        
        self._save_trades(trades)
        self._save_portfolio(portfolio)
        
        print(f"✅ BOUGHT: {side.upper()} {contracts} contracts @ {price}¢")
        print(f"   Market: {title}")
        print(f"   Cost: ${cost:.2f}")
        return True
    
    def sell(self, trade_id: str, exit_price: float):
        """Close a paper position"""
        portfolio = self._load_portfolio()
        trades = self._load_trades()
        
        trade = None
        for t in trades:
            if t["id"] == trade_id and t["status"] == "open":
                trade = t
                break
        
        if not trade:
            print(f"❌ Trade {trade_id} not found or already closed")
            return False
        
        # Calculate P&L
        entry = trade["entry_price"]
        side = trade["side"]
        size = trade["size"]
        
        if side == "YES":
            pnl = (exit_price - entry) * size / 100
        else:  # NO
            pnl = (entry - exit_price) * size / 100
        
        # Update trade
        trade["status"] = "closed"
        trade["exit_price"] = exit_price
        trade["exit_timestamp"] = datetime.now().isoformat()
        trade["pnl"] = round(pnl, 2)
        
        # Update portfolio
        original_cost = size * (entry / 100)
        payout = size * (exit_price / 100) if side == "YES" else size * ((100 - exit_price) / 100)
        
        portfolio.exposure -= original_cost
        portfolio.bankroll += payout
        portfolio.total_pnl += pnl
        portfolio.trades_count += 1
        
        if pnl > 0:
            portfolio.win_count += 1
        else:
            portfolio.loss_count += 1
        
        self._save_trades(trades)
        self._save_portfolio(portfolio)
        
        emoji = "🟢" if pnl > 0 else "🔴"
        print(f"{emoji} SOLD: {trade_id}")
        print(f"   Entry: {entry}¢ → Exit: {exit_price}¢")
        print(f"   P&L: ${pnl:+.2f}")
        return True
    
    def close_all(self, exit_price: float = 50):
        """Close all open positions"""
        trades = self._load_trades()
        open_trades = [t for t in trades if t["status"] == "open"]
        
        if not open_trades:
            print("No open positions")
            return
        
        print(f"Closing {len(open_trades)} positions at {exit_price}¢...")
        for t in open_trades:
            self.sell(t["id"], exit_price)
    
    def report(self):
        """Print full report"""
        portfolio = self._load_portfolio()
        trades = self._load_trades()
        
        open_trades = [t for t in trades if t["status"] == "open"]
        closed_trades = [t for t in trades if t["status"] == "closed"]
        
        print("\n" + "=" * 70)
        print("📊 KALSHI PAPER TRADING REPORT")
        print("=" * 70)
        
        print(f"\n💰 PORTFOLIO")
        print(f"   Bankroll:     ${portfolio.bankroll:,.2f}")
        print(f"   Exposure:     ${portfolio.exposure:,.2f}")
        print(f"   Total Value:  ${portfolio.total_value:,.2f}")
        print(f"   Total P&L:    ${portfolio.total_pnl:+.2f}")
        
        print(f"\n📈 PERFORMANCE")
        print(f"   Total Trades: {portfolio.trades_count}")
        print(f"   Wins:         {portfolio.win_count}")
        print(f"   Losses:       {portfolio.loss_count}")
        print(f"   Win Rate:     {portfolio.win_rate:.1f}%")
        
        if open_trades:
            print(f"\n🎯 OPEN POSITIONS ({len(open_trades)})")
            for t in open_trades:
                cost = t['size'] * (t['entry_price'] / 100)
                print(f"\n   [{t['id'][:20]}...]")
                print(f"   {t['side']} {t['size']} contracts @ {t['entry_price']}¢")
                print(f"   Cost: ${cost:.2f} | {t['market_title'][:50]}")
        
        if closed_trades:
            print(f"\n✅ CLOSED TRADES ({len(closed_trades)})")
            recent = sorted(closed_trades, key=lambda x: x['exit_timestamp'] or '', reverse=True)[:10]
            for t in recent:
                emoji = "🟢" if t.get('pnl', 0) > 0 else "🔴"
                print(f"   {emoji} ${t.get('pnl', 0):+.2f} | {t['side']} {t['size']} @ {t['entry_price']}¢ → {t['exit_price']}¢")
        
        print("\n" + "=" * 70)
    
    def reset(self):
        """Reset portfolio to starting state"""
        confirm = input("Reset all data? Type 'yes' to confirm: ")
        if confirm.lower() != 'yes':
            print("Cancelled")
            return
        
        self._save_portfolio(Portfolio(
            bankroll=STARTING_BANKROLL,
            exposure=0.0,
            total_pnl=0.0,
            trades_count=0,
            win_count=0,
            loss_count=0
        ))
        
        with open(TRADES_FILE, 'w') as f:
            json.dump([], f)
        
        print("✅ Portfolio reset to $1,000")


def main():
    parser = argparse.ArgumentParser(description='Paper Trading Manager')
    parser.add_argument('action', choices=['report', 'buy', 'sell', 'close-all', 'reset'])
    parser.add_argument('--market', '-m', help='Market ID')
    parser.add_argument('--title', '-t', help='Market title')
    parser.add_argument('--side', '-s', choices=['yes', 'no'], help='Side to buy')
    parser.add_argument('--price', '-p', type=float, help='Price in cents (0-100)')
    parser.add_argument('--size', '-n', type=int, help='Number of contracts')
    parser.add_argument('--trade-id', '-i', help='Trade ID to sell')
    
    args = parser.parse_args()
    
    manager = PaperTradingManager()
    
    if args.action == 'report':
        manager.report()
    
    elif args.action == 'buy':
        if not all([args.market, args.title, args.side, args.price, args.size]):
            print("Usage: paper_trading.py buy -m MARKET -t TITLE -s yes/no -p PRICE -n SIZE")
            return
        manager.buy(args.market, args.title, args.side, args.price, args.size)
    
    elif args.action == 'sell':
        if not args.trade_id or not args.price:
            print("Usage: paper_trading.py sell -i TRADE_ID -p EXIT_PRICE")
            return
        manager.sell(args.trade_id, args.price)
    
    elif args.action == 'close-all':
        price = args.price or 50
        manager.close_all(price)
    
    elif args.action == 'reset':
        manager.reset()


if __name__ == "__main__":
    main()
