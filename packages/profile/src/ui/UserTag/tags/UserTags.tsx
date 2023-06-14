import { UserTags, UserTagsProps } from "@us3r-network/profile";
import { useState } from "react";
import UserTagAddForm from "../add-form/UserTagAddForm";
import ModalBase from "../../common/modal/ModalBase";
import LoadingSpokes from "../../common/loading/LoadingSpokes";
import { ReactComponent as AddIcon } from "@material-design-icons/svg/outlined/add.svg";
import styles from "./UserTags.module.css";
import { Heading } from "react-aria-components";

export default function ({ className = "", ...props }: UserTagsProps) {
  const [isOpenForm, setIsOpenForm] = useState(false);
  return (
    <UserTags className={`${styles.UserTags} ${className}`} {...props}>
      {({ isLoading, isLoginUser }) => {
        return (
          <>
            <Heading className={styles.Heading}>
              <span className={styles.CountBox}>
                Tags (<UserTags.Count />)
              </span>
              {isLoginUser && (
                <span
                  onClick={() => {
                    setIsOpenForm(true);
                  }}
                >
                  <AddIcon className={styles.AddIcon} />
                </span>
              )}
            </Heading>

            {(() => {
              if (isLoading) {
                return <LoadingSpokes className={styles.LoadingSpokes} />;
              }
              return (
                <UserTags.List className={styles.List}>
                  {(item) => (
                    <UserTags.Item
                      key={item.tag}
                      value={item}
                      className={styles.Item}
                    />
                  )}
                </UserTags.List>
              );
            })()}

            {(() => {
              if (!isLoginUser) return;
              return (
                <ModalBase
                  title="Add New Tag"
                  isOpen={isOpenForm}
                  onOpenChange={setIsOpenForm}
                >
                  <UserTagAddForm
                    onSuccessfullySubmit={() => {
                      setIsOpenForm(false);
                    }}
                  />
                </ModalBase>
              );
            })()}
          </>
        );
      }}
    </UserTags>
  );
}
