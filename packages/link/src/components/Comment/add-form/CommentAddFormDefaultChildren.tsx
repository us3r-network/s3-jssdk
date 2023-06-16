import CommentAddForm from "./CommentAddFormElements";

export function CommentAddFormDefaultChildren() {
  return (
    <>
      <div data-layout-element="FormBox">
        <CommentAddForm.TextInput />
        <CommentAddForm.SubmitButton />
      </div>
      <CommentAddForm.ErrorMessage />
    </>
  );
}
