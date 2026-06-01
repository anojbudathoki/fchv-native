import ChildRegistrationForm from "@/components/child-form";
import { useLocalSearchParams } from "expo-router";

export default function AddChildScreen() {
    const { id, motherId } = useLocalSearchParams<{ id: string, motherId?: string }>();
    return <ChildRegistrationForm />;
}
