workspace "My System" {

  model {
    user = person "User"

    SpisNemtApp  = softwareSystem "SpisNemtApp" {

      UI = container "UI" {
        tags "Mobile App"
          HomeScreen = component "HomeScreen" {
            tags "ML Model"
          }

          ExploreScreen = component "ExploreScreen" {
            tags "ML Model"
          }

          SavedRecipesScreen = component "SavedRecipesScreen" {
            tags "ML Model"
          }

          AccountScreen = component "AccountScreen" {
            tags "ML Model"
          }

          InceptionV3 = component "ComputerVision" {
            tags "ML Model"
          }
      }

      Backend = container "Backend" {
        tags "Backend"
          SignInController = component "SignInController" {
            tags "Auth"
          }

          RecipeRecommender = component "RecipeRecommender" {
            tags "Service"
          }

          PreferenceService = component "PreferenceService" {
            tags "Service"
          }
      }

      MealDBService = container "MealDBService" {
        test = component "API Client" {
          tags "API Client"
        }
      }

      UserService = container "UserService" {
        test1 = component "API Client" {
          tags "API Client"
        }
      }
    }

    Database = softwareSystem "Database" {
        tags "External", "Database"
    }

    TheMealDB = softwareSystem "TheMealDB" {
      tags "External"
    }

    //Context
    user -> SpisNemtApp

    //Container
    user -> UI
    UI -> Backend
    UserService -> Database
    Backend -> TheMealDB
    MealDBService -> TheMealDB

    //Component -  Backend
    SignInController -> UserService
    RecipeRecommender -> PreferenceService
    UI -> SignInController
    RecipeRecommender -> UI
    PreferenceService -> MealDBService

    //Component - UI
    HomeScreen -> MealDBService
    ExploreScreen -> MealDBService
    SavedRecipesScreen -> MealDBService
    AccountScreen -> UserService
    SavedRecipesScreen -> UserService
    ExploreScreen -> InceptionV3
  }

  views {
    systemContext SpisNemtApp "SystemContext" {
      include *
    }
 
    container SpisNemtApp "Containers" {
      include *
      exclude "relationship.source==UI && relationship.destination==UserService"
      exclude "relationship.source==Backend && relationship.destination==UI"
    }

    component UI "UIComponents" {
      include *
      include Database
      include TheMealDB
      
    }

    component Backend "BackendComponents" {
      include *
      include UserService
      include Database
      include TheMealDB
      exclude "relationship.source==UI && relationship.destination==UserService"
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
      element "Backend" {
        background #4a90e2
        color white
      }
    }

    theme default
  }
}
