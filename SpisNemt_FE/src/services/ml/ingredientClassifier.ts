/* eslint-disable @typescript-eslint/no-require-imports */
import * as tf from "@tensorflow/tfjs";
import * as tfReactNative from "@tensorflow/tfjs-react-native";
import type { io } from "@tensorflow/tfjs";
import { toByteArray } from "base64-js";
import * as RNFS from "react-native-fs";

export interface IngredientPrediction {
  label: string;
  normalizedTerm: string;
  confidence: number;
}

// Keep label order aligned with your training generator class order.
const MODEL_LABELS = [
  "Bean",
  "Bitter_Gourd",
  "Bottle_Gourd",
  "Brinjal",
  "Broccoli",
  "Cabbage",
  "Capsicum",
  "Carrot",
  "Cauliflower",
  "Cucumber",
  "Papaya",
  "Potato",
  "Pumpkin",
  "Radish",
  "Tomato",
] as const;

const LABEL_TO_SEARCH_TERM: Record<string, string> = {
  Bean: "beans",
  Bitter_Gourd: "bitter gourd",
  Bottle_Gourd: "bottle gourd",
  Brinjal: "eggplant",
  Broccoli: "broccoli",
  Cabbage: "cabbage",
  Capsicum: "bell pepper",
  Carrot: "carrot",
  Cauliflower: "cauliflower",
  Cucumber: "cucumber",
  Papaya: "papaya",
  Potato: "potato",
  Pumpkin: "pumpkin",
  Radish: "radish",
  Tomato: "tomato",
};

let modelPromise: Promise<tf.GraphModel> | null = null;
const INIT_TIMEOUT_MS = 45_000;

const modelJson = require("../../ml/CNN/content/tfjs_incep_model/model.json");
const modelWeights = [
  require("../../ml/CNN/content/tfjs_incep_model/group1-shard1of21.bin"),
  require("../../ml/CNN/content/tfjs_incep_model/group1-shard2of21.bin"),
  require("../../ml/CNN/content/tfjs_incep_model/group1-shard3of21.bin"),
  require("../../ml/CNN/content/tfjs_incep_model/group1-shard4of21.bin"),
  require("../../ml/CNN/content/tfjs_incep_model/group1-shard5of21.bin"),
  require("../../ml/CNN/content/tfjs_incep_model/group1-shard6of21.bin"),
  require("../../ml/CNN/content/tfjs_incep_model/group1-shard7of21.bin"),
  require("../../ml/CNN/content/tfjs_incep_model/group1-shard8of21.bin"),
  require("../../ml/CNN/content/tfjs_incep_model/group1-shard9of21.bin"),
  require("../../ml/CNN/content/tfjs_incep_model/group1-shard10of21.bin"),
  require("../../ml/CNN/content/tfjs_incep_model/group1-shard11of21.bin"),
  require("../../ml/CNN/content/tfjs_incep_model/group1-shard12of21.bin"),
  require("../../ml/CNN/content/tfjs_incep_model/group1-shard13of21.bin"),
  require("../../ml/CNN/content/tfjs_incep_model/group1-shard14of21.bin"),
  require("../../ml/CNN/content/tfjs_incep_model/group1-shard15of21.bin"),
  require("../../ml/CNN/content/tfjs_incep_model/group1-shard16of21.bin"),
  require("../../ml/CNN/content/tfjs_incep_model/group1-shard17of21.bin"),
  require("../../ml/CNN/content/tfjs_incep_model/group1-shard18of21.bin"),
  require("../../ml/CNN/content/tfjs_incep_model/group1-shard19of21.bin"),
  require("../../ml/CNN/content/tfjs_incep_model/group1-shard20of21.bin"),
  require("../../ml/CNN/content/tfjs_incep_model/group1-shard21of21.bin"),
];

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
    throw new Error("Model JSON asset is invalid or missing.");
  }

  const invalidWeightIndex = modelWeights.findIndex(
    (weightAsset) => typeof weightAsset !== "number",
  );

  if (invalidWeightIndex !== -1) {
    throw new Error(
      `Model weight shard #${invalidWeightIndex + 1} could not be bundled.`,
    );
  }
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, context: string) {
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

export async function initIngredientClassifier() {
  if (modelPromise) {
    await withTimeout(
      modelPromise,
      INIT_TIMEOUT_MS,
      "Ingredient classifier initialization",
    );
    return;
  }

  modelPromise = (async () => {
    try {
      validateBundledModelAssets();
      await tf.ready();
      return tf.loadGraphModel(
        tfReactNative.bundleResourceIO(
          modelJson,
          modelWeights as unknown as number[],
        ),
      );
    } catch (error) {
      modelPromise = null;
      throw new Error(
        `Failed to initialize ingredient classifier: ${getErrorMessage(error)}`,
      );
    }
  })();

  try {
    await withTimeout(
      modelPromise,
      INIT_TIMEOUT_MS,
      "Ingredient classifier initialization",
    );
  } catch (error) {
    modelPromise = null;
    throw error;
  }
}

function labelToSearchTerm(label: string): string {
  return LABEL_TO_SEARCH_TERM[label] ?? label.toLowerCase().replaceAll("_", " ");
}

function normalizeLocalUri(uri: string): string {
  return uri.startsWith("file://") ? uri.slice("file://".length) : uri;
}

async function readImageBytesFromUri(imageUri: string): Promise<Uint8Array> {
  try {
    const response = await tfReactNative.fetch(imageUri, {}, { isBinary: true });
    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  } catch {
    try {
      const response = await fetch(imageUri);
      const arrayBuffer = await response.arrayBuffer();
      return new Uint8Array(arrayBuffer);
    } catch {
      const rawPath = normalizeLocalUri(imageUri);
      const base64Data = await RNFS.readFile(rawPath, "base64");
      return toByteArray(base64Data);
    }
  }
}

export async function classifyIngredientFromUri(imageUri: string): Promise<IngredientPrediction> {
  try {
    if (!modelPromise) {
      await initIngredientClassifier();
    }

    const currentModelPromise = modelPromise;
    if (!currentModelPromise) {
      throw new Error("Ingredient classifier is not initialized.");
    }

    const model = await currentModelPromise;

    const imageData = await readImageBytesFromUri(imageUri);

    const imageTensor = tfReactNative.decodeJpeg(imageData, 3);
    const inputTensor = tf.tidy(() => {
      // InceptionV3 expects [1, 299, 299, 3].
      return tf.image.resizeBilinear(imageTensor, [299, 299]).expandDims(0).toFloat();
    });

    const outputTensor = model.predict(inputTensor) as tf.Tensor;
    const outputData = await outputTensor.data();

    imageTensor.dispose();
    inputTensor.dispose();
    outputTensor.dispose();

    let maxIndex = 0;
    for (let i = 1; i < outputData.length; i += 1) {
      if (outputData[i] > outputData[maxIndex]) {
        maxIndex = i;
      }
    }

    const label = MODEL_LABELS[maxIndex] ?? `class_${maxIndex}`;
    return {
      label,
      normalizedTerm: labelToSearchTerm(label),
      confidence: outputData[maxIndex] ?? 0,
    };
  } catch (error) {
    throw new Error(
      `Failed to classify ingredient image: ${getErrorMessage(error)}`,
    );
  }
}
