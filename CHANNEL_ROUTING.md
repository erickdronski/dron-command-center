# Discord Channel Routing for AI Workbench

When building approved proposals, Dron will work in the appropriate channel based on project category:

## Channel Mapping

### Trading Bots
- **Category:** `trading`
- **Channels:**
  - Weather Trading Bot → **#weather-trader** (1473535322271907840)
  - Polymarket/FastLoop → **#polymarket-trades** (1473394875826180096)
  - Arb Scanner → **#polymarket-trades** (general trading)
  - Any other trading → **#polymarket-trades**

### Social/Content
- **Category:** `social`
- **Channels:**
  - X Bot features → **#x-posts** (1473823764848541836)
  - X Engagement → **#x-engagement** (1473823783848030238)
  - Audience analytics → **#audience-growth** (1473824036466458726)

### Infrastructure/System
- **Category:** `infrastructure`
- **Channels:**
  - Discord integrations → **#general** (1473386869390835861)
  - Cron jobs → **#cron-jobs** (1473399326322458838)
  - Dashboard updates → **#general**
  - Error handling → **#errors** (1473824129249763459)

### Analytics
- **Category:** `analytics`
- **Channels:**
  - Daily digest → **#daily-digest** (1473823899816050719)
  - Performance reports → **#general**
  - Stats dashboards → **#general**

## Workflow Example

**When you approve "Weather Trading Bot":**
1. Webhook pings #general with approval notification
2. Dron acknowledges in #general
3. Dron switches to #weather-trader channel
4. All build updates/progress posted to #weather-trader
5. Completion message posted to both #weather-trader and #general

**When you approve "Discord Activity Feed":**
1. Webhook pings #general with approval
2. Dron acknowledges in #general
3. Work happens in #general (infrastructure)
4. Testing/updates in relevant channels
5. Completion in #general

## Proposal → Channel Map

1. Weather Trading Bot → **#weather-trader**
2. Discord Activity Feed → **#general** (infra)
3. Cron Job Live Status → **#cron-jobs**
4. Arb Scanner → **#polymarket-trades**
5. Daily Digest → **#daily-digest**
6. Interactive PM → **#general** (dashboard feature)

---

**Key Principle:**
- Approval notification → #general (you see it)
- Build process → category-specific channel (organized work)
- Completion → both places (visibility)
