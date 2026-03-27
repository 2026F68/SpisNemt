import { Image, Text, View } from "react-native";
import CloseButton from "../buttons/CloseButton";
import SaveButton from "../buttons/SaveButton";
import { cardStyle } from "../cards/CardTheme";
import Container from "../structural/Container";
import { Scrollable } from "../structural/Scrollable";
import { List, Section, Title } from "../typograghy";

interface SingleRecipeInfoProps {
  title?: string;
  category?: string;
  description?: string;
  ingredients?: string[];
  instructions?: string;
  imageUrl?: string;
}

export default function SingleRecipeInfo({
  title,
  category,
  description,
  ingredients,
  instructions,
  imageUrl,
}: SingleRecipeInfoProps) {
  return (
    <View style={{ flex: 1 }}>
      <SaveButton />
      <CloseButton />
      <Scrollable>
        <Image
          source={{ uri: imageUrl }}
          style={{ width: "100%", height: 300 }}
        />
        <Container>
          <Title>{title}</Title>
          <Text style={cardStyle.cardCategory}>{category}</Text>

          <Section title="Ingredients">
            <List variant="bullet" items={ingredients} />
          </Section>

          <Section title="Instructions">
            <Text>{instructions}</Text>
          </Section>
        </Container>
      </Scrollable>
    </View>
  );
}
