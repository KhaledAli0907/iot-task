#ifndef HTTP_CLIENT_H
#define HTTP_CLIENT_H

#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>

#include "config.h"

inline void sendReading(float value) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi not connected");
    return;
  }

  HTTPClient http;
  http.begin(API_URL);
  http.addHeader("Content-Type", "application/json");

  String payload = "{";
  payload += "\"sensor\":\"temperature\",";
  payload += "\"value\":" + String(value);
  payload += "}";

  int responseCode = http.POST(payload);

  Serial.println("Sending: " + payload);
  Serial.println("Response: " + String(responseCode));

  http.end();
}

#endif
