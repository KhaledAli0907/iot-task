#ifndef HELPERS_H
#define HELPERS_H

#include <Arduino.h>

inline void blinkLed(int pin, int durationMs) {
    digitalWrite(pin, HIGH);
    delay(durationMs);
    digitalWrite(pin, LOW);
}

#endif