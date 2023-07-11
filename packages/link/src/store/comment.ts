import { StateCreator } from "zustand";
import { DateTime } from "./types";

export type Comment = {
  id: string;
  linkID: string;
  text: string;
  revoke: boolean;
  createAt: DateTime;
  modifiedAt: DateTime;
  creator: {
    id: string;
  };
};

export type LinkComments = {
  comments: Array<Comment>;
  commentsCount: number;
};

const fetchingCommentsLinkIds = new Set<string>();
export const isFetchingComments = (linkId: string) =>
  fetchingCommentsLinkIds.has(linkId);

export interface CommentSlice {
  cacheLinkComments: Map<string, LinkComments>;
  fetchingCommentsLinkIds: Set<string>;
  commentingLinkIds: Set<string>;

  setOneInCacheLinkComments: (
    linkId: string,
    linkComments: LinkComments
  ) => void;
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

  addOneToFetchingCommentsLinkIds: (linkId: string) => void;
  removeOneFromFetchingCommentsLinkIds: (linkId: string) => void;

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

  setOneInCacheLinkComments: (linkId, linkComments) => {
    set((state) => {
      state.cacheLinkComments.set(linkId, linkComments);
    });
  },
  addCommentToCacheLinkComments: (linkId, comment) => {
    set((state) => {
      const linkComments = state.cacheLinkComments.get(linkId);
      if (!linkComments) return;
      linkComments.comments.push(comment);
      linkComments.commentsCount++;
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
  addOneToFetchingCommentsLinkIds: (linkId) => {
    fetchingCommentsLinkIds.add(linkId);
    set((state) => {
      state.fetchingCommentsLinkIds.add(linkId);
    });
  },
  removeOneFromFetchingCommentsLinkIds: (linkId) => {
    fetchingCommentsLinkIds.delete(linkId);
    set((state) => {
      state.fetchingCommentsLinkIds.delete(linkId);
    });
  },

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
