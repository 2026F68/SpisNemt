import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CloseButton({
  title,
  onPress,
}: {
  title?: string;
  onPress?: () => void;
}) {
  const insets = useSafeAreaInsets();

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }

    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/(tabs)");
  };

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={10}
      style={[styles.closeButton, { top: insets.top + 8 }]}
    >
      <Text style={styles.closeButtonText}>{title || "✕"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    position: "absolute",
    right: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    elevation: 8,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
