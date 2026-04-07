import { router } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
import RecipeCard from "../../components/cards/RecipeCard";
import Container from "../../components/structural/Container";
import { Scrollable } from "../../components/structural/Scrollable";
import Paragraph from "../../components/typograghy/Paragraph";
import Title from "../../components/typograghy/Title";
import { useAuth } from "../../context/AuthContext";
import { loadUserSavedRecipes } from "../../services/databaseAPI/SavedRecipes";
import { getMealById } from "../../services/mealDbAPI/getMealById";

interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strMealThumb: string;
  strInstructions?: string;
  [key: string]: unknown;
}

export default function Saved() {
  const { user } = useAuth();
  const [savedMeals, setSavedMeals] = React.useState<Meal[]>([]);

  React.useEffect(() => {
    const loadSavedMeals = async () => {
      if (!user?.id) {
        return;
      }

      try {
        const savedRecipes = await loadUserSavedRecipes(user.id);
        const ids = savedRecipes?.savedRecipes ?? [];

        const meals = await Promise.all(
          ids.map((id) => getMealById(String(id)).catch(() => null)),
        );

        setSavedMeals(meals.filter(Boolean) as Meal[]);
      } catch (error) {
        console.error("Failed to load saved recipes", error);
        setSavedMeals([]);
      }
    };

    loadSavedMeals();
  }, [user?.id]);

  const getIngredients = (meal: Meal) =>
    Array.from({ length: 20 }, (_, i) => meal[`strIngredient${i + 1}`] as string)
      .map((ingredient) => ingredient?.trim())
      .filter(Boolean) as string[];

  const openMeal = (meal: Meal) => {
    router.push({
      pathname: "/SingleRecipe",
      params: {
        idMeal: meal.idMeal,
        title: meal.strMeal,
        category: meal.strCategory,
        imageUrl: meal.strMealThumb,
        ingredients: JSON.stringify(getIngredients(meal)),
        instructions: meal.strInstructions || "",
      },
    });
  };

  return (
    <>
      <Container>
        <Title>Saved</Title>
        <Scrollable>
          <View>
            {savedMeals.length === 0 && (
              <Paragraph>No saved recipes yet.</Paragraph>
            )}
            {savedMeals.map((meal) => (
                <Pressable key={meal.idMeal} onPress={() => openMeal(meal)}>
                  <RecipeCard
                    variant="saved"
                    title={meal.strMeal}
                    category={meal.strCategory}
                    imageUrl={meal.strMealThumb}
                  />
                </Pressable>
              ))}
          </View>
        </Scrollable>
      </Container>
    </>
  );
}
