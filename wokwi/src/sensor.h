#ifndef SENSOR_H
#define SENSOR_H

#include <Arduino.h>

inline float readSensor() {
    return random(20, 30);
}

#endif