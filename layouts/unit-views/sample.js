// 단원 화면 구성 샘플 공용 데이터: 중2 Ⅵ. 동물과 에너지 (실제 자료)
const PARTS = {
  concept: { name: "개념정리", icon: "📘", color: "#2f7de1" },
  lab:     { name: "탐구실험", icon: "🧪", color: "#5cb531" },
  sim:     { name: "시뮬레이션", icon: "🕹️", color: "#8a5bd6" },
  quiz:    { name: "형성평가", icon: "✏️", color: "#e0662c" }
};
const SHEET = "../../materials/g2-6/";
// kind: sheet(우리 활동지, 구간 보기 가능) / external(다른 사이트 자료)
const ITEMS = [
  { no: 1, kind: "external", title: "영양소와 균형 잡힌 식단",
    desc: "영양소의 종류와 기능, 균형 잡힌 식단을 알아보는 WebGL 학습 콘텐츠",
    url: "https://e.tsherpa.co.kr/webdata/multimedia/eduvr/webgl_03/index.html",
    parts: [{ p: "concept", t: "영양소의 종류와 기능" }] },
  { no: 2, kind: "external", title: "음식물의 소화 과정",
    desc: "음식물이 소화 기관을 지나며 분해되는 과정을 보는 WebGL 콘텐츠",
    url: "https://e.tsherpa.co.kr/webdata/multimedia/eduvr/webgl_04/index.html",
    parts: [{ p: "sim", t: "소화 과정 3D 따라가기" }] },
  { no: 3, kind: "external", title: "영양소 검출 가상실험",
    desc: "음식물 속 녹말·당분·단백질·지방을 시약으로 검출해 보는 가상실험",
    url: "https://sciencej1.cafe24.com/html5/IdentifyingNutrients/IdentifyingNutrients.html",
    parts: [{ p: "lab", t: "시약으로 영양소 검출하기" }] },
  { no: 4, kind: "sheet", title: "영양소 검출 실험보고서",
    desc: "가상실험 결과를 시약별로 정리하고 워크시트를 풀어 보는 자동 채점 실험보고서",
    url: SHEET + "yeongyangso-geomchul.html",
    parts: [{ p: "concept", t: "실험 개요" }, { p: "lab", t: "반응 결과 확인하기" },
            { p: "concept", t: "실험 결과 정리표" }, { p: "quiz", t: "스스로 확인 · 제출" }] },
  { no: 5, kind: "sheet", title: "소화 기관 해부 모형 만들기",
    desc: "소화 기관 조각을 몸 그림에 배치하고 특징을 정리하는 자동 채점 활동",
    url: SHEET + "sohwagye-model.html",
    parts: [{ p: "sim", t: "소화 기관 조각 붙이기" }, { p: "concept", t: "소화 기관의 특징" },
            { p: "quiz", t: "스스로 점검 · 제출" }] }
];
// 활동지는 ?part= 로 그 구간만, 외부 자료는 그대로 새 창
const partUrl = (it, p) => it.kind === "sheet" ? `${it.url}?part=${p}` : it.url;
const target = it => it.kind === "external" ? ' target="_blank" rel="noopener"' : "";
const countOf = p => ITEMS.filter(it => it.parts.some(x => x.p === p)).length;

function unitHeader(buttonsHtml) {
  return `
  <div class="crumb">홈 › 중학교 2학년 › Ⅵ. 동물과 에너지</div>
  <div class="top">
    <div class="cover"><small>중학교 · 2022 개정</small><strong>과학 2</strong><small>KISPP SCIENCE</small></div>
    <div class="info">
      <span class="pill">Ⅵ단원 · 생명</span>
      <h2>동물과 에너지</h2>
      <p>소화, 순환, 호흡, 배설 기관이 함께 작용하여 에너지를 얻는 과정을 탐구합니다.</p>
      ${buttonsHtml || ""}
    </div>
  </div>`;
}
