import React from "react";
import { View, Text, Dimensions } from "react-native";
import LineChart from "react-native-chart-kit/dist/line-chart/LineChart";

interface TrendData {
  label: string;
  value: number;
}

interface TrendChartProps {
  data: TrendData[];
  color: string;
  label: string;
}

const TrendChart = ({ data, color, label }: TrendChartProps) => {
  const screenWidth = Dimensions.get("window").width - 40;
  const currentMonthIndex = new Date().getMonth();

  const plottedValues = data
    .slice(0, currentMonthIndex + 1)
    .map((d) => d.value);

  const maxValue = Math.max(...plottedValues, 0);
  const yMax = Math.max(10, maxValue);
  const chartSegments = 5;

  const datasets: any[] = [
    {
      data: plottedValues,
      color: () => color,
      strokeWidth: 3,
    },
    // Invisible dataset spanning full 12 months -> keeps all x-axis labels
    {
      data: data.map(() => 0),
      color: () => "rgba(0,0,0,0)",
      strokeWidth: 0,
      withDots: false,
    },
  ];

  if (maxValue < yMax) {
    datasets.push({
      data: [yMax],
      color: () => "rgba(0,0,0,0)",
      strokeWidth: 0,
      withDots: false,
    });
  }

  const chartData = {
    labels: data.map((d) => d.label), 
    datasets,
  };

 
  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => color,
    labelColor: () => "#64748B",
    propsForLabels: {
      fontSize: 9,
      fontWeight: "600" as const,
    },
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "3.5",
      strokeWidth: "2",
      stroke: "#ffffff",
      fill: color,
    },
    propsForBackgroundLines: {
      strokeDasharray: "4",
      stroke: "#e2e8f0",
      strokeWidth: 1,
    },
    fillShadowGradient: color,
    fillShadowGradientOpacity: 0.15,
  };

  return (
    <View>
      <LineChart
        data={chartData}
        width={screenWidth}
        height={200}
        chartConfig={chartConfig}
        bezier
        style={{ marginVertical: 4, borderRadius: 12 }}
        segments={chartSegments}
        withInnerLines={true}
        withOuterLines={true}
        withVerticalLines={false}
        withHorizontalLines={true}
        withDots={true}
        withShadow={true}
        fromZero={true}
        yAxisInterval={1}
      />
    </View>
  );
};

export default TrendChart;
