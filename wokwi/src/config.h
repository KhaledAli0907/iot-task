#ifndef CONFIG_H
#define CONFIG_H

// WIFI CONFIG
#define WIFI_SSID "Wokwi-GUEST"
#define WIFI_PASS ""

// Backend URL (must include /readings for POST)
#define API_URL "https://iot-task-production.up.railway.app/readings"

// TIMING
#define SEND_INTERVAL 5000

// LED PINs 
#define LED_GREEN 26
#define LED_RED 27

// HTTP STATUS CODES
#define HTTP_CODE_CREATED 201

#endif