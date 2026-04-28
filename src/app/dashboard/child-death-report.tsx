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
import { getAllChildDeaths, deleteChildDeath } from "../../hooks/database/models/ChildDeathModel";
import { ChildDeathStoreType } from "../../hooks/database/types/childDeathModal";
import Colors from "../../constants/Colors";
import CustomHeader from "../../components/CustomHeader";

export default function ChildDeathReportScreen() {
  const router = useRouter();
  const [data, setData] = useState<ChildDeathStoreType[]>([]);
  const [loading, setLoading] = useState(true);

  const handleDownload = async () => {
    if (data.length === 0) {
      Alert.alert("No Data", "There are no child death records to export.");
      return;
    }

    try {
      const headers = [
        "S.N.", "Child Name", "Gender", "Parent Name", 
        "Birth Day", "Birth Month", "Birth Year", 
        "Death Age (Months)", "Cause of Death", "Remarks"
      ].join(",");

      const rows = data.map((item, index) => {
        return [
          index + 1,
          `"${item.child_name}"`,
          `"${item.gender ?? ''}"`,
          `"${item.mother_name}"`,
          item.birth_day,
          item.birth_month,
          item.birth_year,
          item.death_age_months,
          `"${item.cause_of_death}"`,
          `"${item.remarks ?? ''}"`
        ].join(",");
      }).join("\n");

      const csvContent = `${headers}\n${rows}`;

      await Share.share({
        message: csvContent,
        title: 'Child Death Register Report',
      });
    } catch (error) {
      Alert.alert("Export Error", "An error occurred while generating the report.");
    }
  };

  const handleDelete = (id: string, childName: string) => {
    Alert.alert(
      "रेकर्ड मेटाउनुहोस्",
      `"${childName || 'Child'}" को मृत्यु रेकर्ड मेटाउन चाहनुहुन्छ?`,
      [
        { text: "रद्द गर्नुहोस्", style: "cancel" },
        {
          text: "मेटाउनुहोस्",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteChildDeath(id);
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
          const records = await getAllChildDeaths();
          setData(records);
        } catch (error) {
          console.error("error fetching child deaths", error);
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
      className={`h-full justify-center px-2 py-4 ${borderRight ? "border-r border-gray-300" : ""}`}
    >
      <Text className="text-slate-900 font-bold text-[11px] text-center" numberOfLines={3}>
        {children}
      </Text>
    </View>
  );

  const HeaderCell = ({ children, width, height = 40, borderRight = true, borderBottom = true, bgColor = "bg-slate-100" }: any) => (
    <View 
      style={{ width, height }} 
      className={`justify-center items-center px-1 ${bgColor} ${borderRight ? "border-r border-gray-300" : ""} ${borderBottom ? "border-b border-gray-300" : ""}`}
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
        title="बाल मृत्यु विवरण दर्ता" 
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
            {/* Hierarchical Header - Matches Image Design */}
            <View className="flex-row border-b border-gray-300 bg-slate-200">
              <HeaderCell width={50} height={100} bgColor="bg-slate-200">क्र.सं.</HeaderCell>
              <HeaderCell width={180} height={100} bgColor="bg-slate-200">मृतक बच्चाको नाम</HeaderCell>
              <HeaderCell width={100} height={100} bgColor="bg-slate-200">लिङ्ग (Gender)</HeaderCell>
              <HeaderCell width={220} height={100} bgColor="bg-slate-200">मृतक बच्चाको आमा वा बाबुको नाम, थर</HeaderCell>
              
              {/* Birth Date Section */}
              <View>
                <HeaderCell width={180} height={50} bgColor="bg-slate-200">बच्चा जन्मेको मिति</HeaderCell>
                <View className="flex-row">
                  <HeaderCell width={60} height={50} bgColor="bg-slate-200">गते</HeaderCell>
                  <HeaderCell width={60} height={50} bgColor="bg-slate-200">महिना</HeaderCell>
                  <HeaderCell width={60} height={50} bgColor="bg-slate-200">साल</HeaderCell>
                </View>
              </View>

              <HeaderCell width={120} height={100} bgColor="bg-slate-200">मृत्यु हुँदा बच्चाको उमेर (महिनामा)</HeaderCell>
              <HeaderCell width={250} height={100} bgColor="bg-slate-200">मृत्युको सम्भाव्य कारण*</HeaderCell>
              <HeaderCell width={200} height={100} bgColor="bg-slate-200">कैफियत</HeaderCell>
              <HeaderCell width={70} height={100} borderRight={false} bgColor="bg-slate-200">Action</HeaderCell>
            </View>

            {/* Column Numbers Row (१, २, ३...) - Matches Image */}
            <View className="flex-row border-b border-gray-300 bg-slate-100">
               {[
                 {n: 1, w: 50}, 
                 {n: 2, w: 180}, 
                 {n: 3, w: 100},
                 {n: 4, w: 220}, 
                 {n: 5, w: 60}, 
                 {n: 6, w: 60}, 
                 {n: 7, w: 60}, 
                 {n: 8, w: 120}, 
                 {n: 9, w: 250}, 
                 {n: 10, w: 200},
                 {n: 0, w: 70}
               ].map((col, i) => (
                  <View key={i} style={{ width: col.w, height: 30 }} className={`border-r border-gray-300 justify-center items-center ${i === 10 ? 'border-r-0' : ''}`}>
                    <Text className="text-slate-400 font-bold text-[11px]">{col.n || 'Action'}</Text>
                  </View>
               ))}
            </View>

            {/* Data Rows */}
            <ScrollView className="flex-1" showsVerticalScrollIndicator={true}>
              {data.map((item, index) => (
                <View key={item.id} className="flex-row border-b border-gray-200">
                  <Cell width={50}>{index + 1}</Cell>
                  <Cell width={180}>{item.child_name}</Cell>
                  <Cell width={100}>{item.gender === 'Male' ? 'छोरा' : item.gender === 'Female' ? 'छोरी' : '-'}</Cell>
                  <Cell width={220}>{item.mother_name}</Cell>
                  
                  {/* Birth Date */}
                  <Cell width={60}>{item.birth_day}</Cell>
                  <Cell width={60}>{item.birth_month}</Cell>
                  <Cell width={60}>{item.birth_year}</Cell>

                  <Cell width={120}>{item.death_age_months}</Cell>
                  <Cell width={250}>{item.cause_of_death}</Cell>
                  <Cell width={200}>{item.remarks}</Cell>

                  <View style={{ width: 70 }} className="h-full justify-center items-center py-3">
                    <TouchableOpacity
                      onPress={() => handleDelete(item.id!, item.child_name!)}
                      className="bg-red-50 p-2 rounded-lg"
                    >
                      <Trash2 size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              {data.length === 0 && (
                <View className="py-20 items-center justify-center" style={{ width: 1430 }}>
                  <Text className="text-slate-400 font-black italic">No child mortality records found in this register.</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
