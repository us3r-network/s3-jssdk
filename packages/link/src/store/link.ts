import { StateCreator } from "zustand";
import { Link } from "../data-model";

export interface LinkSlice {
  cacheLinks: Map<string, Link>;
  setOneInCacheLinks: (link: Link) => void;
}

export const createLinkSlice: StateCreator<LinkSlice, [], [], LinkSlice> = (
  set
) => ({
  cacheLinks: new Map(),
  setOneInCacheLinks: (link) => {
    set((state) => ({
      cacheLinks: new Map(state.cacheLinks).set(link?.id || link.url, link),
    }));
  },
});
