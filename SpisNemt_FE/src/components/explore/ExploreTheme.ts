import { StyleSheet } from "react-native";

export const exploreTheme = StyleSheet.create({
  searchSection: {
    marginBottom: 12,
  },
  chipContainer: {
    height: 48,
    justifyContent: "center",
    marginBottom: 12,
  },
  chipScroll: {
    marginBottom: 8,
    paddingBottom: 0,
    flexGrow: 0,
    maxHeight: 48,
  },
  chipScrollContent: {
    alignItems: "center",
  },
  cameraContainer: {
    marginTop: 12,
    height: 320,
    borderRadius: 12,
    overflow: "hidden",
  },
  camera: {
    flex: 1,
  },
  cameraActionRow: {
    marginTop: 8,
    marginBottom: 4,
  },
  sectionContainer: {
    marginTop: 12,
  },
  sectionScroll: {
    flexGrow: 0,
  },
  sectionContent: {
    paddingBottom: 16,
  },
  sectionItem: {
    marginBottom: 12,
  },
});