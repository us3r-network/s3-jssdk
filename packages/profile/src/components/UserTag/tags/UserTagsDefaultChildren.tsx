import { useState } from "react";
import * as UserTags from "./UserTagsElements";
import { Button, Heading, Item, Modal, TextField } from "react-aria-components";
import { UserTagAddForm } from "../add-form/UserTagAddForm";
import { useUserTagsState } from "./UserTagsContext";
import AddSvg from "@material-design-icons/svg/outlined/add.svg";

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
        {(item) => <Item key={item.tag}>{item.tag}</Item>}
      </UserTags.List>
      {isLoginUser && (
        <Modal isOpen={isOpenEdit} onOpenChange={setIsOpenEdit}>
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
        </Modal>
      )}
    </>
  );
}
