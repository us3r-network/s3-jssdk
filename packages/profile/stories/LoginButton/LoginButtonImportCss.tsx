import {
  LoginButton as LoginButtonRoot,
  LoginButtonProps,
} from "@us3r-network/profile";
import { UserAvatar, UserName } from "@us3r-network/profile/ui";
import "./LoginButton.css";

export default function ({ className = "", ...props }: LoginButtonProps) {
  return (
    <LoginButtonRoot className={`my-LoginButton ${className}`} {...props}>
      {({ isAuthenticated, isLoading }) =>
        isAuthenticated ? (
          <>
            <UserAvatar className="userAvatar" />
            <UserName />
          </>
        ) : (
          <span>{isLoading ? "logging..." : "Login"}</span>
        )
      }
    </LoginButtonRoot>
  );
}
