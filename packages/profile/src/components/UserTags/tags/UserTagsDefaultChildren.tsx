import { useState } from "react";
import * as UserTags from "./UserTagsElements";
import { Button, Heading, Item, Modal, TextField } from "react-aria-components";
import { UserTagsAddForm } from "../add-form/UserTagsAddForm";
import { useUserTagsState } from "./UserTagsContext";
import PlusIcon from "../../common/icons/PlusIcon";

export function UserTagsDefaultChildren() {
  const { loading, isLoginUser } = useUserTagsState();
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  return loading ? (
    <>loading ...</>
  ) : (
    <>
      <Heading data-tags-heading="">
        <span data-tags-count>
          Tags(
          <UserTags.Count />)
        </span>
        {isLoginUser && (
          <Button
            data-tags-create-button
            onPress={() => {
              setIsOpenEdit(true);
            }}
          >
            <PlusIcon />
          </Button>
        )}
      </Heading>
      <UserTags.List>
        {(item) => <Item key={item.tag}>{item.tag}</Item>}
      </UserTags.List>
      {isLoginUser && (
        <Modal data-modal="" isOpen={isOpenEdit} onOpenChange={setIsOpenEdit}>
          <Heading data-heading="">Add New Tag</Heading>
          <UserTagsAddForm
            onSuccessfullySubmit={() => {
              setIsOpenEdit(false);
            }}
          >
            <TextField autoFocus>
              <UserTagsAddForm.TagInput />
            </TextField>

            <UserTagsAddForm.SubmitButton>Submit</UserTagsAddForm.SubmitButton>

            <UserTagsAddForm.ErrorMessage />
          </UserTagsAddForm>
        </Modal>
      )}
    </>
  );
}
