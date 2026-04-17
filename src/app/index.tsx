import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/login");
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-background">
      <Text className="text-3xl font-extrabold text-primary">
        FCHV Native
      </Text>
      <Text className="text-text-secondary text-lg mt-2 font-medium">
        Pregnant Users Record System
      </Text>
    </View>
  );
}
