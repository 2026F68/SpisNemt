import {
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { auth } from "../../firebaseConfig";
import { createUserProfile } from "../services/databaseAPI/createUserProfile";

interface AuthContextValue {
  isAuthenticated: boolean;
  isInitializing: boolean;
  isLoading: boolean;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  createAccount: (
    email: string,
    password: string,
    name: string,
  ) => Promise<void>;
  signOut: () => Promise<void>;
}

interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || "",
          name: firebaseUser.displayName || firebaseUser.email || "",
          picture: firebaseUser.photoURL || undefined,
        });
      } else {
        setUser(null);
      }
      setIsInitializing(false);
    });

    return unsubscribe;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (error) {
      console.error("Sign in failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createAccount = useCallback(
    async (email: string, password: string, name: string) => {
      try {
        setIsLoading(true);
        // Check whether the email already has sign-in methods to provide a clearer message
        const methods = await fetchSignInMethodsForEmail(auth, email.trim()).catch(() => []);
        if (methods && methods.length > 0) {
          const err: any = new Error("Email already in use");
          err.code = "auth/email-already-in-use";
          throw err;
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password,
        );
        await updateProfile(userCredential.user, { displayName: name });
        await createUserProfile({
          id: userCredential.user.uid,
          email: userCredential.user.email || email.trim(),
          name,
        });
      } catch (error) {
        console.error("Create account failed:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const signOut = useCallback(async () => {
    try {
      setIsLoading(true);
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Sign out failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(user),
      isInitializing,
      isLoading,
      user,
      signIn,
      createAccount,
      signOut,
    }),
    [createAccount, isInitializing, isLoading, signIn, signOut, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
