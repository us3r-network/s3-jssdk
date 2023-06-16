import { HTMLAttributes, useMemo } from "react";
import { ChildrenRenderProps, childrenRender } from "../../../utils/props";
import { getScoresAvgFromScores } from "../../../utils/score";
import { ActivatedStarIcon } from "../../common/RatingStar/StarIcon";
import { useScores } from "../../../hooks/useScores";

export interface ScoresAvgIncomingProps {
  /** The link id to get the scores from */
  linkId: string;
}
export interface ScoresAvgRenderProps {
  /**  Is the component loading */
  isLoading: boolean;
  /**  The average score */
  scoresAvg: number;
}

export interface ScoresAvgProps
  extends ChildrenRenderProps<
      HTMLAttributes<HTMLSpanElement>,
      ScoresAvgRenderProps
    >,
    ScoresAvgIncomingProps {}

export function ScoresAvg({ linkId, children, ...props }: ScoresAvgProps) {
  const { isFetching, scores, scoresCount } = useScores(linkId);
  const scoresAvg = useMemo(
    () => getScoresAvgFromScores(scores, scoresCount) || 0,
    [scores, scoresCount]
  );

  const businessProps = {
    "data-us3r-component": "ScoresAvg",
    "data-loading": isFetching || undefined,
  };
  const renderProps = {
    isLoading: isFetching,
    scoresAvg,
  };

  return (
    <span {...businessProps} {...props}>
      {childrenRender(
        children,
        renderProps,
        <ScoresAvgDefaultChildren {...renderProps} />
      )}
    </span>
  );
}

function ScoresAvgDefaultChildren({
  isLoading,
  scoresAvg,
}: ScoresAvgRenderProps) {
  return !isLoading ? (
    <>
      <ActivatedStarIcon />
      <span data-layout-element="AvgValue">{scoresAvg}</span>
    </>
  ) : null;
}
