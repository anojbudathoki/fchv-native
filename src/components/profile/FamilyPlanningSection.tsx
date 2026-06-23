import { ClipboardList, Heart, Plus, Shield, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { useToast } from '../../context/ToastContext';
import { FamilyPlanningStoreType, getFamilyPlanningByMother, saveFamilyPlanning } from '../../hooks/database/models/FamilyPlanningModel';
import { getPregnancyByMotherId } from '../../hooks/database/models/PregnantWomenModal';
import ConfirmActionModal from '../common/ConfirmActionModal';
import FamilyPlanningModal from '../forms/FamilyPlanningModal';

interface FamilyPlanningSectionProps {
  motherId: string;
  disabled?: boolean;
}

const METHODS_CONFIG: Record<string, { label: string; icon: any; bg: string; border: string; text: string; dot: string }> = {
  OCP: {
    label: 'OCP',
    icon: Heart,
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
    text: 'text-indigo-700',
    dot: 'bg-indigo-400',
  },
  ECP: {
    label: 'ECP',
    icon: Shield,
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    text: 'text-amber-700',
    dot: 'bg-amber-400',
  },
  Condoms: {
    label: 'Condoms',
    icon: ClipboardList,
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    text: 'text-emerald-700',
    dot: 'bg-emerald-400',
  },
};

export default function FamilyPlanningSection({ motherId, disabled }: FamilyPlanningSectionProps) {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [record, setRecord] = useState<FamilyPlanningStoreType | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPregnancyId, setCurrentPregnancyId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [methodToRemove, setMethodToRemove] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    try {
      const pregnancy = await getPregnancyByMotherId(motherId);
      const pregId = pregnancy?.id || null;
      setCurrentPregnancyId(pregId);

      const data = await getFamilyPlanningByMother(motherId, pregId);
      setRecord(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMethod = (methodToDelete: string) => {
    setMethodToRemove(methodToDelete);
    setConfirmVisible(true);
  };

  const executeDelete = async () => {
    if (!record || !methodToRemove) return;

    try {
      setIsDeleting(true);
      const payload: any = {
        mother: motherId,
        pregnancy_id: currentPregnancyId,
        family_planning: record.family_planning,
        ocp_qty: record.ocp_qty,
        ecp_qty: record.ecp_qty,
        condom_qty: record.condom_qty,
      };

      const methods = record.family_planning.split(', ');
      const updatedMethods = methods.filter(m => m !== methodToRemove);
      payload.family_planning = updatedMethods.length > 0 ? updatedMethods.join(', ') : 'None';

      if (methodToRemove === 'OCP') payload.ocp_qty = 0;
      if (methodToRemove === 'ECP') payload.ecp_qty = 0;
      if (methodToRemove === 'Condoms') payload.condom_qty = 0;

      await saveFamilyPlanning(payload);

      showToast(t("family_planning.save_success"));
      setConfirmVisible(false);
      setMethodToRemove(null);
      loadData();
    } catch (e) {
      console.error(e);
      showToast(t("family_planning.save_error"));
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [motherId]);

  const methodEntries = [
    { key: 'OCP', qty: record?.ocp_qty || 0 },
    { key: 'ECP', qty: record?.ecp_qty || 0 },
    { key: 'Condoms', qty: record?.condom_qty || 0 },
  ];
  const hasItems = methodEntries.some(m => m.qty > 0);

  const renderMethodCard = (methodKey: string, qty: number) => {
    if (qty <= 0) return null;
    const config = METHODS_CONFIG[methodKey];
    const Icon = config.icon;

    return (
      <View key={methodKey} className={`${config.bg} ${config.border} border rounded-xl p-3.5 flex-row items-center`}>
        <View className={`w-9 h-9 rounded-lg ${config.bg} border ${config.border} items-center justify-center mr-3`}>
          <Icon size={16} color={config.text.includes('indigo') ? '#6366F1' : config.text.includes('amber') ? '#D97706' : '#059669'} />
        </View>
        <View className="flex-1">
          <Text className={`${config.text} font-bold text-[13px]`}>
            {methodKey === 'Condoms' ? 'Condoms' : methodKey}
          </Text>
          <View className="flex-row items-center mt-0.5">
            <View className={`w-1.5 h-1.5 rounded-full ${config.dot} mr-1.5`} />
            <Text className="text-slate-500 text-[12px] font-medium">
              Quantity: {qty}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => handleDeleteMethod(methodKey)}
          disabled={disabled}
          className={`w-7 h-7 rounded-full items-center justify-center ${disabled ? '' : config.bg}`}
        >
          <X size={13} color={disabled ? "#CBD5E1" : "#64748B"} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View>
      {hasItems ? (
        <View className="gap-y-3">
          {methodEntries.map(m => renderMethodCard(m.key, m.qty))}

          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            disabled={disabled}
            className={`flex-row items-center justify-center py-3 rounded-xl border-2 border-dashed ${disabled ? 'border-slate-200' : 'border-slate-300 bg-slate-50/50'}`}
          >
            <Plus size={16} color={disabled ? "#CBD5E1" : "#475569"} strokeWidth={3} />
            <Text className={`font-semibold text-sm ml-2 ${disabled ? 'text-slate-300' : 'text-slate-700'}`}>
              {t("common.update")}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="items-center py-3">
          <View className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 items-center justify-center mb-3">
            <ClipboardList size={24} color="#94A3B8" strokeWidth={1.5} />
          </View>
          <Text className="text-slate-500 text-[15px] font-medium text-center">
            {t("profile.birth_pnc.fp_used")}
          </Text>
          <Text className="text-slate-400 text-[13px] mt-1 text-center">
            {t("family_planning.not_addet_yet")}
          </Text>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            disabled={disabled}
            className={`mt-4 flex-row items-center px-5 py-2.5 rounded-full ${disabled ? 'bg-slate-100' : 'bg-slate-700'}`}
          >
            <Plus size={16} color={disabled ? "#CBD5E1" : "white"} strokeWidth={3} />
            <Text className={`font-semibold text-sm ml-2 ${disabled ? 'text-slate-300' : 'text-white'}`}>
              {t("common.add")}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <FamilyPlanningModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        motherId={motherId}
        pregnancyId={currentPregnancyId}
        onSuccess={loadData}
        showToast={showToast}
        existingRecord={record}
      />

      <ConfirmActionModal
        visible={confirmVisible}
        onClose={() => {
          setConfirmVisible(false);
          setMethodToRemove(null);
        }}
        title={t("family_planning.remove_confirm_title")}
        description={t("family_planning.remove_confirm_msg")}
        actionLabel={t("common.delete")}
        onAction={executeDelete}
        loading={isDeleting}
      />
    </View>
  );
}
