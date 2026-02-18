import "react-native-gesture-handler";
import "../global.css";
import "../i18n/config"; // Import i18n config
import { Slot } from "expo-router";
import { LanguageProvider } from "../context/LanguageContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" backgroundColor="white" translucent={true} />
        <View style={{ flex: 1, backgroundColor: "white" }}>
          <LanguageProvider>
            <Slot />
          </LanguageProvider>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
