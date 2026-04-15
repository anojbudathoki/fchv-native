import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  PanResponder,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react-native";
import { useLanguage } from "../../context/LanguageContext";
import learnContent from "../../assets/data/learnContent.json";
import { FileText, Activity, Heart, Baby, HeartPulse } from "lucide-react-native";

const SWIPE_THRESHOLD = 60;

const CONFIG: Record<string, any> = {
  maternal_health: { icon: HeartPulse, color: "#10B981", bg: "bg-emerald-100", image: require("../../assets/images/maternal_care.png") },
  first_trimester_detailed: { icon: Heart, color: "#F43F5E", bg: "bg-rose-100" },
  second_trimester_detailed: { icon: Heart, color: "#8B5CF6", bg: "bg-violet-100" },
  third_trimester_detailed: { icon: Activity, color: "#EC4899", bg: "bg-pink-100" },
  child_nutrition: { icon: FileText, color: "#3B82F6", bg: "bg-blue-100", image: require("../../assets/images/child_nutrition.png") },
  anc: { icon: Activity, color: "#EC4899", bg: "bg-pink-100", image: require("../../assets/images/anc.png") },
  pnc: { icon: Heart, color: "#8B5CF6", bg: "bg-violet-100", image: require("../../assets/images/pnc.png") },
  baby_care: { icon: Baby, color: "#06B6D4", bg: "bg-cyan-100", image: require("../../assets/images/newborn_care.png") },
};

const TRIMESTER_COLORS = [
  { accent: "#10B981", border: "#10B981", dot: "#10B981", activeText: "#10B981", activeBg: "#10B981" },
  { accent: "#10B981", border: "#10B981", dot: "#10B981", activeText: "#10B981", activeBg: "#10B981" },
  { accent: "#10B981", border: "#10B981", dot: "#10B981", activeText: "#10B981", activeBg: "#10B981" },
];

export default function LearnDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Use a ref to track activeTab for PanResponder (avoids stale closure)
  const activeTabRef = useRef(0);

  const switchTab = useCallback((newIndex: number) => {
    if (newIndex < 0 || newIndex > 2) return;
    const direction = newIndex > activeTabRef.current ? -1 : 1;

    // Animate out
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 120, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: direction * 30, duration: 120, useNativeDriver: true }),
    ]).start(() => {
      activeTabRef.current = newIndex;
      setActiveTab(newIndex);
      slideAnim.setValue(-direction * 30);

      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
      ]).start();
    });
  }, [fadeAnim, slideAnim]);

  // PanResponder for swipe gestures — operates at JS level, no conflict with React Navigation
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only capture horizontal swipes (not vertical scrolling)
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy * 1.5) && Math.abs(gestureState.dx) > 15;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -SWIPE_THRESHOLD && activeTabRef.current < 2) {
          switchTab(activeTabRef.current + 1);
        } else if (gestureState.dx > SWIPE_THRESHOLD && activeTabRef.current > 0) {
          switchTab(activeTabRef.current - 1);
        }
      },
    })
  ).current;

  const dataPrefix = learnContent[id as keyof typeof learnContent];
  const langKey = language === "np" ? "np" : "en";
  const content: any = dataPrefix ? dataPrefix[langKey as keyof typeof dataPrefix] : null;
  const config = CONFIG[id as keyof typeof CONFIG] || CONFIG.maternal_health;

  if (!content) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-500">{t("learn_details.content_not_found")}</Text>
        <TouchableOpacity onPress={() => router.push("/dashboard/learn")} className="mt-4 px-6 py-2 bg-blue-500 rounded-full">
          <Text className="text-white font-bold">{t("learn_details.go_back")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const Icon = config.icon;

  const renderMarkdown = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <Text key={index} className="font-bold text-gray-800">
            {part.slice(2, -2)}
          </Text>
        );
      }
      return <Text key={index}>{part}</Text>;
    });
  };

  const isMaternalHealth = id === "maternal_health";
  const trimesterData: any[] = isMaternalHealth
    ? [
        (learnContent as any)["first_trimester_detailed"]?.[langKey],
        (learnContent as any)["second_trimester_detailed"]?.[langKey],
        (learnContent as any)["third_trimester_detailed"]?.[langKey],
      ]
    : [];

  const tabTitles = [
    t("learn_details.trimesters.first"),
    t("learn_details.trimesters.second"),
    t("learn_details.trimesters.third"),
  ];

  const activeTrimester = trimesterData[activeTab];
  const activeColor = TRIMESTER_COLORS[activeTab];

  return (
    <View className="flex-1 bg-white pb-10">
      {/* Header */}
      <View className="flex-row items-center px-4 pt-12 pb-4 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => router.push("/dashboard/learn")} className="p-2 rounded-full z-10 active:opacity-50">
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-800 ml-3">
          {t("learn_details.details")}
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 20 }}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        {/* Banner area */}
        <View className="items-center">
          {config.image ? (
            <Image source={config.image} className="w-full h-56 rounded-2xl mb-5" resizeMode="cover" />
          ) : (
            <View className={`w-20 h-20 ${config.bg} rounded-[24px] items-center justify-center mb-4`}>
              <Icon size={40} color={config.color} />
            </View>
          )}
        </View>
        {/* Key Points */}
        {content.key_points && content.key_points.length > 0 && (
          <>
            <Text className="text-md font-bold text-gray-800 mb-4 ml-1">
              {t("learn_details.key_points")}
            </Text>

            <View className="gap-3 mb-8">
              {content.key_points.map((point: string, index: number) => (
                <View key={index} className="flex-row bg-white border border-gray-100 p-4 rounded-xl">
                  <CheckCircle2 size={22} color="#10B981" className="mt-[2px]" />
                  <Text className="text-[14px] text-gray-700 ml-3 flex-1 leading-6">{renderMarkdown(point)}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {isMaternalHealth && trimesterData.length > 0 ? (
          <View>
            <Text className="text-md font-bold text-gray-800 mb-4 ml-1">
              {t("learn_details.detailed_trimester_guide")}
            </Text>

            {/* Tab Bar */}
            <View className="flex-row p-1 rounded-xl mb-6">
              {tabTitles.map((title, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => switchTab(index)}
                  activeOpacity={0.7}
                  className={`flex-1 py-3 items-center border-b-2`}
                  style={{
                    borderBottomColor: activeTab === index ? TRIMESTER_COLORS[index].accent : 'transparent'
                  }}
                >
                  <Text
                    className={`font-bold text-[12px]`}
                    style={{
                      color: activeTab === index ? TRIMESTER_COLORS[index].accent : '#6B7280'
                    }}
                  >
                    {title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Swipeable Tab Content */}
            <View {...panResponder.panHandlers}>
              {activeTrimester ? (
                <Animated.View
                  style={{
                    opacity: fadeAnim,
                    transform: [{ translateX: slideAnim }],
                  }}
                >
                  <Text className="text-md font-bold text-gray-800 mb-2 ml-1">
                    {activeTrimester.title}
                  </Text>
                  <Text className="text-[13px] text-gray-600 mb-6 ml-1 leading-6">
                    {activeTrimester.description}
                  </Text>

                  {activeTrimester.sections?.map((section: any, idx: number) => (
                    <View key={`section-${activeTab}-${idx}`} className="mb-6">
                      <Text className="text-[15px] font-bold text-gray-800 mb-3 ml-1">
                        {(section.title || section.category || "").replace(/###\s*/g, "")}
                      </Text>
                      <View className="gap-2.5">
                        {section.points?.map((point: string, pIdx: number) => (
                          <View
                            key={`point-${activeTab}-${idx}-${pIdx}`}
                            className={`flex-row bg-white border border-gray-200 p-2 rounded-xl`}
                          >
                            <View className={`w-2 h-2 rounded-lg bg-green-500 mt-2`} />
                            <Text className="text-[14px] text-gray-700 ml-3 flex-1 leading-6">
                              {renderMarkdown(point)}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  ))}
                </Animated.View>
              ) : (
                <View className="py-8 items-center">
                  <Text className="text-gray-400">{t("learn_details.no_content")}</Text>
                </View>
              )}
            </View>
          </View>
        ) : !isMaternalHealth ? (
          <View>
            {content.sections?.map((section: any, idx: number) => (
              <View key={`section-${idx}`} className="mt-2 mb-6">
                <Text className="text-[15px] font-bold text-gray-800 mb-3 ml-1">
                  {(section.title || section.category || "").replace(/###\s*/g, "")}
                </Text>
                <View className="gap-2.5">
                  {section.points?.map((point: string, pIdx: number) => (
                    <View key={`point-${idx}-${pIdx}`} className="flex-row bg-white border border-gray-100 p-3.5 rounded-xl">
                      <View className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                      <Text className="text-[14px] text-gray-700 ml-3 flex-1 leading-6">
                        {renderMarkdown(point)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
