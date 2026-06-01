import PregnancyReportScreen from "@/components/pregnancy-report";
import { useLocalSearchParams } from "expo-router";

export default function CompleteProfileScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    return <PregnancyReportScreen />;
}
