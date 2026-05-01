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

  const Cell = ({ children, width, borderRight = true, align = "text-center" }: any) => (
    <View 
      style={{ width }} 
      className={`justify-center px-0.5 py-0 ${borderRight ? "border-r border-gray-300" : ""}`}
    >
      <Text className={`text-slate-900 font-bold text-[8.2px] ${align}`} numberOfLines={2}>
        {children}
      </Text>
    </View>
  );

  const HeaderCell = ({ children, width, height = 24, borderRight = true, borderBottom = true }: any) => (
    <View 
      style={{ width, height }} 
      className={`justify-center items-center px-0 bg-slate-100 ${borderRight ? "border-r border-gray-300" : ""} ${borderBottom ? "border-b border-gray-300" : ""}`}
    >
      <Text className="text-slate-900 font-extrabold text-[7.2px] text-center uppercase leading-none">
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
  const tableIndices = Array.from({ length: 24 }, (_, i) => i + 1);

  const getWidthForIndex = (n: number) => {
    switch (n) {
      case 1: return 25;
      case 2: return 85;
      case 3: return 38; // Gender
      case 4: return 100;
      case 5: return 30;
      default:
        const adjustedN = n > 3 ? n - 1 : n;
        switch (adjustedN) {
          case 5:
          case 6:
          case 7:
          case 8:
          case 9:
          case 10: return 32;
          case 11:
          case 12:
          case 13:
          case 14:
          case 15:
          case 16:
          case 17:
          case 18:
          case 19: return 40;
          case 20:
          case 21:
          case 22: return 32;
          case 23: return 120;
          default: return 32;
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
        <View className="flex-row px-4 py-3 gap-3 bg-white border-b border-gray-100">
          <View className="flex-1 flex-row items-center bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
            <Search size={14} color="#64748B" />
            <Text className="ml-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">Search Register...</Text>
          </View>
          <TouchableOpacity className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
            <Filter size={20} color="#64748B" />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={true} className="flex-1">
          <View>
            {/* Hierarchical Header */}
            <View className="flex-row border-b border-gray-300 bg-slate-100">
              <HeaderCell width={25} height={50}>क्र.सं.</HeaderCell>
              <HeaderCell width={85} height={50}>मृतक नवजात शिशुको नाम</HeaderCell>
              <HeaderCell width={38} height={50}>लिङ्ग</HeaderCell>

              <View>
                <HeaderCell width={130} height={25}>आमाको</HeaderCell>
                <View className="flex-row">
                  <HeaderCell width={100} height={25}>नाम, थर</HeaderCell>
                  <HeaderCell width={30} height={25}>उमेर</HeaderCell>
                </View>
              </View>

              <View>
                <HeaderCell width={96} height={25}>जन्मेको मिति</HeaderCell>
                <View className="flex-row">
                  <HeaderCell width={32} height={25}>गते</HeaderCell>
                  <HeaderCell width={32} height={25}>महिना</HeaderCell>
                  <HeaderCell width={32} height={25}>साल</HeaderCell>
                </View>
              </View>

              <View>
                <HeaderCell width={96} height={25}>जन्मस्थान*</HeaderCell>
                <View className="flex-row">
                  <HeaderCell width={32} height={25}>घर</HeaderCell>
                  <HeaderCell width={32} height={25}>संस्था</HeaderCell>
                  <HeaderCell width={32} height={25}>अन्य</HeaderCell>
                </View>
              </View>

              <View>
                <HeaderCell width={160} height={25}>जन्मदाको अवस्था*</HeaderCell>
                <View className="flex-row">
                  <HeaderCell width={40} height={25}>समय</HeaderCell>
                  <HeaderCell width={40} height={25}>कम तौल</HeaderCell>
                  <HeaderCell width={40} height={25}>सामान्य</HeaderCell>
                  <HeaderCell width={40} height={25}>अन्य</HeaderCell>
                </View>
              </View>

              <HeaderCell width={40} height={50}>मृत्यु उमेर</HeaderCell>

              <View>
                <HeaderCell width={160} height={25}>मृत्युको सम्भाव्य कारण*</HeaderCell>
                <View className="flex-row">
                  <HeaderCell width={40} height={25}>निसासिएको</HeaderCell>
                  <HeaderCell width={40} height={25}>शितलहर</HeaderCell>
                  <HeaderCell width={40} height={25}>संक्रमण</HeaderCell>
                  <HeaderCell width={40} height={25}>अन्य</HeaderCell>
                </View>
              </View>

              <View>
                <HeaderCell width={96} height={25}>मृत्युस्थान*</HeaderCell>
                <View className="flex-row">
                  <HeaderCell width={32} height={25}>घर</HeaderCell>
                  <HeaderCell width={32} height={25}>संस्था</HeaderCell>
                  <HeaderCell width={32} height={25}>अन्य</HeaderCell>
                </View>
              </View>

              <HeaderCell width={120} height={50}>कैफियत</HeaderCell>
              <HeaderCell width={32} height={50} borderRight={false}>Action</HeaderCell>
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
                  <View key={item.id} style={{ height: 34 }} className="flex-row border-b border-gray-200 bg-white">
                    <Cell width={25}>{index + 1}</Cell>
                    <Cell width={85} align="text-left">{item.baby_name || '-'}</Cell>
                    <Cell width={38}>{item.gender === 'Male' ? 'छोरा' : item.gender === 'Female' ? 'छोरी' : '-'}</Cell>
                    <Cell width={100} align="text-left">{item.mother_name}</Cell>
                    <Cell width={30}>-</Cell>

                    <Cell width={32}>{item.birth_day}</Cell>
                    <Cell width={32}>{item.birth_month}</Cell>
                    <Cell width={32}>{item.birth_year}</Cell>

                    <Cell width={32}>{bPlace === 'home' || bPlace === 'घर' ? "✔" : ""}</Cell>
                    <Cell width={32}>{bPlace === 'institution' || bPlace === 'संस्था' ? "✔" : ""}</Cell>
                    <Cell width={32}>{bPlace === 'other' || bPlace === 'अन्य' ? (item.delivery_place_other || "✔") : ""}</Cell>

                    <Cell width={40}>{bCond === 'preterm' ? "✔" : ""}</Cell>
                    <Cell width={40}>{bCond === 'lowweight' ? "✔" : ""}</Cell>
                    <Cell width={40}>{bCond === 'normal' ? "✔" : ""}</Cell>
                    <Cell width={40}>{bCond === 'other' ? (item.birth_condition_other || "✔") : ""}</Cell>

                    <Cell width={40}>{item.death_age_days}</Cell>

                    <Cell width={40}>{dCond === 'asphyxia' ? "✔" : ""}</Cell>
                    <Cell width={40}>{dCond === 'hypothermia' || dCond === 'shitang' ? "✔" : ""}</Cell>
                    <Cell width={40}>{dCond === 'infection' ? "✔" : ""}</Cell>
                    <Cell width={40}>{dCond === 'other' ? (item.cause_of_death_other || "✔") : ""}</Cell>

                    <Cell width={32}>{dPlace === 'home' || dPlace === 'घर' ? "✔" : ""}</Cell>
                    <Cell width={32}>{dPlace === 'institution' || dPlace === 'संस्था' ? "✔" : ""}</Cell>
                    <Cell width={32}>{dPlace === 'other' || dPlace === 'अन्य' ? (item.death_place_other || "✔") : ""}</Cell>

                    <Cell width={120} align="text-left">{item.remarks}</Cell>
                    <View style={{ width: 32 }} className="justify-center items-center">
                      <TouchableOpacity
                        onPress={() => handleDelete(item.id, item.mother_name)}
                        className="bg-red-50 p-0.5 rounded-md"
                      >
                        <Trash2 size={9} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
              {/* {data.length === 0 && (
                <View className="py-20 items-center justify-center" style={{ width: 900 }}>
                  <Text className="text-slate-400 font-black italic">No records found in this register.</Text>
                </View>
              )} */}
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
