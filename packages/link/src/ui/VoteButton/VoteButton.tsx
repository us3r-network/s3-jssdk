import { VoteButton, VoteButtonProps } from "@us3r-network/link";
import { ReactComponent as VoteIcon } from "@material-design-icons/svg/filled/thumb_up_off_alt.svg";
import { ReactComponent as VotedIcon } from "@material-design-icons/svg/filled/thumb_up_alt.svg";
import LoadingSpokes from "../common/loading/LoadingSpokes";
import styles from "./VoteButton.module.css";

export default function ({ className = "", ...props }: VoteButtonProps) {
  return (
    <VoteButton className={`${styles.VoteButton} ${className}`} {...props}>
      {({ isVoting, isVoted, votesCount }) => {
        return (
          <>
            {(() => {
              if (isVoting) {
                return <LoadingSpokes className={styles.Icon} />;
              }
              if (isVoted) {
                return <VotedIcon className={styles.Icon} />;
              }
              return <VoteIcon className={styles.Icon} />;
            })()}
            <span className={styles.Count}>{votesCount || 0}</span>
          </>
        );
      }}
    </VoteButton>
  );
}
