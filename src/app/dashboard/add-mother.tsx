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
} from "react-native";
import React, { useState, useRef } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { User, Baby } from "lucide-react-native";
import "../../global.css";
import CustomHeader from "../../components/CustomHeader";
import MotherForm from "../../components/MotherForm";
import PregnancyForm from "../../components/PregnancyForm";

const TabIndicator = ({
  step,
  setStep,
  animateSlide,
}: {
  step: number;
  setStep: (s: number) => void;
  animateSlide: (dir: "forward" | "back") => void;
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
            onPress={() => {
              if (i !== step) {
                animateSlide(i > step ? "forward" : "back");
                setStep(i);
              }
            }}
            className={`flex-1 flex-row items-center justify-center py-3 rounded-xl ${isActive ? 'bg-green-50 border border-green-200' : 'bg-transparent border border-transparent'}`}
          >
            <Icon size={20} color={isActive ? "#10B981" : "#94A3B8"} strokeWidth={isActive ? 2.5 : 2} />
            <Text className={`ml-2 font-bold ${isActive ? 'text-green-600' : 'text-gray-400'}`}>
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

  // Slide animation
  const slideAnim = useRef(new Animated.Value(0)).current;

  const animateSlide = (direction: "forward" | "back") => {
    const toValue = direction === "forward" ? -20 : 20;
    slideAnim.setValue(toValue);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start();
  };

  const goBack = () => {
    router.back();
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
      <TabIndicator step={step} setStep={setStep} animateSlide={animateSlide} />

      <KeyboardAvoidingView
        className="flex-1"
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 30}
      >
        <Animated.View
          className="flex-1"
          style={{ transform: [{ translateX: slideAnim }] }}
        >
          <ScrollView
            className="flex-1 bg-white"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 130,
              paddingTop: 8,
              paddingHorizontal: 20,
            }}
            keyboardShouldPersistTaps="handled" // Important so that elements properly track interaction sequence
          >
            {step === 0 && <MotherForm id={id} />}
            {step === 1 && <PregnancyForm id={id} />}
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
