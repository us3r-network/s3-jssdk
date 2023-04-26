import styled from "styled-components";
import { LoginButton, LoginButtonProps } from "./LoginButton";
import { UserAvatarDefault } from "../UserAvatar";
import { UserNameDefault } from "../UserName";
import { ButtonBaseCss } from "../../styles/button";

export interface LoginButtonDefaultProps extends LoginButtonProps {
  className?: string;
  avatarClassName?: string;
  nameTextClassName?: string;
  loginTextClassName?: string;
}

export function LoginButtonDefault({
  className = "us3r-LoginButton",
  avatarClassName = "us3r-LoginButton__avatar",
  nameTextClassName = "us3r-LoginButton__text--name",
  loginTextClassName = "us3r-LoginButton__text--login",
  ...otherProps
}: LoginButtonDefaultProps) {
  return (
    <StyledLoginButton className={className} {...otherProps}>
      {({ isAuthenticated }) =>
        isAuthenticated ? (
          <>
            <UserAvatarDefault className={avatarClassName} />
            <UserNameDefault className={nameTextClassName} />
          </>
        ) : (
          <span className={loginTextClassName}>Login</span>
        )
      }
    </StyledLoginButton>
  );
}

const StyledLoginButton = styled(LoginButton)`
  ${ButtonBaseCss}
`;
