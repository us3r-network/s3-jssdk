import {
  UserInfoEditForm as UserInfoEditFormRoot,
  UserInfoEditFormProps,
} from "@us3r-network/profile";
import { Label } from "react-aria-components";
import LoadingSpokes from "../../common/loading/LoadingSpokes";
import styles from "./UserInfoEditForm.module.css";

const UserInfoEditForm = <T,>({
  className = "",
  ...props
}: UserInfoEditFormProps<T>) => {
  return (
    <UserInfoEditFormRoot
      className={`${styles.UserInfoEditForm} ${className}`}
      {...props}
    >
      <UserInfoEditFormRoot.AvatarField className={styles.AvatarField}>
        {({ isLoading, isUploadingAvatar }) => {
          return isLoading || isUploadingAvatar ? (
            <LoadingSpokes className={styles.AvatarLoadingSpokes} />
          ) : (
            <>
              <Label>
                <UserInfoEditFormRoot.AvatarPreviewImg
                  className={styles.AvatarPreviewImg}
                />
              </Label>
              <UserInfoEditFormRoot.AvatarUploadInput
                className={styles.AvatarUploadInput}
              />
            </>
          );
        }}
      </UserInfoEditFormRoot.AvatarField>

      <UserInfoEditFormRoot.NameInput className={styles.NameInput} />

      <UserInfoEditFormRoot.BioTextArea className={styles.BioTextArea} />

      <UserInfoEditFormRoot.SubmitButton className={styles.SubmitButton}>
        Submit
      </UserInfoEditFormRoot.SubmitButton>

      <UserInfoEditFormRoot.ErrorMessage className={styles.ErrorMessage} />
    </UserInfoEditFormRoot>
  );
};

export default UserInfoEditForm;
