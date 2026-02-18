import { cn } from "@/utils/utils";
import React from "react";
import { Text, TextProps, TextStyle } from "react-native";

// Define possible font weights
export type FontWeight = "300" | "400" | "500" | "600" | "700";

// Map weights to Inter fonts
const fontMap: Record<FontWeight, string> = {
  "300": "Inter_300Light",
  "400": "Inter_400Regular",
  "500": "Inter_500Medium",
  "600": "Inter_600SemiBold",
  "700": "Inter_700Bold",
};

// Typed color system
type AppColor =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "warning"
  | `#${string}`; // any hex color

const colorMap: Record<Exclude<AppColor, `#${string}`>, string> = {
  primary: "text-[#333333]",
  secondary: "text-[#9ca3af]",
  danger: "text-[#e05252]",
  success: "text-[#34C759]",
  warning: "text-[#FFCC00]",
};

interface AppTextProps extends TextProps {
  weight?: FontWeight;
  type?: AppColor;
}

export default function AppText({
  weight = "400",
  type = "primary",
  style,
  className,
  ...props
}: AppTextProps) {
  const fontFamily = fontMap[weight];

  const resolvedColor = type.startsWith("#")
    ? type
    : colorMap[type as keyof typeof colorMap];

  return (
    <Text
      {...props}
      className={cn(`${resolvedColor}`, className)}
      style={[{ fontFamily } as TextStyle, style]}
    />
  );
}
