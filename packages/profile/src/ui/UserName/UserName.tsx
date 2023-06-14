import { UserName, UserNameProps } from "@us3r-network/profile";
import styles from "./UserName.module.css";

export default function ({ className = "", ...props }: UserNameProps) {
  return (
    <UserName className={`${styles.UserName} ${className}`} {...props}>
      {({ isLoading, username }) => (isLoading ? "" : username)}
    </UserName>
  );
}
