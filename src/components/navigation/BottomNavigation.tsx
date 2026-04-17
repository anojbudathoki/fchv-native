import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Platform, Keyboard } from "react-native";
import { Home, Calendar, Plus, FileText, BookOpen } from "lucide-react-native";
import { useRouter, usePathname } from "expo-router";
import Colors from "../../constants/Colors";

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  if (isKeyboardVisible) return null;

  const tabs = [
    { id: "home", label: "Home", icon: Home, path: "/dashboard" },
    { id: "visit", label: "Visit", icon: Calendar, path: "/dashboard/follow-up" },
    { id: "action", label: "", icon: Plus, path: "", isAction: true },
    { id: "report", label: "Report", icon: FileText, path: "/dashboard" }, // Placeholder for stats
    { id: "guide", label: "Guideline", icon: BookOpen, path: "/dashboard/learn" },
  ];

  const isActive = (path: string | null) => {
    if (!path) return false;
    if (path === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(path);
  };

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white/90 border-t border-gray-100 flex-row justify-around items-center px-2 shadow-2xl pb-6 pt-2">
      {tabs.map((tab, index) => {
        const Icon = tab.icon;
        const active = isActive(tab.path);

        if (tab.isAction) {
          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.8}
              onPress={() => router.push("/dashboard/mother-list" as any)}
              className="bg-primary -mt-10 w-16 h-16 rounded-full items-center justify-center shadow-xl shadow-emerald-200 border-4 border-white"
            >
              <Plus size={32} color="white" strokeWidth={3} />
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={tab.id}
            activeOpacity={0.7}
            onPress={() => tab.path && router.push(tab.path as any)}
            className="items-center justify-center py-2 px-3 flex-1"
          >
            <Icon
              size={24}
              color={active ? Colors.primary : "#94a3b8"}
              strokeWidth={active ? 2.5 : 2}
            />
            <Text
              className={`text-[10px] mt-1 font-black ${active ? "text-primary" : "text-gray-700"
                }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
