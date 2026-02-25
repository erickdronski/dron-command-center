# LinkedIn Visual Assets Plan

## Visual Strategy
Every post needs proof. Screenshots > stock images. Real data > mockups.

---

## Visual Types by Post

### 1. OpenClaw Early Adopter Post
**Visual:** Command Center Dashboard Screenshot
**What to show:** 
- Full dashboard with stats cards
- Quick links showing all your systems
- Dark theme aesthetic
**Build needed:** None — screenshot existing dashboard
**Best shot:** Full page at `/` with data loaded

---

### 2. Weather Bot Results Post
**Visual:** P&L Chart + Trading Signals
**What to show:**
- Line chart of daily P&L over time
- Win rate percentage
- Total trades count
**Build needed:** 
- [ ] Analytics page with P&L chart
- [ ] Aggregate trade data from sports_paper_trades.json
**Data source:** `/data/sports_paper_trades.json`

---

### 3. Model Testing Post
**Visual:** Comparison Table/Chart
**What to show:**
- Side-by-side model results
- Cost per attempt
- Success rate
- Time to completion
**Build needed:**
- [ ] Simple comparison component
- [ ] Or: Create static image from template
**Alternative:** Screenshot of code + results in terminal

---

### 4. Hiring Agents Take
**Visual:** Team/Agent Hierarchy
**What to show:**
- Your 3 agents with roles
- What each handles
- Status indicators
**Build needed:** None — screenshot `/team` page
**Best shot:** Full team page showing Dron Builder, Dron Analyst, etc.

---

### 5. Command Center Build Update
**Visual:** Before/After or Feature Showcase
**What to show:**
- The dashboard/feature you built
- Live feed showing activity
**Build needed:** None — screenshot the feature
**Best shot:** `/live-feed` page with real entries

---

### 6. X Bot Growth Post
**Visual:** Follower Growth Chart
**What to show:**
- Follower count over time
- Growth rate
- Key milestones
**Build needed:**
- [ ] Analytics page with X metrics
- [ ] Or: Screenshot from X analytics
**Data source:** X API or manual tracking

---

### 7. FastLoop ML Post
**Visual:** Model Performance Metrics
**What to show:**
- Accuracy before/after
- Feature importance chart
- Live P&L impact
**Build needed:**
- [ ] ML metrics dashboard component
**Data source:** `ml_data/training_data.json`

---

## Pages to Build for Visuals

### Priority 1: Analytics Dashboard
Path: `/analytics`
Purpose: Trading results, P&L charts, win rates
Data: `sports_paper_trades.json`, `sports_paper_portfolio.json`

### Priority 2: X Analytics  
Path: `/posts` (enhance existing)
Purpose: Follower growth, post performance
Data: X API, `x_posts.json`

### Priority 3: ML Performance
Path: `/value-engineering` (enhance existing)
Purpose: Model accuracy, feature importance
Data: `ml_data/training_data.json`

---

## Screenshot Best Practices

### Technical
- Resolution: 1200x800 minimum (LinkedIn optimal)
- Format: PNG for UI screenshots
- Tool: Built-in screenshot or browser dev tools

### Aesthetic
- Use your dark theme (#0a0a0a bg)
- Hide browser UI (use fullscreen or dev tools device mode)
- Clean data (no errors, loading states)
- Highlight key numbers (optional annotation)

### Tools
- Mac: Cmd+Shift+4 (select area)
- Browser: DevTools → Cmd+Shift+P → "screenshot"
- Annotation: CleanShot X, Skitch, or built-in Preview

---

## Asset Inventory

### Already Have
- [x] Command Center dashboard (`/`)
- [x] Live Feed (`/live-feed`)
- [x] Team page (`/team`)
- [x] Weather page (`/weather`)
- [x] Raw trade data (`sports_paper_trades.json`)

### Need to Build
- [ ] Analytics page with P&L charts
- [ ] X follower growth visualization
- [ ] ML model performance metrics
- [ ] System architecture diagram

### Can Create Now
- [ ] Static comparison graphics (model testing)
- [ ] Terminal/command line screenshots
- [ ] Code snippets with syntax highlighting

---

## Immediate Actions

1. **Screenshot existing pages** for immediate posts
2. **Build analytics page** for trading proof
3. **Create static assets** for model comparisons
4. **Set up data pipeline** for auto-updating charts
