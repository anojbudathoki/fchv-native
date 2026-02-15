import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Menu } from "lucide-react-native";
import { useLanguage } from "@/context/LanguageContext";
import { DrawerActions, useNavigation } from "@react-navigation/native";

const TopHeader = () => {
  const { t } = useLanguage();
  const navigation = useNavigation();

  const handleOpenDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View className="px-6 pt-4 pb-8 bg-white rounded-b-[40px] shadow-sm border-b border-gray-50">
      <View className="flex-row justify-between items-start mb-6">
        <View>
          <Text className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">
            {t("common.welcome")}
          </Text>
          <Text className="text-slate-900 text-2xl font-black">
            Anita Sharma
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleOpenDrawer}
          className="bg-gray-50 p-3 rounded-2xl"
        >
          <Menu size={22} color="#222" />
        </TouchableOpacity>
      </View>

      <View className="bg-emerald-500 p-6 rounded-[32px] overflow-hidden relative">
        <View className="absolute -right-8 -bottom-8 w-32 h-32 bg-white opacity-10 rounded-full" />
        <Text className="text-white text-sm font-medium opacity-80 mb-1">
          {t("dashboard.title")}
        </Text>
        <Text className="text-white text-xl font-bold">
          Health Worker Portal
        </Text>

        <TouchableOpacity className="mt-4 bg-white/20 self-start px-4 py-2 rounded-full border border-white/30">
          <Text className="text-white text-xs font-bold uppercase tracking-tighter">
            Sync Offline Data
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TopHeader;
