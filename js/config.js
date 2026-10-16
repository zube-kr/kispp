// KISPP 과학실 공통 설정
window.KISPP_CONFIG = {
  // ▣ 학생 워크시트 답안을 받을 구글 Apps Script 웹 앱 주소 (설치 방법: apps-script/code.gs 맨 위 설명)
  //
  // 스프레드시트 하나에 '중1·중2·중3·고1' 탭을 만들었다면 → SUBMIT_URL 한 칸에만 주소를 넣으세요.
  SUBMIT_URL: "",
  //
  // 학년마다 스프레드시트를 따로 만들었다면 → 아래 학년 칸에 각 시트의 주소를 넣으세요.
  // (학년 칸이 비어 있으면 위의 SUBMIT_URL을 씁니다.)
  SUBMIT_URLS: {
    "중1": "",
    "중2": "",
    "중3": "",
    "고1": ""
  }
  // 둘 다 비어 있으면 화면에서 채점만 되고 스프레드시트로는 전송되지 않습니다.
};

// 워크시트가 어느 학년 것인지 주소(materials/g2-8/...)로 알아내서,
// 그 학년 주소를 고르고 뒤에 ?tab=중2 처럼 붙여 학년 탭에 저장되게 합니다.
(function (c) {
  var TABS = { g1: "중1", g2: "중2", g3: "중3", is1: "고1", is2: "고1", se1: "고1", se2: "고1" };
  var m = location.pathname.match(/\/materials\/([a-z]+\d)-/);
  var tab = (m && TABS[m[1]]) || "기타";
  var base = (c.SUBMIT_URLS && c.SUBMIT_URLS[tab]) || c.SUBMIT_URL || "";
  c.GRADE_TAB = tab;
  c.SUBMIT_URL = base ? base + (base.indexOf("?") < 0 ? "?" : "&") + "tab=" + encodeURIComponent(tab) : "";
})(window.KISPP_CONFIG);
