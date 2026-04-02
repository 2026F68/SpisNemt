import React from "react";
import { Pressable, Text } from "react-native";

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
        backgroundColor: disabled ? "#8fb3e0" : "#007BFF",
        borderRadius: 5,
        marginBottom: 10,
      }}
    >
      <Text style={{ color: "#fff" }}>{title}</Text>
    </Pressable>
  );
}
