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
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold text-blue-600">
        Welcome to FCHV Native
      </Text>
      <Text className="text-gray-500 mt-2">Pregnant Users Record System</Text>
    </View>
  );
}
