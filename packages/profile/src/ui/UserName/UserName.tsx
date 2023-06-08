import { UserName as UserNameRoot, UserNameProps } from "@us3r-network/profile";
import styles from "./UserName.module.css";

const UserName = ({ className = "", ...props }: UserNameProps) => {
  return (
    <UserNameRoot className={`${styles.UserName} ${className}`} {...props}>
      {({ isLoading, username }) => (isLoading ? "" : username)}
    </UserNameRoot>
  );
};

export default UserName;
