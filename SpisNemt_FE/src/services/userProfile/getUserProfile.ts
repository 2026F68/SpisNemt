import { getDoc } from "firebase/firestore";
import { userProfileDocRef } from "./refs";
import type { UserProfileDocument } from "./types";

export async function getUserProfile(
  userId: string,
): Promise<UserProfileDocument | null> {
  const snapshot = await getDoc(userProfileDocRef(userId));

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data() as Partial<UserProfileDocument> & {
    preferences?:
      | {
          area?: unknown;
          category?: unknown;
        }
      | unknown;
    allergies?: unknown;
  };

  const rawPreferences =
    typeof data.preferences === "object" && data.preferences
      ? data.preferences
      : {};

  const area = Array.isArray((rawPreferences as { area?: unknown }).area)
    ? ((rawPreferences as { area: string[] }).area ?? [])
    : Array.isArray(data.preferences)
      ? (data.preferences as string[])
      : [];

  const category = Array.isArray(
    (rawPreferences as { category?: unknown }).category,
  )
    ? ((rawPreferences as { category: string[] }).category ?? [])
    : Array.isArray(data.allergies)
      ? (data.allergies as string[])
      : [];

  return {
    email: data.email ?? "",
    name: data.name ?? null,
    preferences: {
      area,
      category,
    },
    savedRecipes: Array.isArray(data.savedRecipes) ? data.savedRecipes : [],
    updatedAt: data.updatedAt,
  };
}
