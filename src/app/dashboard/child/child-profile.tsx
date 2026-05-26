import ChildCounselingSection from "@/app/dashboard/child/ChildCounselingSection";
import CustomHeader from "@/components/CustomHeader";
import Colors from "@/constants/Colors";
import { getInfantMonitoringById } from "@/hooks/database/models/InfantMonitoringModel";
import { InfantMonitoringStoreType } from "@/hooks/database/types/infantMonitoringModal";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { Baby, Calendar, CheckCircle, FileText, MapPin, User } from "lucide-react-native";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { AdToBs } from "react-native-nepali-picker";

export default function ChildProfileScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const [record, setRecord] = useState<InfantMonitoringStoreType | null>(null);
    const [loading, setLoading] = useState(true);


    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            const fetchRecord = async () => {
                if (!id) {
                    setLoading(false);
                    return;
                }
                try {
                    const childData = await getInfantMonitoringById(id);
                    if (isActive) {
                        setRecord(childData);
                    }
                } catch (error) {
                    console.error("Failed to fetch child record:", error);
                } finally {
                    if (isActive) setLoading(false);
                }
            };

            setLoading(true);
            fetchRecord();
            return () => {
                isActive = false;
            };
        }, [id]),
    );

    if (loading) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-[#F8FAFC]">
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text className="mt-4 text-slate-500 font-medium">
                    {t("profile.states.loading")}
                </Text>
            </SafeAreaView>
        );
    }

    if (!record) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-[#F8FAFC]">
                <Baby size={64} color="#CBD5E1" />
                <Text className="mt-4 text-lg text-slate-500 font-medium">
                    {t("profile.states.not_found")}
                </Text>
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="mt-6 px-8 py-3 rounded-full bg-blue-600"
                >
                    <Text className="text-white font-semibold">
                        {t("profile.states.go_back")}
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#F8FAFC] py-8">
            <StatusBar barStyle="dark-content" />
            <CustomHeader
                title={t("child_profile.title")}
                onBackPress={() => {
                    if (router.canGoBack()) {
                        router.back();
                    } else {
                        router.replace("/dashboard/child");
                    }
                }}
            />

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100, paddingTop: 12 }}
            >
                <View className="px-3 gap-y-3">
                    {/* Main Identity Card */}
                    <View className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                        <View className="flex-col items-center mb-2">
                            <View className="flex-row items-center mb-5 w-full">
                                <View className="w-16 h-16 rounded-full bg-indigo-50 items-center justify-center mr-4 border border-indigo-100">
                                    <Baby size={32} color="#6366F1" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-slate-900 text-xl font-extrabold leading-tight">
                                        {record.baby_name || t("child_page.unnamed_baby")}
                                    </Text>
                                    <View className="flex-row items-center mt-1.5">
                                        <User size={14} color="#64748B" />
                                        <Text className="text-slate-500 font-medium text-[13px] ml-1.5">
                                            {t("child_page.mother")}: <Text className="text-slate-700 font-bold">{record.mother_name || t("child_page.unknown")}</Text>
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={() =>
                                    router.push({
                                        pathname: "/dashboard/child/child-form",
                                        params: { id: record.id },
                                    })
                                }
                                className="mt-4 w-full bg-primary/80 py-3.5 rounded-lg flex-row items-center justify-center"
                            >
                                <FileText size={16} color="white" strokeWidth={2.5} />
                                <Text className="text-white font-bold ml-2 text-sm">
                                    {t("child_profile.actions.edit_profile")}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Key Info Grid */}
                    <View className="flex-row gap-3">
                        <View className="flex-1 bg-white p-3 py-4 rounded-xl flex-row items-center border border-slate-100 shadow-sm">
                            <Calendar size={20} color="#64748B" className="mr-3" />
                            <View>
                                <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">
                                    {t("child_profile.identity.date_of_birth")}
                                </Text>
                                <Text className="text-sm font-semibold text-slate-800">
                                    {record.date_of_birth ? `${AdToBs(record.date_of_birth)} ${t("child_page.bs")}` : "---"}
                                </Text>
                            </View>
                        </View>
                        <View className="flex-1 bg-white p-3 py-4 rounded-xl flex-row items-center border border-slate-100 shadow-sm">
                            <MapPin size={20} color={Colors.primary} className="mr-3" />
                            <View>
                                <Text className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-0.5">
                                    {t("child_profile.identity.birth_place")}
                                </Text>
                                <Text className="text-sm font-semibold text-blue-900 capitalize">
                                    {record.birth_place ? t(`child_profile.values.${record.birth_place}`, { defaultValue: record.birth_place.replace("_", " ") }) : "---"}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Quick Stats */}
                    <View className="flex-row gap-3">
                        <View className="bg-white flex-1 p-4 py-5 rounded-xl border border-slate-100 flex-row items-center shadow-sm">
                            <View className="w-10 h-10 rounded-full bg-emerald-50 items-center justify-center mr-3">
                                <CheckCircle size={18} color="#10B981" />
                            </View>
                            <View>
                                <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-0.5">
                                    {t("child_profile.identity.status")}
                                </Text>
                                <Text className="text-slate-800 font-bold text-sm capitalize">
                                    {record.status ? t(`child_profile.values.${record.status}`, { defaultValue: record.status }) : t("child_profile.values.alive")}
                                </Text>
                            </View>
                        </View>
                        <View className="bg-white flex-1 p-4 py-5 rounded-xl border border-slate-100 flex-row items-center shadow-sm">
                            <View className="w-10 h-10 rounded-full bg-amber-50 items-center justify-center mr-3">
                                <Baby size={18} color="#F59E0B" />
                            </View>
                            <View>
                                <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-0.5">
                                    {t("child_profile.identity.baby_weight")}
                                </Text>
                                <Text className="text-slate-800 font-bold text-sm capitalize">
                                    {record.baby_weight ? t(`child_profile.values.${record.baby_weight}`, { defaultValue: record.baby_weight.replace("_", " ") }) : t("child_profile.values.normal")}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View className="mt-2">
                        <ChildCounselingSection childId={record.id} />
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
