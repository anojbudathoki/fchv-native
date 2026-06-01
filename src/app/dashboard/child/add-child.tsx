import ChildRegistrationForm from "@/components/child-form";
import { useLocalSearchParams } from "expo-router";

export default function CompleteProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ChildRegistrationForm />;
}
