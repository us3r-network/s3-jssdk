import { Button, Heading } from "react-aria-components";
import * as UserInfoEditForm from "./UserInfoEditFormElements";

export function UserInfoEditFormDefaultChildren() {
  return (
    <>
      <Heading>Edit Info</Heading>

      <UserInfoEditForm.AvatarPreview />

      <UserInfoEditForm.FormField autoFocus>
        <UserInfoEditForm.FormLabel>Select Image</UserInfoEditForm.FormLabel>
        <UserInfoEditForm.AvatarUploadInput />
      </UserInfoEditForm.FormField>

      <UserInfoEditForm.FormField>
        <UserInfoEditForm.FormLabel>Name</UserInfoEditForm.FormLabel>
        <UserInfoEditForm.NameInput />
      </UserInfoEditForm.FormField>

      <UserInfoEditForm.FormField>
        <UserInfoEditForm.FormLabel>Bio</UserInfoEditForm.FormLabel>
        <UserInfoEditForm.BioInput />
      </UserInfoEditForm.FormField>

      <UserInfoEditForm.SubmitButton>Submit</UserInfoEditForm.SubmitButton>

      <UserInfoEditForm.ErrorMessage />
    </>
  );
}
