import { HTMLAttributes, useMemo, useState } from "react";
import { ChildrenRenderProps, childrenRender } from "../../../utils/props";
import { getScoresAvgFromScores } from "../../../utils/score";
import { ActivatedStarIcon } from "../../common/RatingStar/StarIcon";
import { useLinkScores } from "../../../hooks/useLinkScores";
import { Link } from "@us3r-network/data-model";
import { useLinks } from "../../../hooks/useLinks";
export interface ScoresAvgIncomingProps {
  /** The link id to get the scores from */
  linkId: string;
  /**
   * link params include url and type.
   */
  link?: Link;
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

export function ScoresAvg({ 
    linkId,
    link, 
    children,
    ...props 
}: ScoresAvgProps) {
  const [currentLinkId, setCurrentLinkId] = useState<string>(linkId);
  const {getLinkId} = useLinks()
  if (!linkId && link)
    getLinkId(link).then((id) => {
      if(id) setCurrentLinkId(id);
    });
  const { isFetching, scores, scoresCount } = useLinkScores(currentLinkId);
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
