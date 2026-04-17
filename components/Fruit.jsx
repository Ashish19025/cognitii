import React, { useEffect } from "react";
import { Pressable, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export default function Fruit({ fruitData, onFruitTap }) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 90 });
    opacity.value = withTiming(1, { duration: 300 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      className="absolute w-20 h-20 justify-center items-center z-10"
      style={[{ left: fruitData.x, top: fruitData.y }, animatedStyle]}
    >
      <Pressable
        className="p-1 items-center justify-center bg-white/20 rounded-full shadow-lg border border-white/30 backdrop-blur-sm"
        onPress={(e) => {
          e.stopPropagation();
          onFruitTap(fruitData, e);
        }}
        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
      >
        <Text
          className="text-6xl"
          style={{
            textShadowColor: "rgba(0,0,0,0.5)",
            textShadowOffset: { width: 2, height: 4 },
            textShadowRadius: 8,
          }}
        >
          {fruitData.emoji}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
