import CustomHeader from "@/components/CustomHeader";
import { useLanguage } from "@/context/LanguageContext";
import { getAllMothersGroupMeetings } from "@/hooks/database/models/MothersGroupMeetingModel";
import { MothersGroupMeetingStoreType } from "@/hooks/database/types/mothersGroupMeetingModal";
import { useFocusEffect, useRouter } from "expo-router";
import { Calendar, Plus, Users } from "lucide-react-native";
import { useCallback, useState } from "react";
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { AdToBs } from "react-native-nepali-picker";

type MeetingListType = Omit<MothersGroupMeetingStoreType, "discussed_topics" | "decisions"> & { discussed_topics: string[]; decisions: string[]; };

export default function MothersGroupMeetings() {
    const { t } = useLanguage();
    const router = useRouter();
    const [meetings, setMeetings] = useState<MeetingListType[]>([]);

    useFocusEffect(
        useCallback(() => {
            fetchMeetings();
        }, [])
    );

    const fetchMeetings = async () => {
        const data = await getAllMothersGroupMeetings();
        setMeetings(data);
    };

    return (
        <SafeAreaView className="flex-1 bg-white h-full pt-12">
            <CustomHeader
                title={t("mothers_group_meeting.mothers_group")}
                rightNode={
                    <TouchableOpacity
                        onPress={() => router.push("/dashboard/mothers-group/mothers-group-meeting-form")}
                        className="bg-primary flex-1 px-3 py-2 rounded-lg flex-row items-center"
                    >
                        <Plus color="#ffffff" size={17} className="mr-1" />
                        <Text className="text-white text-[14px] font-semibold uppercase">{t("mothers_group_meeting.record_new")}</Text>
                    </TouchableOpacity>
                }
            />
            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>

                <View className="px-5 mt-4 flex-col gap-4">
                    {meetings.map((meeting) => (
                        <TouchableOpacity
                            key={meeting.id}
                            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-2"
                            activeOpacity={0.7}
                            onPress={() => router.push({
                                pathname: "/dashboard/mothers-group/details",
                                params: { id: meeting.id }
                            })}
                        >
                            <View className="flex-row justify-between items-start mb-2">
                                <Text className="text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
                                    {meeting.discussed_topics[0] || t("mothers_group_meeting.meeting_default_topic")}
                                </Text>
                                <View className="bg-emerald-100 flex-row items-center px-3 py-1 rounded-full">
                                    <Users size={14} color="#065f46" className="mr-1" />
                                    <Text className="text-emerald-800 text-xs font-bold flex-row items-center">
                                        {meeting.attendees_count} {t("mothers_group_meeting.attendees")}
                                    </Text>
                                </View>
                            </View>
                            <Text className="text-xl font-bold text-gray-900 mb-4">{meeting.meeting_location}</Text>

                            <View className="flex-row items-center border-t border-gray-100 pt-4 mb-2">
                                <View className="flex-row items-center mr-6">
                                    <Calendar size={16} color="#6b7280" className="mr-2" />
                                    <Text className="text-gray-600">
                                        {meeting.meeting_date ? AdToBs(meeting.meeting_date) : ""}
                                    </Text>
                                </View>
                            </View>

                            {meeting.decisions && meeting.decisions.length > 0 && (
                                <Text className="text-gray-500 italic mt-3" numberOfLines={2}>
                                    "{meeting.decisions.join(", ")}"
                                </Text>
                            )}
                        </TouchableOpacity>
                    ))}
                    {meetings.length === 0 && (
                        <View className="items-center justify-center mt-10 px-2">
                            <View className="bg-white p-8 rounded-lg border border-gray-200 items-center w-full">
                                <View className="bg-emerald-50 p-5 rounded-full mb-6">
                                    <Users size={48} color="#10b981" />
                                </View>
                                <Text className="text-2xl font-semibold text-gray-900 mb-2 text-center">
                                    {t("mothers_group_meeting.empty_title")}
                                </Text>
                                <Text className="text-gray-500 text-center text-base leading-relaxed px-4">
                                    {t("mothers_group_meeting.empty_subtitle")}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
