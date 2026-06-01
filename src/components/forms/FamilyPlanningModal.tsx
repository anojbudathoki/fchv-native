import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Pressable, ScrollView } from 'react-native';
import { X, Plus, Minus } from 'lucide-react-native';
import { saveFamilyPlanning } from '../../hooks/database/models/FamilyPlanningModel';
import ModalWithSafeArea from '../common/ModalWithSafeArea';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/context/LanguageContext';

interface FamilyPlanningModalProps {
  visible: boolean;
  onClose: () => void;
  motherId: string;
  onSuccess: () => void;
  showToast: (msg: string) => void;
  existingRecord?: any; // To pass the full record instead of just the string
}

export default function FamilyPlanningModal({
  visible,
  onClose,
  motherId,
  onSuccess,
  showToast,
  existingRecord
}: FamilyPlanningModalProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  
  const [ocpQty, setOcpQty] = useState(0);
  const [ecpQty, setEcpQty] = useState(0);
  const [condomQty, setCondomQty] = useState(0);

  useEffect(() => {
    if (visible) {
      if (existingRecord) {
        setOcpQty(existingRecord.ocp_qty || 0);
        setEcpQty(existingRecord.ecp_qty || 0);
        setCondomQty(existingRecord.condom_qty || 0);
      } else {
        setOcpQty(0);
        setEcpQty(0);
        setCondomQty(0);
      }
      setLoading(false);
    }
  }, [visible, existingRecord]);

  const handleSave = async () => {
    setLoading(true);
    try {
      let finalMethodsArr = [];
      if (ocpQty > 0) finalMethodsArr.push("OCP");
      if (ecpQty > 0) finalMethodsArr.push("ECP");
      if (condomQty > 0) finalMethodsArr.push("Condoms");
      
      const finalMethods = finalMethodsArr.length > 0 ? finalMethodsArr.join(', ') : 'None';
      
      await saveFamilyPlanning({
        mother_id: motherId,
        family_planning: finalMethods,
        ocp_qty: ocpQty,
        ecp_qty: ecpQty,
        condom_qty: condomQty
      });
      
      showToast(t("profile.alerts.save_success") || t("family_planning.save_success") || "Saved successfully");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      showToast(t("profile.alerts.save_error") || t("family_planning.save_error") || "Error saving");
    } finally {
      setLoading(false);
    }
  };

  const isNepali = language === 'np';

  return (
    <ModalWithSafeArea visible={visible} onRequestClose={onClose} animationType="slide" transparent>
      <Pressable 
        onPress={onClose}
        className="flex-1 bg-black/50 justify-end"
      >
        <Pressable onPress={(e) => e.stopPropagation()} className="bg-white w-full rounded-t-3xl p-6 shadow-xl pb-10">
          
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-semibold text-slate-800">
              {isNepali ? 'परिवार नियोजन साधन थप्नुहोस्' : 'Add Family Planning Method'}
            </Text>
            <TouchableOpacity onPress={onClose} className="p-2 bg-slate-100 rounded-full">
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
            {/* Pills Section */}
            <View className="mb-6">
              <Text className="text-slate-800 font-medium` text-[16px] mb-3">
                {isNepali ? 'चक्कीहरू (Pills)' : 'Pills'}
              </Text>
              
              {/* OCP */}
              <View className="flex-row justify-between items-center bg-white border border-slate-200 p-3 rounded-xl mb-3">
                <Text className="text-slate-600 text-[15px] font-medium">
                  {isNepali ? 'OCP (नियमित पिल्स)' : 'OCP (Regular Pills)'}
                </Text>
                <View className="flex-row items-center gap-4">
                  <TouchableOpacity 
                    onPress={() => setOcpQty(Math.max(0, ocpQty - 1))}
                    className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center"
                  >
                    <Minus size={16} color="#64748B" />
                  </TouchableOpacity>
                  <Text className="font-medium text-slate-700 w-4 text-center">{ocpQty}</Text>
                  <TouchableOpacity 
                    onPress={() => {
                      setOcpQty(ocpQty + 1);
                      // Ensure mutually exclusive
                      setEcpQty(0);
                    }}
                    className="w-8 h-8 rounded-full bg-blue-500 items-center justify-center"
                  >
                    <Plus size={16} color="white" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* ECP */}
              <View className="flex-row justify-between items-center bg-white border border-slate-200 p-3 rounded-xl">
                <Text className="text-slate-600 text-[15px] font-medium">
                  {isNepali ? 'ECP (आकस्मिक पिल्स)' : 'ECP (Emergency Pills)'}
                </Text>
                <View className="flex-row items-center gap-4">
                  <TouchableOpacity 
                    onPress={() => setEcpQty(Math.max(0, ecpQty - 1))}
                    className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center"
                  >
                    <Minus size={16} color="#64748B" />
                  </TouchableOpacity>
                  <Text className="font-medium text-slate-700 w-4 text-center">{ecpQty}</Text>
                  <TouchableOpacity 
                    onPress={() => {
                      setEcpQty(ecpQty + 1);
                      // Ensure mutually exclusive
                      setOcpQty(0);
                    }}
                    className="w-8 h-8 rounded-full bg-blue-500 items-center justify-center"
                  >
                    <Plus size={16} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Condoms Section */}
            <View className="mb-6">
              <Text className="text-slate-800 text-[16px] mb-3">
                {isNepali ? 'कण्डोम (Condoms)' : 'Condoms'}
              </Text>
              
              <View className="flex-row justify-between items-center bg-white border border-slate-200 p-3 rounded-xl">
                <Text className="text-slate-600 text-[15px] font-medium">
                  {isNepali ? 'कण्डोम' : 'Condom'}
                </Text>
                <View className="flex-row items-center gap-4">
                  <TouchableOpacity 
                    onPress={() => setCondomQty(Math.max(0, condomQty - 1))}
                    className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center"
                  >
                    <Minus size={16} color="#64748B" />
                  </TouchableOpacity>
                  <Text className="font-medium text-slate-700 w-4 text-center">{condomQty}</Text>
                  <TouchableOpacity 
                    onPress={() => setCondomQty(condomQty + 1)}
                    className="w-8 h-8 rounded-full bg-blue-500 items-center justify-center"
                  >
                    <Plus size={16} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View className="flex-row gap-3 mt-4">
              <TouchableOpacity 
                onPress={onClose}
                className="flex-1 py-3.5 border border-slate-200 rounded-xl items-center"
              >
                <Text className="font-semibold text-slate-700 text-[16px]">
                  {isNepali ? 'रद्द गर्नुहोस्' : 'Cancel'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={handleSave}
                disabled={loading}
                className="flex-1 py-3.5 bg-blue-500 rounded-xl items-center flex-row justify-center"
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-semibold text-[16px]">
                    {isNepali ? 'सुरक्षित गर्नुहोस्' : 'Save'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>

        </Pressable>
      </Pressable>
    </ModalWithSafeArea>
  );
}
