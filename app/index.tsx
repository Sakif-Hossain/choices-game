import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { GameMode } from "@/types"; // Import the GameMode enum

export default function Index() {
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);

  const handleStartGame = (mode: GameMode) => {
    setSelectedMode(mode);
    router.push({
      pathname: "/game",
      params: { mode },
    });
  };

  return (
    <SafeAreaView className="absolute inset-0 bg-sky-600">
      <View className="justify-center items-center px-6 flex-1">
        <Text className="text-4xl font-bold text-white text-center mb-8">
          TriviaTies
        </Text>

        <View className="space-y-4 gap-4 w-full">
          {Object.values(GameMode).map((mode) => (
            <Pressable
              key={mode}
              onPress={() => handleStartGame(mode)}
              className="bg-white/20 border border-white/30 backdrop-blur-lg rounded-2xl py-4 px-8"
            >
              <Text className="text-xl font-semibold text-white text-center capitalize">
                {mode}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
