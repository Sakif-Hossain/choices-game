import React from "react";
import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface TimerProps {
  timeRemaining: number;
  totalTime: number;
}

export const Timer: React.FC<TimerProps> = ({ timeRemaining, totalTime }) => {
  const radius = 40; // Radius of the circle
  const strokeWidth = 8; // Width of the stroke
  const circumference = 2 * Math.PI * radius; // Circumference of the circle
  const progress = (timeRemaining / totalTime) * 100; // Progress as a percentage
  const strokeDashoffset = circumference - (progress / 100) * circumference; // Stroke offset

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: radius * 2 + strokeWidth,
        height: radius * 2 + strokeWidth,
      }}
    >
      {/* Time Text */}
      <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
        {timeRemaining}s
      </Text>

      {/* Circular Progress */}
      <Svg height={radius * 2 + strokeWidth} width={radius * 2 + strokeWidth}>
        {/* Background Circle */}
        <Circle
          cx={radius + strokeWidth / 2}
          cy={radius + strokeWidth / 2}
          r={radius}
          stroke="white"
          strokeWidth={strokeWidth}
          fill="none"
          opacity={0.2}
        />
        {/* Foreground Circle (Progress) */}
        <Circle
          cx={radius + strokeWidth / 2}
          cy={radius + strokeWidth / 2}
          r={radius}
          stroke="white"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${radius + strokeWidth / 2} ${
            radius + strokeWidth / 2
          })`} // Rotate to start from top
        />
      </Svg>
    </View>
  );
};
