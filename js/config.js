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
    "중1": "https://script.google.com/macros/s/AKfycby7g0MJdkO7jS9Evxtnm9pFwoZxd4u0FUwUucr4zaSGn3HnSAr79ULPaR0fmT_3ngMlAg/exec",
    "중2": "https://script.google.com/macros/s/AKfycbx2LkRzkVNrprzErKFYLUvSbjQqkS1xLrHV02YcbcBGNqdwb7uQ4mWDtkf4wh0yfa0E1Q/exec",
    "중3": "https://script.google.com/macros/s/AKfycbytWKer-u6zdAhkOtb8iiY6OyEmv0L5qxT_1zI0kjs7-J48wO4TBh_M3yHk394s5ZUR1A/exec",
    "고1": "https://script.google.com/macros/s/AKfycbzxO5sDWe-V4NWVgdAth1-rYes1XBUsUCgsn-PKXLjh5RkaCJgEHXz8KK44_woGb7JN/exec",
    // 중학교 정보 전용 스프레드시트('프놈펜_중_정보', apps-script/code-info.gs)의 웹 앱 주소.
    // 넣으면 정보 답안이 이 시트의 중1·중2·중3 탭으로 갑니다. 비어 있으면 학생 학년 시트의 '정보' 탭으로 갑니다.
    "정보": ""
  }
  // 둘 다 비어 있으면 화면에서 채점만 되고 스프레드시트로는 전송되지 않습니다.
};

// 워크시트가 어느 학년 것인지 주소(materials/g2-8/...)로 알아내서,
// 그 학년 주소를 고르고 뒤에 ?tab=중2 처럼 붙여 학년 탭에 저장되게 합니다.
(function (c) {
  var TABS = { g1: "중1", g2: "중2", g3: "중3", is1: "고1", is2: "고1", se1: "고1", se2: "고1" };
  var m = location.pathname.match(/\/materials\/([a-z]+\d)-/);
  // 정보 워크시트(materials/in1-…): SUBMIT_URLS["정보"]가 있으면 그 시트의 중N 탭(?tab=중2)으로,
  // 없으면 학생이 적은 학년의 중N 시트의 '정보' 탭(?tab=정보)으로 보냅니다.
  // 학년 칸이 비었거나 1~3이 아니면 주소가 비어 있어 전송하지 않습니다(다른 시트로 새지 않게).
  if (m && m[1] === "in1") {
    var urls = c.SUBMIT_URLS || {};
    c.GRADE_TAB = "정보";
    Object.defineProperty(c, "SUBMIT_URL", { configurable: true, enumerable: true, get: function () {
      var el = document.getElementById("ws-grade");
      var g = el ? String(el.value).replace(/[^0-9]/g, "") : "";
      if (!/^[123]$/.test(g)) return "";
      var own = urls["정보"] || "", base = own || urls["중" + g] || "", tab = own ? "중" + g : "정보";
      return base ? base + (base.indexOf("?") < 0 ? "?" : "&") + "tab=" + encodeURIComponent(tab) : "";
    } });
    return;
  }
  var tab = (m && TABS[m[1]]) || "기타";
  var base = (c.SUBMIT_URLS && c.SUBMIT_URLS[tab]) || c.SUBMIT_URL || "";
  c.GRADE_TAB = tab;
  c.SUBMIT_URL = base ? base + (base.indexOf("?") < 0 ? "?" : "&") + "tab=" + encodeURIComponent(tab) : "";
})(window.KISPP_CONFIG);
