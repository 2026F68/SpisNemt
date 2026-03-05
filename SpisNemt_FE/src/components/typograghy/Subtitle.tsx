import { Text } from "react-native";
import { globalText } from "../../theme";


export default function Subtitle({ children }: { children: React.ReactNode }) {
    return (
        <Text allowFontScaling={true} adjustsFontSizeToFit={true} style={globalText.subheader}>
            {children}
        </Text>
    );
}