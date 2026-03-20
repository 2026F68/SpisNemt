import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import React, { useMemo, useState } from "react";
import Button from "../../components/buttons/Button";
import Container from "../../components/structural/Container";
import Paragraph from "../../components/typograghy/Paragraph";
import Title from "../../components/typograghy/Title";
import RecipeCard from "../../components/cards/RecipeCard";
import { Scrollable } from "../../components/structural/Scrollable";
import PillFilter from "../../components/buttons/PillFilter";
import SearchInput from "../../components/forms/SearchInput";
import Alert from "../../components/typograghy/Alert";
import { recipes } from "../../mock/recipes";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  chipContainer: {
    height: 48,
    justifyContent: "center",
    marginBottom: 12,
  },
  chipScroll: {
    marginBottom: 8,
    paddingBottom: 0,
    flexGrow: 0,
    maxHeight: 48,
  },
  chipScrollContent: {
    alignItems: "center",
  },

  cameraContainer: {
    marginTop: 12,
    height: 320,
    borderRadius: 12,
    overflow: "hidden",
  },
  camera: {
    flex: 1,
  },
});

export default function Explore() {
  const [draft, setDraft] = useState("");
  const [terms, setTerms] = useState<string[]>([]);
  const [submittedTerms, setSubmittedTerms] = useState<string[]>([]);
  const [hasSubmittedSearch, setHasSubmittedSearch] = useState(false);

  const [facing, setFacing] = React.useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraOpen, setCameraOpen] = React.useState(false);

  const normalizeTerm = (raw: string) => raw.trim().toLowerCase();

  const addTerm = (raw: string) => {
    const term = normalizeTerm(raw);
    if (!term) return;

    setTerms((prev) => (prev.includes(term) ? prev : [...prev, term]));
  };

  const removeTerm = (termToRemove: string) => {
    setTerms((prev) => prev.filter((t) => t !== termToRemove));
  };

  const submitSearch = () => {
    const draftTerm = normalizeTerm(draft);
    const nextTerms =
      draftTerm && !terms.includes(draftTerm) ? [...terms, draftTerm] : terms;

    if (draftTerm) {
      setTerms(nextTerms);
      setDraft("");
    }

    setSubmittedTerms(nextTerms);
    setCameraOpen(false);
    setHasSubmittedSearch(true);
  };

  const handleDraftChange = (text: string) => {
    // Typing space creates chip, but does NOT run search yet.
    if (/\s$/.test(text)) {
      addTerm(text);
      setDraft("");
      return;
    }
    setDraft(text);
  };

  const filteredRecipes = useMemo(() => {
    if (!hasSubmittedSearch || submittedTerms.length === 0) return [];

    return recipes.filter((recipe) =>
      submittedTerms.every((term) =>
        recipe.ingredients.some((ingredient) =>
          ingredient.toLowerCase().includes(term),
        ),
      ),
    );
  }, [submittedTerms, hasSubmittedSearch]);

  const searchLabel = submittedTerms.join(", ");


  if (!permission) {
    return <Paragraph>Requesting camera permission...</Paragraph>;
  }

  if (!permission.granted) {
    return (
      <Container>
        <Title>Camera Access Needed</Title>
        <Paragraph>Please grant camera permission to use the search feature.</Paragraph>
        <Button onPress={requestPermission} title="Grant permission" />
      </Container>
    );
  }

  return (
    <Container>
      <Title>Explore</Title>

      <SearchInput
        placeholder="Type and press space..."
        value={draft}
        onChangeText={handleDraftChange}
        onSubmitEditing={submitSearch}
        actionButtonOnPress={() => {
          setCameraOpen((current) => !current);
        }}
      />



      <View style={styles.chipContainer}>
        {terms.length > 0 && (
          <Scrollable horizontal style={styles.chipScroll} contentContainerStyle={styles.chipScrollContent}>
            {terms.map((term) => (
              <PillFilter
                key={term}
                title={term}
                onPress={() => removeTerm(term)}
                active
              />
            ))}
          </Scrollable>
        )}
      </View>


      {cameraOpen && (
        <View style={styles.cameraContainer}>
          <CameraView style={styles.camera} facing={facing} />
        </View>
      )}

      {hasSubmittedSearch && (
        <Scrollable>
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe, index) => (
              <RecipeCard
                key={index}
                variant="saved"
                title={recipe.title}
                category={recipe.category}
                description={recipe.description}
                imageUrl={recipe.imageUrl}
              />
            ))
          ) : (
            <>
              <Alert variant="danger">No recipes found for "{searchLabel}".</Alert>
            </>
          )}
        </Scrollable>
      )}



    </Container>
  );
}