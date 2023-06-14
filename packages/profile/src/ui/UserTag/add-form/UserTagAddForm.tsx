import { UserTagAddForm, UserTagAddFormProps } from "@us3r-network/profile";
import styles from "./UserTagAddForm.module.css";

export default function ({ className = "", ...props }: UserTagAddFormProps) {
  return (
    <UserTagAddForm
      className={`${styles.UserTagAddForm} ${className}`}
      {...props}
    >
      <UserTagAddForm.TagInput className={styles.TagInput} />

      <UserTagAddForm.SubmitButton className={styles.SubmitButton}>
        Submit
      </UserTagAddForm.SubmitButton>

      <UserTagAddForm.ErrorMessage className={styles.ErrorMessage} />
    </UserTagAddForm>
  );
}
