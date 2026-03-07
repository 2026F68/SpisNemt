import { TextInput, View } from "react-native";
import Container from "../components/structural/Container";
import Title from "../components/typograghy/Title";
import React from "react";
import Paragraph from "../components/typograghy/Paragraph";
import Button from "../components/buttons/Button";
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

import { useState } from 'react';
import { Scrollable } from "../components/structural/Scrollable";
import RecipeCard from "../components/cards/RecipeCard";

export default function Explore() {
  const [query, setQuery] = useState('');
  const [facing, setFacing] = React.useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();

  const [cameraOpen, setCameraOpen] = React.useState(false);

  const recipes = [
    {
      title: "Spaghetti Carbonara",
      category: "Italian",
      description: "A creamy pasta dish with bacon and eggs.",
      imageUrl: "/assets/images/spaghetti-carbonara.jpg",
      ingredients: ["pasta", "bacon", "eggs", "cream"]
    },
    {
      title: "Chicken Tikka Masala",
      category: "Indian",
      description: "Tender chicken in a rich, spiced tomato sauce.",
      imageUrl: "/assets/images/chicken-tikka-masala.jpg",
      ingredients: ["chicken", "tomato", "yogurt", "spices"]
    },
    {
      title: "Beef Tacos",
      category: "Mexican",
      description: "Seasoned beef in soft corn tortillas with fresh toppings.",
      imageUrl: "/assets/images/beef-tacos.jpg",
      ingredients: ["beef", "tortillas", "tomato", "cheese"]
    },
    {
      title: "Vegetable Stir Fry",
      category: "Chinese",
      description: "Crispy vegetables in a savory sauce.",
      imageUrl: "/assets/images/vegetable-stir-fry.jpg",
      ingredients: ["vegetables", "soy sauce", "garlic", "ginger"]
    },
    {
      title: "Caesar Salad",
      category: "Salad",
      description: "Romaine lettuce with Caesar dressing and croutons.",
      imageUrl: "/assets/images/caesar-salad.jpg",
      ingredients: ["lettuce", "croutons", "parmesan", "dressing"]
    },
    {
      title: "Chocolate Cake",
      category: "Dessert",
      description: "Rich chocolate cake with a smooth frosting.",
      imageUrl: "/assets/images/chocolate-cake.jpg",
      ingredients: ["chocolate", "flour", "eggs", "sugar"]
    },
    {
      title: "Sushi Platter",
      category: "Japanese",
      description: "Assorted sushi rolls with fresh fish and vegetables.",
      imageUrl: "/assets/images/sushi-platter.jpg",
      ingredients: ["rice", "fish", "nori", "vegetables"]
    }
  ];

  const filteredRecipes = recipes.filter(recipe =>
    query.toLowerCase() === '' ||
    recipe.ingredients.some(ingredient =>
      ingredient.toLowerCase().includes(query.toLowerCase())
    )
  );

  if (!permission) {
    // Camera permissions are still loading
    return <Paragraph>Requesting camera permission...</Paragraph>;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <Container>

        <Paragraph>We need your permission to show the camera</Paragraph>
        <Button onPress={requestPermission} title="Grant permission" />

      </Container>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <Container>
      <Title>Explore</Title>

      <TextInput
        placeholder="Search..."
        value={query}
        onChangeText={(searchText) => setQuery(searchText)}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 }}
      />

      {query.length > 0 && (
        <Scrollable horizontal>
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe, index) => (
              <RecipeCard
                key={index}
                title={recipe.title}
                category={recipe.category}
                description={recipe.description}
                imageUrl={recipe.imageUrl}
              />
            ))
          ) : (
            <Paragraph>No recipes found with "{query}"</Paragraph>
          )}
        </Scrollable>
      )}

      <Button title={cameraOpen ? "Close camera" : "Open camera"} onPress={() => setCameraOpen(current => !current)} />

      {cameraOpen && (
        <CameraView style={{ flex: 1, marginTop: 20 }} facing={facing} />
      )}

    </Container>
  );
}