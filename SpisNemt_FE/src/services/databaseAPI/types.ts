export interface UserIdentity {
  id: string;
  email: string;
  name: string | null;
}

export interface UserProfileDocument {
  email: string;
  name: string | null;
  preferences: {
    area: string[];
    category: string[];
  };
  savedRecipes: number[];
  updatedAt?: unknown;
}
