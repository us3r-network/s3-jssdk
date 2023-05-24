import { StateCreator } from "zustand";
import { LinkSlice } from "./link";
import { Score } from "../data-model";

export interface PersonalScoresSlice {
  personalScores: Map<string, Score>;
  isFetchingPersonalScores: boolean;
  isBlockFetchPersonalScores: boolean;
  setIsFetchingPersonalScores: (isFetching: boolean) => void;
  setIsBlockFetchPersonalScores: (isBlock: boolean) => void;
  setAllInPersonalScores: (scores: Score[]) => void;
  setManyInPersonalScores: (scores: Score[]) => void;
  addOneToPersonalScores: (score: Score) => void;
  updateOneInPersonalScores: (scoreId: string, score: Partial<Score>) => void;
  removeOneFromPersonalScores: (scoreId: string) => void;
}

export const createPersonalScoresSlice: StateCreator<
  LinkSlice & PersonalScoresSlice,
  [],
  [],
  PersonalScoresSlice
> = (set, get) => ({
  personalScores: new Map(),
  isFetchingPersonalScores: false,
  isBlockFetchPersonalScores: false,
  setIsFetchingPersonalScores: (isFetching) => {
    set(() => ({ isFetchingPersonalScores: isFetching }));
  },
  setIsBlockFetchPersonalScores: (isBlock) => {
    set(() => ({ isBlockFetchPersonalScores: isBlock }));
  },
  setAllInPersonalScores: (scores) => {
    set(() => ({
      personalScores: new Map(scores.map((score) => [score.id, score])),
    }));
  },
  setManyInPersonalScores: (scores) => {
    set((state) => {
      const updatedMap = new Map(state.personalScores);
      scores.forEach((score) => {
        updatedMap.set(score.id, score);
      });
      return { personalScores: updatedMap };
    });
  },
  addOneToPersonalScores: (score) => {
    set((state) => ({
      personalScores: new Map(state.personalScores).set(score.id, score),
    }));
  },
  updateOneInPersonalScores: (scoreId, score) => {
    const oldScore = get().personalScores.get(scoreId);
    if (!oldScore) return;
    set((state) => ({
      personalScores: new Map(state.personalScores).set(scoreId, {
        ...oldScore,
        ...score,
      }),
    }));
  },
  removeOneFromPersonalScores: (scoreId) => {
    set((state) => {
      const updatedMap = new Map(state.personalScores);
      updatedMap.delete(scoreId);
      return { personalScores: updatedMap };
    });
  },
});
