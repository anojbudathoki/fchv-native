import { View, Text, ScrollView, Alert, Pressable } from "react-native";
import React, { useState } from "react";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";
import SelectionGroup from "../../components/SelectionGroup";
import {
  User,
  Calendar,
  MapPin,
  Hash,
  Activity,
  Heart,
  Shield,
} from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import NavigationLayout from "@/components/NavigationLayout";
import { useLanguage } from "../../context/LanguageContext";

const SectionHeader = ({
  icon: Icon,
  title,
  subTitle,
  color = "bg-blue-500",
}: {
  icon: any;
  title: string;
  subTitle: string;
  color?: string;
}) => (
  <View className="flex-row items-center mb-5">
    <View
      className={`w-10 h-10 ${color} rounded-2xl items-center justify-center mr-3 shadow-sm`}
    >
      <Icon size={20} color="white" />
    </View>
    <View>
      <Text className="text-gray-800 font-bold text-lg">{title}</Text>
      <Text className="text-gray-500 text-sm font-medium">{subTitle}</Text>
    </View>
  </View>
);

export default function PregnantWomenForm() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [wardNo, setWardNo] = useState("");
  const [village, setVillage] = useState("");
  const [gravida, setGravida] = useState("");
  const [lmp, setLmp] = useState("");
  const [edd, setEdd] = useState("");
  const [ancVisitCount, setAncVisitCount] = useState("");
  const [ifaTabletReceived, setIfaTabletReceived] = useState("");
  const [ttVaccinationStatus, setTtVaccinationStatus] = useState("");
  const [riskSigns, setRiskSigns] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showLmpPicker, setShowLmpPicker] = useState(false);
  const [showEddPicker, setShowEddPicker] = useState(false);

  const formatDate = (date: Date) => {
    try {
      return date.toISOString().split("T")[0];
    } catch (e) {
      return "";
    }
  };

  const calculateEDD = (lmpDate: Date) => {
    const eddDate = new Date(lmpDate);
    eddDate.setDate(lmpDate.getDate() + 280);
    return eddDate;
  };

  const calculateLMP = (eddDate: Date) => {
    const lmpDate = new Date(eddDate);
    lmpDate.setDate(eddDate.getDate() - 280);
    return lmpDate;
  };

  const onLmpChange = (event: any, selectedDate?: Date) => {
    setShowLmpPicker(false);
    if (selectedDate) {
      const formatted = formatDate(selectedDate);
      setLmp(formatted);
      const calculatedEdd = calculateEDD(selectedDate);
      setEdd(formatDate(calculatedEdd));
    }
  };

  const onEddChange = (event: any, selectedDate?: Date) => {
    setShowEddPicker(false);
    if (selectedDate) {
      const formatted = formatDate(selectedDate);
      setEdd(formatted);
      const calculatedLmp = calculateLMP(selectedDate);
      setLmp(formatDate(calculatedLmp));
    }
  };

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        t("pregnant_form.submit.title"),
        t("pregnant_form.submit.success"),
      );
    }, 1500);
  };

  return (
    <View className="flex-1 bg-slate-50">
      <NavigationLayout title={t("pregnant_form.title")} />
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="mt-4">
          {/* Card 1: Basic Information */}
          <View className="bg-white rounded-[32px] py-6 px-4 mb-6 border border-slate-100">
            <SectionHeader
              icon={User}
              title={t("pregnant_form.basic_info.title")}
              subTitle={t("pregnant_form.basic_info.subtitle")}
              color="bg-blue-500"
            />

            <InputField
              label={t("pregnant_form.basic_info.name_label")}
              placeholder={t("pregnant_form.basic_info.name_placeholder")}
              value={name}
              onChangeText={setName}
              leftIcon={<User size={18} color="#64748B" />}
            />

            <InputField
              label={t("pregnant_form.basic_info.age_label")}
              placeholder={t("pregnant_form.basic_info.age_placeholder")}
              keyboardType="numeric"
              value={age}
              onChangeText={setAge}
              leftIcon={<Hash size={18} color="#64748B" />}
            />
          </View>

          {/* Card 2: Address */}
          <View className="bg-white rounded-[32px] py-6 px-4 mb-6 border border-slate-100">
            <SectionHeader
              icon={MapPin}
              title={t("pregnant_form.address.title")}
              subTitle={t("pregnant_form.address.subtitle")}
              color="bg-emerald-500"
            />

            <InputField
              label={t("pregnant_form.address.municipality_label")}
              placeholder={t("pregnant_form.address.municipality_placeholder")}
              value={municipality}
              onChangeText={setMunicipality}
              leftIcon={<MapPin size={18} color="#64748B" />}
            />

            <View className="flex-row justify-between">
              <View className="w-[45%]">
                <InputField
                  label={t("pregnant_form.address.ward_label")}
                  placeholder={t("pregnant_form.address.ward_placeholder")}
                  keyboardType="numeric"
                  value={wardNo}
                  onChangeText={setWardNo}
                />
              </View>
              <View className="w-[50%]">
                <InputField
                  label={t("pregnant_form.address.village_label")}
                  placeholder={t("pregnant_form.address.village_placeholder")}
                  value={village}
                  onChangeText={setVillage}
                />
              </View>
            </View>
          </View>

          {/* Card 3: Pregnancy Details */}
          <View className="bg-white rounded-[32px] py-6 px-4 mb-6 border border-slate-100">
            <SectionHeader
              icon={Heart}
              title={t("pregnant_form.pregnancy.title")}
              subTitle={t("pregnant_form.pregnancy.subtitle")}
              color="bg-pink-500"
            />

            <InputField
              label={t("pregnant_form.pregnancy.gravida_label")}
              placeholder={t("pregnant_form.pregnancy.gravida_placeholder")}
              keyboardType="numeric"
              value={gravida}
              onChangeText={setGravida}
            />

            <Pressable onPress={() => setShowLmpPicker(true)}>
              <View pointerEvents="none">
                <InputField
                  label={t("pregnant_form.pregnancy.lmp_label")}
                  subLabel={t("pregnant_form.pregnancy.lmp_sub")}
                  placeholder="YYYY-MM-DD"
                  value={lmp}
                  leftIcon={<Calendar size={18} color="#64748B" />}
                  editable={false}
                />
              </View>
            </Pressable>

            {showLmpPicker && (
              <DateTimePicker
                value={lmp ? new Date(lmp) : new Date()}
                mode="date"
                display="spinner"
                onChange={onLmpChange}
              />
            )}

            <Pressable onPress={() => setShowEddPicker(true)}>
              <View pointerEvents="none">
                <InputField
                  label={t("pregnant_form.pregnancy.edd_label")}
                  subLabel={t("pregnant_form.pregnancy.edd_sub")}
                  placeholder="YYYY-MM-DD"
                  value={edd}
                  leftIcon={<Calendar size={18} color="#64748B" />}
                  editable={false}
                />
              </View>
            </Pressable>

            {showEddPicker && (
              <DateTimePicker
                value={edd ? new Date(edd) : new Date()}
                mode="date"
                display="spinner"
                onChange={onEddChange}
              />
            )}
          </View>

          {/* Card 4: Healthcare */}
          <View className="bg-white rounded-[32px] py-6 px-4 mb-6 border border-slate-100">
            <SectionHeader
              icon={Shield}
              title={t("pregnant_form.healthcare.title")}
              subTitle={t("pregnant_form.healthcare.subtitle")}
              color="bg-purple-500"
            />

            <InputField
              label={t("pregnant_form.healthcare.anc_label")}
              placeholder={t("pregnant_form.healthcare.anc_placeholder")}
              keyboardType="numeric"
              value={ancVisitCount}
              onChangeText={setAncVisitCount}
            />

            <SelectionGroup
              label={t("pregnant_form.healthcare.ifa_label")}
              subLabel={t("pregnant_form.healthcare.ifa_sub")}
              options={[
                { label: t("pregnant_form.options.yes"), value: "Yes" },
                { label: t("pregnant_form.options.no"), value: "No" },
              ]}
              selectedValue={ifaTabletReceived}
              onSelect={(val) => setIfaTabletReceived(val)}
            />

            <SelectionGroup
              label={t("pregnant_form.healthcare.tt_label")}
              subLabel={t("pregnant_form.healthcare.tt_sub")}
              options={[
                { label: t("pregnant_form.options.done"), value: "Completed" },
                {
                  label: t("pregnant_form.options.pending"),
                  value: "Incomplete",
                },
              ]}
              selectedValue={ttVaccinationStatus}
              onSelect={(val) => setTtVaccinationStatus(val)}
            />
          </View>

          {/* Card 5: Risk Signs */}
          <View className="bg-white rounded-[32px] py-6 px-4 mb-8 border border-slate-100">
            <SectionHeader
              icon={Activity}
              title={t("pregnant_form.risk.title")}
              subTitle={t("pregnant_form.risk.subtitle")}
              color="bg-orange-500"
            />

            <InputField
              label={t("pregnant_form.risk.signs_label")}
              placeholder={t("pregnant_form.risk.signs_placeholder")}
              multiline
              numberOfLines={4}
              value={riskSigns}
              onChangeText={setRiskSigns}
              leftIcon={<Activity size={18} color="#64748B" />}
              containerClassName="mb-0"
            />
          </View>

          <PrimaryButton
            title={t("pregnant_form.submit.title")}
            subTitle={t("pregnant_form.submit.subtitle")}
            onPress={handleSubmit}
            isLoading={isLoading}
            className="mb-10 shadow-lg shadow-blue-200"
          />
        </View>
      </ScrollView>
    </View>
  );
}
