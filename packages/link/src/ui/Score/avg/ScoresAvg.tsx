import { ScoresAvg, ScoresAvgProps } from "@us3r-network/link";
import LoadingSpokes from "../../common/loading/LoadingSpokes";
import { ActivatedStarIcon } from "../../common/rating-star/StarIcon";
import styles from "./ScoresAvg.module.css";

export default function ({ className = "", ...props }: ScoresAvgProps) {
  return (
    <ScoresAvg className={`${styles.ScoresAvg} ${className}`} {...props}>
      {({ isLoading, scoresAvg }) => {
        if (isLoading) {
          return <LoadingSpokes className={styles.LoadingSpokes} />;
        }
        return (
          <>
            <ActivatedStarIcon />
            <span>{scoresAvg}</span>
          </>
        );
      }}
    </ScoresAvg>
  );
}
