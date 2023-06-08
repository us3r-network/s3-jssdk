import {
  UserWalletAddForm as UserWalletAddFormRoot,
  UserWalletAddFormProps,
} from "@us3r-network/profile";
import styles from "./UserWalletAddForm.module.css";

const UserWalletAddForm = ({
  className = "",
  ...props
}: UserWalletAddFormProps) => {
  return (
    <UserWalletAddFormRoot
      className={`${styles.UserWalletAddForm} ${className}`}
      {...props}
    >
      <UserWalletAddFormRoot.AddressInput className={styles.AddressInput} />

      <UserWalletAddFormRoot.SubmitButton className={styles.SubmitButton}>
        Submit
      </UserWalletAddFormRoot.SubmitButton>

      <UserWalletAddFormRoot.ErrorMessage className={styles.ErrorMessage} />
    </UserWalletAddFormRoot>
  );
};

export default UserWalletAddForm;
