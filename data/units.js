// 2022 개정 교육과정 과학 단원 데이터 (중1~중3, 고1 과목)
// GRADES[]: 학년(중학교) 또는 과목(고등학교)
//   id: 주소에 쓰는 이름 (#/g2/6 → id "g2"의 6번째 단원)
//   level: 사이드바에서 묶이는 구분, badge: 사이드바 동그라미 글자, book: 단원 화면 표지 이름
//   units[].group: 대단원 이름 (고등학교 과목처럼 대단원 아래 중단원이 있을 때)
// domain: phy 물리 · chem 화학 · bio 생명 · earth 지구 · int 통합
window.DOMAINS = {
  phy:   { name: "물리", color: "#2f6fed" },
  chem:  { name: "화학", color: "#e0662c" },
  bio:   { name: "생명", color: "#3aa35b" },
  earth: { name: "지구", color: "#8a5bd6" },
  int:   { name: "통합", color: "#d4a017" }
};

// 활동지 안의 구간 종류 (단원 화면의 네 버튼, materials[].parts[].p)
// 활동지 주소에 ?part=concept 처럼 붙이면 그 구간만 열립니다 (js/part-view.js)
window.LESSON_PARTS = {
  concept: { name: "개념정리",   icon: "📘", color: "#2f7de1" },
  lab:     { name: "탐구실험",   icon: "🧪", color: "#5cb531" },
  sim:     { name: "시뮬레이션", icon: "🕹️", color: "#8a5bd6" },
  quiz:    { name: "형성평가",   icon: "✏️", color: "#e0662c" }
};

window.GRADES = [
  {
    id: "g1", level: "중학교", badge: "1", book: "과학 1", label: "중1", title: "중학교 1학년", color: "#5cb531",
    units: [
      { code: "Su", title: "과학과 인류의 지속가능한 삶", domain: "int",
        desc: "과학이 인류 문명과 함께 발전해 온 과정을 살펴보고, 과학기술로 지속가능한 미래를 만드는 방법을 탐색합니다." },
      { code: "Bi", title: "생물의 구성과 다양성", domain: "bio",
        desc: "세포에서 개체까지 생물의 구성 단계와 생물 다양성, 분류 체계, 보전 방법을 배웁니다." },
      { code: "Ht", title: "열", domain: "phy",
        desc: "온도와 입자 운동, 전도·대류·복사에 의한 열의 이동, 비열과 열팽창을 탐구합니다." },
      { code: "Ph", title: "물질의 상태 변화", domain: "chem",
        desc: "입자 운동으로 고체·액체·기체와 상태 변화를 설명하고, 이때 출입하는 열에너지를 이해합니다." },
      { code: "Fo", title: "힘의 작용", domain: "phy",
        desc: "중력, 탄성력, 마찰력, 부력 등 여러 힘을 측정하고 생활 속 힘의 작용을 탐구합니다." },
      { code: "Ga", title: "기체의 성질", domain: "chem",
        desc: "기체의 압력·부피·온도 사이의 관계를 입자 모형으로 설명합니다." },
      { code: "So", title: "태양계", domain: "earth",
        desc: "지구와 달의 크기와 운동, 태양계 행성의 특징과 태양 활동을 탐구합니다." }
    ]
  },
  {
    id: "g2", level: "중학교", badge: "2", book: "과학 2", label: "중2", title: "중학교 2학년", color: "#2f7de1",
    units: [
      { code: "Ma", title: "물질의 특성", domain: "chem",
        desc: "밀도, 용해도, 끓는점, 녹는점 등 물질을 구별하는 특성을 배우고 혼합물을 분리하는 방법을 익힙니다." },
      { code: "Li", title: "지권의 변화", domain: "earth",
        desc: "지구 내부 구조, 광물과 암석, 풍화와 토양, 판의 운동과 지진·화산을 탐구합니다." },
      { code: "Lw", title: "빛과 파동", domain: "phy",
        desc: "빛의 반사와 굴절, 거울과 렌즈의 상, 파동과 소리의 성질을 배웁니다." },
      { code: "At", title: "물질의 구성", domain: "chem",
        desc: "원소와 원자, 분자, 이온을 이해하고 원소 기호와 화학식으로 물질을 표현합니다." },
      { code: "Pl", title: "식물과 에너지", domain: "bio",
        desc: "광합성과 증산 작용, 식물의 호흡을 통해 식물이 에너지를 얻고 쓰는 과정을 배웁니다." },
      { code: "An", title: "동물과 에너지", domain: "bio",
        desc: "소화, 순환, 호흡, 배설 기관이 함께 작용하여 에너지를 얻는 과정을 탐구합니다.",
        // materials: 소단원 자료 목록
        //   url: 우리 활동지는 materials/ 아래 경로, 다른 사이트 자료는 external: true
        //   parts: 자료 안의 구간 { p: 구간 종류, t: 그 구간 제목 } → 색깔 칩으로 표시
        materials: [
          { title: "영양소와 균형 잡힌 식단", external: true,
            desc: "영양소의 종류와 기능, 균형 잡힌 식단을 알아보는 WebGL 학습 콘텐츠입니다.",
            url: "https://e.tsherpa.co.kr/webdata/multimedia/eduvr/webgl_03/index.html",
            parts: [{ p: "concept", t: "영양소의 종류와 기능" }] },
          { title: "음식물의 소화 과정", external: true,
            desc: "음식물이 소화 기관을 지나며 분해되는 과정을 알아보는 WebGL 학습 콘텐츠입니다.",
            url: "https://e.tsherpa.co.kr/webdata/multimedia/eduvr/webgl_04/index.html",
            parts: [{ p: "sim", t: "소화 과정 3D 따라가기" }] },
          { title: "영양소 검출 가상실험", external: true,
            desc: "음식물 속 녹말·당분·단백질·지방을 시약으로 검출해 보는 가상실험입니다.",
            url: "https://sciencej1.cafe24.com/html5/IdentifyingNutrients/IdentifyingNutrients.html",
            parts: [{ p: "lab", t: "시약으로 영양소 검출하기" }] },
          { title: "영양소 검출 실험보고서",
            desc: "가상실험 결과를 시약별로 정리하고 워크시트를 풀어 보는 자동 채점 실험보고서입니다.",
            url: "materials/g2-6/yeongyangso-geomchul.html",
            parts: [{ p: "concept", t: "실험 개요" }, { p: "lab", t: "반응 결과 확인하기" },
                    { p: "concept", t: "실험 결과 정리표" }, { p: "quiz", t: "스스로 확인 · 제출" }] },
          { title: "소화 기관 해부 모형 만들기",
            desc: "소화 기관 조각을 몸 그림의 올바른 위치에 배치하고 특징을 정리하는 자동 채점 활동입니다.",
            url: "materials/g2-6/sohwagye-model.html",
            parts: [{ p: "sim", t: "소화 기관 조각 붙이기" }, { p: "concept", t: "소화 기관의 특징" },
                    { p: "quiz", t: "스스로 점검 · 제출" }] }
        ] },
      { code: "El", title: "전기와 자기", domain: "phy",
        desc: "정전기, 전류·전압·저항의 관계, 전류가 만드는 자기장과 전동기의 원리를 배웁니다." },
      { code: "St", title: "별과 우주", domain: "earth",
        desc: "별의 거리와 밝기, 우리은하와 외부 은하, 우주 탐사의 성과를 알아봅니다.",
        // 경주여자중학교 3학년 Ⅶ. 별과 우주 학습지 목록(zube-kr/gyeongju-girls-3rd)을 그대로 가져옴
        materials: [
          { title: "시차 측정하기",
            desc: "시차를 측정하여 물체까지의 거리와 시차의 관계를 설명하는 라이브 워크시트입니다.",
            url: "materials/g2-8/parallax.html",
            parts: [{ p: "lab", t: "실험하기" }, { p: "lab", t: "정리하기" }, { p: "lab", t: "빨대로 시차 측정하기" },
                    { p: "concept", t: "시차와 거리" }, { p: "quiz", t: "별 X, 별 Y의 연주 시차 비교" }, { p: "quiz", t: "문제 풀이" }] },
          { title: "별의 밝기가 다른 까닭은",
            desc: "빛의 밝기와 거리의 관계, 겉보기 등급과 절대 등급을 시뮬레이션으로 탐구하는 라이브 워크시트입니다.",
            url: "materials/g2-8/brightness.html",
            parts: [{ p: "lab", t: "거리에 따른 빛의 밝기 변화" }, { p: "lab", t: "정리하기" }, { p: "quiz", t: "확인 문제" },
                    { p: "concept", t: "겉보기 등급과 절대 등급" }, { p: "sim", t: "별을 드래그해 거리 바꾸기" }, { p: "quiz", t: "큰개자리 별의 밝기 비교" }] },
          { title: "별의 색이 다른 까닭은",
            desc: "플랑크 복사 법칙과 H-R도 시뮬레이션으로 별의 표면 온도·색·광도의 관계를 탐구하는 라이브 워크시트입니다.",
            url: "materials/g2-8/starcolor.html",
            parts: [{ p: "concept", t: "별의 색과 표면 온도" }, { p: "sim", t: "플랑크 복사 법칙과 별의 색" }, { p: "lab", t: "표면 온도를 색으로 비교하기" },
                    { p: "sim", t: "H-R도" }, { p: "concept", t: "개념정리" }, { p: "quiz", t: "확인 문제" }] },
          { title: "은하수와 우리은하",
            desc: "별의 색·온도 복습과 우리은하 시뮬레이션으로 태양계의 위치를 탐구하는 라이브 워크시트입니다.",
            url: "materials/g2-8/galaxy.html",
            parts: [{ p: "quiz", t: "복습 · 별의 색과 표면 온도" }, { p: "concept", t: "은하수와 우리은하" }, { p: "sim", t: "우리은하 속 태양계의 위치" },
                    { p: "sim", t: "나선팔 3D 시뮬레이션" }, { p: "concept", t: "개념정리 · 우리은하" }, { p: "quiz", t: "확인 문제" }] },
          { title: "성단과 성운 — 세 가지 성운의 차이",
            desc: "구상·산개 성단의 분포, 방출·반사·암흑 성운이 다르게 보이는 까닭, 수소 원자의 전자가 빛을 내는 원리를 시뮬레이션으로 살펴보는 자동 채점 워크시트입니다.",
            url: "materials/g2-8/seongdan-seongun.html",
            parts: [{ p: "concept", t: "성간 물질과 성운" }, { p: "sim", t: "성단은 우리은하의 어디에?" }, { p: "sim", t: "세 가지 성운" },
                    { p: "sim", t: "전자의 들뜸과 빛의 방출" }, { p: "quiz", t: "스스로 점검" }, { p: "quiz", t: "창의적 사고력" }] },
          { title: "팽창하는 우주",
            desc: "고무풍선 가상 실험, 도플러 효과 3D 시뮬레이션, 풍선 우주–허블 법칙 연동 시뮬레이션으로 대폭발 우주론을 탐구하는 자동 채점 워크시트입니다.",
            url: "materials/g2-8/expansion.html",
            parts: [{ p: "concept", t: "팽창하는 우주와 대폭발 우주론" }, { p: "lab", t: "우주 팽창 실험 (고무풍선)" }, { p: "sim", t: "도플러 효과 3D" },
                    { p: "sim", t: "풍선 우주와 허블 법칙" }, { p: "quiz", t: "스스로 점검" }, { p: "quiz", t: "창의적 사고력" }] }
        ] }
    ]
  },
  {
    id: "g3", level: "중학교", badge: "3", book: "과학 3", label: "중3", title: "중학교 3학년", color: "#f08a24",
    units: [
      { code: "Re", title: "화학 반응의 규칙성", domain: "chem",
        desc: "화학 반응식, 질량 보존 법칙, 일정 성분비 법칙, 기체 반응 법칙과 반응의 에너지 출입을 배웁니다." },
      { code: "Wc", title: "날씨와 기후 변화", domain: "earth",
        desc: "기권의 구조, 구름과 강수, 기압과 바람, 기단과 전선을 이해하고 기후 변화를 탐구합니다." },
      { code: "Hy", title: "수권과 해수의 순환", domain: "earth",
        desc: "수권의 분포, 해수의 온도와 염분, 해류와 조석 등 바닷물의 순환을 배웁니다." },
      { code: "Mo", title: "운동과 에너지", domain: "phy",
        desc: "등속 운동과 자유 낙하 운동, 일과 에너지, 역학적 에너지의 전환과 보존을 탐구합니다." },
      { code: "Ne", title: "자극과 반응", domain: "bio",
        desc: "감각 기관과 신경계, 호르몬과 항상성으로 우리 몸이 자극에 반응하는 과정을 배웁니다." },
      { code: "Ge", title: "생식과 유전", domain: "bio",
        desc: "세포 분열과 발생, 멘델의 유전 원리와 사람의 유전을 탐구합니다." },
      { code: "Sa", title: "재해·재난과 안전", domain: "int",
        desc: "자연 재해와 사회 재난의 원인을 과학적으로 이해하고 안전하게 대처하는 방법을 익힙니다." },
      { code: "Fu", title: "과학과 나의 미래", domain: "int",
        desc: "과학기술이 바꿀 미래 사회를 상상하고, 과학과 연결된 나의 진로를 설계합니다." }
    ]
  },

  // ── 고등학교 1학년 ──
  {
    id: "is1", level: "고등학교 1학년", label: "통합과학1", title: "통합과학1", badge: "통1", book: "통합과학1", color: "#14a3a8",
    units: [
      { group: "Ⅰ. 과학의 기초", title: "과학의 기본량", domain: "int",
        desc: "시간과 공간, 길이·질량 등 자연을 기술하는 기본량과 단위, 측정 표준을 배웁니다." },
      { group: "Ⅰ. 과학의 기초", title: "과학의 측정과 우리 사회", domain: "int",
        desc: "측정과 어림, 디지털 정보 변환을 통해 과학적 측정이 우리 사회에 쓰이는 방식을 탐구합니다." },
      { group: "Ⅱ. 물질과 규칙성", title: "자연의 구성 원소", domain: "chem",
        desc: "우주 초기 원소의 생성과 별의 진화, 지구와 생명체를 이루는 원소를 탐구합니다." },
      { group: "Ⅱ. 물질과 규칙성", title: "물질의 규칙성과 성질", domain: "chem",
        desc: "주기율표와 원소의 주기성, 화학 결합과 물질의 성질, 지각과 생명체를 이루는 물질의 규칙성을 배웁니다." },
      { group: "Ⅲ. 시스템과 상호작용", title: "지구시스템", domain: "earth",
        desc: "지권·수권·기권·생물권·외권의 상호작용과 물질 순환, 판 구조 운동을 탐구합니다." },
      { group: "Ⅲ. 시스템과 상호작용", title: "역학 시스템", domain: "phy",
        desc: "중력을 받는 물체의 운동, 운동량과 충격량, 충돌과 안전 장치를 배웁니다." },
      { group: "Ⅲ. 시스템과 상호작용", title: "생명 시스템", domain: "bio",
        desc: "세포의 구조와 기능, 세포막을 통한 물질 출입, 물질대사와 효소, 유전 정보의 흐름을 탐구합니다." }
    ]
  },
  {
    id: "is2", level: "고등학교 1학년", label: "통합과학2", title: "통합과학2", badge: "통2", book: "통합과학2", color: "#0f7ab8",
    units: [
      { group: "Ⅰ. 변화와 다양성", title: "지구 환경 변화와 생물다양성", domain: "bio",
        desc: "지질 시대의 환경 변화와 대멸종, 진화와 생물다양성의 형성 과정을 탐구합니다." },
      { group: "Ⅰ. 변화와 다양성", title: "화학 변화", domain: "chem",
        desc: "산화와 환원, 산과 염기의 중화 반응 등 우리 주변의 화학 변화를 배웁니다." },
      { group: "Ⅱ. 환경과 에너지", title: "생태계와 환경 변화", domain: "bio",
        desc: "생태계 구성 요소와 에너지 흐름, 생태계 평형, 기후 변화와 환경 문제를 탐구합니다." },
      { group: "Ⅱ. 환경과 에너지", title: "에너지 전환과 활용", domain: "phy",
        desc: "태양 에너지와 발전 방식, 에너지 전환과 효율, 신재생 에너지의 활용을 배웁니다." },
      { group: "Ⅲ. 과학과 미래 사회", title: "과학 기술의 활용", domain: "int",
        desc: "감염병, 빅데이터, 인공지능 등 미래 사회의 문제 해결에 과학 기술이 쓰이는 방식을 탐구합니다." },
      { group: "Ⅲ. 과학과 미래 사회", title: "과학 기술의 발전과 쟁점", domain: "int",
        desc: "과학 기술의 발전이 가져온 사회적 쟁점과 과학 윤리, 책임 있는 과학 기술 활용을 생각합니다." }
    ]
  },
  {
    id: "se1", level: "고등학교 1학년", label: "과학탐구실험1", title: "과학탐구실험1", badge: "탐1", book: "과학탐구실험1", color: "#7a4fd0",
    units: [
      { group: "Ⅰ. 과학의 본성과 역사 속의 과학 탐구", title: "갈릴레이의 경사면을 이용한 질량이 다른 물체의 낙하 운동 실험하기", domain: "phy",
        desc: "경사면 실험을 재현하며 질량이 다른 물체의 낙하 운동을 비교하고, 갈릴레이의 탐구 방법을 이해합니다." },
      { group: "Ⅰ. 과학의 본성과 역사 속의 과학 탐구", title: "과학의 단위 및 도량형의 역사 추적하기", domain: "int",
        desc: "길이·질량 단위와 도량형이 표준화되어 온 역사를 조사하고 표준의 필요성을 생각합니다." },
      { group: "Ⅰ. 과학의 본성과 역사 속의 과학 탐구", title: "우리 선조들의 과학 기술 발전 사례 찾기", domain: "int",
        desc: "측우기, 자격루 등 우리 선조들의 과학 기술 사례를 찾아 그 원리와 의의를 탐구합니다." },
      { group: "Ⅰ. 과학의 본성과 역사 속의 과학 탐구", title: "멘델레예프의 주기율표 만들기", domain: "chem",
        desc: "원소 카드를 성질에 따라 배열해 보며 멘델레예프가 주기율표를 만든 과정을 재현합니다." },
      { group: "Ⅰ. 과학의 본성과 역사 속의 과학 탐구", title: "과학사의 동시 발견으로 이룬 과학 발전 추적하기", domain: "int",
        desc: "여러 과학자가 같은 시기에 같은 발견을 한 사례를 조사하며 과학 발전의 특성을 이해합니다." },
      { group: "Ⅱ. 과학 탐구의 과정과 절차", title: "과학사에서 귀납적 탐구 사례 알아보기", domain: "int",
        desc: "관찰 사실을 모아 일반적인 규칙을 이끌어 낸 귀납적 탐구 사례를 분석합니다." },
      { group: "Ⅱ. 과학 탐구의 과정과 절차", title: "파스퇴르의 생물속생설 도출 과정 재연하기", domain: "bio",
        desc: "백조목 플라스크 실험을 재연하며 가설 설정과 변인 통제로 생물속생설을 도출하는 과정을 익힙니다." },
      { group: "Ⅱ. 과학 탐구의 과정과 절차", title: "손전등을 이용하여 뉴턴의 프리즘 실험 구현하기", domain: "phy",
        desc: "손전등과 프리즘으로 빛의 분산을 관찰하며 뉴턴의 실험을 재구성합니다." },
      { group: "Ⅱ. 과학 탐구의 과정과 절차", title: "관측 자료(빅데이터)를 활용하여 한반도의 기후 변화 경향성 파악하기", domain: "earth",
        desc: "기온·강수량 관측 자료를 분석해 한반도 기후 변화의 경향을 그래프로 찾아냅니다." },
      { group: "Ⅱ. 과학 탐구의 과정과 절차", title: "화학 반응을 활용한 과학 마술 시나리오 개발 및 시연하기", domain: "chem",
        desc: "색 변화·기체 발생 등 화학 반응을 이용한 과학 마술을 기획하고 원리를 설명하며 시연합니다." },
      { group: "Ⅱ. 과학 탐구의 과정과 절차", title: "우리 주변에서 천연 항생물질 찾기", domain: "bio",
        desc: "마늘, 양파 등 주변 재료의 항균 효과를 실험으로 비교하며 천연 항생물질을 탐구합니다." }
    ]
  },
  {
    id: "se2", level: "고등학교 1학년", label: "과학탐구실험2", title: "과학탐구실험2", badge: "탐2", book: "과학탐구실험2", color: "#c2417e",
    units: [
      { group: "Ⅰ. 생활 속의 과학 탐구", title: "동결 건조 식품에 적용된 과학 원리 알아보기", domain: "chem",
        desc: "동결 건조 과정의 상태 변화(승화)를 이해하고 식품 보존에 쓰이는 원리를 탐구합니다." },
      { group: "Ⅰ. 생활 속의 과학 탐구", title: "생활 제품 속 과학의 유용성 인식하기", domain: "int",
        desc: "일상 제품에 숨은 과학 원리를 찾아보고 과학이 생활을 편리하게 만드는 방식을 생각합니다." },
      { group: "Ⅰ. 생활 속의 과학 탐구", title: "스마트 기기를 이용하여 놀이공원에서 다양한 운동의 가속도 비교하기", domain: "phy",
        desc: "스마트 기기의 가속도 센서로 놀이기구의 운동을 측정하고 가속도를 비교합니다." },
      { group: "Ⅰ. 생활 속의 과학 탐구", title: "건축물에 적용된 내진 설계의 원리 알아보기", domain: "earth",
        desc: "모형 건물로 진동 실험을 하며 내진·면진 설계가 지진 피해를 줄이는 원리를 탐구합니다." },
      { group: "Ⅰ. 생활 속의 과학 탐구", title: "미디어나 생활에 있는 유사과학을 탐색하고 비평하기", domain: "int",
        desc: "광고와 미디어 속 유사과학 사례를 찾아 과학적 근거를 따져 보고 비평합니다." },
      { group: "Ⅰ. 생활 속의 과학 탐구", title: "주변의 생물을 조사하고 외래종이 생물다양성에 미치는 영향 논증하기", domain: "bio",
        desc: "학교 주변 생물을 조사하고 외래종이 생태계와 생물다양성에 미치는 영향을 근거를 들어 논증합니다." },
      { group: "Ⅰ. 생활 속의 과학 탐구", title: "오염 물질 측정 장치를 활용한 학교 주변 환경 탐구하기", domain: "earth",
        desc: "미세먼지 등 오염 물질 측정 장치로 학교 주변 환경을 측정하고 결과를 분석합니다." },
      { group: "Ⅰ. 생활 속의 과학 탐구", title: "운동 관련 안전사고 예방 장치 고안하기", domain: "phy",
        desc: "충격량과 운동량의 원리를 활용해 운동 중 안전사고를 줄이는 장치를 설계합니다." },
      { group: "Ⅱ. 미래 사회와 첨단 과학 탐구", title: "마이크로컨트롤러를 활용하여 스마트 온실 설계하기", domain: "int",
        desc: "아두이노 등 마이크로컨트롤러와 센서로 온도·습도를 조절하는 스마트 온실을 설계합니다." },
      { group: "Ⅱ. 미래 사회와 첨단 과학 탐구", title: "각종 센서를 활용한 생활 발명품 아이디어 고안 및 시제품 발표하기", domain: "int",
        desc: "센서를 활용한 생활 발명품을 구상하고 시제품을 만들어 발표합니다." },
      { group: "Ⅱ. 미래 사회와 첨단 과학 탐구", title: "우주 개발 사례 조사를 통해 과학 기술의 발전 방향 평가하기", domain: "earth",
        desc: "우주 개발 사례를 조사하고 과학 기술이 나아갈 방향과 사회적 영향을 평가합니다." }
    ]
  }
];
