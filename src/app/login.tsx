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
import { Globe, Lock, Briefcase, HelpCircle } from "lucide-react-native";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import { useRouter } from "expo-router";
import "../global.css";

export default function LoginScreen() {
  const router = useRouter();
  const [healthId, setHealthId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
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
          className="px-6 pt-20"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          {/* <View className="flex-row justify-between items-center mt-4 mb-8">
            <TouchableOpacity className="flex-row items-center">
              <Globe size={18} color="#34d399" />
              <Text className="text-[#34d399] font-medium ml-2 uppercase tracking-wide">
                English / नेपाली
              </Text>
            </TouchableOpacity>
            <View className="bg-[#d1fae5] px-3 py-1 rounded-full">
              <Text className="text-[#059669] font-bold text-xs">v2.4.0</Text>
            </View>
          </View> */}

          {/* Logo & Branding */}
          <View className="items-center mb-10">
            <View className="rounded-full items-center justify-center mb-6">
              {/* Placeholder for Logo - Using an Image would be better if asset existed */}
              <Image
                source={require("../assets/fchv-logo.png")}
                style={{ width: 130, height: 130, opacity: 0.8 }}
                resizeMode="contain"
              />
            </View>
            <Text className="text-3xl font-bold text-gray-900 text-center mb-1">
              स्वागत छ / Welcome
            </Text>
            <Text className="text-gray-500 text-lg font-medium">
              Health Data Collection App
            </Text>
          </View>

          {/* Form */}
          <View className="mb-6">
            <InputField
              label="स्वास्थ्य कार्यकर्ता आईडी"
              subLabel="Health Worker ID"
              placeholder="Enter ID / आईडी राख्नुहोस्"
              value={healthId}
              onChangeText={setHealthId}
              leftIcon={<Briefcase size={20} color="#9CA3AF" />}
            />

            <InputField
              label="पासवर्ड"
              subLabel="Password"
              placeholder="Enter Password / पासवर्ड राख्नु"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              leftIcon={<Lock size={20} color="#9CA3AF" />}
            />
          </View>

          <PrimaryButton
            title="लगइन गर्नुहोस्"
            subTitle="Login"
            onPress={handleLogin}
            isLoading={isLoading}
            className="mb-6"
          />

          <TouchableOpacity className="items-center mb-10">
            <Text className="text-[#34d399] font-medium text-base underline">
              पासवर्ड बिर्सनुभयो? / Forgot Password?
            </Text>
          </TouchableOpacity>

          {/* Footer */}
          <View className="flex-1 justify-end items-center pb-8">
            <View className="flex-row items-center mb-8">
              <HelpCircle size={18} color="#9CA3AF" />
              <Text className="text-gray-400 ml-2 text-sm">
                Need help? Contact local health post
              </Text>
            </View>

            <View className="w-full flex-row items-center justify-center opacity-30">
              <View className="h-[1px] bg-gray-400 w-16 mr-4" />
              <Text className="text-xs font-bold tracking-widest text-gray-500 uppercase">
                Rural Nepal Healthcare
              </Text>
              <View className="h-[1px] bg-gray-400 w-16 ml-4" />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
