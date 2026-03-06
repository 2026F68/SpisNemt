import { useState } from 'react';
import { Pressable, Text as RNText, View } from 'react-native';
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
  }
];

export default function Saved() {
  const [layout, setLayout] = useState<'grid' | 'list'>('list');

  return (
    <>
      <Container>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title>Saved</Title>
          <Pressable onPress={() => setLayout(layout === 'grid' ? 'list' : 'grid')}>
            <RNText style={{ fontSize: 24 }}>{layout === 'grid' ? 'list' : 'grid'}</RNText>
          </Pressable>
        </View>
        <Scrollable>
          <View style={layout === 'grid' ? { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' } : {}}>
            {recipes.map((recipe, index) => (
              <RecipeCard
                variant="saved"
                layout={layout}
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