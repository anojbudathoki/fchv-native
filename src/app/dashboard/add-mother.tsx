import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  TextInput,
  Animated,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  ChevronLeft,
  ChevronRight,
  Camera,
  Calendar,
  Save,
  Info,
  User,
  Baby,
  CheckCircle2,
} from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Crypto from "expo-crypto";
import { createMother } from "../../hooks/database/models/MotherModel";
import { createPregnancy } from "../../hooks/database/models/PregnantWomenModal";
import { useToast } from "../../context/ToastContext";
import "../../global.css";

// ─── Reusable field components ────────────────────────────────────────────────

const FieldLabel = ({ label }: { label: string }) => (
  <Text className="text-gray-800 text-[15px] mb-2">{label}</Text>
);

const BoxInput = ({
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  maxLength,
  error,
}: {
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: any;
  maxLength?: number;
  error?: string;
}) => (
  <View className="mb-6">
    <View
      className={`bg-gray-100 rounded-2xl px-4 h-14 justify-center border ${error ? "border-red-300" : "border-gray-200"
        }`}
    >
      <TextInput
        className="text-[#1E293B] text-base"
        placeholder={placeholder}
        placeholderTextColor="#b8bbbeff"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        maxLength={maxLength}
        returnKeyType="next"
      />
    </View>
    {error ? (
      <Text className="text-red-500 text-xs mt-1 ml-1 font-medium">{error}</Text>
    ) : null}
  </View>
);

// ─── Step Indicator ───────────────────────────────────────────────────────────

const StepIndicator = ({
  step,
  totalSteps,
}: {
  step: number;
  totalSteps: number;
}) => {
  const steps = [
    { icon: User, label: "Mother Info" },
    { icon: Baby, label: "Pregnancy" },
  ];

  return (
    <View className="flex-row items-center justify-center px-6 py-4 bg-white">
      {steps.map((s, i) => {
        const isCompleted = i < step;
        const isActive = i === step;
        const Icon = s.icon;

        return (
          <React.Fragment key={i}>
            {/* Step circle */}
            <View className="items-center">
              <View
                className={`w-11 h-11 rounded-full items-center justify-center border-2 ${isCompleted
                    ? "bg-primary border-primary"
                    : isActive
                      ? "bg-white border-primary"
                      : "bg-gray-100 border-gray-200"
                  }`}
              >
                {isCompleted ? (
                  <CheckCircle2 size={20} color="white" strokeWidth={2.5} />
                ) : (
                  <Icon
                    size={18}
                    color={isActive ? "#10B981" : "#94A3B8"}
                    strokeWidth={2}
                  />
                )}
              </View>
              <Text
                className={`text-[11px] font-bold mt-1 ${isActive ? "text-primary" : isCompleted ? "text-primary" : "text-gray-400"
                  }`}
              >
                {s.label}
              </Text>
            </View>

            {/* Connector line */}
            {i < steps.length - 1 && (
              <View className="flex-1 mx-3 mb-5">
                <View
                  className={`h-[2px] rounded-full ${isCompleted ? "bg-primary" : "bg-gray-200"
                    }`}
                />
              </View>
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function AddMotherScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const [step, setStep] = useState(0);

  // Step 1 – Mother Info
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [husbandName, setHusbandName] = useState("");

  // Step 2 – Pregnancy Info
  const [gravida, setGravida] = useState("");
  const [parity, setParity] = useState("");
  const [lmp, setLmp] = useState("");
  const [edd, setEdd] = useState("");
  const [showLmpPicker, setShowLmpPicker] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

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

  const formatDate = (d: Date) => d.toISOString().split("T")[0];
  const calcEDD = (d: Date) => {
    const e = new Date(d);
    e.setDate(e.getDate() + 280);
    return formatDate(e);
  };

  const onLmpChange = (_: any, selected?: Date) => {
    setShowLmpPicker(false);
    if (selected) {
      setLmp(formatDate(selected));
      setEdd(calcEDD(selected));
    }
  };

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Full name is required";
    if (!age.trim()) e.age = "Age is required";
    if (phone && phone.length !== 10) e.phone = "Must be 10 digits";
    return e;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!gravida.trim()) e.gravida = "Gravida is required";
    if (!parity.trim()) e.parity = "Parity is required";
    if (!lmp) e.lmp = "LMP date is required";
    return e;
  };

  const goNext = () => {
    const e = validateStep1();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    animateSlide("forward");
    setStep(1);
  };

  const goBack = () => {
    if (step === 0) { router.back(); return; }
    animateSlide("back");
    setStep(0);
  };

  const handleSave = async () => {
    const e = validateStep2();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setIsLoading(true);
    try {
      const motherId = Crypto.randomUUID();
      await createMother({
        id: motherId,
        name: name,
        age: parseInt(age) || 0,
        phone: phone,
        address: address,
        husband_name: husbandName,
        is_synced: false,
      });

      await createPregnancy({
        mother_id: motherId,
        gravida: parseInt(gravida) || 0,
        parity: parseInt(parity) || 0,
        lmp_date: lmp,
        expected_delivery_date: edd,
        is_current: true,
        selected: true,
        is_synced: false
      });
      
      showToast("Mother details saved successfully");
      router.back();
    } catch (err) {
      console.error("Error saving form:", err);
      showToast("Failed to save data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="px-5 pt-10 pb-4 bg-white flex-row items-center border-b border-gray-100">
        <TouchableOpacity
          onPress={goBack}
          className="bg-gray-50 p-2.5 rounded-2xl border border-gray-100 mr-4"
        >
          <ChevronLeft size={22} color="#1E293B" strokeWidth={2.5} />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-[#1E293B] text-xl font-black">
            {step === 0 ? "Mother Registration" : "Pregnancy Information"}
          </Text>
          <Text className="text-gray-400 text-xs mt-0.5 font-medium">
            Step {step + 1} of 2
          </Text>
        </View>
      </View>

      {/* Step Indicator */}
      <StepIndicator step={step} totalSteps={2} />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
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
              paddingTop: 24,
              paddingHorizontal: 20,
            }}
            keyboardShouldPersistTaps="handled"
          >
            {/* ─── STEP 1: Mother Registration ─── */}
            {step === 0 && (
              <>
                {/* Section heading */}
                <View className="flex-row items-center bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 mb-6">
                  <User size={18} color="#3B82F6" strokeWidth={2} />
                  <Text className="ml-2 text-blue-700 font-bold text-sm">
                    Personal Details
                  </Text>
                </View>

                {/* Photo Upload */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  className="bg-gray-100 rounded-3xl items-center justify-center py-9 mb-8 border border-gray-200 relative"
                >
                  <View className="absolute top-3 right-4 bg-[#F97316] w-6 h-6 rounded-full items-center justify-center">
                    <Text className="text-white font-black text-xs">!</Text>
                  </View>
                  <View className="bg-white w-16 h-16 rounded-full items-center justify-center mb-3 shadow-sm relative border border-blue-100">
                    <Camera size={30} color="#60A5FA" strokeWidth={2} />
                    <View className="absolute -top-1.5 -right-1.5 bg-primary w-6 h-6 rounded-full items-center justify-center border-2 border-white">
                      <Text className="text-white font-black text-xs">+</Text>
                    </View>
                  </View>
                  <Text className="text-[#1E293B] font-black text-base">
                    Pregnant Mother Photo
                  </Text>
                  <Text className="text-gray-400 font-medium text-xs mt-1">
                    Click here to take a photo
                  </Text>
                </TouchableOpacity>

                {/* Full Name */}
                <FieldLabel label="Full Name" />
                <BoxInput
                  placeholder="Enter Full Name"
                  value={name}
                  onChangeText={(t) => {
                    setName(t);
                    setErrors({ ...errors, name: "" });
                  }}
                  error={errors.name}
                />

                {/* Age + Phone */}
                <View className="flex-row gap-4">
                  <View className="flex-1">
                    <FieldLabel label="Age" />
                    <BoxInput
                      placeholder="वर्ष"
                      value={age}
                      onChangeText={(t) => {
                        setAge(t.replace(/\D/g, ""));
                        setErrors({ ...errors, age: "" });
                      }}
                      keyboardType="numeric"
                      error={errors.age}
                    />
                  </View>
                  <View className="flex-1">
                    <FieldLabel label="Phone Number" />
                    <BoxInput
                      placeholder="98*******"
                      value={phone}
                      onChangeText={(t) => {
                        setPhone(t.replace(/\D/g, ""));
                        setErrors({ ...errors, phone: "" });
                      }}
                      keyboardType="phone-pad"
                      maxLength={10}
                      error={errors.phone}
                    />
                  </View>
                </View>

                {/* Address */}
                <FieldLabel label="Address" />
                <BoxInput
                  placeholder="Enter Address"
                  value={address}
                  onChangeText={setAddress}
                />

                {/* Husband Name */}
                <FieldLabel label="Husband's Name" />
                <BoxInput
                  placeholder="Enter Husband's Name"
                  value={husbandName}
                  onChangeText={setHusbandName}
                />

                {/* Next Button */}
                <TouchableOpacity
                  activeOpacity={0.88}
                  onPress={goNext}
                  className="bg-primary rounded-2xl h-16 flex-row items-center justify-center shadow-xl shadow-emerald-200"
                >
                  <Text className="text-white font-black text-lg mr-2">
                    Next
                  </Text>
                  <ChevronRight size={20} color="white" strokeWidth={2.5} />
                </TouchableOpacity>
              </>
            )}

            {/* ─── STEP 2: Pregnancy Information ─── */}
            {step === 1 && (
              <>
                {/* Section heading */}
                <View className="flex-row items-center bg-orange-50 border border-orange-100 rounded-2xl px-4 py-3 mb-6">
                  <Baby size={18} color="#F97316" strokeWidth={2} />
                  <Text className="ml-2 text-orange-700 font-bold text-sm">
                    Obstetric & Date Details
                  </Text>
                </View>

                {/* Gravida + Parity */}
                <View className="flex-row gap-4">
                  <View className="flex-1">
                    <FieldLabel label="Gravida" />
                    <BoxInput
                      placeholder="e.g. 1"
                      value={gravida}
                      onChangeText={(t) => {
                        setGravida(t.replace(/\D/g, ""));
                        setErrors({ ...errors, gravida: "" });
                      }}
                      keyboardType="numeric"
                      error={errors.gravida}
                    />
                  </View>
                  <View className="flex-1">
                    <FieldLabel label="Parity" />
                    <BoxInput
                      placeholder="e.g. 0"
                      value={parity}
                      onChangeText={(t) => {
                        setParity(t.replace(/\D/g, ""));
                        setErrors({ ...errors, parity: "" });
                      }}
                      keyboardType="numeric"
                      error={errors.parity}
                    />
                  </View>
                </View>

                {/* Important Dates card */}
                <View className="bg-gray-100 rounded-3xl p-5 mb-6 border border-gray-200">
                  <View className="flex-row items-center mb-5">
                    <View className="bg-white p-2 rounded-xl mr-3 border border-blue-100">
                      <Calendar size={18} color="#F97316" strokeWidth={2.5} />
                    </View>
                    <Text className="text-[#1E293B] font-black text-[15px]">
                      Important Dates
                    </Text>
                  </View>

                  {/* LMP */}
                  <Text className="text-gray-500 font-bold text-sm mb-3">
                    Last Menstrual Period (LMP)
                  </Text>
                  <Pressable onPress={() => setShowLmpPicker(true)}>
                    <View
                      className={`flex-row items-center bg-white border rounded-2xl px-4 h-14 mb-1 ${errors.lmp ? "border-red-300" : "border-blue-100"
                        }`}
                    >
                      <Text
                        className={`flex-1 font-bold text-base ${lmp ? "text-[#1E293B]" : "text-gray-400"
                          }`}
                      >
                        {lmp || "mm/dd/yyyy"}
                      </Text>
                      <View className="bg-[#EFF6FF] px-2 py-1 rounded-lg border border-blue-100">
                        <Calendar size={16} color="#3B82F6" strokeWidth={2} />
                      </View>
                    </View>
                  </Pressable>
                  {errors.lmp ? (
                    <Text className="text-red-500 text-xs mb-3 font-medium ml-1">
                      {errors.lmp}
                    </Text>
                  ) : (
                    <View className="mb-4" />
                  )}

                  {showLmpPicker && (
                    <DateTimePicker
                      value={lmp ? new Date(lmp) : new Date()}
                      mode="date"
                      display="spinner"
                      maximumDate={new Date()}
                      onChange={onLmpChange}
                    />
                  )}

                  {/* EDD */}
                  <View
                    className={`rounded-2xl px-5 py-4 border ${edd
                        ? "bg-[#FFF7ED] border-orange-200"
                        : "bg-white border-blue-100"
                      }`}
                  >
                    <Text className="text-orange-500 font-black text-[10px] uppercase tracking-wider mb-1">
                      Expected Delivery Date (Auto Calculated)
                    </Text>
                    <View className="flex-row items-center justify-between">
                      <Text
                        className={`text-md ${edd ? "text-[#1E293B]" : "text-gray-400"
                          }`}
                      >
                        {edd || "Auto fills after LMP"}
                      </Text>
                      <View className="bg-orange-100 p-2 rounded-xl">
                        <Info size={16} color="#F97316" strokeWidth={2.5} />
                      </View>
                    </View>
                  </View>
                </View>

                {/* Previous + Save Buttons */}
                <View className="flex-row gap-3">
                  {/* Previous */}
                  <TouchableOpacity
                    activeOpacity={0.88}
                    onPress={goBack}
                    className="flex-row items-center justify-center h-16 px-5 rounded-2xl border-2 border-gray-200 bg-gray-50"
                  >
                    <ChevronLeft size={20} color="#1E293B" strokeWidth={2.5} />
                    {/* <Text className="text-[#1E293B] font-black text-base ml-1">
                      Previous
                    </Text> */}
                  </TouchableOpacity>

                  {/* Save */}
                  <TouchableOpacity
                    activeOpacity={0.88}
                    onPress={handleSave}
                    disabled={isLoading}
                    className="flex-1 bg-primary rounded-2xl h-16 flex-row items-center justify-center shadow-xl shadow-emerald-200"
                  >
                    {isLoading ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <>
                        <Save size={20} color="white" strokeWidth={2.5} />
                        <Text className="text-white font-black text-lg ml-2">
                          Save
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
