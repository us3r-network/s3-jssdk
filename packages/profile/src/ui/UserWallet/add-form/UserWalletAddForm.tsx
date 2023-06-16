import {
  UserWalletAddForm,
  UserWalletAddFormProps,
} from "@us3r-network/profile";
import styles from "./UserWalletAddForm.module.css";

export default function ({ className = "", ...props }: UserWalletAddFormProps) {
  return (
    <UserWalletAddForm
      className={`${styles.UserWalletAddForm} ${className}`}
      {...props}
    >
      <UserWalletAddForm.AddressInput className={styles.AddressInput} />

      <UserWalletAddForm.SubmitButton className={styles.SubmitButton}>
        Submit
      </UserWalletAddForm.SubmitButton>

      <UserWalletAddForm.ErrorMessage className={styles.ErrorMessage} />
    </UserWalletAddForm>
  );
}
