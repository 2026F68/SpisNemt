import { serverTimestamp, setDoc } from "firebase/firestore";
import { userProfileDocRef } from "./refs";
import type { UserIdentity } from "./types";

export async function saveUserPreferences(
  user: UserIdentity,
  area: string[],
  category: string[],
) {
  await setDoc(
    userProfileDocRef(user.id),
    {
      email: user.email,
      name: user.name,
      preferences: {
        area,
        category,
      },
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}
