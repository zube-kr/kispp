/**
 * KISPP · 중학교 정보 워크시트 답안 → '프놈펜_중_정보' 스프레드시트 저장용 Apps Script
 * ------------------------------------------------------------------
 * ★ 이 코드는 '프놈펜_중_정보' 스프레드시트에 붙여넣으세요. (과학 학년 시트에는 code-g1~g3.gs를 씁니다)
 *
 * 학생이 정보 워크시트(materials/in1-…)에서 [제출]을 누르면, 학생이 적은 학년에 따라
 * '중1' · '중2' · '중3' 탭에 한 줄씩 쌓입니다. 탭은 첫 제출 때 자동으로 생깁니다.
 *
 *   제출 시각 | 워크시트 | 학년 | 반 | 번호 | 이름 | 점수 | 답안 | 교사 피드백
 *
 * - 학년 탭은 홈페이지가 알려 줍니다(js/config.js가 주소 뒤에 ?tab=중2 처럼 붙여 보냄).
 *   학년 칸이 1·2·3이 아니면 워크시트가 제출을 막으므로 다른 탭으로 새지 않습니다.
 * - 학생 답은 '답안' 칸 하나에 "문항: 답" 형태로 줄을 바꿔 적고, '교사 피드백' 칸은 비워 둡니다.
 *
 * ▣ 설치 방법
 * 1) '프놈펜_중_정보' 스프레드시트를 열고, 확장 프로그램 → Apps Script 를 누릅니다.
 * 2) 원래 있던 코드를 모두 지우고 이 파일 내용을 전부 붙여넣은 뒤 저장(💾)합니다.
 * 3) 오른쪽 위 [배포] → [새 배포] → 톱니바퀴에서 '웹 앱' 선택
 *      - 실행 사용자: 나
 *      - 액세스 권한이 있는 사용자: 모든 사용자
 *    → [배포] → (처음이면) 액세스 승인 → 내 계정 선택 → 허용
 * 4) 나오는 '웹 앱 URL'(https://script.google.com/macros/s/.../exec)을 js/config.js의 SUBMIT_URLS "정보" 칸에 넣습니다.
 * 5) 코드를 고친 뒤에는 배포 → 배포 관리 → (연필) → 버전: 새 버전 → 배포 를 해야 반영됩니다. 주소는 그대로예요.
 *
 * ▣ 잘 되는지 확인: 웹 앱 주소를 브라우저에서 열면 "KISPP 중학교 정보 답안 저장소가 작동 중입니다"가 보여요.
 */

var HEADERS = ["제출 시각", "워크시트", "학년", "반", "번호", "이름", "점수", "답안", "교사 피드백"];
// 답안 칸에 다시 적지 않을 정보
var META_KEYS = ["tab", "worksheet", "grade", "classNum", "number", "name", "score", "total", "점수", "submittedAt"];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000); // 여러 학생이 동시에 제출해도 줄이 섞이지 않게
  try {
    var d = readPayload_(e);
    var sheet = getTab_(d.tab || "기타");
    sheet.appendRow([
      new Date(),
      d.worksheet || "(이름 없음)",
      d.tab && d.tab !== "기타" ? d.tab : (d.grade || ""), // 학년은 탭 이름(중2 등)으로 통일
      d.classNum || "",
      d.number || "",
      d.name || "",
      scoreText_(d),
      answersText_(d),
      ""
    ]);
    return json_({ result: "success" });
  } catch (err) {
    return json_({ result: "error", message: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput("KISPP 중학교 정보 답안 저장소가 작동 중입니다. 학생 답안은 워크시트의 [제출] 버튼으로 보내 주세요.");
}

/**
 * 두 가지 제출 형식을 하나로 맞춥니다.
 * - 폼 형식(아화중 자료): worksheet=시트이름&grade=..&classNum=..&number=..&name=..&score=..&total=..
 * - JSON 형식(경주여중 자료): {"form":"시트이름","stuClass":..,"stuNumber":..,"name":..}
 * 주소 뒤의 ?tab=중2 도 e.parameter로 함께 들어옵니다.
 */
function readPayload_(e) {
  var d = {};
  var p = (e && e.parameter) || {};
  for (var k in p) d[k] = p[k];
  var body = e && e.postData && e.postData.contents;
  if (body && body.charAt(0) === "{") {
    try {
      var j = JSON.parse(body);
      for (var key in j) {
        var v = j[key];
        d[key] = v !== null && typeof v === "object" ? JSON.stringify(v) : v; // 배열·객체는 글자로
      }
    } catch (err) {}
  }
  if (!d.worksheet && d.form) d.worksheet = d.form;
  if (d.stuClass !== undefined && d.classNum === undefined) d.classNum = d.stuClass;
  if (d.stuNumber !== undefined && d.number === undefined) d.number = d.stuNumber;
  delete d.form; delete d.stuClass; delete d.stuNumber;
  return d;
}

// 학년 탭을 찾고, 없으면 만들어 머리글을 씁니다.
function getTab_(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name) || ss.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold").setBackground("#eef8e8");
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(8, 420);              // 답안 칸 넓게
    sheet.getRange("H:H").setWrap(true);
  }
  return sheet;
}

function scoreText_(d) {
  if (d["점수"]) return String(d["점수"]);
  if (d.score !== undefined && d.score !== "") return d.total ? d.score + "/" + d.total : String(d.score);
  return "";
}

function answersText_(d) {
  var lines = [];
  for (var k in d) {
    if (META_KEYS.indexOf(k) >= 0) continue;
    var v = d[k];
    if (v === undefined || v === null || v === "") v = "(빈칸)";
    lines.push(k + ": " + v);
  }
  return lines.join("\n");
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
