workspace "My System" "C4 model via Structurizr Lite" {

  model {
    user = person "User" "A user of SpisNemt"

    SpisNemt  = softwareSystem "SpisNemt" "Allows users to receive recipes based on their ingriedients and preferences" {

      MobileApp = container "Mobile app" "description" "Expo for iOS and Android" {
        tags "Mobile App"
          InceptionV3 = component "Ingredient scanner" "Inception V3 machine learning moddel for ingredient recognition" "TensorFlow.js"{
            tags "ML Model"
          }

          MLP = component "Recipe recommender" "Multi-layer perceptron machine learning model for recipe recommendation" "TensorFlow.js"{
            tags "ML Model"
          }
          
          OAuthService = component "Sign in Controller" "Handles user authentication" "Firebase Auth"{
            tags "OAuth Service"
          }

          SavedRecipes = component "Saved Recipes Controller" "Handles saving and retrieving user's saved recipes" "something"{
            tags "Saved Recipes"
          }

          NativeHardware = component "Native Hardware Controller" "Handles native hardware interactions like camera and haptic engine" "something"{
            tags "Native Hardware"
          }
      }
    }

    Database = softwareSystem "Database" "External NoSQL Firebase database for user preferences and saved recipes" {
        tags "External", "Database"
    }

    TheMealDB = softwareSystem "TheMealDB" "External API for recipes" {
      tags "External"
    }


    user -> SpisNemt "Uses"
    user -> MobileApp "Uses"
    MobileApp -> TheMealDB "Fetches recipes from" "HTTP/REST"
    MobileApp -> Database "Reads from and writes to" "HTTP/REST"
    SavedRecipes -> Database "Reads from and writes to" "HTTPS/REST"
    OAuthService -> Database "Reads from and writes to" "HTTPS/REST"
    MLP -> Database "Reads user preferences from" "HTTPS/REST"
    MLP -> TheMealDB "Fetches recipes from" "HTTP/REST"
    NativeHardware -> InceptionV3 "Sends ingredient images to" "?"
    InceptionV3 -> MLP "Sends ingredients to" "?"
  }

  views {
    systemContext SpisNemt "SystemContext" {
      include *
    }
 
    container SpisNemt "Containers" {
      include *
    }

      component MobileApp "Components" {
        include *
      }

    styles {
      element "External" {
        background lightgrey
        color black
        stroke grey
      }
      element "Database" {
        shape Cylinder
      }
    }

    theme default
  }
}
