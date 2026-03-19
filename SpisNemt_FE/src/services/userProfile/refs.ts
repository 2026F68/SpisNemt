import { doc } from "firebase/firestore";
import { db } from "../../lib/firebase";

const USERS_COLLECTION = "users";

export function userProfileDocRef(userId: string) {
  return doc(db, USERS_COLLECTION, userId);
}
