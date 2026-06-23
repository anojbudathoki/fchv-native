import { useLanguage } from "@/context/LanguageContext";
import { Activity, Baby, Heart, Plus, Trash2, ChevronDown, ChevronUp, Check, AlertTriangle, Users } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Modal, Text, TouchableOpacity, View, LayoutAnimation, Platform, UIManager } from "react-native";
import { AdToBs, BsToAd, CalendarPicker } from "react-native-nepali-picker";
import {
  COUNCELING_QUESTION_AFTER_PREGNANT,
  COUNCELING_QUESTION_AFTER_PREGNANT_ONE_TIME,
  COUNSELING_REFERRAL_QUESTIONS_AFTER_CHILD_BORN,
  COUNSELING_REFERRAL_QUESTIONS_AFTER_CHILD_BORN_ONE_TIME,
  COUNSELING_REFERRAL_QUESTIONS_ONE_TIME_MOTHER
} from "../../constants/CounselingQuestions";
import { useToast } from "../../context/ToastContext";

import { CounselingReferralStoreType, getCounselingReferralByMother, getCounselingReferralHistory, saveCounselingReferral } from "@/hooks/database/models/CounselingReferralModel";
import { getInfantMonitoringsByMother } from "@/hooks/database/models/InfantMonitoringModel";
import { isHealthProblemQuestion, useHealthIssues } from "@/store/healthIssuesStore";
import { getPregnancyByMotherId } from "../../hooks/database/models/PregnantWomenModal";
import { toNepaliNumbers } from "../../utils/dateHelper";

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface QuestionCardProps {
  question: any;
  logs: any[];
  isOneTime: boolean;
  isAdding: boolean;
  onAddPress: () => void;
  onDeletePress: () => void;
  disabled: boolean;
  language: string;
  t: (key: string, options?: any) => string;
}

const QuestionCard = ({
  question,
  logs,
  isOneTime,
  isAdding,
  onAddPress,
  onDeletePress,
  disabled,
  language,
  t
}: QuestionCardProps) => {
  const [isLogsExpanded, setIsLogsExpanded] = useState(false);

  const isRecorded = logs.length > 0;
  const isHealth = isHealthProblemQuestion(question.id);
  
  let status: 'completed' | 'pending' | 'not_started' = 'not_started';
  if (isRecorded) {
    status = 'completed';
  } else if (isHealth) {
    status = 'pending';
  }

  const getStatusLabel = () => {
    if (status === 'completed') return t("counseling_section.status_completed");
    if (status === 'pending') return t("counseling_section.status_pending");
    return t("counseling_section.status_not_started");
  };

  return (
    <View className="bg-white border border-slate-100/80 rounded-2xl p-4 mb-3">
      <View className="flex-row items-start">
        {/* Status Icon */}
        <View className="mr-3 mt-0.5">
          {status === 'completed' ? (
            <View className="w-5 h-5 rounded-full bg-emerald-500 items-center justify-center">
              <Check size={12} color="white" strokeWidth={4} />
            </View>
          ) : status === 'pending' ? (
            <View className="w-5 h-5 rounded-full bg-amber-500 items-center justify-center">
              <AlertTriangle size={12} color="white" strokeWidth={3} />
            </View>
          ) : (
            <View className="w-5 h-5 rounded-full border-2 border-slate-300 bg-white" />
          )}
        </View>

        {/* Question Text */}
        <View className="flex-1">
          <Text className="text-slate-800 text-[16px] font-semibold leading-relaxed">
            {language === "np" ? question.ne : question.en}
          </Text>
        </View>
      </View>

      {/* Badges and Action buttons row */}
      <View className="flex-row items-center justify-between mt-4">
        {/* Status Badge */}
        <View className={`px-2.5 py-1 rounded-full border ${
          status === 'completed' 
            ? 'bg-emerald-50 border-emerald-100' 
            : status === 'pending' 
              ? 'bg-amber-50 border-amber-100' 
              : 'bg-slate-50 border-slate-100'
        }`}>
          <Text className={`text-[12px] font-bold uppercase ${
            status === 'completed' 
              ? 'text-emerald-700' 
              : status === 'pending' 
                ? 'text-amber-700' 
                : 'text-slate-500'
          }`}>
            {getStatusLabel()}
          </Text>
        </View>

        {/* Action Button */}
        {status === 'completed' ? (
          <TouchableOpacity
            onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              setIsLogsExpanded(!isLogsExpanded);
            }}
            className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-full"
          >
            <Text className="text-slate-600 font-semibold text-sm">
              {t("counseling_section.edit_record")}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            disabled={disabled || isAdding}
            onPress={onAddPress}
            className={`w-28 py-1.5 rounded-full items-center justify-center ${
              disabled ? 'bg-slate-200' : 'bg-slate-700'
            }`}
          >
            {isAdding ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white font-semibold text-sm">
                {t("counseling_section.add_record")}
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Logs sub-section */}
      {status === 'completed' && isLogsExpanded && (
        <View className="mt-3 pt-3 border-t border-slate-100">
          <View className="gap-y-2">
            {logs.map((log: any, index: number) => {
              const isLatest = index === logs.length - 1;
              const canDelete = isLatest; // Allow deletion of the latest entry

              let dateStr = "";
              try {
                const pureDate = log.date.split("T")[0];
                dateStr = language === "np" ? toNepaliNumbers(AdToBs(pureDate)) : pureDate;
              } catch (e) {
                dateStr = log.date.split("T")[0];
              }

              return (
                <View key={index} className={`flex-row items-center justify-between ${canDelete ? "bg-red-50/50 border border-red-100" : "bg-slate-50 border border-slate-100"} px-3 py-2 rounded-xl`}>
                  <Text className={`text-xs font-semibold ${canDelete ? "text-red-700" : "text-slate-600"}`}>
                    {t("counseling_section.log_prefix", { index: language === "np" ? toNepaliNumbers(index + 1) : index + 1, date: dateStr })}
                  </Text>
                  {canDelete && (
                    <TouchableOpacity
                      onPress={onDeletePress}
                      disabled={disabled}
                      className="p-1"
                    >
                      <Trash2 size={14} color={disabled ? "#94A3B8" : "#DC2626"} />
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>

          {/* Add another record button inside expanded logs */}
          {(!isOneTime || logs.length === 0) && (
            <TouchableOpacity
              disabled={disabled || isAdding}
              onPress={onAddPress}
              className="mt-3 flex-row items-center justify-center p-2.5 border border-dashed border-slate-300 rounded-xl bg-slate-50/50"
            >
              <Plus size={14} color="#64748B" strokeWidth={3} className="mr-1" />
              <Text className="text-slate-600 font-semibold text-xs">
                {t("counseling_section.add_another_record")}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

interface CounselingReferralSectionProps {
  motherId: string;
  disabled?: boolean;
}

export default function CounselingReferralSection({
  motherId,
  disabled
}: CounselingReferralSectionProps) {
  const [showHealthIssues] = useHealthIssues(motherId);
  const { showToast } = useToast();
  const { language, t } = useLanguage();

  const [record, setRecord] = useState<CounselingReferralStoreType | null>(
    null,
  );
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [historyAnswers, setHistoryAnswers] = useState<Record<string, any>>({});
  const [isPregnant, setIsPregnant] = useState(false);
  const [hasChild, setHasChild] = useState(false);
  const [currentPregnancyId, setCurrentPregnancyId] = useState<string | null>(null);
  const [addingQuestionId, setAddingQuestionId] = useState<string | null>(null);

  // Expanded accordion sections state
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    mother: true,
    pregnancy: false,
    post_birth: false,
  });

  const toggleSection = (section: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState(false);
  const [pendingDeleteQuestionId, setPendingDeleteQuestionId] = useState<string | null>(null);

  // Manual Date Picker State
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerQuestionId, setDatePickerQuestionId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const pregnancy = await getPregnancyByMotherId(motherId);
      setIsPregnant(!!pregnancy);
      const pregId = pregnancy?.id || null;
      setCurrentPregnancyId(pregId);

      const children = await getInfantMonitoringsByMother(motherId);
      setHasChild(children && children.length > 0);

      // Load record scoped to the current pregnancy context only
      let data;
      if (pregId) {
        data = await getCounselingReferralByMother(motherId, pregId);
      } else {
        data = await getCounselingReferralByMother(motherId, null);
      }
      setRecord(data);
      if (data?.answers) {
        setAnswers(JSON.parse(data.answers));
      }

      // Load history scoped to the current pregnancy context only
      const history = pregId
        ? await getCounselingReferralHistory(motherId, pregId)
        : await getCounselingReferralHistory(motherId);
      const aggregated: Record<string, any> = {};
      history.forEach(h => {
        if (h.answers) {
          const parsed = JSON.parse(h.answers);
          Object.keys(parsed).forEach(key => {
            if (!aggregated[key]) aggregated[key] = [];
            const logs = Array.isArray(parsed[key]) ? parsed[key] : (parsed[key] === true ? [{ date: h.updated_at, value: true }] : []);
            aggregated[key] = [...aggregated[key], ...logs];
          });
        }
      });
      setHistoryAnswers(aggregated);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [motherId]);

  const handleAdd = async (questionId: string, customAdDate: string) => {
    if (addingQuestionId) return;

    let chosenDate = new Date(customAdDate);
    if (isNaN(chosenDate.getTime())) {
      chosenDate = new Date();
    } else {
      chosenDate.setHours(12, 0, 0, 0);
    }
    const currentTime = chosenDate.toISOString();

    let existingLogs = [];
    if (Array.isArray(answers[questionId])) {
      existingLogs = answers[questionId];
    } else if (answers[questionId] === true) {
      // Migrate old boolean format if it exists
      existingLogs = [{ date: record?.updated_at || currentTime, value: true }];
    }

    const newLog = { date: currentTime, value: true };
    const newAnswers = { ...answers, [questionId]: [...existingLogs, newLog] };

    setAnswers(newAnswers);
    setAddingQuestionId(questionId);

    try {
      await saveCounselingReferral({
        id: record?.id,
        mother: motherId,
        pregnancy: currentPregnancyId,
        answers: JSON.stringify(newAnswers),
      });
      showToast(t("counseling_section.added_successfully"));
      await loadData(); // Refresh history
    } catch (e) {
      console.error("Failed to save answer", e);
      showToast(t("counseling_section.failed_to_save"));
      setAnswers(answers);
    } finally {
      setAddingQuestionId(null);
    }
  };

  const requestDeleteLatest = (questionId: string) => {
    setPendingDeleteQuestionId(questionId);
    setDeleteModal(true);
  };

  const confirmDeleteLatest = async () => {
    if (!pendingDeleteQuestionId) return;

    const questionId = pendingDeleteQuestionId;
    const logs = Array.isArray(answers[questionId]) ? [...answers[questionId]] : [];

    if (logs.length === 0) {
      setDeleteModal(false);
      return;
    }

    logs.pop(); // Remove the latest entry

    const newAnswers = { ...answers, [questionId]: logs };
    setAnswers(newAnswers);

    try {
      await saveCounselingReferral({
        id: record?.id,
        mother: motherId,
        pregnancy: currentPregnancyId,
        answers: JSON.stringify(newAnswers),
      });
      showToast(t("counseling_section.deleted_successfully"));
      loadData(); // Refresh history
    } catch (e) {
      console.error("Failed to delete", e);
      showToast(t("counseling_section.failed_to_delete"));
      setAnswers(answers);
    } finally {
      setDeleteModal(false);
      setPendingDeleteQuestionId(null);
    }
  };

  const renderDeleteConfirmModal = () => (
    <Modal
      visible={deleteModal}
      transparent
      animationType="fade"
      onRequestClose={() => setDeleteModal(false)}
    >
      <View className="flex-1 justify-center items-center bg-black/40 px-6 pb-3">
        <View className="bg-white rounded-2xl w-full max-w-[320px] overflow-hidden">
          <View className="bg-red-50 px-5 pt-5 pb-4 items-center">
            <View className="w-12 h-12 rounded-full bg-red-100 items-center justify-center mb-3">
              <Trash2 size={22} color="#DC2626" />
            </View>
            <Text className="text-slate-800 text-xl font-semibold text-center">
              {t("counseling_section.delete_confirm_title")}
            </Text>
          </View>
          <View className="px-5 py-4">
            <Text className="text-slate-600 text-[15px] text-center leading-relaxed">
              {t("counseling_section.delete_confirm_message")}
            </Text>
          </View>
          <View className="flex-row border-t pb-5 border-slate-100">
            <TouchableOpacity
              onPress={() => setDeleteModal(false)}
              className="flex-1 py-3.5 items-center"
            >
              <Text className="text-slate-500 font-medium text-[15px]">
                {t("counseling_section.delete_confirm_no")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={confirmDeleteLatest}
              className="flex-1 py-3.5 items-center"
            >
              <Text className="text-red-600 font-medium text-[15px]">
                {t("counseling_section.delete_confirm_yes")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderAccordionSection = (
    key: string,
    title: string,
    icon: any,
    colorClass: string,
    questions: { question: any; isOneTime: boolean }[]
  ) => {
    const isExpanded = expandedSections[key];
    const visibleQuestions = questions.filter((q) => {
      return showHealthIssues || !isHealthProblemQuestion(q.question.id);
    });

    if (visibleQuestions.length === 0) return null;

    return (
      <View className="mb-4 border border-slate-100 rounded-xl overflow-hidden bg-gray-50">
        {/* Accordion Header */}
        <TouchableOpacity
          onPress={() => toggleSection(key)}
          activeOpacity={0.7}
          className="flex-row items-center justify-between px-5 py-4 bg-white"
        >
          <View className="flex-row items-center">
            <View className={`w-9 h-9 rounded-full ${colorClass} items-center justify-center mr-3`}>
              {icon}
            </View>
            <Text className="text-slate-800 text-xl font-semibold">
              {title}
            </Text>
          </View>
          {isExpanded ? (
            <ChevronUp size={20} color="#64748B" />
          ) : (
            <ChevronDown size={20} color="#64748B" />
          )}
        </TouchableOpacity>

        {/* Accordion Content */}
        {isExpanded && (
          <View className="px-4 pt-3 pb-2">
            {visibleQuestions.map(({ question, isOneTime }) => {
              const logs = Array.isArray(historyAnswers[question.id]) ? historyAnswers[question.id] : [];
              const isAdding = addingQuestionId === question.id;

              return (
                <QuestionCard
                  key={question.id}
                  question={question}
                  logs={logs}
                  isOneTime={isOneTime}
                  isAdding={isAdding}
                  onAddPress={() => {
                    setDatePickerQuestionId(question.id);
                    setShowDatePicker(true);
                  }}
                  onDeletePress={() => requestDeleteLatest(question.id)}
                  disabled={disabled || false}
                  language={language}
                  t={t}
                />
              );
            })}
          </View>
        )}
      </View>
    );
  };

  if (loading) return null;

  // 1. Mother Health (General mother questions)
  const motherQuestions = COUNSELING_REFERRAL_QUESTIONS_ONE_TIME_MOTHER.map(
    q => ({ question: q, isOneTime: true })
  );

  // 2. Pregnancy Care questions
  const pregQuestions = [
    ...COUNCELING_QUESTION_AFTER_PREGNANT.map(q => ({ question: q, isOneTime: false })),
    ...COUNCELING_QUESTION_AFTER_PREGNANT_ONE_TIME.map(q => ({ question: q, isOneTime: true }))
  ];

  // 4. Post Delivery Care questions
  const isHomeDeliveryAdded = Array.isArray(historyAnswers['home_delivery']) && historyAnswers['home_delivery'].length > 0;
  const filteredPostBirthOneTimeQuestions = COUNSELING_REFERRAL_QUESTIONS_AFTER_CHILD_BORN_ONE_TIME.filter(
    (question) => {
      if (question.id === "postnatal_iron_tablets_given" || question.id === "home_delivery_misoprostol") {
        return isHomeDeliveryAdded;
      }
      return true;
    }
  );
  const postBirthQuestions = [
    ...COUNSELING_REFERRAL_QUESTIONS_AFTER_CHILD_BORN.map(q => ({ question: q, isOneTime: false })),
    ...filteredPostBirthOneTimeQuestions.map(q => ({ question: q, isOneTime: true }))
  ];

  return (
    <View className="gap-y-1">
      {renderDeleteConfirmModal()}

      {/* 1. Mother Health */}
      {renderAccordionSection(
        "mother",
        t("counseling_section.mother_health"),
        <Heart size={18} color="#64748B" />,
        "bg-slate-100",
        motherQuestions
      )}

      {/* 2. Pregnancy Care */}
      {isPregnant && renderAccordionSection(
        "pregnancy",
        t("counseling_section.pregnancy_care"),
        <Activity size={18} color="#64748B" />,
        "bg-slate-100",
        pregQuestions
      )}

      {/* 3. Post Delivery Care */}
      {hasChild && renderAccordionSection(
        "post_birth",
        t("counseling_section.post_delivery_care"),
        <Baby size={18} color="#64748B" />,
        "bg-slate-100",
        postBirthQuestions
      )}

      {/* Calendar Date Picker for manual date selection */}
      <CalendarPicker
        visible={showDatePicker}
        onClose={() => {
          setShowDatePicker(false);
          setDatePickerQuestionId(null);
        }}
        onDateSelect={(bsDate) => {
          setShowDatePicker(false);
          if (datePickerQuestionId) {
            try {
              const adDate = BsToAd(bsDate);
              handleAdd(datePickerQuestionId, adDate);
            } catch (e) {
              console.error("Date conversion error:", e);
            }
          }
          setDatePickerQuestionId(null);
        }}
        language={language === "np" ? "np" : "en"}
        theme="light"
        brandColor="#475569"
        dayTextStyle={{ fontWeight: "normal" }}
        weekTextStyle={{ fontWeight: "normal" }}
        titleTextStyle={{ fontWeight: "normal" }}
      />
    </View>
  );
}
