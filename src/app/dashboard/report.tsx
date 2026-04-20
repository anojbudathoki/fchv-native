import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import React from "react";
import {
  Calendar,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  FileText,
  User,
  Baby,
  Users,
  Send,
  CheckCircle2,
  Bell,
  CheckCircle
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import "../../global.css";
import Colors from "../../constants/Colors";
import TopHeader from "@/components/layout/TopHeader";

const ReportCard = ({ title, subtitle, count, expected, status, icon: Icon, color, hasAction }: any) => (
  <View className="bg-white rounded-[32px] p-6 mb-4 shadow-sm border border-gray-100 relative overflow-hidden">
    {hasAction && <View className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />}

    <View className="flex-row justify-between items-start mb-4">
      <View className={`${color === 'red' ? 'bg-red-50' : 'bg-blue-50'} p-3 rounded-2xl`}>
        <Icon size={24} color={color === 'red' ? Colors.nepali : Colors.primary} strokeWidth={2.5} />
      </View>
      <View className={`${status === 'READY' ? 'bg-green-50' : 'bg-red-50'} px-3 py-1 rounded-full`}>
        <Text className={`${status === 'READY' ? 'text-green-600' : 'text-red-500'} font-black text-[10px] uppercase tracking-widest`}>
          {status}
        </Text>
      </View>
    </View>

    <View>
      <Text style={{ color: Colors.textPrimary }} className="text-xl font-black">{title}</Text>
      <Text className="text-gray-400 font-bold text-xs mt-0.5">{subtitle}</Text>
    </View>

    <View className="h-[1px] bg-gray-50 my-4" />

    <View className="flex-row justify-between items-end">
      <View className="flex-row items-baseline">
        <Text style={{ color: Colors.textPrimary }} className="text-3xl font-black">{count}</Text>
        {expected && (
          <Text className="text-gray-400 font-bold text-xs ml-2">Expected: {expected}</Text>
        )}
        {status === 'ACTION REQ' && (
          <Text className="text-gray-400 font-bold text-xs ml-2">Pending</Text>
        )}
      </View>

      {status === 'ACTION REQ' && (
        <TouchableOpacity>
          <Text className="text-blue-500 font-black text-[13px]">History</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
);

export default function ReportScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC] mt-10">
      <StatusBar barStyle="dark-content" />

      {/* Custom Header with Profile & Notification */}
      {/* <View className="px-6 pt-14 pb-4 flex-row justify-between items-center bg-[#F8FAFC]">
        <View className="flex-row items-center">
            <View className="bg-primary w-10 h-10 rounded-full items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                <Image source={{uri: "https://i.pravatar.cc/150?u=laxmi"}} className="w-full h-full" />
            </View>
            <View className="ml-3">
                <Text style={{ color: Colors.textPrimary }} className="font-black text-sm uppercase tracking-tighter">FCHV Saathi <Text className="text-green-600 font-bold text-[11px] normal-case">(स्वयंसेविका साथी)</Text></Text>
            </View>
        </View>
        <TouchableOpacity className="bg-white p-2.5 rounded-2xl shadow-sm border border-gray-50">
          <Bell size={20} color="#64748B" strokeWidth={2} />
        </TouchableOpacity>
      </View> */}

      <ScrollView
        contentContainerStyle={{ paddingBottom: 140 }}
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View className="px-6 mt-4">
          <Text style={{ color: Colors.textPrimary }} className="text-[32px] font-black leading-tight tracking-tight">
            Monthly Reporting
          </Text>
          <View className="flex-row items-center mt-1">
            <Calendar size={14} color="#64748B" strokeWidth={2.5} />
            <Text className="text-gray-500 font-bold text-[14px] ml-2">
              July 2025
            </Text>
          </View>
        </View>

        {/* Progress Circular Card */}
        <View className="px-6 mt-8">
          <View className="bg-blue-50 rounded-[40px] p-8 items-center border border-blue-100 relative overflow-hidden">
            {/* Progress Circle Placeholder (Visual Mockup) */}
            <View className="relative w-32 h-32 items-center justify-center mb-6">
              <View className="w-28 h-28 rounded-full border-[10px] border-white items-center justify-center">
                <View className="w-28 h-28 rounded-full border-[10px] border-green-700 absolute rotate-45 border-t-transparent border-l-transparent" />
                <View>
                  <Text style={{ color: Colors.textPrimary }} className="text-[28px] font-black leading-none">75%</Text>
                  <Text className="text-gray-400 font-black text-[8px] uppercase tracking-widest text-center mt-1">Complete</Text>
                </View>
              </View>
            </View>

            <Text style={{ color: Colors.textPrimary }} className="text-xl font-black text-center px-4">
              Almost there, Laxmi!
            </Text>
            <Text className="text-gray-500 font-bold text-center text-sm mt-2 leading-5 px-4">
              You have completed <Text className="text-primary font-black">4 out of 5</Text> required report sections for this month. One more to go!
            </Text>
          </View>
        </View>

        {/* Categories List */}
        <View className="px-6 mt-10">
          <ReportCard
            title="ANC Visits"
            subtitle="प्रसूति पूर्व जाँच"
            count="12"
            expected="14"
            status="READY"
            icon={User}
          />
          <ReportCard
            title="Delivery"
            subtitle="प्रसूति"
            count="10"
            expected="12"
            status="READY"
            icon={Baby}
          />
          <ReportCard
            title="PNC Visits"
            subtitle="सुत्केरी जाँच"
            count="08"
            expected="08"
            status="READY"
            icon={Baby}
          />
          <ReportCard
            title="Family Planning Counseling"
            subtitle="परिवार नियोजन परामर्श"
            count="24"
            expected="Consultations"
            status="READY"
            icon={Users}
          />
          <ReportCard
            title="Referrals"
            subtitle="प्रेषण रिपोर्ट"
            count="03"
            status="ACTION"
            icon={CheckCircle2}
            color="red"
            hasAction={true}
          />
        </View>

        {/* Final Submission Card */}
        <View className="px-6 mt-10 flex-1 justify-end">
          <TouchableOpacity
            activeOpacity={0.8}
            className="bg-primary h-16 rounded-2xl flex-row items-center justify-center shadow-lg shadow-emerald-200"
            style={{ backgroundColor: Colors.trust }}
          >
            <Send size={20} color="white" strokeWidth={2.5} />
            <Text className="text-white font-black text-lg ml-3">Submit Report</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}
