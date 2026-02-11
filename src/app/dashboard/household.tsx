import { View, Text, ScrollView, SafeAreaView } from "react-native";
import React, { useState } from "react";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";
import { User } from "lucide-react-native";

export default function HouseholdForm() {
  const [headName, setHeadName] = useState("");
  const [wardNo, setWardNo] = useState("");
  const [tole, setTole] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Household added successfully!");
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="p-6">
        <Text className="text-xl font-bold text-gray-800 mb-6">
          नयाँ घरधुरी थप्नुहोस् (Add New Household)
        </Text>

        <InputField
          label="घरमुलीको नाम"
          subLabel="Head of Household Name"
          placeholder="Name"
          value={headName}
          onChangeText={setHeadName}
          leftIcon={<User size={20} color="#9CA3AF" />}
        />

        <View className="flex-row justify-between">
          <View className="w-[48%]">
            <InputField
              label="वडा नं."
              subLabel="Ward No."
              placeholder="1"
              keyboardType="numeric"
              value={wardNo}
              onChangeText={setWardNo}
            />
          </View>
          <View className="w-[48%]">
            <InputField
              label="टोल"
              subLabel="Tole"
              placeholder="Tole Name"
              value={tole}
              onChangeText={setTole}
            />
          </View>
        </View>

        <InputField
          label="फोन नम्बर"
          subLabel="Phone Number"
          placeholder="98XXXXXXXX"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <PrimaryButton
          title="सेभ गर्नुहोस्"
          subTitle="Save Details"
          onPress={handleSubmit}
          isLoading={isLoading}
          className="mt-6"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
