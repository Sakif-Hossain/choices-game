export interface Question {
  id: number;
  question: string;
  choices: [string, string];
  correctAnswer: 0 | 1;
}

export interface GameState {
  currentQuestion: number;
  score: number;
  isPlaying: boolean;
  timeRemaining: number;
}
