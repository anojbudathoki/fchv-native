import React from "react";
import { View } from "react-native";
import SegmentedControl from "@react-native-segmented-control/segmented-control";

interface SegmentedTabsProps {
  /** Array of tab labels to display */
  values: string[];
  /** Currently selected tab index */
  selectedIndex: number;
  /** Callback when a tab is selected */
  onChange: (index: number) => void;
  /** Active tab tint color (default: #1E293B) */
  activeTintColor?: string;
  /** Active tab background color (default: white) */
  activeBackgroundColor?: string;
  /** Inactive text color (default: #94A3B8) */
  inactiveTintColor?: string;
  /** Background color of the control (default: #F1F5F9) */
  backgroundColor?: string;
}

/**
 * Reusable segmented tab control built on top of
 * @react-native-segmented-control/segmented-control.
 *
 * Usage:
 * ```tsx
 * <SegmentedTabs
 *   values={["Tab A", "Tab B"]}
 *   selectedIndex={activeIndex}
 *   onChange={setActiveIndex}
 * />
 * ```
 */
export default function SegmentedTabs({
  values,
  selectedIndex,
  onChange,
  activeTintColor = "#1E293B",
  activeBackgroundColor = "#FFFFFF",
  inactiveTintColor = "#94A3B8",
  backgroundColor = "#F1F5F9",
}: SegmentedTabsProps) {
  return (
    <View className="mx-5 mt-2 mb-4">
      <SegmentedControl
        values={values}
        selectedIndex={selectedIndex}
        onChange={(event) => onChange(event.nativeEvent.selectedSegmentIndex)}
        style={{ height: 44, borderRadius: 14 }}
        backgroundColor={backgroundColor}
        tintColor={activeBackgroundColor}
        fontStyle={{
          fontWeight: "800",
          fontSize: 13,
          color: inactiveTintColor,
        }}
        activeFontStyle={{
          fontWeight: "900",
          fontSize: 13,
          color: activeTintColor,
        }}
      />
    </View>
  );
}
