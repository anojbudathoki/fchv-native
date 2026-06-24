import CustomHeader from "@/components/CustomHeader";
import { FieldLabel } from "@/components/FormElements";
import { ProfilePicker } from "@/components/ProfilePicker";
import TextArea from "@/components/TextArea";
import { Button } from "@/components/button";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";
import { createAncVisit } from "@/hooks/database/models/AncVisitModel";
import { getAllMothersList, getMotherProfile, MotherListDbItem } from "@/hooks/database/models/MotherModel";
import { getPregnantWomenList } from "@/hooks/database/models/PregnantWomenModal";
import { createVisit } from "@/hooks/database/models/VisitModel";
import { toNepaliNumbers } from "@/utils/dateHelper";
import { useRouter } from "expo-router";
import { Calendar, Check, ChevronDown } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { AdToBs, BsToAd, CalendarPicker } from "react-native-nepali-picker";
import { SafeAreaView } from "react-native-safe-area-context";

const ObservationItem = ({
  checked,
  onToggle,
  label,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onToggle}
    className={`flex-row items-center py-3 px-4 rounded-xl mb-1.5 border ${checked
      ? "bg-blue-50/70 border-blue-200"
      : "bg-white border-slate-100"
      }`}
  >
    <View
      className={`w-6 h-6 rounded-md border-2 mr-3.5 items-center justify-center ${checked ? "bg-[#2563eb] border-[#2563eb]" : "border-slate-300 bg-white"
        }`}
    >
      {checked && <Check color="#fff" strokeWidth={3} size={15} />}
    </View>
    <Text
      className={`text-[15px] flex-1 leading-5 ${checked ? "text-slate-800 font-semibold" : "text-slate-600 font-normal"
        }`}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

export default function VisitScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const { t, language } = useLanguage();

  const [mothers, setMothers] = useState<MotherListDbItem[]>([]);
  const [pregnantMotherIds, setPregnantMotherIds] = useState<Set<string>>(new Set());
  const [selectedMotherId, setSelectedMotherId] = useState("");
  const [selectedMotherDetails, setSelectedMotherDetails] = useState<any>(null);

  const [visitDateBs, setVisitDateBs] = useState("");
  const [visitDateAd, setVisitDateAd] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [visitType, setVisitType] = useState<"ANC" | "PNC" | "OTHER">("ANC");
  const [address, setAddress] = useState("");

  // Observations (Checkboxes)
  const [pregnancyInfo, setPregnancyInfo] = useState(false);
  const [dangerSigns, setDangerSigns] = useState(false);
  const [ironTablets, setIronTablets] = useState(false);
  const [deliveryCounseling, setDeliveryCounseling] = useState(false);
  const [referred, setReferred] = useState(false);

  // Health Facility dropdown (visible if referred is checked)
  const [healthFacility, setHealthFacility] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allMothers, pregnantWomen] = await Promise.all([
          getAllMothersList(),
          getPregnantWomenList(),
        ]);
        setMothers(allMothers);

        const pregIds = new Set(pregnantWomen.map((p) => p.mother));
        setPregnantMotherIds(pregIds);

        // Set default date to today's Nepali date
        const todayAd = new Date().toISOString().split("T")[0];
        try {
          const todayBs = AdToBs(todayAd);
          setVisitDateBs(todayBs);
          setVisitDateAd(todayAd);
        } catch (e) {
          console.error("Error setting initial Nepali date", e);
        }
      } catch (err) {
        console.error("Error loading visits data:", err);
      }
    };
    fetchData();
  }, []);

  // Handle Mother selection changes
  useEffect(() => {
    if (!selectedMotherId) {
      setSelectedMotherDetails(null);
      setAddress("");
      return;
    }

    const fetchMotherDetails = async () => {
      try {
        const details = await getMotherProfile(selectedMotherId);
        if (details) {
          setSelectedMotherDetails(details);
          // Format address nicely
          const locality = details.addressLocality || "";
          const ward = details.addressWard || "";
          const municipality = details.addressMunicipality || "";
          const formattedAddress = [
            municipality,
            ward ? `${t("visit.address_ward_short", { defaultValue: "Ward" })}: ${ward}` : "",
            locality ? `${t("visit.address_locality_short", { defaultValue: "Locality" })}: ${locality}` : "",
          ]
            .filter(Boolean)
            .join(", ");
          setAddress(formattedAddress);
        }
      } catch (e) {
        console.error("Failed to load mother details:", e);
      }
    };
    fetchMotherDetails();
  }, [selectedMotherId, t]);

  const handleDateSelect = (bsDate: string) => {
    setShowDatePicker(false);
    setVisitDateBs(bsDate);
    if (errors.visitDate) setErrors({ ...errors, visitDate: "" });
    try {
      const adDate = BsToAd(bsDate);
      setVisitDateAd(adDate);
    } catch (e) {
      console.error("BS to AD conversion error:", e);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!visitDateBs) {
      errs.visitDate = t("visit.validation.date_required", { defaultValue: "Visit date is required" });
    }
    if (!selectedMotherId) {
      errs.motherId = t("visit.validation.mother_required", { defaultValue: "Service recipient is required" });
    }
    if (referred && !healthFacility) {
      errs.healthFacility = t("visit.validation.facility_required", { defaultValue: "Health institution is required when referred" });
    }
    return errs;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsLoading(true);
    try {
      // Serialize observations, address, and facility details into the visit_place text field
      const serializedPlace = JSON.stringify({
        address,
        observations: {
          pregnancyInfo,
          dangerSigns,
          ironTablets,
          deliveryCounseling,
          referred,
        },
        healthFacility: referred ? healthFacility : "",
        remarks,
      });

      // Save visit
      if (visitType === "ANC" || visitType === "OTHER") {
        await createAncVisit({
          mother: selectedMotherId,
          name: selectedMotherDetails?.name || null,
          visit_date: visitDateBs,
          visit_place: serializedPlace,
        });
      } else {
        await createVisit({
          mother: selectedMotherId,
          name: selectedMotherDetails?.name || null,
          visit_date: visitDateBs,
          visit_type: "PNC",
          visit_place: serializedPlace,
        });
      }

      showToast(t("visit.messages.save_success", { defaultValue: "Visit saved successfully" }));
      router.back();
    } catch (e) {
      console.error("Failed to save visit:", e);
      Alert.alert(
        t("child_form.validation.error", { defaultValue: "Error" }),
        t("visit.messages.save_failed", { defaultValue: "Failed to save visit." })
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Format recipient option labels: e.g. "Sita Thapa (26 years), Pregnant"
  const recipientOptions = mothers
    .filter((m) => !m.is_dead)
    .map((m) => {
      const isPregnant = pregnantMotherIds.has(m.id);
      const pregnantLabel = isPregnant ? `, ${t("pregnancy_form.gravida_help", { defaultValue: "Pregnant" })}` : "";
      const label = `${m.name} (${m.age} ${language === "np" ? "वर्ष" : "years"})${pregnantLabel}`;
      return {
        label,
        value: m.id,
      };
    });

  // Visit Type Dropdown Options
  const visitTypeOptions = [
    { label: t("visit.types.anc", { defaultValue: "Pregnant Woman - Regular Visit (ANC)" }), value: "ANC" },
    { label: t("visit.types.pnc", { defaultValue: "Postnatal Mother - Regular Visit (PNC)" }), value: "PNC" },
    { label: t("visit.types.other", { defaultValue: "Other Visit" }), value: "OTHER" },
  ];

  // Health Facility Options
  const healthFacilityOptions = [
    { label: t("visit.facilities.chhatrabas", { defaultValue: "Chhatrabas Health Post" }), value: "chhatrabas" },
    { label: t("visit.facilities.phc", { defaultValue: "Primary Health Center" }), value: "phc" },
    { label: t("visit.facilities.district_hospital", { defaultValue: "District Hospital" }), value: "district_hospital" },
    { label: t("visit.facilities.zonal_hospital", { defaultValue: "Zonal Hospital" }), value: "zonal_hospital" },
  ];

  const displayDate = language === "np" ? toNepaliNumbers(visitDateBs) : visitDateBs;

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" className="bg-white" />
      <CustomHeader
        title={t("visit.title", { defaultValue: "Visit Registration" })}
        onBackPress={() => router.back()}
      />
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* <View className="px-4 pt-5 gap-y-5"> */}
        {/* Visit Information Section */}
        <View className="bg-white px-5 pt-5 pb-5 rounded-2xl border border-slate-100 shadow-sm">
          <View className="flex-row items-center mb-5">
            <View className="w-7 h-7 rounded-full bg-blue-100 items-center justify-center mr-3">
              <Calendar size={14} color="#2563eb" strokeWidth={2.5} />
            </View>
            <Text className="text-slate-800 font-bold text-[17px]">
              {t("visit.section_visit_info", { defaultValue: "Visit Information" })}
            </Text>
          </View>

          {/* Visit Date */}
          <FieldLabel
            label={t("visit.date", { defaultValue: "Visit Date (B.S.)" })}
            required
          />
          <Pressable onPress={() => setShowDatePicker(true)} className="mb-4">
            <View
              className={`h-14 flex-row items-center rounded-xl px-4 border ${errors.visitDate ? "border-rose-400 bg-rose-50" : "border-slate-200 bg-white"
                }`}
            >
              <Text className={`flex-1 text-[16px] ${visitDateBs ? "text-slate-800" : "text-slate-400"}`}>
                {visitDateBs ? displayDate : t("child_form.select_date", { defaultValue: "Select Date" })}
              </Text>
              <ChevronDown size={18} color="#94a3b8" />
            </View>
            {errors.visitDate ? (
              <Text className="text-rose-500 text-xs mt-1.5 ml-1 font-semibold">{errors.visitDate}</Text>
            ) : null}
          </Pressable>

          <CalendarPicker
            visible={showDatePicker}
            onClose={() => setShowDatePicker(false)}
            onDateSelect={handleDateSelect}
            language={language === "en" ? "en" : "np"}
            theme="light"
            brandColor="#2563eb"
            date={visitDateBs || undefined}
            dayTextStyle={{ fontWeight: "normal" }}
            weekTextStyle={{ fontWeight: "normal" }}
            titleTextStyle={{ fontWeight: "normal" }}
          />

          {/* Visit Type */}
          <FieldLabel
            label={t("visit.type", { defaultValue: "Visit Type" })}
          />
          <ProfilePicker
            placeholder={t("visit.type", { defaultValue: "Visit Type" })}
            options={visitTypeOptions}
            selectedValue={visitType}
            onValueChange={(val: any) => setVisitType(val)}
          />
          {/* Service Recipient Section */}
          <View className="mt-6 pt-6 border-t border-slate-100">
            <View className="flex-row items-center mb-5">
              <View className="w-7 h-7 rounded-full bg-emerald-100 items-center justify-center mr-3">
                <Check size={14} color="#059669" strokeWidth={3} />
              </View>
              <Text className="text-slate-800 font-bold text-[17px]">
                {t("visit.section_recipient", { defaultValue: "Recipient Details" })}
              </Text>
            </View>

            {/* Service Recipient */}
            <FieldLabel
              label={t("visit.recipient", { defaultValue: "Service Recipient" })}
              required
            />
            <ProfilePicker
              placeholder={t("visit.recipient_placeholder", { defaultValue: "Choose Service Recipient" })}
              options={recipientOptions}
              selectedValue={selectedMotherId}
              onValueChange={(val: string) => {
                setSelectedMotherId(val);
                if (errors.motherId) setErrors({ ...errors, motherId: "" });
              }}
              error={errors.motherId}
              isSearchable={true}
            />

            {/* Address */}
            <View className="mt-4">
              <FieldLabel
                label={t("visit.address", { defaultValue: "Address" })}
              />
              <View className="h-14 rounded-xl px-4 border border-slate-200 bg-slate-50 justify-center">
                <Text className="text-slate-600 text-[16px]" numberOfLines={1}>
                  {address || t("visit.no_address", { defaultValue: "No address available" })}
                </Text>
              </View>
            </View>
          </View>
          {/* Observations & Services Section */}
          <View className="mt-6 pt-6 border-t border-slate-100">
            <View className="flex-row items-center mb-4">
              <View className="w-7 h-7 rounded-full bg-violet-100 items-center justify-center mr-3">
                <Check size={14} color="#7c3aed" strokeWidth={3} />
              </View>
              <Text className="text-slate-800 font-bold text-[17px]">
                {t("visit.observations", { defaultValue: "Observations & Services" })}
              </Text>
            </View>

            <View className="gap-y-1">
              <ObservationItem
                checked={pregnancyInfo}
                onToggle={() => setPregnancyInfo(!pregnancyInfo)}
                label={t("visit.obs.pregnancy_info", { defaultValue: "Took information about pregnancy status" })}
              />
              <ObservationItem
                checked={dangerSigns}
                onToggle={() => setDangerSigns(!dangerSigns)}
                label={t("visit.obs.danger_signs", { defaultValue: "Counseled on danger signs" })}
              />
              <ObservationItem
                checked={ironTablets}
                onToggle={() => setIronTablets(!ironTablets)}
                label={t("visit.obs.iron_tablets", { defaultValue: "Taking iron tablets" })}
              />
              <ObservationItem
                checked={deliveryCounseling}
                onToggle={() => setDeliveryCounseling(!deliveryCounseling)}
                label={t("visit.obs.delivery_counseling", { defaultValue: "Counseled for institutional delivery" })}
              />
              <ObservationItem
                checked={referred}
                onToggle={() => {
                  setReferred(!referred);
                  if (errors.healthFacility) setErrors({ ...errors, healthFacility: "" });
                }}
                label={t("visit.obs.referred", { defaultValue: "Referred" })}
              />
            </View>

            {/* Health Facility (Conditional) */}
            {referred && (
              <View className="mt-5 pt-4 border-t border-slate-100">
                <FieldLabel
                  label={t("visit.health_facility", { defaultValue: "Health Institution" })}
                  required
                />
                <ProfilePicker
                  placeholder={t("visit.health_facility_placeholder", { defaultValue: "Select Health Institution" })}
                  options={healthFacilityOptions}
                  selectedValue={healthFacility}
                  onValueChange={(val: string) => {
                    setHealthFacility(val);
                    if (errors.healthFacility) setErrors({ ...errors, healthFacility: "" });
                  }}
                  error={errors.healthFacility}
                />
              </View>
            )}

            {/* Remarks Section */}
            <View className="mt-6 pt-6 border-t border-slate-100">
              <View className="flex-row items-center mb-4">
                <View className="w-7 h-7 rounded-full bg-amber-100 items-center justify-center mr-3">
                  <Check size={14} color="#d97706" strokeWidth={3} />
                </View>
                <Text className="text-slate-800 font-bold text-[17px]">
                  {t("visit.section_notes", { defaultValue: "Notes" })}
                </Text>
              </View>
              <TextArea
                label={t("visit.remarks", { defaultValue: "Remarks" })}
                placeholder={t("visit.remarks_placeholder", { defaultValue: "Write here..." })}
                value={remarks}
                onChangeText={setRemarks}
                numberOfLines={4}
              />
            </View>
          </View>

          {/* Save Button */}
          <View className="px-1 pb-2">
            <Button
              onPress={handleSave}
              isLoading={isLoading}
              title={t("visit.save", { defaultValue: "Save Visit" })}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
