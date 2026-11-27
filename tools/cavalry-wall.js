// Cavalry script (run via the Cavalry MCP execute_script): builds the hero formwork wall and its strike-off.
// Set W/H/COLS/ROWS for the aspect, run, then render frames 0..END to PNG (transparent background).
// wide: 1600x900, 5x3   tall: 720x1280, 3x5   Encode with the ffmpeg line in README.md
var W = 1600, H = 900, COLS = 5, ROWS = 3, FPS = 30, END = 54;
var LOGO = "C:/Users/Admin/Downloads/RB Management/site-v2/img/logo.svg";
var seed = 7; function rnd(a, b) { seed = (seed * 16807) % 2147483647; return a + (seed / 2147483647) * (b - a); }
var comp = api.getActiveComp();
api.getChildren(comp).forEach(function (id) { api.deleteLayer(id); });
api.select([]);
api.set(comp, { resolution: [W, H], fps: FPS, startFrame: 0, endFrame: END, playbackStart: 0, playbackEnd: END, backgroundColor: { r: 0, g: 0, b: 0, a: 0 }, motionBlur: true, motionBlurSamples: 16, shutterAngle: 200 });
var lw = Math.min(W * (W < H ? 0.82 : 0.62), 1100), ls = lw / 931, logoY = H * 0.04;
var pw = W / COLS, ph = H / ROWS, cells = [];
for (var r = 0; r < ROWS; r++) for (var c = 0; c < COLS; c++) {
  var cx = -W / 2 + (c + .5) * pw, cy = H / 2 - (r + .5) * ph;
  cells.push({ c: c, r: r, cx: cx, cy: cy, d: Math.hypot(cx, cy - H * 0.04) / Math.hypot(W, H) });
}
cells.sort(function (a, b) { return b.d - a.d; });   // outer first, so the centre panels (struck first) draw on top
function child(id, parent, attrs) { api.select([]); api.parent(id, parent); api.set(id, attrs); return id; }
function rect(name, w, h, col, parent, extra) {
  var a = { "generator.dimensions": [w, h], "material.materialColor": col, position: [0, 0] };
  for (var k in extra) a[k] = extra[k];
  return child(api.primitive("rectangle", name), parent, a);
}
function dot(name, rad, col, x, y, parent) {
  return child(api.primitive("ellipse", name), parent, { "generator.radius": [rad, rad], "material.materialColor": col, position: [x, y] });
}
function mark(name, col, x, y, parent) {      // the RAVI mark pressed into the ply, clipped to this panel
  var m = rect("mask", pw, ph, "#ffffff", parent, { hidden: true });
  var l = api.convertSVGToLayers(LOGO)[0]; api.select([]);
  api.rename(l, name);
  api.parent(l, parent);
  api.getChildren(l).forEach(function (s) { api.set(s, { "material.materialColor": col }); });
  api.set(l, { position: [x, y], scale: [ls, ls] });
  api.connect(m, "id", l, "masks");
}
cells.forEach(function (k, i) {
  api.select([]);
  var g = api.create("group", "panel " + k.r + "-" + k.c); api.select([]);
  rect("ply", pw, ph, ["#E67800", "#E27500", "#E97C06", "#E37900"][i % 4], g, { stroke: true, "stroke.strokeColor": "#A85000", "stroke.width": 2 });
  for (var v = 0; v < 6; v++) rect("grain", pw - 10, rnd(1, 2.5), v % 2 ? "#F59A30" : "#C86400", g, { position: [0, rnd(-ph / 2 + 8, ph / 2 - 8)], opacity: rnd(20, 38) });
  mark("mark lip", "#F7A95A", -k.cx, logoY - k.cy - 2.5, g);
  mark("mark", "#C25700", -k.cx, logoY - k.cy, g);
  [[.14, .16], [.86, .16], [.14, .84], [.86, .84]].forEach(function (t) {
    var x = -pw / 2 + t[0] * pw, y = ph / 2 - t[1] * ph;
    dot("tie ring", 7.5, "#9A4A00", x, y, g);
    dot("tie", 4.5, "#22170E", x, y, g);
  });
  api.set(g, { position: [k.cx, k.cy] });
  var sh = api.create("dropShadowFilter", "lift"); api.select([]);
  api.set(sh, { shadowColor: { r: 24, g: 14, b: 4, a: 120 } });
  api.connect(sh, "id", g, "filters");
  // the strike: ties pop (shake), the panel lifts off the face, then gravity
  var t0 = Math.round(3 + k.d * 2 * 20 + rnd(0, 3)), t1 = t0 + 4, t2 = t0 + 7, t3 = t2 + 18;
  var rz = rnd(-16, 16), dx = rnd(-40, 40);
  api.keyframe(g, t0, { "position.x": k.cx, "position.y": k.cy, "rotation.z": 0, "scale.x": 1, "scale.y": 1 });
  api.keyframe(g, t1, { "position.x": k.cx + rnd(-3, 3), "position.y": k.cy + 4, "rotation.z": rz * 0.06 });
  api.keyframe(g, t2, { "position.x": k.cx + rnd(-1, 1), "position.y": k.cy - 1, "rotation.z": -rz * 0.03, "scale.x": 1.015, "scale.y": 1.015 });
  api.keyframe(g, t3, { "position.x": k.cx + dx, "position.y": k.cy - H * 1.25, "rotation.z": rz, "scale.x": 1.1, "scale.y": 1.1 });
  ["position.x", "position.y", "rotation.z"].forEach(function (a) {
    api.magicEasing(g, a, t0, "SlowInSlowOut");
    api.magicEasing(g, a, t1, "SlowInSlowOut");
    api.magicEasing(g, a, t2, "SlowIn");                      // quadratic = gravity
  });
  ["scale.x", "scale.y"].forEach(function (a) { api.magicEasing(g, a, t0, "SlowInSlowOut"); api.magicEasing(g, a, t2, "SlowIn"); });
  api.keyframe(sh, t0, { "offset.x": 0, "offset.y": 0, "amount.x": 0, "amount.y": 0 });
  api.keyframe(sh, t2, { "offset.x": 0, "offset.y": -6, "amount.x": 8, "amount.y": 8 });
  api.keyframe(sh, t3, { "offset.x": 0, "offset.y": -50, "amount.x": 40, "amount.y": 40 });
});
api.getChildren(comp).length;
