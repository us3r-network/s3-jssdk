import { ScoreDashboard, ScoreDashboardProps } from "@us3r-network/link";
import { ProgressBar } from "react-aria-components";
import { SCORE_VALUE_MAX } from "../../../constants";
import RatingStarSelect from "../../common/rating-star/RatingStarSelect";
import styles from "./ScoreDashboard.module.css";

export default function ({ className = "", ...props }: ScoreDashboardProps) {
  return (
    <ScoreDashboard
      className={`${styles.ScoreDashboard} ${className}`}
      {...props}
    >
      <div className={styles.ScoresAvgAndCount}>
        <ScoreDashboard.ScoresAvg className={styles.ScoresAvgWrap}>
          {({ scoresAvg }) => {
            return (
              <>
                <span>
                  <span className={styles.AvgValue}>{scoresAvg}</span>
                  <span className={styles.TotalValue}>/{SCORE_VALUE_MAX}</span>
                </span>
                <RatingStarSelect value={scoresAvg} />
              </>
            );
          }}
        </ScoreDashboard.ScoresAvg>
        <ScoreDashboard.ScoresCount className={styles.ScoresCount}>
          {({ scoresCount }) => `${scoresCount} global ratings`}
        </ScoreDashboard.ScoresCount>
      </div>
      <span className={styles.DividingLine}></span>
      <div className={styles.ScoreValuePercentages}>
        {[...Array(SCORE_VALUE_MAX)].map((_, index) => {
          const scoreValue = SCORE_VALUE_MAX - index;
          return (
            <ScoreDashboard.ScoreValuePercentage
              className={styles.ScoreValuePercentage}
              value={scoreValue}
              key={scoreValue}
            >
              {({ percentage }) => {
                return (
                  <>
                    <span className={styles.ScoreValue}>{scoreValue} star</span>
                    <ProgressBar
                      aria-label={`${percentage}% for {scoreValue} star`}
                      value={percentage}
                      className={styles.ProgressBar}
                    >
                      <div
                        style={{
                          width: percentage + "%",
                        }}
                        className={styles.ProgressFill}
                      />
                    </ProgressBar>
                    <span className={styles.ScorePercentage}>
                      {percentage}%
                    </span>
                  </>
                );
              }}
            </ScoreDashboard.ScoreValuePercentage>
          );
        })}
      </div>
    </ScoreDashboard>
  );
}
