import { StateCreator } from "zustand";
import { LinkSlice } from "./link";
import { Favor } from "@us3r-network/data-model";

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
  LinkSlice & PersonalFavorsSlice,
  [],
  [],
  PersonalFavorsSlice
> = (set) => ({
  personalFavors: new Map(),
  isFetchingPersonalFavors: false,
  isBlockFetchPersonalFavors: false,
  setIsFetchingPersonalFavors: (isFetching) => {
    set(() => ({ isFetchingPersonalFavors: isFetching }));
  },
  setIsBlockFetchPersonalFavors: (isBlock) => {
    set(() => ({ isBlockFetchPersonalFavors: isBlock }));
  },
  setAllInPersonalFavors: (favors) => {
    set(() => ({
      personalFavors: new Map(favors.map((favor) => [favor.id, favor])),
    }));
  },
  setManyInPersonalFavors: (favors) => {
    set((state) => {
      const updatedMap = new Map(state.personalFavors);
      favors.forEach((favor) => {
        updatedMap.set(favor.id, favor);
      });
      return { personalFavors: updatedMap };
    });
  },
  addOneToPersonalFavors: (favor) => {
    set((state) => ({
      personalFavors: new Map(state.personalFavors).set(favor.id, favor),
    }));
  },
  removeOneFromPersonalFavors: (favorId) => {
    set((state) => {
      const updatedMap = new Map(state.personalFavors);
      updatedMap.delete(favorId);
      return { personalFavors: updatedMap };
    });
  },
});
