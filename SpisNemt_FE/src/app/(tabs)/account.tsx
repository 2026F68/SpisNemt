import { useEffect, useState } from "react";
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
  const { user, signOut } = useAuth();
  const [preferences, setArea] = useState<string[]>([]);
  const [category, setCategory] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{
    message: string;
    variant: "success" | "warning" | "danger";
  } | null>(null);

  const accountName = user?.name || user?.email || "Guest";

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

  const saveSelections = async () => {
    if (!user) {
      return;
    }

    try {
      await saveUserPreferences(user, preferences, category);
      setFeedback({
        message: "Preferences saved.",
        variant: "success",
      });
    } catch (error) {
      console.error(error);
      setFeedback({
        message: "Could not save your preferences.",
        variant: "danger",
      });
    }
  };

  const googleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error(error);
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

        <Button title="Save Preferences" onPress={saveSelections} />

        <Button title="Sign Out" onPress={googleSignOut} />

        <Subtitle>Preferences</Subtitle>
        <Scrollable horizontal>
          {PREFERENCE_OPTIONS.map((preference) => (
            <SelectableCard
              key={preference}
              title={preference}
              selected={preferences.includes(preference)}
              onToggle={() => toggleSelection(preferences, setArea, preference)}
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
              onToggle={() =>
                toggleSelection(category, setCategory, categoryOption)
              }
            />
          ))}
        </Scrollable>
      </Container>
    </>
  );
}
