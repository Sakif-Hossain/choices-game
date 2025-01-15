import React, { useState, useCallback, useEffect } from "react";
import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import { router } from "expo-router";
import { Timer } from "../src/components/Timer";
import { useTimer } from "../src/hooks/useTimer";
import * as Haptics from "expo-haptics";
import { questions } from "@/utils/questions";

export default function Game() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const currentQuestion = questions[currentQuestionIndex];

  const handleTimeout = useCallback(() => {
    handleNextQuestion();
  }, [currentQuestionIndex]);

  const { timeRemaining, resetTimer } = useTimer(10, handleTimeout);

  const handleAnswer = async (choiceIndex: number) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (choiceIndex === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      resetTimer();
    } else {
      setGameOver(true); // Mark game as over
    }
  };

  useEffect(() => {
    if (gameOver) {
      router.replace({
        pathname: "/results",
        params: { score: score },
      });
    }
  }, [gameOver]);

  return (
    <View style={styles.container}>
      {/* Question */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
        <Text style={styles.scoreText}>Score: {score}</Text>
      </View>

      {/* Timer */}
      <Timer timeRemaining={timeRemaining} totalTime={10} />

      {/* Answer Buttons */}
      <View style={styles.answersContainer}>
        {currentQuestion.choices.map((choice, index) => (
          <Pressable
            key={index}
            style={[
              styles.answerButton,
              index === 0 ? styles.topButton : styles.bottomButton,
            ]}
            onPress={() => handleAnswer(index)}
          >
            <Text style={styles.answerText}>{choice}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  questionContainer: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    zIndex: 1,
    alignItems: "center",
  },
  questionText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 18,
    color: "#666",
  },
  answersContainer: {
    flex: 1,
  },
  answerButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  topButton: {
    backgroundColor: "#4CAF50",
  },
  bottomButton: {
    backgroundColor: "#2196F3",
  },
  answerText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
});
