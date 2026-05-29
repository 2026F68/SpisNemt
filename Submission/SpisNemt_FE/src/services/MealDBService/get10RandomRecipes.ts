const API_KEY = process.env.EXPO_PUBLIC_MEALDB_API_KEY;

export const get10RandomRecipes = async () => {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v2/${API_KEY}/randomselection.php`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.meals;
  } catch (error) {
    console.error("Error fetching from MealDB:", error);
    throw error;
  }
};
