import {
  UserInfo as UserInfoRoot,
  UserInfoProps,
  AvatarUploadOpts,
} from "@us3r-network/profile";
import { useState } from "react";
import UserInfoEditForm from "../edit-form/UserInfoEditForm";
import ModalBase from "../../common/modal/ModalBase";
import LoadingSpokes from "../../common/loading/LoadingSpokes";
import styles from "./UserInfo.module.css";

const UserInfo = <T,>({
  className = "",
  avatarUploadOpts,
  ...props
}: UserInfoProps<T> & {
  avatarUploadOpts?: AvatarUploadOpts<T>;
}) => {
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  return (
    <UserInfoRoot className={`${styles.UserInfo} ${className}`} {...props}>
      {({ isLoading, isLoginUser }) => {
        if (isLoading) {
          return <LoadingSpokes className={styles.LoadingSpokes} />;
        }
        return (
          <>
            <UserInfoRoot.Avatar
              className={styles.Avatar}
              onClick={() => {
                if (isLoginUser) {
                  setIsOpenEdit(true);
                }
              }}
            >
              {({ avatarSrc }) => (
                <img className={styles.AvatarImg} src={avatarSrc} />
              )}
            </UserInfoRoot.Avatar>
            <UserInfoRoot.Name className={styles.Name} />
            <UserInfoRoot.Bio className={styles.Bio} />
            {(() => {
              if (!isLoginUser) return;
              if (!avatarUploadOpts) {
                throw new Error("avatarUploadOpts is required");
              }
              return (
                <ModalBase
                  title="Edit Info"
                  isOpen={isOpenEdit}
                  onOpenChange={setIsOpenEdit}
                >
                  <UserInfoEditForm
                    avatarUploadOpts={avatarUploadOpts}
                    onSuccessfullySubmit={() => {
                      setIsOpenEdit(false);
                    }}
                  />
                </ModalBase>
              );
            })()}
          </>
        );
      }}
    </UserInfoRoot>
  );
};

export default UserInfo;
