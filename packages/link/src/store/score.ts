import { StateCreator } from "zustand";
import { Page } from "@ceramicnetwork/common";
import { DateTime } from "./types";

export type Score = {
  id: string;
  text: string;
  value: number;
  linkID: string;
  revoke?: Boolean;
  createAt?: DateTime;
  modifiedAt?: DateTime;
  creator: {
    id: string;
  };
};

export type LinkScores = {
  scores: Page<Score>;
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

export const createScoreSlice: StateCreator<ScoreSlice, [], [], ScoreSlice> = (
  set,
  get
) => ({
  cacheLinkScores: new Map(),
  fetchingScoresLinkIds: fetchingScoresLinkIds,
  scoringLinkIds: new Set(),

  setOneInCacheLinkScores: (linkId, linkScores) => {
    set((state) => ({
      cacheLinkScores: new Map(state.cacheLinkScores).set(linkId, {
        ...linkScores,
      }),
    }));
  },
  addScoreToCacheLinkScores: (linkId, score) => {
    const linkScores = get().cacheLinkScores.get(linkId);
    if (!linkScores) return;
    linkScores.scores.edges.push({
      cursor: score.id,
      node: { ...score },
    });
    linkScores.scores = { ...linkScores.scores };
    linkScores.scoresCount++;
    set((state) => ({
      cacheLinkScores: new Map(state.cacheLinkScores).set(linkId, {
        ...linkScores,
      }),
    }));
  },
  updateScoreInCacheLinkScores: (linkId, scoreId, score) => {
    const linkScores = get().cacheLinkScores.get(linkId);
    if (!linkScores) return;
    const scoreIndex = linkScores.scores.edges.findIndex(
      (edge) => edge.node.id === scoreId
    );
    if (scoreIndex === -1) return;
    linkScores.scores.edges[scoreIndex].node = {
      ...linkScores.scores.edges[scoreIndex].node,
      ...score,
    };
    linkScores.scores = { ...linkScores.scores };
    if (score.hasOwnProperty("revoke")) {
      if (score.revoke) {
        linkScores.scoresCount--;
      } else {
        linkScores.scoresCount++;
      }
    }
    set((state) => ({
      cacheLinkScores: new Map(state.cacheLinkScores).set(linkId, {
        ...linkScores,
      }),
    }));
  },
  removeScoreFromCacheLinkScores: (linkId, scoreId) => {
    const linkScores = get().cacheLinkScores.get(linkId);
    if (!linkScores) return;
    const scoreIndex = linkScores.scores.edges.findIndex(
      (edge) => edge.node.id === scoreId
    );
    if (scoreIndex === -1) return;
    linkScores.scores.edges.splice(scoreIndex, 1);
    linkScores.scores = { ...linkScores.scores };
    linkScores.scoresCount--;
    set((state) => ({
      cacheLinkScores: new Map(state.cacheLinkScores).set(linkId, {
        ...linkScores,
      }),
    }));
  },

  addOneToFetchingScoresLinkIds: (linkId) => {
    fetchingScoresLinkIds.add(linkId);
    set(() => {
      const updatedSet = new Set(fetchingScoresLinkIds);
      updatedSet.add(linkId);
      return { fetchingScoresLinkIds: updatedSet };
    });
  },
  removeOneFromFetchingScoresLinkIds: (linkId) => {
    set(() => {
      const updatedSet = new Set(fetchingScoresLinkIds);
      updatedSet.delete(linkId);
      return { fetchingScoresLinkIds: updatedSet };
    });
  },

  addOneToScoringLinkIds: (linkId: string) => {
    set((state) => {
      const updatedSet = new Set(state.scoringLinkIds);
      updatedSet.add(linkId);
      return { scoringLinkIds: updatedSet };
    });
  },
  removeOneFromScoringLinkIds: (linkId: string) => {
    set((state) => {
      const updatedSet = new Set(state.scoringLinkIds);
      updatedSet.delete(linkId);
      return { scoringLinkIds: updatedSet };
    });
  },
});
