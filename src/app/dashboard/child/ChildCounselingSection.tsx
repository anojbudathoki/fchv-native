import { useLanguage } from "@/context/LanguageContext";
import { AlertTriangle, Check, ShieldCheck } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  CHILD_COUNSELING_QUESTIONS,
  ChildCounselingQuestion,
  MALNUTRITION_CONTENT,
} from "../../../constants/ChildCounselingQuestions";
import { useToast } from "../../../context/ToastContext";
import {
  ChildCounselingStoreType,
  getChildCounselingByChild,
  saveChildCounseling,
} from "../../../hooks/database/models/ChildCounselingModel";

interface ChildCounselingSectionProps {
  childId: string;
}

export default function ChildCounselingSection({
  childId,
}: ChildCounselingSectionProps) {
  const { showToast } = useToast();
  const { language, t } = useLanguage();

  const [record, setRecord] = useState<ChildCounselingStoreType | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await getChildCounselingByChild(childId);
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
  }, [childId]);

  const handleToggle = async (questionId: string, value: any) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    try {
      await saveChildCounseling({
        id: record?.id,
        child_id: childId,
        answers: JSON.stringify(newAnswers),
      });
      // Optionally show toast on success
      // showToast("Saved successfully");
    } catch (e) {
      console.error("Failed to save answer", e);
      showToast("Failed to save");
      // Revert on failure
      setAnswers(answers);
    }
  };

  const renderQuestionGroup = (
    title: string,
    icon: any,
    colorClass: string,
    questions: ChildCounselingQuestion[]
  ) => {
    return (
      <View className="bg-white p-5 rounded-xl border border-slate-100 mb-4">
        <View className="flex-row items-center mb-4 mt-1">
          <View className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${colorClass}`}>
            {icon}
          </View>
          <Text className="text-slate-800 font-bold text-lg">{title}</Text>
        </View>

        <View className="gap-y-3">
          {questions.map((question) => {
            const value = answers[question.id];
            return (
              <View
                key={question.id}
                className="flex-row items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100/60"
              >
                <Text className="flex-1 text-slate-700 text-[13px] font-medium mr-4 leading-relaxed">
                  {language === "np" ? question.ne : question.en}
                </Text>
                <TouchableOpacity
                  onPress={() => handleToggle(question.id, !value)}
                  className={`w-7 h-7 rounded-md border items-center justify-center mr-1 ${value ? "bg-blue-500 border-blue-500" : "bg-white border-slate-300"
                    }`}
                >
                  {value && <Check size={16} color="white" />}
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderMalnutritionGroup = () => {
    const hasMalnutrition = answers[MALNUTRITION_CONTENT.main_question.id] || false;
    const severity = answers["malnutrition_severity"];

    return (
      <View className="bg-white p-5 rounded-xl border border-slate-100 mb-4">
        <View className="flex-row items-center mb-4 mt-1">
          <View className={`w-8 h-8 rounded-full items-center justify-center mr-3 bg-amber-500`}>
            <AlertTriangle size={16} color="white" />
          </View>
          <Text className="text-slate-800 font-bold text-lg">{language === "np" ? MALNUTRITION_CONTENT.title.ne : MALNUTRITION_CONTENT.title.en}</Text>
        </View>

        <View className="gap-y-3">
          {/* Main Question */}
          <View className="flex-row items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100/60">
            <Text className="flex-1 text-slate-700 text-[13px] font-medium mr-4 leading-relaxed">
              {language === "np" ? MALNUTRITION_CONTENT.main_question.ne : MALNUTRITION_CONTENT.main_question.en}
            </Text>
            <TouchableOpacity
              onPress={() => handleToggle(MALNUTRITION_CONTENT.main_question.id, !hasMalnutrition)}
              className={`w-7 h-7 rounded-md border items-center justify-center mr-1 ${hasMalnutrition ? "bg-blue-500 border-blue-500" : "bg-white border-slate-300"
                }`}
            >
              {hasMalnutrition && <Check size={16} color="white" />}
            </TouchableOpacity>
          </View>

          {/* Conditional Content */}
          {hasMalnutrition && (
            <View className="pl-4 mt-2 gap-y-3 border-l-2 border-slate-100">

              {/* Severity Buttons */}
              <View className="flex-row gap-x-3 mb-2">
                <TouchableOpacity
                  onPress={() => handleToggle("malnutrition_severity", "medium")}
                  className={`flex-1 p-3 rounded-lg border flex-row justify-center items-center ${severity === "medium" ? "bg-amber-50 border-amber-500" : "bg-white border-slate-200"
                    }`}
                >
                  <Text className={`font-semibold ${severity === "medium" ? "text-amber-700" : "text-slate-500"}`}>
                    {language === "np" ? MALNUTRITION_CONTENT.severity_medium.ne : MALNUTRITION_CONTENT.severity_medium.en}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleToggle("malnutrition_severity", "high")}
                  className={`flex-1 p-3 rounded-lg border flex-row justify-center items-center ${severity === "high" ? "bg-rose-50 border-rose-500" : "bg-white border-slate-200"
                    }`}
                >
                  <Text className={`font-semibold ${severity === "high" ? "text-rose-700" : "text-slate-500"}`}>
                    {language === "np" ? MALNUTRITION_CONTENT.severity_high.ne : MALNUTRITION_CONTENT.severity_high.en}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Sub Questions */}
              {MALNUTRITION_CONTENT.sub_questions.map((q) => {
                const value = answers[q.id];
                return (
                  <View
                    key={q.id}
                    className="flex-row items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100/60"
                  >
                    <Text className="flex-1 text-slate-700 text-[13px] font-medium mr-4 leading-relaxed">
                      {language === "np" ? q.ne : q.en}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleToggle(q.id, !value)}
                      className={`w-7 h-7 rounded-md border items-center justify-center mr-1 ${value ? "bg-blue-500 border-blue-500" : "bg-white border-slate-300"
                        }`}
                    >
                      {value && <Check size={16} color="white" />}
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return null;
  }

  return (
    <View>
      {renderMalnutritionGroup()}
      {renderQuestionGroup(
        t("profile.quick_stats.counseling"),
        <ShieldCheck size={16} color="white" />,
        "bg-blue-500",
        CHILD_COUNSELING_QUESTIONS
      )}
    </View>
  );
}
