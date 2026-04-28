import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
  Share
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { ChevronLeft, Download, Filter, Search, Trash2 } from "lucide-react-native";
import "../../../global.css";
import { getAllNewbornDeaths, deleteNewbornDeath } from "../../../hooks/database/models/NewbornDeathModel";
import { NewbornDeathStoreType } from "../../../hooks/database/types/newbornDeathModal";
import Colors from "../../../constants/Colors";
import CustomHeader from "../../../components/CustomHeader";

export default function NewbornDeathReportScreen() {
  const router = useRouter();
  const [data, setData] = useState<NewbornDeathStoreType[]>([]);
  const [loading, setLoading] = useState(true);

  const handleDownload = async () => {
    if (data.length === 0) {
      Alert.alert("No Data", "There are no newborn death records to export.");
      return;
    }

    try {
      const headers = [
        "S.N.", "Dead Newborn Name", "Gender", "Mother Name", "Mother Age", 
        "Birth Day", "Birth Month", "Birth Year", 
        "Birth:Home", "Birth:Inst", "Birth:Other", 
        "Cond:Preterm", "Cond:LowWeight", "Cond:Normal", "Cond:Other",
        "Death Age (Days)",
        "Cause:Asphyxia", "Cause:Hypothermia", "Cause:Infection", "Cause:Other",
        "DeathPlace:Home", "DeathPlace:Inst", "DeathPlace:Other", 
        "Remarks"
      ].join(",");

      const rows = data.map((item, index) => {
        const bPlace = item.delivery_place?.toLowerCase();
        const bCond = item.birth_condition?.toLowerCase();
        const dCond = item.cause_of_death?.toLowerCase();
        const dPlace = item.death_place?.toLowerCase();

        return [
          index + 1,
          `"${item.baby_name || '-'}"`,
          `"${item.gender || '-'}"`,
          `"${item.mother_name}"`,
          `"-"`, // No mother age field directly attached in this model
          item.birth_day,
          item.birth_month,
          item.birth_year,
          bPlace === 'home' ? "✔" : "",
          bPlace === 'institution' ? "✔" : "",
          bPlace === 'other' ? `"${item.delivery_place_other || '✔'}"` : "",
          bCond === 'preterm' ? "✔" : "",
          bCond === 'lowweight' ? "✔" : "",
          bCond === 'normal' ? "✔" : "",
          bCond === 'other' ? `"${item.birth_condition_other || '✔'}"` : "",
          item.death_age_days,
          dCond === 'asphyxia' ? "✔" : "",
          dCond === 'hypothermia' ? "✔" : "",
          dCond === 'infection' ? "✔" : "",
          dCond === 'other' ? `"${item.cause_of_death_other || '✔'}"` : "",
          dPlace === 'home' ? "✔" : "",
          dPlace === 'institution' ? "✔" : "",
          dPlace === 'other' ? `"${item.death_place_other || '✔'}"` : "",
          `"${item.remarks ?? ''}"`
        ].join(",");
      }).join("\n");

      const csvContent = `${headers}\n${rows}`;

      await Share.share({
        message: csvContent,
        title: 'Newborn Death Register Report',
      });
    } catch (error) {
      Alert.alert("Export Error", "An error occurred while generating the report.");
    }
  };

  const handleDelete = (id: string, motherName: string) => {
    Alert.alert(
      "रेकर्ड मेटाउनुहोस्",
      `"${motherName}" को नवजात शिशु मृत्यु रेकर्ड मेटाउन चाहनुहुन्छ?`,
      [
        { text: "रद्द गर्नुहोस्", style: "cancel" },
        {
          text: "मेटाउनुहोस्",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteNewbornDeath(id);
              setData((prev) => prev.filter((item) => item.id !== id));
            } catch (error) {
              Alert.alert("Error", "Record could not be deleted.");
            }
          },
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const records = await getAllNewbornDeaths();
          setData(records);
        } catch (error) {
          console.error("error fetching newborn deaths", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [])
  );

  const Cell = ({ children, width, borderRight = true }: any) => (
    <View 
      style={{ width }} 
      className={`h-full justify-center px-2 py-3 ${borderRight ? "border-r border-gray-300" : ""}`}
    >
      <Text className="text-slate-900 font-bold text-[11px] text-center" numberOfLines={2}>
        {children}
      </Text>
    </View>
  );

  const HeaderCell = ({ children, width, height = 40, borderRight = true, borderBottom = true }: any) => (
    <View 
      style={{ width, height }} 
      className={`justify-center items-center px-1 bg-slate-100 ${borderRight ? "border-r border-gray-300" : ""} ${borderBottom ? "border-b border-gray-300" : ""}`}
    >
      <Text className="text-slate-900 font-black text-[10px] text-center uppercase">
        {children}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Row Indices from 1 to 23
  const tableIndices = Array.from({length: 24}, (_, i) => i + 1);

  const getWidthForIndex = (n: number) => {
    switch (n) {
      case 1: return 50;
      case 2: return 150;
      case 3: return 80; // Gender
      case 4: return 180;
      case 5: return 70;
      default:
        // Adjust indices after Gender (3)
        const adjustedN = n > 3 ? n - 1 : n;
        switch (adjustedN) {
          case 5:
          case 6:
          case 7:
          case 8:
          case 9:
          case 10: return 60;
          case 11:
          case 12:
          case 13:
          case 14:
          case 15:
          case 16:
          case 17:
          case 18:
          case 19: return 80;
          case 20:
          case 21:
          case 22: return 60;
          case 23: return 200;
          default: return 60;
        }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <CustomHeader 
        title="नवजात शिशु मृत्यु विवरण" 
        onBackPress={() => router.push("/dashboard/profile")}
        rightNode={
          <TouchableOpacity 
            onPress={handleDownload}
            className="bg-emerald-50 p-2 rounded-xl"
          >
            <Download size={20} color={Colors.primary} />
          </TouchableOpacity>
        }
      />

      <View className="flex-1">
        {/* Table Controls */}
        <View className="flex-row px-4 py-4 gap-3 bg-white border-b border-gray-100">
           <View className="flex-1 flex-row items-center bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100">
              <Search size={16} color="#64748B" />
              <Text className="ml-2 text-slate-400 font-bold text-xs uppercase tracking-widest">Search Register...</Text>
           </View>
           <TouchableOpacity className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
              <Filter size={20} color="#64748B" />
           </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={true} className="flex-1">
          <View>
            {/* Hierarchical Header */}
            <View className="flex-row border-b border-gray-300 bg-slate-100">
              <HeaderCell width={50} height={100}>क्र.सं.</HeaderCell>
              <HeaderCell width={150} height={100}>मृतक नवजात शिशुको नाम</HeaderCell>
              <HeaderCell width={80} height={100}>लिङ्ग (Gender)</HeaderCell>

              <View>
                <HeaderCell width={250} height={40}>आमाको</HeaderCell>
                <View className="flex-row">
                  <HeaderCell width={180} height={60}>नाम, थर</HeaderCell>
                  <HeaderCell width={70} height={60}>पूरा गरेको उमेर</HeaderCell>
                </View>
              </View>

              <View>
                <HeaderCell width={180} height={40}>नवजात शिशु जन्मेको मिति</HeaderCell>
                <View className="flex-row">
                  <HeaderCell width={60} height={60}>गते</HeaderCell>
                  <HeaderCell width={60} height={60}>महिना</HeaderCell>
                  <HeaderCell width={60} height={60}>साल</HeaderCell>
                </View>
              </View>

              <View>
                <HeaderCell width={180} height={40}>बच्चा जन्मिएको स्थान*</HeaderCell>
                <View className="flex-row">
                  <HeaderCell width={60} height={60}>घर</HeaderCell>
                  <HeaderCell width={60} height={60}>संस्था</HeaderCell>
                  <HeaderCell width={60} height={60}>अन्य</HeaderCell>
                </View>
              </View>

              <View>
                <HeaderCell width={320} height={40}>बच्चा जन्मदाको अवस्था*</HeaderCell>
                <View className="flex-row">
                  <HeaderCell width={80} height={60}>समय नपुगेको</HeaderCell>
                  <HeaderCell width={80} height={60}>कम तौल</HeaderCell>
                  <HeaderCell width={80} height={60}>सामान्य</HeaderCell>
                  <HeaderCell width={80} height={60}>अन्य</HeaderCell>
                </View>
              </View>

              <HeaderCell width={80} height={100}>मृत्यु हुँदा शिशुको उमेर (दिनमा)</HeaderCell>

              <View>
                <HeaderCell width={320} height={40}>मृत्युको सम्भाव्य कारण*</HeaderCell>
                <View className="flex-row">
                  <HeaderCell width={80} height={60}>निसासिएको</HeaderCell>
                  <HeaderCell width={80} height={60}>शिताङ्ग</HeaderCell>
                  <HeaderCell width={80} height={60}>संक्रमण</HeaderCell>
                  <HeaderCell width={80} height={60}>अन्य</HeaderCell>
                </View>
              </View>

              <View>
                <HeaderCell width={180} height={40}>मृत्यु भएको स्थान*</HeaderCell>
                <View className="flex-row">
                  <HeaderCell width={60} height={60}>घर</HeaderCell>
                  <HeaderCell width={60} height={60}>संस्था</HeaderCell>
                  <HeaderCell width={60} height={60}>अन्य</HeaderCell>
                </View>
              </View>

              <HeaderCell width={200} height={100}>कैफियत</HeaderCell>
              <HeaderCell width={70} height={100} borderRight={false}>Action</HeaderCell>
            </View>

            {/* Static Numbers Row as in Image */}
            <View className="flex-row border-b border-gray-300 bg-slate-50">
               {tableIndices.map((n, i) => (
                  <View key={i} style={{ width: getWidthForIndex(n), height: 30 }} className="border-r border-gray-300 justify-center items-center">
                    <Text className="text-slate-400 font-bold text-[10px]">{n}</Text>
                  </View>
               ))}
            </View>

            {/* Data Rows */}
            <ScrollView className="flex-1" showsVerticalScrollIndicator={true}>
              {data.map((item, index) => {
                const bPlace = item.delivery_place?.toLowerCase();
                const bCond = item.birth_condition?.toLowerCase();
                const dCond = item.cause_of_death?.toLowerCase();
                const dPlace = item.death_place?.toLowerCase();

                return (
                  <View key={item.id} className="flex-row border-b border-gray-200">
                    <Cell width={50}>{index + 1}</Cell>
                    <Cell width={150}>{item.baby_name || '-'}</Cell>
                    <Cell width={80}>{item.gender === 'Male' ? 'छोरा' : item.gender === 'Female' ? 'छोरी' : '-'}</Cell>
                    <Cell width={180}>{item.mother_name}</Cell>
                    <Cell width={70}>-</Cell>

                    <Cell width={60}>{item.birth_day}</Cell>
                    <Cell width={60}>{item.birth_month}</Cell>
                    <Cell width={60}>{item.birth_year}</Cell>

                    {/* Birth Place */}
                    <Cell width={60}>{bPlace === 'home' ? "✔" : ""}</Cell>
                    <Cell width={60}>{bPlace === 'institution' ? "✔" : ""}</Cell>
                    <Cell width={60}>{bPlace === 'other' ? (item.delivery_place_other || "✔") : ""}</Cell>

                    {/* Birth Condition */}
                    <Cell width={80}>{bCond === 'preterm' ? "✔" : ""}</Cell>
                    <Cell width={80}>{bCond === 'lowweight' ? "✔" : ""}</Cell>
                    <Cell width={80}>{bCond === 'normal' ? "✔" : ""}</Cell>
                    <Cell width={80}>{bCond === 'other' ? (item.birth_condition_other || "✔") : ""}</Cell>

                    {/* Death Age */}
                    <Cell width={80}>{item.death_age_days}</Cell>

                    {/* Death Cause */}
                    <Cell width={80}>{dCond === 'asphyxia' ? "✔" : ""}</Cell>
                    <Cell width={80}>{dCond === 'hypothermia' ? "✔" : ""}</Cell>
                    <Cell width={80}>{dCond === 'infection' ? "✔" : ""}</Cell>
                    <Cell width={80}>{dCond === 'other' ? (item.cause_of_death_other || "✔") : ""}</Cell>

                    {/* Death Place */}
                    <Cell width={60}>{dPlace === 'home' ? "✔" : ""}</Cell>
                    <Cell width={60}>{dPlace === 'institution' ? "✔" : ""}</Cell>
                    <Cell width={60}>{dPlace === 'other' ? (item.death_place_other || "✔") : ""}</Cell>

                    <Cell width={200}>{item.remarks}</Cell>
                    <View style={{ width: 70 }} className="h-full justify-center items-center py-3">
                      <TouchableOpacity
                        onPress={() => handleDelete(item.id, item.mother_name)}
                        className="bg-red-50 p-2 rounded-lg"
                      >
                        <Trash2 size={16} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
              {data.length === 0 && (
                <View className="py-20 items-center justify-center min-w-full">
                  <Text className="text-slate-400 font-black italic">No records found in this register.</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
