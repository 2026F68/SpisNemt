import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";

import { globalColors, globalSizes } from "../theme";

export default function Container({ children }: { children: React.ReactNode }) {
    return (
        <SafeAreaView>
            <View style={{
                padding: globalSizes.medium,
                backgroundColor: globalColors.backgroundColor,
            }}>
                {children}
            </View>
        </SafeAreaView>
    );
}