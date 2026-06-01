import { useLanguage } from "@/context/LanguageContext";
import { useFocusEffect, useRouter } from "expo-router";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  User,
} from "lucide-react-native";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AdToBs } from "react-native-nepali-picker";
import {
  getAllMothersList,
  MotherListDbItem,
} from "../../../hooks/database/models/MotherModel";
import { toNepaliNumbers } from "../../../utils/dateHelper";

export default function RecordScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage()
  const [records, setRecords] = useState<MotherListDbItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useFocusEffect(
    useCallback(() => {
      const fetchRecords = async () => {
        try {
          const data = await getAllMothersList();
          setRecords(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchRecords();
    }, []),
  );

  const filteredRecords = records.filter((r) =>
    r.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr || dateStr === "N/A" || dateStr === "-" || dateStr === "---")
      return "---";

    try {
      const cleanDate = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
      const bsDate = AdToBs(cleanDate);
      return language === "np" ? toNepaliNumbers(bsDate) : bsDate;
    } catch (e) {
      return dateStr;
    }
  };

  const formatAge = (age: string | number | null | undefined) => {
    if (age === null || age === undefined || age === "") return t("record_page.na");
    return language === "np" ? toNepaliNumbers(String(age)) : String(age);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC] pt-10">
      <StatusBar barStyle="dark-content" />

      {/* App Header */}
      <View className="px-4 pt-6 pb-4 flex-row items-center justify-between bg-[#F8FAFC]">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-2 p-2 rounded-2xl"
          >
            <ChevronLeft size={20} color="#1E293B" strokeWidth={2.5} />
          </TouchableOpacity>
          <View>
            <Text className="text-[20px] font-bold text-slate-800 tracking-tight">
              {t("record_page.title")}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/dashboard/record/add-mother")}
          activeOpacity={0.8}
          className="bg-primary/80 px-4 py-3 rounded-md items-center justify-center flex-row"
        >
          <Plus size={16} color="#ffffff" strokeWidth={3} />
          <Text className="text-white font-semibold text-md ml-1.5 uppercase tracking-wider">
            {t("record_page.new_entry")}
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#10B981" />
          <Text className="text-slate-400 mt-4 font-bold text-sm tracking-wide">
            {t("record_page.loading")}
          </Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
        >
          {/* Search Bar */}
          <View className="flex-row items-center rounded-xl bg-white mb-6 px-4 h-12 border border-slate-100">
            <Search size={18} color="#94A3B8" strokeWidth={2.5} />
            <TextInput
              className="flex-1 ml-3 text-slate-700 font-semibold text-sm h-full"
              placeholder={t("record_page.search_placeholder")}
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {filteredRecords.length === 0 ? (
            <View className="py-20 items-center justify-center bg-white rounded-3xl border border-slate-100 border-dashed">
              <View className="w-16 h-16 bg-slate-50 rounded-full items-center justify-center mb-4 border border-slate-100">
                <Search size={28} color="#CBD5E1" strokeWidth={1.5} />
              </View>
              <Text className="text-slate-400 font-bold text-sm tracking-wide">
                {t("record_page.no_records")}
              </Text>
            </View>
          ) : (
            filteredRecords.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.75}
                onPress={() =>
                  router.push({
                    pathname: "/dashboard/profile",
                    params: { id: item.id, from: "/dashboard/record" },
                  } as any)
                }
                className="bg-white rounded-2xl p-5 mb-4 border border-slate-100"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1 mr-3">
                    <View className="w-12 h-12 bg-slate-50 rounded-full items-center justify-center mr-4 border border-slate-100/50">
                      <User size={22} color="#64748B" strokeWidth={2.5} />
                    </View>
                    <View className="flex-1">
                      <Text
                        className="text-lg font-bold text-slate-800 leading-tight mb-1"
                        numberOfLines={1}
                      >
                        {item.name}
                      </Text>
                      <View className="flex-row items-center">
                        <Text className="text-slate-600 font-semibold text-[14px] uppercase tracking-wide">
                          {t("record_page.age")}{" "}
                          <Text className="text-slate-700 font-semibold">
                            {formatAge(item.age)}
                          </Text>
                        </Text>
                        <View className="w-1 h-1 bg-slate-300 rounded-full mx-2.5" />
                        <Text className="text-slate-700 font-semibold text-[14px] uppercase tracking-wide">
                          {t("record_page.reg")}{" "}
                          <Text className="text-slate-700 font-semibold text-[15px]">
                            {formatDate(item.createdAt)}
                          </Text>
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View className="bg-slate-50 p-2 rounded-2xl border border-slate-100">
                    <ChevronRight size={16} color="#8195afff" strokeWidth={3} />
                  </View>
                </View>

                {/* Minimalist Date Metadata Row */}
                <View className="mt-4 pt-4 border-t border-slate-50 flex-row justify-between">
                  <View className="flex-col gap-1 items-center">
                    <View className="flex-row gap-1 items-center">
                      <CalendarDays
                        size={14}
                        color="#646f7eff"
                        strokeWidth={2.5}
                        className="mr-1.5"
                      />
                      <Text className="text-slate-600 text-[13px] font-semibold uppercase tracking-wider">
                        {t("record_page.lmp_date")}:{" "}
                      </Text>
                    </View>
                    <Text className="text-slate-700 ml-5 text-[15px] font-semibold">
                      {item.lmp ? language === "np" ? toNepaliNumbers(item.lmp) : item.lmp : "---"}
                    </Text>
                  </View>
                  <View className="flex-col gap-1 items-center">
                    <View className="flex-row items-center gap-1">
                      <CalendarDays
                        size={14}
                        color="#646f7eff"
                        strokeWidth={2.5}
                        className="mr-1.5"
                      />
                      <Text className="text-slate-600 text-[13px] font-semibold uppercase tracking-wider">
                        {t("record_page.edd_date")}:{" "}
                      </Text>
                    </View>
                    <Text className="text-slate-700 ml-5 text-[15px] font-semibold">
                      {formatDate(item.edd)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
