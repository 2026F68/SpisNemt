import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { globalColors, globalSizes } from "../../theme";

export default function Container({ children }: { children: React.ReactNode }) {
    return (
        <ScrollView>
            <SafeAreaView>
                <View style={{
                    padding: globalSizes.medium,
                    backgroundColor: globalColors.backgroundColor,
                    height: '100%',
                }}>
                    {children}
                </View>
            </SafeAreaView>
        </ScrollView>
    );
}