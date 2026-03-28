import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import React, { useEffect, useState } from "react";
import Button from "../../components/buttons/Button";
import Container from "../../components/structural/Container";
import Paragraph from "../../components/typograghy/Paragraph";
import Title from "../../components/typograghy/Title";
import RecipeCard from "../../components/cards/RecipeCard";
import { Scrollable } from "../../components/structural/Scrollable";
import PillFilter from "../../components/buttons/PillFilter";
import SearchInput from "../../components/forms/SearchInput";
import Alert from "../../components/typograghy/Alert";
import { getMealByMultiIngredients } from "../../services/mealDbAPI/getMealByMultiIngredients";
import { get10RandomMeals } from "@/src/services/mealDbAPI/get10RandomMeals";
import { StyleSheet, View } from "react-native";
import Subtitle from "../../components/typograghy/Subtitle";

interface MealDbMeal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
}

const styles = StyleSheet.create({
  chipContainer: {
    height: 48,
    justifyContent: "center",
    marginBottom: 12,
  },
  chipScroll: {
    marginBottom: 8,
    paddingBottom: 0,
    flexGrow: 0,
    maxHeight: 48,
  },
  chipScrollContent: {
    alignItems: "center",
  },

  cameraContainer: {
    marginTop: 12,
    height: 320,
    borderRadius: 12,
    overflow: "hidden",
  },
  camera: {
    flex: 1,
  },
});

export default function Explore() {
  const [draft, setDraft] = useState("");
  const [terms, setTerms] = useState<string[]>([]);
  const [submittedTerms, setSubmittedTerms] = useState<string[]>([]);
  const [hasSubmittedSearch, setHasSubmittedSearch] = useState(false);
  const [results, setResults] = useState<MealDbMeal[]>([]);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [randomRecipe, setRandomRecipe] = useState<MealDbMeal[]>([]);

  const [facing] = React.useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraOpen, setCameraOpen] = React.useState(false);

  useEffect(() => {
    const fetchRandomRecipe = async () => {
      try {
        const meals = await get10RandomMeals();
        setRandomRecipe(meals || []);
      } catch (error) {
        console.error("Error fetching random recipe:", error);
      }
    };

    fetchRandomRecipe();
  }, []);

  const normalizeTerm = (raw: string) => raw.trim().toLowerCase();

  const addTerm = (raw: string) => {
    const term = normalizeTerm(raw);
    if (!term) return;

    setTerms((prev) => (prev.includes(term) ? prev : [...prev, term]));
  };

  const removeTerm = (termToRemove: string) => {
    setTerms((prev) => prev.filter((t) => t !== termToRemove));
  };

  const submitSearch = async () => {
    const draftTerm = normalizeTerm(draft);
    const nextTerms =
      draftTerm && !terms.includes(draftTerm) ? [...terms, draftTerm] : terms;

    if (draftTerm) {
      setTerms(nextTerms);
      setDraft("");
    }

    setSubmittedTerms(nextTerms);
    setCameraOpen(false);
    setHasSubmittedSearch(true);

    if (nextTerms.length === 0) {
      setResults([]);
      setSearchError(null);
      return;
    }

    try {
      setIsLoadingResults(true);
      setSearchError(null);
      const meals = await getMealByMultiIngredients(nextTerms);
      setResults(meals);
    } catch {
      setResults([]);
      setSearchError("Something went wrong while searching for recipes.");
    } finally {
      setIsLoadingResults(false);
    }
  };

  const handleDraftChange = (text: string) => {
    // Typing space creates chip, but does NOT run search yet.
    if (/\s$/.test(text)) {
      addTerm(text);
      setDraft("");
      return;
    }
    setDraft(text);
  };

  const searchLabel = submittedTerms.join(", ");

  {/* Helper function to render random recommendations, avoiding duplicates */}
  const renderRandomRecommendations = (heading: string) => (
    <>
      <Subtitle>{heading}</Subtitle>
      <Scrollable>
        {randomRecipe.length > 0 ? (
          randomRecipe.map((meal) => (
            <RecipeCard
              key={meal.idMeal}
              variant="saved"
              title={meal.strMeal}
              category={meal.strCategory}
              description="Recommended for you"
              imageUrl={meal.strMealThumb}
            />
          ))
        ) : (
          <Paragraph>Loading recommendations...</Paragraph>
        )}
      </Scrollable>
    </>
  );


  if (!permission) {
    return <Paragraph>Requesting camera permission...</Paragraph>;
  }

  if (!permission.granted) {
    return (
      <Container>
        <Title>Camera Access Needed</Title>
        <Paragraph>Please grant camera permission to use the search feature.</Paragraph>
        <Button onPress={requestPermission} title="Grant permission" />
      </Container>
    );
  }

  return (
    <Container>
      <Title>Explore</Title>

      <SearchInput
        placeholder="Type and press space..."
        value={draft}
        onChangeText={handleDraftChange}
        onSubmitEditing={submitSearch}
        actionButtonOnPress={() => {
          setCameraOpen((current) => !current);
        }}
      />


      {terms.length > 0 && (
        <View style={styles.chipContainer}>
          {terms.length > 0 && (
            <Scrollable horizontal style={styles.chipScroll} contentContainerStyle={styles.chipScrollContent}>
              {terms.map((term) => (
                <PillFilter
                  key={term}
                  title={term}
                  onPress={() => removeTerm(term)}
                  active
                />
              ))}
            </Scrollable>
          )}
        </View>
      )}

      {cameraOpen && (
        <View style={styles.cameraContainer}>
          <CameraView style={styles.camera} facing={facing} />
        </View>
      )}

      {hasSubmittedSearch ? (
        <Scrollable>
          {isLoadingResults ? (
            <Paragraph>Searching recipes...</Paragraph>
          ) : searchError ? (
            <Alert variant="danger">{searchError}</Alert>
          ) : results.length > 0 ? (
            results.map((meal) => (
              <RecipeCard
                key={meal.idMeal}
                variant="saved"
                title={meal.strMeal}
                category="MealDB"
                description="Found by selected ingredients"
                imageUrl={meal.strMealThumb}
              />
            ))
          ) : (
            <>
              <Alert variant="danger">No recipes found for "{searchLabel}".</Alert>
              {renderRandomRecommendations("Try one of these instead")}
            </>
          )}
        </Scrollable>
      ) : (
        renderRandomRecommendations("Need inspiration?")
      )}
    </Container>
  );
}
