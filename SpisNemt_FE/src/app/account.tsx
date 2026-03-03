import { useState } from "react";
import SelectableCard from "../components/cards/SelectableCard";
import Container from "../components/structural/Container";
import { Scrollable } from "../components/structural/Scrollable";
import Title from "../components/typograghy/Title";

export default function Account() {
  const [allergies, setAllergies] = useState([
    {name: "Gluten", selected: false},
    {name: "Dairy", selected: false},
    {name: "Nuts", selected: false},
    {name: "Soy", selected: false}])
    return (
        <>
          <Container>
            <Title>Account</Title>

              <Title>Preferences</Title>
            <Scrollable horizontal>
                <SelectableCard title="Italian"/>
                <SelectableCard title="Spanish"/>
                <SelectableCard title="French"/>
                <SelectableCard title="German"/>
            </Scrollable>

              <Title>Allergies</Title>
            <Scrollable horizontal>
                {allergies.map((allergy, index) => (
                    <SelectableCard key={index} title={allergy.name} selected={allergy.selected} />
                ))}
            </Scrollable>
          </Container>
        </>
    
      );
}