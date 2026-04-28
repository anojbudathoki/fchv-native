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
              <HeaderCell width={50} height={80}>क्र.सं.</HeaderCell>
              <HeaderCell width={180} height={80}>मृतक महिलाको नाम</HeaderCell>
              <HeaderCell width={70} height={80}>उमेर (वर्षमा)</HeaderCell>
              
              {/* Status Section */}
              <View>
                <HeaderCell width={240} height={40}>मृत्यु हुँदाको अवस्था*</HeaderCell>
                <View className="flex-row">
                  <HeaderCell width={80} height={40}>गर्भवती</HeaderCell>
                  <HeaderCell width={80} height={40}>प्रसव</HeaderCell>
                  <HeaderCell width={80} height={40}>सुत्केरी</HeaderCell>
                </View>
              </View>

              {/* Date Section */}
              <View>
                <HeaderCell width={180} height={40}>मृत्यु भएको मिति</HeaderCell>
                <View className="flex-row">
                  <HeaderCell width={60} height={40}>गते</HeaderCell>
                  <HeaderCell width={60} height={40}>महिना</HeaderCell>
                  <HeaderCell width={60} height={40}>साल</HeaderCell>
                </View>
              </View>

              {/* Birth Place */}
              <View>
                <HeaderCell width={180} height={40}>प्रसूति भएको स्थान*</HeaderCell>
                <View className="flex-row">
                  <HeaderCell width={60} height={40}>घर</HeaderCell>
                  <HeaderCell width={60} height={40}>संस्था</HeaderCell>
                  <HeaderCell width={60} height={40}>अन्य</HeaderCell>
                </View>
              </View>

              {/* Death Place */}
              <View>
                <HeaderCell width={180} height={40}>मृत्यु भएको स्थान*</HeaderCell>
                <View className="flex-row">
                  <HeaderCell width={60} height={40}>घर</HeaderCell>
                  <HeaderCell width={60} height={40}>संस्था</HeaderCell>
                  <HeaderCell width={60} height={40}>अन्य</HeaderCell>
                </View>
              </View>

              <HeaderCell width={200} height={80}>कैफियत</HeaderCell>
              <HeaderCell width={70} height={80} borderRight={false}>Action</HeaderCell>
            </View>

            {/* Static Numbers Row as in Image */}
            <View className="flex-row border-b border-gray-300 bg-slate-50">
               {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].map((n, i) => (
                  <View key={i} style={{ width: n === 1 ? 50 : n === 2 ? 180 : n === 3 ? 70 : (n >= 4 && n <= 6) ? 80 : (n >= 200) ? 200 : 60, height: 30 }} className="border-r border-gray-300 justify-center items-center">
                    <Text className="text-slate-400 font-bold text-[10px]">{n}</Text>
                  </View>
               ))}
            </View>

            {/* Data Rows */}
            <ScrollView className="flex-1" showsVerticalScrollIndicator={true}>
              {data.map((item, index) => (
                <View key={item.id} className="flex-row border-b border-gray-200">
                  <Cell width={50}>{index + 1}</Cell>
                  <Cell width={180}>{item.mother_name}</Cell>
                  <Cell width={70}>{item.mother_age}</Cell>
                  
                  {/* Status Indicator */}
                  <Cell width={80}>{item.death_condition?.toLowerCase() === 'pregnant' ? "✔" : ""}</Cell>
                  <Cell width={80}>{item.death_condition?.toLowerCase() === 'labor' ? "✔" : ""}</Cell>
                  <Cell width={80}>{item.death_condition?.toLowerCase() === 'post_delivery' ? "✔" : ""}</Cell>

                  {/* Date */}
                  <Cell width={60}>{item.death_day}</Cell>
                  <Cell width={60}>{item.death_month}</Cell>
                  <Cell width={60}>{item.death_year}</Cell>

                  {/* Birth Place */}
                  <Cell width={60}>{item.delivery_place?.toLowerCase() === 'home' ? "✔" : ""}</Cell>
                  <Cell width={60}>{item.delivery_place?.toLowerCase() === 'institution' ? "✔" : ""}</Cell>
                  <Cell width={60}>{item.delivery_place?.toLowerCase() === 'other' ? "✔" : ""}</Cell>

                  {/* Death Place */}
                  <Cell width={60}>{item.death_place?.toLowerCase() === 'home' ? "✔" : ""}</Cell>
                  <Cell width={60}>{item.death_place?.toLowerCase() === 'institution' ? "✔" : ""}</Cell>
                  <Cell width={60}>{item.death_place?.toLowerCase() === 'other' ? "✔" : ""}</Cell>

                  <Cell width={200}>{item.remarks}</Cell>
                  <View style={{ width: 70 }} className="h-full justify-center items-center py-3">
                    <TouchableOpacity
                      onPress={() => handleDelete(item.id!, item.mother_name!)}
                      className="bg-red-50 p-2 rounded-lg"
                    >
                      <Trash2 size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              {data.length === 0 && (
                <View className="py-20 items-center justify-center" style={{ width: 1270 }}>
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
