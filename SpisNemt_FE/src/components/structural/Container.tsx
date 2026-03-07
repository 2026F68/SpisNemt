import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";

import { globalColors, globalSizes } from "../../theme";

export default function Container({ children }: { children: React.ReactNode }) {
    return (
        <SafeAreaView style={{
            backgroundColor: globalColors.backgroundColor,
            flex: 1,
        }}>
            <View style={{
                padding: globalSizes.medium,
                backgroundColor: globalColors.backgroundColor,
                height: '100%',
            }}>
                {children}
            </View>
        </SafeAreaView>
    );
}