import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

export default function CloseButton({
  title,
  onPress,
}: {
  title?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress || (() => router.back())}
      style={styles.closeButton}
    >
      <Text style={styles.closeButtonText}>{title || "✕"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 2,
  },
});
