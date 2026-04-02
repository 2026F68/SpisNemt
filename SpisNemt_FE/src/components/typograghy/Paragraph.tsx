import { globalText } from "../../theme";
import { Text } from "react-native";

export default function Paragraph({ children }: { children: React.ReactNode }) {
    return (
        <Text allowFontScaling={true} adjustsFontSizeToFit={true} style={{ marginBottom: 16, fontSize: globalText.paragraph.fontSize, lineHeight: globalText.paragraph.lineHeight }}>
            {children}
        </Text>
    );
}