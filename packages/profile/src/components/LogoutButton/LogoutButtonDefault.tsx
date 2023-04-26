import styled from "styled-components";
import { LogoutButton, LogoutButtonProps } from "./LogoutButton";
import { ButtonBaseCss } from "../../styles/button";

export interface LogoutButtonDefaultProps extends LogoutButtonProps {
  className?: string;
}

export function LogoutButtonDefault({
  className = "us3r-LogoutButton",
  ...otherProps
}: LogoutButtonDefaultProps) {
  return (
    <StyledLogoutButton className={className} {...otherProps}>
      {({ isAuthenticated }) => (isAuthenticated ? "Logout" : "unauthorized")}
    </StyledLogoutButton>
  );
}

const StyledLogoutButton = styled(LogoutButton)`
  ${ButtonBaseCss}
`;
