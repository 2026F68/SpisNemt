import { Stack } from "expo-router";
import { ErrorBoundary } from "react-error-boundary";
import { ActivityIndicator, View } from "react-native";
import Toast from "react-native-toast-message";
import ErrorScreen from "../components/error/ErrorScreen";
import { toastConfig } from "../components/toast/ToastConfig";
import { AuthProvider, useAuth } from "../context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <ErrorBoundary FallbackComponent={ErrorScreen}>
        <RootNavigator />
      </ErrorBoundary>
      <Toast config={toastConfig} topOffset={70} />
    </AuthProvider>
  );
}

function RootNavigator() {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
            presentation: "fullScreenModal",
          }}
        />
      </Stack.Protected>

      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        <Stack.Screen
          name="SingleRecipe"
          options={{
            headerShown: false,
            presentation: "modal",
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}
