import { serverTimestamp, setDoc } from "firebase/firestore";
import { userProfileDocRef } from "./refs";
import type { UserIdentity } from "./types";

export async function createUserProfile(user: UserIdentity) {
  await setDoc(
    userProfileDocRef(user.id),
    {
      email: user.email,
      name: user.name,
      preferences: {
        area: [],
        category: [],
      },
      savedRecipes: [],
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}
