import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet } from "react-native";

export default function SaveButton({ onPress }: { onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.saveButton}>
      <Ionicons name="bookmark" size={20} color="#fff" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  saveButton: {
    position: "absolute",
    top: 15,
    right: 70,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
});
