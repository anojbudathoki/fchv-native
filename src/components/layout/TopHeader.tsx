import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { CircleUserRound, Menu } from "lucide-react-native";
import { useLanguage } from "@/context/LanguageContext";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";

const TopHeader = () => {
  const { t } = useLanguage();
  const navigation = useNavigation();
  const router = useRouter();

  const handleOpenDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View className="px-3 pt-3 mt-8 pb-5 bg-white rounded-b-[30px] ">
      <View className="flex-row justify-between items-start mb-4">
        <TouchableOpacity
          onPress={handleOpenDrawer}
          className="bg-gray-50 px-3 py-2 rounded-2xl"
        >
          <Menu size={22} color="#222" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/dashboard/profile")}
          className=" text-gray-50 p-3 rounded-2xl"
        >
          <CircleUserRound size={23} color={"#6B7280"} />
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={() => router.push("/dashboard/profile")}
          className="px-[12px] py-[12px]"
        >
          <View className="h-8 w-8 overflow-hidden rounded-full border border-gray-300">
            <Image
              // source={require("@/assets/images/avatar.png")}
              style={{ width: "100%", height: "100%" }}
            />
          </View>
        </TouchableOpacity> */}
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
