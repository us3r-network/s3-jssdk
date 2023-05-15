import { TextField } from "react-aria-components";
import * as UserWalletAddForm from "./UserWalletAddFormElements";

export function UserWalletAddFormDefaultChildren() {
  return (
    <>
      <TextField autoFocus>
        <UserWalletAddForm.AddressInput />
      </TextField>

      <UserWalletAddForm.SubmitButton>Submit</UserWalletAddForm.SubmitButton>

      <UserWalletAddForm.ErrorMessage />
    </>
  );
}
