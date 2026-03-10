import { Pressable, Text, TextInput, View } from "react-native";
import { formTheme } from "./FormTheme";

interface SearchInputProps {
    placeholder?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    actionButtonOnPress?: () => void;
}

export default function SearchInput({ placeholder, value, onChangeText, actionButtonOnPress }: SearchInputProps) {
    return (
        <View style={{ flexDirection: "row", marginBottom: 15, gap: 10, width: "100%" }}>
            <View style={{ flex: 1 }}>
                <TextInput
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    style={[formTheme.formInput, { height: 20, paddingVertical: 20 }]}
                />
            </View>
            <Pressable style={[formTheme.formButton, { height: 20, paddingVertical: 20 }]} onPress={actionButtonOnPress}>

                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Kamera</Text>

            </Pressable>
        </View>
    );
}