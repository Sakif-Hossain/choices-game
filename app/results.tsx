import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { BackHandler, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ScoreCard = ({ label, value }: { label: string; value: number }) => (
  <View className="bg-white rounded-xl p-6 shadow-sm w-36">
    <Text className="text-gray-600 text-center text-sm mb-2">{label}</Text>
    <Text className="text-4xl font-bold text-center">{value}</Text>
  </View>
);

const ActionButton = ({
  onPress,
  label,
  primary = false,
}: {
  onPress: () => void;
  label: string;
  primary?: boolean;
}) => (
  <Pressable
    onPress={onPress}
    className={`px-8 py-4 rounded-full ${
      primary
        ? "bg-blue-500 active:bg-blue-600"
        : "bg-gray-200 active:bg-gray-300"
    }`}
  >
    <Text
      className={`text-center font-bold text-lg ${
        primary ? "text-white" : "text-gray-800"
      }`}
    >
      {label}
    </Text>
  </Pressable>
);

export default function Results() {
  const { score } = useLocalSearchParams<{ score: string }>();
  const [highScore, setHighScore] = useState<number>(0);
  const scoreValue = parseInt(score || "0");

  const loadHighScore = async () => {
    try {
      const savedHighScore = await AsyncStorage.getItem("highScore");
      const currentHighScore = savedHighScore ? parseInt(savedHighScore) : 0;

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
    const backAction = () => true;
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const handlePlayAgain = () => {
    router.replace("/game");
  };

  const handleHome = () => {
    router.replace("/");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 justify-between p-6">
        {/* Top Section */}
        <View className="items-center space-y-8">
          <View className="items-center space-y-2">
            <Text className="text-4xl font-extrabold text-gray-800">
              Game Over!
            </Text>
            {scoreValue > highScore && (
              <View className="bg-yellow-400 px-4 py-2 rounded-full">
                <Text className="text-sm font-bold text-yellow-800">
                  New High Score! 🎉
                </Text>
              </View>
            )}
          </View>

          {/* Score Cards */}
          <View className="flex-row justify-between w-full max-w-sm space-x-4">
            <ScoreCard label="Your Score" value={scoreValue} />
            <ScoreCard label="High Score" value={highScore} />
          </View>
        </View>

        {/* Bottom Action Buttons */}
        <View className="space-y-4 w-full max-w-sm mx-auto">
          <ActionButton onPress={handlePlayAgain} label="Play Again" primary />
          <ActionButton onPress={handleHome} label="Back to Home" />
        </View>
      </View>
    </SafeAreaView>
  );
}
