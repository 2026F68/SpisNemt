workspace "My System" {

  model {
    user = person "User"{
      tags "FontStyle"
    }

    SpisNemtApp  = softwareSystem "SpisNemtApp" {
      tags "FontStyle"

      UI = container "UI" {
        tags "FontStyle"
          HomeScreen = component "HomeScreen" {
            tags "FontStyle"
          }

          ExploreScreen = component "ExploreScreen" {
            tags "FontStyle"
          }

          SavedRecipesScreen = component "SavedRecipesScreen" {
            tags "FontStyle"
          }

          AccountScreen = component "AccountScreen" {
            tags "FontStyle"
          }

          InceptionV3 = component "ComputerVision" {
            tags "FontStyle"
          }

          LoginScreen = component "LoginScreen" {
            tags "FontStyle"
          }

          CreateAccountScreen = component "CreateAccountScreen" {
            tags "FontStyle"
          }
      }

      Backend = container "Backend" {
        tags "FontStyle"
          SignInController = component "SignInController" {
            tags "FontStyle"
          }

          RecipeRecommender = component "RecipeRecommender" {
            tags "FontStyle"
          }

          PreferenceService = component "PreferenceService" {
            tags "FontStyle"
          }
      }

      MealDBService = container "MealDBService" {
        tags "FontStyle"
      }

      UserService = container "UserService" {
        tags "FontStyle"
      }
    }

    Database = softwareSystem "Database" {
        tags "External", "Database", "FontStyle"
    }

    TheMealDB = softwareSystem "TheMealDB" {
      tags "External", "FontStyle"
    }

    //Context
    user -> SpisNemtApp

    //Container
    user -> UI
    UI -> Backend
    MealDBService -> TheMealDB
    UserService -> Database

    //Component -  Backend
    //SignInController -> UserService
    RecipeRecommender -> PreferenceService
    UI -> SignInController
    UI -> UserService
    RecipeRecommender -> UI
    UserService -> SignInController
    //PreferenceService -> MealDBService

    //Component - UI
    HomeScreen -> MealDBService
    ExploreScreen -> MealDBService
    SavedRecipesScreen -> MealDBService
    AccountScreen -> UserService
    SavedRecipesScreen -> UserService
    ExploreScreen -> InceptionV3
    Backend ->  Database
    LoginScreen -> Backend
    CreateAccountScreen -> Backend
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
      include Backend
      include Database
      include TheMealDB
    }

    component Backend "BackendComponents" {
      include *
      include UserService
      include Database
      include TheMealDB
      include MealDBService
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
      element "FontStyle" {
        fontsize 40
      }

    }

    theme default
  }
}
