import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, ActivityIndicator } from "react-native";
import { X, ChevronDown, Save } from "lucide-react-native";
import Dropdown from "react-native-input-select";

export const FieldLabel = ({ label }: { label: string }) => (
  <Text className="text-gray-800 text-[15px] mb-2">{label}</Text>
);

export const SelectInput = ({ label, placeholder, value, options, onSelect, error }: any) => {
  return (
    <View className="mb-6">
      <Dropdown
        placeholder={placeholder}
        options={options}
        selectedValue={value}
        onValueChange={(val: any) => onSelect(val)}
        primaryColor={'#10B981'}
        dropdownStyle={{
          backgroundColor: '#F3F4F6',
          borderColor: error ? '#F87171' : '#E5E7EB',
          borderWidth: 1,
          borderRadius: 14,
          height: 50,
          minHeight: 50,
          paddingHorizontal: 16,
          paddingVertical: 0, 
        }}
        dropdownContainerStyle={{
          marginBottom: 0,
        }}
        dropdownIcon={<ChevronDown size={18} color="#9CA3AF" />}
        dropdownIconStyle={{
          top: 15,
          right: 18,
        }}
        placeholderStyle={{
          color: '#9CA3AF',
          fontSize: 14,
          fontWeight: '500',
        }}
        selectedItemStyle={{
          color: '#1E293B',
          fontSize: 14,
          fontWeight: '500',
          marginTop: 2 // Tiny tweak sometimes needed for vertical align
        }}
      />
      {error ? <Text className="text-red-500 text-xs mt-1 ml-1 font-medium">{error}</Text> : null}
    </View>
  );
};

export const BoxInput = ({
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  maxLength,
  error,
}: {
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: any;
  maxLength?: number;
  error?: string;
}) => (
  <View className="mb-6">
    <View
      className={`bg-gray-100 rounded-2xl px-4 h-14 justify-center border ${error ? "border-red-300" : "border-gray-200"}`}
    >
      <TextInput
        className="text-[#1E293B] text-base"
        placeholder={placeholder}
        placeholderTextColor="#b8bbbeff"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        maxLength={maxLength}
        returnKeyType="next"
      />
    </View>
    {error ? (
      <Text className="text-red-500 text-xs mt-1 ml-1 font-medium">{error}</Text>
    ) : null}
  </View>
);

