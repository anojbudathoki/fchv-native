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
        "w-full bg-[#34d399] rounded-2xl h-14 flex-row items-center justify-center shadow-md",
        className
      )}
    >
      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : (
        <View className="flex-row items-center">
          <Text className="text-black font-bold text-lg">
            {title} {subTitle && <Text className="font-medium">/ {subTitle}</Text>}
          </Text>
          <ArrowRight size={20} color="black" className="ml-2" strokeWidth={2.5} />
        </View>
      )}
    </TouchableOpacity>
  );
}
