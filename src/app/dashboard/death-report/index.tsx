import { useToast } from "@/context/ToastContext";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaternalDeathForm from "../../../components/forms/MaternalDeathForm";
import NewbornDeathForm from "../../../components/forms/NewbornDeathForm";

export default function DeathReportPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'mother' | 'child'>('mother');

  const handleSuccess = () => {
    // Optionally router.back() or stay on page. The forms handle their own success toast.
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-slate-100 bg-white">
        <Pressable onPress={() => router.back()} className="p-2 -ml-2 rounded-full active:bg-slate-50">
          <ArrowLeft size={24} color="#0F172A" />
        </Pressable>
        <Text className="text-lg font-semibold text-slate-800 ml-2">
          {t("dashboard.quick_actions.death_report", { defaultValue: "Death Report" })}
        </Text>
      </View>

      {/* Tabs */}
      <View className="flex-row px-4 pt-4 bg-white border-b border-slate-200">
        <Pressable
          onPress={() => setActiveTab('mother')}
          className={`flex-1 items-center pb-3 ${activeTab === 'mother' ? 'border-b-2 border-[#475569]' : 'border-b-2 border-transparent'}`}
        >
          <Text className={`text-[16px] font-semibold ${activeTab === 'mother' ? 'text-[#475569]' : 'text-slate-400'}`}>
            {t("common.mother", { defaultValue: "Mother" })}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('child')}
          className={`flex-1 items-center pb-3 ${activeTab === 'child' ? 'border-b-2 border-[#475569]' : 'border-b-2 border-transparent'}`}
        >
          <Text className={`text-[16px] font-semibold ${activeTab === 'child' ? 'text-[#475569]' : 'text-slate-400'}`}>
            {t("common.child", { defaultValue: "Child" })}
          </Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 p-5">
        {activeTab === 'mother' ? (
          <MaternalDeathForm
            onSuccess={handleSuccess}
            showToast={showToast}
          />
        ) : (
          <NewbornDeathForm
            onSuccess={handleSuccess}
            showToast={showToast}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
