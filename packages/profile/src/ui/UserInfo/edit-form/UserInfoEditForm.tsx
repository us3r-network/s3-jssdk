import { UserInfoEditForm, UserInfoEditFormProps } from "@us3r-network/profile";
import { Label } from "react-aria-components";
import LoadingSpokes from "../../common/loading/LoadingSpokes";
import styles from "./UserInfoEditForm.module.css";

export default function <T>({
  className = "",
  ...props
}: UserInfoEditFormProps<T>) {
  return (
    <UserInfoEditForm
      className={`${styles.UserInfoEditForm} ${className}`}
      {...props}
    >
      {({ avatarUploadOpts }) => {
        return (
          <>
            <UserInfoEditForm.AvatarField className={styles.AvatarField}>
              {({ isLoading, isUploadingAvatar }) => {
                if (isLoading || isUploadingAvatar) {
                  return (
                    <LoadingSpokes className={styles.AvatarLoadingSpokes} />
                  );
                }
                if (avatarUploadOpts) {
                  return (
                    <>
                      <Label>
                        <UserInfoEditForm.AvatarPreviewImg
                          className={styles.AvatarPreviewImg}
                        />
                      </Label>
                      <UserInfoEditForm.AvatarUploadInput
                        className={styles.AvatarUploadInput}
                      />
                    </>
                  );
                }
                return (
                  <UserInfoEditForm.AvatarPreviewImg
                    className={styles.AvatarPreviewImg}
                  />
                );
              }}
            </UserInfoEditForm.AvatarField>
            <UserInfoEditForm.NameInput className={styles.NameInput} />
            <UserInfoEditForm.BioTextArea className={styles.BioTextArea} />
            <UserInfoEditForm.SubmitButton className={styles.SubmitButton}>
              Submit
            </UserInfoEditForm.SubmitButton>
            <UserInfoEditForm.ErrorMessage className={styles.ErrorMessage} />
          </>
        );
      }}
    </UserInfoEditForm>
  );
}
