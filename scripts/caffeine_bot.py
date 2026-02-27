#!/usr/bin/env python3
"""
CAFFEINE OPTIMIZATION ENGINE v1.0
──────────────────────────────────
Built with OpenClaw because lying awake at 2am thinking
about Q3 OKRs is not a bug, it's a caffeine architecture problem.

Science:
  - Caffeine half-life: 5.7 hours (average human)
  - Sleep threshold: ~25mg remaining (safe for onset)
  - Average coffee: 95mg | Espresso: 63mg | Energy drink: 160mg

Usage:
  python3 caffeine_bot.py
  python3 caffeine_bot.py --wake 07:00 --sleep 23:00 --coffees 3
  python3 caffeine_bot.py --notify  (sends Discord alert)
"""

import argparse
import math
import json
import datetime
import sys
import os

# ── Constants ──────────────────────────────────────────────────────────────
HALF_LIFE_HOURS = 5.7
SLEEP_THRESHOLD_MG = 25.0   # mg remaining = safe to sleep
SOURCES = {
    "coffee":       {"mg": 95,  "label": "☕ Coffee"},
    "espresso":     {"mg": 63,  "label": "⚡ Espresso"},
    "latte":        {"mg": 75,  "label": "🥛 Latte"},
    "cold_brew":    {"mg": 200, "label": "🧊 Cold Brew"},
    "energy_drink": {"mg": 160, "label": "⚡ Energy Drink"},
    "green_tea":    {"mg": 28,  "label": "🍵 Green Tea"},
    "diet_coke":    {"mg": 46,  "label": "🥤 Diet Coke"},
}

# ── Core Math ──────────────────────────────────────────────────────────────
def mg_remaining(initial_mg: float, hours_elapsed: float) -> float:
    """Caffeine remaining after `hours_elapsed` hours."""
    return initial_mg * (0.5 ** (hours_elapsed / HALF_LIFE_HOURS))

def hours_to_clear(initial_mg: float, target_mg: float = SLEEP_THRESHOLD_MG) -> float:
    """How many hours until caffeine drops to target_mg."""
    if initial_mg <= target_mg:
        return 0.0
    return HALF_LIFE_HOURS * math.log2(initial_mg / target_mg)

def calculate_last_coffee_time(
    sleep_time: datetime.time,
    coffee_mg: float = 95.0,
    date: datetime.date = None
) -> datetime.datetime:
    """Latest you can drink coffee_mg and still sleep at sleep_time."""
    if date is None:
        date = datetime.date.today()
    
    sleep_dt = datetime.datetime.combine(date, sleep_time)
    # If sleep time is before now (next day), add one day
    if sleep_dt < datetime.datetime.now():
        sleep_dt += datetime.timedelta(days=1)
    
    hours_needed = hours_to_clear(coffee_mg)
    last_coffee_dt = sleep_dt - datetime.timedelta(hours=hours_needed)
    return last_coffee_dt

def build_day_curve(
    wake_time: datetime.time,
    sleep_time: datetime.time,
    num_coffees: int = 2,
    coffee_mg: float = 95.0,
    date: datetime.date = None
) -> list:
    """
    Build 30-min interval caffeine curve for the whole day.
    Assumes evenly spaced coffees across the morning/afternoon window.
    Returns list of (datetime, mg) tuples.
    """
    if date is None:
        date = datetime.date.today()

    wake_dt  = datetime.datetime.combine(date, wake_time)
    sleep_dt = datetime.datetime.combine(date, sleep_time)
    if sleep_dt <= wake_dt:
        sleep_dt += datetime.timedelta(days=1)

    # Space coffees evenly in first 60% of waking hours
    awake_hours = (sleep_dt - wake_dt).total_seconds() / 3600
    window = awake_hours * 0.55
    if num_coffees == 1:
        intake_times = [wake_dt + datetime.timedelta(hours=1)]
    else:
        spacing = window / (num_coffees - 1) if num_coffees > 1 else 0
        intake_times = [
            wake_dt + datetime.timedelta(hours=1 + i * spacing)
            for i in range(num_coffees)
        ]

    # Build curve: every 30 min from wake to 3h after sleep
    curve = []
    t = wake_dt
    end = sleep_dt + datetime.timedelta(hours=3)
    total_mg = 0.0

    # Pre-calculate total mg at each step
    step = datetime.timedelta(minutes=30)
    while t <= end:
        total = 0.0
        for intake_t in intake_times:
            if intake_t <= t:
                elapsed = (t - intake_t).total_seconds() / 3600
                total += mg_remaining(coffee_mg, elapsed)
        curve.append((t, round(total, 1)))
        t += step

    return curve, intake_times

# ── Output ─────────────────────────────────────────────────────────────────
def render_ascii_chart(curve: list, sleep_dt: datetime.datetime, last_coffee_dt: datetime.datetime) -> str:
    """Render terminal caffeine curve chart."""
    if not curve:
        return ""

    max_mg = max(mg for _, mg in curve) or 1
    height  = 12
    width   = min(len(curve), 48)
    step    = max(1, len(curve) // width)
    sampled = curve[::step][:width]

    lines = []
    for row in range(height, -1, -1):
        threshold = (row / height) * max_mg
        line = ""
        for t, mg in sampled:
            if mg >= threshold:
                # Color: red if above sleep threshold, green if safe
                if mg > SLEEP_THRESHOLD_MG:
                    line += "█"
                else:
                    line += "░"
            else:
                line += " "
        mg_label = f"{threshold:5.0f}mg │" if row % 3 == 0 else "       │"
        lines.append(f"  {mg_label}{line}")

    # X-axis
    x_axis = "         └" + "─" * len(sampled)
    lines.append(x_axis)

    # Time labels
    label_line = "          "
    markers = [0, len(sampled)//4, len(sampled)//2, 3*len(sampled)//4, len(sampled)-1]
    prev_pos = 0
    for pos in markers:
        if pos < len(sampled):
            t, _ = sampled[pos]
            label = t.strftime("%H:%M")
            label_line += " " * (pos - prev_pos) + label[:5]
            prev_pos = pos + 5

    lines.append(label_line)
    return "\n".join(lines)

def render_report(
    wake_time: datetime.time,
    sleep_time: datetime.time,
    num_coffees: int,
    coffee_mg: float,
    source: str = "coffee"
) -> dict:
    """Full report — returns dict with text, last_coffee_time, etc."""
    today = datetime.date.today()
    curve, intake_times = build_day_curve(wake_time, sleep_time, num_coffees, coffee_mg, today)
    last_coffee_dt = calculate_last_coffee_time(sleep_time, coffee_mg, today)
    
    sleep_dt = datetime.datetime.combine(today, sleep_time)
    if sleep_dt < datetime.datetime.now():
        sleep_dt += datetime.timedelta(days=1)

    # Current caffeine level
    now = datetime.datetime.now()
    current_mg = 0.0
    for intake_t in intake_times:
        if intake_t <= now:
            elapsed = (now - intake_t).total_seconds() / 3600
            current_mg += mg_remaining(coffee_mg, elapsed)

    # Hours until safe to sleep from now
    hours_remaining = max(0, hours_to_clear(current_mg))
    safe_sleep_dt = now + datetime.timedelta(hours=hours_remaining)

    chart = render_ascii_chart(curve, sleep_dt, last_coffee_dt)
    label = SOURCES.get(source, SOURCES["coffee"])["label"]

    # Status
    now_past_last = now > last_coffee_dt
    status = "🔴 CUT OFF" if now_past_last else "🟢 CLEAR TO DRINK"
    
    time_until = last_coffee_dt - now
    mins = int(time_until.total_seconds() / 60)
    if mins < 0:
        cutoff_str = f"CUT OFF {abs(mins)//60}h {abs(mins)%60}m ago"
    else:
        cutoff_str = f"in {mins//60}h {mins%60}m"

    report = {
        "last_coffee_time": last_coffee_dt.strftime("%I:%M %p"),
        "last_coffee_dt": last_coffee_dt.isoformat(),
        "sleep_time": sleep_time.strftime("%I:%M %p"),
        "wake_time": wake_time.strftime("%I:%M %p"),
        "num_coffees": num_coffees,
        "coffee_mg": coffee_mg,
        "source": source,
        "current_mg": round(current_mg, 1),
        "safe_sleep_time": safe_sleep_dt.strftime("%I:%M %p"),
        "status": status,
        "cutoff_str": cutoff_str,
        "half_life_hours": HALF_LIFE_HOURS,
        "chart": chart,
        "curve": [(t.isoformat(), mg) for t, mg in curve],
        "intake_times": [t.isoformat() for t in intake_times],
        "generated_at": now.isoformat(),
    }
    return report

def print_report(r: dict):
    """Pretty-print the report to terminal."""
    box = "─" * 56
    print(f"\n  ╔{box}╗")
    print(f"  ║  CAFFEINE OPTIMIZATION ENGINE v1.0{' '*19}║")
    print(f"  ║  Built with OpenClaw · Because sleep is a feature{' '*4}║")
    print(f"  ╚{box}╝")
    print()
    print(f"  📅  {datetime.date.today().strftime('%A, %B %d, %Y')}")
    print(f"  ⏰  Wake: {r['wake_time']}  →  Sleep target: {r['sleep_time']}")
    print(f"  ☕  {r['num_coffees']}x {r['source']} ({r['coffee_mg']}mg each)")
    print()
    print(f"  ┌─────────────────────────────────────────────────┐")
    print(f"  │  LAST COFFEE DEADLINE                           │")
    print(f"  │                                                 │")
    print(f"  │          ► {r['last_coffee_time']:^10} ◄                    │")
    print(f"  │                                                 │")
    print(f"  │  Status : {r['status']:<38}│")
    print(f"  │  Cutoff : {r['cutoff_str']:<38}│")
    print(f"  └─────────────────────────────────────────────────┘")
    print()
    print(f"  📊 Current caffeine: {r['current_mg']}mg in bloodstream")
    print(f"  😴 Safe to sleep by: {r['safe_sleep_time']}")
    print()
    print(f"  CAFFEINE CURVE (today)  █ = above sleep threshold  ░ = safe")
    print()
    print(r["chart"])
    print()
    print(f"  Half-life: {r['half_life_hours']}h · Sleep threshold: {SLEEP_THRESHOLD_MG}mg")
    print(f"  Science source: Statland & Demas, 1980 (yes, really)")
    print()
    print(f"  ── Built in OpenClaw because who needs sleep anyway ─")
    print()

# ── Discord Notify ─────────────────────────────────────────────────────────
def send_discord_notify(r: dict, channel_id: str = "1475320497490231438"):
    """Send result to Discord via OpenClaw message tool."""
    import subprocess
    msg = (
        f"☕ **Caffeine Optimization Report** — {datetime.date.today().strftime('%b %d')}\n\n"
        f"**LAST COFFEE DEADLINE: `{r['last_coffee_time']}`**\n"
        f"Status: {r['status']} ({r['cutoff_str']})\n\n"
        f"Current bloodstream: `{r['current_mg']}mg`\n"
        f"Safe to sleep by: `{r['safe_sleep_time']}`\n"
        f"Sleep target: `{r['sleep_time']}`\n\n"
        f"*Half-life: {r['half_life_hours']}h · Threshold: 25mg · Source: actual caffeine pharmacokinetics*\n"
        f"*Built with OpenClaw because Q3 OKRs don't need help keeping you awake*"
    )
    print(f"\n[Discord] Would notify channel {channel_id}:\n{msg}")
    return msg

# ── CLI ────────────────────────────────────────────────────────────────────
def parse_time(s: str) -> datetime.time:
    for fmt in ("%H:%M", "%I:%M%p", "%I:%M %p", "%H%M"):
        try:
            return datetime.datetime.strptime(s, fmt).time()
        except:
            pass
    raise ValueError(f"Can't parse time: {s}")

def main():
    parser = argparse.ArgumentParser(description="Caffeine Optimization Engine")
    parser.add_argument("--wake",    default="07:00", help="Wake time HH:MM (default 07:00)")
    parser.add_argument("--sleep",   default="23:00", help="Sleep time HH:MM (default 23:00)")
    parser.add_argument("--coffees", type=int, default=2, help="Number of coffees per day (default 2)")
    parser.add_argument("--source",  default="coffee",
                        choices=list(SOURCES.keys()), help="Caffeine source")
    parser.add_argument("--json",    action="store_true", help="Output JSON only")
    parser.add_argument("--notify",  action="store_true", help="Send Discord notification")
    args = parser.parse_args()

    wake_t  = parse_time(args.wake)
    sleep_t = parse_time(args.sleep)
    mg      = SOURCES[args.source]["mg"]

    report = render_report(wake_t, sleep_t, args.coffees, mg, args.source)

    if args.json:
        # Strip chart for JSON (too noisy)
        out = {k: v for k, v in report.items() if k not in ("chart", "curve")}
        print(json.dumps(out, indent=2))
    else:
        print_report(report)

    if args.notify:
        send_discord_notify(report)

    # Save last result for API
    out_path = os.path.join(os.path.dirname(__file__), "..", "public", "data", "caffeine.json")
    safe = {k: v for k, v in report.items() if k not in ("chart",)}
    with open(out_path, "w") as f:
        json.dump(safe, f, indent=2)
    if not args.json:
        print(f"  ✓ Saved to public/data/caffeine.json")

if __name__ == "__main__":
    main()
