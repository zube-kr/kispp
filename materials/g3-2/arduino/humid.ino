/*
  KISPP 중3 Ⅱ. 기권과 날씨 — 기온과 상대 습도 측정기 (DHT11 온습도 센서)
  DHT11 온습도 센서   VCC(+) -> 5V,  DATA(S) -> 2,  GND(-) -> GND
  필요한 라이브러리: 아두이노 IDE [라이브러리 관리]에서 "DHT sensor library"(Adafruit) 설치
  약 2초마다 "시간(ms),온도(℃),상대 습도(%)" 형식으로 시리얼 출력 (보드레이트 9600)
*/
#include <DHT.h>
#define DHTPIN 2
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
}

void loop() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  if (!isnan(h) && !isnan(t)) {
    Serial.print(millis()); Serial.print(",");
    Serial.print(t, 1);     Serial.print(",");
    Serial.println(h, 0);
  }
  delay(2000);  // DHT11은 2초에 한 번 정도만 읽을 수 있어요
}
