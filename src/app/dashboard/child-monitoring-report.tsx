import React from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Printer, ChevronLeft } from "lucide-react-native";
import "../../global.css";
import Colors from "../../constants/Colors";
import CustomHeader from "../../components/CustomHeader";

export default function ChildMonitoringReportScreen() {
  const router = useRouter();

  const categories = [
    { id: 1, title: "नाभी मलम लगाएको", icon: "🍼", number: "१" },
    { id: 2, title: "जन्मने बित्तिकै छातीमा टाँसेर राखेको", icon: "🤱", number: "१" },
    { id: 3, title: "१ घण्टा भित्र स्तनपान गराएको", icon: "👶", number: "१" },
    { id: 4, title: "सामान्य तौल", icon: "⚖️", color: "bg-green-500", number: "" },
    { id: 5, title: "कम तौल", icon: "⚖️", color: "bg-yellow-400", number: "" },
    { id: 6, title: "धेरै कम तौल", icon: "⚖️", color: "bg-red-500", number: "" },
    { id: 7, title: "सुत्केरी भएको २४ घण्टा भित्र", icon: "🏠", number: "१" },
    { id: 8, title: "सुत्केरी भएको ३ दिनमा", icon: "🏠", number: "२" },
    { id: 9, title: "सुत्केरी भएको ७-१४ दिनमा", icon: "🏠", number: "३" },
    { id: 10, title: "सुत्केरी भएको ४२ दिनमा", icon: "🏠", number: "४" },
    { id: 11, title: "अन्य", icon: "📝", number: "५" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <CustomHeader 
        title="शिशुको अनुगमन भेट" 
        onBackPress={() => router.replace("/dashboard/report")}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          <Text className="text-center font-bold text-lg mb-4 text-slate-800">
            शिशुको अनुगमन भेट (Infant Monitoring Visit)
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="border border-slate-300 rounded-xl overflow-hidden">
              {/* Header */}
              <View className="flex-row bg-slate-50 border-b border-slate-300">
                {categories.map((cat, idx) => (
                  <View 
                    key={cat.id} 
                    className={`w-[100px] p-2 items-center justify-center ${idx < categories.length - 1 ? 'border-r border-slate-300' : ''}`}
                  >
                    <Text className="text-[10px] font-bold text-center h-[40px] flex-items-center">
                      {cat.title}
                    </Text>
                    {cat.color && (
                      <View className={`w-full h-2 mt-1 rounded-full ${cat.color}`} />
                    )}
                  </View>
                ))}
              </View>

              {/* Image Row */}
              <View className="flex-row border-b border-slate-300 bg-white">
                {categories.map((cat, idx) => (
                  <View 
                    key={cat.id} 
                    className={`w-[100px] h-[80px] p-1 items-center justify-center ${idx < categories.length - 1 ? 'border-r border-slate-300' : ''}`}
                  >
                     {/* Placeholder for actual illustrations */}
                     <View className="w-[60px] h-[60px] bg-slate-100 rounded-lg items-center justify-center border border-slate-200">
                        <Text className="text-2xl">{cat.icon}</Text>
                     </View>
                  </View>
                ))}
              </View>

              {/* Data Rows (Mockup) */}
              {[...Array(15)].map((_, rowIdx) => (
                <View key={rowIdx} className="flex-row border-b border-slate-200">
                  {categories.map((cat, idx) => (
                    <View 
                      key={idx} 
                      className={`w-[100px] p-2 items-center justify-center h-[50px] ${idx < categories.length - 1 ? 'border-r border-slate-200' : ''}`}
                    >
                      <Text className="text-slate-400 font-bold text-xs">{cat.number}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>

          <View className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
             <Text className="text-slate-500 text-[11px] font-medium leading-relaxed italic">
                * तालिकाहरूमा उल्लेखित नम्बरहरू स्वास्थ्य स्वयंसेविकाले भर्नुपर्ने संकेतहरू हुन् ।
             </Text>
          </View>
        </View>
      </ScrollView>

      {/* Floating Print Button - keeping it consistent with the previous one but hidden/top icon as per user's preference in last turn */}
    </SafeAreaView>
  );
}
