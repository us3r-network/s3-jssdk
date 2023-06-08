import { UserTags as UserTagsRoot, UserTagsProps } from "@us3r-network/profile";
import { useState } from "react";
import UserTagAddForm from "../add-form/UserTagAddForm";
import ModalBase from "../../common/modal/ModalBase";
import LoadingSpokes from "../../common/loading/LoadingSpokes";
import { ReactComponent as AddIcon } from "@material-design-icons/svg/outlined/add.svg";
import styles from "./UserTags.module.css";
import { Heading } from "react-aria-components";

const UserTags = ({ className = "", ...props }: UserTagsProps) => {
  const [isOpenForm, setIsOpenForm] = useState(false);
  return (
    <UserTagsRoot className={`${styles.UserTags} ${className}`} {...props}>
      {({ isLoading, isLoginUser }) => {
        return (
          <>
            <Heading className={styles.Heading}>
              <span className={styles.CountBox}>
                Tags (<UserTagsRoot.Count />)
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
                <UserTagsRoot.List className={styles.List}>
                  {(item) => (
                    <UserTagsRoot.Item
                      key={item.tag}
                      value={item}
                      className={styles.Item}
                    />
                  )}
                </UserTagsRoot.List>
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
    </UserTagsRoot>
  );
};

export default UserTags;
