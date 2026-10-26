/* 입자 모형 그리기 공통 (중2 Ⅳ) — MOL.draw(ctx, x, y, key, scale) */
(function () {
  const C = { H: ["#f4f4f4", 9, "#888"], O: ["#e4372e", 13, "#fff"], C: ["#3a3a3a", 13, "#fff"], N: ["#3b6fe0", 13, "#fff"], Cl: ["#45b84a", 15, "#fff"], Na: ["#9b6fd6", 15, "#fff"], Cu: ["#d9844a", 12, "#fff"], Fe: ["#8c8f96", 12, "#fff"], S: ["#f2d03b", 13, "#555"], He: ["#c06fd6", 11, "#fff"], Ca: ["#9aa0a6", 15, "#fff"], Ne: ["#ff7a59", 11, "#fff"] };
  // [원소, dx, dy] 목록
  const M = {
    H2: [["H", -7, 0], ["H", 7, 0]], O2: [["O", -9, 0], ["O", 9, 0]], N2: [["N", -9, 0], ["N", 9, 0]], O3: [["O", -16, 6], ["O", 0, -6], ["O", 16, 6]],
    H2O: [["O", 0, 0], ["H", -13, 9], ["H", 13, 9]], CO2: [["O", -20, 0], ["C", 0, 0], ["O", 20, 0]], CO: [["C", -9, 0], ["O", 9, 0]],
    CH4: [["C", 0, 0], ["H", -14, -10], ["H", 14, -10], ["H", -14, 10], ["H", 14, 10]], NH3: [["N", 0, -2], ["H", -14, 9], ["H", 0, 14], ["H", 14, 9]],
    HCl: [["H", -12, 0], ["Cl", 6, 0]], H2O2: [["H", -24, 8], ["O", -9, 0], ["O", 9, 0], ["H", 24, -8]], NO2: [["O", -16, 6], ["N", 0, -4], ["O", 16, 6]], SO2: [["O", -17, 7], ["S", 0, -4], ["O", 17, 7]],
    He: [["He", 0, 0]], Ne: [["Ne", 0, 0]],
    Cu: [[-1, -1], [1, -1], [-1, 1], [1, 1], [0, 0], [-2, 0], [2, 0]].map(p => ["Cu", p[0] * 12, p[1] * 12]), Fe: [[-1, -1], [1, -1], [-1, 1], [1, 1], [0, 0], [-2, 0], [2, 0]].map(p => ["Fe", p[0] * 12, p[1] * 12]),
    S8: [0, 1, 2, 3, 4, 5, 6, 7].map(k => ["S", Math.cos(k * Math.PI / 4) * 18, Math.sin(k * Math.PI / 4) * 10 + (k % 2 ? 4 : -4)]),
    NaCl: [[-1, -1, 0], [0, -1, 1], [1, -1, 0], [-1, 0, 1], [0, 0, 0], [1, 0, 1], [-1, 1, 0], [0, 1, 1], [1, 1, 0]].map(p => [p[2] ? "Na" : "Cl", p[0] * 18, p[1] * 18]),
    C2H4O2: [["C", -10, 0], ["C", 10, 0], ["O", 22, -12], ["O", 22, 12], ["H", 34, 14], ["H", -22, -10], ["H", -22, 10], ["H", -10, -16]]
  };
  function atom(c, x, y, el, s) { const a = C[el]; const r = a[1] * s; const g = c.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.15, x, y, r); g.addColorStop(0, "#fff"); g.addColorStop(0.25, a[0]); g.addColorStop(1, shade(a[0])); c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.strokeStyle = "rgba(0,0,0,.25)"; c.stroke(); if (s >= 0.8) { c.fillStyle = a[2]; c.font = `bold ${Math.round(9 * s)}px Pretendard, sans-serif`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(el, x, y + 0.5); c.textAlign = "left"; c.textBaseline = "alphabetic"; } }
  function shade(h) { const v = parseInt(h.slice(1), 16), r = (v >> 16) * 0.55, g = ((v >> 8) & 255) * 0.55, b = (v & 255) * 0.55; return `rgb(${r | 0},${g | 0},${b | 0})`; }
  window.MOL = { COL: C, M, atom, draw(c, x, y, key, s) { s = s || 1; M[key].forEach(([el, dx, dy]) => atom(c, x + dx * s, y + dy * s, el, s)); } };
})();
