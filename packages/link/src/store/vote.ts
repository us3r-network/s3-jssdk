import { StateCreator } from "zustand";
import { Page } from "@ceramicnetwork/common";
import { VoteType } from "@us3r-network/data-model";
import { LinkSlice } from "./link";

export type Vote = {
  id: string;
  linkID: string;
  type: VoteType;
  revoke: boolean;
  createAt: string;
  modifiedAt: string;
  creator: {
    id: string;
  };
};

export type LinkVotes = {
  votes: Page<Vote>;
  votesCount: number;
};

export interface VoteSlice {
  cacheLinkVotes: Map<string, LinkVotes>;
  votingLinkIds: Set<string>;

  setOneInCacheLinkVotes: (linkId: string, linkVotes: LinkVotes) => void;
  addVoteToCacheLinkVotes: (linkId: string, vote: Vote) => void;
  updateVoteInCacheLinkVotes: (
    linkId: string,
    voteId: string,
    vote: Partial<Vote>
  ) => void;
  removeVoteFromCacheLinkVotes: (linkId: string, voteId: string) => void;

  addOneToVotingLinkIds: (linkId: string) => void;
  removeOneFromVotingLinkIds: (linkId: string) => void;
}

export const createVoteSlice: StateCreator<
  LinkSlice & VoteSlice,
  [],
  [],
  VoteSlice
> = (set, get) => ({
  cacheLinkVotes: new Map(),
  votingLinkIds: new Set(),

  setOneInCacheLinkVotes: (linkId, linkVotes) => {
    set((state) => ({
      cacheLinkVotes: new Map(state.cacheLinkVotes).set(linkId, {
        ...linkVotes,
      }),
    }));
  },
  addVoteToCacheLinkVotes: (linkId, vote) => {
    const linkVotes = get().cacheLinkVotes.get(linkId);
    if (!linkVotes) return;
    linkVotes.votes.edges.push({
      cursor: vote.id,
      node: { ...vote },
    });
    linkVotes.votes = { ...linkVotes.votes };
    linkVotes.votesCount++;
    set((state) => ({
      cacheLinkVotes: new Map(state.cacheLinkVotes).set(linkId, {
        ...linkVotes,
      }),
    }));
  },
  updateVoteInCacheLinkVotes: (linkId, voteId, vote) => {
    const linkVotes = get().cacheLinkVotes.get(linkId);
    if (!linkVotes) return;
    const voteIndex = linkVotes.votes.edges.findIndex(
      (edge) => edge.node.id === voteId
    );
    if (voteIndex === -1) return;
    linkVotes.votes.edges[voteIndex].node = {
      ...linkVotes.votes.edges[voteIndex].node,
      ...vote,
    };
    linkVotes.votes = { ...linkVotes.votes };
    if (vote.hasOwnProperty("revoke")) {
      if (vote.revoke) {
        linkVotes.votesCount--;
      } else {
        linkVotes.votesCount++;
      }
    }
    set((state) => ({
      cacheLinkVotes: new Map(state.cacheLinkVotes).set(linkId, {
        ...linkVotes,
      }),
    }));
  },
  removeVoteFromCacheLinkVotes: (linkId, voteId) => {
    const linkVotes = get().cacheLinkVotes.get(linkId);
    if (!linkVotes) return;
    const voteIndex = linkVotes.votes.edges.findIndex(
      (edge) => edge.node.id === voteId
    );
    if (voteIndex === -1) return;
    linkVotes.votes.edges.splice(voteIndex, 1);
    linkVotes.votes = { ...linkVotes.votes };
    linkVotes.votesCount--;
    set((state) => ({
      cacheLinkVotes: new Map(state.cacheLinkVotes).set(linkId, {
        ...linkVotes,
      }),
    }));
  },

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
});
