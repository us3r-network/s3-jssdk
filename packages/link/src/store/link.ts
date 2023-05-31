import { StateCreator } from "zustand";
import { Link } from "@us3r-network/data-model";

export interface LinkSlice {
  cacheLinks: Map<string, Link>;
  fetchingLinkIds: Set<string>;
  blockFetchLinkIds: Set<string>;
  setOneInCacheLinks: (link: Link) => void;
  addOneToFetchingLinkIds: (linkId: string) => void;
  removeOneFromFetchingLinkIds: (linkId: string) => void;
  addOneToBlockFetchLinkIds: (linkId: string) => void;
  removeOneFromBlockFetchLinkIds: (linkId: string) => void;
}

export const createLinkSlice: StateCreator<LinkSlice, [], [], LinkSlice> = (
  set
) => ({
  cacheLinks: new Map(),
  fetchingLinkIds: new Set(),
  blockFetchLinkIds: new Set(),
  setOneInCacheLinks: (link) => {
    set((state) => ({
      cacheLinks: new Map(state.cacheLinks).set(link?.id || link.url, {
        ...link,
      }),
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
  addOneToBlockFetchLinkIds: (linkId) => {
    set((state) => {
      const updatedSet = new Set(state.blockFetchLinkIds);
      updatedSet.add(linkId);
      return { blockFetchLinkIds: updatedSet };
    });
  },
  removeOneFromBlockFetchLinkIds: (linkId) => {
    set((state) => {
      const updatedSet = new Set(state.blockFetchLinkIds);
      updatedSet.delete(linkId);
      return { blockFetchLinkIds: updatedSet };
    });
  },
});
