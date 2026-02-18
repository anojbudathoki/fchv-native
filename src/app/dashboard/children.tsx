import { View, Text, ScrollView, SafeAreaView } from "react-native";
import React, { useState } from "react";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";
import { User, Calendar, Baby } from "lucide-react-native";
import FormHeader from "../../components/layout/FormHeader";

export default function ChildrenForm() {
  const [childName, setChildName] = useState("");
  const [dob, setDob] = useState("");
  const [parentName, setParentName] = useState("");
  const [weight, setWeight] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Child registered successfully!");
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="">
        <FormHeader
          title="बालबालिका (0-5) दर्ता"
          subTitle="Children Registration"
          rightIcon={Baby}
          rightIconBgColor="bg-orange-100"
          rightIconColor="#F97316"
        />
        <View className="p-6 pt-0">

        <InputField
          label="बच्चाको नाम"
          subLabel="Child's Name"
          placeholder="Full Name"
          value={childName}
          onChangeText={setChildName}
          leftIcon={<User size={20} color="#9CA3AF" />}
        />

        <InputField
          label="जन्म मिति"
          subLabel="Date of Birth"
          placeholder="YYYY-MM-DD"
          value={dob}
          onChangeText={setDob}
          leftIcon={<Calendar size={20} color="#9CA3AF" />}
        />

        <InputField
          label="आमा/बुबाको नाम"
          subLabel="Parent's Name"
          placeholder="Parent Name"
          value={parentName}
          onChangeText={setParentName}
        />

        <InputField
          label="तौल (के.जी.)"
          subLabel="Weight (kg)"
          placeholder="Weight"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />

        <PrimaryButton
          title="दर्ता गर्नुहोस्"
          subTitle="Register"
          onPress={handleSubmit}
          isLoading={isLoading}
          className="mt-6"
        />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
