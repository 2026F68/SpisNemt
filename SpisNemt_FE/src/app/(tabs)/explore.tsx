import { CameraType, useCameraPermissions } from "expo-camera";
import React from "react";
import Button from "../../components/buttons/Button";
import ExploreCameraPanel from "../../components/camera/CameraContainer";
import ExploreRecipeSection from "../../components/cards/RecipeContainer";
import ExploreSearchPanel from "../../components/forms/SearchContainer";
import Container from "../../components/structural/Container";
import Alert from "../../components/typograghy/Alert";
import Paragraph from "../../components/typograghy/Paragraph";
import Title from "../../components/typograghy/Title";
import { useAuth } from "../../context/AuthContext";
import { useExploreRecipeSearch } from "../../hooks/useExploreRecipeSearch";
import { useIngredientClassifier } from "../../hooks/useIngredientClassifier";

export default function Explore() {
  const { user } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const search = useExploreRecipeSearch(user?.id);
  const classifier = useIngredientClassifier();
  const facing: CameraType = "back";

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

      <ExploreSearchPanel
        draft={search.draft}
        terms={search.terms}
        onDraftChange={search.handleDraftChange}
        onRemoveTerm={search.removeTerm}
        onSubmitSearch={search.submitSearch}
        onToggleCamera={() => search.setCameraOpen((current) => !current)}
      />

      {search.cameraOpen && (
        <ExploreCameraPanel
          cameraRef={classifier.cameraRef}
          facing={facing}
          isClassifying={classifier.isClassifying}
          isClassifierReady={classifier.isClassifierReady}
          showSlowLoadHint={classifier.showSlowLoadHint}
          classifierFeedback={classifier.classifierFeedback}
          classifierError={classifier.classifierError}
          onSnap={() => void classifier.handleSnapAndClassify(search.addTerm)}
          onRetryLoad={classifier.initializeModel}
        />
      )}

      {search.hasSubmittedSearch ? (
        <>
          {search.isLoadingResults ? (
            <Paragraph>Searching recipes...</Paragraph>
          ) : search.searchError ? (
            <Alert variant="danger">{search.searchError}</Alert>
          ) : search.displayedSearchResults.length > 0 ? (
            <ExploreRecipeSection
              heading="Search results"
              meals={search.displayedSearchResults}
              onPressMeal={search.openMeal}
              emptyMessage=""
              getDescription={(meal) => meal.description ?? "Found by selected ingredients"}
              getMatchScore={(meal) => search.searchMatchScores.get(meal.idMeal)}
            />
          ) : (
            <>
              <Alert variant="danger">No recipes found for &quot;{search.searchLabel}&quot;.</Alert>
              <ExploreRecipeSection
                heading="Try one of these instead"
                meals={search.randomRecipe}
                onPressMeal={search.openMeal}
                emptyMessage="Loading recommendations..."
                getDescription={() => "Recommended for you"}
                getMatchScore={(meal) => search.randomMatchScores.get(meal.idMeal)}
              />
            </>
          )}
        </>
      ) : (
        <ExploreRecipeSection
          heading="Need inspiration?"
          meals={search.randomRecipe}
          onPressMeal={search.openMeal}
          emptyMessage="Loading recommendations..."
          getDescription={() => "Recommended for you"}
          getMatchScore={(meal) => search.randomMatchScores.get(meal.idMeal)}
        />
      )}
    </Container>
  );
}