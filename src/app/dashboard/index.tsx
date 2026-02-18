import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import React from "react";
import { router } from "expo-router";
import {
  Home,
  Baby,
  Users,
  CalendarClock,
  ChevronRight,
  Menu,
} from "lucide-react-native";
import "../../global.css";
import { useLanguage } from "../../context/LanguageContext";
import TopHeader from "@/components/layout/TopHeader";

// Card Component for Dashboard
interface DashboardCardProps {
  title: string;
  subTitle: string;
  icon: any;
  color: string;
  onPress: () => void;
  fullWidth?: boolean;
}

const DashboardCard = ({
  title,
  subTitle,
  icon: Icon,
  color,
  onPress,
  fullWidth = false,
}: DashboardCardProps) => (
  <TouchableOpacity
    onPress={onPress}
    className={`bg-white p-5 rounded-[28px] mb-4 shadow-sm border border-gray-50 ${
      fullWidth ? "w-full" : "w-[48%]"
    } items-start justify-between min-h-[140px]`}
    activeOpacity={0.7}
  >
    <View
      className={`w-12 h-12 rounded-2xl items-center justify-center mb-4`}
      style={{ backgroundColor: color + "15" }}
    >
      <Icon size={24} color={color} />
    </View>
    <View>
      <Text className="text-gray-900 font-bold text-base leading-tight">
        {title}
      </Text>
      <Text className="text-gray-400 text-xs mt-1 leading-4">{subTitle}</Text>
    </View>
    <View className="absolute top-5 right-5">
      <ChevronRight size={16} color="#E5E7EB" />
    </View>
  </TouchableOpacity>
);

export default function DashboardScreen() {
  const { t } = useLanguage();

  const menuItems = [
    {
      title: t("dashboard.actions.add_household"),
      subTitle: "Record new family entries",
      icon: Home,
      color: "#10B981", // Emerald
      route: "/dashboard/household",
      fullWidth: true,
    },
    {
      title: t("dashboard.actions.pregnant_women"),
      subTitle: "Track pregnancy & ANC",
      icon: Baby,
      color: "#EC4899", // Pink
      route: "/dashboard/pregnant-women",
    },
    {
      title: t("dashboard.actions.children_05"),
      subTitle: "Growth & Vaccines",
      icon: Baby,
      color: "#3B82F6", // Blue
      route: "/dashboard/children",
    },
    {
      title: t("dashboard.actions.family_planning"),
      subTitle: "Counseling & Dist.",
      icon: Users,
      color: "#8B5CF6", // Violet
      route: "/dashboard/family-planning",
    },
    {
      title: t("dashboard.actions.follow_ups"),
      subTitle: "Scheduled checks",
      icon: CalendarClock,
      color: "#F59E0B", // Amber
      route: "/dashboard/follow-up",
    },
  ];

  return (
    <SafeAreaView className="flex-1">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <TopHeader />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 100,
        }}
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-gray-900 font-bold text-lg mb-4 px-1">
          {t("dashboard.operational")}
        </Text>
        <View className="flex-row flex-wrap justify-between">
          {menuItems.map((item, index) => (
            <DashboardCard
              key={index}
              title={item.title}
              subTitle={item.subTitle}
              icon={item.icon}
              color={item.color}
              onPress={() => router.push(item.route as any)}
              fullWidth={item.fullWidth}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
