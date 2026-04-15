import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { FileText, Activity, Heart, Baby, HeartPulse } from "lucide-react-native";
import NavigationLayout from "@/components/NavigationLayout";
import { useLanguage } from "../../context/LanguageContext";
import { MotiView } from "moti";
import { router } from "expo-router";

const LEARN_ITEMS = [
  {
    id: "maternal_health",
    icon: HeartPulse,
    iconColor: "#10B981",
    bgClass: "bg-emerald-50",
    iconBgClass: "bg-emerald-100",
    titleKey: "learn_page.maternal_health.title",
    subtitleKey: "learn_page.maternal_health.subtitle",
  },
  {
    id: "child_nutrition",
    icon: FileText,
    iconColor: "#3B82F6",
    bgClass: "bg-blue-50",
    iconBgClass: "bg-blue-100",
    titleKey: "learn_page.child_nutrition.title",
    subtitleKey: "learn_page.child_nutrition.subtitle",
  },
  {
    id: "anc",
    icon: Activity,
    iconColor: "#EC4899",
    bgClass: "bg-pink-50",
    iconBgClass: "bg-pink-100",
    titleKey: "learn_page.anc.title",
    subtitleKey: "learn_page.anc.subtitle",
  },
  {
    id: "pnc",
    icon: Heart,
    iconColor: "#8B5CF6",
    bgClass: "bg-violet-50",
    iconBgClass: "bg-violet-100",
    titleKey: "learn_page.pnc.title",
    subtitleKey: "learn_page.pnc.subtitle",
  },
  {
    id: "baby_care",
    icon: Baby,
    iconColor: "#06B6D4",
    bgClass: "bg-cyan-50",
    iconBgClass: "bg-cyan-100",
    titleKey: "learn_page.baby_care.title",
    subtitleKey: "learn_page.baby_care.subtitle",
  },
] as const;

export default function LearnScreen() {
  const { t } = useLanguage();

  return (
    <View className="flex-1 bg-white">
      <NavigationLayout title={t("dashboard.drawer.learn")} />
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 20 }}
      >
        <Text className="text-xl font-bold text-gray-800 mb-6">
          {t("learn_page.title")}
        </Text>
        
        {/* Resource Items */}
        <View className="flex-row flex-wrap justify-between">
          {LEARN_ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <MotiView
                key={item.id}
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 400, delay: index * 100 }}
                style={{ width: '48%', marginBottom: 16 }}
              >
                <TouchableOpacity
                  className={`bg-white rounded-2xl p-4 flex-col items-center border border-gray-100`}
                  onPress={() => router.push(`/dashboard/learn-details?id=${item.id}`)}
                  activeOpacity={0.7}
                >
                  <View className={`w-14 h-14 ${item.iconBgClass} rounded-2xl items-center justify-center mb-3`}>
                    <Icon size={28} color={item.iconColor} />
                  </View>
                  <View className="items-center">
                    <Text className="text-sm font-bold text-gray-800 text-center" numberOfLines={2}>
                      {t(item.titleKey as any)}
                    </Text>
                    <Text className="text-xs text-gray-500 mt-1 text-center" numberOfLines={1}>
                      {t(item.subtitleKey as any)}
                    </Text>
                  </View>
                </TouchableOpacity>
              </MotiView>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
