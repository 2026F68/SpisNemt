const BASE_URL = "https://www.themealdb.com/api/json/v2";

const API_KEY = process.env.EXPO_PUBLIC_MEALDB_API_KEY;

export const getRecipeDetailsById = async (id: string) => {
  try {
    const response = await fetch(`${BASE_URL}/${API_KEY}/lookup.php?i=${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // lookup returns { meals: [ { ... } ] } or { meals: null }
    return (data.meals && data.meals[0]) || null;
  } catch (error) {
    console.error("Error fetching recipe details:", error);
    throw error;
  }
};
