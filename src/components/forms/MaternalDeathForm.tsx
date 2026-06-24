import { Calendar } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Pressable,
  Text,
  TextInput,
  View
} from "react-native";
import { AdToBs, BsToAd, CalendarPicker } from "react-native-nepali-picker";
import { createMaternalDeath } from "../../hooks/database/models/MaternalDeathModel";
import { getAllMothersList, MotherListDbItem } from "../../hooks/database/models/MotherModel";
import { HmisRecordStoreType } from "../../hooks/database/types/hmisRecordModal";
import { MaternalDeathStoreType } from "../../hooks/database/types/maternalDeathModal";
import { Button } from "../button";
import { ProfilePicker } from "../ProfilePicker";

interface MaternalDeathFormProps {
  record?: HmisRecordStoreType;
  onSuccess: (updatedDeath: MaternalDeathStoreType) => void;
  showToast: (msg: string) => void;
}

export default function MaternalDeathForm({ record, onSuccess, showToast }: MaternalDeathFormProps) {
  const { t } = useTranslation();

  // Mothers list for standalone mode
  const [mothersList, setMothersList] = useState<MotherListDbItem[]>([]);
  const [selectedMotherId, setSelectedMotherId] = useState<string>('');
  const [loadingMothers, setLoadingMothers] = useState(false);

  // Form values
  const [deathCondition, setDeathCondition] = useState('');
  const [deathConditionOther, setDeathConditionOther] = useState('');
  const [deathPlace, setDeathPlace] = useState('');
  const [deathPlaceOther, setDeathPlaceOther] = useState('');
  const [childCondition, setChildCondition] = useState('');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [deathDay, setDeathDay] = useState(new Date().getDate());
  const [deathMonth, setDeathMonth] = useState(new Date().getMonth() + 1);
  const [deathYear, setDeathYear] = useState(new Date().getFullYear());

  const getAdString = (y: number, m: number, d: number) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const toNepali = (y: number, m: number, d: number) => {
    try { return AdToBs(getAdString(y, m, d)); } catch { return getAdString(y, m, d); }
  };

  // Inline errors
  const [errMother, setErrMother] = useState(false);
  const [errDeathCondition, setErrDeathCondition] = useState(false);
  const [errDeathConditionOther, setErrDeathConditionOther] = useState(false);
  const [errDeathPlace, setErrDeathPlace] = useState(false);
  const [errDeathPlaceOther, setErrDeathPlaceOther] = useState(false);
  const [errChildCondition, setErrChildCondition] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (!record) {
      const loadMothers = async () => {
        setLoadingMothers(true);
        try {
          const mList = await getAllMothersList();
          setMothersList(mList);
        } catch (error) {
          console.error("Failed to load mothers:", error);
        } finally {
          setLoadingMothers(false);
        }
      };
      loadMothers();
    }
  }, [record]);

  const motherOptions = useMemo(() => {
    return mothersList.map((m) => ({
      value: m.id,
      label: m.name || t("common.unnamed_mother", { defaultValue: "Unnamed Mother" })
    }));
  }, [mothersList, t]);

  const handleSaveMaternalDeath = async () => {
    let hasError = false;

    if (!record && !selectedMotherId) {
      setErrMother(true);
      hasError = true;
    } else {
      setErrMother(false);
    }

    if (!deathCondition) { setErrDeathCondition(true); hasError = true; } else { setErrDeathCondition(false); }
    if (deathCondition === 'Other' && !deathConditionOther.trim()) { setErrDeathConditionOther(true); hasError = true; } else { setErrDeathConditionOther(false); }
    if (!deathPlace) { setErrDeathPlace(true); hasError = true; } else { setErrDeathPlace(false); }
    if (deathPlace === 'Other' && !deathPlaceOther.trim()) { setErrDeathPlaceOther(true); hasError = true; } else { setErrDeathPlaceOther(false); }
    if (!childCondition) { setErrChildCondition(true); hasError = true; } else { setErrChildCondition(false); }

    if (hasError) return;

    try {
      setSubmitting(true);
      let payloadRecord: any;

      if (record) {
        payloadRecord = {
          mother: record.id,
          serial_no: record.serial_no,
          mother_name: record.mother_name,
          mother_age: record.mother_age,
        };
      } else {
        const selectedMother = mothersList.find(m => m.id === selectedMotherId);
        payloadRecord = {
          mother: selectedMother?.id,
          serial_no: selectedMother?.code,
          mother_name: selectedMother?.name,
          mother_age: selectedMother?.age,
        };
      }

      const payload = {
        ...payloadRecord,
        death_condition: deathCondition,
        death_condition_other: deathConditionOther,
        death_place: deathPlace,
        death_place_other: deathPlaceOther,
        child_condition: childCondition,
        death_day: deathDay,
        death_month: deathMonth,
        death_year: deathYear,
        remarks: remarks,
      } as any;

      const savedRecord = await createMaternalDeath(payload);
      showToast(t("maternal_death_modal.success"));

      // Reset form fields
      if (!record) setSelectedMotherId('');
      setDeathCondition('');
      setDeathConditionOther('');
      setDeathPlace('');
      setDeathPlaceOther('');
      setChildCondition('');
      setDeathDay(new Date().getDate());
      setDeathMonth(new Date().getMonth() + 1);
      setDeathYear(new Date().getFullYear());
      setRemarks('');

      // Reset errors
      setErrMother(false);
      setErrDeathCondition(false);
      setErrDeathConditionOther(false);
      setErrDeathPlace(false);
      setErrDeathPlaceOther(false);
      setErrChildCondition(false);

      onSuccess(savedRecord);
    } catch (error) {
      console.error(error);
      Alert.alert(t("maternal_death_modal.error_title"), t("maternal_death_modal.error"));
    } finally {
      setSubmitting(false);
    }
  };

  // Helper: renders a field label row
  const FieldLabel = ({ label, hasError, required = true }: { label: string; hasError: boolean; required?: boolean }) => (
    <View className="flex-row items-center mb-2.5">
      <Text className="text-[16px] text-slate-700 font-semibold">{label}</Text>
      {required && <Text className="text-red-500 ml-1">*</Text>}
    </View>
  );

  return (
    <View className="flex-1 bg-white pt-2">
      <View className="gap-y-6 pb-32">

        {/* Mother Selection */}
        {!record && (
          <View>
            <ProfilePicker
              label={t("maternal_death_modal.choose_mother")}
              placeholder={
                loadingMothers
                  ? t("common.loading")
                  : t("maternal_death_modal.choose_mother_placeholder")
              }
              selectedValue={selectedMotherId}
              onValueChange={(val) => { setSelectedMotherId(val); setErrMother(false); }}
              options={motherOptions}
              error={errMother ? t("maternal_death_modal.mother_error") : ''}
              isSearchable
              required
            />
          </View>
        )}

        {/* Death Date */}
        <View className="-mt-5">
          <FieldLabel label={t("maternal_death_modal.date_of_death")} hasError={false} />
          <Pressable
            onPress={() => setShowDatePicker(true)}
            className="bg-white border border-slate-200 px-4 py-2 rounded-xl flex-row items-center justify-between active:bg-slate-50"
          >
            <Text className="text-slate-800 text-[15px] font-semibold">
              {toNepali(deathYear, deathMonth, deathDay)}
            </Text>
            <View className="bg-rose-50 p-2 rounded-full">
              <Calendar size={18} color="#E11D48" />
            </View>
          </Pressable>
          <CalendarPicker
            visible={showDatePicker}
            onClose={() => setShowDatePicker(false)}
            onDateSelect={(bsDate) => {
              setShowDatePicker(false);
              try {
                const adDate = BsToAd(bsDate);
                const parts = adDate.split('-');
                setDeathYear(parseInt(parts[0], 10));
                setDeathMonth(parseInt(parts[1], 10));
                setDeathDay(parseInt(parts[2], 10));
              } catch (e) { console.error(e); }
            }}
            language="np"
            theme="light"
            brandColor="#E11D48"
            date={toNepali(deathYear, deathMonth, deathDay)}
          />
        </View>

        {/* Condition of Death */}
        <View>
          <FieldLabel label={t("maternal_death_modal.condition_of_death")} hasError={errDeathCondition} />
          <View className="flex-row gap-2 flex-wrap mt-1">
            {[
              { value: 'Pregnant', label: t("maternal_death_modal.pregnant") },
              { value: 'Labor', label: t("maternal_death_modal.labor") },
              { value: 'Post_delivery', label: t("maternal_death_modal.postpartum") }
            ].map((c) => (
              <Pressable
                key={c.value}
                onPress={() => { setDeathCondition(c.value); setErrDeathCondition(false); }}
                className={`py-3.5 px-3 rounded-xl border flex-row items-center justify-center ${deathCondition === c.value
                  ? 'bg-slate-50 border-[#475569]'
                  : errDeathCondition ? 'bg-red-50 border-red-300' : 'bg-white border-slate-200'
                  }`}
              >
                <View className={`w-5 h-5 rounded-full border-2 items-center justify-center mr-2.5 ${deathCondition === c.value ? 'border-[#475569]' : errDeathCondition ? 'border-red-300' : 'border-slate-300'
                  }`}>
                  {deathCondition === c.value && <View className="w-2.5 h-2.5 rounded-full bg-[#475569]" />}
                </View>
                <Text className={`text-[14px] font-semibold ${deathCondition === c.value ? 'text-[#475569]' : 'text-slate-600'
                  }`}>{c.label}</Text>
              </Pressable>
            ))}
          </View>
          {errDeathCondition && (
            <Text className="text-red-500 text-[12px] mt-1.5 ml-1">
              {t("maternal_death_modal.condition_error")}
            </Text>
          )}
        </View>

        {/* Place of Death */}
        <View>
          <FieldLabel label={t("maternal_death_modal.place_of_death")} hasError={errDeathPlace} />
          <View className="flex-row flex-wrap gap-3 mt-1">
            {[
              { value: 'Home', label: t("maternal_death_modal.home") },
              { value: 'Institution', label: t("maternal_death_modal.institution") },
              { value: 'Other', label: t("maternal_death_modal.other") }
            ].map((c) => (
              <Pressable
                key={c.value}
                onPress={() => { setDeathPlace(c.value); setErrDeathPlace(false); }}
                className={`flex-1 min-w-[30%] py-3.5 px-3 rounded-xl border flex-row items-center justify-center ${deathPlace === c.value
                  ? 'bg-slate-50 border-[#475569]'
                  : errDeathPlace ? 'bg-red-50 border-red-300' : 'bg-white border-slate-200'
                  }`}
              >
                <View className={`w-5 h-5 rounded-full border-2 items-center justify-center mr-2.5 ${deathPlace === c.value ? 'border-[#475569]' : errDeathPlace ? 'border-red-300' : 'border-slate-300'
                  }`}>
                  {deathPlace === c.value && <View className="w-2.5 h-2.5 rounded-full bg-[#475569]" />}
                </View>
                <Text className={`text-[14px] font-semibold ${deathPlace === c.value ? 'text-[#475569]' : 'text-slate-600'
                  }`}>{c.label}</Text>
              </Pressable>
            ))}
          </View>
          {deathPlace === 'Other' && (
            <View className="mt-3">
              <TextInput
                placeholder={t("maternal_death_modal.specify_place")}
                className={`bg-white border p-4 rounded-xl text-slate-800 text-[15px] ${errDeathPlaceOther ? 'border-red-400' : 'border-slate-200'
                  }`}
                onChangeText={(v) => { setDeathPlaceOther(v); if (v.trim()) setErrDeathPlaceOther(false); }}
                value={deathPlaceOther}
              />
              {errDeathPlaceOther && (
                <Text className="text-red-500 text-[12px] mt-1.5 ml-1">
                  {t("maternal_death_modal.specify_place_error")}
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Child Condition */}
        <View>
          <FieldLabel label={t("maternal_death_modal.child_condition")} hasError={errChildCondition} />
          <View className="flex-row gap-3 mt-1">
            {[
              { value: 'Alive', label: t("maternal_death_modal.child_alive") },
              { value: 'Dead', label: t("maternal_death_modal.child_dead") }
            ].map((c) => (
              <Pressable
                key={c.value}
                onPress={() => { setChildCondition(c.value); setErrChildCondition(false); }}
                className={`flex-1 py-3.5 px-4 rounded-xl border flex-row items-center justify-center ${childCondition === c.value
                  ? 'bg-slate-50 border-[#475569]'
                  : errChildCondition ? 'bg-red-50 border-red-300' : 'bg-white border-slate-200'
                  }`}
              >
                <View className={`w-5 h-5 rounded-full border-2 items-center justify-center mr-2.5 ${childCondition === c.value ? 'border-[#475569]' : errChildCondition ? 'border-red-300' : 'border-slate-300'
                  }`}>
                  {childCondition === c.value && <View className="w-2.5 h-2.5 rounded-full bg-[#475569]" />}
                </View>
                <Text className={`text-[14px] font-semibold ${childCondition === c.value ? 'text-[#475569]' : 'text-slate-600'
                  }`}>{c.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Remarks */}
        <View>
          <FieldLabel label={t("maternal_death_modal.remarks")} hasError={false} required={false} />
          <TextInput
            placeholder={t("maternal_death_modal.remarks_placeholder")}
            className="bg-white border border-slate-200 p-4 rounded-xl text-slate-800 min-h-[100px] text-[15px] leading-5"
            multiline
            placeholderTextColor="#94A3B8"
            textAlignVertical="top"
            onChangeText={setRemarks}
            value={remarks}
          />
        </View>

        {/* Submit */}
        <View className="pt-2">
          <Button
            onPress={handleSaveMaternalDeath}
            isLoading={submitting}
            title={t("maternal_death_modal.save")}
          />
        </View>

      </View>
    </View>
  );
}
