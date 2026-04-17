import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Lock, Mail } from "lucide-react-native";
import Svg, { Path } from "react-native-svg";
import InputField from "../components/InputField";
import { useRouter } from "expo-router";
import { useLanguage } from "../context/LanguageContext";
import "../global.css";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = () => {
    if (!phone.trim() || !pin) {
      setErrorMessage("Phone number and PIN are required.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Hardcoded login for demonstration
      if (phone === "1" && pin === "1") {
        setErrorMessage("");
        router.replace("/dashboard");
      } else {
        setErrorMessage("Invalid Email or Password");
      }
    }, 1500);
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />
      
      {/* Top Section with Wave - Using App Colors (Green) */}
      <View style={{ height: 280 }}>
        <View className="absolute top-0 left-0 right-0 bottom-0 bg-primary" />
        <View className="absolute bottom-0 w-full">
          <Svg
            height="120"
            width={width}
            viewBox={`0 0 ${width} 120`}
            fill="none"
          >
            <Path
              d={`M0 40 C ${width / 3} 0, ${width / 1.5} 80, ${width} 40 V 120 H 0 Z`}
              fill="white"
            />
          </Svg>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior="padding"
        className="flex-1"
        style={{ zIndex: 10 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          className="px-8"
          bounces={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Welcome Text */}
          <View className="mt-6">
            <View className="flex-row items-center">
              <Text className="text-[30px] font-bold text-text-secondary">Welcome Back </Text>
            </View>
            <Text className="text-gray-400 font-medium text-base mt-2">
               Please login to your account to continue.
            </Text>
          </View>

          {/* Form Content */}
          <View className="flex-1 mt-8">
            <InputField
              label={t("login.health_id_label")}
              placeholder={t("login.health_id_placeholder")}
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                setErrorMessage("");
              }}
              leftIcon={<Mail size={22} color="#94a3b8" />}
            />

            <InputField
              label={t("login.password_label")}
              placeholder={t("login.password_placeholder")}
              secureTextEntry
              value={pin}
              onChangeText={(text) => {
                setPin(text);
                setErrorMessage("");
              }}
              leftIcon={<Lock size={22} color="#94a3b8" />}
            />

            <View className="flex-row items-center justify-between mb-6 ">
              <View className="flex-row items-center">
                <Text className="text-gray-400 font-bold text-[11px] uppercase tracking-wider">Secure Access</Text>
              </View>
              <TouchableOpacity>
                <View className="flex-row">
                  <Text className="text-primary font-bold text-[13px]">{t("login.forgot_password")} </Text>
                </View>
              </TouchableOpacity>
            </View>

            {errorMessage ? (
              <Text className="text-red-500 font-bold text-sm mb-6 text-center">
                {errorMessage}
              </Text>
            ) : null}

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleLogin}
              disabled={isLoading}
              className="w-full bg-primary rounded-2xl h-16 items-center justify-center shadow-xl shadow-emerald-100 flex-row"
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-white font-black text-xl">{t("login.login_button")} </Text>
              )}
            </TouchableOpacity>

            <Text className="text-[10px] text-center mt-6 text-gray-400">
              Department of Health Services Government of Nepal
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
