import { Text, View } from "react-native";
import Test from "../components/Test";

export default function Explore() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Test />
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Explore page</Text>
    </View>
  );
}