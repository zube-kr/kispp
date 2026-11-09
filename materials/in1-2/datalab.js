/* 미니 코답(중학교 정보 Ⅱ. 데이터) — 표 정렬·그래프·지도를 브라우저에서 바로 그리는 작은 분석 도구
   DL.table(요소, cols, rows, { max, fmt, onSort })  → 머리글을 누르면 오름/내림차순 정렬
   DL.bar(canvas, { labels, values, pct, yLabel, color, mean })   막대그래프
   DL.scatter(canvas, { pts:[[x,y]], xLabel, yLabel, fit })       산점도(+ 상관 계수 r)
   DL.line(canvas, { x:[…], series:[{ name, vals, color }], yLabel }) 꺾은선그래프
   DL.map(canvas, { pts:[[lat, lon, color, label]] })              위도·경도 점 지도
   DL.mean / DL.corr / DL.group(rows, keyFn, valFn) 계산 도우미 */
(function () {
  var PAL = ["#2f7fd6", "#e4572e", "#2e9d6a", "#f2a516", "#8a5bd6", "#d1407a", "#1f9bd1", "#795548", "#607d8b", "#9ccc65", "#ff7043", "#5c6bc0", "#26a69a", "#ab47bc", "#8d6e63"];
  function mean(a) { a = a.filter(function (v) { return v != null && !isNaN(v); }); return a.length ? a.reduce(function (s, v) { return s + v; }, 0) / a.length : NaN; }
  function corr(x, y) { var mx = mean(x), my = mean(y), sxy = 0, sxx = 0, syy = 0; for (var i = 0; i < x.length; i++) { var dx = x[i] - mx, dy = y[i] - my; sxy += dx * dy; sxx += dx * dx; syy += dy * dy; } return sxy / Math.sqrt(sxx * syy); }
  function group(rows, key, val) { var m = {}; rows.forEach(function (r) { var k = key(r); (m[k] = m[k] || []).push(val ? val(r) : 1); }); return m; }
  function nice(v) { if (v <= 0) return 1; var p = Math.pow(10, Math.floor(Math.log10(v))), f = v / p; return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p; }
  function fmt(v) { if (v == null || isNaN(v)) return ""; var a = Math.abs(v); if (a >= 1e8) return (v / 1e8).toFixed(a >= 1e9 ? 0 : 1) + "억"; if (a >= 1e4) return (v / 1e4).toFixed(a >= 1e5 ? 0 : 1) + "만"; return Math.abs(v - Math.round(v)) < 1e-9 ? String(Math.round(v)) : v.toFixed(1); }
  function fit(cv, H) { var w = cv.clientWidth || cv.parentNode.clientWidth || 600, sc = Math.min(1, w / 360), dpr = Math.min(2, window.devicePixelRatio || 1); cv.width = w * dpr; cv.height = H * sc * dpr; cv.style.height = H * sc + "px"; var c = cv.getContext("2d"); c.setTransform(dpr * sc, 0, 0, dpr * sc, 0, 0); return { c: c, W: w / sc, H: H }; }
  function axes(c, L, R, T, B, y0, y1, yLabel) { var step = nice((y1 - y0) / 5); c.strokeStyle = "#e3e9ec"; c.fillStyle = "#5b6b6d"; c.font = "10px Pretendard, sans-serif"; c.textAlign = "right"; for (var v = Math.ceil(y0 / step) * step; v <= y1 + 1e-9; v += step) { var y = B - (v - y0) / (y1 - y0) * (B - T); c.beginPath(); c.moveTo(L, y); c.lineTo(R, y); c.stroke(); c.fillText(fmt(v), L - 4, y + 3); } if (yLabel) { c.save(); c.translate(10, (T + B) / 2); c.rotate(-Math.PI / 2); c.textAlign = "center"; c.fillText(yLabel, 0, 0); c.restore(); } c.strokeStyle = "#90a4ae"; c.beginPath(); c.moveTo(L, T); c.lineTo(L, B); c.lineTo(R, B); c.stroke(); }
  function wrapLabel(c, t, x, y, w) { var line = "", out = []; for (var i = 0; i < t.length; i++) { if (c.measureText(line + t[i]).width > w && line) { out.push(line); line = t[i]; } else line += t[i]; } out.push(line); out.slice(0, 3).forEach(function (l, k) { c.fillText(l, x, y + k * 11); }); }

  function bar(cv, o) {
    var H = o.h || 260, g = fit(cv, H), c = g.c, W = g.W, n = o.labels.length, rot = n > 8;
    var L = 46, R = W - 10, T = 22, B = H - (rot ? 70 : 40), vmax = o.max || Math.max.apply(null, o.values.concat([0])) * 1.12 || 1;
    c.fillStyle = "#fff"; c.fillRect(0, 0, W, H); axes(c, L, R, T, B, 0, vmax, o.yLabel);
    var bw = (R - L) / n, tot = o.values.reduce(function (s, v) { return s + v; }, 0);
    o.values.forEach(function (v, i) { var x = L + i * bw + bw * .15, h = v / vmax * (B - T); c.fillStyle = o.colors ? o.colors[i] : o.color || PAL[0]; c.fillRect(x, B - h, bw * .7, h);
      c.fillStyle = "#26393b"; c.font = "bold 10px Pretendard, sans-serif"; c.textAlign = "center"; if (bw > 28) c.fillText(o.pct ? (v / tot * 100).toFixed(1) + "%" : fmt(v), x + bw * .35, B - h - 4);
      c.font = "10px Pretendard, sans-serif"; c.fillStyle = "#26393b";
      if (rot) { c.save(); c.translate(x + bw * .35, B + 6); c.rotate(-Math.PI / 3); c.textAlign = "right"; c.fillText(String(o.labels[i]).slice(0, 12), 0, 4); c.restore(); } else wrapLabel(c, String(o.labels[i]), x + bw * .35, B + 13, bw - 2); });
    if (o.line != null) { var y = B - o.line / vmax * (B - T); c.strokeStyle = "#d1407a"; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(L, y); c.lineTo(R, y); c.stroke(); c.setLineDash([]); c.fillStyle = "#d1407a"; c.textAlign = "right"; c.fillText(o.lineLabel || fmt(o.line), R, y - 4); }
    if (o.title) { c.fillStyle = "#26393b"; c.font = "bold 12px Pretendard, sans-serif"; c.textAlign = "left"; c.fillText(o.title, L, 13); }
  }
  function scatter(cv, o) {
    var H = o.h || 260, g = fit(cv, H), c = g.c, W = g.W, P = o.pts.filter(function (p) { return p[0] != null && p[1] != null && !isNaN(p[0]) && !isNaN(p[1]); });
    var xs = P.map(function (p) { return p[0]; }), ys = P.map(function (p) { return p[1]; });
    var x0 = o.xMin != null ? o.xMin : Math.min.apply(null, xs.concat([0])), x1 = o.xMax || Math.max.apply(null, xs) * 1.05 || 1, y0 = o.yMin != null ? o.yMin : Math.min.apply(null, ys.concat([0])), y1 = o.yMax || Math.max.apply(null, ys) * 1.08 || 1;
    var L = 50, R = W - 12, T = 22, B = H - 34; c.fillStyle = "#fff"; c.fillRect(0, 0, W, H); axes(c, L, R, T, B, y0, y1, o.yLabel);
    var X = function (v) { return L + (v - x0) / (x1 - x0) * (R - L); }, Y = function (v) { return B - (v - y0) / (y1 - y0) * (B - T); };
    var st = nice((x1 - x0) / 5); c.fillStyle = "#5b6b6d"; c.textAlign = "center"; c.font = "10px Pretendard, sans-serif"; for (var v = Math.ceil(x0 / st) * st; v <= x1; v += st) c.fillText(fmt(v), X(v), B + 13); c.fillText(o.xLabel || "", (L + R) / 2, H - 6);
    c.fillStyle = o.color || "rgba(228,87,46,.55)"; var r = P.length > 2000 ? 1.6 : P.length > 300 ? 2.4 : 4;
    P.forEach(function (p) { c.beginPath(); c.arc(X(p[0]), Y(p[1]), r, 0, 7); c.fill(); });
    if (o.fit && P.length > 2) { var mx = mean(xs), my = mean(ys), sxy = 0, sxx = 0; P.forEach(function (p) { sxy += (p[0] - mx) * (p[1] - my); sxx += (p[0] - mx) * (p[0] - mx); }); var b = sxy / sxx, a = my - b * mx; c.strokeStyle = "#2f7fd6"; c.lineWidth = 2; c.beginPath(); c.moveTo(X(x0), Y(a + b * x0)); c.lineTo(X(x1), Y(a + b * x1)); c.stroke(); c.lineWidth = 1;
      var rr = corr(xs, ys); c.fillStyle = "#26393b"; c.font = "bold 12px Pretendard, sans-serif"; c.textAlign = "left"; c.fillText("상관 계수 r = " + rr.toFixed(2), L + 6, T + 2); }
  }
  function line(cv, o) {
    var H = o.h || 260, g = fit(cv, H), c = g.c, W = g.W, all = []; o.series.forEach(function (s) { all = all.concat(s.vals); });
    var y0 = o.yMin != null ? o.yMin : Math.min.apply(null, all) * .95, y1 = o.yMax || Math.max.apply(null, all) * 1.05;
    var L = 56, R = W - 12, T = 26, B = H - 46; c.fillStyle = "#fff"; c.fillRect(0, 0, W, H); axes(c, L, R, T, B, y0, y1, o.yLabel);
    var n = o.x.length, X = function (i) { return L + (n === 1 ? .5 : i / (n - 1)) * (R - L); }, Y = function (v) { return B - (v - y0) / (y1 - y0) * (B - T); };
    c.fillStyle = "#5b6b6d"; c.textAlign = "center"; c.font = "10px Pretendard, sans-serif"; o.x.forEach(function (v, i) { c.fillText(v, X(i), B + 13); });
    var lx = L; o.series.forEach(function (s, k) { var col = s.color || PAL[k]; c.strokeStyle = c.fillStyle = col; c.lineWidth = 2; c.beginPath(); s.vals.forEach(function (v, i) { i ? c.lineTo(X(i), Y(v)) : c.moveTo(X(i), Y(v)); }); c.stroke(); c.lineWidth = 1; s.vals.forEach(function (v, i) { c.beginPath(); c.arc(X(i), Y(v), 3, 0, 7); c.fill(); });
      c.font = "11px Pretendard, sans-serif"; c.textAlign = "left"; c.fillRect(lx, H - 14, 10, 10); c.fillStyle = "#26393b"; c.fillText(s.name, lx + 13, H - 5); lx += c.measureText(s.name).width + 30; });
  }
  function map(cv, o) {
    var H = o.h || 320, g = fit(cv, H), c = g.c, W = g.W, P = o.pts; c.fillStyle = "#e8f1f6"; c.fillRect(0, 0, W, H);
    var la = P.map(function (p) { return p[0]; }), lo = P.map(function (p) { return p[1]; }), a0 = Math.min.apply(null, la), a1 = Math.max.apply(null, la), b0 = Math.min.apply(null, lo), b1 = Math.max.apply(null, lo);
    if (o.bounds) { a0 = o.bounds[0]; a1 = o.bounds[1]; b0 = o.bounds[2]; b1 = o.bounds[3]; }
    var pad = 18, kx = (W - 2 * pad) / ((b1 - b0) * Math.cos((a0 + a1) / 2 * Math.PI / 180) || 1), ky = (H - 2 * pad) / ((a1 - a0) || 1), k = Math.min(kx, ky);
    var cx = W / 2, cy = H / 2, mb = (b0 + b1) / 2, ma = (a0 + a1) / 2, cosA = Math.cos(ma * Math.PI / 180);
    var X = function (b) { return cx + (b - mb) * cosA * k; }, Y = function (a) { return cy - (a - ma) * k; };
    if (o.under) o.under(c, X, Y);
    var r = P.length > 2000 ? 1.5 : P.length > 200 ? 2.5 : 6;
    P.forEach(function (p) { c.fillStyle = p[2] || "#e4572e"; c.beginPath(); c.arc(X(p[1]), Y(p[0]), r, 0, 7); c.fill(); if (p[3] && r >= 6) { c.fillStyle = "#26393b"; c.font = "bold 12px Pretendard, sans-serif"; c.textAlign = "left"; c.fillText(p[3], X(p[1]) + 8, Y(p[0]) + 4); } });
    c.fillStyle = "#5b6b6d"; c.font = "10px Pretendard, sans-serif"; c.textAlign = "right"; c.fillText("위도·경도로 그린 점 지도(배경 지도 없음)", W - 6, H - 6);
    return { X: X, Y: Y };
  }
  function table(host, cols, rows, o) {
    o = o || {}; var el = typeof host === "string" ? document.getElementById(host) : host, sortI = -1, dir = 1, data = rows.slice(), max = o.max || 12;
    function draw() {
      var shown = data.slice(0, max), f = o.fmt || [];
      el.innerHTML = '<div class="dl-cap">케이스 ' + data.length.toLocaleString() + "개" + (data.length > max ? " · 위에서 " + max + "개만 보여요" : "") + (o.sortable === false ? "" : " · 머리글을 누르면 정렬") + '</div><div class="scroll-x"><table class="data-t dl-t"><tr><th>#</th>' +
        cols.map(function (c, i) { return '<th data-i="' + i + '">' + c + (i === sortI ? (dir > 0 ? " ▲" : " ▼") : "") + "</th>"; }).join("") + "</tr>" +
        shown.map(function (r, k) { return "<tr><td>" + (k + 1) + "</td>" + r.map(function (v, i) { return "<td>" + (f[i] ? f[i](v) : v == null ? "" : v) + "</td>"; }).join("") + "</tr>"; }).join("") + "</table></div>";
      if (o.sortable !== false) el.querySelectorAll("th[data-i]").forEach(function (th) { th.addEventListener("click", function () { var i = +th.dataset.i; if (sortI === i) dir = -dir; else { sortI = i; dir = 1; } sort(); if (o.onSort) o.onSort(i, dir); }); });
    }
    function sort() { if (sortI < 0) return draw(); data.sort(function (a, b) { var x = a[sortI], y = b[sortI]; if (x == null) return 1; if (y == null) return -1; return (typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y), "ko")) * dir; }); draw(); }
    draw();
    return { el: el, sortBy: function (i, d) { sortI = i; dir = d; sort(); }, rows: function () { return data; }, set: function (r) { data = r.slice(); sort(); }, state: function () { return sortI < 0 ? "" : cols[sortI] + (dir > 0 ? " 오름차순" : " 내림차순"); } };
  }
  var css = document.createElement("style");
  css.textContent = ".dl-cap{font-size:12px;color:#5b6b6d;margin:6px 0 4px}.dl-t th[data-i]{cursor:pointer;white-space:nowrap}.dl-t th[data-i]:hover{background:#ffe9a8}.dl-t td{font-size:12.5px;white-space:nowrap}.dl-cv{display:block;width:100%;background:#fff;border-radius:10px}";
  document.head.appendChild(css);
  window.DL = { bar: bar, scatter: scatter, line: line, map: map, table: table, mean: mean, corr: corr, group: group, fmt: fmt, PAL: PAL };
})();
