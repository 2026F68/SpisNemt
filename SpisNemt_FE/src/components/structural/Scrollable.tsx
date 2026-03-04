import { globalSizes } from "@/src/theme";
import { ScrollView } from "react-native";

interface ScrollableProps {
    children: React.ReactNode;
    horizontal?: boolean;
}

export const Scrollable: React.FC<ScrollableProps> = ({ children, horizontal = false }) => {
    return (
        <ScrollView style={{  marginBottom: globalSizes.medium, paddingBottom: globalSizes.xsmall }} horizontal={horizontal} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
            {children}
        </ScrollView>
    )
};