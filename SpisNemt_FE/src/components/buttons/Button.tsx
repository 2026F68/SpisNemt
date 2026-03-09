import React from "react";
import { Pressable, Text } from "react-native";


export default function Button({ title, onPress }: { title: string; onPress: () => void }) {
    return (
        <Pressable onPress={onPress} style={{ padding: 10, backgroundColor: "#007BFF", borderRadius: 5 }}>
            <Text style={{ color: "#fff" }}>{title}</Text>
        </Pressable>
    );
}