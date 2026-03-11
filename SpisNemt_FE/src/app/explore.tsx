import { TextInput, View } from "react-native";
import Container from "../components/structural/Container";
import Title from "../components/typograghy/Title";
import React, { useMemo } from "react";
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
import PillFilter from "../components/buttons/PillFilter";

export default function Explore() {
  const [draft, setDraft] = useState('');
  const [terms, setTerms] = useState<string[]>([]);

  const [facing, setFacing] = React.useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();

  const [cameraOpen, setCameraOpen] = React.useState(false);

  const filteredRecipes = useMemo(() => {
    if (terms.length === 0 && !draft.trim()) return recipes;

    const activeTerms = draft.trim()
      ? [...terms, draft.trim().toLowerCase()]
      : terms;

    return recipes.filter((recipe) =>
      activeTerms.every((term) =>
        recipe.ingredients.some((ingredient) =>
          ingredient.toLowerCase().includes(term)
        )
      )
    );
  }, [terms, draft]);

  const hasActiveSearch = terms.length > 0 || draft.trim().length > 0;

  const searchLabel = draft.trim()
    ? [...terms, draft.trim()].join(", ")
    : terms.join(", ");

  const addTerm = (raw: string) => {
    const term = raw.trim().toLowerCase();
    if (!term) return;
    setTerms((prev) => (prev.includes(term) ? prev : [...prev, term]));
  };

  const removeTerm = (termToRemove: string) => {
    setTerms((prev) => prev.filter((t) => t !== termToRemove));
  };

  const handleDraftChange = (text: string) => {
    // If user typed whitespace, finalize previous word as a chip
    if (/\s$/.test(text)) {
      addTerm(text);
      setDraft("");
      return;
    }
    setDraft(text);
  };

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
        placeholder="Type ingredient and press space..."
        value={draft}
        onChangeText={handleDraftChange}
        actionButtonOnPress={() => setCameraOpen((current) => !current)}
      />

      {terms.length > 0 && (
        <Scrollable horizontal>
          {terms.map((term) => (
            <PillFilter
              key={term}
              title={term}
              onPress={() => removeTerm(term)} // tap chip to remove
              active
            />
          ))}
        </Scrollable>
      )}

      {hasActiveSearch && (
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
              No recipes found for "{searchLabel}"
            </Alert>
          )}
        </Scrollable>
      )}

      {!hasActiveSearch && (
        <Paragraph>Search for recipes by typing ingredients above.</Paragraph>
      )}

      {cameraOpen && (
        <CameraView style={{ flex: 1, marginTop: 20 }} facing={facing} />
      )}

    </Container>
  );
} 