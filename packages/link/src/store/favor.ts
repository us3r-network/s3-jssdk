import { StateCreator } from "zustand";
import { Page } from "@ceramicnetwork/common";
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
  favors: Page<Favor>;
  favorsCount: number;
};

export interface FavorSlice {
  cacheLinkFavors: Map<string, LinkFavors>;
  favoringLinkIds: Set<string>;

  setOneInCacheLinkFavors: (linkId: string, linkFavors: LinkFavors) => void;
  addFavorToCacheLinkFavors: (linkId: string, favor: Favor) => void;
  updateFavorInCacheLinkFavors: (
    linkId: string,
    favorId: string,
    favor: Partial<Favor>
  ) => void;
  removeFavorFromCacheLinkFavors: (linkId: string, favorId: string) => void;

  addOneToFavoringLinkIds: (linkId: string) => void;
  removeOneFromFavoringLinkIds: (linkId: string) => void;
}

export const createFavorSlice: StateCreator<FavorSlice, [], [], FavorSlice> = (
  set,
  get
) => ({
  cacheLinkFavors: new Map(),
  favoringLinkIds: new Set(),

  setOneInCacheLinkFavors: (linkId, linkFavors) => {
    set((state) => ({
      cacheLinkFavors: new Map(state.cacheLinkFavors).set(linkId, {
        ...linkFavors,
      }),
    }));
  },
  addFavorToCacheLinkFavors: (linkId, favor) => {
    const linkFavors = get().cacheLinkFavors.get(linkId);
    if (!linkFavors) return;
    linkFavors.favors.edges.push({
      cursor: favor.id,
      node: { ...favor },
    });
    linkFavors.favors = { ...linkFavors.favors };
    linkFavors.favorsCount++;
    set((state) => ({
      cacheLinkFavors: new Map(state.cacheLinkFavors).set(linkId, {
        ...linkFavors,
      }),
    }));
  },
  updateFavorInCacheLinkFavors: (linkId, favorId, favor) => {
    const linkFavors = get().cacheLinkFavors.get(linkId);
    if (!linkFavors) return;
    const favorIndex = linkFavors.favors.edges.findIndex(
      (edge) => edge.node.id === favorId
    );
    if (favorIndex === -1) return;
    linkFavors.favors.edges[favorIndex].node = {
      ...linkFavors.favors.edges[favorIndex].node,
      ...favor,
    };
    linkFavors.favors = { ...linkFavors.favors };
    if (favor.hasOwnProperty("revoke")) {
      if (favor.revoke) {
        linkFavors.favorsCount--;
      } else {
        linkFavors.favorsCount++;
      }
    }
    set((state) => ({
      cacheLinkFavors: new Map(state.cacheLinkFavors).set(linkId, {
        ...linkFavors,
      }),
    }));
  },
  removeFavorFromCacheLinkFavors: (linkId, favorId) => {
    const linkFavors = get().cacheLinkFavors.get(linkId);
    if (!linkFavors) return;
    const favorIndex = linkFavors.favors.edges.findIndex(
      (edge) => edge.node.id === favorId
    );
    if (favorIndex === -1) return;
    linkFavors.favors.edges.splice(favorIndex, 1);
    linkFavors.favors = { ...linkFavors.favors };
    linkFavors.favorsCount--;
    set((state) => ({
      cacheLinkFavors: new Map(state.cacheLinkFavors).set(linkId, {
        ...linkFavors,
      }),
    }));
  },

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
