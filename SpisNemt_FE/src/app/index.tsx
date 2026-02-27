import { Link } from "expo-router";
import { Text, View } from "react-native";

import { globalText } from "../theme";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={globalText.header}>Home page</Text>
    </View>
  );
}
