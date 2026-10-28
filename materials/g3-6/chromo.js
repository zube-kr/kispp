/* 염색체 그리기 공통 (중3 Ⅵ) — CH.cell(c, x, y, r, opt), CH.chr(c, x, y, len, col, doubled, ang) */
(function () {
  function chr(c, x, y, len, col, doubled, ang) {
    c.save(); c.translate(x, y); c.rotate(ang || 0); c.lineCap = "round"; c.strokeStyle = col; c.lineWidth = 6;
    if (doubled) { c.beginPath(); c.moveTo(-4, -len / 2); c.quadraticCurveTo(-1, 0, -4, len / 2); c.stroke(); c.beginPath(); c.moveTo(4, -len / 2); c.quadraticCurveTo(1, 0, 4, len / 2); c.stroke(); c.fillStyle = "#555"; c.beginPath(); c.arc(0, 0, 3.2, 0, 7); c.fill(); }
    else { c.beginPath(); c.moveTo(0, -len / 2); c.lineTo(0, len / 2); c.stroke(); }
    c.restore(); c.lineWidth = 1; c.lineCap = "butt";
  }
  function cell(c, x, y, rx, ry, membrane) {
    c.fillStyle = "rgba(220,235,250,.7)"; c.strokeStyle = "#8fb3c9"; c.lineWidth = 2; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, 7); c.fill(); c.stroke(); c.lineWidth = 1;
    if (membrane) { c.setLineDash([3, 3]); c.strokeStyle = "#9ab"; c.beginPath(); c.arc(x, y, Math.min(rx, ry) * 0.55, 0, 7); c.stroke(); c.setLineDash([]); }
  }
  function thread(c, x, y, r, t) { c.strokeStyle = "rgba(200,80,80,.6)"; c.beginPath(); for (let i = 0; i < 60; i++) { const a = i * 0.7 + (t || 0), rr = r * (0.2 + 0.7 * ((i * 37) % 10) / 10); c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.stroke(); }
  window.CH = { chr, cell, thread, COL: { A1: "#d2453b", A2: "#2f7fd6", B1: "#f08a4b", B2: "#6aa9e8" } };
})();
