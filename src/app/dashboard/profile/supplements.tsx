import { Droplet, Pill, Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import SupplementModal from "../../../components/forms/SupplementModal";
import { useToast } from "../../../context/ToastContext";
import { getMotherProfile } from "../../../hooks/database/models/MotherModel";
import {
  getSupplementByMother,
  SupplementStoreType,
} from "../../../hooks/database/models/SupplementModel";

const SectionTitle = ({ title, icon: Icon, colorClass }: any) => (
  <View className="flex-row items-center mb-4 mt-2">
    <View
      className={`w-8 h-8 rounded-full items-center justify-center mr-3 bg-gray-100`}
    >
      <Icon size={16} color="#64748B" />
    </View>
    <Text className="text-slate-800 font-semibold text-xl">{title}</Text>
  </View>
);

export default function SupplementsScreen({ motherId }: { motherId?: string }) {
  const { t } = useTranslation();
  const id = motherId;
  const { showToast } = useToast();

  const [motherName, setMotherName] = useState("");
  const [supplementsRecord, setSupplementsRecord] =
    useState<SupplementStoreType | null>(null);
  const [loading, setLoading] = useState(true);

  const [supplementModalVisible, setSupplementModalVisible] = useState(false);
  const [selectedSupplementKey, setSelectedSupplementKey] = useState<
    | "iron_pregnancy"
    | "iron_post_delivery"
    | "vitamin_a_post_delivery"
    | "calcium"
  >("iron_pregnancy");
  const [selectedSupplementName, setSelectedSupplementName] = useState("");

  const loadData = async (motherId: string) => {
    try {
      const mother = await getMotherProfile(motherId);
      if (mother) {
        setMotherName(mother.name);
      }
      const suppData = await getSupplementByMother(motherId);
      setSupplementsRecord(suppData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadData(id);
    } else {
      setLoading(false);
    }
  }, [id]);

  // if (loading) {
  //   return (
  //     <View className="bg-white p-10 rounded-xl border border-slate-100 items-center justify-center">
  //       <ActivityIndicator size="small" color={Colors.primary} />
  //       <Text className="mt-2 text-slate-400 text-xs font-medium">
  //         {t("profile.states.loading")}
  //       </Text>
  //     </View>
  //   );
  // }

  return (
    <>
      <View className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm shadow-slate-200">
        <SectionTitle
          title={t("profile.supplements.title")}
          icon={Pill}
          colorClass="bg-rose-500"
        />
        <View className="p-1">
          {[
            {
              label: t("profile.supplements.iron_preg"),
              val: supplementsRecord?.iron_pregnancy === 1,
              icon: Pill,
              key: "iron_pregnancy",
            },
            {
              label: t("profile.supplements.iron_pnc"),
              val: supplementsRecord?.iron_post_delivery === 1,
              icon: Pill,
              key: "iron_post_delivery",
            },
            {
              label: t("profile.supplements.vit_a"),
              val: supplementsRecord?.vitamin_a_post_delivery === 1,
              icon: Droplet,
              key: "vitamin_a_post_delivery",
            },
            {
              label: t("profile.supplements.calcium"),
              val: supplementsRecord?.calcium === 1,
              icon: Pill,
              key: "calcium",
            },
          ].map((item, idx) => (
            <View
              key={idx}
              className="flex-row items-center justify-between p-4 border-b border-slate-50"
            >
              <View className="flex-row items-center flex-1 pr-4">
                <item.icon
                  size={18}
                  color={item.val ? "#10B981" : "#64748B"}
                  className="mr-3"
                />
                <Text
                  className={`text-[16px] leading-snug ${item.val ? "text-emerald-800" : "text-slate-700"}`}
                >
                  {item.label}
                </Text>
              </View>
              {item.val ? (
                <View className="px-3 py-1 bg-emerald-50 rounded-full flex-row items-center">
                  <Text className="text-[12px] font-semibold uppercase tracking-wider text-emerald-600">
                    {t("profile.supplements.done") || "Given"}
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedSupplementKey(item.key as any);
                    setSelectedSupplementName(item.label);
                    setSupplementModalVisible(true);
                  }}
                  className="px-2 py-1.5 rounded-lg bg-[#475569]"
                >
                  {/* <Text className="text-white text-[12px] font-bold">
                    {t("profile.supplements.add_btn")}
                  </Text> */}
                  <Plus size={18} color="white" strokeWidth={3} />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </View>

      {id && (
        <SupplementModal
          visible={supplementModalVisible}
          onClose={() => setSupplementModalVisible(false)}
          motherId={id}
          motherName={motherName}
          supplementKey={selectedSupplementKey}
          supplementName={selectedSupplementName}
          onSuccess={() => loadData(id)}
          showToast={showToast}
        />
      )}
    </>
  );
}
