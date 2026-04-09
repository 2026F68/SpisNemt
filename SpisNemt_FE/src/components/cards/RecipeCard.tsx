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
      {matchScore !== undefined && matchScore >= 0.25 && (
        <View
          style={[
            cardStyle.matchBadge,
            {
              backgroundColor:
                matchScore >= 0.75
                  ? globalColors.successColor
                  : matchScore >= 0.5
                  ? globalColors.secondaryColor
                  : globalColors.dangerColor,
            },
          ]}
        >
          <Text style={cardStyle.matchBadgeText}>
            {matchScore >= 0.75 ? "Perfect Match" : matchScore >= 0.5 ? "Good Match" : "Poor Match"}
            {/* {Math.round(matchScore * 100)}% */}
          </Text>
        </View>
      )}
    </View>
  );
}
