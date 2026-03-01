
import { StyleSheet } from 'react-native';
import { globalColors, globalSizes } from '@/src/theme';

export const cardStyle = StyleSheet.create({
    cardContainer: {
        width: 190,
        height: 250,
        borderRadius: globalSizes.borderRadius,
        backgroundColor: globalColors.whiteColor,
        padding: globalSizes.medium,
        paddingBottom: globalSizes.large,
        marginRight: globalSizes.medium,
        shadowColor: globalColors.headerColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardImage: {
        width: '100%',
        height: 100,
        borderRadius: globalSizes.borderRadius,
        marginBottom: globalSizes.small,
        backgroundColor: globalColors.primaryMutedColor,
    },
    cardTitle: {
        fontSize: globalSizes.medium,
        fontWeight: 600,
        color: globalColors.headerColor,
    },
    cardParagraph: {
        fontSize: globalSizes.small,
        color: globalColors.textColor,
    },
    cardCategory: {
        fontSize: globalSizes.small,
        color: globalColors.secondaryColor,
        backgroundColor: globalColors.secondaryMutedColor,
        alignSelf: 'flex-start',
        paddingHorizontal: globalSizes.xsmall,
        paddingVertical: globalSizes.xsmall / 2,
        borderRadius: globalSizes.xsmall,
        marginBottom: globalSizes.xsmall,
        marginTop: globalSizes.xsmall / 2,
    },
});