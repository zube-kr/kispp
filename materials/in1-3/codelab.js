/* 정보 Ⅲ 공용 도구 — 엔트리 비슷한 블록 그림 + 키보드/터치 게임 보조
   CL.blocks([["start","시작하기 버튼을 클릭했을 때",[자식…]], ["flow","계속 반복하기",[…]], ["move","x 좌표를 10 만큼 바꾸기"], …])
   CL.pad(host, keys, cb) : 휴대폰용 방향키 버튼(keys=["ArrowLeft",…])  */
(function () {
  var COL = { start: "#2fb34a", flow: "#19baea", move: "#a751e3", look: "#ec4466", brush: "#f59a1b", sound: "#5aa9f0", judge: "#4f6af5", calc: "#f2a516", var: "#e157d6", list: "#d35ad6", func: "#de5c91", ai: "#16a6b6", hw: "#00a59c", text: "#7c7c7c" };
  function blocks(list) {
    return '<div class="cl-code">' + list.map(function one(b) {
      var kids = b[2] ? '<div class="cl-kids">' + b[2].map(one).join("") + "</div>" : "";
      var tail = b[3] ? '<div class="cl-else"><span>' + b[3] + '</span></div><div class="cl-kids">' + (b[4] || []).map(one).join("") + "</div>" : "";
      var c = COL[b[0]] || b[0];
      return '<div class="cl-blk' + (b[2] ? " cl-c" : "") + (b[0] === "start" ? " cl-hat" : "") + '" style="--bc:' + c + '"><span>' + b[1] + "</span>" + kids + tail + "</div>";
    }).join("") + "</div>";
  }
  function pad(host, keys, cb) {
    var L = { ArrowLeft: "◀", ArrowRight: "▶", ArrowUp: "▲", ArrowDown: "▼", " ": "점프" };
    host.classList.add("cl-pad");
    host.innerHTML = keys.map(function (k) { return '<button type="button" data-k="' + k + '">' + (L[k] || k) + "</button>"; }).join("");
    host.querySelectorAll("button").forEach(function (b) {
      var t = null;
      function down(e) { e.preventDefault(); cb(b.dataset.k, true); clearInterval(t); t = setInterval(function () { cb(b.dataset.k, true, 1); }, 60); }
      function up() { clearInterval(t); cb(b.dataset.k, false); }
      b.addEventListener("pointerdown", down); b.addEventListener("pointerup", up); b.addEventListener("pointerleave", up); b.addEventListener("pointercancel", up);
    });
  }
  // 캔버스 크기를 CSS 폭에 맞추기(논리 좌표 W×H 유지)
  function fit(cv, W, H) {
    var r = window.devicePixelRatio || 1, w = cv.clientWidth || W;
    cv.width = Math.round(w * r); cv.height = Math.round(w * H / W * r);
    var g = cv.getContext("2d"); g.setTransform(cv.width / W, 0, 0, cv.height / H, 0, 0); return g;
  }
  // 순서도 SVG: nodes=[{id,t:"term|io|proc|dec",x,y,w,h,text}], edges=[{pts:[[x,y]…],label,lx,ly}]  (좌표 = 중심)
  function flow(host, W, H, nodes, edges) {
    var s = '<svg viewBox="0 0 ' + W + " " + H + '" class="cl-flow" style="width:100%;max-width:' + W + 'px;display:block;margin:0 auto">' +
      '<defs><marker id="clar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0L10,5L0,10z" fill="#55606b"/></marker></defs>';
    edges.forEach(function (e) {
      s += '<polyline points="' + e.pts.map(function (p) { return p.join(","); }).join(" ") + '" fill="none" stroke="#55606b" stroke-width="1.6" marker-end="url(#clar)"/>';
      if (e.label) s += '<text x="' + e.lx + '" y="' + e.ly + '" font-size="12" font-weight="700" fill="#c2410c" text-anchor="middle">' + e.label + "</text>";
    });
    nodes.forEach(function (n) {
      var w = n.w || 150, h = n.h || 36, x = n.x - w / 2, y = n.y - h / 2, shp;
      if (n.t === "term") shp = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + h / 2 + '"/>';
      else if (n.t === "io") shp = '<polygon points="' + (x + 12) + "," + y + " " + (x + w) + "," + y + " " + (x + w - 12) + "," + (y + h) + " " + x + "," + (y + h) + '"/>';
      else if (n.t === "dec") shp = '<polygon points="' + n.x + "," + y + " " + (x + w) + "," + n.y + " " + n.x + "," + (y + h) + " " + x + "," + n.y + '"/>';
      else shp = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="3"/>';
      s += '<g class="cl-node cl-' + n.t + '" data-n="' + n.id + '">' + shp + n.text.split("\n").map(function (l, i, a) {
        return '<text x="' + n.x + '" y="' + (n.y + 4.5 + (i - (a.length - 1) / 2) * 15) + '" text-anchor="middle" font-size="12.5" font-weight="700">' + l + "</text>"; }).join("") + "</g>";
    });
    host.innerHTML = s + "</svg>";
    return function (id) { host.querySelectorAll(".cl-node").forEach(function (g) { g.classList.toggle("on", g.dataset.n === String(id)); }); };
  }
  var css = ".cl-node polygon,.cl-node rect{fill:#fff;stroke:#5b6b78;stroke-width:1.6}.cl-term rect{fill:#e8f6ee}.cl-io polygon{fill:#eef4ff}.cl-dec polygon{fill:#fff6e0}.cl-node text{fill:#26323a}" +
    ".cl-node.on polygon,.cl-node.on rect{fill:#ff9a3c;stroke:#c2410c;stroke-width:2.4}.cl-node.on text{fill:#fff}" +".cl-code{font:700 12.5px/1.35 'Pretendard',sans-serif;color:#fff;display:flex;flex-direction:column;gap:3px;margin:8px 0;overflow-x:auto}" +
    ".cl-blk{background:var(--bc);border-radius:7px;padding:6px 11px;align-self:flex-start;max-width:100%;box-shadow:inset 0 -2px rgba(0,0,0,.18)}" +
    ".cl-blk b{background:rgba(255,255,255,.92);color:#333;border-radius:10px;padding:0 6px;margin:0 2px;font-weight:800}" +
    ".cl-hat{border-radius:16px 16px 7px 7px;padding-top:8px}.cl-c{padding-bottom:9px}.cl-kids{display:flex;flex-direction:column;gap:3px;margin:6px 0 0 14px}.cl-else{margin-top:6px}" +
    ".cl-pad{display:flex;gap:6px;justify-content:center;margin:8px 0;flex-wrap:wrap}.cl-pad button{min-width:54px;height:44px;border-radius:12px;border:1px solid #c9d3dc;background:#fff;font:800 16px sans-serif;touch-action:none;user-select:none}" +
    ".cl-pad button:active{background:#e8f1ff}.cl-cv{display:block;width:100%;max-width:640px;margin:0 auto;border-radius:12px;background:#dff2ff;touch-action:none}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
  window.CL = { blocks: blocks, pad: pad, fit: fit, flow: flow, COL: COL };
})();
