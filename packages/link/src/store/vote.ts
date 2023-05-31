import { StateCreator } from "zustand";
import { LinkSlice } from "./link";
import { Vote } from "@us3r-network/data-model";
import { linkDataFieldFilling } from "../utils/store";

export interface VoteSlice {
  votingLinkIds: Set<string>;
  addOneToVotingLinkIds: (linkId: string) => void;
  removeOneFromVotingLinkIds: (linkId: string) => void;
  addVoteToCacheLinks: (linkId: string, vote: Vote) => void;
  updateVoteInCacheLinks: (
    linkId: string,
    voteId: string,
    vote: Partial<Vote>
  ) => void;
  removeVoteFromCacheLinks: (linkId: string, voteId: string) => void;
}

export const createVoteSlice: StateCreator<
  LinkSlice & VoteSlice,
  [],
  [],
  VoteSlice
> = (set, get) => ({
  votingLinkIds: new Set(),
  addOneToVotingLinkIds: (linkId: string) => {
    set((state) => {
      const updatedSet = new Set(state.votingLinkIds);
      updatedSet.add(linkId);
      return { votingLinkIds: updatedSet };
    });
  },
  removeOneFromVotingLinkIds: (linkId: string) => {
    set((state) => {
      const updatedSet = new Set(state.votingLinkIds);
      updatedSet.delete(linkId);
      return { votingLinkIds: updatedSet };
    });
  },
  addVoteToCacheLinks: (linkId, vote) => {
    const link = get().cacheLinks.get(linkId);
    if (!link) return;
    const newLink = linkDataFieldFilling(link);

    newLink.votes.edges.push({
      cursor: vote.id,
      node: { ...vote },
    });
    newLink.votes = { ...newLink.votes };
    newLink.votesCount++;

    set((state) => ({
      cacheLinks: new Map(state.cacheLinks).set(linkId, { ...newLink }),
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
    newLink.votes = { ...newLink.votes };
    if (vote.hasOwnProperty("revoke")) {
      if (vote.revoke) {
        newLink.votesCount--;
      } else {
        newLink.votesCount++;
      }
    }
    set((state) => ({
      cacheLinks: new Map(state.cacheLinks).set(linkId, { ...newLink }),
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
    newLink.votes = { ...newLink.votes };
    newLink.votesCount--;
    set((state) => ({
      cacheLinks: new Map(state.cacheLinks).set(linkId, { ...newLink }),
    }));
  },
});
