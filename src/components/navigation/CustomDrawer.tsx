import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { User, Globe, LogOut, X } from "lucide-react-native";
import { useLanguage } from "../../context/LanguageContext";
import { useRouter } from "expo-router";
import LanguageSwitcher from "../LanguageSwitcher";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from "@react-navigation/drawer";

export default function CustomDrawer(props: DrawerContentComponentProps) {
  const { t } = useLanguage();
  const router = useRouter();

  const handleLogout = () => {
    props.navigation.closeDrawer?.();
    router.replace("/login");
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} showsVerticalScrollIndicator={false}>
        {/* Close Button */}
        <TouchableOpacity
          onPress={() => props.navigation.closeDrawer()}
          className="self-start p-2 bg-gray-50 rounded-full mb-8"
        >
          <X size={20} color="#666" />
        </TouchableOpacity>

        {/* Profile Header */}
        <View className="items-center mb-10">
          <View className="w-20 h-20 bg-emerald-50 rounded-full items-center justify-center mb-4">
            <User size={40} color="#10B981" />
          </View>
          <Text className="text-xl font-bold text-gray-900">Anita Sharma</Text>
        </View>

        {/* Drawer Items */}
        <View className="flex-1">
          <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-50">
            <View className="w-10 h-10 bg-blue-50 rounded-xl items-center justify-center mr-4">
              <User size={20} color="#3B82F6" />
            </View>
            <Text className="text-gray-700 font-semibold">
              {t("dashboard.drawer.profile")}
            </Text>
          </TouchableOpacity>

          <View className="py-4 border-b border-gray-50">
            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 bg-indigo-50 rounded-xl items-center justify-center mr-4">
                <Globe size={20} color="#6366F1" />
              </View>
              <Text className="text-gray-700 font-semibold">
                {t("dashboard.drawer.language")}
              </Text>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center py-5 bg-red-50 rounded-3xl px-6 mb-4"
        >
          <LogOut size={20} color="#EF4444" />
          <Text className="text-red-500 font-bold ml-4">
            {t("dashboard.drawer.logout")}
          </Text>
        </TouchableOpacity>
      </DrawerContentScrollView>
    </View>
  );
}
