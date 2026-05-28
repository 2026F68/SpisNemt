import { getUserProfile } from "./getUserProfile";
import { saveUserSavedRecipes as saveUserSavedRecipesDocument } from "./saveUserSavedRecipes";
import type { UserIdentity } from "./types";

export interface UserRecipesDocument {
  savedRecipes: number[];
}

export async function loadUserSavedRecipes(userId: string) {
  const profile = await getUserProfile(userId);

  if (!profile) {
    return null;
  }

  return {
    savedRecipes: profile.savedRecipes,
  };
}

export async function saveUserSavedRecipes(
  user: UserIdentity,
  savedRecipes: number[],
) {
  await saveUserSavedRecipesDocument(user, savedRecipes);
}
