# Traces the logo PNG masks (white on transparent) into one SVG: RAVI mark over BUILDCON word.
# Usage: python tools/trace-logo.py   (from site-v2/). Ceiling: polygon trace of a 944px raster; replace with the CorelDRAW vector when exported.
import cv2, numpy as np

def paths(png, dx, dy, scale):
    a = cv2.imread(png, cv2.IMREAD_UNCHANGED)[:, :, 3]
    a = cv2.resize(a, None, fx=4, fy=4, interpolation=cv2.INTER_CUBIC)       # trace at 4x for smoother edges
    _, m = cv2.threshold(a, 127, 255, cv2.THRESH_BINARY)
    cs, _ = cv2.findContours(m, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_SIMPLE)
    d = []
    for c in cs:
        c = cv2.approxPolyDP(c, 1.2, True)
        if len(c) < 3: continue
        pts = [f"{dx + x / 4 * scale:.1f} {dy + y / 4 * scale:.1f}" for [[x, y]] in c]
        d.append("M" + "L".join(pts) + "Z")
    return "".join(d)

ravi = paths("tools/src/logo-ravi.png", 0, 0, 1)                 # 944 x 292
word = paths("tools/src/logo-buildcon.png", 3, 292 + 76, 1)       # 938 x 102, 76px gap
W, H = 944, 292 + 76 + 102
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img" aria-label="Ravi Buildcon">'
       f'<path fill="currentColor" fill-rule="evenodd" d="{ravi}"/>'
       f'<path fill="#E67800" fill-rule="evenodd" d="{word}"/></svg>')
open("img/logo.svg", "w").write(svg)
print(len(svg), "bytes")
