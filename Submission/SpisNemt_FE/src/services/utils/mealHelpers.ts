export function extractIngredients(meal: Record<string, unknown>): string[] {
  return Array.from({ length: 20 }, (_, index) => meal[`strIngredient${index + 1}`] as string)
    .map((ingredient) => ingredient?.trim())
    .filter(Boolean) as string[];
}

export default extractIngredients;
