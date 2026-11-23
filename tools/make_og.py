"""Draws public/og.png, the picture shown when the site's link is shared (1200 x 630).

    python -I tools/make_og.py      (needs Pillow)
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
W, H, S = 1200, 630, 4          # drawn at 4x, then scaled down for smooth edges
TOP, BOTTOM = (255, 176, 0), (232, 84, 0)


def font(size: int, bold: bool = True) -> ImageFont.ImageFont:
    names = ("segoeuib.ttf", "arialbd.ttf", "DejaVuSans-Bold.ttf") if bold else ("segoeui.ttf", "arial.ttf", "DejaVuSans.ttf")
    for name in names:
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default(size)


def main() -> None:
    img = Image.new("RGB", (W * S, H * S), (16, 16, 16))
    d = ImageDraw.Draw(img)

    # The logo: an amber-to-saffron disc with a white play triangle.
    r = 150 * S
    cx, cy = 230 * S, H * S // 2
    disc = Image.new("RGB", (2 * r, 2 * r))
    px = disc.load()
    for y in range(0, 2 * r, S):
        for x in range(0, 2 * r, S):
            t = (x + y) / (4 * r)
            c = tuple(round(a + (b - a) * t) for a, b in zip(TOP, BOTTOM))
            for dy in range(S):
                for dx in range(S):
                    px[x + dx, y + dy] = c
    mask = Image.new("L", (2 * r, 2 * r), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, 2 * r, 2 * r), fill=255)
    img.paste(disc, (cx - r, cy - r), mask)
    hh, length = 0.34 * r, 0.58 * r
    left = cx - length / 3
    tri = [(left, cy - hh), (left, cy + hh), (left + length, cy)]
    d.polygon(tri, fill="white")
    rad = 0.045 * r
    d.line(tri + [tri[0]], fill="white", width=round(2 * rad), joint="curve")
    for x0, y0 in tri:   # round each corner, as tools/icon/make_icons.py does in MorphPlayerTV
        d.ellipse((x0 - rad, y0 - rad, x0 + rad, y0 + rad), fill="white")

    x = 440 * S
    d.text((x, 200 * S), "MorphPlayer", font=font(92 * S), fill=(240, 240, 240), anchor="ls")
    d.text((x, 280 * S), "Plays almost anything.", font=font(44 * S, bold=False), fill=(255, 136, 0), anchor="ls")
    for i, line in enumerate(("Windows  ·  Android TV  ·  Android", "Built on LibVLC. Free and open source.")):
        d.text((x, (370 + i * 56) * S), line, font=font(34 * S, bold=False), fill=(154, 154, 154), anchor="ls")

    img.resize((W, H), Image.LANCZOS).save(ROOT / "public" / "og.png", optimize=True)
    print("Wrote public/og.png")


if __name__ == "__main__":
    main()
