// 2022 개정 교육과정 중학교 과학 단원 데이터 (레이아웃 샘플 공용)
// domain: phy 물리 · chem 화학 · bio 생명 · earth 지구 · int 통합
window.DOMAINS = {
  phy:   { name: "물리", color: "#2f6fed" },
  chem:  { name: "화학", color: "#e0662c" },
  bio:   { name: "생명", color: "#3aa35b" },
  earth: { name: "지구", color: "#8a5bd6" },
  int:   { name: "통합", color: "#d4a017" }
};

window.GRADES = [
  {
    id: "g1", label: "중1", title: "중학교 1학년", color: "#5cb531",
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
    id: "g2", label: "중2", title: "중학교 2학년", color: "#2f7de1",
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
        desc: "소화, 순환, 호흡, 배설 기관이 함께 작용하여 에너지를 얻는 과정을 탐구합니다." },
      { code: "El", title: "전기와 자기", domain: "phy",
        desc: "정전기, 전류·전압·저항의 관계, 전류가 만드는 자기장과 전동기의 원리를 배웁니다." },
      { code: "St", title: "별과 우주", domain: "earth",
        desc: "별의 거리와 밝기, 우리은하와 외부 은하, 우주 탐사의 성과를 알아봅니다." }
    ]
  },
  {
    id: "g3", label: "중3", title: "중학교 3학년", color: "#f08a24",
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
  }
];
