import { HTMLAttributes, useMemo, useState } from "react";
import { ChildrenRenderProps, childrenRender } from "../../../utils/props";
import ScoreDashboardElements from "./ScoreDashboardElements";
import {
  ScoreDashboardContext,
  ScoreDashboardContextValue,
} from "./ScoreDashboardContext";
import { ScoreDashboardDefaultChildren } from "./ScoreDashboardDefaultChildren";
import { SCORE_VALUE_MAX, SCORE_VALUE_MIN } from "../../../constants";
import { getScoresAvgFromScores } from "../../../utils/score";
import { useLinkScores } from "../../../hooks/useLinkScores";
import { Link } from "@us3r-network/data-model";
import { useLinks } from "../../../hooks/useLinks";

export interface ScoreDashboardIncomingProps {
  /**
   * link stream id.
   */
  linkId: string;
  /**
   * link params include url and type.
   */
  link?: Link;
}

export interface ScoreDashboardProps
  extends ChildrenRenderProps<
      HTMLAttributes<HTMLDivElement>,
      ScoreDashboardContextValue
    >,
    ScoreDashboardIncomingProps {}

function ScoreDashboardRoot({
  linkId,
  link,
  children,
  ...props
}: ScoreDashboardProps) {
  const [currentLinkId, setCurrentLinkId] = useState<string>(linkId);
  const {getLinkId} = useLinks()
  if (!linkId && link)
    getLinkId(link).then((id) => {
      if(id) setCurrentLinkId(id);
    });
  const { isFetching, scores, scoresCount } = useLinkScores(currentLinkId);
  const scoresAvg = useMemo(
    () => getScoresAvgFromScores(scores, scoresCount),
    [scores, scoresCount]
  );

  const values = useMemo(() => scores.map((score) => score.value), [scores]);

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
    <div {...businessProps} {...props}>
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
