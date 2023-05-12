import { HTMLAttributes, useMemo } from "react";
import { ChildrenRenderProps, childrenRender } from "../../../utils/props";
import * as CommentsElements from "./CommentsElements";
import { CommentsContext, CommentsContextValue } from "./CommentsContext";
import { CommentsDefaultChildren } from "./CommentsDefaultChildren";
import { useLink } from "../../../hooks/useLink";

export interface CommentsIncomingProps {
  linkId: string;
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
  const { isFetching, link } = useLink(linkId);

  const comments = useMemo(
    () =>
      (isFetching ? [] : link?.comments?.edges?.map((e) => e.node) || []).sort(
        (a, b) => {
          const aTime = new Date(a.createAt).getTime();
          const bTime = new Date(b.createAt).getTime();
          if (order === "asc") {
            return aTime - bTime;
          } else {
            return bTime - aTime;
          }
        }
      ),
    [link, isFetching, order]
  );

  const commentsCount = useMemo(() => link?.commentsCount || 0, [link]);

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
