#include "config.h"
#include "wifi_manager.h"
#include "sensor.h"
#include "http_client.h"

unsigned long lastSent = 0;

void setup() {
    Serial.begin(115200);
    
    // Initialize LEDs
    pinMode(LED_GREEN, OUTPUT);
    pinMode(LED_RED, OUTPUT);
    
    // Turn off LEDs initially
    digitalWrite(LED_GREEN, LOW);
    digitalWrite(LED_RED, LOW);

    // Connect to WiFi
    connectToWifi();
  }

  void loop() {
    if (millis() - lastSent >= SEND_INTERVAL) {
      lastSent = millis();
      float value = readSensor();
      sendReading(value);
    }
}