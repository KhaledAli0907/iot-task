# IoT Task

An end-to-end IoT demo: a simulated ESP32 device sends sensor readings to a NestJS API, and a Flutter web app displays the latest reading with auto-refresh.

## Live Links

| Component            | Link |
|----------------------|------|
| **Wokwi simulation** | [https://wokwi.com/projects/455214744835499009](https://wokwi.com/projects/455214744835499009) |
| **Backend API**      | [https://iot-task-production.up.railway.app/readings](https://iot-task-production.up.railway.app/readings) |
| **Flutter web app**  | [https://flutter.appwrite.network/](https://flutter.appwrite.network/) |
| **Postman collection** | [backend/postman_collection.json](backend/postman_collection.json) — import into [Postman](https://www.postman.com/) or [Bruno](https://www.usebruno.com/) to call the API |

---

## Architecture

```
┌─────────────────────┐     POST /readings      ┌─────────────────────┐     GET /readings/latest     ┌─────────────────────┐
│  Wokwi (ESP32 sim)  │ ──────────────────────► │  NestJS backend     │ ◄────────────────────────── │  Flutter web app    │
│  Simulated sensor   │     JSON: sensor, value │  Railway            │      (polling)              │  Appwrite / hosted   │
│  Sends every 5s     │                         │  SQLite (TypeORM)   │                            │  Shows latest reading│
└─────────────────────┘                         └─────────────────────┘                            └─────────────────────┘
```

- **Wokwi**: ESP32 firmware runs in the browser; connects to Wokwi-GUEST WiFi and POSTs `{ "sensor": "temperature", "value": 25.5 }` to the backend every 5 seconds. Green/red LEDs indicate WiFi and status.
- **Backend**: NestJS REST API stores readings in SQLite, exposes paginated list and “latest” endpoints. Deployed on Railway with CORS enabled for the Flutter app.
- **Flutter app**: Fetches the latest reading from the API, shows it in a card, and polls every 10 seconds. Built for web and pointed at the production API.

---

## Tech Stack

| Part      | Technologies |
|----------|--------------|
| **Device** | ESP32 (simulated in [Wokwi](https://wokwi.com)), Arduino-style C++, WiFiClientSecure, HTTPClient |
| **Backend** | [NestJS](https://nestjs.com) 11, [TypeORM](https://typeorm.io), SQLite, class-validator, dotenv |
| **Frontend** | [Flutter](https://flutter.dev) (web), http, flutter_dotenv, intl |
| **Hosting** | Backend: [Railway](https://railway.app); Flutter web: Appwrite / custom hosting |

---

## Project Structure

```
iot-task/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── main.ts          # Bootstrap, CORS, ValidationPipe
│   │   ├── app.module.ts
│   │   ├── database/        # TypeORM SQLite config
│   │   └── readings/        # Readings CRUD, pagination, DTOs
│   └── package.json
├── flutter_app/             # Flutter web app
│   ├── lib/
│   │   ├── main.dart        # App entry, polling
│   │   ├── services/        # API service
│   │   ├── models/          # Reading model
│   │   └── widgets/         # ReadingCard, etc.
│   ├── .env                 # API_BASE_URL
│   └── pubspec.yaml
├── wokwi/                    # ESP32 simulator project
│   ├── src/
│   │   ├── sketch.ino       # setup/loop, calls sendReading()
│   │   ├── config.h         # WIFI_SSID, API_URL, SEND_INTERVAL, LED pins
│   │   ├── http_client.h    # HTTPS POST to backend
│   │   ├── sensor.h         # readSensor() (e.g. random 20–30)
│   │   ├── wifi_manager.h   # connectToWifi(), LED feedback
│   │   └── helpers.h        # blinkLed()
│   └── diagram.json         # Circuit (ESP32 board, etc.)
└── README.md                 # This file
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (for backend)
- **Flutter** SDK (for `flutter_app`)
- **Wokwi**: use the [live simulation](https://wokwi.com/projects/455214744835499009) or open the `wokwi/` project in [Wokwi for VS Code](https://docs.wokwi.com/vscode/getting-started) or on the website

### Backend (local)

```bash
cd backend
npm install
cp .env.example .env   # if present; set PORT if needed
npm run start:dev
```

API base: `http://localhost:3000`. SQLite DB is created automatically in `backend/`.

### Flutter app (local)

```bash
cd flutter_app
flutter pub get
# Set API in .env, e.g. API_BASE_URL=http://localhost:3000
flutter run -d chrome
```

For production, set `API_BASE_URL=https://iot-task-production.up.railway.app` in `.env` (or your deployed backend URL).

### Wokwi (simulation)

1. Open [https://wokwi.com/projects/455214744835499009](https://wokwi.com/projects/455214744835499009) to run the shared project, or  
2. Clone this repo and open the `wokwi/` folder in [Wokwi for VS Code](https://docs.wokwi.com/vscode/getting-started); run the simulation from the editor.

Ensure `config.h` (or the project’s API URL) points to your backend (e.g. `https://iot-task-production.up.railway.app/readings` for production).

---

## API Reference

Base URL (production): **https://iot-task-production.up.railway.app**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/readings` | Create a reading. Body: `{ "sensor": "string", "value": number }`. Validation: `sensor` string, `value` number. |
| `GET`  | `/readings/latest` | Get the most recent reading (single object or `null`). |
| `GET`  | `/readings` | List readings with pagination. Query: `?page=1&limit=10` (defaults: page 1, limit 10, max limit 100). Response: `{ items, total, page, limit, totalPages }`. |
| `GET`  | `/readings/sensor/:sensor` | List readings for a given sensor name. |

Example – create a reading:

```bash
curl -X POST https://iot-task-production.up.railway.app/readings \
  -H "Content-Type: application/json" \
  -d '{"sensor":"temperature","value":25.5}'
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 3000). Railway sets this automatically. |

### Flutter app (`flutter_app/.env`)

| Variable | Description |
|----------|-------------|
| `API_BASE_URL` | Backend base URL (e.g. `https://iot-task-production.up.railway.app` for production, `http://localhost:3000` for local). |

### Wokwi (`wokwi/src/config.h`)

| Define | Description |
|--------|-------------|
| `WIFI_SSID` / `WIFI_PASS` | WiFi credentials (use `Wokwi-GUEST` / empty for Wokwi sim). |
| `API_URL` | Full URL for POST (e.g. `https://iot-task-production.up.railway.app/readings`). |
| `SEND_INTERVAL` | Milliseconds between sends (e.g. 5000). |
| `LED_GREEN` / `LED_RED` | GPIO pins for status LEDs (e.g. 26, 27). |

---

## License

Unlicense / private — see repository or author for terms.
