import React, { useState, useCallback, useEffect } from "react";
import { View, Text } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import QuestionCard from "../src/components/QuestionCard";
import { generateQuestions } from "@/utils/questions";
import { useTimer } from "../src/hooks/useTimer";
import * as Haptics from "expo-haptics";
import { GameMode, Question } from "@/types";

export default function Game() {
  const { mode } = useLocalSearchParams<{ mode: GameMode }>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const questionCount = 5;

  const handleTimeout = useCallback(() => {
    handleNextQuestion();
  }, [currentQuestionIndex]);

  const { timeRemaining, resetTimer } = useTimer(10, handleTimeout);

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const generatedQuestions = await generateQuestions({
          mode,
          questionCount,
        });
        setQuestions(generatedQuestions);
        setIsLoading(false);
      } catch (error) {
        console.error(
          `Failed to generate questions for the mode ${mode}: `,
          error
        );
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [mode]);

  const handleAnswer = async (choiceIndex: number) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (choiceIndex === questions[currentQuestionIndex].correctAnswer) {
      setScore((prev) => prev + 1);
    }
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      resetTimer();
    } else {
      setGameOver(true);
    }
  };

  useEffect(() => {
    if (gameOver) {
      router.replace({
        pathname: "/results",
        params: { score: score.toString() },
      });
    }
  }, [gameOver]);

  if (isLoading || questions.length === 0) {
    return (
      <View className="flex-1 bg-gray-100 justify-center items-center">
        <Text>Loading questions...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <QuestionCard
        question={questions[currentQuestionIndex].question}
        choices={questions[currentQuestionIndex].choices}
        score={score}
        timeRemaining={timeRemaining}
        totalTime={10}
        onAnswer={handleAnswer}
      />
    </View>
  );
}
