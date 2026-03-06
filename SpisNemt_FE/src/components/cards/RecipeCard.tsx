import { Text, View } from 'react-native';
import { cardStyle } from './CardTheme';

interface RecipeCardProps {
    title?: string;
    category?: string;
    description?: string;
    imageUrl?: string;
    layout?: 'grid' | 'list';
    variant?: 'default' | 'saved';
}

export default function RecipeCard({ title, category, description, imageUrl, layout, variant }: RecipeCardProps) {
    const containerStyles = variant === 'saved' 
        ? (layout === 'grid' ? cardStyle.SavedRecipeCardContainerGrid : cardStyle.SavedRecipeCardContainerList)
        : cardStyle.cardContainer;
    const imageStyles = variant === 'saved'
        ? (layout === 'grid' ? cardStyle.SavedRecipeCardImageGrid : cardStyle.SavedRecipeCardImageList)
        : cardStyle.cardImage;
    return (
        <View style={containerStyles}>
                <View style={imageStyles} />
                <Text style={cardStyle.cardTitle}>{title}</Text>
                <Text style={cardStyle.cardCategory}>{category}</Text>
                <Text style={cardStyle.cardParagraph}>{description}</Text>
        </View>
    );
}