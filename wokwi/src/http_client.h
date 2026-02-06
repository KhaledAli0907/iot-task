#ifndef HTTP_CLIENT_H
#define HTTP_CLIENT_H

#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>

#include "config.h"

inline void sendReading(float value) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi not connected");
    return;
  }

  static WiFiClientSecure client;
  client.setInsecure();
  client.setTimeout(20);

  HTTPClient http;
  http.setTimeout(15);
  if (!http.begin(client, API_URL)) {
    Serial.println("HTTP begin failed");
    return;
  }
  http.addHeader("Content-Type", "application/json");
  http.addHeader("ngrok-skip-browser-warning", "true");

  String payload = "{";
  payload += "\"sensor\":\"temperature\",";
  payload += "\"value\":" + String(value);
  payload += "}";

  Serial.println("Sending: " + payload);
  int responseCode = http.POST(payload);
  if (responseCode > 0) {
    Serial.println("Response: " + String(responseCode));
  } else {
    Serial.println("Response: " + String(responseCode) + " (" + http.errorToString(responseCode) + ")");
  }
  http.end();
}

#endif
