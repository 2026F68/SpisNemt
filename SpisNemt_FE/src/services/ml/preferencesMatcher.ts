/* eslint-disable @typescript-eslint/no-require-imports */
import type { io } from "@tensorflow/tfjs";
import * as tf from "@tensorflow/tfjs";
import * as tfReactNative from "@tensorflow/tfjs-react-native";

export interface MealForScoring {
  strCategory?: string;
  strArea?: string;
}

export interface UserPreferences {
  area: string[];
  category: string[];
}

let modelPromise: Promise<tf.LayersModel> | null = null;
const INIT_TIMEOUT_MS = 10_000;

const modelJson = require("../../ml/mlp/model.json");
const modelWeights = [require("../../ml/mlp/group1-shard1of1.bin")];

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

function isModelJson(value: unknown): value is io.ModelJSON {
  if (!value || typeof value !== "object") {
    return false;
  }
  return "modelTopology" in value && "weightsManifest" in value;
}

function validateBundledModelAssets() {
  if (typeof modelJson !== "number" && !isModelJson(modelJson)) {
    throw new Error(
      "Preference matcher model.json asset is invalid or missing.",
    );
  }

  const invalidWeightIndex = modelWeights.findIndex(
    (weightAsset) => typeof weightAsset !== "number",
  );

  if (invalidWeightIndex !== -1) {
    throw new Error(
      `Preference matcher weight shard #${invalidWeightIndex + 1} could not be bundled.`,
    );
  }
}

function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  context: string,
) {
  let timeoutHandle: ReturnType<typeof setTimeout> | null = null;

  const timeoutPromise = new Promise<T>((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(
        new Error(
          `${context} timed out after ${Math.floor(timeoutMs / 1000)} seconds.`,
        ),
      );
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle);
    }
  }) as Promise<T>;
}

export async function initPreferencesMatcher() {
  if (modelPromise) {
    await withTimeout(
      modelPromise,
      INIT_TIMEOUT_MS,
      "Preference matcher initialization",
    );
    return;
  }

  modelPromise = (async () => {
    try {
      validateBundledModelAssets();
      await tf.ready();
      return tf.loadLayersModel(
        tfReactNative.bundleResourceIO(
          modelJson,
          modelWeights as unknown as number[],
        ),
      );
    } catch (error) {
      modelPromise = null;
      throw new Error(
        `Failed to initialize preference matcher: ${getErrorMessage(error)}`,
      );
    }
  })();

  try {
    await withTimeout(
      modelPromise,
      INIT_TIMEOUT_MS,
      "Preference matcher initialization",
    );
  } catch (error) {
    modelPromise = null;
    throw error;
  }
}

export async function scoreRecipeMatch(
  meal: MealForScoring,
  prefs: UserPreferences,
): Promise<number> {
  try {
    if (!modelPromise) {
      await initPreferencesMatcher();
    }

    const currentModelPromise = modelPromise;
    if (!currentModelPromise) {
      throw new Error("Preference matcher is not initialized.");
    }

    const model = await currentModelPromise;

    const areaMatch =
      prefs.area.length > 0 && prefs.area.includes(meal.strArea ?? "")
        ? 1.0
        : 0.0;
    const catMatch =
      prefs.category.length > 0 &&
      prefs.category.includes(meal.strCategory ?? "")
        ? 1.0
        : 0.0;

    // 4-float input: [area_match, cat_match, area_norm, cat_norm]
    const inputData = Float32Array.from([
      areaMatch,
      catMatch,
      areaMatch,
      catMatch,
    ]);
    const inputTensor = tf.tensor2d(inputData, [1, 4]);

    const outputTensor = model.predict(inputTensor) as tf.Tensor;
    const outputData = await outputTensor.data();

    inputTensor.dispose();
    outputTensor.dispose();

    return outputData[0] ?? 0;
  } catch (error) {
    throw new Error(`Failed to score recipe match: ${getErrorMessage(error)}`);
  }
}
