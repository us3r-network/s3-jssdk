import { StateCreator } from "zustand";

export interface VoteSlice {
  votingLinkIds: Set<string>;
  addOneToVotingLinkIds: (linkId: string) => void;
  removeOneFromVotingLinkIds: (linkId: string) => void;
}

export const createVoteSlice: StateCreator<VoteSlice, [], [], VoteSlice> = (
  set
) => ({
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
});
