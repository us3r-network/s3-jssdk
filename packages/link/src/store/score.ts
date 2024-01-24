import { StateCreator } from "zustand";
import { Score } from "@us3r-network/data-model";
import { FetchStatus, OrderType } from "./types";

export type LinkScores = {
  scores: Array<Score>;
  scoresCount: number;
  params: {
    order: OrderType;
  };
  status: FetchStatus;
  errMsg: string;
};

const defaultLinkScores: LinkScores = {
  scores: [],
  scoresCount: 0,
  params: {
    order: "desc",
  },
  status: "idle",
  errMsg: "",
};

export interface ScoreSlice {
  cacheLinkScores: Map<string, LinkScores>;
  scoringLinkIds: Set<string>;

  upsertOneInCacheLinkScores: (
    linkId: string,
    linkScores: Partial<LinkScores>
  ) => void;

  // scores mutations
  addScoreToCacheLinkScores: (linkId: string, score: Score) => void;
  updateScoreInCacheLinkScores: (
    linkId: string,
    scoreId: string,
    score: Partial<Score>
  ) => void;
  removeScoreFromCacheLinkScores: (linkId: string, scoreId: string) => void;

  // scoring
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

  upsertOneInCacheLinkScores: (linkId, linkScores) => {
    set((state) => {
      const prevLinkScores = state.cacheLinkScores.get(linkId);
      if (!prevLinkScores) {
        state.cacheLinkScores.set(linkId, {
          ...defaultLinkScores,
          ...linkScores,
        });
        return;
      }
      Object.assign(prevLinkScores, linkScores);
    });
  },

  // scores
  addScoreToCacheLinkScores: (linkId, score) => {
    set((state) => {
      if (!state.cacheLinkScores.get(linkId)) {
        const newLinkScores : LinkScores = {
          scores: [score],
          scoresCount: 1,
          params: {
            order: "desc",
          },
          status: "idle",
          errMsg: "",
        }
        state.cacheLinkScores.set(linkId, newLinkScores);
      } else {
        const linkScores = state.cacheLinkScores.get(linkId);
        if (!linkScores) return;
        linkScores.scores.push(score);
        linkScores.scoresCount++;
      }
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

  // scoring
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
