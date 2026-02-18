import { View, Text, ScrollView, SafeAreaView } from "react-native";
import React, { useState } from "react";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";
import { User, Activity, Users } from "lucide-react-native";
import FormHeader from "../../components/layout/FormHeader";

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
      <ScrollView className="">
        <FormHeader
          title="परिवार नियोजन"
          subTitle="Family Planning"
          rightIcon={Users}
          rightIconBgColor="bg-purple-100"
          rightIconColor="#A855F7"
        />
        <View className="p-6 pt-0">

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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
