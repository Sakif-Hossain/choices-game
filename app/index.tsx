import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";

export default function Index() {
  return (
    <SafeAreaView>
      <View>
        <Text style={{ fontSize: 24, marginBottom: 20 }}>Quiz Game</Text>
        <Pressable
          onPress={() => router.push("/game")}
          style={{
            backgroundColor: "#007AFF",
            padding: 15,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "white" }}>Start Game</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
