import { View } from "react-native";
import RecipeCard from "../components/cards/RecipeCard";
import Container from "../components/structural/Container";
import { Scrollable } from "../components/structural/Scrollable";
import Title from "../components/typograghy/Title";

const recipes = [
  {
    title: "Spaghetti Carbonara",
    category: "Italian",
    description: "A creamy pasta dish with bacon and eggs.",
    imageUrl: "/assets/images/spaghetti-carbonara.jpg",
  },
  {
    title: "Chicken Tikka Masala",
    category: "Indian",
    description: "Tender chicken in a rich, spiced tomato sauce.",
    imageUrl: "/assets/images/chicken-tikka-masala.jpg",
  },
  {
    title: "Beef Tacos",
    category: "Mexican",
    description: "Seasoned beef in soft corn tortillas with fresh toppings.",
    imageUrl: "/assets/images/beef-tacos.jpg",
  },
  {
    title: "Vegetable Stir Fry",
    category: "Chinese",
    description: "Crispy vegetables in a savory sauce.",
    imageUrl: "/assets/images/vegetable-stir-fry.jpg",
  },
  {
    title: "Caesar Salad",
    category: "Salad",
    description: "Romaine lettuce with Caesar dressing and croutons.",
    imageUrl: "/assets/images/caesar-salad.jpg",
  },
  {
    title: "Chocolate Cake",
    category: "Dessert",
    description: "Rich chocolate cake with a smooth frosting.",
    imageUrl: "/assets/images/chocolate-cake.jpg",
  },
  {
    title: "Sushi Platter",
    category: "Japanese",
    description: "Assorted sushi rolls with fresh fish and vegetables.",
    imageUrl: "/assets/images/sushi-platter.jpg",
  },
];

export default function Saved() {
  return (
    <>
      <Container>
        <Title>Saved</Title>
        <Scrollable>
          <View>
            {recipes.map((recipe, index) => (
              <RecipeCard
                variant="saved"
                key={index}
                title={recipe.title}
                category={recipe.category}
                description={recipe.description}
                imageUrl={recipe.imageUrl}
              />
            ))}
          </View>
        </Scrollable>
      </Container>
    </>
  );
}
