import { LoginButton, LoginButtonProps } from "@us3r-network/profile";
import { UserAvatarExample } from "../UserAvatar/UserAvatarExample";
import { UserNameExample } from "../UserName/UserNameExample";
import styles from "./LoginButton.module.css";

export interface LoginButtonExampleProps extends LoginButtonProps {}

export function LoginButtonExample({ ...otherProps }: LoginButtonExampleProps) {
  return (
    <LoginButton className={styles["us3r-LoginButton"]} {...otherProps}>
      {({ isAuthenticated, loading }) =>
        isAuthenticated ? (
          <>
            <UserAvatarExample />
            <UserNameExample />
          </>
        ) : (
          <span>{loading ? "logging..." : "Login"}</span>
        )
      }
    </LoginButton>
  );
}
