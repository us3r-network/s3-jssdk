import * as ScoreDashboard from "./ScoreDashboardElements";
import { SCORE_VALUE_MAX } from "../../../constants";
import RatingStarSelect from "../../common/RatingStar/RatingStarSelect";

export function ScoreDashboardDefaultChildren() {
  return (
    <>
      <div>
        <ScoreDashboard.ScoresAvg>
          {({ scoresAvg }) => {
            return (
              <>
                <RatingStarSelect value={scoresAvg} />
                {scoresAvg}/{SCORE_VALUE_MAX}
              </>
            );
          }}
        </ScoreDashboard.ScoresAvg>
        <p>
          <ScoreDashboard.ScoresCount /> global ratings
        </p>
      </div>
      <span></span>
      <div>
        {[...Array(SCORE_VALUE_MAX)].map((_, index) => {
          const value = index + 1;
          return (
            <p key={value}>
              <ScoreDashboard.ScoreValuesPercentage value={value}>
                {({ percentage }) => {
                  return (
                    <>
                      <span>{value} star</span>
                      <div
                        style={{
                          width: "100px",
                          height: "4px",
                          backgroundColor: "lightgray",
                        }}
                      >
                        <div
                          style={{
                            width: percentage + "%",
                            height: "4px",
                            backgroundColor: "slateblue",
                          }}
                        />
                      </div>
                      <span>{percentage}%</span>
                    </>
                  );
                }}
              </ScoreDashboard.ScoreValuesPercentage>
            </p>
          );
        })}
      </div>
    </>
  );
}
