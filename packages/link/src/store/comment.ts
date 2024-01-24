import { StateCreator } from "zustand";
import { Comment } from "@us3r-network/data-model";
import { FetchStatus, OrderType } from "./types";

export type LinkComments = {
  comments: Array<Comment>;
  commentsCount: number;
  params: {
    order: OrderType;
  };
  status: FetchStatus;
  errMsg: string;
};

const defaultLinkComments: LinkComments = {
  comments: [],
  commentsCount: 0,
  params: {
    order: "desc",
  },
  status: "idle",
  errMsg: "",
};

export interface CommentSlice {
  cacheLinkComments: Map<string, LinkComments>;
  commentingLinkIds: Set<string>;

  upsertOneInCacheLinkComments: (
    linkId: string,
    linkComments: Partial<LinkComments>
  ) => void;

  // comments mutations
  addCommentToCacheLinkComments: (linkId: string, comment: Comment) => void;
  updateCommentInCacheLinkComments: (
    linkId: string,
    commentId: string,
    comment: Partial<Comment>
  ) => void;
  removeCommentFromCacheLinkComments: (
    linkId: string,
    commentId: string
  ) => void;

  // commenting
  addOneToCommentingLinkIds: (linkId: string) => void;
  removeOneFromCommentingLinkIds: (linkId: string) => void;
}

export const createCommentSlice: StateCreator<
  CommentSlice,
  [["zustand/immer", never]],
  [],
  CommentSlice
> = (set) => ({
  cacheLinkComments: new Map(),
  fetchingCommentsLinkIds: new Set(),
  commentingLinkIds: new Set(),

  upsertOneInCacheLinkComments: (linkId, linkComments) => {
    set((state) => {
      const prevLinkComments = state.cacheLinkComments.get(linkId);
      if (!prevLinkComments) {
        state.cacheLinkComments.set(linkId, {
          ...defaultLinkComments,
          ...linkComments,
        });
        return;
      }
      Object.assign(prevLinkComments, linkComments);
    });
  },

  // comments
  addCommentToCacheLinkComments: (linkId, comment) => {
    set((state) => {
      if (!state.cacheLinkComments.get(linkId)) {
        const newLinkComments : LinkComments = {
          comments: [comment],
          commentsCount: 1,
          params: {
            order: "desc",
          },
          status: "idle",
          errMsg: "",
        }
        state.cacheLinkComments.set(linkId, newLinkComments);
      } else {
        const linkComments = state.cacheLinkComments.get(linkId);
        if (!linkComments) return;
        linkComments.comments.push(comment);
        linkComments.commentsCount++;
      }
    });
  },
  updateCommentInCacheLinkComments: (linkId, commentId, comment) => {
    set((state) => {
      const linkComments = state.cacheLinkComments.get(linkId);
      if (!linkComments) return;

      const commentIndex = linkComments.comments.findIndex(
        (item) => item.id === commentId
      );
      if (commentIndex === -1) return;

      const item = linkComments.comments[commentIndex];
      Object.assign(item, comment);

      if (comment.hasOwnProperty("revoke")) {
        if (comment.revoke) {
          linkComments.commentsCount--;
        } else {
          linkComments.commentsCount++;
        }
      }
    });
  },
  removeCommentFromCacheLinkComments: (linkId, commentId) => {
    set((state) => {
      const linkComments = state.cacheLinkComments.get(linkId);
      if (!linkComments) return;
      const commentIndex = linkComments.comments.findIndex(
        (item) => item.id === commentId
      );
      if (commentIndex === -1) return;
      linkComments.comments.splice(commentIndex, 1);
      linkComments.commentsCount--;
    });
  },

  // commenting
  addOneToCommentingLinkIds: (linkId: string) => {
    set((state) => {
      state.commentingLinkIds.add(linkId);
    });
  },
  removeOneFromCommentingLinkIds: (linkId: string) => {
    set((state) => {
      state.commentingLinkIds.delete(linkId);
    });
  },
});
