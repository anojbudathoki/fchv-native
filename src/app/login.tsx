import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Lock, Briefcase, HelpCircle } from "lucide-react-native";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import { useRouter } from "expo-router";
import { useLanguage } from "../context/LanguageContext";
import "../global.css";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function LoginScreen() {
  const router = useRouter();
  const { t, language, setLanguage } = useLanguage();
  const [healthId, setHealthId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      setIsLoading(false); // Set to false before navigation
      router.replace("/dashboard");
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          className="px-6"
          showsVerticalScrollIndicator={false}
        >
          {/* Header with Language Switcher */}
          <LanguageSwitcher />

          {/* Logo & Branding */}
          <View className="items-center mt-20 mb-10">
            <View className="rounded-full items-center justify-center mb-6">
              <Image
                source={require("../assets/fchv-logo.png")}
                style={{ width: 130, height: 130, opacity: 0.9 }}
                resizeMode="contain"
              />
            </View>
            <Text className="text-3xl font-bold text-gray-900 text-center mb-1">
              {t("login.welcome-back")}
            </Text>
            <Text className="text-gray-500 text-lg font-medium">
              {t("login.subtitle")}
            </Text>
          </View>

          {/* Form */}
          <View className="mb-6">
            <InputField
              label={t("login.health_id_label")}
              placeholder={t("login.health_id_placeholder")}
              value={healthId}
              onChangeText={setHealthId}
              leftIcon={<Briefcase size={20} color="#9CA3AF" />}
            />

            <InputField
              label={t("login.password_label")}
              placeholder={t("login.password_placeholder")}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              leftIcon={<Lock size={20} color="#9CA3AF" />}
            />
          </View>

          <PrimaryButton
            title={t("login.login_button")}
            onPress={handleLogin}
            isLoading={isLoading}
            className="mb-8 shadow-lg shadow-emerald-100"
          />

          <TouchableOpacity className="items-center mb-10">
            <Text className="text-[#34d399] font-semibold text-base">
              {t("login.forgot_password")}
            </Text>
          </TouchableOpacity>

          {/* Footer */}
          <View className="flex-1 justify-end items-center pb-8">
            <View className="flex-row items-center mb-8 bg-gray-50 px-4 py-2 rounded-full">
              <HelpCircle size={16} color="#9CA3AF" />
              <Text className="text-gray-500 ml-2 text-sm font-medium">
                {t("login.help_text")}
              </Text>
            </View>

            <View className="w-full flex-row items-center justify-center opacity-30">
              <View className="h-[1px] bg-gray-400 w-16 mr-4" />
              <Text className="text-xs font-bold tracking-widest text-gray-500 uppercase">
                Remote Nepal Health
              </Text>
              <View className="h-[1px] bg-gray-400 w-16 ml-4" />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
