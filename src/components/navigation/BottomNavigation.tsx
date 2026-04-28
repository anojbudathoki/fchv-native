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
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const keyboardDidShowListener = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const keyboardDidShowListener2 = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true)); // Extra safety for Android
    const keyboardDidHideListener = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));
    const keyboardDidHideListener2 = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidShowListener2.remove();
      keyboardDidHideListener.remove();
      keyboardDidHideListener2.remove();
    };
  }, []);

  const hiddenRoutes = ["add-record", "add-mother", "follow-up", "mother-profile", "mother-list/add-mother"];
  const isSearchActive = pathname.includes("record") && isKeyboardVisible; // Specifically hide when searching in record
  const shouldHide = hiddenRoutes.some(route => pathname.includes(route)) || isKeyboardVisible || isSearchActive;

  if (shouldHide) return null;

  const tabs = [
    { id: "home", label: "Home", icon: Home, path: "/dashboard" },
    { id: "visit", label: "Visit", icon: Calendar, path: "/dashboard/visit-list" },
    { id: "record", label: "Register", icon: Plus, path: "/dashboard/record", isAction: true },
    { id: "report", label: "Report", icon: FileText, path: "/dashboard/report" },
    { id: "guide", label: "Guideline", icon: BookOpen, path: "/dashboard/learn" },
  ];

  const isActive = (path: string | null) => {
    if (!path) return false;
    if (path === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(path);
  };

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex-row justify-around items-center px-2 shadow-[0_-8px_30px_rgb(0,0,0,0.04)] pb-8 pt-2">
      {tabs.map((tab, index) => {
        const Icon = tab.icon;
        const active = isActive(tab.path);

        if (tab?.isAction) {
          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.8}
              onPress={() => tab.path && router.push(tab.path as any)}
              className="bg-primary -mt-12 w-16 h-16 rounded-full items-center justify-center shadow-xl shadow-blue-200 border-4 border-white"
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
            <View className={`p-1.5 rounded-xl ${active ? 'bg-blue-50' : 'bg-transparent'}`}>
                <Icon
                size={22}
                color={active ? Colors.primary : "#64748B"}
                strokeWidth={active ? 2.5 : 2}
                />
            </View>
            <Text
              className={`text-[9px] mt-1 font-black uppercase tracking-tighter ${active ? "text-primary" : "text-slate-400"}`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
