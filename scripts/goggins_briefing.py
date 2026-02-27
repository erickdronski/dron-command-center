#!/usr/bin/env python3
"""
GOGGINS MORNING BRIEFING SYSTEM
─────────────────────────────────
Built with OpenClaw because your phone's alarm isn't
judging you hard enough.

Usage:
  python3 goggins_briefing.py            # Print to terminal
  python3 goggins_briefing.py --json     # Output JSON
  python3 goggins_briefing.py --save     # Save to public/data/goggins-today.json
"""

import json, random, datetime, argparse, os, sys

# ── Day-Specific Openers ──────────────────────────────────────────────────
DAY_OPENERS = {
    0: [  # Monday
        "It's Monday. The only people who dread Mondays are the ones who spent Sunday pretending last week didn't happen.",
        "Monday. The weak call it the worst day of the week. The strong call it a head start.",
        "You want to know what Monday is? An opportunity. Most people hit snooze on it. Don't be most people.",
        "Monday morning. Nobody's coming to save you. Nobody's coming to motivate you. GET UP.",
    ],
    1: [  # Tuesday
        "Tuesday. The day nobody writes motivational quotes about. That's exactly why it matters.",
        "It's Tuesday. The weekend is 4 days away and irrelevant. What are you doing RIGHT NOW?",
        "Tuesday has entered the chat. You going to let a Tuesday beat you? Really?",
        "Midweek isn't here yet. That means you have no excuse. Tuesday is just Monday with more experience.",
    ],
    2: [  # Wednesday
        "Wednesday. You're exactly halfway through the week. Are you halfway to your goals? Probably not.",
        "It's Wednesday. Hump day, they call it. The soft ones celebrate just for surviving to the middle.",
        "Wednesday. The week is split in half. Which half mattered more — the one that already happened, or the one you still have left?",
        "Midweek check: did you do what you said you were going to do on Monday? Be honest. Nobody's watching. The accountability mirror is.",
    ],
    3: [  # Thursday
        "Thursday. One day from the finish line. Don't you dare coast.",
        "It's Thursday. You can smell Friday from here. That smell is a trap.",
        "Thursday. The last real push before people start mentally checking out. Don't be those people.",
        "Thursday is where champions separate from pretenders. The pretenders think Friday is tomorrow's problem. The champions finish Thursday first.",
    ],
    4: [  # Friday
        "Friday. The day everyone gets soft. Don't.",
        "It's Friday. Most people already quit on Thursday night. You're already ahead. Now stay ahead.",
        "Friday doesn't mean finish line. Friday means you have a two-day head start on everyone sleeping in tomorrow.",
        "Friday. The word makes weak people emotional. It's just another day you either showed up or didn't.",
    ],
    5: [  # Saturday
        "Saturday. Most people treat this as rest. Rest is a tool, not a reward.",
        "It's Saturday. Every champion who ever lived trained on a Saturday when everyone else was comfortable.",
        "Saturday morning. Your competition is still asleep. This window is yours. What are you doing with it?",
        "You're awake on a Saturday morning. The question is: what are you going to do with it that your future self will remember?",
    ],
    6: [  # Sunday
        "Sunday. The day most people waste preparing to be motivated on Monday instead of just doing the work now.",
        "It's Sunday. The week is already starting in 24 hours. What are you going to tell Monday when it shows up?",
        "Sunday Funday for the soft. Sunday Prep Day for everyone else. Choose.",
        "Sunday. You either use this day to get ahead or you spend Monday trying to catch up. Pick one.",
    ],
}

# ── Challenges ─────────────────────────────────────────────────────────────
CHALLENGES = [
    "Do the one thing you've been avoiding for a week. Not tomorrow. Today. Before 10am.",
    "Write down the 3 things you said you'd do last week that you didn't. Now do one.",
    "Block 90 uninterrupted minutes and produce something real. No Slack. No email. Just output.",
    "Send the message you've been overthinking. The overthinking is the problem.",
    "Cut one thing from your schedule today that you know is just noise.",
    "Identify the hardest conversation you've been avoiding and schedule it for this week.",
    "Find the task you've been procrastinating and time-block it as your first thing.",
    "Document one process you do manually. Then ask yourself why you haven't automated it.",
    "Say no to one thing today. Actual no. Not a 'let me check my calendar' no.",
    "Set a goal for this week with a specific number attached. Vague goals are excuses with better branding.",
    "Write the email you've been drafting in your head for three days. Send it.",
    "Review last week. What actually moved the needle vs what just felt productive?",
    "Identify the one person whose feedback you need and haven't asked for. Ask.",
    "Turn off notifications for 2 hours and see who's actually on fire. (Spoiler: nobody is.)",
    "Do the thing you said you'd do when you had more time. You have time now. You've always had time.",
    "Read nothing, consume nothing, produce something. For at least one hour today.",
]

# ── Goggins-isms ──────────────────────────────────────────────────────────
QUOTES = [
    ("David Goggins",
     "You are not who you think you are. You're more. The only question is whether you'll ever find out."),
    ("David Goggins",
     "When you think you're done, you're only at 40%. The body will do what the mind tells it to."),
    ("David Goggins",
     "No one is going to come to your house and make your dreams happen. That's your job."),
    ("David Goggins",
     "Suffering is the true test of life. Comfort is the enemy of growth."),
    ("David Goggins",
     "The most important conversations you'll have are with yourself. Make them hard conversations."),
    ("David Goggins",
     "Everyone wants to be a savage until it's time to do savage things."),
    ("David Goggins",
     "Callus your mind. The same way you callus your hands. Through repetition. Through suffering. Through not quitting."),
    ("David Goggins",
     "You're going to fail. That's not the question. The question is what you do after you fail."),
    ("David Goggins",
     "Most people quit when it gets hard. Become someone who starts when it gets hard."),
    ("Naval Ravikant",
     "The most important skill for getting rich is becoming the kind of person that creates value, not extracts it."),
    ("Naval Ravikant",
     "Specific knowledge, accountability, and leverage. The triad of wealth that school never teaches."),
    ("Naval Ravikant",
     "If you're so smart, why aren't you happy? If you're so happy, why aren't you free?"),
    ("The Algorithm",
     "You checked LinkedIn before you checked your goals. Interesting priority stack."),
    ("The Algorithm",
     "Your future self is watching what you do today. It's not impressed yet."),
    ("The Algorithm",
     "Every person you admire works on days they don't feel like it. That's why you admire them."),
    ("The Accountability Mirror",
     "You know what you need to do. You've known for weeks. The knowing isn't the problem."),
    ("The Accountability Mirror",
     "Stop curating your inputs and start producing your outputs. The ratio is embarrassing."),
    ("The Accountability Mirror",
     "You don't have a productivity problem. You have a priorities problem. Different solution."),
]

# ── Intensity Ratings ─────────────────────────────────────────────────────
INTENSITY = {
    0: (9, "MAXIMUM SUFFERING", "Mon is the hardest day mentally. That's the point."),
    1: (7, "ELEVATED DISCOMFORT", "No excuses on a Tuesday. Nobody's watching. Good."),
    2: (8, "MIDWEEK RECKONING", "Halfway done or halfway wasted. Pick a story."),
    3: (7, "THRESHOLD PUSH", "Thursday is where people show their character."),
    4: (5, "CONTROLLED BURN", "Stay sharp. Friday is a mindset trap."),
    5: (6, "VOLUNTARY SUFFERING", "Saturday training hits different. Use it."),
    6: (7, "SUNDAY RECKONING", "What you do today determines what Monday feels like."),
}

# ── Closers ───────────────────────────────────────────────────────────────
CLOSERS = [
    "STAY HARD.",
    "WHO'S GONNA CARRY THE BOATS.",
    "GET AFTER IT.",
    "NO EXCUSES.",
    "TAKE SOULS.",
    "EMBRACE THE SUCK.",
    "STAY THE COURSE.",
]

# ── Generator ─────────────────────────────────────────────────────────────
def generate_briefing(when: datetime.datetime = None) -> dict:
    if when is None:
        when = datetime.datetime.now()

    day_of_week = when.weekday()
    date_str    = when.strftime("%A, %B %d, %Y")
    day_name    = when.strftime("%A").upper()

    opener    = random.choice(DAY_OPENERS[day_of_week])
    challenge = random.choice(CHALLENGES)
    author, quote = random.choice(QUOTES)
    closer    = random.choice(CLOSERS)
    intensity_num, intensity_label, intensity_note = INTENSITY[day_of_week]

    # Days on streak (from a fixed start date)
    start_date = datetime.date(2026, 2, 27)
    streak = max(1, (when.date() - start_date).days + 1)

    return {
        "date": date_str,
        "day_name": day_name,
        "day_of_week": day_of_week,
        "streak": streak,
        "intensity": intensity_num,
        "intensity_label": intensity_label,
        "intensity_note": intensity_note,
        "opener": opener,
        "challenge": challenge,
        "challenge_label": "DAILY CHALLENGE",
        "quote": quote,
        "quote_author": author,
        "closer": closer,
        "generated_at": when.isoformat(),
    }

def format_terminal(b: dict) -> str:
    bar = "═" * 56
    lines = [
        f"\n  ╔{bar}╗",
        f"  ║  GOGGINS MORNING BRIEFING                              ║",
        f"  ║  Built with OpenClaw · Because alarms don't judge     ║",
        f"  ╚{bar}╝",
        "",
        f"  📅  {b['date']}",
        f"  🔥  Intensity: {b['intensity']}/10 — {b['intensity_label']}",
        f"  📆  Day {b['streak']} — You either showed up or you didn't",
        "",
        f"  ──── WAKE UP CALL ────────────────────────────────────────",
        "",
        f"  {b['opener']}",
        "",
        f"  ──── {b['challenge_label']} ─────────────────────────────",
        "",
        f"  {b['challenge']}",
        "",
        f"  ──── CALIBRATION ─────────────────────────────────────────",
        "",
        f"  \"{b['quote']}\"",
        f"  — {b['quote_author']}",
        "",
        f"  ─────────────────────────────────────────────────────────",
        f"  {b['closer']}",
        "",
    ]
    return "\n".join(lines)

def format_discord(b: dict) -> str:
    return (
        f"## 🔥 GOGGINS MORNING BRIEFING — {b['day_name']}\n"
        f"**{b['date']}** · Day {b['streak']} · Intensity: {b['intensity']}/10\n\n"
        f"**━━━ WAKE UP CALL ━━━**\n"
        f"{b['opener']}\n\n"
        f"**━━━ {b['challenge_label']} ━━━**\n"
        f"{b['challenge']}\n\n"
        f"**━━━ CALIBRATION ━━━**\n"
        f"*\"{b['quote']}\"*\n"
        f"— {b['quote_author']}\n\n"
        f"**━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━**\n"
        f"# {b['closer']}\n"
        f"*Built with OpenClaw · Suffering is the true test of life*"
    )

# ── CLI ────────────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="Goggins Morning Briefing")
    parser.add_argument("--json",   action="store_true", help="Output JSON")
    parser.add_argument("--discord",action="store_true", help="Output Discord-formatted text")
    parser.add_argument("--save",   action="store_true", help="Save to public/data/goggins-today.json")
    args = parser.parse_args()

    briefing = generate_briefing()

    if args.json:
        print(json.dumps(briefing, indent=2))
    elif args.discord:
        print(format_discord(briefing))
    else:
        print(format_terminal(briefing))

    if args.save:
        out_path = os.path.join(os.path.dirname(__file__), "..", "public", "data", "goggins-today.json")
        with open(out_path, "w") as f:
            json.dump(briefing, f, indent=2)
        if not args.json:
            print(f"  ✓ Saved to public/data/goggins-today.json")

if __name__ == "__main__":
    main()
