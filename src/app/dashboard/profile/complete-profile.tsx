import CompleteForm from "@/components/forms/Complete-Form";
import { useLocalSearchParams } from "expo-router";

export default function CompleteProfileScreen() {
  const { id, from } = useLocalSearchParams<{ id: string, from?: string }>();
  return <CompleteForm id={id} from={from} />;
}
