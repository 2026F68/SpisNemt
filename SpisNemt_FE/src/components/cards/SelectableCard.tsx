import { globalColors } from "@/src/theme";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { cardStyle } from "./CardTheme";

interface SelectableCardProps {
  title?: string;
  selected?: boolean;
}

export default function SelectableCard({
  title,
  selected,
}: SelectableCardProps) {
  const [Selected, setSelected] = useState(selected ?? false);

  return (
    <Pressable onPress={() => setSelected(!Selected)}>
      <View
        style={
          Selected
            ? [
                cardStyle.SelectableCard,
                { borderColor: globalColors.primaryColor },
              ]
            : cardStyle.SelectableCard
        }
      >
        {Selected && (
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
