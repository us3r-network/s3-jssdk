/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-07-26 14:57:29
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-13 17:14:02
 * @FilePath: /s3-jssdk/packages/link/src/components/Score/reviews/ScoreReviews.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { HTMLAttributes, useState } from "react";
import { ChildrenRenderProps, childrenRender } from "../../../utils/props";
import ScoreReviewsElements from "./ScoreReviewsElements";
import {
  ScoreReviewsContext,
  ScoreReviewsContextValue,
} from "./ScoreReviewsContext";
import { ScoreReviewsDefaultChildren } from "./ScoreReviewsDefaultChildren";
import { useLinkScores } from "../../../hooks/useLinkScores";
import { Link } from "@us3r-network/data-model";
import { useLinks } from "../../../hooks/useLinks";
export interface ScoreReviewsIncomingProps {
  /**
   * link stream id.
   */
  linkId: string;
  /**
   * link params include url and type.
   */
  link?: Link;
  /**
   * order of the reviews
   */
  order?: "asc" | "desc";
}

export interface ScoreReviewsProps
  extends ChildrenRenderProps<
      HTMLAttributes<HTMLDivElement>,
      ScoreReviewsContextValue
    >,
    ScoreReviewsIncomingProps {}

function ScoreReviewsRoot({
  linkId,
  link,
  order = "desc",
  children,
  ...props
}: ScoreReviewsProps) {
  const {linkId:unknownLinkId} = useLinks(link);
  const { isFetching, scores } = useLinkScores(linkId||unknownLinkId, { order });

  const businessProps = {
    "data-us3r-component": "ScoreReviews",
    "data-loading": isFetching || undefined,
  };
  const contextValue = {
    linkId,
    link,
    isLoading: isFetching,
    scores,
  };
  return (
    <div {...businessProps} {...props}>
      <ScoreReviewsContext.Provider value={contextValue}>
        {childrenRender(
          children,
          contextValue,
          <ScoreReviewsDefaultChildren />
        )}
      </ScoreReviewsContext.Provider>
    </div>
  );
}

export const ScoreReviews = Object.assign(ScoreReviewsRoot, {
  ...ScoreReviewsElements,
});
