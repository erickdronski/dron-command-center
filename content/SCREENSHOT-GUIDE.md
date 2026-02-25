# LinkedIn Visual Assets - Screenshot Guide

## How to Screenshot for LinkedIn

### Mac Shortcuts
- **Full screen:** Cmd+Shift+3
- **Select area:** Cmd+Shift+4 (drag to select)
- **Window:** Cmd+Shift+4, then Space, click window
- **CleanShot X:** Recommended for annotations

### Browser DevTools (Cleanest)
1. Open page in Chrome/Edge
2. F12 → Cmd+Shift+P → "screenshot"
3. Choose: "Capture full size screenshot" or "Capture node screenshot"

### Optimal LinkedIn Image Size
- **Width:** 1200px minimum
- **Aspect:** 16:9 or 4:3 works best
- **Format:** PNG for UI, JPG for photos

---

## Post-by-Post Visual Guide

### Post 1: OpenClaw Early Adopter
**Visual:** Command Center Dashboard
**URL:** `http://localhost:3000` or `https://dron-command-center.vercel.app`

**Screenshot Setup:**
1. Open dashboard
2. Ensure stats load (refresh if needed)
3. Screenshot full page showing:
   - Stats cards (X Posts, Trades, Active Jobs)
   - Quick links grid
   - Activity feed

**Best Shot:**
```
┌─────────────────────────────────────────┐
│  Dashboard                              │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐   │
│  │ 12 │ │ 5  │ │ 8  │ │ 0  │ │ 47 │   │
│  └────┘ └────┘ └────┘ └────┘ └────┘   │
│                                         │
│  Quick Access                           │
│  [Analytics] [Deploys] [X Posts] ...    │
│                                         │
│  Recent Activity                        │
│  • Shipped weather bot...               │
│  • Deployed to Vercel...                │
└─────────────────────────────────────────┘
```

---

### Post 2: Weather Bot Results
**Visual:** Trading Performance Page
**URL:** `/analytics/trading`

**Screenshot Setup:**
1. Navigate to `/analytics/trading`
2. Wait for data to load
3. Screenshot showing:
   - Total P&L (big number)
   - Win Rate percentage
   - Daily P&L chart (the bar chart)
   - Recent trades list

**Best Shot:**
```
┌─────────────────────────────────────────┐
│  Trading Performance                    │
│                                         │
│  ┌────────┐ ┌────────┐ ┌────────┐      │
│  │ +$127  │ │ 58.3%  │ │   24   │      │
│  │  P&L   │ │ Win %  │ │ Trades │      │
│  └────────┘ └────────┘ └────────┘      │
│                                         │
│  Daily P&L                              │
│  02-20 ████████ +$45                    │
│  02-21 ████     +$23                    │
│  02-22 █████████ +$59                   │
│                                         │
│  Recent Trades                          │
│  Wembanyama 8+ assists   +$12   closed  │
└─────────────────────────────────────────┘
```

---

### Post 3: Model Testing
**Visual:** Terminal/Code Screenshot
**Option A:** Screenshot your actual terminal showing model comparison
**Option B:** Create a clean comparison graphic

**For Terminal Screenshot:**
```bash
# Run a test and screenshot results
cd ~/workspace
# Show side-by-side model outputs
```

**Clean Comparison Table:**
```
┌─────────────────────────────────────────┐
│  Model Test: Discord Bot Build          │
│                                         │
│  Model        Time    Cost    Result    │
│  ─────────────────────────────────────  │
│  GPT-4o       45s     $0.12   ✓ 2 fixes │
│  Claude       62s     $0.18   ✓ 1st try │
│  Gemini       38s     $0.08   ✗ Halluc  │
│  DeepSeek    120s     $0.02   ✓ Heavy   │
│                                         │
│  Winner: Claude (reliability)           │
│  Surprise: DeepSeek viable at 1/10 cost │
└─────────────────────────────────────────┘
```

---

### Post 4: Hiring Agents Take
**Visual:** Team Page
**URL:** `/team`

**Screenshot Setup:**
1. Navigate to `/team`
2. Screenshot showing:
   - Agent cards (Dron Builder, Dron Analyst)
   - Their roles/status
   - Recent activity

---

### Post 5: Build Update
**Visual:** Live Feed Page
**URL:** `/live-feed`

**Screenshot Setup:**
1. Navigate to `/live-feed`
2. Ensure recent activity is visible
3. Screenshot terminal-style feed

---

### Post 6: X Bot Growth
**Visual:** X Analytics or Follower Chart
**Need to Build:** Simple follower growth chart

**Create this component:**
```tsx
// app/analytics/x/page.tsx
// Shows follower count over time
```

**Or screenshot from X:**
- analytics.twitter.com
- Screenshot follower graph

---

## Quick Reference: What to Build

### Already Have (Screenshot Ready)
- [x] Dashboard (`/`)
- [x] Trading Performance (`/analytics/trading`) ← NEW
- [x] Live Feed (`/live-feed`)
- [x] Team (`/team`)
- [x] Weather (`/weather`)

### Need to Build
- [ ] X Follower Growth Chart (`/analytics/x`)
- [ ] ML Model Performance (`/value-engineering` enhanced)
- [ ] System Architecture Diagram (static image)

### Can Create Without Code
- [ ] Model comparison table (Figma/Canva/Keynote)
- [ ] Before/After workflow graphics
- [ ] Architecture diagrams (excalidraw.com)

---

## Pro Tips

1. **Hide browser UI:** Use fullscreen mode or dev tools device mode
2. **Dark mode:** Your theme looks professional, lean into it
3. **Annotations:** Add arrows/highlights with CleanShot or Preview
4. **Multiple angles:** Take 2-3 screenshots, pick the best
5. **Consistency:** Use same screenshot style across posts

---

## Screenshot Checklist

Before posting with image:
- [ ] Image is 1200px+ wide
- [ ] Key numbers are readable
- [ ] No sensitive data exposed
- [ ] No browser UI visible
- [ ] Dark theme consistent
- [ ] Professional appearance
