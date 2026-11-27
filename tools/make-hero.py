# Renders the hero loop (one floor cycle, ~9 s, hard cuts) from the licensed stock originals.
# Usage: python tools/make-intro.py   (from the project root; needs ffmpeg on PATH)
import subprocess, sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "stock-originals"
OUT = ROOT / "site-v2" / "media"
OUT.mkdir(exist_ok=True)
FPS = 30
# (file id, focus x, focus y, seconds) in construction order; the last shot is the site's hero photo
SHOTS = [("478682195", .5, .55, 1.5), ("262420172", .55, .5, 1.5), ("205249812", .55, .45, 1.5),
         ("98468052", .45, .45, 1.5), ("187011394", .45, .45, 1.5), ("495705639", .4, .6, 1.5)]

def frames(w, h):
    for fid, fx, fy, sec in SHOTS:
        im = Image.open(SRC / f"AdobeStock_{fid}.jpeg").convert("RGB")
        im.draft("RGB", (w * 2, h * 2))
        s = max(w * 1.25 / im.width, h * 1.25 / im.height)
        im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
        n = round(sec * FPS)
        for i in range(n):
            z = 1.02 + 0.07 * i / max(1, n - 1)              # a slow, even push on every shot
            cw, ch = w * 1.25 / z, h * 1.25 / z               # image covers 1.25x the frame; crop shrinks as z grows
            x = min(max(fx * im.width - cw / 2, 0), im.width - cw)
            y = min(max(fy * im.height - ch / 2, 0), im.height - ch)
            yield im.resize((w, h), Image.BILINEAR, box=(x, y, x + cw, y + ch)).tobytes()

def render(name, w, h, crf):
    raw = ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{w}x{h}", "-r", str(FPS), "-i", "-"]
    mp4 = raw + ["-c:v", "libx264", "-preset", "slow", "-crf", str(crf), "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", str(OUT / f"{name}.mp4")]
    p = subprocess.Popen(mp4, stdin=subprocess.PIPE)
    for f in frames(w, h): p.stdin.write(f)
    p.stdin.close(); p.wait()

if __name__ == "__main__":
    render("hero-wide", 1280, 720, 30)
    render("hero-tall", 720, 1280, 30)
    for f in sorted(OUT.glob("hero-*")): print(f.name, f.stat().st_size // 1024, "KB")
