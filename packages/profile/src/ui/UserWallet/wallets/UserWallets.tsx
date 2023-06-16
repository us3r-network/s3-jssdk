import { UserWallets, UserWalletsProps } from "@us3r-network/profile";
import { useState } from "react";
import UserWalletAddForm from "../add-form/UserWalletAddForm";
import ModalBase from "../../common/modal/ModalBase";
import LoadingSpokes from "../../common/loading/LoadingSpokes";
import { ReactComponent as AddIcon } from "@material-design-icons/svg/outlined/add.svg";
import { ReactComponent as CopyIcon } from "@material-design-icons/svg/outlined/content_copy.svg";
import { ReactComponent as DeleteIcon } from "@material-design-icons/svg/outlined/delete.svg";
import { Heading } from "react-aria-components";
import styles from "./UserWallets.module.css";

export default function ({ className = "", ...props }: UserWalletsProps) {
  const [isOpenForm, setIsOpenForm] = useState(false);

  return (
    <UserWallets className={`${styles.UserWallets} ${className}`} {...props}>
      {({ isLoading, isLoginUser }) => {
        return (
          <>
            <Heading className={styles.Heading}>
              <span className={styles.CountBox}>
                Wallets (<UserWallets.Count />)
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
                <UserWallets.List className={styles.List}>
                  {(item) => (
                    <UserWallets.Item
                      className={styles.Item}
                      key={item.address}
                      value={item}
                    >
                      <div className={styles.ItemText}>
                        <UserWallets.Address className={styles.Address} />
                        <UserWallets.Network className={styles.Network} />
                      </div>
                      <div className={styles.ItemAction}>
                        <UserWallets.Delete className={styles.Delete}>
                          <DeleteIcon className={styles.DeleteIcon} />
                        </UserWallets.Delete>
                        <UserWallets.Copy
                          className={styles.Copy}
                          onCopied={() => {
                            alert("Copied!");
                          }}
                        >
                          <CopyIcon className={styles.CopyIcon} />
                        </UserWallets.Copy>
                      </div>
                    </UserWallets.Item>
                  )}
                </UserWallets.List>
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
    </UserWallets>
  );
}
