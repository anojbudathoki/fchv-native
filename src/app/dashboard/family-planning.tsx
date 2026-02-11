import { View, Text, ScrollView, SafeAreaView } from "react-native";
import React, { useState } from "react";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";
import { User, Activity } from "lucide-react-native";

export default function FamilyPlanningForm() {
  const [name, setName] = useState("");
  const [method, setMethod] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Family planning record saved!");
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="p-6">
        <Text className="text-xl font-bold text-gray-800 mb-6">
          परिवार नियोजन (Family Planning)
        </Text>

        <InputField
          label="सेवाग्राहीको नाम"
          subLabel="Client Name"
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          leftIcon={<User size={20} color="#9CA3AF" />}
        />

        <InputField
            label="पद्दति"
            subLabel="Method"
            placeholder="e.g. Condom, Pills, Injection"
            value={method}
            onChangeText={setMethod}
            leftIcon={<Activity size={20} color="#9CA3AF" />}
        />

        <PrimaryButton
          title="सेभ गर्नुहोस्"
          subTitle="Save Record"
          onPress={handleSubmit}
          isLoading={isLoading}
          className="mt-6"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
