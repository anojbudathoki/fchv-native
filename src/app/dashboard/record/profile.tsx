import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import {
  User,
  Activity,
  Calendar,
  Edit,
  Trash2,
  Baby,
  Pill,
  Heart,
  FileText,
  Info
} from "lucide-react-native";
import "../../../global.css";
import { getHmisRecord, deleteHmisRecord } from "../../../hooks/database/models/HmisRecordModel";
import { getMaternalDeathByMother } from "../../../hooks/database/models/MaternalDeathModel";
import { getNewbornDeathByMother } from "../../../hooks/database/models/NewbornDeathModel";
import { getChildDeathByMother } from "../../../hooks/database/models/ChildDeathModel";
import MaternalDeathModal from "../../../components/forms/MaternalDeathModal";
import NewbornDeathModal from "../../../components/forms/NewbornDeathModal";
import ChildDeathModal from "../../../components/forms/ChildDeathModal";
import { HmisRecordStoreType } from "../../../hooks/database/types/hmisRecordModal";
import { MaternalDeathStoreType } from "../../../hooks/database/types/maternalDeathModal";
import { NewbornDeathStoreType } from "../../../hooks/database/types/newbornDeathModal";
import { ChildDeathStoreType } from "../../../hooks/database/types/childDeathModal";
import Colors from "../../../constants/Colors";
import CustomHeader from "../../../components/CustomHeader";
import { useToast } from "../../../context/ToastContext";

// Helper components moved outside to prevent re-renders on every parent state change
const SectionTitle = ({ title, icon: Icon, color }: any) => (
  <View className="flex-row items-center mb-4 mt-2 px-1">
    <View className={`w-8 h-8 rounded-lg items-center justify-center mr-3 ${color}`}>
      <Icon size={16} color="white" />
    </View>
    <Text className="text-slate-800 font-semibold text-base">{title}</Text>
  </View>
);

const VisitBadge = ({ label, val }: any) => (
  <View className={`px-3 py-2 rounded-xl flex-row items-center mr-2 mb-2 border ${val ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
    <View className={`w-1.5 h-1.5 rounded-full ${val ? 'bg-emerald-500' : 'bg-slate-300'}`} />
    <Text className={`ml-2 text-[12px] ${val ? 'text-emerald-700 font-semibold' : 'text-slate-400 font-medium'}`}>{label}</Text>
  </View>
);

export default function HmisRecordProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showToast } = useToast();
  const [record, setRecord] = useState<HmisRecordStoreType | null>(null);
  const [existingDeathRecord, setExistingDeathRecord] = useState<MaternalDeathStoreType | null>(null);
  const [existingNewbornDeathRecord, setExistingNewbornDeathRecord] = useState<NewbornDeathStoreType | null>(null);
  const [existingChildDeathRecord, setExistingChildDeathRecord] = useState<ChildDeathStoreType | null>(null);
  const [loading, setLoading] = useState(true);

  const [maternalDeathModalVisible, setMaternalDeathModalVisible] = useState(false);
  const [newbornDeathModalVisible, setNewbornDeathModalVisible] = useState(false);
  const [childDeathModalVisible, setChildDeathModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchRecord = async () => {
        if (!id) {
          setLoading(false);
          return;
        }
        try {
          const data = await getHmisRecord(id);
          if (isActive) {
            setRecord(data);
            if (data?.id) {
              const deathData = await getMaternalDeathByMother(data.id);
              setExistingDeathRecord(deathData);
              const newbornDeathData = await getNewbornDeathByMother(data.id);
              setExistingNewbornDeathRecord(newbornDeathData);
              const childDeathData = await getChildDeathByMother(data.id);
              setExistingChildDeathRecord(childDeathData);
            }
          }
        } catch (error) {
          console.error("Failed to fetch record:", error);
        } finally {
          if (isActive) setLoading(false);
        }
      };

      setLoading(true);
      fetchRecord();
      return () => {
        isActive = false;
      };
    }, [id])
  );

  const handleDelete = () => {
    Alert.alert(
      "Delete Record",
      "Are you sure you want to delete this register entry?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (record?.id) {
              try {
                await deleteHmisRecord(record.id);
                showToast("Record deleted successfully");
                router.back();
              } catch (error) {
                Alert.alert("Error", "Could not delete record.");
              }
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="small" color={Colors.primary} />
        <Text className="mt-4 text-slate-400 font-medium">Loading details...</Text>
      </SafeAreaView>
    );
  }

  if (!record) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <User size={48} color="#CBD5E1" />
        <Text className="mt-4 text-lg text-slate-500 font-medium">Record not found</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-6 px-8 py-3 rounded-2xl bg-primary">
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      <CustomHeader
        title="Patient Details"
        rightNode={
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              onPress={() => router.push({ pathname: "/dashboard/record/add-record", params: { id: record.id } } as any)}
              className="p-2"
            >
              <Edit size={20} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              className="p-2"
            >
              <Trash2 size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        }
      />

      {/* Fixed Identity Section: This stays at the top while details scroll below */}
      <View className="px-5 pt-6 pb-4 bg-white border-b border-slate-50">
        <View className="flex-row items-center">
          <View className="w-16 h-16 rounded-2xl bg-blue-50 items-center justify-center border border-blue-100">
            <User size={32} color={Colors.primary} />
          </View>
          <View className="ml-4 flex-1">
            <View className="flex-row items-center mb-1">
              <Text className="text-slate-500 font-medium text-xs uppercase tracking-wider">Serial No. {record.serial_no}</Text>
            </View>
            <Text className="text-slate-900 text-2xl font-semibold leading-tight">
              {record.mother_name}
            </Text>
            <Text className="text-slate-500 font-medium text-sm mt-1">{record.mother_age} Years • Maternal Health</Text>
          </View>
        </View>

        {/* Clean Info Grid */}
        <View className="flex-row mt-6 bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
          <View className="flex-1 p-4 items-center border-r border-slate-100">
            <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1.5">LMP Date</Text>
            <Text className="text-slate-700 font-semibold text-base">{record.lmp_day}/{record.lmp_month}/{record.lmp_year}</Text>
          </View>
          <View className="flex-1 p-4 items-center">
            <Text className="text-primary text-[10px] font-bold uppercase tracking-widest mb-1.5">EDD Date</Text>
            <Text className="text-slate-700 font-semibold text-base">{record.edd_day}/{record.edd_month}/{record.edd_year}</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }} // Extra padding to ensure content isn't "stuck" behind BottomNavigation
      >
        <View className="px-5 py-6 gap-y-6">

          {/* Quick Stats Row */}
          <View className="flex-row gap-4">
            <View className="flex-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50">
              <View className="flex-row items-center mb-2">
                <Info size={14} color={Colors.primary} />
                <Text className="ml-2 text-slate-400 text-[11px] font-bold uppercase">Counseling</Text>
              </View>
              <Text className="text-slate-800 font-semibold text-base">{record.counseling_given ? "Provided" : "Not Provided"}</Text>
            </View>
            <View className="flex-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50">
              <View className="flex-row items-center mb-2">
                <Calendar size={14} color="#D97706" />
                <Text className="ml-2 text-slate-400 text-[11px] font-bold uppercase">Reg. Date</Text>
              </View>
              <Text className="text-slate-800 font-semibold text-base">{record.date_day}/{record.date_month}/{record.date_year}</Text>
            </View>
          </View>

          {/* ANC Checkups */}
          <View>
            <SectionTitle title="ANC Visits" icon={Activity} color="bg-blue-500" />
            <View className="flex-row flex-wrap">
              <VisitBadge label="12 Wk" val={record.checkup_12} />
              <VisitBadge label="16 Wk" val={record.checkup_16} />
              <VisitBadge label="20-24 Wk" val={record.checkup_20_24} />
              <VisitBadge label="28 Wk" val={record.checkup_28} />
              <VisitBadge label="32 Wk" val={record.checkup_32} />
              <VisitBadge label="34 Wk" val={record.checkup_34} />
              <VisitBadge label="36 Wk" val={record.checkup_36} />
              <VisitBadge label="38-40 Wk" val={record.checkup_38_40} />
            </View>
            {record.checkup_other && (
              <View className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <Text className="text-slate-500 text-xs font-medium">{record.checkup_other}</Text>
              </View>
            )}
          </View>

          {/* Supplements */}
          <View>
            <SectionTitle title="Supplements" icon={Pill} color="bg-rose-500" />
            <View className="gap-y-2">
              {[
                { label: "Iron (Pregnancy)", val: record.iron_preg_received },
                { label: "Iron (Post-delivery)", val: record.iron_pnc_received },
                { label: "Vitamin 'A' (Post-delivery)", val: record.vit_a_received }
              ].map((item, idx) => (
                <View key={idx} className="flex-row items-center justify-between p-4 bg-white rounded-2xl border border-slate-100">
                  <Text className="text-slate-700 font-medium text-sm">{item.label}</Text>
                  <View className={`px-3 py-1 rounded-full ${item.val ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                    <Text className="text-white text-[10px] font-bold uppercase">{item.val ? "Done" : "Pending"}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Birth & PNC Details */}
          <View>
            <SectionTitle title="Birth & PNC" icon={Baby} color="bg-indigo-500" />
            <View className="flex-row gap-3 mb-4">
              <View className="flex-1 p-4 bg-white rounded-2xl border border-slate-100">
                <Text className="text-slate-400 text-[10px] font-bold uppercase mb-1">Place</Text>
                <Text className="text-slate-800 font-semibold">{record.delivery_place || "Unrecorded"}</Text>
              </View>
              <View className="flex-1 p-4 bg-white rounded-2xl border border-slate-100">
                <Text className="text-slate-400 text-[10px] font-bold uppercase mb-1">Condition</Text>
                <Text className="text-slate-800 font-semibold">{record.newborn_condition || "Unrecorded"}</Text>
              </View>
            </View>

            <View className="flex-row flex-wrap">
              <VisitBadge label="<24 hr" val={record.pnc_check_24hr} />
              <VisitBadge label="Day 3" val={record.pnc_check_3day} />
              <VisitBadge label="Day 7-14" val={record.pnc_check_7_14day} />
              <VisitBadge label="Day 42" val={record.pnc_check_42day} />
            </View>

            <View className="mt-4 p-4 rounded-2xl bg-slate-900 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Heart size={16} color="white" />
                <Text className="text-white ml-3 font-medium text-sm">Family Planning Used</Text>
              </View>
              <Text className={`font-semibold text-sm ${record.family_planning_used ? 'text-primary' : 'text-slate-400'}`}>
                {record.family_planning_used ? "YES" : "NO"}
              </Text>
            </View>
          </View>

          {/* Death Reporting Section */}
          <View>
            <SectionTitle title="Mortality Reports" icon={Activity} color="bg-red-500" />
            <View className="gap-y-3">
              {[
                {
                  title: "मातृ मृत्यु विवरण",
                  subtitle: "(गर्भवती अवस्था, प्रसव अवस्था तथा सुत्केरी भएको ४२ दिन भित्र मृत्यु भएका महिलाको लागि मात्र)",
                  key: 'maternal',
                  exists: !!existingDeathRecord
                },
                {
                  title: "नवजात शिशु मृत्यु विवरण",
                  subtitle: "(जन्मेको २८ दिन भित्र मृत्यु भएका नवजात शिशुको लागि मात्र)",
                  key: 'newborn',
                  exists: !!existingNewbornDeathRecord
                },
                {
                  title: "२८ दिन देखि ५९ महिना सम्मका बच्चाहरूको मृत्यु विवरण",
                  subtitle: "(बालबालिका मृत्यु विवरण)",
                  key: 'child',
                  exists: !!existingChildDeathRecord
                },
              ].map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (item.key === 'maternal') {
                      if (existingDeathRecord) {
                        Alert.alert("Already Reported", "Maternal death report exists.");
                      } else {
                        setMaternalDeathModalVisible(true);
                      }
                    } else if (item.key === 'newborn') {
                      setNewbornDeathModalVisible(true);
                    } else if (item.key === 'child') {
                      setChildDeathModalVisible(true);
                    }
                  }}
                  className={`p-4 rounded-2xl border ${item.exists ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'
                    }`}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1 mr-3">
                      <Text className="text-slate-800 font-semibold text-sm">{item.title}</Text>
                      <Text className="text-slate-400 text-[10px] font-medium leading-relaxed mt-1">
                        {item.subtitle}
                      </Text>
                    </View>
                    <View className={`px-3 py-1 rounded-lg ${item.exists ? 'bg-emerald-100' : 'bg-white border border-slate-200'}`}>
                      <Text className={`text-[10px] font-bold uppercase ${item.exists ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {['newborn', 'child'].includes(item.key)
                          ? (item.exists ? 'Add More +' : 'Report')
                          : (item.exists ? 'Submitted' : 'Report')}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Remarks */}
          {record.remarks && (
            <View className="mb-6">
              <SectionTitle title="Remarks" icon={FileText} color="bg-slate-400" />
              <View className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <Text className="text-slate-600 font-medium leading-relaxed">{record.remarks}</Text>
              </View>
            </View>
          )}

        </View>

        {record && (
          <>
            <MaternalDeathModal
              visible={maternalDeathModalVisible}
              onClose={() => setMaternalDeathModalVisible(false)}
              record={record}
              onSuccess={(data) => setExistingDeathRecord(data)}
              showToast={showToast}
            />
            <NewbornDeathModal
              visible={newbornDeathModalVisible}
              onClose={() => setNewbornDeathModalVisible(false)}
              record={record}
              onSuccess={(data) => setExistingNewbornDeathRecord(data)}
              showToast={showToast}
            />
            <ChildDeathModal
              visible={childDeathModalVisible}
              onClose={() => setChildDeathModalVisible(false)}
              record={record}
              onSuccess={(data) => setExistingChildDeathRecord(data)}
              showToast={showToast}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
