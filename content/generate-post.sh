#!/bin/bash
# Auto-generate LinkedIn post from system activity
# Usage: ./generate-post.sh [type] [topic]
# Example: ./generate-post.sh build "command center dashboard"

TYPE=$1
TOPIC=$2
DATE=$(date +%Y-%m-%d)

if [ -z "$TYPE" ] || [ -z "$TOPIC" ]; then
    echo "Usage: ./generate-post.sh [type] [topic]"
    echo "Types: build, results, test, intel, strategic"
    echo "Example: ./generate-post.sh results 'weather bot'"
    exit 1
fi

FILENAME="../drafts/${DATE}-${TYPE}-${TOPIC// /-}.md"

case $TYPE in
    build)
        cat > "$FILENAME" << 'EOF'
# Build Update - [TITLE]

**Status:** Draft
**Type:** Build Update
**Platform:** LinkedIn

---

## Post

```
Shipped [THING] this [TIME PERIOD].

What it does: [1 sentence]
What broke: [1 sentence]
What I learned: [1 sentence]

[screenshot/metric]

The real lesson: [insight about AI/building]

#AI #BuildingInPublic #[relevant]
```

---

## Details to Fill In

- [ ] What did you ship?
- [ ] What was the specific functionality?
- [ ] What broke during the process?
- [ ] What did you learn?
- [ ] Any metrics to share?
- [ ] Screenshot available?

## Notes

[Add any context, links, or raw thoughts here]
EOF
        ;;
    results)
        cat > "$FILENAME" << 'EOF'
# Results Post - [TITLE]

**Status:** Draft
**Type:** Results/Metrics
**Platform:** LinkedIn

---

## Post

```
[X] days of [ACTIVITY] results:

→ [Metric 1]: [result]
→ [Metric 2]: [result]
→ [Metric 3]: [result]

What worked: [1 sentence]
What didn't: [1 sentence]

Next: [what's coming]

[screenshot/chart]

#AI #Results #[topic]
```

---

## Details to Fill In

- [ ] Time period (days/weeks/months)
- [ ] Activity being measured
- [ ] Metric 1 + result
- [ ] Metric 2 + result
- [ ] Metric 3 + result
- [ ] What worked?
- [ ] What didn't?
- [ ] What's next?
- [ ] Chart/screenshot available?

## Raw Data

[Paste any raw numbers/data here]
EOF
        ;;
    test)
        cat > "$FILENAME" << 'EOF'
# Capability Test - [TITLE]

**Status:** Draft
**Type:** Capability Test
**Platform:** LinkedIn

---

## Post

```
Tested [X] on [TASK].

Setup: [brief context]
Results:
• [Option A]: [result + metric]
• [Option B]: [result + metric]
• [Option C]: [result + metric]

Winner: [X]
Surprise: [Y]

[screenshot/data]

#AI #[tool] #Testing
```

---

## Details to Fill In

- [ ] What did you test?
- [ ] What was the task?
- [ ] What was the setup?
- [ ] Option A result
- [ ] Option B result
- [ ] Option C result (if applicable)
- [ ] Winner and why
- [ ] Surprise finding
- [ ] Screenshot/data available?

## Test Notes

[Add methodology, caveats, raw results here]
EOF
        ;;
    intel)
        cat > "$FILENAME" << 'EOF'
# Community Intel - [TITLE]

**Status:** Draft
**Type:** Community Intel
**Platform:** LinkedIn

---

## Post

```
Saw [PERSON] do [THING] on [PLATFORM].

Why it matters:
[2-3 sentences on implication]

What I'm stealing:
[1 sentence on application]

[link/screenshot]

#AI #Builders #[topic]
```

---

## Details to Fill In

- [ ] Who did you see?
- [ ] What did they do?
- [ ] On what platform?
- [ ] Why does it matter? (2-3 sentences)
- [ ] What will you steal/apply?
- [ ] Link or screenshot available?

## Source

[Link to original post/thread]
EOF
        ;;
    strategic)
        cat > "$FILENAME" << 'EOF'
# Strategic Take - [TITLE]

**Status:** Draft
**Type:** Strategic Take
**Platform:** LinkedIn

---

## Post

```
Hot take: [CONTROVERSIAL STATEMENT]

Here's why:
1. [point with evidence]
2. [point with evidence]
3. [point with evidence]

The counter-argument:
[acknowledge other side fairly]

Where I land:
[your position]

#AI #Strategy #[topic]
```

---

## Details to Fill In

- [ ] What's the hot take/controversial statement?
- [ ] Point 1 with evidence
- [ ] Point 2 with evidence
- [ ] Point 3 with evidence
- [ ] Counter-argument (acknowledge other side)
- [ ] Where you land (your position)

## Supporting Evidence

[Links, data, examples that support your take]
EOF
        ;;
    *)
        echo "Unknown type: $TYPE"
        echo "Valid types: build, results, test, intel, strategic"
        exit 1
        ;;
esac

echo "Created draft: $FILENAME"
echo "Fill in the details and move to ../ready-to-post/ when done"
