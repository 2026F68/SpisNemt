import { ScrollView, StyleProp, ViewStyle } from "react-native";

interface ScrollableProps {
  children: React.ReactNode;
  horizontal?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export const Scrollable: React.FC<ScrollableProps> = ({
  children,
  horizontal = false,
  style,
  contentContainerStyle,
}) => {
  return (
    <ScrollView
      style={style}
      horizontal={horizontal}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={contentContainerStyle}
    >
      {children}
    </ScrollView>
  );
};
