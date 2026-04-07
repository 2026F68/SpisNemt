import { globalColors } from "@/src/theme";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { cardStyle } from "./CardTheme";

interface SelectableCardProps {
  title?: string;
  selected?: boolean;
  onToggle?: () => void;
  blinkSignal?: number;
}

export default function SelectableCard({
  title,
  selected,
  onToggle,
  blinkSignal = 0,
}: SelectableCardProps) {
  const isSelected = selected ?? false;
  const blinkAnimation = useRef(new Animated.Value(0)).current;
  const previousBlinkSignal = useRef(blinkSignal);

  useEffect(() => {
    const didSignalChange = blinkSignal !== previousBlinkSignal.current;
    previousBlinkSignal.current = blinkSignal;

    if (!didSignalChange || !isSelected || blinkSignal === 0) {
      return;
    }

    blinkAnimation.setValue(0);
    Animated.sequence([
      Animated.timing(blinkAnimation, {
        toValue: 1,
        duration: 180,
        useNativeDriver: false,
      }),
      Animated.timing(blinkAnimation, {
        toValue: 0,
        duration: 180,
        useNativeDriver: false,
      }),
    ]).start();
  }, [blinkAnimation, blinkSignal, isSelected]);

  const baseBorderColor = isSelected
    ? globalColors.primaryColor
    : "transparent";

  const animatedCardStyle = {
    borderColor: blinkAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [baseBorderColor, globalColors.successColor],
    }),
    backgroundColor: blinkAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [globalColors.whiteColor, "#D9F8E6"],
    }),
  };

  return (
    <Pressable onPress={onToggle}>
      <Animated.View style={[cardStyle.SelectableCard, animatedCardStyle]}>
        {isSelected && (
          <View style={cardStyle.selectedIndicator}>
            <Text style={cardStyle.SelectableCheckMark}>✓</Text>
          </View>
        )}
        <View style={cardStyle.cardImage} />
        <Text style={cardStyle.cardTitle}>{title}</Text>
      </Animated.View>
    </Pressable>
  );
}
