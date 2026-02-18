workspace "My System" "C4 model via Structurizr Lite" {

  model {
    user = person "User" "A user of my system"

    SpisNemt  = softwareSystem "SpisNemt" "Allows users to receive recipes based on their ingriedients and preferences" {
      RecipeAPI    = container "Recipe API" "The meal DB" "HTTP/REST"

      //MobileApp -> RecipeAPI "Uses" "HTTPS"
      //MobileApp -> Database "Reads from and writes to" "HTTP/REST"
    }

    Firebase = softwareSystem "Firebase" "External NoSQL database for user preferences and saved recipes" {
      tags "External"
    }

    TheMealDB = softwareSystem "TheMealDB" "External REST API for recipes" {
      tags "External"
    }


    user -> SpisNemt "Uses"
    SpisNemt -> Firebase "Reads from and writes to" "HTTP/REST"
    SpisNemt -> TheMealDB "Uses" "HTTP/REST"
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

    styles {
      element "External" {
        background lightgrey
        color black
        stroke grey
      }
    }

    theme default
  }
}
