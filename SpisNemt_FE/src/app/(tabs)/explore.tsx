import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import {
  classifyIngredientFromUri,
  initIngredientClassifier,
} from "../../services/ml/ingredientClassifier";
import { scoreRecipeMatch } from "../../services/ml/preferencesMatcher";
import { loadUserPreferences } from "../../services/databaseAPI/Preferences";
import { useAuth } from "../../context/AuthContext";
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
  cameraActionRow: {
    marginTop: 8,
    marginBottom: 4,
  },
});

export default function Explore() {
  const { user } = useAuth();
  const [draft, setDraft] = useState("");
  const [terms, setTerms] = useState<string[]>([]);
  const [submittedTerms, setSubmittedTerms] = useState<string[]>([]);
  const [hasSubmittedSearch, setHasSubmittedSearch] = useState(false);
  const [results, setResults] = useState<MealDbMeal[]>([]);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [randomRecipe, setRandomRecipe] = useState<MealDbMeal[]>([]);
  const [randomMatchScores, setRandomMatchScores] = useState<Map<string, number>>(new Map());
  const [userPrefs, setUserPrefs] = useState<{ area: string[]; category: string[] } | null>(null);

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

  useEffect(() => {
    if (!user) return;
    loadUserPreferences(user.id)
      .then((prefs) => setUserPrefs(prefs))
      .catch(() => setUserPrefs(null));
  }, [user]);

  useEffect(() => {
    if (randomRecipe.length === 0 || !userPrefs) return;
    if (userPrefs.area.length === 0 && userPrefs.category.length === 0) return;

    void (async () => {
      const entries = await Promise.all(
        randomRecipe.map(async (meal) => {
          try {
            const score = await scoreRecipeMatch(meal, userPrefs);
            return [meal.idMeal, score] as [string, number];
          } catch {
            return [meal.idMeal, 0] as [string, number];
          }
        }),
      );
      setRandomMatchScores(new Map(entries));
    })();
  }, [randomRecipe, userPrefs]);
  const [isClassifierReady, setIsClassifierReady] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);
  const [classifierError, setClassifierError] = useState<string | null>(null);
  const [classifierFeedback, setClassifierFeedback] = useState<string | null>(null);
  const [showSlowLoadHint, setShowSlowLoadHint] = useState(false);

  const cameraRef = useRef<CameraView>(null);

  const normalizeTerm = (raw: string) => raw.trim().toLowerCase();

  const addTerm = (raw: string) => {
    const term = normalizeTerm(raw);
    if (!term) return;

    setTerms((prev) => (prev.includes(term) ? prev : [...prev, term]));
  };

  const removeTerm = (termToRemove: string) => {
    setTerms((prev) => prev.filter((t) => t !== termToRemove));
  };

  const initializeModel = useCallback(async () => {
    setShowSlowLoadHint(false);

    try {
      await initIngredientClassifier();
      setIsClassifierReady(true);
      setClassifierError(null);
    } catch (error) {
      console.error("Ingredient classifier initialization failed:", error);
      const details = error instanceof Error ? error.message : String(error);
      setClassifierError(`Could not load ingredient classifier. ${details}`);
    }
  }, []);

  useEffect(() => {
    void initializeModel();
  }, [initializeModel]);

  useEffect(() => {
    if (isClassifierReady || classifierError) {
      setShowSlowLoadHint(false);
      return;
    }

    const timeout = setTimeout(() => {
      setShowSlowLoadHint(true);
    }, 10_000);

    return () => clearTimeout(timeout);
  }, [classifierError, isClassifierReady]);

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

  const handleSnapAndClassify = async () => {
    if (!cameraRef.current || isClassifying || !isClassifierReady) return;

    try {
      setIsClassifying(true);
      setClassifierError(null);
      setClassifierFeedback(null);

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });

      const prediction = await classifyIngredientFromUri(photo.uri);
      addTerm(prediction.normalizedTerm);
      setClassifierFeedback(
        `Detected ${prediction.label} (${(prediction.confidence * 100).toFixed(1)}%).`,
      );
    } catch (error) {
      console.error("Ingredient classification failed:", error);
      const details = error instanceof Error ? error.message : String(error);
      setClassifierError(`Could not classify the captured image. ${details}`);
    } finally {
      setIsClassifying(false);
    }
  };

  const searchLabel = submittedTerms.join(", ");

  const sortedRandomRecipe = randomMatchScores.size > 0
    ? [...randomRecipe].sort(
        (a, b) => (randomMatchScores.get(b.idMeal) ?? 0) - (randomMatchScores.get(a.idMeal) ?? 0),
      )
    : randomRecipe;

  const renderRandomRecommendations = (heading: string) => (
    <>
      <Subtitle>{heading}</Subtitle>
      <Scrollable>
        {sortedRandomRecipe.length > 0 ? (
          sortedRandomRecipe.map((meal) => (
            <RecipeCard
              key={meal.idMeal}
              variant="saved"
              title={meal.strMeal}
              category={meal.strCategory}
              description="Recommended for you"
              imageUrl={meal.strMealThumb}
              isRecommended={(randomMatchScores.get(meal.idMeal) ?? 0) >= 0.45}
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
        <>
          <View style={styles.cameraContainer}>
            <CameraView ref={cameraRef} style={styles.camera} facing={facing} />
          </View>

          <View style={styles.cameraActionRow}>
            <Button
              title={isClassifying ? "Classifying..." : "Snap ingredient"}
              onPress={handleSnapAndClassify}
              disabled={isClassifying || !isClassifierReady}
            />
            {!isClassifierReady && (
              <Paragraph>Loading ingredient classifier...</Paragraph>
            )}
            {!isClassifierReady && showSlowLoadHint && !classifierError && (
              <Paragraph>
                First load can take up to a minute on some phones.
              </Paragraph>
            )}
            {classifierFeedback && <Alert variant="success">{classifierFeedback}</Alert>}
            {classifierError && <Alert variant="danger">{classifierError}</Alert>}
            {classifierError && (
              <Button
                title="Retry classifier load"
                onPress={() => void initializeModel()}
              />
            )}
          </View>
        </>
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
                category={meal.strCategory}
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
