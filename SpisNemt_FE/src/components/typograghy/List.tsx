import { Text, View } from "react-native";

interface ListProps {
  items?: string[];
  variant?: "bullet" | "dash";
}

export default function List({ items, variant }: ListProps) {
  if (!items || items.length === 0) return null;

  const getPrefix = (index: number) => {
    switch (variant) {
      case "dash":
        return "- ";
      case "bullet":
        return "• ";
      default:
        return "";
    }
  };

  return (
    <View>
      {items.map((item, index) => (
        <Text key={index}>
          {getPrefix(index)}
          {item}
        </Text>
      ))}
    </View>
  );
}
