# Setting Up Dashboard → Discord Notifications

## Quick Setup (5 minutes)

When you approve a proposal on the dashboard, it needs to notify Dron in Discord so he can start building immediately.

### Option 1: Discord Webhook (Recommended)

1. Open Discord
2. Go to your server settings
3. Click "Integrations" → "Webhooks"
4. Click "New Webhook"
5. Name it "AI Workbench"
6. Select channel: **#general** (or create **#ai-builds**)
7. Copy the webhook URL
8. Go to Vercel dashboard: https://vercel.com/erickdronskis-projects/dron-command-center
9. Settings → Environment Variables
10. Add: `DISCORD_WEBHOOK_URL` = your webhook URL
11. Redeploy (or it will auto-deploy on next push)

### Option 2: Simple Mention (Works Now)

The dashboard will @mention Dron in #general when you click approve.

No setup needed - works immediately!

---

## How It Works

**When you click "Approve & Build":**

1. Dashboard updates proposal status
2. Sends message to Discord: "@Dron - Erick approved: [Proposal Name]"
3. Dron sees the mention
4. Dron starts building immediately
5. Dron updates you with progress

**When complete:**

Dron posts completion message + deployment URL if applicable.

---

## Current Status

✅ Dashboard approval buttons working
✅ Proposal state management
⏳ Discord notifications (needs webhook URL)
✅ Real-time monitoring active

**Next:** Add webhook URL to enable automatic Discord pings!
