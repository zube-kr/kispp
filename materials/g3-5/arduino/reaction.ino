/*
  KISPP 중3 Ⅴ. 자극과 반응 — 반응 시간 측정기 (LED · 버저 · 버튼)
  LED(+220 Ω)      긴 다리 -> 8번,  짧은 다리 -> GND
  능동 부저(버저)   + -> 9번,  - -> GND        (스타터 키트의 '액티브 부저')
  푸시 버튼        한쪽 다리 -> 2번, 대각선 다리 -> GND  (내부 풀업 사용, 저항 필요 없음)
  웹 페이지가 "L"(빛) 또는 "S"(소리) 한 글자를 보내면 1.5~4초 뒤 자극을 주고,
  버튼을 누를 때까지 걸린 시간을 "RT,L,234" 형식으로 보냄 (9600 baud)
  자극 전에 미리 누르면 "EARLY,L" 을 보냄
*/
const int LED = 8, BUZ = 9, BTN = 2;

void setup() {
  Serial.begin(9600);
  pinMode(LED, OUTPUT); pinMode(BUZ, OUTPUT); pinMode(BTN, INPUT_PULLUP);
  randomSeed(analogRead(A0));
  Serial.println("ready");
}

void loop() {
  if (!Serial.available()) return;
  char m = Serial.read();
  if (m != 'L' && m != 'S') return;
  unsigned long wait = random(1500, 4000), t0 = millis();
  while (millis() - t0 < wait) {                 // 기다리는 동안 미리 누르면 반칙
    if (digitalRead(BTN) == LOW) { Serial.print("EARLY,"); Serial.println(m); delay(500); return; }
  }
  if (m == 'L') digitalWrite(LED, HIGH); else digitalWrite(BUZ, HIGH);
  unsigned long s = millis();
  while (digitalRead(BTN) == HIGH) {
    if (millis() - s > 3000) break;              // 3초가 지나면 포기
  }
  unsigned long rt = millis() - s;
  digitalWrite(LED, LOW); digitalWrite(BUZ, LOW);
  Serial.print("RT,"); Serial.print(m); Serial.print(","); Serial.println(rt);
  delay(300);
}
