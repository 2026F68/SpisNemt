import { TextInput, View } from "react-native";
import Container from "../components/structural/Container";
import Title from "../components/typograghy/Title";
import React from "react";
import Paragraph from "../components/typograghy/Paragraph";
import Button from "../components/buttons/Button";
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

import { useState } from 'react';
import { Scrollable } from "../components/structural/Scrollable";
import RecipeCard from "../components/cards/RecipeCard";
import { formTheme } from "../components/forms/FormTheme";

import { recipes } from "../mock/recipes";
import SearchInput from "../components/forms/SearchInput";
import { globalColors } from "../theme";
import Alert from "../components/typograghy/Alert";

export default function Explore() {
  const [query, setQuery] = useState('');
  const [facing, setFacing] = React.useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();

  const [cameraOpen, setCameraOpen] = React.useState(false);

  const filteredRecipes = recipes.filter(recipe =>
    query.toLowerCase() === '' ||
    recipe.ingredients.some(ingredient =>
      ingredient.toLowerCase().includes(query.toLowerCase())
    )
  );

  if (!permission) {
    // Camera permissions are still loading
    return <Paragraph>Requesting camera permission...</Paragraph>;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <Container>

        <Paragraph>We need your permission to show the camera</Paragraph>
        <Button onPress={requestPermission} title="Grant permission" />

      </Container>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <Container>
      <Title>Explore</Title>

      <SearchInput
        placeholder="Search..."
        value={query}
        onChangeText={setQuery}
        actionButtonOnPress={() => setCameraOpen(current => !current)}
      />

      {query && query.length > 0 && (
        <Scrollable horizontal>
        {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe, index) => (
              <RecipeCard
                key={index}
                title={recipe.title}
                category={recipe.category}
                description={recipe.description}
                imageUrl={recipe.imageUrl}
              />
            ))
          ) : (
            <Alert variant="danger">
              No recipes found for "{query}"
            </Alert>
          )}
        </Scrollable>
      )}

      {!query && (
        <Paragraph>Search for recipes by typing ingredients above.</Paragraph>
      )}

      {cameraOpen && (
        <CameraView style={{ flex: 1, marginTop: 20 }} facing={facing} />
      )}

    </Container>
  );
}