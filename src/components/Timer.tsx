import React from "react";
import { View, Text } from "react-native";

interface TimerProps {
  timeRemaining: number;
  totalTime: number;
}

export const Timer = ({ timeRemaining, totalTime }: TimerProps) => {
  return (
    <View
      style={{
        position: "absolute",
        alignSelf: "center",
        top: "45%",
        zIndex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        padding: 20,
        borderRadius: 40,
        width: 80,
        height: 80,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 32,
          fontWeight: "bold",
          color: "white",
        }}
      >
        {timeRemaining}
      </Text>
    </View>
  );
};
