import { CommentAddForm, CommentAddFormProps } from "@us3r-network/link";
import styles from "./CommentAddForm.module.css";

export default function ({ className = "", ...props }: CommentAddFormProps) {
  return (
    <CommentAddForm
      className={`${styles.CommentAddForm} ${className}`}
      {...props}
    >
      <div className={styles.FormBox}>
        <CommentAddForm.TextInput className={styles.TextInput} />
        <CommentAddForm.SubmitButton className={styles.SubmitButton} />
      </div>
      <CommentAddForm.ErrorMessage className={styles.ErrorMessage} />
    </CommentAddForm>
  );
}
