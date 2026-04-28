import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  SafeAreaView,
  Modal,
  TextInput,
  Alert
} from "react-native";
import { Calendar, Edit, Save, X, Check } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Crypto from 'expo-crypto';
import { createChildDeath } from "../../hooks/database/models/ChildDeathModel";
import { ChildDeathStoreType } from "../../hooks/database/types/childDeathModal";
import { HmisRecordStoreType } from "../../hooks/database/types/hmisRecordModal";

interface ChildDeathModalProps {
  visible: boolean;
  onClose: () => void;
  record: HmisRecordStoreType;
  onSuccess: (updatedDeath: ChildDeathStoreType) => void;
  showToast: (msg: string) => void;
}

export default function ChildDeathModal({ visible, onClose, record, onSuccess, showToast }: ChildDeathModalProps) {
  // Form values
  const [childName, setChildName] = useState('');
  const [deathAgeMonths, setDeathAgeMonths] = useState(1);
  const [birthDay, setBirthDay] = useState(new Date().getDate());
  const [birthMonth, setBirthMonth] = useState(new Date().getMonth() + 1);
  const [birthYear, setBirthYear] = useState(new Date().getFullYear());
  const [causeOfDeath, setCauseOfDeath] = useState('');
  const [causeOfDeathOther, setCauseOfDeathOther] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | ''>('');
  const [remarks, setRemarks] = useState('');

  // Inline errors
  const [errChildName, setErrChildName] = useState(false);
  const [errCauseOfDeath, setErrCauseOfDeath] = useState(false);
  const [errGender, setErrGender] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthDay(selectedDate.getDate());
      setBirthMonth(selectedDate.getMonth() + 1);
      setBirthYear(selectedDate.getFullYear());
    }
  };

  const handleSave = async () => {
    let hasError = false;

    if (!childName.trim()) { setErrChildName(true); hasError = true; } else { setErrChildName(false); }
    if (!causeOfDeath) { setErrCauseOfDeath(true); hasError = true; } else { setErrCauseOfDeath(false); }
    if (!gender) { setErrGender(true); hasError = true; } else { setErrGender(false); }

    if (hasError) return;

    try {
      const payload = {
        id: Crypto.randomUUID(),
        mother_id: record.id,
        mother_name: record.mother_name,
        child_name: childName,
        birth_day: birthDay,
        birth_month: birthMonth,
        birth_year: birthYear,
        death_age_months: deathAgeMonths,
        cause_of_death: causeOfDeath === 'Other' ? causeOfDeathOther : causeOfDeath,
        gender: gender,
        remarks: remarks,
      } as any;

      await createChildDeath(payload);
      showToast("बाल मृत्यु विवरण सुरक्षित गरियो ।");
      
      // Reset form fields
      setChildName('');
      setDeathAgeMonths(1);
      setBirthDay(new Date().getDate());
      setBirthMonth(new Date().getMonth() + 1);
      setBirthYear(new Date().getFullYear());
      setCauseOfDeath('');
      setCauseOfDeathOther('');
      setGender('');
      setRemarks('');
      setErrChildName(false);
      setErrCauseOfDeath(false);
      setErrGender(false);

      onSuccess(payload as ChildDeathStoreType);
      onClose();
    } catch (error) {
      Alert.alert("Error", "Failed to save record.");
    }
  };

  const FieldLabel = ({ label, hasError, required = true }: { label: string; hasError: boolean; required?: boolean }) => (
    <View className="flex-row items-center justify-between mb-2">
      <Text className="text-[13px] text-slate-700 font-medium">{label} {required && <Text className="text-red-500">*</Text>}</Text>
      {hasError && (
        <View className="bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
          <Text className="text-red-500 text-[10px] font-bold uppercase">Required</Text>
        </View>
      )}
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-[#F8FAFC]">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 bg-white shadow-sm shadow-slate-200">
          <Text className="text-slate-900 text-[17px] font-bold">२८ दिन देखि ५९ महिना सम्मका बाल मृत्यु विवरण</Text>
          <Pressable onPress={onClose} className="bg-slate-100 p-1 rounded-full">
            <X size={18} color="#64748B" />
          </Pressable>
        </View>

        {/* Progress bar indicator */}
        <View className="h-[3px] bg-blue-100 w-full">
           <View className="h-full bg-[#0056D2]" style={{ width: '100%' }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="px-6 flex-1 mt-4">
          <View className="gap-y-6 pb-12">
            
            {/* Child Name */}
            <View>
              <FieldLabel label="मृतक बच्चाको नाम" hasError={errChildName} />
              <TextInput
                placeholder="बच्चाको नाम लेख्नुहोस्..."
                placeholderTextColor="#94A3B8"
                className={`bg-white border p-3.5 rounded-xl text-slate-900 text-[13px] ${errChildName ? 'border-red-400' : 'border-slate-200'}`}
                onChangeText={(v) => { setChildName(v); if (v.trim()) setErrChildName(false); }}
                value={childName}
              />
            </View>

            {/* Gender */}
            <View>
              <FieldLabel label="बच्चाको लिङ्ग (Gender)" hasError={errGender} />
              <View className="flex-row gap-x-4">
                {[
                  { v: 'Male', l: 'छोरा (Male)' },
                  { v: 'Female', l: 'छोरी (Female)' }
                ].map((g) => (
                  <Pressable
                    key={g.v}
                    onPress={() => { setGender(g.v as any); setErrGender(false); }}
                    className={`flex-1 p-3.5 rounded-xl border flex-row items-center justify-between ${gender === g.v
                      ? 'bg-blue-50/40 border-[#0056D2]'
                      : errGender ? 'border-red-400 bg-white' : 'bg-white border-slate-200'
                      }`}
                  >
                    <Text className={`text-[13px] font-medium ${gender === g.v ? 'text-[#0056D2]' : 'text-slate-500'}`}>{g.l}</Text>
                    <View className={`w-5 h-5 rounded-full border-2 ${gender === g.v ? 'bg-[#0056D2] border-[#0056D2]' : 'border-slate-300'} items-center justify-center`}>
                      {gender === g.v && <Check size={12} color="white" strokeWidth={3} />}
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Birth Date */}
            <View>
              <FieldLabel label="बच्चा जन्मेको मिति (Birth Date)" hasError={false} />
              <Pressable
                onPress={() => setShowDatePicker(true)}
                className="bg-white border border-slate-200 p-3.5 rounded-xl flex-row items-center justify-between"
              >
                <View className="flex-row items-center">
                  <Calendar size={18} color="#0056D2" />
                  <Text className="text-slate-800 text-[14px] ml-3">
                    {birthDay}/{birthMonth}/{birthYear}
                  </Text>
                </View>
                <View className="bg-blue-50 p-2 rounded-lg">
                  <Edit size={14} color="#0056D2" />
                </View>
              </Pressable>
              {showDatePicker && (
                <DateTimePicker
                  value={new Date(birthYear, birthMonth - 1, birthDay)}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                />
              )}
            </View>

            {/* Age at Death */}
            <View>
              <FieldLabel label="मृत्यु हुँदा बच्चाको उमेर (महिनामा)" hasError={false} required={false} />
              <View className="flex-row items-center bg-white border border-slate-200 rounded-xl px-4 py-1 justify-between">
                <TextInput
                  keyboardType="numeric"
                  className="font-medium text-[#0056D2] text-[15px] py-2.5 flex-1"
                  onChangeText={(v) => setDeathAgeMonths(parseInt(v) || 0)}
                  value={deathAgeMonths?.toString() || ''}
                />
                <Text className="text-slate-500 text-[13px]">महिना (Months)</Text>
              </View>
              <Text className="text-slate-400 text-[10px] mt-1.5 ml-1 italic font-medium">
                Note: This should be between 1 to 59 months.
              </Text>
            </View>

            {/* Cause of Death */}
            <View>
              <FieldLabel label="मृत्युको सम्भाव्य कारण" hasError={errCauseOfDeath} />
              <View className="flex-row flex-wrap justify-between gap-y-3">
                {[
                  { v: 'Pneumonia', l: 'न्युमोनिया (Pneumonia)' },
                  { v: 'Diarrhea', l: 'पखाला (Diarrhea)' },
                  { v: 'Malnutrition', l: 'कुपोषण (Malnutrition)' },
                  { v: 'Other', l: 'अन्य (Other)' }
                ].map((c) => (
                  <Pressable
                    key={c.v}
                    onPress={() => { setCauseOfDeath(c.v); setErrCauseOfDeath(false); }}
                    className={`w-[48%] p-3.5 rounded-xl border flex-row items-center justify-between min-h-[70px] ${causeOfDeath === c.v
                      ? 'bg-blue-50/40 border-[#0056D2]'
                      : errCauseOfDeath ? 'bg-white border-red-300' : 'bg-white border-slate-200'
                      }`}
                  >
                    <Text className={`text-[12px] font-medium leading-relaxed ${causeOfDeath === c.v ? 'text-[#0056D2]' : 'text-slate-500'}`}>{c.l}</Text>
                    {causeOfDeath === c.v ? (
                      <View className="w-5 h-5 rounded-full bg-[#0056D2] items-center justify-center">
                        <Check size={12} color="white" strokeWidth={3} />
                      </View>
                    ) : (
                      <View className={`w-5 h-5 rounded-full border-2 ${errCauseOfDeath ? 'border-red-300' : 'border-slate-300'}`} />
                    )}
                  </Pressable>
                ))}
              </View>
              {causeOfDeath === 'Other' && (
                <TextInput
                  placeholder="कारण खुलाउनुहोस् (Specify)..."
                  className="mt-3 bg-white border border-slate-200 p-3.5 rounded-xl text-slate-900 text-[13px]"
                  onChangeText={setCauseOfDeathOther}
                  value={causeOfDeathOther}
                />
              )}
            </View>

            {/* Remarks */}
            <View>
              <FieldLabel label="कैफियत (Remarks)" hasError={false} required={false} />
              <TextInput
                placeholder="Remarks..."
                className="bg-white border border-slate-200 p-4 rounded-xl text-slate-900 min-h-[100px]"
                multiline
                placeholderTextColor="#94A3B8"
                textAlignVertical="top"
                onChangeText={setRemarks}
                value={remarks}
              />
            </View>

          </View>
        </ScrollView>

        {/* Footer */}
        <View className="p-4 bg-white border-t border-slate-100">
          <Pressable
            onPress={handleSave}
            className="bg-[#0056D2] w-full py-4 rounded-full flex-row items-center justify-center shadow-lg shadow-blue-200"
          >
            <Save size={18} color="white" />
            <Text className="text-white font-bold text-[15px] ml-2">विवरण सुरक्षित गर्नुहोस् (Save Record)</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
