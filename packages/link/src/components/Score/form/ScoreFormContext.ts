import { createContext, useContext } from "react";

export interface ScoreFormContextValue {
  value: number;
  setValue: (score: number) => void;
  text: string;
  setText: (text: string) => void;
  isScoring: boolean;
  isDisabled: boolean;
  errMsg: string;
  submitScore: () => Promise<void>;
}

export const ScoreFormContext = createContext<ScoreFormContextValue | null>(
  null
);

export function useScoreFormState() {
  const context = useContext(ScoreFormContext);
  if (!context) {
    throw new Error(
      "useScoreFormState can only be used within the ScoreForm component"
    );
  }
  return context;
}
