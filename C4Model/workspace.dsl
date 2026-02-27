workspace "My System" "C4 model via Structurizr Lite" {

  model {
    user = person "User" "A user of SpisNemt"

    SpisNemt  = softwareSystem "SpisNemt" "Allows users to receive recipes based on their ingriedients and preferences" {
      Database = container "Database" "Firebase noSQL" "NoSQL database for user preferences and saved recipes" {
        tags "Database"
      }

      MobileApp = container "Mobile app" "description" "Expo for iOS and Android" {
        tags "Mobile App"
          MachineLearningModel = component "Machine Learning Model" "Python-based model for recipe recommendations" "something"{
            tags "ML Model"
          }
          
          OAuthService = component "Sign in Controller" "Handles user authentication" "OAuth"{
            tags "OAuth Service"
          }

          SavedRecipes = component "Saved Recipes Controller" "Handles saving and retrieving user's saved recipes" "something"{
            tags "Saved Recipes"
          }
          
          MachineLearningModel -> Database "Fetches user preferences" "HTTPS/REST"
      }

      MobileApp -> Database "Reads from and writes to" "HTTPS/REST"
    }


    TheMealDB = softwareSystem "TheMealDB" "External API for recipes" {
      tags "External"
    }


    user -> SpisNemt "Uses"
    user -> MobileApp "Uses"
    MobileApp -> TheMealDB "Fetches recipes from" "HTTP/REST"
  }

  views {
    systemContext SpisNemt "SystemContext" {
      include *
      autolayout lr
    }
 
    container SpisNemt "Containers" {
      include *
      autolayout lr
    }

      component MobileApp "Components" {
        include *
        autolayout lr
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
