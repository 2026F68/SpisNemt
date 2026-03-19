import { getUserProfile } from "./userProfile/getUserProfile";
import { saveUserPreferences as saveUserPreferencesDocument } from "./userProfile/saveUserPreferences";
import { saveUserSavedRecipes } from "./userProfile/saveUserSavedRecipes";
import type { UserIdentity } from "./userProfile/types";

export interface UserPreferencesDocument {
  preferences: string[];
  allergies: string[];
}

export async function loadUserPreferences(userId: string) {
  const profile = await getUserProfile(userId);

  if (!profile) {
    return null;
  }

  return {
    preferences: profile.preferences.area,
    allergies: profile.preferences.category,
  };
}

export async function saveUserPreferences(
  user: UserIdentity,
  preferences: string[],
  allergies: string[],
) {
  await saveUserPreferencesDocument(user, preferences, allergies);
}

export { saveUserSavedRecipes };

