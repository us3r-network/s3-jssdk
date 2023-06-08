import { LoginButton, LoginButtonProps } from "@us3r-network/profile";
import UserAvatar from "../UserAvatar/UserAvatar";
import UserName from "../UserName/UserName";
import styles from "./LoginButton.module.css";

export default function ({ className = "", ...props }: LoginButtonProps) {
  return (
    <LoginButton className={`${styles.LoginButton} ${className}`} {...props}>
      {({ isAuthenticated, isLoading }) =>
        isAuthenticated ? (
          <>
            <UserAvatar className={styles.UserAvatar} />
            <UserName />
          </>
        ) : (
          <span>{isLoading ? "logging..." : "Login"}</span>
        )
      }
    </LoginButton>
  );
}
