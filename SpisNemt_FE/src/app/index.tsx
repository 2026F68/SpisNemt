import { Link } from "expo-router";
import { Text, View } from "react-native";

import { globalText } from "../theme";
import Container from "../components/structural/Container";
import Title from "../components/typograghy/Title";
import Paragraph from "../components/typograghy/Paragraph";

export default function Index() {
  return (

    <Container>
      <Title>Recommended</Title>
      <Paragraph>
        Paragraph
      </Paragraph>

      <Title>All recipes</Title>
      <Paragraph>
        Paragraph
      </Paragraph>
    </Container>

  );
}

