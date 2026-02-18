import React from "react";
import { View, Text, ScrollView } from "react-native";
import {
  User,
  Shield,
  Briefcase,
  MapPin,
  Phone,
  Mail,
} from "lucide-react-native";
import { useLanguage } from "../../context/LanguageContext";
import NavigationLayout from "@/components/NavigationLayout";
import Animated, { FadeInDown } from "react-native-reanimated";

interface ProfileItemProps {
  icon: any;
  label: string;
  value: string;
  delay: number;
}

const ProfileItem = ({ icon: Icon, label, value, delay }: ProfileItemProps) => (
  <Animated.View
    entering={FadeInDown.delay(delay).duration(400).springify()}
    className="bg-white rounded-3xl p-5 mb-4 border border-gray-100 flex-row items-center"
  >
    <View className="w-12 h-12 rounded-2xl bg-emerald-50 items-center justify-center mr-4">
      <Icon size={22} color="#10B981" />
    </View>
    <View className="flex-1">
      <Text className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-0.5">
        {label}
      </Text>
      <Text className="text-gray-900 text-base font-bold leading-tight">
        {value}
      </Text>
    </View>
  </Animated.View>
);

export default function ProfileScreen() {
  const { t } = useLanguage();

  const profileData = [
    {
      icon: User,
      label: t("dashboard.profile_page.name_label"),
      value: "Anita Sharma",
    },
    {
      icon: Shield,
      label: t("dashboard.profile_page.id_label"),
      value: "FCHV-2080-042",
    },
    {
      icon: Briefcase,
      label: t("dashboard.profile_page.role_label"),
      value: t("dashboard.profile_page.role_value"),
    },
    {
      icon: MapPin,
      label: t("dashboard.profile_page.post_label"),
      value: t("dashboard.profile_page.post_value"),
    },
    {
      icon: Phone,
      label: t("dashboard.profile_page.phone_label"),
      value: "+977 9841******",
    },
    {
      icon: Mail,
      label: t("dashboard.profile_page.email_label"),
      value: "anita.sharma@health.np",
    },
  ];

  return (
    <View className="flex-1 bg-white">
      <NavigationLayout title={t("dashboard.profile_page.title")} />

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Profile Avatar Section */}
        <Animated.View
          entering={FadeInDown.duration(600).springify()}
          className="items-center mt-8 mb-10"
        >
          <View className="w-32 h-32 bg-emerald-50 rounded-full items-center justify-center border-4 border-emerald-100">
            <User size={64} color="#10B981" />
          </View>
          <Text className="text-2xl font-black text-gray-900 mt-4 text-center">
            Anita Sharma
          </Text>
          <View className="bg-emerald-100 px-4 py-1.5 rounded-full mt-2">
            <Text className="text-emerald-700 text-xs font-bold uppercase tracking-wider">
              {t("dashboard.profile_page.role_value")}
            </Text>
          </View>
        </Animated.View>

        {/* Profile Details List */}
        <View>
          {profileData.map((item, index) => (
            <ProfileItem
              key={index}
              icon={item.icon}
              label={item.label}
              value={item.value}
              delay={200 + index * 100}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
