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

  const data = snapshot.data() as Partial<UserProfileDocument>;

  return {
    email: data.email ?? "",
    name: data.name ?? null,
    preferences: {
      area: data.preferences?.area ?? [],
      category: data.preferences?.category ?? [],
    },
    savedRecipes: data.savedRecipes ?? [],
    updatedAt: data.updatedAt,
  };
}
