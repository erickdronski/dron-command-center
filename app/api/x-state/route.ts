import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Since Vercel can't read workspace files, we'll create an API endpoint
// that can be updated by the X bot to push its state here
// For now, return the most recent known state

let xBotState = {
  engaged_users: 97,
  engaged_tweets: 98,
  daily_budget_spent: 0.357,
  last_engagement: "2026-02-18T20:30:35.075159",
  last_reset: "2026-02-18T07:00:23.333871",
  posts_today: 0, // Will be updated by bot
  replies_today: 98,
};

export async function GET() {
  return NextResponse.json(xBotState);
}

// Allow X bot to POST updates to this endpoint
export async function POST(request: Request) {
  try {
    const updates = await request.json();
    xBotState = { ...xBotState, ...updates };
    return NextResponse.json({ success: true, state: xBotState });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
