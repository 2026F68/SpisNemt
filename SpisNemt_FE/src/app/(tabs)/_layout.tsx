import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Tabs } from "expo-router";

import { globalColors } from "../../theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: globalColors.primaryColor, // Color of the icon/label when active
        tabBarInactiveTintColor: "#adadad", // Color when not selected
        tabBarStyle: {
          borderTopWidth: 0, // Remove the top border
          height: 50, // Custom height
          shadowColor: "black",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5, // For Android shadow
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="house" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="search" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="bookmark" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="user" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
