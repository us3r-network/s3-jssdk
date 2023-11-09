import { useState } from "react";
import UserTags from "./UserTagsElements";
import {
  Button,
  Dialog,
  Heading,
  Modal,
  TextField,
} from "react-aria-components";
import { UserTagAddForm } from "../add-form/UserTagAddForm";
import { useUserTagsState } from "./UserTagsContext";
import { ReactComponent as AddSvg } from "@material-design-icons/svg/outlined/add.svg";

export function UserTagsDefaultChildren() {
  const { isLoading, isLoginUser } = useUserTagsState();
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  return isLoading ? (
    <>loading ...</>
  ) : (
    <>
      <Heading>
        <span>
          Tags(
          <UserTags.Count />)
        </span>
        {isLoginUser && (
          <Button
            onPress={() => {
              setIsOpenEdit(true);
            }}
          >
            <AddSvg />
          </Button>
        )}
      </Heading>
      <UserTags.List>
        {(item) => <UserTags.Item value={item} key={item.tag} />}
      </UserTags.List>
      {isLoginUser && (
        <Modal isOpen={isOpenEdit} onOpenChange={setIsOpenEdit}>
          <Dialog>
            <Heading>Add New Tag</Heading>
            <UserTagAddForm
              onSuccessfullySubmit={() => {
                setIsOpenEdit(false);
              }}
            >
              <TextField autoFocus>
                <UserTagAddForm.TagInput />
              </TextField>

              <UserTagAddForm.SubmitButton>Submit</UserTagAddForm.SubmitButton>

              <UserTagAddForm.ErrorMessage />
            </UserTagAddForm>
          </Dialog>
        </Modal>
      )}
    </>
  );
}
