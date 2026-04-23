import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
  Platform,
  StatusBar,
} from "react-native";
import React, { useState, useEffect } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useLocalSearchParams, useRouter } from "expo-router";
import InputField from "../../components/InputField";
import { SelectInput, FieldLabel } from "../../components/FormElements";
import { getAllMothersList, MotherListDbItem } from "../../hooks/database/models/MotherModel";
import {
  User,
  Calendar,
  FileText,
  MapPin,
  ChevronDown,
  Stethoscope,
  Baby,
  ClipboardList,
} from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import NavigationLayout from "@/components/NavigationLayout";
import { useVisit } from "../../hooks/useVisit";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/components/button";

type VisitType = "ANC" | "PNC";

const VISIT_TYPES: { label: string; labelNp: string; value: VisitType; icon: any; color: string; bg: string }[] = [
  { label: "ANC", labelNp: "प्रसवपूर्व जाँच", value: "ANC", icon: Stethoscope, color: "#3B82F6", bg: "bg-blue-50" },
  { label: "PNC", labelNp: "प्रसवपश्चात् जाँच", value: "PNC", icon: Baby, color: "#E11D48", bg: "bg-rose-50" },
];

export default function FollowUpForm() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addVisit, editVisit, getVisit, isLoading } = useVisit();
  const { showToast } = useToast();
  const router = useRouter();

  const [mothers, setMothers] = useState<MotherListDbItem[]>([]);
  const [selectedMotherId, setSelectedMotherId] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [visitType, setVisitType] = useState<VisitType | "">("");
  const [remarks, setRemarks] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [errors, setErrors] = useState<{ motherId?: string; name?: string; date?: string; visitType?: string }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const list = await getAllMothersList();
        setMothers(list);

        if (id) {
          const visit = await getVisit(id);
          if (visit) {
            setSelectedMotherId(visit.mother_id);
            setName(visit.name || "");
            setAddress(visit.address || "");
            setDate(visit.visit_date);
            setVisitType(visit.visit_type as VisitType);
            setRemarks(visit.visit_notes || "");
          }
        } else {
          // Reset form for fresh entry
          setSelectedMotherId("");
          setName("");
          setAddress("");
          setDate("");
          setVisitType("");
          setRemarks("");
          setErrors({});
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [id]);

  const handleMotherSelect = (motherId: string) => {
    setSelectedMotherId(motherId);
    const mother = mothers.find(m => m.id === motherId);
    if (mother) {
      setName(mother.name);
      setAddress(mother.ward);
    }
    if (errors.motherId) setErrors({ ...errors, motherId: undefined });
  };

  const formatDate = (d: Date) => {
    try {
      return d.toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  const onDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(formatDate(selectedDate));
      if (errors.date) setErrors({ ...errors, date: undefined });
    }
  };

  const handleSubmit = async () => {
    const newErrors: typeof errors = {};
    if (!selectedMotherId) newErrors.motherId = "Please select a mother";
    if (!name.trim()) newErrors.name = "Name is required";
    if (!date) newErrors.date = "Visit date is required";
    if (!visitType) newErrors.visitType = "Select visit type (ANC/PNC)";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const payload = {
      mother_id: selectedMotherId,
      name: name.trim(),
      address: address.trim(),
      visit_date: date,
      visit_type: visitType as VisitType,
      visit_notes: remarks.trim(),
    };

    const result = id
      ? await editVisit(id, payload)
      : await addVisit(payload);

    if (result.success) {
      showToast(id ? "Visit updated successfully." : "Visit recorded successfully.");
      if (id) {
        router.back();
      } else {
        setSelectedMotherId("");
        setName("");
        setAddress("");
        setDate("");
        setVisitType("");
        setRemarks("");
        setErrors({});
      }
    } else {
      showToast(id ? "Failed to update visit." : "Failed to save visit.");
    }
  };

  const selectedType = VISIT_TYPES.find((t) => t.value === visitType);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <NavigationLayout title={id ? "Edit Visit" : "Visit"} />

      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        className="px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 10, flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={20}
      >
        {/* Mother Selection */}
        <View className="mb-2">
          <View className="flex-row items-center justify-between mb-1.5 px-0.5">
            <Text className="text-gray-500 font-bold text-[13px] uppercase tracking-wider">Select Mother</Text>
            <Text className="text-gray-400 font-bold text-[11px] uppercase">आमा छनोट गर्नुहोस्</Text>
          </View>
          <SelectInput
            placeholder="Choose a mother..."
            value={selectedMotherId}
            options={mothers.map(m => ({ value: m.id, label: `${m.name} (${m.ward})` }))}
            onSelect={handleMotherSelect}
            error={errors.motherId}
          />
        </View>
        {/* Visit Type Dropdown */}
        <View className="mb-8">
          <View className="flex-row items-center justify-between mb-1.5 px-0.5">
            <Text className="text-gray-500 font-bold text-[13px] uppercase tracking-wider">Visit Type</Text>
            <Text className="text-gray-400 font-bold text-[11px] uppercase">भ्रमण प्रकार</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowDropdown(!showDropdown)}
            className={`flex-row items-center border-b ${errors.visitType ? "border-red-500" : "border-gray-200"} h-14 pb-1`}
          >
            <View className="mr-2">
              <ClipboardList size={18} color="#64748B" />
            </View>
            <Text className={`flex-1 text-lg font-bold ${selectedType ? 'text-[#1E293B]' : 'text-[#cbd5e1]'}`}>
              {selectedType ? selectedType.label : "Select Visit Type"}
            </Text>
            <ChevronDown size={18} color="#94a3b8" />
          </TouchableOpacity>

          {showDropdown && (
            <View className="bg-white border border-gray-200 rounded-xl mt-2 shadow-sm overflow-hidden">
              {VISIT_TYPES.map((type, index) => (
                <TouchableOpacity
                  key={type.value}
                  onPress={() => {
                    setVisitType(type.value);
                    setShowDropdown(false);
                    if (errors.visitType) setErrors({ ...errors, visitType: undefined });
                  }}
                  className={`px-4 py-3.5 flex-row justify-between items-center ${index < VISIT_TYPES.length - 1 ? 'border-b border-gray-100' : ''
                    } ${visitType === type.value ? 'bg-blue-50' : ''}`}
                >
                  <Text className={`text-[15px] ${visitType === type.value ? 'text-blue-600 font-bold' : 'text-gray-700'}`}>
                    {type.label}
                  </Text>
                  {visitType === type.value && (
                    <Text className="text-blue-600 font-bold">✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
          {errors.visitType && (
            <Text className="text-red-500 text-xs mt-1.5 font-medium">{errors.visitType}</Text>
          )}
        </View>

        {/* Name */}
        <InputField
          label="Name"
          subLabel="नाम"
          placeholder="Full Name"
          value={name}
          onChangeText={(txt) => {
            setName(txt);
            if (errors.name) setErrors({ ...errors, name: undefined });
          }}
          leftIcon={<User size={18} color="#64748B" />}
          error={errors.name}
        />

        {/* Address */}
        <InputField
          label="Address"
          subLabel="ठेगाना"
          placeholder="Ward, Municipality"
          value={address}
          onChangeText={setAddress}
          leftIcon={<MapPin size={18} color="#64748B" />}
        />

        {/* Visit Date */}
        <Pressable onPress={() => setShowDatePicker(true)}>
          <View pointerEvents="none">
            <InputField
              label="Visit Date"
              subLabel="भ्रमण मिति"
              placeholder="YYYY-MM-DD"
              value={date}
              leftIcon={<Calendar size={18} color="#64748B" />}
              editable={false}
              error={errors.date}
            />
          </View>
        </Pressable>
        {showDatePicker && (() => {
          const maxDate = new Date();
          if (visitType === "ANC") {
            maxDate.setMonth(maxDate.getMonth() + 9);
          } else if (visitType === "PNC") {
            maxDate.setFullYear(maxDate.getFullYear() + 1);
          }

          return (
            <DateTimePicker
              value={date ? new Date(date) : new Date()}
              mode="date"
              display="spinner"
              maximumDate={maxDate}
              onChange={onDateChange}
            />
          );
        })()}

        {/* Remarks */}
        <InputField
          label="Remarks"
          subLabel="कैफियत"
          placeholder="Notes about the visit..."
          value={remarks}
          onChangeText={setRemarks}
          leftIcon={<FileText size={18} color="#64748B" />}
        />

        <View className="mt-4">
          <Button
            title={id ? "Update Visit" : "Save Visit"}
            onPress={handleSubmit}
            isLoading={isLoading}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
