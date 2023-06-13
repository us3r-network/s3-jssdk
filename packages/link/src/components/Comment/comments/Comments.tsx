import { HTMLAttributes } from "react";
import { ChildrenRenderProps, childrenRender } from "../../../utils/props";
import CommentsElements from "./CommentsElements";
import { CommentsContext, CommentsContextValue } from "./CommentsContext";
import { CommentsDefaultChildren } from "./CommentsDefaultChildren";
import { useComments } from "../../../hooks/useComments";

export interface CommentsIncomingProps {
  /**
   * link stream id.
   */
  linkId: string;
  /**
   * order of the comments
   * @default "desc"
   */
  order?: "asc" | "desc";
}

export interface CommentsProps
  extends ChildrenRenderProps<
      HTMLAttributes<HTMLDivElement>,
      CommentsContextValue
    >,
    CommentsIncomingProps {}

function CommentsRoot({
  linkId,
  order = "desc",
  children,
  ...props
}: CommentsProps) {
  const { isFetching, comments, commentsCount } = useComments(linkId, {
    order,
  });

  const businessProps = {
    "data-us3r-component": "Comments",
    "data-loading": isFetching || undefined,
  };
  const contextValue = {
    linkId,
    isLoading: isFetching,
    comments,
    commentsCount,
  };
  return (
    <div {...businessProps} {...props}>
      <CommentsContext.Provider value={contextValue}>
        {childrenRender(children, contextValue, <CommentsDefaultChildren />)}
      </CommentsContext.Provider>
    </div>
  );
}

export const Comments = Object.assign(CommentsRoot, {
  ...CommentsElements,
});
