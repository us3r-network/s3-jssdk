import {
  UserTagAddForm as UserTagAddFormRoot,
  UserTagAddFormProps,
} from "@us3r-network/profile";
import styles from "./UserTagAddForm.module.css";

const UserTagAddForm = ({ className = "", ...props }: UserTagAddFormProps) => {
  return (
    <UserTagAddFormRoot
      className={`${styles.UserTagAddForm} ${className}`}
      {...props}
    >
      <UserTagAddFormRoot.TagInput className={styles.TagInput} />

      <UserTagAddFormRoot.SubmitButton className={styles.SubmitButton}>
        Submit
      </UserTagAddFormRoot.SubmitButton>

      <UserTagAddFormRoot.ErrorMessage className={styles.ErrorMessage} />
    </UserTagAddFormRoot>
  );
};

export default UserTagAddForm;
