import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import React from "react";
import {
  FileText,
  ChevronRight,
  Baby,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import "../../global.css";
import Colors from "../../constants/Colors";
import CustomHeader from "../../components/CustomHeader";

export default function ReportScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <CustomHeader title="रिपोर्टहरू (Reports)" />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 mt-6">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push("/dashboard/service-report")}
            className="bg-white rounded-2xl p-5 flex-row items-center justify-between border border-slate-100 shadow-sm shadow-slate-200/50 mb-4"
          >
            <View className="flex-row items-center flex-1 pr-4">
              <View className="w-12 h-12 rounded-xl bg-blue-50 items-center justify-center mr-4">
                <FileText size={24} color={Colors.primary} />
              </View>
              <View className="flex-1">
                <Text className="text-slate-800 font-bold text-[15px] leading-snug">
                    महिला स्वास्थ्य स्वयंसेविकाले सेवा पुर्याएका जम्मा सेवाग्राहीको संख्या
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color="#CBD5E1" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push("/dashboard/child-monitoring-report")}
            className="bg-white rounded-2xl p-5 flex-row items-center justify-between border border-slate-100 shadow-sm shadow-slate-200/50"
          >
            <View className="flex-row items-center flex-1 pr-4">
              <View className="w-12 h-12 rounded-xl bg-indigo-50 items-center justify-center mr-4">
                <Baby size={24} color="#6366F1" />
              </View>
              <View className="flex-1">
                <Text className="text-slate-800 font-bold text-[15px] leading-snug">
                    शिशुको अनुगमन भेट
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color="#CBD5E1" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
