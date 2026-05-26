import { X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { useToast } from '../../context/ToastContext';
import { FamilyPlanningStoreType, getFamilyPlanningByMother, saveFamilyPlanning } from '../../hooks/database/models/FamilyPlanningModel';
import ConfirmActionModal from '../common/ConfirmActionModal';
import FamilyPlanningModal from '../forms/FamilyPlanningModal';

interface FamilyPlanningSectionProps {
  motherId: string;
}

export default function FamilyPlanningSection({ motherId }: FamilyPlanningSectionProps) {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [record, setRecord] = useState<FamilyPlanningStoreType | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [methodToRemove, setMethodToRemove] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    try {
      const data = await getFamilyPlanningByMother(motherId);
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
      // Create a payload object starting with current values
      const payload: any = {
        mother_id: motherId,
        family_planning: record.family_planning,
        ocp_qty: record.ocp_qty,
        ecp_qty: record.ecp_qty,
        condom_qty: record.condom_qty,
      };

      // Reset the specific quantity and remove from methods string
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

  const hasItems = record && (record.ocp_qty > 0 || record.ecp_qty > 0 || record.condom_qty > 0);

  return (
    <View className="rounded-xl bg-white border border-gray-100 flex-row items-center justify-between p-4">
      {hasItems ? (
        <>
          <View className='flex-1 flex-col gap-3'>
            <View className="flex-row justify-between items-center">
              <Text className="text-slate-800 font-bold text-[14px] mb-2">{t("profile.birth_pnc.fp_used")}</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                className="px-4 py-2 bg-slate-50 rounded-md border border-slate-200"
              >
                <Text className="text-indigo-600 font-bold text-[12px] uppercase">{t("common.update")}</Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row flex-wrap gap-2">
              {record.ocp_qty > 0 && (
                <View className="bg-indigo-50 border border-indigo-100 pl-3 pr-2 py-1.5 rounded-full flex-row items-center">
                  <Text className="text-indigo-700 font-semibold text-[12px] mr-1">OCP: {record.ocp_qty}</Text>
                  <TouchableOpacity
                    onPress={() => handleDeleteMethod('OCP')}
                    className="p-0.5 hover:bg-indigo-100 rounded-full ml-1"
                  >
                    <X size={12} color="#4338ca" strokeWidth={3} />
                  </TouchableOpacity>
                </View>
              )}
              {record.ecp_qty > 0 && (
                <View className="bg-indigo-50 border border-indigo-100 pl-3 pr-2 py-1.5 rounded-full flex-row items-center">
                  <Text className="text-indigo-700 font-semibold text-[12px] mr-1">ECP: {record.ecp_qty}</Text>
                  <TouchableOpacity
                    onPress={() => handleDeleteMethod('ECP')}
                    className="p-0.5 hover:bg-indigo-100 rounded-full ml-1"
                  >
                    <X size={12} color="#4338ca" strokeWidth={3} />
                  </TouchableOpacity>
                </View>
              )}
              {record.condom_qty > 0 && (
                <View className="bg-indigo-50 border border-indigo-100 pl-3 pr-2 py-1.5 rounded-full flex-row items-center">
                  <Text className="text-indigo-700 font-semibold text-[12px] mr-1">Condom: {record.condom_qty}</Text>
                  <TouchableOpacity
                    onPress={() => handleDeleteMethod('Condoms')}
                    className="p-0.5 hover:bg-indigo-100 rounded-full ml-1"
                  >
                    <X size={12} color="#4338ca" strokeWidth={3} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

        </>
      ) : (
        <>
          <View className="flex-1">
            <Text className="font-semibold text-[13px]">{t("profile.birth_pnc.fp_used")}</Text>
          </View>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="px-4 py-2 bg-primary/80 rounded-md flex-row items-center"
          >
            <Text className="text-white font-bold text-[12px] uppercase">{t("common.add")}</Text>
          </TouchableOpacity>
        </>
      )}

      <FamilyPlanningModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        motherId={motherId}
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
