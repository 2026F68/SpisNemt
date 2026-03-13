export const get10RandomMeals = async () => {
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/randomselection.php`);
    
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