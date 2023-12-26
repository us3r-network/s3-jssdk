/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-07-26 14:57:29
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-13 17:13:50
 * @FilePath: /s3-jssdk/packages/link/src/components/Score/avg/ScoresAvg.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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
  const {linkId:unknownLinkId} = useLinks(link);
  const { isFetching, scores, scoresCount } = useLinkScores(linkId||unknownLinkId);
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
