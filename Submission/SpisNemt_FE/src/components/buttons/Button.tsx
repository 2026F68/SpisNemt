import React from "react";
import { Pressable, Text } from "react-native";
import { globalColors } from "../../theme";

export default function Button({
  title,
  onPress,
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={{
        padding: 10,
        backgroundColor: disabled ? globalColors.primaryMutedColor : globalColors.primaryColor,
        borderRadius: 15,
        marginBottom: 10,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "bold" }}>{title}</Text>
    </Pressable>
  );
}
