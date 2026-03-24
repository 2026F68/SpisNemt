export const getAllCategories = async () => {
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?c=list
`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.categories ?? [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
