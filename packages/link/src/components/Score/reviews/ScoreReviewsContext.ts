import { createContext, useContext } from "react";
import { Score } from "../../../data-model";

export interface ScoreReviewsContextValue {
  linkId: string;
  isLoading: boolean;
  scores: Score[];
}

export const ScoreReviewsContext =
  createContext<ScoreReviewsContextValue | null>(null);

export function useScoreReviewsState() {
  const context = useContext(ScoreReviewsContext);
  if (!context) {
    throw new Error(
      "useScoreReviewsState can only be used within the ScoreReviews component"
    );
  }
  return context;
}

export const ScoreReviewsItemContext = createContext<Score>(null!);

export function useScoreReviewsItemState() {
  const context = useContext(ScoreReviewsItemContext);
  if (!context) {
    throw new Error(
      "useScoreReviewsItemState can only be used within the ScoreReviews.Item component"
    );
  }
  return context;
}
