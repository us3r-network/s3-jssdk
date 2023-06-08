import { FavorButton, FavorButtonProps } from "@us3r-network/link";
import { ReactComponent as FavorIcon } from "@material-design-icons/svg/round/favorite_border.svg";
import { ReactComponent as FavoredIcon } from "@material-design-icons/svg/round/favorite.svg";
import LoadingSpokes from "../common/loading/LoadingSpokes";
import styles from "./FavorButton.module.css";

export default function ({ className = "", ...props }: FavorButtonProps) {
  return (
    <FavorButton className={`${styles.FavorButton} ${className}`} {...props}>
      {({ isFavoring, isFavored, favorsCount }) => {
        return (
          <>
            {(() => {
              if (isFavoring) {
                return <LoadingSpokes className={styles.Icon} />;
              }
              if (isFavored) {
                return <FavoredIcon className={styles.Icon} />;
              }
              return <FavorIcon className={styles.Icon} />;
            })()}
            <span className={styles.Count}>{favorsCount || 0}</span>
          </>
        );
      }}
    </FavorButton>
  );
}
