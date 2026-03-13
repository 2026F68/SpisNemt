export const getRandomMeal = async () => {
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.meals[0]; 
  } catch (error) {
    console.error("Error fetching from MealDB:", error);
    throw error; 
  }
};