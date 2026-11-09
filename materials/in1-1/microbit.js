/* 가상 마이크로비트 (중학교 정보 Ⅰ) — MB.create(요소, { sensors: ["shake","tilt","temp","light","sound","logo"], name })
   b.plot("#...# .#.#. ..#.. .#.#. #...#") · b.icon("HEART") · b.show(텍스트/숫자) · b.clear() · b.bright(0~255)
   b.on("A"|"B"|"AB"|"logo"|"shake"|"tilt"|"loud"|"change", fn) · b.s = { temp, light, sound, tilt }
   b.tone(Hz, ms) · b.play([[Hz, 박자], …], bpm) · MB.blocks([...]) 블록 코드 그림 */
(function () {
  var FONT = { "0": ".##..#..#.#..#.#..#..##..", "1": "..#...##....#....#...###.", "2": "###.....#..##..#....####.", "3": "####....#...#..#..#..##..", "4": "..##..#.#.#..#.####....#.", "5": "####.#....###.....#.###..", "6": "...#...#...###.#..#..##..", "7": "####....#...#...#...#....", "8": ".##..#..#..##..#..#..##..", "9": ".###.#..#..###...#...#...", "-": "...........###...........", "A": ".##..#..#.####.#..#.#..#.", "B": "###..#..#.###..#..#.###..", "O": ".##..#..#.#..#.#..#..##..", "X": "#...#.#.#...#...#.#.#...#", "C": ".###.#....#....#.....###.", "L": "#....#....#....#....####.", "W": "#...##...##.#.###.###...#", "D": "###..#..#.#..#.#..#.###..", ":": "......#.........#........", "!": "..#....#....#.........#..", " ": "........................." };
  var ICONS = { "HEART": ".#.#.##########.###...#..", "SMALL_HEART": "......#.#..###...#.......", "YES": ".........#...#.#.#...#...", "NO": "#...#.#.#...#...#.#.#...#", "HAPPY": "......#.#......#...#.###.", "SAD": "......#.#.......###.#...#", "SQUARE": "######...##...##...######", "SMALL_SQUARE": "......###..#.#..###......", "DIAMOND": "..#...#.#.#...#.#.#...#..", "ARROW_N": "..#...###.#.#.#..#....#..", "ARROW_S": "..#....#..#.#.#.###...#..", "ARROW_E": "..#.....#.#####...#...#..", "ARROW_W": "..#...#...#####.#.....#..", "ROCK": "......###..###..###......", "SCISSORS": "##..###.#...#..##.#.##..#", "PAPER": "#########################", "DANCE1": "..#...###.#.#.#.#.#..#.#.", "DANCE2": "#.#.#.###...#...#.#.#...#", "DANCE3": "..#...###...#...#.#.#...#", "MOON": "..##..##...##...##....##.", "SUN": "#.#.#.###.#####.###.#.#.#", "CIRCLE": ".###.#...##...##...#.###.", "NOTE": "..##...#.#..#..###..###..", "SKULL": ".###.#.#.######.###..###.", "DICE1": "............#............", "DICE2": "#.......................#", "DICE3": "#...........#...........#", "DICE4": "#...#...............#...#", "DICE5": "#...#.......#.......#...#", "DICE6": "#...#.....#...#.....#...#" };
  ICONS.TICK = ICONS.YES; ICONS.CROSS = ICONS.NO; ICONS.UP = ICONS.ARROW_N; ICONS.DOWN = ICONS.ARROW_S;
  var AC = null;
  function ac() { if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } if (AC && AC.state === "suspended") AC.resume(); return AC; }

  function create(host, opt) {
    opt = opt || {};
    var el = typeof host === "string" ? document.getElementById(host) : host;
    el.classList.add("mb-wrap");
    var sens = opt.sensors || [];
    el.innerHTML = '<div class="mb-board"><canvas></canvas></div><div class="mb-ctl"></div>';
    var cv = el.querySelector("canvas"), ctl = el.querySelector(".mb-ctl");
    var b = { leds: new Array(25).fill(0), level: 255, s: { temp: 21, light: 180, sound: 40, tilt: "flat" }, h: {}, mute: false, name: opt.name || "" };
    var timer = null, scrollTok = 0, press = null;
    b.on = function (ev, fn) { (b.h[ev] = b.h[ev] || []).push(fn); return b; };
    function fire(ev, a) { (b.h[ev] || []).forEach(function (f) { f(a); }); (b.h.any || []).forEach(function (f) { f(ev, a); }); }
    b.fire = fire;
    function set(str) { scrollTok++; str = str.replace(/\s/g, ""); for (var i = 0; i < 25; i++) b.leds[i] = str[i] === "#" ? 255 : (str[i] >= "1" && str[i] <= "9" ? +str[i] * 28 : 0); draw(); }
    b.plot = function (s) { set(s); return b; };
    b.icon = function (n) { set(ICONS[n] || ICONS.SQUARE); b.cur = n; return b; };
    b.clear = function () { scrollTok++; b.leds.fill(0); b.cur = ""; draw(); return b; };
    b.bright = function (v) { b.level = Math.max(0, Math.min(255, v)); draw(); return b; };
    b.pixel = function (x, y, on) { b.leds[y * 5 + x] = on ? 255 : 0; draw(); };
    b.show = function (txt, cb) {
      txt = String(txt); var tok = ++scrollTok; b.cur = txt;
      if (txt.length === 1) { var g = FONT[txt.toUpperCase()] || FONT[" "]; for (var i = 0; i < 25; i++) b.leds[i] = g[i] === "#" ? 255 : 0; draw(); if (cb) setTimeout(cb, 400); return b; }
      // 여러 글자는 왼쪽으로 흘러가게(글자 사이 1칸)
      var cols = [];
      for (var k = 0; k < txt.length; k++) { var gl = FONT[txt[k].toUpperCase()] || FONT[" "]; var w = 0; for (var cc0 = 0; cc0 < 5; cc0++) for (var rr0 = 0; rr0 < 5; rr0++) if (gl[rr0 * 5 + cc0] === "#") w = cc0 + 1; if (!w) w = 2; for (var c = 0; c < w; c++) { var col = []; for (var r = 0; r < 5; r++) col.push(c < 5 && gl[r * 5 + c] === "#" ? 1 : 0); cols.push(col); } cols.push([0, 0, 0, 0, 0]); }
      var off = -5;
      (function step() { if (tok !== scrollTok) return; for (var y = 0; y < 5; y++) for (var x = 0; x < 5; x++) { var cc = cols[off + x]; b.leds[y * 5 + x] = cc && cc[y] ? 255 : 0; } draw(); off++; if (off <= cols.length) setTimeout(step, 110); else if (cb) cb(); })();
      return b;
    };
    b.tone = function (hz, ms) { var a = ac(); if (!a || b.mute) return; var o = a.createOscillator(), g = a.createGain(); o.type = "square"; o.frequency.value = hz; g.gain.value = 0.06; o.connect(g); g.connect(a.destination); o.start(); o.stop(a.currentTime + ms / 1000); };
    b.play = function (notes, bpm, done) { var beat = 60000 / (bpm || 120), t = 0; notes.forEach(function (n) { setTimeout(function () { if (n[0]) b.tone(n[0], beat * n[1] * 0.9); fire("note", n); }, t); t += beat * n[1]; }); if (done) setTimeout(done, t); return t; };

    // 보드 그리기
    var HIT = {};
    function draw() {
      var W = Math.min(300, el.clientWidth || 300), H = Math.round(W * 0.82), dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + "px"; cv.style.height = H + "px";
      var c = cv.getContext("2d"); c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.fillStyle = "#1c1c22"; rr(c, 4, 4, W - 8, H - 8, 18); c.fill();
      c.fillStyle = "#c8102e"; c.beginPath(); c.moveTo(4, 22); c.quadraticCurveTo(4, 4, 22, 4); c.lineTo(W * .16, 4); c.lineTo(4, H * .2); c.fill();
      c.beginPath(); c.moveTo(W - 4, 22); c.quadraticCurveTo(W - 4, 4, W - 22, 4); c.lineTo(W * .84, 4); c.lineTo(W - 4, H * .2); c.fill();
      // 금속 핀
      c.fillStyle = "#c9a227"; for (var p = 0; p < 22; p++) c.fillRect(14 + p * (W - 28) / 22, H - 22, (W - 28) / 22 - 2, 16);
      [[.12, "0"], [.3, "1"], [.5, "2"], [.7, "3V"], [.88, "GND"]].forEach(function (q) { c.fillStyle = "#c9a227"; c.beginPath(); c.arc(W * q[0], H - 28, W * .045, 0, 7); c.fill(); c.fillStyle = "#1c1c22"; c.beginPath(); c.arc(W * q[0], H - 28, W * .02, 0, 7); c.fill(); });
      // 로고(터치)
      var lx = W / 2, ly = H * .13; HIT.logo = [lx, ly, W * .07];
      c.strokeStyle = press === "logo" ? "#ffd23f" : "#c9a227"; c.lineWidth = 3; rr(c, lx - W * .06, ly - W * .025, W * .12, W * .05, W * .025); c.stroke(); c.lineWidth = 1;
      // LED 5×5
      var g = W * .085, x0 = W / 2 - g * 2, y0 = H * .3;
      for (var y = 0; y < 5; y++) for (var x = 0; x < 5; x++) { var v = b.leds[y * 5 + x] * b.level / 255 / 255, cx = x0 + x * g, cy = y0 + y * g;
        if (v > 0.02) { c.fillStyle = "rgba(255,40,30," + (v * .35) + ")"; c.beginPath(); c.arc(cx, cy, g * .5, 0, 7); c.fill(); }
        c.fillStyle = v > 0.02 ? "rgb(255," + Math.round(60 + 120 * v) + "," + Math.round(40 + 60 * v) + ")" : "#3a3a42"; rr(c, cx - g * .12, cy - g * .24, g * .24, g * .48, 2); c.fill(); }
      // A, B 버튼
      [["A", W * .13], ["B", W * .87]].forEach(function (q) { var bx = q[1], by = H * .47; HIT[q[0]] = [bx, by, W * .07];
        c.fillStyle = "#cfd3d6"; c.fillRect(bx - W * .065, by - W * .065, W * .13, W * .13); c.fillStyle = press === q[0] ? "#555" : "#222"; c.beginPath(); c.arc(bx, by, W * .045, 0, 7); c.fill();
        c.fillStyle = "#fff"; c.font = "bold " + Math.round(W * .055) + "px sans-serif"; c.textAlign = "center"; c.fillText(q[0], bx, by - W * .09); });
      if (b.name) { c.fillStyle = "#9aa"; c.font = Math.round(W * .045) + "px sans-serif"; c.textAlign = "center"; c.fillText(b.name, W / 2, H * .23); }
    }
    function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
    function hit(e) { var r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top; for (var k in HIT) { var h = HIT[k]; if (Math.hypot(x - h[0], y - h[1]) < h[2] * 1.4) return k; } return null; }
    cv.addEventListener("pointerdown", function (e) { var k = hit(e); if (!k) return; e.preventDefault(); ac(); press = k; draw(); fire(k); setTimeout(function () { press = null; draw(); }, 160); });
    // 조작판
    var html = '<div class="mb-btns"><button type="button" data-ev="A">A</button><button type="button" data-ev="B">B</button><button type="button" data-ev="AB">A+B</button>' +
      (sens.indexOf("logo") >= 0 ? '<button type="button" data-ev="logo">로고 터치</button>' : "") + (sens.indexOf("shake") >= 0 ? '<button type="button" data-ev="shake">🤚 흔들기</button>' : "") + "</div>";
    if (sens.indexOf("tilt") >= 0) html += '<div class="mb-btns"><b>기울이기</b><button type="button" data-tilt="left">← 왼쪽</button><button type="button" data-tilt="up">↑ 위(로고 위쪽)</button><button type="button" data-tilt="down">↓ 아래</button><button type="button" data-tilt="right">→ 오른쪽</button></div>';
    [["temp", "🌡 온도", -5, 50, "℃"], ["light", "💡 빛 밝기", 0, 255, ""], ["sound", "🔊 소리 크기", 0, 255, ""]].forEach(function (q) {
      if (sens.indexOf(q[0]) >= 0) html += '<label class="mb-sl"><b>' + q[1] + '</b><input type="range" min="' + q[2] + '" max="' + q[3] + '" value="' + b.s[q[0]] + '" data-s="' + q[0] + '"><span>' + b.s[q[0]] + q[4] + "</span></label>"; });
    ctl.innerHTML = html;
    ctl.querySelectorAll("[data-ev]").forEach(function (bt) { bt.addEventListener("click", function () { ac(); var k = bt.dataset.ev; press = k === "AB" ? null : k; draw(); fire(k); setTimeout(function () { press = null; draw(); }, 160); }); });
    ctl.querySelectorAll("[data-tilt]").forEach(function (bt) { bt.addEventListener("click", function () { b.s.tilt = bt.dataset.tilt; fire("tilt", b.s.tilt); }); });
    ctl.querySelectorAll("[data-s]").forEach(function (sl) { sl.addEventListener("input", function () { var k = sl.dataset.s, v = +sl.value; b.s[k] = v; sl.nextElementSibling.textContent = v + (k === "temp" ? "℃" : ""); fire("change", k); if (k === "sound" && v >= (b.loudLevel || 128) && !b._loud) { b._loud = true; fire("loud"); } if (k === "sound" && v < (b.loudLevel || 128)) b._loud = false; }); });
    b.setSensor = function (k, v) { b.s[k] = v; var sl = ctl.querySelector('[data-s="' + k + '"]'); if (sl) { sl.value = v; sl.nextElementSibling.textContent = v + (k === "temp" ? "℃" : ""); } fire("change", k); };
    window.addEventListener("resize", draw); draw();
    return b;
  }

  // 메이크코드 비슷한 블록 그림: [["event","A 버튼 누를 때",[자식…]], ["basic","숫자 출력 …"], …]
  var COL = { event: "#d400d4", basic: "#1e90ff", var: "#dc143c", logic: "#00a4a6", loop: "#00aa00", music: "#e63022", radio: "#e3008c", led: "#5c2d91", input: "#d400d4", math: "#9400d3", start: "#1e90ff" };
  function blocks(list) {
    return '<div class="mb-code">' + list.map(function one(bl) {
      var kids = bl[2] ? '<div class="mb-kids">' + bl[2].map(one).join("") + "</div>" : "";
      return '<div class="mb-blk' + (bl[2] ? " mb-c" : "") + '" style="--bc:' + (COL[bl[0]] || bl[0]) + '"><span>' + bl[1] + "</span>" + kids + "</div>";
    }).join("") + "</div>";
  }
  // 5×5 그림판(학생이 LED를 눌러 아이콘 그리기) — 값은 "#..#." 25자
  function grid(host, onChange) {
    var el = typeof host === "string" ? document.getElementById(host) : host; el.classList.add("mb-grid");
    el.innerHTML = Array.from({ length: 25 }, function (_, i) { return '<button type="button" data-i="' + i + '"></button>'; }).join("");
    var v = new Array(25).fill(0);
    el.querySelectorAll("button").forEach(function (bt) { bt.addEventListener("click", function () { var i = +bt.dataset.i; v[i] = v[i] ? 0 : 1; bt.classList.toggle("on", !!v[i]); if (onChange) onChange(get()); }); });
    function get() { return v.map(function (x) { return x ? "#" : "."; }).join(""); }
    return { get: get, set: function (s) { for (var i = 0; i < 25; i++) { v[i] = s[i] === "#" ? 1 : 0; el.children[i].classList.toggle("on", !!v[i]); } } };
  }
  var css = document.createElement("style");
  css.textContent = ".mb-wrap{display:flex;flex-wrap:wrap;gap:12px;align-items:flex-start;margin:8px 0}.mb-board{background:#f3f6f8;border-radius:16px;padding:8px;max-width:316px;flex:1 1 240px}.mb-board canvas{display:block;margin:0 auto;touch-action:manipulation;cursor:pointer}" +
    ".mb-ctl{flex:1 1 220px;display:flex;flex-direction:column;gap:8px;font-size:13px}.mb-btns{display:flex;flex-wrap:wrap;gap:6px;align-items:center}.mb-btns b{font-size:12.5px;margin-right:2px}.mb-btns button{border:1px solid #cfd8dc;background:#fff;border-radius:9px;padding:6px 10px;font-weight:700;cursor:pointer;font-size:13px}.mb-btns button:active{background:#ffe9a8}" +
    ".mb-sl{display:grid;grid-template-columns:auto 1fr 48px;gap:6px;align-items:center}.mb-sl input{width:100%}.mb-sl span{font-weight:800;text-align:right}" +
    ".mb-code{font:700 12.5px/1.3 'Pretendard',sans-serif;color:#fff;display:flex;flex-direction:column;gap:3px;margin:8px 0;overflow-x:auto}.mb-blk{background:var(--bc);border-radius:6px;padding:6px 10px;align-self:flex-start;max-width:100%;box-shadow:inset 0 -2px rgba(0,0,0,.18)}.mb-c{padding-bottom:10px}.mb-kids{display:flex;flex-direction:column;gap:3px;margin:6px 0 0 14px}" +
    ".mb-blk span b{background:#fff;color:#333;border-radius:10px;padding:0 6px;margin:0 2px}.mb-grid{display:grid;grid-template-columns:repeat(5,28px);gap:4px;background:#1c1c22;padding:8px;border-radius:10px;width:max-content}.mb-grid button{width:28px;height:28px;border-radius:5px;border:0;background:#3a3a42;cursor:pointer}.mb-grid button.on{background:#ff4b3a;box-shadow:0 0 8px #ff4b3a}";
  document.head.appendChild(css);
  window.MB = { create: create, blocks: blocks, grid: grid, ICONS: ICONS, FONT: FONT };
})();
