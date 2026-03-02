import { Button, View } from "react-native";
import { cardStyle } from "./CardTheme"
import React, {useState} from "react";

export default function ToggleCard() {

    const [ToggledOn, setToggledOn] = useState(true);

    return (
        <View style={ToggledOn ? cardStyle.cardContainerToggledOn : cardStyle.cardContainer}>
            <Button
                onPress={() => setToggledOn(!ToggledOn)}
                title={ToggledOn ? "Toggle Off" : "Toggle On"}
                color="#261584"
                />
        </View>
    );
}