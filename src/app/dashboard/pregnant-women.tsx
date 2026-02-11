import { View, Text, ScrollView, SafeAreaView } from "react-native";
import React, { useState } from "react";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";
import { User, Calendar } from "lucide-react-native";

export default function PregnantWomenForm() {
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [lmp, setLmp] = useState("");
    const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Pregnant woman registered!");
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="p-6">
        <Text className="text-xl font-bold text-gray-800 mb-6">
          गर्भवती महिला दर्ता (Pregnant Woman Registration)
        </Text>

        <InputField
          label="नाम"
          subLabel="Name"
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          leftIcon={<User size={20} color="#9CA3AF" />}
        />

        <InputField
          label="उमेर"
          subLabel="Age"
          placeholder="Age"
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
        />

        <InputField
          label="अन्तिम महिनावारी मिति"
          subLabel="Last Menstrual Period (LMP)"
          placeholder="YYYY-MM-DD"
          value={lmp}
          onChangeText={setLmp}
            leftIcon={<Calendar size={20} color="#9CA3AF" />}
        />

        <PrimaryButton
          title="दर्ता गर्नुहोस्"
          subTitle="Register"
          onPress={handleSubmit}
          isLoading={isLoading}
          className="mt-6"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
