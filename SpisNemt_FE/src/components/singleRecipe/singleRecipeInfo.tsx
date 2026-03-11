import { Text, View } from "react-native";
import { Scrollable } from "../structural/Scrollable";

interface SingleRecipeInfoProps {}

export default function SingleRecipeInfo({}: SingleRecipeInfoProps) {
  return (
    <Scrollable>
      <View>
        <Text>SingleRecipeInfo</Text>
      </View>
    </Scrollable>
  );
}
