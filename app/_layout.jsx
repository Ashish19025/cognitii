import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Turn off native navigation header completely
      }}
    >
      <Stack.Screen name="index" options={{ title: "" }} />
    </Stack>
  );
}
