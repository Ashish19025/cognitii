# 🌌 Cognitii - Cosmic Fruit Tapping Game

A high-performance React Native (Expo) game featuring a sleek dark glassmorphism aesthetic. Players have 2 minutes to tap specific target fruits while avoiding distractors, with full session metrics and background camera snapshots!

## ✨ Features

- **Precise Interactions:** Tracks exact `X/Y` tap coordinates and validates correct/incorrect taps.
- **Background Camera Captures:** Seamlessly takes stealth pictures every 2 seconds when the target fruit appears, optimized with `React.memo` to prevent UI thread freezing.
- **Media Playback:** Captures and plays back video snippets of the gameplay automatically at the end of the game using `expo-av`.
- **Engaging UX:** "Cosmic Arcade" dark glassmorphism theme styling using NativeWind v4 (Tailwind CSS) and immersive physical feedback via `expo-haptics`.
- **Cloud Storage:** Stores gameplay metrics (accuracy, precise tap logs, total interactions) directly into a NoSQL Firebase Firestore database.

## 🚀 Tech Stack

- **Framework:** React Native & Expo SDK
- **Styling:** NativeWind (Tailwind CSS)
- **Database:** Firebase Firestore
- **Hardware APIs:** `expo-camera`, `expo-haptics`, `expo-av`
- **Animations:** `react-native-reanimated`

## 🛠️ Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Configure Firebase:**
   Create a `firebase.js` file in the root directory and add your Firebase configuration:

   ```javascript
   import { initializeApp } from "firebase/app";
   import { getFirestore } from "firebase/firestore";

   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID",
   };

   const app = initializeApp(firebaseConfig);
   export const db = getFirestore(app);
   ```

3. **Start the app:**
   ```bash
   npx expo start
   ```

## 🧠 Technical Architecture & Decisions

- **Coordinate Tracking:** Built using React Native's `<Pressable>` to capture exact layout-relative coordinate events.
- **Camera Optimization:** Extracted `expo-camera` into a memoized `<HiddenCamera>` component. Reduced the snapshot interval to 2000ms and skipped native processing to eliminate OS-level shutter flashing and game stutter.
- **Video Stability:** Implemented a buffered 1500ms timeout when stopping video recordings to ensure 100% stable `.mp4` generation without file corruption.
- **UI & Layout:** Leveraged native text emojis wrapped in Reanimated views. This removed asset-loading overhead while perfectly matching the vibrant Arcade UI theme.

## 📌 Assumptions & Constraints

- Device must support hardware camera capability (front/rear).
- Session timer is strictly locked to 120 seconds (2 minutes).
