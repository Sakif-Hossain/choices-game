import Groq from "groq-sdk";
import { Question, QuestionGenerationParams, GameMode } from "@/types";

export const config = {
  apiKey: process.env.EXPO_PUBLIC_GROQ_API_ID,
};

const groq = new Groq({ apiKey: config.apiKey! });

export async function generateQuestions(
  params: QuestionGenerationParams,
  count: number = 5
): Promise<Question[]> {
  const { mode, difficulty = "medium" } = params;

  const modePrompts = {
    [GameMode.HISTORY]: "Generate a historical trivia question",
    [GameMode.SCIENCE]: "Generate a science trivia question",
    [GameMode.MATH]: "Generate a math trivia question",
  };

  try {
    const response = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content: `Generate ${count} multiple-choice trivia questions with two options each.`,
        },
        {
          role: "user",
          content: `${modePrompts[mode]} at ${difficulty} difficulty.
          Format EXACTLY like this for each question:
          Question: [Question text]
          Choice A: [First choice]
          Choice B: [Second choice]
          Correct Answer: A or B
          Provide ${count} questions in this format.`,
        },
      ],
    });

    const content = response.choices[0].message.content || "";

    return parsedQuestionResponse(content);
  } catch (error) {
    console.error("Error generating question:", error);
    // Fallback
    return [
      {
        question: "Fallback Question",
        choices: ["Option A", "Option B"],
        correctAnswer: 0,
      },
    ];
  }
}

function parsedQuestionResponse(response: string): Question[] {
  const questionBlocks = response.split("\n\n");

  // console.log("questionBlocks: ", questionBlocks);

  return questionBlocks.slice(1).map((block) => {
    const lines = block.split("\n");

    // console.log("lines", lines);

    return {
      question: lines[0].replace("Question: ", ""),
      choices: [
        lines[1].replace("Choice A: ", ""),
        lines[2].replace("Choice B: ", ""),
      ],
      correctAnswer: lines[3].includes("A") ? 0 : 1,
    };
  });
}

export const questions: Question[] = [
  {
    question: "What is the capital of France?",
    choices: ["London", "Paris"],
    correctAnswer: 1,
  },
  {
    question: "What is the largest planet in our solar system?",
    choices: ["Earth", "Jupiter"],
    correctAnswer: 1,
  },
  {
    question: "What is the chemical symbol for water?",
    choices: ["H2O", "O2"],
    correctAnswer: 0,
  },
  {
    question: "Which continent is known as the 'Land Down Under'?",
    choices: ["Australia", "Africa"],
    correctAnswer: 0,
  },
  {
    question: "Who painted the Mona Lisa?",
    choices: ["Vincent van Gogh", "Leonardo da Vinci"],
    correctAnswer: 1,
  },
  {
    question: "Which element has the atomic number 1?",
    choices: ["Hydrogen", "Helium"],
    correctAnswer: 0,
  },
  {
    question: "What is the currency of Japan?",
    choices: ["Yuan", "Yen"],
    correctAnswer: 1,
  },
  {
    question: "Which planet is known as the Red Planet?",
    choices: ["Mars", "Venus"],
    correctAnswer: 0,
  },
  {
    question: "What is the smallest prime number?",
    choices: ["1", "2"],
    correctAnswer: 1,
  },
  {
    question: "Who wrote the play 'Romeo and Juliet'?",
    choices: ["William Shakespeare", "Charles Dickens"],
    correctAnswer: 0,
  },
];
