// KISPP 과학실 · 중2 Ⅳ. 물질의 구성 · 수용액의 전기 전도성
// 전극 2개를 수용액에 넣고, 전류가 흐르는 정도(0~1023)를 0.2초마다 보냄 (9600 baud)
// 보내는 형식: 시간(ms),값
// 연결: 전극 A → 7번 핀 / 전극 B → A0, 그리고 A0와 GND 사이에 10 kΩ 저항
//       (13번 LED: 전류가 잘 흐르면 켜짐)
// 측정할 때만 잠깐 전압을 걸어 전극에서 기포(전기 분해)가 덜 생기게 해요.
const int DRIVE = 7, SENSE = A0, LED = 13;

void setup() {
  Serial.begin(9600);
  pinMode(DRIVE, OUTPUT); digitalWrite(DRIVE, LOW);
  pinMode(LED, OUTPUT);
}

void loop() {
  static unsigned long last = 0;
  unsigned long now = millis();
  if (now - last < 200) return;
  last = now;
  long sum = 0;
  digitalWrite(DRIVE, HIGH);
  delay(3);
  for (int i = 0; i < 8; i++) sum += analogRead(SENSE);
  digitalWrite(DRIVE, LOW);
  int v = sum / 8;
  digitalWrite(LED, v > 300 ? HIGH : LOW);
  Serial.print(now); Serial.print(','); Serial.println(v);
}
