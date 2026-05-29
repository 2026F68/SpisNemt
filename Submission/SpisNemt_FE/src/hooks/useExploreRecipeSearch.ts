import { get10RandomRecipes } from "@/src/services/MealDBService/get10RandomRecipes";
import { getRecipeDetailsById } from "@/src/services/MealDBService/getRecipeDetailsById";
import { getRecipesByMultiIngredients } from "@/src/services/MealDBService/getRecipesByMultiIngredients";
import { loadUserPreferences } from "@/src/services/UserService/Preferences";
import { scoreRecipeMatch } from "@/src/services/ml/preferencesMatcher";
import limitedMap from "@/src/utils/asyncUtils";
import { extractIngredients } from "@/src/services/utils/mealHelpers";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";

export interface ExploreRecipeMeal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea?: string;
  description?: string;
  tags?: string[];
  full?: unknown;
  matchScore?: number;
}

interface UserPreferences {
  area: string[];
  category: string[];
}

const SEARCH_RESULT_CONCURRENCY = 4;
const SEARCH_RESULT_LIMIT = 12;

function normalizeTerm(raw: string) {
  return raw.trim().toLowerCase();
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

// concurrency-limited mapping has been moved to `src/utils/asyncUtils.ts` as `limitedMap`

async function scoreMeals(
  meals: ExploreRecipeMeal[],
  prefs: UserPreferences,
): Promise<Map<string, number>> {
  const entries = await Promise.all(
    meals.map(async (meal) => {
      try {
        const score = await scoreRecipeMatch(meal, prefs);
        return [meal.idMeal, score] as [string, number];
      } catch {
        return [meal.idMeal, 0] as [string, number];
      }
    }),
  );

  return new Map(entries);
}

// ingredient extraction moved to `src/services/utils/mealHelpers.ts` as `extractIngredients`

export function useExploreRecipeSearch(userId?: string) {
  const [draft, setDraft] = useState("");
  const [terms, setTerms] = useState<string[]>([]);
  const [submittedTerms, setSubmittedTerms] = useState<string[]>([]);
  const [hasSubmittedSearch, setHasSubmittedSearch] = useState(false);
  const [results, setResults] = useState<ExploreRecipeMeal[]>([]);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [randomRecipe, setRandomRecipe] = useState<ExploreRecipeMeal[]>([]);
  const [randomMatchScores, setRandomMatchScores] = useState<Map<string, number>>(new Map());
  const [searchMatchScores, setSearchMatchScores] = useState<Map<string, number>>(new Map());
  const [userPrefs, setUserPrefs] = useState<UserPreferences | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);

  const addTerm = useCallback((raw: string) => {
    const term = normalizeTerm(raw);
    if (!term) return;

    setTerms((prev) => (prev.includes(term) ? prev : [...prev, term]));
  }, []);

  const removeTerm = useCallback((termToRemove: string) => {
    setTerms((prev) => prev.filter((term) => term !== termToRemove));
  }, []);

  const handleDraftChange = useCallback(
    (text: string) => {
      if (/\s$/.test(text)) {
        addTerm(text);
        setDraft("");
        return;
      }

      setDraft(text);
    },
    [addTerm],
  );

  const loadRandomRecipe = useCallback(async () => {
    try {
      const meals = await get10RandomRecipes();
      setRandomRecipe(
        (meals || []).map((meal: any) => ({
          ...meal,
          description: meal.description,
          tags: meal.tags,
        })),
      );
    } catch (error) {
      console.error("Error fetching random recipe:", error);
    }
  }, []);

  useEffect(() => {
    void loadRandomRecipe();
  }, [loadRandomRecipe]);

  useEffect(() => {
    if (!userId) return;

    loadUserPreferences(userId)
      .then((prefs) => setUserPrefs(prefs))
      .catch(() => setUserPrefs(null));
  }, [userId]);

  useEffect(() => {
    if (randomRecipe.length === 0 || !userPrefs) return;
    if (userPrefs.area.length === 0 && userPrefs.category.length === 0) return;

    const loadScores = async () => {
      const scores = await scoreMeals(randomRecipe, userPrefs);
      setRandomMatchScores(scores);
    };

    void loadScores();
  }, [randomRecipe, userPrefs]);

  useEffect(() => {
    if (results.length === 0 || !userPrefs) {
      setSearchMatchScores(new Map());
      return;
    }

    if (userPrefs.area.length === 0 && userPrefs.category.length === 0) {
      setSearchMatchScores(new Map());
      return;
    }

    const loadScores = async () => {
      const scores = await scoreMeals(results, userPrefs);
      setSearchMatchScores(scores);
    };

    void loadScores();
  }, [results, userPrefs]);

  const sortedRandomRecipe = useMemo(
    () =>
      randomMatchScores.size > 0
        ? [...randomRecipe].sort(
            (a, b) =>
              (randomMatchScores.get(b.idMeal) ?? 0) -
              (randomMatchScores.get(a.idMeal) ?? 0),
          )
        : randomRecipe,
    [randomMatchScores, randomRecipe],
  );

  const sortedSearchResults = useMemo(
    () =>
      searchMatchScores.size > 0
        ? [...results].sort(
            (a, b) =>
              (searchMatchScores.get(b.idMeal) ?? 0) -
              (searchMatchScores.get(a.idMeal) ?? 0),
          )
        : results,
    [results, searchMatchScores],
  );

  const displayedSearchResults = useMemo(
    () => sortedSearchResults.slice(0, SEARCH_RESULT_LIMIT),
    [sortedSearchResults],
  );

  const searchLabel = useMemo(() => submittedTerms.join(", "), [submittedTerms]);

  const submitSearch = useCallback(async () => {
    const draftTerm = normalizeTerm(draft);
    const nextTerms = draftTerm && !terms.includes(draftTerm) ? [...terms, draftTerm] : terms;

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

      const meals = (await getRecipesByMultiIngredients(nextTerms)) as ExploreRecipeMeal[];
      const shouldScoreSearchResults =
        !!userPrefs && (userPrefs.area.length > 0 || userPrefs.category.length > 0);

      const enrichedAndScored = await limitedMap(
        (meals || []).slice(0, SEARCH_RESULT_LIMIT) as ExploreRecipeMeal[],
        SEARCH_RESULT_CONCURRENCY,
        async (meal, index) => {
          let enrichedMeal: ExploreRecipeMeal;

          try {
            const details = await getRecipeDetailsById(meal.idMeal);
            enrichedMeal = {
              ...meal,
              strCategory: details?.strCategory ?? meal.strCategory,
              strArea: details?.strArea,
              description: details?.strInstructions?.slice(0, 200) ?? "",
              tags: details?.strTags
                ? details.strTags.split(",").map((tag: string) => tag.trim())
                : [],
              full: details ?? null,
            };
          } catch (error) {
            console.error("Error enriching recipe details:", getErrorMessage(error));
            enrichedMeal = {
              ...meal,
              description: "",
              tags: [],
              full: null,
            };
          }

          if (!shouldScoreSearchResults || !userPrefs) {
            return {
              meal: {
                ...enrichedMeal,
                matchScore: undefined,
              },
              index,
            };
          }

          try {
            const score = await scoreRecipeMatch(enrichedMeal, userPrefs);
            return {
              meal: {
                ...enrichedMeal,
                matchScore: score,
              },
              index,
            };
          } catch {
            return {
              meal: {
                ...enrichedMeal,
                matchScore: 0,
              },
              index,
            };
          }
        },
      );

      const sortedResults = enrichedAndScored
        .sort((a, b) => {
          const scoreDiff = (b.meal.matchScore ?? -1) - (a.meal.matchScore ?? -1);
          if (scoreDiff !== 0) return scoreDiff;
          return a.index - b.index;
        })
        .map(({ meal }) => meal);

      setResults(sortedResults);
    } catch (error) {
      console.error("Search failed:", getErrorMessage(error));
      setResults([]);
      setSearchError("Something went wrong while searching for recipes.");
    } finally {
      setIsLoadingResults(false);
    }
  }, [draft, terms, userPrefs]);

  const openMeal = useCallback((meal: ExploreRecipeMeal) => {
    router.push({
      pathname: "/SingleRecipe",
      params: {
        idMeal: meal.idMeal,
        title: meal.strMeal,
        category: meal.strCategory,
        imageUrl: meal.strMealThumb,
        ingredients: JSON.stringify(extractIngredients((meal.full as Record<string, unknown>) ?? meal)),
        instructions:
          (meal.full as { strInstructions?: string } | null)?.strInstructions ?? meal.description ?? "",
        description: meal.description ?? "",
      },
    });
  }, []);

  return {
    draft,
    terms,
    addTerm,
    removeTerm,
    handleDraftChange,
    submitSearch,
    searchLabel,
    cameraOpen,
    setCameraOpen,
    hasSubmittedSearch,
    isLoadingResults,
    searchError,
    randomRecipe: sortedRandomRecipe,
    displayedSearchResults,
    randomMatchScores,
    searchMatchScores,
    openMeal,
  };
}