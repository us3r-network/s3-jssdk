import { createContext, useContext } from "react";
import { Comment } from "@us3r-network/data-model";

export interface CommentsContextValue {
  linkId: string;
  isLoading: boolean;
  comments: Comment[];
  commentsCount: number;
}

export const CommentsContext = createContext<CommentsContextValue | null>(null);

export function useCommentsState() {
  const context = useContext(CommentsContext);
  if (!context) {
    throw new Error(
      "useCommentsState can only be used within the Comments component"
    );
  }
  return context;
}

export const CommentsItemContext = createContext<Comment>(null!);

export function useCommentsItemState() {
  const context = useContext(CommentsItemContext);
  if (!context) {
    throw new Error(
      "useCommentsItemState can only be used within the Comments.Item component"
    );
  }
  return context;
}
