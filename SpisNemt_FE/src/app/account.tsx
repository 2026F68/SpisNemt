import { useState } from "react";
import SelectableCard from "../components/cards/SelectableCard";
import Container from "../components/structural/Container";
import AccountCard from "../components/cards/AccountCard";
import { Scrollable } from "../components/structural/Scrollable";
import Title from "../components/typograghy/Title";

export default function Account() {
    const [allergies, setAllergies] = useState([
        {name: "Gluten", selected: false},
        {name: "Dairy", selected: false},
        {name: "Nuts", selected: false},
        {name: "Soy", selected: false}])
		
    const [preferences, setPreferences] = useState([
        {name: "Italian", selected: false},
        {name: "Spanish", selected: false},
        {name: "French", selected: false},
        {name: "Mexican", selected: false}])
    return (
        <>
          <Container>
            <Title>Account</Title>

            <AccountCard accountName="John Doe" accountType="User"/>
											
              <Title>Preferences</Title>
            <Scrollable horizontal>
                {preferences.map((preference, index) => (
                    <SelectableCard key={index} title={preference.name} selected={preference.selected} />
                ))}
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