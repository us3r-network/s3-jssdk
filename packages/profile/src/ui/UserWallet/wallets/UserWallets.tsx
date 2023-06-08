import {
  UserWallets as UserWalletsRoot,
  UserWalletsProps,
} from "@us3r-network/profile";
import { useCallback, useEffect, useState } from "react";
import UserWalletAddForm from "../add-form/UserWalletAddForm";
import ModalBase from "../../common/modal/ModalBase";
import LoadingSpokes from "../../common/loading/LoadingSpokes";
import { ReactComponent as AddIcon } from "@material-design-icons/svg/outlined/add.svg";
import { ReactComponent as CopyIcon } from "@material-design-icons/svg/outlined/content_copy.svg";
import { ReactComponent as DeleteIcon } from "@material-design-icons/svg/outlined/delete.svg";
import styles from "./UserWallets.module.css";
import { Heading } from "react-aria-components";

const UserWallets = ({ className = "", ...props }: UserWalletsProps) => {
  const [isOpenForm, setIsOpenForm] = useState(false);

  return (
    <UserWalletsRoot
      className={`${styles.UserWallets} ${className}`}
      {...props}
    >
      {({ isLoading, isLoginUser, wallets }) => {
        return (
          <>
            <Heading className={styles.Heading}>
              <span className={styles.CountBox}>
                Wallets (<UserWalletsRoot.Count />)
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
                <UserWalletsRoot.List className={styles.List}>
                  {(item) => (
                    <UserWalletsRoot.Item
                      className={styles.Item}
                      key={item.address}
                      value={item}
                    >
                      <div className={styles.ItemText}>
                        <UserWalletsRoot.Address className={styles.Address} />
                        <UserWalletsRoot.Network className={styles.Network} />
                      </div>
                      <div className={styles.ItemAction}>
                        <UserWalletsRoot.Delete className={styles.Delete}>
                          <DeleteIcon className={styles.DeleteIcon} />
                        </UserWalletsRoot.Delete>
                        <UserWalletsRoot.Copy
                          className={styles.Copy}
                          onCopied={() => {
                            alert("Copied!");
                          }}
                        >
                          <CopyIcon className={styles.CopyIcon} />
                        </UserWalletsRoot.Copy>
                      </div>
                    </UserWalletsRoot.Item>
                  )}
                </UserWalletsRoot.List>
              );
            })()}

            {(() => {
              if (!isLoginUser) return;
              return (
                <ModalBase
                  title="Add New Wallet"
                  isOpen={isOpenForm}
                  onOpenChange={setIsOpenForm}
                >
                  <UserWalletAddForm
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
    </UserWalletsRoot>
  );
};

export default UserWallets;
