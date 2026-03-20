import { serverTimestamp, setDoc } from "firebase/firestore";
import { userProfileDocRef } from "./refs";
import type { UserIdentity } from "./types";

export async function saveUserSavedRecipes(
  user: UserIdentity,
  savedRecipes: number[],
) {
  await setDoc(
    userProfileDocRef(user.id),
    {
      email: user.email,
      name: user.name,
      savedRecipes,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}
