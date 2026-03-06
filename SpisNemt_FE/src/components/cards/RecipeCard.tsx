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
    const containerStyles = variant === 'saved' ? cardStyle.SavedRecipeCardContainer : cardStyle.cardContainer;
    const imageStyles = variant === 'saved' ? cardStyle.SavedRecipeCardImage : cardStyle.cardImage;
    return (
        <View style={containerStyles}>
                <View style={imageStyles} />
                <Text style={cardStyle.cardTitle}>{title}</Text>
                <Text style={cardStyle.cardCategory}>{category}</Text>
                <Text style={cardStyle.cardParagraph}>{description}</Text>
        </View>
    );
}