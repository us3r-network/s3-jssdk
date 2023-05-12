import { HTMLAttributes, useMemo } from "react";
import { ChildrenRenderProps, childrenRender } from "../../../utils/props";
import * as ScoreReviewsElements from "./ScoreReviewsElements";
import {
  ScoreReviewsContext,
  ScoreReviewsContextValue,
} from "./ScoreReviewsContext";
import { useLink } from "../../../hooks/useLink";
import { ScoreReviewsDefaultChildren } from "./ScoreReviewsDefaultChildren";
import { getScoresFromLink } from "../../../utils/score";

export interface ScoreReviewsIncomingProps {
  linkId: string;
}

export interface ScoreReviewsProps
  extends ChildrenRenderProps<
      HTMLAttributes<HTMLDivElement>,
      ScoreReviewsContextValue
    >,
    ScoreReviewsIncomingProps {}

function ScoreReviewsRoot({ linkId, children, ...props }: ScoreReviewsProps) {
  const { isFetching, link } = useLink(linkId);
  const scores = useMemo(
    () => (!isFetching && link ? getScoresFromLink(link) : []),
    [isFetching, link]
  );

  const businessProps = {
    "data-us3r-scores": "",
    "data-loading": isFetching || undefined,
  };
  const contextValue = {
    linkId,
    loading: isFetching,
    scores,
  };
  return (
    <div {...props} {...businessProps}>
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
