# ravibuildcon.com · V2 "Struck"

A new site, built from scratch. Concept and reasoning: `V2-PLAN.md`. On a site, concrete is cast in orange formwork, then the formwork is **struck**. Every reveal here is a strike: the hero is a wall of orange formwork panels (with the RAVI mark pressed through them) that unbolt and fall away onto a film of a floor going up. Headings and photos sit behind smaller shutters that strike as they come into view.

Static, no build step, no framework, no JS libraries.

## Run
```
python -m http.server 8794 --directory site-v2
```
Or use the "site-v2" launch config. Open http://localhost:8794.

## Files
- `index.html`: all copy, with the inline SVG logo as a `<symbol>`
- `css/style.css`: tokens at the top. Archivo (variable width + weight) and Anek Gujarati.
- `js/data.js`: the 49 projects (from the brochure). Edit projects here only.
- `js/main.js`: wall strike, shutters, the built-to-scale wall, project sheet, localities, WhatsApp form
- `media/hero-{wide,tall}.mp4` + `.webp` posters: the hero loop, 9 s, no audio
- `img/og.jpg`: Open Graph image, designed in Canva (https://www.canva.com/d/F9eKYZHU5n_cRWN)
- `img/logo.svg`: the logo, traced from the PNG masks (`tools/trace-logo.py`)
- `img/projects/`: brochure photo per project. `img/photo/`: Ravi's site photos plus one licensed stock crew photo.
- `tools/make-hero.py`: re-cuts the hero loop from `stock-originals/` (needs ffmpeg)
- `media/strike-{wide,tall}.webm` + `.webp` (frame 0): the hero formwork strike, **made in Cavalry** (`tools/cavalry-wall.js`). 15 ply panels with tie holes and the RAVI mark pressed in; centre-out unbolt, shake, gravity fall, 3D-ish lift shadow, real motion blur. 1.8 s, transparent VP9.
- `media/boards-{wide,tall}.webm` + `.webp`: the Built-to-scale reveal, **made in Cavalry** (`tools/cavalry-boards.js`). Horizontal shutter boards on two steel walers; walers unbolt first, then boards strike top to bottom. 2 s, transparent VP9.
- Cavalry renders: run the tools script through the Cavalry MCP `execute_script` (wide and tall params at the top), `api.renderPNGFrame` per frame, then `ffmpeg -framerate 30 -i f%03d.png -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 36 -row-mt 1 -auto-alt-ref 0 out.webm` (boards use crf 28).

## Sizes
- hero-wide.mp4 1.4 MB and hero-tall.mp4 1.3 MB; only one loads, picked by aspect ratio
- posters 170 KB (wide) and 233 KB (tall), preloaded
- Cavalry strikes: strike 188/146 KB, boards 166/164 KB (wide/tall), only one of each loads
- og.jpg 66 KB; logo.svg 8 KB

## Motion and access
- Cavalry strikes play only with motion allowed and where VP9 alpha renders (Chromium, Firefox). Safari and every iOS browser keep the CSS wall and no board overlay. Each overlay removes itself on `ended`/`error`, and after 4 s regardless.
- Reduced motion: no wall, no shutters, no Cavalry overlays, the film stays on its poster and the hero copy is shown straight away.
- The film has a Pause button (WCAG 2.2.2) and pauses when scrolled out of view.
- If JS fails, nothing is hidden: the wall and the shutters are only created by JS, and the hero copy un-hides after 4 s regardless.
- The project wall is made of real buttons. Each opens a native `<dialog>` with its photo, locality, type and area; Esc or the backdrop closes it.

## Verified (in-app browser)
- 1280×800 and 375×812: the wall strike, hero, sentence, project wall, hire rows, 500, localities and contact.
- No console errors. At 375 px, scrollWidth equals viewport width (no horizontal overflow).
- The sheet opens with the right facts; the type filter dims 41 of 49 for "Institutional"; the form flags missing fields and focuses the first one.

## Left to do
- **Safari/iOS** get the CSS strike, not the Cavalry render: HEVC-with-alpha needs Apple's encoder. Encode one on a Mac to give WebKit the same film.
- Reduced motion was checked by reading the code paths, not by OS emulation.
- Lighthouse/LCP not measured. The likely LCP is the hero poster (preloaded) or the h1.
- Self-host and subset the fonts. Get the true vector logo from the CorelDRAW file. Use real footage from one of Ravi's sites instead of stock for the hero film.
- The OG image came out of Canva at 1122×630 (not 1200×630). Fine for WhatsApp and LinkedIn; resize it in Canva if a 1.91:1 crop matters.
