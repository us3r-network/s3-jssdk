import { HTMLAttributes, useMemo } from "react";
import { ChildrenRenderProps, childrenRender } from "../../../utils/props";
import { useLink } from "../../../hooks/useLink";
import { getScoresAvgFromLink } from "../../../utils/score";
import { StarIcon } from "../../common/RatingStar/StarIcon";

export interface ScoresAvgIncomingProps {
  linkId: string;
}
export interface ScoresAvgRenderProps {
  isLoading: boolean;
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
    "data-us3r-component": "ScoresAvg",
    "data-loading": isFetching || undefined,
  };
  const renderProps = {
    isLoading: isFetching,
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
  isLoading,
  scoresAvg,
}: ScoresAvgRenderProps) {
  return !isLoading ? (
    <>
      <StarIcon />
      <span>{scoresAvg}</span>
    </>
  ) : null;
}
