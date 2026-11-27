import { PROJECTS, CONTACT } from "./data.js";

const $ = s => document.querySelector(s);
const root = document.documentElement;
const motion = root.classList.contains("motion");
const fmt = n => n.toLocaleString("en-IN");
const rnd = (a, b) => a + Math.random() * (b - a);
$("#yr").textContent = new Date().getFullYear();

/* ───────── the strike: unbolt, a small shake, then gravity ───────── */
function strike(el, { delay = 0, fall = "140%", spin = 10, dur = 760 } = {}) {
  const dx = rnd(-30, 30), r = rnd(-spin, spin);
  return el.animate([
    { transform: "none" },
    { transform: `translate(${rnd(-2, 2)}px,-3px) rotate(${r * 0.06}deg)`, offset: 0.14 },
    { transform: `translate(${rnd(-1, 1)}px,1px) rotate(${-r * 0.03}deg)`, offset: 0.24, easing: "cubic-bezier(.55,0,1,.45)" },
    { transform: `translate(${dx}px,${fall}) rotate(${r}deg)`, opacity: 1, offset: 0.92 },
    { transform: `translate(${dx}px,${fall}) rotate(${r}deg)`, opacity: 0 },
  ], { duration: dur + 220, delay, fill: "forwards" }).finished;
}

/* ───────── Cavalry-rendered strikes (tools/cavalry-*.js): transparent VP9 over the live page ─────────
   WebKit can't draw VP9 alpha, so Safari and every iOS browser keep the CSS strike instead. */
const UA = navigator.userAgent;
const ALPHA = motion && !/iP(hone|ad|od)/.test(UA) && !(/Safari/.test(UA) && !/Chrome|Chromium|Android/.test(UA))
  && document.createElement("video").canPlayType('video/webm; codecs="vp9"') !== "";
function cavFilm(name, tall, host) {
  const v = document.createElement("video");
  v.className = "cav"; v.muted = true; v.playsInline = true; v.preload = "auto";
  v.setAttribute("aria-hidden", "true");
  v.poster = `media/${name}-${tall ? "tall" : "wide"}.webp`;      // frame 0: the shuttering still closed
  v.src = `media/${name}-${tall ? "tall" : "wide"}.webm`;
  host.appendChild(v);
  const gone = () => v.remove();
  v.addEventListener("ended", gone); v.addEventListener("error", gone);
  v.strike = () => { setTimeout(gone, 4000); return v.play().catch(e => { gone(); throw e; }); };   // never leave shuttering standing
  return v;
}
function cavWall() {
  const v = cavFilm("strike", matchMedia("(max-aspect-ratio: 1/1)").matches, wall);
  v.addEventListener("error", revealHero, { once: true });
  Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1200))]).then(() => setTimeout(() =>
    v.strike().then(() => setTimeout(revealHero, 650), revealHero), 250));
}

/* ───────── 1 · the wall ───────── */
const film = $("#film"), toggle = $("#filmToggle"), wall = $("#wall");
let userPaused = false;
function playFilm() { if (!userPaused) film.play().then(() => { toggle.hidden = false; }).catch(() => {}); }
toggle.addEventListener("click", () => {
  userPaused = !film.paused;
  userPaused ? film.pause() : film.play();
  toggle.setAttribute("aria-pressed", String(userPaused));
  toggle.textContent = userPaused ? "Play film" : "Pause film";
});
if (motion) {
  new IntersectionObserver(([e]) => { e.isIntersecting ? playFilm() : film.pause(); }).observe(film);
  ALPHA ? cavWall() : buildWall();
} else {
  toggle.hidden = true;                                   // reduced motion: the poster stands still, no strike
}

function buildWall() {
  const W = innerWidth, H = wall.clientHeight || innerHeight, portrait = W < H;
  const cols = portrait ? 3 : 5, rows = portrait ? 5 : 3;
  const lw = Math.min(W * (portrait ? 0.82 : 0.62), 1100), lh = lw * 470 / 944;
  const lx = (W - lw) / 2, ly = (H - lh) / 2 - H * 0.04;
  wall.style.setProperty("--cols", cols); wall.style.setProperty("--rows", rows);
  const pw = W / cols, ph = H / rows, panels = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const p = document.createElement("i"); p.className = "panel";
    p.style.cssText = `--lw:${lw}px;--mx:${lx - c * pw}px;--my:${ly - r * ph}px`;
    p.d = Math.hypot((c + .5) * pw - W / 2, (r + .5) * ph - H * .46) / Math.hypot(W, H);   // centre-out
    wall.appendChild(p); panels.push(p);
  }
  const go = () => {
    const done = panels.map(p => strike(p, { delay: 120 + p.d * 1500 + rnd(0, 120), fall: `${H * 1.1}px`, spin: 16, dur: 820 }));
    setTimeout(revealHero, 650);
    Promise.all(done).then(() => wall.remove());
  };
  // let the fonts and poster land first, but never hold the wall longer than 1.2 s
  Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1200))]).then(() => setTimeout(go, 350));
}
function revealHero() {
  root.classList.remove("pre");
  const parts = [...document.querySelectorAll(".hero h1 .ln"), ...document.querySelectorAll(".hero .guj, .hero .lede, .hero .actions")];
  parts.forEach((el, i) => el.animate(
    [{ clipPath: "inset(0 0 100% 0)", transform: "translateY(.35em)", opacity: 1 }, { clipPath: "inset(0 0 -10% 0)", transform: "none", opacity: 1 }],
    { duration: 900, delay: i * 110, easing: "cubic-bezier(.16,1,.3,1)", fill: "backwards" }));
}
if (!motion) root.classList.remove("pre");

/* ───────── shutters on headings and photos, struck as they come into view ───────── */
if (motion && "IntersectionObserver" in window) {
  let n = 0;
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    const quick = Math.max(0.72, 1 - n++ * 0.05);            // the crew gets into rhythm: later strikes run faster
    e.target.querySelectorAll(":scope > .shutter").forEach((s, i) =>
      strike(s, { delay: i * 90, fall: "160%", spin: 7, dur: 700 * quick }).then(() => s.remove()));
  }), { threshold: 0.45, rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll("h2.strike, .cast").forEach(el => {
    const halves = el.classList.contains("cast") ? 2 : 1;
    for (let i = 0; i < halves; i++) { const s = document.createElement("span"); s.className = "shutter"; s.setAttribute("aria-hidden", "true"); el.appendChild(s); }
    io.observe(el);
  });
}

/* ───────── 3 · built to scale ───────── */
const names = $("#names"), peek = $("#peek"), peekImg = peek.querySelector("img"), peekCap = peek.querySelector("figcaption");
const sheet = $("#sheet"), MAXA = Math.max(...PROJECTS.map(p => p.area));
const rows = PROJECTS.slice().sort((a, b) => b.area - a.area || a.name.localeCompare(b.name));
const meta = p => `${p.place} · ${p.type} · ${fmt(p.area)} sq ft${p.note ? " · " + p.note : ""}`;
rows.forEach(p => {
  const li = document.createElement("li"), b = document.createElement("button"), a = document.createElement("span");
  li.dataset.type = p.type;
  b.type = "button"; b.style.setProperty("--k", (p.area / MAXA).toFixed(3));
  const words = p.name.split(" "), last = document.createElement("span");   // the area figure never wraps away from the name
  b.textContent = words.slice(0, -1).join(" ") + (words.length > 1 ? " " : "");
  last.className = "nw"; last.textContent = words.at(-1);
  b.setAttribute("aria-label", `${p.name}, ${meta(p)}`);
  a.className = "a"; a.setAttribute("aria-hidden", "true"); a.textContent = fmt(p.area);
  last.appendChild(a); b.appendChild(last); li.appendChild(b); names.appendChild(li);
  b.addEventListener("click", () => {
    const img = $("#sheetImg");
    img.hidden = !p.photo; if (p.photo) { img.src = p.photo; img.alt = `${p.name}, ${p.place}`; }
    $("#sheetName").textContent = p.name; $("#sheetMeta").textContent = meta(p);
    sheet.showModal();
  });
  if (p.photo) {
    b.addEventListener("pointerenter", () => { peekImg.src = p.photo; peekCap.textContent = `${p.place} · ${fmt(p.area)} sq ft`; peek.classList.add("on"); });
    b.addEventListener("pointerleave", () => peek.classList.remove("on"));
  }
});
sheet.addEventListener("click", e => { if (e.target === sheet) sheet.close(); });   // tap the backdrop to close
if (ALPHA) {                                            // the wall of names is cast behind shutter boards, struck as it scrolls in
  const host = names.parentElement, v = cavFilm("boards", host.clientWidth < Math.min(host.clientHeight, innerHeight), host);
  const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); v.strike().catch(() => {}); } }, { rootMargin: "0px 0px -30% 0px" });
  io.observe(host);
}
names.addEventListener("pointermove", e => {
  const w = peek.offsetWidth, h = peek.offsetHeight || w;
  const x = e.clientX + 28 + w > innerWidth - 16 ? e.clientX - w - 28 : e.clientX + 28;
  const y = Math.min(Math.max(e.clientY - h / 2, 80), innerHeight - h - 16);
  peek.style.transform = `translate3d(${x}px,${y}px,0)`;
});
document.querySelectorAll(".filters button").forEach(btn => {
  const t = btn.dataset.type;
  btn.querySelector("span").textContent = t === "All" ? PROJECTS.length : PROJECTS.filter(p => p.type === t).length;
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filters button").forEach(x => x.setAttribute("aria-pressed", String(x === btn)));
    names.querySelectorAll("li").forEach(li => li.classList.toggle("off", t !== "All" && li.dataset.type !== t));
  });
});

/* ───────── 6 · where ───────── */
const byPlace = {};
PROJECTS.forEach(p => { byPlace[p.place] = (byPlace[p.place] || 0) + 1; });
Object.entries(byPlace).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).forEach(([place, n], i) => {
  const li = document.createElement("li"); if (i === 0) li.className = "top";
  li.innerHTML = "<b></b><span></span>";
  li.children[0].textContent = place;
  li.children[1].textContent = n; li.children[1].setAttribute("aria-label", `${n} project${n > 1 ? "s" : ""}`);
  $("#places").appendChild(li);
});

/* ───────── 7 · form → WhatsApp ───────── */
$("#lead").addEventListener("submit", e => {
  e.preventDefault();
  const f = new FormData(e.currentTarget), err = $("#err");
  const need = [["name", "your name"], ["location", "the site location"], ["phone", "your phone number"]].filter(([k]) => !String(f.get(k) || "").trim());
  if (need.length) { err.textContent = `Please add ${need.map(x => x[1]).join(", ")}.`; e.currentTarget.querySelector(`[name=${need[0][0]}]`).focus(); return; }
  err.textContent = "";
  const msg = ["Hello Ravi Buildcon, I'd like to discuss a project.", `Name: ${f.get("name")}`, f.get("company") ? `Company: ${f.get("company")}` : "",
    `Site: ${f.get("location")}`, f.get("area") ? `Built-up area: ${f.get("area")} sq ft` : "", `Scope: ${f.get("scope")}`, `Phone: ${f.get("phone")}`].filter(Boolean).join("\n");
  const url = `https://wa.me/${CONTACT.wa}?text=${encodeURIComponent(msg)}`;
  const w = window.open(url, "_blank");
  if (w) w.opener = null; else location.href = url;
});
