import React, { memo, useMemo } from "react";
import { Image, Text, View, Pressable } from "react-native";
import { globalColors } from "../../theme";
import { cardStyle } from "./CardTheme";

interface RecipeCardProps {
  title?: string;
  category?: string;
  description?: string;
  imageUrl?: string;
  variant?: "default" | "saved";
  matchScore?: number;
  onPress?: () => void;
  tags?: string[];
}

function RecipeCard({
  title,
  category,
  description,
  imageUrl,
  variant,
  matchScore,
  onPress,
  tags,
}: RecipeCardProps) {
  const containerStyles =
    variant === "saved"
      ? cardStyle.SavedRecipeCardContainer
      : cardStyle.cardContainer;
  const imageStyles =
    variant === "saved" ? cardStyle.SavedRecipeCardImage : cardStyle.cardImage;
  const titleLines = variant === "saved" ? 2 : 3;
  const descriptionLines = variant === "saved" ? 4 : 2;
  const imageSource = useMemo(
    () => (imageUrl ? { uri: imageUrl } : undefined),
    [imageUrl],
  );


  return (
    <Pressable onPress={onPress} disabled={!onPress} style={containerStyles}>
      {imageSource ? (
        <Image source={imageSource} style={imageStyles} />
      ) : (
        <View style={imageStyles} />
      )}
      <Text style={cardStyle.cardTitle} numberOfLines={titleLines} ellipsizeMode="tail">
        {title}
      </Text>
      <Text style={cardStyle.cardCategory} numberOfLines={1} ellipsizeMode="tail">
        {category}
      </Text>
      {tags && tags.length > 0 && (
        <View style={{ flexDirection: "row", gap: 6, marginTop: 6, marginBottom: 6 }}>
          {tags.slice(0, 3).map((t, index) => (
            <Text
              key={`${t}-${index}`}
              style={cardStyle.cardCategory}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {t}
            </Text>
          ))}
        </View>
      )}
      <Text
        style={cardStyle.cardParagraph}
        numberOfLines={descriptionLines}
        ellipsizeMode="tail"
      >
        {description}
      </Text>
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
          </Text>
        </View>
      )}
    </Pressable>
  );
}

export default memo(RecipeCard);
