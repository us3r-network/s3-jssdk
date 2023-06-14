import { UserAvatar, UserAvatarProps } from "@us3r-network/profile";
import LoadingSpokes from "../common/loading/LoadingSpokes";
import styles from "./UserAvatar.module.css";

export default function ({ className = "", ...props }: UserAvatarProps) {
  return (
    <UserAvatar className={`${styles.UserAvatar} ${className}`} {...props}>
      {({ isLoading, avatarSrc }) =>
        isLoading ? (
          <LoadingSpokes className={styles.LoadingSpokes} />
        ) : (
          <img className={styles.AvatarImg} src={avatarSrc} />
        )
      }
    </UserAvatar>
  );
}
