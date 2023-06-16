import {
  UserInfo,
  UserInfoProps,
  AvatarUploadOpts,
} from "@us3r-network/profile";
import { useState } from "react";
import UserInfoEditForm from "../edit-form/UserInfoEditForm";
import ModalBase from "../../common/modal/ModalBase";
import LoadingSpokes from "../../common/loading/LoadingSpokes";
import styles from "./UserInfo.module.css";

export default function <T>({
  className = "",
  avatarUploadOpts,
  ...props
}: UserInfoProps<T> & {
  avatarUploadOpts?: AvatarUploadOpts<T>;
}) {
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  return (
    <UserInfo className={`${styles.UserInfo} ${className}`} {...props}>
      {({ isLoading, isLoginUser }) => {
        if (isLoading) {
          return <LoadingSpokes className={styles.LoadingSpokes} />;
        }
        return (
          <>
            <UserInfo.Avatar
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
            </UserInfo.Avatar>
            <UserInfo.Name className={styles.Name} />
            <UserInfo.Bio className={styles.Bio} />
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
    </UserInfo>
  );
}
