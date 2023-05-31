import { StateCreator } from "zustand";
import { LinkSlice } from "./link";
import { linkDataFieldFilling } from "../utils/store";
import { Score } from "@us3r-network/data-model";

export interface ScoreSlice {
  scoringLinkIds: Set<string>;
  addOneToScoringLinkIds: (linkId: string) => void;
  removeOneFromScoringLinkIds: (linkId: string) => void;
  addScoreToCacheLinks: (linkId: string, score: Score) => void;
  updateScoreInCacheLinks: (
    linkId: string,
    scoreId: string,
    score: Partial<Score>
  ) => void;
  removeScoreFromCacheLinks: (linkId: string, scoreId: string) => void;
}

export const createScoreSlice: StateCreator<
  LinkSlice & ScoreSlice,
  [],
  [],
  ScoreSlice
> = (set, get) => ({
  scoringLinkIds: new Set(),
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
  addScoreToCacheLinks: (linkId, score) => {
    const link = get().cacheLinks.get(linkId);
    if (!link) return;
    const newLink = { ...linkDataFieldFilling(link) };
    newLink.scores.edges.push({
      cursor: score.id,
      node: { ...score },
    });
    newLink.scores = { ...newLink.scores };
    newLink.scoresCount++;
    set((state) => ({
      cacheLinks: new Map(state.cacheLinks).set(linkId, { ...newLink }),
    }));
  },
  updateScoreInCacheLinks: (linkId, scoreId, score) => {
    const link = get().cacheLinks.get(linkId);
    if (!link) return;
    const newLink = linkDataFieldFilling(link);
    const scoreIndex = newLink.scores.edges.findIndex(
      (edge) => edge.node.id === scoreId
    );
    if (scoreIndex === -1) return;
    newLink.scores.edges[scoreIndex].node = {
      ...newLink.scores.edges[scoreIndex].node,
      ...score,
    };
    newLink.scores = { ...newLink.scores };
    if (score.hasOwnProperty("revoke")) {
      if (score.revoke) {
        newLink.scoresCount--;
      } else {
        newLink.scoresCount++;
      }
    }
    set((state) => ({
      cacheLinks: new Map(state.cacheLinks).set(linkId, { ...newLink }),
    }));
  },
  removeScoreFromCacheLinks: (linkId, scoreId) => {
    const link = get().cacheLinks.get(linkId);
    if (!link) return;
    const newLink = linkDataFieldFilling(link);
    const scoreIndex = newLink.scores.edges.findIndex(
      (edge) => edge.node.id === scoreId
    );
    if (scoreIndex === -1) return;
    newLink.scores.edges.splice(scoreIndex, 1);
    newLink.scores = { ...newLink.scores };
    newLink.scoresCount--;
    set((state) => ({
      cacheLinks: new Map(state.cacheLinks).set(linkId, { ...newLink }),
    }));
  },
});
