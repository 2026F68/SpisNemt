import { View, Text, Button } from "react-native";
import Container from "../components/structural/Container";
import Title from "../components/typograghy/Title";
import { Scrollable } from "../components/structural/Scrollable";
import SelectableCard from "../components/cards/SelectableCard";

export default function Account() {
    return (
        <>
          <Container>
            <Title>Account</Title>

              <Title>Preferences</Title>
            <Scrollable horizontal>
                <SelectableCard />
                <SelectableCard />
                <SelectableCard />
                <SelectableCard />
            </Scrollable>

              <Title>Allergies</Title>
            <Scrollable horizontal>
                <SelectableCard />
                <SelectableCard />
                <SelectableCard />
                <SelectableCard />
            </Scrollable>
          </Container>
        </>
    
      );
}