import { View, Text, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";
import { User, Home } from "lucide-react-native";
import NavigationLayout from "@/components/NavigationLayout";
import { useLanguage } from "../../context/LanguageContext";

export default function HouseholdForm() {
  const { t } = useLanguage();
  const [headName, setHeadName] = useState("");
  const [wardNo, setWardNo] = useState("");
  const [tole, setTole] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        t("household_form.submit.title"),
        t("household_form.submit.success")
      );
    }, 1500);
  };

  return (
    <View className="flex-1 bg-white">
      <NavigationLayout title={t("household_form.title")} />
      <ScrollView className="flex-1">
        <View className="p-6 pt-4">
          <View className="flex-row justify-between">
            <View className="w-[48%]">
              <InputField
                label={t("household_form.ward_label")}
                placeholder={t("household_form.ward_placeholder")}
                keyboardType="numeric"
                value={wardNo}
                onChangeText={setWardNo}
              />
            </View>
            <View className="w-[48%]">
              <InputField
                label={t("household_form.tole_label")}
                placeholder={t("household_form.tole_placeholder")}
                value={tole}
                onChangeText={setTole}
              />
            </View>
          </View>

          <InputField
            label={t("household_form.phone_label")}
            placeholder={t("household_form.phone_placeholder")}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <PrimaryButton
            title={t("household_form.submit.title")}
            onPress={handleSubmit}
            isLoading={isLoading}
            className="mt-6"
          />
        </View>
      </ScrollView>
    </View>
  );
}
