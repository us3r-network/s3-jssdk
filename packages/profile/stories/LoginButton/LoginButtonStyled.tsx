import styled from "styled-components";
import {
  LoginButton as LoginButtonRoot,
  LoginButtonProps,
} from "@us3r-network/profile";
import { UserAvatar, UserName } from "@us3r-network/profile/ui";

export default function ({ ...otherProps }: LoginButtonProps) {
  return (
    <StyledLoginButton {...otherProps}>
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
    </StyledLoginButton>
  );
}

const StyledLoginButton = styled(LoginButtonRoot)`
  height: 48px;
  padding: 12px 24px;
  box-sizing: border-box;

  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    pointer-events: auto;
    opacity: 0.5;
  }

  border: 1px solid #39424c;
  border-radius: 12px;
  background-color: #1a1e23;
  color: #718096;

  &:disabled {
    cursor: not-allowed;
    pointer-events: auto;
    opacity: 0.5;
    background-color: #14171a;
  }

  &:not(:disabled):hover {
    border: 1px solid #aaa;
    background-color: #14171a;
  }

  .userAvatar {
    width: 28px;
    height: 28px;
  }
`;
