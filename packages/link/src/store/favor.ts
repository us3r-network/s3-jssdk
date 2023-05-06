import { StateCreator } from "zustand";
import { LinkSlice } from "./link";
import { linkDataFieldFilling } from "../utils/store";
import { Favor } from "../data-model";

export interface FavorSlice {
  favoringLinkIds: Set<string>;
  addOneToFavoringLinkIds: (linkId: string) => void;
  removeOneFromFavoringLinkIds: (linkId: string) => void;
  addFavorToCacheLinks: (linkId: string, favor: Favor) => void;
  updateFavorInCacheLinks: (
    linkId: string,
    favorId: string,
    favor: Partial<Favor>
  ) => void;
  removeFavorFromCacheLinks: (linkId: string, favorId: string) => void;
}

export const createFavorSlice: StateCreator<
  LinkSlice & FavorSlice,
  [],
  [],
  FavorSlice
> = (set, get) => ({
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
});
