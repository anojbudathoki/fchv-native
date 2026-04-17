import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  ImageBackground,
  Image,
} from "react-native";
import {
  Search,
  Mic,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Salad,
  Users,
  Baby,
  Play,
  ChevronRight,
} from "lucide-react-native";
import { router } from "expo-router";
import "../../global.css";


const CATEGORY_CARDS = [
  {
    id: "birth_prep",
    icon: Stethoscope,
    iconColor: "#3B82F6",
    iconBg: "#EFF6FF",
    titleNp: "जन्म तयारी",
    title: "Birth Preparedness",
  },
  {
    id: "nutrition",
    icon: Salad,
    iconColor: "#F97316",
    iconBg: "#FFF7ED",
    titleNp: "पोषण",
    title: "Nutrition Guide",
  },
  {
    id: "family_planning",
    icon: Users,
    iconColor: "#8B5CF6",
    iconBg: "#F5F3FF",
    titleNp: "परिवार नियोजन",
    title: "Family Planning",
  },
  {
    id: "newborn",
    icon: Baby,
    iconColor: "#E11D48",
    iconBg: "#FFF1F2",
    titleNp: "नवजात शिशु",
    title: "Newborn Care",
  },
];

const VIDEOS = [
  {
    id: "v1",
    thumb: "https://images.unsplash.com/photo-1607990283143-e81e7a2c9349?w=400&q=80",
    titleNp: "भिटामिन ए को महत्व",
    meta: "३ मिनेट • स्वास्थ्य सन्देश",
  },
  {
    id: "v2",
    thumb: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80",
    titleNp: "खोप तालिका",
    meta: "५ MB • PDF",
  },
  {
    id: "v3",
    thumb: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=400&q=80",
    titleNp: "स्तनपान गाइड",
    meta: "२ मिनेट • भिडियो",
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export default function LearnScreen() {
  const [search, setSearch] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <StatusBar barStyle="dark-content" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >

        {/* ── Hero Header ─────────────────────────────── */}
        <View className="flex-1 mt-10 px-5">
          <Text className="text-[#1E293B] text-xl font-black">Health Guidelines</Text>
        </View>

        {/* ── Search Bar ─────────────────────────────── */}
        <View className="px-5 mt-5">
          <View className="flex-row items-center bg-white rounded-2xl px-4 py-1 border border-gray-100 shadow-sm">
            <Search size={18} color="#94a3b8" strokeWidth={2.5} />
            <TextInput
              className="flex-1 mx-3 text-[#1E293B] font-medium text-base"
              placeholder="Search..."
              placeholderTextColor="#CBD5E1"
              value={search}
              onChangeText={setSearch}
            />
            {/* <TouchableOpacity className="bg-[#E11D48] w-10 h-10 rounded-xl items-center justify-center">
              <Mic size={18} color="white" strokeWidth={2.5} />
            </TouchableOpacity> */}
          </View>
        </View>

        {/* ── Featured Hero Card (Safe Motherhood) ──── */}
        <View className="px-5 mt-6">
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push("/dashboard/learn-details?id=maternal_health" as any)}
          >
            <ImageBackground
              source={{ uri: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?w=800&q=80" }}
              className="rounded-[32px] overflow-hidden h-44"
              imageStyle={{ borderRadius: 32 }}
            >
              {/* Dark overlay */}
              <View className="absolute inset-0 bg-black/40 rounded-[32px]" />

              {/* Content */}
              <View className="flex-1 p-5 justify-between">
                <View className="self-start bg-[#E11D48] w-10 h-10 rounded-2xl items-center justify-center">
                  <ShieldCheck size={20} color="white" strokeWidth={2.5} />
                </View>
                <View className="flex-row justify-between items-end">
                  <View>
                    <Text className="text-white font-black text-xl">सुरक्षित मातृत्व</Text>
                    <Text className="text-white/80 font-bold text-sm">Safe Motherhood</Text>
                  </View>
                  <View className="bg-white/20 p-2.5 rounded-2xl border border-white/30">
                    <ArrowRight size={18} color="white" strokeWidth={2.5} />
                  </View>
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </View>

        {/* ── Category Grid ───────────────────────────── */}
        <View className="px-5 mt-8">
          <View className="flex-row flex-wrap gap-4">
            {CATEGORY_CARDS.map((cat) => {
              const Icon = cat.icon;
              return (
                <TouchableOpacity
                  key={cat.id}
                  activeOpacity={0.8}
                  onPress={() => router.push(`/dashboard/learn-details?id=${cat.id}` as any)}
                  className="bg-white rounded-[28px] p-5 shadow-sm border border-gray-50"
                  style={{ width: "47%" }}
                >
                  <View
                    className="w-12 h-12 rounded-2xl items-center justify-center mb-4"
                    style={{ backgroundColor: cat.iconBg }}
                  >
                    <Icon size={24} color={cat.iconColor} strokeWidth={2.5} />
                  </View>
                  <Text className="text-[#1E293B] font-black text-base leading-tight">{cat.titleNp}</Text>
                  <Text className="text-gray-400 font-bold text-xs mt-1">{cat.title}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Recently Viewed Videos ────────────────── */}
        <View className="mt-10">
          <View className="flex-row justify-between items-center px-5 mb-5">
            <Text className="text-[#1E293B] text-xl font-black">भर्खरै हेरिएका</Text>
            <TouchableOpacity>
              <Text className="text-[#E11D48] font-black text-sm">सबै हेर्नुहोस्</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
          >
            {VIDEOS.map((v) => (
              <TouchableOpacity
                key={v.id}
                activeOpacity={0.85}
                className="mr-4"
                style={{ width: 180 }}
              >
                {/* Thumbnail */}
                <View className="relative rounded-2xl overflow-hidden mb-3" style={{ height: 110 }}>
                  <Image
                    source={{ uri: v.thumb }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                  <View className="absolute inset-0 bg-black/30" />
                  <View className="absolute inset-0 items-center justify-center">
                    <View className="bg-white/90 w-10 h-10 rounded-full items-center justify-center shadow-md">
                      <Play size={16} color="#E11D48" strokeWidth={2.5} fill="#E11D48" />
                    </View>
                  </View>
                </View>
                <Text className="text-[#1E293B] font-black text-[14px]" numberOfLines={1}>{v.titleNp}</Text>
                <Text className="text-gray-400 font-bold text-[11px] mt-1">{v.meta}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── All Guidelines List ───────────────────── */}
        <View className="px-5 mt-10">
          <Text className="text-[#1E293B] text-xl font-black mb-5">सबै निर्देशिकाहरू</Text>

          {[
            { emoji: "🤱", titleNp: "स्तनपान", title: "Breastfeeding Guide", color: "#22C55E", bg: "#F0FFF4" },
            { emoji: "💉", titleNp: "खोप तालिका", title: "Vaccination Schedule", color: "#3B82F6", bg: "#EFF6FF" },
            { emoji: "🩺", titleNp: "ANC जाँच", title: "Antenatal Checkup", color: "#E11D48", bg: "#FFF1F2" },
            { emoji: "🧘", titleNp: "मानसिक स्वास्थ्य", title: "Mental Health", color: "#8B5CF6", bg: "#F5F3FF" },
          ].map((item, i) => (
            <TouchableOpacity
              key={i}
              activeOpacity={0.75}
              className="bg-white rounded-2xl p-4 mb-3 flex-row items-center border border-gray-50 shadow-sm"
            >
              <View className="w-12 h-12 rounded-2xl items-center justify-center mr-4" style={{ backgroundColor: item.bg }}>
                <Text className="text-2xl">{item.emoji}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-[#1E293B] font-black text-base">{item.titleNp}</Text>
                <Text className="text-gray-400 font-bold text-xs mt-0.5">{item.title}</Text>
              </View>
              <View className="bg-gray-50 p-2 rounded-xl">
                <ChevronRight size={16} color="#94a3b8" strokeWidth={2.5} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
