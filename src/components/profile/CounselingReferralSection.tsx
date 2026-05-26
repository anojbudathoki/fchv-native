import { useLanguage } from "@/context/LanguageContext";
import { ClipboardList, Check } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { COUNSELING_REFERRAL_QUESTIONS } from "../../constants/CounselingQuestions";
import { useToast } from "../../context/ToastContext";
import {
  CounselingReferralStoreType,
  getCounselingReferralByMother,
  saveCounselingReferral,
} from "../../hooks/database/models/CounselingReferralModel";

interface CounselingReferralSectionProps {
  motherId: string;
}

export default function CounselingReferralSection({
  motherId,
}: CounselingReferralSectionProps) {
  const { showToast } = useToast();
  const { language, t } = useLanguage();

  const [record, setRecord] = useState<CounselingReferralStoreType | null>(
    null,
  );
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await getCounselingReferralByMother(motherId);
      setRecord(data);
      if (data?.answers) {
        setAnswers(JSON.parse(data.answers));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [motherId]);

  const handleToggle = async (questionId: string, value: boolean) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    try {
      await saveCounselingReferral({
        id: record?.id,
        mother_id: motherId,
        answers: JSON.stringify(newAnswers),
      });
      showToast("Saved successfully");
    } catch (e) {
      console.error("Failed to save answer", e);
      showToast("Failed to save");
      // Revert on failure
      setAnswers(answers);
    }
  };

  if (loading) {
    return null; // Or a loading spinner
  }


  return (
    <View className="bg-white py-5 px-3 rounded-xl border border-slate-100 mb-4">
      <View className="flex-row items-center mb-4 mt-2">
        <View className="w-8 h-8 rounded-full items-center justify-center mr-3 bg-emerald-500">
          <ClipboardList size={16} color="white" />
        </View>
        <Text className="text-slate-800 font-bold text-lg">
          {language === "np" ? "परामर्श र रेफर विवरण" : "Counseling & Referral Details"}
        </Text>
      </View>

      <View className="gap-y-3">
        {COUNSELING_REFERRAL_QUESTIONS.map((question) => {
          const value = answers[question.id];
          return (
            <View
              key={question.id}
              className="flex-row items-center justify-between p-3 rounded-md bg-white border border-slate-100"
            >
              <Text className="flex-1 text-slate-700 text-md font-medium mr-4 leading-relaxed">
                {language === "np" ? question.ne : question.en}
              </Text>
              <TouchableOpacity
                onPress={() => handleToggle(question.id, !value)}
                className={`w-7 h-7 rounded border items-center justify-center mr-2 ${
                  value ? "bg-blue-500 border-blue-500" : "bg-white border-slate-300"
                }`}
              >
                {value && <Check size={18} color="white" />}
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
}
