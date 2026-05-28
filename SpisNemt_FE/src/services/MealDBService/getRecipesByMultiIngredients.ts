const BASE_URL = "https://www.themealdb.com/api/json/v2";

const API_KEY = process.env.EXPO_PUBLIC_MEALDB_API_KEY;

export const getRecipesByMultiIngredients = async (ingredients: string[]) => {
  try {
    const query = ingredients.join(",");
    const response = await fetch(`${BASE_URL}/${API_KEY}/filter.php?i=${query}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.meals ?? [];
  } catch (error) {
    console.error("Error fetching recipes by ingredients:", error);
    throw error;
  }
};
