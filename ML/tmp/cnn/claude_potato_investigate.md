Q: I also need to know something about my conversion of my other model, which is         trained in @ML/Learning_with_fred.ipynb. I have converted it in colab with a          loooong script, and beisdes it performing really bad in terms of speed. it also       right now only predicts potatoes with about 10% certainty. In the jupyter book, 
I trained it really well and it predicts very accurately what its being shown in
the notebook, but when embedded in tfjs it is extremely bad.                   
          
I have put the script I used for conversion into @ML/tmp/tfjs_image_converter.ipynb.
                                                                                
Could you review what might have gone wrong that could cause the image 
classifier to just be a slow potato guesser?                                    

Based on what I can see in the conversation context — specifically the                ingredientClassifier.ts service and the model architecture described during
exploration — there are several likely culprits. Here are the most probable           causes, roughly in order of likelihood:
                                                                                
---
1. Missing Preprocessing Normalization (Almost Certainly the Main Issue)

InceptionV3 was trained on ImageNet with pixels normalized to [-1, 1] using       
preprocess_input, which does:
x = x / 127.5 - 1.0

Looking at the TypeScript service (ingredientClassifier.ts), the input preparation
is:
tf.image.resizeBilinear(imageTensor, [299, 299]).expandDims(0).toFloat()

.toFloat() converts uint8 [0, 255] to float32 [0.0, 255.0] — it does NOT normalize
to [-1, 1]. The model receives values ~128x larger than it expects. This alone is
enough to completely destroy predictions. The model's internal weights were      
optimized for a completely different input scale.

The "always guesses potato at ~10% confidence" pattern is classic: when inputs are
wildly out of distribution, softmax output collapses toward near-uniform (1/15 ≈ 
6.7%) with one class slightly winning by noise — that class happens to be Potato. 

Fix in TypeScript:
tf.image.resizeBilinear(imageTensor, [299, 299])
.expandDims(0)
.toFloat()
.div(127.5)
.sub(1.0)

---
2. Data Augmentation Layers Included in the Exported Model

The training notebook builds the model as:
model = Sequential([
data_augmentation,   # <-- RandomFlip, RandomRotation, etc.
InceptionV3(...),
GlobalAveragePooling2D(),
Dropout(0.2),
Dense(15, activation='softmax')
])

If data_augmentation is part of the model when saved and converted, the TFJS graph
model may not correctly handle the training/inference mode distinction for those 
layers. In practice this can cause random flips/rotations to be applied at        
inference time, degrading accuracy.

Fix: Strip augmentation layers before export:
inference_model = tf.keras.Sequential(model.layers[1:])  # skip data_augmentation 
inference_model.save("incep_model_export.keras")

---
3. Conversion Format Mismatch

The conversion command matters. Using --input_format=keras with
--output_format=tfjs_graph_model should work, but if the script used
tfjs_layers_model format, the loadGraphModel call in ingredientClassifier.ts would
silently fail or produce garbage output (it expects a graph model).

Check that the model.json contains "format": "graph-model" and that loadGraphModel
is used (not loadLayersModel).

---
4. Speed: InceptionV3 is Simply Too Big for Mobile TFJS

83 MB / 21 weight shards, ~23M parameters. TFJS in React Native doesn't benefit   
from GPU acceleration the way native TensorFlow does — it runs on the CPU via the 
plain JS backend. InceptionV3 doing a forward pass in pure JS on a phone will be  
slow regardless. This isn't a conversion bug, it's an architecture choice.        

If speed is critical, MobileNetV3-Small (4–6 MB, ~2M params) is the standard      
recommendation for on-device mobile inference and can match InceptionV3 accuracy  
on small datasets with transfer learning.

---
Summary

Fix #1 (normalization) first — it almost certainly explains both the accuracy     
collapse and the "potato" behavior. Fix #2 (strip augmentation) as a follow-up.   
The speed issue requires a lighter backbone if it's a priority.