import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, ActivityIndicator } from "react-native";
import { X, ChevronDown, Save } from "lucide-react-native";
import Dropdown from "react-native-input-select";

export const FieldLabel = ({ label }: { label: string }) => (
  <Text className="text-gray-800 text-[15px] mb-2">{label}</Text>
);

export const SelectInput = ({ label, placeholder, value, options, onSelect, error, disabled }: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  
  const selectedLabel = options.find((opt: any) => opt.value === value)?.label || placeholder;

  const filteredOptions = options.filter((opt: any) => 
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View className="mb-6">
      <TouchableOpacity
        onPress={() => !disabled && setModalVisible(true)}
        activeOpacity={disabled ? 1 : 0.7}
        className={`rounded-2xl px-4 h-14 flex-row items-center justify-between border ${
          disabled ? "bg-gray-50 border-gray-100 opacity-70" : "bg-gray-100 border-gray-200"
        } ${error ? "border-red-300" : ""}`}
      >
        <Text className={`text-base ${value ? "text-[#1E293B]" : "text-[#9CA3AF]"}`}>
          {selectedLabel}
        </Text>
        {!disabled && <ChevronDown size={18} color="#9CA3AF" />}
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
          className="flex-1 bg-black/50 justify-center items-center px-6"
        >
          <TouchableOpacity
            activeOpacity={1}
            className="bg-white w-full max-h-[70%] rounded-[32px] overflow-hidden"
          >
            <View className="p-6 border-b border-gray-100 flex-row items-center justify-between">
              <Text className="text-xl font-black text-[#1E293B]">{label || "Select Option"}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View className="px-6 py-4 border-b border-gray-50">
              <TextInput
                className="bg-gray-50 px-4 h-12 rounded-xl text-base text-[#1E293B]"
                placeholder="Search..."
                placeholderTextColor="#9CA3AF"
                value={search}
                onChangeText={setSearch}
              />
            </View>

            <ScrollView className="px-2 pb-6">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt: any) => (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => {
                      onSelect(opt.value);
                      setModalVisible(false);
                      setSearch("");
                    }}
                    className={`px-4 py-4 rounded-2xl mb-1 flex-row items-center ${
                      value === opt.value ? "bg-blue-50" : "transparent"
                    }`}
                  >
                    <View className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${
                      value === opt.value ? "border-primary bg-primary" : "border-gray-300"
                    }`}>
                      {value === opt.value && <View className="w-2 h-2 rounded-full bg-white" />}
                    </View>
                    <Text className={`text-base flex-1 ${
                      value === opt.value ? "text-primary font-bold" : "text-[#1E293B] font-medium"
                    }`}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <View className="py-10 items-center">
                  <Text className="text-gray-400 font-bold">No options found</Text>
                </View>
              )}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

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

