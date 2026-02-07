#ifndef HTTP_CLIENT_H
#define HTTP_CLIENT_H

#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>

// Local includes
#include "helpers.h"
#include "config.h"

inline void sendReading(float value) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi not connected");
    return;
  }

  static WiFiClientSecure client;
  client.setInsecure();
  client.setTimeout(10000); // 10 seconds

  HTTPClient http;
  http.setTimeout(10000); // 10 seconds
  if (!http.begin(client, API_URL)) {
    Serial.println("HTTP begin failed");
    blinkLed(LED_RED, 500);
    return;
  }

  // Add headers
  http.addHeader("Content-Type", "application/json");
  http.addHeader("ngrok-skip-browser-warning", "true");

  String payload = "{";
  payload += "\"sensor\":\"temperature\",";
  payload += "\"value\":" + String(value);
  payload += "}";

  Serial.println("Sending: " + payload);
  int responseCode = http.POST(payload);
  if (responseCode == HTTP_CODE_CREATED) {
    Serial.println("Success! Response: " + String(responseCode));
    blinkLed(LED_GREEN, 500);
  } else {
    Serial.println("Failed. Response: " + String(responseCode) + " (" + http.errorToString(responseCode) + ")");
    blinkLed(LED_RED, 500);
  }
  http.end();
}

#endif
