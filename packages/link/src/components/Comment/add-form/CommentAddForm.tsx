import { HTMLAttributes, useCallback, useEffect, useState } from "react";
import { ChildrenRenderProps, childrenRender } from "../../../utils/props";
import CommentAddFormElements from "./CommentAddFormElements";
import {
  CommentAddFormContext,
  CommentAddFormContextValue,
} from "./CommentAddFormContext";
import { CommentAddFormDefaultChildren } from "./CommentAddFormDefaultChildren";
import { useIsAuthenticated } from "@us3r-network/auth-with-rainbowkit";
import { useCommentAction } from "../../../hooks/useCommentAction";

export interface CommentAddFormIncomingProps {
  /**
   * link stream id.
   */
  linkId: string;
  /**
   * callback when comment is successfully added.
   */
  onSuccessfullyComment?: () => void;
  /**
   * callback when comment is failed to add.
   * @param errMsg error message.
   */
  onFailedComment?: (errMsg: string) => void;
}

export interface CommentAddFormProps
  extends ChildrenRenderProps<
      HTMLAttributes<HTMLFormElement>,
      CommentAddFormContextValue
    >,
    CommentAddFormIncomingProps {}

function CommentAddFormRoot({
  linkId,
  children,
  onSuccessfullyComment,
  onFailedComment,
  ...props
}: CommentAddFormProps) {
  const isAuthenticated = useIsAuthenticated();
  const [text, setText] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    setErrMsg("");
  }, [text]);

  const { isCommenting, isDisabled, onComment } = useCommentAction(linkId, {
    onSuccessfullyComment,
    onFailedComment: (errMsg) => {
      setErrMsg(errMsg);
      onFailedComment?.(errMsg);
    },
  });

  const submitComment = useCallback(() => onComment(text), [text, onComment]);

  const businessProps = {
    "data-us3r-component": "CommentAddForm",
    "data-authenticated": isAuthenticated || undefined,
    "data-commenting": isCommenting || undefined,
    "data-disabled": isDisabled || undefined,
  };
  const contextValue = {
    text,
    setText,
    isCommenting,
    isDisabled,
    errMsg,
    submitComment,
  };
  return (
    <form {...businessProps} {...props}>
      <CommentAddFormContext.Provider value={contextValue}>
        {childrenRender(
          children,
          contextValue,
          <CommentAddFormDefaultChildren />
        )}
      </CommentAddFormContext.Provider>
    </form>
  );
}

export const CommentAddForm = Object.assign(CommentAddFormRoot, {
  ...CommentAddFormElements,
});
