import { LoginButton, LoginButtonProps } from "@us3r-network/profile";
import { UserAvatarExample } from "../UserAvatar/UserAvatarExample";
import { UserNameExample } from "../UserName/UserNameExample";
import "./LoginButton.css";

export interface LoginButtonExampleProps extends LoginButtonProps {}

export function LoginButtonExample({ ...otherProps }: LoginButtonExampleProps) {
  return (
    <LoginButton className="us3r-LoginButton" {...otherProps}>
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
