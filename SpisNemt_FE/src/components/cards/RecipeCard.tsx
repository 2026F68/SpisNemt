import { Image, Text, View } from "react-native";
import { globalColors } from "../../theme";
import { cardStyle } from "./CardTheme";

interface RecipeCardProps {
  title?: string;
  category?: string;
  description?: string;
  imageUrl?: string;
  variant?: "default" | "saved";
  matchScore?: number;
}

export default function RecipeCard({
  title,
  category,
  description,
  imageUrl,
  variant,
  matchScore,
}: RecipeCardProps) {
  const containerStyles =
    variant === "saved"
      ? cardStyle.SavedRecipeCardContainer
      : cardStyle.cardContainer;
  const imageStyles =
    variant === "saved" ? cardStyle.SavedRecipeCardImage : cardStyle.cardImage;

  const badgeColor =
    matchScore !== undefined && matchScore >= 0.75
      ? globalColors.successColor
      : globalColors.secondaryColor;

  return (
    <View style={containerStyles}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={imageStyles} />
      ) : (
        <View style={imageStyles} />
      )}
      <Text style={cardStyle.cardTitle}>{title}</Text>
      <Text style={cardStyle.cardCategory}>{category}</Text>
      <Text style={cardStyle.cardParagraph}>{description}</Text>
      {matchScore !== undefined && matchScore >= 0.45 && (
        <View style={[cardStyle.matchBadge, { backgroundColor: badgeColor }]}>
          <Text style={cardStyle.matchBadgeText}>
            {Math.round(matchScore * 100)}%
          </Text>
        </View>
      )}
    </View>
  );
}
