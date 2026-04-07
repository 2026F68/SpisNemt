import { router } from "expo-router";
import { Pressable, View } from "react-native";
import RecipeCard from "../../components/cards/RecipeCard";
import Container from "../../components/structural/Container";
import { Scrollable } from "../../components/structural/Scrollable";
import Title from "../../components/typograghy/Title";
import { recipes } from "../../mock/recipes";

export default function Saved() {
  return (
    <>
      <Container>
        <Title>Saved</Title>
        <Scrollable>
          <View>
            {recipes.map((recipe, index) => (
              <Pressable
                key={index}
                onPress={() =>
                  router.push({
                    pathname: "/SingleRecipe",
                    params: {
                      title: recipe.title,
                      category: recipe.category,
                      description: recipe.description,
                      imageUrl: recipe.imageUrl,
                      ingredients: JSON.stringify(recipe.ingredients),
                      instructions: recipe.instructions,
                    },
                  })
                }
              >
                <RecipeCard
                  variant="saved"
                  title={recipe.title}
                  category={recipe.category}
                  description={recipe.description}
                  imageUrl={recipe.imageUrl}
                />
              </Pressable>
            ))}
          </View>
        </Scrollable>
      </Container>
    </>
  );
}
