import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { Bell } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";

const TopHeader = () => {
  const router = useRouter();

  return (
    <View className="px-4 pt-10 flex-row justify-between items-center bg-white">
      <View className="flex-row items-center">
        <TouchableOpacity className="bg-emerald-100 p-1 rounded-2xl border border-emerald-50" onPress={() => router.push("/dashboard/profile" as any)}>
          <Image
            source={{ uri: "https://ui-avatars.com/api/?name=FCHV&background=059669&color=fff" }}
            className="w-10 h-10 rounded-xl"
          />
        </TouchableOpacity>
        <View className="ml-3">
          <View className="flex-row items-center">
            <Text className="text-[#065F46] font-black text-[11px] tracking-tight">Female Community Health Volunteer</Text>
          </View>
          <Text className="text-primary font-bold text-[11px]">स्वयंसेविका साथी</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => { }}
        className="bg-white p-2 rounded-2xl relative"
      >
        <Bell size={24} color="#065F46" strokeWidth={2.5} />
        <View className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
      </TouchableOpacity>
    </View>
  );
};

export default TopHeader;
