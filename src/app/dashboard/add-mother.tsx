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
  Image,
  Alert,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import React, { useState, useRef, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
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
  X,
} from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Crypto from "expo-crypto";
import { createMother, getMotherProfile } from "../../hooks/database/models/MotherModel";
import { createPregnancy } from "../../hooks/database/models/PregnantWomenModal";
import { useToast } from "../../context/ToastContext";
import CameraCapture from "../../components/CameraCapture";
import "../../global.css";
import CustomHeader from "../../components/CustomHeader";


const FieldLabel = ({ label }: { label: string }) => (
  <Text className="text-gray-800 text-[15px] mb-2">{label}</Text>
);

const JATI_CODES = [
  { code: "1", name: "दलित (Dalit)" },
  { code: "2", name: "जनजाति (Janajati)" },
  { code: "3", name: "मधेसी (Madhesi)" },
  { code: "4", name: "मुस्लिम (Muslim)" },
  { code: "5", name: "ब्राह्मण/छेत्री (Brahmin/Chhetri)" },
  { code: "6", name: "अन्य (Other)" },
];

const educationOptionsNepali = [
  { value: "no_formal", label: "कुनै औपचारिक शिक्षा छैन (No Formal Education)" },
  { value: "primary", label: "प्राथमिक तह – कक्षा १–५ (Primary Level)" },
  { value: "lower_secondary", label: "निम्न माध्यमिक तह – कक्षा ६–८ (Lower Secondary Level)" },
  { value: "secondary", label: "माध्यमिक तह – कक्षा ९–१० (Secondary Level / SEE)" },
  { value: "higher_secondary", label: "उच्च माध्यमिक तह – कक्षा ११–१२ (+2 / Higher Secondary)" },
  { value: "bachelor", label: "स्नातक तह (Bachelor’s Degree)" },
  { value: "master", label: "स्नातकोत्तर तह (Master’s Degree)" },
  { value: "doctoral", label: "विद्यावारिधि तह (Doctoral / PhD)" },
];

const SelectInput = ({ label, placeholder, value, options, onSelect, error }: any) => {
  const [visible, setVisible] = useState(false);
  const selectedLabel = options.find((o: any) => o.value === value)?.label || "";

  return (
    <View className="mb-6">
      <TouchableOpacity
        onPress={() => setVisible(true)}
        className={`bg-gray-100 rounded-2xl px-4 h-14 justify-center border ${error ? "border-red-300" : "border-gray-200"}`}
      >
        <Text className={`text-base ${selectedLabel ? "text-[#1E293B]" : "text-[#b8bbbeff]"}`}>
          {selectedLabel || placeholder}
        </Text>
      </TouchableOpacity>
      {error ? <Text className="text-red-500 text-xs mt-1 ml-1 font-medium">{error}</Text> : null}

      <Modal visible={visible} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-5 max-h-[70%]">
            <View className="flex-row justify-between mb-4">
              <Text className="font-bold text-lg">{label}</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <X size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {options.map((opt: any) => (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => { onSelect(opt.value); setVisible(false); }}
                  className="py-4 border-b border-gray-100"
                >
                  <Text className={`text-base ${value === opt.value ? 'font-bold text-[#22C55E]' : 'text-gray-800'}`}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

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


export default function AddMotherScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showToast } = useToast();
  const [step, setStep] = useState(0);

  // Step 1 – Mother Info
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [husbandName, setHusbandName] = useState("");
  const [ethnicity, setEthnicity] = useState("");
  const [education, setEducation] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // In-app camera visibility
  const [showCamera, setShowCamera] = useState(false);

  // Step 2 – Pregnancy Info
  const [gravida, setGravida] = useState("");
  const [parity, setParity] = useState("");
  const [lmp, setLmp] = useState("");
  const [edd, setEdd] = useState("");
  const [showLmpPicker, setShowLmpPicker] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [pregnancyId, setPregnancyId] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchEditData = async () => {
        try {
          setIsLoading(true);
          const data = await getMotherProfile(id);
          if (data) {
            setName(data.name);
            setAge(String(data.age || ""));
            setPhone(data.phone || "");
            setAddress(data.ward || "");
            setHusbandName(data.husbandName || "");
            setEthnicity(data.ethnicity || "");
            setEducation(data.education || "");
            if (data.image && !data.image.includes("vectorified")) {
              setPhotoUrl(data.image);
            }
            setGravida(data.gravida || "");
            setParity(data.parity || "");
            setLmp(data.lmp || "");
            setEdd(data.edd || "");
            setPregnancyId(data.pregnancyId);
          }
        } catch (e) {
          console.error("error fetching mother profile", e);
        } finally {
          setIsLoading(false);
        }
      };
      fetchEditData();
    }
  }, [id]);

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

  // ─── Photo handlers ───

  const handlePhotoUpload = () => {
    Alert.alert(
      "Upload Photo",
      "Choose an option",
      [
        {
          text: "Take Photo",
          onPress: () => setShowCamera(true),
        },
        {
          text: "Choose from Gallery",
          onPress: chooseFromGallery,
        },
        ...(photoUrl
          ? [
              {
                text: "Remove Photo",
                onPress: () => {
                  setPhotoUrl(null);
                  showToast("Photo removed");
                },
                style: "destructive" as const,
              },
            ]
          : []),
        {
          text: "Cancel",
          style: "cancel" as const,
        },
      ],
      { cancelable: true }
    );
  };

  const onCameraCapture = (uri: string) => {
    setPhotoUrl(uri);
    setShowCamera(false);
  };


  const chooseFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        showToast("Gallery permission is required");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 0.5,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setPhotoUrl(result.assets[0].uri);
      }
    } catch (err) {
      console.error("Gallery picker error:", err);
      showToast("Failed to pick image from gallery");
    }
  };

  // ─── Validation ───

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Full name is required";
    if (!age.trim()) e.age = "Age is required";
    if (phone && phone.length !== 10) e.phone = "Must be 10 digits";
    if (!ethnicity) e.ethnicity = "Ethnicity is required";
    if (!education) e.education = "Education is required";
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

  const generateCustomId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const getRandom = (len: number) => Array.from({ length: len }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    return `${getRandom(2)}-${getRandom(4)}-${getRandom(2)}`;
  };

  const handleSave = async () => {
    const e = validateStep2();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setIsLoading(true);
    try {
      const motherId = id || generateCustomId();
      await createMother({
        id: motherId,
        name: name,
        age: parseInt(age) || 0,
        phone: phone,
        address: address,
        husband_name: husbandName,
        ethnicity: ethnicity,
        education: education,
        photo: photoUrl ?? undefined,
        is_synced: false,
      });

      await createPregnancy({
        id: pregnancyId || undefined,
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

      {/* In-app camera modal – renders above everything including bottom tabs */}
      <CameraCapture
        visible={showCamera}
        onCapture={onCameraCapture}
        onClose={() => setShowCamera(false)}
      />

      {/* Header */}
      <CustomHeader
        title={id ? (step === 0 ? "Edit Mother" : "Edit Pregnancy") : (step === 0 ? "Mother Registration" : "Pregnancy Information")}
        subtitle={`Step ${step + 1} of 2`}
        onBackPress={goBack}
      />

      {/* Step Indicator */}
      <StepIndicator step={step} totalSteps={2} />

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
              paddingTop: 24,
              paddingHorizontal: 20,
            }}
            keyboardShouldPersistTaps="handled"
          >
            {/* ─── STEP 1: Mother Registration ─── */}
            {step === 0 && (
              <>
                {/* Photo Upload */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handlePhotoUpload}
                  className="bg-gray-100 rounded-3xl items-center justify-center py-9 mb-8 border border-gray-200 relative"
                >
                  {photoUrl ? (
                    <View className="bg-white w-24 h-24 rounded-full items-center justify-center mb-3 shadow-sm relative border border-blue-100">
                      <Image
                        source={{ uri: photoUrl }}
                        className="w-full h-full rounded-full"
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        onPress={(e) => {
                          e.stopPropagation();
                          setPhotoUrl(null);
                        }}
                        activeOpacity={0.7}
                        className="absolute -top-1.5 -right-1.5 bg-red-500 w-7 h-7 rounded-full items-center justify-center border-2 border-white z-10"
                      >
                        <X size={14} color="#fff" strokeWidth={3} />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View className="bg-white w-16 h-16 rounded-full items-center justify-center mb-3 shadow-sm relative border border-blue-100">
                      <Camera size={30} color="#60A5FA" strokeWidth={2} />
                      <View className="absolute -top-1.5 -right-1.5 bg-primary w-6 h-6 rounded-full items-center justify-center border-2 border-white">
                        <Text className="text-white font-black text-xs">+</Text>
                      </View>
                    </View>
                  )}
                  
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

                {/* Ethnicity */}
                <FieldLabel label="Ethnicity" />
                <SelectInput
                  label="Select Ethnicity"
                  placeholder="Select Ethnicity"
                  value={ethnicity}
                  options={JATI_CODES.map(j => ({ value: j.code, label: j.name }))}
                  onSelect={(val: string) => { setEthnicity(val); setErrors({...errors, ethnicity: ""}) }}
                  error={errors.ethnicity}
                />

                {/* Education */}
                <FieldLabel label="Education" />
                <SelectInput
                  label="Select Education"
                  placeholder="Select Education"
                  value={education}
                  options={educationOptionsNepali}
                  onSelect={(val: string) => { setEducation(val); setErrors({...errors, education: ""}) }}
                  error={errors.education}
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
