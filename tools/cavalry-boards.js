// Cavalry script (run via the Cavalry MCP execute_script): the "Built to scale" reveal.
// Horizontal shutter boards held by two steel walers. The walers unbolt and drop, then the boards strike top to bottom.
// wide: W=1600 H=900 N=6   tall: W=720 H=1280 N=10. Renders PNG frames (transparent) to DIR.
var W = 1600, H = 900, N = 6, FPS = 30, DIR = "";
var seed = 11; function rnd(a, b) { seed = (seed * 16807) % 2147483647; return a + (seed / 2147483647) * (b - a); }
var comp = api.getActiveComp();
api.getChildren(comp).forEach(function (id) { api.deleteLayer(id); });
api.select([]);
var bh = H / N, wx = [-W * 0.3, W * 0.3];
var END = Math.ceil(9 + (N - 1) * 2.2 + 3 + 7 + 18 + 2);
api.set(comp, { resolution: [W, H], fps: FPS, startFrame: 0, endFrame: END, playbackStart: 0, playbackEnd: END, backgroundColor: { r: 0, g: 0, b: 0, a: 0 }, motionBlur: true, motionBlurSamples: 16, shutterAngle: 200 });
function child(id, parent, attrs) { api.select([]); api.parent(id, parent); api.set(id, attrs); return id; }
function rect(name, w, h, col, parent, extra) {
  var a = { "generator.dimensions": [w, h], "material.materialColor": col, position: [0, 0] };
  for (var k in extra) a[k] = extra[k];
  return child(api.primitive("rectangle", name), parent, a);
}
function dot(name, rad, col, x, y, parent) {
  return child(api.primitive("ellipse", name), parent, { "generator.radius": [rad, rad], "material.materialColor": col, position: [x, y] });
}
function shadow(g) {
  var sh = api.create("dropShadowFilter", "lift"); api.select([]);
  api.set(sh, { shadowColor: { r: 24, g: 14, b: 4, a: 120 } });
  api.connect(sh, "id", g, "filters");
  return sh;
}
function strike(g, sh, x, y, t0, fall, rz, dx) {
  var t1 = t0 + 3, t2 = t0 + 7, t3 = t2 + 18;
  api.keyframe(g, t0, { "position.x": x, "position.y": y, "rotation.z": 0 });
  api.keyframe(g, t1, { "position.x": x + rnd(-3, 3), "position.y": y + 4, "rotation.z": rz * 0.05 });
  api.keyframe(g, t2, { "position.x": x, "position.y": y - 1, "rotation.z": -rz * 0.02 });
  api.keyframe(g, t3, { "position.x": x + dx, "position.y": y - fall, "rotation.z": rz });
  ["position.x", "position.y", "rotation.z"].forEach(function (a) {
    api.magicEasing(g, a, t0, "SlowInSlowOut");
    api.magicEasing(g, a, t1, "SlowInSlowOut");
    api.magicEasing(g, a, t2, "SlowIn");                      // quadratic = gravity
  });
  api.keyframe(sh, t0, { "offset.y": 0, "amount.x": 0, "amount.y": 0 });
  api.keyframe(sh, t2, { "offset.y": -6, "amount.x": 8, "amount.y": 8 });
  api.keyframe(sh, t3, { "offset.y": -40, "amount.x": 30, "amount.y": 30 });
}
// boards, bottom first so the upper ones (struck first) fall in front
for (var i = N - 1; i >= 0; i--) {
  api.select([]);
  var g = api.create("group", "board " + i); api.select([]);
  var y = H / 2 - (i + .5) * bh;
  rect("ply", W + 40, bh, ["#E67800", "#E27500", "#E97C06"][i % 3], g, { stroke: true, "stroke.strokeColor": "#A85000", "stroke.width": 2 });
  for (var v = 0; v < 4; v++) rect("grain", W + 20, rnd(1, 2.5), v % 2 ? "#F59A30" : "#C86400", g, { position: [rnd(-20, 20), rnd(-bh / 2 + 6, bh / 2 - 6)], opacity: rnd(20, 36) });
  rect("edge", W + 40, 3, "#F7A95A", g, { position: [0, bh / 2 - 3], opacity: 45 });
  wx.forEach(function (x) { dot("tie ring", 7.5, "#9A4A00", x, 0, g); dot("tie", 4.5, "#22170E", x, 0, g); });
  api.set(g, { position: [0, y] });
  strike(g, shadow(g), 0, y, Math.round(9 + i * 2.2 + rnd(0, 2)), H * 1.25 - (H / 2 - y) * 0.2, rnd(-4, 4), rnd(-30, 30));
}
// walers: steel channels with bolt plates, struck first
wx.forEach(function (x, j) {
  api.select([]);
  var g = api.create("group", "waler " + j); api.select([]);
  rect("channel", 34, H + 60, "#2A2018", g, {});
  rect("flange", 6, H + 60, "#4A3A2C", g, { position: [-12, 0] });
  for (var i = 0; i < N; i++) {
    var y = H / 2 - (i + .5) * bh;
    rect("plate", 46, 22, "#3A2E24", g, { position: [0, y] });
    dot("nut", 6, "#6B5A48", 0, y, g);
  }
  api.set(g, { position: [x, 0] });
  strike(g, shadow(g), x, 0, 1 + j * 2, H * 1.4, j ? 5 : -5, j ? 60 : -60);
});
if (DIR) {
  api.makeFolder(DIR);
  for (var f = 0; f <= END; f++) { api.setFrame(f); api.renderPNGFrame(DIR + "/f" + ("00" + f).slice(-3) + ".png", 100); }
  api.setFrame(0);
}
END;
