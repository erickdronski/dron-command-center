import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const workspacePath = path.join(process.cwd(), '..');
    const trainingDataPath = path.join(workspacePath, 'polymarket-fastloop', 'ml_data', 'training_data.json');
    
    const data = await fs.readFile(trainingDataPath, 'utf-8');
    const trainingData = JSON.parse(data);
    
    if (!trainingData.trades || trainingData.trades.length === 0) {
      return NextResponse.json({ chartData: [] });
    }
    
    // Get trades from last 24 hours
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const recentTrades = trainingData.trades
      .filter((trade: any) => {
        const tradeDate = new Date(trade.timestamp || trade.entry_time);
        return tradeDate > oneDayAgo;
      })
      .sort((a: any, b: any) => {
        const dateA = new Date(a.timestamp || a.entry_time).getTime();
        const dateB = new Date(b.timestamp || b.entry_time).getTime();
        return dateA - dateB;
      });
    
    // Build cumulative P&L chart data
    let cumulative = 0;
    const chartData = recentTrades.map((trade: any) => {
      const pnl = trade.pnl || trade.profit || 0;
      cumulative += pnl;
      
      const tradeDate = new Date(trade.timestamp || trade.entry_time);
      const time = tradeDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      
      return {
        time,
        pnl,
        cumulative: Math.round(cumulative * 100) / 100,
      };
    });
    
    return NextResponse.json({ chartData });
  } catch (error) {
    console.error('Error fetching trading history:', error);
    return NextResponse.json({ chartData: [] });
  }
}
