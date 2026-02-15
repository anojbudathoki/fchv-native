import "react-native-gesture-handler";
import "../global.css";
import "../i18n/config"; // Import i18n config
import { Slot } from "expo-router";
import { LanguageProvider } from "../context/LanguageContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <LanguageProvider>
          <Slot />
        </LanguageProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
