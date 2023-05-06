import { TextField } from "react-aria-components";
import * as UserTagsAddForm from "./UserTagsAddFormElements";

export function UserTagsAddFormDefaultChildren() {
  return (
    <>
      <TextField autoFocus>
        <UserTagsAddForm.TagInput />
      </TextField>

      <UserTagsAddForm.SubmitButton>Submit</UserTagsAddForm.SubmitButton>

      <UserTagsAddForm.ErrorMessage />
    </>
  );
}
