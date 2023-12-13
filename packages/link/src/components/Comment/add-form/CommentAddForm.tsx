/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-07-19 11:24:59
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-13 11:20:48
 * @FilePath: /s3-jssdk/packages/link/src/components/Comment/add-form/CommentAddForm.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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
import { Link } from "@us3r-network/data-model";

export interface CommentAddFormIncomingProps {
  /**
   * link stream id.
   */
  linkId: string;  
  /**
   * link params include url and type.
   */
  link?: Link;
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
  link,
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

  const { isCommenting, isDisabled, onComment } = useCommentAction(linkId, link, {
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
