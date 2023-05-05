import { useState } from "react";
import * as UserInfo from "./UserInfoElements";
import {
  Button,
  Heading,
  Label,
  Modal,
  TextField,
} from "react-aria-components";
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
      {isLoginUser && (
        <Modal data-modal="" isOpen={isOpenEdit} onOpenChange={setIsOpenEdit}>
          <Heading data-heading="">Edit Info</Heading>
          <UserInfoEditForm>
            {({ disabled }) => {
              return (
                <>
                  <UserInfoEditForm.AvatarPreview />

                  <TextField autoFocus data-field="">
                    <Label data-label="">Select Image</Label>
                    <UserInfoEditForm.AvatarUploadInput />
                  </TextField>

                  <TextField data-field="">
                    <Label data-label="">Name</Label>
                    <UserInfoEditForm.NameInput />
                  </TextField>

                  <TextField data-field="">
                    <Label htmlFor="bio-textarea" data-label="">
                      Bio
                    </Label>
                    <UserInfoEditForm.BioTextArea id="bio-textarea" />
                  </TextField>

                  <section data-btns="">
                    <Button
                      data-cancel-button=""
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
                  </section>

                  <UserInfoEditForm.ErrorMessage />
                </>
              );
            }}
          </UserInfoEditForm>
        </Modal>
      )}
    </>
  );
}
