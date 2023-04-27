import styled from "styled-components";
import { LogoutButton, LogoutButtonProps } from "@us3r-network/profile";

export interface LogoutButtonExampleProps extends LogoutButtonProps {
  className?: string;
}

export function LogoutButtonExample({
  className = "us3r-LogoutButton",
  ...otherProps
}: LogoutButtonExampleProps) {
  return (
    <StyledLogoutButton className={className} {...otherProps}>
      {({ isAuthenticated }) => (isAuthenticated ? "Logout" : "unauthorized")}
    </StyledLogoutButton>
  );
}

const StyledLogoutButton = styled(LogoutButton)`
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
