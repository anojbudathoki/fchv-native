import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface Option {
  label: string;
  value: string;
}

interface SelectionGroupProps {
  label: string;
  subLabel?: string;
  options: Option[];
  selectedValue: string;
  onSelect: (value: string) => void;
  containerClassName?: string;
}

export default function SelectionGroup({
  label,
  subLabel,
  options,
  selectedValue,
  onSelect,
  containerClassName,
}: SelectionGroupProps) {
  if (!options || !Array.isArray(options)) return null;

  return (
    <View className={`w-full mb-4 ${containerClassName || ""}`}>
      <View className="flex-row items-center mb-3">
        <Text className="text-gray-700 font-medium text-base">{label}</Text>
        {subLabel && (
          <Text className="text-gray-500 font-normal text-base ml-1">
            / {subLabel}
          </Text>
        )}
      </View>

      <View className="flex-row flex-wrap -m-2">
        {options.map((option) => {
          const isSelected = selectedValue === option.value;
          return (
            <View 
              key={option.value} 
              className="p-2 flex-1 min-w-[45%]"
            >
              <TouchableOpacity
                onPress={() => onSelect(option.value)}
                activeOpacity={0.7}
                className={`flex-row items-center px-4 py-4 rounded-3xl border ${
                  isSelected
                    ? "bg-blue-50 border-blue-500"
                    : "bg-white border-gray-100"
                }`}
              >
                <View
                  className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-3 ${
                    isSelected ? "border-blue-500 bg-blue-500" : "border-gray-200 bg-white"
                  }`}
                >
                  {isSelected && (
                    <View className="w-2.5 h-2.5 rounded-full bg-white" />
                  )}
                </View>
                <Text
                  className={`text-sm ${
                    isSelected ? "text-blue-700 font-semibold" : "text-gray-600 font-medium"
                  }`}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
}
