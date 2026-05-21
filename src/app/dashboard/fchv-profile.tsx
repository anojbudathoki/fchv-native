import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  User,
  MapPin,
  Globe,
  LogOut,
  RefreshCw,
  Database,
  ChevronRight,
  ChevronDown,
  Download,
  CheckCircle,
  Heart,
  Shield,
  AlertCircle,
  FileText,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import Animated, {
  FadeInUp,
  FadeOutUp,
  FadeInDown,
  Layout,
} from "react-native-reanimated";

import ModalWithSafeArea from "@/components/common/ModalWithSafeArea";
import DatabaseViewer from "@/components/DatabaseViewer";
import CustomHeader from "../../components/CustomHeader";
import { useLanguage } from "../../context/LanguageContext";
import storage from "@/utils/storage";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/constants/token";
import {
  exportAllDataToPdf,
  exportPregnancyToPdf,
  exportMaternalDeathToPdf,
  exportNewbornDeathToPdf,
  exportChildDeathToPdf,
  exportInfantCareToPdf,
  exportAdolescentIfaToPdf,
} from "@/utils/pdfGenerator";

const { width } = Dimensions.get("window");

export default function UserProfileScreen() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [isDbOpen, setIsDbOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [exportingItem, setExportingItem] = useState<string | null>(null);

  const handleLogout = () => {
    Alert.alert(
      t("profile_settings.logout_alert_title") || "Log Out",
      t("profile_settings.logout_alert_msg") ||
        "Are you sure you want to log out? Ensure all data is synced.",
      [
        { text: t("profile_settings.cancel") || "Cancel", style: "cancel" },
        {
          text: t("profile_settings.logout") || "Log Out",
          style: "destructive",
          onPress: async () => {
            await storage.remove(ACCESS_TOKEN_KEY);
            await storage.remove(REFRESH_TOKEN_KEY);
            router.replace("/login");
          },
        },
      ],
    );
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      Alert.alert(
        t("profile_settings.sync_success_title") || "Sync Successful",
        t("profile_settings.sync_success_msg") ||
          "All offline data has been synced with the server.",
      );
    }, 2000);
  };

  const handleExport = async (exportFn: () => Promise<void>, label: string) => {
    if (exportingItem) return;
    try {
      setExportingItem(label);
      setIsExporting(true);
      await exportFn();
      setIsExporting(false);
      setExportingItem(null);

      setShowExportSuccess(true);
      setTimeout(() => {
        setShowExportSuccess(false);
      }, 1500);
    } catch (error) {
      setIsExporting(false);
      setExportingItem(null);
      console.error(error);
      Alert.alert(
        t("profile_settings.export_error_title") || "Export Failed",
        t("profile_settings.export_error_msg") ||
          "Could not export database data.",
      );
    }
  };

  const reportItems = [
    {
      key: "pregnancy",
      label: t("profile_settings.report_pregnancy") || "Pregnancy Records",
      fn: exportPregnancyToPdf,
    },
    {
      key: "maternal_death",
      label: t("profile_settings.report_maternal_death") || "Maternal Death",
      fn: exportMaternalDeathToPdf,
    },
    {
      key: "newborn_death",
      label: t("profile_settings.report_newborn_death") || "Newborn Death",
      fn: exportNewbornDeathToPdf,
    },
    {
      key: "child_death",
      label:
        t("profile_settings.report_child_death") || "Child Death (28d–59m)",
      fn: exportChildDeathToPdf,
    },
    {
      key: "infant_care",
      label: t("profile_settings.report_infant_care") || "Infant Care",
      fn: exportInfantCareToPdf,
    },
    {
      key: "adolescent_ifa",
      label:
        t("profile_settings.report_adolescent_ifa") ||
        "Iron-consuming adolescent",
      fn: exportAdolescentIfaToPdf,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <StatusBar barStyle="dark-content" />

      {/* Floating Animated Status Toast */}
      {isExporting && (
        <Animated.View
          entering={FadeInUp.duration(300)}
          exiting={FadeOutUp.duration(300)}
          className="absolute top-12 left-5 right-5 bg-blue-600 px-5 py-3.5 rounded-2xl flex-row items-center justify-between z-50 border border-blue-400/20"
        >
          <View className="flex-row items-center flex-1">
            <ActivityIndicator color="white" size="small" />
            <Text className="text-white font-semibold text-sm ml-3">
              {t("profile_settings.exporting") || "Downloading PDF record..."}
            </Text>
          </View>
        </Animated.View>
      )}

      {showExportSuccess && (
        <Animated.View
          entering={FadeInUp.duration(300)}
          exiting={FadeOutUp.duration(300)}
          className="absolute top-12 left-5 right-5 bg-emerald-600 px-5 py-3.5 rounded-2xl flex-row items-center justify-between z-50 border border-emerald-400/20"
        >
          <View className="flex-row items-center flex-1">
            <CheckCircle size={18} color="white" />
            <Text className="text-white font-semibold text-sm ml-3">
              {t("profile_settings.export_success") ||
                "Downloaded successfully"}
            </Text>
          </View>
        </Animated.View>
      )}

      <CustomHeader title={t("profile_settings.title") || "My Profile"} />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {/* 1. Hero / Identity Card */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          className="px-5 mt-4"
        >
          <View className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
            <View className="py-8 px-6 items-center justify-center bg-white relative">
              {/* Profile Ring */}
              <View className="w-24 h-24 rounded-full border border-slate-100 mb-4 bg-slate-50 items-center justify-center">
                <User size={44} color="#475569" strokeWidth={1.5} />
              </View>

              <Text className="text-slate-800 text-2xl font-bold tracking-tight">
                {t("profile_settings.name") || "Laxmi Shrestha"}
              </Text>

              <View className="flex-row items-center mt-2.5 bg-slate-50 px-3.5 py-1 rounded-full border border-slate-100">
                <Shield size={13} color="#64748B" className="mr-1" />
                <Text className="text-slate-600 font-semibold text-xs tracking-wider">
                  {t("profile_settings.fchv_id") || "FCHV ID"}: 9840-NP
                </Text>
              </View>
            </View>

            {/* Ward Details */}
            <View className="flex-row items-center justify-center py-4 bg-slate-50/50 border-t border-slate-100">
              <MapPin size={15} color="#64748B" />
              <Text className="text-slate-600 font-semibold text-xs ml-2 uppercase tracking-wider">
                {t("profile_settings.ward_region") ||
                  "Ward 4, Kathmandu Region"}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* 2. Preferences & Actions Group */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(400)}
          className="px-5 mt-6"
        >
          <Text className="text-slate-400 font-bold text-xs mb-3 px-1 uppercase tracking-widest">
            {t("profile_settings.preferences") || "Preferences & Settings"}
          </Text>

          <View className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
            {/* Language Toggle */}
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => router.push("/dashboard/change-language")}
              className="flex-row items-center px-5 py-4 border-b border-slate-50"
            >
              <View className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 items-center justify-center mr-4">
                <Globe size={18} color="#475569" strokeWidth={2} />
              </View>
              <View className="flex-1">
                <Text className="text-slate-800 font-bold text-[15px]">
                  {t("profile_settings.language") || "Language"}
                </Text>
                <Text className="text-slate-400 text-xs mt-0.5">
                  {t("profile_settings.language_sub") ||
                    "Choose your preferred language"}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 text-xs font-semibold mr-2">
                  {language === "np" ? "नेपाली" : "English"}
                </Text>
                <ChevronRight size={15} color="#94A3B8" strokeWidth={2.5} />
              </View>
            </TouchableOpacity>

            {/* Sync Status */}
            <View className="flex-row items-center px-5 py-4 border-b border-slate-50">
              <View className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 items-center justify-center mr-4">
                <RefreshCw size={18} color="#475569" strokeWidth={2} />
              </View>
              <View className="flex-1">
                <Text className="text-slate-800 font-bold text-[15px]">
                  {t("profile_settings.data_sync") || "Data Sync"}
                </Text>
                <Text className="text-slate-400 text-xs mt-0.5">
                  {t("profile_settings.last_synced") ||
                    "Last synced: Today, 10:30 AM"}
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={handleSync}
                disabled={isSyncing}
                className={`px-3.5 py-1.5 rounded-xl border ${
                  isSyncing
                    ? "bg-slate-50 border-slate-100"
                    : "bg-white border-slate-200 active:bg-slate-50"
                }`}
              >
                <Text
                  className={`font-semibold text-xs ${isSyncing ? "text-slate-400" : "text-slate-600"}`}
                >
                  {isSyncing
                    ? t("profile_settings.syncing") || "Syncing..."
                    : t("profile_settings.sync_now") || "Sync Now"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Developer Mode / Inspector */}
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => setIsDbOpen(true)}
              className="flex-row items-center px-5 py-4 border-b border-slate-50"
            >
              <View className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 items-center justify-center mr-4">
                <Database size={18} color="#475569" strokeWidth={2} />
              </View>
              <View className="flex-1">
                <Text className="text-slate-800 font-bold text-[15px]">
                  {t("profile_settings.db_inspector") || "Database Inspector"}
                </Text>
                <Text className="text-slate-400 text-xs mt-0.5">
                  {t("profile_settings.db_inspector_sub") ||
                    "View local SQLite storage"}
                </Text>
              </View>
              <ChevronRight size={15} color="#94A3B8" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Download Reports Section */}
        <Animated.View
          entering={FadeInDown.delay(250).duration(400)}
          className="px-5 mt-6"
        >
          <Text className="text-slate-400 font-bold text-xs mb-3 px-1 uppercase tracking-widest">
            {t("profile_settings.download_reports") || "Download Reports"}
          </Text>

          <View className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
            {/* Toggle header */}
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => setShowReports(!showReports)}
              className="flex-row items-center px-5 py-4"
            >
              <View className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 items-center justify-center mr-4">
                <Download size={18} color="#475569" strokeWidth={2} />
              </View>
              <View className="flex-1">
                <Text className="text-slate-800 font-bold text-[15px]">
                  {t("profile_settings.export_data") || "Export Reports as PDF"}
                </Text>
                <Text className="text-slate-400 text-xs mt-0.5">
                  {t("profile_settings.export_data_sub") ||
                    "Download all or individual tables"}
                </Text>
              </View>
              {showReports ? (
                <ChevronDown size={16} color="#94A3B8" strokeWidth={2.5} />
              ) : (
                <ChevronRight size={16} color="#94A3B8" strokeWidth={2.5} />
              )}
            </TouchableOpacity>

            {/* Collapsible list */}
            {showReports && (
              <View className="border-t border-slate-50">
                {/* Download All */}
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => handleExport(exportAllDataToPdf, "all")}
                  disabled={!!exportingItem}
                  className="flex-row items-center px-5 py-3.5 border-b border-slate-50"
                >
                  <View className="w-8 h-8 rounded-xl bg-slate-800 items-center justify-center mr-3">
                    <Download size={14} color="#FFFFFF" strokeWidth={2} />
                  </View>
                  <Text className="flex-1 text-slate-800 font-semibold text-sm">
                    {t("profile_settings.download_all") ||
                      "Download All Reports"}
                  </Text>
                  {exportingItem === "all" ? (
                    <ActivityIndicator size="small" color="#64748B" />
                  ) : (
                    <ChevronRight size={14} color="#CBD5E1" strokeWidth={2} />
                  )}
                </TouchableOpacity>

                {/* Individual tables */}
                {reportItems.map((item) => (
                  <TouchableOpacity
                    key={item.key}
                    activeOpacity={0.6}
                    onPress={() => handleExport(item.fn, item.key)}
                    disabled={!!exportingItem}
                    className="flex-row items-center px-5 py-3.5 border-b border-slate-50"
                  >
                    <View className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 items-center justify-center mr-3">
                      <FileText size={14} color="#64748B" strokeWidth={2} />
                    </View>
                    <Text className="flex-1 text-slate-700 font-medium text-sm">
                      {item.label}
                    </Text>
                    {exportingItem === item.key ? (
                      <ActivityIndicator size="small" color="#64748B" />
                    ) : (
                      <Download size={14} color="#CBD5E1" strokeWidth={2} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </Animated.View>

        {/* 3. Safe Logout Action */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(400)}
          className="px-5 mt-8"
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleLogout}
            className="bg-white rounded-2xl p-4 flex-row items-center justify-center border border-slate-200 active:bg-slate-50"
          >
            <LogOut size={16} color="#EF4444" strokeWidth={2} />
            <Text className="text-red-500 font-semibold ml-2 text-[15px]">
              {t("profile_settings.logout") || "Log Out"}
            </Text>
          </TouchableOpacity>

          <View className="flex-row items-center justify-center mt-3.5 bg-slate-50 py-2.5 px-4 rounded-xl border border-slate-100">
            <AlertCircle size={13} color="#64748B" className="mr-1.5" />
            <Text className="text-center text-slate-500 font-medium text-xs">
              {t("profile_settings.logout_msg") ||
                "Unsynced data is safe locally."}
            </Text>
          </View>
        </Animated.View>

        {/* 4. Official Footer */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(400)}
          className="mt-10 px-5 items-center justify-center"
        >
          <Heart size={16} color="#94A3B8" fill="#E2E8F0" className="mb-2" />
          <Text className="text-slate-400 font-bold text-[10px] text-center uppercase tracking-widest leading-4">
            {t("profile_settings.footer") ||
              "FCHV Saathi v1.0.0\nMinistry of Health, Nepal"}
          </Text>
        </Animated.View>
      </ScrollView>

      {/* Database Viewer Modal */}
      <ModalWithSafeArea
        visible={isDbOpen}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setIsDbOpen(false)}
      >
        <DatabaseViewer onClose={() => setIsDbOpen(false)} />
      </ModalWithSafeArea>
    </SafeAreaView>
  );
}
