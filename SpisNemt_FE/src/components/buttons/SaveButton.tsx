import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { globalColors } from "../../theme";

interface SaveButtonProps {
  onPress?: () => void;
  isSaved?: boolean;
}

export default function SaveButton({
  onPress,
  isSaved = false,
}: SaveButtonProps) {
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      style={[styles.saveButton, { top: insets.top + 8 }]}
    >
      <FontAwesome6
        name="bookmark"
        size={20}
        color={isSaved ? globalColors.successColor : "#fff"}
        solid={isSaved}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  saveButton: {
    position: "absolute",
    right: 70,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    elevation: 8,
  },
});
