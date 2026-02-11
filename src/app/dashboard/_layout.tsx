import { Stack } from "expo-router";
import React from "react";
import "../../global.css";

export default function DashboardLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: "#F9FAFB",
        },
        headerShadowVisible: false,
        headerTintColor: "#1F2937",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="household"
        options={{ title: "Add Household", headerShown: true }}
      />
      <Stack.Screen
        name="pregnant-women"
        options={{ title: "Pregnant Women", headerShown: true }}
      />
      <Stack.Screen
        name="children"
        options={{ title: "Children (0-5)", headerShown: true }}
      />
      <Stack.Screen
        name="family-planning"
        options={{ title: "Family Planning", headerShown: true }}
      />
      <Stack.Screen
        name="follow-up"
        options={{ title: "Follow Up", headerShown: true }}
      />
    </Stack>
  );
}
