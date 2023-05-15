import { useState } from "react";
import * as UserWallets from "./UserWalletsElements";
import {
  Button,
  Dialog,
  Heading,
  Modal,
  TextField,
} from "react-aria-components";
import { UserWalletAddForm } from "../add-form/UserWalletAddForm";
import { useUserWalletsState } from "./UserWalletsContext";

import AddSvg from "@material-design-icons/svg/outlined/add.svg";
import CopySvg from "@material-design-icons/svg/outlined/content_copy.svg";
import DeleteSvg from "@material-design-icons/svg/outlined/delete.svg";

export function UserWalletsDefaultChildren() {
  const { isLoading, isLoginUser } = useUserWalletsState();
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  return isLoading ? (
    <>loading ...</>
  ) : (
    <>
      <Heading>
        <span>
          Wallets(
          <UserWallets.Count />)
        </span>
        {isLoginUser && (
          <Button
            onPress={() => {
              setIsOpenEdit(true);
            }}
          >
            <AddSvg />
          </Button>
        )}
      </Heading>
      <UserWallets.List>
        {(item) => (
          <UserWallets.Item value={item} key={item.address}>
            <UserWallets.Address />
            <UserWallets.Network />
            <UserWallets.Delete>
              <DeleteSvg />
            </UserWallets.Delete>
            <UserWallets.Copy
              onCopied={() => {
                alert("copied");
              }}
            >
              <CopySvg />
            </UserWallets.Copy>
          </UserWallets.Item>
        )}
      </UserWallets.List>
      {isLoginUser && (
        <Modal isOpen={isOpenEdit} onOpenChange={setIsOpenEdit}>
          <Dialog>
            <Heading>Add New Wallet</Heading>
            <UserWalletAddForm
              onSuccessfullySubmit={() => {
                setIsOpenEdit(false);
              }}
            >
              <TextField autoFocus>
                <UserWalletAddForm.AddressInput />
              </TextField>

              <UserWalletAddForm.SubmitButton>
                Submit
              </UserWalletAddForm.SubmitButton>

              <UserWalletAddForm.ErrorMessage />
            </UserWalletAddForm>
          </Dialog>
        </Modal>
      )}
    </>
  );
}
