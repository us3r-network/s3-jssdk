import { TextField } from "react-aria-components";
import * as UserWalletsAddForm from "./UserWalletsAddFormElements";

export function UserWalletsAddFormDefaultChildren() {
  return (
    <>
      <TextField autoFocus>
        <UserWalletsAddForm.AddressInput />
      </TextField>

      <UserWalletsAddForm.SubmitButton>Submit</UserWalletsAddForm.SubmitButton>

      <UserWalletsAddForm.ErrorMessage />
    </>
  );
}
