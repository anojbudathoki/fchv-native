import "react-native-gesture-handler";
import "../global.css";
import "../i18n/config"; // Import i18n config
import { Slot } from "expo-router";
import { useEffect } from "react";
import { LanguageProvider } from "../context/LanguageContext";
import { ToastProvider } from "../context/ToastContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { doSync } from "@/api/services/sync/sync";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export default function RootLayout() {
   // Mounts the network listener for data synchronization
   const { isConnected } = useOnlineStatus();

  // useEffect(() => {
  //   if(isConnected){
  //     doSync();
  //   }
  // }, [isConnected, doSync]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" backgroundColor="white" translucent={true} />
        <View style={{ flex: 1, backgroundColor: "white" }}>
          <ToastProvider>
            <LanguageProvider>
              <Slot />
            </LanguageProvider>
          </ToastProvider>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
