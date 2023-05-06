import { StateCreator } from "zustand";
import { LinkSlice } from "./link";
import { linkDataFieldFilling } from "../utils/store";
import { Comment } from "../data-model";

export interface CommentSlice {
  commentingLinkIds: Set<string>;
  addOneToCommentingLinkIds: (linkId: string) => void;
  removeOneFromCommentingLinkIds: (linkId: string) => void;
  addCommentToCacheLinks: (linkId: string, comment: Comment) => void;
  updateCommentInCacheLinks: (
    linkId: string,
    commentId: string,
    comment: Partial<Comment>
  ) => void;
  removeCommentFromCacheLinks: (linkId: string, commentId: string) => void;
}

export const createCommentSlice: StateCreator<
  LinkSlice & CommentSlice,
  [],
  [],
  CommentSlice
> = (set, get) => ({
  commentingLinkIds: new Set(),
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
  addCommentToCacheLinks: (linkId, comment) => {
    const link = get().cacheLinks.get(linkId);
    if (!link) return;
    const newLink = linkDataFieldFilling(link);
    newLink.comments.edges.push({
      cursor: comment.id,
      node: { ...comment },
    });
    newLink.commentsCount++;
    set((state) => ({
      cacheLinks: new Map(state.cacheLinks).set(linkId, newLink),
    }));
  },
  updateCommentInCacheLinks: (linkId, commentId, comment) => {
    const link = get().cacheLinks.get(linkId);
    if (!link) return;
    const newLink = linkDataFieldFilling(link);
    const commentIndex = newLink.comments.edges.findIndex(
      (edge) => edge.node.id === commentId
    );
    if (commentIndex === -1) return;
    newLink.comments.edges[commentIndex].node = {
      ...newLink.comments.edges[commentIndex].node,
      ...comment,
    };
    if (comment.hasOwnProperty("revoke")) {
      if (comment.revoke) {
        newLink.commentsCount--;
      } else {
        newLink.commentsCount++;
      }
    }
    set((state) => ({
      cacheLinks: new Map(state.cacheLinks).set(linkId, newLink),
    }));
  },
  removeCommentFromCacheLinks: (linkId, commentId) => {
    const link = get().cacheLinks.get(linkId);
    if (!link) return;
    const newLink = linkDataFieldFilling(link);
    const commentIndex = newLink.comments.edges.findIndex(
      (edge) => edge.node.id === commentId
    );
    if (commentIndex === -1) return;
    newLink.comments.edges.splice(commentIndex, 1);
    newLink.commentsCount--;
    set((state) => ({
      cacheLinks: new Map(state.cacheLinks).set(linkId, newLink),
    }));
  },
});
