import PregnancyDetailsScreen from "@/components/PregnancyDetails";
import { useLocalSearchParams } from "expo-router";

export default function PregnancyDetails() {
    const { id, motherId } = useLocalSearchParams<{ id: string, motherId?: string }>();
    return <PregnancyDetailsScreen />;
}
