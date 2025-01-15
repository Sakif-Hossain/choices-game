import { useState, useEffect, useRef } from "react";

export const useTimer = (initialTime: number, onTimeout: () => void) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [onTimeout]);

  const resetTimer = () => {
    setTimeRemaining(initialTime);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  return { timeRemaining, resetTimer };
};
