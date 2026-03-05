import { Text, View } from 'react-native';
import { cardStyle } from './CardTheme';

interface RecipeCardProps {
    title?: string;
    category?: string;
    description?: string;
    imageUrl?: string;
    variant?: 'default' | 'saved';
}

export default function RecipeCard({ title, category, description, imageUrl, variant }: RecipeCardProps) {
    const styles = variant === 'saved' ? cardStyle.SavedRecipeCardContainer : cardStyle.cardContainer;
    return (
        <View style={styles}>
                <View style={cardStyle.cardImage} />
                <Text style={cardStyle.cardTitle}>{title}</Text>
                <Text style={cardStyle.cardCategory}>{category}</Text>
                <Text style={cardStyle.cardParagraph}>{description}</Text>
        </View>
    );
}