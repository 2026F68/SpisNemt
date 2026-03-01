import { View, StyleSheet, Text } from 'react-native';
import { cardStyle } from './CardTheme';

interface RecipeCardProps {
    title?: string;
    category?: string;
    description?: string;
    imageUrl?: string;
}

export default function RecipeCard({ title, category, description, imageUrl }: RecipeCardProps) {
    return (
        <View style={cardStyle.cardContainer}>
                <View style={cardStyle.cardImage} />
                <Text style={cardStyle.cardTitle}>{title}</Text>
                <Text style={cardStyle.cardCategory}>{category}</Text>
                <Text style={cardStyle.cardParagraph}>{description}</Text>
        </View>
    );
}