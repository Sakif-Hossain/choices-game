import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { BackHandler, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

// RESULTS SCREEN
export default function Results() {
  const { score } = useLocalSearchParams<{ score: string }>();
  const [highScore, setHighScore] = useState<number>(0);
  const scoreValue = parseInt(score || "0");

  const loadHighScore = async () => {
    try {
      const savedHighScore = await AsyncStorage.getItem("highScore");
      const currentHighScore = savedHighScore ? parseInt(savedHighScore) : 0;

      // currentHS > savedHS
      if (scoreValue > currentHighScore) {
        await AsyncStorage.setItem("highScore", scoreValue.toString());
        setHighScore(scoreValue);
      } else {
        setHighScore(currentHighScore);
      }
    } catch (error) {
      console.error("Error loading high score:", error);
    }
  };

  useEffect(() => {
    loadHighScore();
    const backAction = () => true; // Disable back button
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Cleanup
  }, []);

  const handlePlayAgain = () => {
    router.replace("/game");
  };

  const handleHome = () => {
    router.replace("/");
  };

  return (
    <SafeAreaView>
      <View>
        <Text>Game Over!</Text>
        <View>
          <Text>Your Score</Text>
          <Text>{scoreValue}</Text>
        </View>

        <View>
          <Text>High Score</Text>
          <Text>{highScore}</Text>
          {scoreValue > highScore && <Text>New High Score!</Text>}
        </View>
      </View>

      <View>
        <Pressable onPress={handlePlayAgain}>
          <Text>Play Again</Text>
        </Pressable>

        <Pressable onPress={handleHome}>
          <Text>Home</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
