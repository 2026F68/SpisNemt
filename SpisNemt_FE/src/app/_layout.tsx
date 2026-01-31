import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack
    screenOptions={{
      headerStyle: {
        backgroundColor: '#878787',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen name="index" options={{ title: 'Home' }} />
    <Stack.Screen name="about" options={{ title: 'About' }} />
  </Stack>;
}
