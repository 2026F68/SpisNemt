import { useState } from "react";
import AccountCard from "../components/cards/AccountCard";
import SelectableCard from "../components/cards/SelectableCard";
import Container from "../components/structural/Container";
import { Scrollable } from "../components/structural/Scrollable";
import Subtitle from "../components/typograghy/Subtitle";
import Title from "../components/typograghy/Title";

export default function Account() {
  const [allergies, setAllergies] = useState([
    { name: "Gluten", selected: false },
    { name: "Dairy", selected: false },
    { name: "Nuts", selected: false },
    { name: "Soy", selected: false },
  ]);

  const [preferences, setPreferences] = useState([
    { name: "Italian", selected: false },
    { name: "Spanish", selected: false },
    { name: "French", selected: false },
    { name: "Mexican", selected: false },
  ]);
  return (
    <>
      <Container>
        <Title>Account</Title>

        <AccountCard accountName="John Doe" accountType="User" />

        <Subtitle>Preferences</Subtitle>
        <Scrollable horizontal>
          {preferences.map((preference, index) => (
            <SelectableCard
              key={index}
              title={preference.name}
              selected={preference.selected}
            />
          ))}
        </Scrollable>

        <Subtitle>Allergies</Subtitle>
        <Scrollable horizontal>
          {allergies.map((allergy, index) => (
            <SelectableCard
              key={index}
              title={allergy.name}
              selected={allergy.selected}
            />
          ))}
        </Scrollable>
      </Container>
    </>
  );
}
