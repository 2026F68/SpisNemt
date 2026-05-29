import PillFilter from "@/src/components/buttons/PillFilter";
import SearchInput from "@/src/components/forms/SearchInput";
import { Scrollable } from "@/src/components/structural/Scrollable";
import { View } from "react-native";
import { exploreTheme } from "../explore/ExploreTheme";

interface SearchContainerProps {
  draft: string;
  terms: string[];
  onDraftChange: (text: string) => void;
  onRemoveTerm: (term: string) => void;
  onSubmitSearch: () => void;
  onToggleCamera: () => void;
}

export default function SearchContainer({
  draft,
  terms,
  onDraftChange,
  onRemoveTerm,
  onSubmitSearch,
  onToggleCamera,
}: SearchContainerProps) {
  return (
    <View style={exploreTheme.searchSection}>
      <SearchInput
        placeholder="Type and press space..."
        value={draft}
        onChangeText={onDraftChange}
        onSubmitEditing={onSubmitSearch}
        actionButtonOnPress={onToggleCamera}
      />

      {terms.length > 0 && (
        <View style={exploreTheme.chipContainer}>
          <Scrollable
            horizontal
            style={exploreTheme.chipScroll}
            contentContainerStyle={exploreTheme.chipScrollContent}
          >
            {terms.map((term) => (
              <PillFilter
                key={term}
                title={term}
                onPress={() => onRemoveTerm(term)}
                active
              />
            ))}
          </Scrollable>
        </View>
      )}
    </View>
  );
}