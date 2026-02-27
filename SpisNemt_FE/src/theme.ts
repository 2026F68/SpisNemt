import { StyleSheet } from 'react-native';

const globalColors = {
    /* Neutral colors */
    headerColor: '#333333',
    textColor: '#666666',
    backgroundColor: '#F8F9FA',

    /* Theme and brand colors */
    primaryColor: '#8eb155',
    primaryMutedColor: '#e8f0dc',
    secondaryColor: '#ffab20',
    secondaryMutedColor: '#ffe5b4',

    /* Visual cues */
    dangerColor: '#E21836',
    warningColor: '#FFD700',
    successColor: '#28a745',
};

const globalSizes = {
    small: 8,
    medium: 16,
    large: 24,
    xlarge: 32,
    
    /* Border radius */
    borderRadius: 8,
    
};

const globalText = StyleSheet.create({
    header: {
        fontSize: globalSizes.large,
        fontWeight: 'bold',
        color: globalColors.headerColor,
    },
    paragraph: {
        fontSize: globalSizes.medium,
        color: globalColors.textColor,
    },
});

const globalStyles = StyleSheet.create({
    body: {
        backgroundColor: globalColors.backgroundColor,
        color: globalColors.textColor
    }
});