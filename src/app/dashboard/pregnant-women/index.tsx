import { View, Text, Alert, Pressable, Platform, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useLocalSearchParams, useRouter } from "expo-router";
import InputField from "../../../components/InputField";
import PrimaryButton from "../../../components/PrimaryButton";
import { User, Calendar, Phone, PlusCircle } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import NavigationLayout from "@/components/NavigationLayout";
import { useLanguage } from "../../../context/LanguageContext";
import { usePregnancy } from "../../../hooks/usePregnancy";
import { useToast } from "@/context/ToastContext";

export default function PregnantWomenForm() {
  const { t } = useLanguage();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const isEditing = !!id;

  const { addPregnancy, getPregnancy, editPregnancy, isLoading } = usePregnancy();
  const [name, setName] = useState("");
  const [parity, setParity] = useState("");
  const [gravida, setGravida] = useState("");
  const [lmp, setLmp] = useState("");
  const [edd, setEdd] = useState("");
  const [caretakersName, setCaretakersName] = useState("");
  const [caretakersPhone, setCaretakersPhone] = useState("");
  const [motherId, setMotherId] = useState("");
  const [isDataLoading, setIsDataLoading] = useState(false);
  
  const [errors, setErrors] = useState<{ name?: string; lmp?: string; edd?: string; caretakersPhone?: string }>({});
  const [showLmpPicker, setShowLmpPicker] = useState(false);
  const [showEddPicker, setShowEddPicker] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (isEditing) {
      const fetchRecord = async () => {
        setIsDataLoading(true);
        const record = await getPregnancy(id);
        if (record) {
          setName(record.mother_name || "");
          setParity(String(record.parity || "0"));
          setGravida(String(record.gravida || ""));
          setLmp(record.lmp_date || "");
          setEdd(record.expected_delivery_date || "");
          setCaretakersPhone(record.mother_phone || "");
          setMotherId(record.mother_id);
        }
        setIsDataLoading(false);
      };
      fetchRecord();
    }
  }, [id]);

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
    const gravidaVal = parseInt(gravida, 10);

    const payload = {
      lmp_date: lmp,
      expected_delivery_date: edd,
      parity: isNaN(parityVal) ? 0 : parityVal,
      gravida: isNaN(gravidaVal) ? 0 : gravidaVal,
    } as any;

    let result;
    if (isEditing) {
      result = await editPregnancy(id, payload);
    } else {
      payload.mother_id = motherId || "TBD"; // TBD: needs mother selection
      payload.is_current = 1;
      payload.selected = 0;
      result = await addPregnancy(payload);
    }

    if (result.success) {
      showToast(isEditing ? "Pregnancy record updated." : "Pregnant mother added successfully.");
      if (isEditing) {
        router.back();
      } else {
        // Clear form for new entry
        setName("");
        setParity("");
        setGravida("");
        setLmp("");
        setEdd("");
        setCaretakersName("");
        setCaretakersPhone("");
        setErrors({});
      }
    } else {
      showToast("Could not save details.");
    }
  };

  if (isDataLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <NavigationLayout title={isEditing ? "Edit Pregnancy Record" : (t("pregnant_form.title") || "Register Pregnant Mother")} />
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        className="px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 20, flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={20}
      >
        <View>
          <InputField
            label={t("pregnant_form.basic_info.name_label") || "Mother's Name"}
            placeholder="Enter full name"
            value={name}
            editable={!isEditing} // Name is usually fixed for the mother
            onChangeText={(txt) => {
              setName(txt);
              if (errors.name) setErrors({ ...errors, name: undefined });
            }}
            leftIcon={<User size={18} color="#64748B" />}
            error={errors.name}
          />
          
          <View className="flex-row gap-4">
             <View className="flex-1">
                <InputField
                    label="Gravida"
                    placeholder="Total pregnancies"
                    keyboardType="numeric"
                    value={gravida}
                    onChangeText={setGravida}
                    leftIcon={<PlusCircle size={18} color="#64748B" />}
                />
             </View>
             <View className="flex-1">
                <InputField
                    label="Parity"
                    placeholder="Births"
                    keyboardType="numeric"
                    value={parity}
                    onChangeText={setParity}
                    leftIcon={<PlusCircle size={18} color="#64748B" />}
                />
             </View>
          </View>

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
            label="Phone"
            placeholder="Enter 10-digit mobile number"
            keyboardType="phone-pad"
            value={caretakersPhone}
            editable={!isEditing}
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
              title={isEditing ? "Update Details" : (t("pregnant_form.submit.title") || "Register")}
              subTitle={isEditing ? "Save changes to record" : "Register new pregnant mother"}
              onPress={handleSubmit}
              isLoading={isLoading}
              className="mb-10 shadow-lg shadow-blue-200"
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
