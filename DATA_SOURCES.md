# Dashboard Data Sources - REAL vs TODO

Updated: Feb 18, 2026 8:52 PM EST

## ✅ REAL DATA (Connected & Live)

### Trading - Polymarket
- **Source:** `/polymarket-fastloop/ml_data/training_data.json`
- **Data Points:**
  - Total trades (24h): Calculated from trade timestamps
  - Win rate: Calculated from trade outcomes (win/loss)
  - P&L (24h): Sum of all trade profits/losses in last 24h
  - Active positions: Count from `active_positions.json`
- **Update Frequency:** Real-time (reads from file on each API call)

### Social - X Bot State
- **Source:** `/x_bot_state.json`
- **Data Points:**
  - Engaged users count: `engaged_users.length`
  - Engaged tweets count: `engaged_tweets.length`
  - Daily budget spent: `daily_budget_spent`
  - Last engagement timestamp: `last_engagement`
  - Posts today: `posts_today`
- **Update Frequency:** Updated by X bot on each run

### Social - X Follower Count (LIVE API)
- **Source:** Twitter API v2 (`GET /users/:id`)
- **Data Points:**
  - Current follower count: Direct from Twitter
  - 24h change: Tracked in `x_follower_history.json`
- **Update Frequency:** Fetched on each dashboard load (30s cache recommended)
- **API Key:** Stored in `lib/data-sources.ts`

## 🚧 TODO - Needs Connection

### Cron Jobs Status
- **Current:** Hardcoded array in `app/api/status/route.ts`
- **Need:** Connect to OpenClaw cron API
- **How:** Use `cron` tool to query job list, parse nextRunAtMs, status, errors
- **Data:** 5 active jobs (X Posts, X Engagement, Weather Trader, Cron Monitor, Weekly Analytics)

### Activity Feed
- **Current:** Mock/empty array
- **Need:** Parse recent logs or Discord messages
- **Sources:**
  - `/polymarket-fastloop/ml_data/*.log` files
  - Discord channel messages (via message tool)
  - X bot log output
- **Display:** Last 10-20 activities with timestamps

### Alerts
- **Current:** Basic budget/loss thresholds
- **Need:** Comprehensive alerting system
- **Auto-detect:**
  - Budget >80% of daily limit
  - Trading loss >$5 in 24h
  - Consecutive cron errors (3+)
  - Unusual market conditions
  - System failures

### Weather Trading
- **Current:** Hardcoded to 0 (no markets in Feb)
- **Need:** Connect when weather markets appear (April+)
- **Source:** Will create state file when bot starts trading

### Engagement Rate
- **Current:** 0 (placeholder)
- **Need:** Calculate from tweet performance
- **Formula:** (likes + RTs + replies) / impressions * 100
- **Source:** X API `GET /tweets/:id` with `public_metrics`

## 📊 Data Flow Architecture

```
Dashboard API Route
    ↓
lib/data-sources.ts (fetchers)
    ↓
┌─────────────────────────────────────────┐
│ REAL SOURCES:                           │
│  • x_bot_state.json                     │
│  • training_data.json                   │
│  • active_positions.json                │
│  • Twitter API v2                       │
│  • x_follower_history.json              │
└─────────────────────────────────────────┘
```

## 🎯 Priority Order for Remaining Connections

1. **Cron Job Status** (High) - Essential for system monitoring
2. **Activity Feed** (Medium) - Adds context, not critical
3. **Engagement Rate** (Low) - Nice to have, not essential
4. **Advanced Alerts** (Medium) - Important for automation

## API Rate Limits

- **Twitter API (Free tier):**
  - 500k tweets/month read
  - Rate limit: 15 requests/15min per endpoint
  - Current usage: ~2 requests/min (follower count every 30s)

## Cache Strategy

- **Follower count:** Cache for 5-10 minutes (Twitter data doesn't change that fast)
- **Trading P&L:** Real-time (file reads are fast)
- **Cron status:** Cache for 30s (aligns with cron monitor frequency)
- **Activity feed:** Cache for 10s (reduce log parsing overhead)

## Security Notes

- ✅ X API credentials stored in server-side `lib/data-sources.ts`
- ✅ No credentials exposed to client
- ✅ All API routes use `dynamic = 'force-dynamic'` (no static caching)
- ⚠️ Consider adding API key rotation schedule
- ⚠️ Monitor API usage to avoid unexpected costs

---

**Next Deploy:** Connect cron status + activity feed for fully live dashboard
