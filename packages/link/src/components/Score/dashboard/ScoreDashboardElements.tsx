import { HTMLAttributes } from "react";
import { useScoreDashboardState } from "./ScoreDashboardContext";
import { ChildrenRenderProps, childrenRender } from "../../../utils/props";

export function ScoresAvg({
  children,
  ...props
}: ChildrenRenderProps<
  HTMLAttributes<HTMLDivElement>,
  {
    scoresAvg: number;
  }
>) {
  const { scoresAvg } = useScoreDashboardState();
  return (
    <div data-avg="" {...props}>
      {childrenRender(children, { scoresAvg }, scoresAvg)}
    </div>
  );
}

export function ScoresCount({
  children,
  ...props
}: ChildrenRenderProps<
  HTMLAttributes<HTMLDivElement>,
  {
    scoresCount: number;
  }
>) {
  const { scoresCount } = useScoreDashboardState();
  return (
    <div data-total-count="" {...props}>
      {childrenRender(children, { scoresCount }, scoresCount)}
    </div>
  );
}

export function ScoreValuesCount({
  children,
  value,
  ...props
}: ChildrenRenderProps<
  HTMLAttributes<HTMLDivElement>,
  {
    count: number;
  }
> & {
  value: number;
}) {
  const { scoreValuesCount } = useScoreDashboardState();
  const count = scoreValuesCount[value];
  return (
    <div data-values-count="" {...props}>
      {childrenRender(children, { count }, count)}
    </div>
  );
}

export function ScoreValuesPercentage({
  children,
  value,
  ...props
}: ChildrenRenderProps<
  HTMLAttributes<HTMLDivElement>,
  {
    percentage: number;
  }
> & {
  value: number;
}) {
  const { scoreValuesPercentage } = useScoreDashboardState();
  const percentage = scoreValuesPercentage[value];
  return (
    <div data-values-percentage="" {...props}>
      {childrenRender(children, { percentage }, percentage)}
    </div>
  );
}
