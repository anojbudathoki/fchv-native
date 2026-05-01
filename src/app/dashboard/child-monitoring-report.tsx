import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import {
  Printer,
  ChevronLeft,
  Plus,
  X,
  Trash2,
  Save,
  Home,
  Hospital,
  UserRound,
  UserCheck,
  Stethoscope,
  Calendar
} from "lucide-react-native";
import "../../global.css";
import Colors from "../../constants/Colors";
import CustomHeader from "../../components/CustomHeader";
import Umbilical from "../../assets/fchv-service-images/umbilical-cordcare.jpg"
import NewBornBabyTouchWithChest from "../../assets/fchv-service-images/new-born-baby-touch-with-chest.jpg"
import breastfeeding from "../../assets/fchv-service-images/breastfeeding.jpg"
import babyWeighting from "../../assets/fchv-service-images/weighing-baby.webp"
import postpartum from "../../assets/fchv-service-images/postpartum.jpg"
import postpartum1 from "../../assets/fchv-service-images/postpartum-1.jpg"
import postpartum2 from "../../assets/fchv-service-images/postpartum-2.jpg"
import postpartum3 from "../../assets/fchv-service-images/postpartum-3.jpg"
import house from "../../assets/fchv-service-images/house.jpg"
import hospital from "../../assets/fchv-service-images/hospital.jpg"
import fchv from "../../assets/fchv-service-images/fchv.webp"
import fchv1 from "../../assets/fchv-service-images/fchv-1.jpeg"
import breathing from "../../assets/fchv-service-images/breathing.jpg"


import {
  createInfantMonitoring,
  getAllInfantMonitorings,
  deleteInfantMonitoring,
  getNextInfantSerialNo
} from "../../hooks/database/models/InfantMonitoringModel";
import { InfantMonitoringStoreType } from "../../hooks/database/types/infantMonitoringModal";
import * as Crypto from "expo-crypto";
import { BoxInput, SelectInput } from "../../components/FormElements";
import { getAllMothersList } from "../../hooks/database/models/MotherModel";

export default function ChildMonitoringReportScreen() {
  const router = useRouter();
  const [data, setData] = useState<InfantMonitoringStoreType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [mothers, setMothers] = useState<{ label: string, value: string }[]>([]);

  // Form states
  const [motherId, setMotherId] = useState("");
  const [motherName, setMotherName] = useState("");
  const [babyName, setBabyName] = useState("");
  const [babyBirthDay, setBabyBirthDay] = useState("");
  const [babyBirthMonth, setBabyBirthMonth] = useState("");
  const [babyBirthYear, setBabyBirthYear] = useState("");
  const [tole, setTole] = useState("");
  const [birthPlace, setBirthPlace] = useState("institution"); // 'home', 'institution', 'trained_worker'
  const [fchvPresent, setFchvPresent] = useState(0);
  const [asphyxiaManagement, setAsphyxiaManagement] = useState(0);

  const [serialNo, setSerialNo] = useState("");
  const [umbilicalCare, setUmbilicalCare] = useState(0);
  const [chestToChest, setChestToChest] = useState(0);
  const [breastfeeding1hr, setBreastfeeding1hr] = useState(0);
  const [babyWeight, setBabyWeight] = useState("normal");
  const [pnc24hr, setPnc24hr] = useState(0);
  const [pnc3day, setPnc3day] = useState(0);
  const [pnc7_14day, setPnc7_14day] = useState(0);
  const [pnc42day, setPnc42day] = useState(0);
  const [remarks, setRemarks] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [records, motherList] = await Promise.all([
        getAllInfantMonitorings(),
        getAllMothersList()
      ]);
      setData(records);
      setMothers(motherList.map(m => ({ label: m.name + (m.code ? ` (${m.code})` : ""), value: m.id })));

      const nextSn = await getNextInfantSerialNo();
      setSerialNo(nextSn.toString());
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const handleSave = async () => {
    if (!motherName && !motherId) {
      Alert.alert("Error", "Please select a mother or enter a name.");
      return;
    }

    try {
      const selectedMother = mothers.find(m => m.value === motherId);
      const nameToSave = motherName || selectedMother?.label.split(" (")[0] || "";

      await createInfantMonitoring({
        id: Crypto.randomUUID(),
        mother_id: motherId || undefined,
        mother_name: nameToSave,
        baby_name: babyName,
        baby_birth_day: parseInt(babyBirthDay) || undefined,
        baby_birth_month: parseInt(babyBirthMonth) || undefined,
        baby_birth_year: parseInt(babyBirthYear) || undefined,
        tole: tole,
        birth_place: birthPlace,
        fchv_present: fchvPresent,
        asphyxia_management: asphyxiaManagement,
        serial_no: parseInt(serialNo) || 0,
        umbilical_care: umbilicalCare,
        chest_to_chest: chestToChest,
        breastfeeding_1hr: breastfeeding1hr,
        baby_weight: babyWeight,
        pnc_check_24hr: pnc24hr,
        pnc_check_3day: pnc3day,
        pnc_check_7_14day: pnc7_14day,
        pnc_check_42day: pnc42day,
        remarks: remarks
      });

      setModalVisible(false);
      resetForm();
      fetchData();
    } catch (error) {
      Alert.alert("Error", "Failed to save record.");
    }
  };

  const resetForm = async () => {
    setMotherId("");
    setMotherName("");
    setBabyName("");
    setBabyBirthDay("");
    setBabyBirthMonth("");
    setBabyBirthYear("");
    setTole("");
    setBirthPlace("institution");
    setFchvPresent(0);
    setAsphyxiaManagement(0);
    const nextSn = await getNextInfantSerialNo();
    setSerialNo(nextSn.toString());
    setUmbilicalCare(0);
    setChestToChest(0);
    setBreastfeeding1hr(0);
    setBabyWeight("normal");
    setPnc24hr(0);
    setPnc3day(0);
    setPnc7_14day(0);
    setPnc42day(0);
    setRemarks("");
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this record?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteInfantMonitoring(id);
            fetchData();
          } catch (error) {
            Alert.alert("Error", "Failed to delete record.");
          }
        }
      }
    ]);
  };

  const categories = [
    { id: 1, title: "नाभी मलम लगाएको", icon: Umbilical, number: "१" },
    { id: 2, title: "जन्मने बित्तिकै छातीमा टाँसेर राखेको", icon: NewBornBabyTouchWithChest, number: "१" },
    { id: 3, title: "१ घण्टा भित्र स्तनपान गराएको", icon: breastfeeding, number: "१" },
    { id: 4, title: "सामान्य तौल", icon: babyWeighting, color: "bg-green-500", number: "" },
    { id: 5, title: "कम तौल", icon: babyWeighting, color: "bg-yellow-400", number: "" },
    { id: 6, title: "धेरै कम तौल", icon: babyWeighting, color: "bg-red-500", number: "" },
    { id: 7, title: "सुत्केरी भएको २४ घण्टा भित्र", icon: postpartum, number: "१" },
    { id: 8, title: "सुत्केरी भएको ३ दिनमा", icon: postpartum1, number: "२" },
    { id: 9, title: "सुत्केरी भएको ७-१४ दिनमा", icon: postpartum2, number: "३" },
    { id: 10, title: "सुत्केरी भएको ४२ दिनमा", icon: postpartum3, number: "४" },
    { id: 11, title: "अन्य", number: "५" },
  ];

  const getCatValue = (item: InfantMonitoringStoreType, catId: number) => {
    switch (catId) {
      case 1: return item.umbilical_care ? "✔" : "";
      case 2: return item.chest_to_chest ? "✔" : "";
      case 3: return item.breastfeeding_1hr ? "✔" : "";
      case 4: return item.baby_weight === "normal" ? "✔" : "";
      case 5: return item.baby_weight === "low" ? "✔" : "";
      case 6: return item.baby_weight === "very_low" ? "✔" : "";
      case 7: return item.pnc_check_24hr ? "✔" : "";
      case 8: return item.pnc_check_3day ? "✔" : "";
      case 9: return item.pnc_check_7_14day ? "✔" : "";
      case 10: return item.pnc_check_42day ? "✔" : "";
      default: return "";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <CustomHeader
        title="शिशुको अनुगमन भेट"
        onBackPress={() => router.replace("/dashboard/report")}
        rightNode={
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="bg-emerald-50 p-2 rounded-xl"
          >
            <Plus size={20} color={Colors.primary} />
          </TouchableOpacity>
        }
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="border border-slate-300 rounded-xl overflow-hidden">
              {/* Hierarchical Header */}
              <View className="flex-row bg-slate-50 border-b border-slate-300">
                <View className="w-[40px] p-2 items-center justify-center border-r border-slate-300">
                  <Text className="text-[10px] font-bold">क्र.सं.</Text>
                </View>
                <View className="w-[100px] p-2 items-center justify-center border-r border-slate-300">
                  <Text className="text-[10px] font-bold text-center">शिशु जन्म मिति (ग.म.सा.)</Text>
                </View>
                <View className="w-[120px] p-2 items-center justify-center border-r border-slate-300">
                  <Text className="text-[10px] font-bold">आमाको नाम र थर</Text>
                </View>
                <View className="w-[100px] p-2 items-center justify-center border-r border-slate-300">
                  <Text className="text-[10px] font-bold">शिशुको नाम</Text>
                </View>
                <View className="w-[80px] p-2 items-center justify-center border-r border-slate-300">
                  <Text className="text-[10px] font-bold">टोल</Text>
                </View>

                {/* Birth Place Group */}
                <View className="border-r border-slate-300">
                  <View className="border-b border-slate-300 p-1 items-center bg-slate-100">
                    <Text className="text-[10px] font-bold">शिशु जन्म</Text>
                  </View>
                  <View className="flex-row">
                    <View className="w-[70px] p-2 items-center justify-center border-r border-slate-200">
                      <Text className="text-[8px] font-bold">घर</Text>
                    </View>
                    <View className="w-[70px] p-2 items-center justify-center border-r border-slate-200">
                      <Text className="text-[8px] font-bold">संस्था</Text>
                    </View>
                    <View className="w-[60px] p-2 items-center justify-center">
                      <Text className="text-[8px] font-bold text-center">स्वा.कर्मी बाट</Text>
                    </View>
                  </View>
                </View>

                <View className="w-[80px] p-2 items-center justify-center border-r border-slate-300">
                  <Text className="text-[8px] font-bold text-center">म.स्वा.स्व.से. उपस्थित</Text>
                </View>
                <View className="w-[80px] p-2 items-center justify-center border-r border-slate-300">
                  <Text className="text-[8px] font-bold text-center">निसासिएको शिशु व्यवस्थापन</Text>
                </View>

                {categories.map((cat, idx) => (
                  <View
                    key={cat.id}
                    className={`w-[100px] p-2 items-center justify-center ${idx < categories.length - 1 ? 'border-r border-slate-300' : ''}`}
                  >
                    <Text className="text-[10px] font-bold text-center h-[35px] flex items-center">
                      {cat.title}
                    </Text>
                    {cat.color && (
                      <View className={`w-full h-1.5 mt-1 rounded-full ${cat.color}`} />
                    )}
                  </View>
                ))}
                <View className="w-[60px] p-2 items-center justify-center border-l border-slate-300">
                  <Text className="text-[10px] font-bold">Action</Text>
                </View>
              </View>

              {/* Icon Row */}
              <View className="flex-row border-b border-slate-300 bg-white">
                <View className="w-[40px] border-r border-slate-300" />
                <View className="w-[100px] border-r border-slate-300" />
                <View className="w-[120px] border-r border-slate-300" />
                <View className="w-[100px] border-r border-slate-300" />
                <View className="w-[80px] border-r border-slate-300" />

                {/* Birth Place Icons */}
                <View className="flex-row border-r border-slate-300">
                  <View className="w-[70px] border-r border-slate-200 items-center justify-center p-1">
                    <Image source={house} className="w-[60px] h-[60px]" resizeMode="cover" />
                  </View>
                  <View className="w-[70px] border-r border-slate-200 items-center justify-center p-1">
                    <Image source={hospital} className="w-[60px] h-[60px]" resizeMode="cover" />
                  </View>
                  <View className="w-[60px] items-center justify-center p-1">
                    <Image source={fchv} className="w-[60px] h-[60px]" resizeMode="cover" />
                  </View>
                </View>

                <View className="w-[80px] border-r border-slate-300 p-2 items-center justify-center">
                  <Image source={fchv1} className="w-[60px] h-[60px]" resizeMode="cover" />
                </View>

                <View className="w-[80px] border-r border-slate-300 p-2 items-center justify-center">
                  <Image source={breathing} className="w-[60px] h-[60px]" resizeMode="cover" />
                </View>

                {categories.map((cat, idx) => (
                  <View
                    key={cat.id}
                    className={`w-[100px] h-[80px] p-1 items-center justify-center ${idx < categories.length - 1 ? 'border-r border-slate-300' : ''}`}
                  >
                    <View className="w-full h-full overflow-hidden p-1">
                      {cat?.icon ? <Image source={cat?.icon} className="w-full h-full  border border-slate-300 rounded-lg" resizeMode="cover" /> : <Text className="text-slate-400 font-bold text-xs"></Text>}
                    </View>
                  </View>
                ))}
                <View className="w-[60px] border-l border-slate-300" />
              </View>

              {/* Data Rows */}
              {loading ? (
                <View className="py-10 items-center" style={{ width: 1700 }}>
                  <ActivityIndicator color={Colors.primary} />
                </View>
              ) : (
                data.map((item, rowIdx) => (
                  <View key={item.id} className="flex-row border-b border-slate-200">
                    <View className="w-[40px] p-2 items-center justify-center border-r border-slate-200 h-[50px]">
                      <Text className="text-slate-700 font-bold text-xs">{item.serial_no}</Text>
                    </View>
                    <View className="w-[100px] p-2 items-center justify-center border-r border-slate-200 h-[50px]">
                      <Text className="text-slate-700 font-bold text-xs">
                        {item.baby_birth_year}.{item.baby_birth_month}.{item.baby_birth_day}
                      </Text>
                    </View>
                    <View className="w-[120px] p-2 justify-center border-r border-slate-200 h-[50px]">
                      <Text className="text-slate-700 font-bold text-xs" numberOfLines={1}>{item.mother_name}</Text>
                    </View>
                    <View className="w-[100px] p-2 justify-center border-r border-slate-200 h-[50px]">
                      <Text className="text-slate-700 font-bold text-xs" numberOfLines={1}>{item.baby_name}</Text>
                    </View>
                    <View className="w-[80px] p-2 justify-center border-r border-slate-200 h-[50px]">
                      <Text className="text-slate-700 font-bold text-xs">{item.tole}</Text>
                    </View>

                    {/* Birth Place Data */}
                    <View className="w-[70px] p-2 items-center justify-center border-r border-slate-200 h-[50px]">
                      <Text className="text-emerald-600 font-black text-base">{item.birth_place === 'home' ? "✔" : ""}</Text>
                    </View>
                    <View className="w-[70px] p-2 items-center justify-center border-r border-slate-200 h-[50px]">
                      <Text className="text-emerald-600 font-black text-base">{item.birth_place === 'institution' ? "✔" : ""}</Text>
                    </View>
                    <View className="w-[60px] p-2 items-center justify-center border-r border-slate-200 h-[50px]">
                      <Text className="text-emerald-600 font-black text-base">{item.birth_place === 'trained_worker' ? "✔" : ""}</Text>
                    </View>

                    <View className="w-[80px] p-2 items-center justify-center border-r border-slate-200 h-[50px]">
                      <Text className="text-emerald-600 font-black text-base">{item.fchv_present ? "✔" : ""}</Text>
                    </View>
                    <View className="w-[80px] p-2 items-center justify-center border-r border-slate-200 h-[50px]">
                      <Text className="text-emerald-600 font-black text-base">{item.asphyxia_management ? "✔" : ""}</Text>
                    </View>

                    {categories.map((cat, idx) => (
                      <View
                        key={idx}
                        className={`w-[100px] p-2 items-center justify-center h-[50px] ${idx < categories.length - 1 ? 'border-r border-slate-200' : ''}`}
                      >
                        <Text className="text-emerald-600 font-black text-base">{getCatValue(item, cat.id)}</Text>
                      </View>
                    ))}
                    <View className="w-[60px] p-2 items-center justify-center border-l border-slate-200 h-[50px]">
                      <TouchableOpacity onPress={() => handleDelete(item.id)}>
                        <Trash2 size={16} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Add Record Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-[32px] h-[90%] p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-black text-slate-800">नयाँ विवरण थप्नुहोस्</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
              <View className="gap-y-1">
                <Text className="text-slate-600 font-bold mb-2 ml-1">महिला छनौट गर्नुहोस्</Text>
                <SelectInput
                  label="महिला"
                  placeholder="Select Mother"
                  options={mothers}
                  value={motherId}
                  onSelect={(val: string) => setMotherId(val)}
                />

                {!motherId && (
                  <BoxInput
                    placeholder="महिलाको नाम र थर"
                    value={motherName}
                    onChangeText={setMotherName}
                  />
                )}

                <BoxInput
                  placeholder="शिशुको नाम"
                  value={babyName}
                  onChangeText={setBabyName}
                />

                <Text className="text-slate-600 font-bold mb-2 ml-1 mt-2">शिशुको जन्म मिति (ग.म.सा.)</Text>
                <View className="flex-row gap-2 mb-2">
                  <View className="flex-1">
                    <BoxInput placeholder="साल" value={babyBirthYear} onChangeText={setBabyBirthYear} keyboardType="numeric" />
                  </View>
                  <View className="flex-1">
                    <BoxInput placeholder="महिना" value={babyBirthMonth} onChangeText={setBabyBirthMonth} keyboardType="numeric" />
                  </View>
                  <View className="flex-1">
                    <BoxInput placeholder="गते" value={babyBirthDay} onChangeText={setBabyBirthDay} keyboardType="numeric" />
                  </View>
                </View>

                <BoxInput
                  placeholder="टोल"
                  value={tole}
                  onChangeText={setTole}
                />

                <BoxInput
                  placeholder="क्र.सं."
                  value={serialNo}
                  onChangeText={setSerialNo}
                  keyboardType="numeric"
                />

                <Text className="text-slate-600 font-bold mb-2 ml-1 mt-2">शिशु जन्म स्थान</Text>
                <SelectInput
                  label="जन्म स्थान"
                  placeholder="Select Birth Place"
                  options={[
                    { label: "घर (Home)", value: "home" },
                    { label: "संस्था (Institution)", value: "institution" },
                    { label: "तालिम प्राप्त स्वास्थ्यकर्मीबाट", value: "trained_worker" },
                  ]}
                  value={birthPlace}
                  onSelect={(val: string) => setBirthPlace(val)}
                />

                <TouchableOpacity
                  onPress={() => setFchvPresent(fchvPresent ? 0 : 1)}
                  className={`flex-row items-center p-4 rounded-2xl mb-3 border ${fchvPresent ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100'}`}
                >
                  <View className={`w-6 h-6 rounded-md border-2 mr-3 items-center justify-center ${fchvPresent ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                    {fchvPresent ? <Text className="text-white font-bold text-xs">✔</Text> : null}
                  </View>
                  <Text className="font-bold text-slate-700">म.स्वा.स्व.से. उपस्थित भएका</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setAsphyxiaManagement(asphyxiaManagement ? 0 : 1)}
                  className={`flex-row items-center p-4 rounded-2xl mb-3 border ${asphyxiaManagement ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100'}`}
                >
                  <View className={`w-6 h-6 rounded-md border-2 mr-3 items-center justify-center ${asphyxiaManagement ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                    {asphyxiaManagement ? <Text className="text-white font-bold text-xs">✔</Text> : null}
                  </View>
                  <Text className="font-bold text-slate-700">निसासिएको शिशुको व्यवस्थापन</Text>
                </TouchableOpacity>

                <Text className="text-slate-800 font-black text-lg mt-4 mb-2">शिशुको सुसार</Text>

                <TouchableOpacity
                  onPress={() => setUmbilicalCare(umbilicalCare ? 0 : 1)}
                  className={`flex-row items-center p-4 rounded-2xl mb-3 border ${umbilicalCare ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100'}`}
                >
                  <View className={`w-6 h-6 rounded-md border-2 mr-3 items-center justify-center ${umbilicalCare ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                    {umbilicalCare ? <Text className="text-white font-bold text-xs">✔</Text> : null}
                  </View>
                  <Text className="font-bold text-slate-700">नाभी मलम लगाएको</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setChestToChest(chestToChest ? 0 : 1)}
                  className={`flex-row items-center p-4 rounded-2xl mb-3 border ${chestToChest ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100'}`}
                >
                  <View className={`w-6 h-6 rounded-md border-2 mr-3 items-center justify-center ${chestToChest ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                    {chestToChest ? <Text className="text-white font-bold text-xs">✔</Text> : null}
                  </View>
                  <Text className="font-bold text-slate-700">जन्मने बित्तिकै छातीमा टाँसेर राखेको</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setBreastfeeding1hr(breastfeeding1hr ? 0 : 1)}
                  className={`flex-row items-center p-4 rounded-2xl mb-3 border ${breastfeeding1hr ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100'}`}
                >
                  <View className={`w-6 h-6 rounded-md border-2 mr-3 items-center justify-center ${breastfeeding1hr ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                    {breastfeeding1hr ? <Text className="text-white font-bold text-xs">✔</Text> : null}
                  </View>
                  <Text className="font-bold text-slate-700">१ घण्टा भित्र स्तनपान गराएको</Text>
                </TouchableOpacity>

                <Text className="text-slate-600 font-bold mb-2 ml-1 mt-2">शिशुको तौल</Text>
                <SelectInput
                  label="तौल"
                  placeholder="Select Weight Profile"
                  options={[
                    { label: "सामान्य तौल", value: "normal" },
                    { label: "कम तौल", value: "low" },
                    { label: "धेरै कम तौल", value: "very_low" },
                  ]}
                  value={babyWeight}
                  onSelect={(val: string) => setBabyWeight(val)}
                />

                <Text className="text-slate-800 font-black text-lg mt-4 mb-2">सुत्केरी जाँच (PNC)</Text>

                <View className="flex-row flex-wrap gap-2">
                  {[
                    { label: "२४ घण्टा भित्र", value: pnc24hr, setter: setPnc24hr },
                    { label: "३ दिनमा", value: pnc3day, setter: setPnc3day },
                    { label: "७-१४ दिनमा", value: pnc7_14day, setter: setPnc7_14day },
                    { label: "४२ दिनमा", value: pnc42day, setter: setPnc42day },
                  ].map((item, i) => (
                    <TouchableOpacity
                      key={i}
                      onPress={() => item.setter(item.value ? 0 : 1)}
                      className={`w-[48%] flex-row items-center p-3 rounded-xl border ${item.value ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100'}`}
                    >
                      <View className={`w-5 h-5 rounded-md border mr-2 items-center justify-center ${item.value ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                        {item.value ? <Text className="text-white font-bold text-[10px]">✔</Text> : null}
                      </View>
                      <Text className="font-bold text-slate-700 text-xs">{item.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <BoxInput
                  placeholder="कैफियत (Remarks)"
                  value={remarks}
                  onChangeText={setRemarks}
                />

                <TouchableOpacity
                  onPress={handleSave}
                  className="bg-emerald-600 h-14 rounded-2xl items-center justify-center mt-6 mb-10 shadow-lg shadow-emerald-200 flex-row"
                >
                  <Save size={20} color="white" />
                  <Text className="text-white font-black text-lg ml-2">रेकर्ड सेभ गर्नुहोस्</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
