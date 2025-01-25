export interface GameState {
  currentQuestion: number;
  score: number;
  isPlaying: boolean;
  timeRemaining: number;
}

// Types for game modes
export enum GameMode {
  HISTORY = "history",
  SCIENCE = "science",
  MATH = "math",
}

// Interface for question structure
export interface Question {
  // id: number;
  question: string;
  choices: string[];
  correctAnswer: number;
}

// Interface for AI question generation params
export interface QuestionGenerationParams {
  mode: GameMode;
  difficulty?: "easy" | "medium" | "hard";
  questionCount: number;
}
