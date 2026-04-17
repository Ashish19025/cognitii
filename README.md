# Cognitii Fruit Game

## Setup Instructions
1. Run \
pm install\
2. Add your Firebase config in \pp/firebase.js\
3. Run \
px expo start\

## Assumptions
- The user's device supports a front-facing camera.
- For simplicity, emojis are used as fruits instead of complete image assets (they perfectly match the Figma layout style).
- Game duration is fixed at 2 minutes.

## Tech Decisions
- Used React Native built-in \Pressable\ for exact tap coordinate tracking.
- Used \expo-camera\ taking pictures in the background every 500ms when the target fruit is visible on-screen.
- Used Firebase Firestore to save session data at the end of the game.
