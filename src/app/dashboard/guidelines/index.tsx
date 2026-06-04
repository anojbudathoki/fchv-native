import guidelinesBg from "@/assets/images/mother-child.png";
import CustomHeader from "@/components/CustomHeader";
import { useLanguage } from "@/context/LanguageContext";
import { router } from "expo-router";
import {
  ArrowRight,
  Baby,
  ChevronRight,
  Salad,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react-native";
import {
  ImageBackground,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CATEGORY_CARDS = [
  {
    id: "birth_prep",
    icon: Stethoscope,
    iconColor: "#3B82F6",
    iconBg: "#EFF6FF",
    titleKey: "learn_page.categories.birth_prep",
  },
  {
    id: "nutrition",
    icon: Salad,
    iconColor: "#F97316",
    iconBg: "#FFF7ED",
    titleKey: "learn_page.categories.nutrition",
  },
  {
    id: "family_planning",
    icon: Users,
    iconColor: "#8B5CF6",
    iconBg: "#F5F3FF",
    titleKey: "learn_page.categories.family_planning",
  },
  {
    id: "baby_care",
    icon: Baby,
    iconColor: "#E11D48",
    iconBg: "#FFF1F2",
    titleKey: "learn_page.categories.newborn",
  },
];

const GUIDELINES = [
  {
    id: "breastfeeding",
    emoji: "🤱",
    titleKey: "learn_page.guidelines.breastfeeding",
    color: "#22C55E",
    bg: "#F0FFF4",
  },
  {
    id: "vaccination",
    emoji: "💉",
    titleKey: "learn_page.guidelines.vaccination",
    color: "#3B82F6",
    bg: "#EFF6FF",
  },
  {
    id: "checkups",
    emoji: "🩺",
    titleKey: "learn_page.guidelines.checkups",
    color: "#E11D48",
    bg: "#FFF1F2",
  },
  {
    id: "mental_health",
    emoji: "🧘",
    titleKey: "learn_page.guidelines.mental_health",
    color: "#8B5CF6",
    bg: "#F5F3FF",
  },
];

export default function GuidelinesIndexScreen() {
  const { t } = useLanguage();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" className="bg-white" />
      <CustomHeader
        title={t("learn_page.header")}
        onBackPress={() => router.replace("/dashboard")}
        className="py-4"
      />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="px-5 mt-6">

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              router.push("/dashboard/guidelines/maternal_health" as any)
            }
          >
            <ImageBackground
              source={guidelinesBg}
              className="rounded-[20px] overflow-hidden h-52"
              imageStyle={{ borderRadius: 20 }}
            >
              {/* Dark overlay */}
              <View className="absolute inset-0 bg-black/10 rounded-[20px]" />

              {/* Content */}
              <View className="flex-1 p-5 justify-between">
                <View className="self-start bg-[#E11D48] w-11 h-11 rounded-2xl items-center justify-center">
                  <ShieldCheck size={21} color="white" strokeWidth={2.5} />
                </View>
                <View className="flex-row justify-between items-end">
                  <View>
                    <Text className="text-white font-bold text-2xl">
                      {t("learn_page.hero_title_np")}
                    </Text>
                    <Text className="text-white/80 font-bold text-md">
                      {t("learn_page.hero_subtitle")}
                    </Text>
                  </View>
                  <View className="bg-white/20 p-2.5 rounded-2xl border border-white/30">
                    <ArrowRight size={18} color="white" strokeWidth={2.5} />
                  </View>
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </View>

        <View className="px-5 mt-8">
          <View className="flex-row flex-wrap gap-4">
            {CATEGORY_CARDS.map((cat) => {
              const Icon = cat.icon;
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => {
                    if (cat.id === "nutrition") {
                      router.push("/dashboard/guidelines/nutritions" as any);
                    } else {
                      router.push(`/dashboard/guidelines/${cat.id}` as any);
                    }
                  }}
                  className="bg-white rounded-xl p-5 border border-gray-200"
                  style={{ width: "47%" }}
                >
                  <View
                    className="w-12 h-12 rounded-2xl items-center justify-center mb-4"
                    style={{ backgroundColor: cat.iconBg }}
                  >
                    <Icon size={24} color={cat.iconColor} strokeWidth={2.5} />
                  </View>
                  <Text className="text-[#1E293B] font-semibold text-lg leading-tight">
                    {t(cat.titleKey)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View className="px-5 mt-10">
          <Text className="text-[#1E293B] text-xl font-bold mb-5">
            {t("learn_page.all_guidelines")}
          </Text>

          {GUIDELINES.map((item, i) => (
            <TouchableOpacity
              key={i}
              activeOpacity={0.75}
              onPress={() =>
                item.id &&
                router.push(`/dashboard/guidelines/${item.id}` as any)
              }
              className="bg-white rounded-xl p-4 mb-3 flex-row items-center border border-gray-200"
            >
              <View
                className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                style={{ backgroundColor: item.bg }}
              >
                <Text className="text-2xl">{item.emoji}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-[#1E293B] font-semibold text-lg">
                  {t(item.titleKey)}
                </Text>
              </View>
              <View className="bg-gray-50 p-2 rounded-xl">
                <ChevronRight size={18} color="#65696eff" strokeWidth={2.5} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
