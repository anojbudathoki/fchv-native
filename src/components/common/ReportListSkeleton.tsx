import { Skeleton } from "@/components/common/Skeleton";
import { View } from "react-native";

export const ReportListSkeleton = () => (
    <View className="bg-white rounded-2xl px-3 py-5 mb-4 flex-row items-center border border-slate-200">
        <View className="w-16 h-16 rounded-full bg-slate-50 items-center justify-center border border-slate-100">
            <Skeleton width={32} height={32} borderRadius={16} />
        </View>
        <View className="flex-1 ml-5 gap-2.5">
            <View className="flex-row items-center justify-between">
                <Skeleton width="50%" height={20} borderRadius={6} />
                <Skeleton width={64} height={24} borderRadius={12} />
            </View>
            <View className="flex-row items-center">
                <Skeleton width={14} height={14} borderRadius={4} style={{ marginRight: 6 }} />
                <Skeleton width="40%" height={14} borderRadius={4} />
            </View>
            <View className="flex-row items-center">
                <Skeleton width={14} height={14} borderRadius={4} style={{ marginRight: 6 }} />
                <Skeleton width="45%" height={14} borderRadius={4} />
            </View>
        </View>
        <View className="ml-4">
            <Skeleton width={20} height={20} borderRadius={10} />
        </View>
    </View>
);
