import { useState } from "react";
import * as UserInfo from "./UserInfoElements";
import { Button, Heading, Modal } from "react-aria-components";
import { UserInfoEditForm } from "../edit-form/UserInfoEditForm";
import { useUserInfoState } from "./UserInfoContext";

export function UserInfoDefaultChildren() {
  const { loading, isLoginUser } = useUserInfoState();
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  return loading ? (
    <>loading ...</>
  ) : (
    <>
      <section
        data-avatar-box=""
        onClick={() => {
          if (isLoginUser) {
            setIsOpenEdit(true);
          }
        }}
      >
        <UserInfo.Avatar />
      </section>
      <section data-name-box="">
        <UserInfo.Name />
      </section>
      <section data-bio-box="">
        <UserInfo.Bio />
      </section>
      <Modal isOpen={isOpenEdit} onOpenChange={setIsOpenEdit}>
        <UserInfoEditForm>
          {({ disabled }) => {
            return (
              <>
                <Heading>Edit Info</Heading>

                <UserInfoEditForm.AvatarPreview />

                <UserInfoEditForm.FormField autoFocus>
                  <UserInfoEditForm.FormLabel>
                    Select Image
                  </UserInfoEditForm.FormLabel>
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

                <Button
                  isDisabled={disabled}
                  onPress={() => {
                    setIsOpenEdit(false);
                  }}
                >
                  Cancel
                </Button>
                <UserInfoEditForm.SubmitButton>
                  Submit
                </UserInfoEditForm.SubmitButton>

                <UserInfoEditForm.ErrorMessage />
              </>
            );
          }}
        </UserInfoEditForm>
      </Modal>
    </>
  );
}
