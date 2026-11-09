/* 정보 Ⅳ 공용 인공지능 실험실 — 브라우저에서 직접 학습하는 작은 분류 모델
   AI.imgFeat(img|canvas|video)            이미지 특징(색 분포 64 + 흑백 24×16 모양)
   AI.sndFeat(url|Blob|AudioBuffer) → Promise  소리 특징(주파수 22 구간의 평균·변화·흔들림)
   AI.Knn()  .add(feat,label,meta) .predict(feat,k) → {label, conf:{label:%}, near:{meta,sim}}
   AI.NB(classes)  텍스트 나이브 베이즈 .predict(text) → {label, conf}
   AI.bars(host, conf)   AI.cam(video) → Promise   AI.rec(sec) → Promise<Blob>   AI.say(text) */
(function () {
  var D = window.AIDATA || {};
  function norm(v) { var m = 0, i, n = v.length; for (i = 0; i < n; i++) m += v[i]; m /= n; var s = 0; for (i = 0; i < n; i++) { v[i] -= m; s += v[i] * v[i]; } s = Math.sqrt(s) || 1; for (i = 0; i < n; i++) v[i] /= s; return v; }
  var cv = document.createElement("canvas"), g = cv.getContext("2d", { willReadFrequently: true });
  function imgFeat(src) {
    var w = src.videoWidth || src.naturalWidth || src.width, h = src.videoHeight || src.naturalHeight || src.height;
    cv.width = 64; cv.height = 48; g.drawImage(src, 0, 0, w, h, 0, 0, 64, 48); var d = g.getImageData(0, 0, 64, 48).data, hist = new Float32Array(64), i;
    for (i = 0; i < d.length; i += 4) hist[(d[i] >> 6) * 16 + (d[i + 1] >> 6) * 4 + (d[i + 2] >> 6)]++;
    for (i = 0; i < 64; i++) hist[i] = Math.sqrt(hist[i]); norm(hist);
    cv.width = 24; cv.height = 16; g.drawImage(src, 0, 0, w, h, 0, 0, 24, 16); d = g.getImageData(0, 0, 24, 16).data; var gr = new Float32Array(384);
    for (i = 0; i < 384; i++) gr[i] = 0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2]; norm(gr);
    var f = new Float32Array(448); for (i = 0; i < 64; i++) f[i] = hist[i] / Math.SQRT2; for (i = 0; i < 384; i++) f[64 + i] = gr[i] / Math.SQRT2; return f;
  }
  // ── 소리 ──
  var AC = null; function ac() { if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)(); return AC; }
  function fft(re, im) { var n = re.length, i, j = 0, k, t; for (i = 1; i < n; i++) { k = n >> 1; while (j & k) { j ^= k; k >>= 1; } j |= k; if (i < j) { t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; } }
    for (var len = 2; len <= n; len <<= 1) { var a = -2 * Math.PI / len, wr = Math.cos(a), wi = Math.sin(a); for (i = 0; i < n; i += len) { var cr = 1, ci = 0; for (j = 0; j < len / 2; j++) { var ur = re[i + j], ui = im[i + j], vr = re[i + j + len / 2] * cr - im[i + j + len / 2] * ci, vi = re[i + j + len / 2] * ci + im[i + j + len / 2] * cr;
      re[i + j] = ur + vr; im[i + j] = ui + vi; re[i + j + len / 2] = ur - vr; im[i + j + len / 2] = ui - vi; t = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = t; } } } }
  function toBuffer(src) {
    if (src && src.getChannelData) return Promise.resolve(src);
    var p = typeof src === "string" ? fetch(src).then(function (r) { return r.arrayBuffer(); }) : src.arrayBuffer();
    return p.then(function (ab) { return new Promise(function (ok, no) { ac().decodeAudioData(ab, ok, no); }); });
  }
  function resample(buf) { var len = Math.min(buf.duration, 5), O = new OfflineAudioContext(1, Math.max(512, Math.ceil(len * 16000)), 16000), s = O.createBufferSource(); s.buffer = buf; s.connect(O.destination); s.start(); return O.startRendering(); }
  function sndFeat(src) {
    return toBuffer(src).then(resample).then(function (b) {
      var x = b.getChannelData(0), N = 512, H = 256, E = D.edges, nb = E.length - 1, win = new Float32Array(N), i, k, fr = [];
      for (i = 0; i < N; i++) win[i] = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / (N - 1));
      for (var s = 0; s < Math.max(1, x.length - N); s += H) { var re = new Float32Array(N), im = new Float32Array(N); for (i = 0; i < N; i++) re[i] = (x[s + i] || 0) * win[i]; fft(re, im);
        var B = new Float32Array(nb); for (k = 0; k < nb; k++) { var e = 0; for (i = E[k]; i < E[k + 1]; i++) e += re[i] * re[i] + im[i] * im[i]; B[k] = Math.log10(e + 1e-6); } fr.push(B); }
      var M = fr.length, f = new Float32Array(nb * 3); for (k = 0; k < nb; k++) { var m = 0, v = 0, dl = 0; for (i = 0; i < M; i++) m += fr[i][k]; m /= M; for (i = 0; i < M; i++) v += (fr[i][k] - m) * (fr[i][k] - m);
        for (i = 1; i < M; i++) dl += Math.abs(fr[i][k] - fr[i - 1][k]); f[k] = m; f[nb + k] = Math.sqrt(v / M); f[2 * nb + k] = M > 1 ? dl / (M - 1) : 0; }
      return norm(f);
    });
  }
  // ── k-최근접 이웃 ──
  function Knn() { this.items = []; }
  Knn.prototype.add = function (f, label, meta) { this.items.push({ f: f, label: label, meta: meta }); return this; };
  Knn.prototype.labels = function () { var s = []; this.items.forEach(function (it) { if (s.indexOf(it.label) < 0) s.push(it.label); }); return s; };
  Knn.prototype.count = function (l) { return this.items.filter(function (it) { return it.label === l; }).length; };
  Knn.prototype.predict = function (f, k) {
    k = k || 1; var sims = this.items.map(function (it) { var s = 0; for (var i = 0; i < f.length; i++) s += f[i] * it.f[i]; return { it: it, s: s }; }).sort(function (a, b) { return b.s - a.s; });
    if (!sims.length) return null; var votes = {}, best = {}; sims.slice(0, k).forEach(function (o) { votes[o.it.label] = (votes[o.it.label] || 0) + 1; });
    sims.forEach(function (o) { if (!(o.it.label in best)) best[o.it.label] = o.s; });
    var lab = Object.keys(votes).sort(function (a, b) { return votes[b] - votes[a] || best[b] - best[a]; })[0];
    var ex = {}, sum = 0; Object.keys(best).forEach(function (l) { ex[l] = Math.exp(best[l] * 12); sum += ex[l]; }); var conf = {}; Object.keys(ex).forEach(function (l) { conf[l] = Math.round(ex[l] / sum * 1000) / 10; });
    return { label: lab, conf: conf, near: { meta: sims[0].it.meta, sim: sims[0].s, label: sims[0].it.label } };
  };
  // ── 텍스트 나이브 베이즈 ──
  function tok(s) { s = String(s).replace(/[^가-힣a-zA-Z0-9 ]/g, " "); var out = []; s.split(/\s+/).filter(Boolean).forEach(function (w) { out.push("W" + w); var w2 = " " + w + " "; for (var i = 0; i < w2.length - 1; i++) out.push(w2.substr(i, 2)); }); return out; }
  function NB(classes) { this.c = {}; this.V = {}; this.nv = 0; this.D = 0; var me = this; Object.keys(classes || {}).forEach(function (k) { classes[k].forEach(function (d) { me.add(d, k); }); }); }
  NB.prototype.add = function (doc, k) { var c = this.c[k] || (this.c[k] = { cnt: {}, tot: 0, nd: 0 }), me = this; c.nd++; this.D++; tok(doc).forEach(function (t) { c.cnt[t] = (c.cnt[t] || 0) + 1; c.tot++; if (!me.V[t]) { me.V[t] = 1; me.nv++; } }); };
  NB.prototype.predict = function (s) {
    var me = this, sc = {}, ts = tok(s); Object.keys(this.c).forEach(function (k) { var c = me.c[k], v = Math.log(c.nd / me.D); ts.forEach(function (t) { v += Math.log(((c.cnt[t] || 0) + 1) / (c.tot + me.nv)); }); sc[k] = v; });
    var ks = Object.keys(sc), mx = Math.max.apply(null, ks.map(function (k) { return sc[k]; })), sum = 0, conf = {}; ks.forEach(function (k) { sum += Math.exp(sc[k] - mx); });
    ks.forEach(function (k) { conf[k] = Math.round(Math.exp(sc[k] - mx) / sum * 1000) / 10; }); return { label: ks.sort(function (a, b) { return sc[b] - sc[a]; })[0], conf: conf };
  };
  // ── 화면 도우미 ──
  var PAL = ["#2f7fd6", "#e8742a", "#2fb34a", "#d1407a", "#8a5cd6", "#16a6b6"];
  function bars(host, conf, order) { var ks = order || Object.keys(conf);
    host.innerHTML = ks.map(function (k, i) { var v = conf[k] || 0; return '<div class="ai-bar"><span>' + k + '</span><div><i style="width:' + v + "%;background:" + PAL[i % PAL.length] + '"></i></div><b>' + v.toFixed(1) + "%</b></div>"; }).join(""); }
  function cam(video) { if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return Promise.reject(new Error("카메라를 쓸 수 없는 브라우저예요."));
    return navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 }, audio: false }).then(function (s) { video.srcObject = s; video.muted = true; video.playsInline = true; return video.play().then(function () { return s; }); }); }
  function rec(sec) { if (!navigator.mediaDevices || !window.MediaRecorder) return Promise.reject(new Error("마이크를 쓸 수 없는 브라우저예요."));
    return navigator.mediaDevices.getUserMedia({ audio: true }).then(function (s) { return new Promise(function (ok) { var r = new MediaRecorder(s), ch = []; r.ondataavailable = function (e) { ch.push(e.data); };
      r.onstop = function () { s.getTracks().forEach(function (t) { t.stop(); }); ok(new Blob(ch, { type: r.mimeType })); }; r.start(); setTimeout(function () { r.stop(); }, (sec || 2) * 1000); }); }); }
  function say(t, lang) { if (!window.speechSynthesis) return; try { speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(t); u.lang = lang || "ko-KR"; speechSynthesis.speak(u); } catch (e) {} }
  var css = ".ai-bar{display:grid;grid-template-columns:96px 1fr 52px;gap:6px;align-items:center;font-size:13px;font-weight:700;margin:3px 0}.ai-bar div{background:#eef1f4;border-radius:8px;height:16px;overflow:hidden}.ai-bar i{display:block;height:100%;border-radius:8px;transition:width .3s}.ai-bar b{text-align:right}" +
    ".ai-grid{display:flex;flex-wrap:wrap;gap:6px}.ai-th{position:relative;width:84px;cursor:pointer;border-radius:8px;overflow:hidden;border:3px solid transparent;background:#fff}.ai-th img{width:100%;display:block;aspect-ratio:4/3;object-fit:cover}.ai-th span{position:absolute;left:0;right:0;bottom:0;background:rgba(0,0,0,.55);color:#fff;font:700 10.5px sans-serif;text-align:center;padding:1px}" +
    ".ai-th.ok{border-color:#2fb34a}.ai-th.bad{border-color:#e53935}.ai-th.sel{border-color:#ff9a3c}.ai-cls{border:1px solid #dde3e8;border-radius:12px;padding:8px;margin:6px 0;background:#fbfcfd}.ai-cls h5{margin:0 0 6px;font-size:13.5px}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
  // ── 데이터 수집 → 학습 → 평가 실험실(이미지/소리 공통) ──
  // lab(host, {kind:"img"|"snd", task, base, add:true(카메라/마이크로 추가), noise:true(잘못된 레이블 섞기), onTrain, onEval})
  function lab(host, o) {
    var set = (o.kind === "img" ? D.img : D.snd)[o.task], cls = Object.keys(set), base = o.base || "data/", st = { model: null, acc: null, trained: false, evals: 0, added: 0, noise: false, cls: cls };
    var items = []; cls.forEach(function (c) { set[c]["훈련"].forEach(function (f) { items.push({ c: c, f: f, src: base + (o.kind === "img" ? "img/" : "snd/") + f, on: true, split: "t" }); });
      (set[c]["테스트"] || []).forEach(function (f) { items.push({ c: c, f: f, src: base + (o.kind === "img" ? "img/" : "snd/") + f, split: "s" }); }); });
    var cache = {}; function feat(it) { if (cache[it.src]) return Promise.resolve(cache[it.src]); var p = o.kind === "img" ? (it.el ? Promise.resolve(it.el) : AI.load(it.src)).then(imgFeat) : sndFeat(it.blob || it.src); return p.then(function (f) { cache[it.src] = f; return f; }); }
    var uid = "L" + Math.random().toString(36).slice(2, 7);
    function thumb(it, i) { var lab2 = it.split === "s" ? (it.pred ? (it.pred === it.c ? "✔ " : "✘ ") + it.pred : it.c) : it.c;
      var cl = "ai-th" + (it.split === "s" && it.pred ? (it.pred === it.c ? " ok" : " bad") : "") + (it.split === "t" && !it.on ? " off" : "");
      return o.kind === "img" ? '<div class="' + cl + '" data-i="' + i + '" style="' + (it.split === "t" && !it.on ? "opacity:.3" : "") + '"><img src="' + it.src + '" alt="' + it.c + '" loading="lazy"><span>' + lab2 + "</span></div>"
        : '<div class="' + cl + '" data-i="' + i + '" style="width:auto;padding:4px 8px;font:700 12px sans-serif;' + (it.split === "t" && !it.on ? "opacity:.35" : "") + '">▶ ' + (it.split === "s" ? it.c + " 테스트" : "훈련") + " " + (it.f.match(/\d+(?=\.)/) || [""])[0] + (it.split === "s" && it.pred ? " → " + lab2 : "") + "</div>"; }
    function draw() {
      var h = '<div class="ai-lab-train"><b style="font-size:13.5px">① 훈련 데이터</b> <small>(눌러서 ' + (o.kind === "img" ? "넣기/빼기" : "듣기 · 길게 누르면 넣기/빼기") + ")</small>";
      cls.forEach(function (c, ci) { var n = items.filter(function (it) { return it.c === c && it.split === "t" && it.on; }).length;
        h += '<div class="ai-cls"><h5><span style="color:' + PAL[ci] + '">■</span> ' + c + " <small>(" + n + "개)</small>" + (o.add ? ' <button type="button" class="btn small" data-add="' + ci + '">' + (o.kind === "img" ? "📷 카메라로 추가" : "🎤 2초 녹음 추가") + "</button>" : "") + '</h5><div class="ai-grid">' +
          items.map(function (it, i) { return it.c === c && it.split === "t" ? thumb(it, i) : ""; }).join("") + "</div></div>"; });
      h += '</div><div class="btn-row">' + (o.noise ? '<label style="font-size:12.5px;font-weight:700"><input type="checkbox" class="ai-noise"' + (st.noise ? " checked" : "") + "> 🐞 레이블이 잘못된 데이터 섞기(30 %)</label>" : "") +
        '<button type="button" class="btn small main ai-train">🧠 ② 모델 학습하기</button><button type="button" class="btn small ai-eval">🧪 ③ 테스트 데이터로 평가</button></div><div class="tip-box ai-msg">' + (st.msg || "훈련 데이터를 확인하고 모델을 학습시켜 보세요.") + "</div>" +
        '<b style="font-size:13.5px">③ 테스트 데이터</b> <small>(눌러서 하나씩 확인)</small><div class="ai-grid" style="margin:6px 0">' + items.map(function (it, i) { return it.split === "s" ? thumb(it, i) : ""; }).join("") + '</div><div class="ai-one"></div>';
      host.innerHTML = h; bind(); }
    function msg(t) { st.msg = t; var m = host.querySelector(".ai-msg"); if (m) m.innerHTML = t; }
    var audio = new Audio();
    function bind() {
      host.querySelectorAll(".ai-lab-train [data-i]").forEach(function (el) { var it = items[+el.dataset.i], t = null;
        if (o.kind === "img") el.addEventListener("click", function () { it.on = !it.on; st.model = null; draw(); });
        else { el.addEventListener("pointerdown", function () { t = setTimeout(function () { t = "long"; it.on = !it.on; st.model = null; draw(); }, 600); }); el.addEventListener("pointerup", function () { if (t !== "long") { clearTimeout(t); audio.src = it.blob ? URL.createObjectURL(it.blob) : it.src; audio.play().catch(function () {}); } }); } });
      host.querySelectorAll(".ai-grid:not(.ai-lab-train) [data-i]").forEach(function (el) { var it = items[+el.dataset.i]; if (it.split !== "s") return; el.addEventListener("click", function () { if (o.kind === "snd") { audio.src = it.src; audio.play().catch(function () {}); } one(it); }); });
      var nz = host.querySelector(".ai-noise"); if (nz) nz.addEventListener("change", function () { st.noise = nz.checked; st.model = null; });
      host.querySelector(".ai-train").addEventListener("click", train); host.querySelector(".ai-eval").addEventListener("click", evaluate);
      host.querySelectorAll("[data-add]").forEach(function (b) { b.addEventListener("click", function () { addLive(cls[+b.dataset.add]); }); });
    }
    function train() { var tr = items.filter(function (it) { return it.split === "t" && it.on; }); if (!tr.length) return msg("훈련 데이터가 하나도 없어요!");
      msg("⏳ 학습하는 중…"); var m = new Knn(), k = 0;
      return Promise.all(tr.map(feat)).then(function (fs) { fs.forEach(function (f, i) { var lb = tr[i].c; if (st.noise && (i * 7) % 10 < 3) lb = cls[(cls.indexOf(lb) + 1) % cls.length]; m.add(f, lb, tr[i]); });
        st.model = m; st.trained = true; items.forEach(function (it) { if (it.split === "s") it.pred = null; }); draw();
        var cnt = cls.map(function (c) { return c + " " + m.count(c) + "개"; }).join(", ");
        msg("✅ 학습 완료! " + cnt + (st.noise ? " (레이블이 잘못된 데이터가 섞여 있어요)" : "") + " — 이제 테스트 데이터로 평가해 보세요."); o.onTrain && o.onTrain(st); }); }
    function evaluate() { var p = st.model ? Promise.resolve() : train(); return p.then(function () { if (!st.model) return; var te = items.filter(function (it) { return it.split === "s"; });
      return Promise.all(te.map(feat)).then(function (fs) { var ok = 0; fs.forEach(function (f, i) { te[i].pred = st.model.predict(f, o.k || 1).label; if (te[i].pred === te[i].c) ok++; });
        st.acc = Math.round(ok / te.length * 100); st.evals++; draw(); msg("🧪 테스트 데이터 " + te.length + "개 중 <b>" + ok + "</b>개를 맞혔어요. 정확도 = " + ok + " ÷ " + te.length + " × 100 = <b>" + st.acc + " %</b>" + (st.acc < 100 ? " — 틀린 데이터(빨간 테두리)를 눌러 확인해 보세요." : "")); o.onEval && o.onEval(st); }); }); }
    function one(it) { var box = host.querySelector(".ai-one"); if (!st.model) { box.innerHTML = '<div class="tip-box">먼저 모델을 학습시키세요.</div>'; return; }
      feat(it).then(function (f) { var r = st.model.predict(f, o.k || 1); box.innerHTML = '<div class="fig-row" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr));align-items:center;margin-top:6px"><div><b>실제: ' + it.c + " → 예측: " + r.label + "</b>" + (r.label === it.c ? " ✅" : " ❌") + '<div class="ai-bars"></div></div><div style="font-size:12.5px">가장 비슷한 훈련 데이터(' + r.near.label + ", 유사도 " + r.near.sim.toFixed(2) + ")" + (o.kind === "img" ? '<br><img src="' + (r.near.meta.el ? r.near.meta.el.toDataURL() : r.near.meta.src) + '" style="width:120px;border-radius:8px">' : "") + "</div></div>";
        bars(box.querySelector(".ai-bars"), r.conf, cls); o.onOne && o.onOne(it, r); }); }
    var vid = null;
    function addLive(c) {
      if (o.kind === "img") { var go = function () { var cnv = document.createElement("canvas"); cnv.width = 240; cnv.height = 180; cnv.getContext("2d").drawImage(vid, 0, 0, 240, 180); var src = "cam" + (st.added++);
          var it = { c: c, f: src, src: src, el: cnv, on: true, split: "t" }; cache[src] = imgFeat(cnv); it.src = cnv.toDataURL("image/jpeg", .7); cache[it.src] = cache[src]; items.push(it); st.model = null; draw(); msg("📷 ‘" + c + "’ 클래스에 카메라 사진을 추가했어요. 다시 학습하세요."); };
        if (vid) return go(); vid = document.createElement("video"); vid.style.cssText = "width:200px;border-radius:10px;display:block;margin:6px auto"; host.parentNode.insertBefore(vid, host);
        cam(vid).then(function () { setTimeout(go, 500); }).catch(function (e) { msg("카메라를 켤 수 없어요: " + e.message); }); }
      else { msg("🎤 2초 동안 녹음 중…(‘" + c + "’)"); rec(2).then(function (b) { var src = "mic" + (st.added++) + ".webm"; items.push({ c: c, f: src, src: src, blob: b, on: true, split: "t" }); st.model = null; draw(); msg("🎤 ‘" + c + "’ 클래스에 녹음을 추가했어요. 다시 학습하세요."); }).catch(function (e) { msg("마이크를 켤 수 없어요: " + e.message); }); }
    }
    st.predictSrc = function (src) { return (o.kind === "img" ? AI.load(src).then(imgFeat) : sndFeat(src)).then(function (f) { return st.model ? st.model.predict(f, o.k || 1) : null; }); };
    st.predictFeat = function (f) { return st.model ? st.model.predict(f, o.k || 1) : null; };
    st.train = train; st.evaluate = evaluate; st.items = items; st.redraw = draw; draw(); return st;
  }
  window.AI = { lab: lab, imgFeat: imgFeat, sndFeat: sndFeat, Knn: Knn, NB: NB, tok: tok, bars: bars, cam: cam, rec: rec, say: say, PAL: PAL, D: D,
    load: function (src) { return new Promise(function (ok, no) { var im = new Image(); im.onload = function () { ok(im); }; im.onerror = no; im.src = src; }); } };
})();
