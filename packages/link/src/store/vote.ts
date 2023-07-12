import { StateCreator } from "zustand";
import { VoteType } from "@us3r-network/data-model";
import { DateTime } from "./types";

export type Vote = {
  id: string;
  linkID: string;
  type: VoteType;
  revoke: boolean;
  createAt: DateTime;
  modifiedAt: DateTime;
  creator: {
    id: string;
  };
};

export type LinkVotes = {
  votes: Array<Vote>;
  votesCount: number;
};

const fetchingVotesLinkIds = new Set<string>();
export const isFetchingVotes = (linkId: string) =>
  fetchingVotesLinkIds.has(linkId);

export interface VoteSlice {
  cacheLinkVotes: Map<string, LinkVotes>;
  fetchingVotesLinkIds: Set<string>;
  votingLinkIds: Set<string>;

  setOneInCacheLinkVotes: (linkId: string, linkVotes: LinkVotes) => void;
  addVoteToCacheLinkVotes: (linkId: string, vote: Vote) => void;
  updateVoteInCacheLinkVotes: (
    linkId: string,
    voteId: string,
    vote: Partial<Vote>
  ) => void;
  removeVoteFromCacheLinkVotes: (linkId: string, voteId: string) => void;

  addOneToFetchingVotesLinkIds: (linkId: string) => void;
  removeOneFromFetchingVotesLinkIds: (linkId: string) => void;

  addOneToVotingLinkIds: (linkId: string) => void;
  removeOneFromVotingLinkIds: (linkId: string) => void;
}

export const createVoteSlice: StateCreator<
  VoteSlice,
  [["zustand/immer", never]],
  [],
  VoteSlice
> = (set) => ({
  cacheLinkVotes: new Map(),
  fetchingVotesLinkIds: new Set(),
  votingLinkIds: new Set(),

  setOneInCacheLinkVotes: (linkId, linkVotes) => {
    set((state) => {
      state.cacheLinkVotes.set(linkId, linkVotes);
    });
  },
  addVoteToCacheLinkVotes: (linkId, vote) => {
    set((state) => {
      const linkVotes = state.cacheLinkVotes.get(linkId);
      if (!linkVotes) return;
      linkVotes.votes.push(vote);
      linkVotes.votesCount++;
    });
  },
  updateVoteInCacheLinkVotes: (linkId, voteId, vote) => {
    set((state) => {
      const linkVotes = state.cacheLinkVotes.get(linkId);
      if (!linkVotes) return;

      const voteIndex = linkVotes.votes.findIndex((item) => item.id === voteId);
      if (voteIndex === -1) return;

      const item = linkVotes.votes[voteIndex];
      Object.assign(item, vote);

      if (vote.hasOwnProperty("revoke")) {
        if (vote.revoke) {
          linkVotes.votesCount--;
        } else {
          linkVotes.votesCount++;
        }
      }
    });
  },
  removeVoteFromCacheLinkVotes: (linkId, voteId) => {
    set((state) => {
      const linkVotes = state.cacheLinkVotes.get(linkId);
      if (!linkVotes) return;
      const voteIndex = linkVotes.votes.findIndex((item) => item.id === voteId);
      if (voteIndex === -1) return;
      linkVotes.votes.splice(voteIndex, 1);
      linkVotes.votesCount--;
    });
  },
  addOneToFetchingVotesLinkIds: (linkId) => {
    fetchingVotesLinkIds.add(linkId);
    set((state) => {
      state.fetchingVotesLinkIds.add(linkId);
    });
  },
  removeOneFromFetchingVotesLinkIds: (linkId) => {
    fetchingVotesLinkIds.delete(linkId);
    set((state) => {
      state.fetchingVotesLinkIds.delete(linkId);
    });
  },

  addOneToVotingLinkIds: (linkId: string) => {
    set((state) => {
      state.votingLinkIds.add(linkId);
    });
  },
  removeOneFromVotingLinkIds: (linkId: string) => {
    set((state) => {
      state.votingLinkIds.delete(linkId);
    });
  },
});
