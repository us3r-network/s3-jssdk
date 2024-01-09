import { StateCreator } from "zustand";
import { Vote } from "@us3r-network/data-model";
import { FetchStatus } from "./types";

export type LinkVotes = {
  votes: Array<Vote>;
  votesCount: number;
  status: FetchStatus;
  errMsg: string;
};

const defaultLinkVotes: LinkVotes = {
  votes: [],
  votesCount: 0,
  status: "idle",
  errMsg: "",
};

export interface VoteSlice {
  cacheLinkVotes: Map<string, LinkVotes>;
  votingLinkIds: Set<string>;

  upsertOneInCacheLinkVotes: (
    linkId: string,
    linkVotes: Partial<LinkVotes>
  ) => void;

  // votes mutations
  addVoteToCacheLinkVotes: (linkId: string, vote: Vote) => void;
  updateVoteInCacheLinkVotes: (
    linkId: string,
    voteId: string,
    vote: Partial<Vote>
  ) => void;
  removeVoteFromCacheLinkVotes: (linkId: string, voteId: string) => void;

  // voting
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
  votingLinkIds: new Set(),

  upsertOneInCacheLinkVotes: (linkId, linkVotes) => {
    set((state) => {
      const prevLinkVotes = state.cacheLinkVotes.get(linkId);
      if (!prevLinkVotes) {
        state.cacheLinkVotes.set(linkId, {
          ...defaultLinkVotes,
          ...linkVotes,
        });
        return;
      }
      Object.assign(prevLinkVotes, linkVotes);
    });
  },

  // votes mutations
  addVoteToCacheLinkVotes: (linkId, vote) => {
    set((state) => {
      if (!state.cacheLinkVotes.get(linkId)){
        const newLinkVotes : LinkVotes = {
          votes: [vote],
          votesCount: 1,
          status: "idle",
          errMsg: "",
        }
        state.cacheLinkVotes.set(linkId, newLinkVotes);
      }else{
        const linkVotes = state.cacheLinkVotes.get(linkId);
        if (!linkVotes) return;
        linkVotes.votes.push(vote);
        linkVotes.votesCount++;
      }
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

  // voting
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
