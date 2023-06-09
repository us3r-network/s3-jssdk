import { CommentAddForm, CommentAddFormProps } from "@us3r-network/link";
import LoadingSpokes from "../../common/loading/LoadingSpokes";
import styles from "./CommentAddForm.module.css";

export default function ({ className = "", ...props }: CommentAddFormProps) {
  return (
    <CommentAddForm
      className={`${styles.CommentAddForm} ${className}`}
      {...props}
    >
      <div className={styles.FormBox}>
        <CommentAddForm.TextInput className={styles.TextInput} />
        <CommentAddForm.SubmitButton className={styles.SubmitButton}>
          {({ isCommenting }) => {
            if (isCommenting) {
              return <LoadingSpokes className={styles.LoadingSpokes} />;
            }
            return <span>Comment</span>;
          }}
        </CommentAddForm.SubmitButton>
      </div>
      <CommentAddForm.ErrorMessage className={styles.ErrorMessage} />
    </CommentAddForm>
  );
}
