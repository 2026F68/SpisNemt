# SpisNemt — Thesis Submission (Group 20226F68)

Group: 20226F68

Members:
- Rasmus Thykjær Pedersen
- Frederick Lykkegaard Nielsen

Project structure
-----------------
- `C4Model/`  Contains architecture diagrams and Structurizr workspace files used to describe the system (e.g., workspace.dsl, workspace.json).
- `ML/` Contains Machine learning notebooks. Contains model training, conversion scripts and Jupyter notebooks used for the ingredient classifier and preference matcher.
- `SpisNemt_FE/` Contains the Frontend application (React / React Native with Expo). Key items:
  - `tsconfig.json`, app configuration and assets.
  - `src/app/` Contains App routes and UI pages.
  - `src/components/` Contains Reusable UI components (cards, forms, camera container, etc.).
  - `src/services/` Contains API and ML service wrappers (MealDB integration, ingredient classifier, preferences matcher, user profile and saved recipes management).
  - `src/ml/` Contains Bundled ML models used by the app (CNN/MLP model artifacts).
  - `src/hooks/` Contains Custom hooks for ML inference and recipe search.

How to read this repo
---------------------
- To review the system architecture, open the files in `C4Model/`.
- For the ML, see the notebooks in `ML/` (e.g., `InceptionV3_ingred_classify.ipynb`).
- The working application code and components are in `SpisNemt_FE/`. Start by reading `src/app/_layout.tsx` and `src/components/` to understand UI flow.
