// 샘플끼리 오가는 상단 띠
(function () {
  const pages = [["a-chips.html", "A. 목록 + 구간 바로가기 (추천)"], ["b-collect.html", "B. 구간 모아보기"], ["c-flow.html", "C. 학습 흐름 카드"]];
  const cur = location.pathname.split("/").pop();
  document.body.insertAdjacentHTML("afterbegin", `<div class="sample-bar"><b>단원 화면 샘플</b>${pages.map(([f, n]) =>
    `<a href="${f}" class="${f === cur ? "on" : ""}">${n}</a>`).join("")}<a href="../../index.html#/g2/6" style="margin-left:auto">지금 사이트 보기 ↗</a></div>`);
})();
