import { StateCreator } from "zustand";
import { DateTime } from "./types";

export type Favor = {
  id: string;
  linkID: string;
  revoke: boolean;
  createAt: DateTime;
  modifiedAt: DateTime;
  creator: {
    id: string;
  };
};
export interface PersonalFavorsSlice {
  personalFavors: Map<string, Favor>;
  isFetchingPersonalFavors: boolean;
  isBlockFetchPersonalFavors: boolean;
  setIsFetchingPersonalFavors: (isFetching: boolean) => void;
  setIsBlockFetchPersonalFavors: (isBlock: boolean) => void;
  setAllInPersonalFavors: (favors: Favor[]) => void;
  setManyInPersonalFavors: (favors: Favor[]) => void;
  addOneToPersonalFavors: (favor: Favor) => void;
  removeOneFromPersonalFavors: (favorId: string) => void;
}

export const createPersonalFavorsSlice: StateCreator<
  PersonalFavorsSlice,
  [["zustand/immer", never]],
  [],
  PersonalFavorsSlice
> = (set) => ({
  personalFavors: new Map(),
  isFetchingPersonalFavors: false,
  isBlockFetchPersonalFavors: false,
  setIsFetchingPersonalFavors: (isFetching) => {
    set((state) => {
      state.isFetchingPersonalFavors = isFetching;
    });
  },
  setIsBlockFetchPersonalFavors: (isBlock) => {
    set((state) => {
      state.isBlockFetchPersonalFavors = isBlock;
    });
  },
  setAllInPersonalFavors: (favors) => {
    set((state) => {
      state.personalFavors = new Map(favors.map((favor) => [favor.id, favor]));
    });
  },
  setManyInPersonalFavors: (favors) => {
    set((state) => {
      favors.forEach((favor) => {
        state.personalFavors.set(favor.id, favor);
      });
    });
  },
  addOneToPersonalFavors: (favor) => {
    set((state) => {
      state.personalFavors.set(favor.id, favor);
    });
  },
  removeOneFromPersonalFavors: (favorId) => {
    set((state) => {
      state.personalFavors.delete(favorId);
    });
  },
});
