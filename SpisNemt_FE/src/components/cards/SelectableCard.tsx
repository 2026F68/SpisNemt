import { Button, Pressable, View } from "react-native";
import { cardStyle } from "./CardTheme"
import React, {useState} from "react";

export default function SelectableCard() {

    const [Selected, setSelected] = useState(true);

    return (
        <Pressable onPress={() => setSelected(!Selected)}>
            <View style={Selected ? cardStyle.cardContainerSelected : cardStyle.cardContainerNotSelected}>
                <View style={cardStyle.cardImage} />
            </View>
        </Pressable>
    );
}