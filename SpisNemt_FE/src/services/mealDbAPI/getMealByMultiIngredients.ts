const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

export const getMealByMultiIngredients = async (ingredients: string[]) => {
  try {
    const query = ingredients.join(",");
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${query}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.meals ?? [];
  } catch (error) {
    console.error("Error fetching meals by ingredients:", error);
    throw error;
  }
};
