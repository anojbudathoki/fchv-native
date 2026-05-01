import SegmentedControl from "@react-native-segmented-control/segmented-control";
import React from "react";

type AppSegmentedControlProps = {
  segmentIndex: number;
  setSegmentIndex: (index: number) => void;
  onChange?: (index: number) => void;
  values: string[];
  label?: string[];
  size?: "small" | "large";
};

const AppSegmentedControl = ({
  segmentIndex,
  setSegmentIndex,
  onChange,
  values,
  label,
  size = "small"
}: AppSegmentedControlProps) => {
  return (
    <SegmentedControl
      style={{
        height: size === "small" ? 32 : 44,
        elevation: 0
      }}
      sliderStyle={{
        backgroundColor: "white",
        elevation: 0
      }}
      backgroundColor="#f3f4f6"
      fontStyle={{
        color: "#333"
      }}
      activeFontStyle={{
        color: "#333"
      }}
      values={label || values}
      selectedIndex={segmentIndex}
      onChange={(event) => {
        setSegmentIndex(event.nativeEvent.selectedSegmentIndex);
        onChange?.(event.nativeEvent.selectedSegmentIndex);
      }}
    />
  );
};

export default AppSegmentedControl;
