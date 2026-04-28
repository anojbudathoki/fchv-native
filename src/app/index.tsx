import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { Loader2Icon } from "lucide-react-native";

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
        Welcome to FCHV
      </Text>
      <Loader2Icon className="animate-spin" />
    </View>
  );
}
