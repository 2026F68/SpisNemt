import { Pressable, Text, TextInput, View } from "react-native";
import { formTheme } from "./FormTheme";

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  actionButtonOnPress?: () => void;
  onSubmitEditing?: () => void;
}

export default function SearchInput({
  placeholder,
  value,
  onChangeText,
  actionButtonOnPress,
  onSubmitEditing,
}: SearchInputProps) {
  return (
    <View style={{ flexDirection: "row", marginBottom: 15, gap: 10, width: "100%" }}>
      <View style={{ flex: 1 }}>
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          returnKeyType="search"
          placeholderTextColor="#bdbdbd"
          style={[formTheme.formInput, { height: 50, paddingVertical: 10 }]}
        />
      </View>

      <Pressable
        style={[formTheme.formButton, { height: 50, paddingVertical: 10 }]}
        onPress={actionButtonOnPress}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Kamera</Text>
      </Pressable>
    </View>
  );
}