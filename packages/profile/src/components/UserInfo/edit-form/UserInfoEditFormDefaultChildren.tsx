import { Label, TextField } from "react-aria-components";
import * as UserInfoEditForm from "./UserInfoEditFormElements";

export function UserInfoEditFormDefaultChildren() {
  return (
    <>
      <UserInfoEditForm.AvatarPreview />

      <TextField autoFocus>
        <Label>Select Image</Label>
        <UserInfoEditForm.AvatarUploadInput />
      </TextField>

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
