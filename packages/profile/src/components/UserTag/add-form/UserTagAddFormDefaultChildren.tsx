import { TextField } from "react-aria-components";
import UserTagAddForm from "./UserTagAddFormElements";

export function UserTagAddFormDefaultChildren() {
  return (
    <>
      <TextField autoFocus>
        <UserTagAddForm.TagInput />
      </TextField>

      <UserTagAddForm.SubmitButton>Submit</UserTagAddForm.SubmitButton>

      <UserTagAddForm.ErrorMessage />
    </>
  );
}
