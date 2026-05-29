import { classifyIngredientFromUri, initIngredientClassifier } from "@/src/services/ml/ingredientClassifier";
import { CameraView } from "expo-camera";
import { useCallback, useEffect, useRef, useState } from "react";

const INIT_TIMEOUT_MS = 10_000;

export function useIngredientClassifier() {
  const cameraRef = useRef<CameraView>(null);
  const [isClassifierReady, setIsClassifierReady] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);
  const [classifierError, setClassifierError] = useState<string | null>(null);
  const [classifierFeedback, setClassifierFeedback] = useState<string | null>(null);
  const [showSlowLoadHint, setShowSlowLoadHint] = useState(false);

  const initializeModel = useCallback(async () => {
    setShowSlowLoadHint(false);

    try {
      await initIngredientClassifier();
      setIsClassifierReady(true);
      setClassifierError(null);
    } catch (error) {
      const details = error instanceof Error ? error.message : String(error);
      setClassifierError(`Could not load ingredient classifier. ${details}`);
    }
  }, []);

  useEffect(() => {
    void initializeModel();
  }, [initializeModel]);

  useEffect(() => {
    if (isClassifierReady || classifierError) {
      setShowSlowLoadHint(false);
      return;
    }

    const timeout = setTimeout(() => {
      setShowSlowLoadHint(true);
    }, INIT_TIMEOUT_MS);

    return () => clearTimeout(timeout);
  }, [classifierError, isClassifierReady]);

  const handleSnapAndClassify = useCallback(
    async (onIngredientDetected: (term: string) => void) => {
      if (!cameraRef.current || isClassifying || !isClassifierReady) return;

      try {
        setIsClassifying(true);
        setClassifierError(null);
        setClassifierFeedback(null);

        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
        });

        const prediction = await classifyIngredientFromUri(photo.uri);
        onIngredientDetected(prediction.normalizedTerm);
        setClassifierFeedback(
          `Detected ${prediction.label} (${(prediction.confidence * 100).toFixed(1)}%).`,
        );
      } catch (error) {
        const details = error instanceof Error ? error.message : String(error);
        setClassifierError(`Could not classify the captured image. ${details}`);
      } finally {
        setIsClassifying(false);
      }
    },
    [isClassifying, isClassifierReady],
  );

  return {
    cameraRef,
    isClassifierReady,
    isClassifying,
    classifierError,
    classifierFeedback,
    showSlowLoadHint,
    initializeModel,
    handleSnapAndClassify,
  };
}