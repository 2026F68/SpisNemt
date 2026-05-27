import { doc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const USERS_COLLECTION = "users";

export function userProfileDocRef(userId: string) {
  return doc(db, USERS_COLLECTION, userId);
}
