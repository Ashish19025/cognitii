import { ResizeMode, Video } from "expo-av";
import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

export default function ResultScreen({
  sessionResults,
  onPlayAgain,
  captureMode,
  onGoHome,
}) {
  const { metrics, media } = sessionResults;

  return (
    <View className="flex-1 bg-slate-900 border-8 border-indigo-900/30 w-full h-full">
      <ScrollView
        contentContainerClassName="flex-grow items-center p-8 pt-28"
        className="flex-1"
      >
        <View className="absolute w-full h-full bg-indigo-500/10" />

        <Text className="text-5xl font-extrabold mb-5 mt-10 text-emerald-400 tracking-wider drop-shadow-md z-10">
          GAME OVER
        </Text>

        <View className="bg-slate-800/80 w-full p-6 rounded-3xl mb-8 shadow-lg shadow-indigo-900/40 border border-indigo-500/30 backdrop-blur-md z-10">
          <Text className="text-2xl font-black text-indigo-300 mb-4 border-b border-indigo-500/30 pb-2">
            Accuracy: {(metrics.accuracy * 100).toFixed(0)}%
          </Text>
          <Text className="text-xl font-bold text-gray-200 mb-2">
            Total Taps:{" "}
            <Text className="text-indigo-400">{metrics.totalTaps}</Text>
          </Text>
          <Text className="text-xl font-bold text-gray-200 mb-2">
            Correct:{" "}
            <Text className="text-emerald-400">{metrics.correctTaps}</Text>
          </Text>
          <Text className="text-xl font-bold text-gray-200 mb-2">
            Incorrect:{" "}
            <Text className="text-red-400">{metrics.incorrectTaps}</Text>
          </Text>
        </View>

        {captureMode === "IMAGE" && media?.images?.length > 0 && (
          <>
            <Text className="text-2xl font-bold mb-4 text-indigo-300 z-10">
              Captured Captures
            </Text>
            <View className="flex-row flex-wrap justify-center z-10">
              {media.images.slice(0, 10).map((uri, index) => (
                <Image
                  key={index}
                  source={{ uri }}
                  className="w-24 h-24 rounded-2xl m-2 bg-slate-800 border-2 border-indigo-500/30"
                />
              ))}
            </View>
          </>
        )}

        {captureMode === "VIDEO" && media?.videos?.length > 0 && (
          <View className="items-center z-10 w-full">
            <Text className="text-2xl font-bold mb-4 text-indigo-300">
              Video Clips Recorded
            </Text>
            {media.videos.map((uri, index) => (
              <View
                key={index}
                className="w-full h-48 mb-4 rounded-xl overflow-hidden border border-indigo-500/30 bg-slate-800"
              >
                <Video
                  source={{ uri }}
                  style={{ width: "100%", height: "100%" }}
                  useNativeControls
                  resizeMode={ResizeMode.COVER}
                  isLooping={true}
                />
              </View>
            ))}
          </View>
        )}

        <Pressable
          className="bg-indigo-600 border border-indigo-400 w-3/4 p-5 rounded-full items-center mt-10 shadow-lg shadow-indigo-600/30 active:bg-indigo-700 z-10 mb-10"
          onPress={onPlayAgain}
        >
          <Text className="text-white text-xl font-black uppercase tracking-widest">
            Play Again
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
