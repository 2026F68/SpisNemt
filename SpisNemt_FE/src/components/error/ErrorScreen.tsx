import { FallbackProps } from "react-error-boundary";
import { Pressable, Text, View } from "react-native";
import { globalColors } from "../../theme";

export default function ErrorScreen({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  const errorMessage =
    error instanceof Error ? error.message : "An unexpected error occurred.";

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        backgroundColor: globalColors.backgroundColor,
      }}
    >
      <Text
        style={{
          fontSize: 22,
          fontWeight: "700",
          color: globalColors.headerColor,
          marginBottom: 8,
        }}
      >
        Something went wrong
      </Text>
      <Text
        style={{
          textAlign: "center",
          color: globalColors.textColor,
          marginBottom: 16,
        }}
      >
        {errorMessage}
      </Text>
      <Pressable
        onPress={resetErrorBoundary}
        style={{
          backgroundColor: globalColors.primaryColor,
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: globalColors.whiteColor, fontWeight: "600" }}>
          Try again
        </Text>
      </Pressable>
    </View>
  );
}
