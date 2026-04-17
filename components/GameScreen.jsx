import {
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions,
} from "expo-camera";
import * as Haptics from "expo-haptics";
import { addDoc, collection } from "firebase/firestore";
import React, { useEffect, useRef, useState, forwardRef, memo } from "react";
import { Dimensions, Pressable, Text, View } from "react-native";
import { db } from "../firebase";
import Fruit from "./Fruit";

// 1. Isolate the camera so it doesn't re-render on every game tick
const HiddenCamera = memo(
  forwardRef(({ mode }, ref) => {
    return (
      <View className="absolute top-0 left-0 w-[1px] h-[1px] overflow-hidden opacity-0 z-[-10]">
        <CameraView
          ref={ref}
          facing="front"
          flash="off"
          mute={true}
          mode={mode === "VIDEO" ? "video" : "picture"}
          style={{ flex: 1 }}
        />
      </View>
    );
  })
);

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const FRUITS = ["🍎", "🍌", "🍇", "🥕"];
const TARGET_FRUIT = "🥕";
const GAME_DURATION_SEC = 120; // 2 minutes as per requirement
export default function GameScreen({
  setIsPlaying,
  onGameOver,
  captureMode,
  onGoHome,
}) {
  const [fruits, setFruits] = useState([]);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION_SEC);

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();

  const cameraRef = useRef(null);
  const sessionData = useRef({
    taps: [],
    spawnedFruits: [],
    correct: 0,
    incorrect: 0,
    total: 0,
  });
  const capturedMedia = useRef({ images: [], videos: [] });
  const isRecording = useRef(false);
  const stopVideoTimeoutRef = useRef(null);
  const intervalRefs = useRef([]);
  const cameraIntervalRef = useRef(null);

  useEffect(() => {
    (async () => {
      if (captureMode === "IMAGE" || captureMode === "VIDEO") {
        if (!cameraPermission?.granted) await requestCameraPermission();
      }
      if (captureMode === "VIDEO") {
        if (!micPermission?.granted) await requestMicPermission();
      }
    })();
  }, [captureMode]);

  const hasPermission =
    cameraPermission?.granted &&
    (captureMode !== "VIDEO" || micPermission?.granted);
  const shouldRenderCamera = hasPermission && captureMode !== "NONE";

  const spawnFruit = () => {
    const newFruit = {
      id: Math.random().toString(),
      emoji: FRUITS[Math.floor(Math.random() * FRUITS.length)],
      x: Math.random() * (SCREEN_WIDTH - 80) + 10,
      y: Math.random() * (SCREEN_HEIGHT - 160) + 80, // Avoid safe areas
    };

    // Store spawn coordinates for data analysis
    sessionData.current.spawnedFruits.push({
      time: GAME_DURATION_SEC - timeLeft,
      emoji: newFruit.emoji,
      x: newFruit.x,
      y: newFruit.y,
    });

    setFruits((prev) => [...prev, newFruit]);

    // Cleanup individual fruit
    setTimeout(() => {
      setFruits((prev) => prev.filter((f) => f.id !== newFruit.id));
    }, 1500);
  };

  useEffect(() => {
    const spawner = setInterval(spawnFruit, 800);
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    intervalRefs.current.push(spawner, timer);

    return () => {
      intervalRefs.current.forEach(clearInterval);
      if (cameraIntervalRef.current) clearInterval(cameraIntervalRef.current);
      if (stopVideoTimeoutRef.current)
        clearTimeout(stopVideoTimeoutRef.current);
      if (isRecording.current && cameraRef.current) {
        try {
          cameraRef.current.stopRecording();
        } catch (e) {}
      }
    };
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      endGame();
    }
  }, [timeLeft]);

  // Handle capture mechanisms: Image (every 500ms) OR Video (when visible)
  useEffect(() => {
    const isTargetVisible = fruits.some((f) => f.emoji === TARGET_FRUIT);

    if (
      captureMode === "IMAGE" &&
      isTargetVisible &&
      hasPermission &&
      cameraRef.current
    ) {
      if (!cameraIntervalRef.current) {
        cameraIntervalRef.current = setInterval(async () => {
          try {
            const photo = await cameraRef.current.takePictureAsync({
              shutterSound: false,
              skipProcessing: true,
              quality: 0.1, // Process the image faster, preventing freezing
            });
            capturedMedia.current.images.push(photo.uri);
          } catch (e) {
            console.error("Failed to take picture", e);
          }
        }, 2000); // <-- INCREASED TO 2000ms
      }
    } else if (captureMode === "IMAGE" && !isTargetVisible) {
      if (cameraIntervalRef.current) {
        clearInterval(cameraIntervalRef.current);
        cameraIntervalRef.current = null;
      }
    }

    if (captureMode === "VIDEO" && hasPermission && cameraRef.current) {
      if (isTargetVisible) {
        if (stopVideoTimeoutRef.current) {
          clearTimeout(stopVideoTimeoutRef.current);
          stopVideoTimeoutRef.current = null;
        }
        if (!isRecording.current) {
          isRecording.current = true;
          cameraRef.current
            .recordAsync()
            .then((video) => {
              if (video && video.uri)
                capturedMedia.current.videos.push(video.uri);
            })
            .catch((e) =>
              console.log(
                "Video recording canceled early or error:",
                e?.message,
              ),
            );
        }
      } else if (!isTargetVisible && isRecording.current) {
        // Stop Video Recording softly after 1.5 seconds so hardware can process and doesn't save blank blocks
        if (!stopVideoTimeoutRef.current) {
          stopVideoTimeoutRef.current = setTimeout(() => {
            isRecording.current = false;
            stopVideoTimeoutRef.current = null;
            try {
              cameraRef.current.stopRecording();
            } catch (e) {}
          }, 1500);
        }
      }
    }
  }, [fruits, captureMode, hasPermission]);

  const endGame = () => {
    intervalRefs.current.forEach(clearInterval);
    if (cameraIntervalRef.current) clearInterval(cameraIntervalRef.current);
    if (stopVideoTimeoutRef.current) clearTimeout(stopVideoTimeoutRef.current);
    if (isRecording.current && cameraRef.current) {
      isRecording.current = false;
      try {
        cameraRef.current.stopRecording();
      } catch (e) {}
    }
    const accuracy =
      sessionData.current.total > 0
        ? sessionData.current.correct / sessionData.current.total
        : 0;

    const sessionMetrics = {
      totalTaps: sessionData.current.total,
      correctTaps: sessionData.current.correct,
      incorrectTaps: sessionData.current.incorrect,
      accuracy: accuracy,
    };

    const dataToSave = {
      timestamp: new Date().toISOString(),
      captureMode,
      taps: sessionData.current.taps,
      spawnedFruits: sessionData.current.spawnedFruits,
      metrics: sessionMetrics,
    };

    // Save to firebase asynchronously without blocking the UI
    addDoc(collection(db, "game_sessions"), dataToSave)
      .then(() => console.log("Session saved successfully!"))
      .catch((e) => console.error("Error saving session:", e));

    if (onGameOver) {
      onGameOver({ metrics: sessionMetrics, media: capturedMedia.current });
    }
  };

  const handleFruitTap = (fruit, e) => {
    setFruits((prev) => prev.filter((f) => f.id !== fruit.id));

    const isCorrect = fruit.emoji === TARGET_FRUIT;
    sessionData.current.total += 1;
    if (isCorrect) {
      sessionData.current.correct += 1;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      sessionData.current.incorrect += 1;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    sessionData.current.taps.push({
      x: e.nativeEvent.pageX,
      y: e.nativeEvent.pageY,
      fruitX: fruit.x,
      fruitY: fruit.y,
      type: isCorrect ? "correct" : "incorrect",
      time: new Date().toISOString(),
    });
  };

  const handleBackgroundTap = (e) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    sessionData.current.total += 1;
    sessionData.current.taps.push({
      x: e.nativeEvent.pageX,
      y: e.nativeEvent.pageY,
      type: "background",
      time: new Date().toISOString(),
    });
  };

  return (
    <View className="flex-1 bg-slate-900 border-8 border-indigo-900/30">
      
      {/* 1. Fullsize camera running in the background to capture actual photos */}
        {shouldRenderCamera && (
          <HiddenCamera ref={cameraRef} mode={captureMode} />
        )}      {/* 2. Opaque Background Layer OVER the camera to block its shutter flashes */}
      <View 
        className="absolute top-0 left-0 w-full h-full bg-slate-900 z-10" 
        pointerEvents="none" 
      />
      <View
        className="absolute w-full h-full bg-indigo-500/10 z-10"
        pointerEvents="none"
      />

      <View
        className="absolute top-12 w-full flex-row justify-between px-5 z-20"
        pointerEvents="box-none"
      >
        <View className="bg-slate-800/80 px-4 py-3 rounded-2xl shadow-lg border border-indigo-500/50 backdrop-blur-md">
          <Text className="text-xl font-bold text-indigo-200">
            ⏳ {timeLeft}s
          </Text>
        </View>
        <View className="bg-slate-800/80 px-4 py-3 rounded-2xl shadow-lg border-2 border-emerald-400 backdrop-blur-md">
          <Text className="text-xl font-bold text-emerald-300 tracking-wider">
            Target: {TARGET_FRUIT}
          </Text>
        </View>
      </View>

      <Pressable
        className="flex-1 w-full h-full z-20 pt-24"
        onPress={handleBackgroundTap}
      >
        {fruits.map((fruit) => (
          <Fruit key={fruit.id} fruitData={fruit} onFruitTap={handleFruitTap} />
        ))}
      </Pressable>
    </View>
  );
}
