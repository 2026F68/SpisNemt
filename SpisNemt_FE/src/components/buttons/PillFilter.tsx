import { globalColors, globalSizes } from "@/src/theme";
import { Pressable, Text } from "react-native";
import { StyleSheet } from 'react-native';

interface PillFilterProps {
    title: string;
    onPress: () => void;
    active?: boolean;
}

const PillStyle = StyleSheet.create({
    pillContainer: {
        backgroundColor: globalColors.primaryMutedColor,
        paddingHorizontal: 16,
        paddingVertical: 8,
        height: 36,
        borderRadius: globalSizes.borderRadiusFull,
        marginRight: globalSizes.small,
    },
    pillContainerActive: {
        borderColor: globalColors.primaryColor,
        borderWidth: 1,
        backgroundColor: globalColors.primaryMutedColor,
        paddingHorizontal: 16,
        paddingVertical: 8,
        height: 36,
        borderRadius: globalSizes.borderRadiusFull,
        marginRight: globalSizes.small,
    },
    pillText: {
        color: globalColors.textColor,
    },

});

export default function PillFilter({ title, onPress, active }: PillFilterProps) {
    return (
        <Pressable style={active ? PillStyle.pillContainerActive : PillStyle.pillContainer} onPress={onPress}>
            <Text style={PillStyle.pillText}>{title}</Text>
        </Pressable>
    )
}