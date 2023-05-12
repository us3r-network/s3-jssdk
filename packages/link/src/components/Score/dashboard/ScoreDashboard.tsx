import { HTMLAttributes, useMemo } from "react";
import { ChildrenRenderProps, childrenRender } from "../../../utils/props";
import * as ScoreDashboardElements from "./ScoreDashboardElements";
import {
  ScoreDashboardContext,
  ScoreDashboardContextValue,
} from "./ScoreDashboardContext";
import { ScoreDashboardDefaultChildren } from "./ScoreDashboardDefaultChildren";
import { useLink } from "../../../hooks/useLink";
import { SCORE_VALUE_MAX, SCORE_VALUE_MIN } from "../../../constants";
import {
  getScoresAvgFromScores,
  getScoresCountFromLink,
  getScoresFromLink,
} from "../../../utils/score";
export interface ScoreDashboardIncomingProps {
  linkId: string;
}

export interface ScoreDashboardProps
  extends ChildrenRenderProps<
      HTMLAttributes<HTMLDivElement>,
      ScoreDashboardContextValue
    >,
    ScoreDashboardIncomingProps {}

function ScoreDashboardRoot({
  linkId,
  children,
  ...props
}: ScoreDashboardProps) {
  const { isFetching, link } = useLink(linkId);
  const scores = useMemo(
    () => (!isFetching && link ? getScoresFromLink(link) : []),
    [isFetching, link]
  );
  const scoresCount = useMemo(
    () => (link ? getScoresCountFromLink(link) : 0),
    [link]
  );
  const scoresAvg = useMemo(
    () => getScoresAvgFromScores(scores, scoresCount),
    [scores, scoresCount]
  );

  const values = scores.map((score) => score.value);

  const scoreValuesCount = useMemo(() => {
    const counts = Array.from({ length: SCORE_VALUE_MAX + 1 }, () => 0);
    for (const value of values) {
      if (value >= SCORE_VALUE_MIN && value <= SCORE_VALUE_MAX) {
        counts[value]++;
      }
    }
    return counts;
  }, [values]);

  const scoreValuesPercentage = useMemo(() => {
    return scoreValuesCount.map((count) => {
      const percentage = Math.round((count / scoresCount) * 100);
      return Number.isNaN(percentage) ? 0 : percentage;
    });
  }, [scoreValuesCount, scoresCount]);

  const businessProps = {
    "data-us3r-component": "ScoreDashboard",
    "data-loading": isFetching || undefined,
  };
  const contextValue = {
    isLoading: isFetching,
    scoresCount,
    scoresAvg,
    scoreValuesCount,
    scoreValuesPercentage,
  };

  return (
    <div {...props} {...businessProps}>
      <ScoreDashboardContext.Provider value={contextValue}>
        {childrenRender(
          children,
          contextValue,
          <ScoreDashboardDefaultChildren />
        )}
      </ScoreDashboardContext.Provider>
    </div>
  );
}

export const ScoreDashboard = Object.assign(ScoreDashboardRoot, {
  ...ScoreDashboardElements,
});
