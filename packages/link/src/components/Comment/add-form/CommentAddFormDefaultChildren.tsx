import { TextField } from "react-aria-components";
import * as CommentAddForm from "./CommentAddFormElements";

export function CommentAddFormDefaultChildren() {
  return (
    <>
      <TextField autoFocus>
        <CommentAddForm.TextInput />
      </TextField>

      <CommentAddForm.SubmitButton>Submit</CommentAddForm.SubmitButton>

      <CommentAddForm.ErrorMessage />
    </>
  );
}
