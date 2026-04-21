import { useEffect, useState } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import Button from "../../components/buttons/Button";
import AccountCard from "../../components/cards/AccountCard";
import SelectableCard from "../../components/cards/SelectableCard";
import Container from "../../components/structural/Container";
import { Scrollable } from "../../components/structural/Scrollable";
import Alert from "../../components/typograghy/Alert";
import Subtitle from "../../components/typograghy/Subtitle";
import Title from "../../components/typograghy/Title";
import { useAuth } from "../../context/AuthContext";
import { getUserProfile } from "../../services/databaseAPI/getUserProfile";
import { saveUserPreferences } from "../../services/databaseAPI/saveUserPreferences";

const PREFERENCE_OPTIONS = [
  "Italian",
  "Mexican",
  "Indian",
  "Chinese",
  "French",
  "Thai",
  "Japanese",
  "American",
  "British",
  "Greek",
  "Spanish",
  "Turkish",
  "Moroccan",
  "Malaysian",
];
const CATEGORY_OPTIONS = [
  "Chicken",
  "Beef",
  "Pasta",
  "Seafood",
  "Vegetarian",
  "Vegan",
  "Dessert",
  "Lamb",
  "Breakfast",
  "Pork",
  "Starter",
];

export default function Account() {
  const { user, signOut } = useAuth();
  const [preferences, setArea] = useState<string[]>([]);
  const [category, setCategory] = useState<string[]>([]);

  const [isEditingPreferences, setIsEditingPreferences] = useState(false);

  const [feedback, setFeedback] = useState<{
    message: string;
    variant: "success" | "warning" | "danger";
  } | null>(null);

  const accountName = user?.name || "Guest";

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user) {
        return;
      }

      try {
        const profile = await getUserProfile(user.id);

        if (!profile) {
          return;
        }

        setArea(profile.preferences.area);
        setCategory(profile.preferences.category);
      } catch (error) {
        console.error(error);
        setFeedback({
          message: "Could not load your saved preferences.",
          variant: "danger",
        });
      }
    };

    fetchPreferences();
  }, [user]);

  const toggleSelection = (
    selectedValues: string[],
    setSelectedValues: (value: string[]) => void,
    option: string,
  ) => {
    setSelectedValues(
      selectedValues.includes(option)
        ? selectedValues.filter((value) => value !== option)
        : [...selectedValues, option],
    );
  };

  const saveSelections = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      await saveUserPreferences(user, preferences, category);

      Toast.show({
        type: "success",
        text1: "Preferences Saved",
        text2: "Your dietary choices have been updated.",
      });

      return true;
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: "Could not save your preferences.",
      });

      return false;
    }
  };

  const handlePreferencesButtonPress = async () => {
    if (!isEditingPreferences) {
      setIsEditingPreferences(true);
      setFeedback(null);
      return;
    }

    const didSave = await saveSelections();

    if (didSave) {
      setIsEditingPreferences(false);
    }
  };

  return (
    <>
      <Container>
        <Title>Account</Title>

        <AccountCard accountName={accountName} accountType="User" />

        {feedback && (
          <Alert variant={feedback.variant}>{feedback.message}</Alert>
        )}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Subtitle>Cuisine</Subtitle>
          <Button
            title={
              isEditingPreferences ? "Save Preferences" : "Edit Preferences"
            }
            onPress={() => void handlePreferencesButtonPress()}
          />
        </View>
        <Scrollable horizontal>
          {PREFERENCE_OPTIONS.map((preference) => (
            <SelectableCard
              key={preference}
              title={preference}
              selected={preferences.includes(preference)}
              onToggle={
                isEditingPreferences
                  ? () => toggleSelection(preferences, setArea, preference)
                  : undefined
              }
            />
          ))}
        </Scrollable>

        <Subtitle>Category</Subtitle>
        <Scrollable horizontal>
          {CATEGORY_OPTIONS.map((categoryOption) => (
            <SelectableCard
              key={categoryOption}
              title={categoryOption}
              selected={category.includes(categoryOption)}
              onToggle={
                isEditingPreferences
                  ? () => toggleSelection(category, setCategory, categoryOption)
                  : undefined
              }
            />
          ))}
        </Scrollable>
      </Container>
    </>
  );
}
