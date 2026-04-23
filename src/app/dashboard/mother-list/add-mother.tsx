import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  Animated,
  Dimensions,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Crypto from "expo-crypto";
import { User, Baby } from "lucide-react-native";
import "../../../global.css";
import CustomHeader from "../../../components/CustomHeader";
import MotherForm from "../../../components/MotherForm";
import PregnancyForm from "../../../components/PregnancyForm";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const TabIndicator = ({
  step,
  setStep,
}: {
  step: number;
  setStep: (s: number) => void;
}) => {
  const tabs = [
    { icon: User, label: "Mother Info" },
    { icon: Baby, label: "Pregnancy" },
  ];

  return (
    <View className="flex-row items-center justify-center bg-white px-4 py-2 border-b border-gray-100 mb-2 gap-3">
      {tabs.map((t, i) => {
        const isActive = i === step;
        const Icon = t.icon;
        
        return (
          <TouchableOpacity 
            key={i}
            activeOpacity={0.8}
            onPress={() => setStep(i)}
            className={`flex-1 flex-row items-center justify-center py-3 rounded-xl ${isActive ? 'bg-blue-50 border border-blue-200' : 'bg-transparent border border-transparent'}`}
          >
            <Icon size={20} color={isActive ? "#3B82F6" : "#94A3B8"} strokeWidth={isActive ? 2.5 : 2} />
            <Text className={`ml-2 font-bold ${isActive ? 'text-[#3B82F6]' : 'text-gray-400'}`}>
              {t.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default function AddMotherScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [step, setStep] = useState(0);

  // Smooth sliding animation
  const slideAnim = useRef(new Animated.Value(0)).current;


  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: step === 0 ? 0 : -SCREEN_WIDTH,
      useNativeDriver: true,
      tension: 60,
      friction: 8,
    }).start();
  }, [step]);

  const goBack = () => {
    router.replace("/dashboard/mother-list" as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <CustomHeader
        title={id ? "Edit Details" : "Registration"}
        subtitle=""
        onBackPress={goBack}
      />

      {/* Tab Indicator */}
      <TabIndicator step={step} setStep={setStep} />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Animated.View
          style={{
            flex: 1,
            flexDirection: "row",
            width: SCREEN_WIDTH * 2,
            transform: [{ translateX: slideAnim }],
          }}
        >
          <View style={{ width: SCREEN_WIDTH, flex: 1 }}>
            <ScrollView
              className="flex-1 bg-white"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 130,
                paddingTop: 8,
                paddingHorizontal: 20,
              }}
              keyboardShouldPersistTaps="handled" 
            >
              <MotherForm id={id} />
            </ScrollView>
          </View>

          <View style={{ width: SCREEN_WIDTH, flex: 1 }}>
            <ScrollView
              className="flex-1 bg-white"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 130,
                paddingTop: 8,
                paddingHorizontal: 20,
              }}
              keyboardShouldPersistTaps="handled" 
            >
              <PregnancyForm id={id} onSwitchToMother={() => setStep(0)} />
            </ScrollView>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
