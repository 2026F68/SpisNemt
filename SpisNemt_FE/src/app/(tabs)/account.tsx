import { useEffect, useState } from "react";
import { View } from "react-native";
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

const PREFERENCE_OPTIONS = ["Italian", "Spanish", "French", "Mexican"];
const CATEGORY_OPTIONS = ["Gluten", "Dairy", "Nuts", "Soy"];

export default function Account() {
  const { user } = useAuth();
  const [preferences, setArea] = useState<string[]>([]);
  const [category, setCategory] = useState<string[]>([]);
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [saveSuccessPulse, setSaveSuccessPulse] = useState(0);
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
    if (!user) {
      return false;
    }

    try {
      await saveUserPreferences(user, preferences, category);
      setFeedback(null);
      return true;
    } catch (error) {
      console.error(error);
      setFeedback({
        message: "Could not save your preferences.",
        variant: "danger",
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
      setSaveSuccessPulse((current) => current + 1);
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
          <Subtitle>Area</Subtitle>
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
              blinkSignal={saveSuccessPulse}
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
              blinkSignal={saveSuccessPulse}
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
