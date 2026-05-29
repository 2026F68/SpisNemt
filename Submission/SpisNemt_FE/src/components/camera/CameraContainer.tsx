import Button from "@/src/components/buttons/Button";
import Alert from "@/src/components/typograghy/Alert";
import Paragraph from "@/src/components/typograghy/Paragraph";
import { CameraType, CameraView } from "expo-camera";
import { RefObject } from "react";
import { View } from "react-native";
import { exploreTheme } from "../explore/ExploreTheme";

interface CameraContainerProps {
  cameraRef: RefObject<CameraView | null>;
  facing: CameraType;
  isClassifying: boolean;
  isClassifierReady: boolean;
  showSlowLoadHint: boolean;
  classifierFeedback: string | null;
  classifierError: string | null;
  onSnap: () => void;
  onRetryLoad: () => void;
}

export default function CameraContainer({
  cameraRef,
  facing,
  isClassifying,
  isClassifierReady,
  showSlowLoadHint,
  classifierFeedback,
  classifierError,
  onSnap,
  onRetryLoad,
}: CameraContainerProps) {
  return (
    <>
      <View style={exploreTheme.cameraContainer}>
        <CameraView ref={cameraRef} style={exploreTheme.camera} facing={facing} />
      </View>

      <View style={exploreTheme.cameraActionRow}>
        <Button
          title={isClassifying ? "Classifying..." : "Snap ingredient"}
          onPress={onSnap}
          disabled={isClassifying || !isClassifierReady}
        />
        {!isClassifierReady && <Paragraph>Loading ingredient classifier...</Paragraph>}
        {!isClassifierReady && showSlowLoadHint && !classifierError && (
          <Paragraph>First load can take up to a minute on some phones.</Paragraph>
        )}
        {classifierFeedback && <Alert variant="success">{classifierFeedback}</Alert>}
        {classifierError && <Alert variant="danger">{classifierError}</Alert>}
        {classifierError && (
          <Button title="Retry classifier load" onPress={onRetryLoad} />
        )}
      </View>
    </>
  );
}