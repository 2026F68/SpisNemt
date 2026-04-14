workspace "My System" {

  model {
    user = person "User"{
      tags "FontStyle"
    }

    SpisNemtApp  = softwareSystem "SpisNemtApp" {
      tags "FontStyle"

      UI = container "UI" {
        tags "FontStyle", , "Boundary"
          HomeScreen = component "Home\nScreen" {
            tags "FontStyle"
          }

          ExploreScreen = component "Explore\nScreen" {
            tags "FontStyle"
          }

          SavedRecipesScreen = component "SavedRecipes\nScreen" {
            tags "FontStyle"
          }

          AccountScreen = component "Account\nScreen" {
            tags "FontStyle"
          }

          LoginScreen = component "Login\nScreen" {
            tags "FontStyle"
          }

          CreateAccountScreen = component "CreateAccount\nScreen" {
            tags "FontStyle"
          }
      }

      Backend = container "Backend" {
        tags "FontStyle", "Boundary"
          SignInController = component "SignIn\nController" {
            tags "FontStyle"
          }

          RecipeRecommender = component "Recipe\nRecommender" {
            tags "FontStyle"
          }

          PreferenceService = component "Preference\nService" {
            tags "FontStyle"
          }

          InceptionV3 = component "Computer\nVision" {
            tags "FontStyle"
          }
      }

      MealDBService = container "MealDBService" {
        tags "FontStyle"
      }

      UserService = container "UserService" {
        tags "FontStyle"
      }

      FirebaseAuth = container "FirebaseAuth" {
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
    RecipeRecommender -> PreferenceService
    UI -> SignInController
    UI -> UserService
    RecipeRecommender -> UI
    SignInController -> FirebaseAuth
    FirebaseAuth -> UserService

    //Component - UI
    HomeScreen -> MealDBService
    ExploreScreen -> MealDBService
    SavedRecipesScreen -> MealDBService
    AccountScreen -> UserService
    SavedRecipesScreen -> UserService
    ExploreScreen -> InceptionV3
    FirebaseAuth -> Database
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
      include FirebaseAuth
    }

    component Backend "BackendComponents" {
      include *
      include UserService
      include Database
      include TheMealDB
      include MealDBService
    }

    styles {
      relationship "Relationship" {
        thickness 5
      }
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
      element "Boundary" {
        fontsize 56
        strokeWidth 8
      }

    }

    theme default
  }
}
