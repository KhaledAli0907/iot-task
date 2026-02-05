#include "config.h"
#include "wifi_manager.h"
#include "sensor.h"
#include "http_client.h"

unsigned long lastSent = 0;

void setup() {
    Serial.begin(115200);
    connectToWifi();
  }
  
  void loop() {
    if (millis() - lastSent >= SEND_INTERVAL) {
      lastSent = millis();
      float value = readSensor();
      sendReading(value);
    }
}