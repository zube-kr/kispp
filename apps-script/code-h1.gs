/**
 * KISPP 과학실 · 고1 스프레드시트용 Apps Script
 * ------------------------------------------------------------------
 * ★ 이 코드는 '고1' 스프레드시트에 붙여넣으세요. (다른 학년 시트에는 그 학년 파일을 쓰세요)
 *
 * 학생이 고1 워크시트에서 [제출]을 누르면 이 스프레드시트의 '답안' 탭에 한 줄씩 쌓입니다.
 * '답안' 탭은 첫 제출 때 자동으로 생깁니다.
 *
 *   제출 시각 | 워크시트 | 학년 | 반 | 번호 | 이름 | 점수 | 답안 | 교사 피드백
 *
 * ▣ 설치 방법
 * 1) 고1 스프레드시트를 열고, 메뉴에서 확장 프로그램 → Apps Script 를 누릅니다.
 * 2) 원래 있던 코드를 모두 지우고 이 파일 내용을 전부 붙여넣은 뒤 저장(💾)합니다.
 * 3) 오른쪽 위 [배포] → [새 배포] → 톱니바퀴에서 '웹 앱' 선택
 *      - 실행 사용자: 나
 *      - 액세스 권한이 있는 사용자: 모든 사용자
 *    → [배포] → (처음이면) 액세스 승인 → 내 계정 선택 → 허용
 * 4) 나오는 '웹 앱 URL'(https://script.google.com/macros/s/.../exec)을 복사해 두세요.
 *    이 주소를 홈페이지에 연결하면 고1 학생 답안이 이 시트로 들어옵니다.
 */

var GRADE = "고1"; // 이 스프레드시트의 학년

var HEADERS = ["제출 시각", "워크시트", "학년", "반", "번호", "이름", "점수", "답안", "교사 피드백"];
// 답안 칸에 다시 적지 않을 정보
var META_KEYS = ["tab", "worksheet", "grade", "classNum", "number", "name", "score", "total", "점수", "submittedAt"];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000); // 여러 학생이 동시에 제출해도 줄이 섞이지 않게
  try {
    var d = readPayload_(e);
    var sheet = getTab_("답안");
    sheet.appendRow([
      new Date(),
      d.worksheet || "(이름 없음)",
      GRADE,
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
  return ContentService.createTextOutput("KISPP 과학실 " + GRADE + " 답안 저장소가 작동 중입니다. 학생 답안은 워크시트의 [제출] 버튼으로 보내 주세요.");
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

// '답안' 탭을 찾고, 없으면 만들어 머리글을 씁니다.
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
