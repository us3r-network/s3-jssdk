import { ScoreForm, ScoreFormProps } from "@us3r-network/link";
import { UserAvatar } from "@us3r-network/profile";
import RatingStarSelect from "../../common/rating-star/RatingStarSelect";
import styles from "./ScoreForm.module.css";

export default function ({ className = "", ...props }: ScoreFormProps) {
  return (
    <ScoreForm className={`${styles.ScoreForm} ${className}`} {...props}>
      <UserAvatar className={styles.UserAvatar} />
      <ScoreForm.ScoreSelectField>
        {({ value, setValue, isDisabled }) => (
          <RatingStarSelect
            value={value}
            onChange={setValue}
            isDisabled={isDisabled}
          />
        )}
      </ScoreForm.ScoreSelectField>
      <ScoreForm.CommentTextarea className={styles.CommentTextarea} />
      <ScoreForm.SubmitButton className={styles.SubmitButton} />
      <ScoreForm.ErrorMessage className={styles.ErrorMessage} />
    </ScoreForm>
  );
}
