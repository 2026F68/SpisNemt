import React from "react";
import PillFilter from "../../components/buttons/PillFilter";
import RecipeCard from "../../components/cards/RecipeCard";
import Container from "../../components/structural/Container";
import { Scrollable } from "../../components/structural/Scrollable";
import Subtitle from "../../components/typograghy/Subtitle";
import Title from "../../components/typograghy/Title";

import { cuisines } from "../../mock/cuisines";
import { recipes } from "../../mock/recipes";

import {
  GoogleSignin,
  GoogleSigninButton,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";

const webClientId = process.env.EXPO_PUBLIC_WEB_ID;
const iosClientId = process.env.EXPO_PUBLIC_IOS_ID;

GoogleSignin.configure({
  webClientId,
  scopes: ["profile", "email"], // what API you want to access on behalf of the user, default is email and profile
  offlineAccess: Boolean(webClientId), // if you want to access Google API on behalf of the user FROM YOUR SERVER
  forceCodeForRefreshToken: false,
  iosClientId,
});

const GoogleLogin = async () => {
  // check if users' device has google play services
  await GoogleSignin.hasPlayServices();

  // initiates signIn process
  const userInfo = await GoogleSignin.signIn();
  return userInfo;
};

const processUserData = async (
  idToken: string,
  user: unknown,
): Promise<void> => {
  console.log("Google sign-in success", {
    idToken,
    user,
  });
};

const googleSignIn = async () => {
  try {
    const response = await GoogleLogin();

    // retrieve user data
    const { idToken, user } = response.data ?? {};
    if (idToken) {
      await processUserData(idToken, user); // Server call to validate the token & process the user data for signing In
    }
  } catch (error) {
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          console.log("Google sign-in cancelled");
          break;
        case statusCodes.IN_PROGRESS:
          console.log("Google sign-in already in progress");
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          console.log("Google Play Services not available or outdated");
          break;
        default:
          console.log("Google sign-in error", error);
      }
    } else {
      console.log("Unexpected error", error);
    }
  }
};

export default function Index() {
  const [category, setCategory] = React.useState<string[]>([]);

  return (
    <>
      <Container>
        <Title>Home</Title>
        <Subtitle>Recommended</Subtitle>
        <Scrollable horizontal>
          {recipes.map((recipe, index) => (
            <RecipeCard
              key={index}
              title={recipe.title}
              category={recipe.category}
              description={recipe.description}
              imageUrl={recipe.imageUrl}
            />
          ))}
        </Scrollable>

        <GoogleSigninButton onPress={googleSignIn} />

        <Subtitle>Categories</Subtitle>
        <Scrollable horizontal>
          {cuisines.map((cuisine, index) => (
            <PillFilter
              key={index}
              title={cuisine.title}
              onPress={() => {
                setCategory(
                  category === null
                    ? [cuisine.title]
                    : category.includes(cuisine.title)
                      ? category.filter((c) => c !== cuisine.title)
                      : [...category, cuisine.title],
                );
              }}
              active={category !== null && category.includes(cuisine.title)}
            />
          ))}
        </Scrollable>
        <Scrollable horizontal>
          {recipes
            .filter(
              (recipe) =>
                category.length === 0 || category.includes(recipe.category),
            )
            .map((recipe, index) => (
              <RecipeCard
                key={index}
                title={recipe.title}
                category={recipe.category}
                description={recipe.description}
                imageUrl={recipe.imageUrl}
              />
            ))}
        </Scrollable>
      </Container>
    </>
  );
}
