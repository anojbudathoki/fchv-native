import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  ChevronLeft,
  Bell,
  Heart,
  AlertTriangle,
  Send,
  ClipboardList,
  CheckCircle2,
  Circle,
  ChevronRight,
  Weight,
  Activity,
  Pill,
} from "lucide-react-native";
import "../../global.css";

// ─── Mock data (in real app, fetch by id from params) ──────────────────────────
const MOTHER = {
  name: "Sita Devi Gurung",
  nameNp: "सिता देवी गुरुङ",
  age: 26,
  weeks: 28,
  edd: "Nov 14, 2024",
  eddNp: "कार्तिक २९, २०८१",
  ward: "Ward 3",
  risk: "high",
  image: "https://media.istockphoto.com/id/1525372632/vector/logo-with-mother-and-baby-silhouette-icon-logo-sign.jpg?s=612x612&w=0&k=20&c=c6gfhaEC2p_S5vWN2jYH5sZ4asrFxVYi2yZAiOxfBJ8=",
};

const RECENT_VISITS = [
  {
    id: "v1",
    day: "24",
    month: "SEP",
    title: "24th Week Checkup",
    note: "Weight & BP Normal",
    icon: "check",
  },
  {
    id: "v2",
    day: "12",
    month: "AUG",
    title: "Iron/Folic Acid Refill",
    note: "30-day supply given",
    icon: "pill",
  },
  {
    id: "v3",
    day: "05",
    month: "JUL",
    title: "20th Week ANC Visit",
    note: "Referred for USG",
    icon: "activity",
  },
];

const BIRTH_PREP = [
  { label: "Health Post Selected", done: true },
  { label: "Transport Arranged", done: true },
  { label: "Blood Donor Identified", done: false },
  { label: "Savings for Delivery", done: false },
];

const TABS = ["Profile", "Visit History", "Birth Prep"];

// ─── Component ──────────────────────────────────────────────────────────────────

export default function MotherProfileScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Profile");

  const completedPrep = BIRTH_PREP.filter((i) => i.done).length;
  const prepProgress = completedPrep / BIRTH_PREP.length;

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <StatusBar barStyle="dark-content" />

      <View className="flex-row items-center gap-5  px-5 pt-10 pb-4 bg-white border-b border-gray-100">
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-gray-50 p-2.5 rounded-2xl border border-gray-100"
        >
          <ChevronLeft size={22} color="#1E293B" strokeWidth={2.5} />
        </TouchableOpacity>
        <Text className="text-[#1E293B] font-black text-lg">Mother Profile</Text>
        {/* <TouchableOpacity className="bg-rose-50 p-2.5 rounded-2xl border border-rose-100 relative">
          <Bell size={20} color="#E11D48" strokeWidth={2.5} />
          <View className="absolute top-2 right-2 w-2.5 h-2.5 bg-primary rounded-full border border-white" />
        </TouchableOpacity> */}
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >

        <View className="bg-white items-center mt-3 pt-3 pb-6 px-5">
          <View className="flex-row  border border-gray-200 rounded-md p-2">
            <View className="w-28 h-28 rounded-full border-4 border-rose-100 overflow-hidden shadow-md">
              <Image
                source={{ uri: MOTHER.image }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <View className="mt-5 ml-5">
              <Text className="text-gray-800 text-xl capitalize">{MOTHER.name} | {MOTHER.age} Years</Text>
              <Text className="text-gray-800 text-md">
                Reg. Date: 2026-01-01
              </Text>
            </View>
          </View>



          {/* ── Stat Cards ─────────────────────────────── */}
          <View className="flex-row gap-4 mt-6 w-full">
            <View className="flex-1 bg-blue-50 rounded-[24px] p-4 border border-blue-100">
              <Text className="text-[#3B82F6] font-black text-[10px] uppercase tracking-widest">Gestational Age</Text>
              <View className="flex-row items-center">
                <Text className="text-[#1E293B] font-black text-[25px] leading-none mt-1">{MOTHER.weeks}.</Text>
                <Text className="text-[#3B82F6] font-bold text-md">weeks,</Text>
                <Text className="text-[#1E293B] font-black text-[25px] leading-none mt-1">10.</Text>
                <Text className="text-[#3B82F6] font-bold text-md">Days</Text>

              </View>
              <Text className="text-gray-400 font-medium text-[10px] mt-1">LMP : 2024-09-08</Text>
            </View>

            <View className="flex-1 bg-rose-50 rounded-[24px] p-4 border border-rose-100">
              <Text className="text-[#E11D48] font-black text-[10px] uppercase tracking-widest">EDD Date</Text>
              <Text className="text-[#1E293B] font-black text-[22px] leading-snug mt-1">{MOTHER.edd}</Text>
              <Text className="text-gray-400 font-medium text-[10px] mt-1">{MOTHER.eddNp}</Text>
            </View>
          </View>
        </View>

        {/* ── Tab Bar ────────────────────────────────────── */}
        {/* <View className="flex-row bg-white px-5 pt-2 pb-0 border-b border-gray-100">
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`mr-6 pb-3 ${activeTab === tab ? "border-b-2 border-[#E11D48]" : ""}`}
            >
              <Text
                className={`font-black text-sm ${activeTab === tab ? "text-[#E11D48]" : "text-gray-400"
                  }`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View> */}

        <View className="px-5 pt-5">

          {/* ── Log New Visit CTA ──────────────────────── */}
          <TouchableOpacity
            activeOpacity={0.85}
            className="bg-[#E11D48] rounded-[24px] p-5 flex-row items-center justify-between mb-5 shadow-lg shadow-rose-200"
          >
            <View className="flex-row items-center flex-1">
              <View className="bg-white/20 p-2.5 rounded-2xl mr-4">
                <ClipboardList size={24} color="white" strokeWidth={2.5} />
              </View>
              <View>
                <Text className="text-white font-black text-lg">Log New Visit</Text>
                {/* <Text className="text-white/70 font-bold text-xs mt-0.5">नयाँ जाँच दर्ता गर्नुहोस्</Text> */}
              </View>
            </View>
            <View className="bg-white/20 p-2 rounded-xl">
              <ChevronRight size={20} color="white" strokeWidth={3} />
            </View>
          </TouchableOpacity>

          {/* ── Action Cards ────────────────────────────── */}
          <View className="flex-row gap-4 mb-6">
            <TouchableOpacity
              activeOpacity={0.8}
              className="flex-1 bg-[#FFF1F2] rounded-[24px] p-5 border border-rose-100"
            >
              <View className="bg-rose-100 w-10 h-10 rounded-2xl items-center justify-center mb-4">
                <AlertTriangle size={20} color="#E11D48" strokeWidth={2.5} />
              </View>
              <Text className="text-[#E11D48] font-black text-base">Danger Signs</Text>
              {/* <Text className="text-gray-400 font-bold text-xs mt-1">खतराका चिन्ह्रुक</Text> */}
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              className="flex-1 bg-[#EFF6FF] rounded-[24px] p-5 border border-blue-100"
            >
              <View className="bg-blue-100 w-10 h-10 rounded-2xl items-center justify-center mb-4">
                <Send size={20} color="#3B82F6" strokeWidth={2.5} />
              </View>
              <Text className="text-[#3B82F6] font-black text-base">Send Reminder</Text>
            </TouchableOpacity>
          </View>

          {/* ── Recent Visits ───────────────────────────── */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-[#1E293B] font-black text-xl">Recent Visits</Text>
              <TouchableOpacity>
                <Text className="text-[#E11D48] font-black text-sm">See All</Text>
              </TouchableOpacity>
            </View>

            {RECENT_VISITS.map((visit) => (
              <TouchableOpacity
                key={visit.id}
                activeOpacity={0.75}
                className="bg-white rounded-[24px] p-4 mb-3 flex-row items-center border border-gray-50 shadow-sm"
              >
                {/* Date Badge */}
                <View className="bg-gray-50 border border-gray-100 rounded-2xl items-center justify-center w-14 h-14 mr-4">
                  <Text className="text-primary font-black text-[10px] uppercase">{visit.month}</Text>
                  <Text className="text-[#1E293B] font-black text-xl leading-tight">{visit.day}</Text>
                </View>

                {/* Details */}
                <View className="flex-1">
                  <Text className="text-[#1E293B] font-black text-base">{visit.title}</Text>
                  <View className="flex-row items-center mt-1">
                    {visit.icon === "check" ? (
                      <CheckCircle2 size={13} color="#22C55E" strokeWidth={2.5} />
                    ) : visit.icon === "pill" ? (
                      <Pill size={13} color="#3B82F6" strokeWidth={2.5} />
                    ) : (
                      <Activity size={13} color="#F97316" strokeWidth={2.5} />
                    )}
                    <Text className="text-gray-400 font-bold text-[12px] ml-1">{visit.note}</Text>
                  </View>
                </View>

                <View className="bg-gray-50 p-2 rounded-xl">
                  <ChevronRight size={16} color="#94a3b8" strokeWidth={2.5} />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Birth Preparedness Progress ─────────────── */}
          <View className="bg-[#FFF8F5] rounded-[28px] p-6 border border-orange-100 mb-4">
            <Text className="text-[#1E293B] font-black text-xl mb-1">Birth Preparedness Progress</Text>
            <Text className="text-gray-400 font-bold text-xs mb-5">
              {completedPrep}/{BIRTH_PREP.length} completed
            </Text>

            {/* Progress bar */}
            <View className="h-3 bg-orange-100 rounded-full overflow-hidden mb-5">
              <View
                className="h-full bg-[#E11D48] rounded-full"
                style={{ width: `${prepProgress * 100}%` }}
              />
            </View>

            {/* Checklist */}
            {BIRTH_PREP.map((item, i) => (
              <View
                key={i}
                className={`flex-row items-center py-3 ${i < BIRTH_PREP.length - 1 ? "border-b border-orange-100" : ""}`}
              >
                {item.done ? (
                  <CheckCircle2 size={18} color="#22C55E" strokeWidth={2.5} />
                ) : (
                  <Circle size={18} color="#CBD5E1" strokeWidth={2.5} />
                )}
                <Text
                  className={`ml-3 font-bold text-[14px] ${item.done ? "text-[#1E293B]" : "text-gray-400"
                    }`}
                >
                  {item.done ? "✓ " : ""}{item.label}
                </Text>
              </View>
            ))}
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
