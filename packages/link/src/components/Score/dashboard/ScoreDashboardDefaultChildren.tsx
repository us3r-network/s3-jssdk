import * as ScoreDashboard from "./ScoreDashboardElements";
import { SCORE_VALUE_MAX } from "../../../constants";
import RatingStarSelect from "../../common/RatingStar/RatingStarSelect";
import { ProgressBar } from "react-aria-components";

export function ScoreDashboardDefaultChildren() {
  return (
    <>
      <div data-layout-element="ScoresAvgAndCount">
        <ScoreDashboard.ScoresAvg>
          {({ scoresAvg }) => {
            return (
              <>
                <span data-layout-element="ScoresAvg">
                  <span data-layout-element="AvgValue">{scoresAvg}</span>
                  <span data-layout-element="TotalValue">
                    /{SCORE_VALUE_MAX}
                  </span>
                </span>
                <RatingStarSelect value={scoresAvg} />
              </>
            );
          }}
        </ScoreDashboard.ScoresAvg>
        <ScoreDashboard.ScoresCount>
          {({ scoresCount }) => `${scoresCount} global ratings`}
        </ScoreDashboard.ScoresCount>
      </div>
      <span data-layout-element="DividingLine"></span>
      <div data-layout-element="ScoreValuePercentages">
        {[...Array(SCORE_VALUE_MAX)].map((_, index) => {
          const scoreValue = index + 1;
          return (
            <ScoreDashboard.ScoreValuePercentage
              value={scoreValue}
              key={scoreValue}
            >
              {({ percentage }) => {
                return (
                  <>
                    <span data-layout-element="ScoreValue">
                      {scoreValue} star
                    </span>
                    <ProgressBar
                      value={percentage}
                      data-layout-element="ProgressBar"
                    >
                      <div
                        data-layout-element="ProgressFill"
                        style={{
                          width: percentage + "%",
                        }}
                      />
                    </ProgressBar>
                    <span data-layout-element="ScorePercentage">
                      {percentage}%
                    </span>
                  </>
                );
              }}
            </ScoreDashboard.ScoreValuePercentage>
          );
        })}
      </div>
    </>
  );
}
