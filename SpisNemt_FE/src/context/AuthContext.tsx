import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: GoogleUser | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

interface GoogleUser {
  id: string;
  name: string | null;
  email: string;
  photo: string | null;
  familyName: string | null;
  givenName: string | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const webClientId = process.env.EXPO_PUBLIC_WEB_ID;
const iosClientId = process.env.EXPO_PUBLIC_IOS_ID;

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId,
      scopes: ["profile", "email"],
      offlineAccess: Boolean(webClientId),
      forceCodeForRefreshToken: false,
      iosClientId,
    });

    const currentUser = GoogleSignin.getCurrentUser();
    setUser(currentUser?.user ?? null);
    setIsLoading(false);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    await GoogleSignin.hasPlayServices();

    const response = await GoogleSignin.signIn();
    const signedInUser = response.data?.user ?? null;
    setUser(signedInUser);

    const idToken = response.data?.idToken;
    if (idToken) {
      console.log("Google sign-in success", {
        idToken,
        user: signedInUser,
      });
    }
  }, []);

  const signOut = useCallback(async () => {
    await GoogleSignin.signOut();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(user),
      isLoading,
      user,
      signInWithGoogle,
      signOut,
    }),
    [isLoading, signInWithGoogle, signOut, user],
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
