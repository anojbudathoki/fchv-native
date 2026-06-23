import { useLanguage } from "@/context/LanguageContext";
import { Check, X } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { saveCounselingReferral } from "@/hooks/database/models/CounselingReferralModel";
import { COUNSELING_QUESTIONS_ONE_TIME_PREGNANT_REGISTER_TIME } from "../../constants/CounselingQuestions";
import { useToast } from "../../context/ToastContext";
import ModalWithSafeArea from "../common/ModalWithSafeArea";

interface PrenatalRegisterCounselingModalProps {
  visible: boolean;
  onClose: () => void;
  motherId: string;
  pregnancyId: string;
}

export default function PrenatalRegisterCounselingModal({
  visible,
  onClose,
  motherId,
  pregnancyId,
}: PrenatalRegisterCounselingModalProps) {
  const { language, t } = useLanguage();
  const { showToast } = useToast();
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);

  const toggleQuestion = (questionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleSaveAndContinue = async () => {
    setSaving(true);
    try {
      const answersForSave: Record<string, any> = {};
      Object.entries(answers).forEach(([questionId, completed]) => {
        if (completed) {
          answersForSave[questionId] = [
            { date: new Date().toISOString(), value: true },
          ];
        }
      });

      await saveCounselingReferral({
        mother: motherId,
        pregnancy: pregnancyId,
        answers: JSON.stringify(answersForSave),
      });

      showToast(t("counseling_section.added_successfully"));
    } catch (e) {
      console.error("Failed to save counseling answers", e);
      showToast(t("counseling_section.failed_to_save"));
    } finally {
      setSaving(false);
      onClose();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <ModalWithSafeArea
      visible={visible}
      onRequestClose={handleSkip}
      animationType="slide"
      transparent
    >
      <Pressable onPress={handleSkip} className="flex-1 bg-black/50 justify-end">
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="bg-white w-full rounded-t-3xl p-6 pb-10"
        >
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-1">
              <Text className="text-xl font-semibold text-slate-800">
                {t("counseling_section.prenatal_register_title")}
              </Text>
              <Text className="text-sm text-slate-500 mt-1">
                {t("counseling_section.prenatal_register_subtitle")}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleSkip}
              className="p-2 bg-slate-100 rounded-full ml-2"
            >
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Questions */}
          <View className="my-4">
            {COUNSELING_QUESTIONS_ONE_TIME_PREGNANT_REGISTER_TIME.map(
              (question) => {
                const isCompleted = !!answers[question.id];
                return (
                  <TouchableOpacity
                    key={question.id}
                    onPress={() => toggleQuestion(question.id)}
                    activeOpacity={0.7}
                    className={`flex-row items-center p-4 rounded-xl mb-3 border ${
                      isCompleted
                        ? "bg-emerald-50 border-emerald-200"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    {/* Checkbox */}
                    <View
                      className={`w-6 h-6 rounded-full items-center justify-center mr-3 ${
                        isCompleted
                          ? "bg-emerald-500"
                          : "border-2 border-slate-300 bg-white"
                      }`}
                    >
                      {isCompleted && (
                        <Check size={14} color="white" strokeWidth={4} />
                      )}
                    </View>
                    {/* Question text */}
                    <View className="flex-1">
                      <Text className="text-slate-800 text-[15px] font-medium leading-relaxed">
                        {language === "np" ? question.ne : question.en}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              },
            )}
          </View>

          {/* Action buttons */}
          <View className="flex-row gap-3 mt-2 pb-10">
            <TouchableOpacity
              onPress={handleSkip}
              className="flex-1 h-14 border border-slate-200 rounded-xl items-center justify-center"
              disabled={saving}
            >
              <Text className="font-semibold text-slate-600 text-[15px]">
                {t("counseling_section.skip")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSaveAndContinue}
              disabled={saving}
              className="flex-1 h-14 bg-slate-800 rounded-xl items-center justify-center"
            >
              {saving ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="font-semibold text-white text-[15px]">
                  {t("counseling_section.save_continue")}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </ModalWithSafeArea>
  );
}
