# Visual Assets Inventory

## Complete List of Visuals for LinkedIn Content

### ✅ Ready Now (Screenshot These)

| Visual | Page URL | Best For Posts | Notes |
|--------|----------|----------------|-------|
| **Dashboard Overview** | `/` | Post 1, 5 | Full system status |
| **Trading Performance** | `/analytics/trading` | Post 2, 7 | P&L, win rate, daily results |
| **X Analytics** | `/analytics/x` | Post 6 | Follower growth chart |
| **Team/Agents** | `/team` | Post 4 | Agent hierarchy |
| **Live Feed** | `/live-feed` | Post 5 | Terminal-style activity |
| **Weather Trading** | `/weather` | Post 2 | NOAA + signals |

### 📸 Screenshot Instructions

#### 1. Dashboard Overview
```bash
# Start dev server
npm run dev

# Open http://localhost:3000
# Cmd+Shift+4 to select area
# Capture stats cards + quick links
```

#### 2. Trading Performance
```bash
# Open http://localhost:3000/analytics/trading
# Shows P&L, win rate, daily chart
# Best for "results" posts
```

#### 3. X Analytics
```bash
# Open http://localhost:3000/analytics/x
# Shows follower growth chart
# Best for growth milestone posts
```

---

## 🎨 Static Graphics to Create

### Model Comparison Table
**For:** Post 3 (Model Testing)
**Tool:** Canva, Figma, or Keynote
**Specs:** 1200x800, dark theme (#0a0a0a bg)

```
┌────────────────────────────────────────────┐
│  AI Model Comparison: Discord Bot Task     │
├─────────────┬────────┬───────┬─────────────┤
│ Model       │ Time   │ Cost  │ Result      │
├─────────────┼────────┼───────┼─────────────┤
│ GPT-4o      │ 45s    │ $0.12 │ ✓ 2 fixes   │
│ Claude      │ 62s    │ $0.18 │ ✓ 1st try   │
│ Gemini      │ 38s    │ $0.08 │ ✗ Halluc    │
│ DeepSeek    │ 120s   │ $0.02 │ ✓ Heavy PM  │
├─────────────┴────────┴───────┴─────────────┤
│ Winner: Claude    Surprise: DeepSeek       │
└────────────────────────────────────────────┘
```

### System Architecture Diagram
**For:** Technical posts, "how it works" content
**Tool:** Excalidraw (excalidraw.com) - free, hand-drawn style
**Elements:**
- OpenClaw (center)
- Discord (input)
- Trading bots (Kalshi/Polymarket)
- X bot
- Command Center dashboard
- NOAA API

---

## 📊 Data Sources for Visuals

### Trading Data
- **File:** `/data/sports_paper_trades.json`
- **Fields:** entry_price, exit_price, pnl, status
- **Used in:** `/analytics/trading`

### Portfolio Data
- **File:** `/data/sports_paper_portfolio.json`
- **Fields:** total_pnl, win_count, loss_count, total_value
- **Used in:** `/analytics/trading`

### X Posts Data
- **File:** `/public/data/x_posts.json`
- **Fields:** content, engagement metrics
- **Used in:** `/analytics/x`

### Live Feed Data
- **File:** `/public/data/feed.json`
- **Fields:** timestamp, type, message, agent
- **Used in:** `/live-feed`

---

## 🛠️ Build Commands

```bash
# Navigate to project
cd /Users/dron/.openclaw/workspace/dron-command-center

# Install dependencies (if needed)
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

---

## 📱 Screenshot Checklist Per Post

### Post 1: OpenClaw Early Adopter
- [ ] Dashboard screenshot showing multiple systems
- [ ] Stats cards visible (trades, posts, jobs)
- [ ] Quick links showing scope

### Post 2: Weather Bot Results
- [ ] Trading Performance page
- [ ] P&L number prominent
- [ ] Win rate visible
- [ ] Daily chart showing consistency

### Post 3: Model Testing
- [ ] Create comparison graphic (Canva/Figma)
- [ ] Or: Terminal screenshot showing actual test
- [ ] Include cost/time/result for each model

### Post 4: Hiring Agents
- [ ] Team page screenshot
- [ ] Agent cards with roles
- [ ] Status indicators

### Post 5: Build Update
- [ ] Screenshot the feature you built
- [ ] Live feed showing activity
- [ ] Before/after if applicable

### Post 6: X Bot Growth
- [ ] X Analytics page
- [ ] Follower growth chart
- [ ] Key metrics visible

---

## 🎯 Visual Hierarchy for Engagement

**Most Engaging Visuals (Ranked):**
1. **Charts showing growth** (follower count, P&L over time)
2. **Dashboard screenshots** (proof of complex systems)
3. **Before/After comparisons** (model testing, improvements)
4. **Terminal/code screenshots** (technical credibility)
5. **Architecture diagrams** (for deep-dive posts)

**Tips:**
- Lead with the number (big P&L, follower count)
- Use your dark theme consistently
- Annotate with arrows/highlights for key points
- Show real data, not mockups
