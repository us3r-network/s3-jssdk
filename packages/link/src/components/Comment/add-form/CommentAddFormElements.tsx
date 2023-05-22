import { Button, ButtonProps, Input, InputProps } from "react-aria-components";
import { HTMLAttributes } from "react";
import { useCommentAddFormState } from "./CommentAddFormContext";
import { ChildrenRenderProps, childrenRender } from "../../../utils/props";

export function TextInput(props: InputProps) {
  const { text, setText, isDisabled } = useCommentAddFormState();
  return (
    <Input
      data-state-element="TextInput"
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
      data-state-element="SubmitButton"
      onPress={submitComment}
      isDisabled={isDisabled}
      {...props}
    />
  );
}

export function ErrorMessage({
  children,
  ...props
}: ChildrenRenderProps<
  HTMLAttributes<HTMLSpanElement>,
  {
    errMsg: string;
  }
>) {
  const { errMsg } = useCommentAddFormState();
  return (
    <span data-state-element="ErrorMessage" {...props}>
      {childrenRender(children, { errMsg }, errMsg)}
    </span>
  );
}
