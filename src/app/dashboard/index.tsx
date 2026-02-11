import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import {
  Home,
  Baby,
  Users,
  CalendarClock,
  ClipboardList,
  LogOut,
  Menu,
} from "lucide-react-native";
import "../../global.css";

// Card Component for Dashboard
interface DashboardCardProps {
  title: string;
  subTitle: string;
  icon: any; // Lucide icon type
  color: string;
  onPress: () => void;
  fullWidth?: boolean;
}

const DashboardCard = ({ title, subTitle, icon: Icon, color, onPress, fullWidth = false }: DashboardCardProps) => (
  <TouchableOpacity
    onPress={onPress}
    className={`bg-white p-6 rounded-3xl mb-4 shadow-sm border border-gray-100 ${
      fullWidth ? "w-full" : "w-[48%]"
    } items-center justify-center py-8`}
    activeOpacity={0.7}
  >
    <View
      className={`w-16 h-16 rounded-full items-center justify-center mb-4 opacity-20`}
      style={{ backgroundColor: color }}
    >
      <Icon size={32} color={color} style={{ opacity: 1 }} />
    </View>
    <View
        className={`absolute top-6 w-16 h-16 rounded-full items-center justify-center mb-4`}
    >
        <Icon size={32} color={color} />
    </View>
    
    <Text className="text-gray-900 font-bold text-lg text-center mt-2">{title}</Text>
    <Text className="text-gray-500 text-xs text-center">{subTitle}</Text>
  </TouchableOpacity>
);

export default function DashboardScreen() {
  const router = useRouter();

  const menuItems = [
    {
      title: "घरधुरी थप्नुहोस्",
      subTitle: "Add Household",
      icon: Home,
      color: "#34d399", // Emerald 400
      route: "/dashboard/household",
      fullWidth: true,
    },
    {
      title: "गर्भवती महिला",
      subTitle: "Pregnant Women",
      icon: Baby, // Using Baby instead of UserPlus for pregnancy context
      color: "#f472b6", // Pink 400
      route: "/dashboard/pregnant-women",
    },
    {
      title: "बालबालिका 0-5",
      subTitle: "Children (0-5)",
      icon: Baby,
      color: "#60a5fa", // Blue 400
      route: "/dashboard/children",
    },
    {
      title: "परिवार नियोजन",
      subTitle: "Family Planning",
      icon: Users,
      color: "#a78bfa", // Violet 400
      route: "/dashboard/family-planning",
    },
    {
      title: "फलो-अप",
      subTitle: "Follow-ups",
      icon: CalendarClock,
      color: "#fbbf24", // Amber 400
      route: "/dashboard/follow-up",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#F3F4F6]">
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />
      
      {/* Header */}
      <View className="px-6 pt-4 pb-6 flex-row justify-between items-center">
        <View>
          <Text className="text-gray-500 text-sm font-medium">नमस्ते / Namaste</Text>
          <Text className="text-slate-900 text-2xl font-bold">FCHV Dashboard</Text>
        </View>
        <TouchableOpacity className="bg-white p-2 rounded-full shadow-sm">
           <Menu size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        className="px-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row flex-wrap justify-between">
          {menuItems.map((item, index) => (
            <DashboardCard
              key={index}
              title={item.title}
              subTitle={item.subTitle}
              icon={item.icon}
              color={item.color}
              onPress={() => router.push(item.route as any)}
              fullWidth={item.fullWidth}
            />
          ))}
        </View>

          {/* Sync Status / Extra Info Card */}
        <View className="w-full bg-emerald-500 rounded-3xl p-6 mt-2 relative overflow-hidden">
            <View className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-400 rounded-full opacity-50" />
            <View className="absolute -left-10 -bottom-10 w-40 h-40 bg-emerald-600 rounded-full opacity-30" />
            
            <View className="flex-row items-center justify-center">
                 <ClipboardList size={24} color="white" className="mr-3" />
                 <View>
                    <Text className="text-white font-bold text-lg">डाटा सिङ्क गर्नुहोस्</Text>
                    <Text className="text-emerald-100 text-xs font-bold tracking-widest uppercase">Sync Data Now</Text>
                 </View>
            </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
