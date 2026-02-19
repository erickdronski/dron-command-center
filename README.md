# 💸 Dron Command Center

**AI-First Collaboration Platform** for managing autonomous trading bots, social automation, and real-time system monitoring.

## 🎯 Vision

Transform the dashboard into a **collaboration HQ** where:
- AI proposes new features/bots
- You approve/reject with one click
- AI builds automatically in the background
- Track everything visually in real-time
- Steer direction, AI handles execution

## 🚀 Features

### ✅ Phase 1 (DEPLOYED - Feb 18, 2026)
- **Main Dashboard** - Real-time trading P&L, social growth, system health
- **Project Board** - Kanban view of all active work
- **AI Workbench** - Propose → Approve → Build workflow
- **Real Data Integration** - Twitter API, trading logs, bot state
- **Auto-refresh** - Every 30s, always up to date

### 🚧 Phase 2 (IN PROGRESS)
- Discord channel activity feed
- Interactive Kanban (drag-drop)
- Cron job live status
- Advanced alerting system
- Historical charts

### 📋 Phase 3 (PLANNED)
- Manual trade execution
- Bot configuration UI
- Performance analytics
- Mobile app

## 📊 Pages

### `/` - Main Dashboard
Real-time overview of all systems:
- Trading P&L (Polymarket + Weather)
- X follower growth & engagement
- System health (5 active jobs)
- Live alerts

### `/projects` - Project Board
Kanban-style project tracking:
- Backlog → In Progress → Testing → Live
- 8 projects currently tracked
- Visual status at a glance

### `/collaborate` - AI Workbench ⭐ NEW
**The magic happens here:**
1. **Dron proposes** new features/bots with reasoning
2. **You approve/reject** with one click
3. **Dron builds** automatically when approved
4. **Track progress** in real-time

**Current proposals:**
- Weather Trading Bot (NOAA integration)
- Discord Activity Feed
- Cron Job Live Status API
- Cross-Platform Arb Scanner
- Daily Digest Cron
- Interactive Project Management

## 🔗 Data Sources

### ✅ Connected (Real Data)
- **Twitter API v2** - Live follower count, 24h change
- **X Bot State** - Engagement metrics, budget tracking
- **Trading Logs** - P&L calculation, win rates, positions
- **OpenClaw Cron** - Job status (partial)

### 🚧 TODO (Documented)
- Discord channel messages (activity feed)
- OpenClaw cron API (full integration)
- Tweet engagement rates
- Advanced error tracking

See `DATA_SOURCES.md` for complete breakdown.

## 🏗️ Architecture

```
Dashboard (Next.js 15)
    ↓
API Routes (/api/status, /api/proposals)
    ↓
Data Sources (lib/data-sources.ts)
    ↓
┌─────────────────────────────────────────┐
│ • Twitter API                           │
│ • x_bot_state.json                      │
│ • training_data.json                    │
│ • proposals.json                        │
│ • Discord channels (via message tool)   │
└─────────────────────────────────────────┘
```

## 🛠️ Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library
- **Vercel** - Hosting & deployment

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## 📦 Deployment

Automatically deploys to Vercel on every push.

**Live URL:** https://dron-command-center.vercel.app

To deploy manually:
```bash
vercel --prod
```

## 🔐 Environment

No environment variables needed - all data sources are file-based or use hardcoded API keys (server-side only).

## 📝 File Structure

```
app/
  ├── page.tsx               # Main dashboard
  ├── projects/page.tsx      # Kanban board
  ├── collaborate/page.tsx   # AI Workbench
  ├── components/            # Reusable components
  │   └── ProposalCard.tsx
  └── api/
      ├── status/route.ts    # System status API
      └── proposals/route.ts # Proposal management API

lib/
  ├── data-sources.ts        # Real data fetchers
  └── discord-feed.ts        # Discord integration

DATA_SOURCES.md              # What's real vs TODO
```

## 🎨 Design Philosophy

- **Dark mode first** - Easy on the eyes
- **Data-dense** - Maximum info, minimum space
- **Real-time** - Always fresh, auto-updating
- **Interactive** - Click to act, not just view
- **Gradient accents** - Green/yellow for money, purple/pink for AI

## 🔮 Future Vision

Transform into full **AI Development Platform**:
- AI autonomously proposes improvements
- You approve with reasoning
- AI builds, tests, deploys
- Visual progress tracking
- Chat-based project management
- Multi-agent orchestration

**Goal:** You steer, AI executes. Pure collaboration.

## 📊 Metrics Tracked

- Trading P&L (24h)
- Win rates by strategy
- X follower growth
- Engagement rates
- Budget utilization
- System uptime
- Error frequency
- Proposal velocity

## 🤝 Contributing

This is a personal project, but ideas welcome! Open issues on GitHub.

## 📄 License

MIT

---

**Built with 💸 by Dron** • February 2026  
*The future of AI-human collaboration*
