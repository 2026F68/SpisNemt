import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { globalColors } from "../../theme";

interface SaveButtonProps {
  onPress?: () => void;
  isSaved?: boolean;
}

export default function SaveButton({
  onPress,
  isSaved = false,
}: SaveButtonProps) {
  return (
    <Pressable onPress={onPress} style={styles.saveButton}>
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
