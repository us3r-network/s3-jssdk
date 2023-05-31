import { SCORE_VALUE_MAX, SCORE_VALUE_MIN } from "../constants";
import { Link, Score } from "@us3r-network/data-model";

export const getScoresFromLink = (link: Link): Score[] => {
  return (
    link?.scores?.edges?.filter((edge) => !!edge?.node)?.map((e) => e.node) ||
    []
  );
};

export const getScoresCountFromLink = (link: Link): number => {
  return link?.scoresCount || 0;
};

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

export const getScoresAvgFromLink = (link: Link): number => {
  const scores = getScoresFromLink(link);
  const scoresCount = getScoresCountFromLink(link);
  return getScoresAvgFromScores(scores, scoresCount);
};
