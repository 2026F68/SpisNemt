import React from "react";
import PillFilter from "../components/buttons/PillFilter";
import RecipeCard from "../components/cards/RecipeCard";
import Container from "../components/structural/Container";
import { Scrollable } from "../components/structural/Scrollable";
import Subtitle from "../components/typograghy/Subtitle";
import Title from "../components/typograghy/Title";
import { get10RandomMeals } from "./services/mealDbAPI/get10RandomMeals";

export default function Index() {
  const [category, setCategory] = React.useState<string[]>([]);
  const [randomMeals, setRandomMeals] = React.useState<any[]>([]);

  React.useEffect(() => {
    get10RandomMeals()
      .then((meals) => setRandomMeals(meals ?? []))
      .catch(() => setRandomMeals([]));
  }, []);

  const categories = React.useMemo(
    () => [...new Set(randomMeals.map((m) => m.strCategory as string))],
    [randomMeals],
  );

  const filteredMeals =
    category.length === 0
      ? randomMeals
      : randomMeals.filter((m) => category.includes(m.strCategory));

  return (
    <>
      <Container>
        <Title>Home</Title>
        <Subtitle>Recommended</Subtitle>
        <Scrollable horizontal>
          {randomMeals.map((meal) => (
            <RecipeCard
              key={meal.idMeal}
              title={meal.strMeal}
              category={meal.strCategory}
              imageUrl={meal.strMealThumb}
            />
          ))}
        </Scrollable>

        <Subtitle>Categories</Subtitle>
        <Scrollable horizontal>
          {categories.map((category, index) => (
            <PillFilter
              key={index}
              title={category}
              onPress={() => {
                setCategory((prev) =>
                  prev.includes(category)
                    ? prev.filter((c) => c !== category)
                    : [...prev, category],
                );
              }}
              active={category.includes(category)}
            />
          ))}
        </Scrollable>
        <Scrollable horizontal>
          {filteredMeals.map((meal) => (
            <RecipeCard
              key={meal.idMeal}
              title={meal.strMeal}
              category={meal.strCategory}
              imageUrl={meal.strMealThumb}
            />
          ))}
        </Scrollable>
      </Container>
    </>
  );
}
