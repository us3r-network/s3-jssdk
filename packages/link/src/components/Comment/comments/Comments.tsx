/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-07-26 14:57:29
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-13 11:14:41
 * @FilePath: /s3-jssdk/packages/link/src/components/Comment/comments/Comments.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { HTMLAttributes, useState } from "react";
import { ChildrenRenderProps, childrenRender } from "../../../utils/props";
import CommentsElements from "./CommentsElements";
import { CommentsContext, CommentsContextValue } from "./CommentsContext";
import { CommentsDefaultChildren } from "./CommentsDefaultChildren";
import { useLinkComments } from "../../../hooks/useLinkComments";
import { Link } from "@us3r-network/data-model";
import { useLinks } from "../../../hooks/useLinks";

export interface CommentsIncomingProps {
  /**
   * link stream id.
   */
  linkId: string;
  /**
   * link params include url and type.
   */
  link?: Link;
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
  link,
  order = "desc",
  children,
  ...props
}: CommentsProps) {
  const [currentLinkId, setCurrentLinkId] = useState<string>(linkId);
  const {getLinkId} = useLinks()
  if (!linkId && link)
    getLinkId(link).then((id) => {
      if(id) setCurrentLinkId(id);
    });
  const { isFetching, comments, commentsCount } = useLinkComments(currentLinkId, {
    order,
  });

  const businessProps = {
    "data-us3r-component": "Comments",
    "data-loading": isFetching || undefined,
  };
  const contextValue = {
    linkId,
    link,
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
