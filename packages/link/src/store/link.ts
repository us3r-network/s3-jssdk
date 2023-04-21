import { StateCreator } from "zustand";
import { Favor, Link, Vote } from "../data-model";
import { linkDataFieldFilling } from "../utils/store";

export interface LinkSlice {
  cacheLinks: Map<string, Link>;
  setOneInCacheLinks: (link: Link) => void;
  addFavorToCacheLinks: (linkId: string, favor: Favor) => void;
  updateFavorInCacheLinks: (
    linkId: string,
    favorId: string,
    favor: Partial<Favor>
  ) => void;
  removeFavorFromCacheLinks: (linkId: string, favorId: string) => void;
  addVoteToCacheLinks: (linkId: string, vote: Vote) => void;
  updateVoteInCacheLinks: (
    linkId: string,
    voteId: string,
    vote: Partial<Vote>
  ) => void;
  removeVoteFromCacheLinks: (linkId: string, voteId: string) => void;
}

export const createLinkSlice: StateCreator<LinkSlice, [], [], LinkSlice> = (
  set,
  get
) => ({
  cacheLinks: new Map(),
  setOneInCacheLinks: (link) => {
    set((state) => ({
      cacheLinks: new Map(state.cacheLinks).set(link?.id || link.url, link),
    }));
  },
  addFavorToCacheLinks: (linkId, favor) => {
    const link = get().cacheLinks.get(linkId);
    if (!link) return;
    const newLink = linkDataFieldFilling(link);
    newLink.favors.edges.push({
      cursor: favor.id,
      node: { ...favor },
    });
    newLink.favorsCount++;
    set((state) => ({
      cacheLinks: new Map(state.cacheLinks).set(linkId, newLink),
    }));
  },
  updateFavorInCacheLinks: (linkId, favorId, favor) => {
    const link = get().cacheLinks.get(linkId);
    if (!link) return;
    const newLink = linkDataFieldFilling(link);
    const favorIndex = newLink.favors.edges.findIndex(
      (edge) => edge.node.id === favorId
    );
    if (favorIndex === -1) return;
    newLink.favors.edges[favorIndex].node = {
      ...newLink.favors.edges[favorIndex].node,
      ...favor,
    };
    if (favor.hasOwnProperty("revoke")) {
      if (favor.revoke) {
        newLink.favorsCount--;
      } else {
        newLink.favorsCount++;
      }
    }
    set((state) => ({
      cacheLinks: new Map(state.cacheLinks).set(linkId, newLink),
    }));
  },
  removeFavorFromCacheLinks: (linkId, favorId) => {
    const link = get().cacheLinks.get(linkId);
    if (!link) return;
    const newLink = linkDataFieldFilling(link);
    const favorIndex = newLink.favors.edges.findIndex(
      (edge) => edge.node.id === favorId
    );
    if (favorIndex === -1) return;
    newLink.favors.edges.splice(favorIndex, 1);
    newLink.favorsCount--;
    set((state) => ({
      cacheLinks: new Map(state.cacheLinks).set(linkId, newLink),
    }));
  },
  addVoteToCacheLinks: (linkId, vote) => {
    const link = get().cacheLinks.get(linkId);
    if (!link) return;
    const newLink = linkDataFieldFilling(link);

    newLink.votes.edges.push({
      cursor: vote.id,
      node: { ...vote },
    });
    newLink.votesCount++;

    set((state) => ({
      cacheLinks: new Map(state.cacheLinks).set(linkId, newLink),
    }));
  },
  updateVoteInCacheLinks: (linkId, voteId, vote) => {
    const link = get().cacheLinks.get(linkId);
    if (!link) return;
    const newLink = linkDataFieldFilling(link);
    const voteIndex = newLink.votes.edges.findIndex(
      (edge) => edge.node.id === voteId
    );
    if (voteIndex === -1) return;
    newLink.votes.edges[voteIndex].node = {
      ...newLink.votes.edges[voteIndex].node,
      ...vote,
    };
    if (vote.hasOwnProperty("revoke")) {
      if (vote.revoke) {
        newLink.votesCount--;
      } else {
        newLink.votesCount++;
      }
    }
    console.log({ newLink });
    set((state) => ({
      cacheLinks: new Map(state.cacheLinks).set(linkId, newLink),
    }));
  },
  removeVoteFromCacheLinks: (linkId, voteId) => {
    const link = get().cacheLinks.get(linkId);
    if (!link) return;
    const newLink = linkDataFieldFilling(link);
    const voteIndex = newLink.votes.edges.findIndex(
      (edge) => edge.node.id === voteId
    );
    if (voteIndex === -1) return;
    newLink.votes.edges.splice(voteIndex, 1);
    newLink.votesCount--;
    set((state) => ({
      cacheLinks: new Map(state.cacheLinks).set(linkId, newLink),
    }));
  },
});
