"""
convert_to_tfjs.py  —  Run this in Google Colab

Converts a trained Keras InceptionV3 model to TensorFlow.js format.

Key improvements over the previous conversion script:
  1. Rebuilds a clean inference-only model by rewiring existing layer objects
     directly — no clone_model surgery, no set_weights risk.
  2. Drops --quantize_float16, which was the primary cause of low-confidence
     predictions. Weights are kept in full float32.
  3. Optionally produces a uint8-quantized variant for size comparison.
     (uint8 typically degrades accuracy far less than float16 for classification.)

Usage:
  1. Upload your trained incep_model.keras to /content/ in Colab.
  2. Run each cell in order.
  3. Download /content/tfjs_model_f32.zip and replace the files under
     SpisNemt_FE/src/ml/CNN/content/tfjs_incep_model/.
"""

# ── Cell 1: Install tensorflowjs ──────────────────────────────────────────────
# !pip install tensorflowjs --quiet

# ── Cell 2: Imports ───────────────────────────────────────────────────────────
import os
import shutil

import numpy as np
import tensorflow as tf
from tensorflow.keras import layers
from tensorflow.keras.applications.inception_v3 import preprocess_input

print("TensorFlow:", tf.__version__)

# ── Cell 3: Load the trained model ────────────────────────────────────────────
MODEL_PATH = "/content/incep_model.keras"

print("Loading model from", MODEL_PATH, "...")
model = tf.keras.models.load_model(
    MODEL_PATH,
    custom_objects={"preprocess_input": preprocess_input},
)
model.summary()

# ── Cell 4: Inspect layer indices ─────────────────────────────────────────────
# The trained Sequential has this structure:
#   [0] sequential      — data_augmentation (RandomFlip, RandomRotation, RandomZoom)
#   [1] lambda          — inception_v3.preprocess_input  ([0,255] → [-1,1])
#   [2] inception_v3    — frozen InceptionV3 backbone
#   [3] global_average_pooling2d
#   [4] dropout
#   [5] dense           — Dense(num_classes, softmax)
#
# Print them so you can confirm the indices match before continuing.
print("\nLayer index  |  Name  |  Type")
print("-" * 60)
for i, layer in enumerate(model.layers):
    print(f"  [{i}]  {layer.name:<35} {type(layer).__name__}")

# ── Cell 5: Build a clean inference model ─────────────────────────────────────
# We reuse the existing layer objects directly (weights are shared by reference).
# This is safer than clone_model + set_weights because there is nothing to copy
# — the same Python objects are wired into the new graph.
#
# The augmentation Sequential ([0]) is dropped entirely. At inference time those
# layers are no-ops anyway, but the TFJs converter cannot handle RandomFlip /
# RandomRotation / RandomZoom, so we must exclude them.

inception_v3_layer = model.layers[2]
gap_layer          = model.layers[3]
dropout_layer      = model.layers[4]
dense_layer        = model.layers[5]

inp = tf.keras.Input(shape=(299, 299, 3), name="image_input")
x   = layers.Lambda(preprocess_input, name="preprocess")(inp)
x   = inception_v3_layer(x, training=False)
x   = gap_layer(x)
x   = dropout_layer(x, training=False)
out = dense_layer(x)

inference_model = tf.keras.Model(inp, out, name="inceptionv3_inference")
inference_model.summary()

# ── Cell 6: Quick sanity-check ────────────────────────────────────────────────
# Run a dummy forward pass to make sure nothing is broken before export.
dummy = np.zeros((1, 299, 299, 3), dtype=np.float32)
pred  = inference_model.predict(dummy, verbose=0)
assert pred.shape == (1, 15), f"Unexpected output shape: {pred.shape}"
print("Sanity check passed — output shape:", pred.shape)

# ── Cell 7: (Optional) compare against original model ─────────────────────────
# Uncomment to verify the inference model produces identical predictions.
#
# pred_orig      = model.predict(dummy, verbose=0)
# pred_inference = inference_model.predict(dummy, verbose=0)
# max_diff = np.max(np.abs(pred_orig - pred_inference))
# print(f"Max prediction difference: {max_diff:.2e}")  # Should be ~0

# ── Cell 8: Export to SavedModel ──────────────────────────────────────────────
SAVED_MODEL_DIR = "/content/saved_model_dir"
shutil.rmtree(SAVED_MODEL_DIR, ignore_errors=True)

print("Exporting to SavedModel format ...")
inference_model.export(SAVED_MODEL_DIR)
print("Export complete.")

# ── Cell 9: Convert to TensorFlow.js (float32 — full precision) ───────────────
TFJS_F32_DIR = "/content/tfjs_model_f32"
shutil.rmtree(TFJS_F32_DIR, ignore_errors=True)

print("Converting to TFJs (float32) ...")
os.system(
    f"tensorflowjs_converter "
    f"--input_format=tf_saved_model "
    f"{SAVED_MODEL_DIR} "
    f"{TFJS_F32_DIR}"
)

if os.path.exists(os.path.join(TFJS_F32_DIR, "model.json")):
    print("SUCCESS — float32 model written to", TFJS_F32_DIR)
else:
    print("ERROR — model.json not found. Check converter output above.")

# ── Cell 10: (Optional) uint8-quantized variant for size comparison ────────────
# uint8 is ~4× smaller than float32 but typically degrades accuracy much less
# than float16. Uncomment and run if bundle size is a concern; then compare
# confidence scores against the float32 model before deciding which to ship.
#
# TFJS_UINT8_DIR = "/content/tfjs_model_uint8"
# shutil.rmtree(TFJS_UINT8_DIR, ignore_errors=True)
# os.system(
#     f"tensorflowjs_converter "
#     f"--input_format=tf_saved_model "
#     f"--quantize_uint8 "
#     f"{SAVED_MODEL_DIR} "
#     f"{TFJS_UINT8_DIR}"
# )
# if os.path.exists(os.path.join(TFJS_UINT8_DIR, "model.json")):
#     print("SUCCESS — uint8 model written to", TFJS_UINT8_DIR)

# ── Cell 11: Zip and download ─────────────────────────────────────────────────
ZIP_PATH = "/content/tfjs_model_f32.zip"
if os.path.exists(ZIP_PATH):
    os.remove(ZIP_PATH)

os.system(f"zip -r -q {ZIP_PATH} {TFJS_F32_DIR}")
print(f"Zipped to {ZIP_PATH}")

# In Colab, download via:
# from google.colab import files
# files.download(ZIP_PATH)

# ── Deployment instructions ───────────────────────────────────────────────────
print("""
=== Next steps ===
1. Download tfjs_model_f32.zip from Colab.
2. Unzip and copy all files into:
     SpisNemt_FE/src/ml/CNN/content/tfjs_incep_model/
   (replace model.json and all .bin shards)
3. No changes needed in ingredientClassifier.ts —
   preprocessing and label mapping are already correct.
""")
