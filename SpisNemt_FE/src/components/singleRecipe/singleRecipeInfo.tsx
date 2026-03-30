import { useCallback, useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import {
  loadUserSavedRecipes,
  saveUserSavedRecipes,
} from "../../services/databaseAPI/SavedRecipes";
import CloseButton from "../buttons/CloseButton";
import SaveButton from "../buttons/SaveButton";
import { cardStyle } from "../cards/CardTheme";
import Container from "../structural/Container";
import { Scrollable } from "../structural/Scrollable";
import { List, Section, Title } from "../typograghy";

interface SingleRecipeInfoProps {
  idMeal?: string;
  title?: string;
  category?: string;
  ingredients?: string[];
  instructions?: string;
  imageUrl?: string;
}

export default function SingleRecipeInfo({
  idMeal,
  title,
  category,
  ingredients,
  instructions,
  imageUrl,
}: SingleRecipeInfoProps) {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const loadSavedState = async () => {
      if (!idMeal || !user) {
        setIsSaved(false);
        return;
      }

      const mealId = Number(idMeal);

      if (Number.isNaN(mealId)) {
        setIsSaved(false);
        return;
      }

      try {
        const userSavedRecipes = await loadUserSavedRecipes(user.id);
        const savedRecipes = userSavedRecipes?.savedRecipes ?? [];
        setIsSaved(savedRecipes.some((savedId) => Number(savedId) === mealId));
      } catch (error) {
        console.error("Failed to load saved recipes:", error);
        setIsSaved(false);
      }
    };

    void loadSavedState();
  }, [idMeal, user]);

  const handleSave = useCallback(async () => {
    if (!idMeal || !user) {
      return;
    }

    const mealId = Number(idMeal);

    if (isSaving) {
      return;
    }

    try {
      setIsSaving(true);
      const userSavedRecipes = await loadUserSavedRecipes(user.id);
      const savedRecipes = userSavedRecipes?.savedRecipes ?? [];

      const isAlreadySaved = savedRecipes.some(
        (savedId) => Number(savedId) === mealId,
      );

      const nextSavedRecipes = isAlreadySaved
        ? savedRecipes.filter((savedId) => Number(savedId) !== mealId)
        : [...savedRecipes, mealId];

      await saveUserSavedRecipes(
        {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        nextSavedRecipes,
      );

      setIsSaved(!isAlreadySaved);

    } catch (error) {
      console.error("Failed to save recipe:", error);
    } finally {
      setIsSaving(false);
    }
  }, [idMeal, isSaving, user]);

  return (
    <View style={{ flex: 1 }}>
      <SaveButton onPress={handleSave} isSaved={isSaved} />
      <CloseButton />
      <Scrollable>
        <Image
          source={{ uri: imageUrl }}
          style={{ width: "100%", height: 300 }}
        />
        <Container>
          <Title>{title}</Title>
          <Text style={cardStyle.cardCategory}>{category}</Text>

          <Section title="Ingredients">
            <List variant="bullet" items={ingredients} />
          </Section>

          <Section title="Instructions">
            <Text>{instructions}</Text>
          </Section>
        </Container>
      </Scrollable>
    </View>
  );
}
