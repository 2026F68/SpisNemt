import { useLocalSearchParams } from "expo-router";
import SingleRecipeInfo from "../components/singleRecipe/singleRecipeInfo";

export default function SingleRecipeInfoScreen() {
  const params = useLocalSearchParams();

  const ingredients = params.ingredients
    ? JSON.parse(params.ingredients as string)
    : undefined;

  return (
    <SingleRecipeInfo
      idMeal={params.idMeal as string}
      title={params.title as string}
      category={params.category as string}
      imageUrl={params.imageUrl as string}
      ingredients={ingredients}
      instructions={params.instructions as string}
    />
  );
}
