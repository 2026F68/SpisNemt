import { StyleSheet } from 'react-native';

export const globalColors = {
    /* Neutral colors */
    headerColor: '#333333',
    textColor: '#666666',
    backgroundColor: '#F4F4F4',
    
    /* Theme and brand colors */
    primaryColor: '#8eb155',
    primaryMutedColor: '#e8f0dc',
    secondaryColor: '#ffab20',
    secondaryMutedColor: '#ffe5b4',
    whiteColor: '#FFFFFF',

    /* Visual cues */
    dangerColor: '#E21836',
    warningColor: '#FFD700',
    successColor: '#28a745',
};

export const globalSizes = {
    xsmall: 10,
    small: 12,
    medium: 16,
    large: 24,
    xlarge: 32,
    
    /* Border radius */
    borderRadius: 8,
    borderRadiusFull: 9999,
};

export const globalText = StyleSheet.create({
    header: {
        fontSize: globalSizes.xlarge,
        fontWeight: 700,
        color: globalColors.headerColor,
        lineHeight: globalSizes.large * 1.2,
        marginBottom: globalSizes.medium,
        marginTop: globalSizes.medium,
    },
    subheader: {
        fontSize: globalSizes.large,
        fontWeight: 600,
        color: globalColors.textColor,
        lineHeight: globalSizes.medium * 1.2,
        marginBottom: globalSizes.medium,
        marginTop: globalSizes.small,
    },
    paragraph: {
        fontSize: globalSizes.medium,
        color: globalColors.textColor,
        lineHeight: globalSizes.medium * 1.5,
    },
});

export const globalStyles = StyleSheet.create({
    body: {
        backgroundColor: globalColors.backgroundColor,
        color: globalColors.textColor
    }
});