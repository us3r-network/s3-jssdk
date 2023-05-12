import { useState } from "react";
import * as UserInfo from "./UserInfoElements";
import {
  Button,
  Dialog,
  Heading,
  Label,
  Modal,
  TextField,
} from "react-aria-components";
import { UserInfoEditForm } from "../edit-form/UserInfoEditForm";
import { useUserInfoState } from "./UserInfoContext";

export function UserInfoDefaultChildren() {
  const { isLoading, isLoginUser } = useUserInfoState();
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  return isLoading ? (
    <>loading ...</>
  ) : (
    <>
      <section
        onClick={() => {
          if (isLoginUser) {
            setIsOpenEdit(true);
          }
        }}
      >
        <UserInfo.Avatar />
      </section>
      <section>
        <UserInfo.Name />
      </section>
      <section>
        <UserInfo.Bio />
      </section>
      {isLoginUser && (
        <Modal isOpen={isOpenEdit} onOpenChange={setIsOpenEdit}>
          <Dialog>
            <Heading>Edit Info</Heading>
            <UserInfoEditForm>
              {({ isDisabled }) => {
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

                    <section data-btns="">
                      <Button
                        data-cancel-button=""
                        isDisabled={isDisabled}
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
          </Dialog>
        </Modal>
      )}
    </>
  );
}
