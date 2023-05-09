import { TextField } from "react-aria-components";
import * as CommentAddForm from "./CommentAddFormElements";

export function CommentAddFormDefaultChildren() {
  return (
    <>
      <CommentAddForm.TextInput />
      <CommentAddForm.SubmitButton>Submit</CommentAddForm.SubmitButton>

      <CommentAddForm.ErrorMessage />
    </>
  );
}
