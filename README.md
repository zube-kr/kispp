# KISPP 과학실

프놈펜한국국제학교(Korean International School of Phnom Penh) 중학교 과학 수업 홈페이지입니다.
2022 개정 교육과정 중1~중3 과학 단원을 기준으로 구성합니다.

## 구성

| 경로 | 내용 |
|---|---|
| `index.html` | 메인 화면 (왼쪽 학년·단원 사이드바 + 홈/단원 화면) |
| `data/units.js` | 학년·단원 목록과 단원 설명, 영역 색상, 단원별 학습 자료 목록(`materials`) |
| `materials/` | 단원별 학습 자료 페이지 (예: `materials/g2-6/` 중2 Ⅵ. 동물과 에너지) |
| `js/config.js` | 공통 설정. 활동지 답안을 받을 구글 Apps Script 주소(`SUBMIT_URL`) |
| `apps-script/code.gs` | 활동지 답안을 구글 스프레드시트에 저장하는 Apps Script (설치 방법은 파일 맨 위 설명) |
| `layouts/` | 레이아웃 후보 샘플 (A~E), 참고용 |

## 주소 규칙

- `index.html#/g2` → 중학교 2학년 홈
- `index.html#/g2/3` → 중학교 2학년 3단원

## 단원 수정하기

단원 이름이나 설명은 `data/units.js`만 고치면 메인 화면과 샘플에 함께 반영됩니다.

## 학습 자료 추가하기

1. 자료 페이지를 `materials/g학년-단원/` 폴더에 넣습니다.
2. `data/units.js`에서 해당 단원의 `materials` 목록에 항목을 추가합니다.
   - `type`: `content`(학습 콘텐츠), `sim`(가상실험), `sheet`(활동지)
   - 외부 사이트 자료는 `external: true`를 붙이면 새 탭에서 열립니다.

## 활동지 답안 제출 연결하기

활동지는 학생이 제출하면 채점 결과를 구글 스프레드시트로 보냅니다.
`apps-script/code.gs`를 선생님 구글 시트에 설치하고, 발급된 웹 앱 주소를
`js/config.js`의 `SUBMIT_URL`에 넣으면 모든 활동지에 한 번에 적용됩니다.
주소가 비어 있으면 화면에서 채점만 되고 어디로도 전송되지 않습니다.

## 가져온 자료 출처

중2 Ⅵ. 동물과 에너지 활동지 2종은 아화중학교 과학 저장소(`zube-kr/science`)에서 가져왔습니다.
