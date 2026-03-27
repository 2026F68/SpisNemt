import { useCallback, useState } from "react";
import { Alert, Image, Text, View } from "react-native";
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

  const handleSave = useCallback(async () => {
    if (!idMeal) {
      Alert.alert("Unable to save", "Recipe ID is missing.");
      return;
    }

    const mealId = Number(idMeal);

    if (isSaving) {
      return;
    }

    try {
      setIsSaving(true);
      const userSavedRecipes = await loadUserSavedRecipes(user!.id);
      const savedRecipes = userSavedRecipes?.savedRecipes ?? [];

      if (savedRecipes.includes(mealId)) {
        Alert.alert(
          "Already saved",
          "This recipe is already in your saved list.",
        );
        return;
      }

      await saveUserSavedRecipes(
        {
          id: user!.id,
          email: user!.email,
          name: user!.name,
        },
        [...savedRecipes, mealId],
      );

      Alert.alert("Saved", "Recipe added to your saved list.");
    } catch (error) {
      console.error("Failed to save recipe:", error);
      Alert.alert("Save failed", "Could not save recipe. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [idMeal, isSaving, user]);

  return (
    <View style={{ flex: 1 }}>
      <SaveButton onPress={handleSave} />
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
