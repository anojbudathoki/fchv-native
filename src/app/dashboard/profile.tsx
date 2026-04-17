import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Switch,
  Pressable,
} from "react-native";
import {
  ChevronLeft,
  User,
  Shield,
  MapPin,
  Phone,
  Mail,
  Bell,
  Globe,
  LogOut,
  ChevronRight,
  Camera,
  Star,
  TrendingUp,
  Users,
  Award,
  Lock,
  HelpCircle,
  MessageSquare,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import "../../global.css";
import ModalWithSafeArea from "@/components/common/ModalWithSafeArea";
import DatabaseViewer from "@/components/DatabaseViewer";

// ── Stats ──────────────────────────────────────────────────────────────
const STATS = [
  { label: "Mothers\nRegistered", value: "42", icon: Users, color: "#3B82F6", bg: "#EFF6FF" },
  { label: "Visits\nCompleted", value: "128", icon: TrendingUp, color: "#22C55E", bg: "#F0FFF4" },
  { label: "Years\nActive", value: "3", icon: Star, color: "#F97316", bg: "#FFF7ED" },
];

// ── Settings sections ─────────────────────────────────────────────────
const SETTINGS = [
  {
    section: "Account",
    items: [
      { icon: User, label: "Edit Profile", color: "#3B82F6", bg: "#EFF6FF" },
      { icon: Lock, label: "Change Password", color: "#8B5CF6", bg: "#F5F3FF" },
      { icon: Phone, label: "Update Phone", color: "#22C55E", bg: "#F0FFF4" },
    ],
  },
  {
    section: "Preferences",
    items: [
      { icon: Bell, label: "Notifications", color: "#F97316", bg: "#FFF7ED", toggle: true },
      { icon: Globe, label: "Language", color: "#06B6D4", bg: "#ECFEFF", value: "नेपाली" },
    ],
  },
  {
    section: "Support",
    items: [
      { icon: HelpCircle, label: "Help & FAQ", color: "#64748B", bg: "#F8FAFC" },
      { icon: MessageSquare, label: "Send Feedback", color: "#22C55E", bg: "#F0FFF4" },
    ],
  },
];

export default function UserProfileScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [isDbOpen, setIsDbOpen] = useState(false);


  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <StatusBar barStyle="dark-content" />

      {/* ── Header ───────────────────────────── */}
      <View className="flex-row items-center justify-between px-5 pt-10 pb-4 bg-white border-b border-gray-100">
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-gray-50 p-2.5 rounded-2xl border border-gray-100"
        >
          <ChevronLeft size={22} color="#1E293B" strokeWidth={2.5} />
        </TouchableOpacity>
        <Text className="text-[#1E293B] font-black text-lg">My Profile</Text>
        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >

        {/* ── Hero Card ────────────────────────── */}
        <View className="mx-5 mt-5">
          <View className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm items-center">

            {/* Avatar */}
            <View className="relative mb-4">
              <View className="w-24 h-24 rounded-full overflow-hidden border-4 border-emerald-100 shadow-md">
                <Image
                  source={{ uri: "https://i.pravatar.cc/200?u=anita_sharma" }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
              <TouchableOpacity className="absolute -bottom-1 -right-1 bg-primary w-8 h-8 rounded-full items-center justify-center border-2 border-white shadow-sm">
                <Camera size={14} color="white" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            <Text className="text-[#1E293B] text-2xl font-black">Laxmi Shrestha</Text>

            {/* Role badge */}
            <View className="bg-emerald-50 px-4 py-1.5 rounded-full mt-3 border border-emerald-100 flex-row items-center">
              <Award size={12} color="#22C55E" strokeWidth={2.5} />
              <Text className="text-primary font-black text-[11px] uppercase tracking-wider ml-1.5">
                Female Community Health Volunteer
              </Text>
            </View>
            <Pressable className="rounded-full" onPress={() => setIsDbOpen(true)}><Text className="py-2 px-3 bg-green-500 my-3 text-white rounded-full">Open DB</Text></Pressable>
            <ModalWithSafeArea
              visible={isDbOpen}
              animationType="slide"
              presentationStyle="fullScreen"
              onRequestClose={() => setIsDbOpen(false)}
            >
              <DatabaseViewer onClose={() => setIsDbOpen(false)} />
            </ModalWithSafeArea>

          </View>
        </View>



        {/* ── Settings Sections ────────────────── */}
        {SETTINGS.map((section, si) => (
          <View key={si} className="px-5 mt-6">
            <Text className="text-gray-400 font-black text-[11px] uppercase tracking-widest mb-3 px-1">
              {section.section}
            </Text>
            <View className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
              {section.items.map((item, ii) => {
                const Icon = item.icon;
                const isLast = ii === section.items.length - 1;
                return (
                  <TouchableOpacity
                    key={ii}
                    activeOpacity={0.7}
                    className={`flex-row items-center px-5 py-4 ${!isLast ? "border-b border-gray-50" : ""}`}
                  >
                    <View
                      className="w-10 h-10 rounded-2xl items-center justify-center mr-4"
                      style={{ backgroundColor: item.bg }}
                    >
                      <Icon size={18} color={item.color} strokeWidth={2.5} />
                    </View>
                    <Text className="text-[#1E293B] font-bold text-base flex-1">{item.label}</Text>

                    {(item as any).toggle !== undefined ? (
                      <Switch
                        value={notifications}
                        onValueChange={setNotifications}
                        trackColor={{ false: "#E5E7EB", true: "#86EFAC" }}
                        thumbColor={notifications ? "#22C55E" : "#9CA3AF"}
                      />
                    ) : (item as any).value ? (
                      <View className="flex-row items-center">
                        <Text className="text-gray-400 font-bold text-sm mr-2">{(item as any).value}</Text>
                        <ChevronRight size={16} color="#CBD5E1" strokeWidth={2.5} />
                      </View>
                    ) : (
                      <ChevronRight size={16} color="#CBD5E1" strokeWidth={2.5} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        {/* ── Log Out ──────────────────────────── */}
        <View className="px-5 mt-6">
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.replace("/" as any)}
            className="bg-rose-50 rounded-[24px] p-5 flex-row items-center border border-rose-100"
          >
            <View className="bg-rose-100 w-10 h-10 rounded-2xl items-center justify-center mr-4">
              <LogOut size={20} color="#E11D48" strokeWidth={2.5} />
            </View>
            <Text className="text-[#E11D48] font-black text-base flex-1">Log Out</Text>
            <ChevronRight size={16} color="#F9A8B8" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* ── App version ──────────────────────── */}
        <Text className="text-gray-300 font-bold text-xs text-center mt-8">
          FCHV Saathi v1.0.0 • Ministry of Health, Nepal
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}
