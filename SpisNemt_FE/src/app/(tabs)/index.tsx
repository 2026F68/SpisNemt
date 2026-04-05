import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import PillFilter from "../../components/buttons/PillFilter";
import RecipeCard from "../../components/cards/RecipeCard";
import Container from "../../components/structural/Container";
import { Scrollable } from "../../components/structural/Scrollable";
import Subtitle from "../../components/typograghy/Subtitle";
import Title from "../../components/typograghy/Title";
import { useAuth } from "../../context/AuthContext";
import { loadUserPreferences } from "../../services/databaseAPI/Preferences";
import { get10RandomMeals } from "../../services/mealDbAPI/get10RandomMeals";
import { scoreRecipeMatch } from "../../services/ml/preferencesMatcher";

export default function Index() {
  const { user } = useAuth();
  const [category, setCategory] = React.useState<string[]>([]);
  const [randomMeals, setRandomMeals] = React.useState<any[]>([]);
  const [matchScores, setMatchScores] = React.useState<Map<string, number>>(new Map());
  const [userPrefs, setUserPrefs] = React.useState<{ area: string[]; category: string[] } | null>(null);

  React.useEffect(() => {
    get10RandomMeals()
      .then((meals) => setRandomMeals(meals ?? []))
      .catch(() => setRandomMeals([]));
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (!user) return;
      loadUserPreferences(user.id)
        .then((prefs) => setUserPrefs(prefs))
        .catch(() => setUserPrefs(null));
    }, [user]),
  );

  React.useEffect(() => {
    if (randomMeals.length === 0 || !userPrefs) return;
    if (userPrefs.area.length === 0 && userPrefs.category.length === 0) return;

    void (async () => {
      const entries = await Promise.all(
        randomMeals.map(async (meal) => {
          try {
            const score = await scoreRecipeMatch(meal, userPrefs);
            return [meal.idMeal, score] as [string, number];
          } catch {
            return [meal.idMeal, 0] as [string, number];
          }
        }),
      );
      setMatchScores(new Map(entries));
    })();
  }, [randomMeals, userPrefs]);

  const hasPrefs =
    userPrefs !== null &&
    (userPrefs.area.length > 0 || userPrefs.category.length > 0);

  const recommendedMeals = React.useMemo(
    () => randomMeals.filter((m) => (matchScores.get(m.idMeal) ?? 0) >= 0.45),
    [randomMeals, matchScores],
  );

  const categories = React.useMemo(
    () => [...new Set(randomMeals.map((m) => m.strCategory as string))],
    [randomMeals],
  );

  const discoveryMeals =
    category.length === 0
      ? randomMeals
      : randomMeals.filter((m) => category.includes(m.strCategory));

  return (
    <>
      <Container>
        <Title>Home</Title>
        <Subtitle>Recommended</Subtitle>
        <Scrollable horizontal>
          {(hasPrefs ? recommendedMeals : randomMeals).map((meal) => (
            <RecipeCard
              key={meal.idMeal}
              title={meal.strMeal}
              category={meal.strCategory}
              imageUrl={meal.strMealThumb}
              isRecommended={hasPrefs}
            />
          ))}
        </Scrollable>

        <Subtitle>Categories</Subtitle>
        <Scrollable horizontal>
          {categories.map((cat, index) => (
            <PillFilter
              key={index}
              title={cat}
              onPress={() => {
                setCategory((prev) =>
                  prev.includes(cat)
                    ? prev.filter((c) => c !== cat)
                    : [...prev, cat],
                );
              }}
              active={category.includes(cat)}
            />
          ))}
        </Scrollable>
        <Scrollable horizontal>
          {discoveryMeals.map((meal) => (
            <RecipeCard
              key={meal.idMeal}
              title={meal.strMeal}
              category={meal.strCategory}
              imageUrl={meal.strMealThumb}
              isRecommended={(matchScores.get(meal.idMeal) ?? 0) >= 0.45}
            />
          ))}
        </Scrollable>
      </Container>
    </>
  );
}
