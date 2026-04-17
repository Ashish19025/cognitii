import React from "react";
import { Pressable, Text, View } from "react-native";

export default function StartScreen({
  onStartGame,
  captureMode,
  setCaptureMode,
}) {
  return (
    <View className="flex-1 justify-center items-center bg-slate-900 border-8 border-indigo-900/30 p-5">
      <View className="absolute w-full h-full bg-indigo-500/10" />
      <Text className="text-5xl font-extrabold mb-3 text-indigo-300 tracking-wider shadow-md">
        Cognitii
      </Text>
      <Text className="text-xl font-bold mb-3 text-emerald-400">
        Tap ONLY the target fruit!
      </Text>

      <Text className="text-base font-semibold mb-3 text-indigo-300 tracking-wide uppercase">
        SELECT CAPTURE MODE:
      </Text>
      <View className="flex-col w-5/6 mb-10 z-10">
        <Pressable
          className={`p-4 border shadow-sm rounded-2xl my-2 items-center transition-all ${
            captureMode === "IMAGE"
              ? "border-emerald-400 bg-emerald-500/20 shadow-emerald-500/20"
              : "border-indigo-600/50 bg-slate-800/80"
          }`}
          onPress={() => setCaptureMode("IMAGE")}
        >
          <Text
            className={`text-lg font-bold ${
              captureMode === "IMAGE" ? "text-emerald-300" : "text-indigo-400"
            }`}
          >
            📸 Image Capture
          </Text>
        </Pressable>
        <Pressable
          className={`p-4 border shadow-sm rounded-2xl my-2 items-center transition-all ${
            captureMode === "VIDEO"
              ? "border-emerald-400 bg-emerald-500/20 shadow-emerald-500/20"
              : "border-indigo-600/50 bg-slate-800/80"
          }`}
          onPress={() => setCaptureMode("VIDEO")}
        >
          <Text
            className={`text-lg font-bold ${
              captureMode === "VIDEO" ? "text-emerald-300" : "text-indigo-400"
            }`}
          >
            🎥 Video Recording
          </Text>
        </Pressable>
        <Pressable
          className={`p-4 border shadow-sm rounded-2xl my-2 items-center transition-all ${
            captureMode === "NONE"
              ? "border-emerald-400 bg-emerald-500/20 shadow-emerald-500/20"
              : "border-indigo-600/50 bg-slate-800/80"
          }`}
          onPress={() => setCaptureMode("NONE")}
        >
          <Text
            className={`text-lg font-bold ${
              captureMode === "NONE" ? "text-emerald-300" : "text-indigo-400"
            }`}
          >
            🚫 None
          </Text>
        </Pressable>
      </View>

      <Pressable
        className="bg-indigo-600 border border-indigo-400/50 p-5 rounded-full w-2/3 items-center shadow-lg shadow-indigo-600/30 mt-6 z-10"
        onPress={onStartGame}
      >
        <Text className="text-white text-2xl font-black uppercase tracking-widest">
          Start Game
        </Text>
      </Pressable>
    </View>
  );
}
