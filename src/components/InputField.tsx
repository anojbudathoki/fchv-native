import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react-native";
import { twMerge } from "tailwind-merge";

interface InputFieldProps extends React.ComponentProps<typeof TextInput> {
  label: string;
  subLabel?: string;
  leftIcon?: React.ReactNode;
  containerClassName?: string;
}

export default function InputField({
  label,
  subLabel,
  leftIcon,
  containerClassName,
  secureTextEntry,
  ...props
}: InputFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPasswordType = secureTextEntry;

  return (
    <View className={twMerge("w-full mb-4", containerClassName)}>
      <View className="flex-row items-center mb-2">
        <Text className="text-gray-700 font-medium text-base">{label}</Text>
        {subLabel && (
          <Text className="text-gray-500 font-normal text-base ml-1">
            / {subLabel}
          </Text>
        )}
      </View>

      <View className="flex-row items-center bg-white border border-gray-100 rounded-3xl h-14 px-4">
        {leftIcon && <View className="mr-3">{leftIcon}</View>}

        <TextInput
          className="flex-1 text-gray-800 text-base h-full"
          placeholderTextColor="#9CA3AF"
          secureTextEntry={isPasswordType && !isPasswordVisible}
          {...props}
        />

        {isPasswordType && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            className="ml-2"
          >
            {isPasswordVisible ? (
              <EyeOff size={22} color="#9CA3AF" />
            ) : (
              <Eye size={22} color="#9CA3AF" />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
