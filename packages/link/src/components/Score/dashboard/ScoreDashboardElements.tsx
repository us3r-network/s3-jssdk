import { HTMLAttributes } from "react";
import { useScoreDashboardState } from "./ScoreDashboardContext";
import { ChildrenRenderProps, childrenRender } from "../../../utils/props";

export function ScoresAvg({
  children,
  ...props
}: ChildrenRenderProps<
  HTMLAttributes<HTMLSpanElement>,
  {
    scoresAvg: number;
  }
>) {
  const { scoresAvg } = useScoreDashboardState();
  return (
    <span data-state-element="ScoresAvg" {...props}>
      {childrenRender(children, { scoresAvg }, scoresAvg)}
    </span>
  );
}

export function ScoresCount({
  children,
  ...props
}: ChildrenRenderProps<
  HTMLAttributes<HTMLSpanElement>,
  {
    scoresCount: number;
  }
>) {
  const { scoresCount } = useScoreDashboardState();
  return (
    <span data-state-element="ScoresCount" {...props}>
      {childrenRender(children, { scoresCount }, scoresCount)}
    </span>
  );
}

export function ScoreValueCount({
  children,
  value,
  ...props
}: ChildrenRenderProps<
  HTMLAttributes<HTMLSpanElement>,
  {
    count: number;
  }
> & {
  value: number;
}) {
  const { scoreValuesCount } = useScoreDashboardState();
  const count = scoreValuesCount[value];
  return (
    <span data-state-element="ScoreValueCount" {...props}>
      {childrenRender(children, { count }, count)}
    </span>
  );
}

export function ScoreValuePercentage({
  children,
  value,
  ...props
}: ChildrenRenderProps<
  HTMLAttributes<HTMLSpanElement>,
  {
    percentage: number;
  }
> & {
  value: number;
}) {
  const { scoreValuesPercentage } = useScoreDashboardState();
  const percentage = scoreValuesPercentage[value];
  return (
    <span data-state-element="ScoreValuePercentage" {...props}>
      {childrenRender(children, { percentage }, percentage)}
    </span>
  );
}
