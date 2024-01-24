import { StateCreator } from "zustand";
import { Favor } from "@us3r-network/data-model";
import { FetchStatus } from "./types";

export type LinkFavors = {
  favors: Array<Favor>;
  favorsCount: number;
  status: FetchStatus;
  errMsg: string;
};

const defaultLinkFavors: LinkFavors = {
  favors: [],
  favorsCount: 0,
  status: "idle",
  errMsg: "",
};

export interface FavorSlice {
  cacheLinkFavors: Map<string, LinkFavors>;
  favoringLinkIds: Set<string>;

  upsertOneInCacheLinkFavors: (
    linkId: string,
    linkFavors: Partial<LinkFavors>
  ) => void;

  // favors mutations
  addFavorToCacheLinkFavors: (linkId: string, favor: Favor) => void;
  updateFavorInCacheLinkFavors: (
    linkId: string,
    favorId: string,
    favor: Partial<Favor>
  ) => void;
  removeFavorFromCacheLinkFavors: (linkId: string, favorId: string) => void;

  // favoring
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
  favoringLinkIds: new Set(),

  upsertOneInCacheLinkFavors: (linkId, linkFavors) => {
    set((state) => {
      const prevLinkFavors = state.cacheLinkFavors.get(linkId);
      if (!prevLinkFavors) {
        state.cacheLinkFavors.set(linkId, {
          ...defaultLinkFavors,
          ...linkFavors,
        });
        return;
      }
      Object.assign(prevLinkFavors, linkFavors);
    });
  },

  // favors mutations
  addFavorToCacheLinkFavors: (linkId, favor) => {
    set((state) => {
      if (!state.cacheLinkFavors.get(linkId)){
        const newLinkFavors : LinkFavors = {
          favors: [favor],
          favorsCount: 1,
          status: "idle",
          errMsg: "",
        }
        state.cacheLinkFavors.set(linkId, newLinkFavors);
      }else{
        const linkFavors = state.cacheLinkFavors.get(linkId);
        if (!linkFavors) return;
        linkFavors.favors.push(favor);
        linkFavors.favorsCount++;
      }
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

  // favoring
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
