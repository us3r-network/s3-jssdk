/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-07-19 11:24:59
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-13 11:15:35
 * @FilePath: /s3-jssdk/packages/link/src/components/Comment/comments/CommentsContext.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createContext, useContext } from "react";
import { Comment, Link } from "@us3r-network/data-model";

export interface CommentsContextValue {
  linkId: string;
  link?: Link;
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
