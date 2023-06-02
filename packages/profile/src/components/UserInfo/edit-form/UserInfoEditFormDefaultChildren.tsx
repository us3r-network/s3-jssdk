import { Label, TextField } from "react-aria-components";
import * as UserInfoEditForm from "./UserInfoEditFormElements";

export function UserInfoEditFormDefaultChildren() {
  return (
    <>
      <UserInfoEditForm.AvatarField />

      <TextField>
        <Label>Name</Label>
        <UserInfoEditForm.NameInput />
      </TextField>

      <TextField>
        <Label htmlFor="bio-textarea">Bio</Label>
        <UserInfoEditForm.BioTextArea id="bio-textarea" />
      </TextField>

      <UserInfoEditForm.SubmitButton>Submit</UserInfoEditForm.SubmitButton>

      <UserInfoEditForm.ErrorMessage />
    </>
  );
}
