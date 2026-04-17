import { Text, TouchableOpacity, ActivityIndicator, View } from "react-native";
import React from "react";
import { ArrowRight } from "lucide-react-native";
import { twMerge } from "tailwind-merge";

interface PrimaryButtonProps {
  title: string;
  subTitle?: string;
  onPress?: () => void;
  isLoading?: boolean;
  className?: string;
}

export default function PrimaryButton({
  title,
  subTitle,
  onPress,
  isLoading = false,
  className,
}: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={isLoading}
      className={twMerge(
        "w-full bg-[#059669] rounded-2xl h-16 flex-row items-center justify-center shadow-lg shadow-emerald-700/30",
        className,
      )}
    >
      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : (
        <View className="flex-row items-center">
          <Text className="text-white font-bold text-xl">{title}</Text>
          <ArrowRight
            size={24}
            color="white"
            className="ml-3"
            strokeWidth={3}
          />
        </View>
      )}
    </TouchableOpacity>
  );
}
