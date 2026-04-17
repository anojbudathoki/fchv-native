import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import {
  Baby,
  Smile,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Clock,
  MapPin,
  Mail,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import "../../global.css";
import { useLanguage } from "../../context/LanguageContext";
import TopHeader from "@/components/layout/TopHeader";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";
import { doSync } from "../../api/services/sync/sync";

export default function DashboardScreen() {
  const { t } = useLanguage();
  const { isConnected } = useOnlineStatus();

  useEffect(() => {
    if (isConnected) {
      doSync();
    }
  }, [isConnected]);

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <TopHeader />

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 120,
        }}
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Greeting Card */}
        <View className="px-5 mt-4">
          <LinearGradient
            colors={["#3B82F6", "#266fe3ff"]}
            style={{ borderRadius: 7, borderColor: "#3B82F6", borderWidth: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="p-6 shadow-lg shadow-emerald-200"
          >
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <Text className="text-white text-[18px] font-black leading-tight">
                  Namaste,{"\n"}Laxmi Shrestha
                </Text>
                <Text className="text-white/80 text-sm mt-3 font-medium leading-5">
                  You have 3 tasks to complete today. Keep up the great work in your community!
                </Text>
              </View>
              {/* Abstract Graphic Placeholder */}
              <View className="opacity-20 absolute -right-4 -bottom-4">
                <Baby size={120} color="white" />
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Stats Grid */}
        <View className="flex-row px-5 mt-6 gap-4">
          {/* Pregnant Card */}
          <TouchableOpacity
            activeOpacity={0.8}
            className="flex-1 bg-white rounded-[28px] overflow-hidden shadow-sm border border-gray-100"
            onPress={() => router.push("/dashboard/pregnant-women" as any)}
          >
            <View className="bg-blue-500 h-1.5 w-full" />
            <View className="p-5">
              <View className="flex-row justify-between items-center mb-3">
                <View className="bg-blue-50 w-11 h-11 rounded-2xl items-center justify-center">
                  <Baby size={22} color="#3B82F6" strokeWidth={2.5} />
                </View>
                <View className="flex-row items-center bg-green-50 px-2 py-1 rounded-full">
                  <TrendingUp size={10} color="#22C55E" />
                  <Text className="text-primary font-black text-[9px] ml-1">+2</Text>
                </View>
              </View>
              <Text className="text-[#1E293B] text-[36px] font-black leading-none">12</Text>
              <Text className="text-gray-500 font-black text-[11px] uppercase tracking-wider mt-2">Pregnant</Text>
              <Text className="text-gray-400 font-bold text-[10px]">गर्भवती महिला</Text>
            </View>
          </TouchableOpacity>

          {/* Deliveries Card */}
          <TouchableOpacity
            activeOpacity={0.8}
            className="flex-1 bg-white rounded-[28px] overflow-hidden shadow-sm border border-gray-100"
          >
            <View className="bg-rose-500 h-1.5 w-full" />
            <View className="p-5">
              <View className="flex-row justify-between items-center mb-3">
                <View className="bg-rose-50 w-11 h-11 rounded-2xl items-center justify-center">
                  <Smile size={22} color="#E11D48" strokeWidth={2.5} />
                </View>
                <View className="flex-row items-center bg-rose-50 px-2 py-1 rounded-full">
                  <TrendingUp size={10} color="#E11D48" />
                  <Text className="text-[#E11D48] font-black text-[9px] ml-1">+1</Text>
                </View>
              </View>
              <Text className="text-[#1E293B] text-[36px] font-black leading-none">2</Text>
              <Text className="text-gray-500 font-black text-[11px] uppercase tracking-wider mt-2">Deliveries</Text>
              <Text className="text-gray-400 font-bold text-[10px]">नयाँ सुत्केरी</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Incentives Card */}
        <View className="px-5 mt-6">
          <TouchableOpacity
            activeOpacity={0.9}
            className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-50 flex-row items-center justify-between"
          >
            <View className="flex-1">
              <Text className="text-gray-400 font-black text-[10px] uppercase tracking-wider">My Incentives</Text>
              <Text className="text-gray-400 font-bold text-[10px] mb-2">मेरो प्रोत्साहन भत्ता</Text>
              <View className="flex-row items-end">
                <Text className="text-primary font-bold text-lg mb-1 mr-1">Rs.</Text>
                <Text className="text-[#1E293B] text-[36px] font-black tracking-tighter">1,450</Text>
              </View>
              <TouchableOpacity className="mt-4 flex-row items-center">
                <Text className="text-primary font-black text-xs uppercase tracking-widest">View History</Text>
                <ChevronRight size={14} color="#22C55E" strokeWidth={3} />
              </TouchableOpacity>
            </View>
            <View className="bg-orange-50 p-6 rounded-[40px] items-center justify-center">
              <TrendingUp size={48} color="#F97316" strokeWidth={2.5} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Today's Tasks */}
        <View className="px-5 mt-10">
          <View className="flex-row justify-between items-center mb-6 px-1">
            <View>
              <Text className="text-[#1E293B] text-xl font-black">Today's Tasks</Text>
              <Text className="text-gray-400 font-bold text-xs uppercase tracking-wider mt-1">आजका कार्यहरू</Text>
            </View>
            <View className="bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
              <Text className="text-primary font-black text-[10px] tracking-widest uppercase">3 Tasks Pending</Text>
            </View>
          </View>

          {/* Task Items */}
          <TaskItem
            name="Sita Devi"
            type="Routine Checkup"
            time="2:00 PM"
            hasAlert={true}
            image="https://i.pravatar.cc/150?u=sita"
          />
          <TaskItem
            name="Immunization Drive"
            type="Community Center"
            time="10:00 AM"
            icon={<MapPin size={22} color="#F97316" />}
          />
          <TaskItem
            name="Weekly Report"
            type="Data Entry"
            time="Due 6:00 PM"
            icon={<TrendingUp size={22} color="#3B82F6" />}
            isReport={true}
          />
        </View>

        {/* Upcoming Schedule */}
        <View className="px-5 mt-10">
          <View className="flex-row justify-between items-center mb-2 px-1">
            <View>
              <Text className="text-[#1E293B] text-xl font-black">Upcoming Schedule</Text>
              <Text className="text-gray-400 font-bold text-xs uppercase tracking-wider mt-1">आगामी तालिका</Text>
            </View>
            <TouchableOpacity>
              <Text className="text-primary font-black text-[13px]">View Calendar</Text>
            </TouchableOpacity>
          </View>

          <ScheduleList />
        </View>

        {/* Community Coverage Section */}
        <View className="px-5 mt-10">
          <View className="bg-[#EFF6FF] p-7 rounded-[40px] border border-blue-100">
            <View className="flex-row justify-between items-center mb-6">
              <View className="flex-1">
                <Text className="text-[#1E293B] text-xl font-black">Community Coverage</Text>
                <Text className="text-gray-400 font-bold text-xs mt-1">तपाईंको कार्य क्षेत्रको प्रगति</Text>
              </View>
              <Text className="text-primary text-[28px] font-black">84%</Text>
            </View>

            {/* Progress Bar */}
            <View className="h-4 w-full bg-blue-100 rounded-full overflow-hidden mb-6">
              <View className="h-full bg-primary w-[84%] rounded-full" />
            </View>

            <View className="flex-row justify-between pt-2">
              <View className="flex-row items-center">
                <View className="w-2.5 h-2.5 bg-primary rounded-full mr-2" />
                <Text className="text-[#475569] font-bold text-[13px]">42 Active Cases</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-2.5 h-2.5 bg-blue-200 rounded-full mr-2" />
                <Text className="text-[#475569] font-bold text-[13px]">8 Pending Tests</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button (Matches Bottom Bar +) */}
      <TouchableOpacity
        activeOpacity={0.9}
        className="absolute bottom-28 right-6 bg-[#C2410C] w-16 h-16 rounded-3xl items-center justify-center shadow-2xl shadow-orange-900/50"
      >
        <TrendingUp size={32} color="white" strokeWidth={3} />
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const TaskItem = ({ name, type, time, hasAlert, image, icon, isReport }: any) => (
  <TouchableOpacity
    activeOpacity={0.7}
    className="bg-white p-4 rounded-3xl mb-4 flex-row items-center shadow-sm border border-gray-50"
  >
    <View className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-50 items-center justify-center mr-4">
      {image ? (
        <Image source={{ uri: image }} className="w-full h-full" />
      ) : (
        <View className="p-3 bg-gray-50 rounded-2xl">
          {icon}
        </View>
      )}
    </View>
    <View className="flex-1">
      <Text className="text-[#1E293B] text-lg font-black">{name}</Text>
      <View className="flex-row items-center mt-1">
        <Clock size={12} color="#64748B" className="mr-1" />
        <Text className="text-[#64748B] font-bold text-[13px]">{type} • {time}</Text>
      </View>
    </View>
    <View className="flex-row items-center">
      {hasAlert && (
        <View className="mr-2">
          <AlertCircle size={20} color="#F97316" strokeWidth={2.5} />
        </View>
      )}
      <View className="bg-blue-50 p-2.5 rounded-2xl">
        <ChevronRight size={18} color="#3B82F6" strokeWidth={3} />
      </View>
    </View>
  </TouchableOpacity>
);

// --- Upcoming Schedule ---

const SCHEDULE_DATA = [
  {
    id: "1",
    day: "24",
    month: "OCT",
    name: "Radhika Thapa",
    task: "Polio Vaccination",
    taskNp: "खोप वितरण",
    hasMessage: true,
    hasAlert: true,
  },
  {
    id: "2",
    day: "25",
    month: "OCT",
    name: "Maya Tamang",
    task: "Antenatal Care",
    taskNp: "गर्भावस्था जाँच",
    hasMessage: true,
    hasAlert: false,
  },
  {
    id: "3",
    day: "26",
    month: "OCT",
    name: "Sita Gurung",
    task: "Home Visit",
    taskNp: "घर भ्रमण",
    hasMessage: false,
    hasAlert: false,
  },
  {
    id: "4",
    day: "27",
    month: "OCT",
    name: "Bishnu Rai",
    task: "Immunization",
    taskNp: "खोप",
    hasMessage: false,
    hasAlert: true,
  },
];

const ScheduleList = () => {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? SCHEDULE_DATA : SCHEDULE_DATA.slice(0, 2);

  return (
    <View className="mt-4">
      {visible.map((item) => (
        <TouchableOpacity
          key={item.id}
          activeOpacity={0.75}
          className="bg-white rounded-3xl p-4 flex-row items-center mb-4 shadow-sm border border-gray-50"
        >
          {/* Date Badge */}
          <View className="bg-gray-50 border border-gray-100 rounded-2xl items-center justify-center w-14 h-14 mr-4">
            <Text className="text-primary font-black text-[11px] uppercase tracking-wider">{item.month}</Text>
            <Text className="text-[#1E293B] text-[22px] font-black leading-tight">{item.day}</Text>
          </View>

          {/* Details */}
          <View className="flex-1">
            <Text className="text-[#1E293B] text-base font-black">{item.name}</Text>
            <Text className="text-[#64748B] font-medium text-[13px] mt-0.5">
              {item.task}{" "}
              <Text className="text-gray-400">({item.taskNp})</Text>
            </Text>
          </View>

          {/* Icons */}
          <View className="flex-row items-center gap-2">
            <View className={`p-2 rounded-xl ${item.hasMessage ? "bg-blue-50" : "bg-gray-50"}`}>
              <Mail size={16} color={item.hasMessage ? "#3B82F6" : "#CBD5E1"} strokeWidth={2.5} />
            </View>
            {item.hasAlert && (
              <View className="w-2.5 h-2.5 bg-[#F97316] rounded-full" />
            )}
          </View>
        </TouchableOpacity>
      ))}

      {/* Show More / Show Less */}
      {SCHEDULE_DATA.length > 2 && (
        <TouchableOpacity
          onPress={() => setShowAll(!showAll)}
          className="items-center py-3"
        >
          <Text className="text-primary font-black text-[13px] uppercase tracking-widest">
            {showAll ? "Show Less ↑" : `Show ${SCHEDULE_DATA.length - 2} More ↓`}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
