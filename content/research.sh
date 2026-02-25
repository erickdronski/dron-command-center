#!/bin/bash
# LinkedIn Content Research Script
# Run daily to gather intel for content ideas

echo "=== LinkedIn Content Research - $(date) ==="
echo ""

# Check X/Twitter for trending AI topics
echo "📱 X/Twitter Trends to Check:"
echo "   Search: 'OpenClaw OR AI agents OR autonomous OR polymarket'"
echo "   Search: 'Claude OR GPT-4o OR Gemini' (model discussions)"
echo "   Check: @DronskiErick mentions and replies"
echo ""

# Check GitHub trending
echo "💻 GitHub Trending (AI/Agents):"
curl -s "https://github.com/trending/python?since=daily" | grep -o 'href="[^"]*"' | grep -v 'http' | head -10 || echo "   (Manual check: github.com/trending)"
echo ""

# Check your own systems
echo "🤖 Your Systems Status:"
echo "   Weather Bot: Check ../polymarket-fastloop/ for recent trades"
echo "   X Bot: Check ../x_bot_state.json for follower count"
echo "   Command Center: Any new features shipped?"
echo ""

# Content ideas from your activity
echo "📝 Content Ideas from Your Activity:"
echo "   - Any wins/losses this week?"
echo "   - New features built?"
echo "   - Interesting findings from testing?"
echo "   - Community insights from Discord?"
echo ""

# Check for post-worthy events
echo "⚡ Quick Checks:"
echo "   [ ] Trading bot hit milestone?"
echo "   [ ] X followers hit round number?"
echo "   [ ] Shipped a new feature?"
echo "   [ ] Learned something counter-intuitive?"
echo "   [ ] Saw someone doing something interesting?"
echo ""

echo "=== Next Steps ==="
echo "1. Review CONTENT-ENGINE.md for templates"
echo "2. Draft post in content/drafts/"
echo "3. Schedule or post directly"
echo ""
