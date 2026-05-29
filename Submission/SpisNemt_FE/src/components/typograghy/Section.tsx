import { View } from "react-native";
import Subtitle from "./Subtitle";

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export default function Section({ title, children }: SectionProps) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Subtitle>{title}</Subtitle>
      <View>{children}</View>
    </View>
  );
}
