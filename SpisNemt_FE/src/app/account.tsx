import { View, Text } from "react-native";
import Container from "../components/structural/Container";
import Title from "../components/typograghy/Title";
import { Scrollable } from "../components/structural/Scrollable";
import ToggleCard from "../components/cards/ToggleCard";

export default function Account() {
    return (
        <>
          <Container>
            <Title>Account</Title>
            {/* <button title="Edit Preferences" onPress={(onPressEditPreferences) => {}} /> */}
            <Scrollable horizontal>
                <ToggleCard />
            </Scrollable>
          </Container>
        </>
    
      );
}