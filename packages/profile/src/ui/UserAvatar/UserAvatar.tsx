import {
  UserAvatar as UserAvatarRoot,
  UserAvatarProps,
} from "@us3r-network/profile";
import LoadingSpokes from "../common/loading/LoadingSpokes";
import styles from "./UserAvatar.module.css";

const UserAvatar = ({ className = "", ...props }: UserAvatarProps) => {
  return (
    <UserAvatarRoot className={`${styles.UserAvatar} ${className}`} {...props}>
      {({ isLoading, avatarSrc }) =>
        isLoading ? (
          <LoadingSpokes className={styles.LoadingSpokes} />
        ) : (
          <img className={styles.AvatarImg} src={avatarSrc} />
        )
      }
    </UserAvatarRoot>
  );
};

export default UserAvatar;
