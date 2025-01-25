import React from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import { Timer } from "./Timer";
import { LinearGradient } from "expo-linear-gradient";

interface QuestionCardProps {
  question: string;
  choices: string[];
  score: number;
  timeRemaining: number;
  totalTime: number;
  onAnswer: (choiceIndex: 0 | 1) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  choices,
  score,
  timeRemaining,
  totalTime,
  onAnswer,
}) => {
  return (
    <View className="flex-1 bg-slate-700 rounded-3xl">
      {/* Top Section: Question and Score */}
      <View className="px-4 py-6">
        <View className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 mb-4 flex-row justify-between items-center">
          <Text className="text-white font-bold text-lg">Score: {score}</Text>
        </View>

        <View className="bg-white/20 backdrop-blur-lg rounded-3xl p-6">
          <Text className="text-white text-2xl font-bold text-center">
            {question}
          </Text>
        </View>
      </View>

      {/* Split Screen Choices */}
      <View className="flex-1 relative">
        {/* Timer positioned in the middle */}
        <View className="absolute top-1/2 left-0 right-0 z-10 px-8 -translate-y-1/2">
          <Timer timeRemaining={timeRemaining} totalTime={totalTime} />
        </View>

        {/* Choice Buttons */}
        <View className="flex-auto flex-col">
          {choices.map((choice, index) => (
            <Pressable
              key={index}
              onPress={() => onAnswer(index as 0 | 1)}
              className="flex-1"
            >
              <View className={index === 0 ? "bg-blue-400" : "bg-red-400"}>
                <Text className="text-white text-3xl font-bold text-center px-4">
                  {choice}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
};

export default QuestionCard;
