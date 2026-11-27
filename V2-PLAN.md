# V2: a new idea, from scratch

The brief: builders and developers in Gujarat, mostly on phones on site. They must decide in under a minute whether Ravi Buildcon can carry their job, then call. Register: heavy, load-bearing, unshowy. Orange is a surface, not an accent. Real photos only.

## Five ideas, critiqued hard

**1. Load Path.** The page is a structural section, read top to bottom: roof, slab, beam, column, footing. Content "carries load" down to the contact form at the footing.
*Against:* a diagram metaphor. It explains structure instead of making you feel weight, and it reads as an engineering explainer, not a contractor with muscle. Hard to make sing on a phone.

**2. The Site Register.** The site as a site-office logbook: pour dates, cube tests, a ledger of 49 jobs.
*Against:* editorial restraint, which is exactly the anti-reference in PRODUCT.md. Inventing pour dates breaks the facts rule. Dead.

**3. Slump.** Type behaves like wet concrete: headlines slump and flow under scroll velocity, then set.
*Against:* a pure effect with no content behind it. Liquid type has been done to death on Awwwards. It reads as "soft", the opposite of load-bearing.

**4. Built to Scale.** All 49 projects set as one wall of names, each name sized by its real built-up area. The Kalol Institute of Technology (6,00,000 sq ft) is enormous; a 6,500 sq ft private residence is a whisper.
*For:* the client's real record becomes the visual. It is unfakeable, it shows range (homes to campuses) in one glance, and it is pure type, so it is fast on any phone.
*Against:* on its own it is one section, not a site.

**5. Struck.** On a site, concrete is cast inside orange shuttering, cured, and then the formwork is **struck**: unbolted and dropped to reveal the finished face. Every reveal on this site is a strike. Orange formwork panels, with plywood seams and tie-rod holes, cover the hero, the headings and the photos. As they enter view they unbolt and fall away under gravity, showing the work behind.
*For:* it makes the brand orange the literal surface (PRINCIPLE 3), it is a physical, heavy motion vocabulary nobody else owns, it is rooted in the craft (striking formwork is the moment a contractor is judged), and it is cheap: CSS transforms only, so it runs at 60 fps on mid phones.
*Against:* repeated too often it becomes a gimmick. Mitigation: three sizes only (hero wall, heading strips, photo shutters), and the timing gets faster as you go down the page, like a crew getting into rhythm.

## The pick: **Struck**, with **Built to Scale** as its centrepiece

Why it could win SOTD:
- **Design (40%):** one material system (concrete grey, formwork orange, ink) and one display family, Archivo, whose width axis lets the type go from tight to heavy. Big scale contrast between moments. Nothing decorative that isn't formwork.
- **Creativity (20%):** a signature interaction drawn from the trade itself, plus a data-driven type wall that is the client's actual portfolio.
- **Usability (30%):** a single-page flow with one CTA (call or WhatsApp) always in reach; reduced motion removes every strike and shows the cast face directly; keyboard-operable project wall; phone first.
- **Content (10%):** every number is from the brochure. No inventions.

## The page

1. **Hero, the wall.** A full-screen wall of orange formwork panels with the RAVI mark pressed into it. On load the ties pop and the panels drop in a staggered cascade, revealing a looping film of one floor going up (rebar crew, deck, cage, pour, pump, frame), cut from licensed stock. "We build trust." sits on the cast face, with the Gujarati motto.
2. **The sentence.** One huge, plain statement: twenty years, 49 buildings, 500 on one site when the deadline says so. Set as a sentence, not stat tiles.
3. **Built to scale.** The 49-name wall. Filter by type and the other names go faint. Hovering a name (desktop) shows its brochure photo at the pointer; tapping (phone) opens a sheet with the photo, locality and area.
4. **Three ways to hire us.** Three rows, each with Ravi's own site photo behind an orange shutter that strikes on entry.
5. **Five hundred.** An orange surface, with "500" set huge and filled with a real photo of a crew on a rebar deck.
6. **Where we've built.** A typographic list of localities with counts (computed from the data), Kalol to Mehsana.
7. **Your site next.** The phone number as the largest link on the page, a short WhatsApp form, the office address.
8. **Footer.** The SVG logo, the address and the GSTIN.

## Canva's part

- **Designed in Canva:** the Open Graph share image (`img/og.jpg`). The licensed crane-at-sunset photo and the real logo were uploaded to Canva and laid out with the brand kit. Design: https://www.canva.com/d/F9eKYZHU5n_cRWN
- **Tried and refused by Canva:** uploading the hero loop MP4. The connector's upload endpoint answered "Unsupported file format MP4", so the film lives only in `media/`.
- **Deliberately not used:** `create-video` and every Canva production guide (they generate AI footage, which is banned), and `generate-image`.
- **Cavalry (installed on this PC):** this session has no computer-use tools, so it cannot click in the Cavalry window. Cavalry also runs a local MCP server (localhost:6768), but it needs the user's token and has to be connected by the user. Until one of those is set up, nothing here is made in Cavalry.
- **Not reachable via the Canva connector:** Cavalry is a desktop app. The connector exposes no Cavalry authoring, and `import-claude-motion-from-url` only accepts Claude Motion URLs. Canva exports animation only as MP4 (no Lottie). So the hero film is cut in code from the licensed originals (`tools/make-hero.py`), and the strike motion is live CSS, which beats any video for crispness and weight.
