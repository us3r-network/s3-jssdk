import { StateCreator } from "zustand";
import { DateTime } from "./types";

export type Score = {
  id: string;
  text: string;
  value: number;
  linkID: string;
  revoke: Boolean;
  createAt: DateTime;
  modifiedAt: DateTime;
  creator: {
    id: string;
  };
};

export type LinkScores = {
  scores: Array<Score>;
  scoresCount: number;
};

const fetchingScoresLinkIds = new Set<string>();
export const isFetchingScores = (linkId: string) =>
  fetchingScoresLinkIds.has(linkId);

export interface ScoreSlice {
  cacheLinkScores: Map<string, LinkScores>;
  fetchingScoresLinkIds: Set<string>;
  scoringLinkIds: Set<string>;

  setOneInCacheLinkScores: (linkId: string, linkScores: LinkScores) => void;
  addScoreToCacheLinkScores: (linkId: string, score: Score) => void;
  updateScoreInCacheLinkScores: (
    linkId: string,
    scoreId: string,
    score: Partial<Score>
  ) => void;
  removeScoreFromCacheLinkScores: (linkId: string, scoreId: string) => void;

  addOneToFetchingScoresLinkIds: (linkId: string) => void;
  removeOneFromFetchingScoresLinkIds: (linkId: string) => void;

  addOneToScoringLinkIds: (linkId: string) => void;
  removeOneFromScoringLinkIds: (linkId: string) => void;
}

export const createScoreSlice: StateCreator<
  ScoreSlice,
  [["zustand/immer", never]],
  [],
  ScoreSlice
> = (set) => ({
  cacheLinkScores: new Map(),
  fetchingScoresLinkIds: new Set(),
  scoringLinkIds: new Set(),

  setOneInCacheLinkScores: (linkId, linkScores) => {
    set((state) => {
      state.cacheLinkScores.set(linkId, linkScores);
    });
  },
  addScoreToCacheLinkScores: (linkId, score) => {
    set((state) => {
      const linkScores = state.cacheLinkScores.get(linkId);
      if (!linkScores) return;
      linkScores.scores.push(score);
      linkScores.scoresCount++;
    });
  },
  updateScoreInCacheLinkScores: (linkId, scoreId, score) => {
    set((state) => {
      const linkScores = state.cacheLinkScores.get(linkId);
      if (!linkScores) return;

      const scoreIndex = linkScores.scores.findIndex(
        (item) => item.id === scoreId
      );
      if (scoreIndex === -1) return;

      const item = linkScores.scores[scoreIndex];
      Object.assign(item, score);

      if (score.hasOwnProperty("revoke")) {
        if (score.revoke) {
          linkScores.scoresCount--;
        } else {
          linkScores.scoresCount++;
        }
      }
    });
  },
  removeScoreFromCacheLinkScores: (linkId, scoreId) => {
    set((state) => {
      const linkScores = state.cacheLinkScores.get(linkId);
      if (!linkScores) return;
      const scoreIndex = linkScores.scores.findIndex(
        (item) => item.id === scoreId
      );
      if (scoreIndex === -1) return;
      linkScores.scores.splice(scoreIndex, 1);
      linkScores.scoresCount--;
    });
  },
  addOneToFetchingScoresLinkIds: (linkId) => {
    fetchingScoresLinkIds.add(linkId);
    set((state) => {
      state.fetchingScoresLinkIds.add(linkId);
    });
  },
  removeOneFromFetchingScoresLinkIds: (linkId) => {
    fetchingScoresLinkIds.delete(linkId);
    set((state) => {
      state.fetchingScoresLinkIds.delete(linkId);
    });
  },

  addOneToScoringLinkIds: (linkId: string) => {
    set((state) => {
      state.scoringLinkIds.add(linkId);
    });
  },
  removeOneFromScoringLinkIds: (linkId: string) => {
    set((state) => {
      state.scoringLinkIds.delete(linkId);
    });
  },
});
