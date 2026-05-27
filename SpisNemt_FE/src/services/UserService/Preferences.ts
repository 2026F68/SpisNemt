import { getUserProfile } from "./getUserProfile";
import { saveUserPreferences as saveUserPreferencesDocument } from "./saveUserPreferences";
import { saveUserSavedRecipes } from "./saveUserSavedRecipes";
import type { UserIdentity } from "./types";

export interface UserPreferencesDocument {
  area: string[];
  category: string[];
}

export async function loadUserPreferences(userId: string) {
  const profile = await getUserProfile(userId);

  if (!profile) {
    return null;
  }

  return {
    area: profile.preferences.area,
    category: profile.preferences.category,
  };
}

export async function saveUserPreferences(
  user: UserIdentity,
  area: string[],
  category: string[],
) {
  await saveUserPreferencesDocument(user, area, category);
}

export { saveUserSavedRecipes };

