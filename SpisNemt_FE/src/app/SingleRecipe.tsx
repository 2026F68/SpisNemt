import { useLocalSearchParams } from "expo-router";
import SingleRecipeInfo from "../components/singleRecipe/singleRecipeInfo";

export default function SingleRecipeInfoScreen() {
  const params = useLocalSearchParams();

  return <SingleRecipeInfo />;
}
