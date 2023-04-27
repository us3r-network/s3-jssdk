import styled from "styled-components";
import { LoginButton, LoginButtonProps } from "@us3r-network/profile";
import { UserAvatarExample } from "../UserAvatar/UserAvatarExample";
import { UserNameExample } from "../UserName/UserNameExample";

export interface LoginButtonExampleProps extends LoginButtonProps {}

export function LoginButtonExample({ ...otherProps }: LoginButtonExampleProps) {
  return (
    <StyledLoginButton {...otherProps}>
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
    </StyledLoginButton>
  );
}

const StyledLoginButton = styled(LoginButton)`
  box-sizing: border-box;

  /* Auto layout */

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  isolation: isolate;

  height: 40px;

  /* 🌘 $neutral/100 */

  background: #1a1e23;
  /* 🌘 $neutral/400 */

  border: 1px solid #39424c;
  border-radius: 12px;

  cursor: pointer;

  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  /* identical to box height, or 150% */

  text-align: center;

  /* #718096 */

  color: #718096;
`;
