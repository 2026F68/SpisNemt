export const getAllAreas = async () => {
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list
`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.areas ?? [];
  } catch (error) {
    console.error("Error fetching areas:", error);
    throw error;
  }
};
