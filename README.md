# Padho Label 🔬

A React Native mobile app for analysing food and beauty products. Scan a barcode to get instant Nutri-Score ratings, ingredient breakdowns, NOVA classifications, and AI-powered Q&A.

## Features

- **Barcode Scanning** — camera-based barcode lookup via `react-native-vision-camera`
- **Nutrition Analysis** — Nutri-Score (A–E), NOVA classification, ingredient flag detection
- **Ingredients OCR** — capture and parse nutrition labels from photos
- **Pantry Management** — track your personal product inventory
- **AI Chat** — ask questions about any product using Google Gemini
- **Gamification** — points, streaks, challenges, and a community leaderboard
- **Favourites & History** — save and review previously scanned products
- **User Profiles** — Supabase authentication with onboarding flow

## Tech Stack

| Area | Library |
|------|---------|
| Framework | React Native 0.81.5 + Expo ~54 |
| Language | TypeScript 5.9 |
| Navigation | React Navigation 7 (stack + bottom tabs) |
| Backend / Auth | Supabase |
| Camera | react-native-vision-camera 4 |
| AI | Google Gemini API |
| Icons | lucide-react-native |
| Storage | AsyncStorage |
| Testing | Jest + jest-expo |

## Getting Started

### Prerequisites

- Node.js 20+
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Android emulator / iOS simulator **or** a physical device with Expo Go

### 1. Clone & install

```bash
git clone https://github.com/subhamlistingsmanager/padho-label.git
cd padho-label
npm install --legacy-peer-deps
```

### 2. Configure environment variables

Copy the example file and fill in your credentials:

```bash
cp .env.example .env
```

| Variable | Where to get it |
|----------|----------------|
| `EXPO_PUBLIC_GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/) |
| `EXPO_PUBLIC_SUPABASE_URL` | Your Supabase project → Settings → API |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase project → Settings → API |

### 3. Start the development server

```bash
npm start          # Expo dev server (scan QR with Expo Go)
npm run android    # Open on Android emulator
npm run ios        # Open on iOS simulator
```

## Running Tests

```bash
npm test
```

## Building for Production

Builds are handled automatically by GitHub Actions on every push to `master`. See [SETUP.md](SETUP.md) for the full CI/CD setup guide.

To trigger a manual build:

1. Go to **Actions** → **Android — Build & Submit to Play Store**
2. Click **Run workflow**

### Required GitHub Secrets

| Secret | Purpose |
|--------|---------|
| `EXPO_TOKEN` | EAS authentication |
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `EXPO_PUBLIC_GEMINI_API_KEY` | Google Gemini API key |
| `ANDROID_SERVICE_ACCOUNT_JSON` | Google Play service account key |

## Project Structure

```
padho-label/
├── App.tsx                  # Root navigation (stack + bottom tabs)
├── index.ts                 # Expo entry point
├── src/
│   ├── screens/             # Screen components (13 screens)
│   ├── services/            # Business logic & API clients
│   ├── types/               # TypeScript type definitions
│   └── __tests__/           # Jest test suite
├── assets/                  # Images and icons
├── .github/workflows/       # CI/CD pipeline
├── app.json                 # Expo app config
└── eas.json                 # EAS build profiles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'feat: add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request
