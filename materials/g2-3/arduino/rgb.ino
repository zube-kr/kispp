// KISPP 과학실 · 중2 Ⅲ. 빛과 파동 · RGB LED로 빛의 합성
// 웹 페이지에서 "R,G,B" (각 0~255) 한 줄을 받으면 RGB LED의 밝기를 바꿈 (9600 baud)
// 연결(공통 음극 RGB LED 모듈): R→9번, G→10번, B→11번, -(GND)→GND
//   부품만 있는 RGB LED라면 각 다리에 220 Ω 저항을 꼭 연결해요.
//   공통 양극(+) LED라면 아래 COMMON_ANODE를 true로 바꾸고 공통 다리를 5V에 연결해요.
const bool COMMON_ANODE = false;
const int PR = 9, PG = 10, PB = 11;

void setLed(int r, int g, int b) {
  if (COMMON_ANODE) { r = 255 - r; g = 255 - g; b = 255 - b; }
  analogWrite(PR, r); analogWrite(PG, g); analogWrite(PB, b);
}

void setup() {
  Serial.begin(9600);
  pinMode(PR, OUTPUT); pinMode(PG, OUTPUT); pinMode(PB, OUTPUT);
  setLed(0, 0, 0);
  Serial.println("ready");
}

void loop() {
  if (Serial.available()) {
    int r = Serial.parseInt(), g = Serial.parseInt(), b = Serial.parseInt();
    while (Serial.available() && Serial.read() != '\n') {}  // 줄 끝까지 버림
    r = constrain(r, 0, 255); g = constrain(g, 0, 255); b = constrain(b, 0, 255);
    setLed(r, g, b);
    Serial.print(r); Serial.print(','); Serial.print(g); Serial.print(','); Serial.println(b);
  }
}
