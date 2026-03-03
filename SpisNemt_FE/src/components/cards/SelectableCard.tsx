import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { cardStyle } from "./CardTheme";

interface SelectableCardProps {
    title?: string;
}

export default function SelectableCard({ title }: SelectableCardProps) {

    const [Selected, setSelected] = useState(true);

    return (
        <Pressable onPress={() => setSelected(!Selected)}>
            <View style={Selected ? cardStyle.cardContainerSelected : cardStyle.cardContainerNotSelected}>
                <View style={cardStyle.cardImage} />
                <Text style={cardStyle.cardTitle}>{title}</Text>
            </View>
        </Pressable>
    );
}