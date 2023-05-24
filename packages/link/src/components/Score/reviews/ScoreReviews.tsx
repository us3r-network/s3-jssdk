import { HTMLAttributes } from "react";
import { ChildrenRenderProps, childrenRender } from "../../../utils/props";
import * as ScoreReviewsElements from "./ScoreReviewsElements";
import {
  ScoreReviewsContext,
  ScoreReviewsContextValue,
} from "./ScoreReviewsContext";
import { ScoreReviewsDefaultChildren } from "./ScoreReviewsDefaultChildren";
import { useScores } from "../../../hooks/useScores";

export interface ScoreReviewsIncomingProps {
  linkId: string;
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
  order = "desc",
  children,
  ...props
}: ScoreReviewsProps) {
  const { isFetching, scores } = useScores(linkId, { order });

  const businessProps = {
    "data-us3r-component": "ScoreReviews",
    "data-loading": isFetching || undefined,
  };
  const contextValue = {
    linkId,
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
