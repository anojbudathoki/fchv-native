import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import AppButton from "./common/AppButton";
import AppText from "./common/AppText";

type NavigationLayoutProps = {
  title: string;
  actionComponent?: React.ReactNode;
  className?: string;
  onBackPress?: () => void;
  absoluteCenterTitle?: boolean; // 👈 new prop
};

import { useSafeAreaInsets } from "react-native-safe-area-context";

const NavigationLayout = ({
  title,
  actionComponent,
  className,
  onBackPress,
  absoluteCenterTitle = false, // 👈 default false
}: NavigationLayoutProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: 6,
        paddingHorizontal: 6,
        backgroundColor: "#fff",
      }}
      className={className}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          position: "relative", // 👈 needed for absolute centering
        }}
      >
        {/* Back button */}
        <AppButton
          variant="ghost"
          onPress={() => (onBackPress ? onBackPress() : router.back())}
          className="p-3"
          icon={<ChevronLeft size={28} color="#1a1a1a" strokeWidth={2} />}
        />

        {/* Title */}
        {!absoluteCenterTitle && (
          <AppText className="text-lg" weight="600">
            {title}
          </AppText>
        )}

        {/* Optional action */}
        {actionComponent ? actionComponent : <View style={{ width: 28 }} />}

        {/* Absolute centered title */}
        {absoluteCenterTitle && (
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              alignItems: "center",
            }}
          >
            <AppText className="text-lg" weight="600">
              {title}
            </AppText>
          </View>
        )}
      </View>
    </View>
  );
};

export default NavigationLayout;
