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
  ActivityIndicator,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Crypto from "expo-crypto";
import { User, Calendar, Baby, Activity, CheckCircle2, ChevronLeft, ChevronRight, Save, Pill, Plus } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FieldLabel, BoxInput, SelectInput } from "../../../components/FormElements";
import { createHmisRecord, getNextSerialNo, getHmisRecord } from "../../../hooks/database/models/HmisRecordModel";
import { useToast } from "../../../context/ToastContext";
import "../../../global.css";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const StepIndicator = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    { icon: User, label: "Basic" },
    { icon: Calendar, label: "Dates" },
    { icon: Activity, label: "ANC" },
    { icon: Pill, label: "Meds" },
    { icon: Baby, label: "PNC" },
  ];

  return (
    <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
      {steps.map((s, i) => {
        const Icon = s.icon;
        const isActive = i <= currentStep;
        const isCurrent = i === currentStep;
        return (
          <View key={i} className="items-center flex-1">
            <View className={`w-8 h-8 rounded-xl items-center justify-center ${isActive ? 'bg-primary' : 'bg-gray-100'}`}>
              <Icon size={16} color={isActive ? "white" : "#94A3B8"} strokeWidth={isCurrent ? 3 : 2} />
            </View>
            <Text className={`text-[8px] mt-1 font-bold ${isActive ? 'text-primary' : 'text-gray-400'}`}>{s.label}</Text>
          </View>
        );
      })}
    </View>
  );
};

export default function AddRecordScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showToast } = useToast();
  const [step, setStep] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Date states
  const [lmpDate, setLmpDate] = useState<Date | null>(null);
  const [showLmpPicker, setShowLmpPicker] = useState(false);
  const [eddDate, setEddDate] = useState<Date | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    serial_no: 0,
    date_day: new Date().getDate(),
    date_month: new Date().getMonth() + 1,
    date_year: new Date().getFullYear(),
    mother_name: "",
    mother_age: "",
    lmp_day: null as number | null,
    lmp_month: null as number | null,
    lmp_year: null as number | null,
    edd_day: null as number | null,
    edd_month: null as number | null,
    edd_year: null as number | null,
    counseling_given: 0,
    checkup_12: 0, checkup_16: 0, checkup_20_24: 0, checkup_28: 0,
    checkup_32: 0, checkup_34: 0, checkup_36: 0, checkup_38_40: 0,
    checkup_other: "",
    iron_preg_received: 0,
    iron_pnc_received: 0,
    vit_a_received: 0,
    delivery_place: "",
    newborn_condition: "Alive",
    pnc_check_24hr: 0, pnc_check_3day: 0, pnc_check_7_14day: 0, pnc_check_42day: 0,
    pnc_check_other: "",
    family_planning_used: 0,
    remarks: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
        try {
            if (id) {
                const record = await getHmisRecord(id);
                if (record) {
                    setFormData({
                        ...record,
                        mother_age: String(record.mother_age || ""),
                        serial_no: record.serial_no || 0,
                    } as any);
                    if (record.lmp_year && record.lmp_month && record.lmp_day) {
                        setLmpDate(new Date(record.lmp_year, record.lmp_month - 1, record.lmp_day));
                    }
                }
            } else {
                const sn = await getNextSerialNo();
                setFormData(prev => ({ ...prev, serial_no: sn }));
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsInitialLoading(false);
        }
    };
    init();
  }, [id]);

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: -step * SCREEN_WIDTH,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  }, [step]);

  // Calculate EDD and suggest ANC weeks automatically
  useEffect(() => {
    if (lmpDate) {
      // 1. Calculate EDD
      const edd = new Date(lmpDate);
      edd.setDate(edd.getDate() + 7);
      edd.setMonth(edd.getMonth() + 9);
      setEddDate(edd);

      // 2. Calculate Gestational Weeks for the record date
      const recordDate = new Date(formData.date_year, formData.date_month - 1, formData.date_day);
      const diffTime = recordDate.getTime() - lmpDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const weeks = Math.floor(diffDays / 7);

      // 3. Update Form Data
      setFormData(prev => {
        const newData = {
          ...prev,
          lmp_day: lmpDate.getDate(),
          lmp_month: lmpDate.getMonth() + 1,
          lmp_year: lmpDate.getFullYear(),
          edd_day: edd.getDate(),
          edd_month: edd.getMonth() + 1,
          edd_year: edd.getFullYear(),
        };

        // If we are editing, we ONLY want to auto-select if the user is 
        // explicitly changing the LMP to something new, OR if it's a new record.
        // To handle this, we check if AND weeks are all currently 0 or if we're in create mode.
        const anyAncSelected = prev.checkup_12 || prev.checkup_16 || prev.checkup_20_24 || prev.checkup_28 || 
                               prev.checkup_32 || prev.checkup_34 || prev.checkup_36 || prev.checkup_38_40;

        // Force update if LMP changed or it's new. 
        // But for safety, we'll reset only the standard week columns if we're auto-matching.
        if (weeks > 0) {
            // Reset all first
            newData.checkup_12 = 0; newData.checkup_16 = 0; newData.checkup_20_24 = 0; newData.checkup_28 = 0;
            newData.checkup_32 = 0; newData.checkup_34 = 0; newData.checkup_36 = 0; newData.checkup_38_40 = 0;

            // Set new one
            if (weeks <= 12) newData.checkup_12 = 1;
            else if (weeks <= 16) newData.checkup_16 = 1;
            else if (weeks <= 24) newData.checkup_20_24 = 1;
            else if (weeks <= 28) newData.checkup_28 = 1;
            else if (weeks <= 32) newData.checkup_32 = 1;
            else if (weeks <= 34) newData.checkup_34 = 1;
            else if (weeks <= 36) newData.checkup_36 = 1;
            else if (weeks <= 42) newData.checkup_38_40 = 1;
        }

        return newData;
      });
    }
  }, [lmpDate, formData.date_day, formData.date_month, formData.date_year]);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrs = { ...prev };
        delete newErrs[field];
        return newErrs;
      });
    }
  };

  const validateStep = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!formData.mother_name.trim()) e.mother_name = "Name is required";
      if (!String(formData.mother_age).trim()) e.mother_age = "Age is required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      if (step < 4) setStep(step + 1);
      else handleSave();
    }
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const skipStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await createHmisRecord({
        id: id || Crypto.randomUUID(),
        serial_no: formData.serial_no,
        date_day: formData.date_day,
        date_month: formData.date_month,
        date_year: formData.date_year,
        mother_name: formData.mother_name,
        mother_age: parseInt(formData.mother_age as any) || null,
        lmp_day: formData.lmp_day,
        lmp_month: formData.lmp_month,
        lmp_year: formData.lmp_year,
        edd_day: formData.edd_day,
        edd_month: formData.edd_month,
        edd_year: formData.edd_year,
        counseling_given: formData.counseling_given,
        checkup_12: formData.checkup_12,
        checkup_16: formData.checkup_16,
        checkup_20_24: formData.checkup_20_24,
        checkup_28: formData.checkup_28,
        checkup_32: formData.checkup_32,
        checkup_34: formData.checkup_34,
        checkup_36: formData.checkup_36,
        checkup_38_40: formData.checkup_38_40,
        checkup_other: formData.checkup_other,
        iron_preg_received: formData.iron_preg_received,
        iron_pnc_received: formData.iron_pnc_received,
        vit_a_received: formData.vit_a_received,
        delivery_place: formData.delivery_place,
        newborn_condition: formData.newborn_condition,
        pnc_check_24hr: formData.pnc_check_24hr,
        pnc_check_3day: formData.pnc_check_3day,
        pnc_check_7_14day: formData.pnc_check_7_14day,
        pnc_check_42day: formData.pnc_check_42day,
        pnc_check_other: formData.pnc_check_other,
        family_planning_used: formData.family_planning_used,
        remarks: formData.remarks,
      });
      showToast(id ? "Record updated successfully" : "Record saved successfully");
      router.back();
    } catch (error) {
      console.error(error);
      showToast("Failed to save record");
    } finally {
      setIsLoading(false);
    }
  };

  const ToggleBox = ({ label, value, onToggle }: { label: string, value: number, onToggle: (val: number) => void }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onToggle(value === 1 ? 0 : 1)}
      className={`flex-1 flex-row items-center p-3 rounded-xl border mb-2 ${value === 1 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-100'}`}
    >
      <View className={`w-4 h-4 rounded mr-2 items-center justify-center border ${value === 1 ? 'bg-primary border-primary' : 'bg-white border-gray-300'}`}>
        {value === 1 && <CheckCircle2 size={12} color="white" strokeWidth={3} />}
      </View>
      <Text className={`text-[12px] font-bold ${value === 1 ? 'text-primary' : 'text-gray-500'}`}>{label}</Text>
    </TouchableOpacity>
  );

  const showSkip = id ? (step < 4) : (step >= 2 && step < 4);

  if (isInitialLoading) {
      return (
          <View className="flex-1 items-center justify-center bg-white">
              <ActivityIndicator size="large" color="#3B82F6" />
          </View>
      );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className="px-6 pt-14 pb-4 flex-row items-center border-b border-gray-50">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ChevronLeft size={24} color="#1E293B" />
        </TouchableOpacity>
        <View>
            <Text className="text-lg font-black text-[#1E293B]">{id ? "Edit HMIS Entry" : "New HMIS Entry"}</Text>
            <Text className="text-[10px] text-gray-400 font-bold">Auto-Serial: #{formData.serial_no}</Text>
        </View>
      </View>

      <StepIndicator currentStep={step} />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Animated.View
          style={{
            flex: 1,
            flexDirection: "row",
            width: SCREEN_WIDTH * 5,
            transform: [{ translateX: slideAnim }],
          }}
        >
          {/* Step 1: Basic Info */}
          <View style={{ width: SCREEN_WIDTH }}>
            <ScrollView className="p-6">
              <View className="bg-blue-50 p-4 rounded-2xl mb-6 border border-blue-100">
                  <Text className="text-primary font-black text-xs uppercase mb-1">Registration Context</Text>
                  <Text className="text-gray-600 text-[13px]">Registering for: <Text className="font-bold">{formData.date_day}/{formData.date_month}/{formData.date_year}</Text></Text>
              </View>

              <FieldLabel label="Mother's Full Name (आमाको नाम)" />
              <BoxInput
                placeholder="Full Name"
                value={formData.mother_name}
                onChangeText={(v) => updateField("mother_name", v)}
                error={errors.mother_name}
              />

              <FieldLabel label="Age (उमेर)" />
              <BoxInput
                placeholder="Age"
                value={String(formData.mother_age)}
                onChangeText={(v) => updateField("mother_age", v)}
                keyboardType="numeric"
                error={errors.mother_age}
              />
            </ScrollView>
          </View>

          {/* Step 2: Dates */}
          <View style={{ width: SCREEN_WIDTH }}>
            <ScrollView className="p-6">
              <FieldLabel label="LMP Date (अन्तिम रजस्वला मिति)" />
              <TouchableOpacity
                onPress={() => setShowLmpPicker(true)}
                className="bg-gray-100 rounded-2xl h-14 border border-gray-200 px-4 flex-row items-center justify-between mb-6"
              >
                <Text className={`text-base ${lmpDate ? 'text-[#1E293B]' : 'text-gray-400'}`}>
                  {lmpDate ? lmpDate.toLocaleDateString() : "Select LMP Date"}
                </Text>
                <Calendar size={20} color="#94A3B8" />
              </TouchableOpacity>

              {showLmpPicker && (
                <DateTimePicker
                  value={lmpDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    setShowLmpPicker(false);
                    if (date) setLmpDate(date);
                  }}
                />
              )}

              <FieldLabel label="Auto-calculated EDD (प्रसूतिको अनुमानित मिति)" />
              <View className="bg-green-50 p-4 rounded-2xl border border-green-100 mb-6 flex-row items-center">
                  <Calendar size={20} color="#10B981" className="mr-3" />
                  <Text className="text-[#065F46] font-bold text-base">
                    {eddDate ? eddDate.toLocaleDateString() : "Waiting for LMP..."}
                  </Text>
              </View>

              <FieldLabel label="Counseling Given? (जीवन सुरक्षा परामर्श)" />
              <View className="flex-row gap-4 mb-4">
                 <ToggleBox label="Yes (छ)" value={formData.counseling_given} onToggle={(v) => updateField("counseling_given", v)} />
              </View>
            </ScrollView>
          </View>

          {/* Step 3: ANC Visits */}
          <View style={{ width: SCREEN_WIDTH }}>
            <ScrollView className="p-6">
              <Text className="text-gray-400 font-bold mb-4 text-xs">Select the weeks when check-up was done:</Text>
              <View className="flex-row gap-2">
                 <ToggleBox label="12 Week" value={formData.checkup_12} onToggle={(v) => updateField("checkup_12", v)} />
                 <ToggleBox label="16 Week" value={formData.checkup_16} onToggle={(v) => updateField("checkup_16", v)} />
              </View>
              <View className="flex-row gap-2">
                 <ToggleBox label="20-24 Wk" value={formData.checkup_20_24} onToggle={(v) => updateField("checkup_20_24", v)} />
                 <ToggleBox label="28 Week" value={formData.checkup_28} onToggle={(v) => updateField("checkup_28", v)} />
              </View>
              <View className="flex-row gap-2">
                 <ToggleBox label="32 Week" value={formData.checkup_32} onToggle={(v) => updateField("checkup_32", v)} />
                 <ToggleBox label="34 Week" value={formData.checkup_34} onToggle={(v) => updateField("checkup_34", v)} />
              </View>
              <View className="flex-row gap-2">
                 <ToggleBox label="36 Week" value={formData.checkup_36} onToggle={(v) => updateField("checkup_36", v)} />
                 <ToggleBox label="38-40 Wk" value={formData.checkup_38_40} onToggle={(v) => updateField("checkup_38_40", v)} />
              </View>
              <FieldLabel label="Other Week (अन्य)" />
              <BoxInput placeholder="Enter other weeks" value={formData.checkup_other} onChangeText={(v) => updateField("checkup_other", v)} />
            </ScrollView>
          </View>

          {/* Step 4: Meds */}
          <View style={{ width: SCREEN_WIDTH }}>
            <ScrollView className="p-6">
              <FieldLabel label="Iron 180 (Pregnancy)" />
              <ToggleBox label="Received (पाएको)" value={formData.iron_preg_received} onToggle={(v) => updateField("iron_preg_received", v)} />

              <FieldLabel label="Iron 45 (Post-delivery)" />
              <ToggleBox label="Received (पाएको)" value={formData.iron_pnc_received} onToggle={(v) => updateField("iron_pnc_received", v)} />

              <FieldLabel label="Vitamin 'A' (Post-delivery)" />
              <ToggleBox label="Received (पाएको)" value={formData.vit_a_received} onToggle={(v) => updateField("vit_a_received", v)} />
            </ScrollView>
          </View>

          {/* Step 5: PNC & Delivery */}
          <View style={{ width: SCREEN_WIDTH }}>
            <ScrollView className="p-6">
              <FieldLabel label="Delivery Place" />
              <SelectInput
                label="Place"
                value={formData.delivery_place}
                options={[
                  { label: "Home (घर)", value: "Home" },
                  { label: "Health Facility (संस्था)", value: "Facility" },
                  { label: "Other (अन्य)", value: "Other" },
                ]}
                onSelect={(v: string) => updateField("delivery_place", v)}
              />

              <FieldLabel label="Condition of Newborn" />
              <SelectInput
                label="Condition"
                value={formData.newborn_condition}
                options={[
                  { label: "Alive (जीवित)", value: "Alive" },
                  { label: "Dead (मृत)", value: "Dead" },
                ]}
                onSelect={(v: string) => updateField("newborn_condition", v)}
              />

              <Text className="text-gray-800 font-bold mb-2 text-xs">PNC Check-ups:</Text>
              <View className="flex-row gap-2">
                 <ToggleBox label="<24 hr" value={formData.pnc_check_24hr} onToggle={(v) => updateField("pnc_check_24hr", v)} />
                 <ToggleBox label="3rd Day" value={formData.pnc_check_3day} onToggle={(v) => updateField("pnc_check_3day", v)} />
              </View>
              <View className="flex-row gap-2">
                 <ToggleBox label="7-14 Day" value={formData.pnc_check_7_14day} onToggle={(v) => updateField("pnc_check_7_14day", v)} />
                 <ToggleBox label="42nd Day" value={formData.pnc_check_42day} onToggle={(v) => updateField("pnc_check_42day", v)} />
              </View>

              <FieldLabel label="Family Planning Method User?" />
              <ToggleBox label="Used (गरेको)" value={formData.family_planning_used} onToggle={(v) => updateField("family_planning_used", v)} />

              <FieldLabel label="Remarks" />
              <BoxInput placeholder="Notes..." value={formData.remarks} onChangeText={(v) => updateField("remarks", v)} />
            </ScrollView>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>

      {/* Navigation Buttons */}
      <View className="px-6 pb-8 pt-4 border-t border-gray-100 bg-white">
        <View className="flex-row gap-3">
            {step > 0 && (
            <TouchableOpacity
                onPress={prevStep}
                className="w-12 h-12 rounded-xl bg-gray-100 items-center justify-center border border-gray-200"
            >
                <ChevronLeft size={20} color="#64748B" />
            </TouchableOpacity>
            )}
            
            <TouchableOpacity
                onPress={nextStep}
                disabled={isLoading}
                className={`flex-1 h-12 rounded-xl bg-primary items-center justify-center shadow-md shadow-blue-100`}
            >
            <View className="flex-row items-center">
                <Text className="text-white font-black text-sm mr-2">
                {step === 4 ? (isLoading ? "Saving..." : "Finish Record") : "Next Step"}
                </Text>
                {step === 4 ? <Save size={18} color="white" /> : <ChevronRight size={18} color="white" />}
            </View>
            </TouchableOpacity>

            {showSkip && (
                <TouchableOpacity
                    onPress={skipStep}
                    className="px-4 h-12 rounded-xl bg-orange-50 items-center justify-center border border-orange-100"
                >
                    <Text className="text-orange-600 font-bold text-xs">Skip</Text>
                </TouchableOpacity>
            )}
        </View>
      </View>
    </SafeAreaView>
  );
}
