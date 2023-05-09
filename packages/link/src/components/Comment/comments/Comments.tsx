import { HTMLAttributes, useMemo } from "react";
import { ChildrenRenderProps, childrenRender } from "../../../utils/props";
import * as CommentsElements from "./CommentsElements";
import { CommentsContext, CommentsContextValue } from "./CommentsContext";
import { CommentsDefaultChildren } from "./CommentsDefaultChildren";
import { userLink } from "../../../hooks/link";

export interface CommentsIncomingProps {
  linkId: string;
}

export interface CommentsProps
  extends ChildrenRenderProps<
      HTMLAttributes<HTMLDivElement>,
      CommentsContextValue
    >,
    CommentsIncomingProps {}

function CommentsRoot({ linkId, children, ...props }: CommentsProps) {
  const { isFetching, link } = userLink(linkId);

  const comments = useMemo(
    () => (isFetching ? [] : link?.comments?.edges?.map((e) => e.node) || []),
    [link, isFetching]
  );

  const commentsCount = useMemo(() => link?.commentsCount || 0, [link]);

  const businessProps = {
    "data-us3r-comments": "",
    "data-loading": isFetching || undefined,
  };
  const contextValue = {
    linkId,
    loading: isFetching,
    comments,
    commentsCount,
  };
  return (
    <div {...props} {...businessProps}>
      <CommentsContext.Provider value={contextValue}>
        {childrenRender(children, contextValue, <CommentsDefaultChildren />)}
      </CommentsContext.Provider>
    </div>
  );
}

export const Comments = Object.assign(CommentsRoot, {
  ...CommentsElements,
});
