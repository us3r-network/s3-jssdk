import { createContext, useContext } from "react";

export interface CommentAddFormContextValue {
  text: string;
  setText: (text: string) => void;
  isCommenting: boolean;
  isDisabled: boolean;
  errMsg: string;
  submitComment: () => Promise<void>;
}

export const CommentAddFormContext =
  createContext<CommentAddFormContextValue | null>(null);

export function useCommentAddFormState() {
  const context = useContext(CommentAddFormContext);
  if (!context) {
    throw new Error(
      "useCommentAddFormState can only be used within the CommentAddForm component"
    );
  }
  return context;
}
