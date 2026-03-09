import { globalColors, globalText } from "../../theme";
import { Text, View } from "react-native";


type AlertVariant = "success" | "warning" | "danger";

interface AlertProps {
    children: React.ReactNode;
    variant?: AlertVariant;
}

const variantStyles: Record<AlertVariant, { color: string }> = {
    success: { color: globalColors.successColor },
    warning: { color: globalColors.warningColor },
    danger: { color: globalColors.dangerColor },
};

export default function Alert({ children, variant = "warning" }: AlertProps) {
    const style = variantStyles[variant];

    return (

        <Text
            allowFontScaling={true}
            adjustsFontSizeToFit={true}
            style={{
                marginBottom: 16,
                fontSize: globalText.paragraph.fontSize,
                lineHeight: globalText.paragraph.lineHeight,
                textAlign: "center",
                textAlignVertical: "center",
                color: style.color,
                padding: 12,
                borderRadius: 4,
            }}
        >
            {children}
        </Text>

    );
}