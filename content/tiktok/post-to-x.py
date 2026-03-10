#!/usr/bin/env python3
"""
PA TikTok → X Poster
Posts a 5-slide signal carousel to @PrecisionAlgos (or @DronskiErick)

Usage:
  python3 post-to-x.py --date 2026-03-10
  python3 post-to-x.py --slides exports/2026-03-10  (auto-detects folder)

Requires env vars (or .env.x file):
  X_API_KEY
  X_API_SECRET
  X_ACCESS_TOKEN
  X_ACCESS_TOKEN_SECRET
  X_USER_HANDLE   (optional, e.g. @PrecisionAlgos — just for logging)

Twitter allows max 4 images per tweet.
Strategy:
  Tweet 1: cover + signal1 + signal2 + signal3 (4 images)
  Reply 1: CTA slide + reply text
"""

import os
import sys
import argparse
import tweepy
from pathlib import Path
from datetime import datetime

# ── Load creds ──────────────────────────────────────────────────────────────
def load_creds():
    # Try .env.x first (local override)
    env_file = Path(__file__).parent / '.env.x'
    if env_file.exists():
        with open(env_file) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    k, v = line.split('=', 1)
                    os.environ.setdefault(k.strip(), v.strip())

    api_key        = os.environ.get('X_API_KEY')
    api_secret     = os.environ.get('X_API_SECRET')
    access_token   = os.environ.get('X_ACCESS_TOKEN')
    access_secret  = os.environ.get('X_ACCESS_TOKEN_SECRET')

    if not all([api_key, api_secret, access_token, access_secret]):
        print("❌ Missing X API credentials.")
        print("   Set these env vars or create content/tiktok/.env.x:")
        print("   X_API_KEY=...")
        print("   X_API_SECRET=...")
        print("   X_ACCESS_TOKEN=...")
        print("   X_ACCESS_TOKEN_SECRET=...")
        sys.exit(1)

    return api_key, api_secret, access_token, access_secret

# ── Upload media ─────────────────────────────────────────────────────────────
def upload_image(api_v1, path: str) -> str:
    """Upload image via v1.1, return media_id string."""
    print(f"   ↑ uploading {Path(path).name}...")
    media = api_v1.media_upload(path)
    print(f"   ✓ media_id={media.media_id_string}")
    return media.media_id_string

# ── Post tweet ───────────────────────────────────────────────────────────────
def post_tweet(client_v2, text: str, media_ids: list, reply_to: str = None) -> str:
    """Post a tweet with up to 4 images. Returns tweet id."""
    kwargs = dict(text=text, media_ids=media_ids)
    if reply_to:
        kwargs['in_reply_to_tweet_id'] = reply_to
    resp = client_v2.create_tweet(**kwargs)
    tweet_id = resp.data['id']
    print(f"   ✓ tweeted: https://x.com/i/web/status/{tweet_id}")
    return tweet_id

# ── Main ─────────────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description='Post PA signals carousel to X')
    parser.add_argument('--date', default=datetime.now().strftime('%Y-%m-%d'),
                        help='Date folder (YYYY-MM-DD)')
    parser.add_argument('--slides', default=None,
                        help='Override slides directory path')
    parser.add_argument('--dry-run', action='store_true',
                        help='Print what would be posted without posting')
    args = parser.parse_args()

    # Resolve slides folder
    base = Path(__file__).parent
    slides_dir = Path(args.slides) if args.slides else base / 'exports' / args.date
    if not slides_dir.exists():
        print(f"❌ Slides folder not found: {slides_dir}")
        sys.exit(1)

    # Expected file names (in order)
    slide_files = [
        slides_dir / 'slide-1-cover.png',
        slides_dir / 'slide-2-hawks-100.png',
        slides_dir / 'slide-3-suns-99.png',
        slides_dir / 'slide-4-kings-95.png',
        slides_dir / 'slide-5-cta.png',
    ]

    # Auto-discover if expected names not found
    if not all(f.exists() for f in slide_files):
        found = sorted(slides_dir.glob('*.png'))
        if len(found) < 5:
            print(f"❌ Need 5 PNG slides in {slides_dir}, found {len(found)}")
            sys.exit(1)
        slide_files = found[:5]
        print(f"ℹ️  Auto-detected slides: {[f.name for f in slide_files]}")

    date_str = args.date
    handle = os.environ.get('X_USER_HANDLE', '@PrecisionAlgos')

    # Tweet copy
    main_text = (
        f"📊 Today's Top 3 Free Signals — {date_str}\n\n"
        f"🏀 Hawks -370 (100% confidence) #1 LOCK\n"
        f"🏀 Suns -116 (99% confidence)\n"
        f"🏀 Kings -154 (95% confidence)\n\n"
        f"Free picks daily 👇\n"
        f"precisionalgorithms.com\n\n"
        f"#SportsBetting #FreePicks #NBA #AIpicks"
    )

    cta_text = (
        f"🎯 Get the full edge — more signals, deeper analysis.\n"
        f"Free tier available → precisionalgorithms.com\n\n"
        f"Follow {handle} for daily free picks 🔔"
    )

    if args.dry_run:
        print("─── DRY RUN ──────────────────────────────────────")
        print(f"TWEET 1 (4 images):\n{main_text}\n")
        print(f"Slides: {[f.name for f in slide_files[:4]]}\n")
        print(f"REPLY (1 image):\n{cta_text}\n")
        print(f"Slide: {slide_files[4].name}")
        return

    # Load credentials
    api_key, api_secret, access_token, access_secret = load_creds()

    # Authenticate
    print("🔑 Authenticating with X API...")
    auth = tweepy.OAuth1UserHandler(api_key, api_secret, access_token, access_secret)
    api_v1 = tweepy.API(auth)
    client_v2 = tweepy.Client(
        consumer_key=api_key,
        consumer_secret=api_secret,
        access_token=access_token,
        access_token_secret=access_secret
    )

    # Verify
    me = api_v1.verify_credentials()
    print(f"✓ Authenticated as @{me.screen_name}")

    # Upload main 4 images (cover + 3 signals)
    print("\n📤 Uploading main tweet images (4)...")
    main_media_ids = [upload_image(api_v1, str(f)) for f in slide_files[:4]]

    # Post main tweet
    print(f"\n🐦 Posting main tweet...")
    tweet_id = post_tweet(client_v2, main_text, main_media_ids)

    # Upload CTA slide
    print(f"\n📤 Uploading CTA slide...")
    cta_media_id = upload_image(api_v1, str(slide_files[4]))

    # Post reply with CTA
    print(f"\n💬 Replying with CTA...")
    post_tweet(client_v2, cta_text, [cta_media_id], reply_to=tweet_id)

    print(f"\n✅ Done! Carousel posted to X.")
    print(f"   https://x.com/i/web/status/{tweet_id}")


if __name__ == '__main__':
    main()
