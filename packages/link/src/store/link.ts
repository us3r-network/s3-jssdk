import { StateCreator } from "zustand";
import { Link } from "../data-model";

export interface LinkSlice {
  cacheLinks: Map<string, Link>;
  fetchingLinkIds: Set<string>;
  setOneInCacheLinks: (link: Link) => void;
  addOneToFetchingLinkIds: (linkId: string) => void;
  removeOneFromFetchingLinkIds: (linkId: string) => void;
}

export const createLinkSlice: StateCreator<LinkSlice, [], [], LinkSlice> = (
  set
) => ({
  cacheLinks: new Map(),
  fetchingLinkIds: new Set(),
  setOneInCacheLinks: (link) => {
    set((state) => ({
      cacheLinks: new Map(state.cacheLinks).set(link?.id || link.url, link),
    }));
  },
  addOneToFetchingLinkIds: (linkId) => {
    set((state) => {
      const updatedSet = new Set(state.fetchingLinkIds);
      updatedSet.add(linkId);
      return { fetchingLinkIds: updatedSet };
    });
  },
  removeOneFromFetchingLinkIds: (linkId) => {
    set((state) => {
      const updatedSet = new Set(state.fetchingLinkIds);
      updatedSet.delete(linkId);
      return { fetchingLinkIds: updatedSet };
    });
  },
});
