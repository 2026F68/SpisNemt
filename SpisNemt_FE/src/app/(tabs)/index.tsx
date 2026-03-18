import React from "react";
import PillFilter from "../../components/buttons/PillFilter";
import RecipeCard from "../../components/cards/RecipeCard";
import Container from "../../components/structural/Container";
import { Scrollable } from "../../components/structural/Scrollable";
import Subtitle from "../../components/typograghy/Subtitle";
import Title from "../../components/typograghy/Title";

import { cuisines } from "../../mock/cuisines";
import { recipes } from "../../mock/recipes";

export default function Index() {
  const [category, setCategory] = React.useState<string[]>([]);

  return (
    <>
      <Container>
        <Title>Home</Title>
        <Subtitle>Recommended</Subtitle>
        <Scrollable horizontal>
          {recipes.map((recipe, index) => (
            <RecipeCard
              key={index}
              title={recipe.title}
              category={recipe.category}
              description={recipe.description}
              imageUrl={recipe.imageUrl}
            />
          ))}
        </Scrollable>

        <Subtitle>Categories</Subtitle>
        <Scrollable horizontal>
          {cuisines.map((cuisine, index) => (
            <PillFilter
              key={index}
              title={cuisine.title}
              onPress={() => {
                setCategory(
                  category === null
                    ? [cuisine.title]
                    : category.includes(cuisine.title)
                      ? category.filter((c) => c !== cuisine.title)
                      : [...category, cuisine.title],
                );
              }}
              active={category !== null && category.includes(cuisine.title)}
            />
          ))}
        </Scrollable>
        <Scrollable horizontal>
          {recipes
            .filter(
              (recipe) =>
                category.length === 0 || category.includes(recipe.category),
            )
            .map((recipe, index) => (
              <RecipeCard
                key={index}
                title={recipe.title}
                category={recipe.category}
                description={recipe.description}
                imageUrl={recipe.imageUrl}
              />
            ))}
        </Scrollable>
      </Container>
    </>
  );
}
