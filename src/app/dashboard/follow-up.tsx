import { View, Text, ScrollView, SafeAreaView } from "react-native";
import React, { useState } from "react";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";
import { User, Calendar, FileText, ClipboardList } from "lucide-react-native";
import FormHeader from "../../components/layout/FormHeader";

export default function FollowUpForm() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Follow-up recorded!");
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="">
        <FormHeader
          title="फलो-अप"
          subTitle="Follow-up Visit"
          rightIcon={ClipboardList}
          rightIconBgColor="bg-emerald-100"
          rightIconColor="#10B981"
        />
        <View className="p-6 pt-0">

        <InputField
          label="नाम"
          subLabel="Name"
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          leftIcon={<User size={20} color="#9CA3AF" />}
        />

        <InputField
          label="मिति"
          subLabel="Date"
          placeholder="YYYY-MM-DD"
          value={date}
          onChangeText={setDate}
          leftIcon={<Calendar size={20} color="#9CA3AF" />}
        />

        <InputField
            label="कैफियत"
            subLabel="Remarks"
            placeholder="Notes..."
            value={remarks}
            onChangeText={setRemarks}
            leftIcon={<FileText size={20} color="#9CA3AF" />}
            // multiline={true} // InputField needs support for multiline if we want it here
        />

        <PrimaryButton
          title="सेभ गर्नुहोस्"
          subTitle="Save"
          onPress={handleSubmit}
          isLoading={isLoading}
          className="mt-6"
        />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
