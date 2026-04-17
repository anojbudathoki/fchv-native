import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { CircleUser, CircleUserRound, Menu, User2 } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { DrawerActions } from "@react-navigation/native";
import { useRouter } from "expo-router";

const TopHeader = () => {
  const router = useRouter();
  const navigation = useNavigation();

  return (
    <View className="px-6 pt-14 flex-row justify-between items-center bg-white">
          <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        className="bg-white p-2 rounded-2xl"
      >
        <Menu size={24} color="#3B82F6" strokeWidth={2.5} />
      </TouchableOpacity>
      <TouchableOpacity onPress={()=> router.push("/dashboard/profile")} className="flex-row items-center">
       <CircleUserRound size={24} color="#3B82F6" strokeWidth={2.5} />
      </TouchableOpacity>

  
    </View>
  );
};

export default TopHeader;
