#!/usr/bin/env python3
"""
PA Carousel Slide Renderer
Uses Playwright to render each slide at exact 1080x1080px — no black bars, social-ready.

Usage:
  python3 render-slides.py --date 2026-03-10
  python3 render-slides.py --html pa-signals-2026-03-10-v3.html --out exports/2026-03-10
"""

import asyncio
import argparse
import re
from pathlib import Path
from datetime import datetime

async def render(html_path: Path, out_dir: Path, total_slides: int, size: int = 1080):
    from playwright.async_api import async_playwright

    out_dir.mkdir(parents=True, exist_ok=True)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # device_scale_factor=2 renders at 2x CSS pixels = 1080px actual output
        # (540 CSS px × 2 = 1080 actual px per side — Instagram/TikTok quality)
        context = await browser.new_context(
            viewport={"width": size // 2, "height": size // 2},
            device_scale_factor=2,
        )
        page = await context.new_page()

        url = html_path.resolve().as_uri()
        await page.goto(url, wait_until="networkidle")

        # Let fonts/logos load
        await page.wait_for_timeout(2000)

        slide_names = [
            "slide-1-cover",
            "slide-2-signal-1",
            "slide-3-signal-2",
            "slide-4-signal-3",
            "slide-5-cta",
        ]

        for i in range(total_slides):
            # Navigate to this slide via JS
            await page.evaluate(f"goTo({i})")
            await page.wait_for_timeout(500)  # wait for transition

            # Screenshot just the viewport div (the slide container)
            elem = page.locator("#vp")
            out_path = out_dir / f"{slide_names[i] if i < len(slide_names) else f'slide-{i+1}'}.png"
            await elem.screenshot(path=str(out_path))
            print(f"✓ {out_path.name} ({size}x{size})")

        await browser.close()

    print(f"\n✅ {total_slides} slides saved to {out_dir}/")
    print(f"   Format: {size}×{size}px — ready for Instagram + TikTok")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--date", default=datetime.now().strftime("%Y-%m-%d"))
    parser.add_argument("--html", default=None)
    parser.add_argument("--out", default=None)
    parser.add_argument("--slides", type=int, default=5)
    parser.add_argument("--size", type=int, default=1080,
                        help="Output size in px (1080 = Instagram/TikTok quality)")
    args = parser.parse_args()

    base = Path(__file__).parent
    html_path = Path(args.html) if args.html else base / f"pa-signals-{args.date}-v3.html"
    out_dir = Path(args.out) if args.out else base / "exports" / args.date

    if not html_path.exists():
        # Try v2
        html_path = base / f"pa-signals-{args.date}-v2.html"
    if not html_path.exists():
        print(f"❌ HTML not found: {html_path}")
        exit(1)

    print(f"🎨 Rendering {args.slides} slides from {html_path.name}")
    print(f"   Output: {out_dir}/ @ {args.size}×{args.size}px\n")

    asyncio.run(render(html_path, out_dir, args.slides, args.size))


if __name__ == "__main__":
    main()
