# LinkedIn Content System

Your complete personal brand content engine.

## 📁 Structure

```
content/
├── CONTENT-ENGINE.md      # Complete strategy, templates, post queue
├── research.sh             # Daily research checklist script
├── generate-post.sh        # Auto-generate post drafts
├── linkedin-strategy.md    # Strategy overview
├── linkedin-templates.md   # Template library
├── linkedin-posts-ready.md # Original post drafts
├── research-pipeline.md    # Research sources
├── drafts/                 # Works in progress
│   └── README.md
├── ready-to-post/          # Finalized posts
│   └── README.md
└── posted/                 # Archive of published content
    └── README.md
```

## 🚀 Quick Start

### 1. Daily Research (5 min)
```bash
cd content
./research.sh
```

### 2. Create New Draft
```bash
./generate-post.sh [type] [topic]

# Examples:
./generate-post.sh build "new dashboard feature"
./generate-post.sh results "weather bot monthly"
./generate-post.sh test "gpt-4o vs claude"
./generate-post.sh intel "saw on X"
./generate-post.sh strategic "AI employment"
```

### 3. Ready-to-Post Queue
See `CONTENT-ENGINE.md` section "Ready-to-Post Queue" for 10 pre-written posts.

## 📋 Posting Checklist

Before posting:
- [ ] Post has specific numbers/data
- [ ] Includes relevant hashtags (3-5)
- [ ] Has image/screenshot if applicable
- [ ] Reviewed for tone (direct, no fluff)
- [ ] Best time: Tue-Thu, 8-10 AM EST

After posting:
- [ ] Reply to comments in first hour
- [ ] Cross-post to X (modified)
- [ ] Log in `ready-to-post/README.md`

## 📊 Content Calendar

| Day | Post Type | Purpose |
|-----|-----------|---------|
| **Monday** | Build Update | Weekend ship |
| **Wednesday** | Capability Test | Educational |
| **Friday** | Community Intel/Strategic | Thought leadership |

## 🎯 Next 3 Posts (Priority)

1. **OpenClaw Early Adopter** - Post this week
2. **Hiring Agents Take** - Post next week  
3. **Model Testing Results** - Post anytime

See `CONTENT-ENGINE.md` for full post text.

## 📈 Success Metrics

Track monthly:
- Posts: 12/month target
- Follower growth: +20%
- Engagement rate: 3%+
- Profile views: 500+/month

---

_Last updated: 2026-02-26_
