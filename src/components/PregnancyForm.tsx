import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Pressable } from "react-native";
import { Baby, Calendar, Info, Save } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Crypto from "expo-crypto";
import { useRouter } from "expo-router";
import { getMotherProfile } from "../hooks/database/models/MotherModel";
import { createPregnancy } from "../hooks/database/models/PregnantWomenModal";
import { useToast } from "../context/ToastContext";
import { FieldLabel, BoxInput } from "./FormElements";

export default function PregnancyForm({ id }: { id?: string }) {
  const router = useRouter();
  const { showToast } = useToast();

  const [gravida, setGravida] = useState("");
  const [parity, setParity] = useState("");
  const [lmp, setLmp] = useState("");
  const [edd, setEdd] = useState("");
  const [pregnancyId, setPregnancyId] = useState<string | null>(null);

  const [showLmpPicker, setShowLmpPicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchEditData = async () => {
        try {
          setIsLoading(true);
          const data = await getMotherProfile(id);
          if (data) {
            setGravida(data.gravida || "");
            setParity(data.parity || "");
            setLmp(data.lmp || "");
            setEdd(data.edd || "");
            setPregnancyId(data.pregnancyId || null);
          }
        } catch (e) {
          console.error("error fetching pregnancy profile", e);
        } finally {
          setIsLoading(false);
        }
      };
      fetchEditData();
    }
  }, [id]);

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

  const validate = () => {
    const e: Record<string, string> = {};
    if (!gravida.trim()) e.gravida = "Gravida is required";
    if (!parity.trim()) e.parity = "Parity is required";
    if (!lmp) e.lmp = "LMP date is required";
    return e;
  };

  const save = async () => {
    if (!id) {
      showToast("Please save the mother details first.");
      return;
    }

    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setIsLoading(true);
    try {
      await createPregnancy({
        id: (pregnancyId && pregnancyId.trim().length > 0) ? pregnancyId : Crypto.randomUUID(),
        mother_id: id,
        gravida: parseInt(gravida) || 0,
        parity: parseInt(parity) || 0,
        lmp_date: lmp,
        expected_delivery_date: edd,
        is_current: true,
        selected: true,
        is_synced: false
      });
      
      showToast("Pregnancy details saved successfully");
      router.back();
    } catch (err) {
      console.error("Error saving form:", err);
      showToast("Failed to save pregnancy data");
    } finally {
      setIsLoading(false);
    }
  };

  if (!id) {
    return (
      <View className="flex-1 items-center justify-center p-10 mt-10">
        <View className="bg-orange-50 w-20 h-20 rounded-full items-center justify-center mb-6 border border-orange-100">
          <Baby size={40} color="#F97316" strokeWidth={2} />
        </View>
        <Text className="text-[#1E293B] text-xl font-bold text-center mb-3">No Mother Found</Text>
        <Text className="text-gray-500 text-center text-sm font-medium leading-5">
          Please register and save the Mother's basic details first. Once the mother is created, you can add pregnancy records.
        </Text>
      </View>
    );
  }

  return (
    <>
      <View className="mb-6 mt-2">
        <Text className="text-[#1E293B] font-black text-2xl mb-1">Pregnancy Details</Text>
        <Text className="text-gray-500 text-[13px] font-medium leading-5">
          Please enter the correct obstetric history and timeline information below for accurate tracking.
        </Text>
      </View>

      <View className="bg-white rounded-3xl p-5 mb-6 border border-gray-100 shadow-sm shadow-gray-200/40">
        <View className="flex-row items-center mb-6">
          <View className="bg-orange-50 w-11 h-11 rounded-2xl items-center justify-center mr-3 border border-orange-100">
            <Baby size={22} color="#F97316" strokeWidth={2.5} />
          </View>
          <View>
            <Text className="text-[#1E293B] font-bold text-lg">Obstetric History</Text>
            <Text className="text-gray-400 text-xs font-medium mt-0.5">Gravida & Parity counts</Text>
          </View>
        </View>

        <View className="flex-row gap-4">
          <View className="flex-1">
            <FieldLabel label="Gravida" />
            <BoxInput
              placeholder="e.g. 1"
              value={gravida}
              onChangeText={(t) => { setGravida(t.replace(/\D/g, "")); setErrors({ ...errors, gravida: "" }); }}
              keyboardType="numeric"
              error={errors.gravida}
            />
          </View>
          <View className="flex-1">
            <FieldLabel label="Parity" />
            <BoxInput
              placeholder="e.g. 0"
              value={parity}
              onChangeText={(t) => { setParity(t.replace(/\D/g, "")); setErrors({ ...errors, parity: "" }); }}
              keyboardType="numeric"
              error={errors.parity}
            />
          </View>
        </View>
      </View>

      <View className="bg-white rounded-3xl p-5 mb-8 border border-gray-100 shadow-sm shadow-gray-200/40">
        <View className="flex-row items-center mb-6">
          <View className="bg-blue-50 w-11 h-11 rounded-2xl items-center justify-center mr-3 border border-blue-100">
            <Calendar size={22} color="#3B82F6" strokeWidth={2.5} />
          </View>
          <View>
            <Text className="text-[#1E293B] font-bold text-lg">Pregnancy Timeline</Text>
            <Text className="text-gray-400 text-xs font-medium mt-0.5">LMP and Expected Delivery Date</Text>
          </View>
        </View>

        <Text className="text-[#1E293B] font-bold text-[14px] mb-3">Last Menstrual Period (LMP)</Text>
        <Pressable onPress={() => setShowLmpPicker(true)}>
          <View className={`flex-row items-center bg-gray-50 border rounded-2xl px-4 h-14 mb-1 ${errors.lmp ? "border-red-300" : "border-gray-200"}`}>
            <Calendar size={18} color={lmp ? "#3B82F6" : "#A1A1AA"} strokeWidth={2.5} className="mr-3" />
            <Text className={`flex-1 font-semibold text-base ${lmp ? "text-[#1E293B]" : "text-gray-400"}`}>
              {lmp || "Select LMP Date"}
            </Text>
            <View className="bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm shadow-gray-200/30">
              <Text className="text-[11px] font-black text-gray-600 uppercase">Pick</Text>
            </View>
          </View>
        </Pressable>
        {errors.lmp ? <Text className="text-red-500 text-xs mb-4 font-medium ml-1">{errors.lmp}</Text> : <View className="mb-5" />}

        {showLmpPicker && (
          <DateTimePicker
            value={lmp ? new Date(lmp) : new Date()}
            mode="date"
            display="spinner"
            maximumDate={new Date()}
            onChange={onLmpChange}
          />
        )}

        <View className={`rounded-2xl p-4 border flex-row items-center justify-between mt-1 ${edd ? "bg-emerald-50 border-emerald-100" : "bg-gray-50 border-gray-200"}`}>
          <View className="flex-1">
            <Text className={`font-bold text-[10px] uppercase tracking-wider mb-1 ${edd ? "text-emerald-700" : "text-gray-400"}`}>
              Estimated Delivery Date
            </Text>
            <Text className={`font-black text-lg ${edd ? "text-emerald-800" : "text-gray-400"}`}>
              {edd || "Awaiting LMP"}
            </Text>
          </View>
          <View className={`w-11 h-11 rounded-full items-center justify-center ${edd ? "bg-white border border-emerald-100 shadow-sm shadow-emerald-200" : "bg-gray-200"}`}>
            <Info size={20} color={edd ? "#059669" : "#94A3B8"} strokeWidth={2.5} />
          </View>
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.88}
        onPress={save}
        disabled={isLoading}
        className="bg-primary rounded-2xl h-16 flex-row items-center justify-center shadow-xl shadow-emerald-200 mt-2"
      >
        {isLoading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <>
            <Save size={20} color="white" strokeWidth={2.5} />
            <Text className="text-white font-black text-lg ml-2">Save Pregnancy Info</Text>
          </>
        )}
      </TouchableOpacity>
    </>
  );
}
