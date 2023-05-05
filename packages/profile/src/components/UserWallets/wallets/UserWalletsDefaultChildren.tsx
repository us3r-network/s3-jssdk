import { useState } from "react";
import * as UserWallets from "./UserWalletsElements";
import { Button, Heading, Modal, TextField } from "react-aria-components";
import { UserWalletsAddForm } from "../add-form/UserWalletsAddForm";
import { useUserWalletsState } from "./UserWalletsContext";
import PlusIcon from "../../common/icons/PlusIcon";
import CopyIcon from "../../common/icons/CopyIcon";
import DeleteIcon from "../../common/icons/DeleteIcon";

export function UserWalletsDefaultChildren() {
  const { loading, isLoginUser } = useUserWalletsState();
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  return loading ? (
    <>loading ...</>
  ) : (
    <>
      <Heading data-wallets-heading="">
        <span data-wallets-count>
          Wallets(
          <UserWallets.Count />)
        </span>
        {isLoginUser && (
          <Button
            data-wallets-create-button
            onPress={() => {
              setIsOpenEdit(true);
            }}
          >
            <PlusIcon />
          </Button>
        )}
      </Heading>
      <UserWallets.List>
        {(item) => (
          <UserWallets.Item value={item} key={item.address}>
            <UserWallets.Address />
            <UserWallets.Network />
            <UserWallets.Delete>
              <DeleteIcon />
            </UserWallets.Delete>
            <UserWallets.Copy
              onCopied={() => {
                alert("copied");
              }}
            >
              <CopyIcon />
            </UserWallets.Copy>
          </UserWallets.Item>
        )}
      </UserWallets.List>
      {isLoginUser && (
        <Modal data-modal="" isOpen={isOpenEdit} onOpenChange={setIsOpenEdit}>
          <Heading data-heading="">Add New Wallet</Heading>
          <UserWalletsAddForm
            onSuccessfullySubmit={() => {
              setIsOpenEdit(false);
            }}
          >
            <TextField autoFocus>
              <UserWalletsAddForm.AddressInput />
            </TextField>

            <UserWalletsAddForm.SubmitButton>
              Submit
            </UserWalletsAddForm.SubmitButton>

            <UserWalletsAddForm.ErrorMessage />
          </UserWalletsAddForm>
        </Modal>
      )}
    </>
  );
}
