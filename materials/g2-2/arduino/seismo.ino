// KISPP 과학실 · 중2 Ⅱ. 지권의 변화 · MPU-6050 지진계
// 가속도 센서 MPU-6050(GY-521 모듈)의 가속도를 0.02초마다 보냄
// 보내는 형식: 시간(ms),ax,ay,az   (단위: g, 115200 baud)
// 연결: VCC→5V(또는 3.3V), GND→GND, SCL→A5, SDA→A4
// 라이브러리 없이 Wire(I2C)만 사용해요.
#include <Wire.h>

const int MPU = 0x68;           // AD0 핀이 GND(또는 연결 안 함)일 때 주소
const float LSB_PER_G = 16384.0; // ±2g 범위

void setup() {
  Serial.begin(115200);
  Wire.begin();
  Wire.beginTransmission(MPU);
  Wire.write(0x6B);  // PWR_MGMT_1
  Wire.write(0);     // 잠자기 모드 해제
  Wire.endTransmission(true);
  Wire.beginTransmission(MPU);
  Wire.write(0x1C);  // ACCEL_CONFIG
  Wire.write(0);     // ±2g
  Wire.endTransmission(true);
}

int16_t read16() { return (Wire.read() << 8) | Wire.read(); }

void loop() {
  static unsigned long last = 0;
  unsigned long now = millis();
  if (now - last < 20) return;  // 50번/초
  last = now;
  Wire.beginTransmission(MPU);
  Wire.write(0x3B);  // ACCEL_XOUT_H
  Wire.endTransmission(false);
  Wire.requestFrom(MPU, 6, true);
  if (Wire.available() < 6) return;
  float ax = read16() / LSB_PER_G, ay = read16() / LSB_PER_G, az = read16() / LSB_PER_G;
  Serial.print(now); Serial.print(',');
  Serial.print(ax, 3); Serial.print(',');
  Serial.print(ay, 3); Serial.print(',');
  Serial.println(az, 3);
}
