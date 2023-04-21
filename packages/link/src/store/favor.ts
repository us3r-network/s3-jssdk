import { StateCreator } from "zustand";

export interface FavorSlice {
  favoringLinkIds: Set<string>;
  addOneToFavoringLinkIds: (linkId: string) => void;
  removeOneFromFavoringLinkIds: (linkId: string) => void;
}

export const createFavorSlice: StateCreator<FavorSlice, [], [], FavorSlice> = (
  set
) => ({
  favoringLinkIds: new Set(),
  addOneToFavoringLinkIds: (linkId: string) => {
    set((state) => {
      const updatedSet = new Set(state.favoringLinkIds);
      updatedSet.add(linkId);
      return { favoringLinkIds: updatedSet };
    });
  },
  removeOneFromFavoringLinkIds: (linkId: string) => {
    set((state) => {
      const updatedSet = new Set(state.favoringLinkIds);
      updatedSet.delete(linkId);
      return { favoringLinkIds: updatedSet };
    });
  },
});
