#ifndef WIFI_MANAGER_H
#define WIFI_MANAGER_H

#include <Arduino.h>
#include <WiFi.h>
#include "helpers.h"
#include "config.h"

inline void connectToWifi() {
    WiFi.begin(WIFI_SSID, WIFI_PASS);

    Serial.print("Connecting to WiFi...");
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.print(".");
    }
    Serial.println("\nConnected to WiFi");
    // Flash green LED twice on success
    blinkLed(LED_GREEN, 100);
    delay(200);
    blinkLed(LED_GREEN, 100);
}
#endif