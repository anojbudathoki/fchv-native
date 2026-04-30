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
import "../../global.css";
import { getAllMaternalDeaths, deleteMaternalDeath } from "../../hooks/database/models/MaternalDeathModel";
import { MaternalDeathStoreType } from "../../hooks/database/types/maternalDeathModal";
import Colors from "../../constants/Colors";
import CustomHeader from "../../components/CustomHeader";

export default function MaternalDeathReportScreen() {
  const router = useRouter();
  const [data, setData] = useState<MaternalDeathStoreType[]>([]);
  const [loading, setLoading] = useState(true);

  const handleDownload = async () => {
    if (data.length === 0) {
      Alert.alert("No Data", "There are no maternal death records to export.");
      return;
    }

    try {
      const headers = [
        "S.N.", "Deceased Name", "Age", 
        "Pregnant", "Labor", "Postpartum", 
        "Day", "Month", "Year", 
        "Birth:Home", "Birth:Inst", "Birth:Other", 
        "Death:Home", "Death:Inst", "Death:Other", 
        "Remarks"
      ].join(",");

      const rows = data.map((item, index) => {
        const cond = item.death_condition?.toLowerCase();
        const bPlace = item.delivery_place?.toLowerCase();
        const dPlace = item.death_place?.toLowerCase();

        return [
          index + 1,
          `"${item.mother_name}"`,
          item.mother_age,
          cond === 'pregnant' ? "✔" : "",
          cond === 'labor' ? "✔" : "",
          cond === 'post_delivery' ? "✔" : "",
          item.death_day,
          item.death_month,
          item.death_year,
          bPlace === 'home' ? "✔" : "",
          bPlace === 'institution' ? "✔" : "",
          bPlace === 'other' ? "✔" : "",
          dPlace === 'home' ? "✔" : "",
          dPlace === 'institution' ? "✔" : "",
          dPlace === 'other' ? "✔" : "",
          `"${item.remarks ?? ''}"`
        ].join(",");
      }).join("\n");

      const csvContent = `${headers}\n${rows}`;

      await Share.share({
        message: csvContent,
        title: 'Maternal Death Register Report',
      });
    } catch (error) {
      Alert.alert("Export Error", "An error occurred while generating the report.");
    }
  };

  const handleDelete = (id: string, motherName: string) => {
    Alert.alert(
      "रेकर्ड मेटाउनुहोस्",
      `"${motherName}" को मातृ मृत्यु रेकर्ड मेटाउन चाहनुहुन्छ?`,
      [
        { text: "रद्द गर्नुहोस्", style: "cancel" },
        {
          text: "मेटाउनुहोस्",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteMaternalDeath(id);
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
          const records = await getAllMaternalDeaths();
          setData(records);
        } catch (error) {
          console.error("error fetching maternal deaths", error);
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
      className={`justify-center px-1 py-0 ${borderRight ? "border-r border-gray-300" : ""}`}
    >
      <Text className={`text-slate-900 font-bold text-[8.5px] ${align}`} numberOfLines={2}>
        {children}
      </Text>
    </View>
  );

  const HeaderCell = ({ children, width, height = 25, borderRight = true, borderBottom = true }: any) => (
    <View 
      style={{ width, height }} 
      className={`justify-center items-center px-0.5 bg-slate-100 ${borderRight ? "border-r border-gray-300" : ""} ${borderBottom ? "border-b border-gray-300" : ""}`}
    >
      <Text className="text-slate-900 font-extrabold text-[7.5px] text-center uppercase leading-none">
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

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <CustomHeader 
        title="मातृ मृत्यु विवरण दर्ता" 
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
              <HeaderCell width={30} height={50}>क्र.सं.</HeaderCell>
              <HeaderCell width={120} height={50}>मृतक महिलाको नाम</HeaderCell>
              <HeaderCell width={40} height={50}>उमेर</HeaderCell>
              
              {/* Status Section */}
              <View>
                <HeaderCell width={135} height={25}>मृत्यु हुँदाको अवस्था*</HeaderCell>
                <View className="flex-row">
                  <HeaderCell width={45} height={25}>गर्भवती</HeaderCell>
                  <HeaderCell width={45} height={25}>प्रसव</HeaderCell>
                  <HeaderCell width={45} height={25}>सुत्केरी</HeaderCell>
                </View>
              </View>

              {/* Date Section */}
              <View>
                <HeaderCell width={105} height={25}>मृत्यु भएको मिति</HeaderCell>
                <View className="flex-row">
                  <HeaderCell width={35} height={25}>गते</HeaderCell>
                  <HeaderCell width={35} height={25}>महिना</HeaderCell>
                  <HeaderCell width={35} height={25}>साल</HeaderCell>
                </View>
              </View>

              {/* Birth Place */}
              <View>
                <HeaderCell width={105} height={25}>प्रसूति स्थान*</HeaderCell>
                <View className="flex-row">
                  <HeaderCell width={35} height={25}>घर</HeaderCell>
                  <HeaderCell width={35} height={25}>संस्था</HeaderCell>
                  <HeaderCell width={35} height={25}>अन्य</HeaderCell>
                </View>
              </View>

              {/* Death Place */}
              <View>
                <HeaderCell width={105} height={25}>मृत्यु स्थान*</HeaderCell>
                <View className="flex-row">
                  <HeaderCell width={35} height={25}>घर</HeaderCell>
                  <HeaderCell width={35} height={25}>संस्था</HeaderCell>
                  <HeaderCell width={35} height={25}>अन्य</HeaderCell>
                </View>
              </View>

              <HeaderCell width={140} height={50}>कैफियत</HeaderCell>
              <HeaderCell width={40} height={50} borderRight={false}>Action</HeaderCell>
            </View>

            {/* Static Numbers Row */}
            <View className="flex-row border-b border-gray-300 bg-slate-50">
               {[
                 {n: 1, w: 30}, {n: 2, w: 120}, {n: 3, w: 40},
                 {n: 4, w: 45}, {n: 5, w: 45}, {n: 6, w: 45},
                 {n: 7, w: 35}, {n: 8, w: 35}, {n: 9, w: 35},
                 {n: 10, w: 35}, {n: 11, w: 35}, {n: 12, w: 35},
                 {n: 13, w: 35}, {n: 14, w: 35}, {n: 15, w: 35},
                 {n: 16, w: 140}, {n: 0, w: 40}
               ].map((col, i) => (
                  <View key={i} style={{ width: col.w, height: 28 }} className="border-r border-gray-300 justify-center items-center">
                    <Text className="text-slate-400 font-bold text-[9px]">{col.n || 'Act'}</Text>
                  </View>
               ))}
            </View>

            {/* Data Rows */}
            <ScrollView className="flex-1" showsVerticalScrollIndicator={true}>
              {data.map((item, index) => (
                <View key={item.id} style={{ height: 35 }} className="flex-row border-b border-gray-200">
                  <Cell width={30}>{index + 1}</Cell>
                  <Cell width={120} align="text-left">{item.mother_name}</Cell>
                  <Cell width={40}>{item.mother_age}</Cell>
                  
                  {/* Status Indicator */}
                  <Cell width={45}>{item.death_condition?.toLowerCase() === 'pregnant' ? "✔" : ""}</Cell>
                  <Cell width={45}>{item.death_condition?.toLowerCase() === 'labor' ? "✔" : ""}</Cell>
                  <Cell width={45}>{item.death_condition?.toLowerCase() === 'post_delivery' ? "✔" : ""}</Cell>
...
                  {/* Date */}
                  <Cell width={35}>{item.death_day}</Cell>
                  <Cell width={35}>{item.death_month}</Cell>
                  <Cell width={35}>{item.death_year}</Cell>

                  {/* Birth Place */}
                  <Cell width={35}>{item.delivery_place?.toLowerCase() === 'home' ? "✔" : ""}</Cell>
                  <Cell width={35}>{item.delivery_place?.toLowerCase() === 'institution' ? "✔" : ""}</Cell>
                  <Cell width={35}>{item.delivery_place?.toLowerCase() === 'other' ? "✔" : ""}</Cell>

                  {/* Death Place */}
                  <Cell width={35}>{item.death_place?.toLowerCase() === 'home' ? "✔" : ""}</Cell>
                  <Cell width={35}>{item.death_place?.toLowerCase() === 'institution' ? "✔" : ""}</Cell>
                  <Cell width={35}>{item.death_place?.toLowerCase() === 'other' ? "✔" : ""}</Cell>

                  <Cell width={140} align="text-left">{item.remarks}</Cell>
                  <View style={{ width: 40 }} className="justify-center items-center">
                    <TouchableOpacity
                      onPress={() => handleDelete(item.id!, item.mother_name!)}
                      className="bg-red-50 p-1 rounded-md"
                    >
                      <Trash2 size={12} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              {/* {data.length === 0 && (
                <View className="py-20 items-center justify-center" style={{ width: 850 }}>
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
