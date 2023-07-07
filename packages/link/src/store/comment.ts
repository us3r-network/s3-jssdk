import { StateCreator } from "zustand";
import { Page } from "@ceramicnetwork/common";
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
  comments: Page<Comment>;
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
  [],
  [],
  CommentSlice
> = (set, get) => ({
  cacheLinkComments: new Map(),
  fetchingCommentsLinkIds: fetchingCommentsLinkIds,
  commentingLinkIds: new Set(),

  setOneInCacheLinkComments: (linkId, linkComments) => {
    set((state) => ({
      cacheLinkComments: new Map(state.cacheLinkComments).set(linkId, {
        ...linkComments,
      }),
    }));
  },
  addCommentToCacheLinkComments: (linkId, comment) => {
    const linkComments = get().cacheLinkComments.get(linkId);
    if (!linkComments) return;
    linkComments.comments.edges.push({
      cursor: comment.id,
      node: { ...comment },
    });
    linkComments.comments = { ...linkComments.comments };
    linkComments.commentsCount++;
    set((state) => ({
      cacheLinkComments: new Map(state.cacheLinkComments).set(linkId, {
        ...linkComments,
      }),
    }));
  },
  updateCommentInCacheLinkComments: (linkId, commentId, comment) => {
    const linkComments = get().cacheLinkComments.get(linkId);
    if (!linkComments) return;
    const commentIndex = linkComments.comments.edges.findIndex(
      (edge) => edge.node.id === commentId
    );
    if (commentIndex === -1) return;
    linkComments.comments.edges[commentIndex].node = {
      ...linkComments.comments.edges[commentIndex].node,
      ...comment,
    };
    linkComments.comments = { ...linkComments.comments };
    if (comment.hasOwnProperty("revoke")) {
      if (comment.revoke) {
        linkComments.commentsCount--;
      } else {
        linkComments.commentsCount++;
      }
    }
    set((state) => ({
      cacheLinkComments: new Map(state.cacheLinkComments).set(linkId, {
        ...linkComments,
      }),
    }));
  },
  removeCommentFromCacheLinkComments: (linkId, commentId) => {
    const linkComments = get().cacheLinkComments.get(linkId);
    if (!linkComments) return;
    const commentIndex = linkComments.comments.edges.findIndex(
      (edge) => edge.node.id === commentId
    );
    if (commentIndex === -1) return;
    linkComments.comments.edges.splice(commentIndex, 1);
    linkComments.comments = { ...linkComments.comments };
    linkComments.commentsCount--;
    set((state) => ({
      cacheLinkComments: new Map(state.cacheLinkComments).set(linkId, {
        ...linkComments,
      }),
    }));
  },

  addOneToFetchingCommentsLinkIds: (linkId) => {
    fetchingCommentsLinkIds.add(linkId);
    set(() => {
      const updatedSet = new Set(fetchingCommentsLinkIds);
      updatedSet.add(linkId);
      return { fetchingCommentsLinkIds: updatedSet };
    });
  },
  removeOneFromFetchingCommentsLinkIds: (linkId) => {
    set(() => {
      const updatedSet = new Set(fetchingCommentsLinkIds);
      updatedSet.delete(linkId);
      return { fetchingCommentsLinkIds: updatedSet };
    });
  },

  addOneToCommentingLinkIds: (linkId: string) => {
    set((state) => {
      const updatedSet = new Set(state.commentingLinkIds);
      updatedSet.add(linkId);
      return { commentingLinkIds: updatedSet };
    });
  },
  removeOneFromCommentingLinkIds: (linkId: string) => {
    set((state) => {
      const updatedSet = new Set(state.commentingLinkIds);
      updatedSet.delete(linkId);
      return { commentingLinkIds: updatedSet };
    });
  },
});
