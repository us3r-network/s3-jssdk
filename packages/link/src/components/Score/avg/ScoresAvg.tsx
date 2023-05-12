import { HTMLAttributes, useMemo } from "react";
import { ChildrenRenderProps, childrenRender } from "../../../utils/props";
import { useLink } from "../../../hooks/useLink";
import { getScoresAvgFromLink } from "../../../utils/score";
import { StarIcon } from "../../common/RatingStar/StarIcon";

export interface ScoresAvgIncomingProps {
  linkId: string;
}
export interface ScoresAvgRenderProps {
  loading: boolean;
  scoresAvg: number;
}

export interface ScoresAvgProps
  extends ChildrenRenderProps<
      HTMLAttributes<HTMLSpanElement>,
      ScoresAvgRenderProps
    >,
    ScoresAvgIncomingProps {}

export function ScoresAvg({ linkId, children, ...props }: ScoresAvgProps) {
  const { isFetching, link } = useLink(linkId);
  const scoresAvg = useMemo(
    () => (link ? getScoresAvgFromLink(link) : 0),
    [link]
  );

  const businessProps = {
    "data-us3r-scores-avg": "",
    "data-loading": isFetching || undefined,
  };
  const renderProps = {
    loading: isFetching,
    scoresAvg,
  };

  return (
    <span {...props} {...businessProps}>
      {childrenRender(
        children,
        renderProps,
        <ScoresAvgDefaultChildren {...renderProps} />
      )}
    </span>
  );
}

function ScoresAvgDefaultChildren({
  loading,
  scoresAvg,
}: ScoresAvgRenderProps) {
  return !loading ? (
    <>
      <StarIcon />
      <span>{scoresAvg}</span>
    </>
  ) : null;
}
