import { View, Text, ScrollView, Alert, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import React, { useState } from "react";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";
import { User, Calendar, Phone, PlusCircle } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import NavigationLayout from "@/components/NavigationLayout";
import { useLanguage } from "../../context/LanguageContext";
import { usePregnancy } from "../../hooks/usePregnancy";
import { useToast } from "@/context/ToastContext";

export default function PregnantWomenForm() {
  const { t } = useLanguage();
  const { addPregnancy, isLoading } = usePregnancy();
  const [name, setName] = useState("");
  const [parity, setParity] = useState("");
  const [lmp, setLmp] = useState("");
  const [edd, setEdd] = useState("");
  const [caretakersName, setCaretakersName] = useState("");
  const [caretakersPhone, setCaretakersPhone] = useState("");
  
  const [errors, setErrors] = useState<{ name?: string; lmp?: string; edd?: string; caretakersPhone?: string }>({});
  const [showLmpPicker, setShowLmpPicker] = useState(false);
  const [showEddPicker, setShowEddPicker] = useState(false);
   const { showToast } = useToast();

  const formatDate = (date: Date) => {
    try {
      return date.toISOString().split("T")[0];
    } catch (e) {
      return "";
    }
  };

  const calculateEDD = (lmpDate: Date) => {
    const eddDate = new Date(lmpDate);
    eddDate.setDate(lmpDate.getDate() + 280);
    return eddDate;
  };

  const calculateLMP = (eddDate: Date) => {
    const lmpDate = new Date(eddDate);
    lmpDate.setDate(eddDate.getDate() - 280);
    return lmpDate;
  };

  const onLmpChange = (event: any, selectedDate?: Date) => {
    setShowLmpPicker(false);
    if (selectedDate) {
      const formatted = formatDate(selectedDate);
      setLmp(formatted);
      const calculatedEdd = calculateEDD(selectedDate);
      setEdd(formatDate(calculatedEdd));
      if (errors.lmp || errors.edd) setErrors({ ...errors, lmp: undefined, edd: undefined });
    }
  };

  const onEddChange = (event: any, selectedDate?: Date) => {
    setShowEddPicker(false);
    if (selectedDate) {
      const formatted = formatDate(selectedDate);
      setEdd(formatted);
      const calculatedLmp = calculateLMP(selectedDate);
      setLmp(formatDate(calculatedLmp));
      if (errors.edd || errors.lmp) setErrors({ ...errors, edd: undefined, lmp: undefined });
    }
  };

  const handleSubmit = async () => {
    const newErrors: { name?: string; lmp?: string; edd?: string; caretakersPhone?: string } = {};
    if (!name.trim()) newErrors.name = "Mother's name is required";
    if (!lmp) newErrors.lmp = "LMP date is required";
    if (!edd) newErrors.edd = "EDD date is required";
    
    if (caretakersPhone) {
      if (caretakersPhone.length !== 10) {
        newErrors.caretakersPhone = "Phone number must be 10 digits";
      } else if (!caretakersPhone.startsWith("98") && !caretakersPhone.startsWith("97")) {
        newErrors.caretakersPhone = "Phone number must start with 98 or 97";
      }
    }
    
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const parityVal = parseInt(parity, 10);
    const payload = {
      name,
      lmp_date: lmp,
      caretakers_name: caretakersName,
      caretakers_phone: caretakersPhone,
      expected_delivery_date: edd,
      parity: isNaN(parityVal) ? 0 : parityVal,
      selected: false,
    }
    const result = await addPregnancy(payload);

    if (result.success) {
      showToast("Pregnant mother added successfully.");
      // Clear form
      setName("");
      setParity("");
      setLmp("");
      setEdd("");
      setCaretakersName("");
      setCaretakersPhone("");
      setErrors({});
    } else {
      showToast("Could not save details.");
    }
  };

  return (
    <View className="flex-1 bg-white">
      <NavigationLayout title={t("pregnant_form.title") || "Register Pregnant Mother"} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={{ flex: 1 }}
      >
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40, paddingTop: 20 }}
          keyboardShouldPersistTaps="handled"
        >
        <View>
          <InputField
            label={t("pregnant_form.basic_info.name_label") || "Mother's Name"}
            placeholder="Enter full name"
            value={name}
            onChangeText={(txt) => {
              setName(txt);
              if (errors.name) setErrors({ ...errors, name: undefined });
            }}
            leftIcon={<User size={18} color="#64748B" />}
            error={errors.name}
          />
          <InputField
            label="Parity (Number of previous births)"
            placeholder="0 for first child"
            keyboardType="numeric"
            value={parity}
            onChangeText={setParity}
            leftIcon={<PlusCircle size={18} color="#64748B" />}
          />

          <Pressable onPress={() => setShowLmpPicker(true)}>
            <View pointerEvents="none">
              <InputField
                label="Last Menstrual Period (LMP)"
                placeholder="YYYY-MM-DD"
                value={lmp}
                leftIcon={<Calendar size={18} color="#64748B" />}
                editable={false}
                error={errors.lmp}
              />
            </View>
          </Pressable>
          {showLmpPicker && (() => {
            const maxLmpDate = new Date();
            maxLmpDate.setDate(maxLmpDate.getDate() - 28);

            return (
              <DateTimePicker
                value={lmp ? new Date(lmp) : maxLmpDate}
                mode="date"
                display="spinner"
                maximumDate={maxLmpDate}
                onChange={onLmpChange}
              />
            );
          })()}

          <Pressable onPress={() => setShowEddPicker(true)}>
            <View pointerEvents="none">
              <InputField
                label="Expected Delivery Date (EDD)"
                placeholder="YYYY-MM-DD"
                value={edd}
                leftIcon={<Calendar size={18} color="#64748B" />}
                editable={false}
                error={errors.edd}
              />
            </View>
          </Pressable>
          {showEddPicker && (() => {
            const minEddDate = new Date();
            const maxEddDate = new Date();
            maxEddDate.setMonth(maxEddDate.getMonth() + 9);

            return (
              <DateTimePicker
                value={edd ? new Date(edd) : minEddDate}
                mode="date"
                display="spinner"
                minimumDate={minEddDate}
                maximumDate={maxEddDate}
                onChange={onEddChange}
              />
            );
          })()}

          <InputField
            label="Caretaker Name"
            placeholder="Enter caretaker's full name"
            value={caretakersName}
            onChangeText={setCaretakersName}
            leftIcon={<User size={18} color="#64748B" />}
          />
          <InputField
            label="Caretaker Phone"
            placeholder="Enter 10-digit mobile number"
            keyboardType="phone-pad"
            value={caretakersPhone}
            onChangeText={(txt) => {
              const cleaned = txt.replace(/[^0-9]/g, '');
              setCaretakersPhone(cleaned);
              if (errors.caretakersPhone) setErrors({ ...errors, caretakersPhone: undefined });
            }}
            leftIcon={<Phone size={18} color="#64748B" />}
            maxLength={10}
            error={errors.caretakersPhone}
          />

          <View className="mt-8">
            <PrimaryButton
              title={t("pregnant_form.submit.title") || "Save"}
              subTitle="Save pregnant mother data"
              onPress={handleSubmit}
              isLoading={isLoading}
              className="mb-10 shadow-lg shadow-blue-200"
            />
          </View>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
