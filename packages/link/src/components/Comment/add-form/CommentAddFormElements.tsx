import { Button, ButtonProps, Input, InputProps } from "react-aria-components";
import { HTMLAttributes } from "react";
import { useCommentAddFormState } from "./CommentAddFormContext";

export function TextInput(props: InputProps) {
  const { text, setText, isDisabled } = useCommentAddFormState();
  return (
    <Input
      data-text-input=""
      disabled={isDisabled}
      placeholder="text"
      value={text}
      onChange={(e) => {
        setText(e.target.value);
      }}
      {...props}
    />
  );
}

export function SubmitButton(props: ButtonProps) {
  const { isDisabled, submitComment } = useCommentAddFormState();
  return (
    <Button
      data-submit-button=""
      onPress={submitComment}
      isDisabled={isDisabled}
      {...props}
    />
  );
}

export function ErrorMessage(props: HTMLAttributes<HTMLSpanElement>) {
  const { errMsg } = useCommentAddFormState();
  return (
    <span data-error-message="" {...props}>
      {errMsg}
    </span>
  );
}
