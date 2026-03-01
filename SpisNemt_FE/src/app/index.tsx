import { Link } from "expo-router";
import { Text, View } from "react-native";

import { globalText } from "../theme";
import Container from "../components/structural/Container";
import Title from "../components/typograghy/Title";
import Paragraph from "../components/typograghy/Paragraph";
import { Scrollable } from "../components/structural/Scrollable";
import RecipeCard from "../components/cards/RecipeCard";

export default function Index() {
  return (
    <>
      <Container>
        <Title>Recommended</Title>
        
        <Scrollable horizontal>
          <RecipeCard title="Spaghetti Carbonara" category="Italian" description="A creamy pasta dish with bacon and eggs." imageUrl="/assets/images/spaghetti-carbonara.jpg" />
          <RecipeCard title="Chicken Tikka Masala" category="Indian" description="Tender chicken in a rich, spiced tomato sauce." imageUrl="/assets/images/chicken-tikka-masala.jpg" />
          <RecipeCard title="Beef Tacos" category="Mexican" description="Seasoned beef in soft corn tortillas with fresh toppings." imageUrl="/assets/images/beef-tacos.jpg" />
          <RecipeCard title="Vegetable Stir Fry" category="Chinese" description="Crispy vegetables in a savory sauce." imageUrl="/assets/images/vegetable-stir-fry.jpg" />
          <RecipeCard title="Caesar Salad" category="Salad" description="Romaine lettuce with Caesar dressing and croutons." imageUrl="/assets/images/caesar-salad.jpg" />
          <RecipeCard title="Chocolate Cake" category="Dessert" description="Rich chocolate cake with a smooth frosting." imageUrl="/assets/images/chocolate-cake.jpg" />
        </Scrollable>
      </Container>
    </>

  );
}

