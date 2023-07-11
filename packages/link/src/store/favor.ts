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

export type LinkFavors = {
  favors: Array<Favor>;
  favorsCount: number;
};

const fetchingFavorsLinkIds = new Set<string>();
export const isFetchingFavors = (linkId: string) =>
  fetchingFavorsLinkIds.has(linkId);

export interface FavorSlice {
  cacheLinkFavors: Map<string, LinkFavors>;
  fetchingFavorsLinkIds: Set<string>;
  favoringLinkIds: Set<string>;

  setOneInCacheLinkFavors: (linkId: string, linkFavors: LinkFavors) => void;
  addFavorToCacheLinkFavors: (linkId: string, favor: Favor) => void;
  updateFavorInCacheLinkFavors: (
    linkId: string,
    favorId: string,
    favor: Partial<Favor>
  ) => void;
  removeFavorFromCacheLinkFavors: (linkId: string, favorId: string) => void;

  addOneToFetchingFavorsLinkIds: (linkId: string) => void;
  removeOneFromFetchingFavorsLinkIds: (linkId: string) => void;

  addOneToFavoringLinkIds: (linkId: string) => void;
  removeOneFromFavoringLinkIds: (linkId: string) => void;
}

export const createFavorSlice: StateCreator<
  FavorSlice,
  [["zustand/immer", never]],
  [],
  FavorSlice
> = (set) => ({
  cacheLinkFavors: new Map(),
  fetchingFavorsLinkIds: new Set(),
  favoringLinkIds: new Set(),

  setOneInCacheLinkFavors: (linkId, linkFavors) => {
    set((state) => {
      state.cacheLinkFavors.set(linkId, linkFavors);
    });
  },
  addFavorToCacheLinkFavors: (linkId, favor) => {
    set((state) => {
      const linkFavors = state.cacheLinkFavors.get(linkId);
      if (!linkFavors) return;
      linkFavors.favors.push(favor);
      linkFavors.favorsCount++;
    });
  },
  updateFavorInCacheLinkFavors: (linkId, favorId, favor) => {
    set((state) => {
      const linkFavors = state.cacheLinkFavors.get(linkId);
      if (!linkFavors) return;

      const favorIndex = linkFavors.favors.findIndex(
        (item) => item.id === favorId
      );
      if (favorIndex === -1) return;

      const item = linkFavors.favors[favorIndex];
      Object.assign(item, favor);

      if (favor.hasOwnProperty("revoke")) {
        if (favor.revoke) {
          linkFavors.favorsCount--;
        } else {
          linkFavors.favorsCount++;
        }
      }
    });
  },
  removeFavorFromCacheLinkFavors: (linkId, favorId) => {
    set((state) => {
      const linkFavors = state.cacheLinkFavors.get(linkId);
      if (!linkFavors) return;
      const favorIndex = linkFavors.favors.findIndex(
        (item) => item.id === favorId
      );
      if (favorIndex === -1) return;
      linkFavors.favors.splice(favorIndex, 1);
      linkFavors.favorsCount--;
    });
  },
  addOneToFetchingFavorsLinkIds: (linkId) => {
    fetchingFavorsLinkIds.add(linkId);
    set((state) => {
      state.fetchingFavorsLinkIds.add(linkId);
    });
  },
  removeOneFromFetchingFavorsLinkIds: (linkId) => {
    fetchingFavorsLinkIds.delete(linkId);
    set((state) => {
      state.fetchingFavorsLinkIds.delete(linkId);
    });
  },

  addOneToFavoringLinkIds: (linkId: string) => {
    set((state) => {
      state.favoringLinkIds.add(linkId);
    });
  },
  removeOneFromFavoringLinkIds: (linkId: string) => {
    set((state) => {
      state.favoringLinkIds.delete(linkId);
    });
  },
});
