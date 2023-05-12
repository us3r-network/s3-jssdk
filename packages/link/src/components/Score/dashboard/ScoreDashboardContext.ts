import { createContext, useContext } from "react";

export interface ScoreDashboardContextValue {
  isLoading: boolean;
  scoresAvg: number;
  scoresCount: number;
  scoreValuesCount: number[];
  scoreValuesPercentage: number[];
}

export const ScoreDashboardContext =
  createContext<ScoreDashboardContextValue | null>(null);

export function useScoreDashboardState() {
  const context = useContext(ScoreDashboardContext);
  if (!context) {
    throw new Error(
      "useScoreDashboardState can only be used within the ScoreDashboard component"
    );
  }
  return context;
}
