# ESP32 Wokwi Simulation

This simulation represents an ESP32 device sending sensor readings
to a backend API over HTTP.

## Behavior

- Connects to WiFi
- Generates fake temperature readings
- Sends data every 5 seconds via POST request

## API Payload

```json
{
  "sensor": "temperature",
  "value": 25.6
}
```
