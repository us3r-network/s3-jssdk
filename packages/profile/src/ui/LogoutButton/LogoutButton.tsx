import { LogoutButton, LogoutButtonProps } from "@us3r-network/profile";
import styles from "./LogoutButton.module.css";

export default function ({ className = "", ...props }: LogoutButtonProps) {
  return (
    <LogoutButton className={`${styles.LogoutButton} ${className}`} {...props}>
      {({ isAuthenticated }) => (isAuthenticated ? "Logout" : "Unauthorized")}
    </LogoutButton>
  );
}
