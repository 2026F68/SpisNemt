import RecipeCard from "@/src/components/cards/RecipeCard";
import { Scrollable } from "@/src/components/structural/Scrollable";
import Paragraph from "@/src/components/typograghy/Paragraph";
import Subtitle from "@/src/components/typograghy/Subtitle";
import type { ExploreRecipeMeal } from "@/src/hooks/useExploreRecipeSearch";
import { View } from "react-native";
import { exploreTheme } from "../explore/ExploreTheme";

interface RecipeContainerProps {
  heading: string;
  meals: ExploreRecipeMeal[];
  onPressMeal: (meal: ExploreRecipeMeal) => void;
  emptyMessage: string;
  getDescription: (meal: ExploreRecipeMeal) => string;
  getMatchScore?: (meal: ExploreRecipeMeal) => number | undefined;
}

export default function RecipeContainer({
  heading,
  meals,
  onPressMeal,
  emptyMessage,
  getDescription,
  getMatchScore,
}: RecipeContainerProps) {
  return (
    <View style={exploreTheme.sectionContainer}>
      <Subtitle>{heading}</Subtitle>
      <Scrollable
        style={exploreTheme.sectionScroll}
        contentContainerStyle={exploreTheme.sectionContent}
      >
        {meals.length > 0 ? (
          meals.map((meal) => (
            <View key={meal.idMeal} style={exploreTheme.sectionItem}>
              <RecipeCard
                variant="saved"
                title={meal.strMeal}
                category={meal.strCategory}
                description={getDescription(meal)}
                imageUrl={meal.strMealThumb}
                tags={meal.tags}
                matchScore={getMatchScore?.(meal)}
                onPress={() => onPressMeal(meal)}
              />
            </View>
          ))
        ) : (
          <Paragraph>{emptyMessage}</Paragraph>
        )}
      </Scrollable>
    </View>
  );
}