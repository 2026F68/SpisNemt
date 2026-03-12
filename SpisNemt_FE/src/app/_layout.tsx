import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      <Stack.Screen
        name="SingleRecipe"
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
