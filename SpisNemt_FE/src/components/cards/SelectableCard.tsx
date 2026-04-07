import { globalColors } from "@/src/theme";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { cardStyle } from "./CardTheme";

interface SelectableCardProps {
  title?: string;
  selected?: boolean;
  onToggle?: () => void;
}

export default function SelectableCard({
  title,
  selected,
  onToggle,
}: SelectableCardProps) {
  const isSelected = selected ?? false;

  return (
    <Pressable onPress={onToggle}>
      <View
        style={
          isSelected
            ? [
                cardStyle.SelectableCard,
                { borderColor: globalColors.primaryColor },
              ]
            : cardStyle.SelectableCard
        }
      >
        {isSelected && (
          <View style={cardStyle.selectedIndicator}>
            <Text style={cardStyle.SelectableCheckMark}>✓</Text>
          </View>
        )}
        <View style={cardStyle.cardImage} />
        <Text style={cardStyle.cardTitle}>{title}</Text>
      </View>
    </Pressable>
  );
}
