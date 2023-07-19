import { StateCreator } from "zustand";
import { Score } from "@us3r-network/data-model";

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
  PersonalScoresSlice,
  [["zustand/immer", never]],
  [],
  PersonalScoresSlice
> = (set, get) => ({
  personalScores: new Map(),
  isFetchingPersonalScores: false,
  isBlockFetchPersonalScores: false,
  setIsFetchingPersonalScores: (isFetching) => {
    set((state) => {
      state.isFetchingPersonalScores = isFetching;
    });
  },
  setIsBlockFetchPersonalScores: (isBlock) => {
    set((state) => {
      state.isBlockFetchPersonalScores = isBlock;
    });
  },
  setAllInPersonalScores: (scores) => {
    set((state) => {
      state.personalScores = new Map(scores.map((score) => [score.id, score]));
    });
  },
  setManyInPersonalScores: (scores) => {
    set((state) => {
      scores.forEach((score) => {
        state.personalScores.set(score.id, score);
      });
    });
  },
  addOneToPersonalScores: (score) => {
    set((state) => {
      state.personalScores.set(score.id, score);
    });
  },
  removeOneFromPersonalScores: (scoreId) => {
    set((state) => {
      state.personalScores.delete(scoreId);
    });
  },
  updateOneInPersonalScores: (scoreId, score) => {
    set((state) => {
      const oldScore = state.personalScores.get(scoreId);
      if (!oldScore) return;
      state.personalScores.set(scoreId, {
        ...oldScore,
        ...score,
      });
    });
  },
});
