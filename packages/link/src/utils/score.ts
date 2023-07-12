import { Score } from "@us3r-network/data-model";
import { SCORE_VALUE_MAX } from "../constants";

export const getScoresAvgFromScores = (
  scores: Score[],
  scoresCount?: number
): number => {
  const values = scores.map((score) => score.value);
  const count = scoresCount || scores.length;
  const sum = values.reduce((a, b) => a + b, 0);
  const avg = Math.round(sum / count);
  return Math.min(Number.isNaN(avg) ? 0 : avg, SCORE_VALUE_MAX);
};
